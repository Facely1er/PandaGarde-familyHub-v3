/**
 * RSS Alert Service for Child Privacy and Safety
 * Processes RSS feeds and converts them to child safety alerts
 */

import { childRssFeeds, severityKeywords, type ChildRSSFeed } from '../data/childRssFeeds';
import { childServiceCatalog } from '../data/childServiceCatalog';

export interface ChildSafetyAlert {
  id: string;
  title: string;
  description: string;
  link?: string;
  publishedDate: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'child-safety' | 'privacy' | 'data-breach' | 'parental-controls' | 'education';
  relatedServices: string[];
  isChildFocused: boolean;
}

class ChildRSSAlertService {
  private isProcessing: boolean = false;
  private lastProcessed: Date | null = null;
  private processInterval: NodeJS.Timeout | null = null;
  private readonly DEFAULT_INTERVAL = 3600000; // 1 hour
  private cache = new Map<string, { data: ChildSafetyAlert[]; timestamp: number }>();
  private cacheTimeout = 3600000; // 1 hour cache

  /**
   * Initialize the RSS alert service
   */
  initialize(intervalMs: number = this.DEFAULT_INTERVAL): void {
    try {
      if (typeof window === 'undefined') {return;}
      
      const isProduction = typeof window !== 'undefined' && 
                          (window.location.hostname.includes('pandagarde.com') || 
                           window.location.hostname.includes('vercel.app') ||
                           window.location.hostname.includes('netlify.app'));
      
      // In production, delay initialization to avoid CORS errors on page load
      // Only initialize when explicitly needed (e.g., when user visits alerts page)
      if (isProduction) {
        // Don't auto-initialize in production - let components initialize on demand
        return;
      }
      
      // Safely check for dev mode - use hostname check as primary method
      // This avoids issues with import.meta not being available in all contexts
      let isDevMode = false;
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        isDevMode = hostname === 'localhost' || 
                   hostname === '127.0.0.1' ||
                   hostname.startsWith('192.168.') ||
                   hostname.startsWith('10.') ||
                   hostname.includes('localhost');
        
        // Also check import.meta if available (Vite-specific)
        if (!isDevMode) {
          try {
            // @ts-expect-error - import.meta is available in Vite but TypeScript may not recognize it
            if (typeof import.meta !== 'undefined' && import.meta.env?.DEV === true) {
              isDevMode = true;
            }
          } catch {
            // Ignore if import.meta is not available
          }
        }
      }
      
      if (isDevMode) {
        console.log('[Child RSS Alert Service] Initializing...');
      }
      
      // Process feeds immediately on initialization (only in dev)
      this.processFeeds().catch(() => {
        // Silently handle errors
      });
      
      // Set up recurring processing
      this.processInterval = setInterval(() => {
        this.processFeeds().catch(() => {
          // Silently handle errors
        });
      }, intervalMs);
    } catch (error) {
      // Silently fail initialization to prevent breaking the app
      console.warn('[Child RSS Alert Service] Initialization failed:', error);
    }
  }

  /**
   * Stop automatic feed processing
   */
  stop(): void {
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = null;
    }
  }

  /**
   * Process all active RSS feeds
   */
  async processFeeds(): Promise<ChildSafetyAlert[]> {
    if (this.isProcessing) {
      return [];
    }

    this.isProcessing = true;
    const allAlerts: ChildSafetyAlert[] = [];

    try {
      const activeFeeds = childRssFeeds.filter(feed => feed.isActive);
      
      // Process feeds in parallel with Promise.allSettled to handle individual failures
      const feedPromises = activeFeeds.map(feed => 
        this.fetchAndProcessFeed(feed).catch(() => []) // Return empty array on error
      );
      
      const results = await Promise.allSettled(feedPromises);
      
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          allAlerts.push(...result.value);
        }
        // Errors are already handled in fetchAndProcessFeed, so we silently continue
      });

      this.lastProcessed = new Date();
      return allAlerts;
    } catch (error) {
      // This should rarely happen, but log if it does
      console.warn('[RSS Alert Service] Unexpected error processing feeds:', error);
      return allAlerts; // Return whatever we've collected so far
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Fetch and process a single RSS feed
   */
  private async fetchAndProcessFeed(feed: ChildRSSFeed): Promise<ChildSafetyAlert[]> {
    // Check cache
    const cached = this.cache.get(feed.id);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Use CORS proxy for RSS feeds (in production, use backend API)
      // Try multiple proxy options for better reliability
      const proxyUrls = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`,
        `https://corsproxy.io/?${encodeURIComponent(feed.url)}`
      ];
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      let response: Response | null = null;
      let lastError: Error | null = null;
      
      // Try each proxy URL until one works
      for (const proxyUrl of proxyUrls) {
        try {
          response = await fetch(proxyUrl, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json'
            },
            // Suppress CORS errors in console by using mode
            mode: 'cors',
            credentials: 'omit'
          });
          
          if (response.ok) {
            break; // Success, exit loop
          }
        } catch (err) {
          // Store error but continue to next proxy
          lastError = err instanceof Error ? err : new Error(String(err));
          // Silently continue to next proxy
          continue;
        }
      }
      
      clearTimeout(timeoutId);
      
      // If all proxies failed, throw the last error
      if (!response || !response.ok) {
        throw lastError || new Error(`HTTP ${response?.status || 'unknown'}: ${response?.statusText || 'Failed to fetch'}`);
      }

      const data = await response.json();
      
      if (!data.contents) {
        throw new Error('Invalid response format from proxy');
      }
      
      const xmlContent = data.contents;

        // Validate that we have content
        if (!xmlContent || typeof xmlContent !== 'string') {
          throw new Error('Invalid or empty XML content received from feed');
        }

        // Check if content looks like XML (basic validation)
        const trimmedContent = xmlContent.trim();
        if (!trimmedContent.startsWith('<?xml') && !trimmedContent.startsWith('<rss') && !trimmedContent.startsWith('<feed')) {
          throw new Error('Response does not appear to be valid RSS/XML format');
        }

        // Parse XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

        // Check for parsing errors
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
          const errorText = parseError.textContent || 'Unknown parsing error';
          // Extract first line of error for cleaner logging
          const firstLine = errorText.split('\n')[0];
          const errorMessage = firstLine ? firstLine.trim() : errorText.trim();
          throw new Error(`Failed to parse RSS XML: ${errorMessage}`);
        }

        // Extract items
        const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
          title: item.querySelector('title')?.textContent || '',
          description: item.querySelector('description')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
          guid: item.querySelector('guid')?.textContent || item.querySelector('link')?.textContent || ''
        }));

        if (items.length === 0) {
          // No items found, but not an error - just return empty
          return [];
        }

        // Convert to alerts, and and 
        const alerts: ChildSafetyAlert[] = items.map(item => {
          const severity = this.determineSeverity(item.title, item.description);
          const relatedServices = this.findRelatedServices(item.title, item.description, feed);

          return {
            id: item.guid || `${feed.id}-${Date.now()}-${Math.random()}`,
            title: item.title,
            description: item.description,
            link: item.link,
            publishedDate: item.pubDate,
            severity,
            category: feed.category,
            relatedServices,
            isChildFocused: true
          };
        });

        // Cache the result
        this.cache.set(feed.id, {
          data: alerts,
          timestamp: Date.now()
        });

        return alerts;
    } catch (error) {
      // Better error detection for network/CORS issues
      const isNetworkError = error instanceof TypeError && (
        error.message.includes('fetch') || 
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('network')
      );
      const isAbortError = error instanceof Error && error.name === 'AbortError';
      const isTimeoutError = error instanceof Error && (
        error.name === 'AbortError' || 
        error.message.includes('timeout') ||
        error.message.includes('aborted')
      );
      const isCorsError = error instanceof Error && (
        error.message.includes('CORS') ||
        error.message.includes('cross-origin') ||
        error.message.includes('Access-Control')
      );
      const isHttpError = error instanceof Error && error.message.includes('HTTP');
      
      const isExpectedError = isNetworkError || isAbortError || isTimeoutError || isCorsError;
      
      // Safely check for dev mode - use hostname check as primary method
      let isDevMode = false;
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        isDevMode = hostname === 'localhost' || 
                   hostname === '127.0.0.1' ||
                   hostname.startsWith('192.168.') ||
                   hostname.startsWith('10.') ||
                   hostname.includes('localhost');
        
        // Also check import.meta if available (Vite-specific)
        if (!isDevMode) {
          try {
            // @ts-expect-error - import.meta is available in Vite but TypeScript may not recognize it
            if (typeof import.meta !== 'undefined' && import.meta.env?.DEV === true) {
              isDevMode = true;
            }
          } catch {
            // Ignore if import.meta is not available
          }
        }
      }
      
      const isProduction = typeof window !== 'undefined' && 
                          (window.location.hostname.includes('pandagarde.com') || 
                           window.location.hostname.includes('vercel.app') ||
                           window.location.hostname.includes('netlify.app'));
      
      // In production, completely suppress CORS/network errors from console
      if (isProduction && isExpectedError) {
        // Silently fail and use cache - don't log anything
      } else if (isExpectedError) {
        // Network/CORS/timeout errors are expected - only log in dev mode
        if (isDevMode) {
          console.warn(`[RSS Alert Service] Unable to fetch feed "${feed.name}" (${feed.id}). This is expected if the CORS proxy is unavailable or the request timed out.`);
        }
      } else if (isHttpError) {
        // HTTP errors (4xx, 5xx) - log in dev, minimal log in production
        if (isDevMode) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.warn(`[RSS Alert Service] HTTP error for feed "${feed.name}" (${feed.id}): ${errorMessage}`);
        }
      } else {
        // Other errors (like parsing errors) should be logged with more context
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (isDevMode) {
          console.warn(`[RSS Alert Service] Error processing feed "${feed.name}" (${feed.id}): ${errorMessage}`);
        } else if (!isProduction) {
          // In non-production, only log unexpected errors briefly
          console.warn(`[RSS Alert Service] Unable to process feed "${feed.name}" - using cached data if available`);
        }
      }
      
      // Return cached data if available, otherwise empty array
      const cached = this.cache.get(feed.id);
      return cached ? cached.data : [];
    }
  }

  /**
   * Determine severity from title and description
   */
  private determineSeverity(title: string, description: string): 'critical' | 'high' | 'medium' | 'low' {
    const text = `${title} ${description}`.toLowerCase();

    if (severityKeywords.critical.some(keyword => text.includes(keyword))) {
      return 'critical';
    }
    if (severityKeywords.high.some(keyword => text.includes(keyword))) {
      return 'high';
    }
    if (severityKeywords.medium.some(keyword => text.includes(keyword))) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Find related child services from content
   */
  private findRelatedServices(title: string, description: string, feed: ChildRSSFeed): string[] {
    const text = `${title} ${description}`.toLowerCase();
    const related: string[] = [];

    // Check feed-specific keywords
    Object.entries(feed.serviceKeywords).forEach(([serviceId, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        related.push(serviceId);
      }
    });

    // Check service names
    childServiceCatalog.forEach(service => {
      if (text.includes(service.name.toLowerCase())) {
        if (!related.includes(service.id)) {
          related.push(service.id);
        }
      }
    });

    return related;
  }

  /**
   * Get status information
   */
  getStatus(): { isProcessing: boolean; lastProcessed: Date | null; isActive: boolean } {
    return {
      isProcessing: this.isProcessing,
      lastProcessed: this.lastProcessed,
      isActive: this.processInterval !== null
    };
  }
}

export const childRSSAlertService = new ChildRSSAlertService();

// Auto-initialize in browser (only in development)
// In production, components should initialize on-demand to avoid CORS errors
if (typeof window !== 'undefined') {
  try {
    const isProduction = window.location.hostname.includes('pandagarde.com') || 
                         window.location.hostname.includes('vercel.app') ||
                         window.location.hostname.includes('netlify.app');
    
    if (!isProduction) {
      // Only auto-initialize in development/localhost
      // Wrap in setTimeout to ensure it doesn't block page load
      setTimeout(() => {
        childRSSAlertService.initialize(3600000);
      }, 1000);
    }
  } catch (error) {
    // Silently fail auto-initialization to prevent breaking the app
    // Components can still initialize the service on-demand
  }
}


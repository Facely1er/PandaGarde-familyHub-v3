// Frontend-only mode - no database dependencies
// Mock types for compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase client stub; no DB in frontend-only mode
type Database = any

import { logger } from './logger'

// Frontend-only mode - all database operations are disabled
logger.debug('Running in frontend-only mode - database operations disabled', undefined, 'DB')

// Mock error handling for compatibility
const _handleDatabaseError = (operation: string, error: unknown) => {
  logger.debug(`Frontend-only mode: ${operation} would have failed`, error, 'DB')
  return null
}

// Mock database operation wrapper for compatibility
const _safeDbOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T | null> => {
  logger.debug(`Frontend-only mode: ${operationName} operation skipped`, undefined, 'DB')
  return null
}

// Type definitions for better type safety
type Tables = Database['public']['Tables']
type User = Tables['pandagarde_users']['Row']
type Activity = Tables['pandagarde_activities']['Row']
type Progress = Tables['pandagarde_progress']['Row']
type ContactSubmission = Tables['pandagarde_contact_submissions']['Row']
type NewsletterSubscriber = Tables['pandagarde_newsletter_subscribers']['Row']
type DownloadTracking = Tables['pandagarde_download_tracking']['Row']
type UserSession = Tables['pandagarde_user_sessions']['Row']

// User management functions - Frontend-only mode
export const userService = {
  // Get current user - always returns null in frontend-only mode
  async getCurrentUser(): Promise<User | null> {
    logger.debug('Frontend-only mode: getCurrentUser() - returning null', undefined, 'DB')
    return null
  },

  // Create or update user profile - disabled in frontend-only mode
  async upsertUser(userData: Partial<User>): Promise<User | null> {
    logger.debug('Frontend-only mode: upsertUser() - operation skipped', userData, 'DB')
    return null
  },

  // Update user profile - disabled in frontend-only mode
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    logger.debug('Frontend-only mode: updateUser() - operation skipped', { id, updates }, 'DB')
    return null
  }
}

// Activity management functions - Frontend-only mode
export const activityService = {
  // Get user activities - returns empty array in frontend-only mode
  async getUserActivities(userId: string): Promise<Activity[]> {
    logger.debug('Frontend-only mode: getUserActivities() - returning empty array', userId, 'DB')
    return []
  },

  // Create new activity - disabled in frontend-only mode
  async createActivity(activityData: Omit<Activity, 'id' | 'created_at'>): Promise<Activity | null> {
    logger.debug('Frontend-only mode: createActivity() - operation skipped', activityData, 'DB')
    return null
  },

  // Update activity - disabled in frontend-only mode
  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | null> {
    logger.debug('Frontend-only mode: updateActivity() - operation skipped', { id, updates }, 'DB')
    return null
  },

  // Mark activity as completed - disabled in frontend-only mode
  async completeActivity(id: string): Promise<Activity | null> {
    logger.debug('Frontend-only mode: completeActivity() - operation skipped', id, 'DB')
    return null
  }
}

// Progress tracking functions - Frontend-only mode
export const progressService = {
  // Get user progress - returns empty array in frontend-only mode
  async getUserProgress(userId: string): Promise<Progress[]> {
    logger.debug('Frontend-only mode: getUserProgress() - returning empty array', userId, 'DB')
    return []
  },

  // Save progress - disabled in frontend-only mode
  async saveProgress(_progressData: Omit<Progress, 'id' | 'created_at' | 'updated_at'>): Promise<Progress | null> {
    logger.debug('Frontend-only mode: saveProgress() - operation skipped', undefined, 'DB')
    return null
  }
}

// Contact form functions - Frontend-only mode
export const contactService = {
  // Submit contact form - logs submission in frontend-only mode
  async submitContactForm(_submission: Omit<ContactSubmission, 'id' | 'created_at' | 'status'>): Promise<ContactSubmission | null> {
    logger.debug('Frontend-only mode: contact form submission received', undefined, 'DB')
    // In a real frontend-only setup, you might want to send this to an external service
    return null
  },

  // Get contact submissions - returns empty array in frontend-only mode
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    logger.debug('Frontend-only mode: getContactSubmissions() - returning empty array', undefined, 'DB')
    return []
  }
}

// Newsletter functions - Supports both Supabase and frontend-only mode
export const newsletterService = {
  // Subscribe to newsletter
  async subscribe(email: string): Promise<NewsletterSubscriber | null> {
    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email address')
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Try Supabase first if available
    try {
      const { supabase, isSupabaseAvailable } = await import('./supabase')
      
      if (isSupabaseAvailable() && supabase) {
        // Check if email already exists
        const { data: existing } = await supabase
          .from('pandagarde_newsletter_subscribers')
          .select('id, subscribed')
          .eq('email', normalizedEmail)
          .maybeSingle()

        if (existing) {
          // If exists but unsubscribed, resubscribe
          if (!existing.subscribed) {
            const { data, error } = await supabase
              .from('pandagarde_newsletter_subscribers')
              .update({ 
                subscribed: true, 
                subscribed_at: new Date().toISOString(),
                unsubscribed_at: null 
              })
              .eq('id', existing.id)
              .select()
              .single()

            if (error) {throw error}
            return data
          }
          // Already subscribed - return existing record
          return existing as NewsletterSubscriber
        }

        // New subscription
        const { data, error } = await supabase
          .from('pandagarde_newsletter_subscribers')
          .insert({
            email: normalizedEmail,
            subscribed: true,
            subscribed_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) {throw error}
        return data
      }
    } catch (error) {
      logger.error('Supabase newsletter subscription error:', error)
      // Fall through to localStorage fallback
    }

    // Frontend-only mode: Use localStorage
    try {
      const subscriptions = JSON.parse(
        localStorage.getItem('pandagarde_newsletter_subscriptions') || '[]'
      )
      
      const existingIndex = subscriptions.findIndex(
        (s: NewsletterSubscriber) => s.email.toLowerCase() === normalizedEmail
      )

      const subscriptionData: NewsletterSubscriber = {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        subscribed: true,
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null
      }

      if (existingIndex >= 0) {
        // Update existing
        subscriptions[existingIndex] = {
          ...subscriptions[existingIndex],
          ...subscriptionData,
          subscribed: true,
          unsubscribed_at: null
        }
      } else {
        // Add new
        subscriptions.push(subscriptionData)
      }

      localStorage.setItem(
        'pandagarde_newsletter_subscriptions',
        JSON.stringify(subscriptions)
      )
      
      logger.debug('Frontend-only mode: Newsletter subscription saved', undefined, 'DB')
      return subscriptionData
    } catch (error) {
      logger.error('LocalStorage newsletter subscription error:', error)
      throw new Error('Failed to save newsletter subscription')
    }
  },

  // Unsubscribe from newsletter
  async unsubscribe(email: string): Promise<boolean> {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email address')
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Try Supabase first if available
    try {
      const { supabase, isSupabaseAvailable } = await import('./supabase')
      
      if (isSupabaseAvailable() && supabase) {
        const { error } = await supabase
          .from('pandagarde_newsletter_subscribers')
          .update({ 
            subscribed: false,
            unsubscribed_at: new Date().toISOString()
          })
          .eq('email', normalizedEmail)

        if (error) {throw error}
        return true
      }
    } catch (error) {
      logger.error('Supabase unsubscribe error:', error)
      // Fall through to localStorage fallback
    }

    // Frontend-only mode
    try {
      const subscriptions = JSON.parse(
        localStorage.getItem('pandagarde_newsletter_subscriptions') || '[]'
      )
      
      const index = subscriptions.findIndex(
        (s: NewsletterSubscriber) => s.email.toLowerCase() === normalizedEmail
      )

      if (index >= 0) {
        subscriptions[index].subscribed = false
        subscriptions[index].unsubscribed_at = new Date().toISOString()
        localStorage.setItem(
          'pandagarde_newsletter_subscriptions',
          JSON.stringify(subscriptions)
        )
      }
      
      logger.debug('Frontend-only mode: Newsletter unsubscription saved', undefined, 'DB')
      return true
    } catch (error) {
      logger.error('LocalStorage unsubscribe error:', error)
      return false
    }
  },

  // Check subscription status
  async checkSubscription(email: string): Promise<boolean> {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return false
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Try Supabase first if available
    try {
      const { supabase, isSupabaseAvailable } = await import('./supabase')
      
      if (isSupabaseAvailable() && supabase) {
        const { data } = await supabase
          .from('pandagarde_newsletter_subscribers')
          .select('subscribed')
          .eq('email', normalizedEmail)
          .maybeSingle()

        return data?.subscribed ?? false
      }
    } catch (error) {
      logger.error('Supabase check subscription error:', error)
      // Fall through to localStorage fallback
    }

    // Frontend-only mode
    try {
      const subscriptions = JSON.parse(
        localStorage.getItem('pandagarde_newsletter_subscriptions') || '[]'
      )
      
      const subscription = subscriptions.find(
        (s: NewsletterSubscriber) => s.email.toLowerCase() === normalizedEmail
      )
      
      return subscription?.subscribed ?? false
    } catch (error) {
      logger.error('LocalStorage check subscription error:', error)
      return false
    }
  }
}

// Download tracking functions - Frontend-only mode
export const downloadService = {
  // Track download - uses localStorage in frontend-only mode
  async trackDownload(downloadData: Omit<DownloadTracking, 'id' | 'downloaded_at'>): Promise<DownloadTracking | null> {
    const downloadRecord = {
      ...downloadData,
      id: crypto.randomUUID(),
      downloaded_at: new Date().toISOString()
    };

    // Store in localStorage for frontend-only mode
    try {
      const existingDownloads = JSON.parse(localStorage.getItem('pandagarde_downloads') || '[]');
      existingDownloads.push(downloadRecord);
      localStorage.setItem('pandagarde_downloads', JSON.stringify(existingDownloads));
      logger.debug('Frontend-only mode: Download tracked (localStorage)', undefined, 'DB');
      return downloadRecord;
    } catch (error) {
      logger.error('Error storing download in localStorage:', error);
      return null;
    }
  },

  // Get download statistics - returns localStorage data in frontend-only mode
  async getDownloadStats(): Promise<DownloadTracking[]> {
    try {
      const localDownloads = JSON.parse(localStorage.getItem('pandagarde_downloads') || '[]');
      return localDownloads.sort((a: DownloadTracking, b: DownloadTracking) => 
        new Date(b.downloaded_at).getTime() - new Date(a.downloaded_at).getTime()
      );
    } catch (error) {
      logger.error('Error fetching local download stats:', error);
      return [];
    }
  }
}

// Session management functions - Frontend-only mode
export const sessionService = {
  // Create user session - disabled in frontend-only mode
  async createSession(_userId: string, _sessionData: Record<string, unknown>, _expiresAt: Date): Promise<UserSession | null> {
    logger.debug('Frontend-only mode: createSession() - operation skipped', undefined, 'DB')
    return null
  },

  // Get user sessions - returns empty array in frontend-only mode
  async getUserSessions(_userId: string): Promise<UserSession[]> {
    logger.debug('Frontend-only mode: getUserSessions() - returning empty array', undefined, 'DB')
    return []
  },

  // Clean up expired sessions - always returns true in frontend-only mode
  async cleanupExpiredSessions(): Promise<boolean> {
    logger.debug('Frontend-only mode: cleanupExpiredSessions() - operation skipped', undefined, 'DB')
    return true
  }
}

// Auth helper functions - Frontend-only mode
export const authService = {
  // Sign up with email and password - disabled in frontend-only mode
  async signUp(_email: string, _password: string) {
    logger.debug('Frontend-only mode: sign-up attempt (auth disabled)', undefined, 'DB')
    return { data: null, error: { message: 'Authentication disabled - redirect to family hub project' } }
  },

  // Sign in with email and password - disabled in frontend-only mode
  async signIn(_email: string, _password: string) {
    logger.debug('Frontend-only mode: sign-in attempt (auth disabled)', undefined, 'DB')
    return { data: null, error: { message: 'Authentication disabled - redirect to family hub project' } }
  },

  // Sign out - always succeeds in frontend-only mode
  async signOut() {
    logger.debug('Frontend-only mode: sign-out', undefined, 'DB')
    return { error: null }
  },

  // Get current session - always returns null in frontend-only mode
  async getCurrentSession() {
    logger.debug('Frontend-only mode: getCurrentSession() - returning null', undefined, 'DB')
    return { data: { session: null }, error: null }
  }
}
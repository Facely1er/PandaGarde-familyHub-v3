// Frontend-only mode - no database dependencies
import { trackEvent, AnalyticsEvents } from './analytics';

export interface SearchContentItem {
  id: string;
  title: string;
  description: string;
  content_type: 'page' | 'activity' | 'resource' | 'guide';
  url: string;
  category_id: string;
  tags: string[];
  metadata: Record<string, unknown>;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SearchCategory {
  id: string;
  name: string;
  display_name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SearchSuggestion {
  id: string;
  suggestion: string;
  suggestion_type: 'popular' | 'recent' | 'recommended';
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SearchAnalytics {
  id: string;
  search_query: string;
  results_count: number;
  user_id?: string;
  session_id?: string;
  filters_applied: Record<string, unknown>;
  searched_at: string;
}

export interface SearchFilters {
  content_type?: string[];
  category_id?: string;
  tags?: string[];
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'activity' | 'resource' | 'guide';
  url: string;
  category: string;
  tags: string[];
  metadata?: Record<string, unknown>;
  score?: number;
}

class SearchService {
  private searchIndex: SearchContentItem[] = [];
  private categories: SearchCategory[] = [];
  private suggestions: SearchSuggestion[] = [];

  async initialize(): Promise<void> {
    try {
      await this.loadSearchContent();
      await this.loadCategories();
      await this.loadSuggestions();
    } catch (error) {
      console.error('Failed to initialize search service:', error);
    }
  }

  private async loadSearchContent(): Promise<void> {
    console.log('Frontend-only mode: Using static search content');
    // Static search content for frontend-only mode
    this.searchIndex = [
      {
        id: 'privacy-basics',
        title: 'Privacy Basics',
        description: 'Learn the fundamentals of online privacy and data protection',
        content_type: 'guide',
        url: '/guides/privacy-basics',
        category_id: 'privacy',
        tags: ['privacy', 'basics', 'data-protection'],
        metadata: { age_groups: ['5-8', '9-12'] },
        is_active: true,
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'password-safety',
        title: 'Password Safety',
        description: 'How to create and manage secure passwords',
        content_type: 'activity',
        url: '/activities/password-safety',
        category_id: 'security',
        tags: ['passwords', 'security', 'authentication'],
        metadata: { age_groups: ['9-12', '13-17'] },
        is_active: true,
        sort_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'social-media-privacy',
        title: 'Social Media Privacy',
        description: 'Understanding privacy settings on social media platforms',
        content_type: 'guide',
        url: '/guides/social-media-privacy',
        category_id: 'privacy',
        tags: ['social-media', 'privacy-settings', 'online-safety'],
        metadata: { age_groups: ['13-17'] },
        is_active: true,
        sort_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private async loadCategories(): Promise<void> {
    console.log('Frontend-only mode: Using static categories');
    this.categories = [
      {
        id: 'privacy',
        name: 'privacy',
        display_name: 'Privacy',
        description: 'Privacy and data protection topics',
        sort_order: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'security',
        name: 'security',
        display_name: 'Security',
        description: 'Online security and safety topics',
        sort_order: 2,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'digital-citizenship',
        name: 'digital-citizenship',
        display_name: 'Digital Citizenship',
        description: 'Digital citizenship and responsible online behavior',
        sort_order: 3,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private async loadSuggestions(): Promise<void> {
    console.log('Frontend-only mode: Using static suggestions');
    this.suggestions = [
      {
        id: 'privacy-settings',
        suggestion: 'privacy settings',
        suggestion_type: 'popular',
        usage_count: 15,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'password-safety',
        suggestion: 'password safety',
        suggestion_type: 'popular',
        usage_count: 12,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'online-safety',
        suggestion: 'online safety',
        suggestion_type: 'popular',
        usage_count: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  async search(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
    if (!query.trim()) {return [];}

    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search through the index
    for (const item of this.searchIndex) {
      let score = 0;
      const title = item.title.toLowerCase();
      const description = item.description.toLowerCase();
      const tags = (item.tags || []).map(tag => tag.toLowerCase());

      // Title matches (highest priority)
      if (title.includes(normalizedQuery)) {
        score += 10;
      }

      // Description matches
      if (description.includes(normalizedQuery)) {
        score += 5;
      }

      // Tag matches
      const tagMatches = tags.filter(tag => tag.includes(normalizedQuery));
      score += tagMatches.length * 3;

      // Apply filters
      if (filters) {
        if (filters.content_type && !filters.content_type.includes(item.content_type)) {
          continue;
        }
        if (filters.category_id && item.category_id !== filters.category_id) {
          continue;
        }
        if (filters.tags && !filters.tags.some(tag => (item.tags || []).includes(tag))) {
          continue;
        }
      }

      if (score > 0) {
        const category = this.categories.find(cat => cat.id === item.category_id);
        results.push({
          id: item.id,
          title: item.title,
          description: item.description,
          type: item.content_type,
          url: item.url,
          category: category?.display_name || 'Uncategorized',
          tags: item.tags || [],
          metadata: item.metadata,
          score
        });
      }
    }

    // Sort by score (highest first)
    results.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Track search analytics
    await this.trackSearchAnalytics(query, results.length, filters);

    return results;
  }

  async getSuggestions(query: string): Promise<string[]> {
    if (!query.trim()) {return [];}

    const normalizedQuery = query.toLowerCase();
    const suggestions: string[] = [];

    // Get suggestions from database
    for (const suggestion of this.suggestions) {
      if (suggestion.suggestion.toLowerCase().includes(normalizedQuery)) {
        suggestions.push(suggestion.suggestion);
      }
    }

    // Get suggestions from content titles
    for (const item of this.searchIndex) {
      if (item.title.toLowerCase().includes(normalizedQuery)) {
        suggestions.push(item.title);
      }
    }

    // Remove duplicates and limit results
    return [...new Set(suggestions)].slice(0, 10);
  }

  async getPopularSearches(): Promise<string[]> {
    return this.suggestions
      .filter(s => s.suggestion_type === 'popular')
      .slice(0, 10)
      .map(s => s.suggestion);
  }

  async getCategories(): Promise<SearchCategory[]> {
    return this.categories;
  }

  async addSearchContent(content: Omit<SearchContentItem, 'id' | 'created_at' | 'updated_at'>): Promise<SearchContentItem | null> {
    console.log('Frontend-only mode: Cannot add search content to database');
    return null;
  }

  async updateSearchContent(id: string, updates: Partial<SearchContentItem>): Promise<SearchContentItem | null> {
    console.log('Frontend-only mode: Cannot update search content in database');
    return null;
  }

  async deleteSearchContent(id: string): Promise<boolean> {
    console.log('Frontend-only mode: Cannot delete search content from database');
    return false;
  }

  private async trackSearchAnalytics(query: string, resultsCount: number, filters?: SearchFilters): Promise<void> {
    console.log('Frontend-only mode: Tracking search analytics locally');
    
    try {
      // Track in analytics
      trackEvent(AnalyticsEvents.SEARCH_PERFORMED, {
        search_query: query,
        results_count: resultsCount,
        filters_applied: filters ? Object.keys(filters).length : 0,
      });
    } catch (error) {
      console.error('Error tracking search analytics:', error);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async refreshIndex(): Promise<void> {
    await this.initialize();
  }
}

export const searchService = new SearchService();
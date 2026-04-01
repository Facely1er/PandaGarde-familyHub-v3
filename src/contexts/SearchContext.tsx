import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { searchService, SearchResult, SearchFilters } from '../lib/searchService';

// SearchResult interface is now imported from searchService

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  performSearch: (query: string, filters?: SearchFilters) => Promise<void>;
  clearSearch: () => void;
  getRecentSearches: () => string[];
  addToRecentSearches: (query: string) => void;
  getSuggestions: (query: string) => Promise<string[]>;
  getPopularSearches: () => Promise<string[]>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: React.ReactNode;
}

// Search data is now dynamically loaded from local content

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize search service
  useEffect(() => {
    try {
      searchService.initialize();
    } catch (error) {
      console.error('Failed to initialize search service:', error);
    }
  }, []);

  const getRecentSearches = useCallback(() => {
    const recent = localStorage.getItem('pandagarde_recent_searches');
    return recent ? JSON.parse(recent) : [];
  }, []);

  const addToRecentSearches = useCallback((query: string) => {
    if (!query.trim()) {return;}
    
    const recent = getRecentSearches();
    const updated = [query, ...recent.filter((item: string) => item !== query)].slice(0, 10);
    localStorage.setItem('pandagarde_recent_searches', JSON.stringify(updated));
  }, [getRecentSearches]);

  const performSearch = useCallback(async (query: string, filters?: SearchFilters) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);

    try {
      const results = await searchService.search(query, filters);
      setSearchResults(results);
      
      // Add to recent searches
      addToRecentSearches(query);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [addToRecentSearches]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const getSuggestions = useCallback(async (query: string) => {
    try {
      if (!query.trim()) {
        return [];
      }
      return await searchService.getSuggestions(query);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }, []);

  const getPopularSearches = useCallback(async () => {
    try {
      return await searchService.getPopularSearches();
    } catch (error) {
      console.error('Error getting popular searches:', error);
      return [];
    }
  }, []);

  const value: SearchContextType = {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    performSearch,
    clearSearch,
    getRecentSearches,
    addToRecentSearches,
    getSuggestions,
    getPopularSearches
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, ArrowRight, FileText, BookOpen, Download, Settings, Filter } from 'lucide-react';
import { useSearch, SearchResult } from '../contexts/SearchContext';
import { renderSearchHighlights, safeTextContent } from '../lib/htmlSanitizer';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick?: (result: SearchResult) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onResultClick }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: [] as string[],
    category: [] as string[],
  });
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap effect
  useEffect(() => {
    if (!isOpen || !modalRef.current) {return;}

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {return;}

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    return () => modal.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Handle escape key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);
  const { 
    searchQuery, 
    searchResults, 
    isSearching, 
    performSearch, 
    clearSearch, 
    getRecentSearches,
    addToRecentSearches,
    getSuggestions,
    getPopularSearches
  } = useSearch();

  const recentSearches = getRecentSearches();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    let cancelled = false;
    getPopularSearches().then((terms) => {
      if (!cancelled) {
        setPopularSearches(Array.isArray(terms) ? terms : []);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, getPopularSearches]);

  useEffect(() => {
    let cancelled = false;
    const timeoutId = setTimeout(() => {
      if (inputValue.trim()) {
        performSearch(inputValue, filters);
        getSuggestions(inputValue).then((newSuggestions) => {
          if (!cancelled) {
            setSuggestions(Array.isArray(newSuggestions) ? newSuggestions : []);
          }
        });
      } else {
        clearSearch();
        setSuggestions([]);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [inputValue, performSearch, clearSearch, filters, getSuggestions]);

  const handleResultClick = (result: SearchResult) => {
    addToRecentSearches(searchQuery);
    onResultClick?.(result);
    onClose();
  };

  const handleRecentSearchClick = (query: string) => {
    setInputValue(query);
    performSearch(query);
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'page':
        return FileText;
      case 'activity':
        return BookOpen;
      case 'resource':
        return Download;
      case 'guide':
        return Settings;
      default:
        return FileText;
    }
  };

  const getResultColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'page':
        return 'text-blue-600';
      case 'activity':
        return 'text-green-600';
      case 'resource':
        return 'text-purple-600';
      case 'guide':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!isOpen) {return null;}

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      onKeyDown={handleKeyDown}
    >
      <div className="flex min-h-screen items-start justify-center p-4 pt-20">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        >
          <h2 id="search-modal-title" className="sr-only">Search PandaGarde</h2>
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search pages, activities, resources..."
                className="w-full pl-10 pr-20 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-1 rounded ${showFilters ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Toggle filters"
                >
                  <Filter size={16} />
                </button>
                {inputValue && (
                  <button
                    onClick={() => {
                      setInputValue('');
                      clearSearch();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Filters */}
            {showFilters && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content Type
                    </label>
                    <div className="space-y-1">
                      {['page', 'activity', 'resource', 'guide'].map(type => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.type.includes(type)}
                            onChange={(e) => {
                              const newTypes = e.target.checked
                                ? [...filters.type, type]
                                : filters.type.filter(t => t !== type);
                              setFilters({ ...filters, type: newTypes });
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <div className="space-y-1">
                      {['Pages', 'Activities', 'Resources', 'Guides', 'Age Groups'].map(category => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.category.includes(category)}
                            onChange={(e) => {
                              const newCategories = e.target.checked
                                ? [...filters.category, category]
                                : filters.category.filter(c => c !== category);
                              setFilters({ ...filters, category: newCategories });
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Searching...</p>
              </div>
            ) : inputValue.trim() ? (
              searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((result) => {
                    const IconComponent = getResultIcon(result.type);
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent 
                            size={20} 
                            className={`mt-1 ${getResultColor(result.type)}`} 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 
                                className="font-medium text-gray-900 dark:text-white sm:truncate break-words"
                                dangerouslySetInnerHTML={{ __html: renderSearchHighlights(result.highlights, searchQuery).title }}
                              />
                              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded">
                                {result.category}
                              </span>
                              {result.score > 0 && (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                                  {Math.round(result.score * 100)}% match
                                </span>
                              )}
                            </div>
                            <p 
                              className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: renderSearchHighlights(result.highlights, searchQuery).description }}
                            />
                            <div className="flex items-center gap-1 mt-2">
                              <ArrowRight size={12} className="text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {result.url}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search size={32} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">No results found</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Try different keywords or check your spelling
                  </p>
                </div>
              )
            ) : (
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Clock size={16} />
                      Recent Searches
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.slice(0, 5).map((query: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(query)}
                          className="w-full p-2 text-left text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentSearchClick(term)}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Suggestions
                    </h3>
                    <div className="space-y-1">
                      {suggestions.slice(0, 5).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(suggestion)}
                          className="w-full p-2 text-left text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
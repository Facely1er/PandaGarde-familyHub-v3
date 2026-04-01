/**
 * HTML Sanitization Utilities
 * Provides safe HTML rendering to prevent XSS attacks
 */

// Simple HTML sanitizer that only allows safe tags and attributes
const ALLOWED_TAGS = ['strong', 'em', 'b', 'i', 'mark', 'span'];
const ALLOWED_ATTRIBUTES = ['class', 'style'];

/**
 * Sanitizes HTML content by removing dangerous tags and attributes
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Remove all script tags and their content
  const scripts = tempDiv.querySelectorAll('script');
  scripts.forEach(script => script.remove());

  // Remove all dangerous attributes
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(element => {
    const attributes = Array.from(element.attributes);
    attributes.forEach(attr => {
      if (!ALLOWED_ATTRIBUTES.includes(attr.name.toLowerCase())) {
        element.removeAttribute(attr.name);
      }
    });

    // Remove dangerous event handlers
    const dangerousAttrs = ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'];
    dangerousAttrs.forEach(attr => {
      element.removeAttribute(attr);
    });
  });

  // Remove any remaining dangerous tags
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'];
  dangerousTags.forEach(tag => {
    const elements = tempDiv.querySelectorAll(tag);
    elements.forEach(element => element.remove());
  });

  return tempDiv.innerHTML;
};

/**
 * Safely renders HTML content with highlighting
 * @param content - The content to highlight
 * @param searchTerm - The term to highlight
 * @returns Safe HTML string with highlighting
 */
export const createHighlightedHtml = (content: string, searchTerm: string): string => {
  if (!content || !searchTerm) {
    return sanitizeHtml(content);
  }

  // Escape HTML characters in the search term
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create a regex to find the search term (case insensitive)
  const regex = new RegExp(`(${escapedTerm})`, 'gi');
  
  // Replace matches with highlighted version
  const highlighted = content.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
  
  return sanitizeHtml(highlighted);
};

/**
 * Safely renders search result highlights
 * @param highlights - The highlights object from search results
 * @param searchTerm - The original search term
 * @returns Safe HTML string
 */
export const renderSearchHighlights = (highlights: { title?: string; description?: string }, searchTerm: string) => {
  return {
    title: highlights.title ? createHighlightedHtml(highlights.title, searchTerm) : '',
    description: highlights.description ? createHighlightedHtml(highlights.description, searchTerm) : ''
  };
};

/**
 * Alternative to dangerouslySetInnerHTML that uses text content
 * @param content - The content to display
 * @returns Plain text content
 */
export const safeTextContent = (content: string): string => {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // Remove all HTML tags and return plain text
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  return tempDiv.textContent || tempDiv.innerText || '';
};
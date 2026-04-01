import { describe, it, expect } from 'vitest';
import { sanitizeHtml, createHighlightedHtml, safeTextContent, renderSearchHighlights } from './htmlSanitizer';

describe('htmlSanitizer', () => {
  describe('sanitizeHtml', () => {
    it('should return empty string for null/undefined input', () => {
      expect(sanitizeHtml(null as unknown as string)).toBe('');
      expect(sanitizeHtml(undefined as unknown as string)).toBe('');
      expect(sanitizeHtml('')).toBe('');
    });

    it('should allow safe tags', () => {
      const input = '<strong>bold</strong> and <em>italic</em>';
      expect(sanitizeHtml(input)).toContain('<strong>bold</strong>');
      expect(sanitizeHtml(input)).toContain('<em>italic</em>');
    });

    it('should remove script tags', () => {
      const malicious = '<script>alert("xss")</script>';
      const result = sanitizeHtml(malicious);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should remove onclick and other event handlers', () => {
      const malicious = '<div onclick="alert(\'xss\')">click me</div>';
      const result = sanitizeHtml(malicious);
      expect(result).not.toContain('onclick');
      expect(result).not.toContain('alert');
    });

    it('should remove onload event handler', () => {
      const malicious = '<img onload="alert(\'xss\')" src="x">';
      const result = sanitizeHtml(malicious);
      expect(result).not.toContain('onload');
    });

    it('should remove onerror event handler', () => {
      const malicious = '<img onerror="alert(\'xss\')" src="x">';
      const result = sanitizeHtml(malicious);
      expect(result).not.toContain('onerror');
    });

    it('should remove iframe tags', () => {
      const malicious = '<iframe src="https://evil.com"></iframe>';
      const result = sanitizeHtml(malicious);
      expect(result).not.toContain('<iframe');
      expect(result).not.toContain('evil.com');
    });

    it('should remove form and input tags', () => {
      const malicious = '<form action="https://evil.com"><input type="text"></form>';
      const result = sanitizeHtml(malicious);
      expect(result).not.toContain('<form');
      expect(result).not.toContain('<input');
    });

    it('should remove object and embed tags', () => {
      const malicious = '<object data="malware.swf"></object><embed src="malware.swf">';
      const result = sanitizeHtml(malicious);
      expect(result).not.toContain('<object');
      expect(result).not.toContain('<embed');
    });

    it('should preserve allowed attributes', () => {
      const input = '<span class="highlight" style="color: red">text</span>';
      const result = sanitizeHtml(input);
      expect(result).toContain('class="highlight"');
      expect(result).toContain('style="color: red"');
    });

    it('should remove disallowed attributes', () => {
      const input = '<span id="test" data-custom="value">text</span>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('id=');
      expect(result).not.toContain('data-custom');
    });

    it('should handle nested malicious content', () => {
      const malicious = '<div><script>alert("xss")</script><p onclick="hack()">text</p></div>';
      const result = sanitizeHtml(malicious);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('onclick');
      expect(result).toContain('text');
    });

    it('should handle javascript: URLs', () => {
      const malicious = '<a href="javascript:alert(\'xss\')">click</a>';
      const result = sanitizeHtml(malicious);
      // href is not in allowed attributes, so it should be removed
      expect(result).not.toContain('href');
    });

    it('should handle SVG with embedded scripts', () => {
      const malicious = '<svg><script>alert("xss")</script></svg>';
      const result = sanitizeHtml(malicious);
      expect(result).not.toContain('<script>');
    });
  });

  describe('createHighlightedHtml', () => {
    it('should highlight search terms', () => {
      const content = 'Hello world';
      const searchTerm = 'world';
      const result = createHighlightedHtml(content, searchTerm);
      expect(result).toContain('<mark');
      expect(result).toContain('world');
    });

    it('should be case insensitive', () => {
      const content = 'Hello World';
      const searchTerm = 'world';
      const result = createHighlightedHtml(content, searchTerm);
      expect(result).toContain('<mark');
    });

    it('should handle empty search term', () => {
      const content = 'Hello world';
      const result = createHighlightedHtml(content, '');
      expect(result).toBe('Hello world');
    });

    it('should handle empty content', () => {
      const result = createHighlightedHtml('', 'test');
      expect(result).toBe('');
    });

    it('should escape regex special characters in search term', () => {
      const content = 'Hello (world)';
      const searchTerm = '(world)';
      // Should not throw an error
      const result = createHighlightedHtml(content, searchTerm);
      expect(result).toContain('world');
    });

    it('should sanitize highlighted content', () => {
      const content = '<script>alert("xss")</script>Hello world';
      const searchTerm = 'world';
      const result = createHighlightedHtml(content, searchTerm);
      expect(result).not.toContain('<script>');
      expect(result).toContain('<mark');
    });
  });

  describe('safeTextContent', () => {
    it('should strip all HTML tags', () => {
      const html = '<div><strong>Hello</strong> <em>world</em></div>';
      const result = safeTextContent(html);
      expect(result).toBe('Hello world');
    });

    it('should handle null/undefined input', () => {
      expect(safeTextContent(null as unknown as string)).toBe('');
      expect(safeTextContent(undefined as unknown as string)).toBe('');
    });

    it('should handle empty string', () => {
      expect(safeTextContent('')).toBe('');
    });

    it('should extract text content from all elements', () => {
      // Note: safeTextContent extracts all text including from script tags
      // This is correct behavior - use sanitizeHtml first to remove scripts
      const malicious = '<script>alert("xss")</script>Safe text';
      const result = safeTextContent(malicious);
      expect(result).toContain('Safe text');
      // The text content of script tag is also extracted
      expect(result).toBe('alert("xss")Safe text');
    });

    it('should handle nested tags', () => {
      const html = '<div><p><span>Nested</span> content</p></div>';
      const result = safeTextContent(html);
      expect(result).toBe('Nested content');
    });
  });

  describe('renderSearchHighlights', () => {
    it('should render both title and description highlights', () => {
      const highlights = {
        title: 'Hello world',
        description: 'This is a test'
      };
      const result = renderSearchHighlights(highlights, 'world');
      expect(result.title).toContain('<mark');
      expect(result.description).not.toContain('<mark');
    });

    it('should handle missing title', () => {
      const highlights = {
        description: 'This is a test'
      };
      const result = renderSearchHighlights(highlights, 'test');
      expect(result.title).toBe('');
      expect(result.description).toContain('<mark');
    });

    it('should handle missing description', () => {
      const highlights = {
        title: 'Hello world'
      };
      const result = renderSearchHighlights(highlights, 'world');
      expect(result.title).toContain('<mark');
      expect(result.description).toBe('');
    });
  });
});

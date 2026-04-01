import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createFocusTrap,
  announceToScreenReader,
  isVisibleToScreenReader,
  getAccessibleName,
  validateAriaAttributes,
} from '../accessibility';

describe('Accessibility Utilities', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('createFocusTrap', () => {
    it('should trap focus within container', () => {
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      container.appendChild(button1);
      container.appendChild(button2);

      const cleanup = createFocusTrap(container);
      expect(document.activeElement).toBe(button1);
      cleanup();
    });

    it('should handle escape key', () => {
      const onEscape = vi.fn();
      const cleanup = createFocusTrap(container, { onEscape });

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      container.dispatchEvent(event);

      expect(onEscape).toHaveBeenCalled();
      cleanup();
    });
  });

  describe('announceToScreenReader', () => {
    it('should create announcement element', () => {
      announceToScreenReader('Test message');
      const announcement = document.querySelector('[aria-live]');
      expect(announcement).toBeInTheDocument();
    });
  });

  describe('isVisibleToScreenReader', () => {
    it('should return true for visible elements', () => {
      const element = document.createElement('div');
      element.textContent = 'Visible';
      container.appendChild(element);

      expect(isVisibleToScreenReader(element)).toBe(true);
    });

    it('should return false for hidden elements', () => {
      const element = document.createElement('div');
      element.style.display = 'none';
      container.appendChild(element);

      expect(isVisibleToScreenReader(element)).toBe(false);
    });
  });

  describe('getAccessibleName', () => {
    it('should get name from aria-label', () => {
      const element = document.createElement('button');
      element.setAttribute('aria-label', 'Test Button');
      expect(getAccessibleName(element)).toBe('Test Button');
    });

    it('should get name from associated label', () => {
      const label = document.createElement('label');
      label.textContent = 'Test Label';
      const input = document.createElement('input');
      input.id = 'test-input';
      label.setAttribute('for', 'test-input');

      container.appendChild(label);
      container.appendChild(input);

      expect(getAccessibleName(input)).toBe('Test Label');
    });
  });

  describe('validateAriaAttributes', () => {
    it('should validate dialog has label', () => {
      const dialog = document.createElement('div');
      dialog.setAttribute('role', 'dialog');

      const result = validateAriaAttributes(dialog);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Dialog must have aria-label or aria-labelledby');
    });

    it('should pass validation for properly labeled dialog', () => {
      const dialog = document.createElement('div');
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-label', 'Test Dialog');

      const result = validateAriaAttributes(dialog);
      expect(result.valid).toBe(true);
    });
  });
});


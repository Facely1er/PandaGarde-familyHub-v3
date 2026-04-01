/**
 * Accessibility utilities for improved WCAG compliance
 */

/**
 * Creates a focus trap for modals and dialogs
 * Ensures keyboard navigation stays within the modal
 */
export function createFocusTrap(
  container: HTMLElement,
  options: {
    onEscape?: () => void;
    returnFocusTo?: HTMLElement;
  } = {}
): () => void {
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  const getFocusableElements = (): HTMLElement[] => {
    const elements = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors)
    );
    return elements.filter((el) => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && options.onEscape) {
      options.onEscape();
      return;
    }

    if (e.key !== 'Tab') {return;}

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) {return;}

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  // Focus first element
  const focusableElements = getFocusableElements();
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
    if (options.returnFocusTo) {
      options.returnFocusTo.focus();
    }
  };
}

/**
 * Announces a message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Checks if an element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return false;
  }

  const ariaHidden = element.getAttribute('aria-hidden');
  if (ariaHidden === 'true') {
    return false;
  }

  return true;
}

/**
 * Gets the accessible name of an element
 */
export function getAccessibleName(element: HTMLElement): string {
  // Check aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {return ariaLabel;}

  // Check aria-labelledby
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) {return labelElement.textContent || '';}
  }

  // Check associated label
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) {return label.textContent || '';}
  }

  // Check text content
  return element.textContent?.trim() || '';
}

/**
 * Validates ARIA attributes on an element
 */
export function validateAriaAttributes(element: HTMLElement): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for required ARIA attributes on interactive elements
  if (element.hasAttribute('role')) {
    const role = element.getAttribute('role');
    
    if (role === 'dialog' || role === 'alertdialog') {
      const hasLabel = element.hasAttribute('aria-label') || 
                       element.hasAttribute('aria-labelledby');
      if (!hasLabel) {
        errors.push('Dialog must have aria-label or aria-labelledby');
      }
    }

    if (role === 'button' && !element.hasAttribute('aria-label') && 
        !getAccessibleName(element)) {
      errors.push('Button must have accessible name');
    }
  }

  // Check for conflicting attributes
  if (element.hasAttribute('aria-hidden') && 
      element.hasAttribute('aria-live')) {
    errors.push('Element cannot be both aria-hidden and aria-live');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}


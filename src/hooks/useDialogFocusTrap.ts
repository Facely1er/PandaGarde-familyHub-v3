import { useCallback, useEffect, useRef, type Ref, type RefObject } from 'react';

interface UseDialogFocusTrapOptions {
  isOpen: boolean;
  onClose: () => void;
  /** Element to restore focus when the dialog closes */
  returnFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * Focus trap + Escape for modal dialogs (see SearchModal.tsx).
 * Returns a callback ref compatible with motion.div children and strict Ref types.
 */
export function useDialogFocusTrap({
  isOpen,
  onClose,
  returnFocusRef,
}: UseDialogFocusTrapOptions): Ref<HTMLDivElement> {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const setDialogRef = useCallback((node: HTMLDivElement | null) => {
    dialogRef.current = node;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const modal = dialogRef.current;
    if (!modal) {
      return;
    }

    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || focusable.length === 0) {
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    modal.addEventListener('keydown', handleKeyDown);
    const focusReturnTarget = returnFocusRef?.current ?? previousFocusRef.current;
    return () => {
      modal.removeEventListener('keydown', handleKeyDown);
      focusReturnTarget?.focus?.();
    };
  }, [isOpen, onClose, returnFocusRef]);

  return setDialogRef;
}

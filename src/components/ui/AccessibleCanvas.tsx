import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface AccessibleCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  /** Accessible name for the canvas */
  label: string;
  /** Detailed description of what's displayed on the canvas */
  description?: string;
  /** Role hint for screen readers */
  roleHint?: 'img' | 'application' | 'graphics-document';
  /** Whether the canvas is interactive */
  isInteractive?: boolean;
  /** Instructions for keyboard users (if interactive) */
  keyboardInstructions?: string;
  /** Fallback content for when canvas isn't supported */
  fallback?: React.ReactNode;
  /** Callback when canvas is ready */
  onCanvasReady?: (ctx: CanvasRenderingContext2D) => void;
}

export interface AccessibleCanvasRef {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
}

/**
 * An accessible canvas component that provides proper ARIA attributes
 * and fallback content for assistive technologies.
 * 
 * @example
 * ```tsx
 * <AccessibleCanvas
 *   label="Privacy Maze Game"
 *   description="Navigate through the maze to learn about online privacy. Use arrow keys to move."
 *   isInteractive
 *   keyboardInstructions="Use arrow keys to move. Press Space to interact."
 *   width={800}
 *   height={600}
 *   onCanvasReady={(ctx) => initGame(ctx)}
 * />
 * ```
 */
const AccessibleCanvas = forwardRef<AccessibleCanvasRef, AccessibleCanvasProps>(
  (
    {
      label,
      description,
      roleHint = 'img',
      isInteractive = false,
      keyboardInstructions,
      fallback,
      onCanvasReady,
      className = '',
      ...props
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const descriptionId = `canvas-desc-${Math.random().toString(36).substr(2, 9)}`;
    const instructionsId = `canvas-instructions-${Math.random().toString(36).substr(2, 9)}`;

    // Expose canvas and context to parent via ref
    useImperativeHandle(ref, () => ({
      canvas: canvasRef.current,
      context: contextRef.current,
    }));

    // Initialize canvas context
    useEffect(() => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        contextRef.current = ctx;
        if (ctx && onCanvasReady) {
          onCanvasReady(ctx);
        }
      }
    }, [onCanvasReady]);

    // Build aria-describedby value
    const ariaDescribedBy = [
      description ? descriptionId : null,
      isInteractive && keyboardInstructions ? instructionsId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={`accessible-canvas-wrapper relative ${className}`}>
        {/* Hidden description for screen readers */}
        {description && (
          <div id={descriptionId} className="sr-only">
            {description}
          </div>
        )}

        {/* Hidden keyboard instructions for screen readers */}
        {isInteractive && keyboardInstructions && (
          <div id={instructionsId} className="sr-only">
            Keyboard instructions: {keyboardInstructions}
          </div>
        )}

        {/* Main canvas element */}
        <canvas
          ref={canvasRef}
          role={roleHint}
          aria-label={label}
          aria-describedby={ariaDescribedBy}
          tabIndex={isInteractive ? 0 : undefined}
          className={`
            focus:outline-none 
            focus:ring-2 
            focus:ring-[#1B5E20] 
            focus:ring-offset-2
            rounded-lg
          `}
          {...props}
        >
          {/* Fallback content for non-canvas browsers */}
          {fallback || (
            <div 
              className="
                bg-gray-100 dark:bg-gray-800 
                p-6 rounded-lg text-center
              "
            >
              <p className="text-gray-600 dark:text-gray-300">
                {label}: {description || 'Your browser does not support canvas.'}
              </p>
            </div>
          )}
        </canvas>

        {/* Visible instructions for interactive canvases */}
        {isInteractive && keyboardInstructions && (
          <div 
            className="
              mt-2 text-sm text-gray-600 dark:text-gray-400
              flex items-center gap-2
            "
            aria-hidden="true"
          >
            <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
              ⌨️
            </kbd>
            <span>{keyboardInstructions}</span>
          </div>
        )}
      </div>
    );
  }
);

AccessibleCanvas.displayName = 'AccessibleCanvas';

export default AccessibleCanvas;
export { AccessibleCanvas };


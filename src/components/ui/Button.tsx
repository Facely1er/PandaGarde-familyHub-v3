import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Loading text to display (screen reader accessible) */
  loadingText?: string;
  /** Icon to display before the label */
  leftIcon?: React.ReactNode;
  /** Icon to display after the label */
  rightIcon?: React.ReactNode;
  /** Make the button full width */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Button contents */
  children: React.ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: `
    bg-green-700 dark:bg-green-600
    text-white
    hover:bg-green-800 dark:hover:bg-green-500
    focus:ring-green-700 dark:focus:ring-green-400
    shadow-sm hover:shadow-md
  `,
  secondary: `
    bg-gray-100 dark:bg-gray-700
    text-gray-800 dark:text-gray-100
    hover:bg-gray-200 dark:hover:bg-gray-600
    focus:ring-gray-400
    border border-gray-300 dark:border-gray-600
  `,
  outline: `
    bg-transparent
    text-green-700 dark:text-green-400
    border-2 border-green-700 dark:border-green-400
    hover:bg-green-50 dark:hover:bg-green-900/20
    focus:ring-green-700
  `,
  ghost: `
    bg-transparent
    text-gray-600 dark:text-gray-300
    hover:bg-gray-100 dark:hover:bg-gray-800
    hover:text-gray-900 dark:hover:text-white
    focus:ring-gray-400
  `,
  danger: `
    bg-red-600
    text-white
    hover:bg-red-700
    focus:ring-red-500
    shadow-sm hover:shadow-md
  `,
  success: `
    bg-green-700
    text-white
    hover:bg-green-800
    focus:ring-green-500
    shadow-sm hover:shadow-md
  `,
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5 min-h-[32px]',
  md: 'px-4 py-2.5 text-base gap-2 min-h-[44px]',
  lg: 'px-6 py-3 text-lg gap-2.5 min-h-[52px]',
};

/**
 * A versatile, accessible button component with consistent styling.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 * 
 * <Button variant="secondary" isLoading loadingText="Saving...">
 *   Save
 * </Button>
 * 
 * <Button variant="outline" leftIcon={<Plus size={16} />}>
 *   Add Item
 * </Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText = 'Loading...',
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const baseStyles = `
      inline-flex items-center justify-center
      font-semibold
      rounded-xl
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-[0.98]
    `;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 
              size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} 
              className="animate-spin" 
              aria-hidden="true" 
            />
            <span>{loadingText}</span>
            <span className="sr-only">Please wait</span>
          </>
        ) : (
          <>
            {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

// Also export as named export for flexibility
export { Button };


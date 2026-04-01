import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import Button from './Button';

export interface EmptyStateProps {
  /** Icon to display */
  icon?: LucideIcon;
  /** Main title */
  title: string;
  /** Description text */
  description?: string;
  /** Primary action button */
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  /** Secondary action button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Additional CSS classes */
  className?: string;
  /** Custom illustration (overrides icon) */
  illustration?: React.ReactNode;
}

/**
 * Empty state component for displaying when there's no content.
 * Provides visual feedback and optional call-to-action.
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Users}
 *   title="No family members yet"
 *   description="Add your first family member to get started"
 *   action={{
 *     label: "Add Member",
 *     onClick: () => setShowAddModal(true),
 *     icon: <Plus size={16} />
 *   }}
 * />
 * ```
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className = '',
  illustration,
}) => {
  return (
    <div 
      className={`
        flex flex-col items-center justify-center 
        text-center py-12 px-6
        ${className}
      `}
      role="status"
      aria-label={title}
    >
      {/* Illustration or Icon */}
      <div className="mb-6">
        {illustration ? (
          <div className="w-32 h-32 flex items-center justify-center" aria-hidden="true">
            {illustration}
          </div>
        ) : (
          <div 
            className="
              w-20 h-20 
              bg-gradient-to-br from-gray-100 to-gray-200 
              dark:from-gray-700 dark:to-gray-600 
              rounded-full 
              flex items-center justify-center
              shadow-inner
            "
            aria-hidden="true"
          >
            <Icon 
              size={40} 
              className="text-gray-400 dark:text-gray-500" 
              strokeWidth={1.5}
            />
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-600 dark:text-gray-300 max-w-md mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button
              variant="primary"
              onClick={action.onClick}
              leftIcon={action.icon}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="ghost"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
export { EmptyState };


import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ActionItemCardProps {
  id: string;
  type: 'approval' | 'high-risk' | 'conversation' | 'education';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  onClick: () => void;
  icon: React.ElementType;
}

const priorityClasses = {
  high: {
    card: 'border-red-500 bg-red-50 hover:shadow-md dark:border-red-600 dark:bg-red-950/30',
    iconWrap: 'bg-red-100 dark:bg-red-900/40',
    icon: 'text-red-600 dark:text-red-400',
  },
  medium: {
    card: 'border-amber-500 bg-amber-50 hover:shadow-md dark:border-amber-600 dark:bg-amber-950/30',
    iconWrap: 'bg-amber-100 dark:bg-amber-900/40',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  low: {
    card: 'border-green-500 bg-green-50 hover:shadow-md dark:border-green-600 dark:bg-green-950/30',
    iconWrap: 'bg-green-100 dark:bg-green-900/40',
    icon: 'text-green-600 dark:text-green-400',
  },
};

const ActionItemCard: React.FC<ActionItemCardProps> = ({
  id: _id,
  type: _type,
  priority,
  title,
  description,
  onClick,
  icon: Icon,
}) => {
  const style = priorityClasses[priority];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-3 flex w-full items-center gap-4 rounded-lg border-2 border-l-4 p-4 text-left transition-all hover:translate-x-1 ${style.card}`}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${style.iconWrap}`}
      >
        <Icon size={20} className={style.icon} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-base font-bold text-gray-900 dark:text-gray-100">{title}</div>
        <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{description}</div>
      </div>
      <ChevronRight size={20} className={`flex-shrink-0 ${style.icon}`} aria-hidden />
    </button>
  );
};

export default ActionItemCard;

import React from 'react';
import { Info, AlertCircle, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

type InfoBoxType = 'info' | 'success' | 'warning' | 'error' | 'tip';

interface InfoBoxProps {
  type?: InfoBoxType;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
}

const typeClasses: Record<
  InfoBoxType,
  { container: string; icon: string; DefaultIcon: typeof Info }
> = {
  success: {
    container: 'border-green-500 bg-green-100 text-green-900 dark:border-green-600 dark:bg-green-900/30 dark:text-green-100',
    icon: 'text-green-600 dark:text-green-400',
    DefaultIcon: CheckCircle,
  },
  warning: {
    container: 'border-amber-500 bg-amber-100 text-amber-900 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-100',
    icon: 'text-amber-600 dark:text-amber-400',
    DefaultIcon: AlertTriangle,
  },
  error: {
    container: 'border-red-500 bg-red-100 text-red-900 dark:border-red-600 dark:bg-red-900/30 dark:text-red-100',
    icon: 'text-red-600 dark:text-red-400',
    DefaultIcon: AlertCircle,
  },
  tip: {
    container: 'border-green-500 bg-green-50 text-green-900 dark:border-green-600 dark:bg-green-900/20 dark:text-green-100',
    icon: 'text-green-700 dark:text-green-400',
    DefaultIcon: Lightbulb,
  },
  info: {
    container: 'border-sky-500 bg-sky-50 text-sky-900 dark:border-sky-600 dark:bg-sky-900/20 dark:text-sky-100',
    icon: 'text-sky-600 dark:text-sky-400',
    DefaultIcon: Info,
  },
};

const InfoBox: React.FC<InfoBoxProps> = ({
  type = 'info',
  title,
  children,
  icon,
  onClose,
}) => {
  const config = typeClasses[type];
  const DefaultIcon = config.DefaultIcon;

  return (
    <div
      className={`relative mb-4 flex items-start gap-3 rounded-xl border-2 p-4 pr-10 sm:pr-4 ${config.container}`}
    >
      <div className="mt-0.5 flex-shrink-0">
        {React.isValidElement(icon) ? (
          icon
        ) : (
          <DefaultIcon size={20} className={config.icon} aria-hidden />
        )}
      </div>

      <div className="min-w-0 flex-1">
        {title && <div className="mb-2 text-base font-semibold">{title}</div>}
        <div className="text-[0.9375rem] leading-relaxed">{children}</div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 rounded p-1 opacity-70 transition-opacity hover:opacity-100"
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default InfoBox;

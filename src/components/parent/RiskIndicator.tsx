import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface RiskIndicatorProps {
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  score?: number;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'badge' | 'card' | 'inline';
}

const riskClasses = {
  low: {
    badge: 'border-green-500 bg-green-100 text-green-800 dark:border-green-600 dark:bg-green-900/30 dark:text-green-200',
    icon: 'text-green-600 dark:text-green-400',
    label: 'Low Risk',
  },
  medium: {
    badge: 'border-amber-500 bg-amber-100 text-amber-900 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-200',
    icon: 'text-amber-600 dark:text-amber-400',
    label: 'Medium Risk',
  },
  high: {
    badge: 'border-orange-500 bg-orange-100 text-orange-900 dark:border-orange-600 dark:bg-orange-900/30 dark:text-orange-200',
    icon: 'text-orange-600 dark:text-orange-400',
    label: 'High Risk',
  },
  'very-high': {
    badge: 'border-red-500 bg-red-100 text-red-900 dark:border-red-600 dark:bg-red-900/30 dark:text-red-200',
    icon: 'text-red-600 dark:text-red-400',
    label: 'Very High Risk',
  },
};

const sizeClasses = {
  small: { badge: 'px-2 py-1 text-xs', icon: 14, cardText: 'text-xs' },
  medium: { badge: 'px-3 py-1.5 text-sm', icon: 18, cardText: 'text-sm' },
  large: { badge: 'px-4 py-2 text-base', icon: 24, cardText: 'text-base' },
};

const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  riskLevel,
  score,
  showLabel = true,
  size = 'medium',
  variant = 'badge',
}) => {
  const config = riskClasses[riskLevel] ?? {
    badge: 'border-gray-500 bg-gray-100 text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200',
    icon: 'text-gray-600 dark:text-gray-400',
    label: 'Unknown',
  };
  const Icon =
    riskLevel === 'low'
      ? CheckCircle
      : riskLevel === 'very-high'
        ? XCircle
        : riskLevel === 'medium' || riskLevel === 'high'
          ? AlertTriangle
          : Shield;
  const sizes = sizeClasses[size];

  if (variant === 'card') {
    return (
      <div
        className={`mb-4 flex items-center gap-3 rounded-xl border-2 p-4 ${config.badge}`}
      >
        <Icon size={sizes.icon} className={`flex-shrink-0 ${config.icon}`} aria-hidden />
        <div className="min-w-0 flex-1">
          {showLabel && (
            <div className={`font-semibold ${sizes.cardText}`}>{config.label}</div>
          )}
          {score !== undefined && (
            <div className="text-sm">Privacy Safety Score: {score}/100</div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium ${sizes.cardText} ${config.icon}`}>
        <Icon size={sizes.icon} aria-hidden />
        {showLabel && config.label}
        {score !== undefined && ` (${score}/100)`}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizes.badge} ${config.badge}`}
    >
      <Icon size={sizes.icon} className={config.icon} aria-hidden />
      {showLabel && config.label}
      {score !== undefined && ` ${score}/100`}
    </span>
  );
};

export default RiskIndicator;

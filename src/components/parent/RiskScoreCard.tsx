import React from 'react';
import { Shield } from 'lucide-react';

interface RiskScoreCardProps {
  score: number;
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

const getRiskClasses = (score: number) => {
  if (score >= 70) {
    return {
      level: 'High',
      card: 'border-red-500 bg-red-100 text-red-700 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300',
      icon: 'text-red-600 dark:text-red-400',
    };
  }
  if (score >= 40) {
    return {
      level: 'Medium',
      card: 'border-amber-500 bg-amber-100 text-amber-700 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
      icon: 'text-amber-600 dark:text-amber-400',
    };
  }
  return {
    level: 'Low',
    card: 'border-green-500 bg-green-100 text-green-700 dark:border-green-600 dark:bg-green-900/30 dark:text-green-300',
    icon: 'text-green-600 dark:text-green-400',
  };
};

const sizeClasses = {
  small: { icon: 20, value: 'text-2xl', label: 'text-sm', padding: 'p-4', minWidth: 'min-w-[200px]' },
  medium: { icon: 32, value: 'text-4xl', label: 'text-base', padding: 'p-4', minWidth: 'min-w-[200px]' },
  large: { icon: 48, value: 'text-5xl', label: 'text-lg', padding: 'p-6', minWidth: 'min-w-[280px]' },
};

const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  score,
  label = 'Privacy Safety Level',
  size = 'medium',
}) => {
  const risk = getRiskClasses(score);
  const sizes = sizeClasses[size];

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border-2 ${sizes.padding} ${sizes.minWidth} ${risk.card}`}
    >
      <Shield size={sizes.icon} className={`flex-shrink-0 ${risk.icon}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className={`font-bold leading-tight ${sizes.value}`}>{score}/100</div>
        <div className={`mt-1 font-medium ${sizes.label}`}>{risk.level} Risk</div>
        {label && size !== 'small' && (
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{label}</div>
        )}
      </div>
    </div>
  );
};

export default RiskScoreCard;

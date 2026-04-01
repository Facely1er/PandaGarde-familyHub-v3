import './ProgressBar.css';

type ProgressBarVariant = 'primary' | 'low' | 'medium' | 'high' | 'critical';

interface ProgressBarProps {
  value: number;
  variant?: ProgressBarVariant;
  size?: 'sm' | 'md';
  className?: string;
  'aria-label'?: string;
}

export function ProgressBar({
  value,
  variant = 'primary',
  size = 'md',
  className = '',
  'aria-label': ariaLabel = 'Progress',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  const trackClass = `progress-bar-track progress-bar-track--${size} ${className}`.trim();
  const fillClass = `progress-bar-fill progress-bar-fill--${variant} progress-pct-${clamped}`;
  return (
    <div
      className={trackClass}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={fillClass} />
    </div>
  );
}

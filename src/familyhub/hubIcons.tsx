import React from 'react';
import { type LucideProps } from 'lucide-react';
import { resolveHubIcon } from './resolveHubIcon';

export interface HubIconProps extends LucideProps {
  glyph: string;
}

export const HubIcon: React.FC<HubIconProps> = ({ glyph, className, size = 22, ...props }) => {
  const Icon = resolveHubIcon(glyph);
  return <Icon className={className} size={size} aria-hidden={props['aria-label'] ? undefined : true} {...props} />;
};

export interface HubIconBadgeProps {
  glyph: string;
  size?: number;
  className?: string;
  iconClassName?: string;
}

/** Icon inside a rounded badge — used on cards and lists */
export const HubIconBadge: React.FC<HubIconBadgeProps> = ({
  glyph,
  size = 22,
  className = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  iconClassName,
}) => {
  const Icon = resolveHubIcon(glyph);
  return (
    <span className={className}>
      <Icon size={size} className={iconClassName} aria-hidden />
    </span>
  );
};

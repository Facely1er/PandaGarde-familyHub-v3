import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useHubI18n } from '../hubI18n';

const shellClass =
  'inline-flex h-8 w-full min-w-0 gap-0.5 rounded-md border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-600 dark:bg-gray-900/40 sm:w-auto';

const optionClass = (selected: boolean) =>
  [
    'inline-flex min-h-[32px] min-w-0 flex-1 items-center justify-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition-colors sm:gap-1.5 sm:px-2.5 sm:text-sm',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-800',
    selected
      ? 'bg-white text-teal-700 shadow-sm ring-1 ring-teal-600/20 dark:bg-gray-800 dark:text-teal-300 dark:ring-teal-500/30'
      : 'text-gray-600 hover:bg-white/90 hover:opacity-100 dark:text-gray-300 dark:hover:bg-gray-800/90',
  ].join(' ');

type HubThemeToggleProps = {
  className?: string;
};

const HubThemeToggle: React.FC<HubThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useHubI18n();
  const isDark = theme === 'dark';

  return (
    <div
      className={`hub-theme-toggle shrink-0 ${className}`.trim()}
      role="radiogroup"
      aria-label={t('hub.settings.theme')}
    >
      <div className={shellClass}>
        <button
          type="button"
          role="radio"
          aria-checked={!isDark}
          aria-label={t('hub.settings.lightMode')}
          title={t('hub.settings.lightMode')}
          onClick={() => {
            if (isDark) toggleTheme();
          }}
          className={optionClass(!isDark)}
        >
          <Sun size={14} aria-hidden="true" />
          <span>{t('hub.settings.lightMode')}</span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={isDark}
          aria-label={t('hub.settings.darkMode')}
          title={t('hub.settings.darkMode')}
          onClick={() => {
            if (!isDark) toggleTheme();
          }}
          className={optionClass(isDark)}
        >
          <Moon size={14} aria-hidden="true" />
          <span>{t('hub.settings.darkMode')}</span>
        </button>
      </div>
    </div>
  );
};

export default HubThemeToggle;

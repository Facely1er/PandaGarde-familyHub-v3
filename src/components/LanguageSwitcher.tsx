import React from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n';

const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  en: '🇺🇸',
  fr: '🇫🇷',
  es: '🇪🇸',
};

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
};

type LanguageSwitcherProps = {
  className?: string;
  variant?: 'default' | 'toolbar' | 'segmented' | 'hub';
  /** Slightly tighter segmented control for dense Family Hub settings */
  compact?: boolean;
};

const segmentedGroupClass = (compact: boolean) =>
  compact
    ? 'language-switcher__segmented inline-flex h-8 w-full min-w-0 gap-0.5 rounded-md border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-600 dark:bg-gray-900/40 sm:w-auto'
    : 'language-switcher__segmented inline-flex w-full min-w-0 gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-gray-600 dark:bg-gray-900/50 sm:w-auto';

const segmentedButtonClass = (selected: boolean, compact: boolean) =>
  [
    compact
      ? 'inline-flex min-h-[32px] min-w-0 flex-1 items-center justify-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition-colors sm:gap-1.5 sm:px-2.5 sm:text-sm'
      : 'inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800',
    selected
      ? 'bg-white text-teal-700 shadow-sm ring-1 ring-teal-600/30 dark:bg-gray-800 dark:text-teal-300 dark:ring-teal-500/40'
      : 'text-gray-600 hover:bg-white/70 dark:text-gray-300 dark:hover:bg-gray-800/70',
  ].join(' ');

const hubButtonClass =
  'relative flex h-8 w-8 items-center justify-center rounded-md text-base leading-none text-gray-500 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-gray-400 dark:hover:bg-gray-700';

function nextLanguage(current: SupportedLanguage): SupportedLanguage {
  const index = SUPPORTED_LANGUAGES.indexOf(current);
  return SUPPORTED_LANGUAGES[(index + 1) % SUPPORTED_LANGUAGES.length] ?? 'en';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'default',
  compact = false,
}) => {
  const { t, i18n } = useTranslation();
  const selectId = React.useId();
  const groupId = React.useId();
  const currentLang = (i18n.resolvedLanguage?.split('-')[0] ?? 'en') as SupportedLanguage;

  const handleSelect = (code: SupportedLanguage) => {
    if (code !== currentLang) {
      void i18n.changeLanguage(code);
    }
  };

  if (variant === 'hub') {
    const cycleLanguage = () => {
      void i18n.changeLanguage(nextLanguage(currentLang));
    };

    return (
      <div className={`language-switcher language-switcher--hub ${className}`.trim()}>
        <button
          type="button"
          className={hubButtonClass}
          onClick={cycleLanguage}
          aria-label={`${LANGUAGE_LABELS[currentLang]} — ${t('common.selectLanguage')}`}
          title={`${LANGUAGE_LABELS[currentLang]} — ${t('common.selectLanguage')}`}
        >
          <span aria-hidden="true">{LANGUAGE_FLAGS[currentLang]}</span>
        </button>
      </div>
    );
  }

  if (variant === 'segmented') {
    return (
      <div
        className={`language-switcher language-switcher--segmented ${className}`.trim()}
        role="radiogroup"
        id={groupId}
        aria-label={t('common.selectLanguage')}
      >
        <div className={segmentedGroupClass(compact)}>
          {SUPPORTED_LANGUAGES.map((code) => {
            const selected = currentLang === code;
            return (
              <button
                key={code}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={LANGUAGE_LABELS[code]}
                title={LANGUAGE_LABELS[code]}
                onClick={() => handleSelect(code)}
                className={segmentedButtonClass(selected, compact)}
              >
                <span className="text-base leading-none" aria-hidden="true">
                  {LANGUAGE_FLAGS[code]}
                </span>
                <span className="truncate">{LANGUAGE_LABELS[code]}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    void i18n.changeLanguage(event.target.value);
  };

  const isToolbar = variant === 'toolbar';

  return (
    <div
      className={`language-switcher ${isToolbar ? 'language-switcher--toolbar' : ''} ${className}`.trim()}
    >
      <label htmlFor={selectId} className="sr-only">
        {t('common.selectLanguage')}
      </label>
      <div className={`language-switcher__control${isToolbar ? ' header-icon-btn' : ''}`.trim()}>
        {isToolbar ? (
          <span className="language-switcher__flag" aria-hidden="true">
            {LANGUAGE_FLAGS[currentLang]}
          </span>
        ) : null}
        <select
          id={selectId}
          className="language-switcher__select"
          value={currentLang}
          onChange={handleChange}
          aria-label={t('common.selectLanguage')}
          title={LANGUAGE_LABELS[currentLang]}
        >
          {SUPPORTED_LANGUAGES.map((code) => (
            <option key={code} value={code} aria-label={LANGUAGE_LABELS[code]}>
              {LANGUAGE_FLAGS[code]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;

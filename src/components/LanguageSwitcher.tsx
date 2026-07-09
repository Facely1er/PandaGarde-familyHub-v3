import React, { useId } from 'react';
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
  variant?: 'toolbar' | 'default';
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'default',
}) => {
  const { t, i18n } = useTranslation();
  const selectId = useId();
  const currentLang = (i18n.resolvedLanguage?.split('-')[0] ?? 'en') as SupportedLanguage;

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
      <div
        className={`language-switcher__control${isToolbar ? ' header-icon-btn' : ''}`.trim()}
      >
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

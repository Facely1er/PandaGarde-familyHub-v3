import React, { useId } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
};

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  compact = false,
}) => {
  const { t, i18n } = useTranslation();
  const selectId = useId();
  const currentLang = (i18n.resolvedLanguage?.split('-')[0] ?? 'en') as SupportedLanguage;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    void i18n.changeLanguage(event.target.value);
  };

  return (
    <div className={`language-switcher ${className}`.trim()}>
      <label htmlFor={selectId} className="sr-only">
        {t('common.selectLanguage')}
      </label>
      <div className="language-switcher__control">
        <Globe size={16} className="language-switcher__icon" aria-hidden />
        <select
          id={selectId}
          className="language-switcher__select"
          value={currentLang}
          onChange={handleChange}
          aria-label={t('common.selectLanguage')}
          title={t('common.language')}
        >
          {SUPPORTED_LANGUAGES.map((code) => (
            <option key={code} value={code}>
              {compact ? code.toUpperCase() : LANGUAGE_LABELS[code]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;

import React, { useId, useState } from 'react';
import { Moon, Sun, Shield, HelpCircle, ExternalLink, Home, Scale, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { hubTheme } from '../hubTheme';
import HubPageLayout from '../components/HubPageLayout';
import HubWebsiteLink from '../components/HubWebsiteLink';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useHubI18n } from '../hubI18n';
import {
  clearPremiumEntitlement,
  isPremiumActive,
  loadPremiumEntitlement,
  PREMIUM_PRICING_LABEL,
  unlockPremiumWithCode,
} from '../../lib/premiumEntitlement';

const externalLinkClass =
  'inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:underline dark:text-teal-400';

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useHubI18n();
  const isDark = theme === 'dark';
  const unlockInputId = useId();
  const [premiumActive, setPremiumActive] = useState(() => isPremiumActive());
  const [unlockCode, setUnlockCode] = useState('');
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  const handleUnlock = () => {
    const result = unlockPremiumWithCode(unlockCode);
    if (result.success) {
      setPremiumActive(true);
      setUnlockMessage(t('hub.settings.premiumUnlockedMessage'));
      setUnlockError(null);
      setUnlockCode('');
    } else {
      setUnlockError(result.error ?? t('hub.settings.premiumUnlockFailed'));
      setUnlockMessage(null);
    }
  };

  const handleClearPremium = () => {
    clearPremiumEntitlement();
    setPremiumActive(false);
    setUnlockMessage(null);
    setUnlockError(null);
  };

  const entitlement = loadPremiumEntitlement();

  return (
    <HubPageLayout>
      <header>
        <h1 className={`mb-2 text-2xl font-bold ${hubTheme.heading}`}>{t('hub.settings.title')}</h1>
        <p className={hubTheme.body}>{t('hub.settings.subtitle')}</p>
      </header>

      <section className={`${hubTheme.card} p-5 sm:p-6`} aria-labelledby="settings-language-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="settings-language-heading" className={`font-semibold ${hubTheme.heading}`}>
              {t('hub.settings.language')}
            </h2>
            <p className={`mt-1 text-sm ${hubTheme.body}`}>{t('hub.settings.languageHint')}</p>
          </div>
          <LanguageSwitcher className="shrink-0" />
        </div>
      </section>

      <section className={`${hubTheme.card} p-5 sm:p-6`} aria-labelledby="settings-theme-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon className="shrink-0 text-teal-600 dark:text-teal-400" size={20} aria-hidden />
            ) : (
              <Sun className="shrink-0 text-teal-600 dark:text-teal-400" size={20} aria-hidden />
            )}
            <div>
              <h2 id="settings-theme-heading" className={`font-semibold ${hubTheme.heading}`}>
                {t('hub.settings.theme')}
              </h2>
              <p className={`text-sm ${hubTheme.body}`}>
                {isDark ? t('hub.settings.darkMode') : t('hub.settings.lightMode')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={isDark}
            aria-label={isDark ? t('hub.settings.switchToLight') : t('hub.settings.switchToDark')}
            className="w-full shrink-0 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg active:scale-[0.98] min-h-[44px] sm:w-auto dark:shadow-[0_0_20px_rgba(45,212,191,0.2)] dark:hover:shadow-[0_0_28px_rgba(45,212,191,0.3)]"
          >
            {t('hub.settings.switchTheme', { mode: isDark ? t('hub.settings.lightMode') : t('hub.settings.darkMode') })}
          </button>
        </div>
      </section>

      <section className={`${hubTheme.card} p-5 sm:p-6`} aria-labelledby="settings-premium-heading">
        {premiumActive ? (
          <>
            <div className="mb-3 flex items-center gap-3">
              <Sparkles className="shrink-0 text-violet-600 dark:text-violet-400" size={20} aria-hidden />
              <h2 id="settings-premium-heading" className={`font-semibold ${hubTheme.heading}`}>
                {t('hub.settings.premiumTitle')}
              </h2>
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-violet-800 dark:bg-violet-900/40 dark:text-violet-200">
                {t('hub.settings.premiumActive')}
              </span>
            </div>
            <p className={`mb-3 text-sm ${hubTheme.body}`}>{t('hub.settings.premiumCustomize')}</p>
            {entitlement.unlockedAt && (
              <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                {t('hub.settings.premiumUnlocked', {
                  date: new Date(entitlement.unlockedAt).toLocaleDateString(),
                  source: entitlement.source ? ` · ${entitlement.source}` : '',
                })}
              </p>
            )}
            <button
              type="button"
              onClick={handleClearPremium}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[44px] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {t('hub.settings.premiumSignOut')}
            </button>
          </>
        ) : (
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex min-w-0 items-center gap-3">
                <Sparkles className="shrink-0 text-violet-600 dark:text-violet-400" size={20} aria-hidden />
                <span className="min-w-0">
                  <span id="settings-premium-heading" className={`block font-semibold ${hubTheme.heading}`}>
                    {t('hub.settings.premiumTitle')}
                  </span>
                  <span className={`mt-0.5 block text-xs ${hubTheme.muted}`}>
                    {t('hub.settings.premiumPricing', { price: PREMIUM_PRICING_LABEL })}
                  </span>
                </span>
              </span>
              <span className="shrink-0 text-xs font-medium text-violet-600 group-open:hidden dark:text-violet-400">
                {t('hub.settings.premiumLearnMore')}
              </span>
            </summary>
            <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 dark:border-gray-700">
              <p className={`text-sm ${hubTheme.body}`}>{t('hub.settings.premiumBody')}</p>
              <p className={`text-sm ${hubTheme.body}`}>{t('hub.settings.premiumPilot')}</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <label htmlFor={unlockInputId} className="sr-only">
                    {t('hub.settings.premiumUnlockCode')}
                  </label>
                  <input
                    id={unlockInputId}
                    type="text"
                    value={unlockCode}
                    onChange={(e) => setUnlockCode(e.target.value)}
                    placeholder={t('hub.settings.premiumUnlockPlaceholder')}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 min-h-[44px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUnlock}
                  className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 min-h-[44px] sm:shrink-0"
                >
                  {t('hub.settings.premiumUnlock')}
                </button>
              </div>
              {unlockMessage && (
                <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
                  {unlockMessage}
                </p>
              )}
              {unlockError && (
                <p className="text-sm text-red-700 dark:text-red-300" role="alert">
                  {unlockError}
                </p>
              )}
            </div>
          </details>
        )}
      </section>

      <section className={`${hubTheme.card} p-5 sm:p-6`} aria-labelledby="settings-privacy-heading">
        <div className="mb-4 flex items-center gap-3">
          <Shield className="shrink-0 text-teal-600 dark:text-teal-400" size={20} aria-hidden />
          <h2 id="settings-privacy-heading" className={`font-semibold ${hubTheme.heading}`}>
            {t('hub.settings.privacyTitle')}
          </h2>
        </div>
        <p className={`mb-4 text-sm ${hubTheme.body}`}>{t('hub.settings.privacyBody')}</p>
        <HubWebsiteLink path="/privacy" className={externalLinkClass}>
          {t('hub.settings.viewPrivacyPolicy')}
          <ExternalLink size={14} aria-hidden />
        </HubWebsiteLink>
      </section>

      <section className={`${hubTheme.card} p-5 sm:p-6`} aria-labelledby="settings-legal-heading">
        <div className="mb-4 flex items-center gap-3">
          <Scale className="shrink-0 text-teal-600 dark:text-teal-400" size={20} aria-hidden />
          <h2 id="settings-legal-heading" className={`font-semibold ${hubTheme.heading}`}>
            {t('hub.settings.legalTitle')}
          </h2>
        </div>
        <ul className="space-y-3">
          <li>
            <HubWebsiteLink path="/terms" className={externalLinkClass}>
              {t('hub.settings.terms')}
            </HubWebsiteLink>
          </li>
          <li>
            <HubWebsiteLink path="/cookies" className={externalLinkClass}>
              {t('hub.settings.cookies')}
            </HubWebsiteLink>
          </li>
          <li>
            <HubWebsiteLink path="/accessibility" className={externalLinkClass}>
              {t('hub.settings.accessibility')}
            </HubWebsiteLink>
          </li>
          <li>
            <HubWebsiteLink path="/legal" className={externalLinkClass}>
              {t('hub.settings.legalOverview')}
            </HubWebsiteLink>
          </li>
        </ul>
      </section>

      <section className={`${hubTheme.card} p-5 sm:p-6`} aria-labelledby="settings-help-heading">
        <div className="mb-4 flex items-center gap-3">
          <HelpCircle className="shrink-0 text-teal-600 dark:text-teal-400" size={20} aria-hidden />
          <h2 id="settings-help-heading" className={`font-semibold ${hubTheme.heading}`}>
            {t('hub.settings.helpTitle')}
          </h2>
        </div>
        <ul className="space-y-3">
          <li>
            <HubWebsiteLink path="/faq" className={externalLinkClass}>
              {t('hub.settings.faq')}
            </HubWebsiteLink>
          </li>
          <li>
            <HubWebsiteLink path="/contact" className={externalLinkClass}>
              {t('hub.settings.contact')}
            </HubWebsiteLink>
          </li>
          <li>
            <HubWebsiteLink path="/" className={externalLinkClass}>
              <Home size={14} aria-hidden />
              {t('hub.settings.backToWebsite')}
            </HubWebsiteLink>
          </li>
        </ul>
      </section>
    </HubPageLayout>
  );
};

export default SettingsScreen;

import React, { useId, useState } from 'react';
import { Shield, HelpCircle, ExternalLink, Home, Scale, Sparkles } from 'lucide-react';
import { hubTheme } from '../hubTheme';
import HubPageLayout from '../components/HubPageLayout';
import HubThemeToggle from '../components/HubThemeToggle';
import HubWebsiteLink from '../components/HubWebsiteLink';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useHubI18n } from '../hubI18n';
import {
  clearPremiumEntitlement,
  isPremiumActive,
  loadPremiumEntitlement,
  unlockPremiumWithCode,
} from '../../lib/premiumEntitlement';
import { HUB_SUPPORT_EMAIL } from '../constants';

const externalLinkClass =
  'inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:underline dark:text-teal-400';

const settingsInlineRow =
  'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3';

const SettingsScreen: React.FC = () => {
  const { t } = useHubI18n();
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

  const legalLinks = [
    { path: '/terms', label: t('hub.settings.terms') },
    { path: '/cookies', label: t('hub.settings.cookies') },
    { path: '/accessibility', label: t('hub.settings.accessibility') },
    { path: '/legal', label: t('hub.settings.legalOverview') },
  ] as const;

  const helpLinks = [
    { path: '/faq', label: t('hub.settings.faq') },
    { path: '/contact', label: t('hub.settings.contact') },
    { path: '/', label: t('hub.settings.backToWebsite'), icon: Home },
  ] as const;

  return (
    <HubPageLayout maxWidth="4xl">
      <header className="space-y-0.5">
        <h1 className={`text-xl font-bold sm:text-2xl ${hubTheme.heading}`}>{t('hub.settings.title')}</h1>
        <p className={`text-sm ${hubTheme.body}`}>{t('hub.settings.subtitle')}</p>
      </header>

      <section
        className={`${hubTheme.cardCompact} divide-y divide-gray-100 dark:divide-gray-700`}
        aria-label={t('hub.settings.language')}
      >
        <div className={`${settingsInlineRow} pb-2.5`}>
          <div className="min-w-0">
            <h2 id="settings-language-heading" className={`text-sm font-semibold ${hubTheme.heading}`}>
              {t('hub.settings.language')}
            </h2>
            <p className={`hidden sm:mt-0.5 sm:block sm:text-xs ${hubTheme.body}`}>
              {t('hub.settings.languageHint')}
            </p>
          </div>
          <LanguageSwitcher variant="segmented" compact className="w-full sm:w-auto sm:shrink-0" />
        </div>

        <div className={`${settingsInlineRow} pt-2.5`}>
          <h2 id="settings-theme-heading" className={`shrink-0 text-sm font-semibold ${hubTheme.heading}`}>
            {t('hub.settings.theme')}
          </h2>
          <HubThemeToggle className="w-full sm:w-auto" />
        </div>
      </section>

      <section className={hubTheme.cardCompact} aria-labelledby="settings-premium-heading">
        {premiumActive ? (
          <>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Sparkles className="shrink-0 text-violet-600 dark:text-violet-400" size={18} aria-hidden />
              <h2 id="settings-premium-heading" className={`text-sm font-semibold ${hubTheme.heading}`}>
                {t('hub.settings.premiumTitle')}
              </h2>
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-800 dark:bg-violet-900/40 dark:text-violet-200">
                {t('hub.settings.premiumActive')}
              </span>
            </div>
            <p className={`mb-2 text-sm ${hubTheme.body}`}>{t('hub.settings.premiumCustomize')}</p>
            {entitlement.unlockedAt && (
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {t('hub.settings.premiumUnlocked', {
                  date: new Date(entitlement.unlockedAt).toLocaleDateString(),
                  source: entitlement.source ? ` · ${entitlement.source}` : '',
                })}
              </p>
            )}
            <button
              type="button"
              onClick={handleClearPremium}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[40px] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {t('hub.settings.premiumSignOut')}
            </button>
          </>
        ) : (
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex min-w-0 items-center gap-2.5">
                <Sparkles className="shrink-0 text-violet-600 dark:text-violet-400" size={18} aria-hidden />
                <span className="min-w-0">
                  <span id="settings-premium-heading" className={`block text-sm font-semibold ${hubTheme.heading}`}>
                    {t('hub.settings.premiumTitle')}
                  </span>
                  <span className={`mt-0.5 block text-xs ${hubTheme.muted}`}>
                    {t('hub.settings.premiumPilotBadge')}
                  </span>
                </span>
              </span>
              <span className="shrink-0 text-xs font-medium text-violet-600 group-open:hidden dark:text-violet-400">
                {t('hub.settings.premiumLearnMore')}
              </span>
            </summary>
            <div className="mt-3 space-y-2.5 border-t border-gray-100 pt-3 dark:border-gray-700">
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
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 min-h-[40px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUnlock}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 min-h-[40px] sm:shrink-0"
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

      <section className={`${hubTheme.cardCompact} space-y-2.5`} aria-labelledby="settings-privacy-heading">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Shield className="shrink-0 text-teal-600 dark:text-teal-400" size={16} aria-hidden />
            <h2 id="settings-privacy-heading" className={`text-sm font-semibold ${hubTheme.heading}`}>
              {t('hub.settings.privacyTitle')}
            </h2>
          </div>
          <p className={`mb-1.5 text-xs leading-snug sm:text-sm ${hubTheme.body}`}>
            {t('hub.settings.privacyBody')}
          </p>
          <HubWebsiteLink path="/privacy" className={externalLinkClass}>
            {t('hub.settings.viewPrivacyPolicy')}
            <ExternalLink size={14} aria-hidden />
          </HubWebsiteLink>
        </div>

        <div className="border-t border-gray-100 pt-2 dark:border-gray-700">
          <div className="mb-1 flex items-center gap-2">
            <Scale className="shrink-0 text-teal-600 dark:text-teal-400" size={16} aria-hidden />
            <h2 id="settings-legal-heading" className={`text-sm font-semibold ${hubTheme.heading}`}>
              {t('hub.settings.legalTitle')}
            </h2>
          </div>
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-3">
            {legalLinks.map(({ path, label }) => (
              <li key={path}>
                <HubWebsiteLink path={path} className={externalLinkClass}>
                  {label}
                </HubWebsiteLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-100 pt-2 dark:border-gray-700">
          <div className="mb-1 flex items-center gap-2">
            <HelpCircle className="shrink-0 text-teal-600 dark:text-teal-400" size={16} aria-hidden />
            <h2 id="settings-help-heading" className={`text-sm font-semibold ${hubTheme.heading}`}>
              {t('hub.settings.helpTitle')}
            </h2>
          </div>
          <ul className="space-y-1">
            <li>
              <a href={`mailto:${HUB_SUPPORT_EMAIL}`} className={externalLinkClass}>
                {t('hub.settings.supportEmail', { email: HUB_SUPPORT_EMAIL })}
                <ExternalLink size={14} aria-hidden />
              </a>
            </li>
            {helpLinks.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <HubWebsiteLink path={path} className={externalLinkClass}>
                  {Icon ? <Icon size={14} aria-hidden /> : null}
                  {label}
                </HubWebsiteLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </HubPageLayout>
  );
};

export default SettingsScreen;

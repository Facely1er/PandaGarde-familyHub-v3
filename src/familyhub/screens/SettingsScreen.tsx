import React, { useId, useState } from 'react';
import { Moon, Sun, Shield, HelpCircle, ExternalLink, Home, Scale, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { hubTheme } from '../hubTheme';
import HubPageLayout from '../components/HubPageLayout';
import HubWebsiteLink from '../components/HubWebsiteLink';
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
      setUnlockMessage('Premium unlocked on this device.');
      setUnlockError(null);
      setUnlockCode('');
    } else {
      setUnlockError(result.error ?? 'Unlock failed.');
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
        <h1 className={`mb-2 text-2xl font-bold ${hubTheme.heading}`}>Settings</h1>
        <p className={hubTheme.body}>Manage your app preferences and access help resources.</p>
      </header>

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
                Theme
              </h2>
              <p className={`text-sm ${hubTheme.body}`}>{isDark ? 'Dark mode' : 'Light mode'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={isDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-full shrink-0 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg active:scale-[0.98] min-h-[44px] sm:w-auto dark:shadow-[0_0_20px_rgba(45,212,191,0.2)] dark:hover:shadow-[0_0_28px_rgba(45,212,191,0.3)]"
          >
            Switch to {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </section>

      <section className={`${hubTheme.card} p-5 sm:p-6`} aria-labelledby="settings-premium-heading">
        <div className="mb-4 flex items-center gap-3">
          <Sparkles className="shrink-0 text-violet-600 dark:text-violet-400" size={20} aria-hidden />
          <h2 id="settings-premium-heading" className={`font-semibold ${hubTheme.heading}`}>
            Premium missions
          </h2>
        </div>
        <p className={`mb-3 text-sm ${hubTheme.body}`}>
          Footprint review on the website stays free. Premium adds personalized real-life scenarios in Family
          Hub — use your app list or write your own situations to teach privacy with examples that fit your
          family.
        </p>
        <p className={`mb-4 text-sm font-medium ${hubTheme.heading}`}>
          {premiumActive ? (
            <span className="text-violet-700 dark:text-violet-300">Active on this device</span>
          ) : (
            <span>
              {PREMIUM_PRICING_LABEL} · subscription coming to app stores
            </span>
          )}
        </p>
        {premiumActive ? (
          <div className="space-y-3">
            <p className={`text-sm ${hubTheme.body}`}>
              Open any mission and tap <strong>Customize</strong> to set your child&apos;s app, name, or a
              custom scenario. Changes stay on this device.
            </p>
            {entitlement.unlockedAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Unlocked {new Date(entitlement.unlockedAt).toLocaleDateString()}
                {entitlement.source ? ` · ${entitlement.source}` : ''}
              </p>
            )}
            <button
              type="button"
              onClick={handleClearPremium}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[44px] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Sign out of Premium (this device)
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className={`text-sm ${hubTheme.body}`}>
              Have a pilot code? Enter it below to try personalized missions before subscriptions launch.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <div className="flex-1">
                <label htmlFor={unlockInputId} className="sr-only">
                  Premium unlock code
                </label>
                <input
                  id={unlockInputId}
                  type="text"
                  value={unlockCode}
                  onChange={(e) => setUnlockCode(e.target.value)}
                  placeholder="Enter unlock code"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 min-h-[44px]"
                />
              </div>
              <button
                type="button"
                onClick={handleUnlock}
                className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 min-h-[44px] sm:shrink-0"
              >
                Unlock
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
        )}
      </section>

      <section className={`${hubTheme.card} p-5 sm:p-6`} aria-labelledby="settings-privacy-heading">
        <div className="mb-4 flex items-center gap-3">
          <Shield className="shrink-0 text-teal-600 dark:text-teal-400" size={20} aria-hidden />
          <h2 id="settings-privacy-heading" className={`font-semibold ${hubTheme.heading}`}>
            Privacy
          </h2>
        </div>
        <p className={`mb-4 text-sm ${hubTheme.body}`}>
          Your privacy is important to us. All data is stored locally on your device and is never shared with
          third parties.
        </p>
        <HubWebsiteLink path="/privacy" className={externalLinkClass}>
          View Privacy Policy
          <ExternalLink size={14} aria-hidden />
        </HubWebsiteLink>
      </section>

      <section className={`${hubTheme.card} p-5 sm:p-6`} aria-labelledby="settings-legal-heading">
        <div className="mb-4 flex items-center gap-3">
          <Scale className="shrink-0 text-teal-600 dark:text-teal-400" size={20} aria-hidden />
          <h2 id="settings-legal-heading" className={`font-semibold ${hubTheme.heading}`}>
            Legal
          </h2>
        </div>
        <ul className="space-y-3">
          <li>
            <HubWebsiteLink path="/terms" className={externalLinkClass}>
              Terms of Service
            </HubWebsiteLink>
          </li>
          <li>
            <HubWebsiteLink path="/cookies" className={externalLinkClass}>
              Cookie Policy
            </HubWebsiteLink>
          </li>
          <li>
            <HubWebsiteLink path="/accessibility" className={externalLinkClass}>
              Accessibility Statement
            </HubWebsiteLink>
          </li>
          <li>
            <HubWebsiteLink path="/legal" className={externalLinkClass}>
              Legal Overview
            </HubWebsiteLink>
          </li>
        </ul>
      </section>

      <section className={`${hubTheme.card} p-5 sm:p-6`} aria-labelledby="settings-help-heading">
        <div className="mb-4 flex items-center gap-3">
          <HelpCircle className="shrink-0 text-teal-600 dark:text-teal-400" size={20} aria-hidden />
          <h2 id="settings-help-heading" className={`font-semibold ${hubTheme.heading}`}>
            Help &amp; Support
          </h2>
        </div>
        <ul className="space-y-3">
          <li>
            <HubWebsiteLink path="/faq" className={externalLinkClass}>
              Frequently Asked Questions
            </HubWebsiteLink>
          </li>
          <li>
            <HubWebsiteLink path="/contact" className={externalLinkClass}>
              Contact Support
            </HubWebsiteLink>
          </li>
          <li>
            <HubWebsiteLink path="/" className={externalLinkClass}>
              <Home size={14} aria-hidden />
              Back to PandaGarde website
            </HubWebsiteLink>
          </li>
        </ul>
      </section>
    </HubPageLayout>
  );
};

export default SettingsScreen;

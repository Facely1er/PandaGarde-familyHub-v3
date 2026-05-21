import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Shield, HelpCircle, ExternalLink, Home } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const externalLinkClass =
  'inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:underline dark:text-teal-400';

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your app preferences and access help resources.
        </p>
      </div>

      <div className="space-y-4">
        <section className="theme-card p-5 sm:p-6" aria-labelledby="settings-theme-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="shrink-0 text-teal-600 dark:text-teal-400" size={20} aria-hidden />
              ) : (
                <Sun className="shrink-0 text-teal-600 dark:text-teal-400" size={20} aria-hidden />
              )}
              <div>
                <h2 id="settings-theme-heading" className="font-semibold text-gray-900 dark:text-white">
                  Theme
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isDark ? 'Dark mode' : 'Light mode'}
                </p>
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

        <section className="theme-card p-5 sm:p-6" aria-labelledby="settings-privacy-heading">
          <div className="mb-4 flex items-center gap-3">
            <Shield className="shrink-0 text-teal-600 dark:text-teal-400" size={20} aria-hidden />
            <h2 id="settings-privacy-heading" className="font-semibold text-gray-900 dark:text-white">
              Privacy
            </h2>
          </div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Your privacy is important to us. All data is stored locally on your device and is never
            shared with third parties.
          </p>
          <Link to="/privacy" className={externalLinkClass}>
            View Privacy Policy
            <ExternalLink size={14} aria-hidden />
          </Link>
        </section>

        <section className="theme-card p-5 sm:p-6" aria-labelledby="settings-help-heading">
          <div className="mb-4 flex items-center gap-3">
            <HelpCircle className="shrink-0 text-teal-600 dark:text-teal-400" size={20} aria-hidden />
            <h2 id="settings-help-heading" className="font-semibold text-gray-900 dark:text-white">
              Help &amp; Support
            </h2>
          </div>
          <ul className="space-y-3">
            <li>
              <Link to="/faq" className={externalLinkClass}>
                Frequently Asked Questions
              </Link>
            </li>
            <li>
              <Link to="/contact" className={externalLinkClass}>
                Contact Support
              </Link>
            </li>
            <li>
              <a href="/" className={externalLinkClass}>
                <Home size={14} aria-hidden />
                Back to PandaGarde website
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default SettingsScreen;

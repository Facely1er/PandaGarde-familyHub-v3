import React from 'react';
import { Moon, Sun, Shield, HelpCircle, ExternalLink } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your app preferences and access help resources.
        </p>
      </div>

      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="text-teal-600 dark:text-teal-400" size={20} />
              ) : (
                <Sun className="text-teal-600 dark:text-teal-400" size={20} />
              )}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Theme</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors min-h-[44px] font-medium"
            >
              Switch to {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        {/* Privacy Statement */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-teal-600 dark:text-teal-400" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Privacy</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Your privacy is important to us. All data is stored locally on your device and is never shared with third parties.
          </p>
          <a
            href="https://www.pandagarde.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-2 text-sm font-medium"
          >
            View Privacy Policy
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Help & Support */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="text-teal-600 dark:text-teal-400" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Help & Support</h3>
          </div>
          <div className="space-y-3">
            <a
              href="https://www.pandagarde.com/faq"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-2 text-sm font-medium"
            >
              Frequently Asked Questions
              <ExternalLink size={14} />
            </a>
            <a
              href="https://www.pandagarde.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-2 text-sm font-medium"
            >
              Contact Support
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;


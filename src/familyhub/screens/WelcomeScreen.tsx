import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink, Shield, Users, Gamepad2, Award } from 'lucide-react';
import { setHubOrigin } from '../../lib/hubMission';
import { openExternalUrl } from '../../lib/openExternalUrl';
import AgeBandStrip from '../components/AgeBandStrip';
import HubBrandLogo from '../components/HubBrandLogo';
import { HUB_WELCOMED_KEY } from '../constants';
import { hubPaths, pandagardeWebsiteUrl } from '../hubPaths';
import { hubTheme } from '../hubTheme';

export { HUB_WELCOMED_KEY };

const sections = [
  {
    icon: Users,
    title: 'Family Members',
    description: 'Add your kids and guardians to track everyone\'s progress together.',
    color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30',
  },
  {
    icon: Gamepad2,
    title: 'Activities',
    description: 'Age-matched privacy missions for ages 5–17 — grounded in real-life scenarios.',
    color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30',
  },
  {
    icon: Award,
    title: 'Journey',
    description: 'Mission progress, badges, and certificates for activities your family completes here.',
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30',
  },
];

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setHubOrigin('standalone');
    localStorage.setItem(HUB_WELCOMED_KEY, 'true');
    navigate(hubPaths.dashboard, { replace: true });
  };

  return (
    <div className={`family-hub-theme ${hubTheme.page}`}>
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:py-12">
        <div className="max-w-xl mx-auto space-y-8">

          {/* Hero */}
          <div className="text-center space-y-4">
            <HubBrandLogo size="hero" variant="plain" animated className="mx-auto" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Welcome to your<br />
                <span className="text-teal-600 dark:text-teal-400">Family Hub</span>
              </h1>
              <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300">
                Play short privacy missions together — real situations, family talks, and fun practice for ages 5–17. Everything stays on this device.
              </p>
            </div>
          </div>

          <AgeBandStrip title="Three adventure paths" />

          {/* What's inside */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              What's inside
            </h2>
            <ul className="grid gap-3">
              {sections.map(({ icon: Icon, title, description, color }) => (
                <li
                  key={title}
                  className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                >
                  <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">{title}</span>
                    <span className="block text-xs text-gray-600 dark:text-gray-400">{description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Parent{' '}
            <button
              type="button"
              onClick={() => openExternalUrl(pandagardeWebsiteUrl)}
              className="inline-flex items-center gap-1 font-medium text-teal-700 hover:underline dark:text-teal-400"
            >
              Digital Footprint Analysis
              <ExternalLink size={14} aria-hidden="true" />
            </button>{' '}
            lives on the PandaGarde website — separate from these kids&apos; missions.
          </p>

          {/* Privacy note */}
          <div className="flex items-start gap-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 text-sm text-green-800 dark:text-green-200">
            <Shield size={18} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
            <p>
              <strong>Your data stays on this device.</strong> The Family Hub is local-first — no account, no server, no data leaving your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur border-t border-gray-200 dark:border-gray-700 px-4 py-4 safe-area-bottom">
        <div className="max-w-xl mx-auto flex flex-col gap-2">
          <button
            type="button"
            onClick={handleGetStarted}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-teal-700 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            Enter Family Hub
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

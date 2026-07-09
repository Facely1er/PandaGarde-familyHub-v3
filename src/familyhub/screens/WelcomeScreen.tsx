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
import { useHubI18n } from '../hubI18n';

export { HUB_WELCOMED_KEY };

const WelcomeScreen: React.FC = () => {
  const { t } = useHubI18n();
  const navigate = useNavigate();

  const sections = [
    {
      icon: Users,
      title: t('hub.welcome.sections.family.title'),
      description: t('hub.welcome.sections.family.description'),
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30',
    },
    {
      icon: Gamepad2,
      title: t('hub.welcome.sections.mission.title'),
      description: t('hub.welcome.sections.mission.description'),
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30',
    },
    {
      icon: Award,
      title: t('hub.welcome.sections.progress.title'),
      description: t('hub.welcome.sections.progress.description'),
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30',
    },
  ];

  const handleGetStarted = () => {
    setHubOrigin('standalone');
    localStorage.setItem(HUB_WELCOMED_KEY, 'true');
    navigate(hubPaths.dashboard, { replace: true });
  };

  return (
    <div className={`family-hub-theme hub-standalone-page ${hubTheme.page}`}>
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-[var(--hub-content-pt,1rem)] sm:pt-6">
        <div className="mx-auto max-w-xl space-y-4 sm:space-y-5">
          <div className="space-y-2 text-center">
            <HubBrandLogo size="md" variant="plain" className="mx-auto" alt="" />
            <div>
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                {t('hub.welcome.title')}{' '}
                <span className="text-teal-600 dark:text-teal-400">{t('hub.welcome.titleHighlight')}</span>
              </h1>
              <p className="mx-auto mt-1.5 max-w-sm text-sm leading-snug text-gray-600 dark:text-gray-300">
                {t('hub.welcomeLead')}
              </p>
            </div>
          </div>

          <AgeBandStrip title={t('hub.welcome.adventurePaths')} density="compact" />

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t('hub.welcome.whatsInside')}
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
            {t('hub.welcome.websiteNote')}
          </p>

          <div className="flex items-start gap-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 text-sm text-green-800 dark:text-green-200">
            <Shield size={18} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
            <p>
              <strong>{t('hub.welcome.privacyStrong')}</strong> {t('hub.welcome.privacyNote')}
            </p>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-gray-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-gray-700 dark:bg-gray-800/90 pb-[max(0.5rem,var(--hub-nav-safe-bottom,env(safe-area-inset-bottom,0px)))]">
        <div className="mx-auto flex max-w-xl flex-col gap-2">
          <button
            type="button"
            onClick={handleGetStarted}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:text-base"
          >
            {t('hub.enterCta')}
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

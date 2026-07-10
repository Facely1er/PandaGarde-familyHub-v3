import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink, Shield, Users, Gamepad2, Award } from 'lucide-react';
import { setHubOrigin } from '../../lib/hubMission';
import { openExternalUrl } from '../../lib/openExternalUrl';
import AgeBandStrip from '../components/AgeBandStrip';
import HubBrandLogo from '../components/HubBrandLogo';
import { HUB_BRAND_LINE_2, HUB_WELCOMED_KEY } from '../constants';
import { hubPaths, pandagardeWebsiteUrl } from '../hubPaths';
import { hubTheme } from '../hubTheme';
import { useHubI18n } from '../hubI18n';
import { isAppReviewDemo, setAppReviewView } from '../../lib/appReviewDemo';

export { HUB_WELCOMED_KEY };

const WelcomeScreen: React.FC = () => {
  const { t } = useHubI18n();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAppReviewDemo()) {
      setAppReviewView('welcome');
    }
  }, []);

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
    <div className={`family-hub-theme hub-standalone-page hub-welcome-landing ${hubTheme.page}`}>
      <div className="hub-welcome-landing__scroll flex-1 overflow-y-auto px-4 pb-3 pt-3 sm:px-5 sm:pt-4">
        <div className="hub-welcome-landing__inner mx-auto w-full max-w-xl">
          <header className="hub-welcome-landing__hero text-center">
            <HubBrandLogo size="sm" variant="plain" className="mx-auto" alt="" />
            <h1 className="hub-welcome-landing__title text-gray-900 dark:text-white">
              {t('hub.welcome.title')}{' '}
              <span className="text-teal-600 dark:text-teal-400">{HUB_BRAND_LINE_2}</span>
            </h1>
            <p className="hub-welcome-landing__lead text-gray-600 dark:text-gray-300">{t('hub.welcomeLead')}</p>
          </header>

          <AgeBandStrip title={t('hub.welcome.adventurePaths')} density="compact" />

          <section className="hub-welcome-landing__section" aria-labelledby="hub-welcome-inside-heading">
            <h2
              id="hub-welcome-inside-heading"
              className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
              {t('hub.welcome.whatsInside')}
            </h2>
            <ul className="grid gap-2">
              {sections.map(({ icon: Icon, title, description, color }) => (
                <li
                  key={title}
                  className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-snug text-gray-900 dark:text-white">
                      {title}
                    </span>
                    <span className="block text-xs leading-snug text-gray-600 dark:text-gray-400">
                      {description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <p className="hub-welcome-landing__note text-center text-xs leading-snug text-gray-600 dark:text-gray-400">
            {t('hub.welcome.websiteNote')}
          </p>

          <div className="flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 p-3 text-xs leading-snug text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
            <Shield size={16} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
            <p>
              <strong>{t('hub.welcome.privacyStrong')}</strong> {t('hub.welcome.privacyNote')}
            </p>
          </div>
        </div>
      </div>

      <div className="hub-welcome-landing__cta sticky bottom-0 border-t border-gray-200 bg-white/90 px-4 py-2.5 backdrop-blur dark:border-gray-700 dark:bg-gray-800/90 pb-[max(0.5rem,var(--hub-nav-safe-bottom,env(safe-area-inset-bottom,0px)))]">
        <div className="mx-auto max-w-xl">
          <button
            type="button"
            onClick={handleGetStarted}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            {t('hub.enterCta')}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

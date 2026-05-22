import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { updateDfaJourneyPhase } from '../../lib/dfaJourney';
import { useAuth } from './AuthWrapper';
import { HUB_WELCOMED_KEY } from '../../familyhub/constants';
import { hubPaths, isHubStandalone, pandagardeWebsiteUrl } from '../../familyhub/hubPaths';
import AgeBandStrip from '../../familyhub/components/AgeBandStrip';
import HubBrandLogo from '../../familyhub/components/HubBrandLogo';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInLocally } = useAuth();

  const handleContinue = () => {
    signInLocally();
    updateDfaJourneyPhase('hub', { visited: true, completed: true, resumePath: hubPaths.dashboard });
    const hubWelcomed = localStorage.getItem(HUB_WELCOMED_KEY) === 'true';
    const atHubRoot =
      location.pathname === hubPaths.root || location.pathname === `${hubPaths.root}/`;
    const resolvedPath = atHubRoot
      ? hubWelcomed
        ? hubPaths.dashboard
        : hubPaths.welcome
      : location.pathname;
    navigate(resolvedPath, { replace: true });
  };

  return (
    <div className="family-hub-theme flex min-h-screen flex-col bg-gradient-to-br from-teal-50 via-white to-amber-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="flex flex-1 flex-col justify-center px-4 py-10">
        <div className="mx-auto w-full max-w-lg space-y-6">
          <div className="text-center">
            <HubBrandLogo size="hero" animated className="mx-auto" />
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-800 dark:bg-teal-900/50 dark:text-teal-200">
              <Sparkles size={12} aria-hidden="true" />
              Family privacy adventures
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              PandaGarde Family Hub
            </h1>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
              Short missions, real-life practice, and rewards — built for parents and kids ages 5–17.
            </p>
          </div>

          <ul className="space-y-2 rounded-2xl border border-gray-200 bg-white/90 p-4 text-sm dark:border-gray-700 dark:bg-gray-800/90">
            <li className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <CheckCircle2 size={18} className="shrink-0 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              Works offline — no account required
            </li>
            <li className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <CheckCircle2 size={18} className="shrink-0 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              Progress saved on this device only
            </li>
            <li className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <ShieldCheck size={18} className="shrink-0 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              Parent-guided — not a social network for kids
            </li>
          </ul>

          <AgeBandStrip title="Missions for every age" />

          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex w-full min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-teal-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:ring-offset-gray-900"
          >
            Let&apos;s go!
            <ArrowRight size={22} aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-xs text-gray-500 dark:text-gray-400">
        {!isHubStandalone ? (
          <a href="/" className="underline hover:text-teal-700 dark:hover:text-teal-300">
            Back to PandaGarde website
          </a>
        ) : (
          <a
            href={pandagardeWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-teal-700 dark:hover:text-teal-300"
          >
            Visit PandaGarde website
          </a>
        )}
      </p>
    </div>
  );
};

export default LoginPage;

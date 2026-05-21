import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { updateDfaJourneyPhase } from '../../lib/dfaJourney';
import { useAuth } from './AuthWrapper';
import { HUB_WELCOMED_KEY } from '../../familyhub/constants';
import { hubPaths, isHubStandalone, pandagardeWebsiteUrl } from '../../familyhub/hubPaths';

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-teal-200 bg-white shadow-md dark:border-teal-800/60 dark:bg-slate-900">
          <img
            src="/LogoPandagarde.png"
            alt="PandaGarde"
            className="h-full w-full object-contain p-1"
            width={64}
            height={64}
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">PandaGarde Family Hub</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Your family privacy app — daily missions, activities, and progress together. Works on its own or after the website assessment.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 space-y-2 text-left bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl p-4">
          <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400 shrink-0" /> <span className="text-gray-700 dark:text-gray-300">Works offline — no account required</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400 shrink-0" /> <span className="text-gray-700 dark:text-gray-300">Progress saved on this device</span></div>
          <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-teal-600 dark:text-teal-400 shrink-0" /> <span className="text-gray-700 dark:text-gray-300">Your data never leaves your browser</span></div>
        </div>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex w-full items-center justify-center rounded-lg bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700 transition-colors"
        >
          Open Family Hub
        </button>
        {!isHubStandalone && (
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            <a href="/" className="underline hover:text-gray-600 dark:hover:text-gray-300">
              ← Back to PandaGarde website
            </a>
          </p>
        )}
        {isHubStandalone && (
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            <a
              href={pandagardeWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 dark:hover:text-gray-300"
            >
              Visit PandaGarde website
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

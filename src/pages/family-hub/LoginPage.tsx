import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { updateDfaJourneyPhase } from '../../lib/dfaJourney';
import { useAuth } from './AuthWrapper';
import { HUB_WELCOMED_KEY } from '../../familyhub/screens/WelcomeScreen';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInLocally } = useAuth();

  const handleContinue = () => {
    signInLocally();
    updateDfaJourneyPhase('hub', { visited: true, completed: true, resumePath: '/family-hub/dashboard' });
    const hubWelcomed = localStorage.getItem(HUB_WELCOMED_KEY) === 'true';
    const nextPath = location.pathname.startsWith('/family-hub') ? location.pathname : '/family-hub';
    const resolvedPath =
      nextPath === '/family-hub' || nextPath === '/family-hub/'
        ? hubWelcomed
          ? '/family-hub/dashboard'
          : '/family-hub/welcome'
        : nextPath;
    navigate(resolvedPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 mb-4">
          <LayoutDashboard size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">PandaGarde Family Hub</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Your family privacy workspace — the final phase of the PandaGarde DFA journey where you act on your privacy plan together.
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
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          <a href="/" className="underline hover:text-gray-600 dark:hover:text-gray-300">← Back to PandaGarde website</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Users, Gamepad2, Award } from 'lucide-react';
import { updateDfaJourneyPhase } from '../../lib/dfaJourney';

export const HUB_WELCOMED_KEY = 'pandagarde_hub_welcomed';

const phases = [
  { label: 'Step 1', name: 'Service Catalog', description: 'Map the apps & services your family uses', done: true },
  { label: 'Step 2', name: 'Digital Footprint', description: 'Understand your online exposure', done: true },
  { label: 'Step 3', name: 'Privacy Assessment', description: 'Identify risks and priorities', done: true },
  { label: 'Step 4', name: 'Family Hub', description: 'Act on your plan — you are here!', done: false, active: true },
];

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
    title: 'Progress',
    description: 'Track completions, earn badges, and download certificates together.',
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30',
  },
];

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    updateDfaJourneyPhase('hub', { visited: true, resumePath: '/family-hub/welcome' });
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem(HUB_WELCOMED_KEY, 'true');
    navigate('/family-hub/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:py-12">
        <div className="max-w-xl mx-auto space-y-8">

          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-teal-200 dark:border-teal-700 bg-white mx-auto">
              <img
                src="/LogoPandagarde.png"
                alt="PandaGarde"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Welcome to your<br />
                <span className="text-teal-600 dark:text-teal-400">Family Hub</span>
              </h1>
              <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300">
                Your family's home base for privacy learning — age-matched activities, shared goals, and progress you can track together.
              </p>
            </div>
          </div>

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

          {/* Journey progress — for users coming from the full assessment */}
          <details className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200 list-none">
              <span>Coming from the Privacy Assessment?</span>
              <span className="ml-2 text-xs font-normal text-gray-400 group-open:hidden">Show steps</span>
              <span className="ml-2 text-xs font-normal text-gray-400 hidden group-open:inline">Hide</span>
            </summary>
            <div className="px-5 pb-5">
              <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                Your Privacy Journey — four steps from mapping your family's digital life to acting on your plan.
              </p>
              <ol className="space-y-3">
                {phases.map((phase, index) => (
                  <li key={phase.label} className="flex items-start gap-3">
                    <span
                      className={[
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        phase.active
                          ? 'bg-teal-600 text-white ring-2 ring-teal-300 dark:ring-teal-700'
                          : phase.done
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500',
                      ].join(' ')}
                    >
                      {phase.done ? (
                        <svg viewBox="0 0 14 14" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M2 7l3.5 3.5L12 3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      ) : (
                        index + 1
                      )}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={[
                          'text-sm font-semibold',
                          phase.active
                            ? 'text-teal-700 dark:text-teal-300'
                            : 'text-gray-700 dark:text-gray-200',
                        ].join(' ')}
                      >
                        {phase.label} — {phase.name}
                        {phase.active && (
                          <span className="ml-2 inline-block rounded-full bg-teal-100 dark:bg-teal-900/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                            You are here
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{phase.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </details>

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
      <div className="sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-t border-gray-200 dark:border-gray-700 px-4 py-4 safe-area-bottom">
        <div className="max-w-xl mx-auto">
          <button
            type="button"
            onClick={handleGetStarted}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-teal-700 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            Set up my Family Hub
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

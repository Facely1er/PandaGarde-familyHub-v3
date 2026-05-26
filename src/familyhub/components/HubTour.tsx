import React, { useEffect, useState } from 'react';
import { X, ArrowRight, LayoutDashboard, Map, Users, Gamepad2 } from 'lucide-react';
import { useDialogFocusTrap } from '../../hooks/useDialogFocusTrap';
import { hubPaths } from '../hubPaths';

export const HUB_TOUR_KEY = 'pandagarde_hub_tour_done';

interface TourStep {
  title: string;
  body: string;
  icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: string }>;
  navTarget: string;
}

const steps: TourStep[] = [
  {
    title: 'Dashboard — start here',
    body: "See today's mission and quick stats. This is your family's daily starting point.",
    icon: LayoutDashboard,
    navTarget: hubPaths.dashboard,
  },
  {
    title: 'Journey — progress & rewards',
    body: 'See missions completed, badges earned, and certificates — all saved on this device.',
    icon: Map,
    navTarget: hubPaths.journey,
  },
  {
    title: 'Missions — play together',
    body: 'Age-matched privacy missions with real-life scenarios, family talks, and optional games.',
    icon: Gamepad2,
    navTarget: hubPaths.activities,
  },
  {
    title: 'Family — add profiles',
    body: 'Add each child with their age so missions match Little Explorers (5–8), Detectives (9–12), or Digital Citizens (13–17).',
    icon: Users,
    navTarget: hubPaths.kids,
  },
];

interface HubTourProps {
  onDone?: () => void;
}

const HubTour: React.FC<HubTourProps> = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(HUB_TOUR_KEY);
    if (done === 'true') {return;}
    // Short delay so the dashboard has time to render
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(HUB_TOUR_KEY, 'true');
    setVisible(false);
    onDone?.();
  };

  const dialogRef = useDialogFocusTrap({
    isOpen: visible,
    onClose: dismiss,
  });

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  };

  if (!visible) {return null;}

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          dismiss();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Family Hub tour"
        className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1 bg-gray-100 dark:bg-gray-700">
          <div
            className="h-1 bg-teal-500 transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="p-5">
          {/* Close */}
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Skip tour"
          >
            <X size={16} aria-hidden="true" />
          </button>

          {/* Step count */}
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-3">
            Step {step + 1} of {steps.length}
          </p>

          {/* Icon + heading */}
          <div className="flex items-start gap-3 mb-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300">
              <Icon size={22} aria-hidden="true" />
            </span>
            <h2 className="pt-1 text-base font-bold text-gray-900 dark:text-white leading-snug">
              {current.title}
            </h2>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
            {current.body}
          </p>

          {/* Step dots */}
          <div className="flex items-center gap-1.5 mb-5" aria-hidden="true">
            {steps.map((_, i) => (
              <span
                key={i}
                className={[
                  'block rounded-full transition-all duration-300',
                  i === step
                    ? 'w-5 h-2 bg-teal-500'
                    : i < step
                    ? 'w-2 h-2 bg-teal-300 dark:bg-teal-700'
                    : 'w-2 h-2 bg-gray-200 dark:bg-gray-600',
                ].join(' ')}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={dismiss}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Skip tour
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              {isLast ? 'Get started' : 'Next'}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubTour;

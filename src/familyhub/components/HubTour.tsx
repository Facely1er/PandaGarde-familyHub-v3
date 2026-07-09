import React, { useEffect, useMemo, useState } from 'react';
import { X, ArrowRight, LayoutDashboard, Map, Users, Gamepad2 } from 'lucide-react';
import { useDialogFocusTrap } from '../../hooks/useDialogFocusTrap';
import { hubPaths } from '../hubPaths';
import { useHubI18n } from '../hubI18n';

export const HUB_TOUR_KEY = 'pandagarde_hub_tour_done';

interface TourStep {
  title: string;
  body: string;
  icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: string }>;
  navTarget: string;
}

interface HubTourProps {
  onDone?: () => void;
}

const HubTour: React.FC<HubTourProps> = ({ onDone }) => {
  const { t } = useHubI18n();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  const steps: TourStep[] = useMemo(() => {
    const raw = t('hub.tour.steps', { returnObjects: true }) as Array<{ title: string; body: string }>;
    const icons = [LayoutDashboard, Map, Gamepad2, Users];
    const targets = [hubPaths.dashboard, hubPaths.journey, hubPaths.activities, hubPaths.kids];
    return raw.map((item, index) => ({
      ...item,
      icon: icons[index] ?? LayoutDashboard,
      navTarget: targets[index] ?? hubPaths.dashboard,
    }));
  }, [t]);

  useEffect(() => {
    const done = localStorage.getItem(HUB_TOUR_KEY);
    if (done === 'true') {return;}
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
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
      className="hub-tour-overlay fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-[2px] sm:items-center sm:pb-4"
      role="presentation"
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
        aria-label={t('hub.tour.dialogLabel')}
        className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="h-1 bg-gray-100 dark:bg-gray-700">
          <div
            className="h-1 bg-teal-500 transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="p-5">
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={t('hub.tour.skip')}
          >
            <X size={16} aria-hidden="true" />
          </button>

          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-3">
            {t('hub.tour.stepOf', { current: step + 1, total: steps.length })}
          </p>

          <div className="flex items-start gap-3 mb-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300">
              <Icon size={22} aria-hidden="true" />
            </span>
            <h2 className="pt-1 text-base font-bold text-gray-900 dark:text-white leading-snug">
              {current.title}
            </h2>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">{current.body}</p>

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

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={dismiss}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {t('hub.tour.skip')}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              {isLast ? t('hub.tour.getStarted') : t('hub.tour.next')}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubTour;

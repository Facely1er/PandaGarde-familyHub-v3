import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ActivityCompletionProps {
  title: string;
  message: string;
  submessage?: string;
  onPlayAgain: () => void;
  onDone: () => void;
  icon?: React.ReactNode;
}

interface ActivityGameShellProps {
  titleId: string;
  title: string;
  subtitle?: string;
  titleIcon?: React.ReactNode;
  onClose: () => void;
  /** 0–100 */
  progressPercent?: number;
  progressLeft?: string;
  progressRight?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  completed?: ActivityCompletionProps;
  maxWidthClass?: string;
  headerGradient?: string;
}

/**
 * Shared full-screen modal shell for Family Hub mini-games — gradient header,
 * optional progress bar, scrollable body, footer controls, completion overlay.
 */
const ActivityGameShell: React.FC<ActivityGameShellProps> = ({
  titleId,
  title,
  subtitle,
  titleIcon,
  onClose,
  progressPercent,
  progressLeft,
  progressRight,
  children,
  footer,
  completed,
  maxWidthClass = 'max-w-2xl',
  headerGradient = 'from-green-600 to-emerald-500',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();
    return () => previouslyFocused.current?.focus();
  }, []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {onClose();}
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative flex max-h-[95vh] w-full ${maxWidthClass} flex-col overflow-hidden rounded-3xl bg-white shadow-2xl outline-none dark:bg-gray-900`}
      >
        <div className={`flex items-center justify-between gap-4 bg-gradient-to-r ${headerGradient} px-5 py-4`}>
          <div className="min-w-0">
            <h2 id={titleId} className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
              {titleIcon && <span className="shrink-0">{titleIcon}</span>}
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-white/90">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close game"
            className="shrink-0 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {progressPercent !== undefined && (
          <div className="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-800 dark:bg-gray-800">
            {(progressLeft || progressRight) && (
              <div className="mb-1 flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
                <span>{progressLeft}</span>
                <span>{progressRight}</span>
              </div>
            )}
            <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-center gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-800">
            {footer}
          </div>
        )}

        {completed && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/70 p-6">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-gray-900">
              {completed.icon && (
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                  {completed.icon}
                </div>
              )}
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{completed.title}</h3>
              <p className="mb-1 text-gray-600 dark:text-gray-300">{completed.message}</p>
              {completed.submessage && (
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{completed.submessage}</p>
              )}
              {!completed.submessage && <div className="mb-6" />}
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={completed.onPlayAgain}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Play again
                </button>
                <button
                  type="button"
                  onClick={completed.onDone}
                  className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const shellBtn =
  'inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700';

export const shellBtnPrimary =
  'inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400';

export default ActivityGameShell;

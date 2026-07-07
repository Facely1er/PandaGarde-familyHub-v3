import React from 'react';

interface SessionRestProps {
  episodeTitle: string;
  onContinue: () => void;
  onDone: () => void;
}

/**
 * Intentional session endpoint — PandaGarde is designed to be completed in
 * finite episodes, not to maximize time-in-app (research §3 screen-time).
 */
const SessionRest: React.FC<SessionRestProps> = ({ episodeTitle, onContinue, onDone }) => (
  <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
    <span className="text-7xl" aria-hidden>
      🌙
    </span>
    <h1 className="mt-4 text-3xl font-extrabold text-emerald-800 dark:text-emerald-300">
      Great work in the forest today!
    </h1>
    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
      You finished <span className="font-bold text-gray-900 dark:text-gray-100">{episodeTitle}</span>.
      This is a perfect time to close the app and rest your eyes.
    </p>
    <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-900 dark:border-sky-800 dark:bg-sky-900/40 dark:text-sky-100">
      <p className="font-bold">Screen-time tip</p>
      <p className="mt-1">
        The bamboo forest will be here when you come back. Real-world adventures
        — playing outside, reading, or talking with family — help your brain grow too!
      </p>
    </div>
    <div className="mt-8 flex w-full flex-col gap-3">
      <button
        type="button"
        onClick={onDone}
        className="min-h-[56px] w-full rounded-2xl bg-emerald-700 text-lg font-extrabold text-white hover:bg-emerald-800 dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400"
      >
        I&apos;m done for now — see you later! 👋
      </button>
      <button
        type="button"
        onClick={onContinue}
        className="min-h-[56px] w-full rounded-2xl border-2 border-emerald-700 text-lg font-extrabold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
      >
        Keep exploring the forest 🗺️
      </button>
    </div>
  </div>
);

export default SessionRest;

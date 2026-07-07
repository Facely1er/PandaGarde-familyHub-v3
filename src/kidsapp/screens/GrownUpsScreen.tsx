import React, { useState } from 'react';
import { useKidsProgress } from '../KidsProgressContext';
import { getKidsEpisodes } from '../kidsContent';
import ParentalGate from '../components/ParentalGate';

/** Adult-only section behind the parental gate: privacy facts, progress summary, data reset. */
const GrownUpsScreen: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [gateVisible, setGateVisible] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { earnedBadges, resetAll } = useKidsProgress();
  const totalEpisodes = getKidsEpisodes().length;

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md py-6">
        {gateVisible ? (
          <ParentalGate onPass={() => setUnlocked(true)} onCancel={() => setGateVisible(false)} />
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
            <span className="text-5xl" aria-hidden>
              🔒
            </span>
            <h1 className="mt-3 text-xl font-bold text-gray-900 dark:text-gray-100">
              For Grown-Ups
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              This section is for parents and guardians.
            </p>
            <button
              type="button"
              onClick={() => setGateVisible(true)}
              className="mt-4 min-h-[48px] w-full rounded-xl bg-emerald-700 font-bold text-white hover:bg-emerald-800 dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400"
            >
              I am a grown-up
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-2">
      <h1 className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
        Parent &amp; Guardian Corner
      </h1>

      <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">How privacy works here</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-gray-600 dark:text-gray-300">
          <li>Everything stays on this device — there is no account, server, or cloud sync.</li>
          <li>No name, email, or age is collected; your child only picks a character and an age range.</li>
          <li>There are no ads, no third-party analytics, and no tracking of any kind.</li>
          <li>Deleting the app (or using the reset button below) removes all data permanently.</li>
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Progress summary</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {earnedBadges.length} of {totalEpisodes} Season 1 episodes completed. Each episode pairs a
          story about a privacy topic (personal information, passwords, sharing, and more) with a
          hands-on mini-game.
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Want to go deeper as a family? PandaGarde Family Hub offers a Digital Footprint Analysis
          and daily privacy missions for the whole family — search for "PandaGarde" on the web.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/40">
        <h2 className="text-lg font-bold text-red-900 dark:text-red-200">Reset all data</h2>
        <p className="mt-1 text-red-800 dark:text-red-300">
          Permanently erases the chosen character, all badges, and episode progress on this device.
        </p>
        {confirmReset ? (
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="min-h-[48px] flex-1 rounded-xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Keep my data
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="min-h-[48px] flex-1 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700"
            >
              Yes, erase everything
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="mt-3 min-h-[48px] w-full rounded-xl border-2 border-red-600 font-bold text-red-700 hover:bg-red-100 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-900/40"
          >
            Reset all data…
          </button>
        )}
      </section>
    </div>
  );
};

export default GrownUpsScreen;

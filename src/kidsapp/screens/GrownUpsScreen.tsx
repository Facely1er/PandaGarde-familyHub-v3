import React, { useState } from 'react';
import { useKidsProgress } from '../KidsProgressContext';
import { getKidsEpisodes } from '../kidsContent';
import { TRUSTED_ROLES } from '../kidsTrustedRoles';
import ParentalGate from '../components/ParentalGate';

/** Adult-only section behind the parental gate: privacy facts, progress summary, data reset. */
const GrownUpsScreen: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [gateVisible, setGateVisible] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { earnedBadges, trustedTeam, resetAll } = useKidsProgress();
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
          story with a hands-on mini-game and an optional family activity you can do together offline.
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          PandaGarde is designed for finite sessions — not endless scrolling. After each episode,
          children are encouraged to take a screen break.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-900/30">
        <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
          Your child&apos;s Tao Circle (trusted adults)
        </h2>
        {trustedTeam ? (
          <>
            <p className="mt-2 text-emerald-900 dark:text-emerald-100">
              Your child chose these trusted roles and a family code word. We store role types only —
              never real names.
            </p>
            <p className="mt-2 font-extrabold text-emerald-800 dark:text-emerald-200">
              Code word: {trustedTeam.codeWord}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-emerald-900 dark:text-emerald-100">
              {trustedTeam.roleIds.map((id) => {
                const role = TRUSTED_ROLES.find((r) => r.id === id);
                return role ? <li key={id}>{role.label}</li> : null;
              })}
            </ul>
            <p className="mt-3 text-sm text-emerald-800 dark:text-emerald-200">
              <strong>What to do:</strong> Agree together what the code word means — e.g. &quot;I need
              help with something online, no anger, no taking devices away, just listening.&quot;
              Research shows children rarely report cyberbullying because they fear losing device
              access or being judged. A calm, pre-agreed signal lowers that barrier.
            </p>
          </>
        ) : (
          <p className="mt-2 text-emerald-900 dark:text-emerald-100">
            Not set up yet. Episode 8 (&quot;Po&apos;s Toughest Question&quot;) walks your child
            through picking trusted adults and a code word. Consider doing it together.
          </p>
        )}
      </section>

      <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Family Hub</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Want to go deeper as a family? PandaGarde Family Hub offers a Digital Footprint Analysis
          and daily privacy missions — search for &quot;PandaGarde&quot; on the web.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/40">
        <h2 className="text-lg font-bold text-red-900 dark:text-red-200">Reset all data</h2>
        <p className="mt-1 text-red-800 dark:text-red-300">
          Permanently erases the chosen character, all badges, Tao Circle, and episode progress on
          this device.
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

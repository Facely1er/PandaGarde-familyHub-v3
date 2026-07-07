import React, { Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { useKidsProgress } from '../KidsProgressContext';
import { TRUSTED_ROLES } from '../games/TrustedTeamBuilder';

const GameFallback: React.FC = () => (
  <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
    <span className="animate-bounce text-5xl" aria-hidden>
      🛡️
    </span>
    <span className="sr-only">Loading…</span>
  </div>
);

const TrustedTeamBuilder = React.lazy(() => import('../games/TrustedTeamBuilder'));

/** View or rebuild the disclosure scaffold (Tao Circle) any time after Episode 8. */
const TaoCircleScreen: React.FC = () => {
  const { trustedTeam } = useKidsProgress();
  const [editing, setEditing] = useState(!trustedTeam);

  if (editing) {
    return (
      <div className="px-4 py-4 sm:px-6">
        <Link
          to="/badges"
          className="inline-block rounded-xl px-3 py-2 font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          ← Badges
        </Link>
        <Suspense fallback={<GameFallback />}>
          <div className="mt-4">
            <TrustedTeamBuilder onBack={() => setEditing(false)} />
          </div>
        </Suspense>
      </div>
    );
  }

  return (
    <div className="py-2">
      <h1 className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300 sm:text-3xl">
        My Tao Circle
      </h1>
      <p className="mt-1 text-gray-600 dark:text-gray-300">
        Your trusted grown-ups and code word — for when something online feels too big.
      </p>

      {trustedTeam ? (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="font-bold text-gray-900 dark:text-gray-100">Your code word</p>
          <p className="mt-1 text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">
            {trustedTeam.codeWord}
          </p>
          <p className="mt-4 font-bold text-gray-900 dark:text-gray-100">Trusted grown-ups</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {trustedTeam.roleIds.map((id) => {
              const role = TRUSTED_ROLES.find((r) => r.id === id);
              return role ? (
                <span
                  key={id}
                  className="rounded-full bg-emerald-100 px-3 py-1.5 font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                >
                  {role.emoji} {role.label}
                </span>
              ) : null;
            })}
          </div>
          <p className="mt-4 rounded-xl bg-amber-100 p-3 text-sm font-semibold text-amber-900 dark:bg-amber-900/50 dark:text-amber-100">
            Say your code word to any of these grown-ups when you need help online. Telling them is
            brave — never snitching.
          </p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-4 min-h-[48px] w-full rounded-2xl border-2 border-emerald-700 font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
          >
            Update my Tao Circle
          </button>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <span className="text-5xl" aria-hidden>
            🛡️
          </span>
          <p className="mt-3 font-bold text-gray-900 dark:text-gray-100">
            You haven&apos;t built your Tao Circle yet!
          </p>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Play Episode 8 on the Forest Map, or build it here.
          </p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-4 min-h-[52px] w-full rounded-2xl bg-emerald-700 text-lg font-extrabold text-white hover:bg-emerald-800 dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400"
          >
            Build my Tao Circle
          </button>
        </div>
      )}
    </div>
  );
};

export default TaoCircleScreen;

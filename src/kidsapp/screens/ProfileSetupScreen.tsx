import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKidsProgress } from '../KidsProgressContext';
import { KID_AGE_BANDS, KID_AVATARS, type KidAgeBand } from '../kidsContent';

/**
 * Anonymous first-run setup: pick a forest friend and an age band.
 * Deliberately collects no name, email, or other personal information.
 */
const ProfileSetupScreen: React.FC = () => {
  const { setProfile } = useKidsProgress();
  const navigate = useNavigate();
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [ageBand, setAgeBand] = useState<KidAgeBand | null>(null);

  const start = () => {
    if (!avatarId || !ageBand) {
      return;
    }
    setProfile({ avatarId, ageBand });
    navigate('/', { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-10 sm:px-6">
      <div className="text-center">
        <span className="text-6xl" aria-hidden>
          🐼
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-emerald-800 dark:text-emerald-300 sm:text-4xl">
          Welcome to the Digital Bamboo Forest!
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Pick a forest friend to play as. No name needed — your adventure stays on this device!
        </p>
      </div>

      <fieldset className="mt-8">
        <legend className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Choose your forest friend
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {KID_AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              onClick={() => setAvatarId(avatar.id)}
              aria-pressed={avatarId === avatar.id}
              className={`flex min-h-[112px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-4 transition-colors ${
                avatarId === avatar.id
                  ? 'border-emerald-600 bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-900/50'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              <span className="text-4xl" aria-hidden>
                {avatar.emoji}
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{avatar.name}</span>
              <span className="text-xs text-gray-600 dark:text-gray-300">{avatar.tagline}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-xl font-bold text-gray-900 dark:text-gray-100">How old are you?</legend>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {KID_AGE_BANDS.map((band) => (
            <button
              key={band.id}
              type="button"
              onClick={() => setAgeBand(band.id)}
              aria-pressed={ageBand === band.id}
              className={`flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border-2 p-4 transition-colors ${
                ageBand === band.id
                  ? 'border-emerald-600 bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-900/50'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              <span className="text-3xl" aria-hidden>
                {band.emoji}
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{band.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={start}
        disabled={!avatarId || !ageBand}
        className="mt-10 min-h-[56px] w-full rounded-2xl bg-emerald-700 text-xl font-extrabold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
      >
        Start the Adventure! 🎋
      </button>
    </div>
  );
};

export default ProfileSetupScreen;

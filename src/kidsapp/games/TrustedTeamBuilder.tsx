import React, { useState } from 'react';
import { useKidsProgress } from '../KidsProgressContext';

interface TrustedTeamBuilderProps {
  onBack: () => void;
  onComplete?: (score?: number) => void;
}

export interface TrustedRole {
  id: string;
  label: string;
  emoji: string;
}

/** Generic roles only — the app never asks for or stores real names. */
export const TRUSTED_ROLES: TrustedRole[] = [
  { id: 'mom', label: 'Mom', emoji: '👩' },
  { id: 'dad', label: 'Dad', emoji: '👨' },
  { id: 'grandparent', label: 'Grandparent', emoji: '👵' },
  { id: 'teacher', label: 'A teacher', emoji: '🧑‍🏫' },
  { id: 'sibling', label: 'Big brother / sister', emoji: '🧑' },
  { id: 'aunt-uncle', label: 'Aunt / Uncle', emoji: '🧢' },
  { id: 'coach', label: 'A coach', emoji: '🏀' },
  { id: 'counselor', label: 'School counselor', emoji: '💼' },
  { id: 'other', label: 'Another grown-up I trust', emoji: '🌟' },
];

const CODE_WORDS = ['Bamboo', 'Lantern', 'Firefly', 'Campfire', 'River Stone', 'Moon Leaf'];

const OPENERS = [
  { text: '"Can I tell you something that\'s been bothering me online?"', good: true },
  { text: 'Wait until they somehow find out by themselves', good: false },
  { text: '"Something happened on my tablet and I need help."', good: true },
  { text: 'Keep it secret so nobody worries', good: false },
];

type Step = 'team' | 'codeword' | 'practice' | 'done';

/**
 * The Tao Circle: pick trusted grown-ups, choose a family code word, and
 * practice how to start a hard conversation. Builds the disclosure scaffold
 * before a crisis happens (research §1.4 — the underreporting gap).
 */
const TrustedTeamBuilder: React.FC<TrustedTeamBuilderProps> = ({ onBack, onComplete }) => {
  const { trustedTeam, setTrustedTeam } = useKidsProgress();
  const [step, setStep] = useState<Step>('team');
  const [roleIds, setRoleIds] = useState<string[]>(trustedTeam?.roleIds ?? []);
  const [codeWord, setCodeWord] = useState<string>(trustedTeam?.codeWord ?? '');
  const [pickedOpeners, setPickedOpeners] = useState<number[]>([]);

  const toggleRole = (id: string) => {
    setRoleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const toggleOpener = (index: number) => {
    setPickedOpeners((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const finish = () => {
    setTrustedTeam({ roleIds, codeWord });
    setStep('done');
    const goodPicks = pickedOpeners.filter((i) => OPENERS[i].good).length;
    const badPicks = pickedOpeners.filter((i) => !OPENERS[i].good).length;
    const practiceScore = Math.max(0, goodPicks - badPicks) / 2;
    onComplete?.(Math.round(50 + practiceScore * 50));
  };

  if (step === 'done') {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
        <span className="text-6xl" aria-hidden>
          🛡️
        </span>
        <h2 className="mt-3 text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
          Your Tao Circle is ready!
        </h2>
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-200">
          You picked {roleIds.length} trusted grown-up{roleIds.length === 1 ? '' : 's'} and your
          code word is <span className="font-extrabold">{codeWord}</span>.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {roleIds.map((id) => {
            const role = TRUSTED_ROLES.find((r) => r.id === id);
            return role ? (
              <span
                key={id}
                className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
              >
                {role.emoji} {role.label}
              </span>
            ) : null;
          })}
        </div>
        <p className="mt-4 rounded-xl bg-amber-100 p-3 font-semibold text-amber-900 dark:bg-amber-900/50 dark:text-amber-100">
          Next step: tell your grown-ups about the code word today! Saying it means "I need to talk
          about something online — no anger, no taking my tablet away, just help."
        </p>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Telling a trusted adult is never snitching. It is one of the bravest things a forest
          guardian can do.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-5 min-h-[52px] w-full rounded-2xl bg-emerald-700 text-lg font-extrabold text-white hover:bg-emerald-800 dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      {step === 'team' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
            🛡️ Step 1: Choose your Tao Circle
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Pick up to 3 grown-ups you could talk to if something online ever felt too big to carry
            alone. (We only save the type of grown-up — never a name.)
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TRUSTED_ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => toggleRole(role.id)}
                aria-pressed={roleIds.includes(role.id)}
                className={`flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-xl border-2 p-2 text-sm font-semibold transition-colors ${
                  roleIds.includes(role.id)
                    ? 'border-emerald-600 bg-emerald-100 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-900/50 dark:text-emerald-100'
                    : 'border-gray-200 text-gray-800 dark:border-gray-600 dark:text-gray-100'
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {role.emoji}
                </span>
                {role.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep('codeword')}
            disabled={roleIds.length === 0}
            className="mt-5 min-h-[52px] w-full rounded-2xl bg-emerald-700 text-lg font-extrabold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400"
          >
            Next: pick a code word →
          </button>
        </div>
      )}

      {step === 'codeword' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
            🔑 Step 2: Choose a family code word
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            A code word is a secret signal. When you say it to your trusted grown-up, it means "I
            need to talk about something online" — no explaining needed to get started.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CODE_WORDS.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => setCodeWord(word)}
                aria-pressed={codeWord === word}
                className={`min-h-[56px] rounded-xl border-2 font-bold transition-colors ${
                  codeWord === word
                    ? 'border-emerald-600 bg-emerald-100 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-900/50 dark:text-emerald-100'
                    : 'border-gray-200 text-gray-800 dark:border-gray-600 dark:text-gray-100'
                }`}
              >
                {word}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setStep('team')}
              className="min-h-[52px] flex-1 rounded-2xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setStep('practice')}
              disabled={!codeWord}
              className="min-h-[52px] flex-[2] rounded-2xl bg-emerald-700 text-lg font-extrabold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400"
            >
              Next: practice →
            </button>
          </div>
        </div>
      )}

      {step === 'practice' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
            💬 Step 3: How would you start?
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Imagine something online made you feel worried. Pick every way that would be a brave
            start:
          </p>
          <div className="mt-4 space-y-2">
            {OPENERS.map((opener, i) => {
              const picked = pickedOpeners.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleOpener(i)}
                  aria-pressed={picked}
                  className={`w-full rounded-xl border-2 p-3 text-left font-semibold transition-colors ${
                    picked
                      ? opener.good
                        ? 'border-emerald-600 bg-emerald-100 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-900/50 dark:text-emerald-100'
                        : 'border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100'
                      : 'border-gray-200 text-gray-800 dark:border-gray-600 dark:text-gray-100'
                  }`}
                >
                  {opener.text}
                  {picked && !opener.good && (
                    <span className="mt-1 block text-sm font-medium">
                      Hmm — waiting or keeping it secret leaves you carrying it alone. Your Tao
                      Circle wants to help!
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setStep('codeword')}
              className="min-h-[52px] flex-1 rounded-2xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={finish}
              disabled={pickedOpeners.filter((i) => OPENERS[i].good).length === 0}
              className="min-h-[52px] flex-[2] rounded-2xl bg-emerald-700 text-lg font-extrabold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400"
            >
              Build my Tao Circle! 🛡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustedTeamBuilder;

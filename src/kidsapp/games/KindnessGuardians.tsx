import React, { useState } from 'react';

interface KindnessGuardiansProps {
  onBack: () => void;
  onComplete?: (score?: number) => void;
}

interface Choice {
  text: string;
  isUpstander: boolean;
  feedback: string;
}

interface Scenario {
  id: number;
  emoji: string;
  situation: string;
  question: string;
  choices: Choice[];
}

/**
 * Cyberbullying recognition + bystander-choice practice.
 * Shame-free by design: wrong answers get gentle explanations, never blame,
 * and "tell a trusted adult" is reinforced throughout (see research §1.4, §4.4).
 */
const SCENARIOS: Scenario[] = [
  {
    id: 1,
    emoji: '📱',
    situation:
      'In the forest group chat, someone posts a silly photo of Billy and writes "Billy is SO weird 😂". Other animals start adding laughing faces.',
    question: 'What would a Kindness Guardian do?',
    choices: [
      {
        text: 'Add a laughing face too — everyone else is',
        isUpstander: false,
        feedback:
          'It can feel easier to join in, but every laughing face makes Billy feel smaller. Joining in makes unkindness grow.',
      },
      {
        text: 'Send Billy a private message: "That wasn\'t kind. Are you okay?"',
        isUpstander: true,
        feedback:
          'Yes! Checking on the person is one of the most powerful things a friend can do. It tells Billy he is not alone.',
      },
      {
        text: 'Say nothing and scroll past',
        isUpstander: false,
        feedback:
          'Staying quiet feels safe, but silence lets unkindness keep going. Even a small kind action helps.',
      },
    ],
  },
  {
    id: 2,
    emoji: '🔁',
    situation:
      'Miki sends you an embarrassing video of another animal and says "Forward this to everyone! It\'s hilarious!"',
    question: 'What do you do?',
    choices: [
      {
        text: 'Forward it — Miki asked me to',
        isUpstander: false,
        feedback:
          'When you forward something hurtful, you become part of the hurt — even if you didn\'t start it. The video travels farther with every share.',
      },
      {
        text: 'Don\'t forward it, and tell Miki "I don\'t share things that could embarrass someone"',
        isUpstander: true,
        feedback:
          'Exactly right! Refusing to pass it on stops the ripple. You just protected someone without a single unkind word.',
      },
      {
        text: 'Forward it to just one friend, not everyone',
        isUpstander: false,
        feedback:
          'Even one share keeps the hurt moving. Once something is sent, no one can control where it goes next.',
      },
    ],
  },
  {
    id: 3,
    emoji: '❓',
    situation:
      'Someone keeps leaving mean comments on Ruby\'s drawings — every single day. Ruby says "it\'s fine, it\'s probably just a joke."',
    question: 'Is this bullying, or just a joke?',
    choices: [
      {
        text: 'It\'s a joke — Ruby said it\'s fine',
        isUpstander: false,
        feedback:
          'Sometimes animals say "it\'s fine" because they feel embarrassed or scared. Mean comments that happen again and again are bullying — even when someone calls them a joke.',
      },
      {
        text: 'It\'s bullying — it\'s mean, and it keeps happening',
        isUpstander: true,
        feedback:
          'You spotted it! When something is unkind, on purpose, and repeated, it counts as bullying. Trusting that feeling is a superpower.',
      },
      {
        text: 'It\'s only bullying if it happens at school',
        isUpstander: false,
        feedback:
          'Bullying can happen anywhere — in games, chats, and comments. Online bullying is real bullying.',
      },
    ],
  },
  {
    id: 4,
    emoji: '😟',
    situation:
      'A friend tells you someone has been sending them scary messages, then says: "Promise you won\'t tell any grown-up. Promise!"',
    question: 'What does a Kindness Guardian do?',
    choices: [
      {
        text: 'Keep the promise — friends keep secrets',
        isUpstander: false,
        feedback:
          'Some secrets are too big for kids to carry alone. A secret that involves someone being scared or hurt is exactly the kind a trusted adult needs to know about.',
      },
      {
        text: 'Say: "This is too big for just us. Let\'s tell a trusted grown-up together."',
        isUpstander: true,
        feedback:
          'Perfect. Telling a trusted adult is not snitching — it is getting help. Offering to go together makes your friend feel brave instead of alone.',
      },
      {
        text: 'Reply to the scary messages yourself to defend your friend',
        isUpstander: false,
        feedback:
          'Your heart is in the right place, but replying can make things worse and pull you in too. The strongest move is getting a grown-up involved.',
      },
    ],
  },
  {
    id: 5,
    emoji: '🎮',
    situation:
      'In an online game, a player keeps calling your teammate names and telling them to quit. Your teammate goes quiet.',
    question: 'What is the best combo move?',
    choices: [
      {
        text: 'Call the bully names back — they deserve it',
        isUpstander: false,
        feedback:
          'Fighting mean with mean usually makes the fire bigger — and can get you in trouble too. Guardians protect without attacking.',
      },
      {
        text: 'Use the game\'s report and block buttons, and tell your teammate "you played great"',
        isUpstander: true,
        feedback:
          'Combo complete! Report + block stops the bully\'s words from reaching anyone, and one kind message can undo a lot of mean ones.',
      },
      {
        text: 'Quit the game so you don\'t have to see it',
        isUpstander: false,
        feedback:
          'Leaving protects you, which matters — but your teammate is still alone with the mean words. Report, block, and a kind word help you both.',
      },
    ],
  },
  {
    id: 6,
    emoji: '💚',
    situation:
      'You once sent a message you regret — it was unkind, and you feel awful whenever you remember it.',
    question: 'What does a Kindness Guardian believe about mistakes?',
    choices: [
      {
        text: 'I\'m a bad person and shouldn\'t talk about it',
        isUpstander: false,
        feedback:
          'Everyone — even Po, the Privacy Panda himself — has made online mistakes. A mistake is something you did, not something you are.',
      },
      {
        text: 'I can apologise, learn from it, and choose kindness next time',
        isUpstander: true,
        feedback:
          'That is the whole secret of the forest: mistakes are how guardians are made. Po became Privacy Panda because of his mistake, not in spite of it.',
      },
      {
        text: 'Mistakes online don\'t matter, so forget it',
        isUpstander: false,
        feedback:
          'Online words do reach real hearts. But the answer isn\'t shame — it\'s a real apology and a kinder choice next time.',
      },
    ],
  },
];

const KindnessGuardians: React.FC<KindnessGuardiansProps> = ({ onBack, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const scenario = SCENARIOS[index];

  const pick = (choiceIndex: number) => {
    if (selected !== null) {
      return;
    }
    setSelected(choiceIndex);
    if (scenario.choices[choiceIndex].isUpstander) {
      setCorrectCount((c) => c + 1);
    }
  };

  const next = () => {
    if (index >= SCENARIOS.length - 1) {
      setFinished(true);
      onComplete?.(Math.round((correctCount / SCENARIOS.length) * 100));
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  if (finished) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
        <span className="text-6xl" aria-hidden>
          💚
        </span>
        <h2 className="mt-3 text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
          Kindness Guardian trained!
        </h2>
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-200">
          You chose the guardian move {correctCount} out of {SCENARIOS.length} times.
        </p>
        <p className="mt-3 rounded-xl bg-emerald-100 p-3 font-semibold text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100">
          Remember the three guardian moves: check on the person, don't pass the hurt along, and
          tell a trusted grown-up when it's too big.
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
      <div className="flex items-center justify-between">
        <p className="font-bold text-gray-600 dark:text-gray-300">
          Scenario {index + 1} of {SCENARIOS.length}
        </p>
        <p className="font-bold text-emerald-700 dark:text-emerald-300">💚 {correctCount}</p>
      </div>

      <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <span className="text-4xl" aria-hidden>
          {scenario.emoji}
        </span>
        <p className="mt-2 text-lg text-gray-800 dark:text-gray-100">{scenario.situation}</p>
        <p className="mt-3 font-bold text-gray-900 dark:text-gray-100">{scenario.question}</p>

        <div className="mt-3 space-y-2">
          {scenario.choices.map((choice, i) => {
            const isPicked = selected === i;
            const revealed = selected !== null;
            return (
              <button
                key={i}
                type="button"
                onClick={() => pick(i)}
                disabled={revealed}
                className={`w-full rounded-xl border-2 p-3 text-left font-semibold transition-colors ${
                  revealed && choice.isUpstander
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100'
                    : isPicked
                      ? 'border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100'
                      : 'border-gray-200 text-gray-800 hover:border-emerald-300 dark:border-gray-600 dark:text-gray-100 dark:hover:border-emerald-600'
                } ${revealed ? 'cursor-default' : ''}`}
              >
                {choice.text}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div
            className={`mt-3 rounded-xl p-3 font-medium ${
              scenario.choices[selected].isUpstander
                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100'
                : 'bg-sky-100 text-sky-900 dark:bg-sky-900/50 dark:text-sky-100'
            }`}
            role="status"
          >
            {scenario.choices[selected].feedback}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[52px] flex-1 rounded-2xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={selected === null}
          className="min-h-[52px] flex-[2] rounded-2xl bg-emerald-700 text-lg font-extrabold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400"
        >
          {index >= SCENARIOS.length - 1 ? 'Finish' : 'Next scenario →'}
        </button>
      </div>
    </div>
  );
};

export default KindnessGuardians;

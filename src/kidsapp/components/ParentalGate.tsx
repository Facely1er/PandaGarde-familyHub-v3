import React, { useMemo, useState } from 'react';

interface ParentalGateProps {
  onPass: () => void;
  onCancel: () => void;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Store-compliant parental gate: a multiplication challenge a young child
 * cannot easily pass. Required before any external link or adult section.
 */
const ParentalGate: React.FC<ParentalGateProps> = ({ onPass, onCancel }) => {
  const challenge = useMemo(() => {
    const a = randomInt(6, 12);
    const b = randomInt(6, 12);
    return { a, b, answer: a * b };
  }, []);
  const [input, setInput] = useState('');
  const [wrong, setWrong] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (Number(input.trim()) === challenge.answer) {
      onPass();
    } else {
      setWrong(true);
      setInput('');
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Grown-ups only</h2>
      <p className="mt-1 text-gray-600 dark:text-gray-300">
        Please ask a parent or guardian to answer this question.
      </p>
      <form onSubmit={submit} className="mt-4">
        <label
          htmlFor="parental-gate-answer"
          className="block text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          What is {challenge.a} × {challenge.b}?
        </label>
        <input
          id="parental-gate-answer"
          type="number"
          inputMode="numeric"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setWrong(false);
          }}
          className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-lg text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
          autoComplete="off"
        />
        {wrong && (
          <p className="mt-2 font-semibold text-red-700 dark:text-red-300" role="alert">
            That is not right — please try again.
          </p>
        )}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[48px] flex-1 rounded-xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="min-h-[48px] flex-1 rounded-xl bg-emerald-700 font-bold text-white hover:bg-emerald-800 dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400"
          >
            Unlock
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParentalGate;

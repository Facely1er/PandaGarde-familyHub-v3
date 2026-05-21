export type StoryViewMode = 'interactive' | 'chapters';

interface StoryModeSwitcherProps {
  mode: StoryViewMode;
  onModeChange: (mode: StoryViewMode) => void;
  sceneCount: number;
  chapterCount: number;
}

export function StoryModeSwitcher({
  mode,
  onModeChange,
  sceneCount,
  chapterCount,
}: StoryModeSwitcherProps) {
  return (
    <div
      role="tablist"
      aria-label="How to experience this story"
      className="flex flex-col gap-2 sm:flex-row sm:items-stretch rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-1"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'interactive'}
        onClick={() => onModeChange('interactive')}
        className={`flex-1 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors min-h-[44px] ${
          mode === 'interactive'
            ? 'bg-white dark:bg-gray-800 text-green-800 dark:text-green-300 shadow-sm ring-1 ring-green-600/20 dark:ring-green-500/30'
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60'
        }`}
      >
        <span className="block font-semibold">Interactive journey</span>
        <span className="block text-xs font-normal opacity-80 mt-0.5">
          Illustrations · narration · {sceneCount} scenes
        </span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'chapters'}
        onClick={() => onModeChange('chapters')}
        className={`flex-1 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors min-h-[44px] ${
          mode === 'chapters'
            ? 'bg-white dark:bg-gray-800 text-green-800 dark:text-green-300 shadow-sm ring-1 ring-green-600/20 dark:ring-green-500/30'
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60'
        }`}
      >
        <span className="block font-semibold">Chapter reader</span>
        <span className="block text-xs font-normal opacity-80 mt-0.5">
          Calm read-aloud · {chapterCount} chapters
        </span>
      </button>
    </div>
  );
}

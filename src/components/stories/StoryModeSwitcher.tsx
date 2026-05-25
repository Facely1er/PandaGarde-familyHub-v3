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
      className="story-mode-switcher"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'interactive'}
        onClick={() => onModeChange('interactive')}
        className={`story-mode-switcher__tab ${mode === 'interactive' ? 'story-mode-switcher__tab--active' : ''}`}
      >
        <span className="story-mode-switcher__title">Interactive journey</span>
        <span className="story-mode-switcher__meta">
          Illustrations · narration · {sceneCount} scenes
        </span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'chapters'}
        onClick={() => onModeChange('chapters')}
        className={`story-mode-switcher__tab ${mode === 'chapters' ? 'story-mode-switcher__tab--active' : ''}`}
      >
        <span className="story-mode-switcher__title">Chapter reader</span>
        <span className="story-mode-switcher__meta">
          Calm read-aloud · {chapterCount} chapters
        </span>
      </button>
    </div>
  );
}

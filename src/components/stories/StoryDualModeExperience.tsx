import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InteractiveStoryPlayer from '../story/InteractiveStoryPlayer';
import StoryProgress from '../story/StoryProgress';
import type { StorySceneData } from '../../data/storyScenes';
import { Story } from '../../data/stories';
import { migrateLegacyStoryStorage, storyChoicesKey, storyProgressKey } from '../../lib/storyStorageKeys';
import { logger } from '../../lib/logger';
import { StoryCoverArt } from './StoryCoverArt';
import { StoryEpilogue } from './StoryEpilogue';
import { StoryModeSwitcher, StoryViewMode } from './StoryModeSwitcher';
import { StoryReader } from './StoryReader';

const DEFAULT_ACHIEVEMENTS = [
  { id: 'first-scene', name: 'Story Starter', description: 'Read your first scene', icon: '📖', unlocked: false },
  { id: 'privacy-learner', name: 'Privacy Learner', description: 'Learn about privacy concepts', icon: '🛡️', unlocked: false },
  { id: 'wise-choices', name: 'Wise Choices', description: 'Make 3 good decisions', icon: '🧠', unlocked: false },
  { id: 'story-complete', name: 'Story Master', description: 'Complete the entire story', icon: '🏆', unlocked: false },
];

const MODE_PARAM = 'mode';

function parseMode(searchParams: URLSearchParams): StoryViewMode {
  return searchParams.get(MODE_PARAM) === 'chapters' ? 'chapters' : 'interactive';
}

export interface StoryDualModeExperienceProps {
  story: Story;
  scenes: StorySceneData[];
  introEyebrow: string;
  introBody: string;
  /** Cover band above intro (continuation episodes). */
  showCoverBanner?: boolean;
}

export function StoryDualModeExperience({
  story,
  scenes,
  introEyebrow,
  introBody,
  showCoverBanner = false,
}: StoryDualModeExperienceProps) {
  const progressKey = storyProgressKey(story.slug);
  const choicesKey = storyChoicesKey(story.slug);
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<StoryViewMode>(() => parseMode(searchParams));
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [showInteractiveEpilogue, setShowInteractiveEpilogue] = useState(false);
  const [achievements, setAchievements] = useState(DEFAULT_ACHIEVEMENTS);

  const sceneCount = scenes.length;
  const privacyLearnerScene = Math.min(2, sceneCount - 1);

  const setViewMode = useCallback(
    (next: StoryViewMode) => {
      setMode(next);
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === 'chapters') {
            params.set(MODE_PARAM, 'chapters');
          } else {
            params.delete(MODE_PARAM);
          }
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  useEffect(() => {
    setMode(parseMode(searchParams));
  }, [searchParams]);

  const handleSceneChange = useCallback(
    (sceneId: string) => {
      const sceneIndex = scenes.findIndex((scene) => scene.id === sceneId);
      if (sceneIndex !== -1) {
        setCurrentSceneIndex(sceneIndex);
      }
    },
    [scenes]
  );

  const handleChoiceMade = useCallback(() => {
    try {
      const savedChoicesStr = localStorage.getItem(choicesKey) || '[]';
      const savedChoices = JSON.parse(savedChoicesStr);
      if (!Array.isArray(savedChoices)) {
        return;
      }

      if (savedChoices.length >= 3) {
        setAchievements((prev) =>
          prev.map((a) => (a.id === 'wise-choices' ? { ...a, unlocked: true } : a))
        );
      }
    } catch (error) {
      logger.error('Error checking story choices:', error);
    }
  }, [choicesKey]);

  const handleStoryComplete = useCallback(() => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === 'story-complete' ? { ...a, unlocked: true } : a))
    );
    setPoints((prev) => prev + 50);
    setShowInteractiveEpilogue(true);
  }, []);

  useEffect(() => {
    if (currentSceneIndex === 0) {
      setAchievements((prev) =>
        prev.map((a) => (a.id === 'first-scene' ? { ...a, unlocked: true } : a))
      );
    }
  }, [currentSceneIndex]);

  useEffect(() => {
    if (currentSceneIndex >= privacyLearnerScene) {
      setAchievements((prev) =>
        prev.map((a) => (a.id === 'privacy-learner' ? { ...a, unlocked: true } : a))
      );
    }
  }, [currentSceneIndex, privacyLearnerScene]);

  useEffect(() => {
    migrateLegacyStoryStorage(story.slug);
    const savedProgress = localStorage.getItem(progressKey);
    if (!savedProgress) {
      return;
    }
    try {
      const progress = JSON.parse(savedProgress);
      setCurrentSceneIndex(progress.sceneIndex ?? 0);
      setPoints(progress.points ?? 0);
      if (Array.isArray(progress.achievements) && progress.achievements.length > 0) {
        setAchievements(progress.achievements);
      }
      if (progress.sceneIndex >= scenes.length - 1) {
        setShowInteractiveEpilogue(true);
      }
    } catch (error) {
      logger.error('Error loading story progress:', error);
    }
  }, [progressKey, scenes.length, story.slug]);

  useEffect(() => {
    const progress = {
      sceneIndex: currentSceneIndex,
      points,
      achievements,
      timestamp: Date.now(),
    };
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }, [currentSceneIndex, points, achievements, progressKey]);

  useEffect(() => {
    if (showInteractiveEpilogue && mode === 'interactive') {
      document.getElementById('story-epilogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showInteractiveEpilogue, mode]);

  const chapterCount = story.chapters.length;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-12">
      <Link
        to="/stories"
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/50 min-h-[44px]"
      >
        <ArrowLeft size={18} aria-hidden />
        All stories
      </Link>

      {showCoverBanner && (
        <div className="mb-6 flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sm:flex-row">
          <StoryCoverArt story={story} variant="banner" />
          <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6">
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{story.summary}</p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {chapterCount} chapters · {story.activities.length} activities
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div className="story-intro-panel shell-card shell-card--panel p-5 sm:p-6">
          <p className="story-intro-panel__eyebrow mb-2">{introEyebrow}</p>
          <p className="story-intro-panel__body text-sm leading-relaxed">{introBody}</p>
        </div>

        <StoryModeSwitcher
          mode={mode}
          onModeChange={setViewMode}
          sceneCount={sceneCount}
          chapterCount={chapterCount}
        />
      </div>

      {mode === 'interactive' ? (
        <>
          <div
            id="story-player"
            className="story-player-shell mb-6 overflow-hidden"
            role="tabpanel"
            aria-label="Interactive story"
          >
            <InteractiveStoryPlayer
              scenes={scenes}
              currentSceneIndex={currentSceneIndex}
              onSceneIndexChange={setCurrentSceneIndex}
              onSceneChange={handleSceneChange}
              onStoryComplete={handleStoryComplete}
              onChoiceMade={handleChoiceMade}
              hideControls={false}
            />
          </div>

          <div className="mb-8">
            <StoryProgress
              currentScene={currentSceneIndex + 1}
              totalScenes={sceneCount}
              points={points}
              achievements={achievements}
              showDetailedProgress
            />
          </div>

          {showInteractiveEpilogue ? (
            <StoryEpilogue story={story} id="story-epilogue" />
          ) : (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Complete the final scene to see the lesson and family activities. Prefer reading?
              <button
                type="button"
                onClick={() => setViewMode('chapters')}
                className="ml-1 font-medium text-green-700 underline dark:text-green-400"
              >
                Open chapter reader
              </button>
            </p>
          )}
        </>
      ) : (
        <div role="tabpanel" aria-label="Chapter reader">
          <StoryReader key={story.id} story={story} embedded showBackLink={false} />
        </div>
      )}
    </div>
  );
}

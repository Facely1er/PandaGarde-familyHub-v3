import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InteractiveStoryPlayer from '../story/InteractiveStoryPlayer';
import StoryProgress from '../story/StoryProgress';
import { foundationStoryScenes } from '../../data/storyScenes';
import { Story } from '../../data/stories';
import {
  migrateLegacyStoryStorage,
  storyChoicesKey,
  storyProgressKey,
} from '../../lib/storyStorageKeys';
import { StoryEpilogue } from './StoryEpilogue';
import { StoryModeSwitcher, StoryViewMode } from './StoryModeSwitcher';
import { StoryReader } from './StoryReader';
import { logger } from '../../lib/logger';

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

interface BambooForestStoryExperienceProps {
  story: Story;
}

export function BambooForestStoryExperience({ story }: BambooForestStoryExperienceProps) {
  const progressKey = storyProgressKey(story.slug);
  const choicesKey = storyChoicesKey(story.slug);
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<StoryViewMode>(() => parseMode(searchParams));
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [showInteractiveEpilogue, setShowInteractiveEpilogue] = useState(false);
  const [achievements, setAchievements] = useState(DEFAULT_ACHIEVEMENTS);

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

  const handleSceneChange = useCallback((sceneId: string) => {
    const sceneIndex = foundationStoryScenes.findIndex((scene) => scene.id === sceneId);
    if (sceneIndex !== -1) {
      setCurrentSceneIndex(sceneIndex);
    }
  }, []);

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
    if (currentSceneIndex >= 5) {
      setAchievements((prev) =>
        prev.map((a) => (a.id === 'privacy-learner' ? { ...a, unlocked: true } : a))
      );
    }
  }, [currentSceneIndex]);

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
      if (progress.sceneIndex >= foundationStoryScenes.length - 1) {
        setShowInteractiveEpilogue(true);
      }
    } catch (error) {
      logger.error('Error loading story progress:', error);
    }
  }, [progressKey, story.slug]);

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

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-12">
      <Link
        to="/stories"
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/50 min-h-[44px]"
      >
        <ArrowLeft size={18} aria-hidden />
        All stories
      </Link>

      <div className="mb-6 space-y-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/40 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
            Episode {story.episodeNumber} · Foundation story
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Two ways through the same Digital Bamboo Forest: follow illustrated scenes with narration, or read
            chapter-by-chapter at your own pace. Switch anytime—activities unlock when you finish either path.
          </p>
        </div>

        <StoryModeSwitcher
          mode={mode}
          onModeChange={setViewMode}
          sceneCount={foundationStoryScenes.length}
          chapterCount={story.chapters.length}
        />
      </div>

      {mode === 'interactive' ? (
        <>
          <div
            id="story-player"
            className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
            role="tabpanel"
            aria-label="Interactive story"
          >
            <InteractiveStoryPlayer
              scenes={foundationStoryScenes}
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
              totalScenes={foundationStoryScenes.length}
              points={points}
              achievements={achievements}
              showDetailedProgress
            />
          </div>

          {showInteractiveEpilogue ? (
            <StoryEpilogue story={story} id="story-epilogue" />
          ) : (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Complete the final scene to see Privacy Panda&apos;s lesson and family activities. Prefer reading?
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

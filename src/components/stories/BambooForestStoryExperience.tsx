import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Volume2 } from 'lucide-react';
import InteractiveStoryPlayer from '../story/InteractiveStoryPlayer';
import StoryProgress from '../story/StoryProgress';
import { storyScenes } from '../../data/storyScenes';
import { Story } from '../../data/stories';
import { StoryEpilogue } from './StoryEpilogue';
import { logger } from '../../lib/logger';

const DEFAULT_ACHIEVEMENTS = [
  { id: 'first-scene', name: 'Story Starter', description: 'Read your first scene', icon: '📖', unlocked: false },
  { id: 'privacy-learner', name: 'Privacy Learner', description: 'Learn about privacy concepts', icon: '🛡️', unlocked: false },
  { id: 'wise-choices', name: 'Wise Choices', description: 'Make 3 good decisions', icon: '🧠', unlocked: false },
  { id: 'story-complete', name: 'Story Master', description: 'Complete the entire story', icon: '🏆', unlocked: false },
];

interface BambooForestStoryExperienceProps {
  story: Story;
}

export function BambooForestStoryExperience({ story }: BambooForestStoryExperienceProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [showEpilogue, setShowEpilogue] = useState(false);
  const [achievements, setAchievements] = useState(DEFAULT_ACHIEVEMENTS);

  const handleSceneChange = useCallback((sceneId: string) => {
    const sceneIndex = storyScenes.findIndex((scene) => scene.id === sceneId);
    if (sceneIndex !== -1) {
      setCurrentSceneIndex(sceneIndex);
    }
  }, []);

  const handleChoiceMade = useCallback(() => {
    try {
      const savedChoicesStr = localStorage.getItem('story-choices') || '[]';
      const savedChoices = JSON.parse(savedChoicesStr);
      if (!Array.isArray(savedChoices)) return;

      if (savedChoices.length >= 3) {
        setAchievements((prev) =>
          prev.map((a) => (a.id === 'wise-choices' ? { ...a, unlocked: true } : a))
        );
      }
    } catch (error) {
      logger.error('Error checking story choices:', error);
    }
  }, []);

  const handleStoryComplete = useCallback(() => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === 'story-complete' ? { ...a, unlocked: true } : a))
    );
    setPoints((prev) => prev + 50);
    setShowEpilogue(true);
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
    const savedProgress = localStorage.getItem('story-progress');
    if (!savedProgress) return;
    try {
      const progress = JSON.parse(savedProgress);
      setCurrentSceneIndex(progress.sceneIndex ?? 0);
      setPoints(progress.points ?? 0);
      if (Array.isArray(progress.achievements) && progress.achievements.length > 0) {
        setAchievements(progress.achievements);
      }
      if (progress.sceneIndex >= storyScenes.length - 1) {
        setShowEpilogue(true);
      }
    } catch (error) {
      logger.error('Error loading story progress:', error);
    }
  }, []);

  useEffect(() => {
    const progress = {
      sceneIndex: currentSceneIndex,
      points,
      achievements,
      timestamp: Date.now(),
    };
    localStorage.setItem('story-progress', JSON.stringify(progress));
  }, [currentSceneIndex, points, achievements]);

  useEffect(() => {
    if (showEpilogue) {
      document.getElementById('story-epilogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showEpilogue]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-12">
      <Link
        to="/stories"
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/50 min-h-[44px]"
      >
        <ArrowLeft size={18} aria-hidden />
        All stories
      </Link>

      <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/40 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <span className="text-4xl" aria-hidden>
            {story.coverEmoji}
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
              Episode {story.episodeNumber} · Foundation story
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              The Digital Bamboo Forest is the core Privacy Panda journey: illustrated scenes, play/pause
              narration, and progress saved on your device. Finish the story to unlock discussion activities below.
            </p>
            <ul className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
              <li className="inline-flex items-center gap-1">
                <BookOpen size={14} aria-hidden />
                {storyScenes.length} scenes
              </li>
              <li className="inline-flex items-center gap-1">
                <Volume2 size={14} aria-hidden />
                Narration (listen or read)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div id="story-player" className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <InteractiveStoryPlayer
          scenes={storyScenes}
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
          totalScenes={storyScenes.length}
          points={points}
          achievements={achievements}
          showDetailedProgress
        />
      </div>

      {showEpilogue ? (
        <StoryEpilogue story={story} id="story-epilogue" />
      ) : (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Complete the final scene to see Privacy Panda&apos;s lesson and family activities.
        </p>
      )}
    </div>
  );
}

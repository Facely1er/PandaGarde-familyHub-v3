import React, { Suspense, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getStoryBySlug } from '../../data/stories';
import { StoryCoverArt } from '../../components/stories/StoryCoverArt';
import { useKidsProgress } from '../KidsProgressContext';
import { PILLAR_GAMES, PILLAR_META } from '../kidsContent';

type Phase = 'story' | 'game' | 'ceremony';

const GameFallback: React.FC = () => (
  <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
    <span className="animate-bounce text-5xl" aria-hidden>
      🎮
    </span>
    <span className="sr-only">Loading game…</span>
  </div>
);

/** Episode flow: read the story chapter by chapter → play the pillar's mini-game → badge ceremony. */
const EpisodeScreen: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { markStoryRead, markEpisodeComplete } = useKidsProgress();
  const [phase, setPhase] = useState<Phase>('story');
  const [chapterIndex, setChapterIndex] = useState(0);
  const [gameScore, setGameScore] = useState<number | null>(null);

  const story = slug ? getStoryBySlug(slug) : undefined;

  if (!story) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <span className="text-5xl" aria-hidden>
          🙈
        </span>
        <p className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">
          This part of the forest is hidden!
        </p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-2xl bg-emerald-700 px-6 py-3 font-bold text-white dark:bg-emerald-500 dark:text-gray-900"
        >
          Back to the Forest Map
        </Link>
      </div>
    );
  }

  const pillar = PILLAR_META[story.questPillar];
  const game = PILLAR_GAMES[story.questPillar];
  const chapter = story.chapters[chapterIndex];
  const isLastChapter = chapterIndex >= story.chapters.length - 1;

  const finishStory = () => {
    markStoryRead(story.slug, story.questPillar);
    setPhase('game');
  };

  const handleGameComplete = (score?: number) => {
    setGameScore(score ?? null);
    markEpisodeComplete(story.slug, story.questPillar, score);
    setPhase('ceremony');
  };

  if (phase === 'game') {
    const GameComponent = game.Component;
    return (
      <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300">
            <span aria-hidden>{game.emoji}</span> {game.name}
          </h1>
          <button
            type="button"
            onClick={() => setPhase('story')}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Back to story
          </button>
        </div>
        <Suspense fallback={<GameFallback />}>
          <GameComponent onBack={() => setPhase('story')} onComplete={handleGameComplete} />
        </Suspense>
      </div>
    );
  }

  if (phase === 'ceremony') {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-10 text-center">
        <span className="animate-bounce text-7xl" aria-hidden>
          🏅
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-emerald-800 dark:text-emerald-300">
          You earned the {pillar.badgeName}!
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Episode {story.episodeNumber}: {story.title} — complete!
        </p>
        {gameScore !== null && (
          <p className="mt-1 font-semibold text-amber-700 dark:text-amber-300">
            Game score: {gameScore}
          </p>
        )}
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-100 p-4 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-100">
          <p className="font-bold">Forest Wisdom</p>
          <p className="mt-1">{story.keyLesson}</p>
        </div>
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="min-h-[56px] flex-1 rounded-2xl bg-emerald-700 text-lg font-extrabold text-white hover:bg-emerald-800 dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400"
          >
            Back to the Forest Map 🗺️
          </button>
          <button
            type="button"
            onClick={() => navigate('/badges')}
            className="min-h-[56px] flex-1 rounded-2xl border-2 border-emerald-700 text-lg font-extrabold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
          >
            See My Badges 🏅
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/"
          className="rounded-xl px-3 py-2 font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          ← Map
        </Link>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${pillar.chipClass}`}
        >
          <span aria-hidden>{pillar.emoji}</span>
          {pillar.label}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl">
        <StoryCoverArt story={story} variant="banner" />
      </div>

      <h1 className="mt-4 text-2xl font-extrabold text-emerald-800 dark:text-emerald-300 sm:text-3xl">
        {story.title}
      </h1>

      <div className="mt-2 flex items-center gap-2" aria-label={`Chapter ${chapterIndex + 1} of ${story.chapters.length}`}>
        {story.chapters.map((c, i) => (
          <span
            key={c.id}
            className={`h-2.5 flex-1 rounded-full ${
              i <= chapterIndex ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}
            aria-hidden
          />
        ))}
      </div>

      <article className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{chapter.title}</h2>
        <div className="mt-3 space-y-4 text-lg leading-relaxed text-gray-700 dark:text-gray-200">
          {chapter.content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        {chapter.lessonHighlight && (
          <p className="mt-4 rounded-xl bg-amber-100 p-3 font-semibold text-amber-900 dark:bg-amber-900/50 dark:text-amber-100">
            💡 {chapter.lessonHighlight}
          </p>
        )}
      </article>

      <div className="mt-5 flex gap-3 pb-8">
        <button
          type="button"
          onClick={() => setChapterIndex((i) => Math.max(0, i - 1))}
          disabled={chapterIndex === 0}
          className="min-h-[56px] flex-1 rounded-2xl border-2 border-gray-300 text-lg font-bold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          ← Back
        </button>
        {isLastChapter ? (
          <button
            type="button"
            onClick={finishStory}
            className="min-h-[56px] flex-[2] rounded-2xl bg-emerald-700 text-lg font-extrabold text-white hover:bg-emerald-800 dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400"
          >
            Play {game.name}! {game.emoji}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setChapterIndex((i) => i + 1)}
            className="min-h-[56px] flex-[2] rounded-2xl bg-emerald-700 text-lg font-extrabold text-white hover:bg-emerald-800 dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400"
          >
            Next Chapter →
          </button>
        )}
      </div>
    </div>
  );
};

export default EpisodeScreen;

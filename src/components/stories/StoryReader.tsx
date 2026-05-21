import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../../data/stories';
import { ActivityCard } from './ActivityCard';

export function StoryReader({ story }: { story: Story }) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const chapter = story.chapters[currentChapter];
  const isFirst = currentChapter === 0;
  const isLast = currentChapter === story.chapters.length - 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to="/stories"
        className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 mb-6"
      >
        ← All Stories
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full">
            Episode {story.episodeNumber}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{story.privacyTopic}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-5xl" aria-hidden="true">
            {story.coverEmoji}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{story.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {story.characters.slice(0, 3).join(' · ')}
              {story.characters.length > 3 ? ` +${story.characters.length - 3} more` : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 mb-6" role="tablist" aria-label="Chapter progress">
        {story.chapters.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            role="tab"
            aria-selected={i === currentChapter}
            aria-label={`Chapter ${i + 1}: ${ch.title}`}
            onClick={() => setCurrentChapter(i)}
            title={ch.title}
            className={`flex-1 h-1.5 rounded-full transition-colors duration-200 ${
              i === currentChapter
                ? 'bg-green-500'
                : i < currentChapter
                  ? 'bg-green-200 dark:bg-green-800'
                  : 'bg-gray-200 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>

      <div className="mb-8" role="tabpanel">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {currentChapter + 1}. {chapter.title}
        </h2>

        <div className="prose prose-green prose-sm max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {chapter.content}
        </div>

        {chapter.lessonHighlight && (
          <blockquote className="mt-6 border-l-4 border-green-500 pl-4 py-1 bg-green-50 dark:bg-green-950 rounded-r-lg">
            <p className="text-green-800 dark:text-green-200 font-medium text-sm italic">
              💡 {chapter.lessonHighlight}
            </p>
          </blockquote>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-6">
        <button
          type="button"
          onClick={() => setCurrentChapter((c) => c - 1)}
          disabled={isFirst}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>

        <span className="text-xs text-gray-400 dark:text-gray-500">
          {currentChapter + 1} / {story.chapters.length}
        </span>

        {!isLast ? (
          <button
            type="button"
            onClick={() => setCurrentChapter((c) => c + 1)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Next →
          </button>
        ) : (
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">🎉 The End!</span>
        )}
      </div>

      {isLast && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-5">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
              🐼 Privacy Panda&apos;s Lesson
            </p>
            <p className="text-green-800 dark:text-green-200 font-medium text-base leading-relaxed">
              &ldquo;{story.keyLesson}&rdquo;
            </p>
          </div>

          {story.activities.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
                🎮 Activities for this story
              </h3>
              {story.activities.map((act) => (
                <ActivityCard key={act.id} activity={act} />
              ))}
            </div>
          )}

          <div className="text-center pt-4">
            <Link
              to="/stories"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              📚 Read More Stories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

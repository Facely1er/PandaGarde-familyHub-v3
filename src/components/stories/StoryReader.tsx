import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Story } from '../../data/stories';
import { StoryEpilogue } from './StoryEpilogue';

interface StoryReaderProps {
  story: Story;
  /** When true, title comes from PageLayout; omit duplicate page heading. */
  embedded?: boolean;
}

export function StoryReader({ story, embedded = false }: StoryReaderProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const chapter = story.chapters[currentChapter];
  const isFirst = currentChapter === 0;
  const isLast = currentChapter === story.chapters.length - 1;

  return (
    <div className={`mx-auto ${embedded ? 'max-w-3xl px-4 sm:px-6 pb-12' : 'max-w-2xl px-4 py-8'}`}>
      <Link
        to="/stories"
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/50 min-h-[44px]"
      >
        <ArrowLeft size={18} aria-hidden />
        All stories
      </Link>

      {!embedded && (
        <div className="mb-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
              Episode {story.episodeNumber}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{story.privacyTopic}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-5xl" aria-hidden>
              {story.coverEmoji}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{story.title}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {story.characters.slice(0, 3).join(' · ')}
                {story.characters.length > 3 ? ` +${story.characters.length - 3} more` : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {embedded && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
            Episode {story.episodeNumber}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{story.privacyTopic}</span>
        </div>
      )}

      <div
        className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
        role="tablist"
        aria-label="Chapter progress"
      >
        <div className="mb-4 flex gap-1.5">
          {story.chapters.map((ch, i) => (
            <button
              key={ch.id}
              type="button"
              role="tab"
              aria-selected={i === currentChapter}
              aria-label={`Chapter ${i + 1}: ${ch.title}`}
              onClick={() => setCurrentChapter(i)}
              title={ch.title}
              className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
                i === currentChapter
                  ? 'bg-green-600 dark:bg-green-500'
                  : i < currentChapter
                    ? 'bg-green-200 dark:bg-green-800'
                    : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        <div role="tabpanel">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {currentChapter + 1}. {chapter.title}
          </h2>

          <div className="prose prose-green prose-sm max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {chapter.content}
          </div>

          {chapter.lessonHighlight && (
            <blockquote className="mt-6 rounded-r-lg border-l-4 border-green-500 bg-green-50 py-2 pl-4 dark:bg-green-950">
              <p className="text-sm font-medium italic text-green-800 dark:text-green-200">
                {chapter.lessonHighlight}
              </p>
            </blockquote>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
        <button
          type="button"
          onClick={() => setCurrentChapter((c) => c - 1)}
          disabled={isFirst}
          className="button button-secondary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} aria-hidden />
          Previous
        </button>

        <span className="text-xs text-gray-500 dark:text-gray-400">
          {currentChapter + 1} / {story.chapters.length}
        </span>

        {!isLast ? (
          <button
            type="button"
            onClick={() => setCurrentChapter((c) => c + 1)}
            className="button button-primary"
          >
            Next
            <ArrowRight size={16} aria-hidden />
          </button>
        ) : (
          <span className="text-sm font-semibold text-green-700 dark:text-green-400">The end</span>
        )}
      </div>

      {isLast && <StoryEpilogue story={story} />}
    </div>
  );
}

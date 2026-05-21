import React from 'react';
import { Book, Play, Heart, Star, Users, Sparkles, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import InteractiveStoryPlayer from '../components/story/InteractiveStoryPlayer';
import { storyScenes } from '../data/storyScenes';
import PageLayout from '../components/layout/PageLayout';

const discussionQuestions = [
  'What happened when Po accidentally shared all his information? How do you think he felt?',
  'What are some examples of personal information that should be kept private?',
  'How did Privacy Panda help other animals in the forest? What made him a good teacher?',
  'What can you do to create your own "Privacy Shield" when using devices or apps?',
] as const;

const StoryPage: React.FC = () => {
  return (
    <PageLayout
      title="Privacy Panda and the Digital Bamboo Forest"
      subtitle="Join Po the Panda on an adventure through the Digital Bamboo Forest as he learns about privacy, sharing, and staying safe online."
      breadcrumbs
    >
      <div className="mx-auto max-w-5xl space-y-12 pb-8">
        <section
          className="rounded-r-2xl border-l-4 border-green-600 bg-green-50 p-6 dark:border-green-500 dark:bg-green-950/40"
          aria-labelledby="about-story-heading"
        >
          <h2
            id="about-story-heading"
            className="mb-3 text-2xl font-bold text-green-800 dark:text-green-300"
          >
            About This Story
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            This story teaches children about digital privacy through the adventures of Po the Panda.
            It covers important concepts like protecting personal information, understanding privacy settings,
            and being careful about what we share online. Perfect for reading together with children ages 5–12.
          </p>
        </section>

        <section aria-label="Interactive story">
          <InteractiveStoryPlayer scenes={storyScenes} initialViewMode="fulltext" hideControls={false} />
        </section>

        <section
          className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 dark:border-gray-700 dark:bg-gray-800/80"
          aria-labelledby="discussion-heading"
        >
          <h2
            id="discussion-heading"
            className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl"
          >
            Discussion Questions
          </h2>
          <ol className="space-y-4">
            {discussionQuestions.map((question, index) => (
              <li key={question} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white dark:bg-green-500"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <p className="text-gray-700 dark:text-gray-300">{question}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-green-50 p-6 sm:p-8 dark:border-blue-800/60 dark:from-blue-950/30 dark:to-green-950/20"
          aria-labelledby="family-hub-cta-heading"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
              <Users size={32} className="text-blue-600 dark:text-blue-400" aria-hidden />
            </div>
            <h2
              id="family-hub-cta-heading"
              className="mb-3 text-2xl font-bold text-blue-900 dark:text-blue-200"
            >
              Continue in Family Hub
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-blue-800 dark:text-blue-300 sm:text-lg">
              Turn what you learned into short privacy missions at home—real situations, family talks, and
              progress that stays on your device.
            </p>
          </div>

          <ul className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <li className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <Heart size={24} className="mx-auto mb-2 text-red-500" aria-hidden />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">Family missions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Age-matched scenarios you practice together
              </p>
            </li>
            <li className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <Sparkles size={24} className="mx-auto mb-2 text-purple-500" aria-hidden />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">On-device progress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Streaks, badges, and certificates saved locally
              </p>
            </li>
            <li className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <Star size={24} className="mx-auto mb-2 text-amber-500" aria-hidden />
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">Parent-guided</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No child social network—practice together at home
              </p>
            </li>
          </ul>

          <div className="text-center">
            <Link
              to="/family-hub"
              className="button button-primary inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <Users size={20} aria-hidden />
              Open Family Hub
            </Link>
          </div>
        </section>

        <section
          className="rounded-2xl bg-gradient-to-r from-green-600 to-green-700 p-6 text-center text-white sm:p-8"
          aria-labelledby="continue-learning-heading"
        >
          <h2 id="continue-learning-heading" className="mb-4 text-2xl font-bold">
            Continue Learning with Privacy Panda
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg opacity-90">
            Explore more activities, games, and resources to help children learn about digital privacy and
            online safety.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/activity-book"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-gray-100"
            >
              <Book size={20} aria-hidden />
              Activity Book
            </Link>
            <Link
              to="/stories"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-green-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-900"
            >
              <Play size={20} aria-hidden />
              All Stories
            </Link>
            <Link
              to="/classroom-activities"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-gray-100"
            >
              <GraduationCap size={20} aria-hidden />
              Classroom Activities
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default StoryPage;

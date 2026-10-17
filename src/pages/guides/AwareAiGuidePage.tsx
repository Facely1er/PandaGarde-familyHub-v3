import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, BookOpen, ExternalLink, Shield } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';

/**
 * AWARE-style parent one-pager: chatbot risks, family habits, crisis pointers.
 * Educational only — not monitoring and not a crisis service (CONTENT_TRUTH).
 */
const AwareAiGuidePage: React.FC = () => {
  return (
    <PageLayout
      title="AWARE AI family one-pager"
      subtitle="A calm checklist for talking about chatbots and AI tools with kids and teens."
      breadcrumbs
    >
      <div className="mx-auto max-w-3xl space-y-8">
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30 print:border-amber-300">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" size={22} aria-hidden />
            <div>
              <h2 className="text-lg font-bold text-amber-950 dark:text-amber-100">Quick truth</h2>
              <p className="mt-1 text-sm leading-relaxed text-amber-900 dark:text-amber-100">
                PandaGarde teaches families how to use AI carefully. It is not a chatbot, not a
                crisis hotline, and not a monitoring tool. Treat AI prompts like messages that
                could be stored or reviewed.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            <Shield size={20} className="text-green-700 dark:text-green-400" aria-hidden />
            Family AWARE habits
          </h2>
          <ul className="mt-4 space-y-3 text-gray-700 dark:text-gray-200">
            <li>
              <strong className="text-gray-900 dark:text-gray-100">Ask first:</strong> Who built this
              tool, and what does it say about saving chats?
            </li>
            <li>
              <strong className="text-gray-900 dark:text-gray-100">Watch what you paste:</strong>{' '}
              Full names, addresses, school IDs, medical notes, and friends’ private writing stay
              out of prompts.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-gray-100">Assume memory:</strong> Even
              “temporary” chats may be logged. Prefer tools with clear history / delete controls.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-gray-100">Review together:</strong> Once a
              month, open one AI tool your teen uses and check privacy settings side by side.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-gray-100">Exit to a human:</strong> If a
              conversation feels scary, sad, or unsafe, stop and talk to a trusted adult — not the
              chatbot.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            <BookOpen size={20} className="text-teal-700 dark:text-teal-400" aria-hidden />
            Practice in PandaGarde
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/family-hub/activities?mission=ai-and-your-privacy"
              className="inline-flex min-h-[44px] items-center rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 dark:bg-teal-500 dark:text-gray-900"
            >
              Hub mission: AI &amp; Your Privacy
            </Link>
            <Link
              to="/stories/the-echo-chamber"
              className="inline-flex min-h-[44px] items-center rounded-xl border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-200 dark:hover:bg-teal-950/40"
            >
              Story: The Echo Chamber
            </Link>
            <Link
              to="/guides/device-setup"
              className="inline-flex min-h-[44px] items-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              Device setup guide
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-800 dark:bg-rose-950/30">
          <h2 className="text-xl font-bold text-rose-950 dark:text-rose-100">If someone needs help now</h2>
          <p className="mt-2 text-sm text-rose-900 dark:text-rose-100">
            These are public crisis resources — not PandaGarde features.
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href="https://988lifeline.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-rose-800 underline-offset-2 hover:underline dark:text-rose-200"
              >
                988 Suicide &amp; Crisis Lifeline
                <ExternalLink size={14} aria-hidden />
              </a>
            </li>
            <li>
              <a
                href="https://www.crisistextline.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-rose-800 underline-offset-2 hover:underline dark:text-rose-200"
              >
                Crisis Text Line — text HOME to 741741
                <ExternalLink size={14} aria-hidden />
              </a>
            </li>
          </ul>
        </section>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 print:hidden">
          Tip: use your browser’s print dialog to save this page as a one-page PDF for the fridge.
        </p>
      </div>
    </PageLayout>
  );
};

export default AwareAiGuidePage;

import { useEffect, type ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Lightbulb,
  Mail,
  Newspaper,
  Star,
  Users,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { getNewsletterById, isNewsletterReservedSegment } from '../data/newsletters';

function InternalLink({ to, children }: { to: string; children: ReactNode }) {
  if (!to) return <>{children}</>;
  return (
    <Link
      to={to}
      className="font-semibold text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
    >
      {children}
    </Link>
  );
}

export default function NewsletterIssuePage() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (id && isNewsletterReservedSegment(id)) {
    return <Navigate to={`/newsletter/${id}`} replace />;
  }

  const newsletter = id ? getNewsletterById(id) : undefined;

  if (!newsletter) {
    return (
      <PageLayout
        title="Newsletter not found"
        subtitle="This issue may not exist yet or the link may be wrong."
        breadcrumbs
      >
        <div className="mx-auto max-w-lg px-4 py-12 text-center">
          <Mail className="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-500" aria-hidden />
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Browse the archive for published privacy education newsletters.
          </p>
          <Link
            to="/newsletter/archive"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline dark:text-green-400"
          >
            <ArrowLeft size={16} aria-hidden />
            Back to archive
          </Link>
        </div>
      </PageLayout>
    );
  }

  const publishedLabel = new Date(newsletter.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <PageLayout
      title={`${newsletter.month} ${newsletter.year}: ${newsletter.title}`}
      subtitle="Privacy education newsletter issue"
      breadcrumbs
    >
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link
          to="/newsletter/archive"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
        >
          <ArrowLeft size={20} aria-hidden />
          Back to archive
        </Link>

        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" aria-hidden />
            {newsletter.month} {newsletter.year}
          </span>
          <span aria-hidden>·</span>
          <span>Published {publishedLabel}</span>
          {newsletter.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-2 py-1 text-xs font-semibold text-pink-800 dark:bg-pink-900/40 dark:text-pink-200">
              <Star size={12} aria-hidden />
              Featured
            </span>
          )}
        </div>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            <Newspaper className="h-5 w-5 text-green-700 dark:text-green-400" aria-hidden />
            {newsletter.featuredTopic.title}
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{newsletter.featuredTopic.description}</p>
          {newsletter.featuredTopic.articleUrl && (
            <p>
              <InternalLink to={newsletter.featuredTopic.articleUrl}>Read more on this topic →</InternalLink>
            </p>
          )}
        </section>

        {newsletter.monthlyTip && (
          <section className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/40">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />
              {newsletter.monthlyTip.title}
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{newsletter.monthlyTip.content}</p>
            {newsletter.monthlyTip.linkUrl && (
              <InternalLink to={newsletter.monthlyTip.linkUrl}>Try this tip on site →</InternalLink>
            )}
          </section>
        )}

        {newsletter.newActivities.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              <BookOpen className="h-5 w-5 text-green-700 dark:text-green-400" aria-hidden />
              New activities
            </h2>
            <ul className="space-y-4">
              {newsletter.newActivities.map((activity) => (
                <li
                  key={activity.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="mb-2 font-bold text-gray-900 dark:text-gray-100">{activity.title}</h3>
                  <p className="mb-3 text-gray-600 dark:text-gray-300">{activity.description}</p>
                  {activity.pageUrl && (
                    <InternalLink to={activity.pageUrl}>Open activity →</InternalLink>
                  )}
                  {activity.downloadUrl && (
                    <a
                      href={activity.downloadUrl}
                      className="font-semibold text-green-700 hover:text-green-800 dark:text-green-400"
                    >
                      Download →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {newsletter.privacyNews.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Privacy news</h2>
            <ul className="space-y-4">
              {newsletter.privacyNews.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="mb-2 font-bold text-gray-900 dark:text-gray-100">{item.title}</h3>
                  <p className="mb-3 text-gray-600 dark:text-gray-300">{item.summary}</p>
                  {item.linkUrl && <InternalLink to={item.linkUrl}>Learn more →</InternalLink>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {newsletter.communityHighlight && (
          <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
              <Users className="h-5 w-5 text-green-700 dark:text-green-400" aria-hidden />
              {newsletter.communityHighlight.title}
            </h2>
            <p className="mb-3 text-gray-600 dark:text-gray-300">{newsletter.communityHighlight.content}</p>
            {newsletter.communityHighlight.author && (
              <p className="text-sm text-gray-500 dark:text-gray-400">— {newsletter.communityHighlight.author}</p>
            )}
            {newsletter.communityHighlight.linkUrl && (
              <p className="mt-3">
                <InternalLink to={newsletter.communityHighlight.linkUrl}>See community →</InternalLink>
              </p>
            )}
          </section>
        )}

        {newsletter.resourceSpotlight && (
          <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
              {newsletter.resourceSpotlight.title}
            </h2>
            <p className="mb-3 text-gray-600 dark:text-gray-300">
              {newsletter.resourceSpotlight.description}
            </p>
            <InternalLink to={newsletter.resourceSpotlight.pageUrl}>View resource →</InternalLink>
          </section>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/newsletter"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-3 font-semibold text-white transition-all hover:from-pink-600 hover:to-rose-700"
          >
            <Mail size={20} aria-hidden />
            Subscribe to newsletter
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}

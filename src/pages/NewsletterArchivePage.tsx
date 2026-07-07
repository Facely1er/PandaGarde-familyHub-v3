import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Calendar, ArrowLeft, Star } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { newsletterArchive, newsletterIssuePath } from '../data/newsletters';

const NewsletterArchivePage: React.FC = () => {
  // Group newsletters by year
  const newslettersByYear = newsletterArchive.reduce((acc, newsletter) => {
    const year = newsletter.year.toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(newsletter);
    return acc;
  }, {} as Record<string, typeof newsletterArchive>);

  const years = Object.keys(newslettersByYear).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

  return (
    <PageLayout
      title="Newsletter Archive"
      subtitle="Past newsletter issues with privacy tips and family activities. Tap an issue to read it."
      breadcrumbs={true}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link
              to="/newsletter"
              className="mb-4 inline-flex items-center gap-2 font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
            >
              <ArrowLeft size={20} aria-hidden />
              Back to Newsletter
            </Link>
            <p className="text-gray-600 dark:text-gray-300">
              Pick a month below. Each issue has short tips you can try the same day.
            </p>
          </div>

          {years.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">No newsletters available yet.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {years.map((year) => (
                <div key={year}>
                  <h2 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl dark:text-gray-100">
                    {year}
                  </h2>
                  <div className="space-y-4">
                    {newslettersByYear[year].map((newsletter) => (
                      <Link
                        key={newsletter.id}
                        to={newsletterIssuePath(newsletter.id)}
                        className="block rounded-xl border border-gray-200 bg-white p-4 shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {newsletter.month} {newsletter.year}
                              </span>
                              {newsletter.featured && (
                                <span className="flex items-center gap-1 rounded-full bg-pink-100 px-2 py-1 text-xs font-semibold text-pink-800 dark:bg-pink-900/40 dark:text-pink-200">
                                  <Star size={12} aria-hidden />
                                  Featured
                                </span>
                              )}
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl dark:text-gray-100">
                              {newsletter.title}
                            </h3>
                            <p className="mb-3 text-gray-600 dark:text-gray-300">{newsletter.featuredTopic.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {newsletter.monthlyTip && (
                                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                                  Monthly Tip
                                </span>
                              )}
                              {newsletter.newActivities.length > 0 && (
                                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900/40 dark:text-green-200">
                                  {newsletter.newActivities.length} New {newsletter.newActivities.length === 1 ? 'Activity' : 'Activities'}
                                </span>
                              )}
                              {newsletter.privacyNews.length > 0 && (
                                <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800 dark:bg-purple-900/40 dark:text-purple-200">
                                  Privacy News
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 text-pink-600 dark:text-pink-400">
                            <ArrowLeft size={20} className="rotate-180" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/newsletter"
              className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition-all inline-flex items-center gap-2"
            >
              <Mail size={20} />
              Subscribe to Newsletter
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NewsletterArchivePage;


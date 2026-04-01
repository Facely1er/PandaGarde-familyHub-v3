import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Calendar, ArrowLeft, Star } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { newsletterArchive, getNewslettersByYear } from '../data/newsletters';

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
      subtitle="Browse past issues of our privacy education newsletter. Find tips, resources, and updates from previous months."
      icon={Mail}
      badge="ARCHIVE"
      breadcrumbs={true}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              to="/newsletter"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold mb-4"
            >
              <ArrowLeft size={20} />
              Back to Newsletter
            </Link>
            <p className="text-gray-600">
              Explore our collection of past newsletters covering privacy education topics, tips, and resources.
            </p>
          </div>

          {years.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No newsletters available yet.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {years.map((year) => (
                <div key={year}>
                  <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                    {year}
                  </h2>
                  <div className="space-y-4">
                    {newslettersByYear[year].map((newsletter) => (
                      <Link
                        key={newsletter.id}
                        to={`/newsletter/${newsletter.id}`}
                        className="block bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-200"
                        style={{ backgroundColor: 'var(--card-color)' }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-5 h-5 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {newsletter.month} {newsletter.year}
                              </span>
                              {newsletter.featured && (
                                <span className="bg-pink-100 text-pink-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                                  <Star size={12} />
                                  Featured
                                </span>
                              )}
                            </div>
                            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                              {newsletter.title}
                            </h3>
                            <p className="text-gray-600 mb-3">{newsletter.featuredTopic.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {newsletter.monthlyTip && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Monthly Tip
                                </span>
                              )}
                              {newsletter.newActivities.length > 0 && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {newsletter.newActivities.length} New {newsletter.newActivities.length === 1 ? 'Activity' : 'Activities'}
                                </span>
                              )}
                              {newsletter.privacyNews.length > 0 && (
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  Privacy News
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 text-pink-600">
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


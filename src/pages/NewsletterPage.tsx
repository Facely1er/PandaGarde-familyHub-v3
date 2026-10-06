import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, Users, Calendar, BookOpen, Shield } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useToast } from '../contexts/ToastContext';
import { newsletterArchive, newsletterIssuePath } from '../data/newsletters';
import { submitNewsletterNetlifyForm } from '../lib/netlifyForms';
import { logger } from '../lib/logger';

const NewsletterPage: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showError('Email Required', 'Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsSubscribing(true);

    try {
      await submitNewsletterNetlifyForm({ email, purpose: 'newsletter' });
      setIsSubscribed(true);
      showSuccess('Address saved', 'Issues are on this page. Email delivery is not turned on yet.');
      setEmail('');
    } catch (error) {
      logger.error('Newsletter subscription error:', error);
      showError('Subscription Failed', 'There was an error subscribing. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const newsletterFeatures = [
    {
      icon: Calendar,
      title: 'Monthly Privacy Tips',
      description: 'Read the latest privacy tips in each issue on this page.'
    },
    {
      icon: BookOpen,
      title: 'New Activity Releases',
      description: 'Each issue lists new activities you can open on the site.'
    },
    {
      icon: Shield,
      title: 'Privacy News Updates',
      description: 'Stay informed about important privacy developments and legislation.'
    },
    {
      icon: Users,
      title: 'Community Highlights',
      description: 'See how other families are using PandaGarde to teach privacy.'
    }
  ];

  // Use newsletter data from archive
  const recentNewsletters = newsletterArchive.map(newsletter => ({
    id: newsletter.id,
    title: `${newsletter.month} ${newsletter.year}: ${newsletter.title}`,
    date: new Date(newsletter.publishedAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    preview: `${newsletter.featuredTopic.description.substring(0, 80)  }...`,
    featured: newsletter.featured || false,
    url: newsletterIssuePath(newsletter.id)
  }));

  return (
    <PageLayout
      title="Newsletter"
      subtitle="Privacy tips and activities you can read here. Email delivery is not turned on yet. You can still save your address for when it is."
      breadcrumbs={true}
    >

      {/* Subscription Section */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Join Our Privacy Education Community
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Read each issue on this page. Saving your address stores it with our site form submissions.
            We do not email issues yet, because there is no mail service connected.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address for newsletter subscription
              </label>
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  disabled={isSubscribing}
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-600"
                >
                  {isSubscribing ? 'Saving...' : 'Save my address'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                We respect your privacy.{' '}
                <Link to="/newsletter/unsubscribe" className="text-green-700 hover:text-green-800 underline">
                  Unsubscribe at any time
                </Link>
                .
              </p>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Address saved</h3>
              <p className="text-green-700">
                We stored your address. Issues are not emailed yet. Read them below.
              </p>
            </div>
          )}
        </div>

        {/* Newsletter Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {newsletterFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-white dark:bg-green-600">
                  <Icon size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Newsletters */}
      <section className="py-12 rounded-xl bg-light">
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Recent Newsletters
            </h2>
            <p className="text-lg mb-4 text-gray-600">
              See what our community has been learning about digital privacy.
            </p>
            <Link
              to="/newsletter/archive"
              className="text-green-700 hover:text-green-800 font-semibold underline"
            >
              View All Newsletters →
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {recentNewsletters.map((newsletter) => (
                <article
                  key={newsletter.id}
                  className={`rounded-xl border bg-white p-6 shadow-md transition-all hover:shadow-lg dark:bg-gray-800 ${
                    newsletter.featured
                      ? 'border-2 border-green-600 dark:border-green-500'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          <Link
                            to={newsletter.url}
                            className="hover:text-green-700 dark:hover:text-green-400"
                          >
                            {newsletter.title}
                          </Link>
                        </h3>
                        {newsletter.featured && (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-200">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{newsletter.date}</p>
                      <p className="text-gray-600 dark:text-gray-300">{newsletter.preview}</p>
                    </div>
                    <Link
                      to={newsletter.url}
                      className="inline-flex shrink-0 items-center justify-center rounded-lg bg-green-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
                    >
                      Read issue
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Promise */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Our Privacy Promise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-green-600" />
              </div>
              <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">
                No Spam
              </h3>
              <p className="text-sm text-gray-600">
                Issues are published on this site. We are not sending them by email yet.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-blue-600" />
              </div>
              <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">
                Easy Unsubscribe
              </h3>
              <p className="text-sm text-gray-600">
                <Link to="/newsletter/unsubscribe" className="text-green-700 hover:text-green-800 underline">
                  Ask us not to email you
                </Link>{' '}
                if you saved an address. We are not sending mail yet.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-purple-600" />
              </div>
              <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">
                Data Protection
              </h3>
              <p className="text-sm text-gray-600">
                Your address is stored as a site form submission. We do not sell it, and we do not email it yet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="rounded-2xl bg-green-700 p-6 text-center text-white sm:p-8 dark:bg-green-800">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            Ready to stay informed?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-green-50">
            Join families who use this newsletter for monthly privacy tips. Unsubscribe anytime.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/for-families"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-800 hover:bg-green-50"
            >
              <BookOpen size={20} />
              Family resources
            </Link>
            <Link
              to="/family-hub"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              <Users size={20} />
              Family Hub
            </Link>
          </div>
      </section>
    </PageLayout>
  );
};

export default NewsletterPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, Users, Calendar, BookOpen, Shield } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useToast } from '../contexts/ToastContext';
import { newsletterArchive, newsletterIssuePath } from '../data/newsletters';
import { newsletterService } from '../lib/database';
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
      const result = await newsletterService.subscribe(email);
      
      if (result) {
        setIsSubscribed(true);
        showSuccess('Successfully Subscribed!', 'Thank you for joining our privacy education newsletter.');
        setEmail('');
      } else {
        showError('Subscription Failed', 'There was an error subscribing. Please try again.');
      }
    } catch (error) {
      logger.error('Newsletter subscription error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Invalid email')) {
        showError('Invalid Email', 'Please enter a valid email address.');
      } else {
        showError('Subscription Failed', 'There was an error subscribing. Please try again.');
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  const newsletterFeatures = [
    {
      icon: Calendar,
      title: 'Monthly Privacy Tips',
      description: 'Get the latest privacy tips and best practices delivered to your inbox.'
    },
    {
      icon: BookOpen,
      title: 'New Activity Releases',
      description: 'Be the first to know about new educational activities and resources.'
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
      subtitle="Stay updated with the latest privacy education news, new activities, and expert tips to help your family navigate the digital world safely."
      breadcrumbs={true}
    >

      {/* Subscription Section */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">
            Join Our Privacy Education Community
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Get monthly updates with the latest privacy education resources, activities, and expert tips
            delivered directly to your inbox. No spam, just valuable content for your family.
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
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600 dark:border-gray-600 dark:bg-gray-200 dark:text-gray-100"
                  disabled={isSubscribing}
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-gradient-to-r from-green-700 to-green-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-800 hover:to-green-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
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
              <h3 className="text-xl font-bold text-green-800 mb-2">Successfully Subscribed!</h3>
              <p className="text-green-700">
                Thank you for joining our privacy education community. You'll receive your first newsletter soon!
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
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4" style={{ background: 'var(--gradient-primary)' }}>
                  <Icon size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-primary">
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
            <h2 className="text-3xl font-bold mb-4 text-primary">
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
                  className={`rounded-xl border bg-white p-6 shadow-md transition-all hover:shadow-lg dark:bg-gray-200 ${
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
          <h2 className="text-3xl font-bold mb-8 text-primary">
            Our Privacy Promise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-green-600" />
              </div>
              <h3 className="font-bold mb-2 text-primary">
                No Spam
              </h3>
              <p className="text-sm text-gray-600">
                We only send valuable content about privacy education. No promotional spam.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-blue-600" />
              </div>
              <h3 className="font-bold mb-2 text-primary">
                Easy Unsubscribe
              </h3>
              <p className="text-sm text-gray-600">
                <Link to="/newsletter/unsubscribe" className="text-green-700 hover:text-green-800 underline">
                  Unsubscribe anytime
                </Link> with one click. We respect your inbox.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-purple-600" />
              </div>
              <h3 className="font-bold mb-2 text-primary">
                Data Protection
              </h3>
              <p className="text-sm text-gray-600">
                We never share your email with third parties. Your privacy is protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="rounded-xl py-12" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #c62828 100%)', color: 'white' }}>
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Stay Informed?
          </h2>
          <p className="text-xl mb-6 opacity-90 max-w-2xl mx-auto">
            Join thousands of families who are already learning about digital privacy with our monthly newsletter.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/activity-book"
              className="bg-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 text-primary"
            >
              <BookOpen size={20} />
              Try Activities
            </Link>
            <Link to="/family-hub"
              className="bg-white/10 text-white border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors inline-flex items-center gap-2"
            >
              <Users size={20} />
              Family Hub
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default NewsletterPage;
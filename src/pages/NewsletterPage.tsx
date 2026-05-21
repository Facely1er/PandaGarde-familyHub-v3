import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, Users, Calendar, BookOpen, Shield } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useToast } from '../contexts/ToastContext';
import { newsletterArchive } from '../data/newsletters';
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
    url: `/newsletter/archive`
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
              <div className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
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
                <div
                  key={newsletter.id}
                  className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all ${
                    newsletter.featured ? 'border-2 border-green-600' : ''
                  }`}
                  style={{ backgroundColor: 'var(--card-color)' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-primary">
                          {newsletter.title}
                        </h3>
                        {newsletter.featured && (
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{newsletter.date}</p>
                      <p className="text-gray-600">{newsletter.preview}</p>
                    </div>
                    <Link
                      to={newsletter.url || '/newsletter'}
                      className="ml-4 text-white px-4 py-2 rounded-lg font-semibold transition-all inline-block" style={{ background: 'var(--gradient-primary)' }}
                    >
                      Read More
                    </Link>
                  </div>
                </div>
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
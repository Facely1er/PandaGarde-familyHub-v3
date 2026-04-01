import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useToast } from '../contexts/ToastContext';
import { newsletterService } from '../lib/database';

const UnsubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [emailFromUrl, setEmailFromUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check if email is provided in URL (for email link unsubscribes)
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmailFromUrl(emailParam);
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showError('Email Required', 'Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsUnsubscribing(true);

    try {
      const success = await newsletterService.unsubscribe(email);
      
      if (success) {
        setIsUnsubscribed(true);
        showSuccess('Successfully Unsubscribed', 'You have been removed from our newsletter mailing list.');
      } else {
        showError('Unsubscribe Failed', 'There was an error unsubscribing. Please try again or contact support.');
      }
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Invalid email')) {
        showError('Invalid Email', 'Please enter a valid email address.');
      } else {
        showError('Unsubscribe Failed', 'There was an error unsubscribing. Please try again.');
      }
    } finally {
      setIsUnsubscribing(false);
    }
  };

  return (
    <PageLayout
      title="Unsubscribe from Newsletter"
      subtitle="We're sorry to see you go. You can unsubscribe from our privacy education newsletter at any time."
      icon={Mail}
      badge="NEWSLETTER"
      breadcrumbs={true}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          {isUnsubscribed ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Successfully Unsubscribed
              </h2>
              <p className="text-green-700 mb-6">
                You have been removed from our newsletter mailing list. You will no longer receive our monthly privacy education updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/newsletter"
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition-all inline-flex items-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Back to Newsletter
                </Link>
                <Link
                  to="/"
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Go to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                  Unsubscribe from Newsletter
                </h2>
                <p className="text-gray-600 mb-2">
                  Enter your email address to unsubscribe from our privacy education newsletter.
                </p>
                {emailFromUrl && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-800">
                        We found your email address in the link. Please confirm below to unsubscribe.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleUnsubscribe} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-700)' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    disabled={isUnsubscribing || !!emailFromUrl}
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>What happens when you unsubscribe?</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>You will stop receiving our monthly privacy education newsletter</li>
                    <li>You can resubscribe at any time by visiting our newsletter page</li>
                    <li>Your email address will be removed from our mailing list</li>
                    <li>You can still access all our resources and guides on the website</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isUnsubscribing}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUnsubscribing ? 'Unsubscribing...' : 'Unsubscribe'}
                  </button>
                  <Link
                    to="/newsletter"
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Changed your mind?{' '}
                  <Link to="/newsletter" className="text-pink-600 hover:text-pink-700 font-semibold">
                    Stay subscribed
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default UnsubscribePage;


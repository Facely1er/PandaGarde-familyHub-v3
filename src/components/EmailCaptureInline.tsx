import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface EmailCaptureInlineProps {
  title?: string;
  description?: string;
  onSubmit?: (email: string) => Promise<void>;
  purpose?: 'safety-alerts' | 'updates' | 'newsletter' | 'general';
  compact?: boolean;
}

const EmailCaptureInline: React.FC<EmailCaptureInlineProps> = ({
  title = 'Stay Updated on Child Safety',
  description = 'Get notified about important child safety alerts and privacy updates.',
  onSubmit,
  purpose = 'safety-alerts',
  compact = false
}) => {
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      let subscriptions: any[] = [];
      try {
        const subscriptionsStr = localStorage.getItem('pandagarde_email_subscriptions') || '[]';
        const parsed = JSON.parse(subscriptionsStr);
        subscriptions = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Error parsing email subscriptions:', error);
        subscriptions = [];
      }
      
      if (!subscriptions.find((s: any) => s && s.email === email)) {
        subscriptions.push({
          email,
          purpose,
          subscribedAt: new Date().toISOString(),
          preferences: {
            safetyAlerts: purpose === 'safety-alerts',
            updates: purpose === 'updates',
            newsletter: purpose === 'newsletter'
          }
        });
        localStorage.setItem('pandagarde_email_subscriptions', JSON.stringify(subscriptions));
      }

      if (onSubmit) {
        await onSubmit(email);
      }

      setIsSubmitted(true);
      showSuccess('Successfully subscribed!');
      
      setTimeout(() => {
        setEmail('');
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error subscribing email:', error);
      showError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (compact) {
    return (
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        {isSubmitted ? (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Subscribed! Check your email.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              {isSubmitting ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      {isSubmitted ? (
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Thank You!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You're all set. We'll keep you updated.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </form>
        </>
      )}
    </div>
  );
};

export default EmailCaptureInline;


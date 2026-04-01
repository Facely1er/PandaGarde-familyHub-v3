import React, { useState } from 'react';
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onSubmit?: (email: string) => Promise<void>;
  purpose?: 'safety-alerts' | 'updates' | 'newsletter' | 'general';
}

const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({
  isOpen,
  onClose,
  title = 'Stay Updated on Child Safety',
  description = 'Get notified about important child safety alerts, privacy updates, and new educational resources.',
  onSubmit,
  purpose = 'safety-alerts'
}) => {
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) {return null;}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to localStorage
      let subscriptions: any[] = [];
      try {
        const subscriptionsStr = localStorage.getItem('pandagarde_email_subscriptions') || '[]';
        const parsed = JSON.parse(subscriptionsStr);
        subscriptions = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Error parsing email subscriptions:', error);
        subscriptions = [];
      }
      
      // Check if email already exists
      const emailExists = subscriptions.some((sub: any) => sub && sub.email === email);
      if (!emailExists) {
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

      // Call custom onSubmit if provided
      if (onSubmit) {
        await onSubmit(email);
      }

      setIsSubmitted(true);
      showSuccess('Successfully subscribed!', 'You\'ll receive important safety alerts and updates.');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setEmail('');
        setIsSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error subscribing email:', error);
      showError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const purposeMessages = {
    'safety-alerts': {
      title: 'Stay Updated on Child Safety',
      description: 'Get notified about important child safety alerts, privacy updates, and new educational resources.',
      placeholder: 'Enter your email for safety alerts'
    },
    'updates': {
      title: 'Get Privacy Updates',
      description: 'Receive updates about new privacy features, tools, and educational content.',
      placeholder: 'Enter your email for updates'
    },
    'newsletter': {
      title: 'Subscribe to Newsletter',
      description: 'Get monthly tips, resources, and updates about digital privacy for families.',
      placeholder: 'Enter your email for newsletter'
    },
    'general': {
      title: 'Stay Connected',
      description: 'Get notified about important updates and new resources.',
      placeholder: 'Enter your email'
    }
  };

  const message = purposeMessages[purpose];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You're all set. We'll keep you updated on important safety information.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title || message.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description || message.description}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={message.placeholder}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                We respect your privacy. You can unsubscribe at any time. We'll only send you relevant safety and privacy information.
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailCaptureModal;


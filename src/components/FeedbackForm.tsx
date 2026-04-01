import React, { useState } from 'react';
import { MessageSquare, Send, X, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { trackEvent, AnalyticsEvents } from '../lib/analytics';

// Simple text sanitization
const sanitizeText = (input: string): string => {
  if (typeof input !== 'string') {return '';}
  return input
    .replace(/<[^>]*>/g, '')
    .trim()
    .substring(0, 2000);
};

interface FeedbackFormProps {
  onClose: () => void;
  context?: string; // e.g., 'family-dashboard', 'game', 'journey'
  memberId?: number;
}

interface FeedbackSubmission {
  id: string;
  timestamp: string;
  rating: number;
  category: string;
  message: string;
  context?: string;
  memberId?: number;
  status: 'submitted' | 'saved';
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose, context, memberId }) => {
  const [rating, setRating] = useState<number>(0);
  const [category, setCategory] = useState<string>('general');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackSubmissions, setFeedbackSubmissions] = useLocalStorage<FeedbackSubmission[]>(
    'pandagarde_feedback',
    []
  );

  const categories = [
    { value: 'general', label: 'General Feedback' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'usability', label: 'Usability Issue' },
    { value: 'content', label: 'Content Feedback' },
    { value: 'performance', label: 'Performance Issue' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || rating === 0) {
      return;
    }

    setIsSubmitting(true);

    const feedback: FeedbackSubmission = {
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      rating,
      category,
      message: sanitizeText(message),
      context: context || 'general',
      memberId,
      status: 'submitted'
    };

    // Save to localStorage (in production, this would go to backend)
    setFeedbackSubmissions([...feedbackSubmissions, feedback]);

    // Track analytics
    trackEvent(AnalyticsEvents.FEEDBACK_SUBMITTED, {
      rating,
      category,
      context: context || 'general',
      memberId,
      timestamp: new Date().toISOString()
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setIsSubmitting(false);
    setSubmitted(true);

    // Auto-close after 2 seconds
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your feedback has been submitted. We appreciate your input!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="text-green-600 dark:text-green-400" size={24} />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Share Your Feedback
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How would you rate your experience?
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-lg transition-colors ${
                    rating >= star
                      ? 'text-yellow-400 hover:text-yellow-500'
                      : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                  }`}
                >
                  <Star size={32} fill={rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {rating === 5 && 'Excellent! We love to hear that!'}
                {rating === 4 && 'Great! Thanks for the positive feedback.'}
                {rating === 3 && 'Good. How can we improve?'}
                {rating === 2 && 'We appreciate your honesty. What can we do better?'}
                {rating === 1 && 'We\'re sorry to hear that. Please tell us what went wrong.'}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Feedback
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              placeholder="Tell us what you think... What worked well? What could be improved? Any suggestions?"
              rows={6}
              required
              maxLength={2000}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {message.length}/2000 characters
            </p>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="text-blue-600 dark:text-blue-400 mt-0.5" size={16} />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your feedback helps us improve PandaGarde for all families. All feedback is anonymous and privacy-respecting.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!message.trim() || rating === 0 || isSubmitting}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;


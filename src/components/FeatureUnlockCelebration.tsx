import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Sparkles, Unlock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureUnlockCelebrationProps {
  feature: string;
  description: string;
  icon?: React.ReactNode;
  link?: string;
  onClose?: () => void;
}

const FeatureUnlockCelebration: React.FC<FeatureUnlockCelebrationProps> = ({
  feature,
  description,
  icon,
  link,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsAnimating(false), 100);
    
    // Auto-hide after 8 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Wait for animation
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isAnimating ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      style={{ maxWidth: '400px' }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-green-500 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-green-400/10 to-green-500/10 animate-pulse" />
        
        {/* Content */}
        <div className="relative p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={18} className="text-gray-500" />
          </button>

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center relative">
                {icon || <Unlock size={32} className="text-white" />}
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles size={20} className="text-yellow-400 animate-spin" style={{ animationDuration: '2s' }} />
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Feature Unlocked!
                </h3>
              </div>
              <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {feature}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {description}
              </p>

              {/* Action Button */}
              {link && (
                <Link
                  to={link}
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all text-sm shadow-md hover:shadow-lg"
                >
                  Explore Now
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600"
            style={{
              animation: 'shrink 8s linear forwards'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default FeatureUnlockCelebration;


import React, { useState, useEffect } from 'react';
import { X, ArrowRight, CheckCircle, Sparkles, Shield, ShoppingBag, Play, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: {
    label: string;
    link: string;
  };
  tips?: string[];
}

const ONBOARDING_STORAGE_KEY = 'pandagarde_onboarding_completed';

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to PandaGarde!',
    description: 'Your comprehensive platform for family digital privacy education. Let\'s get you started with a quick tour.',
    icon: Sparkles,
    action: {
      label: 'Get Started',
      link: '/family-hub'
    },
    tips: [
      'PandaGarde helps families learn about digital privacy together',
      'All features are 100% free and designed for families',
      'You can start learning immediately, no account required'
    ]
  },
  {
    id: 2,
    title: 'Set Up Your Service Catalog',
    description: 'The Service Catalog is the foundation of PandaGarde. Add services your family uses to unlock powerful privacy features.',
    icon: ShoppingBag,
    action: {
      label: 'Set Up Service Catalog',
      link: '/service-catalog'
    },
    tips: [
      'Add at least 3 services to unlock Digital Footprint Analysis',
      'Each service includes privacy risk ratings and recommendations',
      'You can add more services anytime'
    ]
  },
  {
    id: 3,
    title: 'Start Learning with Privacy Panda',
    description: 'Privacy Panda is our interactive learning app for children. Age-appropriate stories and activities make privacy education fun!',
    icon: Play,
    action: {
      label: 'Try Privacy Panda',
      link: '/privacy-panda'
    },
    tips: [
      'Content is designed for ages 5-17',
      'Interactive stories and games make learning engaging',
      'Progress is tracked automatically'
    ]
  },
  {
    id: 4,
    title: 'Explore Advanced Features',
    description: 'Once you\'ve set up your Service Catalog, you can access Digital Footprint Analysis, Risk Assessments, and Safety Alerts.',
    icon: BarChart3,
    action: {
      label: 'View Features',
      link: '/digital-footprint'
    },
    tips: [
      'Digital Footprint shows your family\'s online presence',
      'Risk Assessments help identify privacy concerns',
      'Safety Alerts notify you about service updates'
    ]
  }
];

interface OnboardingFlowProps {
  onComplete?: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(60);

  useEffect(() => {
    // Get header height for positioning
    const header = document.querySelector('.header');
    if (header) {
      const height = header.getBoundingClientRect().height;
      setHeaderHeight(height);
    }

    // Check if onboarding has been completed
    const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (completed === 'true') {
      setIsCompleted(true);
      return;
    }

    // Show onboarding after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    setIsCompleted(true);
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  };

  if (isCompleted || !isVisible) {
    return null;
  }

  const step = onboardingSteps[currentStep];
  const StepIcon = step.icon;
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" 
      style={{ 
        top: `${headerHeight}px`,
        paddingTop: '1rem'
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-y-auto" 
        style={{ 
          maxHeight: `calc(100vh - ${headerHeight}px - 2rem)`
        }}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Skip onboarding"
          >
            <X size={20} className="text-gray-500" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <StepIcon size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-500">
                  Step {currentStep + 1} of {onboardingSteps.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {step.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {step.description}
          </p>

          {step.tips && step.tips.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Quick Tips:
              </h3>
              <ul className="space-y-2">
                {step.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                    <CheckCircle size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Skip Tour
            </button>
            <Link
              to={step.action.link}
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              {step.action.label}
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2">
            {onboardingSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-green-600 w-8'
                    : index < currentStep
                    ? 'bg-green-400'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;


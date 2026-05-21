import React, { useState, useEffect, useCallback } from 'react';
import { useFamily } from '../../contexts/FamilyContext';
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Users,
  Eye,
  BookOpen,
  X,
  UsersRound,
  Smartphone,
  Lightbulb,
} from 'lucide-react';
import InfoBox from './InfoBox';

interface ParentOnboardingProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const listClass = 'my-4 pl-6 leading-relaxed text-gray-800 dark:text-gray-200 space-y-1';
const subBoxClass = 'mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50';
const tabCardClass = 'mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 last:mb-0';

const ParentOnboarding: React.FC<ParentOnboardingProps> = ({ onComplete, onSkip }) => {
  const { familyMembers } = useFamily();
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 5;
  const childCount = familyMembers.filter((m) => m.role === 'child').length;

  const steps = [
    {
      id: 1,
      title: 'Welcome to PandaGarde',
      subtitle: 'Local-first privacy education for your household',
      icon: Shield,
      content: (
        <div>
          <InfoBox type="info" title="What You'll Get">
            <ul className={listClass}>
              <li>List apps and services your family uses in the catalog</li>
              <li>See privacy risk scores from Digital Footprint Analysis</li>
              <li>Get conversation starters and Family Hub missions</li>
              <li>Track mission and assessment progress on your device</li>
            </ul>
          </InfoBox>
          <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200 mt-4">
            PandaGarde helps you protect your family&apos;s privacy online. We&apos;ll guide you through your local
            family profile and the website + Family Hub workflow.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Set Up Your Family Profile',
      subtitle: 'On this device—no server account required',
      icon: Users,
      content: (
        <div>
          <InfoBox type="tip" title="Your profile is ready">
            <p>You&apos;re signed in locally. Add family members and services when you&apos;re ready.</p>
          </InfoBox>
          <div className="mt-6">
            <h4 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-100">What&apos;s Next:</h4>
            <ul className={`m-0 ${listClass}`}>
              <li>Add children in Family Hub (name and age)</li>
              <li>List services in the catalog for footprint analysis</li>
              <li>Start privacy missions or website learning paths</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Add Your Children',
      subtitle: 'Profiles for missions and progress',
      icon: Users,
      content: (
        <div>
          <InfoBox type="info" title="Add Family Members">
            <p>
              {childCount > 0
                ? `You have ${childCount} child(ren) added. You can add more from the Family Hub.`
                : 'Add your children in Family Hub (name and age) to match missions and save progress on this device.'}
            </p>
          </InfoBox>
          <div className={subBoxClass}>
            <h4 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-100">For each child, you can:</h4>
            <ul className={`m-0 ${listClass}`}>
              <li>See catalog-based privacy risk scores</li>
              <li>Review services you listed for each child</li>
              <li>Plan with requested / approved / denied catalog status</li>
              <li>Use mission prompts and conversation starters</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'First Risk Assessment',
      subtitle: "See your family's privacy status",
      icon: Eye,
      content: (
        <div>
          <InfoBox type="success" title="Privacy Dashboard">
            <p>Your privacy dashboard shows you at a glance:</p>
            <ul className={`mt-2 mb-0 ${listClass}`}>
              <li>Family privacy score (average of all children)</li>
              <li>Action items (catalog reminders, high-risk services)</li>
              <li>Individual child risk cards</li>
              <li>Conversation starters for high-risk services</li>
            </ul>
          </InfoBox>
          <div className={`${subBoxClass} border-2 border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30`}>
            <h4 className="text-base font-semibold mb-3 text-blue-900 dark:text-blue-200">Risk Levels Explained:</h4>
            <ul className="m-0 pl-6 leading-relaxed text-blue-900 dark:text-blue-200 space-y-1">
              <li>
                <strong className="text-green-600 dark:text-green-400">Low (Green):</strong> Generally safe, minimal
                privacy concerns
              </li>
              <li>
                <strong className="text-amber-600 dark:text-amber-400">Medium (Yellow):</strong> Some privacy concerns,
                review settings
              </li>
              <li>
                <strong className="text-orange-600 dark:text-orange-400">High (Orange):</strong> Significant risks,
                needs attention
              </li>
              <li>
                <strong className="text-red-600 dark:text-red-400">Very High (Red):</strong> Major privacy risks,
                immediate action needed
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Tour of Dashboard',
      subtitle: 'Learn how to use your privacy hub',
      icon: BookOpen,
      content: (
        <div>
          <InfoBox type="tip" title="Dashboard Overview">
            <p>Your dashboard has 5 main tabs:</p>
          </InfoBox>
          <div className="mt-6">
            <div className={tabCardClass}>
              <h4 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-100">Overview</h4>
              <p className="m-0 text-gray-600 dark:text-gray-400 text-[0.9375rem]">
                See your family&apos;s privacy score, action items, and quick stats
              </p>
            </div>
            <div className={tabCardClass}>
              <h4 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <UsersRound size={18} aria-hidden />
                Children
              </h4>
              <p className="m-0 text-gray-600 dark:text-gray-400 text-[0.9375rem]">
                View each child&apos;s privacy status and manage their services
              </p>
            </div>
            <div className={tabCardClass}>
              <h4 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Smartphone size={18} aria-hidden />
                Services
              </h4>
              <p className="m-0 text-gray-600 dark:text-gray-400 text-[0.9375rem]">
                Browse the catalog and set requested / approved / denied status
              </p>
            </div>
            <div className={tabCardClass}>
              <h4 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Lightbulb size={18} aria-hidden />
                Insights
              </h4>
              <p className="m-0 text-gray-600 dark:text-gray-400 text-[0.9375rem]">
                View privacy trends and get recommendations
              </p>
            </div>
            <div className={tabCardClass}>
              <h4 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-100">Quick Actions</h4>
              <p className="m-0 text-gray-600 dark:text-gray-400 text-[0.9375rem]">
                Common tasks like adding children, updating the catalog, and opening Family Hub
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps.find((s) => s.id === currentStep);
  const Icon = currentStepData?.icon || Shield;
  const progressPct = (currentStep / totalSteps) * 100;

  const handleComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    onSkip?.();
  }, [onSkip]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {handleSkip();}
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handleSkip]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {setCurrentStep(currentStep - 1);}
  };

  const btnOutline =
    'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors';

  const btnPrimary =
    'inline-flex items-center justify-center gap-2 flex-1 px-6 py-3 rounded-lg font-medium bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white transition-colors';

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-4 sm:p-5"
      role="presentation"
      onClick={handleSkip}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start gap-4">
          <div>
            <h2 id="onboarding-title" className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 m-0">
              {currentStepData?.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-0">{currentStepData?.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={handleSkip}
            className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            aria-label="Skip tour"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progressPct)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-green-600 dark:bg-green-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 flex gap-2 justify-center" aria-hidden>
          {steps.map((step) => (
            <div
              key={step.id}
              className={`w-3 h-3 rounded-full ${
                step.id <= currentStep ? 'bg-green-600 dark:bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
              } ${step.id === currentStep ? 'ring-2 ring-green-600/30 dark:ring-green-400/30' : ''}`}
              title={step.title}
            />
          ))}
        </div>

        <div className="p-4 sm:p-6 flex-1">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
              <Icon size={32} className="text-sky-600 dark:text-sky-400" aria-hidden />
            </div>
          </div>
          {currentStepData?.content}
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-3">
          <button type="button" onClick={handlePrevious} disabled={currentStep === 1} className={btnOutline}>
            <ArrowLeft size={18} aria-hidden />
            Previous
          </button>
          {currentStep < totalSteps ? (
            <button type="button" onClick={handleNext} className={btnPrimary}>
              Next
              <ArrowRight size={18} aria-hidden />
            </button>
          ) : (
            <button type="button" onClick={handleComplete} className={btnPrimary}>
              <CheckCircle size={18} aria-hidden />
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentOnboarding;

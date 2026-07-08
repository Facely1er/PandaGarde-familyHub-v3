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
  ShoppingBag,
  Lightbulb,
} from 'lucide-react';
import InfoBox from './InfoBox';

interface ParentOnboardingProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const listClass = 'my-4 pl-6 leading-relaxed text-gray-800 dark:text-gray-200 space-y-1';
const subBoxClass = 'mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-100/50';
const tabCardClass = 'mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-100/50 last:mb-0';

const ParentOnboarding: React.FC<ParentOnboardingProps> = ({ onComplete, onSkip }) => {
  const { familyMembers } = useFamily();
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 5;
  const childCount = familyMembers.filter((m) => m.role === 'child').length;

  const steps = [
    {
      id: 1,
      title: 'Welcome to PandaGarde',
      subtitle: 'Four things you can do—pick any one to start',
      icon: Shield,
      content: (
        <div>
          <InfoBox type="info" title="Your options">
            <ul className={listClass}>
              <li>Read a Privacy Panda story with your child (about 5 minutes)</li>
              <li>List the apps your family uses</li>
              <li>See privacy scores for those apps</li>
              <li>Do short missions together in Family Hub</li>
            </ul>
          </InfoBox>
          <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200 mt-4">
            You do not need to do everything today. This tour shows you where each part lives.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Your family on this device',
      subtitle: 'No PandaGarde account required',
      icon: Users,
      content: (
        <div>
          <InfoBox type="tip" title="Already set up locally">
            <p>Your profile is on this device. Add children in Family Hub when you are ready—name and age only.</p>
          </InfoBox>
          <div className="mt-6">
            <h4 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-100">Good first steps:</h4>
            <ul className={`m-0 ${listClass}`}>
              <li>Read a story together</li>
              <li>Add apps your family uses to the catalog</li>
              <li>Open Family Hub and add your kids</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Add your children',
      subtitle: 'So missions match their age',
      icon: Users,
      content: (
        <div>
          <InfoBox type="info" title="Family Hub profiles">
            <p>
              {childCount > 0
                ? `You have ${childCount} child(ren) added. Open Family Hub anytime to add more or start a mission.`
                : 'Open Family Hub → Family tab. Enter each child\'s name and age—that\'s all we need.'}
            </p>
          </InfoBox>
          <div className={subBoxClass}>
            <h4 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-100">After you add a child:</h4>
            <ul className={`m-0 ${listClass}`}>
              <li>Pick a mission matched to their age</li>
              <li>Read the family talk prompt together</li>
              <li>Track badges under Journey</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'List your apps',
      subtitle: 'Powers your privacy scores',
      icon: Eye,
      content: (
        <div>
          <InfoBox type="success" title="What the app list shows you">
            <p>After you tap the apps your family uses, you will see:</p>
            <ul className={`mt-2 mb-0 ${listClass}`}>
              <li>A simple privacy score for each app (lower is safer)</li>
              <li>Which apps are worth a family conversation</li>
              <li>Suggested next steps—not live monitoring of phones</li>
            </ul>
          </InfoBox>
          <div className={`${subBoxClass} border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/30`}>
            <h4 className="text-base font-semibold mb-3 text-gray-900 dark:text-gray-100">Score colors:</h4>
            <ul className="m-0 pl-6 leading-relaxed text-gray-800 dark:text-gray-200 space-y-1">
              <li>
                <strong className="text-green-600 dark:text-green-400">Green:</strong> Lower risk—still worth knowing what the app collects
              </li>
              <li>
                <strong className="text-amber-600 dark:text-amber-400">Yellow:</strong> Some concerns—review settings together
              </li>
              <li>
                <strong className="text-orange-600 dark:text-orange-400">Orange:</strong> Worth a family talk soon
              </li>
              <li>
                <strong className="text-red-600 dark:text-red-400">Red:</strong> High data collection—priority for a conversation
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Where to go next',
      subtitle: 'Four main areas—each works on its own',
      icon: BookOpen,
      content: (
        <div>
          <InfoBox type="tip" title="Pick one to try today">
            <p>Stories, app list, footprint review, and Family Hub missions. You do not need to finish one before starting another.</p>
          </InfoBox>
          <div className="mt-6">
            <div className={tabCardClass}>
              <h4 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-100">Stories</h4>
              <p className="m-0 text-gray-600 dark:text-gray-400 text-[0.9375rem]">
                Read Privacy Panda with your child—about 5 minutes, no setup
              </p>
            </div>
            <div className={tabCardClass}>
              <h4 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <ShoppingBag size={18} aria-hidden />
                App list
              </h4>
              <p className="m-0 text-gray-600 dark:text-gray-400 text-[0.9375rem]">
                Tap the apps your family uses to see privacy scores
              </p>
            </div>
            <div className={tabCardClass}>
              <h4 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <UsersRound size={18} aria-hidden />
                Family Hub
              </h4>
              <p className="m-0 text-gray-600 dark:text-gray-400 text-[0.9375rem]">
                Short missions you do together—progress saves on this device
              </p>
            </div>
            <div className={tabCardClass}>
              <h4 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Lightbulb size={18} aria-hidden />
                Guides
              </h4>
              <p className="m-0 text-gray-600 dark:text-gray-400 text-[0.9375rem]">
                Conversation starters, family plans, and printables under Guides &amp; stories
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

        <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-100/50 border-b border-gray-200 dark:border-gray-700">
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

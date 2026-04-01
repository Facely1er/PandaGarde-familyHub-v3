import React, { useState } from 'react';
import { useFamily } from '../../contexts/FamilyContext';
import { CheckCircle, ArrowRight, ArrowLeft, Shield, Users, Eye, BookOpen, X, UsersRound, Smartphone, Lightbulb } from 'lucide-react';
import InfoBox from './InfoBox';

interface ParentOnboardingProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const ParentOnboarding: React.FC<ParentOnboardingProps> = ({ onComplete, onSkip }) => {
  const { familyMembers } = useFamily();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const totalSteps = 5;

  const steps = [
    {
      id: 1,
      title: 'Welcome to PandaGarde',
      subtitle: 'Your Family Privacy Protection Hub',
      icon: Shield,
      content: (
        <div>
          <InfoBox type="info" title="What You'll Get">
            <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>See what apps and websites your children use</li>
              <li>Know their privacy risks at a glance</li>
              <li>Get conversation starters to talk about privacy</li>
              <li>Track their safety progress over time</li>
            </ul>
          </InfoBox>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#2C3E50', marginTop: '1rem' }}>
            PandaGarde helps you protect your family's privacy online. We'll guide you through setting up your family account and show you how to use the dashboard.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: 'Create Your Family Account',
      subtitle: 'Set up your family profile',
      icon: Users,
      content: (
        <div>
          <InfoBox type="tip" title="Your Account is Ready!">
            <p>You're already logged in. Your family account is set up and ready to use.</p>
          </InfoBox>
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#2C3E50' }}>
              What's Next:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8', color: '#2C3E50' }}>
              <li>Add your children to track their privacy</li>
              <li>Review their online services</li>
              <li>Set up privacy education</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Add Your Children',
      subtitle: 'Start tracking their privacy',
      icon: Users,
      content: (
        <div>
          <InfoBox type="info" title="Add Family Members">
            <p>
              {familyMembers.filter(m => m.role === 'child').length > 0
                ? `You have ${familyMembers.filter(m => m.role === 'child').length} child(ren) added. You can add more from the Family Hub.`
                : 'Add your children to start tracking their online privacy. You can add them from the Family Hub after completing this tour.'}
            </p>
          </InfoBox>
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#2C3E50' }}>
              For each child, you can:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8', color: '#2C3E50' }}>
              <li>See their privacy risk score</li>
              <li>Review apps and websites they use</li>
              <li>Approve or deny service requests</li>
              <li>Get conversation starters</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'First Risk Assessment',
      subtitle: "See your family's privacy status",
      icon: Eye,
      content: (
        <div>
          <InfoBox type="success" title="Privacy Dashboard">
            <p>
              Your privacy dashboard shows you at a glance:
            </p>
            <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Family privacy score (average of all children)</li>
              <li>Action items (pending approvals, high-risk alerts)</li>
              <li>Individual child risk cards</li>
              <li>Conversation starters for high-risk services</li>
            </ul>
          </InfoBox>
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '2px solid #3b82f6' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#1e40af' }}>
              Risk Levels Explained:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8', color: '#1e40af' }}>
              <li><strong style={{ color: '#10b981' }}>Low (Green):</strong> Generally safe, minimal privacy concerns</li>
              <li><strong style={{ color: '#f59e0b' }}>Medium (Yellow):</strong> Some privacy concerns, review settings</li>
              <li><strong style={{ color: '#f97316' }}>High (Orange):</strong> Significant risks, needs attention</li>
              <li><strong style={{ color: '#dc2626' }}>Very High (Red):</strong> Major privacy risks, immediate action needed</li>
            </ul>
          </div>
        </div>
      )
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
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#2C3E50' }}>
                📊 Overview
              </h4>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9375rem' }}>
                See your family's privacy score, action items, and quick stats
              </p>
            </div>
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#2C3E50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UsersRound size={18} />
                Children
              </h4>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9375rem' }}>
                View each child's privacy status and manage their services
              </p>
            </div>
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#2C3E50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Smartphone size={18} />
                Services
              </h4>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9375rem' }}>
                Browse the service catalog and approve/deny requests
              </p>
            </div>
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#2C3E50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lightbulb size={18} />
                Insights
              </h4>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9375rem' }}>
                View privacy trends and get recommendations
              </p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#2C3E50' }}>
                ⚡ Quick Actions
              </h4>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9375rem' }}>
                Common tasks like adding children, reviewing requests, and accessing guides
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps.find(s => s.id === currentStep);
  const Icon = currentStepData?.icon || Shield;

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2C3E50', margin: 0 }}>
              {currentStepData?.title}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#666', margin: '0.25rem 0 0 0' }}>
              {currentStepData?.subtitle}
            </p>
          </div>
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              padding: '0.5rem'
            }}
            aria-label="Skip tour"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>
              Step {currentStep} of {totalSteps}
            </span>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
                height: '100%',
                backgroundColor: '#4CAF50',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          {steps.map((step) => (
            <div
              key={step.id}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor:
                  step.id < currentStep
                    ? '#4CAF50'
                    : step.id === currentStep
                    ? '#4CAF50'
                    : '#e5e7eb',
                border: step.id === currentStep ? '2px solid #4CAF50' : 'none',
                boxShadow: step.id === currentStep ? '0 0 0 3px rgba(76, 175, 80, 0.2)' : 'none'
              }}
              title={step.title}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon size={32} style={{ color: '#0ea5e9' }} />
            </div>
          </div>

          {currentStepData?.content}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1.5rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: currentStep === 1 ? '#f3f4f6' : 'white',
              color: currentStep === 1 ? '#9ca3af' : '#2C3E50',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: currentStep === 1 ? 0.5 : 1
            }}
          >
            <ArrowLeft size={18} />
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              Next
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              <CheckCircle size={18} />
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentOnboarding;


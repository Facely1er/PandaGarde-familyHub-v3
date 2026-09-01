import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Target, Shield, Users, AlertTriangle, type LucideIcon } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

type AssessmentType = 'child-safety' | 'privacy-settings' | 'device-security' | 'data-sharing';

interface QuickAssessment {
  id: AssessmentType;
  title: string;
  description: string;
  duration: string;
  questions: number;
  icon: LucideIcon;
  color: string;
}

const quickAssessments: QuickAssessment[] = [
  {
    id: 'child-safety',
    title: 'Child Safety Quick Check',
    description: 'Quick assessment of your child safety measures and parental controls',
    duration: '3-5 min',
    questions: 5,
    icon: Shield,
    color: 'blue'
  },
  {
    id: 'privacy-settings',
    title: 'Privacy Settings Review',
    description: 'Evaluate your privacy settings across devices and services',
    duration: '4-6 min',
    questions: 6,
    icon: Target,
    color: 'green'
  },
  {
    id: 'device-security',
    title: 'Device Security Check',
    description: 'Assess the security of your family\'s devices and accounts',
    duration: '3-5 min',
    questions: 5,
    icon: Shield,
    color: 'purple'
  },
  {
    id: 'data-sharing',
    title: 'Data Sharing Awareness',
    description: 'Understand how your family\'s data is shared across services',
    duration: '4-6 min',
    questions: 6,
    icon: Users,
    color: 'orange'
  }
];

const QuickAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const handleStartAssessment = (assessmentId: AssessmentType) => {
    navigate(`/privacy-assessment?type=${assessmentId}&quick=true`);
  };

  return (
    <PageLayout
      title="Quick Privacy Assessments"
      subtitle="Focus on one privacy topic at a time, or take the full family check-in."
      breadcrumbs
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {quickAssessments.map((assessment) => {
            const Icon = assessment.icon;
            const colorClasses = {
              blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
              green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
              purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
              orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
            };
            const iconBgClasses = {
              blue: 'bg-blue-100 dark:bg-blue-900/30',
              green: 'bg-green-100 dark:bg-green-900/30',
              purple: 'bg-purple-100 dark:bg-purple-900/30',
              orange: 'bg-orange-100 dark:bg-orange-900/30'
            };
            const iconColorClasses = {
              blue: 'h-6 w-6 text-blue-600 dark:text-blue-400',
              green: 'h-6 w-6 text-green-600 dark:text-green-400',
              purple: 'h-6 w-6 text-purple-600 dark:text-purple-400',
              orange: 'h-6 w-6 text-orange-600 dark:text-orange-400'
            };
            const color = assessment.color as keyof typeof colorClasses;

            return (
              <div
                key={assessment.id}
                role="button"
                tabIndex={0}
                className={`cursor-pointer rounded-2xl border-2 p-6 transition-colors ${colorClasses[color]} hover:border-green-400`}
                onClick={() => handleStartAssessment(assessment.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleStartAssessment(assessment.id);
                  }
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${iconBgClasses[color]}`}>
                    <Icon className={iconColorClasses[color]} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {assessment.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {assessment.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{assessment.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span>{assessment.questions} questions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Assessment Option */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Need a Comprehensive Assessment?
              </h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                For a complete evaluation of your family's privacy practices, take the full assessment covering all categories.
              </p>
              <Link
                to="/privacy-assessment"
                className="button button-primary inline-flex items-center gap-2"
              >
                <span>Start Full Assessment</span>
                <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default QuickAssessmentPage;


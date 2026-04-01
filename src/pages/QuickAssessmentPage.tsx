import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Target, Shield, Users, AlertTriangle } from 'lucide-react';

type AssessmentType = 'child-safety' | 'privacy-settings' | 'device-security' | 'data-sharing';

interface QuickAssessment {
  id: AssessmentType;
  title: string;
  description: string;
  duration: string;
  questions: number;
  icon: React.ComponentType<any>;
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
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType | null>(null);

  const handleStartAssessment = (assessmentId: AssessmentType) => {
    navigate(`/privacy-assessment?type=${assessmentId}&quick=true`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/privacy-assessment"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Full Assessment</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Quick Privacy Assessments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Focus on specific privacy concerns with these quick assessments
          </p>
        </div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickAssessments.map((assessment) => {
            const Icon = assessment.icon;
            const colorClasses = {
              blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
              green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
              purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
              orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
            };

            return (
              <div
                key={assessment.id}
                className={`p-6 rounded-lg border-2 ${colorClasses[assessment.color as keyof typeof colorClasses]} hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => handleStartAssessment(assessment.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-${assessment.color}-100 dark:bg-${assessment.color}-900/30`}>
                    <Icon className={`h-6 w-6 text-${assessment.color}-600 dark:text-${assessment.color}-400`} />
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
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Need a Comprehensive Assessment?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                For a complete evaluation of your family's privacy practices, take the full assessment covering all categories.
              </p>
              <Link
                to="/privacy-assessment"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Start Full Assessment</span>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAssessmentPage;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, Users, BookOpen, Download, Target, Award, Shield, GraduationCap } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  tasks: string[];
  resources: string[];
  completed: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface ImplementationPhase {
  id: string;
  title: string;
  description: string;
  duration: string;
  steps: TimelineStep[];
  color: string;
}

const ImplementationGuidePage: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [activePhase, setActivePhase] = useState<string>('planning');

  const phases: ImplementationPhase[] = [
    {
      id: 'planning',
      title: 'Planning Phase',
      description: 'Prepare your school or organization for privacy education implementation',
      duration: '2-4 weeks',
      color: 'blue',
      steps: [
        {
          id: 'assess-needs',
          title: 'Assess Current Privacy Education',
          description: 'Evaluate existing privacy education programs and identify gaps',
          duration: '1 week',
          tasks: [
            'Review current curriculum for privacy content',
            'Survey teachers and students about privacy knowledge',
            'Identify key stakeholders and decision makers',
            'Assess available technology and resources'
          ],
          resources: [
            'Privacy Education Assessment Tool',
            'Teacher Survey Template',
            'Student Knowledge Checklist'
          ],
          completed: false,
          icon: Target
        },
        {
          id: 'set-goals',
          title: 'Set Implementation Goals',
          description: 'Define clear objectives and success metrics for your privacy education program',
          duration: '1 week',
          tasks: [
            'Define learning objectives for each grade level',
            'Set measurable success metrics',
            'Create timeline for implementation',
            'Establish evaluation criteria'
          ],
          resources: [
            'Goal Setting Worksheet',
            'Success Metrics Template',
            'Implementation Timeline Template'
          ],
          completed: false,
          icon: Target
        },
        {
          id: 'secure-support',
          title: 'Secure Administrative Support',
          description: 'Get buy-in from administrators and secure necessary resources',
          duration: '1-2 weeks',
          tasks: [
            'Present proposal to administration',
            'Secure budget approval',
            'Identify teacher champions',
            'Plan professional development schedule'
          ],
          resources: [
            'Administrative Proposal Template',
            'Budget Planning Worksheet',
            'Teacher Champion Guide'
          ],
          completed: false,
          icon: Users
        }
      ]
    },
    {
      id: 'preparation',
      title: 'Preparation Phase',
      description: 'Train teachers and prepare materials for implementation',
      duration: '3-4 weeks',
      color: 'green',
      steps: [
        {
          id: 'teacher-training',
          title: 'Teacher Training & Professional Development',
          description: 'Provide comprehensive training for educators on privacy education',
          duration: '2 weeks',
          tasks: [
            'Conduct privacy education workshops',
            'Train teachers on curriculum materials',
            'Practice teaching privacy concepts',
            'Address teacher concerns and questions'
          ],
          resources: [
            'Teacher Training Manual',
            'Workshop Presentation Slides',
            'Practice Teaching Guide',
            'Q&A Resource Document'
          ],
          completed: false,
          icon: GraduationCap
        },
        {
          id: 'material-prep',
          title: 'Prepare Teaching Materials',
          description: 'Organize and prepare all necessary materials for implementation',
          duration: '1 week',
          tasks: [
            'Print activity sheets and handouts',
            'Set up digital resources and accounts',
            'Prepare assessment materials',
            'Organize classroom displays'
          ],
          resources: [
            'Material Checklist',
            'Digital Resource Setup Guide',
            'Classroom Display Templates'
          ],
          completed: false,
          icon: BookOpen
        },
        {
          id: 'pilot-test',
          title: 'Pilot Test with Small Group',
          description: 'Test the program with a small group before full implementation',
          duration: '1 week',
          tasks: [
            'Select pilot group of students',
            'Implement first few lessons',
            'Gather feedback from teachers and students',
            'Make necessary adjustments'
          ],
          resources: [
            'Pilot Test Protocol',
            'Feedback Collection Forms',
            'Adjustment Planning Worksheet'
          ],
          completed: false,
          icon: Shield
        }
      ]
    },
    {
      id: 'implementation',
      title: 'Implementation Phase',
      description: 'Roll out the privacy education program across all grade levels',
      duration: '8-12 weeks',
      color: 'purple',
      steps: [
        {
          id: 'grade-k-2',
          title: 'Implement K-2 Program',
          description: 'Begin with youngest students using age-appropriate activities',
          duration: '2-3 weeks',
          tasks: [
            'Start with Privacy Panda story activities',
            'Introduce basic privacy concepts through play',
            'Engage parents in home activities',
            'Monitor student engagement and understanding'
          ],
          resources: [
            'K-2 Curriculum Guide',
            'Privacy Panda Story Materials',
            'Parent Engagement Kit',
            'Progress Tracking Sheet'
          ],
          completed: false,
          icon: BookOpen
        },
        {
          id: 'grade-3-5',
          title: 'Implement 3-5 Program',
          description: 'Expand to elementary students with more complex concepts',
          duration: '3-4 weeks',
          tasks: [
            'Introduce digital citizenship concepts',
            'Teach online safety basics',
            'Practice privacy decision-making',
            'Connect with real-world examples'
          ],
          resources: [
            '3-5 Curriculum Guide',
            'Digital Citizenship Activities',
            'Online Safety Worksheets',
            'Decision-Making Scenarios'
          ],
          completed: false,
          icon: Shield
        },
        {
          id: 'grade-6-8',
          title: 'Implement 6-8 Program',
          description: 'Address middle school privacy challenges and social media',
          duration: '3-4 weeks',
          tasks: [
            'Focus on social media privacy',
            'Teach critical thinking about online content',
            'Address peer pressure and online behavior',
            'Prepare for high school challenges'
          ],
          resources: [
            '6-8 Curriculum Guide',
            'Social Media Privacy Activities',
            'Critical Thinking Exercises',
            'Peer Pressure Scenarios'
          ],
          completed: false,
          icon: Users
        },
        {
          id: 'grade-9-12',
          title: 'Implement 9-12 Program',
          description: 'Prepare high school students for adult privacy responsibilities',
          duration: '4-5 weeks',
          tasks: [
            'Teach advanced privacy concepts',
            'Address college and career privacy',
            'Discuss privacy laws and rights',
            'Prepare for independent decision-making'
          ],
          resources: [
            '9-12 Curriculum Guide',
            'Advanced Privacy Concepts',
            'Career Privacy Guide',
            'Privacy Law Overview'
          ],
          completed: false,
          icon: GraduationCap
        }
      ]
    },
    {
      id: 'evaluation',
      title: 'Evaluation Phase',
      description: 'Assess program effectiveness and plan for sustainability',
      duration: '2-3 weeks',
      color: 'orange',
      steps: [
        {
          id: 'assess-outcomes',
          title: 'Assess Learning Outcomes',
          description: 'Evaluate student learning and program effectiveness',
          duration: '1 week',
          tasks: [
            'Administer post-assessment tests',
            'Collect teacher feedback',
            'Analyze student work samples',
            'Compare pre and post implementation data'
          ],
          resources: [
            'Assessment Tools',
            'Teacher Feedback Forms',
            'Data Analysis Template',
            'Outcome Report Template'
          ],
          completed: false,
          icon: Target
        },
        {
          id: 'gather-feedback',
          title: 'Gather Stakeholder Feedback',
          description: 'Collect feedback from all stakeholders for program improvement',
          duration: '1 week',
          tasks: [
            'Survey students, teachers, and parents',
            'Conduct focus groups',
            'Interview administrators',
            'Document lessons learned'
          ],
          resources: [
            'Stakeholder Survey Templates',
            'Focus Group Guide',
            'Interview Questions',
            'Lessons Learned Template'
          ],
          completed: false,
          icon: Users
        },
        {
          id: 'plan-sustainability',
          title: 'Plan for Long-term Sustainability',
          description: 'Develop plans for ongoing program maintenance and improvement',
          duration: '1 week',
          tasks: [
            'Create ongoing training schedule',
            'Plan for curriculum updates',
            'Establish evaluation cycles',
            'Develop sustainability budget'
          ],
          resources: [
            'Sustainability Planning Guide',
            'Training Schedule Template',
            'Update Protocol',
            'Budget Planning Worksheet'
          ],
          completed: false,
          icon: Award
        }
      ]
    }
  ];

  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const getPhaseColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getPhaseBorderColor = (color: string) => {
    const colors = {
      blue: 'border-blue-200',
      green: 'border-green-200',
      purple: 'border-purple-200',
      orange: 'border-orange-200'
    };
    return colors[color as keyof typeof colors] || 'border-gray-200';
  };

  const activePhaseData = phases.find(phase => phase.id === activePhase);

  return (
    <PageLayout
      title="Implementation Guide - Step-by-Step Success"
      subtitle="A comprehensive, step-by-step guide to successfully implementing privacy education in your school or organization. From planning to evaluation, we'll guide you through every step."
      icon={Calendar}
      badge="IMPLEMENTATION GUIDE"
      breadcrumbs={true}
    >
      <div className="min-h-screen" style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}>
      {/* Phase Navigation */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            Implementation Phases
          </h2>
          <p className="text-lg" style={{ color: 'var(--gray-600)' }}>
            Choose a phase to see detailed implementation steps and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`text-left p-6 rounded-xl border-2 transition-all ${
                activePhase === phase.id
                  ? `${getPhaseBorderColor(phase.color)} shadow-lg`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getPhaseColor(phase.color)} flex items-center justify-center text-white mb-4`}>
                <Calendar size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--primary)' }}>
                {phase.title}
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--gray-600)' }}>
                {phase.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={12} />
                <span>{phase.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Active Phase Details */}
      {activePhaseData && (
        <section className="container mx-auto px-6 pb-16">
          <div className="bg-white rounded-xl shadow-lg p-8" style={{ backgroundColor: 'var(--card-color)' }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                {activePhaseData.title}
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                {activePhaseData.description}
              </p>
              <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
                <Clock size={16} />
                <span>Duration: {activePhaseData.duration}</span>
              </div>
            </div>

            <div className="space-y-6">
              {activePhaseData.steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.includes(step.id);

                return (
                  <div
                    key={step.id}
                    className={`border rounded-lg p-6 transition-all ${
                      isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                    style={{
                      backgroundColor: isCompleted ? 'var(--green-50)' : 'var(--card-color)',
                      borderColor: isCompleted ? 'var(--green-500)' : 'var(--gray-200)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                          isCompleted ? 'bg-green-500' : `bg-gradient-to-r ${getPhaseColor(activePhaseData.color)}`
                        }`}>
                          {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--primary)' }}>
                            {index + 1}. {step.title}
                          </h3>
                          <p className="text-sm mb-2" style={{ color: 'var(--gray-600)' }}>
                            {step.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {step.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleStepCompletion(step.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          isCompleted
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isCompleted ? 'Completed' : 'Mark Complete'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                          Tasks to Complete:
                        </h4>
                        <ul className="space-y-2">
                          {step.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-start gap-2 text-sm">
                              <span className="text-gray-400 mt-1">•</span>
                              <span style={{ color: 'var(--gray-600)' }}>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                          Resources Available:
                        </h4>
                        <ul className="space-y-2">
                          {step.resources.map((resource, resourceIndex) => (
                            <li key={resourceIndex} className="flex items-center gap-2 text-sm">
                              <Download size={12} className="text-gray-400" />
                              <span style={{ color: 'var(--gray-600)' }}>{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Progress Summary */}
      <section className="bg-gray-50 py-16" style={{ backgroundColor: 'var(--light)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
              Your Implementation Progress
            </h2>
            <p className="text-lg" style={{ color: 'var(--gray-600)' }}>
              Track your progress through the implementation phases.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg" style={{ backgroundColor: 'var(--card-color)' }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {phases.map((phase) => {
                  const phaseSteps = phase.steps.length;
                  const completedPhaseSteps = phase.steps.filter(step =>
                    completedSteps.includes(step.id)
                  ).length;
                  const progressPercentage = Math.round((completedPhaseSteps / phaseSteps) * 100);

                  return (
                    <div key={phase.id} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 relative">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                            {progressPercentage}%
                          </span>
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                        {phase.title}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                        {completedPhaseSteps} of {phaseSteps} steps completed
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Implementation?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Follow this guide step-by-step to successfully implement privacy education in your school or organization.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/educator-tools"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <BookOpen size={20} />
              Get Resources
            </Link>
            <Link
              to="/contact"
              className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors inline-flex items-center gap-2"
            >
              <Users size={20} />
              Get Support
            </Link>
          </div>
        </div>
      </section>
    </div>
    </PageLayout>
  );
};

export default ImplementationGuidePage;
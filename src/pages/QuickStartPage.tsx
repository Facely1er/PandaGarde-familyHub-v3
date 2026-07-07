import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, BookOpen, CheckCircle, ArrowRight, Clock, Star, Shield, ShoppingBag, BarChart3, Unlock, Baby, User, GraduationCap } from 'lucide-react';
import { useJourneyProgress } from '../hooks/useJourneyProgress';
import PageLayout from '../components/layout/PageLayout';
import { QUICK_START_LEAD, PARENT_PATH_STEPS } from '../data/pandaGardeMessaging';

const QuickStartPage: React.FC = () => {
  const { progress, markStepVisited, isStepCompleted, isStepVisited } = useJourneyProgress();
  const quickActions = [
    {
      title: 'Read a story together',
      description: 'Open Privacy Panda and read one scene with your child—about 5 minutes, no setup.',
      icon: Play,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/stories',
      time: '5 min',
      difficulty: 'Easiest start'
    },
    {
      title: 'List your family\'s apps',
      description: 'Tap the apps and websites your kids use. This powers your footprint review scores.',
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/service-catalog',
      time: '10 min',
      difficulty: 'When you\'re ready'
    },
    {
      title: 'Open Family Hub',
      description: 'Do short privacy missions together. Progress saves on this device—no account needed.',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/family-hub',
      time: '2 min',
      difficulty: 'Easy'
    },
    {
      title: 'Print an activity',
      description: 'Download coloring sheets and worksheets to use offline with your child.',
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/downloads/worksheets',
      time: '1 min',
      difficulty: 'Easy'
    }
  ];

  const ageGroupPaths = [
    {
      age: 'Ages 5-8',
      icon: Baby,
      description: 'Start with a Privacy Panda story and printable coloring pages.',
      steps: [
        'Read one Privacy Panda story scene together',
        'Print a coloring sheet for offline fun',
        'Try a Family Hub mission when you have 10 minutes',
      ],
      link: '/stories',
      color: 'from-purple-500 to-pink-500'
    },
    {
      age: 'Ages 9-12',
      icon: User,
      description: 'Stories plus simple guides about passwords and what apps share.',
      steps: [
        'Read a story about sharing online',
        'Try the Privacy Explorers activities',
        'List the apps your tween uses in the catalog',
      ],
      link: '/family-hub/activities',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      age: 'Ages 13-17',
      icon: GraduationCap,
      description: 'Teen handbook and privacy settings guides for older kids.',
      steps: [
        'Open the Teen Privacy Handbook',
        'Review social media privacy settings together',
        'Do a Family Hub mission matched to their age',
      ],
      link: '/family-hub/activities',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const parentQuickSteps = PARENT_PATH_STEPS.map((step, index) => ({
    step: step.step,
    title: step.title,
    description: step.description,
    icon: [Play, ShoppingBag, BarChart3, Users][index] ?? Play,
    link: step.link,
    isFoundation: step.step === 2,
    requires: 'requiresApps' in step && step.requiresApps ? 'Step 2: List your apps' : undefined,
  }));

  return (
    <PageLayout
      title="Quick Start Guide"
      subtitle={QUICK_START_LEAD}
      breadcrumbs={true}
    >
      {/* Quick Actions */}
      <section className="quick-actions py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="section-header fade-in mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-3">
              Pick one thing to do now
            </h2>
            <p className="text-lg text-slate-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
              Each card is a complete starting point. You do not need to do all four.
            </p>
          </div>

          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div key={index} className="quick-action-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`action-icon ${action.bgColor}`}>
                  <action.icon size={32} className={action.color} />
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                  <div className="action-meta">
                    <span className="meta-item">
                      <Clock size={14} />
                      {action.time}
                    </span>
                    <span className="meta-item">
                      <Star size={14} />
                      {action.difficulty}
                    </span>
                  </div>
                  <Link to={action.link} className="action-button">
                    Get Started
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Age Group Paths */}
      <section className="age-paths section-ambient py-16 sm:py-24">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="section-header fade-in mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-3">
              How old is your child?
            </h2>
            <p className="text-lg text-slate-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
              Tap their age group, then open the first link—we will tell you what to do next on each page.
            </p>
          </div>

          <div className="age-paths-grid">
            {ageGroupPaths.map((path, index) => {
              const IconComponent = path.icon;
              return (
                <div key={index} className="age-path-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`path-header bg-gradient-to-r ${path.color}`}>
                    <div className="path-icon">
                      <IconComponent size={48} className="text-white" />
                    </div>
                    <h3>{path.age}</h3>
                  </div>
                  <div className="path-content">
                    <p className="path-description">{path.description}</p>
                    <ul className="path-steps">
                      {path.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="path-step">
                          <CheckCircle size={16} className="check-icon" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to={path.link} className="path-button">
                      Start Learning
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Parent Quick Steps */}
      <section className="parent-steps section-elevated py-16 sm:py-24">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="section-header fade-in mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-3">
              A simple path for parents
            </h2>
            <p className="text-lg text-slate-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
              Four steps, in order—but start with step 1 if you are not sure. Each step works on its own too.
            </p>

            <div className="max-w-xl mx-auto mt-6 p-4 rounded-xl bg-gray-100 dark:bg-gray-200 border-2 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <span>Journey Progress</span>
                <span className="text-green-800 dark:text-green-400">{Math.round(progress.overallProgress)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-800 via-green-700 to-green-500 rounded-md transition-all duration-500"
                  style={{ width: `${progress.overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="journey-container relative mt-12">
            <div className="parent-steps-grid journey-steps-enhanced">
              {parentQuickSteps.map((step, index) => {
                const isCompleted = isStepCompleted(step.step);
                const isVisited = isStepVisited(step.step);
                const isRecommended = progress.nextRecommendedStep === step.step;
                const isFoundation = step.isFoundation;

                return (
                  <Link 
                    key={index} 
                    to={step.link}
                    onClick={() => markStepVisited(step.step)}
                    className={`relative parent-step-card fade-in ${isFoundation ? 'foundation-step' : ''} ${isCompleted ? 'step-completed' : ''} ${isRecommended ? 'step-recommended' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Completion Checkmark */}
                    {isCompleted && (
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 8px rgba(34, 197, 94, 0.3)',
                        zIndex: 10
                      }}>
                        <CheckCircle size={18} className="text-white" style={{ strokeWidth: 3 }} />
                      </div>
                    )}

                    {/* Recommended Badge */}
                    {isRecommended && !isCompleted && (
                      <div style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '-12px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 8px rgba(245, 158, 11, 0.3)',
                        zIndex: 10
                      }}>
                        Next Step
                      </div>
                    )}

                    <div className="step-number">
                      {step.isFoundation && <Unlock size={12} style={{ position: 'absolute', top: '-5px', right: '-5px' }} />}
                      {isCompleted ? (
                        <CheckCircle size={20} className="text-white" style={{ strokeWidth: 3 }} />
                      ) : (
                        <span>{step.step}</span>
                      )}
                    </div>
                    <div className="step-content">
                      <div className="step-header">
                        <div className="step-icon" style={{
                          background: isCompleted ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : undefined,
                          color: isCompleted ? 'white' : undefined
                        }}>
                          <step.icon size={24} />
                        </div>
                        {step.platform && (
                          <span className={`platform-badge ${step.platform === 'Privacy Panda' ? 'privacy-panda' : 'pandagarde'}`}>
                            {step.platform}
                          </span>
                        )}
                      </div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                      
                      {/* Show what this step enables */}
                      {step.enables && step.enables.length > 0 && (
                        <div className="enables-list">
                          <div className="enables-label">
                            <Unlock size={14} />
                            <span>Unlocks:</span>
                          </div>
                          <div className="enables-items">
                            {step.enables.map((feature, idx) => (
                              <span key={idx} className="enable-badge">{feature}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Show requirements */}
                      {step.requires && (
                        <div className="requires-badge">
                          <Shield size={14} />
                          <span>Requires: {step.requires}</span>
                        </div>
                      )}
                      
                      <div className="step-link">
                        {isCompleted ? 'View Again' : isVisited ? 'Continue' : 'Get Started'}
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Success Tips */}
      <section className="success-tips py-16 sm:py-24 bg-slate-50 dark:bg-gray-100/60">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="section-header fade-in mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-3">Tips for Success</h2>
            <p className="text-lg text-slate-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
              Make the most of your family&apos;s privacy education journey with these helpful tips.
            </p>
          </div>

          <div className="tips-grid">
            <div className="tip-card fade-in">
              <div className="tip-icon">
                <Shield size={24} className="text-green-500" />
              </div>
              <h3>Start Small</h3>
              <p>Begin with 10-15 minutes of learning time and gradually increase as your family gets comfortable.</p>
            </div>

            <div className="tip-card fade-in">
              <div className="tip-icon">
                <Users size={24} className="text-blue-500" />
              </div>
              <h3>Learn Together</h3>
              <p>Make it a family activity. Children learn better when parents are involved and engaged.</p>
            </div>

            <div className="tip-card fade-in">
              <div className="tip-icon">
                <BookOpen size={24} className="text-purple-500" />
              </div>
              <h3>Practice Regularly</h3>
              <p>Consistency is key. Try to incorporate privacy learning into your regular routine.</p>
            </div>

            <div className="tip-card fade-in">
              <div className="tip-icon">
                <Star size={24} className="text-yellow-500" />
              </div>
              <h3>Celebrate Progress</h3>
              <p>Use our certificates and achievement system to celebrate your family's learning milestones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section cta-banner py-16 sm:py-24">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="fade-in text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Pick one to start</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              Read a story (5 min) or list your apps (10 min). Both are good first steps.
            </p>
            <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/stories" className="button primary">
                <Play size={20} />
                Read a story
              </Link>
              <Link to="/service-catalog" className="button secondary bg-white/20 text-white border-2 border-white">
                <ShoppingBag size={20} />
                List your apps
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default QuickStartPage;
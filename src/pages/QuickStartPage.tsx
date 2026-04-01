import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Users, BookOpen, Download, CheckCircle, ArrowRight, Clock, Star, Shield, ShoppingBag, BarChart3, Unlock, Baby, User, GraduationCap, Rocket } from 'lucide-react';
import { useJourneyProgress } from '../hooks/useJourneyProgress';
import PageLayout from '../components/layout/PageLayout';

const QuickStartPage: React.FC = () => {
  const { progress, markStepVisited, isStepCompleted, isStepVisited } = useJourneyProgress();
  const quickActions = [
    {
      title: 'Start with Privacy Panda',
      description: 'Try our interactive story and activities designed for children ages 5-17',
      icon: Play,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/privacy-panda',
      time: '5 min',
      difficulty: 'Easy'
    },
    {
      title: 'Join Family Hub',
      description: 'Connect with other families and access exclusive resources',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/family-hub',
      time: '2 min',
      difficulty: 'Easy'
    },
    {
      title: 'Download Activity Book',
      description: 'Get printable activities and coloring sheets for offline learning',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/activity-book',
      time: '1 min',
      difficulty: 'Easy'
    },
    {
      title: 'Access Parent Resources',
      description: 'Browse comprehensive guides and tools for parents and educators',
      icon: Download,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/resources',
      time: '10 min',
      difficulty: 'Medium'
    }
  ];

  const ageGroupPaths = [
    {
      age: 'Ages 5-8',
      icon: Baby,
      description: 'Start with Privacy Panda\'s story and coloring activities',
      steps: [
        'Watch Privacy Panda\'s story',
        'Complete coloring activities',
        'Try simple privacy games',
        'Download printable materials'
      ],
      link: '/activity-book',
      color: 'from-purple-500 to-pink-500'
    },
    {
      age: 'Ages 9-12',
      icon: User,
      description: 'Explore interactive activities and learn about digital footprints',
      steps: [
        'Join Privacy Explorers program',
        'Learn about social media privacy',
        'Practice password safety',
        'Complete digital citizenship activities'
      ],
      link: '/privacy-explorers',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      age: 'Ages 13-17',
      icon: GraduationCap,
      description: 'Master advanced privacy settings and digital rights',
      steps: [
        'Access Teen Handbook',
        'Learn about data protection',
        'Practice privacy tools',
        'Join digital citizenship discussions'
      ],
      link: '/teen-handbook',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const parentQuickSteps = [
    {
      step: 1,
      title: 'Join PandaGarde Platform',
      description: 'Create your family profile and access the complete privacy education ecosystem',
      icon: Users,
      link: '/family-hub',
      platform: 'PandaGarde'
    },
    {
      step: 2,
      title: 'Add Services for Digital Footprint Analysis',
      description: 'Tell us which apps and services your family uses. This enables Digital Footprint Analysis, privacy recommendations, and safety alerts',
      icon: ShoppingBag,
      link: '/service-catalog',
      platform: 'PandaGarde',
      enables: ['Digital Footprint Analysis', 'Privacy Recommendations', 'Safety Alerts'],
      isFoundation: true
    },
    {
      step: 3,
      title: 'Start Privacy Panda Learning',
      description: 'Begin interactive stories and activities designed for your child\'s age group',
      icon: Play,
      link: '/privacy-panda',
      platform: 'Privacy Panda'
    },
    {
      step: 4,
      title: 'View Your Digital Footprint Analysis',
      description: 'See your family\'s privacy exposure across all services and get personalized recommendations to improve your privacy',
      icon: BarChart3,
      link: '/digital-footprint',
      platform: 'PandaGarde',
      requires: 'Step 2: Add Services'
    }
  ];

  return (
    <PageLayout
      title="Quick Start Guide"
      subtitle="Get started with PandaGarde in minutes. Choose your path and begin your family's privacy education journey today."
      icon={Rocket}
      badge="QUICK START"
      breadcrumbs={true}
    >
      {/* Quick Actions */}
      <section className="quick-actions" style={{ padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-header fade-in" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '0.75rem'
            }}>Choose Your Starting Point</h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>Pick the option that feels right for your family and start learning today.</p>
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
      <section className="age-paths" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="section-header fade-in" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '0.75rem'
            }}>Age-Appropriate Learning Paths</h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>Find the perfect starting point for your child's age and development level.</p>
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
      <section className="parent-steps" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="section-header fade-in" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '0.75rem'
            }}>Your PandaGarde Journey</h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>Follow these simple steps to protect your family in the digital age.</p>
            
            {/* Progress Bar */}
            <div style={{ 
              maxWidth: '600px', 
              margin: '1.5rem auto 0',
              background: '#f3f4f6',
              borderRadius: '12px',
              padding: '1rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                  Journey Progress
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1B5E20' }}>
                  {Math.round(progress.overallProgress)}%
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '12px', 
                background: '#e5e7eb', 
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{ 
                  width: `${progress.overallProgress}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #1B5E20 0%, #2E7D32 50%, #66BB6A 100%)',
                  borderRadius: '6px',
                  transition: 'width 0.5s ease-in-out',
                  boxShadow: '0 2px 4px rgba(27, 94, 32, 0.2)'
                }} />
              </div>
            </div>
          </div>

          <div className="journey-container" style={{ position: 'relative', marginTop: '3rem' }}>
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
                    className={`parent-step-card fade-in ${isFoundation ? 'foundation-step' : ''} ${isCompleted ? 'step-completed' : ''} ${isRecommended ? 'step-recommended' : ''}`} 
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      position: 'relative'
                    }}
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
      <section className="success-tips" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="section-header fade-in" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '0.75rem'
            }}>Tips for Success</h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>Make the most of your family's privacy education journey with these helpful tips.</p>
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
      <section className="cta-section" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="fade-in text-center">
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '700',
              color: 'white',
              marginBottom: '1rem'
            }}>Ready to Begin?</h2>
            <p style={{
              fontSize: '1.125rem',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '700px',
              margin: '0 auto 2rem',
              lineHeight: '1.6'
            }}>Choose your starting point and begin your family's digital privacy education journey today.</p>
            <div className="cta-buttons">
              <Link to="/privacy-panda" className="button primary">
                <Play size={20} />
                Start with Privacy Panda
              </Link>
              <Link to="/family-hub" className="button secondary" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white' }}>
                <Users size={20} />
                Join Family Hub
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default QuickStartPage;
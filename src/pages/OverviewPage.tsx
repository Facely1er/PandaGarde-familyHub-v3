import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Check, BookOpen, Heart, Brain, Play, Baby, ArrowRight, ArrowLeft, ShoppingBag, BarChart3, Unlock, User, GraduationCap, UsersRound } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { QUICK_START_LEAD, PARENT_PATH_STEPS } from '../data/pandaGardeMessaging';

const OverviewPage: React.FC = () => {
  useEffect(() => {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all animation elements
    const animationElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animationElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const ageGroups = [
    {
      id: '5-8',
      title: 'Ages 5-8',
      icon: Baby,
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'Basic privacy concepts through stories',
        'Interactive coloring activities',
        'Simple online safety rules',
        'Privacy Panda character adventures',
        'Family-friendly learning games'
      ]
    },
    {
      id: '9-12',
      title: 'Ages 9-12',
      icon: User,
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        'Social media privacy basics',
        'Digital footprint awareness',
        'Password security fundamentals',
        'Online communication safety',
        'Critical thinking about online content'
      ]
    },
    {
      id: '13-17',
      title: 'Ages 13-17',
      icon: GraduationCap,
      gradient: 'from-green-500 to-emerald-500',
      features: [
        'Advanced privacy settings management',
        'Data protection and rights',
        'Online reputation management',
        'Privacy tools and technologies',
        'Digital citizenship and ethics'
      ]
    },
    {
      id: 'parents',
      title: 'Parents',
      icon: UsersRound,
      gradient: 'from-orange-500 to-red-500',
      features: [
        'Family privacy policy creation',
        'Device and app management',
        'Guided missions and household routines',
        'Privacy education resources',
        'Guided missions and household routines'
      ]
    }
  ];

  const customerJourney = PARENT_PATH_STEPS.map((step, index) => ({
    step: step.step,
    title: step.title,
    description: step.description,
    icon: [Play, ShoppingBag, BarChart3, Users][index] ?? Play,
    link: step.link,
    isFoundation: step.step === 2,
    requires: 'requiresApps' in step && step.requiresApps ? 'List your apps first (step 2)' : undefined,
  }));

  const products = [
    {
      id: 'stories',
      title: 'Privacy Panda stories',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Read together with your child—about 5 minutes, no setup. The easiest place to start.',
      features: [
        'Interactive scenes or calm chapters for ages 5–17',
        'Conversation starters built into each story',
        'Works on any phone, tablet, or computer',
        'No account or app list required',
      ],
      ctaText: 'Browse stories',
      ctaLink: '/stories',
    },
    {
      id: 'catalog',
      title: 'App list & footprint review',
      icon: ShoppingBag,
      gradient: 'from-green-500 to-emerald-500',
      description: 'Tap the apps your family uses, then see which ones collect the most data.',
      features: [
        'You choose what to add—we do not monitor devices',
        'Simple privacy score for each app',
        'See where your family\'s data exposure adds up',
        'Get clear next steps for apps that score high',
      ],
      ctaText: 'List your apps',
      ctaLink: '/service-catalog',
    },
    {
      id: 'family-hub',
      title: 'Family Hub',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Short privacy missions you do together. Progress saves on this device.',
      features: [
        '18 age-matched missions (ages 5–17)',
        'Family talk prompts and one practical action each',
        'No child social network',
        'Works on its own or after stories and footprint review',
      ],
      ctaText: 'Open Family Hub',
      ctaLink: '/family-hub',
    },
  ];

  return (
    <PageLayout
      title="How it works"
      subtitle={QUICK_START_LEAD}
    >

      {/* Customer Journey */}
      <section className="parent-steps py-8 md:py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="section-header fade-in">
            <h2>Four steps—start with whichever fits today</h2>
            <p>Read a story, list your apps, see your scores, or practice in Family Hub. Each step tells you what to tap next.</p>
          </div>

          <div className="parent-steps-grid">
            {customerJourney.map((step, index) => (
              <Link 
                key={index} 
                to={step.link} 
                className={`parent-step-card fade-in ${step.isFoundation ? 'foundation-step' : ''}`} 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="step-number">
                  {step.isFoundation && <Unlock size={12} className="absolute -top-1 -right-1" aria-hidden />}
                  <span>{step.step}</span>
                </div>
                <div className="step-content">
                  <div className="step-header">
                    <div className="step-icon">
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
                    Get Started
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Age-Appropriate Curriculum */}
      <section className="curriculum-section py-8 md:py-12" id="curriculum">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="section-header fade-in">
            <span className="badge">BY AGE</span>
            <h2>How old is your child?</h2>
            <p>Pick their age group to see stories, printables, and missions matched to them.</p>
          </div>

          <div className="curriculum-grid">
            {ageGroups.map((group, index) => {
              const IconComponent = group.icon;
              return (
                <div key={group.id} className="curriculum-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`card-header bg-gradient-to-r ${group.gradient}`}>
                    <div className="card-icon">
                      <IconComponent size={48} className="text-white" />
                    </div>
                    <h3>{group.title}</h3>
                  </div>
                  <div className="card-content">
                    <ul className="feature-list">
                      {group.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="feature-item">
                          <Check size={16} className="check-icon" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Complete Ecosystem */}
      <section className="products-section py-8 md:py-12" id="products">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="section-header fade-in">
            <span className="badge">THREE MAIN AREAS</span>
            <h2>Stories, app review, and practice</h2>
            <p>Each area works on its own. You do not need to finish one before starting another.</p>
          </div>

          <div className="products-grid">
            {products.map((product, index) => (
              <div key={product.id} className="product-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`card-header bg-gradient-to-r ${product.gradient}`}>
                  <div className="card-icon">
                    <product.icon size={32} />
                  </div>
                  <h3>{product.title}</h3>
                </div>
                <div className="card-content">
                  <p className="product-description">{product.description}</p>
                  <ul className="feature-list">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="feature-item">
                        <Check size={16} className="check-icon" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={product.ctaLink} className="product-cta">
                    {product.ctaText}
                    <ArrowLeft size={16} className="rotate-180" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Highlight */}
      <section className="features-highlight">
        <div className="container">
          <div className="section-header fade-in">
            <span className="badge">WHY PANDAGARDE</span>
            <h2>Built for busy parents</h2>
            <p>Short sessions, plain language, and one clear next step on every page.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card fade-in">
              <div className="feature-icon">
                <Heart size={32} className="text-red-500" />
              </div>
              <h3>Start anywhere</h3>
              <p>Read a story today, list apps tomorrow, open Family Hub next week. Nothing is locked behind a long signup.</p>
            </div>

            <div className="feature-card fade-in">
              <div className="feature-icon">
                <Brain size={32} className="text-purple-500" />
              </div>
              <h3>Plain language</h3>
              <p>No privacy-policy jargon. We explain what each app score means and give you words to use with your kids.</p>
            </div>

            <div className="feature-card fade-in">
              <div className="feature-icon">
                <BookOpen size={32} className="text-blue-500" />
              </div>
              <h3>Interactive & Engaging</h3>
              <p>Learning through stories, games, and activities that make privacy education fun and memorable for children.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="fade-in text-center">
            <h2>Ready to start?</h2>
            <p>Got 5 minutes? Read a story with your child. Got 15? List the apps your family uses.</p>
            <div className="cta-buttons">
              <Link to="/stories" className="button primary">
                <BookOpen size={20} />
                Browse stories
              </Link>
              <Link to="/service-catalog" className="button secondary" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white' }}>
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

export default OverviewPage;
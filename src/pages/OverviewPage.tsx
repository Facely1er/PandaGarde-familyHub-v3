import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Wrench, Check, BookOpen, Heart, Brain, Play, Baby, ArrowRight, ArrowLeft, ShoppingBag, BarChart3, Unlock, User, GraduationCap, UsersRound, Info } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

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
        'Monitoring and guidance strategies',
        'Privacy education resources',
        'Community support and networking'
      ]
    }
  ];

  const customerJourney = [
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

  const products = [
    {
      id: 'family-hub',
      title: 'Family Hub',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Connect with other families and access exclusive resources for digital safety education.',
      features: [
        'Community support and networking',
        'Exclusive educational resources',
        'Parent guidance and tips',
        'Progress tracking and achievements',
        'Family challenges and activities'
      ],
      ctaText: 'Join Family Hub',
      ctaLink: '/family-hub'
    },
    {
      id: 'privacy-panda',
      title: 'PrivacyPanda',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Interactive learning platform with gamified activities and stories for children ages 5-17.',
      features: [
        'Interactive stories and games',
        'Age-appropriate learning paths',
        'Progress tracking and rewards',
        'Offline activities and printables',
        'Parent dashboard and insights'
      ],
      ctaText: 'Try PrivacyPanda',
      ctaLink: '/privacy-panda'
    },
    {
      id: 'parent-toolkit',
      title: 'Parent Toolkit',
      icon: Wrench,
      gradient: 'from-green-500 to-emerald-500',
      description: 'Comprehensive tools and resources to help parents guide their children\'s digital journey.',
      features: [
        'Privacy policy templates',
        'Device management guides',
        'Conversation starters',
        'Safety checklists and tools',
        'Expert advice and support'
      ],
      ctaText: 'Access Toolkit',
      ctaLink: '/parent-toolkit'
    }
  ];

  return (
    <PageLayout
      title="Overview"
      subtitle="Everything your family needs for digital privacy. Our comprehensive platform provides age-appropriate education, interactive tools, and community support to help families navigate the digital world safely and confidently."
      icon={Info}
      badge="OVERVIEW"
    >

      {/* Customer Journey */}
      <section className="parent-steps">
        <div className="container">
          <div className="section-header fade-in">
            <h2>Your PandaGarde Journey</h2>
            <p>Follow these simple steps to protect your family in the digital age.</p>
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
                  {step.isFoundation && <Unlock size={12} style={{ position: 'absolute', top: '-5px', right: '-5px' }} />}
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
      <section className="curriculum-section" id="curriculum">
        <div className="container">
          <div className="section-header fade-in">
            <span className="badge">AGE-APPROPRIATE CURRICULUM</span>
            <h2>Learning Paths for Every Family Member</h2>
            <p>Comprehensive learning paths designed for every family member, from young children to parents.</p>
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
      <section className="products-section" id="products">
        <div className="container">
          <div className="section-header fade-in">
            <span className="badge">OUR COMPLETE ECOSYSTEM</span>
            <h2>Three Powerful Tools Working Together</h2>
            <p>Everything your family needs for comprehensive digital privacy education and protection.</p>
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
            <span className="badge">WHY CHOOSE PANDAGARDE</span>
            <h2>Built for Families, by Privacy Experts</h2>
            <p>Our platform combines modern educational design with research-based privacy protection principles.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card fade-in">
              <div className="feature-icon">
                <Heart size={32} className="text-red-500" />
              </div>
              <h3>Family-First Design</h3>
              <p>Every feature is designed with families in mind, ensuring age-appropriate content and easy parent oversight.</p>
            </div>

            <div className="feature-card fade-in">
              <div className="feature-icon">
                <Brain size={32} className="text-purple-500" />
              </div>
              <h3>Evidence-Based Learning</h3>
              <p>Our curriculum is built on established educational principles and current privacy research to support effective learning outcomes.</p>
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
            <h2>Ready to Get Started?</h2>
            <p>Choose the path that's right for your family and begin your digital privacy education journey today.</p>
            <div className="cta-buttons">
              <Link to="/family-hub" className="button primary">
                <Users size={20} />
                Join Family Hub
              </Link>
              <Link to="/privacy-panda" className="button secondary" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white' }}>
                <Shield size={20} />
                Try PrivacyPanda
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default OverviewPage;
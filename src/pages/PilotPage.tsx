import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Users, Award, CheckCircle, MessageSquare,
  Shield, Star, ArrowRight, Calendar, Target,
  Heart, TrendingUp, Gift, Clock
} from 'lucide-react';
import { trackEvent, AnalyticsEvents } from '../lib/analytics';
import { usePageTracking } from '../hooks/useAnalytics';
import PageLayout from '../components/layout/PageLayout';

const PilotPage: React.FC = () => {
  usePageTracking('Pilot Program 2026');

  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent(AnalyticsEvents.PILOT_PAGE_VIEWED, {
      timestamp: new Date().toISOString(),
      source: 'direct_navigation'
    });
  }, []);


  const handleCTAClick = (location: string) => {
    trackEvent(AnalyticsEvents.PILOT_CTA_CLICKED, {
      source: 'pilot_page',
      button_location: location,
      timestamp: new Date().toISOString()
    });
  };

  const keyDates2026 = [
    { label: 'Applications open', date: 'January 15, 2026', icon: Calendar },
    { label: 'Application deadline', date: 'March 15, 2026', icon: Clock },
    { label: 'Participants notified', date: 'April 1, 2026', icon: CheckCircle },
    { label: 'Pilot starts', date: 'April 15, 2026', icon: Sparkles },
    { label: 'Feedback window', date: 'Weeks 5–6 (May 2026)', icon: MessageSquare },
    { label: 'Pilot wrap-up & results', date: 'June 2026', icon: Award }
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: 'Early Access',
      description: 'Be among the first to experience the complete Family Hub and educator features for 2026'
    },
    {
      icon: Heart,
      title: 'Shape the Future',
      description: 'Your feedback directly influences the development of features families and educators need most'
    },
    {
      icon: Gift,
      title: 'Exclusive Resources',
      description: 'Access to premium content, priority support, and special recognition as a 2026 pilot partner'
    },
    {
      icon: Users,
      title: 'Join a Community',
      description: 'Connect with other privacy-conscious families and educators sharing the pilot journey'
    }
  ];

  const whatToExpect = [
    {
      week: 'Week 1',
      title: 'Onboarding',
      items: [
        'Account setup and COPPA compliance',
        'Family member addition',
        'Initial goal setting',
        'Platform orientation'
      ]
    },
    {
      week: 'Weeks 2-4',
      title: 'Active Use',
      items: [
        'Use platform 2-3 times per week',
        'Complete at least 1 journey path per child',
        'Try 3-5 different games',
        'Use family dashboard features'
      ]
    },
    {
      week: 'Week 5',
      title: 'Feedback Collection',
      items: [
        'Parent interviews (30 min)',
        'Child feedback sessions',
        'Survey completion',
        'Feature request collection'
      ]
    },
    {
      week: 'Week 6',
      title: 'Analysis & Planning',
      items: [
        'Data analysis',
        'Feature prioritization',
        'Development roadmap for 2026 and beyond'
      ]
    }
  ];

  const requirements = [
    { icon: Users, text: 'At least 1 parent + 1-3 children' },
    { icon: Calendar, text: 'Mix of age groups (elementary, middle, high school)' },
    { icon: MessageSquare, text: 'Willing to provide weekly feedback' },
    { icon: Shield, text: 'Comfortable with technology' }
  ];

  return (
    <PageLayout
      title="PandaGarde Pilot 2026"
      subtitle="Help shape the future of family privacy education. Join our 2026 pilot—families and educators testing the PandaGarde Family Hub and building momentum for the year ahead."
      icon={Sparkles}
      badge="PILOT 2026"
      breadcrumbs={true}
    >
      <div className="max-w-6xl mx-auto py-12">
          {/* Key Dates 2026 – momentum and deadlines */}
          <section id="key-dates" className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-green-800 dark:text-green-300">
                Key Dates 2026
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Mark your calendar—apply by the deadline and join the 2026 pilot cohort
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {keyDates2026.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-green-100 dark:border-green-900/50 hover:border-green-300 dark:hover:border-green-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-green-700 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-300">{item.label}</p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-0.5">{item.date}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* What is the Pilot */}
          <section id="learn-more" className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-green-800 dark:text-green-300">
                  What is the PandaGarde Pilot 2026?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  A 6-week program where selected families and educators help us test and improve
                  the PandaGarde Family Hub through real-world usage and feedback—and build momentum for 2026.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 sm:p-8 mb-10 border border-green-100 dark:border-green-800/50">
                <h3 className="font-bold mb-3 flex items-center text-green-800 dark:text-green-300 text-xl">
                  <Target className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
                  Our Goal
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We've built a comprehensive family privacy education platform with interactive games,
                  age-appropriate learning journeys, and a family dashboard. Now we need <strong>real families and educators</strong>
                  to test it and tell us what works, what doesn't, and what's missing for 2026 and beyond.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold mb-3 flex items-center text-green-800 dark:text-green-300">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                    What We're Testing
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Progress tracking and family dashboard</li>
                    <li>• Game and journey completion syncing</li>
                    <li>• Parent-child interaction features</li>
                    <li>• User experience and navigation</li>
                    <li>• COPPA compliance workflows</li>
                    <li>• Mobile and desktop usability</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold mb-3 flex items-center text-green-800 dark:text-green-300">
                    <Star className="w-5 h-5 mr-2 text-amber-500" />
                    What You'll Do
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Use the platform with your family</li>
                    <li>• Complete games and learning journeys</li>
                    <li>• Provide weekly feedback</li>
                    <li>• Participate in optional interviews</li>
                    <li>• Share your honest opinions</li>
                    <li>• Help us build something amazing for 2026</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-green-800 dark:text-green-300">
                Why Join the 2026 Pilot?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Be part of something special and help create the best family privacy education platform
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-green-200 dark:hover:border-green-800 transition-all"
                  >
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-green-700 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-green-800 dark:text-green-300">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-green-800 dark:text-green-300">
                6-Week Pilot Timeline
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                What to expect during the 2026 pilot program
              </p>
            </div>
            <div className="max-w-4xl mx-auto space-y-4">
              {whatToExpect.map((phase, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <span className="font-semibold text-green-700 dark:text-green-400">{phase.week}</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{phase.title}</span>
                      </div>
                      <ul className="space-y-2 mt-3">
                        {phase.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start text-gray-700 dark:text-gray-300 gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Requirements */}
          <section className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-green-800 dark:text-green-300">
                Who Can Join?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                We're looking for families who want to help shape the future of privacy education in 2026
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 sm:p-8 border border-green-100 dark:border-green-800/50">
                <h3 className="font-bold mb-6 text-center text-green-800 dark:text-green-300 text-xl">
                  Ideal Participants
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {requirements.map((req, index) => {
                    const Icon = req.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border border-green-100 dark:border-green-800">
                          <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">{req.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Success Metrics */}
          <section className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-green-800 dark:text-green-300">
                What Success Looks Like
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Our goals for the 2026 pilot program
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-bold mb-2 text-green-800 dark:text-green-300">80%+ Engagement</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Families complete at least 1 journey and try multiple games
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-bold mb-2 text-green-800 dark:text-green-300">Weekly Feedback</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Regular input from parents and children to guide development
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                <Award className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-bold mb-2 text-green-800 dark:text-green-300">70%+ Satisfaction</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Positive feedback and willingness to continue using the platform
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section
            className="rounded-2xl p-8 sm:p-12 text-center text-white"
            style={{
              background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Sparkles className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-6 text-white/90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Join the 2026 Pilot?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Help us build the best family privacy education platform. Your feedback will directly shape
              the features and tools we develop for families everywhere in 2026 and beyond.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/family-hub"
                onClick={() => handleCTAClick('cta_section')}
                className="inline-flex items-center gap-2 bg-white text-green-800 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                <span>Start Your Pilot Journey</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/contact"
                onClick={() => handleCTAClick('contact_button')}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white/20 transition-colors"
              >
                Have Questions?
              </Link>
            </div>
          </section>
        </div>
    </PageLayout>
  );
};

export default PilotPage;


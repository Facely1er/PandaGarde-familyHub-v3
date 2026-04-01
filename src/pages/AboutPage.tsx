import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, GraduationCap, Accessibility as UniversalAccess, Gamepad2, Lock, Users, Shield, School, Rocket } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const AboutPage: React.FC = () => {

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: Heart,
      title: 'Family-Centered',
      description: 'We build everything with families in mind. Privacy education works best when parents, kids, and teachers learn and talk about it together.'
    },
    {
      icon: GraduationCap,
      title: 'Evidence-Based',
      description: 'Our content is based on how kids learn and what works for each age. We use research and best practices so the lessons stick.'
    },
    {
      icon: UniversalAccess,
      title: 'Accessible',
      description: 'We want every family to have access—no matter their tech skills or budget. Our resources are free and easy to use.'
    },
    {
      icon: Gamepad2,
      title: 'Engaging',
      description: 'Learning about privacy should be fun. We use games, stories, and hands-on activities so kids actually enjoy it and remember what they learn.'
    },
    {
      icon: Lock,
      title: 'Privacy-Respecting',
      description: 'We follow our own advice. We collect very little data and respect your privacy at every step—so you can trust us with your family.'
    },
    {
      icon: Users,
      title: 'Community-Driven',
      description: 'Parents, teachers, and experts help shape PandaGarde. We listen to our community so we can keep improving for families.'
    }
  ];

  return (
    <PageLayout
      title="About"
      subtitle="We help families and kids learn about online privacy through fun, age-appropriate activities—so everyone can stay safer online."
      icon={Shield}
      badge="ABOUT US"
    >
      <div className="max-w-6xl mx-auto">

          {/* Mission Section */}
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                  Our Mission
                </h2>
                <div className="space-y-6 text-lg leading-relaxed" style={{ color: 'var(--gray-600)' }}>
                  <p>
                    We believe kids should learn about online privacy early—and that it should be easy and fun for every family.
                    Our goal is to give children and parents the knowledge and skills to stay safe and confident online.
                  </p>
                  <p>
                    With our Privacy Panda character and free activities, we help build habits that last: so kids can make
                    smarter choices about what they share and how they stay safe on the internet.
                  </p>
                  <p>
                    We make privacy education fun and practical for all ages—from young kids taking their first steps online
                    to teens getting ready to use the internet on their own.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-12 text-center"
                   style={{ backgroundColor: 'var(--light)' }}>
                <div className="w-32 h-32 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center text-white text-5xl mx-auto mb-6">
                  <Shield size={64} />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                  Privacy First
                </h3>
                <p style={{ color: 'var(--gray-600)' }}>
                  Building a safer digital future for families everywhere
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Our Core Values
              </h2>
              <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--gray-600)' }}>
                These principles guide everything we do at PandaGarde, from product development to community engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2 border-2 border-gray-100"
                    style={{
                      backgroundColor: 'var(--card-color)',
                      borderColor: 'var(--gray-200)'
                    }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-500 rounded-xl flex items-center justify-center text-white mx-auto mb-6">
                      <IconComponent size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                      {value.title}
                    </h3>
                    <p className="leading-relaxed" style={{ color: 'var(--gray-600)' }}>
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Educational Approach Section */}
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="bg-gray-50 rounded-2xl p-12 text-center order-2 lg:order-1"
                   style={{ backgroundColor: 'var(--light)' }}>
                <div className="w-32 h-32 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center text-white text-5xl mx-auto mb-6">
                  <School size={64} />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                  K-12 Standards
                </h3>
                <p style={{ color: 'var(--gray-600)' }}>
                  Curriculum aligned with educational standards nationwide
                </p>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                  Comprehensive K-12 Integration
                </h2>
                <div className="space-y-6 text-lg leading-relaxed" style={{ color: 'var(--gray-600)' }}>
                  <p>
                    PandaGarde works for both families at home and schools in the classroom. Our content fits with what
                    many schools already teach about digital citizenship and staying safe online.
                  </p>
                  <p>
                    Teachers can use our lesson plans and activities in different ways—over several weeks, in a short unit,
                    or in after-school programs. We provide guides and support to make it easy.
                  </p>
                  <p>
                    We build skills step by step from elementary through high school, so students grow into confident,
                    privacy-aware users of the internet.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Approach Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Our Approach
              </h2>
            </div>

            <div className="bg-gray-50 rounded-2xl p-12 text-center max-w-4xl mx-auto"
                 style={{ backgroundColor: 'var(--light)' }}>
              <h3 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Expert-Designed, Family-Tested
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--gray-600)' }}>
                PandaGarde is developed by a team of privacy experts, educators, and child development specialists
                who understand both the technical aspects of digital privacy and the unique challenges of teaching
                these concepts to children. Every resource is tested with real families to ensure it's both
                educational and engaging.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-green-800 via-green-600 to-green-500 rounded-2xl p-16 text-white">
              <h2 className="text-4xl font-bold mb-6">
                Join Our Mission
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Ready to help your family learn about online privacy? Explore our free resources and see how
                PandaGarde can make it easier and more fun.
              </p>
              <Link
                to="/family-hub"
                className="inline-flex items-center gap-3 bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                <Rocket size={24} />
                Start Your Journey
              </Link>
            </div>
          </section>
        </div>
    </PageLayout>
  );
};

export default AboutPage;
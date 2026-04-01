import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, BookOpen, CheckCircle, ArrowRight, Calendar } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const timelines = {
  classroom: {
    title: '6-Week Classroom Implementation',
    duration: '6 weeks',
    setting: 'Classroom',
    description: 'Comprehensive curriculum designed for traditional classroom settings with daily lessons and activities.',
    weeks: [
      {
        number: 1,
        title: 'Introduction & Personal Information',
        description: 'Read Chapter 1, identity activities, public vs. private sorting'
      },
      {
        number: 2,
        title: 'Password Safety',
        description: 'Chapter 2 part 1, password strength activities, secret message creation'
      },
      {
        number: 3,
        title: 'Digital Footprints',
        description: 'Chapter 2 completion, footprint art projects, understanding permanence'
      },
      {
        number: 4,
        title: 'Asking Permission',
        description: 'Chapter 3, photo sharing activities, decision-making practice'
      },
      {
        number: 5,
        title: 'Being a Privacy Hero',
        description: 'Chapter 4, badge creation, problem-solving scenarios'
      },
      {
        number: 6,
        title: 'Review & Celebration',
        description: 'Culminating projects, assessment, Privacy Hero ceremony'
      }
    ]
  },
  condensed: {
    title: '2-Week Condensed Program',
    duration: '2 weeks',
    setting: 'Any Setting',
    description: 'Fast-track implementation perfect for camps, workshops, or intensive learning periods.',
    weeks: [
      {
        number: 1,
        title: 'Privacy Basics & Personal Info',
        description: 'Core concepts, password safety, and digital footprint awareness'
      },
      {
        number: 2,
        title: 'Advanced Concepts & Practice',
        description: 'Permission protocols, privacy hero skills, and celebration'
      }
    ]
  },
  afterschool: {
    title: '8-Week After-School Program',
    duration: '8 weeks',
    setting: 'After-School',
    description: 'Extended program with deeper exploration and hands-on projects for after-school settings.',
    weeks: [
      {
        number: 1,
        title: 'Getting Started',
        description: 'Introduction to digital privacy and Privacy Panda'
      },
      {
        number: 2,
        title: 'Personal Information Deep Dive',
        description: 'Extended activities on protecting personal data'
      },
      {
        number: 3,
        title: 'Password Power',
        description: 'Comprehensive password security training'
      },
      {
        number: 4,
        title: 'Digital Detective Work',
        description: 'Understanding and managing digital footprints'
      },
      {
        number: 5,
        title: 'Permission Protocols',
        description: 'Advanced decision-making for sharing and posting'
      },
      {
        number: 6,
        title: 'Community & Communication',
        description: 'Safe online communication and community building'
      },
      {
        number: 7,
        title: 'Privacy Hero Training',
        description: 'Advanced scenarios and leadership skills'
      },
      {
        number: 8,
        title: 'Showcase & Graduation',
        description: 'Final projects and Privacy Hero graduation ceremony'
      }
    ]
  },
  home: {
    title: 'Flexible Home Learning',
    duration: '4+ weeks',
    setting: 'Home',
    description: 'Adaptable program for families to implement at their own pace with flexible scheduling.',
    weeks: [
      {
        number: 1,
        title: 'Family Privacy Discussion',
        description: 'Start conversations about online safety at home'
      },
      {
        number: 2,
        title: 'Activity-Based Learning',
        description: 'Use printable activities and interactive resources'
      },
      {
        number: 3,
        title: 'Story Time & Reflection',
        description: 'Read Privacy Panda stories and discuss lessons learned'
      },
      {
        number: 4,
        title: 'Ongoing Practice',
        description: 'Continue learning with family challenges and check-ins'
      }
    ]
  }
};

const ImplementationPage: React.FC = () => {
  const [activeTimeline, setActiveTimeline] = useState<keyof typeof timelines>('classroom');

  return (
    <PageLayout
      title="Implementation Timeline"
      subtitle="Flexible guides to implementing Privacy Panda education in various settings. Choose the implementation model that best fits your needs and schedule."
      icon={Calendar}
      badge="IMPLEMENTATION"
      breadcrumbs={true}
    >

      <section className="timeline-section">
        <div className="container">
          <div className="timeline-intro">
            <p>The Privacy Panda curriculum is designed to be flexible and adaptable to different educational settings and timeframes. Each implementation model includes detailed lesson plans, activities, and assessment tools.</p>
          </div>

          <div className="timeline-options">
            {Object.entries(timelines).map(([key, timeline]) => (
              <div
                key={key}
                className={`timeline-option ${activeTimeline === key ? 'active' : ''}`}
                onClick={() => setActiveTimeline(key as keyof typeof timelines)}
              >
                <div className="timeline-option-header">
                  <h3>{timeline.title}</h3>
                  <div className="timeline-meta">
                    <span className="duration">
                      <Clock size={16} />
                      {timeline.duration}
                    </span>
                    <span className="setting">
                      <Users size={16} />
                      {timeline.setting}
                    </span>
                  </div>
                </div>
                <p>{timeline.description}</p>
              </div>
            ))}
          </div>

          <div className="timeline-container">
            <div className="timeline-summary">
              <div className="timeline-header">
                <h2>{timelines[activeTimeline].title}</h2>
                <div className="timeline-info">
                  <span className="duration">
                    <Clock size={20} />
                    {timelines[activeTimeline].duration}
                  </span>
                  <span className="setting">
                    <Users size={20} />
                    {timelines[activeTimeline].setting}
                  </span>
                </div>
              </div>
              
              <div className="timeline-description">
                <p>{timelines[activeTimeline].description}</p>
              </div>

              <div className="timeline-weeks">
                {timelines[activeTimeline].weeks.map((week) => (
                  <div key={week.number} className="week-item">
                    <div className="week-number">{week.number}</div>
                    <div className="week-content">
                      <h4>{week.title}</h4>
                      <p>{week.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="timeline-actions">
                <Link to="/implementation-guide" className="button primary">
                  <BookOpen size={16} />
                  View Detailed Timeline
                </Link>
                <Link to="/get-started" className="button secondary">
                  <ArrowRight size={16} />
                  Get Started Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="implementation-features">
        <div className="container">
          <h2>What's Included in Each Implementation</h2>
          <div className="features-grid">
            <div className="feature-item">
              <CheckCircle size={24} className="feature-icon" />
              <h3>Detailed Lesson Plans</h3>
              <p>Step-by-step guides for each lesson with learning objectives, materials needed, and assessment criteria.</p>
            </div>
            <div className="feature-item">
              <CheckCircle size={24} className="feature-icon" />
              <h3>Printable Resources</h3>
              <p>Activity sheets, worksheets, certificates, and visual aids to support learning and engagement.</p>
            </div>
            <div className="feature-item">
              <CheckCircle size={24} className="feature-icon" />
              <h3>Assessment Tools</h3>
              <p>Quizzes, reflection activities, and progress tracking to measure learning outcomes.</p>
            </div>
            <div className="feature-item">
              <CheckCircle size={24} className="feature-icon" />
              <h3>Parent Resources</h3>
              <p>Discussion guides and take-home activities to extend learning beyond the classroom.</p>
            </div>
            <div className="feature-item">
              <CheckCircle size={24} className="feature-icon" />
              <h3>Digital Materials</h3>
              <p>Interactive stories, online activities, and digital tools to enhance the learning experience.</p>
            </div>
            <div className="feature-item">
              <CheckCircle size={24} className="feature-icon" />
              <h3>Support Resources</h3>
              <p>Implementation guides, troubleshooting tips, and access to our educator community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Implement Privacy Panda?</h2>
            <p>Choose your implementation model and start teaching digital privacy today.</p>
            <div className="cta-buttons">
              <Link to="/get-started" className="button primary">
                Start Implementation
              </Link>
              <Link to="/contact" className="button secondary" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white' }}>
                Contact Us for Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ImplementationPage;
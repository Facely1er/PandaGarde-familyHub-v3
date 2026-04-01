import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield as Child, User, UserCheck, BookOpen, Palette, Puzzle, Shield, Globe, Smartphone, Wrench, Scale, ArrowRight, Users } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const ageGroups = [
  {
    id: '5-8',
    label: 'Ages 5-8',
    icon: Child,
    description: 'Our resources for younger children focus on basic concepts through colorful activities and simple stories:',
    resources: [
      {
        icon: BookOpen,
        title: "Beginner's Privacy Activity Book",
        description: "Colorful activities that introduce privacy concepts with fun characters and simple exercises. Features Privacy Panda guiding children through basic online safety.",
        link: '/activity-book'
      },
      {
        icon: Palette,
        title: "Privacy Panda Tales",
        description: "Illustrated stories that teach privacy lessons through Panda's adventures in the Digital Bamboo Forest. Age-appropriate language and concepts.",
        link: '/privacy-panda'
      }
    ]
  },
  {
    id: '9-12',
    label: 'Ages 9-12',
    icon: User,
    description: 'Our resources for older children include more advanced concepts and interactive challenges:',
    resources: [
      {
        icon: Puzzle,
        title: "Digital Privacy Challenge",
        description: "Interactive puzzles, quizzes and games that help tweens understand social media privacy, digital footprints, and online safety concepts.",
        link: '/privacy-explorers'
      },
      {
        icon: Shield,
        title: "Privacy Protector's Guide",
        description: "Hands-on projects and practical guides that teach tweens how to protect personal information and navigate online spaces safely.",
        link: '/privacy-handbook'
      },
      {
        icon: Globe,
        title: "Digital Citizenship Academy",
        description: "Interactive modules that teach tweens about responsible online behavior, critical thinking, and evaluating digital information.",
        link: '/digital-citizenship'
      }
    ]
  },
  {
    id: '13-17',
    label: 'Ages 13-17',
    icon: UserCheck,
    description: 'Advanced privacy education for teenagers focusing on real-world applications and digital rights:',
    resources: [
      {
        icon: Smartphone,
        title: "Teen Privacy Handbook",
        description: "Comprehensive guide covering social media privacy, data rights, online reputation management, and advanced security concepts for teenagers.",
        link: '/teen-handbook'
      },
      {
        icon: Wrench,
        title: "Privacy Tools Workshop",
        description: "Hands-on tutorials for setting up VPNs, password managers, encrypted messaging, and other real privacy tools that teens can use.",
        link: '/privacy-tools'
      },
      {
        icon: Scale,
        title: "Digital Rights & Law",
        description: "Understanding privacy legislation, digital rights, data protection laws, and how they affect teenagers in the digital world.",
        link: '/digital-rights'
      }
    ]
  }
];

const AgeGroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('5-8');

  const handleTabClick = (ageId: string) => {
    setActiveTab(ageId);
  };

  const handleCardClick = (link: string) => {
    navigate(link);
  };

  return (
    <PageLayout
      title="Age-Appropriate Learning Paths"
      subtitle="Tailored content and interactions designed specifically for different developmental stages. Each age group has unique learning needs and capabilities when it comes to understanding digital privacy."
      icon={Users}
      badge="LEARNING PATHS"
      breadcrumbs={true}
    >

      <section className="age-group-section">
        <div className="container">
          <div className="age-group-tabs">
            {ageGroups.map((group) => (
              <button
                key={group.id}
                className={`age-tab ${activeTab === group.id ? 'active' : ''}`}
                data-age={group.id}
                onClick={() => handleTabClick(group.id)}
              >
                {group.label}
              </button>
            ))}
          </div>

          <div className="age-group-content">
            {ageGroups.map((group) => (
              <div
                key={group.id}
                className={`age-content ${activeTab === group.id ? 'active' : ''}`}
                id={`age-${group.id}`}
              >
                <div className="age-group-header">
                  <group.icon size={48} className="age-group-icon" />
                  <h2>{group.label}</h2>
                  <p>{group.description}</p>
                </div>
                
                <div className="featured-grid" role="list">
                  {group.resources.map((resource, index) => (
                    <article 
                      key={index} 
                      className="feature-card"
                      role="listitem"
                    >
                      <button
                        className="feature-card-button"
                        onClick={() => handleCardClick(resource.link)}
                        aria-label={`${resource.title}: ${resource.description.substring(0, 100)}...`}
                      >
                        <div className="card-image" aria-hidden="true">
                          <resource.icon size={80} />
                        </div>
                        <div className="card-content">
                          <h3><resource.icon size={20} aria-hidden="true" /> {resource.title}</h3>
                          <p>{resource.description}</p>
                          <div className="card-link" aria-hidden="true">
                            {resource.title.includes('Explore') ? 'Explore' : 
                             resource.title.includes('Start') ? 'Start' : 
                             resource.title.includes('Enter') ? 'Enter' : 
                             resource.title.includes('Read') ? 'Read' : 
                             resource.title.includes('Access') ? 'Access' : 'Learn More'}
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Learning?</h2>
            <p>Choose your age group above to begin your privacy education journey with Privacy Panda.</p>
            <div className="cta-buttons">
              <button 
                className="button primary"
                onClick={() => navigate('/activity-book')}
              >
                Start with Activity Book
              </button>
              <button 
                className="button secondary"
                onClick={() => navigate('/privacy-panda')}
              >
                Read Privacy Panda Tales
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AgeGroupsPage;
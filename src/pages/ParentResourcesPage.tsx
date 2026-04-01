import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, FileText, Shield, Download, Users, Award, Eye, Heart, Brain, BookOpen } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const ParentResourcesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('comprehensive-guides');

  const openResourceTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <PageLayout
      title="Parent & Educator Resources"
      subtitle="Comprehensive tools, guides, and materials to help adults facilitate privacy education for children."
      icon={BookOpen}
      badge="RESOURCES"
      breadcrumbs={true}
    >
      <section className="resources-section">
        <div className="container">
          <div className="resources-tabs">
            <div
              className={`resource-tab ${activeTab === 'comprehensive-guides' ? 'active' : ''}`}
              onClick={() => openResourceTab('comprehensive-guides')}
            >
              <BookOpen size={16} />
              Comprehensive Guides
            </div>
            <div
              className={`resource-tab ${activeTab === 'discussion-guides' ? 'active' : ''}`}
              onClick={() => openResourceTab('discussion-guides')}
            >
              <MessageCircle size={16} />
              Discussion Guides
            </div>
            <div
              className={`resource-tab ${activeTab === 'printable-resources' ? 'active' : ''}`}
              onClick={() => openResourceTab('printable-resources')}
            >
              <FileText size={16} />
              Printable Resources
            </div>
            <div
              className={`resource-tab ${activeTab === 'digital-safety' ? 'active' : ''}`}
              onClick={() => openResourceTab('digital-safety')}
            >
              <Shield size={16} />
              Digital Safety Tips
            </div>
            <div
              className={`resource-tab ${activeTab === 'activities-tools' ? 'active' : ''}`}
              onClick={() => openResourceTab('activities-tools')}
            >
              <Users size={16} />
              Activities & Tools
            </div>
          </div>

          {/* Comprehensive Guides Tab */}
          <div className={`resource-content ${activeTab === 'comprehensive-guides' ? 'active' : ''}`}>
            <h2>Comprehensive Privacy Education Guides</h2>
            <p>In-depth guides covering all aspects of digital privacy education for families and educators. These comprehensive resources provide everything you need to teach children about online safety.</p>

            <div className="resource-grid">
              <div className="resource-card">
                <div className="flex items-center gap-3 mb-3">
                  <Heart size={20} className="text-red-500" />
                  <h3>Complete Family Privacy Guide</h3>
                </div>
                <p>Everything parents need to know about teaching digital privacy to children of all ages. Includes age-specific strategies, conversation starters, and practical implementation tips.</p>
                <div className="flex items-center gap-4 mt-4">
                  <Link to="/guides/family-privacy" className="button">
                    <Download size={16} />
                    View Guide
                  </Link>
                  <span className="text-sm text-green-600 font-medium">Available Now</span>
                </div>
              </div>

              <div className="resource-card">
                <div className="flex items-center gap-3 mb-3">
                  <Brain size={20} className="text-purple-500" />
                  <h3>Educator's Privacy Toolkit</h3>
                </div>
                <p>Comprehensive resources for teachers and educators, including curriculum guides, lesson plans, assessment tools, and professional development materials.</p>
                <div className="flex items-center gap-4 mt-4">
                  <Link to="/educator-tools" className="button">
                    <Download size={16} />
                    View Toolkit
                  </Link>
                  <span className="text-sm text-gray-500">Available Now</span>
                </div>
              </div>

              <div className="resource-card">
                <div className="flex items-center gap-3 mb-3">
                  <Shield size={20} className="text-green-500" />
                  <h3>Digital Safety Emergency Guide</h3>
                </div>
                <p>Step-by-step instructions for handling privacy breaches, cyberbullying, and other digital safety emergencies. Includes legal considerations and recovery strategies.</p>
                <div className="flex items-center gap-4 mt-4">
                  <Link to="/guides/emergency-safety" className="button">
                    <Download size={16} />
                    View Guide
                  </Link>
                  <span className="text-sm text-green-600 font-medium">Available Now</span>
                </div>
              </div>

              <div className="resource-card">
                <div className="flex items-center gap-3 mb-3">
                  <Users size={20} className="text-blue-500" />
                  <h3>Age-Specific Privacy Guides</h3>
                </div>
                <p>Tailored guides for different age groups (5-8, 9-12, 13-17), covering developmentally appropriate concepts and teaching strategies for each stage.</p>
                <div className="flex items-center gap-4 mt-4">
                  <Link to="/guides/age-specific" className="button">
                    <Download size={16} />
                    View Guide
                  </Link>
                  <span className="text-sm text-green-600 font-medium">Available Now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Discussion Guides Tab */}
          <div className={`resource-content ${activeTab === 'discussion-guides' ? 'active' : ''}`}>
            <h2>Discussion Guides for Parents & Educators</h2>
            <p>These discussion guides are designed to help you have meaningful conversations about digital privacy with children. Each guide includes age-appropriate language, example scenarios, and follow-up questions.</p>

            <div className="discussion-guide">
              <h3>How to Talk About Personal Information</h3>
              <p>A guide to helping children understand what personal information is and why it's important to protect it.</p>
              <ul>
                <li><strong>Start with examples:</strong> "Personal information is like your special bamboo - it belongs just to you! This includes your full name, home address, phone number, and birthday."</li>
                <li><strong>Use the playground analogy:</strong> "Would you tell a stranger at the playground where you live? The internet is like a big playground with lots of people we don't know."</li>
                <li><strong>Follow-up questions:</strong> "What kind of information do you think is okay to share online? What information should we keep private?"</li>
              </ul>
            </div>

            <div className="discussion-guide">
              <h3>Password Safety Conversations</h3>
              <p>Help children understand the importance of strong passwords and keeping them secret.</p>
              <ul>
                <li><strong>Explain with a door lock analogy:</strong> "Passwords are like special keys to your digital home. Just like we don't give house keys to strangers, we don't share our passwords."</li>
                <li><strong>Practice creating strong passwords:</strong> "Let's make up a special code that would be hard for someone else to guess!"</li>
                <li><strong>Follow-up questions:</strong> "Why do we need different passwords for different places? Who is it okay to share your password with?"</li>
              </ul>
            </div>

            <div className="discussion-guide">
              <h3>Digital Footprint Awareness</h3>
              <p>Teaching children about their digital footprint and how their online actions create a permanent record.</p>
              <ul>
                <li><strong>Use the footprint metaphor:</strong> "Every time you do something online, it's like leaving a footprint in the sand. Even if you try to erase it, there might still be a mark."</li>
                <li><strong>Discuss permanence:</strong> "Once something is posted online, it can be shared, saved, and seen by many people, even if you delete it later."</li>
                <li><strong>Follow-up questions:</strong> "What kind of footprint do you want to leave online? How can we make sure our digital footprint shows our best self?"</li>
              </ul>
            </div>
          </div>

          {/* Printable Resources Tab */}
          <div className={`resource-content ${activeTab === 'printable-resources' ? 'active' : ''}`}>
            <h2>Printable Resources</h2>
            <p>A collection of printable materials to support privacy education at home or in the classroom.</p>

            <div className="resource-grid">
              <div className="resource-card">
                <h3>Privacy Panda Coloring Sheets</h3>
                <p>A set of 10 coloring pages featuring Privacy Panda and friends learning about online safety. Each page includes a simple privacy tip.</p>
                <Link
                  to="/downloads/coloring-sheets"
                  className="button"
                >
                  View & Download
                </Link>
              </div>

              <div className="resource-card">
                <h3>Digital Safety Posters</h3>
                <p>Classroom-ready posters highlighting key privacy concepts. Print and display these colorful reminders about password safety and personal information.</p>
                <Link
                  to="/downloads/safety-posters"
                  className="button"
                >
                  View & Download
                </Link>
              </div>

              <div className="resource-card">
                <h3>Privacy Panda Certificate</h3>
                <p>Celebrate learning with these printable certificates to award children after they complete privacy education activities.</p>
                <Link
                  to="/downloads/certificates"
                  className="button"
                >
                  View & Download
                </Link>
              </div>

              <div className="resource-card">
                <h3>Family Internet Agreement</h3>
                <p>A customizable document to help families establish guidelines for internet use, with child-friendly language and signature spaces.</p>
                <Link
                  to="/downloads/family-agreement"
                  className="button"
                >
                  View & Download
                </Link>
              </div>
            </div>
          </div>

          {/* Digital Safety Tips Tab */}
          <div className={`resource-content ${activeTab === 'digital-safety' ? 'active' : ''}`}>
            <h2>Digital Safety Tips for Families</h2>
            <p>Expert advice to help parents and caregivers create a safe digital environment for children.</p>

            <div className="resource-grid">
              <div className="resource-card">
                <h3>Setting Up Child-Friendly Devices</h3>
                <p>Learn how to configure tablets, smartphones, and computers with appropriate controls and settings for young children.</p>
                <Link to="/guides/device-setup" className="button">Read More</Link>
              </div>

              <div className="resource-card">
                <h3>Choosing Child-Safe Apps and Games</h3>
                <p>What to look for when selecting digital content for children. Learn about privacy ratings and app permissions.</p>
                <Link to="/guides/app-selection" className="button">Read More</Link>
              </div>

              <div className="resource-card">
                <h3>Modeling Good Digital Citizenship</h3>
                <p>Tips for parents on how to demonstrate healthy online behavior. Children learn by watching adults.</p>
                <Link to="/guides/modeling-behavior" className="button">Read More</Link>
              </div>

              <div className="resource-card">
                <h3>Responding to Privacy Concerns</h3>
                <p>What to do if you encounter privacy issues or if your child accidentally shares sensitive information online.</p>
                <Link to="/guides/privacy-concerns" className="button">Read More</Link>
              </div>
            </div>
          </div>

          {/* Activities & Tools Tab */}
          <div className={`resource-content ${activeTab === 'activities-tools' ? 'active' : ''}`}>
            <h2>Interactive Activities & Practical Tools</h2>
            <p>Hands-on activities, games, and practical tools to make privacy education engaging and effective for children of all ages.</p>

            <div className="resource-grid">
              <div className="resource-card">
                <div className="flex items-center gap-3 mb-3">
                  <Users size={20} className="text-green-500" />
                  <h3>Privacy Learning Activities Kit</h3>
                </div>
                <p>20 hands-on activities including games, crafts, role-playing scenarios, and interactive exercises to teach privacy concepts through play.</p>
                <div className="flex items-center gap-4 mt-4">
                  <Link to="/activities/privacy-learning-kit" className="button">
                    <Download size={16} />
                    View Activities
                  </Link>
                  <span className="text-sm text-green-600 font-medium">Available Now</span>
                </div>
              </div>

              <div className="resource-card">
                <div className="flex items-center gap-3 mb-3">
                  <FileText size={20} className="text-blue-500" />
                  <h3>Family Privacy Agreement Template</h3>
                </div>
                <p>Customizable template for creating family rules about digital privacy, device usage, and online behavior. Includes child-friendly language and signature spaces.</p>
                <div className="flex items-center gap-4 mt-4">
                  <Link to="/downloads/family-agreement" className="button">
                    <Download size={16} />
                    View Template
                  </Link>
                  <span className="text-sm text-gray-500">Available Now</span>
                </div>
              </div>

              <div className="resource-card">
                <div className="flex items-center gap-3 mb-3">
                  <Award size={20} className="text-yellow-500" />
                  <h3>Privacy Achievement Certificates</h3>
                </div>
                <p>Printable certificates and badges to celebrate children's privacy learning milestones. Includes Privacy Panda certificates, Digital Citizen awards, and more.</p>
                <div className="flex items-center gap-4 mt-4">
                  <Link to="/downloads/certificates" className="button">
                    <Download size={16} />
                    Generate Certificates
                  </Link>
                  <span className="text-sm text-gray-500">All Ages</span>
                </div>
              </div>

              <div className="resource-card">
                <div className="flex items-center gap-3 mb-3">
                  <Eye size={20} className="text-purple-500" />
                  <h3>Privacy Education Posters</h3>
                </div>
                <p>Set of 12 colorful posters featuring key privacy concepts, safety rules, and reminders. Perfect for home or classroom display.</p>
                <div className="flex items-center gap-4 mt-4">
                  <Link to="/downloads/safety-posters" className="button">
                    <Download size={16} />
                    View Posters
                  </Link>
                  <span className="text-sm text-gray-500">Available Now</span>
                </div>
              </div>

              <div className="resource-card">
                <div className="flex items-center gap-3 mb-3">
                  <FileText size={20} className="text-orange-500" />
                  <h3>Privacy Learning Worksheets</h3>
                </div>
                <p>Educational worksheets and activity sheets for reinforcing privacy concepts through writing, drawing, and reflection exercises.</p>
                <div className="flex items-center gap-4 mt-4">
                  <Link to="/downloads/worksheets" className="button">
                    <Download size={16} />
                    View Worksheets
                  </Link>
                  <span className="text-sm text-green-600 font-medium">Available Now</span>
                </div>
              </div>

              <div className="resource-card">
                <div className="flex items-center gap-3 mb-3">
                  <Shield size={20} className="text-red-500" />
                  <h3>Device Setup Checklists</h3>
                </div>
                <p>Step-by-step checklists for configuring child-safe settings on phones, tablets, computers, and gaming devices. Includes all major platforms.</p>
                <div className="flex items-center gap-4 mt-4">
                  <Link to="/guides/device-setup" className="button">
                    <Download size={16} />
                    View Checklists
                  </Link>
                  <span className="text-sm text-gray-500">Available Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Need More Help?</h2>
            <p>Our team is here to support you in implementing privacy education for your family or classroom.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="button primary">
                Contact Our Team
              </Link>
              <Link to="/faq" className="button secondary" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white' }}>
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ParentResourcesPage;
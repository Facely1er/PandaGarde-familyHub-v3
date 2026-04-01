import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield, BookOpen, Download, CheckCircle, Scale, ExternalLink } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { PRIVACY_PORTAL_URL } from '../../config/portal';
import './FamilyPrivacyGuidePage.css';

const FamilyPrivacyGuidePage: React.FC = () => {
  return (
    <PageLayout
      title="Complete Family Privacy Guide"
      subtitle="Everything parents need to know about teaching digital privacy to children of all ages. Includes age-specific strategies, conversation starters, and practical implementation tips."
      icon={Heart}
      badge="FAMILY GUIDE"
      breadcrumbs={true}
    >
      <div className="family-guide-container">
          
        {/* Introduction */}
        <section className="family-guide-section">
          <h2 className="family-guide-h2">
            Why Digital Privacy Education Matters
          </h2>
          <p className="family-guide-p">
            In today's digital world, children are growing up with technology as a natural part of their lives. 
            Teaching them about digital privacy from an early age helps them develop healthy online habits and 
            protects them from potential risks.
          </p>
          <div className="family-guide-callout">
            <h3>
              Key Benefits of Early Privacy Education
            </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Builds critical thinking skills about online information sharing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Creates a foundation for responsible digital citizenship</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Reduces risk of cyberbullying and online exploitation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Empowers children to make informed decisions about their digital footprint</span>
                </li>
              </ul>
            </div>
          </section>

        {/* Age-Specific Strategies */}
        <section className="family-guide-section">
            <h2 className="family-guide-primary text-3xl font-bold mb-8">
              Age-Specific Teaching Strategies
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ages 5-8 */}
              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold family-guide-primary">Ages 5-8</h3>
                </div>
                <h4 className="font-semibold mb-3 family-guide-primary">Basic Concepts</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Personal information is like a secret - only share with trusted adults</li>
                  <li>• The internet is like a big playground - stay where adults can see you</li>
                  <li>• If something online makes you feel uncomfortable, tell an adult</li>
                  <li>• Never share your name, address, or school with strangers</li>
                </ul>
                <h4 className="font-semibold mb-3 mt-4 family-guide-primary">Activities</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Privacy Panda coloring activities</li>
                  <li>• "Safe or Unsafe" sorting games</li>
                  <li>• Role-playing scenarios</li>
                </ul>
              </div>

              {/* Ages 9-12 */}
              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold family-guide-primary">Ages 9-12</h3>
                </div>
                <h4 className="font-semibold mb-3 family-guide-primary">Intermediate Concepts</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Understanding digital footprints and permanence</li>
                  <li>• Password security and why it matters</li>
                  <li>• Recognizing phishing and suspicious content</li>
                  <li>• Privacy settings and how to use them</li>
                </ul>
                <h4 className="font-semibold mb-3 mt-4 family-guide-primary">Activities</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Password strength challenges</li>
                  <li>• Digital footprint mapping</li>
                  <li>• Privacy settings exploration</li>
                </ul>
              </div>

              {/* Ages 13-17 */}
              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen size={24} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold family-guide-primary">Ages 13-17</h3>
                </div>
                <h4 className="font-semibold mb-3 family-guide-primary">Advanced Concepts</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Data privacy and how companies collect information</li>
                  <li>• Social media privacy and reputation management</li>
                  <li>• Cybersecurity threats and protection strategies</li>
                  <li>• Digital rights and responsibilities</li>
                </ul>
                <h4 className="font-semibold mb-3 mt-4 family-guide-primary">Activities</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Privacy policy analysis</li>
                  <li>• Social media audit projects</li>
                  <li>• Cybersecurity simulations</li>
                </ul>
              </div>

              {/* All Ages */}
              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Heart size={24} className="text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold family-guide-primary">All Ages</h3>
                </div>
                <h4 className="font-semibold mb-3 family-guide-primary">Universal Principles</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Think before you share</li>
                  <li>• Treat others online with respect</li>
                  <li>• Ask for help when unsure</li>
                  <li>• Keep personal information private</li>
                </ul>
                <h4 className="font-semibold mb-3 mt-4 family-guide-primary">Family Activities</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Family internet agreement</li>
                  <li>• Regular privacy check-ins</li>
                  <li>• Device-free time together</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Conversation Starters */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 family-guide-primary">
              Conversation Starters by Topic
            </h2>
            
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <h3 className="text-xl font-bold mb-4 family-guide-primary">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 family-guide-primary">For Younger Children (5-8):</h4>
                    <p className="text-sm family-guide-muted">
                      "What information about yourself would you tell a stranger at the playground? 
                      The internet is like a big playground with lots of people we don't know."
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 family-guide-primary">For Older Children (9-17):</h4>
                    <p className="text-sm family-guide-muted">
                      "If you had to choose between sharing your location with a friend or keeping it private, 
                      what would you do? Why? Let's talk about the pros and cons of each choice."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <h3 className="text-xl font-bold mb-4 family-guide-primary">Password Security</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 family-guide-primary">For All Ages:</h4>
                    <p className="text-sm family-guide-muted">
                      "If your password was like a key to your house, would you give copies to all your friends? 
                      Let's create a strong password together and talk about why we keep passwords secret."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <h3 className="text-xl font-bold mb-4 family-guide-primary">Digital Footprint</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 family-guide-primary">For Teens (13-17):</h4>
                    <p className="text-sm family-guide-muted">
                      "Imagine everything you post online is like writing in permanent marker on a public wall. 
                      How would that change what you choose to share? Let's look at your social media profiles together."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Implementation Tips */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 family-guide-primary">
              Practical Implementation Tips
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <h3 className="text-xl font-bold mb-4 family-guide-primary">Start Early and Be Consistent</h3>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Introduce privacy concepts as soon as children start using devices</li>
                  <li>• Use age-appropriate language and examples</li>
                  <li>• Make privacy education a regular part of family conversations</li>
                  <li>• Lead by example with your own online behavior</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <h3 className="text-xl font-bold mb-4 family-guide-primary">Create a Safe Learning Environment</h3>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Use devices in common areas where you can supervise</li>
                  <li>• Set up parental controls appropriate for your child's age</li>
                  <li>• Encourage questions and open communication</li>
                  <li>• Celebrate good privacy practices</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <h3 className="text-xl font-bold mb-4 family-guide-primary">Use Real-World Examples</h3>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Discuss news stories about privacy and cybersecurity</li>
                  <li>• Share your own experiences with online privacy</li>
                  <li>• Use current events to start conversations</li>
                  <li>• Point out privacy settings in apps and websites</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <h3 className="text-xl font-bold mb-4 family-guide-primary">Make It Interactive and Fun</h3>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Use games and activities to teach concepts</li>
                  <li>• Create family challenges around privacy practices</li>
                  <li>• Use the Privacy Panda activities and stories</li>
                  <li>• Celebrate milestones and achievements</li>
                </ul>
              </div>
            </div>
          </section>

          {/* MODPA Rights for Maryland Families */}
          <section className="mb-16">
            <div className="rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-8 family-guide-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
                  <Scale size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold family-guide-primary">Maryland Families: Your MODPA Rights</h2>
                  <p className="text-sm text-teal-700">Maryland Online Data Privacy Act — now in effect</p>
                </div>
              </div>

              <p className="text-sm family-guide-muted mb-6 leading-relaxed">
                If you live in Maryland, the MODPA gives your family legal tools to take control of personal data held by apps, games, and EdTech platforms — not just one-time privacy tips. Here's how to act in three steps.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mb-3 text-teal-700 font-bold text-sm">1</div>
                  <h3 className="font-bold mb-2 family-guide-primary text-base">Know what's collected</h3>
                  <p className="text-xs family-guide-muted leading-relaxed">
                    Send an <strong>access request</strong> to any app or service your child uses. They must tell you what personal data they hold and how it's used. You can also ask for a portable copy.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mb-3 text-teal-700 font-bold text-sm">2</div>
                  <h3 className="font-bold mb-2 family-guide-primary text-base">Delete or correct it</h3>
                  <p className="text-xs family-guide-muted leading-relaxed">
                    Submit a <strong>deletion request</strong> to remove your child's data from any qualifying service. If data is inaccurate (wrong age, location, etc.) a <strong>correction request</strong> applies instead.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mb-3 text-teal-700 font-bold text-sm">3</div>
                  <h3 className="font-bold mb-2 family-guide-primary text-base">Opt out of sale and ads</h3>
                  <p className="text-xs family-guide-muted leading-relaxed">
                    Many free apps generate revenue by selling user data or showing targeted ads. Use MODPA's <strong>opt-out right</strong> — services must comply within 15 days. If your school uses EduSoluce, submit via their privacy portal.
                  </p>
                </div>
              </div>

              <div className="bg-teal-100 rounded-xl p-4 mb-4">
                <h4 className="font-bold text-teal-900 mb-1 text-sm">Conversation starter for teens</h4>
                <p className="text-xs text-teal-800 leading-relaxed">
                  "Did you know you have a legal right to ask TikTok, Roblox, or any app: 'What do you know about me?' — and they have to answer? That's what MODPA means for us as a Maryland family."
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/digital-rights"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Scale size={16} />
                  Full MODPA guide and module
                </Link>
                <a
                  href={PRIVACY_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-teal-800 border-2 border-teal-300 hover:bg-teal-50 text-sm font-semibold rounded-lg transition-colors"
                >
                  <ExternalLink size={16} />
                  Submit a request via Privacy Portal
                </a>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 family-guide-primary">
              Additional Resources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/downloads/family-agreement"
                className="family-guide-card bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Download size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 family-guide-primary">
                  Family Internet Agreement
                </h3>
                <p className="text-sm family-guide-muted">
                  Customizable template for family rules
                </p>
              </Link>

              <Link
                to="/activities/privacy-learning-kit"
                className="family-guide-card bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <BookOpen size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 family-guide-primary">
                  Learning Activities Kit
                </h3>
                <p className="text-sm family-guide-muted">
                  Hands-on activities for all ages
                </p>
              </Link>

              <Link
                to="/guides/age-specific"
                className="family-guide-card bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Users size={24} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 family-guide-primary">
                  Age-Specific Guides
                </h3>
                <p className="text-sm family-guide-muted">
                  Detailed guides for each age group
                </p>
              </Link>
            </div>
          </section>

        {/* Call to Action */}
        <div className="family-guide-cta">
          <h2>
            Ready to Start Your Family's Privacy Journey?
          </h2>
          <p className="family-guide-cta-p">
            Download our family agreement template and start having meaningful conversations about digital privacy today.
          </p>
          <div className="family-guide-cta-links">
            <Link to="/downloads/family-agreement" className="family-guide-cta-btn-primary inline-flex items-center gap-2">
              Download Family Agreement
            </Link>
            <Link to="/resources" className="family-guide-cta-btn-outline inline-flex items-center gap-2">
              Explore More Resources
            </Link>
          </div>
          <p className="family-guide-cta-footer">
            Maryland residents (MODPA):{' '}
            <a href={PRIVACY_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
              <Scale size={14} />
              Exercise your privacy rights
            </a>
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default FamilyPrivacyGuidePage;
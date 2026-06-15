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
      subtitle="A step-by-step guide for talking about privacy with kids of any age. Pick where to start below."
      breadcrumbs={true}
    >
      <div className="family-guide-container">

        <section className="family-guide-section">
          <div className="rounded-xl border border-green-200 bg-green-50/80 p-6 dark:border-green-800 dark:bg-green-950/30 mb-8">
            <h2 className="family-guide-h2 text-xl mb-3">Where do you want to start?</h2>
            <p className="family-guide-p mb-4">
              You do not need to read this whole guide today. Pick one link and come back when you have time.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/family-privacy-plan" className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-green-800 dark:bg-green-600">
                Create your family plan
              </Link>
              <Link to="/stories" className="inline-flex items-center gap-2 rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-700 no-underline hover:bg-green-50 dark:border-green-500 dark:text-green-400">
                Read a story first (5 min)
              </Link>
              <a href="#age-strategies" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 no-underline hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">
                Jump to your child&apos;s age
              </a>
            </div>
          </div>
        </section>
          
        {/* Introduction */}
        <section className="family-guide-section">
          <h2 className="family-guide-h2">
            Why talk about privacy now?
          </h2>
          <p className="family-guide-p">
            Kids use apps, games, and school tools every day. You don&apos;t need a lecture—a short story or one family rule goes a long way.
            Start with the links above, or read on for age-by-age ideas.
          </p>
          <div className="family-guide-callout">
            <h3>
              What you get from a few minutes a week
            </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Kids learn what personal info is—and when not to share it</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>You have ready-made words for tricky online situations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Your family agrees on simple rules instead of guessing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>Children know they can tell you when something online feels wrong</span>
                </li>
              </ul>
            </div>
          </section>

        {/* Age-Specific Strategies */}
        <section className="family-guide-section" id="age-strategies">
            <h2 className="family-guide-primary text-3xl font-bold mb-2">
              Pick your child&apos;s age
            </h2>
            <p className="family-guide-p mb-8 text-sm">Tap a card that matches your child, then try the activity or story linked at the bottom of this page.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ages 5-8 */}
              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold family-guide-primary">Ages 5-8</h3>
                </div>
                <h4 className="font-semibold mb-3 family-guide-primary">What to teach</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Some things are private—like your address—and only trusted adults should know them</li>
                  <li>• The internet has strangers, just like a busy playground—stay where a grown-up can help</li>
                  <li>• If something online feels weird or scary, tell a parent right away</li>
                  <li>• Never give your full name, address, or school to someone you only know online</li>
                </ul>
                <h4 className="font-semibold mb-3 mt-4 family-guide-primary">Try this next</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• <Link to="/stories" className="text-green-700 underline dark:text-green-400">Read a Privacy Panda story</Link> (5 min)</li>
                  <li>• Print a coloring sheet from the activity book</li>
                  <li>• Open Family Hub and do one mission together</li>
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
                <h4 className="font-semibold mb-3 family-guide-primary">What to teach</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Posts and photos can stick around—even after you delete them</li>
                  <li>• Strong passwords and not reusing them keeps accounts safer</li>
                  <li>• Messages that rush you (“Click now!”) are often scams</li>
                  <li>• App permissions (camera, location) can be turned off in settings</li>
                </ul>
                <h4 className="font-semibold mb-3 mt-4 family-guide-primary">Try this next</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Review privacy settings on one app together</li>
                  <li>• <Link to="/privacy-explorers" className="text-green-700 underline dark:text-green-400">Try Privacy Explorers activities</Link></li>
                  <li>• List the apps your tween uses in the app catalog</li>
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
                <h4 className="font-semibold mb-3 family-guide-primary">What to teach</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• What they post today can show up in searches years from now</li>
                  <li>• Apps collect more data than most people realise—settings matter</li>
                  <li>• They can ask companies to delete or stop selling their data (varies by state)</li>
                  <li>• Two-factor authentication and a password manager are worth setting up</li>
                </ul>
                <h4 className="font-semibold mb-3 mt-4 family-guide-primary">Try this next</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• <Link to="/teen-handbook" className="text-green-700 underline dark:text-green-400">Open the Teen Privacy Handbook</Link></li>
                  <li>• Google their name together and talk about what is public</li>
                  <li>• Do a Family Hub mission matched to their age</li>
                </ul>
              </div>

              {/* All Ages */}
              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Heart size={24} className="text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold family-guide-primary">All ages</h3>
                </div>
                <h4 className="font-semibold mb-3 family-guide-primary">House rules that work</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Pause before you share—would you say this out loud at the dinner table?</li>
                  <li>• Be kind online, the same as in person</li>
                  <li>• Ask a parent when you are not sure</li>
                  <li>• Keep passwords and private details in the family only</li>
                </ul>
                <h4 className="font-semibold mb-3 mt-4 family-guide-primary">Try this next</h4>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• <Link to="/family-privacy-plan" className="text-green-700 underline dark:text-green-400">Create a family privacy plan</Link></li>
                  <li>• Print a <Link to="/downloads/family-agreement" className="text-green-700 underline dark:text-green-400">family agreement</Link> and sign it together</li>
                  <li>• Pick one night a month for a 10-minute privacy check-in</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Conversation Starters */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-2 family-guide-primary">
              Words you can use tonight
            </h2>
            <p className="family-guide-p mb-8 text-sm">Copy these questions into a conversation—no lecture required.</p>
            
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
            <h2 className="text-3xl font-bold mb-2 family-guide-primary">
              Simple habits that stick
            </h2>
            <p className="family-guide-p mb-8 text-sm">You do not need a perfect plan—pick one card and try it this week.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <h3 className="text-xl font-bold mb-4 family-guide-primary">Start early, keep it short</h3>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Five minutes beats a long talk—stories and missions count</li>
                  <li>• Use words your child already knows</li>
                  <li>• Bring it up when you are already online together</li>
                  <li>• Show good habits on your own phone too</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <h3 className="text-xl font-bold mb-4 family-guide-primary">Make it safe to ask questions</h3>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Keep devices in shared spaces when you can</li>
                  <li>• Turn on parental controls that fit their age</li>
                  <li>• Say “thank you for telling me” when they share a concern</li>
                  <li>• Celebrate when they pause before posting or sharing</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <h3 className="text-xl font-bold mb-4 family-guide-primary">Use real examples</h3>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Talk about an app your family actually uses</li>
                  <li>• Share a time you changed a privacy setting</li>
                  <li>• Point out a news story if it comes up naturally</li>
                  <li>• Walk through one app&apos;s settings together</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md family-guide-card">
                <h3 className="text-xl font-bold mb-4 family-guide-primary">Make it fun</h3>
                <ul className="space-y-2 text-sm family-guide-muted">
                  <li>• Read Privacy Panda together</li>
                  <li>• Do a Family Hub mission as a family challenge</li>
                  <li>• Print a certificate when they finish a story or mission</li>
                  <li>• Keep score of “green light” good choices for younger kids</li>
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
                If you live in Maryland, state law (MODPA) lets you ask apps what they know about your family, request deletion, and opt out of data sales. Three steps below—only if this applies to you.
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
                  Fill in together, print, and post on the fridge
                </p>
              </Link>

              <Link
                to="/classroom-activities"
                className="family-guide-card bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <BookOpen size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 family-guide-primary">
                  Learning Activities Kit
                </h3>
                <p className="text-sm family-guide-muted">
                  Printables and coloring sheets for ages 5–8
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
                  Conversation prompts matched to each age group
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
            <Link to="/for-families" className="family-guide-cta-btn-outline inline-flex items-center gap-2">
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
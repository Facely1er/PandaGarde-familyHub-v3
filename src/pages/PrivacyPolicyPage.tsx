import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Users, Mail } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { PRIVACY_PORTAL_URL } from '../config/portal';
import { ORIGIN_STORY_SLUG } from '../data/stories';

const policyCard =
  'rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800';
const sectionHeading =
  'mb-4 flex flex-wrap items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100 sm:mb-6 sm:gap-3 sm:text-2xl lg:text-3xl';
const bodyText = 'text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <PageLayout
      title="Privacy Policy"
      subtitle={`How we protect your privacy and data while providing educational content about digital safety. Last updated: ${new Date().toLocaleDateString()}`}
      breadcrumbs
    >
      <div className="mx-auto max-w-4xl">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="mb-8 rounded-r-lg border-l-4 border-green-500 bg-green-50 p-4 sm:p-6 dark:border-green-600 dark:bg-green-950/30">
            <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">Our Commitment to Privacy</h2>
            <p className={`m-0 ${bodyText}`}>
              At PandaGarde, we believe that privacy education should be taught through example. We are committed to
              protecting your privacy and the privacy of your children while providing valuable educational content
              about digital safety.
            </p>
          </div>

          <section className="mb-8">
            <h2 className={sectionHeading}>
              <Database size={28} className="shrink-0" aria-hidden="true" />
              Information We Collect
            </h2>

            <div className={`mb-6 ${policyCard}`}>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">Minimal Data Collection</h3>
              <p className={`mb-4 ${bodyText}`}>
                We collect the absolute minimum information necessary to provide our educational services:
              </p>
              <ul className={`list-disc space-y-2 pl-6 ${bodyText}`}>
                <li>
                  <strong>Progress Data:</strong> Activity completion status and scores (stored locally on your device)
                </li>
                <li>
                  <strong>Contact Information:</strong> Only when you voluntarily contact us through our contact form
                </li>
                <li>
                  <strong>Usage Analytics:</strong> Anonymous, aggregated data to improve our services
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4 sm:p-6 dark:border-red-800/50 dark:bg-red-950/30">
              <h3 className="mb-3 text-lg font-semibold text-red-800 dark:text-red-300">What We DON&apos;T Collect</h3>
              <ul className="list-disc space-y-1 pl-6 text-sm text-red-700 sm:text-base dark:text-red-300">
                <li>Personal information from children under 13</li>
                <li>Addresses, emails, or contact details of children</li>
                <li>Photos or videos of children</li>
                <li>Location data or device identifiers</li>
                <li>Browsing history or search queries</li>
              </ul>
              <p className="mt-3 text-sm text-red-700 dark:text-red-300">
                Note: Family Hub profiles use a first name (or nickname) and age to match missions. These stay in your
                browser&apos;s local storage on your device and are never transmitted to us.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className={sectionHeading}>
              <Eye size={28} className="shrink-0" aria-hidden="true" />
              How We Use Your Information
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <div className={policyCard}>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">Educational Purposes</h3>
                <ul className={`list-disc space-y-2 pl-6 ${bodyText}`}>
                  <li>Track learning progress and achievements</li>
                  <li>Provide personalized educational content</li>
                  <li>Generate completion certificates</li>
                  <li>Improve our educational materials</li>
                </ul>
              </div>

              <div className={policyCard}>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">Service Improvement</h3>
                <ul className={`list-disc space-y-2 pl-6 ${bodyText}`}>
                  <li>Analyze usage patterns (anonymized)</li>
                  <li>Fix bugs and technical issues</li>
                  <li>Develop new features and activities</li>
                  <li>Ensure platform security</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className={sectionHeading}>
              <Lock size={28} className="shrink-0" aria-hidden="true" />
              How We Protect Your Data
            </h2>

            <div className="mb-6 rounded-lg border border-green-300 bg-green-100 p-4 sm:p-6 dark:border-green-800 dark:bg-green-950/40">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">Local Storage First</h3>
              <p className={`m-0 ${bodyText} text-gray-800 dark:text-gray-200`}>
                All progress data is stored locally on your device using secure browser storage. This means your
                child&apos;s learning progress never leaves your device unless you choose to export it.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              {[
                {
                  icon: Lock,
                  tone: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
                  title: 'Encryption',
                  body: 'All data transmission uses HTTPS encryption',
                },
                {
                  icon: Shield,
                  tone: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300',
                  title: 'No Ad Tracking',
                  body: 'No advertising or cross-site tracking cookies — only anonymous, privacy-focused analytics (see our Cookie Policy)',
                },
                {
                  icon: Users,
                  tone: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300',
                  title: 'No Sharing',
                  body: 'We never share data with third parties',
                },
              ].map((item) => (
                <div key={item.title} className="p-4 text-center sm:p-6">
                  <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16 ${item.tone}`}
                  >
                    <item.icon size={28} aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100 sm:mb-6 sm:text-2xl lg:text-3xl">
              Children&apos;s Privacy (COPPA Compliance)
            </h2>

            <div className="mb-6 rounded-r-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 sm:p-6 dark:border-yellow-600 dark:bg-yellow-950/30">
              <h3 className="mb-3 text-lg font-semibold text-yellow-900 dark:text-yellow-200">
                Special Protections for Children Under 13
              </h3>
              <p className="mb-4 text-sm text-yellow-900 sm:text-base dark:text-yellow-200">
                PandaGarde is fully compliant with the Children&apos;s Online Privacy Protection Act (COPPA). We have
                implemented strict measures to protect children under 13 years of age.
              </p>
              <ul className="list-disc space-y-2 pl-6 text-sm text-yellow-900 sm:text-base dark:text-yellow-200">
                <li>
                  We do not knowingly collect personal information from children under 13 without verifiable parental
                  consent
                </li>
                <li>All educational content is designed to be safe and appropriate for children</li>
                <li>Parents can review and delete their child&apos;s progress data at any time</li>
                <li>We follow COPPA (Children&apos;s Online Privacy Protection Act) guidelines</li>
              </ul>
            </div>

            <div className={`mb-6 ${policyCard}`}>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">Parental Consent Process</h3>
              <p className={`mb-4 ${bodyText}`}>
                For children under 13, we require verifiable parental consent before collecting any personal information:
              </p>
              <ol className={`list-decimal space-y-3 pl-6 ${bodyText}`}>
                <li>
                  <strong>Age Verification:</strong> When a child indicates they are under 13, we immediately enable
                  &quot;zero-data mode&quot; which prevents all data collection, including analytics tracking.
                </li>
                <li>
                  <strong>Parental Consent Request:</strong> We request the parent&apos;s email address and send a
                  verification email with a unique consent token.
                </li>
                <li>
                  <strong>Email Verification:</strong> Parents must click the verification link in the email to provide
                  consent. This ensures we have verifiable parental consent as required by COPPA.
                </li>
                <li>
                  <strong>Consent Record:</strong> All consent records are encrypted and stored securely, including the
                  child&apos;s age, parent&apos;s email, consent date, and IP address for audit purposes.
                </li>
                <li>
                  <strong>Data Collection:</strong> Only after parental consent is verified do we allow data collection
                  for the child&apos;s account.
                </li>
              </ol>
            </div>

            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 sm:p-6 dark:border-blue-800/50 dark:bg-blue-950/30">
              <h3 className="mb-3 text-lg font-semibold text-blue-900 dark:text-blue-200">Zero-Data Mode</h3>
              <p className="mb-3 text-sm text-blue-900 sm:text-base dark:text-blue-200">
                When zero-data mode is active (for children under 13 without verified parental consent), we:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-sm text-blue-900 sm:text-base dark:text-blue-200">
                <li>Disable all analytics tracking and data collection</li>
                <li>Prevent storage of any personal information</li>
                <li>Allow access to educational content only</li>
                <li>Maintain strict privacy protections until consent is verified</li>
              </ul>
            </div>

            <div className={`mb-6 ${policyCard}`}>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">Parental Rights</h3>
              <p className={`mb-4 ${bodyText}`}>Parents have the following rights regarding their child&apos;s information:</p>
              <ul className={`list-disc space-y-2 pl-6 ${bodyText}`}>
                <li>
                  <strong>Review:</strong> Parents can request to review all personal information collected from their
                  child
                </li>
                <li>
                  <strong>Delete:</strong> Parents can request deletion of their child&apos;s personal information at any
                  time
                </li>
                <li>
                  <strong>Revoke Consent:</strong> Parents can revoke consent at any time, which will immediately delete
                  all collected data and re-enable zero-data mode
                </li>
                <li>
                  <strong>Refuse Collection:</strong> Parents can refuse to allow further collection or use of their
                  child&apos;s information
                </li>
                <li>
                  <strong>Contact:</strong> Parents can contact us at privacy@pandagarde.com with any questions or
                  concerns
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4 sm:p-6 dark:border-green-800/50 dark:bg-green-950/30">
              <h3 className="mb-3 text-lg font-semibold text-green-900 dark:text-green-200">
                What Information We Collect (With Consent)
              </h3>
              <p className="mb-3 text-sm text-green-900 sm:text-base dark:text-green-200">
                After receiving verifiable parental consent, we may collect:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-sm text-green-900 sm:text-base dark:text-green-200">
                <li>Child&apos;s age (for age-appropriate content)</li>
                <li>Progress data (activity completion, scores) — stored locally on device</li>
                <li>Parent&apos;s email address (for consent verification and communication)</li>
                <li>Consent token and verification status (encrypted)</li>
              </ul>
              <p className="mt-3 text-sm text-green-800 dark:text-green-300">
                <strong>Note:</strong> All personal information is encrypted before storage, and we never share this
                information with third parties.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100 sm:mb-6 sm:text-2xl lg:text-3xl">
              Your Rights and Choices
            </h2>

            <div className="space-y-4">
              <div className={policyCard}>
                <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">Access and Control</h3>
                <ul className={`list-disc space-y-2 pl-6 ${bodyText}`}>
                  <li>View all data we have about you or your child</li>
                  <li>Export your progress data for backup or transfer</li>
                  <li>Delete all data associated with your account</li>
                  <li>Opt out of any data collection (though this may limit functionality)</li>
                </ul>
              </div>
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 sm:p-6 dark:border-green-800 dark:bg-green-900/20">
                <h3 className="mb-3 text-lg font-semibold text-green-900 dark:text-green-100 sm:text-xl">
                  Maryland Residents (MODPA)
                </h3>
                <p className="mb-3 text-sm text-green-800 dark:text-green-200">
                  Under the Maryland Online Data Privacy Act (MODPA), Maryland residents have additional rights,
                  including the right to opt out of the sale of personal data and targeted advertising, and to request
                  access, correction, deletion, and portability of personal data. If your school or organization uses
                  the EduSoluce Privacy Portal, you may submit MODPA-related requests there.
                </p>
                <a
                  href={PRIVACY_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-green-700 hover:underline dark:text-green-300"
                >
                  EduSoluce Privacy Portal – exercise your rights
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className={sectionHeading}>
              <Mail size={28} className="shrink-0" aria-hidden="true" />
              Questions About Privacy?
            </h2>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 sm:p-6 dark:border-blue-800/50 dark:bg-blue-950/30">
              <p className="mb-4 text-sm text-blue-900 sm:text-base dark:text-blue-200">
                If you have any questions about this Privacy Policy or our data practices, please don&apos;t hesitate to
                contact us:
              </p>
              <div className="space-y-2 text-sm text-blue-900 sm:text-base dark:text-blue-200">
                <p>
                  <strong>Email:</strong> privacy@pandagarde.com
                </p>
                <p>
                  <strong>Contact Form:</strong>{' '}
                  <Link to="/contact" className="underline hover:no-underline">
                    Visit our contact page
                  </Link>
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100 sm:mb-6 sm:text-2xl lg:text-3xl">Policy Updates</h2>
            <p className={`mb-4 ${bodyText}`}>We may update this Privacy Policy from time to time. When we do, we will:</p>
            <ul className={`list-disc space-y-2 pl-6 ${bodyText}`}>
              <li>Post the updated policy on this page</li>
              <li>Update the &quot;Last updated&quot; date at the top</li>
              <li>Notify users of significant changes via email (if we have your contact information)</li>
              <li>Provide a summary of changes for easy review</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 rounded-xl bg-gradient-to-r from-green-600 to-green-700 p-6 text-center text-white sm:mt-16 sm:p-8">
          <h2 className="text-xl font-bold sm:text-2xl">Ready to start learning?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm opacity-90 sm:text-base">
            Now that you know how we protect your privacy, explore guides, stories, and Family Hub missions.
          </p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              to="/for-families"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-gray-100"
            >
              Guides &amp; stories
            </Link>
            <Link
              to={`/stories/${ORIGIN_STORY_SLUG}`}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-green-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-900"
            >
              Read our story
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyPolicyPage;

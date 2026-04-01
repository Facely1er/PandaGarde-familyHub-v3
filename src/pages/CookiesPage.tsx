import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Shield, Settings, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const CookiesPage: React.FC = () => {
  return (
    <PageLayout
      title="Cookie Policy"
      subtitle="Learn about how we use cookies and similar technologies to enhance your experience while protecting your privacy."
      icon={Cookie}
      badge="PRIVACY"
    >
      <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">

            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                What Are Cookies?
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                Cookies are small text files that are stored on your device when you visit a website. They help
                websites remember information about your visit, such as your preferences and settings, to make
                your next visit easier and more personalized.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg mb-6" style={{ backgroundColor: 'var(--light)' }}>
                <div className="flex items-start gap-3">
                  <Info size={24} className="text-blue-600 mt-1" style={{ color: 'var(--primary)' }} />
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      Our Privacy-First Approach
                    </h3>
                    <p style={{ color: 'var(--gray-600)' }}>
                      At PandaGarde, we believe in minimal data collection and maximum privacy protection.
                      We only use cookies that are essential for the functioning of our educational platform.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Types of Cookies */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Types of Cookies We Use
              </h2>

              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="bg-green-50 p-6 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={24} className="text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2 text-green-800">
                        Essential Cookies (Always Active)
                      </h3>
                      <p className="text-green-700 mb-3">
                        These cookies are necessary for the website to function properly and cannot be disabled.
                      </p>
                      <ul className="list-disc pl-6 text-green-700">
                        <li>Session management and security</li>
                        <li>User authentication and login status</li>
                        <li>Form data preservation (contact forms, etc.)</li>
                        <li>Basic website functionality</li>
                        <li>Progress tracking for educational activities</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="bg-blue-50 p-6 rounded-lg" style={{ backgroundColor: '#eff6ff' }}>
                  <div className="flex items-start gap-3">
                    <Settings size={24} className="text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2 text-blue-800">
                        Functional Cookies (Optional)
                      </h3>
                      <p className="text-blue-700 mb-3">
                        These cookies enhance your experience but are not essential for basic functionality.
                      </p>
                      <ul className="list-disc pl-6 text-blue-700">
                        <li>Theme preferences (light/dark mode)</li>
                        <li>Language settings</li>
                        <li>Accessibility preferences</li>
                        <li>Activity completion status</li>
                        <li>User interface customizations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-yellow-50 p-6 rounded-lg" style={{ backgroundColor: '#fffbeb' }}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={24} className="text-yellow-600 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2 text-yellow-800">
                        Analytics Cookies (Optional)
                      </h3>
                      <p className="text-yellow-700 mb-3">
                        We use privacy-focused analytics to understand how our educational content is being used,
                        without collecting personal information.
                      </p>
                      <ul className="list-disc pl-6 text-yellow-700">
                        <li>Anonymous usage statistics</li>
                        <li>Educational content effectiveness</li>
                        <li>Website performance monitoring</li>
                        <li>Error tracking and debugging</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Third-Party Services
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                We may use third-party services that set their own cookies. These services are carefully
                selected for their privacy-focused approach and educational value.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg" style={{ backgroundColor: 'var(--light)' }}>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                  Services We May Use:
                </h3>
                <ul className="list-disc pl-6" style={{ color: 'var(--gray-600)' }}>
                  <li><strong>Educational Content Delivery:</strong> Secure content delivery networks for educational materials</li>
                  <li><strong>Privacy-Focused Analytics:</strong> Anonymous usage analytics that don't track individuals</li>
                  <li><strong>Security Services:</strong> Protection against malicious attacks and spam</li>
                  <li><strong>Accessibility Tools:</strong> Services that help make our content accessible to all users</li>
                </ul>
              </div>
            </section>

            {/* Cookie Management */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Managing Your Cookie Preferences
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                You have control over which cookies you accept. Here's how you can manage your preferences:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                    Browser Settings
                  </h3>
                  <p className="mb-3" style={{ color: 'var(--gray-600)' }}>
                    Most browsers allow you to control cookies through their settings. You can:
                  </p>
                  <ul className="list-disc pl-6 text-sm" style={{ color: 'var(--gray-600)' }}>
                    <li>Block all cookies</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete existing cookies</li>
                    <li>Set up cookie notifications</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                    Our Cookie Banner
                  </h3>
                  <p className="mb-3" style={{ color: 'var(--gray-600)' }}>
                    When you first visit our site, you'll see a cookie banner where you can:
                  </p>
                  <ul className="list-disc pl-6 text-sm" style={{ color: 'var(--gray-600)' }}>
                    <li>Accept all cookies</li>
                    <li>Accept only essential cookies</li>
                    <li>Customize your preferences</li>
                    <li>Learn more about each type</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Special Considerations for Children
              </h2>
              <div className="bg-pink-50 p-6 rounded-lg mb-6" style={{ backgroundColor: '#fdf2f8' }}>
                <div className="flex items-start gap-3">
                  <Shield size={24} className="text-pink-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2 text-pink-800">
                      COPPA Compliance
                    </h3>
                    <p className="text-pink-700">
                      We are committed to protecting children's privacy and comply with the Children's Online
                      Privacy Protection Act (COPPA). We do not knowingly collect personal information from
                      children under 13 without parental consent.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                For children using our platform:
              </p>
              <ul className="list-disc pl-6 mb-6" style={{ color: 'var(--gray-600)' }}>
                <li>We only use essential cookies necessary for educational activities</li>
                <li>No tracking or advertising cookies are used for children's accounts</li>
                <li>Parents can review and control their child's cookie settings</li>
                <li>All data collection is minimal and education-focused</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Data Retention
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                We retain cookie data only as long as necessary for the purposes outlined in this policy:
              </p>
              <ul className="list-disc pl-6 mb-6" style={{ color: 'var(--gray-600)' }}>
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Deleted after 12 months maximum</li>
                <li><strong>Essential Cookies:</strong> Retained only for security and functionality purposes</li>
                <li><strong>Analytics Data:</strong> Anonymized and retained for up to 24 months</li>
              </ul>
            </section>

            {/* Updates to Policy */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Updates to This Policy
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                We may update this Cookie Policy from time to time to reflect changes in our practices or
                for other operational, legal, or regulatory reasons. We will notify you of any material
                changes by posting the updated policy on our website.
              </p>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                We encourage you to review this policy periodically to stay informed about how we use cookies.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Questions About Cookies?
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg" style={{ backgroundColor: 'var(--light)' }}>
                <p className="mb-2" style={{ color: 'var(--gray-600)' }}>
                  <strong>Email:</strong> privacy@pandagarde.com
                </p>
                <p className="mb-2" style={{ color: 'var(--gray-600)' }}>
                  <strong>Website:</strong>{' '}
                  <Link to="/contact" className="text-blue-600 hover:underline">
                    pandagarde.com/contact
                  </Link>
                </p>
                <p style={{ color: 'var(--gray-600)' }}>
                  <strong>Subject Line:</strong> Cookie Policy Inquiry
                </p>
              </div>
            </section>

            {/* Effective Date */}
            <section className="mb-12">
              <div className="bg-blue-50 p-6 rounded-lg text-center" style={{ backgroundColor: 'var(--light)' }}>
                <p className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>
                  This Cookie Policy is effective as of December 2024
                </p>
                <p className="text-sm mt-2" style={{ color: 'var(--gray-600)' }}>
                  Last updated: December 2024
                </p>
              </div>
            </section>

          </div>
        </div>
    </PageLayout>
  );
};

export default CookiesPage;
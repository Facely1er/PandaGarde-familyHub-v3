import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const TermsPage: React.FC = () => {
  return (
    <PageLayout
      title="Terms of Service"
      subtitle="Please read these terms carefully before using our digital privacy education platform. Last updated: December 2024"
      icon={FileText}
      badge="LEGAL"
    >
      <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">

            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Introduction
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                Welcome to PandaGarde, a digital privacy education platform designed to help families learn about
                online safety and digital citizenship together. These Terms of Service ("Terms") govern your use
                of our website, applications, and services (collectively, the "Service").
              </p>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any
                part of these terms, you may not access the Service.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Acceptance of Terms
              </h2>
              <div className="bg-blue-50 p-6 rounded-lg mb-6" style={{ backgroundColor: 'var(--light)' }}>
                <div className="flex items-start gap-3">
                  <CheckCircle size={24} className="text-blue-600 mt-1" style={{ color: 'var(--primary)' }} />
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      Agreement to Terms
                    </h3>
                    <p style={{ color: 'var(--gray-600)' }}>
                      By using PandaGarde, you confirm that you have read, understood, and agree to be bound by
                      these Terms and our Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Description of Service */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Description of Service
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                PandaGarde provides educational content, interactive activities, and resources focused on digital
                privacy and online safety for children and families. Our Service includes:
              </p>
              <ul className="list-disc pl-6 mb-6" style={{ color: 'var(--gray-600)' }}>
                <li>Interactive educational activities and games</li>
                <li>Age-appropriate privacy education content</li>
                <li>Family progress tracking and management tools</li>
                <li>Educational resources and guides for parents and educators</li>
                <li>Community features and support resources</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                User Accounts
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg" style={{ backgroundColor: 'var(--light)' }}>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                    Account Creation
                  </h3>
                  <p style={{ color: 'var(--gray-600)' }}>
                    You may be required to create an account to access certain features. You are responsible for
                    maintaining the confidentiality of your account information and for all activities that occur
                    under your account.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg" style={{ backgroundColor: 'var(--light)' }}>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                    Age Requirements
                  </h3>
                  <p style={{ color: 'var(--gray-600)' }}>
                    Our Service is designed for families with children ages 5-17. Users under 13 must have
                    parental consent and supervision. Parents are responsible for monitoring their children's
                    use of the Service.
                  </p>
                </div>
              </div>
            </section>

            {/* Acceptable Use */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Acceptable Use
              </h2>
              <div className="bg-red-50 p-6 rounded-lg mb-6" style={{ backgroundColor: '#fef2f2' }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={24} className="text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2 text-red-800">
                      Prohibited Activities
                    </h3>
                    <p className="text-red-700">
                      You agree not to use the Service for any unlawful purpose or in any way that could damage,
                      disable, overburden, or impair the Service.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                You agree not to:
              </p>
              <ul className="list-disc pl-6 mb-6" style={{ color: 'var(--gray-600)' }}>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Transmit harmful or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the Service for commercial purposes without permission</li>
                <li>Share inappropriate or harmful content</li>
                <li>Impersonate others or provide false information</li>
              </ul>
            </section>

            {/* Privacy and Data Protection */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Privacy and Data Protection
              </h2>
              <div className="bg-green-50 p-6 rounded-lg mb-6" style={{ backgroundColor: '#f0fdf4' }}>
                <div className="flex items-start gap-3">
                  <Shield size={24} className="text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2 text-green-800">
                      Privacy First Approach
                    </h3>
                    <p className="text-green-700">
                      We are committed to protecting your privacy and the privacy of children using our Service.
                      Our data practices are designed to minimize data collection and maximize privacy protection.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                Please review our Privacy Policy for detailed information about how we collect, use, and protect
                your information. We comply with applicable privacy laws including COPPA (Children's Online
                Privacy Protection Act).
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Intellectual Property
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                The Service and its original content, features, and functionality are owned by PandaGarde and are
                protected by international copyright, trademark, patent, trade secret, and other intellectual
                property laws.
              </p>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                You may not copy, modify, distribute, sell, or lease any part of our Service or included software,
                nor may you reverse engineer or attempt to extract the source code of that software.
              </p>
            </section>

            {/* Disclaimers */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Disclaimers
              </h2>
              <div className="bg-yellow-50 p-6 rounded-lg mb-6" style={{ backgroundColor: '#fffbeb' }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={24} className="text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2 text-yellow-800">
                      Educational Content Disclaimer
                    </h3>
                    <p className="text-yellow-700">
                      The educational content provided through our Service is for informational purposes only.
                      While we strive for accuracy, we make no guarantees about the completeness or accuracy of
                      the information provided.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                The Service is provided "as is" without warranties of any kind, either express or implied.
                We do not warrant that the Service will be uninterrupted, secure, or error-free.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Limitation of Liability
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                In no event shall PandaGarde, its directors, employees, partners, agents, suppliers, or affiliates
                be liable for any indirect, incidental, special, consequential, or punitive damages, including
                without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting
                from your use of the Service.
              </p>
            </section>

            {/* Termination */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Termination
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                We may terminate or suspend your account and access to the Service immediately, without prior
                notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                Upon termination, your right to use the Service will cease immediately. All provisions of the Terms
                which by their nature should survive termination shall survive termination.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Changes to Terms
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                If a revision is material, we will try to provide at least 30 days notice prior to any new terms
                taking effect.
              </p>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                By continuing to access or use our Service after those revisions become effective, you agree to
                be bound by the revised terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Contact Information
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg" style={{ backgroundColor: 'var(--light)' }}>
                <p className="mb-2" style={{ color: 'var(--gray-600)' }}>
                  <strong>Email:</strong> legal@pandagarde.com
                </p>
                <p className="mb-2" style={{ color: 'var(--gray-600)' }}>
                  <strong>Website:</strong>{' '}
                  <Link to="/contact" className="text-blue-600 hover:underline">
                    pandagarde.com/contact
                  </Link>
                </p>
                <p style={{ color: 'var(--gray-600)' }}>
                  <strong>Address:</strong> PandaGarde Legal Department, Privacy Education Center
                </p>
              </div>
            </section>

            {/* Effective Date */}
            <section className="mb-12">
              <div className="bg-blue-50 p-6 rounded-lg text-center" style={{ backgroundColor: 'var(--light)' }}>
                <p className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>
                  These Terms of Service are effective as of December 2024
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

export default TermsPage;
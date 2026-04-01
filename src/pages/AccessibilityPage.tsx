import React from 'react';
import { Accessibility, Eye, Ear, Hand, Brain, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const AccessibilityPage: React.FC = () => {
  return (
    <PageLayout
      title="Accessibility Statement"
      subtitle="We are committed to making digital privacy education accessible to all learners, regardless of ability or circumstance."
      icon={Accessibility}
      badge="ACCESSIBILITY"
    >
      <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">

            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Our Commitment to Accessibility
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                At PandaGarde, we believe that digital privacy education should be accessible to everyone.
                We are committed to ensuring that our platform, content, and activities are usable by people
                of all abilities, including those with visual, auditory, motor, and cognitive disabilities.
              </p>
              <div className="bg-green-50 p-6 rounded-lg mb-6" style={{ backgroundColor: '#f0fdf4' }}>
                <div className="flex items-start gap-3">
                  <CheckCircle size={24} className="text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2 text-green-800">
                      WCAG 2.1 AA Compliance
                    </h3>
                    <p className="text-green-700">
                      Our platform strives to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
                      standards, ensuring a more accessible experience for all users.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Accessibility Features */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Accessibility Features
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Accessibility */}
                <div className="bg-white p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Eye size={24} className="text-blue-600" style={{ color: 'var(--primary)' }} />
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--primary)' }}>
                      Visual Accessibility
                    </h3>
                  </div>
                  <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
                    <li>High contrast color schemes</li>
                    <li>Scalable text and interface elements</li>
                    <li>Alternative text for all images</li>
                    <li>Keyboard navigation support</li>
                    <li>Screen reader compatibility</li>
                    <li>Focus indicators for interactive elements</li>
                  </ul>
                </div>

                {/* Audio Accessibility */}
                <div className="bg-white p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Ear size={24} className="text-green-600" style={{ color: 'var(--primary)' }} />
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--primary)' }}>
                      Audio Accessibility
                    </h3>
                  </div>
                  <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
                    <li>Audio descriptions for visual content</li>
                    <li>Text alternatives for audio content</li>
                    <li>Volume controls and audio settings</li>
                    <li>Visual indicators for audio cues</li>
                    <li>Subtitles and captions for videos</li>
                    <li>Hearing-impaired friendly notifications</li>
                  </ul>
                </div>

                {/* Motor Accessibility */}
                <div className="bg-white p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Hand size={24} className="text-purple-600" style={{ color: 'var(--primary)' }} />
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--primary)' }}>
                      Motor Accessibility
                    </h3>
                  </div>
                  <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
                    <li>Large clickable areas for touch targets</li>
                    <li>Keyboard-only navigation support</li>
                    <li>Voice control compatibility</li>
                    <li>Adjustable interaction timeouts</li>
                    <li>Switch control support</li>
                    <li>One-handed operation options</li>
                  </ul>
                </div>

                {/* Cognitive Accessibility */}
                <div className="bg-white p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Brain size={24} className="text-orange-600" style={{ color: 'var(--primary)' }} />
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--primary)' }}>
                      Cognitive Accessibility
                    </h3>
                  </div>
                  <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
                    <li>Clear, simple language and instructions</li>
                    <li>Consistent navigation and layout</li>
                    <li>Progress indicators and feedback</li>
                    <li>Error prevention and recovery</li>
                    <li>Multiple learning pathways</li>
                    <li>Pause and resume functionality</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Educational Content Accessibility */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Educational Content Accessibility
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                Our educational activities and content are designed with accessibility in mind:
              </p>

              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg" style={{ backgroundColor: '#eff6ff' }}>
                  <h3 className="font-semibold mb-3 text-blue-800">
                    Interactive Activities
                  </h3>
                  <ul className="list-disc pl-6 text-blue-700">
                    <li>Multiple input methods (mouse, keyboard, touch, voice)</li>
                    <li>Audio instructions alongside visual cues</li>
                    <li>Adjustable difficulty levels and pacing</li>
                    <li>Alternative formats for complex activities</li>
                    <li>Progress saving and resuming capabilities</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
                  <h3 className="font-semibold mb-3 text-green-800">
                    Learning Materials
                  </h3>
                  <ul className="list-disc pl-6 text-green-700">
                    <li>Text-to-speech compatibility</li>
                    <li>High contrast and large print options</li>
                    <li>Simplified language versions available</li>
                    <li>Visual and audio learning aids</li>
                    <li>Multi-sensory learning approaches</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg" style={{ backgroundColor: '#faf5ff' }}>
                  <h3 className="font-semibold mb-3 text-purple-800">
                    Assessment and Progress Tracking
                  </h3>
                  <ul className="list-disc pl-6 text-purple-700">
                    <li>Flexible assessment formats</li>
                    <li>Multiple ways to demonstrate learning</li>
                    <li>Clear progress indicators and feedback</li>
                    <li>Accommodation options for different needs</li>
                    <li>Parent and educator accessibility tools</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Assistive Technology Support */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Assistive Technology Support
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                Our platform is designed to work with a wide range of assistive technologies:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md text-center" style={{ backgroundColor: 'var(--card-color)' }}>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                    Screen Readers
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                    Compatible with JAWS, NVDA, VoiceOver, and other screen reading software
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md text-center" style={{ backgroundColor: 'var(--card-color)' }}>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                    Voice Control
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                    Works with Dragon NaturallySpeaking, Voice Control, and other voice recognition software
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md text-center" style={{ backgroundColor: 'var(--card-color)' }}>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                    Switch Control
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                    Supports switch navigation and single-switch scanning for motor accessibility
                  </p>
                </div>
              </div>
            </section>

            {/* Known Issues and Limitations */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Known Issues and Limitations
              </h2>
              <div className="bg-yellow-50 p-6 rounded-lg mb-6" style={{ backgroundColor: '#fffbeb' }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={24} className="text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2 text-yellow-800">
                      Areas for Improvement
                    </h3>
                    <p className="text-yellow-700">
                      We are continuously working to improve accessibility. Currently, we are aware of the
                      following limitations and are actively working to address them.
                    </p>
                  </div>
                </div>
              </div>

              <ul className="list-disc pl-6 mb-6" style={{ color: 'var(--gray-600)' }}>
                <li>Some interactive activities may require additional keyboard navigation improvements</li>
                <li>Video content is being updated to include more comprehensive captions</li>
                <li>Color contrast in some older activities is being enhanced</li>
                <li>Mobile accessibility features are being expanded</li>
              </ul>
            </section>

            {/* Feedback and Reporting */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Feedback and Reporting Issues
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                We welcome feedback about accessibility issues and suggestions for improvement. If you
                encounter any barriers to accessing our content, please let us know:
              </p>

              <div className="bg-gray-50 p-6 rounded-lg" style={{ backgroundColor: 'var(--light)' }}>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                  How to Report Accessibility Issues:
                </h3>
                <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
                  <li><strong>Email:</strong> accessibility@pandagarde.com</li>
                  <li><strong>Phone:</strong> 1-800-PANDA-HELP (1-800-726-3243)</li>
                  <li><strong>Contact Form:</strong> Use our contact form and select "Accessibility" as the topic</li>
                  <li><strong>Response Time:</strong> We aim to respond within 48 hours</li>
                </ul>
              </div>
            </section>

            {/* Alternative Formats */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Alternative Formats
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--gray-600)' }}>
                We provide alternative formats for our educational content to ensure accessibility:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                    Available Formats
                  </h3>
                  <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
                    <li>Large print versions</li>
                    <li>Audio descriptions</li>
                    <li>Simplified text versions</li>
                    <li>Braille-ready formats</li>
                    <li>High contrast versions</li>
                    <li>Mobile-optimized layouts</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                    Request Process
                  </h3>
                  <ol className="list-decimal pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
                    <li>Contact us with your specific needs</li>
                    <li>Specify the content and preferred format</li>
                    <li>We'll provide the alternative format within 5 business days</li>
                    <li>Follow up to ensure the format meets your needs</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Accessibility Contact Information
              </h2>
              <div className="bg-blue-50 p-6 rounded-lg" style={{ backgroundColor: '#eff6ff' }}>
                <div className="flex items-start gap-3">
                  <Info size={24} className="text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2 text-blue-800">
                      Accessibility Coordinator
                    </h3>
                    <p className="text-blue-700 mb-2">
                      Our accessibility coordinator is available to help with any accessibility-related questions or concerns.
                    </p>
                    <div className="text-blue-700">
                      <p><strong>Email:</strong> accessibility@pandagarde.com</p>
                      <p><strong>Phone:</strong> 1-800-PANDA-HELP (1-800-726-3243)</p>
                      <p><strong>Hours:</strong> Monday-Friday, 9 AM - 5 PM EST</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Effective Date */}
            <section className="mb-12">
              <div className="bg-green-50 p-6 rounded-lg text-center" style={{ backgroundColor: '#f0fdf4' }}>
                <p className="text-lg font-semibold text-green-800">
                  This Accessibility Statement is effective as of December 2024
                </p>
                <p className="text-sm mt-2 text-green-700">
                  Last updated: December 2024
                </p>
              </div>
            </section>

          </div>
        </div>
    </PageLayout>
  );
};

export default AccessibilityPage;
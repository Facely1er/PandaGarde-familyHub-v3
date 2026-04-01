import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Users, Shield, CheckCircle } from 'lucide-react';
import { pdfService } from '../lib/pdfService';
import PageLayout from '../components/layout/PageLayout';

const FamilyAgreementPage: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await pdfService.generateFamilyAgreementPDF();
    } catch (error) {
      console.error('Error downloading family agreement:', error);
      alert('Error downloading family agreement. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = () => {
    const url = `/downloads/family-agreement.html`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    const url = `/downloads/family-agreement.html`;
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const agreementSections = [
    {
      title: 'Device Rules',
      icon: '📱',
      description: 'Establish clear guidelines for device usage, screen time, and device locations in your home.',
      features: ['Screen time limits', 'Device-free zones', 'Bedtime rules', 'Charging station setup']
    },
    {
      title: 'Privacy & Safety',
      icon: '🔐',
      description: 'Protect your family\'s personal information and ensure safe online behavior.',
      features: ['Personal information protection', 'Password security', 'Photo sharing rules', 'Stranger danger awareness']
    },
    {
      title: 'Educational Use',
      icon: '📚',
      description: 'Promote positive, educational use of technology and digital resources.',
      features: ['Learning-first approach', 'App approval process', 'Website restrictions', 'Assignment completion']
    },
    {
      title: 'Respectful Behavior',
      icon: '🤝',
      description: 'Foster kindness, respect, and positive digital citizenship in your family.',
      features: ['Kind online communication', 'Anti-bullying commitment', 'Standing up for others', 'Think before posting']
    },
    {
      title: 'Consequences & Learning',
      icon: '⚖️',
      description: 'Establish fair consequences and learning opportunities for rule violations.',
      features: ['Clear consequences', 'Learning from mistakes', 'Open communication', 'Regular reviews']
    }
  ];

  return (
    <PageLayout
      title="Family Internet Agreement"
      subtitle="A comprehensive, customizable agreement to establish safe internet use rules for your family. Perfect for creating a shared understanding of digital safety."
      icon={Users}
      badge="FAMILY RESOURCE"
      breadcrumbs={true}
    >
      <div className="min-h-screen" style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}>
      {/* Main Content */}
      <main className="container mx-auto px-6 py-20">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
            Create Your Family's Digital Safety Foundation
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--gray-600)' }}>
            This comprehensive family internet agreement helps you establish clear, age-appropriate rules for safe and responsible internet use. It's designed to grow with your family and adapt to changing technology.
          </p>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--light)' }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>
              💡 How to Use This Agreement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Print & Discuss</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Print the agreement and fill it out together as a family</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Customize Rules</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Adapt the rules to fit your family's specific needs and values</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Sign Together</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Have everyone sign to show commitment to the agreement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Review Regularly</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Update the agreement as your children grow and technology changes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement Sections Preview */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            What's Included in Your Family Agreement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agreementSections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                style={{ backgroundColor: 'var(--card-color)' }}
              >
                <div className="text-4xl mb-4">{section.icon}</div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                  {section.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--gray-600)' }}>
                  {section.description}
                </p>
                <ul className="space-y-1">
                  {section.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-xs flex items-center gap-2" style={{ color: 'var(--gray-600)' }}>
                      <CheckCircle size={12} className="text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
            Get Your Family Internet Agreement
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--gray-600)' }}>
            Download, print, and customize this comprehensive agreement for your family.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Download size={20} />
              {isDownloading ? 'Generating PDF...' : 'Download & Print'}
            </button>
            
            <button
              onClick={handlePreview}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <FileText size={20} />
              Preview
            </button>
            
            <button
              onClick={handlePrint}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Shield size={20} />
              Print Directly
            </button>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            Related Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/downloads/safety-posters"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Safety Posters
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Visual reminders of important digital safety rules
              </p>
            </Link>

            <Link
              to="/parent-resources"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Parent Resources
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Additional tools and guides for parents
              </p>
            </Link>

            <Link to="/family-hub"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Family Hub
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Track your family's privacy learning progress
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
    </PageLayout>
  );
};

export default FamilyAgreementPage;
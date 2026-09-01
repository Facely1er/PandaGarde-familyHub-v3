import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Users, Shield, CheckCircle } from 'lucide-react';
import { pdfService } from '../lib/pdfService';
import PageLayout from '../components/layout/PageLayout';
import { logger } from '../lib/logger';

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
      logger.error('Error downloading family agreement:', error);
      alert('Error downloading family agreement. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = () => {
    const url = `/downloads/family-agreement-print.html`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    const url = `/downloads/family-agreement-print.html`;
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
      description: 'Foster kindness and respect online and off.',
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
      subtitle="Fill in the agreement together, print it, and post it where everyone can see it. Tap Start below to begin."
      breadcrumbs={true}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6 text-primary">
            Write your family&apos;s screen rules together
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-gray-600">
            Print the agreement, sit down as a family, and fill in the blanks. Post it on the fridge when everyone signs. You can update it as kids get older.
          </p>
          
          <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950/30">
            <h3 className="mb-4 text-xl font-semibold text-primary">
              How to use this agreement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="mt-1 flex-shrink-0 text-green-600" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Print & Discuss</h4>
                  <p className="text-sm text-gray-600">Print the agreement and fill it out together as a family</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="mt-1 flex-shrink-0 text-green-600" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Customize Rules</h4>
                  <p className="text-sm text-gray-600">Adapt the rules to fit your family's specific needs and values</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="mt-1 flex-shrink-0 text-green-600" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Sign Together</h4>
                  <p className="text-sm text-gray-600">Have everyone sign to show commitment to the agreement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="mt-1 flex-shrink-0 text-green-600" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Review Regularly</h4>
                  <p className="text-sm text-gray-600">Update the agreement as your children grow and technology changes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement Sections Preview */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-primary">
            What's Included in Your Family Agreement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agreementSections.map((section, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="text-4xl mb-4">{section.icon}</div>
                <h3 className="text-lg font-semibold mb-3 text-primary">
                  {section.title}
                </h3>
                <p className="text-sm mb-4 text-gray-600">
                  {section.description}
                </p>
                <ul className="space-y-1">
                  {section.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-xs flex items-center gap-2 text-gray-600">
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
          <h2 className="text-2xl font-bold mb-6 text-primary">
            Get Your Family Internet Agreement
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Download, print, and customize this comprehensive agreement for your family.
          </p>
          
          <div className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-800 disabled:bg-gray-400 sm:px-8 sm:py-4 dark:bg-green-600 dark:hover:bg-green-500"
            >
              <Download size={20} />
              {isDownloading ? 'Generating PDF...' : 'Download & Print'}
            </button>
            
            <button
              onClick={handlePreview}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-700 px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-green-50 sm:px-8 sm:py-4 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
            >
              <FileText size={20} />
              Preview
            </button>
            
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-700 sm:px-8 sm:py-4"
            >
              <Shield size={20} />
              Print Directly
            </button>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-primary">
            Related Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/downloads/safety-posters"
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Safety Posters
              </h3>
              <p className="text-sm text-gray-600">
                Visual reminders of important digital safety rules
              </p>
            </Link>

            <Link
              to="/for-families"
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Parent Resources
              </h3>
              <p className="text-sm text-gray-600">
                Additional tools and guides for parents
              </p>
            </Link>

            <Link to="/family-hub"
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Family Hub
              </h3>
              <p className="text-sm text-gray-600">
                Optional kids&apos; missions on this device
              </p>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FamilyAgreementPage;
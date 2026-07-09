import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Award, Star, Trophy, Medal } from 'lucide-react';
import { pdfService } from '../lib/pdfService';
import PageLayout from '../components/layout/PageLayout';
import { logger } from '../lib/logger';

const CertificatesPage: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const certificates = [
    {
      id: 'privacy-champion',
      title: 'Privacy Champion Certificate',
      description: 'Awarded for completing all privacy education activities',
      requirements: 'Complete 6 activities',
      icon: Trophy,
      downloadUrl: '#'
    },
    {
      id: 'privacy-explorer',
      title: 'Privacy Explorer Certificate',
      description: 'Awarded for completing your first privacy activity',
      requirements: 'Complete 1 activity',
      icon: Star,
      downloadUrl: '#'
    },
    {
      id: 'privacy-learner',
      title: 'Privacy Learner Certificate',
      description: 'Awarded for completing multiple privacy activities',
      requirements: 'Complete 3 activities',
      icon: Medal,
      downloadUrl: '#'
    },
    {
      id: 'dedicated-learner',
      title: 'Dedicated Learner Certificate',
      description: 'Awarded for spending significant time learning about privacy',
      requirements: 'Spend 60+ minutes learning',
      icon: Award,
      downloadUrl: '#'
    },
    {
      id: 'perfect-score',
      title: 'Perfect Score Master Certificate',
      description: 'Awarded for achieving perfect scores on all activities',
      requirements: '100% score on all activities',
      icon: Trophy,
      downloadUrl: '#'
    },
    {
      id: 'family-privacy-guardian',
      title: 'Family Privacy Guardian Certificate',
      description: 'Awarded to families who complete privacy education together',
      requirements: 'Family completes activities together',
      icon: Award,
      downloadUrl: '#'
    }
  ];

  const handleDownload = async (certId: string) => {
    if (certId === 'all-certificates') {
      setIsDownloading(true);
      try {
        await pdfService.generateCertificatesPDF();
      } catch (error) {
        logger.error('Error downloading certificates:', error);
        alert('Error downloading certificates. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    } else {
      // For individual certificates, open the HTML version for now
      const url = `/downloads/certificates-print.html`;
      window.open(url, '_blank');
    }
  };

  return (
    <PageLayout
      title="Privacy Champion Certificates"
      subtitle="Print a certificate when your child finishes a story or mission. Pick one below and print it at home."
      breadcrumbs={true}
    >
      <div className="bg-white dark:bg-gray-900">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="mb-6 text-2xl font-bold text-green-700 sm:text-3xl dark:text-green-400">
            Celebrate a finished story or mission
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-gray-600">
            Pick a certificate, add your child&apos;s name, and print it at home. A simple way to say &ldquo;you finished something important.&rdquo;
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 bg-light">
            <h3 className="text-xl font-semibold mb-4 text-primary">
              🏆 Certificate Usage Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <Star size={20} className="text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Personalize</h4>
                  <p className="text-sm text-gray-600">Add the child's name and achievement date</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star size={20} className="text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Display Proudly</h4>
                  <p className="text-sm text-gray-600">Frame and display certificates in learning areas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star size={20} className="text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Celebrate Together</h4>
                  <p className="text-sm text-gray-600">Present certificates during family celebrations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star size={20} className="text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Create Portfolio</h4>
                  <p className="text-sm text-gray-600">Keep certificates as part of learning portfolio</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-left dark:border-green-800 dark:bg-green-900/20">
            <h3 className="mb-2 text-lg font-semibold text-green-800 dark:text-green-200">
              Want it auto-filled with your child's name and progress?
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              The Certificate Generator uses your saved Family Hub profile to fill in your child's name,
              achievement, and date automatically — no typing required. (Also available from Family Hub's
              Progress screen.)
            </p>
            <Link
              to="/certificate"
              className="button button-primary inline-flex items-center gap-2"
            >
              Open Certificate Generator
            </Link>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => {
            const IconComponent = cert.icon;
            return (
              <div
                key={cert.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                style={{ backgroundColor: 'var(--card-color)' }}
              >
                <div className="aspect-w-4 aspect-h-3 bg-gray-100">
                  <div className="w-full h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                    <IconComponent size={48} className="text-yellow-600" />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-primary">
                      {cert.title}
                    </h3>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                      PDF
                    </span>
                  </div>
                  
                  <p className="text-sm mb-4 text-gray-600">
                    {cert.description}
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 bg-light">
                    <h4 className="text-sm font-semibold mb-1 text-primary">
                      Requirements:
                    </h4>
                    <p className="text-sm text-gray-600">
                      {cert.requirements}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(cert.id)}
                    className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    View & Print
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Certificate Generator */}
        <div className="mb-12 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-center text-white sm:p-8">
          <h2 className="mb-4 text-xl font-bold sm:text-2xl">
            Generate Custom Certificate
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Create a personalized certificate for any privacy education achievement. Perfect for recognizing individual accomplishments!
          </p>
          <Link
            to="/downloads/certificates"
            className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            <Award size={20} />
            Generate Custom Certificate
          </Link>
        </div>

        {/* Bulk Download Section */}
        <div className="mb-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-center text-white sm:p-8">
          <h2 className="mb-4 text-xl font-bold sm:text-2xl">
            Complete Certificate Collection
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Download all 6 certificate templates in one package. Perfect for educators and families who want to recognize various achievements!
          </p>
          <button
            onClick={() => handleDownload('all-certificates')}
            disabled={isDownloading}
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            {isDownloading ? 'Generating PDF...' : 'Download Complete Set'}
          </button>
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-6 text-center text-xl font-bold text-green-700 sm:mb-8 sm:text-2xl dark:text-green-400">
            Related Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/for-families"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Award size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Activity Book
              </h3>
              <p className="text-sm text-gray-600">
                Complete activities to earn these certificates
              </p>
            </Link>

            <Link
              to="/downloads/coloring-sheets"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Star size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Coloring Sheets
              </h3>
              <p className="text-sm text-gray-600">
                Download fun coloring pages featuring Privacy Panda
              </p>
            </Link>

            <Link to="/family-hub"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Trophy size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Family Hub
              </h3>
              <p className="text-sm text-gray-600">
                Track family achievements and progress together
              </p>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </PageLayout>
  );
};

export default CertificatesPage;

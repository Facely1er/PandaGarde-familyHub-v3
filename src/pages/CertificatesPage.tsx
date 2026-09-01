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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="mb-6 text-2xl font-bold text-green-700 sm:text-3xl dark:text-green-400">
            Celebrate a finished story or mission
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-gray-600">
            Pick a certificate, add your child&apos;s name, and print it at home. A simple way to say &ldquo;you finished something important.&rdquo;
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 bg-light">
            <h3 className="mb-4 text-xl font-semibold text-primary">
              Certificate usage tips
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
        </div>

        {/* Certificates Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => {
            const IconComponent = cert.icon;
            return (
              <div
                key={cert.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
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
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800 dark:bg-green-600"
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
        <div className="rounded-2xl bg-green-700 p-6 text-center text-white sm:p-8 dark:bg-green-800">
          <h2 className="mb-4 text-xl font-bold sm:text-2xl">
            Generate Custom Certificate
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Create a personalized certificate for any privacy education achievement. Perfect for recognizing individual accomplishments!
          </p>
          <Link
            to="/downloads/certificates"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-green-800 hover:bg-green-50"
          >
            <Award size={20} />
            Generate Custom Certificate
          </Link>
        </div>

        {/* Bulk Download Section */}
        <div className="rounded-2xl bg-green-700 p-6 text-center text-white sm:p-8 dark:bg-green-800">
          <h2 className="mb-4 text-xl font-bold sm:text-2xl">
            Complete Certificate Collection
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Download all 6 certificate templates in one package. Perfect for educators and families who want to recognize various achievements!
          </p>
          <button
            onClick={() => handleDownload('all-certificates')}
            disabled={isDownloading}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-green-800 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
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
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
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
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Trophy size={24} className="text-purple-600" />
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

export default CertificatesPage;

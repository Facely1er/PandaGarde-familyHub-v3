import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Printer, Eye, CheckCircle } from 'lucide-react';
import { pdfService } from '../lib/pdfService';
import PageLayout from '../components/layout/PageLayout';
import { logger } from '../lib/logger';

interface DownloadGuidePageProps {
  title: string;
  description?: string;
  type: 'download' | 'guide';
  resourceType?: 'certificates' | 'coloring-sheets' | 'family-agreement' | 'safety-posters';
}

const DownloadGuidePage: React.FC<DownloadGuidePageProps> = ({
  title,
  description = "Download and print these privacy education resources.",
  type,
  resourceType
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const icon = type === 'download' ? Download : FileText;
  const IconComponent = icon;

  const handleDownload = async (resourceType: string) => {
    setIsDownloading(true);
    try {
      // Generate and download PDF based on resource type
      switch (resourceType) {
        case 'coloring-sheets':
          await pdfService.generateColoringSheetsPDF();
          break;
        case 'safety-posters':
          await pdfService.generateSafetyPostersPDF();
          break;
        case 'certificates':
          await pdfService.generateCertificatesPDF();
          break;
        case 'family-agreement':
          await pdfService.generateFamilyAgreementPDF();
          break;
        default: {
          // Fallback to HTML view
          const url = `/downloads/${resourceType}-print.html`;
          window.open(url, '_blank');
        }
      }
    } catch (error) {
      logger.error('Error downloading resource:', error);
      // Fallback to HTML view if PDF generation fails
      const url = `/downloads/${resourceType}-print.html`;
      window.open(url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = (resourceType: string) => {
    const url = `/downloads/${resourceType}-print.html`;
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handlePreview = (resourceType: string) => {
    const url = `/downloads/${resourceType}-print.html`;
    window.open(url, '_blank');
  };

  const getResourceInfo = (type: string) => {
    const resources = {
      'certificates': {
        title: 'Privacy Champion Certificates',
        description: 'Printable certificates to celebrate your child\'s privacy learning achievements',
        features: ['Multiple certificate designs', 'Customizable with child\'s name', 'Print-ready format', 'Perfect for framing'],
        icon: '🏆'
      },
      'coloring-sheets': {
        title: 'Privacy Panda Coloring Sheets',
        description: 'Educational coloring pages that teach privacy concepts while having fun',
        features: ['5 unique coloring pages', 'Privacy tips included', 'Age-appropriate designs', 'Educational content'],
        icon: '🎨'
      },
      'family-agreement': {
        title: 'Family Internet Agreement',
        description: 'Fill-in rules for safe internet use at home—print and sign together',
        features: ['Customizable rules', 'Signature sections', 'Age-appropriate guidelines', 'Regular review prompts'],
        icon: '📋'
      },
      'safety-posters': {
        title: 'Digital Safety Posters',
        description: 'Visual reminders of important digital safety rules for home and classroom',
        features: ['5 safety rule posters', 'Eye-catching designs', 'Print-ready format', 'Classroom-friendly'],
        icon: '🛡️'
      }
    };
    return resources[type as keyof typeof resources] || resources['certificates'];
  };

  const resourceInfo = resourceType ? getResourceInfo(resourceType) : null;

  return (
    <PageLayout
      title={title}
      subtitle={description}
      breadcrumbs={true}
    >
      <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {resourceInfo ? (
            <>
              {/* Resource Information */}
              <div className="text-center mb-12">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-6xl">{resourceInfo.icon}</span>
                </div>

                <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
                  {resourceInfo.title}
                </h2>

                <p className="text-xl mb-8 leading-relaxed text-gray-600">
                  {resourceInfo.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mb-12 flex flex-col flex-wrap justify-center gap-3 sm:flex-row sm:gap-4">
                <button
                  onClick={() => resourceType && handleDownload(resourceType)}
                  disabled={isDownloading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-800 disabled:bg-gray-400 sm:px-8 sm:py-4 dark:bg-green-600 dark:hover:bg-green-500"
                >
                  <Download size={20} />
                  {isDownloading ? 'Opening...' : 'Download & Print'}
                </button>
                
                <button
                  onClick={() => resourceType && handlePreview(resourceType)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-700 px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-green-50 sm:px-8 sm:py-4 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
                >
                  <Eye size={20} />
                  Preview
                </button>
                
                <button
                  onClick={() => resourceType && handlePrint(resourceType)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-700 sm:px-8 sm:py-4"
                >
                  <Printer size={20} />
                  Print Directly
                </button>
              </div>

              {/* Features */}
              <div className="mb-12 rounded-xl bg-gray-50 p-6 sm:p-8 dark:bg-gray-800">
                <h3 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
                  What's Included
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resourceInfo.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{feature}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white sm:p-8">
                <h3 className="mb-4 text-xl font-bold sm:text-2xl">
                  How to Use
                </h3>
                <div className="space-y-4 text-lg">
                  <p>1. <strong>Download:</strong> Click "Download & Print" to open the resource in a new tab</p>
                  <p>2. <strong>Customize:</strong> Fill in any blanks with your child's information</p>
                  <p>3. <strong>Print:</strong> Use your browser's print function (Ctrl+P or Cmd+P)</p>
                  <p>4. <strong>Enjoy:</strong> Use these resources to reinforce privacy learning at home!</p>
                </div>
              </div>
            </>
          ) : (
            /* Generic download page for other resources */
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <IconComponent size={64} className="text-white" />
              </div>

              <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
                {type === 'download' ? 'Download Available' : 'Guide Available'}
              </h2>

              <p className="text-xl mb-8 leading-relaxed text-gray-600">
                {type === 'download'
                  ? 'We\'re getting this download ready. Check back soon—or browse printables that are available now.'
                  : 'This guide is still being written. Browse Classroom Activities and the Family Privacy Guide for ready-to-use material today.'
                }
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="rounded-xl bg-gray-50 p-6 text-center sm:p-8 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
              Explore More Resources
            </h2>
            <p className="text-lg mb-6 text-gray-600">
              Check out our other privacy education resources and activities.
            </p>
            <div className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/for-families"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
              >
                <FileText size={20} />
                Activity Book
              </Link>
              <Link
                to="/downloads/certificates"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-700 px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
              >
                <Download size={20} />
                Certificates
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-700"
              >
                All Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  );
};

export default DownloadGuidePage;

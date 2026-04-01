import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Printer, Eye, CheckCircle } from 'lucide-react';
import { pdfService } from '../lib/pdfService';
import PageLayout from '../components/layout/PageLayout';

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
          const url = `/downloads/${resourceType}.html`;
          window.open(url, '_blank');
        }
      }
    } catch (error) {
      console.error('Error downloading resource:', error);
      // Fallback to HTML view if PDF generation fails
      const url = `/downloads/${resourceType}.html`;
      window.open(url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = (resourceType: string) => {
    const url = `/downloads/${resourceType}.html`;
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handlePreview = (resourceType: string) => {
    const url = `/downloads/${resourceType}.html`;
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
        description: 'A comprehensive agreement to establish safe internet use rules for your family',
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
      icon={IconComponent}
      badge={type.toUpperCase()}
      breadcrumbs={true}
    >
      <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {resourceInfo ? (
            <>
              {/* Resource Information */}
              <div className="text-center mb-12">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-6xl">{resourceInfo.icon}</span>
                </div>

                <h2 className="font-bold mb-6 text-gray-900" style={{ fontSize: 'clamp(1.875rem, 3vw, 2.25rem)' }}>
                  {resourceInfo.title}
                </h2>

                <p className="text-xl mb-8 leading-relaxed text-gray-600">
                  {resourceInfo.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <button
                  onClick={() => handleDownload(resourceType!)}
                  disabled={isDownloading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  <Download size={20} />
                  {isDownloading ? 'Opening...' : 'Download & Print'}
                </button>
                
                <button
                  onClick={() => handlePreview(resourceType!)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  <Eye size={20} />
                  Preview
                </button>
                
                <button
                  onClick={() => handlePrint(resourceType!)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  <Printer size={20} />
                  Print Directly
                </button>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-xl p-8 mb-12">
                <h3 className="font-bold mb-6 text-gray-900" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
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
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white mb-12">
                <h3 className="font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
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

              <h2 className="font-bold mb-6 text-gray-900" style={{ fontSize: 'clamp(1.875rem, 3vw, 2.25rem)' }}>
                {type === 'download' ? 'Download Available' : 'Guide Available'}
              </h2>

              <p className="text-xl mb-8 leading-relaxed text-gray-600">
                {type === 'download'
                  ? 'We\'re preparing this downloadable resource for you. It will include high-quality materials designed to support your privacy education journey.'
                  : 'This comprehensive guide is being developed by our team of privacy experts and educators. It will provide step-by-step instructions and practical tips.'
                }
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <h2 className="font-bold mb-4 text-gray-900" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              Explore More Resources
            </h2>
            <p className="text-lg mb-6 text-gray-600">
              Check out our other privacy education resources and activities.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/activity-book"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
              >
                <FileText size={20} />
                Activity Book
              </Link>
              <Link
                to="/downloads/certificates"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Download size={20} />
                Certificates
              </Link>
              <Link
                to="/"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
              >
                All Resources
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
    </PageLayout>
  );
};

export default DownloadGuidePage;
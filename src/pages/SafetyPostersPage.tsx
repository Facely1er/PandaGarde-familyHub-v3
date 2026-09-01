import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Shield, AlertTriangle, Users, Lock, Smartphone, LifeBuoy } from 'lucide-react';
import { pdfService } from '../lib/pdfService';
import { downloadService } from '../lib/database';
import { logger } from '../lib/logger';
import PageLayout from '../components/layout/PageLayout';

const SafetyPostersPage: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* IDs and titles match anchors in /public/downloads/safety-posters-print.html (single HTML, five distinct sections). */
  const safetyPosters = [
    {
      id: 'password-safety',
      title: 'Password Safety',
      description: 'Strong, secret passwords — opens this poster in the printable HTML.',
      ageGroup: 'Ages 5–10',
      size: '11" × 17"',
      icon: Lock,
      downloadUrl: '/downloads/safety-posters-print.html#password-safety',
      previewClass: 'bg-gradient-to-br from-emerald-50 via-emerald-300 to-emerald-400',
      iconClass: 'text-emerald-800'
    },
    {
      id: 'personal-information',
      title: 'Personal Information',
      description: 'Keep name, address, and school private — opens this poster in the printable HTML.',
      ageGroup: 'Ages 6–12',
      size: '11" × 17"',
      icon: Shield,
      downloadUrl: '/downloads/safety-posters-print.html#personal-information',
      previewClass: 'bg-gradient-to-br from-blue-50 via-blue-300 to-blue-500',
      iconClass: 'text-blue-800'
    },
    {
      id: 'stranger-danger',
      title: 'Stranger Safety Online',
      description: 'People you do not know — opens this poster in the printable HTML.',
      ageGroup: 'Ages 6–12',
      size: '11" × 17"',
      icon: AlertTriangle,
      downloadUrl: '/downloads/safety-posters-print.html#stranger-danger',
      previewClass: 'bg-gradient-to-br from-orange-50 via-orange-300 to-orange-500',
      iconClass: 'text-orange-800'
    },
    {
      id: 'app-safety',
      title: 'App Safety',
      description: 'Ask before downloading apps — opens this poster in the printable HTML.',
      ageGroup: 'Ages 6–12',
      size: '11" × 17"',
      icon: Smartphone,
      downloadUrl: '/downloads/safety-posters-print.html#app-safety',
      previewClass: 'bg-gradient-to-br from-purple-50 via-purple-300 to-purple-500',
      iconClass: 'text-purple-800'
    },
    {
      id: 'ask-for-help',
      title: 'When to Ask for Help',
      description: 'Talk to a trusted adult — opens this poster in the printable HTML.',
      ageGroup: 'All ages',
      size: '11" × 17"',
      icon: LifeBuoy,
      downloadUrl: '/downloads/safety-posters-print.html#ask-for-help',
      previewClass: 'bg-gradient-to-br from-red-50 via-red-300 to-red-500',
      iconClass: 'text-red-800'
    },
    {
      id: 'family-agreement',
      title: 'Family Internet Agreement',
      description: 'Separate printable template — not part of the poster HTML file.',
      ageGroup: 'All ages',
      size: '8.5" × 11"',
      icon: Users,
      downloadUrl: '/downloads/family-agreement-print.html',
      previewClass: 'bg-gradient-to-br from-violet-50 via-violet-300 to-violet-600',
      iconClass: 'text-violet-800'
    }
  ];

  const handleDownload = async (posterId: string, posterTitle?: string) => {
    if (posterId === 'all-posters') {
      setIsDownloading(true);
      try {
        await pdfService.generateSafetyPostersPDF();
      } catch (error) {
        logger.error('Error downloading safety posters:', error);
        alert('Error downloading safety posters. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    } else {
      // Find the poster and use its download URL
      const poster = safetyPosters.find(p => p.id === posterId);
      if (poster) {
        // Track the download
        try {
          await downloadService.trackDownload({
            user_id: null, // Anonymous download
            download_type: `safety-poster-${posterId}`,
            resource_name: posterTitle || poster.title
          });
        } catch (error) {
          logger.debug('Download tracking failed (demo mode)', error, 'DOWNLOAD');
        }
        
        // Open the download URL
        window.open(poster.downloadUrl, '_blank');
      } else {
        // Fallback to general safety posters page
        window.open('/downloads/safety-posters-print.html', '_blank');
      }
    }
  };

  return (
    <PageLayout
      title="Digital Safety Posters"
      subtitle="Print a poster and hang it in the classroom or at home—one rule per sheet."
      breadcrumbs={true}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6 text-primary">
            Hang a reminder kids will see every day
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-gray-600">
            Pick a poster below, print it, and put it where devices are used. Each one states one clear rule in kid-friendly language.
          </p>
          
          <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-4 sm:p-6 dark:border-green-800 dark:bg-green-950/30">
            <h3 className="mb-4 text-lg font-semibold text-primary sm:text-xl">
              Printing and display guidelines
            </h3>
            <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Shield size={20} className="mt-1 flex-shrink-0 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Print Quality</h4>
                  <p className="text-sm text-gray-600">Use high-quality paper and color printing for best results</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={20} className="mt-1 flex-shrink-0 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Placement</h4>
                  <p className="text-sm text-gray-600">Display at eye level for children in learning areas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={20} className="mt-1 flex-shrink-0 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Lamination</h4>
                  <p className="text-sm text-gray-600">Consider laminating for durability and easy cleaning</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={20} className="mt-1 flex-shrink-0 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-semibold mb-1 text-primary">Discussion</h4>
                  <p className="text-sm text-gray-600">Use posters as conversation starters about privacy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posters Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {safetyPosters.map((poster) => {
            const IconComponent = poster.icon;
            return (
              <div
                key={poster.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="overflow-hidden rounded-t-2xl">
                  <div
                    className={`flex h-48 w-full items-center justify-center ${poster.previewClass}`}
                  >
                    <IconComponent size={48} className={poster.iconClass} aria-hidden />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-primary">
                      {poster.title}
                    </h3>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-200">
                      {poster.size}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-4 text-gray-600">
                    {poster.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">
                      {poster.ageGroup}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(poster.id, poster.title)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
                  >
                    <Download size={16} />
                    View & Print
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bulk Download Section */}
        <div className="rounded-2xl bg-green-700 p-6 text-center text-white sm:p-8 dark:bg-green-800">
          <h2 className="mb-4 text-xl font-bold sm:text-2xl">
            Complete Poster Collection
          </h2>
          <p className="mb-6 text-base opacity-90 sm:text-lg">
            Download all five safety posters in one PDF. (The family agreement is a separate printable — see the card above.)
          </p>
          <button
            onClick={() => handleDownload('all-posters', 'Complete Safety Poster Collection')}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
          >
            <Download size={20} />
            {isDownloading ? 'Generating PDF...' : 'Download Complete Set'}
          </button>
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-primary">
            Related Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/downloads/coloring-sheets"
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Coloring Sheets
              </h3>
              <p className="text-sm text-gray-600">
                Download fun coloring pages featuring Privacy Panda
              </p>
            </Link>

            <Link
              to="/downloads/family-agreement"
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Family Agreement
              </h3>
              <p className="text-sm text-gray-600">
                Customizable family guidelines for internet use
              </p>
            </Link>

            <Link
              to="/how-it-works"
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <AlertTriangle size={24} className="text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Educator Tools
              </h3>
              <p className="text-sm text-gray-600">
                Additional resources for teachers and educators
              </p>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SafetyPostersPage;
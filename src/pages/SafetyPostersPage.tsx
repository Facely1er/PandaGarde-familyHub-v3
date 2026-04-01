import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Shield, AlertTriangle, Users, Lock, Smartphone, LifeBuoy } from 'lucide-react';
import { pdfService } from '../lib/pdfService';
import { downloadService } from '../lib/database';
import PageLayout from '../components/layout/PageLayout';

const SafetyPostersPage: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* IDs and titles match anchors in /public/downloads/safety-posters.html (single HTML, five distinct sections). */
  const safetyPosters = [
    {
      id: 'password-safety',
      title: 'Password Safety',
      description: 'Strong, secret passwords — opens this poster in the printable HTML.',
      ageGroup: 'Ages 5–10',
      size: '11" × 17"',
      icon: Lock,
      downloadUrl: '/downloads/safety-posters.html#password-safety',
      previewBackground: 'linear-gradient(145deg, #ecfdf5 0%, #6ee7b7 55%, #34d399 100%)',
      iconColor: '#047857'
    },
    {
      id: 'personal-information',
      title: 'Personal Information',
      description: 'Keep name, address, and school private — opens this poster in the printable HTML.',
      ageGroup: 'Ages 6–12',
      size: '11" × 17"',
      icon: Shield,
      downloadUrl: '/downloads/safety-posters.html#personal-information',
      previewBackground: 'linear-gradient(145deg, #eff6ff 0%, #93c5fd 50%, #3b82f6 100%)',
      iconColor: '#1e40af'
    },
    {
      id: 'stranger-danger',
      title: 'Stranger Safety Online',
      description: 'People you do not know — opens this poster in the printable HTML.',
      ageGroup: 'Ages 6–12',
      size: '11" × 17"',
      icon: AlertTriangle,
      downloadUrl: '/downloads/safety-posters.html#stranger-danger',
      previewBackground: 'linear-gradient(145deg, #fff7ed 0%, #fdba74 45%, #f97316 100%)',
      iconColor: '#9a3412'
    },
    {
      id: 'app-safety',
      title: 'App Safety',
      description: 'Ask before downloading apps — opens this poster in the printable HTML.',
      ageGroup: 'Ages 6–12',
      size: '11" × 17"',
      icon: Smartphone,
      downloadUrl: '/downloads/safety-posters.html#app-safety',
      previewBackground: 'linear-gradient(145deg, #faf5ff 0%, #d8b4fe 40%, #a855f7 100%)',
      iconColor: '#6b21a8'
    },
    {
      id: 'ask-for-help',
      title: 'When to Ask for Help',
      description: 'Talk to a trusted adult — opens this poster in the printable HTML.',
      ageGroup: 'All ages',
      size: '11" × 17"',
      icon: LifeBuoy,
      downloadUrl: '/downloads/safety-posters.html#ask-for-help',
      previewBackground: 'linear-gradient(145deg, #fef2f2 0%, #fca5a5 40%, #ef4444 100%)',
      iconColor: '#991b1b'
    },
    {
      id: 'family-agreement',
      title: 'Family Internet Agreement',
      description: 'Separate printable template — not part of the poster HTML file.',
      ageGroup: 'All ages',
      size: '8.5" × 11"',
      icon: Users,
      downloadUrl: '/downloads/family-agreement.html',
      previewBackground: 'linear-gradient(145deg, #f5f3ff 0%, #c4b5fd 45%, #7c3aed 100%)',
      iconColor: '#5b21b6'
    }
  ];

  const handleDownload = async (posterId: string, posterTitle?: string) => {
    if (posterId === 'all-posters') {
      setIsDownloading(true);
      try {
        await pdfService.generateSafetyPostersPDF();
      } catch (error) {
        console.error('Error downloading safety posters:', error);
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
          console.log('Download tracking failed (demo mode):', error);
        }
        
        // Open the download URL
        window.open(poster.downloadUrl, '_blank');
      } else {
        // Fallback to general safety posters page
        window.open('/downloads/safety-posters.html', '_blank');
      }
    }
  };

  return (
    <PageLayout
      title="Digital Safety Posters"
      subtitle="Professional classroom posters designed to reinforce privacy education concepts. Perfect for schools, libraries, and educational environments."
      icon={Shield}
      badge="CLASSROOM RESOURCES"
      breadcrumbs={true}
    >
      <div className="min-h-screen" style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}>
      {/* Main Content */}
      <main className="container mx-auto px-6 py-20">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
            Visual Learning Tools for Privacy Education
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--gray-600)' }}>
            These professionally designed posters serve as constant visual reminders of important privacy concepts. They're perfect for classrooms, computer labs, libraries, and home learning spaces.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--light)' }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>
              📋 Printing & Display Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Print Quality</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Use high-quality paper and color printing for best results</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Placement</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Display at eye level for children in learning areas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Lamination</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Consider laminating for durability and easy cleaning</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Discussion</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Use posters as conversation starters about privacy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {safetyPosters.map((poster) => {
            const IconComponent = poster.icon;
            return (
              <div
                key={poster.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                style={{ backgroundColor: 'var(--card-color)' }}
              >
                <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-t-xl">
                  <div
                    className="w-full h-48 flex items-center justify-center"
                    style={{ background: poster.previewBackground }}
                  >
                    <IconComponent size={48} style={{ color: poster.iconColor }} aria-hidden />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                      {poster.title}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {poster.size}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-4" style={{ color: 'var(--gray-600)' }}>
                    {poster.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium" style={{ color: 'var(--gray-500)' }}>
                      {poster.ageGroup}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(poster.id, poster.title)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">
            Complete Poster Collection
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Download all five safety posters in one PDF. (The family agreement is a separate printable — see the card above.)
          </p>
          <button
            onClick={() => handleDownload('all-posters', 'Complete Safety Poster Collection')}
            disabled={isDownloading}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            {isDownloading ? 'Generating PDF...' : 'Download Complete Set'}
          </button>
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
            Related Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/downloads/coloring-sheets"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Coloring Sheets
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Download fun coloring pages featuring Privacy Panda
              </p>
            </Link>

            <Link
              to="/downloads/family-agreement"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Family Agreement
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Customizable family guidelines for internet use
              </p>
            </Link>

            <Link
              to="/educator-tools"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <AlertTriangle size={24} className="text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Educator Tools
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Additional resources for teachers and educators
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
    </PageLayout>
  );
};

export default SafetyPostersPage;
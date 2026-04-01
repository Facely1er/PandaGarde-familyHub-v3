import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Palette, Printer, Share2, Star } from 'lucide-react';
import { pdfService } from '../lib/pdfService';
import PageLayout from '../components/layout/PageLayout';

const ColoringSheetsPage: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coloringSheets = [
    {
      id: 'privacy-panda-basic',
      title: 'Privacy Panda - Basic',
      description: 'Simple outline of Privacy Panda for younger children',
      ageGroup: 'Ages 5-7',
      difficulty: 'Easy',
      image: '/images/coloring/privacy-panda-basic.svg',
      downloadUrl: '/images/coloring/privacy-panda-basic.svg'
    },
    {
      id: 'privacy-shield',
      title: 'Privacy Shield',
      description: 'Design your own privacy protection shield',
      ageGroup: 'Ages 6-9',
      difficulty: 'Easy',
      image: '/images/coloring/privacy-shield.svg',
      downloadUrl: '/images/coloring/privacy-shield.svg'
    },
    {
      id: 'password-treasure',
      title: 'Password Treasure Chest',
      description: 'Color the treasure chest that keeps passwords safe',
      ageGroup: 'Ages 7-10',
      difficulty: 'Medium',
      image: '/images/coloring/password-treasure.svg',
      downloadUrl: '/images/coloring/password-treasure.svg'
    },
    {
      id: 'digital-footprint',
      title: 'Digital Footprint Map',
      description: 'Trace your digital journey and learn about online privacy',
      ageGroup: 'Ages 8-12',
      difficulty: 'Medium',
      image: '/images/coloring/digital-footprint.svg',
      downloadUrl: '/images/coloring/digital-footprint.svg'
    },
    {
      id: 'privacy-garden',
      title: 'Privacy Garden',
      description: 'Beautiful garden scene with privacy-themed elements',
      ageGroup: 'Ages 6-11',
      difficulty: 'Easy',
      image: '/images/coloring/privacy-garden.svg',
      downloadUrl: '/images/coloring/privacy-garden.svg'
    },
    {
      id: 'cyber-safety-scene',
      title: 'Cyber Safety Scene',
      description: 'Complete scene showing safe and unsafe online behaviors',
      ageGroup: 'Ages 9-12',
      difficulty: 'Hard',
      image: '/images/coloring/cyber-safety-scene.svg',
      downloadUrl: '/images/coloring/cyber-safety-scene.svg'
    }
  ];

  const handleDownload = async (sheetId: string, title: string) => {
    if (sheetId === 'all-sheets') {
      setIsDownloading(true);
      try {
        // Download all individual SVG files
        for (const sheet of coloringSheets) {
          const link = document.createElement('a');
          link.href = sheet.downloadUrl;
          link.download = `${sheet.title.replace(/\s+/g, '-').toLowerCase()}.svg`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error('Error downloading coloring sheets:', error);
        alert('Error downloading coloring sheets. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    } else {
      // Individual sheet download
      const sheet = coloringSheets.find(s => s.id === sheetId);
      if (sheet) {
        try {
          const link = document.createElement('a');
          link.href = sheet.downloadUrl;
          link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.svg`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error('Error downloading SVG:', error);
          alert('Error downloading coloring sheet. Please try again.');
        }
      }
    }
  };

  return (
    <PageLayout
      title="Privacy Panda Coloring Sheets"
      subtitle="Download and print these fun coloring pages featuring Privacy Panda and privacy concepts. Perfect for offline learning and creative expression!"
      icon={Palette}
      badge="DOWNLOADABLE RESOURCES"
      breadcrumbs={true}
    >
      <div className="min-h-screen" style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-20">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-bold mb-6" style={{ fontSize: 'clamp(1.875rem, 3vw, 2.25rem)', color: 'var(--primary)' }}>
            Creative Learning Through Coloring
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--gray-600)' }}>
            These coloring sheets combine creativity with privacy education. Each page teaches important concepts while providing a fun, relaxing activity for children of all ages.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--light)' }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>
              💡 Coloring Tips for Parents & Educators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <Star size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Discuss While Coloring</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Talk about the privacy concepts shown in each picture</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Display Finished Art</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Hang completed coloring sheets as privacy reminders</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Use Quality Materials</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Print on good paper for better coloring experience</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Make It Social</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>Color together as a family activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coloring Sheets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {coloringSheets.map((sheet) => (
            <div
              key={sheet.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="aspect-w-4 aspect-h-3 bg-gray-100">
                <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={sheet.image} 
                    alt={sheet.title}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                    <div className="text-center">
                      <Palette size={48} className="text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Preview not available</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                    {sheet.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    sheet.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    sheet.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {sheet.difficulty}
                  </span>
                </div>
                
                <p className="text-sm mb-4" style={{ color: 'var(--gray-600)' }}>
                  {sheet.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium" style={{ color: 'var(--gray-500)' }}>
                    {sheet.ageGroup}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(sheet.id, sheet.title)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    View & Print
                  </button>
                  <button
                    onClick={() => handleDownload(sheet.id, sheet.title)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Print"
                  >
                    <Printer size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Download Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white text-center mb-16">
          <h2 className="font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Download All Coloring Sheets
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Get all 6 coloring sheets in one convenient PDF package. Perfect for educators and families!
          </p>
          <button
            onClick={() => handleDownload('all-sheets', 'All Privacy Panda Coloring Sheets')}
            disabled={isDownloading}
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            {isDownloading ? 'Generating PDF...' : 'Download Complete Set'}
          </button>
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bold mb-8 text-center" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--primary)' }}>
            Related Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/activity-book"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Palette size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Interactive Coloring
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Try our digital coloring activity in the Activity Book
              </p>
            </Link>

            <Link
              to="/story"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Star size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Privacy Panda Story
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Read the full story that inspired these coloring sheets
              </p>
            </Link>

            <Link
              to="/downloads/safety-posters"
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              style={{ backgroundColor: 'var(--card-color)' }}
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Share2 size={24} className="text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Safety Posters
              </h3>
              <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                Download classroom-ready privacy education posters
              </p>
            </Link>
          </div>
        </div>
      </main>
      </div>
    </PageLayout>
  );
};

export default ColoringSheetsPage;
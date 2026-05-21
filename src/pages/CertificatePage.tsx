import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CertificateGenerator from '../components/CertificateGenerator';

const CertificatePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/family-hub"
              className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Family Hub
            </Link>
            
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Certificate Generator
            </h1>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <CertificateGenerator />
      </main>
    </div>
  );
};

export default CertificatePage;
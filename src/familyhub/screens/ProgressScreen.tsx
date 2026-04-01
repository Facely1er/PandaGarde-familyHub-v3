import React, { useState } from 'react';
import { Award, Download, X } from 'lucide-react';
import CertificateGenerator from '../../components/CertificateGenerator';
import ProgressExport from '../../components/ProgressExport';

const ProgressScreen: React.FC = () => {
  const [showCertificates, setShowCertificates] = useState(false);
  const [showProgressExport, setShowProgressExport] = useState(false);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Progress & Certificates</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your achievements and download certificates for completed activities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setShowCertificates(true)}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all shadow-sm hover:shadow-md text-left min-h-[120px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Award className="text-teal-600 dark:text-teal-400" size={24} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Certificates</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generate and download certificates for completed activities
            </p>
          </div>
        </button>

        <button
          onClick={() => setShowProgressExport(true)}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all shadow-sm hover:shadow-md text-left min-h-[120px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Download className="text-teal-600 dark:text-teal-400" size={24} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Export Progress</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Export your learning progress as a JSON file
            </p>
          </div>
        </button>
      </div>

      {/* Certificates Modal */}
      {showCertificates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl relative">
            <button
              onClick={() => setShowCertificates(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Certificate Generator</h2>
              <CertificateGenerator />
            </div>
          </div>
        </div>
      )}

      {/* Progress Export Modal */}
      {showProgressExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl relative">
            <button
              onClick={() => setShowProgressExport(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Export Progress</h2>
              <ProgressExport onClose={() => setShowProgressExport(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressScreen;


import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import AssessmentHistory from '../components/AssessmentHistory';

const AssessmentHistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/family-hub"
            className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Family Hub
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Assessment History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your privacy practices progress over time
              </p>
            </div>
          </div>
        </div>

        {/* Assessment History Component */}
        <AssessmentHistory />
      </div>
    </div>
  );
};

export default AssessmentHistoryPage;


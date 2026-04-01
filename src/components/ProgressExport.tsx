import React, { useState } from 'react';
import { Download, Upload, FileText, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useToast } from '../contexts/ToastContext';

interface ProgressExportProps {
  onClose?: () => void;
}

const ProgressExport: React.FC<ProgressExportProps> = ({ onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState('');
  const [showImportForm, setShowImportForm] = useState(false);
  const { progress, exportProgress, importProgress, resetProgress } = useProgress();
  const { showSuccess, showError } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = exportProgress();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pandagarde-progress-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccess('Progress exported successfully!', 'Your learning progress has been saved to a file.');
    } catch (error) {
      console.error('Export error:', error);
      showError('Export failed', 'There was an error exporting your progress. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      showError('No data provided', 'Please paste your progress data to import.');
      return;
    }

    setIsImporting(true);
    try {
      const success = importProgress(importData);
      if (success) {
        showSuccess('Progress imported successfully!', 'Your learning progress has been restored.');
        setImportData('');
        setShowImportForm(false);
      } else {
        showError('Import failed', 'The data format is invalid. Please check your progress file.');
      }
    } catch (error) {
      console.error('Import error:', error);
      showError('Import failed', 'There was an error importing your progress. Please check the data format.');
    } finally {
      setIsImporting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      const data = exportProgress();
      await navigator.clipboard.writeText(data);
      showSuccess('Copied to clipboard!', 'Your progress data has been copied to the clipboard.');
    } catch (error) {
      console.error('Copy error:', error);
      showError('Copy failed', 'Could not copy to clipboard. Please try downloading instead.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {return;}

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  const overallProgress = progress.completedActivities.length;
  const totalActivities = 6; // Total number of activities
  const percentage = Math.round((overallProgress / totalActivities) * 100);

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="text-green-600" size={24} />
          Progress Export & Import
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Overview */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Current Progress
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Activities Completed</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {overallProgress}/{totalActivities}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Overall Progress</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {percentage}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Time Spent</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {progress.totalTimeSpent} minutes
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Achievements</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {progress.achievements.length}
                </span>
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Export Your Progress
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Download Progress File
                  </>
                )}
              </button>

              <button
                onClick={copyToClipboard}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Copy size={16} />
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>

        {/* Import Section */}
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Import Progress
            </h3>
            
            {!showImportForm ? (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Restore your progress from a previously exported file or clipboard data.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setShowImportForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload size={16} />
                    Import Progress Data
                  </button>

                  <label className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <Upload size={16} />
                    Upload Progress File
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paste Progress Data
                  </label>
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Paste your progress data here..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white h-32 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleImport}
                    disabled={isImporting || !importData.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    {isImporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Importing...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Import
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowImportForm(false);
                      setImportData('');
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Warning & Info */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Important Notes
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Export your progress regularly to avoid losing your achievements</li>
                  <li>• Importing will replace your current progress completely</li>
                  <li>• Keep your progress files safe - they contain your learning history</li>
                  <li>• Progress files are stored locally and never sent to external servers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reset Option */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
              Reset Progress
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              This will permanently delete all your progress and achievements. Make sure to export your progress first!
            </p>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
                  resetProgress();
                  showSuccess('Progress reset', 'All progress has been cleared.');
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              Reset All Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressExport;
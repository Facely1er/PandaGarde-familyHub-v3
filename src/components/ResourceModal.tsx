import React from 'react';
import { Download, Clock, X, ArrowRight } from 'lucide-react';

export interface ResourceModalPrimaryAction {
  label: string;
  onClick: () => void;
}

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  preview?: string[];
  duration?: string;
  gradeLevel?: string;
  downloadUrl?: string;
  onDownload?: () => void;
  /** When set, shown as the main action (e.g. navigate to a real page). Takes precedence over legacy Download when both exist. */
  primaryAction?: ResourceModalPrimaryAction;
  onComplete?: () => void;
  completeButtonText?: string;
  getGradeLevelColor?: (gradeLevel: string) => string;
}

const ResourceModal: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  preview,
  duration,
  gradeLevel,
  downloadUrl,
  onDownload,
  primaryAction,
  onComplete,
  completeButtonText = 'Mark as Used',
  getGradeLevelColor
}) => {
  if (!isOpen) {return null;}

  const showLegacyDownload = Boolean(downloadUrl && onDownload && !primaryAction);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: 'var(--card-color)' }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-lg mb-6" style={{ color: 'var(--gray-600)' }}>
              {description}
            </p>

            {preview && preview.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold mb-4" style={{ color: 'var(--primary)' }}>
                  What's Included:
                </h4>
                <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--gray-600)' }}>
                  {preview.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--gray-600)' }}>
                {duration && (
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {duration}
                  </span>
                )}
                {gradeLevel && getGradeLevelColor && (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getGradeLevelColor(gradeLevel)}`}>
                    {gradeLevel}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 justify-end">
                {primaryAction && (
                  <button
                    type="button"
                    onClick={primaryAction.onClick}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
                  >
                    <ArrowRight size={16} aria-hidden />
                    {primaryAction.label}
                  </button>
                )}
                {showLegacyDownload && (
                  <button
                    type="button"
                    onClick={onDownload}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
                  >
                    <Download size={16} aria-hidden />
                    Download
                  </button>
                )}
                {onComplete && (
                  <button
                    type="button"
                    onClick={onComplete}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                  >
                    {completeButtonText}
                  </button>
                )}
                {!onComplete && !primaryAction && !showLegacyDownload && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;


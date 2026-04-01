import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useOfflineStatus } from '../lib/offlineManager';

interface OfflineIndicatorProps {
  className?: string;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
  const syncStatus = useOfflineStatus();
  const [showDetails, setShowDetails] = useState(false);

  // Auto-hide after 3 seconds when coming back online
  useEffect(() => {
    if (syncStatus.isOnline && syncStatus.pendingActions.length === 0) {
      const timer = setTimeout(() => {
        setShowDetails(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [syncStatus.isOnline, syncStatus.pendingActions.length]);

  const getStatusColor = () => {
    if (!syncStatus.isOnline) {return 'text-red-600 bg-red-50 dark:bg-red-900/20';}
    if (syncStatus.syncInProgress) {return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';}
    if (syncStatus.pendingActions.length > 0) {return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';}
    return 'text-green-600 bg-green-50 dark:bg-green-900/20';
  };

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) {return WifiOff;}
    if (syncStatus.syncInProgress) {return RefreshCw;}
    if (syncStatus.pendingActions.length > 0) {return AlertCircle;}
    return CheckCircle;
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) {return 'Offline';}
    if (syncStatus.syncInProgress) {return 'Syncing...';}
    if (syncStatus.pendingActions.length > 0) {return `${syncStatus.pendingActions.length} pending`;}
    return 'Online';
  };

  const StatusIcon = getStatusIcon();

  // Only show indicator when there's something important to display
  // (offline, syncing, or pending actions - not just "Online")
  const shouldShow = !syncStatus.isOnline || syncStatus.syncInProgress || syncStatus.pendingActions.length > 0;

  if (!shouldShow) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Status Indicator */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${getStatusColor()}`}
        title={syncStatus.isOnline ? 'Online' : 'Offline'}
      >
        <StatusIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{getStatusText()}</span>
        {syncStatus.syncInProgress && (
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
      </button>

      {/* Details Panel */}
      {showDetails && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Connection Status
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            {/* Status Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <StatusIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {syncStatus.isOnline ? 'Connected' : 'Disconnected'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {syncStatus.isOnline ? 'All features available' : 'Limited offline features'}
                  </p>
                </div>
              </div>

              {/* Last Sync */}
              {syncStatus.lastSync > 0 && (
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Last Sync
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(syncStatus.lastSync).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Pending Actions */}
              {syncStatus.pendingActions.length > 0 && (
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Pending Actions
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {syncStatus.pendingActions.length} actions waiting to sync
                    </p>
                  </div>
                </div>
              )}

              {/* Sync Progress */}
              {syncStatus.syncInProgress && (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Syncing Data
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Updating your progress...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                {syncStatus.isOnline && syncStatus.pendingActions.length > 0 && (
                  <button
                    onClick={() => {
                      // Force sync
                      setShowDetails(false);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sync Now
                  </button>
                )}
                
                {!syncStatus.isOnline && (
                  <button
                    onClick={() => {
                      // Show offline content
                      setShowDetails(false);
                    }}
                    className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    View Offline Content
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator;
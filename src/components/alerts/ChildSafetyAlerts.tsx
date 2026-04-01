import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, RefreshCw, ExternalLink } from 'lucide-react';
import { childRSSAlertService, type ChildSafetyAlert } from '../../lib/rssAlertService';
import { childServiceCatalog } from '../../data/childServiceCatalog';

const ChildSafetyAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<ChildSafetyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const fetchedAlerts = await childRSSAlertService.processFeeds();
      // Filter to show only recent alerts (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentAlerts = fetchedAlerts.filter(alert => 
        new Date(alert.publishedDate) >= thirtyDaysAgo
      );
      
      setAlerts(recentAlerts.slice(0, 10)); // Show top 10
    } catch (error) {
      // Suppress errors in production to avoid CORS error noise
      const isProduction = typeof window !== 'undefined' && 
                          (window.location.hostname.includes('pandagarde.com') || 
                           window.location.hostname.includes('vercel.app') ||
                           window.location.hostname.includes('netlify.app'));
      if (!isProduction) {
        console.error('Error loading alerts:', error);
      }
      // Silently fail - alerts will be empty array
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700';
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">Loading safety alerts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Child Safety Alerts
        </h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No recent safety alerts. Your child's services appear to be safe.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const relatedServices = alert.relatedServices
              .map(id => childServiceCatalog.find(s => s.id === id))
              .filter(Boolean);

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5" />
                      <h3 className="font-semibold">{alert.title}</h3>
                      <span className="px-2 py-1 text-xs font-medium rounded capitalize">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm mb-2 line-clamp-2">{alert.description}</p>
                    {relatedServices.length > 0 && (
                      <div className="text-xs mt-2">
                        <span className="font-medium">Related services: </span>
                        {relatedServices.map(s => s?.name).filter(Boolean).join(', ')}
                      </div>
                    )}
                    <div className="text-xs mt-2 opacity-75">
                      {new Date(alert.publishedDate).toLocaleDateString()}
                    </div>
                  </div>
                  {alert.link && (
                    <a
                      href={alert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 p-2 hover:bg-white/20 rounded transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChildSafetyAlerts;


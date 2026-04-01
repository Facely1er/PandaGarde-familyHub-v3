import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  AlertTriangle, 
  Shield, 
  Info, 
  CheckCircle, 
  X, 
  Filter,
  RefreshCw,
  ExternalLink,
  Settings
} from 'lucide-react';
import { useFamily } from '../contexts/FamilyContext';
import { childServiceNotificationManager, type ServiceNotification } from '../lib/serviceNotifications';
import { getServiceLogoUrlWithBrandColor, hasServiceLogo } from '../utils/serviceLogos';
import { childServiceCatalog, getServiceById } from '../data/childServiceCatalog';
import { calculatePrivacyExposureIndex, getExposureLevel } from '../lib/privacyExposureIndex';

interface ServiceNotificationCenterProps {
  compact?: boolean;
  maxNotifications?: number;
  showSettings?: boolean;
}

const ServiceNotificationCenter: React.FC<ServiceNotificationCenterProps> = ({
  compact = false,
  maxNotifications = 10,
  showSettings = true
}) => {
  const { familyMembers } = useFamily();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<ServiceNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Get all service IDs from family members
  const familyServiceIds = useMemo(() => {
    const serviceIds = new Set<string>();
    familyMembers.forEach(member => {
      // Services may be stored on member object or accessed via localStorage
      // Check both possible locations
      const memberServices = (member as any).services || [];
      memberServices.forEach((service: any) => {
        if (service?.serviceId) {
          serviceIds.add(service.serviceId);
        }
      });
    });
    return Array.from(serviceIds);
  }, [familyMembers]);

  // Load dismissed notifications on mount
  useEffect(() => {
    try {
      const dismissed = JSON.parse(
        localStorage.getItem('pandagarde_dismissed_notifications') || '[]'
      );
      setDismissedIds(new Set(dismissed));
    } catch (error) {
      console.warn('Error loading dismissed notifications:', error);
    }
  }, []);

  // Load notifications
  const loadNotifications = async () => {
    if (familyServiceIds.length === 0) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const fetchedNotifications = await childServiceNotificationManager.getNotificationsForServicesAsync(
        familyServiceIds,
        getNotificationPreferences()
      );
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [familyServiceIds]);

  // Get notification preferences from localStorage
  const getNotificationPreferences = (): Record<string, boolean> => {
    try {
      return JSON.parse(
        localStorage.getItem('pandagarde_notification_prefs') || '{}'
      );
    } catch {
      return {};
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  // Handle dismiss
  const handleDismiss = (notificationId: string) => {
    setDismissedIds(prev => new Set([...prev, notificationId]));
    // Save dismissed notifications
    try {
      const dismissed = JSON.parse(
        localStorage.getItem('pandagarde_dismissed_notifications') || '[]'
      );
      dismissed.push(notificationId);
      localStorage.setItem('pandagarde_dismissed_notifications', JSON.stringify(dismissed));
    } catch (error) {
      console.warn('Error saving dismissed notification:', error);
    }
  };

  // Handle notification action
  const handleAction = (notification: ServiceNotification) => {
    if (notification.action?.route) {
      navigate(notification.action.route);
    } else if (notification.action?.url) {
      window.open(notification.action.url, '_blank', 'noopener,noreferrer');
    } else if (notification.serviceId) {
      navigate(`/service-catalog?service=${notification.serviceId}`);
    }
  };

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter(n => !dismissedIds.has(n.id))
      .filter(n => {
        if (filter !== 'all' && n.priority !== filter) {return false;}
        if (categoryFilter !== 'all' && n.category !== categoryFilter) {return false;}
        return true;
      })
      .slice(0, maxNotifications);
  }, [notifications, dismissedIds, filter, categoryFilter, maxNotifications]);

  // Get priority icon and color
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          icon: AlertTriangle,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800'
        };
      case 'medium':
        return {
          icon: Info,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800'
        };
      default:
        return {
          icon: Bell,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
    }
  };

  // Get category icon
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'breach':
        return AlertTriangle;
      case 'safety':
        return Shield;
      case 'policy':
        return Info;
      default:
        return Bell;
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <RefreshCw className="h-6 w-6 mx-auto animate-spin text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading notifications...</p>
      </div>
    );
  }

  if (compact) {
    const unreadCount = filteredNotifications.length;
    if (unreadCount === 0) {return null;}

    return (
      <Link
        to="/safety-alerts"
        className="relative inline-flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
          {unreadCount} Notification{unreadCount !== 1 ? 's' : ''}
        </span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Link>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Bell className="h-6 w-6" />
            <span>Service Notifications</span>
            {filteredNotifications.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                {filteredNotifications.length}
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Alerts about privacy and safety updates for your family's services
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh notifications"
          >
            <RefreshCw className={`h-5 w-5 text-gray-600 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          {showSettings && (
            <Link
              to="/family-hub/settings"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Notification settings"
            >
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      {notifications.length > 0 && (
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="breach">Data Breaches</option>
            <option value="safety">Safety Updates</option>
            <option value="policy">Policy Changes</option>
            <option value="privacy">Privacy</option>
            <option value="feature">New Features</option>
          </select>
        </div>
      )}

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {familyServiceIds.length === 0
              ? "Add services to your family members to receive notifications."
              : "No notifications at this time. Your family's services appear to be safe."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const service = getServiceById(notification.serviceId);
            const priorityStyle = getPriorityStyle(notification.priority);
            const PriorityIcon = priorityStyle.icon;
            const CategoryIcon = getCategoryIcon(notification.category);

            return (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${priorityStyle.bgColor} ${priorityStyle.borderColor} border-2`}
              >
                <div className="flex items-start space-x-3">
                  {/* Service Logo */}
                  {service && hasServiceLogo(service.id) ? (
                    <img
                      src={getServiceLogoUrlWithBrandColor(service.id) || undefined}
                      alt={`${service.name} logo`}
                      className="w-10 h-10 rounded-lg object-contain flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <CategoryIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                  )}

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <PriorityIcon className={`h-5 w-5 ${priorityStyle.color} flex-shrink-0`} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleDismiss(notification.id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                        title="Dismiss notification"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {notification.message}
                    </p>

                    {/* Privacy Exposure Index */}
                    {service && (() => {
                      const exposureIndex = calculatePrivacyExposureIndex(service.id);
                      const exposureLevel = getExposureLevel(exposureIndex);
                      if (exposureIndex !== null) {
                        return (
                          <div className="mb-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Privacy Exposure Index:
                              </span>
                              <span className={`text-xs font-semibold ${exposureLevel.textColor}`}>
                                {exposureIndex}/100 ({exposureLevel.level})
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${exposureLevel.barColor}`}
                                style={{ width: `${exposureIndex}%` }}
                              />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{notification.serviceName}</span>
                        <span>•</span>
                        <span>{new Date(notification.timestamp).toLocaleDateString()}</span>
                        {notification.category && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{notification.category}</span>
                          </>
                        )}
                      </div>

                      {notification.action && (
                        <button
                          onClick={() => handleAction(notification)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <span>{notification.action.label}</span>
                          {notification.action.url ? (
                            <ExternalLink className="h-3 w-3" />
                          ) : (
                            <CheckCircle className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServiceNotificationCenter;


/**
 * Service Notification Manager for Children's Services
 * Provides parent-focused notifications about privacy and safety updates
 */

import { childServiceCatalog, type ChildService } from '../data/childServiceCatalog';
import { childRSSAlertService } from './rssAlertService';
import { calculatePrivacyExposureIndex } from './privacyExposureIndex';

export interface ServiceNotification {
  id: string;
  serviceId: string;
  serviceName: string;
  type: string;
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  action?: {
    label: string;
    url?: string;
    route?: string;
  };
  category?: 'safety' | 'privacy' | 'policy' | 'breach' | 'feature';
}

export class ChildServiceNotificationManager {
  private notificationTypes = {
    POLICY_UPDATE: 'policy_update',
    SAFETY_UPDATE: 'safety_update',
    PRIVACY_CHANGE: 'privacy_change',
    DATA_BREACH: 'data_breach',
    NEW_FEATURE: 'new_feature',
    AGE_RESTRICTION_CHANGE: 'age_restriction_change',
    PARENTAL_CONTROL_UPDATE: 'parental_control_update',
    ACTION_REMINDER: 'action_reminder'
  };

  /**
   * Get notifications for selected services (async version with RSS support)
   */
  async getNotificationsForServicesAsync(selectedServiceIds: string[], notificationPrefs: Record<string, boolean> = {}): Promise<ServiceNotification[]> {
    const notifications: ServiceNotification[] = [];
    
    // Get RSS-based notifications
    const rssNotifications = await this.getNotificationsFromRSS(selectedServiceIds);
    notifications.push(...rssNotifications);

    // Get other notifications
    const otherNotifications = this.getNotificationsForServices(selectedServiceIds, notificationPrefs);
    notifications.push(...otherNotifications);

    // Remove duplicates and sort
    const uniqueNotifications = Array.from(
      new Map(notifications.map(n => [n.id, n])).values()
    );

    return uniqueNotifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) {return priorityDiff;}
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  /**
   * Get notifications for selected services (synchronous version)
   */
  getNotificationsForServices(selectedServiceIds: string[], notificationPrefs: Record<string, boolean> = {}): ServiceNotification[] {
    const notifications: ServiceNotification[] = [];
    
    selectedServiceIds.forEach(serviceId => {
      // Skip if notifications disabled
      if (notificationPrefs[serviceId] === false) {return;}

      const service = childServiceCatalog.find(s => s.id === serviceId);
      if (!service) {return;}

      // Check for policy updates
      const policyUpdate = this.getLastPolicyUpdate(serviceId);
      if (policyUpdate && this.isRecent(policyUpdate, 30)) {
        notifications.push({
          id: `${serviceId}-policy-${policyUpdate}`,
          serviceId,
          serviceName: service.name,
          type: this.notificationTypes.POLICY_UPDATE,
          title: `${service.name} Privacy Policy Updated`,
          message: `${service.name} has updated their privacy policy. Review the changes to understand how your child's data is handled.`,
          priority: 'medium',
          timestamp: policyUpdate,
          category: 'policy',
          action: {
            label: 'Review Policy',
            url: service.website ? `${service.website}/privacy` : undefined
          }
        });
      }

      // Check for safety updates
      const safetyUpdate = this.getSafetyUpdate(serviceId);
      if (safetyUpdate) {
        notifications.push({
          id: `${serviceId}-safety-${safetyUpdate.timestamp}`,
          serviceId,
          serviceName: service.name,
          type: this.notificationTypes.SAFETY_UPDATE,
          title: safetyUpdate.title || `Safety Update: ${service.name}`,
          message: safetyUpdate.message || `${service.name} has made safety-related changes that may affect your child.`,
          priority: safetyUpdate.priority || 'high',
          timestamp: safetyUpdate.timestamp,
          category: 'safety',
          action: {
            label: 'Learn More',
            route: `/guides/safety-net`
          }
        });
      }

      // Check for data breaches
      const breach = this.getRecentDataBreach(serviceId);
      if (breach) {
        // Data breaches are always high priority, but weight by exposure index
        const exposureIndex = calculatePrivacyExposureIndex(serviceId);
        let priority: 'high' | 'medium' | 'low' = 'high';
        // Breaches for high-exposure services are critical
        if (exposureIndex !== null && exposureIndex >= 70) {
          priority = 'high'; // Already high, but could add 'critical' level in future
        }

        notifications.push({
          id: `${serviceId}-breach-${breach.timestamp}`,
          serviceId,
          serviceName: service.name,
          type: this.notificationTypes.DATA_BREACH,
          title: `Data Breach Alert: ${service.name}`,
          message: breach.message || `A data breach has been reported affecting ${service.name}. Take immediate action to secure your child's account.`,
          priority,
          timestamp: breach.timestamp,
          category: 'breach',
          action: {
            label: 'Secure Account',
            route: `/guides/emergency-safety`
          }
        });
      }

      // Check for incomplete parent actions
      const incompleteActions = this.getIncompleteActions(serviceId);
      if (incompleteActions.length > 0) {
        notifications.push({
          id: `${serviceId}-actions-${Date.now()}`,
          serviceId,
          serviceName: service.name,
          type: this.notificationTypes.ACTION_REMINDER,
          title: `Recommended Actions for ${service.name}`,
          message: `You have ${incompleteActions.length} recommended privacy action${incompleteActions.length > 1 ? 's' : ''} pending for ${service.name}.`,
          priority: 'medium',
          timestamp: new Date().toISOString(),
          category: 'privacy',
          action: {
            label: 'View Actions',
            route: `/service-catalog?service=${serviceId}`
          }
        });
      }
    });

    return notifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Get incomplete parent actions for a service
   */
  private getIncompleteActions(serviceId: string): string[] {
    try {
      const completedActions = JSON.parse(
        localStorage.getItem('pandagarde_completed_actions') || '{}'
      );
      
      const service = childServiceCatalog.find(s => s.id === serviceId);
      if (!service || !service.parentTips) {return [];}

      const serviceCompleted = completedActions[serviceId] || [];
      
      return service.parentTips
        .map((tip, index) => `${serviceId}-tip-${index}`)
        .filter(actionId => !serviceCompleted.includes(actionId));
    } catch (error) {
      console.warn('Error reading completed actions:', error);
      return [];
    }
  }

  /**
   * Mark an action as completed
   */
  markActionCompleted(serviceId: string, actionId: string): void {
    try {
      const completedActions = JSON.parse(
        localStorage.getItem('pandagarde_completed_actions') || '{}'
      );
      
      if (!completedActions[serviceId]) {
        completedActions[serviceId] = [];
      }
      
      if (!completedActions[serviceId].includes(actionId)) {
        completedActions[serviceId].push(actionId);
        localStorage.setItem('pandagarde_completed_actions', JSON.stringify(completedActions));
      }
    } catch (error) {
      console.warn('Error saving completed action:', error);
    }
  }

  /**
   * Get notifications from RSS feeds for services
   */
  async getNotificationsFromRSS(selectedServiceIds: string[]): Promise<ServiceNotification[]> {
    try {
      // Use statically imported RSS alert service
      const alerts = await childRSSAlertService.processFeeds();
      
      const notifications: ServiceNotification[] = [];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      alerts
        .filter(alert => {
          // Only include alerts from last 30 days
          const alertDate = new Date(alert.publishedDate);
          if (alertDate < thirtyDaysAgo) {return false;}

          // Check if alert relates to any selected service
          return alert.relatedServices.some(serviceId => selectedServiceIds.includes(serviceId));
        })
        .slice(0, 10) // Limit to 10 most recent
        .forEach(alert => {
          alert.relatedServices.forEach(serviceId => {
            if (!selectedServiceIds.includes(serviceId)) {return;}

            const service = childServiceCatalog.find(s => s.id === serviceId);
            if (!service) {return;}

            const notificationType = alert.category === 'data-breach' 
              ? this.notificationTypes.DATA_BREACH
              : alert.severity === 'critical' || alert.severity === 'high'
              ? this.notificationTypes.SAFETY_UPDATE
              : this.notificationTypes.POLICY_UPDATE;

            notifications.push({
              id: `rss-${alert.id}-${serviceId}`,
              serviceId,
              serviceName: service.name,
              type: notificationType,
              title: alert.title,
              message: alert.description || alert.title,
              priority: alert.severity === 'critical' ? 'high' : alert.severity === 'high' ? 'medium' : 'low',
              timestamp: alert.publishedDate,
              category: alert.category === 'data-breach' ? 'breach' : 'safety',
              action: alert.link ? {
                label: 'View Alert',
                url: alert.link
              } : undefined
            });
          });
        });

      return notifications;
    } catch (error) {
      // Suppress errors in production to avoid CORS error noise
      const isProduction = typeof window !== 'undefined' && 
                          (window.location.hostname.includes('pandagarde.com') || 
                           window.location.hostname.includes('vercel.app') ||
                           window.location.hostname.includes('netlify.app'));
      if (!isProduction) {
        console.warn('Error fetching RSS notifications:', error);
      }
      return [];
    }
  }

  // Data retrieval methods (would connect to API/database in production)
  private getLastPolicyUpdate(serviceId: string): string | null {
    // In production: fetch from API that monitors policy changes
    // For now, check localStorage for manually added updates
    try {
      const updates = JSON.parse(
        localStorage.getItem('pandagarde_policy_updates') || '{}'
      );
      return updates[serviceId] || null;
    } catch {
      return null;
    }
  }

  private getSafetyUpdate(serviceId: string): { title?: string; message?: string; priority?: 'high' | 'medium' | 'low'; timestamp: string } | null {
    // In production: check safety update feeds
    // For now, check localStorage for manually added updates
    try {
      const updates = JSON.parse(
        localStorage.getItem('pandagarde_safety_updates') || '{}'
      );
      return updates[serviceId] || null;
    } catch {
      return null;
    }
  }

  private getRecentDataBreach(serviceId: string): { message?: string; timestamp: string } | null {
    // In production: check breach databases
    // For now, check localStorage for manually added breaches
    try {
      const breaches = JSON.parse(
        localStorage.getItem('pandagarde_data_breaches') || '{}'
      );
      return breaches[serviceId] || null;
    } catch {
      return null;
    }
  }

  private isRecent(date: string, days: number): boolean {
    const diffTime = Math.abs(new Date().getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  }
}

export const childServiceNotificationManager = new ChildServiceNotificationManager();


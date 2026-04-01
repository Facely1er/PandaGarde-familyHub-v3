// Service Worker Manager
interface ServiceWorkerConfig {
  enabled: boolean;
  updateInterval: number;
  cacheStrategy: 'aggressive' | 'conservative';
}

class ServiceWorkerManager {
  private config: ServiceWorkerConfig;
  private registration: ServiceWorkerRegistration | null = null;
  private updateCheckInterval: number | null = null;

  constructor(config: ServiceWorkerConfig) {
    this.config = config;
  }

  // Register service worker
  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!this.config.enabled || !('serviceWorker' in navigator)) {
      console.log('Service Worker not supported or disabled');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered:', this.registration);

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdate();
      });

      // Start periodic update checks
      this.startUpdateChecks();

      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  // Handle service worker updates
  private handleUpdate() {
    if (!this.registration) {return;}

    const newWorker = this.registration.installing;
    if (!newWorker) {return;}

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New service worker is available
        this.showUpdateConfirmation();
      }
    });
  }

  // Show update notification to user
  private showUpdateConfirmation() {
    const shouldUpdate = confirm(
      'A new version of Privacy Panda is available. Would you like to update now?'
    );

    if (shouldUpdate) {
      this.updateServiceWorker();
    }
  }

  // Update service worker
  private async updateServiceWorker() {
    if (!this.registration) {return;}

    try {
      const newWorker = this.registration.waiting;
      if (newWorker) {
        newWorker.postMessage({ type: 'SKIP_WAITING' });
        
        // Reload page after update
        window.location.reload();
      }
    } catch (error) {
      console.error('Service Worker update failed:', error);
    }
  }

  // Start periodic update checks
  private startUpdateChecks() {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
    }

    this.updateCheckInterval = window.setInterval(() => {
      this.checkForUpdates();
    }, this.config.updateInterval);
  }

  // Check for service worker updates
  private async checkForUpdates() {
    if (!this.registration) {return;}

    try {
      await this.registration.update();
    } catch (error) {
      console.error('Update check failed:', error);
    }
  }

  // Unregister service worker
  async unregister(): Promise<boolean> {
    if (!this.registration) {return false;}

    try {
      const result = await this.registration.unregister();
      
      if (this.updateCheckInterval) {
        clearInterval(this.updateCheckInterval);
        this.updateCheckInterval = null;
      }

      console.log('Service Worker unregistered:', result);
      return result;
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      return false;
    }
  }

  // Clear all caches
  async clearCaches(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    } catch (error) {
      console.error('Cache clearing failed:', error);
    }
  }

  // Get cache storage info
  async getCacheInfo(): Promise<{ name: string; size: number }[]> {
    try {
      const cacheNames = await caches.keys();
      const cacheInfo = await Promise.all(
        cacheNames.map(async (name) => {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          const size = keys.reduce((total, request) => {
            return total + (request.url.length * 2); // Rough estimate
          }, 0);
          
          return { name, size };
        })
      );
      
      return cacheInfo;
    } catch (error) {
      console.error('Cache info retrieval failed:', error);
      return [];
    }
  }

  // Request background sync
  async requestBackgroundSync(tag: string): Promise<void> {
    if (!this.registration) {return;}

    try {
      await this.registration.sync.register(tag);
      console.log('Background sync registered:', tag);
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }

  // Cache tool assets for offline use
  async cacheToolAssets(toolId: string): Promise<void> {
    try {
      await this.sendMessage({
        type: 'CACHE_TOOL_ASSETS',
        toolId
      });
      console.log(`Tool assets cached for: ${toolId}`);
    } catch (error) {
      console.error('Tool asset caching failed:', error);
    }
  }

  // Cache mission content for offline use
  async cacheMissionContent(missionId: string): Promise<void> {
    try {
      await this.sendMessage({
        type: 'CACHE_MISSION_CONTENT',
        missionId
      });
      console.log(`Mission content cached for: ${missionId}`);
    } catch (error) {
      console.error('Mission content caching failed:', error);
    }
  }

  // Show update notification
  async showUpdateNotification(message?: string): Promise<void> {
    try {
      await this.sendMessage({
        type: 'SHOW_UPDATE_NOTIFICATION',
        message
      });
    } catch (error) {
      console.error('Update notification failed:', error);
    }
  }

  // Send message to service worker
  async sendMessage(message: unknown): Promise<unknown> {
    if (!this.registration || !this.registration.active) {
      throw new Error('No active service worker');
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      this.registration!.active!.postMessage(message, [messageChannel.port2]);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        reject(new Error('Message timeout'));
      }, 5000);
    });
  }

  // Check if service worker is supported
  static isSupported(): boolean {
    return 'serviceWorker' in navigator;
  }

  // Check if app is running in PWA mode
  static isPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  }

  // Get service worker status
  getStatus(): 'registered' | 'unregistered' | 'error' | 'unsupported' {
    if (!ServiceWorkerManager.isSupported()) {
      return 'unsupported';
    }
    
    if (this.registration) {
      return 'registered';
    }
    
    return 'unregistered';
  }
}

// Default configuration
// DISABLED in development to prevent cache issues
const defaultConfig: ServiceWorkerConfig = {
  enabled: import.meta.env.MODE === 'production' && import.meta.env.VITE_SW_ENABLED !== 'false',
  updateInterval: 24 * 60 * 60 * 1000, // 24 hours
  cacheStrategy: 'conservative',
};

// Create singleton instance
export const serviceWorkerManager = new ServiceWorkerManager(defaultConfig);

// Initialize service worker
export const initServiceWorker = async (): Promise<void> => {
  try {
    await serviceWorkerManager.register();
  } catch (error) {
    console.error('Service Worker initialization failed:', error);
  }
};

// Utility functions
export const clearAllCaches = () => serviceWorkerManager.clearCaches();
export const getCacheInfo = () => serviceWorkerManager.getCacheInfo();
export const requestBackgroundSync = (tag: string) => serviceWorkerManager.requestBackgroundSync(tag);
export const sendMessageToSW = (message: unknown) => serviceWorkerManager.sendMessage(message);
export const cacheToolAssets = (toolId: string) => serviceWorkerManager.cacheToolAssets(toolId);
export const cacheMissionContent = (missionId: string) => serviceWorkerManager.cacheMissionContent(missionId);
export const showUpdateNotification = (message?: string) => serviceWorkerManager.showUpdateNotification(message);

// Export types
export type { ServiceWorkerConfig };
export { ServiceWorkerManager };
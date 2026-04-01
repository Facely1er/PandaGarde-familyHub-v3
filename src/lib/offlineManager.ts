// Advanced Offline Manager for Privacy Panda
import React from 'react';

interface OfflineData {
  stories: unknown[];
  activities: unknown[];
  resources: unknown[];
  userProgress: unknown[];
  lastSync: number;
}

interface SyncStatus {
  isOnline: boolean;
  lastSync: number;
  pendingActions: unknown[];
  syncInProgress: boolean;
}

class OfflineManager {
  private data: OfflineData = {
    stories: [],
    activities: [],
    resources: [],
    userProgress: [],
    lastSync: 0,
  };

  private syncStatus: SyncStatus = {
    isOnline: navigator.onLine,
    lastSync: 0,
    pendingActions: [],
    syncInProgress: false,
  };

  private listeners: Set<(status: SyncStatus) => void> = new Set();

  constructor() {
    this.initializeOfflineSupport();
    this.setupEventListeners();
    this.loadOfflineData();
  }

  // Initialize offline support
  private initializeOfflineSupport() {
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      console.log('Service Worker supported - offline features enabled');
    } else {
      console.log('Service Worker not supported - limited offline features');
    }

    // Check if IndexedDB is supported
    if ('indexedDB' in window) {
      console.log('IndexedDB supported - data persistence enabled');
    } else {
      console.log('IndexedDB not supported - using localStorage fallback');
    }
  }

  // Setup event listeners
  private setupEventListeners() {
    // Online/offline status
    window.addEventListener('online', () => {
      this.syncStatus.isOnline = true;
      this.notifyListeners();
      this.syncPendingActions();
    });

    window.addEventListener('offline', () => {
      this.syncStatus.isOnline = false;
      this.notifyListeners();
    });

    // Visibility change - sync when tab becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.syncStatus.isOnline) {
        this.syncPendingActions();
      }
    });

    // Periodic sync
    setInterval(() => {
      if (this.syncStatus.isOnline && this.syncStatus.pendingActions.length > 0) {
        this.syncPendingActions();
      }
    }, 30000); // Every 30 seconds
  }

  // Load offline data from storage
  private async loadOfflineData() {
    try {
      const stored = localStorage.getItem('pandagarde_offline_data');
      if (stored) {
        this.data = JSON.parse(stored);
        this.syncStatus.lastSync = this.data.lastSync;
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }

  // Save offline data to storage
  private async saveOfflineData() {
    try {
      this.data.lastSync = Date.now();
      localStorage.setItem('pandagarde_offline_data', JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  // Cache content for offline use
  async cacheContent(type: 'stories' | 'activities' | 'resources', content: unknown[]) {
    this.data[type] = content;
    await this.saveOfflineData();
    
    console.log(`Cached ${content.length} ${type} for offline use`);
  }

  // Get cached content
  getCachedContent(type: 'stories' | 'activities' | 'resources'): unknown[] {
    return this.data[type] || [];
  }

  // Save user progress offline
  async saveProgressOffline(progress: Record<string, unknown>) {
    this.data.userProgress.push({
      ...progress,
      timestamp: Date.now(),
      synced: false,
    });
    
    await this.saveOfflineData();
    
    // Try to sync immediately if online
    if (this.syncStatus.isOnline) {
      this.syncPendingActions();
    }
  }

  // Queue action for later sync
  async queueAction(action: {
    type: string;
    data: unknown;
    timestamp?: number;
  }) {
    const queuedAction = {
      ...action,
      timestamp: action.timestamp || Date.now(),
      id: Math.random().toString(36).substr(2, 9),
    };

    this.syncStatus.pendingActions.push(queuedAction);
    await this.saveOfflineData();
    
    console.log(`Queued action: ${action.type}`);
    
    // Try to sync immediately if online
    if (this.syncStatus.isOnline) {
      this.syncPendingActions();
    }
  }

  // Sync pending actions
  async syncPendingActions() {
    if (this.syncStatus.syncInProgress || !this.syncStatus.isOnline) {
      return;
    }

    this.syncStatus.syncInProgress = true;
    this.notifyListeners();

    try {
      const actionsToSync = [...this.syncStatus.pendingActions];
      
      for (const action of actionsToSync) {
        try {
          await this.syncAction(action);
          
          // Remove successful action from pending
          this.syncStatus.pendingActions = this.syncStatus.pendingActions.filter(
            a => a.id !== action.id
          );
        } catch (error) {
          console.error(`Failed to sync action ${action.type}:`, error);
          // Keep failed actions for retry
        }
      }

      this.syncStatus.lastSync = Date.now();
      await this.saveOfflineData();
      
      console.log(`Synced ${actionsToSync.length} actions`);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncStatus.syncInProgress = false;
      this.notifyListeners();
    }
  }

  // Sync individual action
  private async syncAction(action: { type: string; data: unknown }) {
    // This would integrate with your actual API
    // For now, we'll simulate API calls
    
    switch (action.type) {
      case 'save_progress':
        console.log('Syncing progress:', action.data);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        break;
        
      case 'update_profile':
        console.log('Syncing profile:', action.data);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        break;
        
      case 'complete_activity':
        console.log('Syncing activity completion:', action.data);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        break;
        
      default:
        console.log('Unknown action type:', action.type);
    }
  }

  // Get sync status
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  // Subscribe to sync status changes
  subscribe(listener: (status: SyncStatus) => void) {
    this.listeners.add(listener);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notify listeners of status changes
  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.syncStatus);
      } catch (error) {
        console.error('Error in sync status listener:', error);
      }
    });
  }

  // Check if content is available offline
  isContentAvailableOffline(type: string, id: string): boolean {
    const cachedContent = this.getCachedContent(type as 'stories' | 'activities' | 'resources');
    return cachedContent.some((item: unknown) => (item as { id?: string }).id === id);
  }

  // Get offline storage usage
  getStorageUsage(): { used: number; available: number } {
    try {
      const data = localStorage.getItem('pandagarde_offline_data');
      const used = data ? new Blob([data]).size : 0;
      
      // Estimate available space (5MB limit for localStorage)
      const available = 5 * 1024 * 1024 - used;
      
      return { used, available };
    } catch {
      return { used: 0, available: 0 };
    }
  }

  // Clear offline data
  async clearOfflineData() {
    this.data = {
      stories: [],
      activities: [],
      resources: [],
      userProgress: [],
      lastSync: 0,
    };
    
    this.syncStatus.pendingActions = [];
    this.syncStatus.lastSync = 0;
    
    await this.saveOfflineData();
    
    console.log('Offline data cleared');
  }

  // Force sync
  async forceSync() {
    if (this.syncStatus.isOnline) {
      await this.syncPendingActions();
    } else {
      throw new Error('Cannot sync while offline');
    }
  }
}

// Create singleton instance
export const offlineManager = new OfflineManager();

// React hook for offline status
export const useOfflineStatus = () => {
  const [status, setStatus] = React.useState(offlineManager.getSyncStatus());

  React.useEffect(() => {
    const unsubscribe = offlineManager.subscribe(setStatus);
    return unsubscribe;
  }, []);

  return status;
};

// Utility functions
export const cacheContentForOffline = (type: 'stories' | 'activities' | 'resources', content: unknown[]) => {
  return offlineManager.cacheContent(type, content);
};

export const saveProgressOffline = (progress: Record<string, unknown>) => {
  return offlineManager.saveProgressOffline(progress);
};

export const queueActionForSync = (action: { type: string; data: unknown }) => {
  return offlineManager.queueAction(action);
};

export const isContentAvailableOffline = (type: string, id: string) => {
  return offlineManager.isContentAvailableOffline(type, id);
};

export const getOfflineStorageUsage = () => {
  return offlineManager.getStorageUsage();
};

export const clearOfflineData = () => {
  return offlineManager.clearOfflineData();
};

export const forceSync = () => {
  return offlineManager.forceSync();
};
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  trackPageView,
  trackEvent,
  trackContentEngagement,
  trackPerformance,
  trackError as analyticsTrackError,
  trackUserAction as analyticsTrackUserAction,
  setUserId,
  setUserProperties,
  AnalyticsEvents,
  isAnalyticsEnabled
} from '../lib/analytics';

// Hook for automatic page tracking
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (isAnalyticsEnabled()) {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);
};

// Hook for user-specific analytics
export const useUserAnalytics = (userId?: string, userProperties?: Record<string, unknown>) => {
  useEffect(() => {
    if (isAnalyticsEnabled() && userId) {
      setUserId(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (isAnalyticsEnabled() && userProperties) {
      setUserProperties(userProperties);
    }
  }, [userProperties]);
};

// Hook for content engagement tracking
export const useContentTracking = () => {
  const trackStoryEngagement = useCallback((
    action: 'start' | 'complete',
    storyId?: string,
    details?: Record<string, unknown>
  ) => {
    trackContentEngagement('story', action, storyId, details);
  }, []);

  const trackActivityEngagement = useCallback((
    action: 'start' | 'complete',
    activityId?: string,
    details?: Record<string, unknown>
  ) => {
    trackContentEngagement('activity', action, activityId, details);
  }, []);

  const trackResourceEngagement = useCallback((
    action: 'view' | 'download',
    resourceId?: string,
    details?: Record<string, unknown>
  ) => {
    trackContentEngagement('resource', action, resourceId, details);
  }, []);

  const trackGuideEngagement = useCallback((
    action: 'view',
    guideId?: string,
    details?: Record<string, unknown>
  ) => {
    trackContentEngagement('guide', action, guideId, details);
  }, []);

  return {
    trackStoryEngagement,
    trackActivityEngagement,
    trackResourceEngagement,
    trackGuideEngagement,
  };
};

// Hook for performance tracking
export const usePerformanceTracking = () => {
  const trackPageLoad = useCallback((loadTime: number) => {
    trackPerformance('page_load_time', loadTime);
  }, []);

  const trackInteraction = useCallback((interactionType: string, responseTime: number) => {
    trackPerformance(`${interactionType}_response_time`, responseTime);
  }, []);

  const trackResourceLoad = useCallback((resourceType: string, loadTime: number) => {
    trackPerformance(`${resourceType}_load_time`, loadTime);
  }, []);

  return {
    trackPageLoad,
    trackInteraction,
    trackResourceLoad,
  };
};

// Hook for error tracking
export const useErrorTracking = () => {
  const trackError = useCallback((error: Error, context?: Record<string, unknown>) => {
    analyticsTrackError(error, context);
  }, []);

  return { trackError };
};

// Hook for general analytics actions
export const useAnalytics = () => {
  const trackUserAction = useCallback((action: string, details?: Record<string, unknown>) => {
    analyticsTrackUserAction(action, details);
  }, []);

  const trackCustomEvent = useCallback((eventName: string, parameters?: Record<string, unknown>) => {
    trackEvent(eventName, parameters);
  }, []);

  const trackNavigation = useCallback((destination: string, method: string = 'click') => {
    trackEvent(AnalyticsEvents.NAVIGATION_CLICK, {
      destination,
      method,
    });
  }, []);

  const trackSearch = useCallback((query: string, resultsCount?: number) => {
    trackEvent(AnalyticsEvents.SEARCH_PERFORMED, {
      search_query: query,
      results_count: resultsCount,
    });
  }, []);

  return {
    trackUserAction,
    trackCustomEvent,
    trackNavigation,
    trackSearch,
  };
};
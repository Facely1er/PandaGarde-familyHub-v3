// GA4 analytics via the global gtag initialized in index.html (G-VEQXJHYNHG).

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = 'G-VEQXJHYNHG';

export const AnalyticsEvents = {
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_PROFILE_UPDATE: 'user_profile_update',
  PAGE_VIEW: 'page_view',
  NAVIGATION_CLICK: 'navigation_click',
  SEARCH_PERFORMED: 'search_performed',
  STORY_STARTED: 'story_started',
  STORY_COMPLETED: 'story_completed',
  ACTIVITY_STARTED: 'activity_started',
  ACTIVITY_COMPLETED: 'activity_completed',
  CERTIFICATE_GENERATED: 'certificate_generated',
  DOWNLOAD_INITIATED: 'download_initiated',
  FAMILY_CREATED: 'family_created',
  CHILD_ADDED: 'child_added',
  PROGRESS_VIEWED: 'progress_viewed',
  FAMILY_MEMBER_ADDED: 'family_member_added',
  FAMILY_MEMBER_REMOVED: 'family_member_removed',
  CHILD_PROGRESS_VIEWED: 'child_progress_viewed',
  FAMILY_GOAL_ADDED: 'family_goal_added',
  FAMILY_GOAL_COMPLETED: 'family_goal_completed',
  FEEDBACK_SUBMITTED: 'feedback_submitted',
  RESOURCE_VIEWED: 'resource_viewed',
  GUIDE_ACCESSED: 'guide_accessed',
  FAQ_VIEWED: 'faq_viewed',
  ERROR_OCCURRED: 'error_occurred',
  PERFORMANCE_METRIC: 'performance_metric',
  ALERT_CREATED: 'alert_created',
  ALERT_RESOLVED: 'alert_resolved',
  PILOT_PAGE_VIEWED: 'pilot_page_viewed',
  PILOT_BANNER_SHOWN: 'pilot_banner_shown',
  PILOT_BANNER_DISMISSED: 'pilot_banner_dismissed',
  PILOT_BANNER_CLICKED: 'pilot_banner_clicked',
  PILOT_CTA_CLICKED: 'pilot_cta_clicked',
  PILOT_JOIN_CLICKED: 'pilot_join_clicked',
  PILOT_LEARN_MORE_CLICKED: 'pilot_learn_more_clicked',
} as const;

export const isAnalyticsEnabled = (): boolean =>
  typeof window !== 'undefined' && typeof window.gtag === 'function';

// gtag is already bootstrapped by the snippet in index.html; nothing extra needed here.
export const initAnalytics = (): void => {};

export const trackPageView = (path: string, title?: string): void => {
  if (!isAnalyticsEnabled()) { return; }
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_title: title ?? document.title,
  });
};

export const trackEvent = (eventName: string, parameters?: Record<string, unknown>): void => {
  if (!isAnalyticsEnabled()) { return; }
  window.gtag?.('event', eventName, parameters);
};

export const trackUserAction = (action: string, details?: Record<string, unknown>): void => {
  trackEvent(action, details);
};

export const trackContentEngagement = (
  contentType: string,
  action: string,
  contentId?: string,
  details?: Record<string, unknown>
): void => {
  trackEvent('content_engagement', {
    content_type: contentType,
    action,
    content_id: contentId,
    ...details,
  });
};

export const trackPerformance = (metricName: string, value: number, unit?: string): void => {
  trackEvent('performance_metric', {
    metric_name: metricName,
    metric_value: value,
    metric_unit: unit,
  });
};

export const trackError = (error: Error, context?: Record<string, unknown>): void => {
  trackEvent('error_occurred', {
    error_message: error.message,
    error_stack: error.stack,
    ...context,
  });
};

export const setUserProperties = (properties: Record<string, unknown>): void => {
  if (!isAnalyticsEnabled()) { return; }
  window.gtag?.('set', 'user_properties', properties);
};

export const setUserId = (userId: string): void => {
  if (!isAnalyticsEnabled()) { return; }
  window.gtag?.('config', GA_ID, { user_id: userId });
};

export const trackConversion = (conversionType: string, value?: number, currency?: string): void => {
  trackEvent('conversion', { conversion_type: conversionType, value, currency });
};

export const optOutAnalytics = (): void => {
  if (typeof window !== 'undefined') {
    (window as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true;
  }
};

export const optInAnalytics = (): void => {
  if (typeof window !== 'undefined') {
    (window as Record<string, unknown>)[`ga-disable-${GA_ID}`] = false;
  }
};

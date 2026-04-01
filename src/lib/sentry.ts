import React from 'react';

// No-op stub — Sentry disabled in no-backend mode.
// No error data is sent to any external service.

export const initSentry = () => {};

export class SentryErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || React.createElement('div', null, 'Something went wrong.');
    }
    return this.props.children;
  }
}

export const trackPerformance = (_name: string, fn: () => void) => fn();
export const reportError = (_error: Error, _context?: Record<string, unknown>) => {};
export const setUserContext = (_user: { id: string; email?: string; name?: string }) => {};
export const clearUserContext = () => {};
export const trackEvent = (_eventName: string, _data?: Record<string, unknown>) => {};

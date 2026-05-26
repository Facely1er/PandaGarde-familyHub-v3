import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { isChunkLoadError } from '../lib/lazyWithRetry';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class NavigationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(
      'Navigation Error',
      { error: error.message, stack: error.stack, componentStack: errorInfo.componentStack },
      'NavigationErrorBoundary'
    );
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const chunkError = this.state.error && isChunkLoadError(this.state.error);

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex justify-center">
              <AlertTriangle size={48} className="text-amber-500" aria-hidden />
            </div>

            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {chunkError ? 'Page update needed' : 'Navigation error'}
            </h2>

            <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {chunkError
                ? 'This page could not load—often after a site update or when the dev server refreshed. Reload to fetch the latest version.'
                : 'Something went wrong while opening this page. You can try again or return home.'}
            </p>

            <div className="space-y-3">
              {chunkError ? (
                <button
                  type="button"
                  onClick={this.handleReload}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
                >
                  <RefreshCw size={16} aria-hidden />
                  Reload page
                </button>
              ) : (
                <button
                  type="button"
                  onClick={this.handleRetry}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
                >
                  <RefreshCw size={16} aria-hidden />
                  Try again
                </button>
              )}

              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-800 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <Home size={16} aria-hidden />
                Go to homepage
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Error details (development)
                </summary>
                <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-gray-100 p-2 text-xs text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default NavigationErrorBoundary;

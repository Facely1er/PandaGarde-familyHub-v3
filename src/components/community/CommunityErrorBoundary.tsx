import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class CommunityErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Community feature error:', error, errorInfo);
    // In production, you might want to log this to an error reporting service
    // but only if user opts in (privacy-first)
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--white)' }}>
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center" style={{ backgroundColor: 'var(--card-color)' }}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
              Something Went Wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We encountered an error loading the community feature. This might be due to localStorage issues or browser compatibility.
            </p>
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              <button
                onClick={() => {
                  // Clear community data and reset
                  try {
                    localStorage.removeItem('pandagarde_community_stories');
                    localStorage.removeItem('pandagarde_forum_users');
                    localStorage.removeItem('pandagarde_forum_topics');
                    localStorage.removeItem('pandagarde_forum_posts');
                    localStorage.removeItem('pandagarde_shared_resources');
                    localStorage.removeItem('pandagarde_community_prefs');
                  } catch (e) {
                    console.error('Error clearing localStorage:', e);
                  }
                  this.handleReset();
                }}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Clear Data & Reset
              </button>
            </div>
            {this.state.error && import.meta.env.DEV && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details (Development Only)</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto" style={{ maxHeight: '200px' }}>
                  {this.state.error.toString()}
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

export default CommunityErrorBoundary;


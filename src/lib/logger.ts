/**
 * Centralized Logging Utility
 * Provides consistent logging across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  source?: string;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';
  private isDebugEnabled = import.meta.env.VITE_DEBUG_LOGGING === 'true';

  private formatMessage(level: LogLevel, message: string, data?: unknown, source?: string): string {
    const timestamp = new Date().toISOString();
    const sourceInfo = source ? `[${source}]` : '';
    return `${timestamp} ${level.toUpperCase()} ${sourceInfo} ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    if (level === 'error' || level === 'warn') {
      return true; // Always log errors and warnings
    }
    
    if (level === 'info') {
      return this.isDevelopment || this.isDebugEnabled;
    }
    
    if (level === 'debug') {
      return this.isDebugEnabled;
    }
    
    return false;
  }

  private log(level: LogLevel, message: string, data?: unknown, source?: string): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message, data, source);
    
    switch (level) {
      case 'debug':
        console.log(formattedMessage, data || '');
        break;
      case 'info':
        console.log(formattedMessage, data || '');
        break;
      case 'warn':
        console.warn(formattedMessage, data || '');
        break;
      case 'error':
        console.error(formattedMessage, data || '');
        break;
    }
  }

  debug(message: string, data?: unknown, source?: string): void {
    this.log('debug', message, data, source);
  }

  info(message: string, data?: unknown, source?: string): void {
    this.log('info', message, data, source);
  }

  warn(message: string, data?: unknown, source?: string): void {
    this.log('warn', message, data, source);
  }

  error(message: string, data?: unknown, source?: string): void {
    this.log('error', message, data, source);
  }

  // Convenience methods for common scenarios
  apiCall(endpoint: string, method: string, data?: unknown): void {
    this.debug(`API ${method} ${endpoint}`, data, 'API');
  }

  userAction(action: string, data?: unknown): void {
    this.info(`User action: ${action}`, data, 'USER');
  }

  performance(operation: string, duration: number): void {
    this.info(`Performance: ${operation} took ${duration}ms`, undefined, 'PERF');
  }

  security(event: string, data?: unknown): void {
    this.warn(`Security event: ${event}`, data, 'SECURITY');
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types for use in other files
export type { LogLevel, LogEntry };
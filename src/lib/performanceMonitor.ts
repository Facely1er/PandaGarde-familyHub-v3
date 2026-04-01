/**
 * Performance Monitoring and Metrics
 * Tracks Core Web Vitals and custom performance metrics
 */

export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  pageLoadTime?: number;
  componentRenderTime?: Record<string, number>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.init();
    }
  }

  private init(): void {
    // Observe LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformancePaintTiming;
        this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        this.reportMetric('lcp', this.metrics.lcp);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observer not supported:', e);
    }

    // Observe FID
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-input') {
            const fidEntry = entry as PerformanceEventTiming;
            this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
            this.reportMetric('fid', this.metrics.fid);
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID observer not supported:', e);
    }

    // Observe CLS
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = clsValue;
            this.reportMetric('cls', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS observer not supported:', e);
    }

    // Track page load time
    if (document.readyState === 'complete') {
      this.trackPageLoad();
    } else {
      window.addEventListener('load', () => this.trackPageLoad());
    }
  }

  private trackPageLoad(): void {
    if (performance.timing) {
      const timing = performance.timing;
      this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      this.metrics.ttfb = timing.responseStart - timing.navigationStart;
      
      // FCP
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
      }

      this.reportMetric('pageLoadTime', this.metrics.pageLoadTime);
      this.reportMetric('ttfb', this.metrics.ttfb);
      if (this.metrics.fcp) {
        this.reportMetric('fcp', this.metrics.fcp);
      }
    }
  }

  /**
   * Track component render time
   */
  trackComponentRender(componentName: string, renderTime: number): void {
    if (!this.metrics.componentRenderTime) {
      this.metrics.componentRenderTime = {};
    }
    this.metrics.componentRenderTime[componentName] = renderTime;
    
    // Warn if render time is too high
    if (renderTime > 100) {
      console.warn(`Component ${componentName} took ${renderTime}ms to render`);
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get a specific metric
   */
  getMetric(name: keyof PerformanceMetrics): number | undefined {
    return this.metrics[name] as number | undefined;
  }

  /**
   * Report metric to analytics/monitoring service
   */
  private reportMetric(name: string, value: number): void {
    // Report to Sentry if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.metrics.distribution(name, value);
    }

    // Report to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
      });
    }

    // Log in development
    if (import.meta.env.MODE === 'development') {
      console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`);
    }
  }

  /**
   * Check if performance is good
   */
  isPerformanceGood(): boolean {
    const thresholds = {
      lcp: 2500, // Good: < 2.5s
      fid: 100, // Good: < 100ms
      cls: 0.1, // Good: < 0.1
      fcp: 1800, // Good: < 1.8s
    };

    if (this.metrics.lcp && this.metrics.lcp > thresholds.lcp) {return false;}
    if (this.metrics.fid && this.metrics.fid > thresholds.fid) {return false;}
    if (this.metrics.cls && this.metrics.cls > thresholds.cls) {return false;}
    if (this.metrics.fcp && this.metrics.fcp > thresholds.fcp) {return false;}

    return true;
  }

  /**
   * Get performance score (0-100)
   */
  getPerformanceScore(): number {
    let score = 100;
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 },
    };

    if (this.metrics.lcp) {
      if (this.metrics.lcp > thresholds.lcp.poor) {score -= 25;}
      else if (this.metrics.lcp > thresholds.lcp.good) {score -= 10;}
    }
    if (this.metrics.fid) {
      if (this.metrics.fid > thresholds.fid.poor) {score -= 25;}
      else if (this.metrics.fid > thresholds.fid.good) {score -= 10;}
    }
    if (this.metrics.cls) {
      if (this.metrics.cls > thresholds.cls.poor) {score -= 25;}
      else if (this.metrics.cls > thresholds.cls.good) {score -= 10;}
    }
    if (this.metrics.fcp) {
      if (this.metrics.fcp > thresholds.fcp.poor) {score -= 15;}
      else if (this.metrics.fcp > thresholds.fcp.good) {score -= 5;}
    }

    return Math.max(0, score);
  }

  /**
   * Cleanup observers
   */
  destroy(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for component render tracking
export function usePerformanceTracking(componentName: string) {
  if (typeof window === 'undefined') {return;}

  const startTime = performance.now();

  return () => {
    const renderTime = performance.now() - startTime;
    performanceMonitor.trackComponentRender(componentName, renderTime);
  };
}


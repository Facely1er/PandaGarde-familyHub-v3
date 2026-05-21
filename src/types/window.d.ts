interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface Window {
  Sentry?: {
    metrics: {
      distribution: (name: string, value: number) => void;
    };
  };
  gtag?: (
    command: string,
    eventName: string,
    params?: Record<string, string | number>
  ) => void;
}

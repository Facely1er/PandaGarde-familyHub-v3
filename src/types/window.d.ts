interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface Window {
  ga?: (
    command: string,
    field: string,
    value: boolean
  ) => void;
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

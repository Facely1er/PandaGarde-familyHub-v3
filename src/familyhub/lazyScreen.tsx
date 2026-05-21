import React, { Suspense, lazy, type ComponentType } from 'react';

export function HubScreenFallback() {
  return (
    <div
      className="flex min-h-[32vh] items-center justify-center p-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-teal-600 border-t-transparent dark:border-teal-400"
        aria-hidden="true"
      />
      <span className="sr-only">Loading screen…</span>
    </div>
  );
}

export function lazyScreen<P extends Record<string, unknown> = Record<string, never>>(
  factory: () => Promise<{ default: ComponentType<P> }>
): React.FC<P> {
  const LazyComponent = lazy(factory);
  const Screen: React.FC<P> = (props) => (
    <Suspense fallback={<HubScreenFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
  return Screen;
}

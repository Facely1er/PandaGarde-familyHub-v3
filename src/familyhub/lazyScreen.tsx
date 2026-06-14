import React, { Suspense, lazy, type ComponentType } from 'react';
import { HubScreenFallback } from './HubScreenFallback';

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

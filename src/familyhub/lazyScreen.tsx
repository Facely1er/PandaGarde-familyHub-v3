import React, { Suspense, type ComponentType } from 'react';
import { lazy } from '../lib/lazyWithRetry';
import { HubScreenFallback } from './HubScreenFallback';

export function lazyScreen<P extends Record<string, unknown> = Record<string, never>>(
  factory: () => Promise<{ default: ComponentType<P> }>
): React.FC<P> {
  const LazyComponent = lazy(factory as () => Promise<{ default: ComponentType<unknown> }>);
  const Screen: React.FC<P> = (props) => (
    <Suspense fallback={<HubScreenFallback />}>
      <LazyComponent {...(props as Record<string, unknown>)} />
    </Suspense>
  );
  return Screen;
}

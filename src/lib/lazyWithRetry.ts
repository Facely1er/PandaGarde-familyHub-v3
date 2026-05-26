import { lazy as reactLazy, type ComponentType, type LazyExoticComponent } from 'react';

const CHUNK_RETRY_SESSION_KEY = 'pandagarde-chunk-reload';

export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  const message = error.message.toLowerCase();
  return (
    message.includes('failed to fetch') ||
    message.includes('dynamically imported module') ||
    message.includes('loading chunk') ||
    message.includes('importing a module script failed') ||
    message.includes('error loading dynamically imported module')
  );
}

/**
 * Retries dynamic imports (route chunks). On persistent chunk failure, reloads once per session.
 */
export async function retryImport<T>(importer: () => Promise<T>): Promise<T> {
  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const result = await importer();
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(CHUNK_RETRY_SESSION_KEY);
      }
      return result;
    } catch (error) {
      lastError = error;
      if (!isChunkLoadError(error) || attempt === maxAttempts - 1) {
        break;
      }
      await new Promise((resolve) => {
        window.setTimeout(resolve, 350 * (attempt + 1));
      });
    }
  }

  if (typeof sessionStorage !== 'undefined' && isChunkLoadError(lastError)) {
    const alreadyReloaded = sessionStorage.getItem(CHUNK_RETRY_SESSION_KEY) === '1';
    if (!alreadyReloaded) {
      sessionStorage.setItem(CHUNK_RETRY_SESSION_KEY, '1');
      window.location.reload();
      return new Promise(() => {});
    }
    sessionStorage.removeItem(CHUNK_RETRY_SESSION_KEY);
  }

  throw lastError;
}

/** Drop-in replacement for React.lazy with chunk load retries. */
export function lazy<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return reactLazy(() => retryImport(factory));
}

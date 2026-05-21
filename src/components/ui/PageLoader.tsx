import React from 'react';
import BrandSplash from '../BrandSplash';

interface PageLoaderProps {
  message?: string;
}

/** Branded full-page loader for route-level Suspense boundaries. */
const PageLoader: React.FC<PageLoaderProps> = ({ message = 'Loading…' }) => (
  <BrandSplash message={message} pulsing />
);

export default PageLoader;

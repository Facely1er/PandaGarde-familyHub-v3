import React, { useEffect } from 'react';
import PageLoader from './ui/PageLoader';

interface ExternalProductRedirectProps {
  targetUrl: string;
}

/** Sends the browser to an external product URL (e.g. retired in-app routes). */
const ExternalProductRedirect: React.FC<ExternalProductRedirectProps> = ({ targetUrl }) => {
  useEffect(() => {
    window.location.replace(targetUrl);
  }, [targetUrl]);

  return <PageLoader />;
};

export default ExternalProductRedirect;

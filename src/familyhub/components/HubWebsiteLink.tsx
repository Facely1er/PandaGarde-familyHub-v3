import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { isHubStandalone } from '../hubPaths';
import { openWebsitePath } from '../../lib/storyHubLinks';

interface HubWebsiteLinkProps {
  /** Marketing-site path, e.g. `/stories` or `/digital-footprint` */
  path: string;
  children: React.ReactNode;
  className?: string;
  showExternalIcon?: boolean;
}

/**
 * In-app route on pandagarde.com; opens system browser from standalone Hub / Capacitor.
 */
const HubWebsiteLink: React.FC<HubWebsiteLinkProps> = ({
  path,
  children,
  className = '',
  showExternalIcon = false,
}) => {
  if (isHubStandalone) {
    return (
      <button
        type="button"
        onClick={() => void openWebsitePath(path)}
        className={className}
      >
        {children}
        {showExternalIcon && <ExternalLink size={12} className="ml-1 inline opacity-70" aria-hidden="true" />}
      </button>
    );
  }

  return (
    <Link to={path} className={className}>
      {children}
    </Link>
  );
};

export default HubWebsiteLink;

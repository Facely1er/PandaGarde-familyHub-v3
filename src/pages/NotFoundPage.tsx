import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { GUIDES_STORIES_NAV_LABEL } from '../data/siteNavigation';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16 text-center">
      <div className="max-w-md w-full">
        <div className="text-[6rem] font-black leading-none tracking-tighter text-green-700 dark:text-green-400 mb-4">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-3">
          Page not found
        </h1>

        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="button button-primary inline-flex items-center gap-2">
            <Home size={18} />
            Go Home
          </Link>
          <Link to="/for-families" className="button button-secondary inline-flex items-center gap-2">
            <Search size={18} />
            {GUIDES_STORIES_NAV_LABEL}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

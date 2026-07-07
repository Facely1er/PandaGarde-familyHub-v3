import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { buildBreadcrumbTrail, type BreadcrumbItem } from '../../lib/breadcrumbTrail';

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();

  const breadcrumbs = items ?? buildBreadcrumbTrail(location.pathname);

  if (location.pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`inline-block rounded-lg bg-white/10 px-4 py-2 backdrop-blur-md dark:border dark:border-green-300/25 ${className}`}
    >
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 text-sm">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={`${item.path}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight size={14} aria-hidden="true" className="flex-shrink-0 text-white/60" />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="max-w-[16rem] truncate font-semibold text-white sm:max-w-xs"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="inline-flex max-w-[10rem] items-center gap-1 text-white/80 no-underline transition-colors hover:text-white sm:max-w-[14rem]"
                >
                  {index === 0 && (
                    <Home size={14} aria-hidden="true" className="flex-shrink-0" />
                  )}
                  <span className="truncate">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

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
    <nav aria-label="Breadcrumb" className={`inline-block ${className}`}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-1.5 gap-y-0.5 p-0 text-xs leading-snug">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={`${item.path}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  size={12}
                  aria-hidden="true"
                  className="flex-shrink-0 text-white/35"
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="whitespace-normal break-words font-medium text-white/70"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="inline-flex max-w-[9rem] items-center gap-1 text-white/50 no-underline transition-colors hover:text-white/80 sm:max-w-[12rem]"
                >
                  {index === 0 && (
                    <Home size={12} aria-hidden="true" className="flex-shrink-0 opacity-80" />
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

import React from 'react';
import Breadcrumbs from '../navigation/Breadcrumbs';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: boolean;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs: showBreadcrumbs = true,
  className = ''
}) => {
  return (
    <div className={`page-header ${className}`}>
      <div className="container page-header-content">
        {showBreadcrumbs && (
          <div className="page-header__breadcrumbs">
            <Breadcrumbs />
          </div>
        )}

        <div className="text-center">
          <h1 className="page-header__title">{title}</h1>

          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

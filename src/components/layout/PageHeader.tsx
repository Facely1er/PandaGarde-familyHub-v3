import React from 'react';
import { LucideIcon } from 'lucide-react';
import Breadcrumbs from '../navigation/Breadcrumbs';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
  breadcrumbs?: boolean;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  badge,
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
          {badge && (
            <div className="page-header__badge">
              {Icon && <Icon size={16} />}
              {badge}
            </div>
          )}

          <h1 className="page-header__title">{title}</h1>

          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

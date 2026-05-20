import React from 'react';
import { LucideIcon } from 'lucide-react';
import PageHeader from './PageHeader';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
  breadcrumbs?: boolean;
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  icon,
  badge,
  breadcrumbs = true,
  children,
  className = ''
}) => {
  return (
    <div className={`page-layout ${className}`}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        badge={badge}
        breadcrumbs={breadcrumbs}
      />

      <main className="page-layout__main">
        <div className="container relative z-[2]">{children}</div>
      </main>
    </div>
  );
};

export default PageLayout;

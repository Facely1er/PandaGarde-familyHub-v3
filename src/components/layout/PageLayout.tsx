import React from 'react';
import PageHeader from './PageHeader';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: boolean;
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  breadcrumbs = true,
  children,
  className = '',
}) => {
  return (
    <div className={`page-layout min-h-screen ${className}`}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
      />

      <main className="page-layout__main relative z-10 min-h-96">
        <div className="container relative z-20">
          <div className="page-content">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default PageLayout;

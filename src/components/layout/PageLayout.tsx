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
    <div className={`page-layout min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 ${className}`}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
      />

      <main className="page-layout__main relative z-10 py-8 min-h-96 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <div className="container relative z-20">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;

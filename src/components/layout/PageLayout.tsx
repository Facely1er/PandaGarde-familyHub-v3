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
    <div 
      className={`page-layout ${className}`}
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--white)',
        color: 'var(--gray-800)'
      }}
    >
      <PageHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        badge={badge}
        breadcrumbs={breadcrumbs}
      />

      <main 
        style={{
          padding: '2rem 0',
          backgroundColor: 'var(--white)',
          color: 'var(--gray-800)',
          minHeight: '400px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div 
          className="container"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.5rem',
            position: 'relative',
            zIndex: 2
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;


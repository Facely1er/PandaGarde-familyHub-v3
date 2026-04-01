import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();

  // Page title mappings for automatic breadcrumb generation
  const pageTitles: Record<string, string> = {
    // Main Pages
    '/about': 'About',
    '/contact': 'Contact Us',
    '/faq': 'FAQ',
    '/overview': 'Overview',
    '/quick-start': 'Quick Start',
    '/get-started': 'Get Started',
    '/resources': 'Resources',
    '/parent-resources': 'Resources',
    '/parent-toolkit': 'Parent Toolkit',
    '/newsletter': 'Newsletter',
    '/newsletter/archive': 'Archive',
    '/newsletter/unsubscribe': 'Unsubscribe',
    '/support': 'Support',
    '/pilot': 'Pilot Program',
    '/join-pilot': 'Join Pilot',
    
    // Family Hub
    '/family-hub': 'Family Hub',
    '/profile': 'Profile',
    
    // Privacy Panda & Story
    '/story': 'Privacy Panda Story',
    '/privacy-panda': 'Privacy Panda',
    '/activity-book': 'Activity Book',
    '/interactive-story': 'Interactive Story',
    
    // Age Group Pages
    '/privacy-explorers': 'Ages 5-8',
    '/privacy-handbook': 'Ages 9-12',
    '/teen-handbook': 'Ages 13-17',
    '/digital-citizenship': 'Digital Citizenship',
    '/privacy-tools': 'Privacy Tools',
    '/digital-rights': 'Digital Rights',
    '/age-groups': 'Age Groups',
    
    // Educator Pages
    '/educator-tools': 'Educator Tools',
    '/classroom-activities': 'Classroom Activities',
    
    // Service & Analysis Pages
    '/service-catalog': 'Service Catalog',
    '/safety-alerts': 'Safety Alerts',
    '/alerts': 'Safety Alerts',
    '/digital-footprint': 'Digital Footprint',
    '/footprint': 'Digital Footprint',
    '/privacy-assessment': 'Privacy Assessment',
    '/quick-assessment': 'Quick Assessment',
    '/assessment': 'Privacy Assessment',
    '/assessment-history': 'Assessment History',
    '/assessment/history': 'Assessment History',
    '/privacy-goals': 'Privacy Goals',
    '/goals': 'Privacy Goals',
    '/implementation-guide': 'Implementation Guide',
    
    // Community Features
    '/community': 'Community',
    '/community/stories': 'Success Stories',
    '/community/success-stories': 'Success Stories',
    '/community/resources': 'Shared Resources',
    '/community/forum': 'Forum',
    '/community/privacy-tips': 'Privacy Tips',
    
    // COPPA & Legal Pages
    '/parental-consent': 'Parental Consent',
    '/parental-consent/pending': 'Consent Pending',
    '/privacy': 'Privacy Policy',
    '/terms': 'Terms of Service',
    '/cookies': 'Cookie Policy',
    '/accessibility': 'Accessibility',
    
    // Download Pages
    '/downloads': 'Downloads',
    '/downloads/coloring-sheets': 'Coloring Sheets',
    '/coloring-sheets': 'Coloring Sheets',
    '/downloads/safety-posters': 'Safety Posters',
    '/safety-posters': 'Safety Posters',
    '/downloads/certificates': 'Certificates',
    '/certificates': 'Certificates',
    '/downloads/family-agreement': 'Family Agreement',
    '/family-agreement': 'Family Agreement',
    '/downloads/worksheets': 'Worksheets',
    
    // Guide Pages
    '/guides': 'Guides',
    '/guides/device-setup': 'Device Setup',
    '/guides/app-selection': 'App Selection',
    '/guides/modeling-behavior': 'Modeling Behavior',
    '/guides/privacy-concerns': 'Privacy Concerns',
    '/guides/family-privacy': 'Family Privacy',
    '/guides/emergency-safety': 'Emergency Safety',
    '/guides/age-specific': 'Age-Specific Guide',
    '/guides/conversation-approaches': 'Conversation Approaches',
    '/guides/safety-net': 'Safety Net',
    '/guides/age-specific-privacy': 'Age-Specific Privacy',
    '/family-privacy-plan': 'Family Privacy Plan',
    '/guides/family-privacy-plan': 'Family Privacy Plan',
    
    // Activity Pages
    '/activities': 'Activities',
    '/activities/privacy-learning-kit': 'Privacy Learning Kit',
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) {
      return items;
    }

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const title = pageTitles[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({
        label: title,
        path: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (location.pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`breadcrumb-container ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'inline-block',
        marginBottom: '1.5rem'
      }}
    >
      <ol 
        className="breadcrumb-list"
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li 
              key={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {index > 0 && (
                <ChevronRight 
                  size={16} 
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    flexShrink: 0
                  }} 
                />
              )}
              {isLast ? (
                <span 
                  className="breadcrumb-current"
                  style={{
                    color: 'white',
                    fontWeight: 600
                  }}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="breadcrumb-link"
                  style={{
                    textDecoration: 'none',
                    color: 'rgba(255, 255, 255, 0.8)',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  {index === 0 ? (
                    <>
                      <Home size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.25rem' }} />
                      {item.label}
                    </>
                  ) : (
                    item.label
                  )}
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


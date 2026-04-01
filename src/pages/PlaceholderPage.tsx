import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, BookOpen, Users } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  comingSoon?: boolean;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description = "We're working hard to bring you this content. Check back soon!",
  comingSoon = true
}) => {
  return (
    <PageLayout
      title={title}
      subtitle={description}
      icon={Construction}
      badge="COMING SOON"
      breadcrumbs={true}
    >

      {/* Main Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        {comingSoon && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              width: '128px',
              height: '128px',
              margin: '0 auto 2rem',
              background: 'var(--gradient-primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Construction size={64} style={{ color: 'white' }} />
            </div>

            <h2 style={{ 
              fontSize: 'clamp(1.875rem, 3vw, 2.25rem)', 
              fontWeight: 700, 
              marginBottom: '1rem',
              color: 'var(--primary)'
            }}>
              Coming Soon!
            </h2>

            <p style={{ 
              fontSize: '1.125rem', 
              marginBottom: '2rem', 
              lineHeight: 1.6,
              color: 'var(--gray-600)'
            }}>
              We're working hard to bring you this content. Our team is developing comprehensive resources
              to make your privacy education journey even better.
            </p>
          </div>
        )}

        {/* Features Preview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            backgroundColor: 'var(--card-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--logo-bg)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              margin: '0 auto 1rem'
            }}>
              <Construction size={24} style={{ color: 'var(--info)' }} />
            </div>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--primary)'
            }}>
              In Development
            </h3>
            <p style={{ 
              fontSize: '0.875rem',
              color: 'var(--gray-600)',
              lineHeight: 1.5
            }}>
              This content is currently being developed by our expert team.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--card-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              margin: '0 auto 1rem'
            }}>
              <BookOpen size={24} style={{ color: 'var(--primary-light)' }} />
            </div>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--primary)'
            }}>
              Quality Assured
            </h3>
            <p style={{ 
              fontSize: '0.875rem',
              color: 'var(--gray-600)',
              lineHeight: 1.5
            }}>
              All content goes through rigorous testing with families and educators.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--card-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(123, 31, 162, 0.08)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              margin: '0 auto 1rem'
            }}>
              <Users size={24} style={{ color: 'var(--purple)' }} />
            </div>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--primary)'
            }}>
              Coming Soon
            </h3>
            <p style={{ 
              fontSize: '0.875rem',
              color: 'var(--gray-600)',
              lineHeight: 1.5
            }}>
              We'll notify you when this content becomes available.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          background: 'var(--gradient-primary)',
          borderRadius: '16px',
          padding: '2rem',
          color: 'white'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', 
            fontWeight: 700, 
            marginBottom: '1rem'
          }}>
            Explore What's Available Now
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            marginBottom: '1.5rem', 
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            While we work on this content, check out our existing resources that are ready for your family to enjoy.
          </p>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            justifyContent: 'center' 
          }}>
            <Link
              to="/activity-book"
              style={{
                background: 'white',
                color: 'var(--primary)',
                padding: '0.875rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Activity Book
            </Link>
            <Link
              to="/privacy-panda"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '0.875rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                border: '2px solid white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Privacy Panda Story
            </Link>
            <Link
              to="/family-hub"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '0.875rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                border: '2px solid white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Family Hub
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PlaceholderPage;
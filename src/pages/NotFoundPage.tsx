import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '480px' }}>
        <div style={{
          fontSize: '6rem',
          fontWeight: 900,
          lineHeight: 1,
          color: 'var(--primary)',
          marginBottom: '1rem',
          letterSpacing: '-0.04em'
        }}>
          404
        </div>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 800,
          color: 'var(--gray-800)',
          marginBottom: '0.75rem'
        }}>
          Page not found
        </h1>
        <p style={{
          fontSize: '1.0625rem',
          color: 'var(--gray-600)',
          lineHeight: 1.6,
          marginBottom: '2rem'
        }}>
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--gradient-primary)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--border-radius)',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.9375rem'
            }}
          >
            <Home size={18} />
            Go Home
          </Link>
          <Link
            to="/resources"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--white)',
              color: 'var(--primary)',
              border: '2px solid var(--primary)',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--border-radius)',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.9375rem'
            }}
          >
            <Search size={18} />
            Browse Resources
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

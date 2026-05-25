import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Shield,
  LayoutDashboard,
  Mail,
  HelpCircle,
  Scale,
  Accessibility,
  PlayCircle,
  HeartHandshake,
  Compass,
  FileText,
  Cookie,
  Info,
  Library,
  Fingerprint,
  Newspaper,
} from 'lucide-react';

const JOURNAL_URL = 'https://journal.pandagarde.com';

type FooterLink = {
  icon: React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>;
  href: string;
  label: string;
  external?: boolean;
};

const Footer: React.FC = () => {
  const exploreLinks = [
    { icon: Compass, href: '/how-it-works', label: 'How It Works' },
    { icon: PlayCircle, href: '/get-started', label: 'Get Started' },
    { icon: Fingerprint, href: '/digital-footprint', label: 'Digital Footprint Analysis' },
    { icon: BookOpen, href: '/resources', label: 'Resources' },
    { icon: Library, href: '/stories', label: 'Stories' },
    { icon: LayoutDashboard, href: '/family-hub', label: 'Family Hub' },
  ];

  const resourcesLinks: FooterLink[] = [
    { icon: Info, href: '/about', label: 'About' },
    { icon: Mail, href: '/contact', label: 'Contact' },
    { icon: HelpCircle, href: '/faq', label: 'FAQ' },
    { icon: Scale, href: '/digital-rights', label: 'Digital Rights' },
    { icon: HeartHandshake, href: '/support', label: 'Support' },
    {
      icon: Newspaper,
      href: JOURNAL_URL,
      label: 'Digital Bamboo Journal',
      external: true,
    },
  ];

  const legalLinks = [
    { icon: Shield, href: '/privacy', label: 'Privacy' },
    { icon: FileText, href: '/terms', label: 'Terms' },
    { icon: Cookie, href: '/cookies', label: 'Cookies' },
    { icon: Accessibility, href: '/accessibility', label: 'Accessibility' },
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-shell">
          <div className="footer-brand">
            <Link
              to="/"
              className="footer-logo"
              aria-label="PandaGarde — Calmer privacy. Go to homepage"
            >
              <div className="logo-icon">
                <img src="/LogoPandagarde.png" alt="" aria-hidden />
              </div>
              <span className="logo-text">
                <span className="logo-wordmark">
                  Panda<span className="highlight">Garde</span>
                </span>
                <span className="logo-tagline">Calmer privacy</span>
              </span>
            </Link>
            <p className="footer-description">
              Family privacy guidance built around a clear journey: understand exposure, take practical action, and keep progress going in the Family Hub.
            </p>
            <p className="footer-trust-note">
              Local-first guidance, family-centered design, and structured next steps instead of scattered privacy advice.
            </p>
          </div>

          <div className="footer-grid">
            <div className="footer-column">
              <h4>Explore</h4>
              <ul className="footer-menu-list">
                {exploreLinks.map(({ icon: Icon, href, label }) => (
                  <li key={href}>
                    <Link to={href} className="footer-link">
                      <Icon size={16} aria-hidden="true" />
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <ul className="footer-menu-list">
                {resourcesLinks.map(({ icon: Icon, href, label, external }) => (
                  <li key={href}>
                    {external ? (
                      <a
                        href={href}
                        className="footer-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon size={16} aria-hidden="true" />
                        <span>{label}</span>
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    ) : (
                      <Link to={href} className="footer-link">
                        <Icon size={16} aria-hidden="true" />
                        <span>{label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <ul className="footer-menu-list">
                {legalLinks.map(({ icon: Icon, href, label }) => (
                  <li key={href}>
                    <Link to={href} className="footer-link">
                      <Icon size={16} aria-hidden="true" />
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PandaGarde. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

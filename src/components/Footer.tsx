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
} from 'lucide-react';

const Footer: React.FC = () => {
  const exploreLinks = [
    { icon: Compass, href: '/how-it-works', label: 'How It Works' },
    { icon: BookOpen, href: '/resources', label: 'Resources' },
    { icon: LayoutDashboard, href: '/family-hub', label: 'Family Hub' },
    { icon: PlayCircle, href: '/get-started', label: 'Get Started' },
  ];

  const resourcesLinks = [
    { icon: Info, href: '/about', label: 'About' },
    { icon: Mail, href: '/contact', label: 'Contact' },
    { icon: HelpCircle, href: '/faq', label: 'FAQ' },
    { icon: Scale, href: '/digital-rights', label: 'Digital Rights' },
    { icon: HeartHandshake, href: '/support', label: 'Support' },
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
            <Link to="/" className="footer-logo" aria-label="PandaGarde home">
              <img src="/LogoPandagarde.png" alt="PandaGarde Logo" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              <span className="footer-brand-name">PandaGarde</span>
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
                {resourcesLinks.map(({ icon: Icon, href, label }) => (
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

import React from 'react';
import { Link } from 'react-router-dom';
import {
  footerColumns,
  type FooterExternalNavItem,
  type SiteNavItem,
} from '../data/siteNavigation';

const Footer: React.FC = () => {
  const renderNavLink = (item: SiteNavItem | FooterExternalNavItem) => {
    const Icon = item.icon;
    const isExternal = 'external' in item && item.external;

    if (isExternal) {
      return (
        <a
          href={item.href}
          className="footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon size={16} aria-hidden="true" />
          <span>{item.label}</span>
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      );
    }

    return (
      <Link to={item.href} className="footer-link">
        <Icon size={16} aria-hidden="true" />
        <span>{item.label}</span>
      </Link>
    );
  };

  const renderNavColumn = (title: string, items: SiteNavItem[], extra?: FooterExternalNavItem[]) => (
    <div className="footer-column">
      <h4>{title}</h4>
      <ul className="footer-menu-list">
        {items.map((item) => (
          <li key={item.id}>{renderNavLink(item)}</li>
        ))}
        {extra?.map((item) => (
          <li key={item.id}>{renderNavLink(item)}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-shell">
          <div className="footer-brand">
            <Link
              to="/"
              className="logo footer-logo"
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
              Stories, guides, footprint review, and Family Hub—use what fits your family. Nothing here
              blocks the rest.
            </p>

            <p className="footer-trust-note">
              Local-first guidance on this device. Formal assessment and safety alerts live on SocialCaution.
            </p>
          </div>

          <div className="footer-grid footer-grid--privacy">
            {footerColumns.map((column) =>
              renderNavColumn(column.title, column.items, column.externalItems)
            )}
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

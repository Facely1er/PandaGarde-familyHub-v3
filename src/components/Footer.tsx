import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  type FooterExternalNavItem,
  type SiteNavItem,
} from '../data/siteNavigation';
import { useLocalizedFooterColumns } from '../hooks/useLocalizedNav';
import StoreBadges from './StoreBadges';

const FOOTER_ICON_SIZE = 16;

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const footerColumns = useLocalizedFooterColumns();

  const renderLinkIcon = (Icon: SiteNavItem['icon']) => (
    <span className="footer-link-icon" aria-hidden="true">
      <Icon size={FOOTER_ICON_SIZE} strokeWidth={2} />
    </span>
  );

  const renderNavLink = (item: SiteNavItem | FooterExternalNavItem) => {
    const isExternal = 'external' in item && item.external;

    if (isExternal) {
      return (
        <a
          href={item.href}
          className="footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {renderLinkIcon(item.icon)}
          <span className="footer-link-label">{item.label}</span>
          <span className="sr-only">{t('common.opensNewTab')}</span>
        </a>
      );
    }

    return (
      <Link to={item.href} className="footer-link">
        {renderLinkIcon(item.icon)}
        <span className="footer-link-label">{item.label}</span>
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
              aria-label={t('common.logoAriaLabel')}
            >
              <div className="logo-icon">
                <img src="/LogoPandagarde.png" alt="" aria-hidden />
              </div>
              <span className="logo-text">
                <span className="logo-wordmark">
                  Panda<span className="highlight">Garde</span>
                </span>
                <span className="logo-tagline">{t('common.brandTagline')}</span>
              </span>
            </Link>

            <p className="footer-description">
              {t('footer.description')}
            </p>

            <p className="footer-trust-note">
              {t('footer.trustNote')}
            </p>

            <StoreBadges className="mt-4" size="sm" />
          </div>

          <div className="footer-grid footer-grid--privacy">
            {footerColumns.map((column) =>
              renderNavColumn(column.title, column.items, column.externalItems)
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('common.copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

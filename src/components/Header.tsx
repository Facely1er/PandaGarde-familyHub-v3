import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Moon,
  Sun,
  Search,
  LayoutDashboard,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SearchModal from './SearchModal';
import {
  buildMobileQuickNavItems,
  mobileSecondaryNavItems,
  primaryNavItems,
} from '../data/siteNavigation';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
        return;
      }
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, isSearchModalOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const navItems = primaryNavItems;

  const mobileQuickNavItems = useMemo(
    () => buildMobileQuickNavItems(primaryNavItems),
    []
  );

  const mobilePrimaryItems = primaryNavItems.map((item) => ({
    ...item,
    id: `mobile-${item.id}`,
  }));

  const mobileSecondaryItems = mobileSecondaryNavItems;

  const mobileCtaItems = useMemo(
    () => [
      { id: 'mobile-nav-family-hub', icon: LayoutDashboard, label: 'Open Family Hub', href: '/family-hub', variant: 'primary' as const },
    ],
    []
  );

  const isActive = (href: string) => {
    if (href === '/') {return location.pathname === '/';}
    return location.pathname.startsWith(href);
  };

  const handleSearchResultClick = (result: { url: string }) => {
    navigate(result.url);
    setIsSearchModalOpen(false);
  };

  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    if (newState) {
      setTimeout(() => {
        const firstMenuItem = document.querySelector('.mobile-nav .nav-link, .mobile-nav .mobile-nav-section-link') as HTMLElement;
        firstMenuItem?.focus();
      }, 100);
    } else {
      setTimeout(() => {
        const menuToggle = document.querySelector('.mobile-menu-toggle') as HTMLElement;
        menuToggle?.focus();
      }, 100);
    }
  };

  const handleMobileMenuKeyDown = (e: React.KeyboardEvent) => {
    if (!isMobileMenuOpen) {return;}
    const menuItems = Array.from(
      document.querySelectorAll('.mobile-nav .nav-link, .mobile-nav .mobile-nav-section-link')
    ) as HTMLElement[];
    const currentIndex = menuItems.findIndex((item) => item === document.activeElement);

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        menuItems[nextIndex]?.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        menuItems[prevIndex]?.focus();
        break;
      }
      case 'Home':
        e.preventDefault();
        menuItems[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        menuItems[menuItems.length - 1]?.focus();
        break;
    }
  };

  return (
    <>
      <div className="skip-links">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <a href="#navigation" className="skip-link">Skip to navigation</a>
      </div>

      <header className={`header ${isScrolled ? 'scrolled' : ''}`} role="banner">
        <div className="container">
          <nav className="nav" role="navigation" aria-label="Main navigation" id="navigation">
            <Link
              to="/"
              className="logo"
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

            <ul className="nav-menu desktop-nav" role="menubar" aria-label="Main navigation menu">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} role="none">
                    <Link
                      to={item.href}
                      className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                      role="menuitem"
                      aria-current={isActive(item.href) ? 'page' : undefined}
                    >
                      <Icon size={16} aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div
              className="nav-actions__cluster mobile-quick-nav lg:hidden"
              role="navigation"
              aria-label="Quick links"
            >
              {mobileQuickNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={`nav-actions__icon mobile-quick-nav__link header-icon-btn ${active ? 'mobile-quick-nav__link--active' : ''}`}
                    aria-label={item.label}
                    title={item.label}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={17} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>

            <div className="nav-actions" aria-label="Utility actions">
              <div
                className="nav-actions__toolbar"
                role="group"
                aria-label="Search, Family Hub, and display"
              >
                <button
                  type="button"
                  className="header-search-bar"
                  onClick={() => setIsSearchModalOpen(true)}
                  aria-label="Open search"
                  title="Search (Ctrl/Cmd + K)"
                >
                  <Search size={17} className="header-search-bar__icon" aria-hidden="true" />
                  <span className="header-search-bar__label">Search</span>
                  <kbd className="header-search-bar__kbd" aria-hidden="true">
                    ⌘K
                  </kbd>
                </button>

                <Link
                  to="/family-hub"
                  className={`nav-actions__icon header-icon-btn inline-flex ${isActive('/family-hub') ? 'mobile-quick-nav__link--active' : ''}`}
                  aria-label="Open Family Hub"
                  title="Family Hub"
                  aria-current={isActive('/family-hub') ? 'page' : undefined}
                >
                  <LayoutDashboard size={17} aria-hidden="true" />
                </Link>

                <button
                  type="button"
                  className="nav-actions__icon theme-toggle header-icon-btn"
                  onClick={toggleTheme}
                  aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                  {theme === 'light' ? <Moon size={17} aria-hidden /> : <Sun size={17} aria-hidden />}
                </button>

                <button
                  type="button"
                  className="nav-actions__icon mobile-menu-toggle header-icon-btn max-lg:inline-flex lg:hidden"
                  onClick={handleMobileMenuToggle}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-navigation"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {isMobileMenuOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {isMobileMenuOpen && createPortal(
        <div
          className="mobile-nav-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        >
          <div
            id="mobile-navigation"
            className="mobile-nav"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleMobileMenuKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="mobile-nav-header">
              <span className="mobile-nav-title">Menu</span>
              <button type="button" className="mobile-nav-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            <div className="mobile-nav-section">
              <p className="mobile-nav-section-label">Explore</p>
              <ul className="mobile-nav-list">
                {mobilePrimaryItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <Link
                        to={item.href}
                        className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mobile-nav-section">
              <p className="mobile-nav-section-label">Tools</p>
              <ul className="mobile-nav-list">
                {mobileSecondaryItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <Link
                        to={item.href}
                        className="mobile-nav-section-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mobile-nav-theme-bar">
              <button
                type="button"
                className="mobile-nav-theme-toggle"
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon size={18} aria-hidden /> : <Sun size={18} aria-hidden />}
                <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
              </button>
            </div>

            <div className="mobile-nav-section mobile-nav-section-cta">
              <p className="mobile-nav-section-label">Start here</p>
              <ul className="mobile-nav-list">
                {mobileCtaItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <Link
                        to={item.href}
                        target={'target' in item ? item.target : undefined}
                        rel={'rel' in item ? item.rel : undefined}
                        className={`mobile-nav-section-link mobile-nav-cta mobile-nav-cta-${item.variant}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>,
        document.body
      )}

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onResultClick={handleSearchResultClick}
      />
    </>
  );
}

export default Header;

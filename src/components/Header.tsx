import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Info, Moon, Sun, Search, BookOpen, ShieldCheck, Users, LifeBuoy, Scale, Wrench, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SearchModal from './SearchModal';

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

  const navItems = useMemo(
    () => [
      { id: 'nav-how-it-works', icon: ShieldCheck, label: 'How It Works', href: '/how-it-works' },
      { id: 'nav-resources', icon: BookOpen, label: 'Resources', href: '/resources' },
      { id: 'nav-about', icon: Info, label: 'About', href: '/about' },
      { id: 'nav-support', icon: LifeBuoy, label: 'Support', href: '/support' },
    ],
    []
  );

  const mobilePrimaryItems = useMemo(
    () => [
      { id: 'mobile-nav-home', icon: ShieldCheck, label: 'Home', href: '/' },
      { id: 'mobile-nav-how-it-works', icon: ShieldCheck, label: 'How It Works', href: '/how-it-works' },
      { id: 'mobile-nav-resources', icon: BookOpen, label: 'Resources', href: '/resources' },
      { id: 'mobile-nav-about', icon: Info, label: 'About', href: '/about' },
      { id: 'mobile-nav-support', icon: LifeBuoy, label: 'Support', href: '/support' },
    ],
    []
  );

  const mobileSecondaryItems = useMemo(
    () => [
      { id: 'mobile-nav-privacy-tools', icon: Wrench, label: 'Privacy Tools', href: '/privacy-tools' },
      { id: 'mobile-nav-digital-rights', icon: Scale, label: 'Digital Rights', href: '/digital-rights' },
    ],
    []
  );

  const mobileCtaItems = useMemo(
    () => [
      { id: 'mobile-nav-family-hub', icon: LayoutDashboard, label: 'Open Family Hub', href: '/family-hub', variant: 'primary', target: '_blank', rel: 'noopener noreferrer' },
      { id: 'mobile-nav-get-started', icon: Users, label: 'Get Started', href: '/get-started', variant: 'secondary' },
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
            <Link to="/" className="logo" aria-label="PandaGarde - Go to homepage">
              <div className="logo-icon">
                <img src="/LogoPandagarde.png" alt="PandaGarde Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span>Panda<span className="highlight">Garde</span></span>
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

            <div className="nav-actions" aria-label="Utility actions">
              <Link
                to="/family-hub"
                target="_blank"
                rel="noopener noreferrer"
                className={`nav-cta nav-cta-primary ${isActive('/family-hub') ? 'active' : ''}`}
                aria-label="Open Family Hub workspace (opens in new tab)"
                aria-current={isActive('/family-hub') ? 'page' : undefined}
              >
                <LayoutDashboard size={16} aria-hidden="true" />
                <span>Family Hub</span>
              </Link>

              <Link
                to="/get-started"
                className={`nav-cta nav-cta-secondary ${isActive('/get-started') ? 'active' : ''}`}
                aria-current={isActive('/get-started') ? 'page' : undefined}
              >
                <span>Get Started</span>
              </Link>

              <button
                type="button"
                className="search-button"
                onClick={() => setIsSearchModalOpen(true)}
                aria-label="Open search"
                title="Search (Ctrl/Cmd + K)"
              >
                <Search size={18} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <button
                type="button"
                className="mobile-menu-toggle"
                onClick={handleMobileMenuToggle}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {isMobileMenuOpen && createPortal(
        <div className="mobile-nav-overlay" onClick={() => setIsMobileMenuOpen(false)}>
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

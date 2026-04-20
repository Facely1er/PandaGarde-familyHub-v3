import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  MoreHorizontal,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  Mail,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../Logo';

const ROUTE_TITLES: { test: (p: string) => boolean; title: string }[] = [
  { test: (p) => p.endsWith('/family-hub/login'), title: 'Sign in' },
  { test: (p) => p === '/family-hub' || p === '/family-hub/', title: 'PandaGarde Family Hub' },
  {
    test: (p) =>
      p.startsWith('/family-hub/learning') || p.startsWith('/family-hub/games'),
    title: 'Learn',
  },
  { test: (p) => p.startsWith('/family-hub/journeys'), title: 'Journeys' },
  { test: (p) => p.startsWith('/family-hub/certificates'), title: 'Certificates' },
  {
    test: (p) =>
      p.startsWith('/family-hub/profile') || p.startsWith('/family-hub/settings'),
    title: 'Profile',
  },
];

function titleForPath(pathname: string): string {
  return ROUTE_TITLES.find((r) => r.test(pathname))?.title ?? 'PandaGarde Family Hub';
}

function isHubHome(pathname: string) {
  return pathname === '/family-hub' || pathname === '/family-hub/';
}

const FamilyHubHeader: React.FC = () => {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLogin = pathname.endsWith('/family-hub/login');
  const title = titleForPath(pathname);
  const showBack = !isLogin && !isHubHome(pathname);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <div className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="absolute left-0 top-0 z-[100] m-2 rounded-lg bg-violet-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
      </div>

      <header
        className="relative z-50 flex h-[52px] shrink-0 items-center justify-center border-b border-teal-100/80 bg-white/90 px-2 shadow-sm backdrop-blur-md dark:border-gray-700/80 dark:bg-gray-950/95 dark:shadow-none safe-area-top"
        role="banner"
      >
        <div className="absolute left-1.5 top-1/2 flex -translate-y-1/2 items-center sm:left-3">
          {isLogin ? (
            <Link
              to="/"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-xl px-2 text-sm font-medium text-violet-700 touch-manipulation dark:text-violet-300"
            >
              <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Website</span>
            </Link>
          ) : showBack ? (
            <Link
              to="/family-hub"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-violet-700 touch-manipulation dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
              aria-label="Back to Family Hub home"
            >
              <ArrowLeft className="h-6 w-6" aria-hidden />
            </Link>
          ) : (
            <Link
              to="/family-hub"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center touch-manipulation hover:opacity-80 transition-opacity"
              aria-label="Family Hub home"
            >
              <div className="h-9 w-9">
                <Logo />
              </div>
            </Link>
          )}
        </div>

        <div className="pointer-events-none max-w-[58vw] text-center sm:max-w-[320px]">
          <h1 className="truncate text-base font-semibold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {!isLogin && isHubHome(pathname) && (
            <p className="truncate text-[10px] font-medium uppercase tracking-widest text-teal-600/80 dark:text-teal-400/90">
              PandaGarde
            </p>
          )}
        </div>

        <div
          className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center sm:right-3"
          ref={menuRef}
        >
          {isLogin ? (
            <button
              type="button"
              onClick={toggleTheme}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-gray-700 touch-manipulation dark:text-gray-200"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" aria-hidden />
              ) : (
                <Sun className="h-5 w-5" aria-hidden />
              )}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-gray-800 touch-manipulation dark:text-gray-100"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label="More options"
              >
                <MoreHorizontal className="h-6 w-6" aria-hidden />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+4px)] w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800"
                  role="menu"
                >
                  <Link
                    role="menuitem"
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700/60"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Globe className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    Main website
                  </Link>
                  <Link
                    role="menuitem"
                    to="/faq"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700/60"
                    onClick={() => setMenuOpen(false)}
                  >
                    <HelpCircle className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    FAQ
                  </Link>
                  <Link
                    role="menuitem"
                    to="/contact"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700/60"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Mail className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    Contact
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700/60"
                    onClick={() => {
                      toggleTheme();
                      setMenuOpen(false);
                    }}
                  >
                    {theme === 'light' ? (
                      <Moon className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    ) : (
                      <Sun className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    )}
                    {theme === 'light' ? 'Dark mode' : 'Light mode'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default FamilyHubHeader;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import {
  type LucideIcon,
  Home,
  Gamepad2,
  Map,
  Award,
  User,
  Globe,
  HelpCircle,
  Mail,
  Shield,
  Scale,
} from 'lucide-react';
import { PRIVACY_PORTAL_URL } from '../../config/portal';

interface TabItem {
  icon: LucideIcon;
  to: string;
  label: string;
  /** Match learning + games under one tab */
  match?: (path: string) => boolean;
}

const hubTabs: TabItem[] = [
  {
    icon: Home,
    to: '/family-hub',
    label: 'Home',
    match: (path) => path === '/family-hub' || path === '/family-hub/',
  },
  {
    icon: Gamepad2,
    to: '/family-hub/learning',
    label: 'Learn',
    match: (path) =>
      path.startsWith('/family-hub/learning') || path.startsWith('/family-hub/games'),
  },
  {
    icon: Map,
    to: '/family-hub/journeys',
    label: 'Journeys',
    match: (path) => path.startsWith('/family-hub/journeys'),
  },
  {
    icon: Award,
    to: '/family-hub/certificates',
    label: 'Awards',
    match: (path) => path.startsWith('/family-hub/certificates'),
  },
  {
    icon: User,
    to: '/family-hub/profile',
    label: 'Profile',
    match: (path) =>
      path.startsWith('/family-hub/profile') || path.startsWith('/family-hub/settings'),
  },
];

const FamilyHubFooter: React.FC = () => {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const isLogin = pathname.endsWith('/family-hub/login');
  const isLight = theme === 'light';

  if (isLogin) {
    return (
      <footer
        className={`mt-auto safe-area-bottom z-40 border-t backdrop-blur-md ${
          isLight
            ? 'border-slate-200/90 bg-white/95 text-slate-600 shadow-[0_-1px_0_rgba(0,0,0,0.04)]'
            : 'border-white/10 bg-slate-950/95 text-purple-200/90'
        }`}
        role="contentinfo"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-3 py-3 text-[11px]">
          <Link
            to="/"
            className={`font-medium transition-colors ${
              isLight ? 'text-teal-700 hover:text-teal-900' : 'text-white hover:text-amber-200'
            }`}
          >
            Main website
          </Link>
          <span className={isLight ? 'text-slate-300' : 'text-white/20'} aria-hidden>
            ·
          </span>
          <Link
            to="/privacy"
            className={isLight ? 'hover:text-slate-900' : 'hover:text-white'}
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className={isLight ? 'hover:text-slate-900' : 'hover:text-white'}
          >
            Terms
          </Link>
          <span className={`hidden sm:inline ${isLight ? 'text-slate-300' : 'text-white/20'}`} aria-hidden>
            ·
          </span>
          <span
            className={`w-full text-center sm:w-auto ${isLight ? 'text-slate-500' : 'text-purple-300/70'}`}
          >
            © 2026 PandaGarde
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-40 flex flex-col border-t backdrop-blur-xl safe-area-bottom ${
        isLight
          ? 'border-slate-200/80 bg-white/92 shadow-[0_-8px_32px_rgba(15,118,110,0.08)]'
          : 'border-white/10 bg-slate-950/95 shadow-[0_-4px_24px_rgba(0,0,0,0.35)]'
      }`}
      role="contentinfo"
    >
      {/* Primary hub tabs first (above fold next to main content); utility links at screen bottom */}
      <nav
        className={`grid min-h-[56px] grid-cols-5 border-b bg-gradient-to-b sm:min-h-[60px] ${
          isLight
            ? 'from-teal-50/90 via-cyan-50/40 to-white border-teal-100/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]'
            : 'from-teal-950/50 via-slate-950 to-slate-950 border-teal-800/40'
        }`}
        aria-label="Family Hub primary navigation"
      >
        {hubTabs.map(({ icon: Icon, to, label, match }) => {
          const active = match ? match(pathname) : pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={[
                'group flex min-h-[52px] flex-col items-center justify-center gap-0.5 px-1 py-1.5',
                'touch-manipulation transition-all duration-200 active:scale-[0.97]',
                isLight
                  ? active
                    ? 'text-teal-900'
                    : 'text-slate-600 hover:text-teal-800'
                  : active
                    ? 'text-amber-200'
                    : 'text-teal-100/75 hover:text-white',
              ].join(' ')}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-2xl transition-all duration-200',
                  isLight
                    ? active
                      ? 'bg-gradient-to-br from-[#0D7377] via-[#14919B] to-[#32B8C0] text-white shadow-md shadow-teal-600/25 ring-2 ring-white/90'
                      : 'bg-white/70 text-slate-500 shadow-sm ring-1 ring-teal-100/80 group-hover:bg-teal-100/90 group-hover:text-teal-800 group-hover:ring-teal-200/60'
                    : active
                      ? 'bg-gradient-to-br from-teal-400 to-cyan-300 text-teal-950 shadow-lg shadow-teal-900/40 ring-2 ring-teal-300/30'
                      : 'bg-white/10 text-teal-200/90 ring-1 ring-white/10 group-hover:bg-teal-500/20 group-hover:text-white',
                ].join(' ')}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 2}
                  className="shrink-0"
                  aria-hidden
                />
              </span>
              <span
                className={[
                  'max-w-full truncate text-center text-[10px] leading-tight sm:text-[11px]',
                  isLight
                    ? active
                      ? 'font-bold tracking-tight text-teal-900'
                      : 'font-semibold text-slate-600 group-hover:text-teal-800'
                    : active
                      ? 'font-bold text-amber-100'
                      : 'font-semibold text-teal-100/80 group-hover:text-white',
                ].join(' ')}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div
        className={`flex items-center justify-center gap-x-2 overflow-x-auto px-2 py-1.5 sm:gap-x-3 ${
          isLight ? 'bg-slate-50/80' : ''
        }`}
      >
        <Link
          to="/"
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors sm:text-xs ${
            isLight
              ? 'text-slate-600 hover:bg-white hover:text-teal-800'
              : 'text-purple-200 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Globe size={12} className="opacity-80" aria-hidden />
          Site
        </Link>
        <Link
          to="/faq"
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] transition-colors sm:text-xs ${
            isLight
              ? 'text-slate-600 hover:bg-white hover:text-teal-800'
              : 'text-purple-200/90 hover:bg-white/10 hover:text-white'
          }`}
        >
          <HelpCircle size={12} className="opacity-80" aria-hidden />
          FAQ
        </Link>
        <Link
          to="/contact"
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] transition-colors sm:text-xs ${
            isLight
              ? 'text-slate-600 hover:bg-white hover:text-teal-800'
              : 'text-purple-200/90 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Mail size={12} className="opacity-80" aria-hidden />
          Contact
        </Link>
        <Link
          to="/privacy"
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] transition-colors sm:text-xs ${
            isLight
              ? 'text-slate-600 hover:bg-white hover:text-teal-800'
              : 'text-purple-200/90 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Shield size={12} className="opacity-80" aria-hidden />
          Privacy
        </Link>
        <a
          href={PRIVACY_PORTAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex max-w-[140px] shrink-0 items-center gap-1 truncate rounded-full px-2.5 py-1 text-[10px] transition-colors sm:max-w-none sm:text-xs ${
            isLight
              ? 'text-slate-600 hover:bg-white hover:text-teal-800'
              : 'text-purple-200/90 hover:bg-white/10 hover:text-white'
          }`}
          aria-label="Open privacy portal to submit data rights requests (opens in new tab)"
        >
          <Scale size={12} className="shrink-0 opacity-80" aria-hidden />
          <span className="truncate">Data rights</span>
        </a>
      </div>
    </footer>
  );
};

export default FamilyHubFooter;

import React, { useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Gamepad2, Award, Settings, Moon, Sun, ArrowLeft, type LucideIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/family-hub/dashboard' },
  { id: 'kids', label: 'Kids', icon: Users, path: '/family-hub/kids' },
  { id: 'activities', label: 'Activities', icon: Gamepad2, path: '/family-hub/activities' },
  { id: 'progress', label: 'Progress', icon: Award, path: '/family-hub/progress' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/family-hub/settings' },
];

const AppShell: React.FC = () => {
  const location = useLocation();
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string): boolean => {
    if (path === '/family-hub/dashboard') {
      return location.pathname === '/family-hub/dashboard' || location.pathname === '/family-hub';
    }
    return location.pathname.startsWith(path);
  };

  const currentTab = tabs.find((tab) => isActive(tab.path));

  const onNavKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const currentIndex = tabRefs.current.findIndex((el) => el === document.activeElement);
    const fallbackIndex = tabs.findIndex((tab) => isActive(tab.path));
    const startIndex = currentIndex >= 0 ? currentIndex : Math.max(fallbackIndex, 0);

    if (event.key === 'Home') {
      tabRefs.current[0]?.focus();
      return;
    }
    if (event.key === 'End') {
      tabRefs.current[tabs.length - 1]?.focus();
      return;
    }

    const step = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (startIndex + step + tabs.length) % tabs.length;
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="family-hub-theme flex flex-col h-screen bg-gray-50 dark:bg-gray-900 safe-area-inset">
      <a
        href="#family-hub-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[90] focus:rounded-lg focus:bg-teal-700 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm safe-area-top">
        <div className="px-4 py-3 max-w-full">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <a
                href="/"
                className="shrink-0 flex items-center justify-center rounded-full overflow-hidden w-8 h-8 bg-white border border-gray-200 dark:border-gray-600 hover:opacity-80 transition-opacity"
                aria-label="Back to PandaGarde website"
                title="Back to PandaGarde"
              >
                <img
                  src="/LogoPandagarde.png"
                  alt="PandaGarde"
                  className="w-full h-full object-contain"
                />
              </a>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-teal-600 dark:text-teal-400 truncate">
                  PandaGarde Family Hub
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  {currentTab?.label ?? tabs[0].label}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
              </button>
              <a
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-teal-50 dark:bg-teal-900/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors"
                aria-label="Back to PandaGarde website"
              >
                <ArrowLeft size={12} aria-hidden="true" />
                PandaGarde
              </a>
            </div>
          </div>
        </div>
      </header>

      <main id="family-hub-main" className="flex-1 overflow-y-auto overscroll-contain pb-safe">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>

      <nav
        className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg safe-area-bottom"
        aria-label="Primary Family Hub navigation"
        onKeyDown={onNavKeyDown}
      >
        <ul className="grid grid-cols-5 h-16 max-w-full">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);

            return (
              <li key={tab.id} className="contents">
                <NavLink
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  to={tab.path}
                  className={[
                    'group flex flex-col items-center justify-center gap-0.5',
                    'min-h-[64px] min-w-[64px] touch-manipulation rounded-none',
                    'transition-all duration-200 active:scale-95',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500',
                    active
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-teal-50/70 dark:hover:bg-teal-900/15 active:bg-gray-100 dark:active:bg-gray-700',
                  ].join(' ')}
                  aria-current={active ? 'page' : undefined}
                >
                    <span
                      className={[
                        'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                        active
                          ? 'bg-teal-100 text-teal-700 dark:bg-teal-800/60 dark:text-teal-200'
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-teal-700 dark:group-hover:text-teal-300',
                      ].join(' ')}
                    >
                    <Icon size={20} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                  </span>
                  <span
                    className={[
                      'text-[10px] sm:text-xs',
                      active ? 'font-semibold' : 'font-medium',
                    ].join(' ')}
                  >
                    {tab.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AppShell;

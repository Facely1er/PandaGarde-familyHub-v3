import React, { useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Gamepad2, Award, Settings, Moon, Sun, ArrowLeft, type LucideIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getHubOrigin } from '../../lib/hubMission';
import { hubPaths, pandagardeWebsiteUrl, isHubStandalone } from '../hubPaths';

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: hubPaths.dashboard },
  { id: 'kids', label: 'Kids', icon: Users, path: hubPaths.kids },
  { id: 'activities', label: 'Activities', icon: Gamepad2, path: hubPaths.activities },
  { id: 'progress', label: 'Progress', icon: Award, path: hubPaths.progress },
  { id: 'settings', label: 'Settings', icon: Settings, path: hubPaths.settings },
];

const AppShell: React.FC = () => {
  const location = useLocation();
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string): boolean => {
    if (path === hubPaths.dashboard) {
      return location.pathname === hubPaths.dashboard || location.pathname === hubPaths.root;
    }
    return location.pathname.startsWith(path);
  };

  const currentTab = tabs.find((tab) => isActive(tab.path));
  const hubOrigin = getHubOrigin();

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
    <div className="family-hub-theme flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <a
        href="#family-hub-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[90] focus:rounded-lg focus:bg-teal-700 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <header className="shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="pt-[env(safe-area-inset-top,0px)]">
          <div className="flex h-11 max-w-full items-center justify-between gap-2 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))]">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <a
                href={isHubStandalone ? pandagardeWebsiteUrl : '/'}
                {...(isHubStandalone ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white hover:opacity-80 dark:border-gray-600 dark:bg-gray-900 transition-opacity"
                aria-label={hubOrigin === 'standalone' || isHubStandalone ? 'Open PandaGarde website (optional)' : 'Back to PandaGarde website'}
                title={hubOrigin === 'standalone' || isHubStandalone ? 'Website' : 'Back to PandaGarde'}
              >
                <img
                  src="/LogoPandagarde.png"
                  alt=""
                  className="h-full w-full object-contain p-0.5"
                  width={28}
                  height={28}
                />
              </a>
              <div className="flex min-w-0 items-center gap-1.5">
                <h1 className="truncate text-sm font-bold text-teal-700 dark:text-teal-400">
                  Family Hub
                </h1>
                <span className="shrink-0 text-gray-300 dark:text-gray-600" aria-hidden="true">
                  ·
                </span>
                <span className="truncate text-xs font-medium text-gray-600 dark:text-gray-400">
                  {currentTab?.label ?? tabs[0].label}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
              </button>
              <a
                href={isHubStandalone ? pandagardeWebsiteUrl : '/'}
                {...(isHubStandalone ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="hidden sm:inline-flex h-8 items-center gap-1 rounded-full bg-teal-50 px-2.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700 hover:bg-teal-100 dark:bg-teal-900/40 dark:text-teal-200 dark:hover:bg-teal-900/60 transition-colors"
                aria-label="Open PandaGarde website"
              >
                <ArrowLeft size={11} aria-hidden="true" />
                Site
              </a>
            </div>
          </div>
        </div>
      </header>

      <main id="family-hub-main" className="flex-1 overflow-y-auto overscroll-contain">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>

      <nav
        className="shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg pb-[env(safe-area-inset-bottom,0px)]"
        aria-label="Primary Family Hub navigation"
        onKeyDown={onNavKeyDown}
      >
        <ul className="grid h-16 max-w-full grid-cols-5">
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

import React, { useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Map,
  Moon,
  Sun,
  ArrowLeft,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { HubFamilyProvider } from '../../contexts/HubFamilyContext';
import { getHubOrigin } from '../../lib/hubMission';
import { openExternalUrl } from '../../lib/openExternalUrl';
import { hubPaths, pandagardeWebsiteUrl, isHubStandalone } from '../hubPaths';
import HubBrandLogo from './HubBrandLogo';
import { hubTheme } from '../hubTheme';

interface TabItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  path: string;
}

/** Primary destinations for parents and kids — settings live in the header */
const primaryTabs: TabItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard — today and quick stats',
    shortLabel: 'Dashboard',
    icon: LayoutDashboard,
    path: hubPaths.dashboard,
  },
  {
    id: 'journey',
    label: 'Mission progress — badges and certificates',
    shortLabel: 'Journey',
    icon: Map,
    path: hubPaths.journey,
  },
  {
    id: 'activities',
    label: 'Privacy missions for your family',
    shortLabel: 'Missions',
    icon: Gamepad2,
    path: hubPaths.activities,
  },
  {
    id: 'kids',
    label: 'Family profiles — add children and guardians',
    shortLabel: 'Family',
    icon: Users,
    path: hubPaths.kids,
  },
];

const settingsTab: TabItem = {
  id: 'settings',
  label: 'Settings and help',
  shortLabel: 'Settings',
  icon: Settings,
  path: hubPaths.settings,
};

const allTabs = [...primaryTabs, settingsTab];

const AppShell: React.FC = () => {
  const location = useLocation();
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const { theme, toggleTheme } = useTheme();

  const isTabActive = (path: string): boolean => {
    if (path === hubPaths.dashboard) {
      return location.pathname === hubPaths.dashboard || location.pathname === hubPaths.root;
    }
    if (path === hubPaths.journey) {
      return (
        location.pathname === hubPaths.journey ||
        location.pathname === hubPaths.progress ||
        location.pathname.startsWith(`${hubPaths.journey}/`)
      );
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const currentTab =
    allTabs.find((tab) => isTabActive(tab.path)) ??
    (location.pathname.startsWith(hubPaths.settings) ? settingsTab : primaryTabs[0]);

  const hubOrigin = getHubOrigin();
  const onSettingsPage = isTabActive(hubPaths.settings);

  const onOpenWebsite: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (!isHubStandalone) {
      return;
    }
    event.preventDefault();
    void openExternalUrl(pandagardeWebsiteUrl);
  };

  const onNavKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const currentIndex = tabRefs.current.findIndex((el) => el === document.activeElement);
    const fallbackIndex = primaryTabs.findIndex((tab) => isTabActive(tab.path));
    const startIndex = currentIndex >= 0 ? currentIndex : Math.max(fallbackIndex, 0);

    if (event.key === 'Home') {
      tabRefs.current[0]?.focus();
      return;
    }
    if (event.key === 'End') {
      tabRefs.current[primaryTabs.length - 1]?.focus();
      return;
    }

    const step = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (startIndex + step + primaryTabs.length) % primaryTabs.length;
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <HubFamilyProvider>
      <div className={hubTheme.shell}>
        <a
          href="#family-hub-main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[90] focus:rounded-lg focus:bg-teal-700 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>

        <header className={hubTheme.chromeHeader}>
          <div className="pt-[env(safe-area-inset-top,0px)]">
            <div className="flex h-11 max-w-full items-center justify-between gap-2 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))]">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <a
                  href={isHubStandalone ? pandagardeWebsiteUrl : '/'}
                  onClick={onOpenWebsite}
                  className="flex shrink-0 transition-opacity hover:opacity-80"
                  aria-label={
                    hubOrigin === 'standalone' || isHubStandalone
                      ? 'Open PandaGarde website (optional)'
                      : 'Back to PandaGarde website'
                  }
                  title={hubOrigin === 'standalone' || isHubStandalone ? 'Website' : 'Back to PandaGarde'}
                >
                  <HubBrandLogo size="xs" variant="plain" alt="PandaGarde" />
                </a>
                <div className="flex min-w-0 items-center gap-1.5">
                  <h1 className="truncate text-sm font-bold text-teal-700 dark:text-teal-400">PandaGarde</h1>
                  <span className="shrink-0 text-gray-300 dark:text-gray-600" aria-hidden="true">
                    ·
                  </span>
                  <span className="truncate text-xs font-medium text-gray-600 dark:text-gray-400">
                    {currentTab.label}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                  {theme === 'light' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
                </button>
                <NavLink
                  to={hubPaths.settings}
                  className={[
                    'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                    onSettingsPage
                      ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                      : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700',
                  ].join(' ')}
                  aria-label={settingsTab.label}
                  aria-current={onSettingsPage ? 'page' : undefined}
                >
                  <Settings size={16} aria-hidden="true" />
                </NavLink>
                <a
                  href={isHubStandalone ? pandagardeWebsiteUrl : '/'}
                  onClick={onOpenWebsite}
                  className="hidden h-8 items-center gap-1 rounded-full bg-teal-50 px-2.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700 transition-colors hover:bg-teal-100 dark:bg-teal-900/40 dark:text-teal-200 dark:hover:bg-teal-900/60 sm:inline-flex"
                  aria-label="Open PandaGarde website"
                >
                  <ArrowLeft size={11} aria-hidden="true" />
                  Site
                </a>
              </div>
            </div>
          </div>
        </header>

        <main id="family-hub-main" className={hubTheme.main}>
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>

        <nav
          className={hubTheme.chromeNav}
          aria-label="Primary Family Hub navigation"
          onKeyDown={onNavKeyDown}
        >
          <ul className="grid h-16 max-w-full grid-cols-4">
            {primaryTabs.map((tab, index) => {
              const Icon = tab.icon;
              const active = isTabActive(tab.path);

              return (
                <li key={tab.id} className="contents">
                  <NavLink
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    to={tab.path}
                    aria-label={tab.label}
                    className={[
                      'group flex flex-col items-center justify-center gap-0.5',
                      'min-h-[64px] w-full min-w-0 touch-manipulation rounded-none',
                      'transition-all duration-200 active:scale-95',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500',
                      active
                        ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                        : 'text-gray-600 hover:bg-teal-50/70 active:bg-gray-100 dark:text-gray-400 dark:hover:bg-teal-900/15 dark:active:bg-gray-700',
                    ].join(' ')}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span
                      className={[
                        'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                        active
                          ? 'bg-teal-100 text-teal-700 dark:bg-teal-800/60 dark:text-teal-200'
                          : 'text-gray-500 group-hover:text-teal-700 dark:text-gray-400 dark:group-hover:text-teal-300',
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
                      {tab.shortLabel}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </HubFamilyProvider>
  );
};

export default AppShell;

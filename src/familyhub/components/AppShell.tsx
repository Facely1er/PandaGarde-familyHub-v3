import React, { useMemo, useRef } from 'react';
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
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { hubTheme } from '../hubTheme';
import { HUB_BRAND_LINE_1, HUB_BRAND_LINE_2 } from '../constants';
import { useHubI18n } from '../hubI18n';
import { shouldHideHubWebsiteChrome } from '../../lib/hubWebsiteChrome';

interface TabItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  path: string;
}

/** Primary destinations for parents and kids — settings live in the header */
const AppShell: React.FC = () => {
  const location = useLocation();
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const { theme, toggleTheme } = useTheme();
  const { t } = useHubI18n();

  const primaryTabs: TabItem[] = useMemo(
    () => [
      {
        id: 'dashboard',
        label: t('hub.nav.dashboard.label'),
        shortLabel: t('hub.nav.dashboard.short'),
        icon: LayoutDashboard,
        path: hubPaths.dashboard,
      },
      {
        id: 'journey',
        label: t('hub.nav.journey.label'),
        shortLabel: t('hub.nav.journey.short'),
        icon: Map,
        path: hubPaths.journey,
      },
      {
        id: 'activities',
        label: t('hub.nav.activities.label'),
        shortLabel: t('hub.nav.activities.short'),
        icon: Gamepad2,
        path: hubPaths.activities,
      },
      {
        id: 'kids',
        label: t('hub.nav.kids.label'),
        shortLabel: t('hub.nav.kids.short'),
        icon: Users,
        path: hubPaths.kids,
      },
    ],
    [t]
  );

  const settingsTab: TabItem = useMemo(
    () => ({
      id: 'settings',
      label: t('hub.nav.settings.label'),
      shortLabel: t('hub.nav.settings.short'),
      icon: Settings,
      path: hubPaths.settings,
    }),
    [t]
  );

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

  const hubOrigin = getHubOrigin();
  const onSettingsPage = isTabActive(hubPaths.settings);
  const hideWebsiteChrome = shouldHideHubWebsiteChrome();

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
          {t('hub.nav.skipToMain')}
        </a>

        <header className={hubTheme.chromeHeader}>
          <div className="hub-header-row flex max-w-full items-center justify-between gap-2 pl-[max(0.75rem,var(--hub-safe-left,env(safe-area-inset-left,0px)))] pr-[max(0.75rem,var(--hub-safe-right,env(safe-area-inset-right,0px)))]">
            <div className="hub-header-brand flex min-w-0 flex-1 items-center">
              {hideWebsiteChrome ? (
                <div
                  className="flex shrink-0 items-center"
                  aria-label={`${HUB_BRAND_LINE_1} ${HUB_BRAND_LINE_2}`}
                >
                  <HubBrandLogo size="shell" variant="plain" alt="" />
                </div>
              ) : (
                <a
                  href={isHubStandalone ? pandagardeWebsiteUrl : '/'}
                  onClick={onOpenWebsite}
                  className="flex shrink-0 items-center transition-opacity hover:opacity-80"
                  aria-label={
                    hubOrigin === 'standalone' || isHubStandalone
                      ? t('hub.nav.openWebsite')
                      : t('hub.nav.backToWebsite')
                  }
                  title={hubOrigin === 'standalone' || isHubStandalone ? t('hub.nav.site') : t('hub.nav.backToWebsite')}
                >
                  <HubBrandLogo size="shell" variant="plain" alt="" />
                </a>
              )}
              <div className="hub-header-brand__text flex min-w-0 flex-col justify-center gap-px leading-none">
                <h1 className="whitespace-nowrap font-bold text-teal-700 dark:text-teal-400 text-[length:clamp(12px,3.25vw,14px)]">
                  <span className="block">{HUB_BRAND_LINE_1}</span>
                  <span className="block">{HUB_BRAND_LINE_2}</span>
                </h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  aria-label={theme === 'light' ? t('common.switchToDark') : t('common.switchToLight')}
                >
                  {theme === 'light' ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
                </button>
                <LanguageSwitcher variant="hub" className="shrink-0" />
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
                  <Settings size={18} aria-hidden="true" />
                </NavLink>
                {!hideWebsiteChrome && (
                <a
                  href={isHubStandalone ? pandagardeWebsiteUrl : '/'}
                  onClick={onOpenWebsite}
                  className="hidden h-8 items-center gap-1 rounded-full bg-teal-50 px-2.5 text-[11px] font-semibold uppercase tracking-wide text-teal-700 transition-colors hover:bg-teal-100 dark:bg-teal-900/40 dark:text-teal-200 dark:hover:bg-teal-900/60 sm:inline-flex"
                  aria-label={t('hub.nav.openWebsite')}
                >
                  <ArrowLeft size={12} aria-hidden="true" />
                  {t('hub.nav.site')}
                </a>
                )}
            </div>
          </div>
        </header>

        <div id="family-hub-main" className={hubTheme.main}>
          <div className="min-h-full">
            <Outlet />
          </div>
        </div>

        <nav
          className={hubTheme.chromeNav}
          aria-label={t('hub.nav.primary')}
          onKeyDown={onNavKeyDown}
        >
          <ul className="hub-bottom-nav-tabs grid max-w-full grid-cols-4">
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
                      'group flex h-full flex-col items-center justify-center gap-px',
                      'w-full min-w-0 touch-manipulation rounded-none',
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
                        'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                        active
                          ? 'bg-teal-100 text-teal-700 dark:bg-teal-800/60 dark:text-teal-200'
                          : 'text-gray-500 group-hover:text-teal-700 dark:text-gray-400 dark:group-hover:text-teal-300',
                      ].join(' ')}
                    >
                      <Icon size={20} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                    </span>
                    <span
                      className={[
                        'pb-px text-[12px] leading-none sm:text-[13px]',
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

/**
 * Family Hub semantic Tailwind tokens.
 * Solid surfaces only — no gradients in the hub shell.
 */
export const hubTheme = {
  shell:
    'hub-app-shell family-hub-theme flex h-full min-h-0 w-full max-w-full flex-1 flex-col overflow-x-hidden bg-gray-50 dark:bg-gray-950',
  chromeHeader:
    'hub-chrome-header shrink-0 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
  chromeNav:
    'hub-bottom-nav fixed inset-x-0 bottom-0 z-40 box-border border-t border-gray-200 bg-white pl-[max(0px,env(safe-area-inset-left,0px))] pr-[max(0px,env(safe-area-inset-right,0px))] shadow-lg dark:border-gray-700 dark:bg-gray-800',
  main: 'min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain pb-[var(--hub-nav-offset,4.75rem)]',
  page: 'min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950',
  /** Inner tab content — match HubPageLayout */
  pageContent:
    'mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-5 p-4 sm:gap-6 sm:p-6',
  surface: 'bg-white dark:bg-gray-800',
  surfaceMuted: 'bg-gray-50 dark:bg-gray-800/80',
  hero:
    'relative overflow-hidden rounded-3xl border border-teal-200 bg-teal-700 shadow-sm dark:border-teal-700 dark:bg-teal-900',
  card: 'rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
  heading: 'text-gray-900 dark:text-white',
  body: 'text-gray-600 dark:text-gray-300',
  muted: 'text-gray-500 dark:text-gray-400',
} as const;

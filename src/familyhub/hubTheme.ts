/**
 * Family Hub semantic Tailwind tokens.
 * Solid surfaces only — no gradients in the hub shell.
 */
export const hubTheme = {
  shell:
    'family-hub-theme flex h-screen w-full max-w-full flex-col overflow-x-hidden bg-gray-50 dark:bg-gray-950',
  chromeHeader:
    'shrink-0 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
  chromeNav:
    'shrink-0 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-lg dark:border-gray-700 dark:bg-gray-800',
  main: 'min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain',
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

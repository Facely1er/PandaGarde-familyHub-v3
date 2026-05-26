/**
 * Tailwind grays map to inverted CSS variables in dark mode (see tailwind.config.js).
 * Use these semantic tokens on DFA journey pages so cards/text stay readable.
 */
export const dfaTheme = {
  page: 'min-h-screen bg-gray-50 py-8 text-gray-900 dark:bg-surface dark:text-dark-text-primary sm:py-12',
  pageTight: 'min-h-screen bg-gray-50 py-8 text-gray-900 dark:bg-surface dark:text-dark-text-primary',
  card: 'border border-gray-200 bg-white shadow-sm dark:border-dark-border dark:bg-dark-surface-elevated',
  cardLg: 'rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-dark-border dark:bg-dark-surface-elevated',
  cardMuted:
    'rounded-2xl border border-dashed border-gray-300 bg-gray-50 dark:border-dark-border dark:bg-dark-surface',
  title: 'text-gray-900 dark:text-dark-text-primary',
  titleBold: 'font-bold text-gray-900 dark:text-dark-text-primary',
  body: 'text-gray-600 dark:text-dark-text-secondary',
  bodySm: 'text-sm text-gray-600 dark:text-dark-text-secondary',
  link: 'font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-dark-text-secondary dark:hover:text-dark-text-primary',
  btnOutline:
    'inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-dark-border dark:bg-dark-surface-elevated dark:text-dark-text-primary dark:hover:bg-gray-300',
  band: 'border-b border-gray-200 bg-gray-50 dark:border-dark-border dark:bg-dark-surface',
} as const;

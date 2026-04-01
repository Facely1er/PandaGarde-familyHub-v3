/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        'dark-bg': 'var(--white)',
        'dark-surface': 'var(--gray-100)',
        'dark-surface-elevated': 'var(--gray-200)',
        'dark-border': 'var(--gray-300)',
        'dark-text-primary': 'var(--gray-900)',
        'dark-text-secondary': 'var(--gray-700)',
        'dark-text-tertiary': 'var(--gray-600)',
      },
    },
  },
  plugins: [],
};

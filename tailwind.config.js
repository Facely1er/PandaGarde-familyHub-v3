import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'primary-dark': 'var(--primary-dark)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        'gray-100': 'var(--gray-100)',
        'gray-200': 'var(--gray-200)',
        'gray-300': 'var(--gray-300)',
        'gray-600': 'var(--gray-600)',
        'gray-700': 'var(--gray-700)',
        'gray-800': 'var(--gray-800)',
        'gray-900': 'var(--gray-900)',
        surface: 'var(--white)',
        light: 'var(--light)',
        'dark-bg': 'var(--white)',
        'dark-surface': 'var(--gray-100)',
        'dark-surface-elevated': 'var(--gray-200)',
        'dark-border': 'var(--gray-300)',
        'dark-text-primary': 'var(--gray-900)',
        'dark-text-secondary': 'var(--gray-700)',
        'dark-text-tertiary': 'var(--gray-600)',
      },
      borderRadius: {
        card: 'var(--border-radius)',
        'card-lg': 'var(--border-radius-lg)',
      },
      boxShadow: {
        card: 'var(--shadow-md)',
        'card-hover': 'var(--shadow-lg)',
      },
    },
  },
  plugins: [typography],
};

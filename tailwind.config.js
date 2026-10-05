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
        /* Full gray scale → theme CSS vars; RGB channels enable /opacity modifiers */
        gray: {
          50: 'rgb(var(--gray-50-rgb) / <alpha-value>)',
          100: 'rgb(var(--gray-100-rgb) / <alpha-value>)',
          200: 'rgb(var(--gray-200-rgb) / <alpha-value>)',
          300: 'rgb(var(--gray-300-rgb) / <alpha-value>)',
          400: 'rgb(var(--gray-400-rgb) / <alpha-value>)',
          500: 'rgb(var(--gray-500-rgb) / <alpha-value>)',
          600: 'rgb(var(--gray-600-rgb) / <alpha-value>)',
          700: 'rgb(var(--gray-700-rgb) / <alpha-value>)',
          800: 'rgb(var(--gray-800-rgb) / <alpha-value>)',
          900: 'rgb(var(--gray-900-rgb) / <alpha-value>)',
          950: 'rgb(var(--gray-950-rgb) / <alpha-value>)',
        },
        surface: 'var(--white)',
        light: 'var(--light)',
        'dark-bg': 'var(--white)',
        'dark-surface': 'var(--gray-900)',
        'dark-surface-elevated': 'var(--gray-800)',
        'dark-border': 'var(--gray-700)',
        'dark-text-primary': 'var(--gray-100)',
        'dark-text-secondary': 'var(--gray-300)',
        'dark-text-tertiary': 'var(--gray-400)',
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

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{svelte,ts,js}',
    '../cards/src/**/*.{svelte,ts,js}',
    '../graph/src/**/*.{svelte,ts,js}',
    '../shared/src/**/*.{svelte,ts,js}',
    '../../packages/ui/src/**/*.{svelte,ts,js}',
  ],
  theme: {
    extend: {
      // ===== COLORS: Use CSS variables from app.css =====
      colors: {
        // Primary brand colors (maps to --color-primary-*)
        primary: {
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700) / <alpha-value>)',
          800: 'rgb(var(--color-primary-800) / <alpha-value>)',
          900: 'rgb(var(--color-primary-900) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-primary-500) / <alpha-value>)',
        },
        // Semantic colors
        success: {
          light: 'rgb(var(--color-success-light) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)',
          dark: 'rgb(var(--color-success-dark) / <alpha-value>)',
        },
        warning: {
          light: 'rgb(var(--color-warning-light) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)',
          dark: 'rgb(var(--color-warning-dark) / <alpha-value>)',
        },
        danger: {
          light: 'rgb(var(--color-danger-light) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-danger) / <alpha-value>)',
          dark: 'rgb(var(--color-danger-dark) / <alpha-value>)',
        },
        // Semantic theme colors (auto light/dark)
        page: 'rgb(var(--bg-page) / <alpha-value>)',
        surface: 'rgb(var(--bg-surface) / <alpha-value>)',
        elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
      },
      // ===== SPACING: Use CSS variables =====
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        'card': 'var(--spacing-card)',
        'card-compact': 'var(--spacing-card-compact)',
        'section': 'var(--spacing-section)',
      },
      // ===== BORDER RADIUS: Use CSS variables =====
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        'card': 'var(--radius-lg)',
        'full': 'var(--radius-full)',
      },
      // ===== FONT FAMILY: Use CSS variables =====
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      // ===== FONT SIZES: Use CSS variables =====
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
      },
      // ===== BOX SHADOW: Use CSS variables =====
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      // ===== TRANSITIONS: Use CSS variables =====
      transitionDuration: {
        fast: 'var(--transition-fast)',
        DEFAULT: 'var(--transition-base)',
        slow: 'var(--transition-slow)',
      },
      // ===== Z-INDEX: Use CSS variables =====
      zIndex: {
        base: 'var(--z-base)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
      },
    },
  },
  plugins: [],
};

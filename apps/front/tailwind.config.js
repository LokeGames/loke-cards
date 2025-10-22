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
      // Custom color palette for Loke Cards
      colors: {
        // Primary brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Default blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Semantic colors
        success: {
          light: '#10b981',
          DEFAULT: '#059669',
          dark: '#047857',
        },
        warning: {
          light: '#f59e0b',
          DEFAULT: '#d97706',
          dark: '#b45309',
        },
        danger: {
          light: '#ef4444',
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
        },
      },
      // Custom spacing for consistent layouts
      spacing: {
        'card': '1.5rem', // p-6
        'card-compact': '1rem', // p-4
        'section': '2rem', // p-8
      },
      // Custom border radius
      borderRadius: {
        'card': '0.5rem', // rounded-lg
      },
    },
  },
  plugins: [],
};

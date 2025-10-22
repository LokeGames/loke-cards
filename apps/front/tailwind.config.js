/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{svelte,ts,js}',
    '../cards/src/**/*.{svelte,ts,js}',
    '../graph/src/**/*.{svelte,ts,js}',
    '../../shared/src/**/*.{svelte,ts,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

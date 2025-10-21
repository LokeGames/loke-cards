/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
    "./cards/src/**/*.{svelte,js,ts}",
    "./shared/src/**/*.{svelte,js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

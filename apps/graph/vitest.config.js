import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [svelte({ hot: false })],
  resolve: {
    alias: {
      '@apps-graph': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['svelte'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    include: ['tests/**/*.test.{js,ts}'],
    deps: {
      inline: [/svelte/, /@sveltejs/],
    },
  },
});


import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { svelteUnitPlugin } from '../config/vitest/svelte-unit-plugin.js';

export default defineConfig({
  plugins: [svelteUnitPlugin()],
  resolve: {
    conditions: ['browser'],
    alias: {
      '@shared': fileURLToPath(new URL('../shared/src', import.meta.url)),
    },
    dedupe: ['svelte'],
  },
  server: { hmr: false },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    globals: true,
    include: ['tests/**/*.test.{js,ts}'],
    deps: {
      optimizer: {
        web: {
          include: ['svelte', '@sveltejs/kit', '@sveltejs/vite-plugin-svelte'],
        },
      },
    },
  },
});

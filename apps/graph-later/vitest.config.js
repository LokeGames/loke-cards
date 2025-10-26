import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { svelteUnitPlugin } from '../../config/vitest/svelte-unit-plugin.js';

export default defineConfig({
  plugins: [svelteUnitPlugin()],
  resolve: {
    conditions: ['browser'],
    alias: {
      '@apps-graph': fileURLToPath(new URL('./src', import.meta.url)),
      'litegraph.js': fileURLToPath(new URL('./tests/stubs/litegraph.ts', import.meta.url)),
      comlink: fileURLToPath(
        new URL('../../workers/data/node_modules/comlink/dist/esm/comlink.mjs', import.meta.url)
      ),
    },
    dedupe: ['svelte'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
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

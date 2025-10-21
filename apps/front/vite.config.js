import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('../../shared/src', import.meta.url)),
      '@workers-data': fileURLToPath(new URL('../../workers/data/src', import.meta.url)),
      '@apps-cards': fileURLToPath(new URL('../../apps/cards/src', import.meta.url)),
      '@apps-graph': fileURLToPath(new URL('../../apps/graph/src', import.meta.url)),
    },
  },
  server: { port: 5183 },
});

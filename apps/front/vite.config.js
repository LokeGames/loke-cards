import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const workersSrc = fileURLToPath(new URL('../../workers/data/src', import.meta.url));

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('../../shared/src', import.meta.url)),
      '@workers-data': fileURLToPath(new URL('../../workers/data/src', import.meta.url)),
      '@schemas': fileURLToPath(new URL('../../packages/schemas/src', import.meta.url)),
      '@apps-cards': fileURLToPath(new URL('../../apps/cards/src', import.meta.url)),
      '@apps-graph': fileURLToPath(new URL('../../apps/graph/src', import.meta.url)),
      '@loke/workers-data': fileURLToPath(new URL('../../workers/data', import.meta.url)),
      comlink: fileURLToPath(new URL('../../node_modules/.pnpm/comlink@4.4.2/node_modules/comlink/dist/esm/comlink.mjs', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        app: './src/app.html',
        worker: '../../workers/data/src/worker.ts',
      },
      output: {
        entryFileNames: assetInfo => {
          if (assetInfo.name === 'worker') {
            return 'worker.js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
  server: {
    port: 5183,
    fs: {
      allow: [repoRoot, workersSrc],
    },
  },
});

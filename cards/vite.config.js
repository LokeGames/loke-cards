import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      '@workers-data': fileURLToPath(new URL('../workers/data/src', import.meta.url)),
      '@schemas': fileURLToPath(new URL('../packages/schemas/src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
});

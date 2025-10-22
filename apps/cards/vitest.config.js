import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [svelte({ compilerOptions: { generate: 'dom' } })],
  resolve: {
    alias: {
      '@shared': (() => {
        const resolvedPath = fileURLToPath(new URL('../../shared/src', import.meta.url));
        console.log('Resolved @shared alias to:', resolvedPath);
        return resolvedPath;
      })(),
      '@ui': fileURLToPath(new URL('../../packages/ui/src', import.meta.url)),
      '@workers-data': fileURLToPath(new URL('../../workers/data/src', import.meta.url)),
    },
    dedupe: ['svelte'],
  },
  server: { hmr: false },
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

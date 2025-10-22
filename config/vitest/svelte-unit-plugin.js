import { compile } from 'svelte/compiler';
import path from 'node:path';

const DEFAULT_COMPILER_OPTIONS = {
  generate: 'dom',
  hydratable: false,
  runes: false,
};

export function svelteUnitPlugin({ compilerOptions = {} } = {}) {
  const opts = { ...DEFAULT_COMPILER_OPTIONS, ...compilerOptions };

  return {
    name: 'vitest-svelte-unit',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source.startsWith('svelte/')) {
        return null; // delegate to Node resolution
      }
      if (source.endsWith('.svelte') && importer) {
        return path.resolve(path.dirname(importer), source);
      }
      return null;
    },
    async transform(code, id) {
      if (!id.endsWith('.svelte')) {
        return null;
      }

      const filename = id.split('?')[0];
      const compiled = compile(code, { filename, ...opts });

      return {
        code: compiled.js.code,
        map: compiled.js.map,
      };
    },
    handleHotUpdate() {
      // No-op; Vitest triggers full reloads for component updates.
      return [];
    },
  };
}

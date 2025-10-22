import { useDebugStore } from '@cards/stores/debug.js';

import type { App } from 'vue';
import type { Router } from 'vue-router';
import type { Pinia } from 'pinia';

export function setupErrorMonitoring(app: App, router: Router, pinia: Pinia) {
  const store = pinia ? useDebugStore(pinia) : useDebugStore();

  const add = (err: unknown) => {
    const entry = err instanceof Error ? err : { message: String(err) } as any;
    try { store.add(entry); } catch {}
    // eslint-disable-next-line no-console
    try { console.error('[Captured Error]', err); } catch {}
  };

  app.config.errorHandler = (err) => add(err);
  window.addEventListener('error', (ev) => add(ev?.error || ev?.message || 'Unknown error'));
  window.addEventListener('unhandledrejection', (ev) => add(ev?.reason || 'Unhandled rejection'));
  if (router && router.onError) {
    router.onError((err) => add(err));
  }
}

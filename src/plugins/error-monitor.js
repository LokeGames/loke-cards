export function setupErrorMonitoring(app, router) {
  const add = (err) => {
    try {
      // Lazy import to avoid circular import at setup time
      const { useDebugStore } = require('../stores/debug.js');
      const store = useDebugStore();
      store.add(err instanceof Error ? err : { message: String(err) });
      // eslint-disable-next-line no-console
      console.error('[Captured Error]', err);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[Error monitor failed]', e);
    }
  };

  app.config.errorHandler = (err) => add(err);
  window.addEventListener('error', (ev) => add(ev?.error || ev?.message || 'Unknown error'));
  window.addEventListener('unhandledrejection', (ev) => add(ev?.reason || 'Unhandled rejection'));
  if (router && router.onError) {
    router.onError((err) => add(err));
  }
}


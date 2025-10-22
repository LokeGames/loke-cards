import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@cards/App.vue'
import router from '@cards/router'
import '@cards/styles/main.css'
import { setupErrorMonitoring } from '@cards/plugins/error-monitor'
import { startSyncHeartbeat } from '@cards/plugins/sync-heartbeat'
import { autoBootstrapLocalFromServerIfEmpty } from '@cards/lib/importer'
import { useUiStore } from '@shared/stores/ui'
import { useProjectStore } from '@cards/stores/project'

// Create Vue app
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()
app.use(pinia)

// Use router
app.use(router)

// Error monitoring (dev only)
if (import.meta.env.DEV) {
  setupErrorMonitoring(app, router, pinia)
}

// Mount app
app.mount('#app')

console.log('🚀 Loke Cards Vue 3 initialized!')

// Register Service Worker in production
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[SW] registered', reg.scope)
      })
      .catch((err) => {
        console.warn('[SW] registration failed', err)
      })
  })
}

// Start live backend heartbeat (updates sync status)
startSyncHeartbeat(pinia)

// Offline-first bootstrap: if local DB is empty and backend is available, import once
autoBootstrapLocalFromServerIfEmpty().then((res) => {
  if (res && typeof res === 'object') {
    console.log(`[bootstrap] Imported ${res.scenes} scenes / ${res.chapters} chapters from server to local`)
  }
}).catch(() => {})

// Initialize project store early so selection is ready for filters
try { const ps = useProjectStore(pinia); ps.init(); } catch {}

// Always close mobile sidebar on route change to avoid stuck overlays
try {
  router.afterEach(() => {
    try { const ui = useUiStore(pinia); ui.closeSidebar() } catch {}
  })
} catch {}

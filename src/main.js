import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.css'
import { setupErrorMonitoring } from './plugins/error-monitor'

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

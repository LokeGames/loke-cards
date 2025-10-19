import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.css'

// Create Vue app
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()
app.use(pinia)

// Use router
app.use(router)

// Mount app
app.mount('#app')

console.log('🚀 Loke Cards Vue 3 initialized!')

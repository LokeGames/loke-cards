import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
// Reuse loke-cards CSS
import '../../../src/styles/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')


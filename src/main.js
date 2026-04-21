import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

createApp(App).use(createPinia()).use(router).mount('#app')

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/digitallishka/sw.js').catch(() => {})
}

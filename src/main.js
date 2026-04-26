import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

createApp(App).use(createPinia()).use(router).mount('#app')

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  const base = import.meta.env.BASE_URL || '/'
  navigator.serviceWorker.register(base + 'sw.js').then((reg) => {
    reg.update()
  }).catch(() => {})
  // Clear all caches on load
  if ('caches' in window) {
    caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)))
  }
}

<template>
  <Transition name="install-banner">
    <div v-if="showBanner" class="install-banner" @click="installApp">
      <div class="install-content">
        <div class="install-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5D87FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <span class="install-text">התקן את האפליקציה</span>
      </div>
      <button class="install-dismiss" @click.stop="dismiss">
        <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
          <path d="M1 1L9 9M9 1L1 9" stroke="#999" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showBanner = ref(false)
let deferredPrompt = null

onMounted(() => {
  // Don't show if already in standalone / app mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
  if (isStandalone) return

  // Don't show if user previously dismissed
  if (sessionStorage.getItem('pwa-dismissed')) return

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showBanner.value = true
  })

  // iOS Safari: no beforeinstallprompt, show manual hint
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream
  const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios/i.test(navigator.userAgent)
  if (isIOS && isSafari) {
    showBanner.value = true
  }
})

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null
      showBanner.value = false
    })
  } else {
    // iOS fallback — just dismiss since we can't programmatically install
    alert('לחצו על "שתף" ואז "הוסף למסך הבית"')
    showBanner.value = false
  }
}

function dismiss() {
  showBanner.value = false
  sessionStorage.setItem('pwa-dismissed', '1')
}
</script>

<style scoped>
.install-banner {
  position: fixed;
  bottom: calc(var(--bottom-nav-h) + 8px);
  left: 16px;
  right: 16px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,.15);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 150;
  direction: rtl;
}

.install-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.install-icon {
  width: 36px;
  height: 36px;
  background: #EFF3FF;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.install-text {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #2F305C;
}

.install-dismiss {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  flex-shrink: 0;
}

.install-banner-enter-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.install-banner-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.install-banner-enter-from,
.install-banner-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>

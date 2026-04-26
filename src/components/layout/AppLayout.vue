<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
import AppSidebar   from './AppSidebar.vue'
import MobileHeader from './MobileHeader.vue'
import BottomNav    from './BottomNav.vue'
import InstallPrompt from '../ui/InstallPrompt.vue'

const route = useRoute()
const router = useRouter()
const store = useAppStore()
const pageContent = ref(null)
const showTestMenu = ref(false)
const isIntro = computed(() => route.path === '/intro')

function toggleTestMenu() {
  showTestMenu.value = !showTestMenu.value
}

watch(() => route.path, () => {
  if (pageContent.value) pageContent.value.scrollTop = 0
  showTestMenu.value = false
})
</script>

<template>
  <div class="app-layout">
    <!-- mobile only -->
    <MobileHeader v-if="!isIntro" />

    <!-- desktop only -->
    <AppSidebar />

    <div class="app-main">
      <!-- desktop topbar -->
      <header class="desktop-topbar">
        <div class="topbar-search">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"/>
          </svg>
          <span>חיפוש...</span>
        </div>
        <div class="topbar-user">נ</div>
      </header>

      <main ref="pageContent" class="page-content">
        <slot />
      </main>
    </div>

    <!-- mobile only -->
    <BottomNav v-if="!isIntro" />
    <InstallPrompt v-if="!isIntro" />

    <!-- Test toggle -->
    <div v-if="!isIntro" class="test-float-wrap">
      <button class="test-toggle-float" :class="{ 'test-toggle-float--active': showTestMenu }" @click="toggleTestMenu()">
        🧪
      </button>
      <transition name="test-menu">
        <div v-if="showTestMenu" class="test-menu">
          <button class="test-menu-btn" @click="router.push('/intro'); showTestMenu = false">🏠 אינטרו</button>
          <button class="test-menu-btn" :class="{ 'test-menu-btn--active': store.showTestInfo }" @click="store.toggleTestInfo(); showTestMenu = false">🧪 מידע טסט</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* ── Mobile (default) ── */
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
}
.desktop-topbar { display: none; }
.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: var(--bottom-nav-h);
}

.test-toggle-float {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #FFD16A;
  background: #FFF3CD;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.test-toggle-float--active {
  opacity: 1;
  box-shadow: 0 0 0 3px rgba(255, 209, 106, 0.5);
}

.test-float-wrap {
  position: fixed;
  bottom: calc(var(--bottom-nav-h, 60px) + 16px);
  left: 12px;
  z-index: 149;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
  gap: 16px;
}

.test-menu {
  position: absolute;
  bottom: 52px;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #fff;
  border: 1.5px solid #FFD16A;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.test-menu-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  background: #FFF3CD;
  font-family: 'Heebo', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}
.test-menu-btn:active {
  background: #FFE69C;
}
.test-menu-btn--active {
  background: #D4EDDA;
  border: 1.5px solid #6BCB77;
}

.test-menu-enter-active { transition: opacity 0.2s, transform 0.2s; }
.test-menu-leave-active { transition: opacity 0.15s, transform 0.15s; }
.test-menu-enter-from, .test-menu-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
</style>

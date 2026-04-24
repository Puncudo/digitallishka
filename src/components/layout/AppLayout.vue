<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
import AppSidebar   from './AppSidebar.vue'
import MobileHeader from './MobileHeader.vue'
import BottomNav    from './BottomNav.vue'
import InstallPrompt from '../ui/InstallPrompt.vue'

const route = useRoute()
const store = useAppStore()
const pageContent = ref(null)

watch(() => route.path, () => {
  if (pageContent.value) pageContent.value.scrollTop = 0
})
</script>

<template>
  <div class="app-layout">
    <!-- mobile only -->
    <MobileHeader />

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
    <BottomNav />
    <InstallPrompt />

    <!-- Test toggle -->
    <button class="test-toggle-float" :class="{ 'test-toggle-float--active': store.showTestInfo }" @click="store.toggleTestInfo()">
      🧪
    </button>
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
  position: fixed;
  bottom: calc(var(--bottom-nav-h, 60px) + 12px);
  left: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #FFD16A;
  background: #FFF3CD;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  z-index: 999;
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
</style>

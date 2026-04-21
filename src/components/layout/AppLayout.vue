<script setup>
import AppSidebar   from './AppSidebar.vue'
import MobileHeader from './MobileHeader.vue'
import BottomNav    from './BottomNav.vue'
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

      <main class="page-content">
        <slot />
      </main>
    </div>

    <!-- mobile only -->
    <BottomNav />
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
</style>

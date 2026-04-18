<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'
import mockData from '@/data/mock.json'

const items = mockData.bottomNav
</script>

<template>
  <nav class="bottom-nav">
    <router-link
      v-for="item in items"
      :key="item.id"
      :to="item.route"
      class="nav-item"
    >
      <AppIcon :name="item.icon" :size="22" />
      <span>{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0; right: 0; left: 0;
  z-index: 100;
  height: var(--bottom-nav-h);
  background: var(--surface);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 16px;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 500;
  text-decoration: none;
  transition: color .15s;
}
.nav-item.router-link-exact-active { color: var(--blue-mid); }

/* hidden on desktop */
@media (min-width: 768px) {
  .bottom-nav { display: none; }
}
</style>

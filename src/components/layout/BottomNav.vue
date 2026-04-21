<script setup>
import { useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import mockData from '@/data/mock.json'

const route = useRoute()
const items = mockData.bottomNav

function isActive(item) {
  const path = route.path
  if (item.id === 'search') {
    return path === '/search' || path.startsWith('/candidates/')
  }
  if (item.id === 'home') {
    return path === '/home'
  }
  return path === item.route
}
</script>

<template>
  <nav class="bottom-nav">
    <router-link
      v-for="item in items"
      :key="item.id"
      :to="item.route"
      class="nav-item"
      :class="{ active: isActive(item) }"
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
.nav-item.router-link-exact-active,
.nav-item.active { color: var(--blue-mid); }
</style>

<script setup>
import { useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import mockData from '@/data/mock.json'

const route    = useRoute()
const navItems = mockData.navItems

function isActive(item) {
  return route.path.startsWith(item.route.split('/')[1] ? '/' + item.route.split('/')[1] : item.route)
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__logo">LOGO</div>

    <nav class="sidebar__nav">
      <router-link
        v-for="item in navItems"
        :key="item.id"
        :to="item.route"
        class="nav-item"
        :class="{ active: $route.path.includes(item.id) || ($route.path === '/' && item.id === 'candidates') }"
      >
        <AppIcon :name="item.icon" :size="18" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar__bottom">
      <router-link to="/settings" class="nav-item">
        <AppIcon name="settings" :size="18" />
        <span>הגדרות</span>
      </router-link>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: none;
}
</style>

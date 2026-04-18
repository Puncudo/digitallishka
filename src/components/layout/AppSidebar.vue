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
  display: none; /* hidden on mobile */
}

@media (min-width: 768px) {
  .sidebar {
    display: flex;
    flex-direction: column;
    width: var(--sidebar-w);
    flex-shrink: 0;
    background: var(--surface);
    border-left: 1px solid var(--border);
    height: 100vh;
    position: sticky;
    top: 0;
    overflow-y: auto;
  }
  .sidebar__logo {
    padding: 20px 18px 16px;
    font-size: 18px;
    font-weight: 800;
    color: var(--blue-dark);
    border-bottom: 1px solid var(--border);
    letter-spacing: -0.5px;
  }
  .sidebar__nav {
    flex: 1;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    transition: all .15s;
    cursor: pointer;
    text-decoration: none;
  }
  .nav-item:hover { background: var(--bg); color: var(--text-primary); }
  .nav-item.active,
  .nav-item.router-link-active {
    background: var(--blue-soft);
    color: var(--blue-mid);
    font-weight: 600;
  }
  .sidebar__bottom {
    padding: 12px 10px;
    border-top: 1px solid var(--border);
  }
}
</style>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const title = route.meta.title || 'עמוד'
</script>

<template>
  <div class="placeholder">
    <div class="placeholder__icon">🔧</div>
    <div class="placeholder__title">{{ title }}</div>
    <div class="placeholder__sub">בשיפוצים</div>
  </div>
</template>

<style scoped>
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 12px;
  color: var(--text-muted);
}
.placeholder__icon  { font-size: 48px; }
.placeholder__title { font-size: 20px; font-weight: 700; color: var(--text-secondary); }
.placeholder__sub   { font-size: 14px; }
</style>

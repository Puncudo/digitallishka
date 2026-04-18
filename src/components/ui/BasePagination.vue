<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  total:       { type: Number, required: true },
  currentPage: { type: Number, required: true },
  pageSize:    { type: Number, default: 7 }
})

const emit = defineEmits(['change'])

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const start = computed(() => (props.currentPage - 1) * props.pageSize + 1)
const end   = computed(() => Math.min(props.currentPage * props.pageSize, props.total))

const pages = computed(() => {
  const result = []
  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || Math.abs(i - props.currentPage) <= 1) {
      result.push({ type: 'page', value: i })
    } else if (Math.abs(i - props.currentPage) === 2) {
      if (result[result.length - 1]?.type !== 'ellipsis') {
        result.push({ type: 'ellipsis', value: i })
      }
    }
  }
  return result
})

function go(p) {
  if (p >= 1 && p <= totalPages.value) emit('change', p)
}
</script>

<template>
  <div v-if="totalPages > 1" class="pagination">
    <button class="page-btn nav" :disabled="currentPage === 1" @click="go(currentPage - 1)">
      <AppIcon name="chevronR" :size="14" />
    </button>

    <template v-for="item in pages" :key="item.value">
      <span v-if="item.type === 'ellipsis'" class="ellipsis">…</span>
      <button
        v-else
        class="page-btn"
        :class="{ active: item.value === currentPage }"
        @click="go(item.value)"
      >{{ item.value }}</button>
    </template>

    <button class="page-btn nav" :disabled="currentPage === totalPages" @click="go(currentPage + 1)">
      <AppIcon name="chevronL" :size="14" />
    </button>

    <span class="page-info">{{ start }}–{{ end }} מתוך {{ total }}</span>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
}
.page-btn {
  width: 30px; height: 30px;
  border-radius: var(--radius-sm);
  font-size: 12px; font-weight: 500;
  color: var(--text-secondary);
  border: 1px solid transparent;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s; cursor: pointer; background: none;
}
.page-btn.active { background: var(--blue-mid); color: #fff; border-color: var(--blue-mid); }
.page-btn:hover:not(.active):not(:disabled) { border-color: var(--border); background: var(--bg); }
.page-btn:disabled { opacity: .35; cursor: default; }
.page-btn.nav { color: var(--blue-mid); }
.ellipsis { color: var(--text-muted); padding: 0 2px; font-size: 13px; }
.page-info { font-size: 12px; color: var(--text-muted); margin-right: 8px; }
</style>

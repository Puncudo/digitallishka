<script setup>
defineProps({
  type:  { type: String, default: 'neutral' },
  label: { type: String, required: true }
})
</script>

<template>
  <span class="badge" :class="`badge--${type}`">{{ label }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.4;
}
.badge--success { background: #dcfce7; color: #15803d; }
.badge--danger  { background: #fee2e2; color: #b91c1c; }
.badge--warning { background: #fef9c3; color: #92400e; }
.badge--neutral { background: #f1f5f9; color: #475569; }
.badge--purple  { background: #ede9fe; color: #6d28d9; }
.badge--orange  { background: #ffedd5; color: #9a3412; }
</style>

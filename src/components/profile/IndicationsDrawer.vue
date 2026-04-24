<script setup>
import BaseDrawer from '@/components/ui/BaseDrawer.vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  indications: { type: Array, required: true }
})
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseDrawer :model-value="modelValue" title="אינדיקציות" @update:model-value="emit('update:modelValue', $event)">
    <!-- Column headers -->
    <div class="ind-col-headers">
      <span class="ind-col ind-col--name">שם אינדיקציה</span>
      <span class="ind-col ind-col--date">תאריך</span>
      <span class="ind-col ind-col--status">סטטוס</span>
    </div>

    <!-- Rows -->
    <div class="ind-rows">
      <div v-for="ind in indications" :key="ind.id" class="ind-row">
        <div class="ind-row__cell ind-row__cell--name">
          <span>{{ ind.label }}</span>
          <svg v-if="ind.alert" class="ind-alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 1.5L1 18h18L10 1.5z" fill="#FF1D47" stroke="#FF1D47" stroke-width="0.5"/>
            <line x1="10" y1="7" x2="10" y2="12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="10" cy="14.5" r="0.75" fill="white"/>
          </svg>
        </div>
        <span class="ind-row__cell ind-row__cell--date">{{ ind.date }}</span>
        <div class="ind-row__cell ind-row__cell--status">
          <span
            v-if="ind.statusLabel"
            class="ind-status-badge"
            :class="{
              'ind-status-badge--active': ind.status === 'active',
              'ind-status-badge--pending': ind.status === 'pending',
              'ind-status-badge--approved': ind.status === 'approved',
            }"
          >{{ ind.statusLabel }}</span>
        </div>
      </div>
    </div>
  </BaseDrawer>
</template>

<style scoped>
.ind-col-headers {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 20px;
  background: #F7F8FD;
}

.ind-col {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  color: #2F305C;
}

.ind-col--name { flex: 1; text-align: right; }
.ind-col--date { flex: 1; text-align: center; }
.ind-col--status { flex: 1; text-align: center; }

.ind-rows {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
}

.ind-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ECEFF8;
}

.ind-row__cell--name {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  color: #171C23;
  text-align: right;
}

.ind-row__cell--date {
  flex: 1;
  text-align: center;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #171C23;
}

.ind-row__cell--status {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ind-status-badge {
  display: block;
  width: 80px;
  box-sizing: border-box;
  padding: 6px 4px;
  border-radius: 8px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ind-status-badge--pending {
  background: #FFF0C5;
  color: #FA9600;
}

.ind-status-badge--approved {
  background: rgba(46, 171, 80, 0.15);
  color: #2EAB50;
}

.ind-status-badge--active {
  background: rgba(93, 135, 255, 0.15);
  color: #5D87FF;
}

.ind-alert-icon {
  flex-shrink: 0;
}
</style>

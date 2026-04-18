<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/useAppStore'
import BasePagination from '@/components/ui/BasePagination.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  tasks:          { type: Array,  required: true },
  reports:        { type: Array,  required: true },
  invTotal:       { type: Number, required: true },
  tasksTotal:     { type: Number, required: true },
  reportsTotal:   { type: Number, required: true },
  reportsOverdue: { type: Number, default: 0 },
  reportsAlert:   { type: String, default: null }
})

const store = useAppStore()
const { activeTab, currentPage, pageSize } = storeToRefs(store)

const allItems = computed(() => activeTab.value === 'tasks' ? props.tasks : props.reports)
const total    = computed(() => activeTab.value === 'tasks' ? props.tasksTotal : props.reportsTotal)

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return allItems.value.slice(start, start + pageSize.value)
})

const completedCount = computed(() =>
  allItems.value.filter(i => i.statusType === 'success').length
)

// Figma status colors
const STATUS_STYLE = {
  danger:    { bg: 'rgba(255,29,71,0.15)',  color: '#FF1D47' },
  success:   { bg: 'rgba(46,171,80,0.15)',  color: '#2EAB50' },
  purple:    { bg: 'rgba(173,18,188,0.15)', color: '#AD12BC' },
  warning:   { bg: 'rgba(0,160,230,0.15)',  color: '#00A0E6' },
  cancelled: { bg: 'rgba(255,47,50,0.15)',  color: '#D50E0E' },
  neutral:   { bg: 'rgba(47,48,92,0.08)',   color: 'rgba(47,48,92,0.5)' },
}

const TASK_ICONS = {
  'סיירת': '', 'ועדה': '', 'מנהלי': '',
  'ראיון': '', 'בריאות': '', 'מבחן': '',
  'ביטחון': '', 'ניהול': '', 'ייעוץ': ''
}
</script>

<template>
  <div class="tabs-wrap">

    <!-- ── Tab header ── -->
    <div class="tabs-header">
      <div class="tabs-row">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'inv' }"
          @click="store.setActiveTab('inv')"
        >
          <span class="tab-label">זימונים ({{ tasksTotal }})</span>
          <div class="tab-bar" />
        </button>
        <!-- First in DOM = rightmost in RTL -->
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'tasks' }"
          @click="store.setActiveTab('tasks')"
        >
          <span class="tab-label">משימות ({{ tasksTotal }})</span>
          <div class="tab-bar" />
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'reports' }"
          @click="store.setActiveTab('reports')"
        >
          <span class="tab-label">דיווחים ({{ reportsTotal }})</span>
          <div class="tab-bar" />
        </button>
      </div>
    </div>

    <!-- ── Meta row ── -->
    <div class="meta-row">
      <!-- Right (first in DOM = right in RTL): progress text -->
      <div class="meta-progress">
        {{ completedCount }}/{{ total }} {{ activeTab === 'tasks' ? 'משימות' : 'דיווחים' }} הושלמו
      </div>
      <!-- Left (last in DOM = left in RTL): filter buttons -->
      <div class="meta-filters">
        <button class="filter-btn" title="מיון"><AppIcon name="sort" :size="16" /></button>
        <button class="filter-btn" title="סינון"><AppIcon name="filter" :size="16" /></button>
      </div>
    </div>

    <!-- ── Column headers ── -->
    <div class="col-header">
      <!-- DOM order = visual right→left in RTL -->
      <div class="col-h col-h-name">שם {{ activeTab === 'tasks' ? 'משימה' : 'דיווח' }}</div>
      <div class="col-h col-h-date">תאריך יעד</div>
      <div class="col-h col-h-days">זמן ליעד</div>
      <div class="col-h col-h-status">סטטוס</div>
    </div>

    <!-- ── Data rows ── -->
    <div class="rows-wrap">
      <div v-if="pagedItems.length === 0" class="empty-row">אין פריטים להצגה</div>
      <div v-for="item in pagedItems" :key="item.id" class="data-row">
        <div class="row-inner">
          <!-- name+icon: first = rightmost -->
          <div class="cell-name">
            <span class="task-icon">{{ TASK_ICONS[item.type] || '' }}</span>
            <span class="task-title">{{ item.title }}</span>
          </div>
          <div class="cell-date">{{ item.date }}</div>
          <div class="cell-days">
            <span v-if="item.daysLeft">{{ item.daysLeft }} ימים</span>
          </div>
          <div class="cell-status">
            <span
              class="status-badge"
              :style="{
                background: STATUS_STYLE[item.statusType]?.bg,
                color: STATUS_STYLE[item.statusType]?.color
              }"
            >{{ item.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Desktop table (hidden on mobile) ── -->
    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th></th>
            <th>שם {{ activeTab === 'tasks' ? 'משימה' : 'דיווח' }}</th>
            <th>תאריך יעד</th>
            <th>זמן ליעד</th>
            <th>סוג</th>
            <th>סטטוס</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pagedItems.length === 0">
            <td colspan="6" class="empty-row">אין פריטים להצגה</td>
          </tr>
          <tr v-for="item in pagedItems" :key="`d-${item.id}`">
            <td class="col-dots">
              <AppIcon name="dots" :size="16" style="color: var(--text-muted); cursor:pointer" />
            </td>
            <td>
              <span class="task-icon">{{ TASK_ICONS[item.type] || '📌' }}</span>
              {{ item.title }}
            </td>
            <td class="td-date">{{ item.date }}</td>
            <td class="td-days">
              <span v-if="item.daysLeft" class="days-chip">{{ item.daysLeft }} ימים</span>
              <span v-else class="muted">—</span>
            </td>
            <td class="td-type">{{ item.type }}</td>
            <td>
              <span
                class="status-badge"
                :style="{
                  background: STATUS_STYLE[item.statusType]?.bg,
                  color: STATUS_STYLE[item.statusType]?.color
                }"
              >{{ item.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BasePagination
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      @change="store.setPage"
    />
  </div>
</template>

<style scoped>
/* ── Wrapper ── */
.tabs-wrap {
  background: #FFFFFF;
  width: 100%;
}

/* ── Tab header ── */
.tabs-header {
  padding: 20px 0 0;
  border-bottom: 1px solid rgba(214, 222, 230, 0.24);
}
.tabs-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start; /* RTL: flex-start = right side */
  padding: 0 20px;
}
.tab-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
}
.tab-label {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: rgba(47, 48, 92, 0.4);
  line-height: 22px;
  white-space: nowrap;
}
.tab-btn.active .tab-label {
  font-weight: 600;
  color: #5D87FF;
}
.tab-bar {
  width: 50px;
  height: 3px;
  background: transparent;
  border-radius: 8px;
}
.tab-btn.active .tab-bar {
  background: #5D87FF;
}

/* ── Meta row ── */
.meta-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 26px;
}
.meta-progress {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2F305C70;
  text-align: right;
}
.meta-filters {
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
}
.filter-btn {
  width: 32px;
  height: 32px;
  border: 1.5px solid #5D87FF;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  cursor: pointer;
  color: #5D87FF;
}

/* ── Column headers ── */
.col-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px;
  background: #F7F8FD;
}
.col-h {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2F305C;
  text-align: right;
  white-space: nowrap;
}
.col-h-name   { flex: 1; min-width: 0; }
.col-h-date   { flex: 1; width: 72px;  text-align: center; flex-shrink: 0; }
.col-h-days   { flex: 1; width: 44px;  text-align: center; flex-shrink: 0; }
.col-h-status { flex: 1; width: 82px;  text-align: center; flex-shrink: 0; }

/* ── Data rows ── */
.rows-wrap {
  display: flex;
  flex-direction: column;
}
.data-row {
  background: #FFFFFF;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.04);
  padding: 16px 16px;
}
.row-inner {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.cell-name {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  overflow: hidden;
}
.task-icon  { font-size: 15px; flex-shrink: 0; }
.task-title {
  flex: 1;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2F305C;
  text-align: right;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.cell-date {
  flex: 1;
  width: 72px;
  flex-shrink: 0;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #2F305C;
  text-align: center;
}
.cell-days {
  flex: 1;
  width: 44px;
  flex-shrink: 0;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #2F305C;
  text-align: center;
}
.cell-status {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 82px;
  flex-shrink: 0;
}
/* Fixed width badge — same size regardless of text */
.status-badge {
  display: block;
  letter-spacing: -0.02rem;
  width: 80px;
  box-sizing: border-box;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-size: 14px;
  font-weight: 400;
  border-radius: 8px;
  padding: 6px 4px ;
  text-align: center;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.empty-row {
  text-align: center;
  padding: 24px;
  font-size: 14px;
  color: rgba(47, 48, 92, 0.4);
}

/* Desktop table: hidden on mobile */
.table-scroll { display: none; }

/* ── Desktop ── */
@media (min-width: 768px) {
  .tabs-wrap {
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  /* Tab header */
  .tabs-header { padding: 0; border-bottom: 1px solid var(--border); }
  .tabs-row    { gap: 4px; padding: 0 16px; }
  .tab-btn {
    flex-direction: row;
    align-items: center;
    gap: 6px;
    padding: 12px 14px;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }
  .tab-label { font-size: 14px; font-weight: 500; color: var(--text-muted); }
  .tab-btn.active .tab-label { color: var(--blue-mid); font-weight: 500; }
  .tab-btn.active { border-bottom-color: var(--blue-mid); }
  .tab-bar { display: none; }

  /* Meta row */
  .meta-row { padding: 10px 16px; }
  .meta-progress { font-size: 12px; font-weight: 500; }
  .filter-btn { width: 28px; height: 28px; border-color: var(--border); color: var(--text-secondary); }

  /* Hide mobile card layout */
  .col-header { display: none; }
  .rows-wrap  { display: none; }

  /* Show desktop table */
  .table-scroll { display: block; overflow-x: auto; }
  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .data-table th {
    padding: 8px 14px;
    text-align: right;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: .04em;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }
  .data-table td {
    padding: 11px 14px;
    border-bottom: 1px solid var(--border-soft);
    vertical-align: middle;
    text-align: right;
  }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: #f8fafc; }
  .col-dots { width: 32px; text-align: center; }
  .td-date  { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
  .td-days  { white-space: nowrap; }
  .td-type  { font-size: 12px; color: var(--text-secondary); }
  .days-chip {
    background: #ffedd5; color: #9a3412;
    border-radius: 10px; font-size: 11px; font-weight: 600; padding: 1px 8px;
  }
  .muted { color: var(--text-muted); }
}
</style>

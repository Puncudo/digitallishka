<script setup>
import { computed } from 'vue'

const props = defineProps({
  indications: { type: Array, required: true }
})

// Show first 3, rest hidden behind "+X" chip
const VISIBLE_COUNT = 3
const visibleChips  = computed(() => props.indications.slice(0, VISIBLE_COUNT))
const hiddenCount   = computed(() => Math.max(0, props.indications.length - VISIBLE_COUNT))
</script>

<template>
  <div class="ind-section">

    <!-- Title -->
    <div class="ind-title">אינדיקציות</div>

    <!-- Info row: text first (→ RIGHT in RTL), icon second (→ LEFT of text) -->
    <div class="ind-info">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="info-icon" flex-shrink="0">
        <circle cx="12" cy="12" r="10.5" stroke="rgba(47,48,92,0.7)" stroke-width="1.5"/>
        <path d="M12 7.5v.5" stroke="rgba(47,48,92,0.7)" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 11v6" stroke="rgba(47,48,92,0.7)" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span class="ind-info__text">קיימות אינדיקציות נוספות שאינן מוצגות בתצוגה זו</span>
    </div>

    <!-- Chips: visible first (→ appear on RIGHT in RTL), "+X" last (→ appears on FAR LEFT) -->
    <div class="ind-chips">
      <div
        v-for="ind in visibleChips"
        :key="ind.id"
        class="chip chip--regular"
      >{{ ind.label }}</div>

      <div v-if="hiddenCount > 0" class="chip chip--more">+{{ hiddenCount }}</div>
    </div>

    <!-- Desktop: table view -->
    <table class="ind-table">
      <thead>
        <tr>
          <th>אינדיקציה</th>
          <th>תאריך</th>
          <th>סטטוס</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ind in indications" :key="ind.id">
          <td>{{ ind.label }}</td>
          <td class="td-date">{{ ind.date }}</td>
          <td>
            <span v-if="ind.status === 'warning'" class="badge-warn">⚠</span>
            <span v-else class="badge-status" :class="`badge-status--${ind.status}`">
              {{ ind.statusLabel }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* ── Section container ── */
/* RTL note: flex-direction column + align-items flex-start = RIGHT in RTL */
.ind-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;   /* flex-start = RIGHT in RTL */
  overflow-y: auto;
  gap: 10px;
  width: 100%;
}

/* ── Title ── */
.ind-title {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  text-align: right;
  color: #2F305C;
  width: 100%;
}

/* ── Info row ── */
/* RTL: justify-content flex-start = packs to the RIGHT */
.ind-info {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;  /* flex-start = RIGHT in RTL */
  align-items: center;
  gap: 5px;
  width: 100%;
}
.info-icon { flex-shrink: 0; }
.ind-info__text {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  text-align: right;
  color: #2F305C;
  opacity: 0.7;
;
}

/* ── Chips row ── */
/* RTL: flex-start = items start from RIGHT; "+X" last in DOM = far LEFT */
.ind-chips {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;  /* flex-start = RIGHT in RTL */
  align-items: center;
  gap: 5px;
  width: 100%;
}

/* Base chip */
.chip {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 8px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 0px;
  color: #5D87FF;
  white-space: nowrap;
  cursor: pointer;
}

/* "+2" chip — Figma: Frame 1984078883: white bg, blue border */
.chip--more {
  background: #FFFFFF;
  border: 1px solid #5D87FF;
  border-radius: 38px;
  min-width: 51px;
  height: 30px;
  padding: 5px 5px;
  direction: ltr;
}

/* Regular chips — Figma: Frame 1984078885 / 882 / 884: blue fill, no border */
.chip--regular {
  background: rgba(93, 135, 255, 0.26);
  border-radius: 52px;
  padding: 5px 15px;
  height: 30px;
  font-size: 12px;
}

/* Desktop table — hidden on mobile */
.ind-table { display: none; }
</style>

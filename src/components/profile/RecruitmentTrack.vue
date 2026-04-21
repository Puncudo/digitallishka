<script setup>
import { ref } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  track: { type: Array, required: true }
})

const currentIndex = ref(0)
const scrollEl = ref(null)

const CARD_W = 220
const GAP    = 10

function onScroll() {
  const pos = Math.abs(scrollEl.value.scrollLeft)
  currentIndex.value = Math.round(pos / (CARD_W + GAP))
}

function scrollTo(i) {
  currentIndex.value = i
  scrollEl.value?.scrollTo({
    left: -(i * (CARD_W + GAP)), // RTL: negative direction
    behavior: 'smooth'
  })
}

function prev() { scrollTo(Math.max(0, currentIndex.value - 1)) }
function next() { scrollTo(Math.min(props.track.length - 1, currentIndex.value + 1)) }
</script>

<template>
  <div class="track-wrap">
    <div class="track-header">מסלול גיוס</div>

    <div class="track-body">
      <!-- arrow: desktop only -->
      <button class="carousel-arrow" :disabled="currentIndex === 0" @click="prev" aria-label="הקודם">
        <AppIcon name="chevronR" :size="18" />
      </button>

      <!-- scrollable cards row -->
      <div class="cards-scroll" ref="scrollEl" @scroll.passive="onScroll">
        <div
          v-for="(step, i) in track"
          :key="step.id"
          class="step-card"
          :class="`step-card--${step.status}`"
          @click="scrollTo(i)"
        >
          <!-- RIGHT (first in DOM = rightmost in RTL): track icon -->
          <div class="card-icon">
            <AppIcon :name="step.icon" :size="22" />
          </div>

          <!-- MIDDLE: title + date -->
          <div class="card-text">
            <div class="card-title">{{ step.title }}</div>
            <div class="card-date">{{ step.date }}</div>
          </div>

          <!-- LEFT (last in DOM = leftmost in RTL): status indicator -->
          <div class="card-status">
            <template v-if="step.status === 'completed'">
              <div class="status-check">
                <AppIcon name="check" :size="11" />
              </div>
            </template>
            <template v-else-if="step.status === 'alert'">
              <AppIcon name="warning" :size="18" class="status-warning-icon" />
              <span v-if="step.alertText" class="status-alert-label">{{ step.alertText }}</span>
            </template>
          </div>
        </div>
      </div>

      <!-- arrow: desktop only -->
      <button class="carousel-arrow" :disabled="currentIndex === track.length - 1" @click="next" aria-label="הבא">
        <AppIcon name="chevronL" :size="18" />
      </button>
    </div>

    <!-- progress dots: mobile only -->
    <div class="track-dots">
      <span
        v-for="(_, i) in track"
        :key="i"
        class="tdot"
        :class="{ active: i === currentIndex }"
        @click="scrollTo(i)"
      />
    </div>
  </div>
</template>

<style scoped>
.track-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.track-header {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  text-align: right;
  color: #2F305C;
}

/* ── carousel row ── */
.track-body {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* arrows: hidden on mobile, shown on desktop */
.carousel-arrow {
  display: none;
  flex-shrink: 0;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #fff;
  border: 1.5px solid rgba(93,135,255,0.25);
  box-shadow: 0 2px 8px rgba(0,54,214,0.10);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #5D87FF;
  transition: opacity .15s;
}
.carousel-arrow:disabled { opacity: .25; cursor: default; }

/* scrollable row */
.cards-scroll {
  flex: 1;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline-start: 10px;
  scrollbar-width: none;
  padding: 6px 10px;
}
.cards-scroll::-webkit-scrollbar { display: none; }

/* ── CARD ── */
.step-card {
  flex-shrink: 0;
  width: 220px;
  height: 88px;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  border-radius: 10px;
  border: 1px solid rgba(93, 135, 255, 0.1);
  box-shadow:
    0px 4px 8px rgba(0, 38, 128, 0.03),
    0px 1px 3px rgba(0, 38, 128, 0.06);

  /* default: neutral */
  background: linear-gradient(270deg, #EEF2FF 0%, #FFFFFF 100%);

  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 12px 12px 10px;
  gap: 8px;
  cursor: pointer;
  transition: box-shadow .15s;
}
.step-card:hover {
  box-shadow: 0px 6px 16px rgba(0, 38, 128, 0.08);
}

/* status backgrounds */
.step-card--completed { background: linear-gradient(270deg, #E2F5E8 0%, #FFFFFF 100%); border-color: rgba(46,171,80,0.15); }
.step-card--alert     { background: linear-gradient(270deg, #F8E2E2 0%, #FFFFFF 100%); border-color: rgba(255,29,71,0.12); }
.step-card--upcoming  { background: linear-gradient(270deg, #EEF2FF 0%, #FFFFFF 100%); border-color: rgba(93,135,255,0.1); }
.step-card--pending   { background: #FFFFFF; border-color: rgba(47,48,92,0.08); }

/* ── RIGHT: track icon in circle ── */
.card-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(93, 135, 255, 0.12);
  color: #5D87FF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.step-card--completed .card-icon { background: rgba(46,171,80,0.12); color: #2EAB50; }
.step-card--alert     .card-icon { background: rgba(255,29,71,0.10); color: #FF1D47; }

/* ── MIDDLE: text ── */
.card-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.card-title {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 17px;
  line-height: 1.2;
  color: #2F305C;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-date {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 13px;
  color: rgba(47, 48, 92, 0.6);
  text-align: right;
}

/* ── LEFT: status indicator ── */
.card-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-width: 32px;
  flex-shrink: 0;
}
.status-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #2EAB50;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.status-warning-icon {
  color: #FF8C00;
}
.status-alert-label {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #FF1D47;
  text-align: center;
  white-space: nowrap;
}

/* ── progress dots (mobile) ── */
.track-dots {
  display: flex;
  justify-content: center;
  gap: 5px;
  padding-top: 4px;
}
.tdot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--border);
  cursor: pointer;
  transition: background .2s, width .2s;
}
.tdot.active { background: #5D87FF; width: 16px; border-radius: 3px; }
</style>

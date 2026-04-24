<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import mockData          from '@/data/mock.json'
import ProfileHero       from '@/components/profile/ProfileHero.vue'
import PersonalDetailsPanel from '@/components/profile/PersonalDetailsPanel.vue'
import RecruitmentTrack  from '@/components/profile/RecruitmentTrack.vue'
import IndicationsSection from '@/components/profile/IndicationsSection.vue'
import ContentTabs       from '@/components/profile/ContentTabs.vue'
import CommentSection    from '@/components/profile/CommentSection.vue'
import IndicationsDrawer from '@/components/profile/IndicationsDrawer.vue'

const route = useRoute()
const candidate = mockData.candidates.find(c => c.id === route.params.id) || mockData.candidates[0]

const showIndicationsDrawer = ref(false)

/* ── Tzav 12 bar ── */
const tzav12 = computed(() => candidate.indications.find(i => i.tzav12))
const otherIndicationsCount = computed(() => {
  const total = candidate.indications.length
  return tzav12.value ? total - 1 : 0
})

/* ── Drawer state ── */
const detailsOpen = ref(false)
const drawerShow = ref(false)
const drawerHeight = ref(0)
const dragging = ref(false)
const closing = ref(false)

const heroRef = ref(null)

const HERO_HEIGHT = 92   // fixed hero-mobile height (px)
const HEADER_HEIGHT = 104 // mobile header height (px)
const TZAV12_HEIGHT = 40
const minDrawerH = computed(() => HEADER_HEIGHT + HERO_HEIGHT + (tzav12.value ? TZAV12_HEIGHT : 0))
const scrollPadTop = computed(() => `calc(${HEADER_HEIGHT}px + env(safe-area-inset-top) + ${HERO_HEIGHT + (tzav12.value ? TZAV12_HEIGHT : 0)}px + 12px)`)
const SNAP_DEFAULT = 0.85
const SNAP_FULL = 0.85
const CLOSE_THRESHOLD = 0.30

let startY = 0, startH = 0, lastY = 0, velocity = 0, lastTime = 0, didDrag = false

function getAvailableHeight() {
  return window.innerHeight
}

const drawerStyle = computed(() => {
  const t = dragging.value ? 'none' : 'height 0.3s ease'
  if (drawerHeight.value <= 0) return { height: '0px', transition: t }
  return {
    height: Math.min(drawerHeight.value, getAvailableHeight()) + 'px',
    transition: t,
  }
})

function snapTo(frac) {
  drawerHeight.value = Math.round(getAvailableHeight() * frac)
}

function openDrawer() {
  detailsOpen.value = true
  document.body.style.overflow = 'hidden'
  document.body.style.touchAction = 'none'
  window.scrollTo({ top: 0, behavior: 'instant' })
  drawerShow.value = true
  nextTick(() => {
    drawerHeight.value = 0
    requestAnimationFrame(() => snapTo(SNAP_DEFAULT))
  })
}

function closeDrawer() {
  closing.value = true
  dragging.value = false
  drawerHeight.value = 0
  setTimeout(() => {
    drawerShow.value = false
    closing.value = false
    detailsOpen.value = false
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
  }, 300)
}

function toggleDetails() {
  if (didDrag) return
  if (detailsOpen.value) closeDrawer()
  else openDrawer()
}

// Drag = positive means pulling DOWN (expanding)
function onTouchStart(e) {
  if (closing.value) return
  const t = e.touches[0]
  startY = t.clientY; startH = drawerHeight.value
  lastY = startY; velocity = 0; lastTime = Date.now()
  didDrag = false
  dragging.value = true
}

function onTouchMove(e) {
  if (!dragging.value || closing.value) return
  const t = e.touches[0]
  if (Math.abs(t.clientY - startY) > 5) {
    didDrag = true
    ensureDrawerOpen()
  }
  const dy = t.clientY - startY  // positive = pulling down = expanding
  const now = Date.now(); const dt = now - lastTime
  if (dt > 0) velocity = (t.clientY - lastY) / dt  // positive = downward
  lastY = t.clientY; lastTime = now
  const maxH = Math.round(getAvailableHeight() * SNAP_FULL)
  drawerHeight.value = Math.max(0, Math.min(startH + dy, maxH))
}

function onTouchEnd() {
  if (!dragging.value || closing.value) return
  dragging.value = false
  if (!didDrag) return  // no movement — let click handler decide
  const avail = getAvailableHeight()
  const frac = drawerHeight.value / avail
  // Fast swipe up = close, fast swipe down = snap full
  if (velocity < -0.5) { closeDrawer(); return }
  if (velocity > 0.5) { snapTo(SNAP_FULL); return }
  if (frac < CLOSE_THRESHOLD) closeDrawer()
  else if (frac > (SNAP_DEFAULT + SNAP_FULL) / 2) snapTo(SNAP_FULL)
  else snapTo(SNAP_DEFAULT)
}

function onMouseDown(e) {
  if (closing.value) return
  startY = e.clientY; startH = drawerHeight.value
  lastY = startY; velocity = 0; lastTime = Date.now()
  didDrag = false
  dragging.value = true
  const onMM = (ev) => {
    if (Math.abs(ev.clientY - startY) > 5) {
      didDrag = true
    }
    const dy = ev.clientY - startY
    const now = Date.now(); const dt = now - lastTime
    if (dt > 0) velocity = (ev.clientY - lastY) / dt
    lastY = ev.clientY; lastTime = now
    const maxH = Math.round(getAvailableHeight() * SNAP_FULL)
    drawerHeight.value = Math.max(0, Math.min(startH + dy, maxH))
  }
  const onMU = () => {
    document.removeEventListener('mousemove', onMM)
    document.removeEventListener('mouseup', onMU)
    onTouchEnd()
  }
  document.addEventListener('mousemove', onMM)
  document.addEventListener('mouseup', onMU)
}
// Hero arrow drag — opens drawer by dragging down
function onHeroTouchStart(e) {
  if (closing.value) return
  const t = e.touches[0]
  startY = t.clientY
  lastY = startY; velocity = 0; lastTime = Date.now()
  didDrag = false
  startH = drawerShow.value ? drawerHeight.value : minDrawerH.value
  dragging.value = true
}

function ensureDrawerOpen() {
  if (!drawerShow.value) {
    detailsOpen.value = true
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    window.scrollTo({ top: 0, behavior: 'instant' })
    drawerShow.value = true
    drawerHeight.value = minDrawerH.value
  }
}

function onHeroMouseDown(e) {
  if (closing.value) return
  startY = e.clientY
  lastY = startY; velocity = 0; lastTime = Date.now()
  didDrag = false
  startH = drawerShow.value ? drawerHeight.value : minDrawerH.value
  dragging.value = true
  const onMM = (ev) => {
    if (Math.abs(ev.clientY - startY) > 5) {
      didDrag = true
      ensureDrawerOpen()
    }
    const dy = ev.clientY - startY
    const now = Date.now(); const dt = now - lastTime
    if (dt > 0) velocity = (ev.clientY - lastY) / dt
    lastY = ev.clientY; lastTime = now
    const maxH = Math.round(getAvailableHeight() * SNAP_FULL)
    drawerHeight.value = Math.max(0, Math.min(startH + dy, maxH))
  }
  const onMU = () => {
    document.removeEventListener('mousemove', onMM)
    document.removeEventListener('mouseup', onMU)
    onTouchEnd()
  }
  document.addEventListener('mousemove', onMM)
  document.addEventListener('mouseup', onMU)
}
function onDrawerHandleClick() {
  if (didDrag) return
  closeDrawer()
}

onMounted(() => {
  nextTick(() => {
    const el = document.querySelector('.page-content')
    if (el) el.scrollTop = 0
  })
})
</script>

<template>
  <div class="profile-page">
    <!-- Blur overlay -->
    <transition name="pd-fade">
      <div v-if="drawerShow" class="pd-overlay" @click="closeDrawer" />
    </transition>

    <!-- Hero stays on top -->
    <div ref="heroRef" class="profile-hero-wrap">
      <!-- Tzav 12 red bar -->
      <div v-if="tzav12" class="tzav12-bar">
        <div class="tzav12-right">
          <span class="tzav12-label">צו 12</span>
          <span class="tzav12-date">מתאריך {{ tzav12.date }}</span>
        </div>
        <div class="tzav12-left">
          <div v-if="otherIndicationsCount > 0" class="tzav12-chip" @click="showIndicationsDrawer = true">+{{ otherIndicationsCount }}</div>
          <svg width="5" height="10" viewBox="0 0 5 10" fill="none">
            <path d="M4 1L1 5L4 9" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <ProfileHero :candidate="candidate" />
    </div>

    <!-- Drawer drops down from behind hero -->
    <div v-if="drawerShow" class="pd-drawer-wrap" :style="drawerStyle">
      <div class="pd-drawer">
        <div class="pd-scroll" :style="{ paddingTop: scrollPadTop }">
          <PersonalDetailsPanel
            :details="candidate.personalDetails"
            :candidate-phone="candidate.phone"
            :candidate-email="candidate.email"
          />
        </div>
      </div>
      <!-- Drag handle + arrow at bottom -->
      <div
        class="pd-drag-zone"
        @click="onDrawerHandleClick"
        @touchstart.passive="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
        @mousedown="onMouseDown"
      >
        <svg class="pd-arrow-bg" width="126" height="23" viewBox="0 0 140 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30.0229 17.0956L4.19551 1.18842C2.93407 0.411499 1.48167 0.000116348 0.000177383 0.000116348H70.3931H139.683C138.102 0.000116348 136.557 0.468687 135.241 1.34665L113.095 16.1321C106.325 20.6523 98.6277 23.6254 90.5288 24.4496C84.0316 25.1108 76.1314 25.7395 69.896 25.6956C64.1145 25.6548 56.7828 25.0147 50.7812 24.3686C43.3975 23.5736 36.3462 20.9901 30.0229 17.0956Z" fill="url(#pdHandleGrad)"/>
          <defs>
            <linearGradient id="pdHandleGrad" x1="140" y1="13" x2="0" y2="13" gradientUnits="userSpaceOnUse">
              <stop stop-color="#E2E8F8"/>
              <stop offset="1" stop-color="#FFFFFF"/>
            </linearGradient>
          </defs>
        </svg>
        <svg class="pd-arrow-chevron" width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0.292893 0.29289C-0.097631 0.68342 -0.0976311 1.31658 0.292893 1.70711L5.93934 7.3536C6.52513 7.9393 7.47487 7.9393 8.06066 7.3536L13.7071 1.70711C14.0976 1.31658 14.0976 0.68342 13.7071 0.29289C13.3166 -0.09763 12.6834 -0.09763 12.2929 0.29289L7 5.58579L1.70711 0.29289C1.31658 -0.09763 0.683418 -0.09763 0.292893 0.29289Z" fill="#333"/>
        </svg>
      </div>
    </div>

    <div class="profile-body">
      <!-- Arrow handle -->
      <div
        class="hero-arrow"
        :class="{ 'hero-arrow--open': detailsOpen }"
        @click="toggleDetails"
        @touchstart.passive="onHeroTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
        @mousedown="onHeroMouseDown"
      >
        <svg class="hero-arrow__bg" width="126" height="23" viewBox="0 0 140 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30.0229 17.0956L4.19551 1.18842C2.93407 0.411499 1.48167 0.000116348 0.000177383 0.000116348H70.3931H139.683C138.102 0.000116348 136.557 0.468687 135.241 1.34665L113.095 16.1321C106.325 20.6523 98.6277 23.6254 90.5288 24.4496C84.0316 25.1108 76.1314 25.7395 69.896 25.6956C64.1145 25.6548 56.7828 25.0147 50.7812 24.3686C43.3975 23.5736 36.3462 20.9901 30.0229 17.0956Z" fill="url(#paint0_linear_1110_4381)"/>
          <defs>
            <linearGradient id="paint0_linear_1110_4381" x1="109.496" y1="15.823" x2="2.98343" y2="0.0044203" gradientUnits="userSpaceOnUse">
              <stop stop-color="#4685F6"/>
              <stop offset="1" stop-color="#339DF9"/>
            </linearGradient>
          </defs>
        </svg>
        <svg class="hero-arrow__chevron" width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0.292893 0.29289C-0.097631 0.68342 -0.0976311 1.31658 0.292893 1.70711L5.93934 7.3536C6.52513 7.9393 7.47487 7.9393 8.06066 7.3536L13.7071 1.70711C14.0976 1.31658 14.0976 0.68342 13.7071 0.29289C13.3166 -0.09763 12.6834 -0.09763 12.2929 0.29289L7 5.58579L1.70711 0.29289C1.31658 -0.09763 0.683418 -0.09763 0.292893 0.29289Z" fill="white"/>
        </svg>
      </div>

      <!-- Track + Indications: stacked on mobile, side-by-side on desktop -->
      <div class="section-grid">
        <RecruitmentTrack :track="candidate.recruitmentTrack" />
        <IndicationsSection :indications="candidate.indications" :hasPendingIndications="candidate.hasPendingIndications" :hasSecretIndications="candidate.hasSecretIndications" @show-all="showIndicationsDrawer = true" />
      </div>

      <ContentTabs
        :tasks="candidate.tasks"
        :reports="candidate.reports"
        :tasks-total="candidate.tasksTotal"
        :reports-total="candidate.reportsTotal"
        :reports-overdue="candidate.reportsOverdue"
        :reports-alert="candidate.reportsAlert"
      />

      <CommentSection :comment="candidate.comment" :candidate-name="candidate.name" />
    </div>

    <!-- Indications drawer -->
    <IndicationsDrawer v-model="showIndicationsDrawer" :indications="candidate.indications" />
  </div>
</template>

<style scoped>
.profile-hero-wrap {
  position: relative;
  z-index: 20;
}

/* Tzav 12 red bar */
.tzav12-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 6px 30px;
  height: 40px;
  background: #FB5859;
  position: relative;
  z-index: 101;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.tzav12-label {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #FFFFFF;
}

.tzav12-date {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #FFFFFF;
}

.tzav12-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.tzav12-chip {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 17px;
  height: 29px;
  border: 1px solid #FFFFFF;
  border-radius: 38px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  color: #FFFFFF;
  cursor: pointer;
  direction: ltr;
}

/* Blur overlay */
.pd-overlay {
  position: fixed;
  inset: 0;
  z-index: 5;
  background: rgba(47, 48, 92, 0.35);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  touch-action: none;
}

/* Drawer wrapper — fixed, allows handle to overflow */
.pd-drawer-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
  overflow: visible;
  will-change: height;
}

/* Drawer — clips content */
.pd-drawer {
  width: 100%;
  height: 100%;
  background: linear-gradient(270deg, #E2E8F8 0%, #FFFFFF 107.42%);
  border-radius: 0 0 20px 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 16px 6px rgba(145, 148, 161, 0.01),
              0px 9px 5px rgba(145, 148, 161, 0.05),
              0px 4px 4px rgba(145, 148, 161, 0.09),
              0px 1px 2px rgba(145, 148, 161, 0.1);
}

.pd-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  /* padding-top set dynamically via inline style */
  /* leave room for handle at bottom */
  padding-bottom: 28px;
}

.pd-drag-zone {
  position: relative;
  margin-top: -1px;
  cursor: grab;
  touch-action: none;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 23px;
  background: transparent;
}

.pd-drag-zone:active {
  cursor: grabbing;
}

.pd-arrow-bg {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.pd-arrow-chevron {
  position: relative;
  z-index: 1;
  margin-top: 4px;
  transform: rotate(180deg);
}

/* Fade transition for overlay */
.pd-fade-enter-active { transition: opacity 0.25s ease; }
.pd-fade-leave-active { transition: opacity 0.15s ease; }
.pd-fade-enter-from, .pd-fade-leave-to { opacity: 0; }

.profile-body {
  display: flex;
  flex-direction: column;
  padding: 0px 0 0px;   /* no side padding — components own their own gutters */
}

.section-grid {
  padding: 20px 20px;
}

.hero-arrow {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 28px;
  margin-top: -1px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.hero-arrow__bg {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.hero-arrow__chevron {
  position: relative;
  z-index: 1;
  margin-top: -8px;
}

.hero-arrow--open .hero-arrow__chevron {
  transform: rotate(180deg);
}
</style>

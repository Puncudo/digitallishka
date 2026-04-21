<template>
  <Teleport to="#app">
    <Transition name="bd" @after-enter="onAfterEnter" @before-leave="onBeforeLeave">
      <div v-if="modelValue" class="bd-overlay" @click.self="close">
        <div
          ref="sheetRef"
          class="bd-sheet"
          :style="sheetStyle"
          @touchstart.passive="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div class="bd-handle" />
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true }
})
const emit = defineEmits(['update:modelValue'])

const sheetRef = ref(null)

// Snap points as fraction of container height (the #app or viewport)
const SNAP_DEFAULT = 0.80
const SNAP_FULL = 0.95
const CLOSE_THRESHOLD = 0.3 // drag down 30% of sheet → close

const currentHeight = ref(0)  // in px
const containerH = ref(844)
const dragging = ref(false)
const transitioning = ref(false)

let startY = 0
let startH = 0
let lastY = 0
let velocity = 0
let lastTime = 0

function getContainerHeight() {
  const app = document.getElementById('app')
  return app ? app.clientHeight : window.innerHeight
}

const sheetStyle = computed(() => {
  if (currentHeight.value <= 0) return {}
  return {
    height: currentHeight.value + 'px',
    transition: dragging.value ? 'none' : 'height 0.3s ease',
  }
})

function snapTo(fraction) {
  containerH.value = getContainerHeight()
  currentHeight.value = Math.round(containerH.value * fraction)
}

function onAfterEnter() {
  snapTo(SNAP_DEFAULT)
}

function onBeforeLeave() {
  currentHeight.value = 0
}

function close() {
  emit('update:modelValue', false)
}

function onTouchStart(e) {
  const touch = e.touches[0]
  startY = touch.clientY
  startH = currentHeight.value
  lastY = startY
  velocity = 0
  lastTime = Date.now()
  dragging.value = true
}

function onTouchMove(e) {
  // Only drag from the handle area or when scrolled to top
  const sheet = sheetRef.value
  if (!sheet) return

  const scrollableChild = sheet.querySelector('.filter-body, .sd-body, .rep-body, .addr-body, .dates-body, [data-drawer-scroll]')
  const scrollTop = scrollableChild ? scrollableChild.scrollTop : 0

  const touch = e.touches[0]
  const deltaY = startY - touch.clientY  // positive = drag up, negative = drag down
  const now = Date.now()
  const dt = now - lastTime
  if (dt > 0) {
    velocity = (lastY - touch.clientY) / dt  // px/ms, positive = up
  }
  lastY = touch.clientY
  lastTime = now

  // If content is scrolled and user drags up, let native scroll handle it
  if (scrollTop > 0 && deltaY > 0) return

  // If content is at top and dragging down, prevent scroll and resize sheet
  if (scrollTop <= 0 && deltaY < 0) {
    e.preventDefault()
  }
  // If dragging from handle area (top 40px) always resize
  const sheetRect = sheet.getBoundingClientRect()
  const touchInHandle = touch.clientY < sheetRect.top + 40

  if (touchInHandle || scrollTop <= 0) {
    e.preventDefault()
    const maxH = Math.round(getContainerHeight() * SNAP_FULL)
    const newH = Math.max(100, Math.min(startH + deltaY, maxH))
    currentHeight.value = newH
  }
}

function onTouchEnd() {
  dragging.value = false
  const ch = getContainerHeight()
  const fraction = currentHeight.value / ch

  // Fast swipe down → close
  if (velocity < -0.5) {
    close()
    return
  }
  // Fast swipe up → full
  if (velocity > 0.5) {
    snapTo(SNAP_FULL)
    return
  }

  // Position-based snapping
  if (fraction < CLOSE_THRESHOLD) {
    close()
  } else if (fraction > (SNAP_DEFAULT + SNAP_FULL) / 2) {
    snapTo(SNAP_FULL)
  } else {
    snapTo(SNAP_DEFAULT)
  }
}

// Initial open
watch(() => props.modelValue, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    nextTick(() => {
      containerH.value = getContainerHeight()
      currentHeight.value = 0
      // Small delay so transition triggers from 0 → 80%
      requestAnimationFrame(() => snapTo(SNAP_DEFAULT))
    })
  } else {
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
    currentHeight.value = 0
  }
}, { immediate: true })
</script>

<style scoped>
.bd-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(47, 48, 92, 0.35);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  touch-action: none;
  overscroll-behavior: none;
}

.bd-sheet {
  position: relative;
  width: 100%;
  background: #FFFFFF;
  border-radius: 20px 20px 0 0;
  direction: rtl;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  will-change: height;
  touch-action: none;
}

.bd-handle {
  width: 60px;
  height: 5px;
  background: #FFFFFF;
  border-radius: 100px;
  margin: 0 auto;
  position: absolute;
  top: -14px;
  left: calc(50% - 30px);
}

/* Transition */
.bd-enter-active,
.bd-leave-active {
  transition: opacity 0.25s ease;
}

.bd-enter-from {
  opacity: 0;
  pointer-events: none;
}

.bd-leave-to {
  opacity: 0;
}
</style>

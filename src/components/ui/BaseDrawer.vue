<template>
  <Teleport to="#app">
    <Transition name="bd">
      <div v-if="show" class="bd-overlay" @click.self="close">
        <div
          ref="sheetRef"
          class="bd-sheet"
          :style="sheetStyle"
        >
          <div
            class="bd-drag-zone"
            @touchstart.passive="onTouchStart"
            @touchmove.prevent="onTouchMove"
            @touchend="onTouchEnd"
            @mousedown="onMouseDown"
          >
            <div class="bd-handle" />
          </div>
          <div v-if="title" class="bd-header">
            <span class="bd-title">{{ title }}</span>
            <button class="bd-close-btn" @click="close">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <line x1="6" y1="6" x2="16" y2="16" stroke="#5D87FF" stroke-width="2" stroke-linecap="round"/>
                <line x1="16" y1="6" x2="6" y2="16" stroke="#5D87FF" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const sheetRef = ref(null)
const show = ref(false)

const SNAP_DEFAULT = 0.80
const SNAP_FULL = 0.95
const CLOSE_THRESHOLD = 0.15

const currentHeight = ref(0)
const dragging = ref(false)
const closing = ref(false)

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
  const t = dragging.value ? 'none' : 'height 0.3s ease'
  if (currentHeight.value <= 0) return { height: '0px', transition: t }
  return {
    height: currentHeight.value + 'px',
    transition: t,
  }
})

function snapTo(fraction) {
  const ch = getContainerHeight()
  currentHeight.value = Math.round(ch * fraction)
}

function close() {
  closing.value = true
  dragging.value = false
  currentHeight.value = 0
  setTimeout(() => {
    show.value = false
    closing.value = false
    emit('update:modelValue', false)
  }, 200)
}

function onTouchStart(e) {
  if (closing.value) return
  const touch = e.touches[0]
  startY = touch.clientY
  startH = currentHeight.value
  lastY = startY
  velocity = 0
  lastTime = Date.now()
  dragging.value = true
}

function onTouchMove(e) {
  if (!dragging.value || closing.value) return
  const touch = e.touches[0]
  const deltaY = startY - touch.clientY
  const now = Date.now()
  const dt = now - lastTime
  if (dt > 0) {
    velocity = (lastY - touch.clientY) / dt
  }
  lastY = touch.clientY
  lastTime = now

  const maxH = Math.round(getContainerHeight() * SNAP_FULL)
  const newH = Math.max(50, Math.min(startH + deltaY, maxH))
  currentHeight.value = newH
}

function onTouchEnd() {
  if (!dragging.value || closing.value) return
  dragging.value = false
  const ch = getContainerHeight()
  const fraction = currentHeight.value / ch

  if (velocity < -0.5) { close(); return }
  if (velocity > 0.5) { snapTo(SNAP_FULL); return }

  if (fraction < CLOSE_THRESHOLD) {
    close()
  } else if (fraction > (SNAP_DEFAULT + SNAP_FULL) / 2) {
    snapTo(SNAP_FULL)
  } else {
    snapTo(SNAP_DEFAULT)
  }
}

// Mouse support for desktop testing
function onMouseDown(e) {
  if (closing.value) return
  startY = e.clientY
  startH = currentHeight.value
  lastY = startY
  velocity = 0
  lastTime = Date.now()
  dragging.value = true

  const onMouseMove = (ev) => {
    const deltaY = startY - ev.clientY
    const now = Date.now()
    const dt = now - lastTime
    if (dt > 0) velocity = (lastY - ev.clientY) / dt
    lastY = ev.clientY
    lastTime = now
    const maxH = Math.round(getContainerHeight() * SNAP_FULL)
    currentHeight.value = Math.max(50, Math.min(startH + deltaY, maxH))
  }

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    onTouchEnd()
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

watch(() => props.modelValue, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    show.value = true
    nextTick(() => {
      currentHeight.value = 0
      requestAnimationFrame(() => snapTo(SNAP_DEFAULT))
    })
  } else if (!closing.value) {
    close()
  }
}, { immediate: true })

watch(show, (val) => {
  if (!val) {
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
  }
})
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
}

.bd-drag-zone {
  min-height: 28px;
  cursor: grab;
  touch-action: none;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0 6px;
}

.bd-drag-zone:active {
  cursor: grabbing;
}

.bd-handle {
  width: 40px;
  height: 4px;
  background: #D5D6DE;
  border-radius: 100px;
}

.bd-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 22px;
  border-bottom: 1px solid #EAEDEF;
  box-shadow: 0px 14px 24px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.bd-title {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #5D87FF;
}

.bd-close-btn {
  width: 32px;
  height: 32px;
  background: #E9EFFF;
  border: 0.9px solid #F6F7FC;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Transition — overlay fades, sheet slides */
.bd-enter-active {
  transition: opacity 0.25s ease;
}
.bd-leave-active {
  transition: opacity 0.15s ease;
}

.bd-enter-from,
.bd-leave-to {
  opacity: 0;
}
</style>

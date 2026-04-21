<template>
  <Teleport to="#app">
    <Transition name="bd">
      <div v-if="modelValue" class="bd-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="bd-sheet">
          <div class="bd-handle" />
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true }
})
defineEmits(['update:modelValue'])

watch(() => props.modelValue, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
  } else {
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
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
  max-height: 90vh;
  overflow-y: auto;
  touch-action: pan-y;
  overscroll-behavior: contain;
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

.bd-enter-active .bd-sheet,
.bd-leave-active .bd-sheet {
  transition: transform 0.3s ease;
}

.bd-enter-from {
  opacity: 0;
  pointer-events: none;
}

.bd-enter-from .bd-sheet {
  transform: translateY(100%);
}

.bd-leave-to {
  opacity: 0;
}

.bd-leave-to .bd-sheet {
  transform: translateY(100%);
}
</style>

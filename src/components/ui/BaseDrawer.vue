<template>
  <Teleport to="body">
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
defineProps({
  modelValue: { type: Boolean, required: true }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.bd-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(47, 48, 92, 0.35);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
}

.bd-sheet {
  position: relative;
  width: 100%;
  background: #FFFFFF;
  border-radius: 20px 20px 0 0;
  direction: rtl;
  max-height: 90vh;
  overflow-y: auto;
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

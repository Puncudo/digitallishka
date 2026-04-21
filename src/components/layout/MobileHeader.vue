<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <header class="mobile-header">
    <div class="header-circle" />
    <div class="header-row">
      <span class="title">לשכות דיגיטליות</span>
      <button class="back-btn" aria-label="חזרה" @click="router.back()">
        <svg width="10" height="14" viewBox="0 0 8 16" fill="none">
          <path d="M2 2L8 8L2 14" stroke="#5D87FF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.mobile-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 104px;
  background: linear-gradient(275.24deg, #5C6BF3 -1.99%, #4389F7 38.29%, #1FB5FB 88.96%, #00D9FF 99.75%);
  box-shadow: 0px 4px 34px rgba(0, 4, 57, 0.25);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 0 20px 11px;
}

/* decorative circle (Ellipse 1995 from Figma) */
.header-circle {
  position: absolute;
  width: 350px;
  height: 350px;
  left: -158px;
  top: -195px;
  border-radius: 50%;
  border: 40px solid rgba(255, 255, 255, 0.07);
  pointer-events: none;
  transform: rotate(64.56deg);
}

.header-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.back-btn {
  width: 32px;
  height: 32px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.36);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transform: rotate(180deg);
}

.title {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.02em;
  color: #FFFFFF;
}
</style>

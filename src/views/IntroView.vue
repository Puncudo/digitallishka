<template>
  <div class="intro-page" :class="{ 'fonts-loaded': fontsReady }">
    <!-- Top gradient half -->
    <div class="top-half">
      <svg class="circles-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2152.17 2407.72" preserveAspectRatio="xMidYMin slice">
        <defs>
          <linearGradient id="lg-right" x1="194.68" y1="1196.66" x2="-934.92" y2="1196.66" gradientTransform="translate(1714.01 3088.95) rotate(157.01)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#a8c8ff"/>
            <stop offset=".1" stop-color="#fff" stop-opacity=".82"/>
            <stop offset=".33" stop-color="#fff" stop-opacity=".36"/>
            <stop offset=".5" stop-color="#fff" stop-opacity="0"/>
            <stop offset=".99" stop-color="#fff" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="lg-left" x1="1680.8" y1="676.9" x2="531.94" y2="676.9" gradientTransform="translate(-466.37 -199.43) rotate(5.17)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#a8c8ff"/>
            <stop offset=".12" stop-color="#fff" stop-opacity=".84"/>
            <stop offset=".46" stop-color="#fff" stop-opacity=".39"/>
            <stop offset=".7" stop-color="#fff" stop-opacity=".11"/>
            <stop offset=".81" stop-color="#fff" stop-opacity="0"/>
            <stop offset="1" stop-color="#fff" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <g>
          <circle class="rot1" cx="1587.25" cy="1842.8" r="464.8" style="fill:none;opacity:.57;stroke:url(#lg-right);stroke-miterlimit:10;stroke-width:200px;"/>
          <circle class="rot2" cx="574.46" cy="574.46" r="474.43" style="fill:none;opacity:.33;stroke:url(#lg-left);stroke-miterlimit:10;stroke-width:200px;"/>
        </g>
      </svg>
    </div>

    <!-- Figures stage -->
    <div class="figures-stage">
      <div class="figures-inner">
        <svg width="0" height="0" style="position:absolute">
          <defs>
            <clipPath id="clip-arms"><rect ref="crArms" x="90" y="55" width="0" height="55"/></clipPath>
            <clipPath id="clip-body"><rect ref="crBody" x="48" y="65" width="45" height="0"/></clipPath>
            <clipPath id="clip-head"><circle ref="crHead" cx="63.9" cy="51.5" r="0"/></clipPath>
          </defs>
        </svg>

        <div ref="figLeft" class="fig fig-left">
          <svg viewBox="0 0 104 207" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" overflow="visible">
            <path class="fig-shape-body" d="M9.3,59.1s19.9,16.1,44.8,17c20.9.8,35.6-5.9,35.6-5.9,0,0-11.1,34.8-39.4,34.3-34.4-.7-41-45.4-41-45.4h0Z"/>
            <path class="fig-shape-arms" d="M89.7,70.2s-36.5,10.2-39.1,34.3c-5,47.2,27.9,80.6,27.9,80.6,0,0-7.5-26.4-3.5-66.3,2-20.4,14.7-48.6,14.7-48.6h0Z"/>
            <circle class="fig-shape-white" cx="63.9" cy="51.5" r="14.6"/>
          </svg>
        </div>

        <div ref="figCenter" class="fig fig-center">
          <svg viewBox="0 0 104 207" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" overflow="visible">
            <path class="fig-shape-body" clip-path="url(#clip-arms)"
              d="M9.3,59.1s19.9,16.1,44.8,17c20.9.8,35.6-5.9,35.6-5.9,0,0-11.1,34.8-39.4,34.3-34.4-.7-41-45.4-41-45.4h0Z"/>
            <path class="fig-shape-arms" clip-path="url(#clip-body)"
              d="M89.7,70.2s-36.5,10.2-39.1,34.3c-5,47.2,27.9,80.6,27.9,80.6,0,0-7.5-26.4-3.5-66.3,2-20.4,14.7-48.6,14.7-48.6h0Z"/>
            <circle class="fig-shape-white" clip-path="url(#clip-head)" cx="63.9" cy="51.5" r="14.6"/>
          </svg>
        </div>

        <div ref="figRight" class="fig fig-right">
          <svg viewBox="0 0 104 207" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" overflow="visible">
            <path class="fig-shape-body" d="M9.3,59.1s19.9,16.1,44.8,17c20.9.8,35.6-5.9,35.6-5.9,0,0-11.1,34.8-39.4,34.3-34.4-.7-41-45.4-41-45.4h0Z"/>
            <path class="fig-shape-arms" d="M89.7,70.2s-36.5,10.2-39.1,34.3c-5,47.2,27.9,80.6,27.9,80.6,0,0-7.5-26.4-3.5-66.3,2-20.4,14.7-48.6,14.7-48.6h0Z"/>
            <circle class="fig-shape-white" cx="63.9" cy="51.5" r="14.6"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- White wave at top: 324px from top = 38.4% of 844 -->
    <svg class="wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 1000" preserveAspectRatio="none">
      <path fill="white" d="M390,20 C290,170 130,30 0,150 L0,1000 L390,1000 Z"/>
    </svg>

    <!-- Subtitle sits INSIDE the gradient area (high up) -->
    <div class="txt-subtitle">לשכה דיגיטלית</div>

    <!-- Logos top-right -->
    <div class="logos-row">
      <span class="logo-item logo-meitav" v-html="logoMeitav"></span>
      <span class="logo-item logo-sahar" v-html="logoSahar"></span>
    </div>

    <!-- Bottom content area (white zone) -->
    <div class="txt-header">ברוכים הבאים</div>
    <div class="txt-title">קהילות</div>

    <button class="btn-login" @click="goHome">התחברות</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import logoMeitav from '@/assets/logo-meitav.svg?raw'
import logoSahar from '@/assets/logo-sahar.svg?raw'

const router = useRouter()
const fontsReady = ref(false)
const figLeft = ref(null)
const figRight = ref(null)
const figCenter = ref(null)

let gen = 0
let replaying = false
let destroyed = false

function goHome() {
  localStorage.setItem('intro_seen', Date.now().toString())
  router.push('/home')
}

function getClipEl(id) {
  return document.getElementById(id)?.querySelector('rect, circle')
}

function sweepDown(el, maxH, dur, cb) {
  let t0 = null
  requestAnimationFrame(function step(ts) {
    if (destroyed) return
    if (!t0) t0 = ts
    const p = Math.min((ts - t0) / dur, 1)
    const h = maxH * (1 - Math.pow(1 - p, 2.5))
    el.setAttribute('height', h.toFixed(1))
    if (p < 1) { requestAnimationFrame(step) }
    else { el.setAttribute('height', maxH); if (cb) cb() }
  })
}

function sweepDot(el, maxR, dur, cb) {
  let t0 = null
  requestAnimationFrame(function step(ts) {
    if (destroyed) return
    if (!t0) t0 = ts
    const p = Math.min((ts - t0) / dur, 1)
    const r = maxR * (1 - Math.pow(1 - p, 3))
    el.setAttribute('r', r.toFixed(1))
    if (p < 1) { requestAnimationFrame(step) }
    else { el.setAttribute('r', maxR); if (cb) cb() }
  })
}

function shrinkOut(cb) {
  const fl = figLeft.value
  const fr = figRight.value
  const fc = figCenter.value
  if (!fl || !fr || !fc) return

  const base = 'position:absolute;bottom:0;left:50%;width:22.5%;max-width:90px;height:50%;z-index:2;transform-origin:bottom center;'
  const trans = 'transition:transform 0.7s cubic-bezier(0.4,0,0.6,1),opacity 0.5s ease;'

  fl.style.cssText = base + trans + 'opacity:0;transform:translate(-45px,0px) rotate(0deg) scale(0);'
  fr.style.cssText = base + trans + 'opacity:0;transform:translate(-45px,0px) rotate(0deg) scale(0);'

  fc.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.6,1), opacity 0.5s ease'
  fc.style.transformOrigin = 'bottom center'
  fc.style.transform = 'translateX(-50%) scale(0)'
  fc.style.opacity = '0'

  setTimeout(cb, 800)
}

function peekIn(cb) {
  const fl = figLeft.value
  const fr = figRight.value
  const fc = figCenter.value
  if (!fl || !fr || !fc) return

  const base = 'position:absolute;bottom:0;left:50%;width:22.5%;max-width:90px;height:50%;z-index:2;transform-origin:bottom center;'

  fc.style.transition = 'none'
  fc.style.transform = 'translateX(-50%)'
  fc.style.opacity = '1'

  fl.style.cssText = base + 'opacity:0;transform:translate(0px,10px) rotate(0deg) scale(0.3);transition:none;'
  fr.style.cssText = base + 'opacity:0;transform:translate(0px,10px) rotate(0deg) scale(0.3);transition:none;'

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const trans = 'transition:transform 0.65s cubic-bezier(0.34,1.3,0.64,1),opacity 0.4s ease;'
    fl.style.cssText = base + trans + 'opacity:1;transform:translate(-40px,-1px) rotate(-28deg) scale(0.9);'
    fr.style.cssText = base + trans + 'opacity:1;transform:translate(-30px,-22px) rotate(32deg) scale(0.8);'
    setTimeout(cb, 700)
  }))
}

function replay() {
  if (replaying || destroyed) return
  replaying = true
  const myGen = ++gen

  const fl = figLeft.value
  const fr = figRight.value
  const fc = figCenter.value
  if (!fl || !fr || !fc) return

  const crBody = getClipEl('clip-body')
  const crArms = getClipEl('clip-arms')
  const crHead = getClipEl('clip-head')
  if (!crBody || !crArms || !crHead) return

  const base = 'position:absolute;bottom:0;left:50%;width:22.5%;max-width:90px;height:50%;z-index:2;transform-origin:bottom center;'

  // Reset
  fc.style.transition = 'none'
  fc.style.opacity = '0'
  fc.style.transform = 'translateX(-50%)'
  crArms.setAttribute('width', 0)
  crBody.setAttribute('height', 0)
  crHead.setAttribute('r', 0)

  fl.style.cssText = base + 'opacity:0;transition:none;'
  fr.style.cssText = base + 'opacity:0;transition:none;'

  setTimeout(() => {
    if (myGen !== gen || destroyed) return
    fc.style.opacity = '1'

    crBody.setAttribute('y', 65)
    crBody.setAttribute('height', 0)

    sweepDown(crBody, 125, 650, () => {
      if (myGen !== gen || destroyed) return
      crArms.setAttribute('x', 90)
      crArms.setAttribute('width', 0)

      let t0 = null
      requestAnimationFrame(function sweepArms(ts) {
        if (myGen !== gen || destroyed) return
        if (!t0) t0 = ts
        const p = Math.min((ts - t0) / 700, 1)
        const w = 85 * (1 - Math.pow(1 - p, 2.5))
        crArms.setAttribute('width', w.toFixed(1))
        crArms.setAttribute('x', (90 - w).toFixed(1))
        if (p < 1) { requestAnimationFrame(sweepArms); return }

        sweepDot(crHead, 16, 380, () => {
          if (myGen !== gen || destroyed) return
          setTimeout(() => {
            if (myGen !== gen || destroyed) return
            peekIn(() => {
              if (myGen !== gen || destroyed) return
              setTimeout(() => {
                if (myGen !== gen || destroyed) return
                shrinkOut(() => {
                  if (myGen !== gen || destroyed) return
                  replaying = false
                  setTimeout(replay, 300)
                })
              }, 3000)
            })
          }, 200)
        })
      })
    })
  }, 300)
}

onMounted(() => {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#4cc7ec')
  document.fonts.ready.then(() => {
    fontsReady.value = true
  })
  setTimeout(replay, 400)
})

onBeforeUnmount(() => {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#1e3a8a')
  destroyed = true
  gen++
})
</script>

<style scoped>
/* ═══ Container ═══ */
.intro-page {
  position: fixed;
  inset: 0;
  background: #fff;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.intro-page.fonts-loaded {
  opacity: 1;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

/* ═══ Top gradient — 490/844 = 58% ═══ */
.top-half {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 58.06%; /* 490/844 */
  background: linear-gradient(135deg, #4cc7ec 0%, #1fb5fb 25%, #4389f7 60%, #5c6bf3 100%);
  overflow: hidden;
  z-index: 0;
}

/* ═══ Animated circles ═══ */
.circles-svg {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  overflow: visible;
  pointer-events: none;
  transform: translate(20%, -4%) scale(1.65);
}

@keyframes rotCircle1 {
  0%   { transform: rotate(-12deg) translate(0px, 0px); }
  12%  { transform: rotate(9deg) translate(-28px, -20px); }
  27%  { transform: rotate(-6deg) translate(-40px, 15px); }
  41%  { transform: rotate(16deg) translate(-23px, 30px); }
  58%  { transform: rotate(-14deg) translate(-45px, -13px); }
  73%  { transform: rotate(5deg) translate(-30px, 25px); }
  87%  { transform: rotate(-10deg) translate(-18px, -23px); }
  100% { transform: rotate(-12deg) translate(0px, 0px); }
}
@keyframes rotCircle2 {
  0%   { transform: rotate(8deg) translate(0px, 0px); }
  14%  { transform: rotate(-16deg) translate(30px, 18px); }
  29%  { transform: rotate(12deg) translate(15px, -28px); }
  44%  { transform: rotate(-5deg) translate(40px, 10px); }
  61%  { transform: rotate(18deg) translate(23px, -20px); }
  76%  { transform: rotate(-13deg) translate(35px, 28px); }
  90%  { transform: rotate(7deg) translate(13px, -15px); }
  100% { transform: rotate(8deg) translate(0px, 0px); }
}
.rot1 { transform-origin: 1587.25px 1842.8px; animation: rotCircle1 32s ease-in-out infinite; }
.rot2 { transform-origin: 574.46px 574.46px; animation: rotCircle2 41s ease-in-out infinite; }

/* ═══ White wave — top 324/844 = 38.4% ═══ */
.wave-svg {
  position: absolute;
  top: 38.4%; /* 324/844 */
  left: 0;
  width: 100%;
  height: 62%; /* covers rest of screen */
  z-index: 4;
  pointer-events: none;
  display: block;
}

/* ═══ Figures stage ═══ */
.figures-stage {
  position: absolute;
  top: 9.5%;
  left: 0; right: 0;
  height: 42.6%;
  z-index: 3;
}
.figures-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform: translate(-2.5%, -35%) scale(1.25);
}
.fig { position: absolute; bottom: 0; }
.fig-center {
  width: 30%;
  max-width: 120px;
  left: 50%;
  transform: translateX(-50%);
  height: 66%;
  z-index: 3;
}
.fig-left, .fig-right {
  width: 22.5%;
  max-width: 90px;
  height: 50%;
  left: 50%;
  z-index: 2;
  opacity: 0;
  transform-origin: bottom center;
  transition: none;
}
.fig-shape-body { fill: #ffffff; }
.fig-shape-arms { fill: #9cd1f2; }
.fig-shape-white { fill: #fff; }

/* ═══ Text — all absolute, fixed px bottom values ═══ */
.txt-subtitle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 92.5%;
  font-family: 'Assistant', 'Heebo', sans-serif;
  font-size: 25px;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;
  letter-spacing: 0px;
  z-index: 6;
}

.txt-header {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 37%;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-size: 40px;
  font-weight: 500;
  color: #2f305c;
  text-align: center;
  white-space: nowrap;
  letter-spacing: -0.5px;
  z-index: 6;
}

.txt-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 26%;
  font-family: 'Rubik', 'Heebo', sans-serif;
  font-size: 94px;
  font-weight: 300;
  color: #69a6d3;
  text-align: center;
  white-space: nowrap;
  letter-spacing: -4px;
  z-index: 6;
}

/* ═══ Logos — top-right corner, vertically centered row ═══ */
.logos-row {
  position: absolute;
  top: 1.7%;
  right: 7.5%;
  display: flex;
  align-items: center;
  gap: 0px;
  z-index: 6;
}
.logo-item {
  display: flex;
  align-items: center;
}
.logo-item :deep(svg) {
  display: block;
  width: auto;
}
.logo-meitav :deep(svg) {
  height: 32px;
}
.logo-sahar :deep(svg) {
  height: 32px;
}

/* ═══ Button — bottom 74px ═══ */
.btn-login {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 8.8%;
  width: 70%;
  max-width: 275px;
  height: 45px;
  padding: 0;
  border: none;
  border-radius: 7px;
  background: #2f305c;
  color: #fff;
  font-family: 'Noto Sans Hebrew', 'Heebo', sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  pointer-events: all;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, transform 0.1s;
  z-index: 7;
}
.btn-login:active {
  transform: translateX(-50%) scale(0.97);
  background: #2d6fd4;
}
</style>

<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  details: { type: Object, required: true },
  candidate: { type: Object, required: true },
  open: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="open" class="drawer-backdrop" @click="emit('close')" />
    </Transition>

    <!-- Drawer -->
    <Transition name="slide-up">
      <div v-if="open" class="drawer">
        <!-- Drag handle -->
        <div class="drawer-handle" @click="emit('close')">
          <span class="handle-bar" />
        </div>

        <!-- Top action buttons -->
        <div class="drawer-actions">
          <a :href="`tel:${candidate.phone}`" class="action-btn">
            <AppIcon name="phone" :size="29" />
          </a>
          <a :href="`mailto:${candidate.email}`" class="action-btn">
            <AppIcon name="mail" :size="29" />
          </a>
          <a :href="`https://wa.me/${candidate.phone?.replace(/\D/g,'')}`" target="_blank" class="action-btn">
            <AppIcon name="whatsapp" :size="29" />
          </a>
        </div>

        <!-- Rows list -->
        <div class="drawer-rows">
          <!-- Row 1: age + birth date (double row) -->
          <div class="drawer-row drawer-row--double">
            <div class="row-right-col">
              <span class="row-plain">{{ details.ageLabel }} {{ details.age }} {{ details.hebrewAge }}</span>
              <span class="row-plain">{{ details.birthDateHebrew }} {{ details.hebrewAge }}</span>
            </div>
            <div class="row-left-col">
              <span class="row-value">{{ details.birthDate }}</span>
              <span class="row-value">{{ details.hebrewAgeValue }}</span>
            </div>
          </div>

          <!-- Row 2: status -->
          <div class="drawer-row">
            <span class="row-label">סטטוס</span>
            <span class="row-value">{{ details.status }}</span>
          </div>

          <!-- Row 3: status reason -->
          <div class="drawer-row">
            <span class="row-label">סיבת סטטוס</span>
            <span class="row-value">{{ details.statusReason }}</span>
          </div>

          <!-- Row 4: assigned track -->
          <div class="drawer-row">
            <span class="row-label">שווה מועדר</span>
            <span class="row-value">{{ details.assignedTrack }}</span>
          </div>

          <!-- Row 5: citizenship + badge -->
          <div class="drawer-row">
            <span class="row-label">אזרחות</span>
            <div class="row-left-with-badge">
              <span v-if="details.citizenshipBadge" class="indication-badge">{{ details.citizenshipBadge }}</span>
              <span class="row-value">{{ details.citizenship }}</span>
            </div>
          </div>

          <!-- Row 6: religion -->
          <div class="drawer-row">
            <span class="row-label">דת</span>
            <span class="row-value">{{ details.religion }}</span>
          </div>

          <!-- Row 7: family status -->
          <div class="drawer-row">
            <span class="row-label">מצב משפחתי</span>
            <span class="row-value">{{ details.familyStatus }}</span>
          </div>

          <!-- Row 8: city -->
          <div class="drawer-row">
            <span class="row-label">עיר מגורים</span>
            <span class="row-value">{{ details.city }}</span>
          </div>

          <!-- Row 9: father -->
          <div class="drawer-row">
            <span class="row-label">שם אב</span>
            <div class="row-left-with-icons">
              <span class="row-value">{{ details.fatherName }}</span>

              <div class="contact-icons">
                <a :href="`https://wa.me/${details.fatherPhone?.replace(/\D/g,'')}`" target="_blank" class="contact-icon-btn contact-icon-btn--green">
                  <AppIcon name="whatsapp" :size="16" />
                </a>
                <a :href="`tel:${details.fatherPhone}`" class="contact-icon-btn contact-icon-btn--green">
                  <AppIcon name="phone" :size="16" />
                </a>
              </div>
            </div>
          </div>

          <!-- Row 10: mother -->
          <div class="drawer-row">
            <span class="row-label">שם אם</span>

            <div class="row-left-with-icons">
              <span class="row-value">{{ details.motherName }}</span>

              <div class="contact-icons">
                <a :href="`https://wa.me/${details.motherPhone?.replace(/\D/g,'')}`" target="_blank" class="contact-icon-btn contact-icon-btn--green">
                  <AppIcon name="whatsapp" :size="16" />
                </a>
                <a :href="`tel:${details.motherPhone}`" class="contact-icon-btn contact-icon-btn--green">
                  <AppIcon name="phone" :size="16" />
                </a>
              </div>
            </div>
          </div>

          <!-- Row 11: address -->
          <div class="drawer-row">
            <span class="row-label">כתובה</span>
            <span class="row-value">{{ details.address }}</span>
          </div>

          <!-- Row 12: school -->
          <div class="drawer-row drawer-row--last">
            <span class="row-label">בית ספר</span>
            <span class="row-value">{{ details.school }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Backdrop ── */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 999;
}

/* ── Drawer panel ── */
.drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 92vh;
  overflow-y: auto;
  background: linear-gradient(270deg, #E2E8F8 0%, #FFFFFF 107.42%);
  box-shadow: 0px 16px 6px rgba(145,148,161,0.01),
              0px 9px 5px rgba(145,148,161,0.05),
              0px 4px 4px rgba(145,148,161,0.09),
              0px 1px 2px rgba(145,148,161,0.1);
  border-radius: 20px 20px 0 0;
  padding: 0 20px 30px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

/* ── Drag handle ── */
.drawer-handle {
  display: flex;
  justify-content: center;
  padding: 12px 0 8px;
  cursor: pointer;
}
.handle-bar {
  width: 40px;
  height: 4px;
  background: rgba(47,48,92,0.2);
  border-radius: 2px;
}

/* ── Top action buttons ── */
.drawer-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 8px 0 16px;
}

.action-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 128px;
  height: 43px;
  background: #FFFFFF;
  box-shadow: 0px 3px 7px rgba(0,0,0,0.05);
  border-radius: 999px;
  color: #5D87FF;
  text-decoration: none;
  flex: 1;
}

/* ── Rows ── */
.drawer-rows {
  display: flex;
  flex-direction: column;
}

.drawer-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  min-height: 50px;
  border-bottom: 1px solid rgba(255,255,255,0.68);
}

.drawer-row--last {
  border-bottom: none;
}

/* Double row (age + birth) */
.drawer-row--double {
  flex-direction: row;
  align-items: center;
}

.row-right-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.row-left-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.row-left-col .row-value {
  text-align: left;
}

.row-pair {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.row-plain {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  color: #171C23;
  text-align: right;
}

.row-label {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  color: #171C23;
  text-align: right;
}

.row-value {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #171C23;
  text-align: right;
}

.row-sub {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  color: rgba(23,28,35,0.6);
  text-align: left;
}

/* Row with badge (left side) */
.row-left-with-badge {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.indication-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  background: #F0F7FB;
  border-radius: 8px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: #00A0E6;
}

/* Row with contact icons (left of value) */
.row-left-with-icons {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.contact-icons {
  display: flex;
  gap: 10px;
}

.contact-icon-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 40px;
  text-decoration: none;
}

.contact-icon-btn--green {
  background: #4CB44E;
  color: #fff;
}

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-leave-active {
  transition: transform 0.25s ease-in;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}

/* ── Desktop: side drawer instead of bottom sheet ── */
@media (min-width: 768px) {
  .drawer {
    top: 0;
    bottom: 0;
    right: 0;
    left: auto;
    width: 440px;
    max-height: 100vh;
    border-radius: 0 0 20px 20px;
  }

  .slide-up-enter-from, .slide-up-leave-to {
    transform: translateX(100%);
  }
}
</style>

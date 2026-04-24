<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  details: { type: Object, required: true },
  candidatePhone: { type: String, default: '' },
  candidateEmail: { type: String, default: '' }
})
</script>

<template>
  <div class="pd-panel">
    <!-- Top action buttons -->
    <div class="pd-actions">
      <a class="pd-action-btn" :href="'tel:' + candidatePhone">
        <AppIcon name="phone" :size="22" />
      </a>
      <a class="pd-action-btn" :href="'mailto:' + candidateEmail">
        <AppIcon name="mail" :size="22" />
      </a>
      <a class="pd-action-btn" :href="'https://wa.me/' + candidatePhone.replace(/[^0-9]/g, '')" target="_blank">
        <AppIcon name="whatsapp" :size="22" />
      </a>
    </div>

    <!-- Info rows -->
    <div class="pd-list">
      <!-- ת. גיל / ת.לידה -->
      <div class="pd-row">
        <div class="pd-row__right">
          <div class="pd-icon-circle">
            <AppIcon name="trackForm" :size="20" />
          </div>
          <div class="pd-labels">
            <span class="pd-label">ת. גיל {{ details.hebrewAge }} עברי</span>
            <span class="pd-label">ת.לידה</span>
          </div>
        </div>
        <div class="pd-values">
          <span class="pd-value">{{ details.birthDate }}</span>
          <span class="pd-value">{{ details.birthDateHebrew }}</span>
        </div>
      </div>

      <!-- סטטוס -->
      <div class="pd-row">
        <div class="pd-row__right">
          <div class="pd-icon-circle">
            <AppIcon name="trackDraft" :size="20" />
          </div>
          <span class="pd-label">סטטוס</span>
        </div>
        <span class="pd-value">{{ details.status }}</span>
      </div>

      <!-- סיבת סטטוס -->
      <div class="pd-row">
        <div class="pd-row__right">
          <div class="pd-icon-circle">
            <AppIcon name="alert" :size="20" />
          </div>
          <span class="pd-label">סיבת סטטוס</span>
        </div>
        <span class="pd-value">{{ details.statusReason }}</span>
      </div>

      <!-- טווח מועמד -->
      <div class="pd-row">
        <div class="pd-row__right">
          <div class="pd-icon-circle">
            <AppIcon name="trackScreen" :size="20" />
          </div>
          <span class="pd-label">{{ details.candidateRange }}</span>
        </div>
        <span class="pd-value">{{ details.candidateRangeValue }}</span>
      </div>

      <!-- אזרחות -->
      <div class="pd-row">
        <div class="pd-row__right">
          <div class="pd-icon-circle">
            <AppIcon name="search" :size="20" />
          </div>
          <span class="pd-label">אזרחות</span>
        </div>
        <div class="pd-value-with-badge">
          <span class="pd-value">{{ details.citizenship }}</span>
          <span v-if="details.citizenshipBadge" class="pd-badge">{{ details.citizenshipBadge }}</span>
        </div>
      </div>

      <!-- דת -->
      <div class="pd-row">
        <div class="pd-row__right">
          <div class="pd-icon-circle">
            <AppIcon name="file" :size="20" />
          </div>
          <span class="pd-label">דת</span>
        </div>
        <span class="pd-value">{{ details.religion }}</span>
      </div>

      <!-- מצב משפחתי -->
      <div class="pd-row">
        <div class="pd-row__right">
          <div class="pd-icon-circle">
            <AppIcon name="users" :size="20" />
          </div>
          <span class="pd-label">מצב משפחתי</span>
        </div>
        <span class="pd-value">{{ details.maritalStatus }}</span>
      </div>

      <!-- עיר מגורים -->
      <div class="pd-row">
        <div class="pd-row__right">
          <div class="pd-icon-circle">
            <AppIcon name="trackRegister" :size="20" />
          </div>
          <span class="pd-label">עיר מגורים</span>
        </div>
        <span class="pd-value">{{ details.city }}</span>
      </div>

      <!-- שם אב -->
      <div class="pd-row">
        <div class="pd-row__right">
          <div class="pd-icon-circle">
            <AppIcon name="trackDraft" :size="20" />
          </div>
          <span class="pd-label">שם אב</span>
        </div>
        <div class="pd-value-with-actions">
          <div class="pd-contact-btns">
            <a class="pd-contact-btn" :href="'tel:' + details.fatherPhone">
              <AppIcon name="phone" :size="16" />
            </a>
            <a class="pd-contact-btn" :href="'https://wa.me/' + details.fatherPhone.replace(/[^0-9]/g, '')" target="_blank">
              <AppIcon name="whatsapp" :size="16" />
            </a>
          </div>
          <span class="pd-value">{{ details.fatherName }}</span>
        </div>
      </div>

      <!-- שם אם -->
      <div class="pd-row">
        <div class="pd-row__right">
          <div class="pd-icon-circle">
            <AppIcon name="trackDraft" :size="20" />
          </div>
          <span class="pd-label">שם אם</span>
        </div>
        <div class="pd-value-with-actions">
          <div class="pd-contact-btns">
            <a class="pd-contact-btn" :href="'tel:' + details.motherPhone">
              <AppIcon name="phone" :size="16" />
            </a>
            <a class="pd-contact-btn" :href="'https://wa.me/' + details.motherPhone.replace(/[^0-9]/g, '')" target="_blank">
              <AppIcon name="whatsapp" :size="16" />
            </a>
          </div>
          <span class="pd-value">{{ details.motherName }}</span>
        </div>
      </div>

      <!-- כיתה -->
      <div class="pd-row">
        <div class="pd-row__right">
          <div class="pd-icon-circle">
            <AppIcon name="grid" :size="20" />
          </div>
          <span class="pd-label">כיתה</span>
        </div>
        <div class="pd-value-with-actions">
          <AppIcon name="edit" :size="16" class="pd-edit-icon" />
          <span class="pd-value">{{ details.grade }}</span>
        </div>
      </div>

      <!-- בית ספר -->
      <div class="pd-row pd-row--last">
        <div class="pd-row__right">
          <div class="pd-icon-circle">
            <AppIcon name="trackOrder" :size="20" />
          </div>
          <span class="pd-label">בית ספר</span>
        </div>
        <span class="pd-value">{{ details.school }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pd-panel {
  direction: rtl;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 10px 20px 20px;
}

/* Action buttons row */
.pd-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 16px;
}

.pd-action-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 43px;
  background: #FFFFFF;
  box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.05);
  border-radius: 999px;
  color: #5D87FF;
  text-decoration: none;
  cursor: pointer;
}

/* Info rows */
.pd-list {
  display: flex;
  flex-direction: column;
}

.pd-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  min-height: 70px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.68);
  box-sizing: border-box;
}

.pd-row--last {
  border-bottom: none;
}

.pd-row__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pd-icon-circle {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #ECF0FE;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #171C23;
}

.pd-label {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  color: #171C23;
}

.pd-labels {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.pd-value {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #171C23;
}

.pd-values {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.pd-value-with-badge {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 10px;
}

.pd-badge {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: #00A0E6;
  background: #F0F7FB;
  border-radius: 8px;
  padding: 4px 8px 6px;
}

.pd-value-with-actions {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 8px;
}

.pd-contact-btns {
  display: flex;
  gap: 10px;
}

.pd-contact-btn {
  width: 32px;
  height: 32px;
  background: #4CB44E;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.pd-edit-icon {
  color: #171C23;
  cursor: pointer;
}
</style>

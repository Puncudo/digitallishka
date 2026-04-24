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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#5D87FF"/>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="#5D87FF" stroke-width="1.5" fill="none"/>
        </svg>
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="white"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="white" stroke-width="1.5" fill="none"/></svg>
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="white"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="white" stroke-width="1.5" fill="none"/></svg>
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

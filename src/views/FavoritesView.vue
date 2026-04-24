<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
import AppIcon from '@/components/ui/AppIcon.vue'
import mockData from '@/data/mock.json'

const router = useRouter()
const store = useAppStore()

const favoriteCandidates = computed(() =>
  mockData.candidates.filter(c => store.isFavorite(c.id))
)

function goToCandidate(id) {
  router.push(`/candidates/${id}`)
}

function openWhatsApp(phone) {
  const cleaned = phone.replace(/[^0-9]/g, '')
  window.open(`https://wa.me/972${cleaned.substring(1)}`, '_blank')
}

function callPhone(phone) {
  window.open(`tel:${phone}`)
}
</script>

<template>
  <div class="favorites-page">
    <div class="favorites-list">
      <div
        v-for="candidate in favoriteCandidates"
        :key="candidate.id"
        class="fav-card"
        @click="goToCandidate(candidate.id)"
      >
        <!-- Top row: name/school + star -->
        <div class="fav-card__top">
          <div class="fav-card__info">
            <div class="fav-card__name-row">
              <AppIcon :name="candidate.gender === 'F' ? 'female' : 'male'" :size="14" class="fav-gender-icon" />
              <span class="fav-card__name">{{ candidate.name }}</span>
            </div>
            <span class="fav-card__school">{{ candidate.school }}</span>
          </div>
          <button
            class="fav-star"
            aria-label="הסר ממועדפים"
            @click.stop="store.toggleFavorite(candidate.id)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD16A">
              <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

        <!-- Test description -->
        <div v-if="store.showTestInfo && candidate.testDescription" class="fav-card__test">
          {{ candidate.testDescription }}
        </div>

        <!-- Bottom row: action buttons -->
        <div class="fav-card__actions">
          <button class="action-btn action-btn--whatsapp" @click.stop="openWhatsApp(candidate.phone)" aria-label="וואטסאפ">
            <AppIcon name="whatsapp" :size="18" />
          </button>
          <button class="action-btn action-btn--call" @click.stop="callPhone(candidate.phone)" aria-label="התקשר">
            <AppIcon name="phone" :size="18" />
          </button>
        </div>
      </div>

      <div v-if="!favoriteCandidates.length" class="empty-state">
        <span class="empty-icon">⭐</span>
        <span class="empty-text">אין מועדפים</span>
        <span class="empty-sub">סמנו מועמדים כמועדפים כדי לראותם כאן</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorites-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #FFFFFF;
  padding: 20px 0;
}


.fav-card__test {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-size: 12px;
  line-height: 18px;
  color: #856404;
  background: #FFF3CD;
  border-radius: 6px;
  padding: 8px 12px;
  width: 100%;
  box-sizing: border-box;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 20px;
}

/* Card */
.fav-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  gap: 16px;
  background: #FFFFFF;
  border: 1px solid #EFF3FF;
  border-left-width: 0;
  box-shadow: 0px 3px 8px rgba(47, 48, 92, 0.07);
  border-radius: 4px;
  cursor: pointer;
  transition: box-shadow 0.15s;
}

.fav-card:hover {
  box-shadow: 0px 5px 14px rgba(47, 48, 92, 0.12);
}

/* Top row */
.fav-card__top {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}

.fav-star {
  width: 40px;
  height: 40px;
  background: #F5F5F7;
  border-radius: 111px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.fav-card__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.fav-card__name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.fav-gender-icon {
  color: #2F305C;
}

.fav-card__name {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  text-align: right;
  color: #2F305C;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.fav-card__school {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  text-align: right;
  color: #6D6E8D;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Actions */
.fav-card__actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  height: 36px;
  border: none;
  border-radius: 1000px;
  cursor: pointer;
  box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.05);
}

.action-btn--whatsapp {
  background: #5D87FF;
  color: white;
}

.action-btn--call {
  background: #999999;
  color: white;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 40px;
}

.empty-text {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: #2F305C;
}

.empty-sub {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #999;
  text-align: center;
}
</style>

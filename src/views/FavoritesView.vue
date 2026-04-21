<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
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
            <span class="fav-card__name">{{ candidate.name }}</span>
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

        <!-- Bottom row: action buttons -->
        <div class="fav-card__actions">
          <button class="action-btn action-btn--whatsapp" @click.stop="openWhatsApp(candidate.phone)" aria-label="וואטסאפ">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.477 0 0 4.477 0 10C0 11.89 0.525 13.66 1.438 15.188L0.063 19.375L4.375 18.031C5.85 18.875 7.563 19.375 9.375 19.438V20H10C15.523 20 20 15.523 20 10C20 4.477 15.523 0 10 0ZM10 18C8.275 18 6.675 17.5 5.313 16.625L4.938 16.375L2.125 17.25L3.063 14.5L2.75 14.063C1.8 12.65 1.25 10.975 1.25 9.188C1.25 9.125 1.25 9.063 1.25 9H1.25C1.313 5.15 4.525 2 8.375 2H10C14.413 2 18 5.588 18 10C18 14.413 14.413 18 10 18ZM14.375 12.125C14.125 12 12.988 11.438 12.75 11.35C12.513 11.263 12.338 11.213 12.163 11.463C11.988 11.713 11.538 12.237 11.388 12.413C11.238 12.588 11.088 12.613 10.838 12.488C10.588 12.363 9.838 12.113 8.95 11.313C8.263 10.7 7.8 9.938 7.65 9.688C7.5 9.438 7.638 9.3 7.763 9.175C7.875 9.063 8.013 8.875 8.138 8.725C8.263 8.575 8.3 8.463 8.388 8.288C8.475 8.113 8.425 7.963 8.363 7.838C8.3 7.713 7.8 6.575 7.575 6.075C7.363 5.6 7.138 5.663 6.975 5.663C6.825 5.65 6.65 5.65 6.475 5.65C6.3 5.65 6.013 5.713 5.775 5.963C5.538 6.213 4.938 6.775 4.938 7.913C4.938 9.05 5.8 10.15 5.925 10.325C6.05 10.5 7.788 13.2 10.475 14.2C11.025 14.425 11.45 14.563 11.788 14.663C12.35 14.838 12.863 14.813 13.275 14.75C13.738 14.675 14.663 14.175 14.875 13.625C15.088 13.075 15.088 12.613 15.025 12.488C14.963 12.375 14.625 12.25 14.375 12.125Z" fill="white"/>
            </svg>
          </button>
          <button class="action-btn action-btn--call" @click.stop="callPhone(candidate.phone)" aria-label="התקשר">
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
              <path d="M16.5 12.69V14.94C16.5 15.4508 16.0908 15.87 15.59 15.87C7.37 15.87 0.75 9.25 0.75 1.03C0.75 0.529 1.169 0.12 1.67 0.12H3.92C4.42 0.12 4.84 0.529 4.84 1.03C4.84 2.14 4.99 3.2 5.27 4.2C5.36 4.53 5.27 4.89 5.01 5.15L3.48 6.68C4.94 9.55 7.32 11.93 10.19 13.39L11.72 11.86C11.98 11.6 12.34 11.51 12.67 11.6C13.67 11.88 14.73 12.03 15.84 12.03C16.34 12.03 16.5 12.19 16.5 12.69Z" fill="white"/>
            </svg>
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.fav-card__name {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  text-align: right;
  color: #2F305C;
}

.fav-card__school {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  text-align: right;
  color: #6D6E8D;
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
}

.action-btn--call {
  background: #999999;
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

<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps({
  comment: { type: String, required: true }
})
</script>

<template>
  <div class="comment-wrap">
    <div class="comment-header">
      <span class="comment-title">הערות מדריך קהילה</span>
      <button class="edit-btn" aria-label="ערוך">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.5 18.3333H2.5C2.15833 18.3333 1.875 18.05 1.875 17.7083C1.875 17.3667 2.15833 17.0833 2.5 17.0833H17.5C17.8417 17.0833 18.125 17.3667 18.125 17.7083C18.125 18.05 17.8417 18.3333 17.5 18.3333Z"
            fill="#2F305C" />
          <path
            d="M15.85 2.89999C14.2333 1.28332 12.65 1.24166 10.9916 2.89999L9.98331 3.90832C9.89998 3.99166 9.86665 4.12499 9.89998 4.24166C10.5333 6.44999 12.3 8.21666 14.5083 8.84999C14.5416 8.85832 14.575 8.86666 14.6083 8.86666C14.7 8.86666 14.7833 8.83332 14.85 8.76666L15.85 7.75832C16.675 6.94166 17.075 6.14999 17.075 5.34999C17.0833 4.52499 16.6833 3.72499 15.85 2.89999Z"
            fill="#2F305C" />
          <path
            d="M13.0084 9.60832C12.7668 9.49166 12.5334 9.37499 12.3084 9.24166C12.1251 9.13332 11.9501 9.01666 11.7751 8.89166C11.6334 8.79999 11.4668 8.66666 11.3084 8.53332C11.2918 8.52499 11.2334 8.47499 11.1668 8.40832C10.8918 8.17499 10.5834 7.87499 10.3084 7.54166C10.2834 7.52499 10.2418 7.46666 10.1834 7.39166C10.1001 7.29166 9.95844 7.12499 9.83344 6.93332C9.73344 6.80832 9.61677 6.62499 9.50844 6.44166C9.3751 6.21666 9.25844 5.99166 9.14177 5.75832C8.9888 5.43054 8.55859 5.33317 8.30282 5.58894L3.61677 10.275C3.50844 10.3833 3.40844 10.5917 3.38344 10.7333L2.93344 13.925C2.8501 14.4917 3.00844 15.025 3.35844 15.3833C3.65844 15.675 4.0751 15.8333 4.5251 15.8333C4.6251 15.8333 4.7251 15.825 4.8251 15.8083L8.0251 15.3583C8.1751 15.3333 8.38344 15.2333 8.48344 15.125L13.1772 10.4312C13.4279 10.1805 13.3337 9.74927 13.0084 9.60832Z"
            fill="#2F305C" />
        </svg>

      </button>
    </div>
    <p class="comment-text">{{ comment }}</p>
  </div>
</template>

<style scoped>
.comment-wrap {
  background: #FFFFFF;
  width: 100%;
  padding: 20px 20px 24px;
  position: relative;
}

.comment-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.comment-title {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: #2F305C;
  text-align: right;
}

.edit-btn {
  color: #2F305C;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
}

.comment-text {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  color: rgba(47, 48, 92, 0.75);
  text-align: right;
  margin: 0;
}

/* Desktop */
@media (min-width: 768px) {
  .comment-wrap {
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }
}</style>

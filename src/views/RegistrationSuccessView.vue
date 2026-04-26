<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="success-page">
    <div class="success-content">
      <svg class="success-icon" width="180" height="180" viewBox="0 0 182 186" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_1128_5402)">
          <path d="M30.814 45C21.439 57.525 15.814 73.125 15.814 90C15.814 131.4 49.414 165 90.814 165C132.214 165 165.814 131.4 165.814 90C165.814 48.6 132.214 15 90.814 15C80.089 15 69.814 17.25 60.589 21.375" stroke="#5D87FF" stroke-width="11.25" stroke-linecap="round" stroke-linejoin="round" shape-rendering="crispEdges"/>
        </g>
        <g filter="url(#filter1_d_1128_5402)">
          <path d="M113.314 77.85L121.714 69.375" stroke="#5D87FF" stroke-width="11.25" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <g filter="url(#filter2_d_1128_5402)">
          <path d="M59.9141 90L80.4641 110.625L99.5891 91.575" stroke="#5D87FF" stroke-width="11.25" stroke-linecap="round" stroke-linejoin="round" shape-rendering="crispEdges"/>
        </g>
        <defs>
          <filter id="filter0_d_1128_5402" x="-7.62939e-05" y="3.90936" width="181.628" height="181.628" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4.7234"/>
            <feGaussianBlur stdDeviation="5.09452"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.315129 0 0 0 0 0.492688 0 0 0 0 1 0 0 0 0.3 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1128_5402"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1128_5402" result="shape"/>
          </filter>
          <filter id="filter1_d_1128_5402" x="97.4999" y="58.2844" width="40.028" height="40.1027" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4.7234"/>
            <feGaussianBlur stdDeviation="5.09452"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.315129 0 0 0 0 0.492688 0 0 0 0 1 0 0 0 0.3 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1128_5402"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1128_5402" result="shape"/>
          </filter>
          <filter id="filter2_d_1128_5402" x="44.1" y="78.9094" width="71.3031" height="52.2531" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4.7234"/>
            <feGaussianBlur stdDeviation="5.09452"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.315129 0 0 0 0 0.492688 0 0 0 0 1 0 0 0 0.3 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1128_5402"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1128_5402" result="shape"/>
          </filter>
        </defs>
      </svg>

      <div class="success-text">
        <h1 class="success-title">ההרשמה בוצעה בהצלחה!</h1>
        <p class="success-subtitle">הטופס הועבר לאישור יחידת ״מיטב״</p>
      </div>

      <p class="success-contact">לשאלות נוספות ניתן לפנות בטלפון <a href="tel:03-65215478" class="phone-link">03-65215478</a></p>
    </div>

    <button class="home-btn" @click="router.push('/home')">למסך הראשי</button>
  </div>
</template>

<style scoped>
.success-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  background: #F4F6FB;
  padding: 0 20px;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.success-icon {
  width: 180px;
  height: 180px;
}

.success-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 21px;
}

.success-title {
  margin: 0;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 26px;
  line-height: 100%;
  text-align: center;
  color: #2F305C;
}

.success-subtitle {
  margin: 0;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 500;
  font-size: 17px;
  line-height: 16px;
  text-align: center;
  color: #2F305C;
}

.success-contact {
  margin: 0;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 120%;
  text-align: center;
  color: #2F305C;
}

.phone-link {
  color: #5D87FF;
  text-decoration: underline;
}

.home-btn {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 60px);
  max-width: 380px;
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  background: #5D87FF;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF;
}
</style>

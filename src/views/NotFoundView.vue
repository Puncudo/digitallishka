<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="notfound-page">
    <div class="notfound-content">
      <div class="notfound-img-wrap">
        <img src="@/assets/404error image.png" alt="404" class="notfound-img" />
        <div class="notfound-shadow"></div>
      </div>
      <div class="notfound-texts">
        <p class="notfound-title">אופס..</p>
        <p class="notfound-subtitle">לא מצאנו את הכתובת שחיפשת</p>
      </div>
      <a class="back-link" @click.prevent="router.back()">חזרה</a>
    </div>
  </div>
</template>

<style scoped>
.notfound-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  background: #F4F6FB;
  padding: 0 20px;
}

.notfound-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.notfound-img-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.notfound-img {
  width: 160px;
  height: auto;
  margin-left: 40px;
  position: relative;
  z-index: 1;
}

.notfound-shadow {
  width: 120px;
  height: 18px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  margin-top: -18px;
  margin-left: -5px;
}

.notfound-texts {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.notfound-title {
  margin: 0;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 34px;
  text-align: center;
  color: #2F305C;
}

.notfound-subtitle {
  margin: 0;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: #ACACBE;
}

.back-link {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  text-decoration: underline;
  color: #5D87FF;
  cursor: pointer;
  margin-top: 8px;
}
</style>

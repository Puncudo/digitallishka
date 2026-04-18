<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/useAppStore'
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps({
  candidate: { type: Object, required: true }
})

const store = useAppStore()
const { favorited } = storeToRefs(store)
</script>

<template>
  <!-- ── Mobile hero ── -->
  <div class="hero-mobile">
    <!-- Fav button — absolute, right side -->
    <button class="fav-btn" :class="{ active: favorited }" aria-label="מועדף" @click="store.toggleFavorite()">
      <AppIcon :name="favorited ? 'starFill' : 'star'" :size="15" />
    </button>

    <!-- Centered content -->
    <div class="hero-mobile__inner">
      <div class="hero-mobile__name-row">
        <!-- person icon — first in DOM = right in RTL -->
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.66667 9.49996C11.2775 9.49996 12.5833 8.19412 12.5833 6.58329C12.5833 4.97246 11.2775 3.66663 9.66667 3.66663C8.05584 3.66663 6.75 4.97246 6.75 6.58329C6.75 8.19412 8.05584 9.49996 9.66667 9.49996Z"
            fill="white" stroke="#F0F4FF" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M10.9167 20.3333H8.41667L3 11.9999H16.3333L10.9167 20.3333Z" fill="white" stroke="#F0F4FF"
            stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>




        <span class="hero-mobile__name">{{ candidate.name }}</span>
      </div>
      <div class="hero-mobile__id">ת.ז. {{ candidate.id }}</div>
    </div>

  </div>

  <!-- ── Desktop hero ── -->
  <div class="hero-desktop">
    <div class="hero-desktop__top">
      <div>
        <div class="hero-desktop__name">{{ candidate.name }}</div>
        <div class="hero-desktop__id">ת.ז. {{ candidate.id }}</div>
        <div class="hero-desktop__contacts">
          <span class="contact-pill">
            <AppIcon name="mail" :size="13" />
            {{ candidate.email }}
          </span>
          <span class="contact-pill">
            <AppIcon name="phone" :size="13" />
            {{ candidate.phone }}
          </span>
        </div>
      </div>
      <button class="fav-btn fav-btn--desktop" :class="{ active: favorited }" aria-label="מועדף"
        @click="store.toggleFavorite()">
        <AppIcon :name="favorited ? 'starFill' : 'star'" :size="18" />
      </button>
    </div>

    <!-- Stats row -->
    <div class="hero-desktop__stats">
      <div v-for="stat in candidate.headerStats" :key="stat.label" class="stat-pill">
        <div class="stat-pill__label">{{ stat.label }}</div>
        <div class="stat-pill__value">{{ stat.value }}</div>
        <div v-if="stat.sub" class="stat-pill__sub">{{ stat.sub }}</div>
      </div>
    </div>

    <!-- Related people -->
    <div class="related-wrap">
      <table class="related-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>קשר</th>
            <th>מיקום</th>
            <th>גיל</th>
            <th>יחידה</th>
            <th>סטטוס</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in candidate.relatedPeople" :key="p.id">
            <td>{{ p.name }}</td>
            <td>{{ p.relation }}</td>
            <td>{{ p.location }}</td>
            <td>{{ p.ageGroup }}</td>
            <td>{{ p.unit }}</td>
            <td>
              <span class="rp-badge" :class="p.status === 'פעיל' ? 'rp-badge--active' : 'rp-badge--closed'">
                {{ p.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* ── Mobile ── */
.hero-mobile {
  background: linear-gradient(275.24deg, #5C6BF3 -1.99%, #4389F7 38.29%, #1FB5FB 88.96%, #00D9FF 99.75%);
  position: relative;
  padding: 24px 0 0;
  color: #fff;
}

/* Fav button — white circle, absolute right */
.fav-btn {
  position: absolute;
  right: 18px;
  top: 29px;
  width: 32px;
  height: 32px;
  background: #FFFFFF;
  border-radius: 999px;
  box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.05);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  cursor: pointer;
}

.fav-btn.active {
  color: #FFD500;
}

/* Centered name + id block */
.hero-mobile__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 0 18px 20px;
}

.hero-mobile__name-row {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
}

.hero-mobile__name {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 28px;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  text-align: center;
}

.person-icon {
  flex-shrink: 0;
  margin-bottom: 2px;
}

.hero-mobile__id {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}


/* ── Desktop ── */
.hero-desktop {
  display: none;
}

@media (min-width: 768px) {
  .hero-mobile {
    display: none;
  }

  .hero-desktop {
    display: block;
    background: var(--gradient);
    padding: 24px 28px 28px;
    color: #fff;
  }

  .hero-desktop__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .hero-desktop__name {
    font-size: 24px;
    font-weight: 800;
    text-align: right;
  }

  .hero-desktop__id {
    font-size: 13px;
    opacity: .7;
    margin-top: 3px;
    text-align: right;
  }

  .hero-desktop__contacts {
    display: flex;
    gap: 12px;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  .contact-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, .15);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 13px;
    font-weight: 500;
  }

  .fav-btn--desktop {
    position: static;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, .15);
    border-radius: 50%;
    box-shadow: none;
    color: #fff;
  }

  .fav-btn--desktop.active {
    background: #f59e0b;
    color: var(--blue-dark);
  }

  .hero-desktop__stats {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .stat-pill {
    background: rgba(255, 255, 255, .12);
    border-radius: var(--radius-md);
    padding: 8px 16px;
    min-width: 110px;
    text-align: right;
  }

  .stat-pill__label {
    font-size: 10px;
    opacity: .7;
    text-transform: uppercase;
    letter-spacing: .05em;
  }

  .stat-pill__value {
    font-size: 18px;
    font-weight: 700;
    margin-top: 2px;
  }

  .stat-pill__sub {
    font-size: 11px;
    opacity: .6;
  }

  .related-wrap {
    background: rgba(255, 255, 255, .08);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .related-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    color: #fff;
  }

  .related-table th {
    padding: 6px 14px;
    text-align: right;
    opacity: .6;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: .05em;
    background: rgba(0, 0, 0, .1);
  }

  .related-table td {
    padding: 9px 14px;
    border-top: 1px solid rgba(255, 255, 255, .08);
    text-align: right;
  }

  .rp-badge {
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
  }

  .rp-badge--active {
    background: #dcfce7;
    color: #15803d;
  }

  .rp-badge--closed {
    background: rgba(255, 255, 255, .15);
    color: rgba(255, 255, 255, .85);
  }
}</style>

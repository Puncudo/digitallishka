<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
import AppIcon from '@/components/ui/AppIcon.vue'
import mockData from '@/data/mock.json'

const router = useRouter()
const store = useAppStore()
const query = ref('')

const genderMap = Object.fromEntries(mockData.candidates.map(c => [c.id, c.gender]))
const recentSearches = mockData.searchResults.recent.map(r => ({ ...r, gender: genderMap[r.id] || 'M' }))
const allCandidates = mockData.searchResults.candidates.map(c => ({ ...c, gender: genderMap[c.id] || 'M' }))

const filteredResults = computed(() => {
  const q = query.value.trim()
  if (!q) return recentSearches
  return allCandidates.filter(c =>
    c.name.includes(q) || c.id.includes(q)
  )
})

const isFiltered = computed(() => query.value.trim().length > 0)

function goToCandidate(id) {
  router.push(`/candidates/${id}`)
}

function clearSearch() {
  query.value = ''
}
</script>

<template>
  <div class="search-page">
    <!-- Search bar -->
    <div class="search-bar-wrapper">
      <div class="search-bar">
        <div class="search-input-group">
          <input
            v-model="query"
            type="text"
            class="search-input"
            placeholder="חיפוש..."
            dir="rtl"
          />
          <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#777777" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.5 17.5L13.875 13.875" stroke="#777777" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <button v-if="query" class="clear-btn" @click="clearSearch">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="9" fill="#E4E4E4"/>
            <path d="M6 6L12 12M12 6L6 12" stroke="#333" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Results area -->
    <div class="search-results">
      <!-- Recent searches section -->
      <div v-if="!isFiltered" class="section">
        <div class="section-header">
          <svg class="history-icon" width="18" height="15" viewBox="0 0 18 15" fill="none">
            <path d="M10.5 1C6.36 1 3 4.36 3 8.5H1L3.89 11.39L3.94 11.49L6.93 8.5H4.93C4.93 5.41 7.41 2.93 10.5 2.93C13.59 2.93 16.07 5.41 16.07 8.5C16.07 11.59 13.59 14.07 10.5 14.07C8.96 14.07 7.56 13.43 6.55 12.41L5.19 13.77C6.5 15.09 8.39 15.93 10.5 15.93C14.64 15.93 18 12.64 18 8.5C18 4.36 14.64 1 10.5 1Z" fill="#999999" transform="translate(0,-1)"/>
          </svg>
          <span class="section-title">חיפושים אחרונים</span>
        </div>
        <div class="results-list">
          <div
            v-for="item in recentSearches"
            :key="item.id"
            class="result-item"
            @click="goToCandidate(item.id)"
          >
            <div class="result-info">
              <span class="icon-wrap">
                <AppIcon :name="item.gender === 'F' ? 'female' : 'male'" :size="14" class="person-icon" />
                <svg v-if="store.isFavorite(item.id)" class="fav-badge" width="14" height="14" viewBox="0 0 24 24" fill="#FFD16A">
                  <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z" clip-rule="evenodd"/>
                </svg>
              </span>
              <span class="result-name">{{ item.name }}</span>
            </div>
            <span class="result-id">{{ item.id }}</span>
          </div>
        </div>
      </div>

      <!-- Autocomplete / filtered section -->
      <div v-if="isFiltered" class="section">
        <div class="section-header">
          <svg class="chevron-icon" width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M6 2L2 6L6 10" stroke="#777" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="section-title filtered">תוצאות חיפוש</span>
        </div>
        <div v-if="filteredResults.length" class="results-list">
          <div
            v-for="item in filteredResults"
            :key="item.id"
            class="result-item"
            @click="goToCandidate(item.id)"
          >
            <div class="result-info">
              <span class="icon-wrap">
                <AppIcon :name="item.gender === 'F' ? 'female' : 'male'" :size="14" class="person-icon" />
                <svg v-if="store.isFavorite(item.id)" class="fav-badge" width="14" height="14" viewBox="0 0 24 24" fill="#FFD16A">
                  <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z" clip-rule="evenodd"/>
                </svg>
              </span>
              <span class="result-name" :class="{ bold: item.bold }">{{ item.name }}</span>
            </div>
            <span class="result-id">{{ item.id }}</span>
          </div>
        </div>
        <div v-else class="no-results">
          <span>לא נמצאו תוצאות</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #FFFFFF;
}

/* Search bar */
.search-bar-wrapper {
  padding: 10px 10px 0;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  background: #F7F7F7;
  border-radius: 42px;
  padding: 0 20px 0 16px;
}

.search-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.02em;
  color: #2F305C;
  outline: none;
}

.search-input::placeholder {
  color: #777777;
}

.search-icon {
  flex-shrink: 0;
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
}

/* Results area */
.search-results {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

/* Section */
.section-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  padding: 10px 30px;
}

.section-title {
  flex: 1;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  text-align: right;
  color: #999999;
}

.section-title.filtered {
  color: #777777;
}

.history-icon,
.chevron-icon {
  flex-shrink: 0;
}

/* Result items */
.results-list {
  padding: 0 30px;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 20px 0;
  border-bottom: 1px solid #F7F7F7;
  cursor: pointer;
  transition: background 0.15s;
}

.result-item:hover {
  background: #FAFAFA;
  margin: 0 -30px;
  padding: 20px 30px;
}

.result-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-wrap {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.person-icon {
  flex-shrink: 0;
  color: #2F305C;
}

.fav-badge {
  position: absolute;
  bottom: -4px;
  left: -6px;
}

.result-name {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  text-align: right;
  color: #2F305C;
}

.result-name.bold {
  font-weight: 600;
}

.result-id {
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
  text-align: left;
  letter-spacing: -0.02em;
  color: #2F305C;
}

/* No results */
.no-results {
  display: flex;
  justify-content: center;
  padding: 40px;
  font-family: 'Noto Sans Hebrew', sans-serif;
  font-size: 16px;
  color: #999;
}
</style>

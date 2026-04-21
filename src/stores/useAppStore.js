import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const favorites   = ref(new Set(['031697151', '029834521', '029876543']))
  const trackIndex  = ref(1)
  const activeTab   = ref('tasks')
  const currentPage = ref(1)
  const pageSize    = ref(7)

  function isFavorite(id)    { return favorites.value.has(id) }
  function toggleFavorite(id) {
    if (favorites.value.has(id)) {
      favorites.value.delete(id)
    } else {
      favorites.value.add(id)
    }
    favorites.value = new Set(favorites.value) // trigger reactivity
  }
  function setTrackIndex(i)  { trackIndex.value = i }
  function setActiveTab(tab) { activeTab.value = tab; currentPage.value = 1 }
  function setPage(p)        { currentPage.value = p }

  return { favorites, trackIndex, activeTab, currentPage, pageSize,
           isFavorite, toggleFavorite, setTrackIndex, setActiveTab, setPage }
})

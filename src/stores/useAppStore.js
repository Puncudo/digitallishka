import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const favorited   = ref(true)
  const trackIndex  = ref(1)
  const activeTab   = ref('tasks')
  const currentPage = ref(1)
  const pageSize    = ref(7)

  function toggleFavorite()  { favorited.value = !favorited.value }
  function setTrackIndex(i)  { trackIndex.value = i }
  function setActiveTab(tab) { activeTab.value = tab; currentPage.value = 1 }
  function setPage(p)        { currentPage.value = p }

  return { favorited, trackIndex, activeTab, currentPage, pageSize,
           toggleFavorite, setTrackIndex, setActiveTab, setPage }
})

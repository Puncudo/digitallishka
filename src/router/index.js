import { createRouter, createWebHistory } from 'vue-router'
import ProfileView     from '@/views/ProfileView.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'
import SearchView      from '@/views/SearchView.vue'
import FavoritesView   from '@/views/FavoritesView.vue'

const routes = [
  { path: '/',                    redirect: '/candidates/031697151' },
  { path: '/candidates/:id',      component: ProfileView },
  { path: '/search',              component: SearchView },
  { path: '/favorites',           component: FavoritesView },
  { path: '/dashboard',           component: PlaceholderView, meta: { title: 'דשבורד' } },
  { path: '/reports',             component: PlaceholderView, meta: { title: 'דיווחים' } },
  { path: '/issue',               component: PlaceholderView, meta: { title: 'דווח על בעיה' } },
  { path: '/settings',            component: PlaceholderView, meta: { title: 'הגדרות' } },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

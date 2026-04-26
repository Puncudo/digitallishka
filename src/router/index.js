import { createRouter, createWebHistory } from 'vue-router'
import ProfileView     from '@/views/ProfileView.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'
import SearchView      from '@/views/SearchView.vue'
import FavoritesView   from '@/views/FavoritesView.vue'
import HomeView        from '@/views/HomeView.vue'
import IntroView       from '@/views/IntroView.vue'

const routes = [
  {
    path: '/',
    redirect: () => {
      const seen = localStorage.getItem('intro_seen')
      if (seen && Date.now() - Number(seen) < 24 * 60 * 60 * 1000) {
        return '/home'
      }
      return '/intro'
    }
  },
  { path: '/intro',               component: IntroView },
  { path: '/home',                component: HomeView },
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
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

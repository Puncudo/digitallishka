import { createRouter, createWebHistory } from 'vue-router'
import ProfileView     from '@/views/ProfileView.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'

const routes = [
  { path: '/',                    redirect: '/candidates/031697151' },
  { path: '/candidates/:id',      component: ProfileView },
  { path: '/dashboard',           component: PlaceholderView, meta: { title: 'דשבורד' } },
  { path: '/reports',             component: PlaceholderView, meta: { title: 'דיווחים' } },
  { path: '/issue',               component: PlaceholderView, meta: { title: 'דווח על בעיה' } },
  { path: '/settings',            component: PlaceholderView, meta: { title: 'הגדרות' } },
]

export default createRouter({
  history: createWebHistory(),
  routes
})

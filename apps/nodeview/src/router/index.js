import { createRouter, createWebHistory } from 'vue-router'

// Reuse graph components from main app
import GlobalGraph from '../components/GlobalGraph.vue'
import ChapterGraph from '../components/ChapterGraph.vue'

const routes = [
  { path: '/', name: 'Global', component: GlobalGraph, meta: { title: 'Global Graph' } },
  { path: '/chapter/:id', name: 'Chapter', component: ChapterGraph, props: true, meta: { title: 'Chapter Graph' } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = to.meta?.title ? `${to.meta.title} - Node View` : 'Node View'
  next()
})

export default router

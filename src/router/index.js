import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: 'Dashboard' }
  },
  {
    path: '/dashboard',
    redirect: '/',
  },
  {
    path: '/scenes',
    name: 'SceneList',
    component: () => import('../views/SceneListView.vue'),
    meta: { title: 'Scenes' }
  },
  {
    path: '/scene/new',
    name: 'NewScene',
    component: () => import('../views/SceneEditorView.vue'),
    meta: { title: 'New Scene' }
  },
  {
    path: '/scene/:id',
    name: 'EditScene',
    component: () => import('../views/SceneEditorView.vue'),
    props: true,
    meta: { title: 'Edit Scene' }
  },
  {
    path: '/chapters',
    name: 'ChapterList',
    component: () => import('../views/ChapterListView.vue'),
    meta: { title: 'Chapters' }
  },
  {
    path: '/chapter/new',
    name: 'NewChapter',
    component: () => import('../views/ChapterEditorView.vue'),
    meta: { title: 'New Chapter' }
  },
  {
    path: '/chapter/:id',
    name: 'EditChapter',
    component: () => import('../views/ChapterEditorView.vue'),
    props: true,
    meta: { title: 'Edit Chapter' }
  },
  {
    path: '/code',
    name: 'Code',
    component: () => import('../views/CodeView.vue'),
    meta: { title: 'Generated C Code' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { title: 'Settings' }
  },
  {
    path: '/nodes',
    name: 'NodeView',
    component: () => import('../views/NodeView.vue'),
    meta: { title: 'Node View' }
  },
  {
    path: '/test/base-button',
    name: 'BaseButtonTest',
    component: () => import('../views/BaseButtonTestView.vue'),
    meta: { title: 'Button Test' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Page Not Found' }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Smooth scroll behavior
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Update document title on route change
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Loke Cards` : 'Loke Cards';
  next();
});

export default router;

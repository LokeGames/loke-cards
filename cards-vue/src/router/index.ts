import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
// Project scoping guard
// @ts-ignore JS modules
import { getScene as getLocalScene, getChapter as getLocalChapter } from '../lib/storage.js';
import type { RouteName } from './typed';
// Eager-load primary views to avoid async import race conditions
import DashboardView from '../views/DashboardView.vue';
import SceneListView from '../views/SceneListView.vue';
import SceneEditorView from '../views/SceneEditorView.vue';
import ChapterListView from '../views/ChapterListView.vue';
import ChapterEditorView from '../views/ChapterEditorView.vue';
import CodeView from '../views/CodeView.vue';
import SettingsView from '../views/SettingsView.vue';
import BookTocView from '../views/BookTocView.vue';
import BaseButtonTestView from '../views/BaseButtonTestView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard' as RouteName,
    component: DashboardView,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/toc',
    name: 'StoryMap' as RouteName,
    component: BookTocView,
    meta: { title: 'Story Map' }
  },
  {
    path: '/dashboard',
    redirect: '/',
  },
  {
    path: '/scenes',
    name: 'SceneList' as RouteName,
    component: SceneListView,
    meta: { title: 'Scenes' }
  },
  {
    path: '/scene/new',
    name: 'NewScene' as RouteName,
    component: SceneEditorView,
    meta: { title: 'New Scene' }
  },
  {
    path: '/scene/:id',
    name: 'EditScene' as RouteName,
    component: SceneEditorView,
    props: true,
    meta: { title: 'Edit Scene' }
  },
  {
    path: '/chapters',
    name: 'ChapterList' as RouteName,
    component: ChapterListView,
    meta: { title: 'Chapters' }
  },
  {
    path: '/chapter/new',
    name: 'NewChapter' as RouteName,
    component: ChapterEditorView,
    meta: { title: 'New Chapter' }
  },
  {
    path: '/chapter/:id',
    name: 'EditChapter' as RouteName,
    component: ChapterEditorView,
    props: true,
    meta: { title: 'Edit Chapter' }
  },
  {
    path: '/code',
    name: 'Code' as RouteName,
    component: CodeView,
    meta: { title: 'Generated C Code' }
  },
  {
    path: '/settings',
    name: 'Settings' as RouteName,
    component: SettingsView,
    meta: { title: 'Settings' }
  },
  {
    // Node View moved to external app (apps/nodeview)
    path: '/nodes',
    redirect: '/',
  },
  {
    path: '/test/base-button',
    name: 'BaseButtonTest' as any,
    component: BaseButtonTestView,
    meta: { title: 'Button Test' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound' as RouteName,
    component: NotFoundView,
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
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Loke Cards` : 'Loke Cards';
  // Guard: prevent editing items from a different project
  try {
    let pid = 'default';
    try { const v = localStorage.getItem('LC_PROJECT_ID'); if (v) pid = v } catch {}
    if (to.name === 'EditScene' && to.params?.id) {
      const id = String(to.params.id);
      const sc = await getLocalScene(id);
      if (sc && (sc.projectId || 'default') !== pid) {
        return next({ name: 'SceneList' as any });
      }
    }
    if (to.name === 'EditChapter' && to.params?.id) {
      const id = String(to.params.id);
      const ch = await getLocalChapter(id);
      if (ch && (ch.projectId || 'default') !== pid) {
        return next({ name: 'ChapterList' as any });
      }
    }
  } catch {}
  next();
});

// Surface async component load errors to console to avoid silent stale view
router.onError((err) => {
  // eslint-disable-next-line no-console
  console.error('Router error:', err);
});

export default router;

<template>
  <div class="p-6 space-y-6 max-w-6xl mx-auto">
    <div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Overview of your Loke Cards project.</p>
    </div>

    <!-- Quick Actions -->
    <DashboardQuickActions />

    <!-- Quick Stats -->
    <DashboardStats :stats="stats" />

    <!-- Recent Chapters -->
    <DashboardRecentChapters :chapters="recentChapters" :loading="chaptersLoading" :error="chaptersError" />

    <!-- Recent Scenes -->
    <DashboardRecentScenes :scenes="recentScenes" :loading="scenesLoading" :error="scenesError" />
  </div>
  
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import api from '../api/client.js';
import { getAllChapters as getAllChaptersLocal, getAllScenes as getAllScenesLocal } from '@shared/lib/storage.js';
import { normalizeScenes } from '../lib/normalize.js';
import { useProjectStore } from '../stores/project.js';
import { onDataChange, onProjectChange } from '../lib/events.js';
import DashboardQuickActions from '../components/dashboard/DashboardQuickActions.vue'
import DashboardStats from '../components/dashboard/DashboardStats.vue'
import DashboardRecentChapters from '../components/dashboard/DashboardRecentChapters.vue'
import DashboardRecentScenes from '../components/dashboard/DashboardRecentScenes.vue'
import { toEditScene, toNewSceneWithChapter } from '../router/guards.js'

const chapters = ref([]);
const chaptersLoading = ref(true);
const chaptersError = ref('');
const scenes = ref([]);
const scenesLoading = ref(true);
const scenesError = ref('');
const stats = ref({ chapters: 0, scenes: 0 });
const project = useProjectStore();
if (!project.currentProject) project.init();

function scopeChapters(arr) {
  const pid = project.currentProject?.id || 'default';
  return (arr || []).filter(c => (c.projectId || 'default') === pid);
}
function scopeScenes(arr) {
  const pid = project.currentProject?.id || 'default';
  return (arr || []).filter(s => (s.projectId || 'default') === pid);
}

const recentChapters = computed(() => chapters.value.slice(0, 5));
const recentScenes = computed(() => {
  const arr = Array.isArray(scenes.value) ? scenes.value.slice() : [];
  arr.sort((a, b) => Number(b.updatedAt ?? b.createdAt ?? 0) - Number(a.updatedAt ?? a.createdAt ?? 0));
  return arr.slice(0, 5);
});
// validation moved inside DashboardRecentScenes

async function refreshFromLocal() {
  try { chapters.value = scopeChapters(await getAllChaptersLocal()); } catch {}
  try { scenes.value = scopeScenes(normalizeScenes(await getAllScenesLocal())); } catch {}
  stats.value = { chapters: chapters.value.length, scenes: scenes.value.length };
}

onMounted(async () => {
  // Offline-first: load local first
  await refreshFromLocal();
  // Then try server in background
  try { const data = await api.chapters.getAll(); if (Array.isArray(data) && data.length > 0) chapters.value = scopeChapters(data); }
  catch (e) { /* keep local */ }
  finally { chaptersLoading.value = false; }

  try { const s = await api.scenes.getAll(); if (Array.isArray(s) && s.length > 0) scenes.value = scopeScenes(s); }
  catch (e) { /* keep local */ }
  finally { scenesLoading.value = false; }

  stats.value = { chapters: chapters.value.length, scenes: scenes.value.length };

  // Live updates: subscribe to local data change events and refresh
  const off = onDataChange(async (detail) => {
    // Only refresh when current project matches or when projectId unknown
    const pid = project.currentProject?.id || 'default';
    if (!detail || !detail.projectId || detail.projectId === pid) {
      await refreshFromLocal();
    }
  });
  const offProject = onProjectChange(async () => {
    await refreshFromLocal();
  });
  onBeforeUnmount(() => { try { off && off(); offProject && offProject(); } catch {} });
});
</script>

<style scoped>
/* Scoped styles for DashboardView */
</style>

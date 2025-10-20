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
import { ref, computed, onMounted } from 'vue';
import api from '../api/client.js';
import { getAllChapters as getAllChaptersLocal, getAllScenes as getAllScenesLocal } from '../lib/storage.js';
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

const recentChapters = computed(() => chapters.value.slice(0, 5));
const recentScenes = computed(() => {
  const arr = Array.isArray(scenes.value) ? scenes.value.slice() : [];
  arr.sort((a, b) => Number(b.updatedAt ?? b.createdAt ?? 0) - Number(a.updatedAt ?? a.createdAt ?? 0));
  return arr.slice(0, 5);
});
// validation moved inside DashboardRecentScenes

onMounted(async () => {
  try {
    const data = await api.chapters.getAll();
    chapters.value = Array.isArray(data) ? data : [];
  } catch (e) {
    try {
      chapters.value = await getAllChaptersLocal();
    } catch (e2) {
      chaptersError.value = `Failed to load chapters: ${e.message}`;
    }
  } finally {
    chaptersLoading.value = false;
  }
  // scenes for stats
  try {
    const s = await api.scenes.getAll();
    scenes.value = Array.isArray(s) ? s : [];
  } catch (e) {
    try { scenes.value = await getAllScenesLocal(); }
    catch { scenesError.value = `Failed to load scenes: ${e.message}`; }
  } finally {
    scenesLoading.value = false;
  }
  stats.value = { chapters: chapters.value.length, scenes: scenes.value.length };
});
</script>

<style scoped>
/* Scoped styles for DashboardView */
</style>

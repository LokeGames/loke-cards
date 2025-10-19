<template>
  <div class="p-6 space-y-6 max-w-6xl mx-auto">
    <div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Overview of your Loke Cards project.</p>
    </div>

    <!-- Quick Actions -->
    <section aria-labelledby="qa-heading" class="">
      <h2 id="qa-heading" class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <RouterLink
          to="/scene/new"
          class="group flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span class="text-sm font-medium text-gray-800 dark:text-gray-200">New Scene</span>
        </RouterLink>

        <RouterLink
          to="/chapter/new"
          class="group flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span class="text-sm font-medium text-gray-800 dark:text-gray-200">New Chapter</span>
        </RouterLink>
      </div>
    </section>

    <!-- Recent Chapters -->
    <section aria-labelledby="chapters-heading">
      <div class="flex items-center justify-between mb-2">
        <h2 id="chapters-heading" class="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Chapters</h2>
        <RouterLink to="/chapters" class="text-xs text-blue-600 hover:underline">View all</RouterLink>
      </div>
      <div class="rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div v-if="chaptersLoading" class="p-3 text-sm text-gray-600 dark:text-gray-400">Loading…</div>
        <div v-else-if="chaptersError" class="p-3 text-sm text-red-700 dark:text-red-400">{{ chaptersError }}</div>
        <ul v-else class="divide-y divide-gray-200 dark:divide-gray-800">
          <li v-for="ch in recentChapters" :key="ch.id" class="p-3 flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-800 dark:text-gray-100">{{ ch.name || ch.id }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-500">ID: {{ ch.id }}</div>
            </div>
            <RouterLink :to="{ name: 'NewScene', query: { chapter: ch.id } }" class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">New Scene</RouterLink>
          </li>
          <li v-if="recentChapters.length === 0" class="p-3 text-sm text-gray-600 dark:text-gray-400">No chapters yet.</li>
        </ul>
      </div>
    </section>
  </div>
  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../api/client.js';
import { getAllChapters as getAllChaptersLocal } from '../lib/storage.js';

const chapters = ref([]);
const chaptersLoading = ref(true);
const chaptersError = ref('');

const recentChapters = computed(() => chapters.value.slice(0, 5));

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
});
</script>

<style scoped>
/* Scoped styles for DashboardView */
</style>

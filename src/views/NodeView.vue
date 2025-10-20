<template>
  <div class="p-6 max-w-6xl mx-auto space-y-4">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Node View</h1>
    <p class="text-gray-600 dark:text-gray-400">
      Visual scene graph (Twine-style) for chapters and scenes.
    </p>

    <div class="p-4 rounded border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
      This is a placeholder. For the full graph implementation, see <code>doc/cards-vue-flow.md</code>.
      Network installs are disabled here, so we have not added <code>@vue-flow/core</code>. If you want, I can wire a stub graph or integrate Vue Flow once dependencies are available.
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3">
        <h3 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Chapters</h3>
        <ul class="list-disc ml-5 text-sm text-gray-700 dark:text-gray-300">
          <li v-for="ch in chapters" :key="ch.id">{{ ch.name || ch.id }}</li>
        </ul>
      </div>
      <div class="rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3">
        <h3 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Scenes</h3>
        <ul class="list-disc ml-5 text-sm text-gray-700 dark:text-gray-300">
          <li v-for="sc in scenes" :key="sc.sceneId || sc.id">{{ sc.sceneId || sc.id }} <span class="text-gray-500">({{ sc.chapter || sc.chapterId || '—' }})</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/client.js';
import { getAllChapters as getAllChaptersLocal, getAllScenes as getAllScenesLocal } from '../lib/storage.js';

const chapters = ref([]);
const scenes = ref([]);

onMounted(async () => {
  try { chapters.value = await api.chapters.getAll(); } catch { try { chapters.value = await getAllChaptersLocal(); } catch {} }
  try { scenes.value = await api.scenes.getAll(); } catch { try { scenes.value = await getAllScenesLocal(); } catch {} }
});
</script>

<style scoped>
</style>


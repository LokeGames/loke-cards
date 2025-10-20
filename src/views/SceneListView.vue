<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Scenes</h1>
      <RouterLink to="/scene/new" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
        New Scene
      </RouterLink>
    </div>

    <p class="text-gray-600 dark:text-gray-400 mb-4">Browse and manage all scenes in your project.</p>

    <div v-if="error" class="p-3 rounded border border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
      {{ error }}
    </div>

    <div v-else>
      <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Total: {{ scenes.length }}
      </div>

      <div v-if="loading" class="text-gray-600 dark:text-gray-400">Loading scenes…</div>

      <ul v-else class="divide-y divide-gray-200 dark:divide-gray-800 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <li v-for="sc in scenes" :key="sc.sceneId || sc.id" class="p-3 flex items-center justify-between">
          <div>
            <div class="font-medium text-gray-800 dark:text-gray-100">{{ sc.sceneId || sc.id }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-500">Chapter: {{ sc.chapter || sc.chapterId || '—' }}</div>
          </div>
          <div class="flex items-center gap-2">
            <RouterLink :to="{ name: 'EditScene', params: { id: sc.sceneId || sc.id } }" class="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Edit</RouterLink>
            <button @click="deleteScene(sc.sceneId || sc.id)" class="text-sm px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white">Delete</button>
          </div>
        </li>
        <li v-if="scenes.length === 0" class="p-4 text-sm text-gray-600 dark:text-gray-400">No scenes yet. Create one to get started.</li>
      </ul>
    </div>
  </div>
  <AppModal :open="confirmOpen" title="Delete Scene" @close="confirmOpen=false; pendingDeleteId=''" @confirm="confirmDelete">
    Are you sure you want to delete <code class="font-mono">{{ pendingDeleteId }}</code>? This cannot be undone.
  </AppModal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/client.js';
import { getAllScenes as getAllScenesLocal } from '../lib/storage.js';
import AppModal from '../components/AppModal.vue';

const scenes = ref([]);
const loading = ref(true);
const error = ref('');
const confirmOpen = ref(false);
const pendingDeleteId = ref('');

onMounted(async () => {
  try {
    const data = await api.scenes.getAll();
    // API returns array of scene objects
    scenes.value = Array.isArray(data) ? data : [];
  } catch (e) {
    // Fallback to local storage when offline or backend unavailable
    try {
      scenes.value = await getAllScenesLocal();
    } catch (e2) {
      error.value = `Failed to load scenes: ${e.message}`;
    }
  } finally {
    loading.value = false;
  }
});

async function deleteScene(id) {
  if (!id) return;
  // Playwright tests expect a native confirm; support both confirm and modal flows
  try {
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      const ok = window.confirm(`Delete scene ${id}?`);
      if (ok) {
        await api.scenes.delete(id);
        const data = await api.scenes.getAll();
        scenes.value = Array.isArray(data) ? data : [];
        return;
      }
    }
  } catch {}
  // Fallback to accessible modal
  pendingDeleteId.value = id;
  confirmOpen.value = true;
}

async function confirmDelete() {
  if (!pendingDeleteId.value) return;
  try {
    await api.scenes.delete(pendingDeleteId.value);
    const data = await api.scenes.getAll();
    scenes.value = Array.isArray(data) ? data : [];
  } catch (e) {
    error.value = `Failed to delete scene: ${e.message}`;
  } finally {
    confirmOpen.value = false;
    pendingDeleteId.value = '';
  }
}
</script>

<style scoped>
</style>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-1">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Scenes</h1>
      <RouterLink to="/scene/new" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
        New Scene
      </RouterLink>
    </div>
    <p class="text-gray-600 dark:text-gray-400 mb-4">Browse and manage all scenes in project <span class="font-semibold">{{ projectName }}</span>.</p>

    <!-- Tools: Search + Sort -->
    <div class="mb-3 flex flex-col sm:flex-row gap-2 sm:items-center">
      <input
        v-model="search"
        type="text"
        placeholder="Search scenes…"
        class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      />
      <select v-model="sortKey" class="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <option value="updatedAt">Sort: Updated</option>
        <option value="createdAt">Sort: Created</option>
        <option value="name">Sort: Name</option>
      </select>
    </div>

    <div v-if="error" class="p-3 rounded border border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
      {{ error }}
    </div>

    <div v-else>
      <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Total: {{ filteredScenes.length }}
      </div>

      <div v-if="loading"><BaseSkeletonList :rows="6" /></div>

      <ul v-else class="divide-y divide-gray-200 dark:divide-gray-800 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <li v-for="sc in filteredScenes" :key="sc.sceneId" class="p-3 flex items-center justify-between">
          <div>
            <div class="font-medium text-gray-800 dark:text-gray-100">{{ sc.sceneId }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-500">Chapter: {{ sc.chapterId || '—' }}</div>
          </div>
          <div class="flex items-center gap-2">
            <RouterLink :to="toEditScene(sc.sceneId)" class="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Edit</RouterLink>
            <button @click="deleteScene(sc.sceneId)" class="text-sm px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white">Delete</button>
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
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import api from '../api/client.js';
import { getAllScenes as getAllScenesLocal } from '../lib/storage.js';
import AppModal from '../components/AppModal.vue';
import { useToastStore } from '../stores/toast.js';
import { toEditScene } from '../router/guards.js';
import { normalizeScenes } from '../lib/normalize.js';
import { useProjectStore } from '../stores/project.js';
import { useSceneStore } from '../stores/scenes.js';
import { onDataChange, onProjectChange } from '../lib/events.js';

const scenes = ref([]);
const search = ref('');
const sortKey = ref('updatedAt');
const loading = ref(true);
const error = ref('');
const confirmOpen = ref(false);
const pendingDeleteId = ref('');
const toast = useToastStore();

async function refreshFromLocal() {
  try {
    const local = await getAllScenesLocal();
    scenes.value = scopeByProject(normalizeScenes(local));
  } catch {}
}

onMounted(async () => {
  // Offline-first: load local immediately
  // Prefer store as single source of truth
  const store = useSceneStore();
  await store.init();
  scenes.value = store.scenes;
  // Then try server in the background
  try {
    const data = await api.scenes.getAll();
    if (Array.isArray(data) && data.length > 0) {
      await store.loadServer();
      scenes.value = store.scenes;
    }
  } catch (e) {
    // Keep local; optionally display a subtle error
  } finally {
    loading.value = false;
  }
  // Live updates from local changes
  const off = onDataChange(async (detail) => {
    const pid = project.currentProject?.id || 'default';
    if (!detail || !detail.projectId || detail.projectId === pid) {
      await store.refresh();
      scenes.value = store.scenes;
    }
  });
  const offProject = onProjectChange(async (detail) => {
    await store.init();
    scenes.value = store.scenes;
  });
  onBeforeUnmount(() => { try { off && off(); offProject && offProject(); } catch {} });
});

const filteredScenes = computed(() => {
  const q = search.value.trim().toLowerCase();
  const arr = (Array.isArray(scenes.value) ? scenes.value.slice() : []).filter((s) => s && s.sceneId);
  let out = arr;
  if (q) {
    out = out.filter((s) => {
      const name = String(s.sceneId || '').toLowerCase();
      const ch = String(s.chapterId || '').toLowerCase();
      return name.includes(q) || ch.includes(q);
    });
  }
  const key = sortKey.value;
  out.sort((a, b) => {
    if (key === 'name') {
      return String(a.sceneId || '').localeCompare(String(b.sceneId || ''));
    }
    const av = Number(a[key] ?? 0);
    const bv = Number(b[key] ?? 0);
    return bv - av;
  });
  return out;
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
        toast.success(`Deleted scene ${id}`);
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
    toast.error(`Failed to delete scene: ${e.message}`);
  } finally {
    confirmOpen.value = false;
    pendingDeleteId.value = '';
  }
}
// Project scoping helpers
const project = useProjectStore();
if (!project.currentProject) project.init();
const projectName = computed(() => project.currentProject?.name || project.currentProject?.id || 'default');

function scopeByProject(arr) {
  const pid = project.currentProject?.id || 'default';
  return (arr || []).filter(s => (s.projectId || 'default') === pid);
}

</script>

<style scoped>
</style>

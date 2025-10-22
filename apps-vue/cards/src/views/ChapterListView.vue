<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-1">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Chapters</h1>
      <RouterLink
        to="/chapter/new"
        class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
      >
        New Chapter
      </RouterLink>
    </div>
    <p class="text-gray-600 dark:text-gray-400 mb-4">Manage chapters in project <span class="font-semibold">{{ projectName }}</span>.</p>

    <div v-if="error" class="p-3 rounded border border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
      {{ error }}
    </div>

    <div v-else>
      <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Total: {{ chapters.length }}
      </div>

      <div v-if="loading"><BaseSkeletonList :rows="6" /></div>

      <ul v-else class="divide-y divide-gray-200 dark:divide-gray-800 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <li
          v-for="(ch, idx) in chapters"
          :key="ch.id"
          class="p-3 flex items-center justify-between"
          draggable="true"
          @dragstart="onDragStart(idx)"
          @dragover.prevent
          @drop="onDrop(idx)"
        >
          <div>
            <div class="font-medium text-gray-800 dark:text-gray-100">{{ ch.name || ch.id }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-500">ID: {{ ch.id }}</div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="moveUp(idx)" class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" title="Move up">↑</button>
            <button @click="moveDown(idx)" class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" title="Move down">↓</button>
            <RouterLink :to="toNewSceneWithChapter(ch.id)" class="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">New Scene</RouterLink>
            <RouterLink :to="toEditChapter(ch.id)" class="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Edit</RouterLink>
            <button @click="deleteChapter(ch.id)" class="text-sm px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white">Delete</button>
          </div>
        </li>
        <li v-if="chapters.length === 0" class="p-4 text-sm text-gray-600 dark:text-gray-400">No chapters yet. Create one to get started.</li>
      </ul>
    </div>
  </div>
  
  <AppModal :open="confirmOpen" title="Delete Chapter" @close="confirmOpen=false; pendingDeleteId=''" @confirm="confirmDelete">
    Are you sure you want to delete <code class="font-mono">{{ pendingDeleteId }}</code>? This cannot be undone.
  </AppModal>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import api from '../api/client.js';
import { getAllChapters as getAllChaptersLocal, saveChapter as saveChapterLocal } from '@shared/lib/storage.js';
import { useProjectStore } from '../stores/project.js';
import { useChapterStore } from '../stores/chapters.js';
import { storeToRefs } from 'pinia';
import { onDataChange, onProjectChange } from '../lib/events.js';
import AppModal from '../components/AppModal.vue';
import { useToastStore } from '../stores/toast.js';
import { toEditChapter, toNewSceneWithChapter } from '../router/guards.js';

const chapters = ref([]);
const loading = ref(true);
const error = ref('');
const confirmOpen = ref(false);
const pendingDeleteId = ref('');
let dragIndex = -1;
const toast = useToastStore();
const project = useProjectStore();
if (!project.currentProject) project.init();
const projectName = computed(() => project.currentProject?.name || project.currentProject?.id || 'default');

function scopeChapters(arr) {
  const pid = project.currentProject?.id || 'default';
  return (arr || []).filter(c => (c.projectId || 'default') === pid);
}

async function refreshFromLocal() {
  try { chapters.value = scopeChapters(await getAllChaptersLocal()); } catch {}
}

onMounted(async () => {
  // Offline-first: load local first
  const store = useChapterStore();
  await store.init();
  const { chapters: storeChapters } = storeToRefs(store);
  chapters.value = storeChapters.value;
  // Then try server
  try {
    const data = await api.chapters.getAll();
    if (Array.isArray(data) && data.length > 0) { await store.loadServer(); chapters.value = storeChapters.value; }
  } catch (e) {
    // keep local only
  } finally {
    loading.value = false;
  }
  // Live updates
  const off = onDataChange(async (detail) => {
    const pid = project.currentProject?.id || 'default';
    if (!detail || !detail.projectId || detail.projectId === pid) {
      await store.refresh();
      chapters.value = storeChapters.value;
    }
  });
  const offProject = onProjectChange(async () => {
    await store.init();
    chapters.value = store.chapters;
  });
  onBeforeUnmount(() => { try { off && off(); offProject && offProject(); } catch {} });
});

function normalizeOrder() {
  chapters.value = (chapters.value || []).map((c, i) => ({ ...c, order: typeof c.order === 'number' ? c.order : i + 1 }));
}

async function persistOrder() {
  for (const c of chapters.value) {
    const payload = { id: c.id, name: c.name, order: c.order, projectId: project.currentProject?.id || 'default' };
    try { await api.chapters.update(c.id, payload); }
    catch { try { await saveChapterLocal(payload); } catch {} }
  }
}

function onDragStart(index) {
  dragIndex = index;
}

async function onDrop(index) {
  if (dragIndex < 0 || dragIndex === index) return;
  const list = chapters.value.slice();
  const [moved] = list.splice(dragIndex, 1);
  list.splice(index, 0, moved);
  chapters.value = list.map((c, i) => ({ ...c, order: i + 1 }));
  dragIndex = -1;
  await persistOrder();
}

async function moveUp(index) {
  if (index <= 0) return;
  await onDrop(index - 1);
}

async function moveDown(index) {
  if (index >= chapters.value.length - 1) return;
  await onDrop(index + 1);
}

async function deleteChapter(id) {
  if (!id) return;
  // Support native confirm for tests; otherwise open modal
  try {
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      const ok = window.confirm(`Delete chapter ${id}?`);
      if (ok) {
        const store = useChapterStore();
        await store.remove(id);
        chapters.value = store.chapters;
        toast.success(`Deleted chapter ${id}`);
        return;
      }
    }
  } catch {}
  pendingDeleteId.value = id;
  confirmOpen.value = true;
}

async function confirmDelete() {
  if (!pendingDeleteId.value) return;
  try {
    const store = useChapterStore();
    await store.remove(pendingDeleteId.value);
    chapters.value = store.chapters;
  } catch (e) {
    error.value = `Failed to delete chapter: ${e.message}`;
    toast.error(`Failed to delete chapter: ${e.message}`);
  } finally {
    confirmOpen.value = false;
    pendingDeleteId.value = '';
  }
}
</script>

<style scoped>
</style>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Chapters</h1>
      <RouterLink
        to="/chapter/new"
        class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
      >
        New Chapter
      </RouterLink>
    </div>

    <p class="text-gray-600 dark:text-gray-400 mb-4">Manage chapters and their organization.</p>

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
import { ref, onMounted } from 'vue';
import api from '../api/client.js';
import { getAllChapters as getAllChaptersLocal, saveChapter as saveChapterLocal } from '../lib/storage.js';
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

onMounted(async () => {
  try {
    const data = await api.chapters.getAll();
    chapters.value = Array.isArray(data) ? data : [];
  } catch (e) {
    // Fallback to local storage when offline or backend unavailable
    try {
      chapters.value = await getAllChaptersLocal();
    } catch (e2) {
      error.value = `Failed to load chapters: ${e.message}`;
    }
  } finally {
    loading.value = false;
  }
});

function normalizeOrder() {
  chapters.value = (chapters.value || []).map((c, i) => ({ ...c, order: typeof c.order === 'number' ? c.order : i + 1 }));
}

async function persistOrder() {
  for (const c of chapters.value) {
    const payload = { id: c.id, name: c.name, order: c.order };
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
        await api.chapters.delete(id);
        const data = await api.chapters.getAll();
        chapters.value = Array.isArray(data) ? data : [];
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
    await api.chapters.delete(pendingDeleteId.value);
    const data = await api.chapters.getAll();
    chapters.value = Array.isArray(data) ? data : [];
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

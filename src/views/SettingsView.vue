<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Settings</h1>
      <p class="text-gray-600 dark:text-gray-400">Configure your Loke Cards application.</p>
    </div>

    <!-- Build Section -->
    <section class="p-4 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Build C Files</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Generate C source files for all scenes and write them to the backend's <code>server/output/</code> folder.</p>
      <div class="flex items-center gap-3 mb-3">
        <button @click="runBuild" :disabled="building" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium">
          {{ building ? 'Building…' : 'Build All Scenes' }}
        </button>
        <span v-if="buildStatus" :class="buildStatus.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="text-sm">{{ buildStatus.message }}</span>
      </div>

      <div class="mt-2">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Artifacts</h3>
        <div v-if="artifactsLoading" class="text-sm text-gray-600 dark:text-gray-400">Loading…</div>
        <ul v-else class="list-disc ml-5 text-sm text-gray-700 dark:text-gray-300">
          <li v-for="name in artifacts" :key="name"><code class="font-mono">{{ name }}</code></li>
          <li v-if="artifacts.length === 0" class="list-none text-gray-500 dark:text-gray-500">No files yet. Run Build to generate .c files.</li>
        </ul>
      </div>
    </section>

    <!-- Sync Section -->
    <section class="p-4 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Sync Local Data</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Push locally saved chapters and scenes (LocalForage) to the backend API.</p>
      <div class="flex items-center gap-3 mb-3">
        <button @click="runSync" :disabled="syncing" class="px-4 py-2 rounded bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium">
          {{ syncing ? 'Syncing…' : 'Sync to Server' }}
        </button>
        <span v-if="syncStatus" :class="syncStatus.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="text-sm">{{ syncStatus.message }}</span>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-500">Tip: Use this if you created data while the backend was offline.</p>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/client.js';
import { getAllChapters as getAllChaptersLocal, getAllScenes as getAllScenesLocal } from '../lib/storage.js';

const building = ref(false);
const buildStatus = ref(null);
const artifacts = ref([]);
const artifactsLoading = ref(true);
const syncing = ref(false);
const syncStatus = ref(null);

async function loadArtifacts() {
  artifactsLoading.value = true;
  try {
    const healthy = await api.healthCheck();
    if (!healthy) {
      artifacts.value = [];
      return;
    }
    const list = await api.build.artifacts();
    artifacts.value = Array.isArray(list) ? list : [];
  } catch (e) {
    // Avoid noisy errors when backend is offline; show empty state instead
    artifacts.value = [];
  } finally {
    artifactsLoading.value = false;
  }
}

async function runBuild() {
  building.value = true;
  buildStatus.value = null;
  try {
    const res = await api.build.run();
    const written = res && typeof res.written === 'number' ? res.written : 0;
    buildStatus.value = { type: 'success', message: `Build complete. Files written: ${written}` };
    await loadArtifacts();
  } catch (e) {
    buildStatus.value = { type: 'error', message: `Build failed: ${e.message}` };
  } finally {
    building.value = false;
  }
}

onMounted(loadArtifacts);

async function runSync() {
  syncing.value = true;
  syncStatus.value = null;
  try {
    // Pull local data
    const [localChapters, localScenes] = await Promise.all([
      getAllChaptersLocal(),
      getAllScenesLocal(),
    ]);
    let pushedChapters = 0;
    let pushedScenes = 0;
    // Push chapters
    for (const ch of localChapters) {
      if (ch && ch.id) {
        try {
          await api.chapters.create({ id: ch.id, name: ch.name || ch.id });
          pushedChapters++;
        } catch (e) {
          // ignore per-item errors, continue
        }
      }
    }
    // Push scenes
    for (const sc of localScenes) {
      const payload = {
        sceneId: sc.sceneId || sc.id,
        chapterId: sc.chapter || sc.chapterId,
        sceneText: sc.sceneText || '',
        choices: sc.choices || [],
        stateChanges: sc.stateChanges || [],
      };
      if (payload.sceneId && payload.chapterId) {
        try {
          await api.scenes.create(payload);
          pushedScenes++;
        } catch (e) {
          // ignore per-item errors, continue
        }
      }
    }
    syncStatus.value = { type: 'success', message: `Synced ${pushedChapters} chapters, ${pushedScenes} scenes.` };
  } catch (e) {
    syncStatus.value = { type: 'error', message: `Sync failed: ${e.message}` };
  } finally {
    syncing.value = false;
  }
}
</script>

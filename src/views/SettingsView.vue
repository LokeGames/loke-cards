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
        <button @click="importFromServer" :disabled="importing" class="px-4 py-2 rounded bg-gray-700 hover:bg-gray-800 disabled:bg-gray-500 text-white text-sm font-medium">
          {{ importing ? 'Importing…' : 'Import from Server → Local' }}
        </button>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-500">Tip: Use this if you created data while the backend was offline.</p>
    </section>

    <!-- Projects Management -->
    <section class="p-4 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Projects</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Manage projects. Only one project is active at a time.</p>

      <div class="mb-4 flex gap-2 items-end">
        <div class="flex-1">
          <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">New project name</label>
          <input v-model="newProjectName" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-sm" placeholder="My Project" />
        </div>
        <button @click="createProject" :disabled="!newProjectName.trim() || proj.loading" class="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">Create</button>
      </div>

      <div v-if="proj.loading" class="text-sm text-gray-600 dark:text-gray-400">Loading projects…</div>

      <ul v-else class="divide-y divide-gray-200 dark:divide-gray-800 rounded border border-gray-200 dark:border-gray-800">
        <li v-for="p in proj.projects" :key="p.id" class="p-3 flex items-center gap-2">
          <span class="text-xs px-2 py-0.5 rounded-full" :class="p.id===proj.currentProject?.id ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'">{{ p.id===proj.currentProject?.id ? 'Active' : 'Project' }}</span>
          <input v-model="renameMap[p.id]" :placeholder="p.name || p.id" class="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-sm" />
          <button @click="setActive(p.id)" :disabled="p.id===proj.currentProject?.id" class="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">Set Active</button>
          <button @click="renameProject(p.id)" class="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">Rename</button>
          <button @click="deleteProject(p.id)" :disabled="p.id==='default'" class="px-2 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-50">Delete</button>
        </li>
        <li v-if="proj.projects.length===0" class="p-3 text-sm text-gray-600 dark:text-gray-400">No projects yet.</li>
      </ul>
      <p class="mt-2 text-xs text-gray-500 dark:text-gray-500">Default project cannot be deleted.</p>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/client.js';
import { getAllChapters as getAllChaptersLocal, getAllScenes as getAllScenesLocal, saveChapter as saveChapterLocal, saveScene as saveSceneLocal } from '../lib/storage.js';
import { importFromServerToLocal } from '../lib/importer.js';
import { useProjectStore } from '../stores/project.js';
import { useToastStore } from '../stores/toast.js';

const building = ref(false);
const buildStatus = ref(null);
const artifacts = ref([]);
const artifactsLoading = ref(true);
const syncing = ref(false);
const importing = ref(false);
const syncStatus = ref(null);
const toast = useToastStore();
const proj = useProjectStore();
if (!proj.currentProject) proj.init();
const newProjectName = ref('');
const renameMap = ref({});

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
    toast.error(`Failed to load artifacts: ${e.message}`);
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
    toast.success(`Build complete — wrote ${written} files`);
  } catch (e) {
    buildStatus.value = { type: 'error', message: `Build failed: ${e.message}` };
    toast.error(`Build failed: ${e.message}`);
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
      const sceneId = sc.sceneId || sc.id;
      const chapterId = sc.chapterId || sc.chapter;
      const payload = {
        sceneId,
        chapterId,
        sceneText: sc.sceneText || '',
        choices: sc.choices || [],
        stateChanges: sc.stateChanges || [],
      };
      if (sceneId && chapterId) {
        try {
          await api.scenes.create(payload);
          pushedScenes++;
        } catch (e) {
          // ignore per-item errors, continue
        }
      }
    }
    syncStatus.value = { type: 'success', message: `Synced ${pushedChapters} chapters, ${pushedScenes} scenes.` };
    toast.success(`Synced ${pushedChapters} chapters, ${pushedScenes} scenes`);
  } catch (e) {
    syncStatus.value = { type: 'error', message: `Sync failed: ${e.message}` };
    toast.error(`Sync failed: ${e.message}`);
  } finally {
    syncing.value = false;
  }
}

async function importFromServer() {
  importing.value = true;
  try {
    const res = await importFromServerToLocal();
    // Stamp with current projectId
    const pid = project.currentProject?.id || 'default';
    const [chs, scs] = await Promise.all([getAllChaptersLocal(), getAllScenesLocal()]);
    for (const ch of chs) { if (ch && !ch.projectId) await saveChapterLocal({ ...ch, projectId: pid }); }
    for (const sc of scs) { if (sc && !sc.projectId) await saveSceneLocal({ ...sc, projectId: pid }); }
    toast.success(`Imported ${res.scenes} scenes and ${res.chapters} chapters into project ${pid}`);
  } catch (e) {
    toast.error(`Import failed: ${e.message}`);
  } finally {
    importing.value = false;
  }
}

async function createProject() {
  try {
    const p = await proj.createProject(newProjectName.value.trim());
    newProjectName.value = '';
    toast.success(`Created project ${p.name || p.id}`);
  } catch (e) {
    toast.error(`Create project failed: ${e.message}`);
  }
}

async function setActive(id) {
  await proj.selectProject(id);
  toast.info(`Active project: ${proj.currentProject?.name || id}`);
}

async function renameProject(id) {
  const name = renameMap.value[id];
  if (!name || !name.trim()) return;
  const ok = await proj.renameProject(id, name.trim());
  if (ok) toast.success('Renamed project');
}

async function deleteProject(id) {
  if (id === 'default') return;
  if (!confirm(`Delete project ${id}? This does not delete data yet.`)) return;
  const ok = await proj.deleteProject(id);
  if (ok) toast.success('Deleted project');
}
</script>

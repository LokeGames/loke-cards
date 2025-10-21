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
        <button @click="replaceLocalWithServer" :disabled="importing" class="px-4 py-2 rounded bg-orange-600 hover:bg-orange-700 disabled:bg-gray-500 text-white text-sm font-medium" title="Clear local for active project, then import from server">
          {{ importing ? 'Replacing…' : 'Replace Local (Project) with Server' }}
        </button>
        <button @click="pushLocalProject" :disabled="syncing" class="px-4 py-2 rounded bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white text-sm font-medium" title="Push only current project to server">
          {{ syncing ? 'Pushing…' : 'Push Local → Server (Project)' }}
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

    <!-- Database Backend -->
    <section class="p-4 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Database Backend</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Current: <span class="font-semibold">{{ dbBackendLabel }}</span>
        <span class="ml-2 text-xs" :class="sqljsAvailable ? 'text-emerald-600' : 'text-gray-500'">
          SQL.js available: {{ sqljsAvailable ? 'yes' : 'no' }}
        </span>
      </p>
      <div class="flex items-center gap-2">
        <button @click="switchToSqlJs" class="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">Use SQL.js (WASM)</button>
        <button @click="switchToLocal" class="px-3 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium">Use LocalForage</button>
        <button v-if="dbBackend==='sqljs'" @click="flushSqlJs" class="px-3 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium">Save WASM DB now</button>
        <button @click="migrateLocalToSqlJs" class="px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium" title="Copy LocalForage data into SQL.js and switch backend">Migrate LocalForage → SQL.js</button>
      </div>
      <p class="mt-2 text-xs text-gray-500 dark:text-gray-500">
        Note: SQL.js is in-memory unless OPFS persistence is configured. Place <code>sql-wasm.js</code>/<code>sql-wasm.wasm</code> under <code>/public/sqljs/</code>.
      </p>
      <div class="mt-3">
        <label class="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" :checked="dbInWorker" @change="toggleDbInWorker($event)" />
          Run DB in Web Worker (recommended)
        </label>
        <label v-if="dbBackend==='sqljs'" class="inline-flex items-center gap-2 text-sm ml-4">
          <input type="checkbox" :checked="sqljsAutosave" @change="toggleSqlJsAutosave($event)" />
          SQL.js Auto‑save to OPFS
        </label>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api/client.js';
import { getAllChapters as getAllChaptersLocal, getAllScenes as getAllScenesLocal, saveChapter as saveChapterLocal, saveScene as saveSceneLocal } from '../lib/storage.js';
import { importFromServerToLocal } from '../lib/importer.js';
import { useProjectStore } from '../stores/project.js';
import { getDbBackend, setDbBackend, getDbInWorker, setDbInWorker, getDb } from '../lib/db/index.js';
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
const dbBackend = ref(getDbBackend());
const dbBackendLabel = computed(() => dbBackend.value === 'sqljs' ? 'SQL.js (WASM)' : 'LocalForage (IndexedDB)');
const sqljsAvailable = computed(() => typeof window !== 'undefined' && !!(window.initSqlJs));
const dbInWorker = computed(() => getDbInWorker());
const sqljsAutosave = computed(() => (typeof localStorage !== 'undefined' && localStorage.getItem('LC_SQLJS_AUTOSAVE') === '1'));

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

async function replaceLocalWithServer() {
  if (!confirm('This will clear local chapters/scenes for the active project and import from server. Continue?')) return;
  importing.value = true;
  try {
    const pid = proj.currentProject?.id || 'default';
    const [chs, scs] = await Promise.all([getAllChaptersLocal(), getAllScenesLocal()]);
    // Clear local entries for this project
    for (const ch of chs) {
      if ((ch?.projectId || 'default') === pid) {
        try { await (await import('../lib/storage.js')).deleteChapter(ch.id); } catch {}
      }
    }
    for (const sc of scs) {
      if ((sc?.projectId || 'default') === pid) {
        try { await (await import('../lib/storage.js')).deleteScene(sc.id); } catch {}
      }
    }
    // Import fresh from server and stamp
    const res = await importFromServerToLocal();
    const [chs2, scs2] = await Promise.all([getAllChaptersLocal(), getAllScenesLocal()]);
    for (const ch of chs2) { if (ch && !ch.projectId) await saveChapterLocal({ ...ch, projectId: pid }); }
    for (const sc of scs2) { if (sc && !sc.projectId) await saveSceneLocal({ ...sc, projectId: pid }); }
    toast.success(`Replaced local data with server: ${res.scenes} scenes, ${res.chapters} chapters`);
  } catch (e) {
    toast.error(`Replace failed: ${e.message}`);
  } finally {
    importing.value = false;
  }
}

async function pushLocalProject() {
  syncing.value = true;
  try {
    const pid = proj.currentProject?.id || 'default';
    const [localChapters, localScenes] = await Promise.all([
      getAllChaptersLocal(),
      getAllScenesLocal(),
    ]);
    let pushedChapters = 0;
    let pushedScenes = 0;
    for (const ch of localChapters) {
      if (ch && (ch.projectId || 'default') === pid) {
        try { await api.chapters.create({ id: ch.id, name: ch.name || ch.id, projectId: pid }); pushedChapters++; } catch {}
      }
    }
    for (const sc of localScenes) {
      if (sc && (sc.projectId || 'default') === pid) {
        const sceneId = sc.sceneId || sc.id;
        const chapterId = sc.chapterId || sc.chapter;
        if (sceneId) {
          try {
            await api.scenes.create({ sceneId, chapterId, sceneText: sc.sceneText || '', choices: sc.choices || [], stateChanges: sc.stateChanges || [], projectId: pid });
            pushedScenes++;
          } catch {}
        }
      }
    }
    toast.success(`Pushed project '${pid}' → server: ${pushedChapters} chapters, ${pushedScenes} scenes`);
  } catch (e) {
    toast.error(`Push failed: ${e.message}`);
  } finally {
    syncing.value = false;
  }
}

async function switchToSqlJs() {
  try {
    setDbBackend('sqljs');
    toast.info('Switched backend to SQL.js. Reloading…');
    setTimeout(() => location.reload(), 300);
  } catch (e) {
    toast.error(`Switch failed: ${e.message}`);
  }
}

async function switchToLocal() {
  try {
    setDbBackend('local');
    toast.info('Switched backend to LocalForage. Reloading…');
    setTimeout(() => location.reload(), 300);
  } catch (e) {
    toast.error(`Switch failed: ${e.message}`);
  }
}

function toggleDbInWorker(e) {
  const v = !!e.target.checked
  setDbInWorker(v)
  toast.info(`DB in Worker: ${v ? 'enabled' : 'disabled'}. Reloading…`)
  setTimeout(() => location.reload(), 300)
}

async function flushSqlJs() {
  try {
    const db = await getDb()
    if (typeof db.flush === 'function') await db.flush()
    toast.success('WASM DB saved to OPFS (if available)')
  } catch (e) {
    toast.error(`Flush failed: ${e.message}`)
  }
}

function toggleSqlJsAutosave(e) {
  const v = !!e.target.checked
  try { localStorage.setItem('LC_SQLJS_AUTOSAVE', v ? '1' : '0') } catch {}
  toast.info(`SQL.js autosave: ${v ? 'enabled' : 'disabled'}. Reloading…`)
  setTimeout(() => location.reload(), 300)
}

async function migrateLocalToSqlJs() {
  try {
    if (!sqljsAvailable.value) { toast.error('SQL.js assets not available under /public/sqljs/'); return }
    const [chs, scs] = await Promise.all([getAllChaptersLocal(), getAllScenesLocal()])
    setDbBackend('sqljs')
    const db = await getDb()
    let c=0,s=0
    for (const ch of chs) { await db.chaptersPut(ch); c++ }
    for (const sc of scs) { const id = sc.sceneId || sc.id; if (id) { await db.scenesPut({ ...sc, id, sceneId: id }); s++ } }
    toast.success(`Migrated ${c} chapters, ${s} scenes to SQL.js. Reloading…`)
    setTimeout(() => location.reload(), 400)
  } catch (e) { toast.error(`Migration failed: ${e.message}`) }
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

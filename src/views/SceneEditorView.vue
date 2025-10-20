<template>
  <div class="scene-editor-view p-4 md:p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {{ isEditMode ? 'Edit Scene' : 'Create New Scene' }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Create and edit interactive fiction scenes for loke-engine
      </p>
    </div>

    <!-- Main Layout: 2 columns on desktop, stacked on mobile -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column: Form -->
      <div class="space-y-6">
        <!-- Scene ID -->
        <SceneIdInput
          v-model="sceneData.sceneId"
          :error="validation.errors.value.sceneId"
          @blur="validateField('sceneId')"
        />

        <!-- Chapter Select -->
        <ChapterSelect
          v-model="sceneData.chapterId"
          :chapters="availableChapters"
          :error="validation.errors.value.chapterId"
          @create-chapter="handleCreateChapter"
        />

        <!-- Scene Text -->
        <SceneTextEditor
          v-model="sceneData.sceneText"
          :error="validation.errors.value.sceneText"
        />

        <!-- Choices List -->
        <ChoicesList
          :choices="sceneData.choices"
          @update:choices="sceneData.choices = $event"
          :errors="validation.errors.value.choices"
          :allScenes="allScenes"
          :currentChapterId="sceneData.chapterId"
        />

        <!-- State Changes List -->
        <StateChangesList
          :stateChanges="sceneData.stateChanges"
          @update:stateChanges="sceneData.stateChanges = $event"
          :errors="validation.errors.value.stateChanges"
        />

        <!-- Meta (optional) -->
        <div>
          <label for="scene-meta" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta (optional)</label>
          <textarea id="scene-meta" v-model="sceneData.meta" rows="3" placeholder="Notes, communication, or meta info..."
            class="w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">Included as a comment block in generated C code.</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            @click="handleSave"
            :disabled="!validation.isValid.value || isSaving"
            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {{ isSaving ? 'Saving...' : 'Save Scene' }}
          </button>
          <button
            @click="handleCancel"
            class="flex-1 sm:flex-initial px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleReset"
            class="flex-1 sm:flex-initial px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
          >
            Reset
          </button>
        </div>

        <!-- Inline save status removed — using toasts globally -->
      </div>

      <!-- Right Column: Code Preview (desktop) / Collapsible (mobile) -->
      <div class="lg:sticky lg:top-6 lg:self-start">
        <!-- Code View Mode Switch -->
        <div class="flex items-center gap-2 mb-2">
          <button
            class="px-2 py-1 text-xs rounded"
            :class="codeViewMode==='local' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'"
            @click="codeViewMode='local'"
          >Local Code</button>
          <button
            class="px-2 py-1 text-xs rounded"
            :disabled="!serverCode"
            :class="codeViewMode==='server' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50'"
            @click="codeViewMode='server'"
            title="Generate on Server first"
          >Server Code</button>
        </div>

        <CodePreview
          :code="displayedCode"
          :collapsible="true"
        />

        <!-- Quick Actions -->
        <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Quick Tips
          </h3>
          <div class="flex items-center gap-2 mb-3">
            <button @click="fetchServerCode" class="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">Generate on Server</button>
          </div>
          <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Scene ID must start with "scene_" (e.g., scene_forest_entrance)</li>
            <li>• Choices are optional (0–10). None adds a default "Continue"</li>
            <li>• Use \n in scene text for newlines</li>
            <li>• State changes are optional but executed before text displays</li>
            <li>• Code is auto-generated as you type</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCodeGenerator } from '../composables/useCodeGenerator.js';
import { useSceneValidation } from '../composables/useSceneValidation.js';
import api from '../api/client.js';
import { getAllChapters as getAllChaptersLocal, getAllScenes as getAllScenesLocal, saveChapter as saveChapterLocal, saveScene as saveSceneLocal } from '../lib/storage.js';

// Components
import SceneIdInput from '../components/SceneIdInput.vue';
import ChapterSelect from '../components/ChapterSelect.vue';
import SceneTextEditor from '../components/SceneTextEditor.vue';
import ChoicesList from '../components/ChoicesList.vue';
import StateChangesList from '../components/StateChangesList.vue';
import CodePreview from '../components/CodePreview.vue';
import { useToastStore } from '../stores/toast.js';

const router = useRouter();
const route = useRoute();
const toast = useToastStore();

// Scene data
const sceneData = reactive({
  sceneId: '',
  chapterId: '',
  sceneText: '',
  choices: [
    { text: '', nextScene: '', enabled: true }
  ],
  stateChanges: [],
  meta: ''
});

// Available chapters (loaded from API or local storage)
const availableChapters = ref([]);

// Edit mode check
const isEditMode = computed(() => !!route.params.id);

// UI state
const isSaving = ref(false);
const saveStatus = ref(null);
const initialSnapshot = ref('');
const serverCodeStatus = ref(null);
const serverCode = ref('');
const codeViewMode = ref(localStorage.getItem('codeViewMode') || 'local'); // 'local' | 'server'
const allScenes = ref([]);
const isDirty = computed(() => {
  try {
    if (!initialSnapshot.value) return false;
    return JSON.stringify(sceneData) !== initialSnapshot.value;
  } catch {
    return false;
  }
});

// Composables
const codeGenerator = useCodeGenerator();
const validation = useSceneValidation(sceneData);

// Generated code (reactive)
const generatedCode = computed(() => {
  return codeGenerator.generateSceneCode(sceneData);
});

const displayedCode = computed(() => {
  if (codeViewMode.value === 'server' && serverCode.value) return serverCode.value;
  return generatedCode.value;
});

watch(codeViewMode, (val) => {
  try { localStorage.setItem('codeViewMode', val); } catch {}
});

// Enable realtime validation (fixes sticky error state until blur)
onMounted(() => {
  if (validation.enableRealtimeValidation) {
    validation.enableRealtimeValidation();
  }
});

// Validate individual field
function validateField(fieldName) {
  if (fieldName === 'sceneId') {
    validation.errors.value.sceneId = validation.validateSceneId(sceneData.sceneId);
  } else if (fieldName === 'chapterId') {
    validation.errors.value.chapterId = validation.validateChapterId(sceneData.chapterId);
  }
}

// Handle create new chapter
async function handleCreateChapter(chapterId) {
  try {
    // Persist chapter via API, then add to local list
    await api.chapters.create({ id: chapterId, name: chapterId });
    availableChapters.value.push({ id: chapterId, name: chapterId });
    saveStatus.value = { type: 'success', message: `Chapter "${chapterId}" created.` };
    toast.success(`Chapter "${chapterId}" created`);
    setTimeout(() => (saveStatus.value = null), 1200);
  } catch (err) {
    // Fallback: save locally when offline
    try {
      await saveChapterLocal({ id: chapterId, name: chapterId, scenes: [], order: Date.now() });
      availableChapters.value.push({ id: chapterId, name: chapterId });
      saveStatus.value = { type: 'success', message: `Chapter "${chapterId}" saved locally (offline).` };
      toast.info(`Chapter "${chapterId}" saved locally (offline)`);
      setTimeout(() => (saveStatus.value = null), 1600);
    } catch (e2) {
      console.error('Failed to create chapter:', err);
      saveStatus.value = { type: 'error', message: `Failed to create chapter: ${err.message}` };
      toast.error(`Failed to create chapter: ${err.message}`);
    }
  }
}

// Handle save
async function handleSave() {
  // Validate all fields
  const isValid = validation.validateAll();

  if (!isValid) {
    saveStatus.value = {
      type: 'error',
      message: 'Please fix validation errors before saving'
    };
    // Focus first invalid field
    try {
      if (validation.errors.value.sceneId) {
        document.getElementById('scene-id')?.focus();
      } else if (validation.errors.value.chapterId) {
        document.getElementById('chapter-select')?.focus();
      } else if (validation.errors.value.sceneText) {
        document.getElementById('scene-text')?.focus();
      }
    } catch {}
    return;
  }

  isSaving.value = true;
  saveStatus.value = null;

  try {
    // Save to API
    if (isEditMode.value) {
      await api.scenes.update(route.params.id, sceneData);
    } else {
      await api.scenes.create(sceneData);
    }

    saveStatus.value = {
      type: 'success',
      message: `Scene "${sceneData.sceneId}" saved successfully!`
    };
    toast.success(`Scene "${sceneData.sceneId}" saved`);

    // Clear status after 3 seconds, then redirect
    setTimeout(() => {
      saveStatus.value = null;
      router.push('/scenes');
    }, 2000);

  } catch (error) {
    // Offline/local fallback: persist scene to LocalForage
    try {
      const localScene = {
        id: sceneData.sceneId,
        sceneId: sceneData.sceneId,
        chapter: sceneData.chapterId,
        sceneText: sceneData.sceneText,
        choices: sceneData.choices,
        stateChanges: sceneData.stateChanges,
        generatedCode: generatedCode.value,
        synced: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await saveSceneLocal(localScene);
      saveStatus.value = {
        type: 'success',
        message: `Scene "${sceneData.sceneId}" saved locally (offline).`
      };
      toast.info(`Saved locally (offline): ${sceneData.sceneId}`);
      setTimeout(() => {
        saveStatus.value = null;
        router.push('/scenes');
      }, 1600);
    } catch (e2) {
      saveStatus.value = {
        type: 'error',
        message: `Failed to save scene: ${error.message}`
      };
    }
  } finally {
    isSaving.value = false;
  }
}

// Clear global error banner when user edits again
watch(
  () => ({
    sceneId: sceneData.sceneId,
    chapterId: sceneData.chapterId,
    sceneText: sceneData.sceneText,
    choices: sceneData.choices,
    stateChanges: sceneData.stateChanges,
  }),
  () => {
    if (saveStatus.value && saveStatus.value.type === 'error') {
      saveStatus.value = null;
    }
  },
  { deep: true }
);

// Handle cancel
function handleCancel() {
  if (isDirty.value) {
    const ok = window.confirm('Discard changes and leave?');
    if (!ok) return;
  }
  router.push('/scenes');
}

// Reset form to initial snapshot
function handleReset() {
  if (!initialSnapshot.value) return;
  const data = JSON.parse(initialSnapshot.value);
  Object.assign(sceneData, data);
}

// Load scene data if editing and chapters from API
onMounted(async () => {
  try {
    // Load chapters from API and merge with local (ensure locally-created items appear)
    const chaptersData = await api.chapters.getAll();
    const localChapters = await getAllChaptersLocal().catch(() => []);
    const byId = new Map();
    (Array.isArray(chaptersData) ? chaptersData : []).forEach(c => byId.set(c.id, c));
    (Array.isArray(localChapters) ? localChapters : []).forEach(c => {
      if (!byId.has(c.id)) byId.set(c.id, c);
    });
    availableChapters.value = Array.from(byId.values());
  } catch (error) {
    // Fallback to local storage when offline or backend unavailable
    try {
      availableChapters.value = await getAllChaptersLocal();
    } catch (e2) {
      console.error('Failed to load chapters:', error);
    }
  }

  // Load scenes for choices suggestions
  try {
    // Merge server and local scenes for suggestions
    const scenesData = await api.scenes.getAll();
    const localScenes = await getAllScenesLocal().catch(() => []);
    const normalize = (s) => ({ id: s.sceneId || s.id, chapterId: s.chapterId || s.chapter });
    const byId = new Map();
    (Array.isArray(scenesData) ? scenesData : []).forEach(s => byId.set(normalize(s).id, normalize(s)));
    (Array.isArray(localScenes) ? localScenes : []).forEach(s => {
      const n = normalize(s);
      if (!byId.has(n.id)) byId.set(n.id, n);
    });
    allScenes.value = Array.from(byId.values());
  } catch (e) {
    try {
      const localScenes = await getAllScenesLocal();
      allScenes.value = localScenes.map(s => ({ id: s.sceneId || s.id, chapterId: s.chapter || s.chapterId }));
    } catch {}
  }

  // Preselect chapter from query string if provided
  if (route.query.chapter) {
    sceneData.chapterId = String(route.query.chapter);
  }

  if (isEditMode.value) {
    try {
      const scene = await api.scenes.getById(route.params.id);
      Object.assign(sceneData, scene);
    } catch (error) {
      console.error('Failed to load scene:', error);
      saveStatus.value = {
        type: 'error',
        message: `Failed to load scene: ${error.message}`
      };
    }
  }
  // Capture initial snapshot after load/create
  try {
    initialSnapshot.value = JSON.stringify(sceneData);
  } catch {
    initialSnapshot.value = '';
  }
});

// Fetch server-generated code for current scene
async function fetchServerCode() {
  serverCodeStatus.value = null;
  try {
    if (!sceneData.sceneId) {
      serverCodeStatus.value = { type: 'error', message: 'Set Scene ID first' };
      return;
    }
    // Ensure the scene exists on backend before codegen
    try {
      if (isEditMode.value) {
        await api.scenes.update(route.params.id, sceneData);
      } else {
        await api.scenes.create(sceneData);
      }
    } catch (e) {
      // ignore; codegen might still work if scene already exists
    }
    const code = await api.codegen.sceneCode(sceneData.sceneId);
    if (code) {
      serverCode.value = code;
      codeViewMode.value = 'server';
      serverCodeStatus.value = { type: 'success', message: 'Server code generated' };
      toast.success('Server code generated');
    }
  } catch (e) {
    serverCodeStatus.value = { type: 'error', message: `Server codegen failed: ${e.message}` };
    toast.error(`Server codegen failed: ${e.message}`);
  }
}
</script>

<style scoped>
/* Ensure form elements are touch-friendly on mobile */
@media (max-width: 768px) {
  input, textarea, select, button {
    @apply touch-manipulation;
  }
}
</style>

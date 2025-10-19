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
        />

        <!-- State Changes List -->
        <StateChangesList
          :stateChanges="sceneData.stateChanges"
          @update:stateChanges="sceneData.stateChanges = $event"
          :errors="validation.errors.value.stateChanges"
        />

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
        </div>

        <!-- Save Status -->
        <div v-if="saveStatus" class="p-4 rounded-lg" :class="{
          'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400': saveStatus.type === 'success',
          'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400': saveStatus.type === 'error'
        }">
          {{ saveStatus.message }}
        </div>
      </div>

      <!-- Right Column: Code Preview (desktop) / Collapsible (mobile) -->
      <div class="lg:sticky lg:top-6 lg:self-start">
        <CodePreview
          :code="generatedCode"
          :collapsible="true"
        />

        <!-- Quick Actions -->
        <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Quick Tips
          </h3>
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
import { getAllChapters as getAllChaptersLocal, saveChapter as saveChapterLocal, saveScene as saveSceneLocal } from '../lib/storage.js';

// Components
import SceneIdInput from '../components/SceneIdInput.vue';
import ChapterSelect from '../components/ChapterSelect.vue';
import SceneTextEditor from '../components/SceneTextEditor.vue';
import ChoicesList from '../components/ChoicesList.vue';
import StateChangesList from '../components/StateChangesList.vue';
import CodePreview from '../components/CodePreview.vue';

const router = useRouter();
const route = useRoute();

// Scene data
const sceneData = reactive({
  sceneId: '',
  chapterId: '',
  sceneText: '',
  choices: [],
  stateChanges: []
});

// Available chapters (loaded from API or local storage)
const availableChapters = ref([]);

// Edit mode check
const isEditMode = computed(() => !!route.params.id);

// UI state
const isSaving = ref(false);
const saveStatus = ref(null);

// Composables
const codeGenerator = useCodeGenerator();
const validation = useSceneValidation(sceneData);

// Generated code (reactive)
const generatedCode = computed(() => {
  return codeGenerator.generateSceneCode(sceneData);
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
    setTimeout(() => (saveStatus.value = null), 1200);
  } catch (err) {
    // Fallback: save locally when offline
    try {
      await saveChapterLocal({ id: chapterId, name: chapterId, scenes: [], order: Date.now() });
      availableChapters.value.push({ id: chapterId, name: chapterId });
      saveStatus.value = { type: 'success', message: `Chapter "${chapterId}" saved locally (offline).` };
      setTimeout(() => (saveStatus.value = null), 1600);
    } catch (e2) {
      console.error('Failed to create chapter:', err);
      saveStatus.value = { type: 'error', message: `Failed to create chapter: ${err.message}` };
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

// Handle cancel
function handleCancel() {
  router.push('/scenes');
}

// Load scene data if editing and chapters from API
onMounted(async () => {
  try {
    // Load chapters
    const chaptersData = await api.chapters.getAll();
    if (chaptersData && Array.isArray(chaptersData)) {
      availableChapters.value = chaptersData;
    }
  } catch (error) {
    // Fallback to local storage when offline or backend unavailable
    try {
      availableChapters.value = await getAllChaptersLocal();
    } catch (e2) {
      console.error('Failed to load chapters:', error);
    }
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
});
</script>

<style scoped>
/* Ensure form elements are touch-friendly on mobile */
@media (max-width: 768px) {
  input, textarea, select, button {
    @apply touch-manipulation;
  }
}
</style>

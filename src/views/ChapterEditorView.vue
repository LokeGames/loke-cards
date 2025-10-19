<template>
  <div class="chapter-editor-view p-4 md:p-6 max-w-3xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {{ isEditMode ? 'Edit Chapter' : 'Create New Chapter' }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">Define a chapter identifier and optional display name.</p>
    </div>

    <div class="space-y-6">
      <!-- Chapter ID -->
      <BaseInput
        id="chapter-id"
        label="Chapter ID"
        v-model="chapter.chapterId"
        placeholder="e.g., chapter01 or chapter01_intro"
        :error="errors.chapterId"
        @blur="validateChapterIdField"
      />

      <!-- Chapter Name (optional) -->
      <BaseInput
        id="chapter-name"
        label="Chapter Name (optional)"
        v-model="chapter.name"
        placeholder="e.g., The Forest"
      />

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <BaseButton
          :loading="isSaving"
          :disabled="!isFormValid || isSaving"
          @click="handleSave"
        >
          Save Chapter
        </BaseButton>

        <BaseButton variant="secondary" @click="handleCancel">Cancel</BaseButton>
      </div>

      <!-- Save Status -->
      <div v-if="saveStatus" class="p-4 rounded-lg" :class="{
        'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400': saveStatus.type === 'success',
        'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400': saveStatus.type === 'error'
      }">
        {{ saveStatus.message }}
      </div>

      <!-- Tips -->
      <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
        <p class="font-medium text-gray-700 dark:text-gray-300 mb-1">Tips</p>
        <ul class="list-disc ml-5 space-y-1">
          <li>Chapter ID must start with "chapter" and be a valid C identifier.</li>
          <li>Use short, stable IDs like <code>chapter01</code> or <code>chapter02_forest</code>.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import { useSceneValidation } from '../composables/useSceneValidation.js';
import api from '../api/client.js';

const router = useRouter();
const route = useRoute();

// Form state
const chapter = reactive({
  chapterId: '',
  name: ''
});

const saveStatus = ref(null);
const isSaving = ref(false);
const isEditMode = computed(() => !!route.params.id);

// Reuse chapterId validation from scene validation composable
const dummySceneData = reactive({ sceneId: '', chapterId: '' });
const { validateChapterId } = useSceneValidation(dummySceneData);

const errors = reactive({ chapterId: '' });

const isFormValid = computed(() => !errors.chapterId && chapter.chapterId.trim() !== '');

function validateChapterIdField() {
  errors.chapterId = validateChapterId(chapter.chapterId);
}

async function handleSave() {
  validateChapterIdField();
  if (!isFormValid.value) return;

  isSaving.value = true;
  saveStatus.value = null;

  try {
    if (isEditMode.value) {
      await api.chapters.update(route.params.id, { id: chapter.chapterId, name: chapter.name });
    } else {
      await api.chapters.create({ id: chapter.chapterId, name: chapter.name });
    }
    saveStatus.value = { type: 'success', message: `Chapter "${chapter.chapterId}" created.` };
    setTimeout(() => {
      saveStatus.value = null;
      router.push('/chapters');
    }, 1200);
  } catch (err) {
    try {
      await saveChapterLocal({ id: chapter.chapterId, name: chapter.name, scenes: [], order: Date.now() });
      saveStatus.value = { type: 'success', message: `Chapter "${chapter.chapterId}" saved locally (offline).` };
      setTimeout(() => {
        saveStatus.value = null;
        router.push('/chapters');
      }, 1400);
    } catch (e2) {
      saveStatus.value = { type: 'error', message: `Failed to create chapter: ${err.message}` };
    }
  } finally {

    isSaving.value = false;
  }
}

function handleCancel() {
  router.push('/chapters');
}

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const data = await api.chapters.getById(route.params.id);
      if (data && data.id) {
        chapter.chapterId = data.id;
        chapter.name = data.name || '';
      }
    } catch (e) {
      saveStatus.value = { type: 'error', message: `Failed to load chapter: ${e.message}` };
    }
  }
});
</script>

<style scoped>
/* Ensure touch-friendly controls on mobile */
@media (max-width: 768px) {
  input, button { touch-action: manipulation; }
}
</style>

<template>
  <div class="chapter-select">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      Chapter
      <span class="text-red-500">*</span>
    </label>
    <select
      :value="modelValue"
      @change="handleChange"
      class="w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{
        'border-red-500 dark:border-red-600': error,
        'border-gray-300 dark:border-gray-700': !error
      }"
    >
      <option value="">-- Select Chapter --</option>
      <option v-for="chapter in chapters" :key="chapter.id" :value="chapter.id">
        {{ chapter.name || chapter.id }}
      </option>
      <option value="__new__">+ Create New Chapter</option>
    </select>

    <!-- New Chapter Input -->
    <div v-if="showNewChapterInput" class="mt-2 flex gap-2">
      <input
        v-model="newChapterId"
        type="text"
        placeholder="chapter01"
        class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="createNewChapter"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
      >
        Add
      </button>
      <button
        @click="cancelNewChapter"
        class="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
      >
        Cancel
      </button>
    </div>

    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-500">
      Select the chapter this scene belongs to
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  chapters: {
    type: Array,
    default: () => []
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'create-chapter']);

const showNewChapterInput = ref(false);
const newChapterId = ref('');

function handleChange(event) {
  const value = event.target.value;
  if (value === '__new__') {
    showNewChapterInput.value = true;
  } else {
    emit('update:modelValue', value);
  }
}

function createNewChapter() {
  if (newChapterId.value.trim()) {
    emit('create-chapter', newChapterId.value.trim());
    emit('update:modelValue', newChapterId.value.trim());
    showNewChapterInput.value = false;
    newChapterId.value = '';
  }
}

function cancelNewChapter() {
  showNewChapterInput.value = false;
  newChapterId.value = '';
}
</script>

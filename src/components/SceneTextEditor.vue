<template>
  <div class="scene-text-editor">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      Scene Text
      <span class="text-red-500">*</span>
    </label>
    <textarea
      id="scene-text"
      :value="modelValue"
      @input="handleInput"
      rows="6"
      placeholder="You stand at the entrance to a dark forest. The path ahead is shrouded in mist..."
      class="w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      :class="{
        'border-red-500 dark:border-red-600': error,
        'border-gray-300 dark:border-gray-700': !error
      }"
    ></textarea>

    <!-- Character count -->
    <div class="mt-1 flex justify-between items-center">
      <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
      <p v-else class="text-xs text-gray-500 dark:text-gray-500">
        Scene description text (supports \n for newlines)
      </p>
      <p
        class="text-xs font-mono"
        :class="{
          'text-red-600 dark:text-red-400': charCount > maxLength,
          'text-gray-500 dark:text-gray-500': charCount <= maxLength
        }"
      >
        {{ charCount }}/{{ maxLength }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  maxLength: {
    type: Number,
    default: 2048 // MAX_TEXT_LENGTH from loke-engine
  }
});

const emit = defineEmits(['update:modelValue']);

const charCount = computed(() => props.modelValue?.length || 0);

function handleInput(event) {
  emit('update:modelValue', event.target.value);
}
</script>

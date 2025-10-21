<template>
  <div class="scene-id-input">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      Scene ID
      <span class="text-red-500">*</span>
    </label>
    <input
      id="scene-id"
      :value="modelValue"
      @input="handleInput"
      @blur="handleBlur"
      type="text"
      placeholder="scene_forest_entrance"
      class="w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{
        'border-red-500 dark:border-red-600': error,
        'border-gray-300 dark:border-gray-700': !error
      }"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-500">
      Must be a valid C identifier starting with "scene_" (e.g., scene_forest_entrance)
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  validateOnInput: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'blur']);

function handleInput(event) {
  emit('update:modelValue', event.target.value);
}

function handleBlur() {
  emit('blur');
}
</script>

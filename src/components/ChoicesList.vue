<template>
  <div class="choices-list">
    <div class="flex items-center justify-between mb-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Choices
        <span class="text-red-500">*</span>
      </label>
      <button
        @click="addChoice"
        :disabled="choices.length >= maxChoices"
        class="px-3 py-1 text-sm font-medium rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white transition-colors"
      >
        + Add Choice
      </button>
    </div>

    <div v-if="choices.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
      <p class="text-gray-500 dark:text-gray-500 text-sm">
        No choices yet. Click "Add Choice" to create one.
      </p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="(choice, index) in choices"
        :key="choice.id || index"
        class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between mb-3">
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Choice {{ index + 1 }}
          </span>
          <button
            @click="removeChoice(index)"
            class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
            title="Remove choice"
          >
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Choice Text -->
        <div class="mb-3">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Choice Text <span class="text-red-500">*</span>
          </label>
          <input
            :value="choice.text"
            @input="updateChoice(index, 'text', $event.target.value)"
            type="text"
            placeholder="Enter the forest"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors[index]" class="mt-1 text-xs text-red-600 dark:text-red-400">
            {{ errors[index] }}
          </p>
        </div>

        <!-- Next Scene -->
        <div class="mb-3">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Next Scene
          </label>
          <input
            :value="choice.nextScene"
            @input="updateChoice(index, 'nextScene', $event.target.value)"
            type="text"
            placeholder="scene_forest_path (or leave empty for NULL)"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Enabled Checkbox -->
        <div class="flex items-center">
          <input
            :id="`choice-enabled-${index}`"
            :checked="choice.enabled !== false"
            @change="updateChoice(index, 'enabled', $event.target.checked)"
            type="checkbox"
            class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500"
          />
          <label :for="`choice-enabled-${index}`" class="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400">
            Enabled (show this choice to player)
          </label>
        </div>
      </div>
    </div>

    <p class="mt-2 text-xs text-gray-500 dark:text-gray-500">
      {{ choices.length }}/{{ maxChoices }} choices (at least 1 required)
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  choices: {
    type: Array,
    default: () => []
  },
  errors: {
    type: Array,
    default: () => []
  },
  maxChoices: {
    type: Number,
    default: 10 // MAX_OPTIONS from loke-engine
  }
});

const emit = defineEmits(['update:choices']);

function addChoice() {
  if (props.choices.length >= props.maxChoices) return;

  const newChoices = [...props.choices, {
    text: '',
    nextScene: '',
    enabled: true
  }];
  emit('update:choices', newChoices);
}

function removeChoice(index) {
  const newChoices = props.choices.filter((_, i) => i !== index);
  emit('update:choices', newChoices);
}

function updateChoice(index, field, value) {
  const newChoices = [...props.choices];
  newChoices[index] = {
    ...newChoices[index],
    [field]: value
  };
  emit('update:choices', newChoices);
}
</script>

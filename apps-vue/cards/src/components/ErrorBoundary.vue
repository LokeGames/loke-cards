<template>
  <div>
    <slot v-if="!error" />
    <div v-else class="p-4 rounded border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300">
      <div class="font-semibold mb-1">Something went wrong</div>
      <div class="text-sm break-words">{{ errorMessage }}</div>
      <button @click="reset" class="mt-2 text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">Try again</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const error = ref(null);
const errorMessage = ref('');

// capture
onErrorCaptured((err) => {
  error.value = err;
  errorMessage.value = err?.message || String(err);
  return false; // don't stop further propagation
});

function reset() {
  error.value = null;
  errorMessage.value = '';
}
</script>

<style scoped>
</style>


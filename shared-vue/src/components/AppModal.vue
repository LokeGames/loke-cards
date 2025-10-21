<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')" aria-hidden="true"></div>
    <div class="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md mx-4" role="dialog" aria-modal="true" :aria-label="title">
      <div class="p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ title }}</h3>
      </div>
      <div class="p-4 text-gray-700 dark:text-gray-300">
        <slot />
      </div>
      <div class="p-4 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-800">
        <button @click="$emit('close')" class="px-3 py-2 text-sm rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Cancel</button>
        <button @click="$emit('confirm')" class="px-3 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white">Confirm</button>
      </div>
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700" aria-label="Close">✕</button>
    </div>
  </div>
  
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Confirm' }
});
</script>

<style scoped>
</style>


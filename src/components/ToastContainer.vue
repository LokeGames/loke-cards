<template>
  <div class="fixed top-3 right-3 z-[999] flex flex-col gap-2 w-80">
    <div
      v-for="t in toasts.items"
      :key="t.id"
      class="px-3 py-2 rounded shadow border text-sm flex items-start justify-between gap-3"
      :class="toastClass(t.type)"
      role="status"
      aria-live="polite"
    >
      <div class="break-words flex-1">{{ t.message }}</div>
      <button @click="toasts.remove(t.id)" class="opacity-70 hover:opacity-100">✕</button>
    </div>
  </div>
  
</template>

<script setup>
import { useToastStore } from '../stores/toast';
const toasts = useToastStore();

function toastClass(type) {
  switch (type) {
    case 'success':
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300';
    case 'error':
      return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300';
    default:
      return 'bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200';
  }
}
</script>

<style scoped>
</style>


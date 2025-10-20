<template>
  <div v-if="debug.entries.length" class="fixed bottom-3 right-3 z-[1000] w-80 max-h-[60vh] flex flex-col shadow-lg rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-gray-900 overflow-hidden">
    <div class="px-3 py-2 flex items-center justify-between bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300">
      <div class="text-sm font-semibold">Errors ({{ debug.entries.length }})</div>
      <div class="flex items-center gap-2">
        <button @click="debug.clear()" class="text-xs underline hover:no-underline">Clear</button>
        <button @click="toggle()" class="text-xs underline hover:no-underline">{{ open ? 'Hide' : 'Show' }}</button>
        <button @click="debug.hide()" class="text-xs" aria-label="Close">✕</button>
      </div>
    </div>
    <div v-show="open" class="p-2 overflow-auto text-xs text-gray-800 dark:text-gray-200 space-y-2">
      <div v-for="(e, idx) in debug.entries" :key="idx" class="p-2 rounded border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <div class="font-mono break-words">{{ e.message }}</div>
        <div v-if="e.stack" class="mt-1 text-[11px] text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{{ e.stack }}</div>
        <div class="mt-1 text-[10px] text-gray-500">{{ e.time }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDebugStore } from '../stores/debug';

const debug = useDebugStore();
const open = ref(true);
function toggle() { open.value = !open.value; }
</script>

<style scoped>
</style>


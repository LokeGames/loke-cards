<template>
  <div class="fixed top-3 right-3 z-[999] w-80">
    <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
      <div
        v-for="t in toasts.items"
        :key="t.id"
        class="px-3 py-2 rounded shadow border text-sm flex items-start justify-between gap-3"
        :class="toastClass(t.type)"
        :role="t.type==='error' ? 'alert' : 'status'"
        :aria-live="t.type==='error' ? 'assertive' : 'polite'"
      >
        <div class="break-words flex-1">{{ t.message }}</div>
        <button @click="toasts.remove(t.id)" class="opacity-70 hover:opacity-100">✕</button>
      </div>
    </TransitionGroup>
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
/* Animations */
.toast-enter-from { opacity: 0; transform: translateY(-6px) scale(0.98); }
.toast-enter-to { opacity: 1; transform: translateY(0) scale(1); }
.toast-enter-active { transition: all 160ms ease-out; }
.toast-leave-from { opacity: 1; transform: translateY(0) scale(1); }
.toast-leave-to { opacity: 0; transform: translateY(-6px) scale(0.98); }
.toast-leave-active { transition: all 140ms ease-in; }
</style>

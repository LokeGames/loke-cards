<template>
  <div class="space-y-2" role="status" aria-live="polite" aria-busy="true">
    <div v-for="i in rows" :key="i" class="rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3">
      <div class="h-4 w-2/5 skeleton"></div>
      <div class="mt-2 h-3 w-3/5 skeleton"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ rows: { type: Number, default: 5 } });
</script>

<style scoped>
@keyframes skeleton-shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
.skeleton {
  background-color: rgba(107,114,128,0.15);
  background-image: linear-gradient(90deg, rgba(107,114,128,0.15) 0px, rgba(107,114,128,0.25) 40px, rgba(107,114,128,0.15) 80px);
  background-size: 200px 100%;
  border-radius: 6px;
  animation: skeleton-shimmer 1.2s ease-in-out infinite;
}
</style>


<template>
  <section aria-labelledby="stats-heading" class="">
    <h2 id="stats-heading" class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Project Stats</h2>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-center">
        <div class="text-xs text-gray-500 dark:text-gray-500">Chapters</div>
        <div class="text-xl font-semibold text-gray-800 dark:text-gray-100">{{ stats.chapters }}</div>
      </div>
      <div class="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-center">
        <div class="text-xs text-gray-500 dark:text-gray-500">Scenes</div>
        <div class="text-xl font-semibold text-gray-800 dark:text-gray-100">{{ stats.scenes }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ stats: { type: Object, required: true } })
</script>

<style scoped>
</style>


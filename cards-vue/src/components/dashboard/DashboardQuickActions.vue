<template>
  <section aria-labelledby="qa-heading" class="">
    <h2 id="qa-heading" class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Actions</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <RouterLink to="/scene/new" class="group flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span class="text-sm font-medium text-gray-800 dark:text-gray-200">New Scene</span>
      </RouterLink>

      <RouterLink to="/chapter/new" class="group flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span class="text-sm font-medium text-gray-800 dark:text-gray-200">New Chapter</span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
</style>


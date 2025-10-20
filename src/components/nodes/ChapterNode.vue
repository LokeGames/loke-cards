<template>
  <div
    class="chapter-node rounded-xl border-2 shadow-lg"
    :class="{
      'border-purple-500 bg-purple-50 dark:bg-purple-900/20': selected,
      'border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/10': !selected
    }"
    style="min-width: 400px; min-height: 300px;"
  >
    <!-- Chapter Header -->
    <div class="chapter-header px-4 py-3 border-b border-purple-200 dark:border-purple-800 rounded-t-xl bg-purple-100 dark:bg-purple-900/30">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 class="font-bold text-lg text-purple-800 dark:text-purple-200">
          {{ data.title }}
        </h3>
      </div>
    </div>

    <!-- Chapter Container (scenes will be placed inside) -->
    <div class="chapter-content p-4">
      <div class="text-sm text-gray-500 dark:text-gray-400 italic">
        Scenes in this chapter will appear here
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  data: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.chapter-node {
  cursor: pointer;
}
</style>

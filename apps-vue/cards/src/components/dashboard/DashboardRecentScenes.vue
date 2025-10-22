<template>
  <section aria-labelledby="scenes-heading">
    <div class="flex items-center justify-between mb-2">
      <h2 id="scenes-heading" class="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Scenes</h2>
      <RouterLink to="/scenes" class="text-xs text-blue-600 hover:underline">View all</RouterLink>
    </div>
    <div class="rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div v-if="loading" class="p-3 text-sm text-gray-600 dark:text-gray-400">Loading…</div>
      <div v-else-if="error" class="p-3 text-sm text-red-700 dark:text-red-400">{{ error }}</div>
      <ul v-else class="divide-y divide-gray-200 dark:divide-gray-800">
        <li v-for="sc in scenesValid" :key="sc.sceneId" class="p-3 flex items-center justify-between">
          <div>
            <div class="font-medium text-gray-800 dark:text-gray-100">{{ sc.sceneId }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-500">Chapter: {{ sc.chapterId || '—' }}</div>
          </div>
          <RouterLink :to="toEditScene(sc.sceneId)" class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Edit</RouterLink>
        </li>
        <li v-if="scenesValid.length === 0" class="p-3 text-sm text-gray-600 dark:text-gray-400">No scenes yet.</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { toEditScene } from '@cards/router/guards.js'
const props = defineProps({ scenes: { type: Array, required: true }, loading: Boolean, error: String })
const scenesValid = computed(() => (Array.isArray(props.scenes) ? props.scenes : []).filter(sc => sc && sc.sceneId))
</script>

<style scoped>
</style>

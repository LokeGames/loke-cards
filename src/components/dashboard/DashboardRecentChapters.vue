<template>
  <section aria-labelledby="chapters-heading">
    <div class="flex items-center justify-between mb-2">
      <h2 id="chapters-heading" class="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Chapters</h2>
      <RouterLink to="/chapters" class="text-xs text-blue-600 hover:underline">View all</RouterLink>
    </div>
    <div class="rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div v-if="loading" class="p-3 text-sm text-gray-600 dark:text-gray-400">Loading…</div>
      <div v-else-if="error" class="p-3 text-sm text-red-700 dark:text-red-400">{{ error }}</div>
      <ul v-else class="divide-y divide-gray-200 dark:divide-gray-800">
        <li v-for="ch in chapters" :key="ch.id" class="p-3 flex items-center justify-between">
          <div>
            <div class="font-medium text-gray-800 dark:text-gray-100">{{ ch.name || ch.id }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-500">ID: {{ ch.id }}</div>
          </div>
          <RouterLink :to="toNewSceneWithChapter(ch.id)" class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">New Scene</RouterLink>
        </li>
        <li v-if="chapters.length === 0" class="p-3 text-sm text-gray-600 dark:text-gray-400">No chapters yet.</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { toNewSceneWithChapter } from '../../router/guards.js'
defineProps({ chapters: { type: Array, required: true }, loading: Boolean, error: String })
</script>

<style scoped>
</style>


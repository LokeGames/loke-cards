<template>
  <div
    class="scene-node rounded-lg border-2 shadow-md transition-all hover:shadow-lg"
    :class="{
      'border-blue-500 bg-blue-50 dark:bg-blue-900/20': selected,
      'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800': !selected
    }"
  >
    <Handle type="target" :position="Position.Top" class="w-3 h-3 bg-blue-500" />

    <div class="p-3 min-w-[180px]">
      <div class="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-1 truncate">
        {{ data.title }}
      </div>
      <div v-if="data.sceneText" class="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
        {{ data.sceneText.substring(0, 60) }}{{ data.sceneText.length > 60 ? '...' : '' }}
      </div>
      <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
        <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
          {{ data.chapterId || 'No chapter' }}
        </span>
        <span v-if="data.choicesCount > 0" class="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
          {{ data.choicesCount }} choice{{ data.choicesCount !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>

    <Handle type="source" :position="Position.Bottom" class="w-3 h-3 bg-green-500" />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'

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
.scene-node { cursor: pointer; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>


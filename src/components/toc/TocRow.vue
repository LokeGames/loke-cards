<template>
  <div class="flex items-center gap-3 py-1">
    <svg :width="laneWidth * lanes" height="20" class="overflow-visible">
      <!-- lanes -->
      <g v-for="i in lanes" :key="i">
        <line :x1="(i-1)*laneWidth + laneWidth/2" y1="0" :x2="(i-1)*laneWidth + laneWidth/2" y2="20" stroke="#d1d5db" stroke-width="2" />
      </g>
      <!-- node -->
      <circle :cx="(lane)*laneWidth + laneWidth/2" cy="10" r="5" :fill="color" />
    </svg>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span class="font-mono text-sm text-gray-800 dark:text-gray-100 truncate">{{ sceneId }}</span>
        <span class="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{{ chapterId || '—' }}</span>
      </div>
    </div>
    <button class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" @click="$emit('open', sceneId)">Open</button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  sceneId: string
  chapterId?: string
  lane: number
  lanes: number
  color?: string
  laneWidth?: number
}>(), {
  chapterId: '',
  color: '#2563eb',
  laneWidth: 16,
})
const emit = defineEmits<{ (e: 'open', id: string): void }>()
</script>

<style scoped>
</style>

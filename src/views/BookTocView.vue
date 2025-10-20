<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Story Map</h1>
      <div class="flex items-center gap-2">
        <input v-model="q" type="text" placeholder="Search…" class="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        <select v-model="chapterFilter" class="px-2 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <option value="">All chapters</option>
          <option v-for="ch in chapters" :key="ch.id" :value="ch.id">{{ ch.name || ch.id }}</option>
        </select>
      </div>
    </div>

    <div class="rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
      <TocRow v-for="row in filteredRows" :key="row.sceneId + '-' + row.lane" :scene-id="row.sceneId" :chapter-id="row.chapterId" :lane="row.lane" :lanes="maxLanes" :color="row.color" @open="openScene" />
      <div v-if="filteredRows.length===0" class="p-4 text-sm text-gray-600 dark:text-gray-400">No scenes.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSceneStore } from '../stores/scenes.js'
import { useChapterStore } from '../stores/chapters.js'
import { storeToRefs } from 'pinia'
import TocRow from '../components/toc/TocRow.vue'
import { buildTocRows } from '../lib/toc'
import { toEditScene } from '../router/guards.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const sceneStore = useSceneStore()
const chapterStore = useChapterStore()

const loading = ref(true)
onMounted(async () => {
  try { await Promise.all([sceneStore.init(), chapterStore.init()]) }
  finally { loading.value = false }
})

const { scenes } = storeToRefs(sceneStore)
const { chapters } = storeToRefs(chapterStore)

const q = ref('')
const chapterFilter = ref('')

type TocRowType = { sceneId: string; chapterId?: string; lane: number; lanes: number; color: string }
const rows = computed<TocRowType[]>(() => {
  try {
    return buildTocRows(Array.isArray(scenes.value) ? scenes.value : [], { chapterIdFilter: chapterFilter.value || null })
  } catch (e) {
    console.warn('[StoryMap] build error', e)
    return []
  }
})
const maxLanes = computed(() => Math.max(1, ...rows.value.map(r => r.lanes || 1)))
const filteredRows = computed(() => {
  const query = q.value.trim().toLowerCase()
  if (!query) return rows.value
  return rows.value.filter(r => String(r.sceneId).toLowerCase().includes(query))
})

function openScene(id: string) { router.push(toEditScene(id)) }
</script>

<style scoped>
</style>

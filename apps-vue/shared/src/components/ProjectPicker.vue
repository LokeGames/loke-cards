<template>
  <div class="flex items-center gap-2">
    <label class="text-xs text-gray-500 dark:text-gray-400">Project</label>
    <select
      :value="currentId"
      @change="onChange"
      class="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
    >
      <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name || p.id }}</option>
    </select>
    <button
      class="px-2 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
      title="New project"
      aria-label="New project"
      @click="createNew"
    >
      +
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useProjectStore } from '../stores/project'

const project = useProjectStore()

onMounted(() => {
  if (!project.currentProject) project.init()
})

const projects = computed(() => project.projects)
const currentId = computed(() => project.currentProject?.id || 'default')

function onChange(e) {
  project.selectProject(e.target.value)
}

async function createNew() {
  const name = window.prompt('New project name:')
  if (!name || !name.trim()) return
  const p = await project.createProject(name.trim())
  await project.selectProject(p.id)
}
</script>

<style scoped>
</style>

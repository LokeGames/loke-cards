<template>
  <div>
    <ul class="space-y-1 text-sm">
      <li><NavLink to="/">Dashboard</NavLink></li>
      <li><NavLink to="/scenes">Scenes</NavLink></li>
      <li><NavLink to="/chapters">Chapters</NavLink></li>
      <li><NavLink to="/toc">Story Map</NavLink></li>
      <li><NavLink to="/code">C code</NavLink></li>
      <li><NavLink to="/settings">Settings</NavLink></li>
    </ul>

    <div class="mt-6 px-3">
      <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Project Info</h3>
      <div class="text-sm text-gray-700 dark:text-gray-300">
        <p class="font-semibold">{{ ui.currentProject?.name || 'No Project' }}</p>
        <p>Scenes: {{ ui.stats.scenes }}</p>
        <p>Chapters: {{ ui.stats.chapters }}</p>
      </div>
    </div>

    <div class="mt-6 px-3">
      <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Quick Actions</h3>
      <ul class="space-y-1 text-sm">
        <li>
          <NavLink to="/scene/new" class="group flex items-center gap-2">
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Scene
          </NavLink>
        </li>
        <li>
          <NavLink to="/chapter/new" class="group flex items-center gap-2">
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Chapter
          </NavLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '../stores/ui'
import NavLink from './NavLink.vue'
const ui = useUiStore()
</script>

<style scoped>
.nav-item.router-link-active {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white;
}
</style>


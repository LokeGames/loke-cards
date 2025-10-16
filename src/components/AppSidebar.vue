<template>
  <div class="relative z-40 md:hidden" role="dialog" aria-modal="true" v-show="ui.isSidebarOpen">
    <div class="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" @click="ui.closeSidebar()"></div>

    <div class="fixed inset-0 flex z-40">
      <div :class="{'translate-x-0': ui.isSidebarOpen, '-translate-x-full': !ui.isSidebarOpen}" class="transform transition-transform ease-in-out duration-300 relative flex-1 flex flex-col max-w-xs w-full bg-gray-50 dark:bg-gray-950">
        <div class="absolute top-0 right-0 -mr-12 pt-2">
          <button type="button" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" @click="ui.closeSidebar()">
            <span class="sr-only">Close sidebar</span>
            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <aside class="h-full overflow-auto p-3">
          <ul class="space-y-1 text-sm">
            <li><RouterLink to="/dashboard" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block" @click="ui.closeSidebar()">Dashboard</RouterLink></li>
            <li><RouterLink to="/scenes" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block" @click="ui.closeSidebar()">Scenes</RouterLink></li>
            <li><RouterLink to="/chapters" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block" @click="ui.closeSidebar()">Chapters</RouterLink></li>
            <li><RouterLink to="/code" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block" @click="ui.closeSidebar()">C code</RouterLink></li>
            <li><RouterLink to="/settings" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block" @click="ui.closeSidebar()">Settings</RouterLink></li>
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
                <RouterLink to="/scene/new" class="nav-item group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded" @click="ui.closeSidebar()">
                  <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  New Scene
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/chapter/new" class="nav-item group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded" @click="ui.closeSidebar()">
                  <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  New Chapter
                </RouterLink>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>

  <!-- Desktop Sidebar -->
  <aside class="h-full overflow-auto p-3 bg-gray-50 dark:bg-gray-950 hidden md:block w-64 shrink-0 border-r border-gray-200 dark:border-gray-800">
    <ul class="space-y-1 text-sm">
      <li><RouterLink to="/dashboard" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block">Dashboard</RouterLink></li>
      <li><RouterLink to="/scenes" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block">Scenes</RouterLink></li>
      <li><RouterLink to="/chapters" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block">Chapters</RouterLink></li>
      <li><RouterLink to="/code" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block">C code</RouterLink></li>
      <li><RouterLink to="/settings" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block">Settings</RouterLink></li>
    </ul>

    <div class="mt-6 px-3">
      <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Quick Actions</h3>
      <ul class="space-y-1 text-sm">
        <li>
          <RouterLink to="/scene/new" class="nav-item group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded">
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Scene
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/chapter/new" class="nav-item group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded">
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Chapter
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { useUiStore } from '../stores/ui';

const ui = useUiStore();
</script>

<style scoped>
/* Add any component specific styles here */
</style>
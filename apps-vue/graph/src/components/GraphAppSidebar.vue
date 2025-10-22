<template>
  <!-- Mobile Sidebar -->
  <div class="relative z-40 md:hidden" role="dialog" aria-modal="true" v-show="isSidebarOpen">
    <div class="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" @click="closeSidebar"></div>
    <div class="fixed inset-0 flex z-40">
      <div :class="{'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen}" class="transform transition-transform ease-in-out duration-300 relative flex-1 flex flex-col max-w-xs w-full bg-gray-50 dark:bg-gray-950">
        <div class="absolute top-0 right-0 -mr-12 pt-2">
          <button type="button" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" @click="closeSidebar">
            <span class="sr-only">Close sidebar</span>
            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <aside class="h-full overflow-auto p-3">
          <ul class="space-y-1 text-sm">
            <li><RouterLink to="/" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block" @click="closeSidebar">Global Graph</RouterLink></li>
          </ul>
          <div class="mt-6 px-3">
            <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Chapters</h3>
            <ul class="space-y-1 text-sm">
              <li v-for="chapter in graph.chapters" :key="chapter.id">
                <RouterLink :to="`/chapter/${chapter.id}`" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block" @click="closeSidebar">{{ chapter.title }}</RouterLink>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>

  <!-- Desktop Sidebar -->
  <aside class="h-full overflow-auto p-3 bg-gray-50 dark:bg-gray-950 hidden md:block w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 relative z-20">
    <ul class="space-y-1 text-sm">
      <li><RouterLink to="/" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block">Global Graph</RouterLink></li>
    </ul>
    <div class="mt-6 px-3">
      <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Chapters</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="chapter in graph.chapters" :key="chapter.id">
          <RouterLink :to="`/chapter/${chapter.id}`" class="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block">{{ chapter.title }}</RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { useGraphStore } from '@graph/stores/graph';

const graph = useGraphStore();

// A simple local state for sidebar visibility, since we removed the main UI store
const isSidebarOpen = ref(false);
const closeSidebar = () => { isSidebarOpen.value = false; };
const openSidebar = () => { isSidebarOpen.value = true; };

// We need to expose a way for the header to open the sidebar.
// This is a simple event-based approach.
// A better approach would be a shared UI store for the graph app.
if (typeof window !== 'undefined') {
  window.addEventListener('open-sidebar', openSidebar);
}
</script>

<style scoped>
/* Active link styling */
.nav-item.router-link-active {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white;
}
</style>
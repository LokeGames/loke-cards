<template>
  <header class="h-14 md:h-16 sticky top-0 z-30 flex items-center gap-2 px-3 md:px-4
    border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur
    text-gray-900 dark:text-gray-100">
    <button @click="ui.toggleSidebar()" class="md:hidden text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" :aria-label="ui.isSidebarOpen ? 'Close navigation' : 'Open navigation'">
      <svg v-if="!ui.isSidebarOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
    <div class="font-semibold text-gray-900 dark:text-white">Loke Cards</div>
    <nav aria-label="Breadcrumb" class="ml-2 hidden sm:block text-gray-600 dark:text-gray-400 text-sm">
      <ol class="inline-flex items-center gap-1">
        <li v-for="(c,i) in breadcrumbs" :key="i" class="inline-flex items-center">
          <span v-if="i>0" class="px-1">/</span>
          <RouterLink :to="c.to" class="hover:underline">{{ c.title }}</RouterLink>
        </li>
      </ol>
    </nav>
    <div class="ml-auto flex items-center gap-2">
      <StatusPill state="synced"/>
      <ThemeToggle/>
    </div>
  </header>
</template>

<script setup>
import StatusPill from './StatusPill.vue';
import ThemeToggle from './ThemeToggle.vue';
import { useUiStore } from '../stores/ui';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const ui = useUiStore();
const route = useRoute();
const breadcrumbs = computed(() => {
  return route.matched
    .filter(r => r.meta && (r.meta.title || r.name))
    .map(r => ({ to: r.path || '/', title: r.meta.title || r.name }));
});
</script>

<style scoped>
/* Add any component specific styles here */
</style>

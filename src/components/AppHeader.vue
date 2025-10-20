<template>
  <header class="h-14 md:h-16 sticky top-0 z-50 flex items-center gap-2 px-3 md:px-4
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
        <li v-for="(c,i) in breadcrumbLinks" :key="i" class="inline-flex items-center">
          <span v-if="i>0" class="px-1">/</span>
          <RouterLink v-if="c.to" :to="c.to as any" class="hover:underline">{{ c.title }}</RouterLink>
          <span v-else>{{ c.title }}</span>
        </li>
      </ol>
    </nav>
    <div class="ml-auto flex items-center gap-2">
      <ProjectPicker/>
      <NetworkToggle/>
      <StatusPill/>
      <ThemeToggle/>
    </div>
  </header>
</template>

<script setup lang="ts">
import StatusPill from './StatusPill.vue';
import NetworkToggle from './NetworkToggle.vue';
import ProjectPicker from './ProjectPicker.vue';
import ThemeToggle from './ThemeToggle.vue';
import { useUiStore } from '../stores/ui';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import type { RouteLocationMatched } from 'vue-router';

const ui = useUiStore();
const route = useRoute();
const router = useRouter();
function fillPath(pathTmpl: string, params: Record<string, any>): string | null {
  // Replace ":param" tokens with values; if any missing -> null
  return pathTmpl.replace(/:([A-Za-z_]\w*)/g, (_m, key) => {
    const v = params?.[key];
    if (v === undefined || v === null || String(v).length === 0) {
      // mark as missing by returning a sentinel (we'll null out later)
      (fillPath as any)._missing = true;
      return '';
    }
    return encodeURIComponent(String(v));
  }).replace(/\?$/, '');
}

const breadcrumbLinks = computed(() => {
  const params = route.params as Record<string, any>;
  (fillPath as any)._missing = false;
  return (route.matched as RouteLocationMatched[])
    .filter(r => !!r.path)
    .map(r => {
      const title = (r.meta?.title as string) || String(r.name || r.path);
      (fillPath as any)._missing = false;
      const resolved = fillPath(r.path, params);
      const to = (fillPath as any)._missing ? null : resolved;
      return { title, to };
    });
});
</script>

<style scoped>
/* Add any component specific styles here */
</style>

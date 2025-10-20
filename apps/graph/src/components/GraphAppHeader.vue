<template>
  <header class="h-14 md:h-16 sticky top-0 z-50 flex items-center gap-2 px-3 md:px-4
    border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur
    text-gray-900 dark:text-gray-100">
    <button @click="openSidebar" class="md:hidden text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" aria-label="Open navigation">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
    <div class="font-semibold text-gray-900 dark:text-white">Loke Graph</div>
    <nav aria-label="Breadcrumb" class="ml-2 hidden sm:block text-gray-600 dark:text-gray-400 text-sm">
      <ol class="inline-flex items-center gap-1">
        <li v-for="(c,i) in breadcrumbs" :key="i" class="inline-flex items-center">
          <span v-if="i>0" class="px-1">/</span>
          <RouterLink v-if="safeTo(c.name)" :to="safeTo(c.name)" class="hover:underline">{{ c.title }}</RouterLink>
          <span v-else>{{ c.title }}</span>
        </li>
      </ol>
    </nav>
    <div class="ml-auto flex items-center gap-2">
      <!-- <StatusPill state="synced"/> -->
      <ThemeToggle/>
    </div>
  </header>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import ThemeToggle from '../../../../src/components/ThemeToggle.vue';

const route = useRoute();
const router = useRouter();
const breadcrumbs = computed(() =>
  route.matched
    .filter(r => !!r.name)
    .map(r => ({ name: r.name, title: r.meta?.title || r.name }))
);

function safeTo(name) {
  try {
    const loc = { name, params: route.params };
    router.resolve(loc); // throws if missing params
    return loc;
  } catch {
    return null;
  }
}

function openSidebar() {
  window.dispatchEvent(new CustomEvent('open-sidebar'));
}
</script>

<style scoped>
/* Add any component specific styles here */
</style>
<script lang="ts">
  import { toggleSidebar } from '../stores/ui.store';
  import StatusPill from './StatusPill.svelte';
  import NetworkToggle from './NetworkToggle.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import ProjectPicker from './ProjectPicker.svelte';
  export let title: string = 'Loke Cards';
</script>

<header class="flex items-center justify-between gap-3 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
  <button class="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle menu" on:click={toggleSidebar}>
    <!-- Burger icon -->
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
      <path fill-rule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6.75a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6.75a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
    </svg>
  </button>

  <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
  <div class="ml-auto flex items-center gap-2">
    <StatusPill />
    <NetworkToggle />
    <ProjectPicker />
    <ThemeToggle />
  </div>
</header>

<script lang="ts">
  import '../app.css';
  import AppHeader from '@loke/ui/components/AppHeader.svelte';
  import AppSidebar from '@loke/ui/components/AppSidebar.svelte';
  import AppToasts from '@loke/ui/components/AppToasts.svelte';
  import { getCurrentProject } from '@loke/shared/stores/project.svelte';

  // Check if a project is selected
  let currentProject = $derived(getCurrentProject());
  let hasProject = $derived(currentProject !== null);
</script>

<div class="h-screen w-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
  <AppSidebar disabled={!hasProject} />
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <AppHeader title="Loke Cards" />
    <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 {!hasProject ? 'pointer-events-none opacity-50' : ''}">
      {#if !hasProject}
        <div class="flex items-center justify-center h-full">
          <div class="text-center">
            <p class="text-xl text-gray-500 dark:text-gray-400 mb-2">No project selected</p>
            <p class="text-sm text-gray-400 dark:text-gray-500">Select or create a project to get started</p>
          </div>
        </div>
      {:else}
        <slot />
      {/if}
    </main>
  </div>
  <AppToasts />
</div>

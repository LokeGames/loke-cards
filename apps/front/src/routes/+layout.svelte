<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import AppHeader from '@loke/ui/components/AppHeader.svelte';
  import AppSidebar from '@loke/ui/components/AppSidebar.svelte';
  import AppToasts from '@loke/ui/components/AppToasts.svelte';
  import ProjectDashboard from '@loke/ui/components/ProjectDashboard.svelte';
  import { getCurrentProject, loadCurrentProject } from '@loke/shared/stores/project.svelte';

  // Check if a project is selected
  let currentProject = $derived(getCurrentProject());
  let hasProject = $derived(currentProject !== null);

  // Load current project from backend on mount
  onMount(async () => {
    await loadCurrentProject();
  });
</script>

<div class="h-screen w-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
  {#if hasProject}
    <AppSidebar />
  {/if}
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <AppHeader title="Loke Cards" showProjectPicker={hasProject} />
    <main class="flex-1 overflow-auto {hasProject ? 'p-4 sm:p-6 lg:p-8' : ''}">
      {#if !hasProject}
        <ProjectDashboard />
      {:else}
        <slot />
      {/if}
    </main>
  </div>
  <AppToasts />
</div>

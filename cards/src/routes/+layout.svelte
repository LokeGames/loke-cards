<script lang="ts">
  import '../../app.css';
  import AppHeader from '@shared/lib/components/AppHeader.svelte';
  import AppSidebar from '@shared/lib/components/AppSidebar.svelte';
  import AppToasts from '@shared/lib/components/AppToasts.svelte';
  import { onMount } from 'svelte';
  import { init as initProject } from '@shared/lib/stores/project.store';
  onMount(() => { initProject().catch(() => {}); });
</script>

<div class="min-h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
  <AppSidebar />
  <div class="flex-1 flex flex-col min-w-0">
    <AppHeader title="Loke Cards (Svelte)" />
    <main class="p-4">
      <slot />
    </main>
  </div>
  <AppToasts />
  
</div>

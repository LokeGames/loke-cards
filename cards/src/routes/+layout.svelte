<script lang="ts">
  import '../app.css';
  import AppHeader from '@shared/lib/components/AppHeader.svelte';
  import AppSidebar from '@shared/lib/components/AppSidebar.svelte';
  import AppToasts from '@shared/lib/components/AppToasts.svelte';
  import { onMount } from 'svelte';
  import { init as initProject } from '@shared/lib/stores/project.store';
  onMount(() => { initProject().catch(() => {}); });
</script>

<!-- AppShell: header + sidebar with scrollable main area -->
<div class="h-screen w-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
  <AppSidebar />
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <AppHeader title="Loke Cards (Svelte)" />
    <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      <slot />
    </main>
  </div>
  <AppToasts />
</div>

<script>
  import '../../app.css';
  import AppHeader from '@loke/shared/src/lib/components/AppHeader.svelte';
  import AppSidebar from '@loke/shared/src/lib/components/AppSidebar.svelte';
</script>

<div class="min-h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
  <AppSidebar />
  <div class="flex-1 flex flex-col min-w-0">
    <AppHeader title="Loke Cards (Svelte)" />
    <main class="p-4">
      <slot />
    </main>
  </div>
  
</div>


<script lang="ts">
  import '../app.css';
  import AppHeader from '@loke/ui/components/AppHeader.svelte';
  import AppSidebar from '@loke/ui/components/AppSidebar.svelte';
  import AppToasts from '@loke/ui/components/AppToasts.svelte';
</script>

<div class="h-screen w-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
  <AppSidebar />
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <AppHeader title="Loke Cards" />
    <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      <slot />
    </main>
  </div>
  <AppToasts />
</div>

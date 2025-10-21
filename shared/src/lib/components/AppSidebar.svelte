<script>
  import { isSidebarOpen, closeSidebar } from '../stores/ui.store.js';
  import { onMount } from 'svelte';
  import SidebarMenu from './SidebarMenu.svelte';
  let open;
  const unsubscribe = isSidebarOpen.subscribe((v) => (open = v));
  onMount(() => () => unsubscribe());
  
</script>

<!-- Desktop sidebar -->
<aside class="hidden md:flex md:flex-col md:w-60 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
  <div class="p-3 text-sm text-gray-700 dark:text-gray-300">
    <SidebarMenu />
  </div>
  <div class="mt-auto p-3 text-xs text-gray-500">Sidebar</div>
  
</aside>

<!-- Mobile drawer overlay -->
{#if open}
  <div class="md:hidden fixed inset-0 z-40 bg-black/40" on:click={closeSidebar}></div>
  <aside class="md:hidden fixed z-50 inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-3">
    <button class="mb-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" on:click={closeSidebar} aria-label="Close menu">Close</button>
    <div class="text-sm text-gray-700 dark:text-gray-300">
      <SidebarMenu />
    </div>
  </aside>
{/if}

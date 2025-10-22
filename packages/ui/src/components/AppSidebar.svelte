<script lang="ts">
  import { onMount } from 'svelte';
  
  let cardsMenuItems: Array<{ label: string; href: string; icon?: string }> = [];
  let graphMenuItems: Array<{ label: string; href: string; icon?: string }> = [];
  let loading = true;
  
  onMount(async () => {
    try {
      // Load cards menu
      const cardsModule = await import('@loke/apps-cards');
      cardsMenuItems = cardsModule.cardsMenu || [];

      // Load graph menu (if available)
      try {
        const graphModule = await import('@loke/apps-graph');
        graphMenuItems = graphModule.graphMenu || [];
      } catch (e) {
        // Graph module not available
        console.log('Graph menu not available');
      }
    } catch (error) {
      console.error('Failed to load menus:', error);
    } finally {
      loading = false;
    }
  });
</script>

<aside class="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
  <nav class="space-y-6">
    <!-- Main Navigation -->
    <div>
      <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        Main
      </h3>
      <div class="space-y-1">
        <a href="/" class="block px-3 py-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700">
          📊 Dashboard
        </a>
        <a href="/settings" class="block px-3 py-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700">
          ⚙️ Settings
        </a>
      </div>
    </div>
    
    <!-- Cards Section -->
    {#if cardsMenuItems.length > 0}
      <div>
        <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Cards
        </h3>
        <div class="space-y-1">
          {#each cardsMenuItems as item}
            <a href={item.href} class="block px-3 py-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700">
              {item.icon} {item.label}
            </a>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Graph Section -->
    {#if graphMenuItems.length > 0}
      <div>
        <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Graph
        </h3>
        <div class="space-y-1">
          {#each graphMenuItems as item}
            <a href={item.href} class="block px-3 py-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700">
              {item.icon} {item.label}
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </nav>
</aside>
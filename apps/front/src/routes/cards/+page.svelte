<script lang="ts">
  import { onMount } from 'svelte';
  let loaded = false;
  onMount(async () => {
    // Lazy-load the Cards micro-app entry (placeholder module)
    await import('@apps-cards/index.ts');
    loaded = true;
  });
</script>

<h2 class="text-xl font-semibold">Cards Micro-App</h2>
{#if !loaded}
  <p>Loading…</p>
{/if}


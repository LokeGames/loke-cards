<script lang="ts">
  import { onMount } from 'svelte';
  let loaded = false;
  onMount(async () => {
    await import('@apps-graph/index.ts');
    loaded = true;
  });
</script>

<h2 class="text-xl font-semibold">Graph Micro-App</h2>
{#if !loaded}
  <p>Loading…</p>
{/if}


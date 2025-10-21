<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export type StateChange = { key: string; value: string };
  export let items: StateChange[] = [];
  const dispatch = createEventDispatcher<{ change: { items: StateChange[] } }>();

  function add() {
    items = [...items, { key: '', value: '' }];
    dispatch('change', { items });
  }
  function remove(index: number) {
    items = items.filter((_, i) => i !== index);
    dispatch('change', { items });
  }
</script>

<div>
  <div class="flex justify-between items-center mb-2">
    <h3 class="font-medium">State Changes</h3>
    <button class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800" on:click={add} aria-label="Add state change">Add</button>
  </div>
  <ul>
    {#each items as sc, i}
      <li class="flex items-center gap-2 mb-1" data-testid="state-row">
        <input class="w-40 rounded border border-gray-300 px-2 py-1" placeholder="Key" bind:value={sc.key} />
        <input class="flex-1 rounded border border-gray-300 px-2 py-1" placeholder="Value" bind:value={sc.value} />
        <button class="px-2 py-1 rounded bg-red-600 text-white" on:click={() => remove(i)} aria-label="Remove state change">×</button>
      </li>
    {/each}
  </ul>
</div>


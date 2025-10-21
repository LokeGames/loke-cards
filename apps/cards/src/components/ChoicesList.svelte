<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export type Choice = { id: string; text: string; next?: string };
  export let items: Choice[] = [];
  const dispatch = createEventDispatcher<{ change: { items: Choice[] } }>();

  function add() {
    const id = `choice-${Math.random().toString(36).slice(2, 6)}`;
    items = [...items, { id, text: '' }];
    dispatch('change', { items });
  }
  function remove(id: string) {
    items = items.filter((c) => c.id !== id);
    dispatch('change', { items });
  }
</script>

<div>
  <div class="flex justify-between items-center mb-2">
    <h3 class="font-medium">Choices</h3>
    <button class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800" on:click={add} aria-label="Add choice">Add</button>
  </div>
  <ul>
    {#each items as c (c.id)}
      <li class="flex items-center gap-2 mb-1" data-testid="choice-row">
        <input class="flex-1 rounded border border-gray-300 px-2 py-1" placeholder="Choice text" bind:value={c.text} />
        <input class="w-40 rounded border border-gray-300 px-2 py-1" placeholder="Next scene id" bind:value={c.next} />
        <button class="px-2 py-1 rounded bg-red-600 text-white" on:click={() => remove(c.id)} aria-label="Remove choice">×</button>
      </li>
    {/each}
  </ul>
</div>


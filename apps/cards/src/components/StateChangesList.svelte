<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import StateSelect from './StateSelect.svelte';

  export type StateChange = {
    stateId: string;
    operation: string;
    value: string | number | boolean;
  };

  export let items: StateChange[] = [];
  const dispatch = createEventDispatcher<{ change: { items: StateChange[] } }>();

  function add() {
    items = [...items, { stateId: '', operation: 'set', value: '' }];
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
        <StateSelect
          bind:stateId={sc.stateId}
          bind:operation={sc.operation}
          bind:value={sc.value}
          size="small"
        />
        <button class="px-2 py-1 rounded bg-red-600 text-white" on:click={() => remove(i)} aria-label="Remove state change">×</button>
      </li>
    {/each}
  </ul>
</div>


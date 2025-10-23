<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '@loke/shared/database';
  import type { StateVariable } from '@loke/shared';

  export let stateId: string = '';
  export let operation: string = 'set';
  export let value: string | number | boolean = '';
  export let size: 'default' | 'small' = 'default';

  let states: StateVariable[] = [];
  let selectedState: StateVariable | null = null;

  onMount(async () => {
    try {
      states = await db.getAllStates();
      if (stateId) {
        selectedState = states.find(s => s.id === stateId) || null;
      }
    } catch (e) {
      console.error('Failed to load states:', e);
    }
  });

  function onStateChange() {
    selectedState = states.find(s => s.id === stateId) || null;

    // Reset operation and value when state changes
    if (selectedState) {
      if (selectedState.type === 'number') {
        operation = 'add';
        value = 0;
      } else if (selectedState.type === 'boolean') {
        operation = 'toggle';
        value = true;
      } else {
        operation = 'set';
        value = '';
      }
    }
  }

  function getOperationsForType(type: string): Array<{value: string, label: string}> {
    switch (type) {
      case 'number':
        return [
          { value: 'set', label: 'Set to' },
          { value: 'add', label: 'Add' },
          { value: 'subtract', label: 'Subtract' }
        ];
      case 'boolean':
        return [
          { value: 'set', label: 'Set to' },
          { value: 'toggle', label: 'Toggle' }
        ];
      case 'string':
      default:
        return [
          { value: 'set', label: 'Set to' }
        ];
    }
  }

  $: operations = selectedState ? getOperationsForType(selectedState.type) : [];
</script>

<div class="flex items-center gap-2" class:w-full={size === 'default'}>
  <!-- State Variable Select -->
  <select
    bind:value={stateId}
    on:change={onStateChange}
    class="rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
    class:flex-1={size === 'default'}
    class:w-32={size === 'small'}
  >
    <option value="">Select state...</option>
    {#each states as state}
      <option value={state.id}>
        {state.name} ({state.type})
      </option>
    {/each}
    {#if states.length === 0}
      <option value="" disabled>(no states defined)</option>
    {/if}
  </select>

  {#if selectedState}
    <!-- Operation Select -->
    <select
      bind:value={operation}
      class="rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
      class:w-28={size === 'small'}
      class:w-32={size === 'default'}
    >
      {#each operations as op}
        <option value={op.value}>{op.label}</option>
      {/each}
    </select>

    <!-- Value Input (conditional on operation) -->
    {#if operation !== 'toggle'}
      {#if selectedState.type === 'number'}
        <input
          type="number"
          bind:value
          placeholder="Value"
          class="rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          class:w-20={size === 'small'}
          class:w-28={size === 'default'}
        />
      {:else if selectedState.type === 'boolean'}
        <select
          bind:value
          class="rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          class:w-20={size === 'small'}
          class:w-28={size === 'default'}
        >
          <option value={true}>True</option>
          <option value={false}>False</option>
        </select>
      {:else}
        <input
          type="text"
          bind:value
          placeholder="Value"
          class="flex-1 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
      {/if}
    {/if}
  {/if}
</div>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{ change: { value: string; valid: boolean } }>();
  export let value: string = '';
  export let label: string = 'Scene ID';
  
  const pattern = /^[A-Za-z_][A-Za-z0-9_]*$/;
  $: valid = pattern.test(value);
  function onInput(e: Event) {
    value = (e.target as HTMLInputElement).value;
    dispatch('change', { value, valid });
  }
</script>

<label class="block text-sm font-medium" for="scene-id-input">{label}</label>
<input id="scene-id-input" class="mt-1 w-full rounded border px-2 py-1"
  class:border-red-500={!valid}
  class:border-gray-300={valid}
  bind:value
  on:input={onInput}
  aria-invalid={!valid}
  aria-describedby="sceneid-help"
  />
<p id="sceneid-help" class="text-xs mt-1" class:text-red-600={!valid} class:text-gray-500={valid}>
  {#if valid}
    Must be a valid C identifier.
  {:else}
    Invalid ID. Use letters, digits, and underscores; start with letter or underscore.
  {/if}
</p>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let value: string = '';
  export let label: string = 'Scene Text';
  export let maxLength: number = 500;
  const dispatch = createEventDispatcher<{ input: { value: string } }>();
  function onInput(e: Event) {
    value = (e.target as HTMLTextAreaElement).value;
    if (value.length > maxLength) value = value.slice(0, maxLength);
    dispatch('input', { value });
  }
</script>

<label class="block text-sm font-medium">{label}</label>
<textarea class="mt-1 w-full rounded border border-gray-300 px-2 py-1 bg-white dark:bg-gray-900"
  bind:value
  on:input={onInput}
  {maxLength}
  rows={8}
  aria-label={label}
/>
<div class="text-xs text-gray-500 mt-1" aria-live="polite">{value.length} / {maxLength}</div>

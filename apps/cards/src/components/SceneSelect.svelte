<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { db } from '@loke/shared/database';
  import type { Scene } from '@schemas';

  export let value: string = '';
  export let label: string = 'Scene';
  export let placeholder: string = 'Select scene…';
  export let size: 'default' | 'small' = 'default';

  let scenes: Scene[] = [];
  const dispatch = createEventDispatcher<{ change: { sceneId: string } }>();

  onMount(async () => {
    try {
      scenes = await db.getAllScenes();
    } catch (e) {
      console.error('Failed to load scenes:', e);
      scenes = [];
    }
  });

  function onChange(e: Event) {
    value = (e.target as HTMLSelectElement).value;
    dispatch('change', { sceneId: value });
  }
</script>

{#if label}
  <label class="block text-sm font-medium" for="scene-select">{label}</label>
{/if}
<select
  id="scene-select"
  class="mt-1 rounded border border-gray-300 px-2 py-1 bg-white dark:bg-gray-900"
  class:w-full={size === 'default'}
  class:w-40={size === 'small'}
  bind:value
  on:change={onChange}
  aria-label={label}
>
  <option value="" disabled selected={value === ''}>{placeholder}</option>
  {#each scenes as s}
    <option value={s.id}>{s.title || s.sceneId || s.id}</option>
  {/each}
  {#if scenes.length === 0}
    <option value="" disabled>(no scenes)</option>
  {/if}
</select>

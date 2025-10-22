<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { getChapters } from '../lib/dataClient';
  import type { Chapter } from '@schemas';

  export let value: string = '';
  export let label: string = 'Chapter';
  export let placeholder: string = 'Select chapter…';
  let chapters: Chapter[] = [];
  const dispatch = createEventDispatcher<{ change: { chapterId: string } }>();

  onMount(async () => {
    try {
      chapters = await getChapters();
    } catch (e) {
      chapters = [];
    }
  });

  function onChange(e: Event) {
    value = (e.target as HTMLSelectElement).value;
    dispatch('change', { chapterId: value });
  }
</script>

<label class="block text-sm font-medium" for="chapter-select">{label}</label>
<select id="chapter-select" class="mt-1 w-full rounded border border-gray-300 px-2 py-1 bg-white dark:bg-gray-900"
  bind:value
  on:change={onChange}
  aria-label={label}
>
  <option value="" disabled selected={value==='' }>{placeholder}</option>
  {#each chapters as c}
    <option value={c.chapterId}>{c.title}</option>
  {/each}
  {#if chapters.length === 0}
    <option value="" disabled>(no chapters)</option>
  {/if}
</select>

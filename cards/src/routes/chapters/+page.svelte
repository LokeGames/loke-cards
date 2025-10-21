<script lang="ts">
  import { onMount } from 'svelte';
  import { storage, BaseButton } from '@shared';
  type Chapter = import('@shared/src/lib/storage').Chapter;
  let chapters: Chapter[] = [];
  let loading = true;
  onMount(async () => {
    try { chapters = await storage.getAllChapters(); } catch {}
    loading = false;
  });
</script>

<header class="flex items-center justify-between">
  <h2 class="text-xl font-semibold">Chapters</h2>
  <a href="/chapter/new"><BaseButton variant="primary">New Chapter</BaseButton></a>
</header>

{#if loading}
  <p>Loading…</p>
{:else if chapters.length === 0}
  <p class="text-sm opacity-70">No chapters yet.</p>
{:else}
  <ul class="space-y-2">
    {#each chapters as c}
      <li class="rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <div class="font-medium">{c.name} <span class="opacity-60">({c.id})</span></div>
        <div class="text-xs opacity-70">Order: {c.order}</div>
      </li>
    {/each}
  </ul>
{/if}

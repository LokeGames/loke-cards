<script lang="ts">
  import { onMount } from 'svelte';
  import { storage, BaseButton } from '@shared';
  type Scene = import('@shared/src/lib/storage').Scene;
  let scenes: Scene[] = [];
  let loading = true;
  onMount(async () => {
    try { scenes = await storage.getAllScenes(); } catch {}
    loading = false;
  });
</script>

<header class="flex items-center justify-between">
  <h2 class="text-xl font-semibold">Scenes</h2>
  <a href="/scene/new"><BaseButton variant="primary">New Scene</BaseButton></a>
</header>

{#if loading}
  <p>Loading…</p>
{:else if scenes.length === 0}
  <p class="text-sm opacity-70">No scenes yet.</p>
{:else}
  <ul class="space-y-2">
    {#each scenes as s}
      <li class="rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <div class="font-medium">{s.sceneId}</div>
        <div class="text-xs opacity-70">Chapter: {s.chapter}</div>
        <a class="text-blue-600 hover:underline text-sm" href={`/scene/${encodeURIComponent(s.id)}`}>Edit</a>
      </li>
    {/each}
  </ul>
{/if}

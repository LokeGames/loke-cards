<script lang="ts">
  import { onMount } from 'svelte';
  import * as Comlink from 'comlink';
  import type { Scene } from '@schemas';

  let scenes: Scene[] = [];
  let src = '';
  let dst = '';
  let sceneTitle = '';
  let sceneId = '';

  async function getApi() {
    const worker = new SharedWorker(new URL('@workers-data/worker.ts', import.meta.url), { type: 'module' });
    worker.port.start();
    return Comlink.wrap<{ cards: any; graph: any }>(worker.port);
  }

  async function refresh() {
    const api = await getApi();
    scenes = await api.cards.list();
  }

  onMount(refresh);

  async function createScene() {
    const api = await getApi();
    const now = Date.now();
    const payload: Scene = { sceneId: sceneId || sceneTitle.toLowerCase().replace(/\s+/g, '-'), chapterId: 'ch-1', title: sceneTitle || 'New Scene', createdAt: now, updatedAt: now };
    await api.cards.create(payload);
    await refresh();
  }

  async function createLink() {
    if (!src || !dst) return;
    const api = await getApi();
    await api.graph.createLink(src, dst);
  }
</script>

<div class="flex flex-col gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
  <div class="flex gap-2 items-end">
    <div>
      <label class="block text-xs">Scene Title</label>
      <input class="rounded border px-2 py-1" bind:value={sceneTitle} placeholder="Title" />
    </div>
    <div>
      <label class="block text-xs">Scene ID</label>
      <input class="rounded border px-2 py-1" bind:value={sceneId} placeholder="Optional" />
    </div>
    <button class="px-2 py-1 rounded bg-blue-600 text-white" on:click={createScene} data-testid="gc-create-scene">Create Scene</button>
  </div>

  <div class="flex gap-2 items-end">
    <div>
      <label class="block text-xs">Source</label>
      <select class="rounded border px-2 py-1" bind:value={src} data-testid="gc-src">
        <option value="">Select…</option>
        {#each scenes as s}
          <option value={s.sceneId}>{s.sceneId}</option>
        {/each}
      </select>
    </div>
    <div>
      <label class="block text-xs">Target</label>
      <select class="rounded border px-2 py-1" bind:value={dst} data-testid="gc-dst">
        <option value="">Select…</option>
        {#each scenes as s}
          <option value={s.sceneId}>{s.sceneId}</option>
        {/each}
      </select>
    </div>
    <button class="px-2 py-1 rounded bg-green-600 text-white" on:click={createLink} data-testid="gc-create-link">Create Link</button>
  </div>
</div>


<script lang="ts">
  import { onMount } from 'svelte';
  import { createDataWorkerClient } from '$lib/dataWorkerClient';
  import type { Scene } from '@schemas';

  let id = 'e2e-scene-2';
  let updatedTitle = '';
  let afterDelete = 'unknown';
  let error = '';

  onMount(async () => {
    const client = createDataWorkerClient();
    try {
      const now = Date.now();
      const scene: Scene = { sceneId: id, chapterId: 'ch-1', title: 'S2', createdAt: now, updatedAt: now };
      await client.cards.create(scene);
      const updated: Scene = { ...scene, title: 'S2-Updated', updatedAt: Date.now() };
      await client.cards.update(updated);
      const got = await client.cards.get(id);
      updatedTitle = got?.title || '';
      await client.cards.delete(id);
      const after = await client.cards.get(id);
      afterDelete = after ? 'exists' : 'null';
    } catch (e) {
      error = 'failed';
    }
  });
</script>

<h2 class="text-lg font-semibold">Worker Cards CRUD</h2>
{#if error}
  <p data-testid="worker-cards-crud-error">{error}</p>
{:else}
  <div>
    <p data-testid="worker-cards-crud-updated-title">{updatedTitle}</p>
    <p data-testid="worker-cards-crud-after-delete">{afterDelete}</p>
  </div>
{/if}


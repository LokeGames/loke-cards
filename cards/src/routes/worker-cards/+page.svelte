<script lang="ts">
  import { onMount } from 'svelte';
  import { createDataWorkerClient } from '$lib/dataWorkerClient';
  import type { Scene } from '@schemas';

  let createdId = 'e2e-scene-1';
  let list: Scene[] = [];
  let error = '';

  onMount(async () => {
    const client = createDataWorkerClient();
    try {
      const now = Date.now();
      const scene: Scene = {
        sceneId: createdId,
        chapterId: 'chapter-1',
        title: 'E2E Scene',
        createdAt: now,
        updatedAt: now,
      };
      await client.cards.create(scene);
      list = await client.cards.list();
    } catch (e) {
      error = 'failed';
    }
  });
</script>

<h2 class="text-lg font-semibold">Worker Cards Test</h2>
{#if error}
  <p data-testid="worker-cards-error">{error}</p>
{:else}
  <div>
    <p data-testid="worker-cards-count">{list.length}</p>
    <ul>
      {#each list as s}
        <li data-testid="worker-card-id">{s.sceneId}</li>
      {/each}
    </ul>
  </div>
{/if}


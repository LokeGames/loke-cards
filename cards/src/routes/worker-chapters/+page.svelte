<script lang="ts">
  import { onMount } from 'svelte';
  import { createDataWorkerClient } from '$lib/dataWorkerClient';
  import type { Chapter } from '@schemas';

  let id = 'ch-e2e-1';
  let updatedTitle = '';
  let deleted = false;
  let afterDelete = 'unknown';
  let error = '';

  onMount(async () => {
    const client = createDataWorkerClient();
    try {
      const now = Date.now();
      const chapter: Chapter = { chapterId: id, title: 'Chapter 1', createdAt: now, updatedAt: now };
      await client.chapters.create(chapter);
      const updated: Chapter = { ...chapter, title: 'Updated Title', updatedAt: Date.now() };
      await client.chapters.update(updated);
      const got = await client.chapters.get(id);
      updatedTitle = got?.title || '';
      deleted = await client.chapters.delete(id);
      const after = await client.chapters.get(id);
      afterDelete = after ? 'exists' : 'null';
    } catch (e) {
      error = 'failed';
    }
  });
</script>

<h2 class="text-lg font-semibold">Worker Chapters CRUD</h2>
{#if error}
  <p data-testid="worker-chapters-error">{error}</p>
{:else}
  <div>
    <p data-testid="worker-chapters-updated-title">{updatedTitle}</p>
    <p data-testid="worker-chapters-deleted">{deleted}</p>
    <p data-testid="worker-chapters-after-delete">{afterDelete}</p>
  </div>
{/if}


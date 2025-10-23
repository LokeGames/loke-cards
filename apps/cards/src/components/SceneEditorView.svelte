<script lang="ts">
  import { onMount } from 'svelte';
  import { SceneIdInput } from '../index';
  import { ChapterSelect } from '../index';
  import { SceneTextEditor } from '../index';
  import { ChoicesList } from '../index';
  import { StateChangesList } from '../index';
  import { db } from '@loke/shared/database';
  import type { Scene } from '@schemas';

  export let sceneId: string | null = null;
  let chapterId = '';
  let title = '';
  let sceneText = '';
  let choices: { id: string; text: string; next?: string }[] = [];
  let state: { key: string; value: string }[] = [];
  let status: string = '';

  onMount(async () => {
    if (!sceneId) return;
    const existing = await db.getScene(sceneId);
    if (existing) {
      chapterId = existing.chapterId || existing.chapter || '';
      title = existing.title || '';
      sceneText = existing.sceneText || '';
    }
  });

  async function save() {
    const now = Date.now();
    const s: Scene = {
      sceneId: sceneId || title.toLowerCase().replace(/\s+/g, '-'),
      chapterId,
      title,
      sceneText,
      createdAt: now,
      updatedAt: now,
    } as Scene;
    if (sceneId) {
      await db.updateScene(sceneId, s);
    } else {
      await db.createScene(s);
      sceneId = s.sceneId;
    }
    status = 'saved';
  }
</script>

<div class="space-y-4">
  <div>
    <label class="block text-sm font-medium" for="scene-title">Title</label>
    <input id="scene-title" class="mt-1 w-full rounded border border-gray-300 px-2 py-1" bind:value={title} aria-label="Title" />
  </div>
  <SceneIdInput bind:value={sceneId} label="Scene ID" />
  <ChapterSelect bind:value={chapterId} />
  <SceneTextEditor bind:value={sceneText} maxLength={500} />

  <ChoicesList bind:items={choices} />
  <StateChangesList bind:items={state} />

  <button class="px-3 py-2 rounded bg-blue-600 text-white" on:click={save} data-testid="save-btn">Save</button>
  {#if status}
    <div data-testid="save-status">{status}</div>
  {/if}
</div>

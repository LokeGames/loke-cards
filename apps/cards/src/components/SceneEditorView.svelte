<script lang="ts">
  import { onMount } from 'svelte';
  import { SceneIdInput } from '../index';
  import { ChapterSelect } from '../index';
  import { SceneTextEditor } from '../index';
  import { ChoicesList } from '../index';
  import { StateChangesList } from '../index';
  import type { Scene } from '@schemas';
  import * as Comlink from 'comlink';

  type DataApi = {
    cards: {
      get(id: string): Promise<Scene | null>;
      create(s: Scene): Promise<Scene>;
      update(s: Scene): Promise<Scene>;
      list(): Promise<Scene[]>;
    };
  };

  export let sceneId: string | null = null;
  let chapterId = '';
  let title = '';
  let sceneText = '';
  let choices: { id: string; text: string; next?: string }[] = [];
  let state: { key: string; value: string }[] = [];
  let status: string = '';

  let api: Comlink.Remote<DataApi> | null = null;
  function getApi() {
    if (api) return api;
    const worker = new SharedWorker(new URL('@workers-data/worker.ts', import.meta.url), { type: 'module' });
    worker.port.start();
    api = Comlink.wrap<DataApi>(worker.port);
    return api;
  }

  onMount(async () => {
    if (!sceneId) return;
    const a = getApi();
    const existing = await a.cards.get(sceneId);
    if (existing) {
      chapterId = existing.chapterId;
      title = existing.title;
      sceneText = existing.sceneText || '';
    }
  });

  async function save() {
    const a = getApi();
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
      await a.cards.update(s);
    } else {
      await a.cards.create(s);
      sceneId = s.sceneId;
    }
    status = 'saved';
  }
</script>

<div class="space-y-4">
  <div>
    <label class="block text-sm font-medium">Title</label>
    <input class="mt-1 w-full rounded border border-gray-300 px-2 py-1" bind:value={title} aria-label="Title" />
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


<script lang="ts">
  import { onMount } from 'svelte';
  import * as Comlink from 'comlink';
  import type { Chapter } from '@schemas';

  export let showList = true;

  type DataApi = {
    chapters: {
      list(): Promise<Chapter[]>;
      create(chapter: Chapter): Promise<Chapter>;
    };
  };

  let chapters: Chapter[] = [];
  let title = '';
  let status = '';
  let loading = false;

  let api: Comlink.Remote<DataApi> | null = null;

  function getApi() {
    if (api) return api;
    const worker = new SharedWorker(new URL('@workers-data/worker.ts', import.meta.url), { type: 'module' });
    worker.port.start();
    api = Comlink.wrap<DataApi>(worker.port);
    return api;
  }

  async function loadChapters() {
    if (!showList) return;
    loading = true;
    try {
      chapters = await getApi().chapters.list();
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadChapters();
  });

  async function createChapter() {
    const name = title.trim();
    if (!name) {
      status = 'Angiv en titel til kapitlet.';
      return;
    }
    const now = Date.now();
    const chapterId = name.toLowerCase().replace(/\s+/g, '-');
    await getApi().chapters.create({
      chapterId,
      title: name,
      createdAt: now,
      updatedAt: now,
    });
    status = 'Nyt kapitel oprettet.';
    title = '';
    await loadChapters();
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    createChapter();
  }
</script>

<section class="space-y-4">
  <h1 class="text-2xl font-semibold">Kapiteladministration</h1>
  <form class="space-y-2" on:submit|preventDefault={handleSubmit}>
    <label class="block text-sm font-medium" for="chapter-title">Titel</label>
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end">
      <input
        id="chapter-title"
        class="flex-1 rounded border border-gray-300 px-3 py-2"
        bind:value={title}
        placeholder="Nyt kapitel"
        autocomplete="off"
      />
      <button class="px-3 py-2 rounded bg-blue-600 text-white" type="submit">Opret kapitel</button>
    </div>
  </form>
  {#if status}
    <p class="text-sm text-green-600 dark:text-green-400" data-testid="chapter-status">{status}</p>
  {/if}

  {#if showList}
    <div class="space-y-2">
      <h2 class="text-lg font-semibold">Eksisterende kapitler</h2>
      {#if loading}
        <p>Indlæser kapitler…</p>
      {:else if chapters.length === 0}
        <p class="text-sm text-gray-600 dark:text-gray-300">Ingen kapitler oprettet endnu.</p>
      {:else}
        <ul class="divide-y divide-gray-200 dark:divide-gray-700 rounded border border-gray-200 dark:border-gray-700">
          {#each chapters as chapter}
            <li class="p-3 flex items-center justify-between">
              <div>
                <p class="font-medium">{chapter.title}</p>
                <p class="text-xs text-gray-500">ID: {chapter.chapterId}</p>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</section>

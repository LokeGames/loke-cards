<script lang="ts">
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { db } from "@loke/shared/database";
  import type { Chapter } from "@loke/shared";
  import { Plus, BookOpen } from "lucide-svelte";

  let chapters: Chapter[] = [];
  let loading = true;

  async function loadChapters() {
    loading = true;
    try {
      chapters = await db.getAllChapters();
    } catch (error) {
      console.error("Failed to load chapters:", error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadChapters();
  });

  afterNavigate(() => {
    loadChapters();
  });

  function formatDate(dateStr?: string): string {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  }
</script>

<div class="h-full overflow-auto p-6">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Chapters</h1>
    <a
      href="/cards/chapters/new"
      class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
    >
      <Plus size={20} />
      New Chapter
    </a>
  </div>

  {#if loading}
    <div class="py-12 text-center">
      <div class="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading chapters...</p>
    </div>
  {:else if chapters.length === 0}
    <div class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center dark:border-gray-600 dark:bg-gray-800">
      <div class="mb-4 flex justify-center">
        <BookOpen size={64} class="text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No chapters yet</h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Get started by creating your first chapter</p>
      <a
        href="/cards/chapters/new"
        class="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
      >
        <Plus size={20} />
        Create Chapter
      </a>
    </div>
  {:else}
    <div class="grid gap-4">
      {#each chapters as chapter}
        <div class="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {chapter.name || chapter.title || chapter.id}
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                ID:
                <code class="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">{chapter.id}</code>
              </p>
              {#if chapter.description}
                <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">{chapter.description}</p>
              {/if}
            </div>
            <div class="ml-4 flex gap-2">
              <a
                href={`/cards/chapters/edit/${chapter.id}`}
                class="rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
              >
                Edit
              </a>
              <button
                type="button"
                class="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
                on:click={() => {
                  if (confirm(`Delete chapter "${chapter.name || chapter.title || chapter.id}"?`)) {
                    db.deleteChapter(chapter.id).then(() => {
                      chapters = chapters.filter((c) => c.id !== chapter.id);
                    });
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Created: {formatDate(chapter.createdAt)}</span>
            <span>Updated: {formatDate(chapter.updatedAt)}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

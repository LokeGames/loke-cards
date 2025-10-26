<script lang="ts">
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { db } from "@loke/shared/database";
  import type { Scene } from "@loke/shared";
  import { Plus, FileText } from "lucide-svelte";

  let scenes: Scene[] = [];
  let loading = true;

  async function loadScenes() {
    loading = true;
    try {
      scenes = await db.getAllScenes();
    } catch (error) {
      console.error("Failed to load scenes:", error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadScenes();
  });

  afterNavigate(() => {
    loadScenes();
  });

  function formatDate(dateStr?: string): string {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  }

  function previewScene(scene: Scene): string | null {
    const text = scene.sceneText?.trim();
    if (!text) {
      return null;
    }
    return text.length > 150 ? `${text.substring(0, 150)}...` : text;
  }
</script>

<div class="h-full overflow-auto p-6">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Scenes</h1>
    <a
      href="/cards/scenes/new"
      class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
    >
      <Plus size={20} />
      New Scene
    </a>
  </div>

  {#if loading}
    <div class="py-12 text-center">
      <div class="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading scenes...</p>
    </div>
  {:else if scenes.length === 0}
    <div class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center dark:border-gray-600 dark:bg-gray-800">
      <div class="mb-4 flex justify-center">
        <FileText size={64} class="text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No scenes yet</h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Get started by creating your first scene</p>
      <a
        href="/cards/scenes/new"
        class="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        <Plus size={20} />
        Create Scene
      </a>
    </div>
  {:else}
    <div class="grid gap-4">
      {#each scenes as scene}
        <div class="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{scene.title || scene.sceneId}</h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                ID:
                <code class="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">{scene.sceneId}</code>
              </p>
              {#if scene.chapterId}
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Chapter: {scene.chapterId}</p>
              {/if}
              {#if previewScene(scene)}
                <p class="mt-2 line-clamp-2 text-sm text-gray-700 dark:text-gray-300">{previewScene(scene)}</p>
              {/if}
            </div>
            <div class="ml-4 flex gap-2">
              <a
                href={`/cards/scenes/edit/${scene.id}`}
                class="rounded bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
              >
                Edit
              </a>
              <button
                type="button"
                class="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
                on:click={() => {
                  if (confirm(`Delete scene "${scene.title || scene.sceneId}"?`)) {
                    db.deleteScene(scene.id).then(() => {
                      scenes = scenes.filter((s) => s.id !== scene.id);
                    });
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Created: {formatDate(scene.createdAt)}</span>
            <span>Updated: {formatDate(scene.updatedAt)}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

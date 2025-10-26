<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { db } from "@loke/shared/database";
  import ChapterForm from "../../components/ChapterForm.svelte";
  import { X } from "lucide-svelte";

  let chapterId = "";
  let name = "";
  let description = "";
  let loading = true;
  let saving = false;
  let error = "";

  onMount(async () => {
    const id = $page.params.id;

    if (!id) {
      error = "No chapter ID provided";
      loading = false;
      return;
    }

    try {
      const chapter = await db.getChapter(id);
      if (!chapter) {
        error = "Chapter not found";
        loading = false;
        return;
      }

      chapterId = chapter.id;
      name = chapter.name || chapter.title || "";
      description = chapter.description || "";
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load chapter";
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(
    event: CustomEvent<{ chapterId: string; name: string; description: string }>,
  ) {
    error = "";
    const { name: rawName, description: rawDesc } = event.detail;

    if (!rawName.trim()) {
      error = "Title is required";
      return;
    }

    saving = true;
    try {
      await db.updateChapter(chapterId, {
        name: rawName.trim(),
        description: rawDesc.trim(),
      });
      goto("/cards/chapters");
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to update chapter";
    } finally {
      saving = false;
    }
  }

  function handleCancel() {
    goto("/cards/chapters");
  }

  function handleClose() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      goto("/cards/chapters");
    }
  }
</script>

<div class="mx-auto h-full max-w-2xl overflow-auto p-6">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Chapter</h1>
    <button
      type="button"
      class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      title="Close and return to previous page"
      onclick={handleClose}
    >
      <X size={24} class="text-gray-600 dark:text-gray-400" />
    </button>
  </div>

  {#if loading}
    <div class="py-12 text-center">
      <div class="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading chapter...</p>
    </div>
  {:else if error && !name}
    <div class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <p class="text-sm text-red-800 dark:text-red-200">{error}</p>
      <a href="/cards/chapters" class="mt-4 inline-block text-sm text-red-600 hover:underline dark:text-red-400">
        ← Back to chapters
      </a>
    </div>
  {:else}
    <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <ChapterForm
        bind:chapterId
        bind:name
        bind:description
        bind:saving
        bind:error
        isEditMode={true}
        on:submit={handleSubmit}
        on:cancel={handleCancel}
      />
    </div>
  {/if}
</div>

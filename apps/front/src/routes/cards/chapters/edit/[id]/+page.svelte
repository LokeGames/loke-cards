<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '@loke/shared/database';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { ChapterForm } from '@loke/apps-cards';
  import { X } from 'lucide-svelte';

  let chapterId = '';
  let name = '';
  let description = '';
  let loading = true;
  let saving = false;
  let error = '';

  onMount(async () => {
    const id = $page.params.id;

    if (!id) {
      error = 'No chapter ID provided';
      loading = false;
      return;
    }

    try {
      const chapter = await db.getChapter(id);

      if (!chapter) {
        error = 'Chapter not found';
        loading = false;
        return;
      }

      chapterId = chapter.id;
      name = chapter.name || chapter.title || '';
      description = chapter.description || '';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load chapter';
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(event: CustomEvent<{ chapterId: string; name: string; description: string }>) {
    error = '';
    const { name: rawName, description: rawDesc } = event.detail;

    if (!rawName.trim()) {
      error = 'Title is required';
      return;
    }

    saving = true;
    try {
      await db.updateChapter(chapterId, {
        name: rawName.trim(),
        description: rawDesc.trim(),
      });

      // Redirect to chapters list
      goto('/cards/chapters');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update chapter';
    } finally {
      saving = false;
    }
  }

  function handleCancel() {
    goto('/cards/chapters');
  }
</script>

<div class="p-6 max-w-2xl mx-auto">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Chapter</h1>
    <a
      href="/cards/chapters"
      class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      title="Close and return to chapters list"
    >
      <X size={24} class="text-gray-600 dark:text-gray-400" />
    </a>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading chapter...</p>
    </div>
  {:else if error && !name}
    <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-800 dark:text-red-200">{error}</p>
      <a href="/cards/chapters" class="mt-4 inline-block text-sm text-red-600 dark:text-red-400 hover:underline">
        ← Back to chapters
      </a>
    </div>
  {:else}
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
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

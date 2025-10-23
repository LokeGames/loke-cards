<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '@loke/shared/database';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let chapterId = '';
  let name = '';
  let description = '';
  let loading = true;
  let saving = false;
  let error = '';

  onMount(async () => {
    const id = $page.url.searchParams.get('id');

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

  async function handleSubmit() {
    error = '';

    if (!name.trim()) {
      error = 'Title is required';
      return;
    }

    saving = true;
    try {
      await db.updateChapter(chapterId, {
        name: name.trim(),
        description: description.trim(),
      });

      // Redirect to chapters list
      goto('/cards/chapters');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update chapter';
    } finally {
      saving = false;
    }
  }
</script>

<div class="p-6 max-w-2xl mx-auto">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Chapter</h1>

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
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <!-- Chapter ID (read-only) -->
        <div>
          <label for="chapterId" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Chapter ID (cannot be changed)
          </label>
          <input
            type="text"
            id="chapterId"
            value={chapterId}
            disabled
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>

        <!-- Title -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Title
          </label>
          <input
            type="text"
            id="name"
            bind:value={name}
            placeholder="e.g., The Beginning"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            bind:value={description}
            rows="4"
            placeholder="Brief description of this chapter..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        <!-- Error Message -->
        {#if error}
          <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        {/if}

        <!-- Actions -->
        <div class="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <a
            href="/cards/chapters"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  {/if}
</div>

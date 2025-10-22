<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '@loke/shared/database';
  import { goto } from '$app/navigation';

  let chapterId = '';
  let title = '';
  let description = '';
  let saving = false;
  let error = '';

  async function handleSubmit() {
    error = '';

    if (!chapterId.trim()) {
      error = 'Chapter ID is required';
      return;
    }

    if (!title.trim()) {
      error = 'Title is required';
      return;
    }

    saving = true;
    try {
      await db.createChapter({
        chapterId: chapterId.trim(),
        title: title.trim(),
        description: description.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Redirect to chapters list
      goto('/cards/chapters');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create chapter';
    } finally {
      saving = false;
    }
  }
</script>

<div class="p-6 max-w-2xl mx-auto">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create New Chapter</h1>

  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <!-- Chapter ID -->
      <div>
        <label for="chapterId" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Chapter ID
        </label>
        <input
          type="text"
          id="chapterId"
          bind:value={chapterId}
          placeholder="e.g., chapter01"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          required
        />
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Unique identifier for this chapter
        </p>
      </div>

      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          bind:value={title}
          placeholder="e.g., The Beginning"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
          {saving ? 'Creating...' : 'Create Chapter'}
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
</div>

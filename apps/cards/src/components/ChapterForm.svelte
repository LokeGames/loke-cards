<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Chapter } from '@loke/shared';

  export let chapterId: string = '';
  export let name: string = '';
  export let description: string = '';
  export let saving: boolean = false;
  export let error: string = '';
  export let isEditMode: boolean = false;

  const dispatch = createEventDispatcher<{
    submit: { chapterId: string; name: string; description: string };
    cancel: void;
  }>();

  function handleSubmit() {
    dispatch('submit', {
      chapterId: chapterId.trim(),
      name: name.trim(),
      description: description.trim()
    });
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  <!-- Chapter ID -->
  <div>
    <label for="chapterId" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
      Chapter ID {isEditMode ? '(cannot be changed)' : ''}
    </label>
    <input
      type="text"
      id="chapterId"
      bind:value={chapterId}
      disabled={isEditMode}
      placeholder={isEditMode ? '' : 'e.g., 01 or intro (will become chapter_01)'}
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
      class:bg-gray-100={isEditMode}
      class:dark:bg-gray-700={isEditMode}
      class:text-gray-500={isEditMode}
      class:dark:text-gray-400={isEditMode}
      class:cursor-not-allowed={isEditMode}
      required={!isEditMode}
    />
    {#if !isEditMode}
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Will be prefixed with "chapter_" if not starting with "chapter". Use only letters, numbers, and underscores.
      </p>
    {/if}
  </div>

  <!-- Title/Name -->
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
      {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Chapter'}
    </button>
    <button
      type="button"
      on:click={handleCancel}
      class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
    >
      Cancel
    </button>
  </div>
</form>

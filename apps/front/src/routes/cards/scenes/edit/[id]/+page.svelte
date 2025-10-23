<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { SceneEditorView } from '@loke/apps-cards';
  import { X } from 'lucide-svelte';

  // Get scene ID from URL parameter [id]
  $: sceneId = $page.params.id;

  function handleClose() {
    // Go back in history, or fallback to scenes list
    if (window.history.length > 1) {
      window.history.back();
    } else {
      goto('/cards/scenes');
    }
  }
</script>

<div class="p-6 max-w-4xl mx-auto">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
      {sceneId ? 'Edit Scene' : 'New Scene'}
    </h1>
    <button
      on:click={handleClose}
      class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      title="Close and return to previous page"
      type="button"
    >
      <X size={24} class="text-gray-600 dark:text-gray-400" />
    </button>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <SceneEditorView {sceneId} />
  </div>
</div>

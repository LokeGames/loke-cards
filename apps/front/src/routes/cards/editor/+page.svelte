<script lang="ts">
  import { onMount } from 'svelte';
  import { SceneEditorView } from '@loke/apps-cards';

  let sceneId: string | null = null;

  onMount(() => {
    // Get scene ID from URL query params
    const params = new URLSearchParams(window.location.search);
    sceneId = params.get('id');
  });
</script>

<div class="p-6 max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
    {sceneId ? 'Edit Scene' : 'New Scene'}
  </h1>

  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <SceneEditorView {sceneId} />
  </div>
</div>

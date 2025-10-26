<script lang="ts">
  import { SceneEditorView } from "../../components/SceneEditorView.svelte";
</script>

<div class="mx-auto h-full max-w-4xl overflow-auto p-6">
  <h1 class="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Create New Scene</h1>

  <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
    <SceneEditorView sceneId={null} />
  </div>
</div>

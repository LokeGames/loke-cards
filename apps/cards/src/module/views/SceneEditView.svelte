<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { SceneEditorView } from "../../components/SceneEditorView.svelte";
  import { X } from "lucide-svelte";

  const sceneId = $derived($page.params.id);

  function handleClose() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      goto("/cards/scenes");
    }
  }
</script>

<div class="mx-auto h-full max-w-4xl overflow-auto p-6">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{sceneId ? "Edit Scene" : "New Scene"}</h1>
    <button
      type="button"
      class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      title="Close and return to previous page"
      onclick={handleClose}
    >
      <X size={24} class="text-gray-600 dark:text-gray-400" />
    </button>
  </div>

  <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
    <SceneEditorView {sceneId} />
  </div>
</div>

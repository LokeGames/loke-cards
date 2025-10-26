<script lang="ts">
  import SceneEditorView from '../components/SceneEditorView.svelte';
  let sceneId: string | null = null;
</script>

<h2 class="text-xl font-semibold">Scene Editor</h2>
<SceneEditorView {sceneId} />


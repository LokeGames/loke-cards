<script lang="ts">
  import { BaseInput, BaseButton, storage, toastStore } from '@shared/src/index';
  let sceneId = '';
  let chapter = 'chapter01';
  let sceneText = '';
  let error = '';
  async function create() {
    error = '';
    const id = sceneId.trim();
    if (!id) { error = 'Scene ID is required'; return; }
    const now = Date.now();
    await storage.saveScene({ id, sceneId: id, chapter, sceneText, choices: [], stateChanges: [], createdAt: now, updatedAt: now });
    toastStore.addToast('Scene created', { type: 'success' });
    window.location.href = '/scenes';
  }
</script>

<h2 class="text-xl font-semibold mb-3">New Scene</h2>

<div class="max-w-xl space-y-3">
  <BaseInput id="scene-id" label="Scene ID" bind:value={sceneId} on:update={(e) => sceneId = e.detail} {error} />
  <BaseInput id="chapter" label="Chapter" bind:value={chapter} on:update={(e) => chapter = String(e.detail)} />
  <div>
    <label for="sceneText" class="block text-sm font-medium mb-1">Scene Text</label>
    <textarea id="sceneText" class="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2" rows="6" bind:value={sceneText}></textarea>
  </div>
  <div class="flex gap-2">
    <BaseButton variant="primary" on:click={create}>Create</BaseButton>
    <a href="/scenes" class="px-3 py-2 rounded border">Cancel</a>
  </div>
</div>


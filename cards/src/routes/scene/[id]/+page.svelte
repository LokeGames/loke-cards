<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { BaseInput, BaseButton, storage, toastStore } from '@shared';
  type Scene = import('@shared').storage.Scene;

  let scene: Scene | null = null;
  let loading = true;
  let error = '';
  $: id = $page.params.id;

  onMount(async () => {
    try {
      const s = await storage.getScene(id);
      if (s) scene = structuredClone(s);
    } catch {}
    loading = false;
  });

  async function save() {
    if (!scene) return;
    error = '';
    try {
      scene.updatedAt = Date.now();
      await storage.saveScene(scene);
      toastStore.addToast('Scene saved', { type: 'success' });
    } catch (e) {
      error = String(e);
    }
  }
</script>

{#if loading}
  <p>Loading…</p>
{:else if !scene}
  <p class="text-sm opacity-70">Scene not found.</p>
{:else}
  <h2 class="text-xl font-semibold mb-3">Edit Scene</h2>
  <div class="max-w-2xl space-y-3">
    <BaseInput id="scene-id" label="Scene ID" bind:value={scene.sceneId} on:update={(e) => (scene.sceneId = String(e.detail))} />
    <BaseInput id="chapter" label="Chapter" bind:value={scene.chapter} on:update={(e) => (scene.chapter = String(e.detail))} />
    <div>
      <label for="sceneText" class="block text-sm font-medium mb-1">Scene Text</label>
      <textarea id="sceneText" class="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2" rows="8" bind:value={scene.sceneText}></textarea>
    </div>

    {#if error}
      <div class="text-red-600 text-sm">{error}</div>
    {/if}
    <div class="flex gap-2">
      <BaseButton variant="primary" on:click={save}>Save</BaseButton>
      <a href="/scenes" class="px-3 py-2 rounded border">Back</a>
    </div>
  </div>
{/if}


<script lang="ts">
  import { BaseInput, BaseButton, storage, toastStore } from '@shared';
  let id = '';
  let name = '';
  let order = 1;
  let error = '';
  async function create() {
    error = '';
    const cid = id.trim();
    if (!cid) { error = 'Chapter ID is required'; return; }
    const now = Date.now();
    await storage.saveChapter({ id: cid, name: name || cid, scenes: [], order, createdAt: now, updatedAt: now });
    toastStore.addToast('Chapter created', { type: 'success' });
    window.location.href = '/chapters';
  }
</script>

<h2 class="text-xl font-semibold mb-3">New Chapter</h2>

<div class="max-w-2xl space-y-4">
  <BaseInput id="chapter-id" label="Chapter ID" bind:value={id} on:update={(e) => id = e.detail} {error} />
  <BaseInput id="chapter-name" label="Name" bind:value={name} on:update={(e) => name = String(e.detail)} />
  <BaseInput id="chapter-order" label="Order" bind:value={order} on:update={(e) => order = Number(e.detail)} />
  <div class="flex gap-2">
    <BaseButton variant="primary" on:click={create}>Create</BaseButton>
    <a href="/chapters" class="px-3 py-2 rounded border">Cancel</a>
  </div>
</div>

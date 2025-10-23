<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '@loke/shared/database';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { StateForm } from '@loke/apps-cards';
  import { X } from 'lucide-svelte';

  function handleClose() {
    // Go back in history, or fallback to states list
    if (window.history.length > 1) {
      window.history.back();
    } else {
      goto('/cards/states');
    }
  }

  let stateId = '';
  let name = '';
  let type: 'number' | 'boolean' | 'string' = 'number';
  let scope: 'global' | 'chapter' = 'global';
  let chapterId = '';
  let defaultValue: string | number | boolean = '';
  let description = '';
  let loading = true;
  let saving = false;
  let error = '';

  onMount(async () => {
    const id = $page.params.id;

    if (!id) {
      error = 'No state ID provided';
      loading = false;
      return;
    }

    try {
      const state = await db.getState(id);

      if (!state) {
        error = 'State variable not found';
        loading = false;
        return;
      }

      stateId = state.id;
      name = state.name;
      type = state.type;
      scope = state.scope;
      chapterId = state.chapterId || '';
      defaultValue = state.defaultValue;
      description = state.description || '';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load state variable';
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(event: CustomEvent<{
    name: string;
    type: 'number' | 'boolean' | 'string';
    scope: 'global' | 'chapter';
    chapterId?: string;
    defaultValue: string | number | boolean;
    description: string;
  }>) {
    error = '';
    const { type: rawType, scope: rawScope, chapterId: rawChapterId, defaultValue: rawDefault, description: rawDesc } = event.detail;

    if (rawScope === 'chapter' && !rawChapterId) {
      error = 'Chapter must be selected for chapter-scoped states';
      return;
    }

    saving = true;
    try {
      await db.updateState(stateId, {
        type: rawType,
        scope: rawScope,
        chapterId: rawScope === 'chapter' ? rawChapterId : undefined,
        defaultValue: rawDefault,
        description: rawDesc.trim(),
      });

      // Redirect to states list
      goto('/cards/states');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update state variable';
    } finally {
      saving = false;
    }
  }

  function handleCancel() {
    goto('/cards/states');
  }
</script>

<div class="p-6 max-w-2xl mx-auto">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit State Variable</h1>
    <button
      on:click={handleClose}
      class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      title="Close and return to previous page"
      type="button"
    >
      <X size={24} class="text-gray-600 dark:text-gray-400" />
    </button>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading state variable...</p>
    </div>
  {:else if error && !name}
    <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-800 dark:text-red-200">{error}</p>
      <a href="/cards/states" class="mt-4 inline-block text-sm text-red-600 dark:text-red-400 hover:underline">
        ← Back to states
      </a>
    </div>
  {:else}
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <StateForm
        bind:name
        bind:type
        bind:scope
        bind:chapterId
        bind:defaultValue
        bind:description
        bind:saving
        bind:error
        isEditMode={true}
        on:submit={handleSubmit}
        on:cancel={handleCancel}
      />
    </div>
  {/if}
</div>

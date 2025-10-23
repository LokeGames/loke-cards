<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import type { StateVariable } from '@loke/shared';
  import { db } from '@loke/shared/database';
  import type { Chapter } from '@schemas';

  export let name: string = '';
  export let type: 'number' | 'boolean' | 'string' = 'number';
  export let scope: 'global' | 'chapter' = 'global';
  export let chapterId: string = '';
  export let defaultValue: string | number | boolean = '';
  export let description: string = '';
  export let saving: boolean = false;
  export let error: string = '';
  export let isEditMode: boolean = false;

  let chapters: Chapter[] = [];

  const dispatch = createEventDispatcher<{
    submit: {
      name: string;
      type: 'number' | 'boolean' | 'string';
      scope: 'global' | 'chapter';
      chapterId?: string;
      defaultValue: string | number | boolean;
      description: string;
    };
    cancel: void;
  }>();

  onMount(async () => {
    try {
      chapters = await db.getAllChapters();
    } catch (e) {
      console.error('Failed to load chapters:', e);
    }
  });

  function handleSubmit() {
    dispatch('submit', {
      name: name.trim(),
      type,
      scope,
      chapterId: scope === 'chapter' ? chapterId : undefined,
      defaultValue: getTypedDefaultValue(),
      description: description.trim()
    });
  }

  function handleCancel() {
    dispatch('cancel');
  }

  function getTypedDefaultValue(): string | number | boolean {
    if (type === 'number') {
      return Number(defaultValue) || 0;
    } else if (type === 'boolean') {
      return defaultValue === true || defaultValue === 'true';
    } else {
      return String(defaultValue);
    }
  }

  // Update default value type when type changes
  function onTypeChange() {
    if (type === 'number') {
      defaultValue = 0;
    } else if (type === 'boolean') {
      defaultValue = false;
    } else {
      defaultValue = '';
    }
  }

  // Clear chapterId when scope changes to global
  function onScopeChange() {
    if (scope === 'global') {
      chapterId = '';
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  <!-- Name -->
  <div>
    <label for="name" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
      Variable Name {isEditMode ? '(immutable)' : ''}
    </label>
    <input
      type="text"
      id="name"
      bind:value={name}
      disabled={isEditMode}
      placeholder="e.g., Health, Gold, Has Key"
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
      class:bg-white={!isEditMode}
      class:dark:bg-gray-700={!isEditMode}
      class:text-gray-900={!isEditMode}
      class:dark:text-white={!isEditMode}
      class:bg-gray-100={isEditMode}
      class:dark:bg-gray-800={isEditMode}
      class:text-gray-500={isEditMode}
      class:dark:text-gray-400={isEditMode}
      class:cursor-not-allowed={isEditMode}
      required={!isEditMode}
    />
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {isEditMode ? 'Name cannot be changed to maintain consistency across scenes' : 'Human-readable name. Will be auto-converted to ID (e.g., "Health" → "health")'}
    </p>
  </div>

  <!-- Type -->
  <div>
    <label for="type" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
      Data Type
    </label>
    <select
      id="type"
      bind:value={type}
      on:change={onTypeChange}
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
      required
    >
      <option value="number">Number (supports +/- operations)</option>
      <option value="boolean">Boolean (supports toggle operation)</option>
      <option value="string">String (supports set operation)</option>
    </select>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Type determines which operations are available in scenes
    </p>
  </div>

  <!-- Scope -->
  <div>
    <label for="scope" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
      Scope
    </label>
    <select
      id="scope"
      bind:value={scope}
      on:change={onScopeChange}
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
      required
    >
      <option value="global">Global (available across all chapters)</option>
      <option value="chapter">Chapter-specific (only in selected chapter)</option>
    </select>
  </div>

  <!-- Chapter Selection (only for chapter scope) -->
  {#if scope === 'chapter'}
    <div>
      <label for="chapterId" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
        Chapter
      </label>
      <select
        id="chapterId"
        bind:value={chapterId}
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
        required
      >
        <option value="">Select chapter...</option>
        {#each chapters as chapter}
          <option value={chapter.id}>{chapter.name || chapter.title || chapter.id}</option>
        {/each}
      </select>
    </div>
  {/if}

  <!-- Default Value -->
  <div>
    <label for="defaultValue" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
      Default Value
    </label>
    {#if type === 'number'}
      <input
        type="number"
        id="defaultValue"
        bind:value={defaultValue}
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
        required
      />
    {:else if type === 'boolean'}
      <div class="flex items-center gap-4 mt-2">
        <label class="flex items-center">
          <input
            type="radio"
            bind:group={defaultValue}
            value={true}
            class="mr-2"
          />
          <span class="text-gray-900 dark:text-white">True</span>
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            bind:group={defaultValue}
            value={false}
            class="mr-2"
          />
          <span class="text-gray-900 dark:text-white">False</span>
        </label>
      </div>
    {:else}
      <input
        type="text"
        id="defaultValue"
        bind:value={defaultValue}
        placeholder="Enter default text value"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
        required
      />
    {/if}
  </div>

  <!-- Description -->
  <div>
    <label for="description" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
      Description (Optional)
    </label>
    <textarea
      id="description"
      bind:value={description}
      rows="3"
      placeholder="What does this variable represent?"
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
      {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create State'}
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

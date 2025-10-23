<script lang="ts">
  import { db } from '@loke/shared/database';
  import { goto } from '$app/navigation';
  import { StateForm } from '@loke/apps-cards';

  let name = '';
  let type: 'number' | 'boolean' | 'string' = 'number';
  let scope: 'global' | 'chapter' = 'global';
  let chapterId = '';
  let defaultValue: string | number | boolean = 0;
  let description = '';
  let saving = false;
  let error = '';

  async function handleSubmit(event: CustomEvent<{
    name: string;
    type: 'number' | 'boolean' | 'string';
    scope: 'global' | 'chapter';
    chapterId?: string;
    defaultValue: string | number | boolean;
    description: string;
  }>) {
    error = '';
    const { name: rawName, type: rawType, scope: rawScope, chapterId: rawChapterId, defaultValue: rawDefault, description: rawDesc } = event.detail;

    if (!rawName.trim()) {
      error = 'Variable name is required';
      return;
    }

    if (rawScope === 'chapter' && !rawChapterId) {
      error = 'Chapter must be selected for chapter-scoped states';
      return;
    }

    saving = true;
    try {
      await db.createState({
        name: rawName.trim(),
        type: rawType,
        scope: rawScope,
        chapterId: rawScope === 'chapter' ? rawChapterId : undefined,
        defaultValue: rawDefault,
        description: rawDesc.trim(),
      });

      // Redirect to states list
      goto('/cards/states');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create state variable';
    } finally {
      saving = false;
    }
  }

  function handleCancel() {
    goto('/cards/states');
  }
</script>

<div class="p-6 max-w-2xl mx-auto">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create New State Variable</h1>

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
      isEditMode={false}
      on:submit={handleSubmit}
      on:cancel={handleCancel}
    />
  </div>
</div>

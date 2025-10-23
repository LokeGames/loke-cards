<script lang="ts">
  import { db } from '@loke/shared/database';
  import { goto } from '$app/navigation';
  import { ChapterForm } from '@loke/apps-cards';

  let chapterId = '';
  let name = '';
  let description = '';
  let saving = false;
  let error = '';

  async function handleSubmit(event: CustomEvent<{ chapterId: string; name: string; description: string }>) {
    error = '';
    const { chapterId: rawId, name: rawName, description: rawDesc } = event.detail;

    if (!rawId.trim()) {
      error = 'Chapter ID is required';
      return;
    }

    if (!rawName.trim()) {
      error = 'Title is required';
      return;
    }

    // Validate chapter ID format
    let finalChapterId = rawId.trim();

    // Auto-prefix with "chapter" if not present
    if (!finalChapterId.startsWith('chapter')) {
      finalChapterId = 'chapter_' + finalChapterId;
    }

    // Validate C identifier rules (alphanumeric + underscore only)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(finalChapterId)) {
      error = 'Chapter ID must contain only letters, numbers, and underscores';
      return;
    }

    saving = true;
    try {
      await db.createChapter({
        id: finalChapterId,
        name: rawName.trim(),
        description: rawDesc.trim(),
        projectId: 'default',
      });

      // Redirect to chapters list
      goto('/cards/chapters');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create chapter';
    } finally {
      saving = false;
    }
  }

  function handleCancel() {
    goto('/cards/chapters');
  }
</script>

<div class="p-6 max-w-2xl mx-auto">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create New Chapter</h1>

  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <ChapterForm
      bind:chapterId
      bind:name
      bind:description
      bind:saving
      bind:error
      isEditMode={false}
      on:submit={handleSubmit}
      on:cancel={handleCancel}
    />
  </div>
</div>

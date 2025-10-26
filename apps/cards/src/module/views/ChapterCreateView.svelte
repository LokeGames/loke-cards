<script lang="ts">
  import { goto } from "$app/navigation";
  import { db } from "@loke/shared/database";
  import { projectState } from "@loke/shared/stores/project.svelte";
  import ChapterForm from "../../components/ChapterForm.svelte";

  let chapterId = "";
  let name = "";
  let description = "";
  let saving = false;
  let error = "";

  async function handleSubmit(
    event: CustomEvent<{ chapterId: string; name: string; description: string }>,
  ) {
    error = "";
    const { chapterId: rawId, name: rawName, description: rawDesc } = event.detail;

    if (!rawId.trim()) {
      error = "Chapter ID is required";
      return;
    }

    if (!rawName.trim()) {
      error = "Title is required";
      return;
    }

    let finalChapterId = rawId.trim();

    if (!finalChapterId.startsWith("chapter")) {
      finalChapterId = `chapter_${finalChapterId}`;
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(finalChapterId)) {
      error = "Chapter ID must contain only letters, numbers, and underscores";
      return;
    }

    if (!projectState.currentProject?.id) {
      error = "No project selected";
      return;
    }

    saving = true;
    try {
      await db.createChapter({
        id: finalChapterId,
        name: rawName.trim(),
        description: rawDesc.trim(),
        projectId: projectState.currentProject.id,
      });
      goto("/cards/chapters");
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to create chapter";
    } finally {
      saving = false;
    }
  }

  function handleCancel() {
    goto("/cards/chapters");
  }
</script>

<div class="mx-auto h-full max-w-2xl overflow-auto p-6">
  <h1 class="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Create New Chapter</h1>

  <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
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

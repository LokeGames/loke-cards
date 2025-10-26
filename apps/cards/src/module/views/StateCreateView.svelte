<script lang="ts">
  import { goto } from "$app/navigation";
  import { db } from "@loke/shared/database";
  import StateForm from "../../components/StateForm.svelte";

  let name = "";
  let type: "number" | "boolean" | "string" = "number";
  let scope: "global" | "chapter" = "global";
  let chapterId = "";
  let defaultValue: string | number | boolean = 0;
  let description = "";
  let saving = false;
  let error = "";

  async function handleSubmit(
    event: CustomEvent<{
      name: string;
      type: "number" | "boolean" | "string";
      scope: "global" | "chapter";
      chapterId?: string;
      defaultValue: string | number | boolean;
      description: string;
    }>,
  ) {
    error = "";
    const {
      name: rawName,
      type: rawType,
      scope: rawScope,
      chapterId: rawChapterId,
      defaultValue: rawDefault,
      description: rawDescription,
    } = event.detail;

    if (!rawName.trim()) {
      error = "Variable name is required";
      return;
    }

    if (rawScope === "chapter" && !rawChapterId) {
      error = "Chapter must be selected for chapter-scoped states";
      return;
    }

    saving = true;
    try {
      await db.createState({
        name: rawName.trim(),
        type: rawType,
        scope: rawScope,
        chapterId: rawScope === "chapter" ? rawChapterId : undefined,
        defaultValue: rawDefault,
        description: rawDescription.trim(),
      });
      goto("/cards/states");
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to create state variable";
    } finally {
      saving = false;
    }
  }

  function handleCancel() {
    goto("/cards/states");
  }
</script>

<div class="mx-auto h-full max-w-2xl overflow-auto p-6">
  <h1 class="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Create New State Variable</h1>

  <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
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

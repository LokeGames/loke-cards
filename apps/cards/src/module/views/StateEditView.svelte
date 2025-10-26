<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { db } from "@loke/shared/database";
  import StateForm from "../../components/StateForm.svelte";
  import { X } from "lucide-svelte";

  let stateId = "";
  let name = "";
  let type: "number" | "boolean" | "string" = "number";
  let scope: "global" | "chapter" = "global";
  let chapterId = "";
  let defaultValue: string | number | boolean = "";
  let description = "";
  let loading = true;
  let saving = false;
  let error = "";

  onMount(async () => {
    const id = $page.params.id;

    if (!id) {
      error = "No state ID provided";
      loading = false;
      return;
    }

    try {
      const state = await db.getState(id);
      if (!state) {
        error = "State variable not found";
        loading = false;
        return;
      }

      stateId = state.id;
      name = state.name;
      type = state.type;
      scope = state.scope;
      chapterId = state.chapterId || "";
      defaultValue = state.defaultValue;
      description = state.description || "";
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load state variable";
    } finally {
      loading = false;
    }
  });

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
    const { type: rawType, scope: rawScope, chapterId: rawChapterId, defaultValue: rawDefault, description: rawDesc } =
      event.detail;

    if (rawScope === "chapter" && !rawChapterId) {
      error = "Chapter must be selected for chapter-scoped states";
      return;
    }

    saving = true;
    try {
      await db.updateState(stateId, {
        type: rawType,
        scope: rawScope,
        chapterId: rawScope === "chapter" ? rawChapterId : undefined,
        defaultValue: rawDefault,
        description: rawDesc.trim(),
      });
      goto("/cards/states");
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to update state variable";
    } finally {
      saving = false;
    }
  }

  function handleCancel() {
    goto("/cards/states");
  }

  function handleClose() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      goto("/cards/states");
    }
  }
</script>

<div class="mx-auto h-full max-w-2xl overflow-auto p-6">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit State Variable</h1>
    <button
      type="button"
      class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      title="Close and return to previous page"
      on:click={handleClose}
    >
      <X size={24} class="text-gray-600 dark:text-gray-400" />
    </button>
  </div>

  {#if loading}
    <div class="py-12 text-center">
      <div class="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading state variable...</p>
    </div>
  {:else if error && !name}
    <div class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <p class="text-sm text-red-800 dark:text-red-200">{error}</p>
      <a href="/cards/states" class="mt-4 inline-block text-sm text-red-600 hover:underline dark:text-red-400">
        ← Back to states
      </a>
    </div>
  {:else}
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
        isEditMode={true}
        on:submit={handleSubmit}
        on:cancel={handleCancel}
      />
    </div>
  {/if}
</div>

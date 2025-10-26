<script lang="ts">
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { db } from "@loke/shared/database";
  import type { StateVariable } from "@loke/shared";
  import { Plus, Settings } from "lucide-svelte";

  let states: StateVariable[] = [];
  let loading = true;

  async function loadStates() {
    loading = true;
    try {
      states = await db.getAllStates();
    } catch (error) {
      console.error("Failed to load states:", error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadStates();
  });

  afterNavigate(() => {
    loadStates();
  });

  function formatDate(timestamp?: number): string {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString();
  }

  function typeBadge(type: string): string {
    switch (type) {
      case "number":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "boolean":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "string":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  }

  function scopeBadge(scope: string): string {
    return scope === "global"
      ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      : "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
  }
</script>

<div class="h-full overflow-auto p-6">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">State Variables</h1>
    <a
      href="/cards/states/new"
      class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
    >
      <Plus size={20} />
      New State
    </a>
  </div>

  {#if loading}
    <div class="py-12 text-center">
      <div class="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading states...</p>
    </div>
  {:else if states.length === 0}
    <div class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center dark:border-gray-600 dark:bg-gray-800">
      <div class="mb-4 flex justify-center">
        <Settings size={64} class="text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No state variables yet</h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Create state variables to track game progress, inventory, and player stats
      </p>
      <a
        href="/cards/states/new"
        class="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
      >
        <Plus size={20} />
        Create State
      </a>
    </div>
  {:else}
    <div class="grid gap-4">
      {#each states as state}
        <div class="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="mb-2 flex items-center gap-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{state.name}</h3>
                <span class={`rounded px-2 py-1 text-xs ${typeBadge(state.type)}`}>{state.type}</span>
                <span class={`rounded px-2 py-1 text-xs ${scopeBadge(state.scope)}`}>{state.scope}</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                ID:
                <code class="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">{state.id}</code>
              </p>
              {#if state.description}
                <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">{state.description}</p>
              {/if}
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Default:
                <code class="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">{state.defaultValue}</code>
              </p>
              {#if state.scope === "chapter" && state.chapterId}
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Chapter:
                  <code class="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">{state.chapterId}</code>
                </p>
              {/if}
            </div>
            <div class="ml-4 flex gap-2">
              <a
                href={`/cards/states/edit/${state.id}`}
                class="rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
              >
                Edit
              </a>
              <button
                type="button"
                class="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
                on:click={() => {
                  if (confirm(`Delete state variable "${state.name}"?\n\nWarning: This may break scenes that reference this state.`)) {
                    db.deleteState(state.id).then(() => {
                      states = states.filter((s) => s.id !== state.id);
                    });
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Created: {formatDate(state.createdAt)}</span>
            <span>Updated: {formatDate(state.updatedAt)}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

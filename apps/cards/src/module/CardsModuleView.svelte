<script lang="ts">
  import type { ComponentType } from "svelte";
  import { page } from "$app/stores";
  import { cardsMenu } from "../menu";

  type Loader = () => Promise<{ default: ComponentType } | ComponentType>;

  const loadDashboard: Loader = () => import("./views/CardsDashboardView.svelte");
  const loadScenesList: Loader = () => import("./views/ScenesListView.svelte");
  const loadSceneCreate: Loader = () => import("./views/SceneCreateView.svelte");
  const loadSceneEdit: Loader = () => import("./views/SceneEditView.svelte");
  const loadChaptersList: Loader = () => import("./views/ChaptersListView.svelte");
  const loadChapterCreate: Loader = () => import("./views/ChapterCreateView.svelte");
  const loadChapterEdit: Loader = () => import("./views/ChapterEditView.svelte");
  const loadStatesList: Loader = () => import("./views/StatesListView.svelte");
  const loadStateCreate: Loader = () => import("./views/StateCreateView.svelte");
  const loadStateEdit: Loader = () => import("./views/StateEditView.svelte");
  const loadToc: Loader = () => import("./views/TableOfContentsView.svelte");
  const loadTocGraph: Loader = () => import("./views/TocGraphView.svelte");
  const loadTocGraphTest: Loader = () => import("./views/TocGraphTestView.svelte");

  const pathname = $derived($page.url.pathname);

  const moduleSegments = $derived(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] !== "cards") {
      return [];
    }
    return segments.slice(1);
  });

  const currentLoader = $derived(() => selectLoader(moduleSegments));

  let ActiveViewComponent = $state<ComponentType | null>(null);
  let viewLoading = $state(false);
  let viewError = $state<string | null>(null);
  let requestToken = 0;

  $effect(() => {
    requestToken += 1;
    const token = requestToken;
    const loader = currentLoader;

    if (!loader) {
      ActiveViewComponent = null;
      viewLoading = false;
      viewError = null;
      return;
    }

    viewLoading = true;
    viewError = null;

    loader()
      .then((module) => {
        if (token !== requestToken) {
          return;
        }
        const component = typeof module === "function" ? (module as ComponentType) : module.default;
        if (!component) {
          throw new Error("Module view did not export a Svelte component");
        }
        ActiveViewComponent = component;
      })
      .catch((error) => {
        if (token !== requestToken) {
          return;
        }
        ActiveViewComponent = null;
        viewError = error instanceof Error ? error.message : String(error);
        console.error("Cards module view failed to load", error);
      })
      .finally(() => {
        if (token !== requestToken) {
          return;
        }
        viewLoading = false;
      });
  });

  function selectLoader(segments: string[]): Loader | null {
    if (segments.length === 0) {
      return loadDashboard;
    }

    const [section, action, param] = segments;

    switch (section) {
      case "scenes": {
        if (!action) return loadScenesList;
        if (action === "new") return loadSceneCreate;
        if (action === "edit" && param) return loadSceneEdit;
        return loadScenesList;
      }
      case "chapters": {
        if (!action) return loadChaptersList;
        if (action === "new") return loadChapterCreate;
        if (action === "edit" && param) return loadChapterEdit;
        return loadChaptersList;
      }
      case "states": {
        if (!action) return loadStatesList;
        if (action === "new") return loadStateCreate;
        if (action === "edit" && param) return loadStateEdit;
        return loadStatesList;
      }
      case "toc": {
        return loadToc;
      }
      case "toc-graph": {
        if (action === "test") {
          return loadTocGraphTest;
        }
        return loadTocGraph;
      }
      default:
        return null;
    }
  }

  function isActivePath(href: string): boolean {
    if (href === "/cards") {
      return pathname === "/cards";
    }
    return pathname.startsWith(href);
  }
</script>

<div class="flex h-full flex-col overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
  <nav class="border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
    <div class="flex gap-2 overflow-x-auto">
      {#each cardsMenu as item (item.href)}
        <a
          href={item.href}
          class="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 {isActivePath(item.href) ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-100' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}"
        >
          {#if item.icon}
            <svelte:component this={item.icon} class="h-4 w-4" aria-hidden="true" />
          {/if}
          {item.label}
        </a>
      {/each}
    </div>
  </nav>

  <div class="flex-1 overflow-hidden">
    {#if viewLoading}
      <div class="flex h-full items-center justify-center p-6">
        <div class="space-y-3 text-center">
          <div class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p class="text-sm text-gray-600 dark:text-gray-400">Loading workspace…</p>
        </div>
      </div>
    {:else if viewError}
      <div class="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <h2 class="text-lg font-semibold text-red-700 dark:text-red-300">Unable to load this view</h2>
        <p class="max-w-md text-sm text-red-600 dark:text-red-200">{viewError}</p>
        <a
          href="/cards"
          class="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Return to Cards overview
        </a>
      </div>
    {:else if ActiveViewComponent}
      <ActiveViewComponent />
    {:else}
      <div class="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Unknown Cards destination</h2>
        <p class="max-w-md text-sm text-gray-600 dark:text-gray-400">
          The requested path is not available in the Cards workspace. Check the URL or pick a destination from the
          navigation above.
        </p>
        <a
          href="/cards"
          class="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Go to Cards overview
        </a>
      </div>
    {/if}
  </div>
</div>

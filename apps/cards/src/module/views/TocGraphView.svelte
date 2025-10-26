<script lang="ts">
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { db } from "@loke/shared/database";
  import type { Scene, Chapter } from "@loke/shared";
  import { Plus, BookOpen, FileText, AlertCircle, List } from "lucide-svelte";
  import {
    layoutSceneGraph,
    type GraphSceneLink,
    type GraphSceneNode,
  } from "@loke/cards/toc-graph-gitgraph";

  let chapters = $state<Chapter[]>([]);
  let scenes = $state<Scene[]>([]);
  let loading = $state(true);

  let scenesByChapter = $state<Record<string, Scene[]>>({});
  $effect(() => {
    scenesByChapter = scenes.reduce<Record<string, Scene[]>>((acc, scene) => {
      const chapterId = scene.chapterId || "uncategorized";
      if (!acc[chapterId]) {
        acc[chapterId] = [];
      }
      acc[chapterId].push(scene);
      return acc;
    }, {});
  });

  let sceneIdLookup = $state<Map<string, string>>(new Map());
  $effect(() => {
    const byId = new Map<string, string>();
    scenes.forEach((scene, index) => {
      const canonical = scene.id ?? scene.sceneId ?? `scene-${index}`;
      byId.set(canonical, canonical);
      if (scene.sceneId) {
        byId.set(scene.sceneId, canonical);
      }
      if (scene.title) {
        byId.set(scene.title, canonical);
      }
    });
    sceneIdLookup = byId;
  });

  let graphSceneLinks = $state<GraphSceneLink[]>([]);
  $effect(() => {
    const edges: GraphSceneLink[] = [];
    const seen = new Set<string>();

    scenes.forEach((scene, sceneIndex) => {
      const sourceId = sceneIdLookup.get(
        scene.id ?? scene.sceneId ?? `scene-${sceneIndex}`,
      );
      if (!sourceId) {
        return;
      }

      scene.choices?.forEach((choice) => {
        if (!choice.nextScene) {
          return;
        }
        const targetId = sceneIdLookup.get(choice.nextScene);
        if (!targetId) {
          return;
        }

        const key = `${sourceId}->${targetId}`;
        if (seen.has(key)) {
          return;
        }
        seen.add(key);

        edges.push({
          from: sourceId,
          to: targetId,
          tag: choice.enabled === false ? "conditional" : "choice",
        });
      });
    });

    graphSceneLinks = edges;
  });

  let graphSceneNodes = $state<GraphSceneNode[]>([]);
  let laneCount = $state(1);
  $effect(() => {
    const { nodes, laneCount: lanes } = layoutSceneGraph(
      baseGraphNodes,
      graphSceneLinks,
    );
    graphSceneNodes = nodes;
    laneCount = lanes;
    schedulePositionsUpdate();
  });

  const GRAPH_COLUMN_WIDTH = 112;
  const GRAPH_ROW_COLUMN_WIDTH = GRAPH_COLUMN_WIDTH - 24;
  const GRAPH_CARD_MIN_HEIGHT = 72;

  let graphContainer: HTMLDivElement | null = null;
  const anchorElements = new Map<string, HTMLElement>();
  let rowPositions = $state<Array<{ id: string; y: number }>>([]);
  let graphHeight = $state(0);

  let anchorObserver: ResizeObserver | null = null;
  let containerObserver: ResizeObserver | null = null;
  let updateScheduled = false;
  let lastObservedContainer: HTMLElement | null = null;

  function schedulePositionsUpdate() {
    if (updateScheduled) {
      return;
    }
    updateScheduled = true;
    requestAnimationFrame(async () => {
      updateScheduled = false;
      await tick();
      if (!graphContainer) {
        return;
      }
      const containerRect = graphContainer.getBoundingClientRect();
      const items: Array<{ id: string; y: number }> = [];
      anchorElements.forEach((element, id) => {
        const rect = element.getBoundingClientRect();
        items.push({
          id,
          y: rect.top + rect.height / 2 - containerRect.top,
        });
      });
      items.sort((a, b) => {
        const orderA = graphSceneNodes.findIndex((node) => node.id === a.id);
        const orderB = graphSceneNodes.findIndex((node) => node.id === b.id);
        return orderA - orderB;
      });
      rowPositions = items;
      const contentHeight =
        items.length > 0
          ? Math.max(...items.map((item) => item.y)) + GRAPH_CARD_MIN_HEIGHT
          : 0;
      graphHeight = Math.max(containerRect.height, contentHeight);
    });
  }

  function registerSceneAnchor(sceneId: string) {
    return (element: HTMLElement | null) => {
      const existing = anchorElements.get(sceneId);
      if (existing) {
        anchorObserver?.unobserve(existing);
      }

      if (element) {
        anchorElements.set(sceneId, element);
        if (anchorObserver) {
          anchorObserver.observe(element);
        }
      } else {
        anchorElements.delete(sceneId);
      }

      schedulePositionsUpdate();
    };
  }

  const sceneAnchor: Action<HTMLElement, string> = (node, sceneId) => {
    registerSceneAnchor(sceneId)(node);
    return {
      update(newSceneId: string) {
        if (newSceneId === sceneId) {
          return;
        }
        registerSceneAnchor(sceneId)(null);
        sceneId = newSceneId;
        registerSceneAnchor(sceneId)(node);
      },
      destroy() {
        registerSceneAnchor(sceneId)(null);
      },
    };
  };

  onMount(() => {
    anchorObserver = new ResizeObserver(() => schedulePositionsUpdate());
    containerObserver = new ResizeObserver(() => schedulePositionsUpdate());
    if (graphContainer) {
      containerObserver.observe(graphContainer);
    }
    anchorElements.forEach((element) => anchorObserver?.observe(element));

    window.addEventListener("resize", schedulePositionsUpdate);
    schedulePositionsUpdate();
  });

  onDestroy(() => {
    anchorObserver?.disconnect();
    containerObserver?.disconnect();
    window.removeEventListener("resize", schedulePositionsUpdate);
  });

  $effect(() => {
    if (!containerObserver) {
      return;
    }
    if (lastObservedContainer) {
      containerObserver.unobserve(lastObservedContainer);
    }
    if (graphContainer) {
      containerObserver.observe(graphContainer);
    }
    lastObservedContainer = graphContainer;
  });

  async function loadData() {
    loading = true;
    try {
      [chapters, scenes] = await Promise.all([db.getAllChapters(), db.getAllScenes()]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      loading = false;
      schedulePositionsUpdate();
    }
  }

  onMount(() => {
    loadData();
  });

  afterNavigate(() => {
    loadData();
  });
</script>

<div class="h-full overflow-auto p-6">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Table of Contents Map</h1>
    <div class="flex gap-2">
      <a
        href="/cards/chapters/new"
        class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700"
      >
        <Plus size={16} />
        Chapter
      </a>
      <a
        href="/cards/scenes/new"
        class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700"
      >
        <Plus size={16} />
        Scene
      </a>
    </div>
  </div>

  {#if loading}
    <div class="py-12 text-center">
      <div class="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading project structure...</p>
    </div>
  {:else if chapters.length === 0 && scenes.length === 0}
    <div class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center dark:border-gray-600 dark:bg-gray-800">
      <div class="mb-4 flex justify-center">
        <List size={64} class="text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No content yet</h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Start by creating chapters and scenes</p>
    </div>
  {:else}
    <div class="grid gap-6" style={`grid-template-columns:${GRAPH_COLUMN_WIDTH}px minmax(0,1fr);`}>
      <div class="relative" bind:this={graphContainer}>
        <SceneFlowGraph
          nodes={graphSceneNodes}
          links={graphSceneLinks}
          positions={rowPositions}
          laneCount={laneCount}
          height={graphHeight}
        />
      </div>

      <div class="space-y-6 pl-4">
        {#each chapters as chapter}
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <BookOpen size={20} class="text-gray-600 dark:text-gray-400" />
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                      {chapter.name || chapter.title}
                    </h2>
                  </div>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{chapter.id}</p>
                  {#if chapter.description}
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">{chapter.description}</p>
                  {/if}
                </div>
                <a
                  href={`/cards/chapters/edit/${chapter.id}`}
                  class="rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
                >
                  Edit
                </a>
              </div>
            </div>

            <div class="p-4">
              {#if scenesByChapter[chapter.id]?.length > 0}
                <div class="space-y-3">
                  {#each scenesByChapter[chapter.id] as scene, idx}
                    {@const canonicalId = scene.id ?? scene.sceneId ?? `scene-${idx}`}
                    {@const anchorId = sceneIdLookup.get(canonicalId) ?? canonicalId}
                    <div class="grid gap-3" style={`grid-template-columns:${GRAPH_ROW_COLUMN_WIDTH}px minmax(0,1fr);`}>
                      <div class="relative">
                        <div class="pointer-events-none h-full" use:sceneAnchor={anchorId}></div>
                      </div>
                      <a
                        href={`/cards/scenes/edit/${scene.id}`}
                        class="block rounded bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 min-h-[72px]"
                      >
                        <div class="flex items-start justify-between">
                          <div class="flex items-start gap-3">
                            <span class="font-mono text-sm text-gray-500 dark:text-gray-400">{idx + 1}.</span>
                            <div class="flex items-start gap-2">
                              <FileText size={16} class="mt-0.5 text-gray-600 dark:text-gray-400" />
                              <div>
                                <h3 class="font-medium text-gray-900 dark:text-white">{scene.title || scene.sceneId}</h3>
                                {#if scene.sceneText}
                                  <p class="mt-1 line-clamp-1 text-sm text-gray-600 dark:text-gray-400">
                                    {scene.sceneText.substring(0, 100)}...
                                  </p>
                                {/if}
                              </div>
                            </div>
                          </div>
                          <span class="text-xs text-gray-500 dark:text-gray-400">{scene.sceneId}</span>
                        </div>
                      </a>
                    </div>
                  {/each}
                </div>
              {:else}
                <p class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">No scenes in this chapter yet</p>
              {/if}
            </div>
          </div>
        {/each}

        {#if scenesByChapter.uncategorized?.length > 0}
        <div class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div class="border-b border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div class="flex items-center gap-2">
              <AlertCircle size={20} class="text-yellow-600 dark:text-yellow-400" />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Uncategorized Scenes</h2>
            </div>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              These scenes are not assigned to any chapter
            </p>
          </div>
          <div class="space-y-3 p-4">
            {#each scenesByChapter.uncategorized as scene, idx}
              {@const canonicalId = scene.id ?? scene.sceneId ?? `uncat-${idx}`}
              {@const anchorId = sceneIdLookup.get(canonicalId) ?? canonicalId}
              <div class="grid gap-3" style={`grid-template-columns:${GRAPH_ROW_COLUMN_WIDTH}px minmax(0,1fr);`}>
                <div class="relative">
                  <div class="pointer-events-none h-full" use:sceneAnchor={anchorId}></div>
                </div>
                <a
                  href={`/cards/scenes/edit/${scene.id}`}
                  class="block rounded bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 min-h-[72px]"
                >
                  <div class="flex items-center gap-2">
                    <FileText size={16} class="text-gray-600 dark:text-gray-400" />
                    <h3 class="font-medium text-gray-900 dark:text-white">{scene.title || scene.sceneId}</h3>
                  </div>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{scene.sceneId}</p>
                </a>
              </div>
            {/each}
          </div>
        </div>
      {/if}
      </div>
    </div>
  {/if}
</div>

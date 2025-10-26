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

  const GRAPH_COLUMN_WIDTH = 112;
  const GRAPH_ROW_COLUMN_WIDTH = GRAPH_COLUMN_WIDTH - 24;
  const GRAPH_CARD_MIN_HEIGHT = 72;

  const LANE_COLORS = [
    "#60a5fa",
    "#22d3ee",
    "#a78bfa",
    "#34d399",
    "#f472b6",
    "#f59e0b",
    "#ef4444",
  ];

  let graphSceneNodes = $state<GraphSceneNode[]>([]);
  let laneByScene = $state<Map<string, number>>(new Map());
  $effect(() => {
    const baseNodes = scenes.map<GraphSceneNode>((scene, index) => ({
      id: scene.id ?? scene.sceneId ?? `scene-${index}`,
      title: scene.title ?? scene.sceneId ?? scene.id ?? `Scene ${index + 1}`,
      order: index,
    }));

    const { nodes, laneByScene: laneMap } = layoutSceneGraph(
      baseNodes,
      graphSceneLinks,
    );
    graphSceneNodes = nodes;
    laneByScene = laneMap;
  });

  function laneColorFor(sceneId: string): string {
    const lane = laneByScene.get(sceneId) ?? 0;
    return LANE_COLORS[lane % LANE_COLORS.length];
  }

  function laneClass(isFirst: boolean, isLast: boolean, hasLane: boolean): string {
    const classes = ["graph-cell"];
    if (isFirst) classes.push("graph-cell--first");
    if (isLast) classes.push("graph-cell--last");
    if (!hasLane) classes.push("graph-cell--empty");
    return classes.join(" ");
  }

  async function loadData() {
    loading = true;
    try {
      [chapters, scenes] = await Promise.all([db.getAllChapters(), db.getAllScenes()]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      loading = false;
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
    <div class="space-y-6">
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
                    {@const isFirst = idx === 0}
                    {@const isLast = idx === scenesByChapter[chapter.id].length - 1}
                    {@const hasLane = laneByScene.has(anchorId)}
                    {@const laneColor = laneColorFor(anchorId)}
                    <div
                      class="grid gap-3"
                      style={`grid-template-columns:${GRAPH_ROW_COLUMN_WIDTH}px minmax(0,1fr);`}
                    >
                      <div class={laneClass(isFirst, isLast, hasLane)} style={`--lane-color:${laneColor};`}>
                        <span class="graph-line" />
                        {#if hasLane}
                          <span class="graph-node" />
                        {/if}
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
            {@const isFirst = idx === 0}
              {@const isLast = idx === scenesByChapter.uncategorized.length - 1}
              {@const hasLane = laneByScene.has(anchorId)}
              {@const laneColor = laneColorFor(anchorId)}
              <div
                class="grid gap-3"
                style={`grid-template-columns:${GRAPH_ROW_COLUMN_WIDTH}px minmax(0,1fr);`}
              >
                <div class={laneClass(isFirst, isLast, hasLane)} style={`--lane-color:${laneColor};`}>
                  <span class="graph-line" />
                  {#if hasLane}
                    <span class="graph-node" />
                  {/if}
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
  {/if}
</div>

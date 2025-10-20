<template>
  <div class="h-[calc(100vh-4rem)] relative">
    <div class="absolute right-3 top-3 z-10 flex gap-2">
      <button @click="fit" class="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Fit View</button>
      <button @click="autoLayout" class="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Auto Layout</button>
      <button @click="saveLayout" class="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700">Save Layout</button>
    </div>
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :fit-view="true"
      :min-zoom="0.05"
      :max-zoom="1.5"
      :node-types="nodeTypes"
      @node-drag-stop="onNodeDragStop"
      @connect="onConnect"
      @node-double-click="onNodeDoubleClick"
    >
      <Background />
      <MiniMap />
    </VueFlow>
  </div>
  <div class="p-2 text-xs text-gray-500 dark:text-gray-400">Global Graph — double‑click chapter to open per‑chapter view.</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { Background } from '@vue-flow/background';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/minimap/dist/style.css';
import { useRouter } from 'vue-router';
import { useGraphStore } from '../stores/graph.js';
import { nodeTypes } from '../graph/nodeTypes.js';
import { buildChapterNodes, buildSceneNodes, buildEdgesFromChoices } from '../graph/builders.js';
import { layoutScenes } from '../graph/layout.js';

const store = useGraphStore();
const router = useRouter();
const nodes = ref([]);
const edges = ref([]);
const { fitView, getNodes, getEdges, updateNode } = useVueFlow();

async function refresh() {
  await store.loadGlobal();
  const chNodes = buildChapterNodes(store.chapters);
  const sceneNodes = buildSceneNodes(store.scenes, true);
  nodes.value = [...chNodes, ...sceneNodes];
  edges.value = buildEdgesFromChoices(store.scenes);
}

function onNodeDragStop(evt) {
  const n = evt.node;
  if (!n) return;
  if (n.type === 'scene') {
    const id = n.id.replace('scene-', '');
    store.persistScenePosition(id, n.position);
  } else if (n.type === 'chapter') {
    const id = n.id.replace('chap-', '');
    store.persistChapterPosition(id, n.position);
  }
}

function onConnect(params) {
  // Simple UX: currently, connection UI is visual only; persistence of links can be added later
  // as either derived choices or a dedicated links store when backend supports it.
  // For now, we simply append a transient edge in UI.
  edges.value = [
    ...edges.value,
    {
      id: `edge-${params.source}-${params.target}-${Date.now()}`,
      source: params.source,
      target: params.target,
      animated: true,
      markerEnd: 'arrowclosed',
    },
  ];
}

onMounted(async () => {
  await refresh();
});

function onNodeDoubleClick(evt) {
  const n = evt?.node;
  if (n?.type === 'chapter') {
    const id = n.id.replace('chap-', '');
    router.push({ name: 'ChapterNodeView', params: { id } });
  }
}

function fit() {
  try { fitView(); } catch (_) {}
}

async function autoLayout() {
  const laidOut = await layoutScenes(getNodes(), getEdges());
  for (const n of laidOut) {
    updateNode(n.id, { position: n.position });
  }
}

async function saveLayout() {
  const current = getNodes();
  for (const n of current) {
    if (n.type === 'scene') {
      await store.persistScenePosition(n.id.replace('scene-', ''), n.position);
    } else if (n.type === 'chapter') {
      await store.persistChapterPosition(n.id.replace('chap-', ''), n.position);
    }
  }
}
</script>

<style scoped>
</style>

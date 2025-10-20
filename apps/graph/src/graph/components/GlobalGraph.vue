<template>
  <div class="h-full w-full relative bg-gray-50 dark:bg-gray-900" tabindex="0" @keydown.delete.prevent="onDelete">
    <div class="absolute right-3 top-3 z-10 flex gap-2">
      <button @click="fit" class="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Fit View</button>
      <button @click="autoLayout" class="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Auto Layout</button>
      <button @click="saveLayout" class="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700">Save Layout</button>
    </div>
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      class="vue-flow-container"
      :fit-view-on-init="true"
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { Background } from '@vue-flow/background';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/minimap/dist/style.css';
import { useRouter } from 'vue-router';
import { useGraphStore } from '@graph/stores/graph.js';
import { nodeTypes } from '@graph/nodeTypes.js';
import { buildChapterNodes, buildSceneNodes, buildEdgesFromChoices } from '@graph/builders.js';
import { layoutScenes } from '@graph/layout.js';

const store = useGraphStore();
const router = useRouter();
const nodes = ref([]);
const edges = ref([]);
const { fitView, getNodes, getEdges, updateNode, removeNodes, removeEdges, getSelectedNodes, getSelectedEdges } = useVueFlow();

async function refresh() {
  await store.loadGlobal();

  const chNodes = buildChapterNodes(store.chapters);
  // Build scene nodes WITH parent relationship for GlobalGraph
  // Only set parentNode if the chapter actually exists
  const chapterIds = new Set(store.chapters.map(c => c.id));
  const sceneNodes = store.scenes.map(s => ({
    id: `scene-${s.id}`,
    type: 'scene',
    data: { title: s.title, sceneText: s.sceneText, chapterId: s.chapterId, choicesCount: Array.isArray(s.choices) ? s.choices.length : 0 },
    position: s.position ?? { x: Math.random() * 400, y: Math.random() * 400 }, // Random position if not set
    parentNode: chapterIds.has(s.chapterId) ? `chap-${s.chapterId}` : undefined, // Only set parent if chapter exists
    class: 'scene-node',
    draggable: true,
  }));

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

async function onConnect(params) {
  const sourceId = params.source?.replace('scene-', '');
  const targetId = params.target?.replace('scene-', '');
  if (!sourceId || !targetId) return;
  edges.value = [...edges.value, { id: `edge-${params.source}-${params.target}-${Date.now()}`, source: params.source, target: params.target, animated: true, markerEnd: 'arrowclosed' }];
  await store.addChoiceLink(sourceId, targetId);
}

async function onDelete() {
  const selectedNodes = getSelectedNodes.value;
  const selectedEdges = getSelectedEdges.value;

  if (selectedNodes.length > 0) {
    for (const node of selectedNodes) {
      await store.deleteNode(node);
    }
    removeNodes(selectedNodes.map(n => n.id));
  }

  if (selectedEdges.length > 0) {
    for (const edge of selectedEdges) {
      await store.deleteEdge(edge);
    }
    removeEdges(selectedEdges.map(e => e.id));
  }
}

onMounted(async () => { await refresh(); });

function onNodeDoubleClick(evt) {
  const n = evt?.node;
  if (n?.type === 'chapter') {
    const id = n.id.replace('chap-', '');
    router.push({ name: 'Chapter', params: { id } });
  }
}

function fit() { try { fitView(); } catch {} }
async function autoLayout() { const laidOut = await layoutScenes(getNodes(), getEdges()); for (const n of laidOut) updateNode(n.id, { position: n.position }); }
async function saveLayout() { const current = getNodes(); for (const n of current) { if (n.type === 'scene') await store.persistScenePosition(n.id.replace('scene-', ''), n.position); else if (n.type === 'chapter') await store.persistChapterPosition(n.id.replace('chap-', ''), n.position); } }
</script>

<style scoped>
.vue-flow-container {
  width: 100%;
  height: 100%;
}
</style>


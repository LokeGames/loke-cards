<template>
  <div class="h-full w-full relative bg-gray-50 dark:bg-gray-900">
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
      :min-zoom="0.1"
      :max-zoom="1.5"
      :node-types="nodeTypes"
      @node-drag-stop="onNodeDragStop"
      @connect="onConnect"
    >
      <Background />
      <MiniMap />
    </VueFlow>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { Background } from '@vue-flow/background';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/minimap/dist/style.css';
import { useRoute } from 'vue-router';
import { useGraphStore } from '@graph/stores/graph.js';
import { nodeTypes } from '@graph/nodeTypes.js';
import { buildSceneNodes, buildEdgesFromChoices } from '@graph/builders.js';

const route = useRoute();
const store = useGraphStore();
const nodes = ref([]);
const edges = ref([]);
const { fitView, getNodes, getEdges, updateNode } = useVueFlow();

const chapterScenes = computed(() => store.scenes.filter((s) => s.chapterId === route.params.id));

async function refresh() {
  await store.loadChapter(route.params.id);
  const sceneNodes = buildSceneNodes(chapterScenes.value, false);
  nodes.value = sceneNodes;
  const allEdges = buildEdgesFromChoices(store.scenes);
  const sceneIds = new Set(chapterScenes.value.map((s) => `scene-${s.id}`));
  edges.value = allEdges.filter((e) => sceneIds.has(e.source) && sceneIds.has(e.target));
}

function onNodeDragStop(evt) {
  const n = evt.node;
  if (n?.type === 'scene') { const id = n.id.replace('scene-', ''); store.persistScenePosition(id, n.position); }
}

onMounted(async () => { await refresh(); });

function fit() { try { fitView(); } catch (error) { console.error(error); } }
async function autoLayout() { const laidOut = await (await import('@graph/layout.js')).layoutScenes(getNodes(), getEdges()); for (const n of laidOut) updateNode(n.id, { position: n.position }); }
async function saveLayout() { const current = getNodes(); for (const n of current) { if (n.type === 'scene') await store.persistScenePosition(n.id.replace('scene-', ''), n.position); } }

async function onConnect(params) {
  const sourceId = params.source?.replace('scene-', '');
  const targetId = params.target?.replace('scene-', '');
  if (!sourceId || !targetId) return;
  edges.value = [...edges.value, { id: `edge-${params.source}-${params.target}-${Date.now()}`, source: params.source, target: params.target, animated: true, markerEnd: 'arrowclosed' }];
  await store.addChoiceLink(sourceId, targetId);
}
</script>

<style scoped>
.vue-flow-container {
  width: 100%;
  height: 100%;
}
</style>


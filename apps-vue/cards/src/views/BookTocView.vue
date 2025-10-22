<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Story Map
      </h1>
      <div class="flex items-center gap-2">
        <input
          v-model="q"
          type="text"
          placeholder="Search…"
          class="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />
        <select
          v-model="chapterFilter"
          class="px-2 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        >
          <option value="">All chapters</option>
          <option v-for="ch in chapters" :key="ch.id" :value="ch.id">
            {{ ch.name || ch.id }}
          </option>
        </select>
      </div>
    </div>
    <!-- Grouped by chapter like a TOC: chapter heading + indented scenes (with lanes) -->
    <div
      class="rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
    >
      <div
        v-for="grp in grouped"
        :key="grp.id"
        class="border-b border-gray-200 dark:border-gray-800"
      >
        <div
          class="px-4 py-2 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-semibold"
        >
          {{ grp.name }}
          <span class="text-xs text-gray-500 dark:text-gray-500 ml-2"
            >({{ grp.rows.length }})</span
          >
        </div>
        <div class="px-2 py-1">
          <TocRow
            v-for="row in grp.rows"
            :key="row.sceneId + '-' + row.lane"
            class="pl-4"
            :scene-id="row.sceneId"
            :chapter-id="chapterLabelById(row.chapterId)"
            :lane="row.lane"
            :lanes="maxLanes"
            :color="row.color"
            @open="openScene"
          />
          <div
            v-if="grp.rows.length === 0"
            class="p-3 text-xs text-gray-500 dark:text-gray-500"
          >
            No scenes in this chapter.
          </div>
        </div>
      </div>
      <div
        v-if="grouped.length === 0"
        class="p-4 text-sm text-gray-600 dark:text-gray-400"
      >
        No scenes.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSceneStore } from "../stores/scenes.js";
import { useChapterStore } from "../stores/chapters.js";
import { useProjectStore } from "../stores/project.js";
import { storeToRefs } from "pinia";
import TocRow from "../components/toc/TocRow.vue";
import { buildTocRows } from "../lib/toc";
import { toEditScene } from "../router/guards.js";
import { useRouter } from "vue-router";

const router = useRouter();
const sceneStore = useSceneStore();
const chapterStore = useChapterStore();
const project = useProjectStore();
if (!project.currentProject) project.init();

const loading = ref(true);
onMounted(async () => {
  try {
    await Promise.all([sceneStore.init(), chapterStore.init()]);
  } finally {
    loading.value = false;
  }
});

const { scenes } = storeToRefs(sceneStore);
const { chapters } = storeToRefs(chapterStore);

// Project scoping functions
function scopeScenes(arr) {
  const pid = project.currentProject?.id || "default";
  return (arr || []).filter((s) => (s.projectId || "default") === pid);
}

function scopeChapters(arr) {
  const pid = project.currentProject?.id || "default";
  return (arr || []).filter((c) => (c.projectId || "default") === pid);
}

const q = ref("");
const chapterFilter = ref("");

type TocRowType = {
  sceneId: string;
  chapterId?: string;
  lane: number;
  lanes: number;
  color: string;
};
const rows = computed<TocRowType[]>(() => {
  try {
    const scopedScenes = scopeScenes(scenes.value);
    return buildTocRows(Array.isArray(scopedScenes) ? scopedScenes : [], {
      chapterIdFilter: chapterFilter.value || null,
    });
  } catch (e) {
    console.warn("[StoryMap] build error", e);
    return [];
  }
});
const maxLanes = computed(() =>
  Math.max(1, ...rows.value.map((r) => r.lanes || 1)),
);
const filteredRows = computed(() => {
  const query = q.value.trim().toLowerCase();
  if (!query) return rows.value;
  return rows.value.filter((r) =>
    String(r.sceneId).toLowerCase().includes(query),
  );
});

// Chapters sorted by order or name
type ChapterLite = { id: string; name?: string; order?: number };
const chaptersSorted = computed<ChapterLite[]>(() => {
  const scopedChapters = scopeChapters(chapters.value);
  const list = (Array.isArray(scopedChapters) ? scopedChapters : []) as any[];
  return list.slice().sort((a, b) => {
    const ao = Number(a?.order ?? Number.MAX_SAFE_INTEGER);
    const bo = Number(b?.order ?? Number.MAX_SAFE_INTEGER);
    if (ao !== bo) return ao - bo;
    return String(a?.name || a?.id || "").localeCompare(
      String(b?.name || b?.id || ""),
    );
  });
});

// Group rows by chapter for TOC
const grouped = computed(() => {
  // Known chapters set
  const known = new Set<string>((chaptersSorted.value || []).map((c) => c.id));
  // Build chapter -> rows map from filtered rows, unknown chapterIds treated as unassigned
  const map = new Map<string, TocRowType[]>();
  for (const r of filteredRows.value) {
    const chId =
      r.chapterId && known.has(r.chapterId) ? r.chapterId : "__none__";
    if (!map.has(chId)) map.set(chId, []);
    map.get(chId)!.push(r);
  }
  const out: Array<{ id: string; name: string; rows: TocRowType[] }> = [];
  // Known chapters first (ordered)
  for (const ch of chaptersSorted.value) {
    const rows = map.get(ch.id) || [];
    out.push({ id: ch.id, name: ch.name || ch.id, rows });
    map.delete(ch.id);
  }
  // Unassigned (no chapter)
  if (map.has("__none__")) {
    out.push({
      id: "__none__",
      name: "(Unassigned)",
      rows: map.get("__none__") || [],
    });
    map.delete("__none__");
  }
  // Any remaining unknown chapter ids
  map.forEach((rows, id) => {
    out.push({ id, name: id, rows });
  });
  return out;
});

function openScene(id: string) {
  router.push(toEditScene(id));
}

const knownChapterIds = computed(
  () => new Set((chaptersSorted.value || []).map((c) => c.id)),
);
function chapterLabelById(id?: string) {
  if (!id) return "";
  return knownChapterIds.value.has(id) ? id : "";
}
</script>

<style scoped></style>

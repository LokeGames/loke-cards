// Build nodes and edges for Vue Flow from normalized domain data

export function buildChapterNodes(chapters = []) {
  return chapters.map((c) => ({
    id: `chap-${c.id}`,
    type: 'chapter',
    data: { title: c.title },
    position: c.position ?? { x: 0, y: 0 },
    class: 'chapter-node',
    extent: 'parent',
    draggable: true,
    selectable: true,
  }));
}

export function buildSceneNodes(scenes = [], parentByChapter = true) {
  return scenes.map((s) => ({
    id: `scene-${s.id}`,
    type: 'scene',
    data: {
      title: s.title,
      sceneText: s.sceneText,
      chapterId: s.chapterId,
      choicesCount: Array.isArray(s.choices) ? s.choices.length : 0,
    },
    position: s.position ?? { x: 0, y: 0 },
    parentNode: parentByChapter && s.chapterId ? `chap-${s.chapterId}` : undefined,
    class: 'scene-node',
    draggable: true,
  }));
}

// Build edges by deriving from scene choices (if a choice.nextScene matches an existing scene id)
export function buildEdgesFromChoices(scenes = []) {
  const sceneIdSet = new Set(scenes.map((s) => s.id));
  const edges = [];
  for (const s of scenes) {
    if (!Array.isArray(s.choices)) continue;
    for (const [i, ch] of s.choices.entries()) {
      const target = ch?.nextScene;
      if (!target || !sceneIdSet.has(target)) continue; // only draw edges to known nodes
      edges.push({
        id: `edge-${s.id}-${i}-${target}`,
        source: `scene-${s.id}`,
        target: `scene-${target}`,
        data: { type: 'jump' },
        animated: true,
        markerEnd: 'arrowclosed',
      });
    }
  }
  return edges;
}


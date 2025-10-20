// Runtime-safe helpers for building route locations

export function toEditScene(id) {
  return id ? { name: 'EditScene', params: { id: String(id) } } : '/scenes';
}

export function toEditChapter(id) {
  return id ? { name: 'EditChapter', params: { id: String(id) } } : '/chapters';
}

export function toNewSceneWithChapter(chapterId) {
  return chapterId ? { name: 'NewScene', query: { chapter: String(chapterId) } } : { name: 'NewScene' };
}


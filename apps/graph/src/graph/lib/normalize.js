/**
 * Graph app normalizers to provide a canonical shape.
 * Canonical fields: sceneId (primary id), id mirrors sceneId, chapterId.
 */

export function normalizeScene(row) {
  if (!row) return null;
  let src = row;
  try {
    if (typeof row === 'string') src = JSON.parse(row);
    if (row && row.data) {
      const parsed = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      src = { ...parsed };
      if (!src.id && row.id) src.id = row.id;
    }
  } catch {}
  const sceneId = src.sceneId || src.id || '';
  if (!sceneId) return null;
  const chapterId = src.chapterId || src.chapter || '';
  return { ...src, sceneId, id: sceneId, chapterId };
}

export function normalizeScenes(arr) {
  return (Array.isArray(arr) ? arr : []).map(normalizeScene).filter(Boolean);
}

export function normalizeChapter(row) {
  if (!row) return null;
  let src = row;
  try {
    if (typeof row === 'string') src = JSON.parse(row);
    if (row && row.data) {
      const parsed = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      src = { ...parsed };
      if (!src.id && row.id) src.id = row.id;
    }
  } catch {}
  return src;
}

export function normalizeChapters(arr) {
  return (Array.isArray(arr) ? arr : []).map(normalizeChapter).filter(Boolean);
}


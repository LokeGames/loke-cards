import api from '../api/client.js'
import { projectStore as lfProjects, saveProject, getProject, getCurrentProject, saveScene as saveSceneLocal, getAllScenes as getAllScenesLocal } from '@shared/lib/storage.js'

export async function importFromServerToLocal() {
  const healthy = await api.healthCheck();
  if (!healthy) throw new Error('BACKEND_OFFLINE');
  const [srvChapters, srvScenes] = await Promise.all([
    api.chapters.getAll(),
    api.scenes.getAll(),
  ]);
  for (const ch of (srvChapters || [])) {
    await saveChapterLocal({ id: ch.id, name: ch.name || ch.title || ch.id });
  }
  for (const sc of (srvScenes || [])) {
    const local = {
      id: sc.sceneId,
      sceneId: sc.sceneId,
      chapter: sc.chapterId,
      sceneText: sc.sceneText || '',
      choices: Array.isArray(sc.choices) ? sc.choices : [],
      stateChanges: Array.isArray(sc.stateChanges) ? sc.stateChanges : [],
      generatedCode: sc.generatedCode,
      synced: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveSceneLocal(local);
  }
  return { chapters: srvChapters?.length || 0, scenes: srvScenes?.length || 0 };
}

export async function autoBootstrapLocalFromServerIfEmpty() {
  try {
    const localScenes = await getAllScenesLocal();
    if (Array.isArray(localScenes) && localScenes.length > 0) return false;
  } catch {}
  try {
    const res = await importFromServerToLocal();
    return res;
  } catch {
    return false;
  }
}


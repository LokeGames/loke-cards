// LocalForage-backed adapter implementing the DB interface
import { getAllScenes, getScene, saveScene, deleteScene } from '../storage.js'
import { getAllChapters, getChapter, saveChapter, deleteChapter } from '../storage.js'

export function createLocalAdapter() {
  return {
    // Scenes
    async scenesList() { return await getAllScenes() },
    async scenesGet(id) { return await getScene(id) },
    async scenesPut(scene) { return await saveScene(scene) },
    async scenesDelete(id) { return await deleteScene(id) },
    // Chapters
    async chaptersList() { return await getAllChapters() },
    async chaptersGet(id) { return await getChapter(id) },
    async chaptersPut(ch) { return await saveChapter(ch) },
    async chaptersDelete(id) { return await deleteChapter(id) },
  }
}


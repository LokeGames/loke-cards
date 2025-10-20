import localforage from 'localforage';

export const sceneStore = localforage.createInstance({ name: 'loke-cards-nodeview', storeName: 'scenes' });
export const chapterStore = localforage.createInstance({ name: 'loke-cards-nodeview', storeName: 'chapters' });

export async function saveScene(scene) { scene.updatedAt = Date.now(); if (!scene.createdAt) scene.createdAt = scene.updatedAt; await sceneStore.setItem(scene.id, scene); return scene; }
export async function getScene(sceneId) { return await sceneStore.getItem(sceneId); }
export async function getAllScenes() { const scenes = []; await sceneStore.iterate((v) => { scenes.push(v); }); return scenes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)); }
export async function deleteScene(sceneId) { await sceneStore.removeItem(sceneId); }

export async function saveChapter(chapter) { chapter.updatedAt = Date.now(); if (!chapter.createdAt) chapter.createdAt = chapter.updatedAt; await chapterStore.setItem(chapter.id, chapter); return chapter; }
export async function getChapter(chapterId) { return await chapterStore.getItem(chapterId); }
export async function getAllChapters() { const chapters = []; await chapterStore.iterate((v) => { chapters.push(v); }); if (chapters.length === 0) { const defaults = [ { id: 'chapter01', name: 'Chapter 01', scenes: [], order: 1 }, { id: 'chapter02', name: 'Chapter 02', scenes: [], order: 2 } ]; for (const ch of defaults) { await saveChapter(ch); chapters.push(ch); } } return chapters.sort((a, b) => (a.order || 0) - (b.order || 0)); }
export async function deleteChapter(chapterId) { await chapterStore.removeItem(chapterId); }


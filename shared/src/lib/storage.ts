import localforage from 'localforage';
import { emitDataChange } from './events';

export type Choice = { text: string; nextScene: string; enabled: boolean; condition?: string };
export type StateChange = { variable: string; operator: string; value: string };
export type Scene = { id: string; sceneId: string; chapter: string; sceneText: string; choices: Choice[]; stateChanges: StateChange[]; generatedCode?: string; createdAt: number; updatedAt: number; synced?: boolean; projectId?: string };
export type Chapter = { id: string; name: string; scenes: string[]; order: number; createdAt?: number; updatedAt?: number; projectId?: string };
export type Project = { id: string; name: string; chapters: string[]; sceneCount: number; createdAt: number; updatedAt: number };

export const sceneStore = localforage.createInstance({ name: 'loke-cards', storeName: 'scenes', description: 'Scene data storage' });
export const chapterStore = localforage.createInstance({ name: 'loke-cards', storeName: 'chapters', description: 'Chapter metadata storage' });
export const draftStore = localforage.createInstance({ name: 'loke-cards', storeName: 'drafts', description: 'Draft scenes' });
export const projectStore = localforage.createInstance({ name: 'loke-cards', storeName: 'projects', description: 'Project metadata' });

export async function saveScene(scene: Scene): Promise<Scene> { scene.updatedAt = Date.now(); if (!scene.createdAt) scene.createdAt = scene.updatedAt; await sceneStore.setItem(scene.id, scene); try { emitDataChange({ entity: 'scene', action: 'upsert', id: scene.id, projectId: scene.projectId }); } catch {} return scene; }
export async function getScene(id: string): Promise<Scene | null> { return await sceneStore.getItem<Scene>(id); }
export async function getAllScenes(): Promise<Scene[]> { const arr: Scene[] = []; await sceneStore.iterate<Scene, void>((v) => { arr.push(v); }); return arr.sort((a,b)=>b.updatedAt-a.updatedAt); }
export async function getScenesByChapter(chapterId: string): Promise<Scene[]> { const arr: Scene[] = []; await sceneStore.iterate<Scene, void>((v) => { if (v.chapter === chapterId) arr.push(v); }); return arr.sort((a,b)=>a.createdAt-b.createdAt); }
export async function deleteScene(id: string): Promise<void> { await sceneStore.removeItem(id); try { emitDataChange({ entity: 'scene', action: 'delete', id }); } catch {} }

export async function saveChapter(chapter: Chapter): Promise<Chapter> { chapter.updatedAt = Date.now(); if (!chapter.createdAt) chapter.createdAt = chapter.updatedAt; await chapterStore.setItem(chapter.id, chapter); try { emitDataChange({ entity: 'chapter', action: 'upsert', id: chapter.id, projectId: chapter.projectId }); } catch {} return chapter; }
export async function getChapter(id: string): Promise<Chapter | null> { return await chapterStore.getItem<Chapter>(id); }
export async function getAllChapters(): Promise<Chapter[]> { const arr: Chapter[] = []; await chapterStore.iterate<Chapter, void>((v) => { arr.push(v); }); if (arr.length === 0) { const defaults: Chapter[] = [ { id:'chapter01', name:'Chapter 01', scenes:[], order:1 }, { id:'chapter02', name:'Chapter 02', scenes:[], order:2 } ]; for (const c of defaults) { await saveChapter(c); arr.push(c); } } return arr.sort((a,b)=>a.order-b.order); }
export async function deleteChapter(id: string): Promise<void> { await chapterStore.removeItem(id); try { emitDataChange({ entity: 'chapter', action: 'delete', id }); } catch {} }

export async function saveDraft(sceneId: string, draftData: unknown): Promise<{ sceneId: string; data: unknown; timestamp: number }> { const draft = { sceneId, data: draftData, timestamp: Date.now() }; await draftStore.setItem(sceneId, draft); return draft; }
export async function getDraft(sceneId: string) { return await draftStore.getItem(sceneId); }
export async function deleteDraft(sceneId: string): Promise<void> { await draftStore.removeItem(sceneId); }
export async function getAllDrafts() { const arr: any[] = []; await draftStore.iterate((v)=>arr.push(v)); return arr.sort((a,b)=>b.timestamp-a.timestamp); }

export async function saveProject(project: Project): Promise<Project> { project.updatedAt = Date.now(); if (!project.createdAt) project.createdAt = project.updatedAt; await projectStore.setItem(project.id, project); return project; }
export async function getProject(id: string): Promise<Project | null> { return await projectStore.getItem<Project>(id); }
export async function getCurrentProject(): Promise<Project> { let current: Project | null = null; await projectStore.iterate<Project, void>((v) => { if (!current) current = v; }); if (!current) current = await createDefaultProject(); return current; }
export async function createDefaultProject(): Promise<Project> { const project: Project = { id: 'default', name: (import.meta as any)?.env?.VITE_PROJECT_NAME || 'My Adventure', chapters: [], sceneCount: 0, createdAt: Date.now(), updatedAt: Date.now() }; await saveProject(project); return project; }

export async function clearAllData(): Promise<void> { await sceneStore.clear(); await chapterStore.clear(); await draftStore.clear(); await projectStore.clear(); }
export async function getStorageStats(): Promise<{ scenes: number; chapters: number; drafts: number }> { return { scenes: await sceneStore.length(), chapters: await chapterStore.length(), drafts: await draftStore.length() }; }
export async function exportData(): Promise<string> { const data = { scenes: await getAllScenes(), chapters: await getAllChapters(), project: await getCurrentProject(), exportedAt: Date.now() }; return JSON.stringify(data, null, 2); }
export async function importData(json: string) { const data = JSON.parse(json); if (data.chapters) for (const c of data.chapters) await saveChapter(c); if (data.scenes) for (const s of data.scenes) await saveScene(s); if (data.project) await saveProject(data.project); return data; }


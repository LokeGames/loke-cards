import { db } from '@loke/shared/database';
import type { Chapter } from '@schemas';

export async function getChapters(): Promise<Chapter[]> {
  return db.getAllChapters();
}

export async function getScenes() {
  return db.getAllScenes();
}

export async function createChapter(chapter: Omit<Chapter, 'id'>) {
  return db.createChapter(chapter);
}

export async function createScene(scene: any) {
  return db.createScene(scene);
}

export async function updateScene(id: string, updates: any) {
  return db.updateScene(id, updates);
}

export async function deleteScene(id: string) {
  return db.deleteScene(id);
}

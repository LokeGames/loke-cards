import { writable, get, type Writable } from 'svelte/store';
import { getCurrentProject, saveProject, type Project } from '../storage';

export const currentProject: Writable<Project | null> = writable(null);
export const projects: Writable<Project[]> = writable([]);

export async function init(): Promise<void> {
  const p = await getCurrentProject();
  currentProject.set(p);
  const list = new Map<string, Project>();
  if (p) list.set(p.id, p);
  projects.set(Array.from(list.values()));
}

export async function selectProject(id: string): Promise<void> {
  const list = get(projects);
  const found = list.find((p) => p.id === id) || null;
  if (found) currentProject.set(found);
}

export async function createProject(name: string): Promise<Project> {
  const p: Project = { id: name.toLowerCase().replace(/\s+/g, '-'), name, chapters: [], sceneCount: 0, createdAt: Date.now(), updatedAt: Date.now() };
  await saveProject(p);
  const list = get(projects);
  projects.set([...list, p]);
  currentProject.set(p);
  return p;
}


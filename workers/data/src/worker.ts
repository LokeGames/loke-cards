// Minimal SharedWorker that responds to 'ping' with 'pong'.
// No external dependencies; plain postMessage protocol.

import * as Comlink from 'comlink';
import { SceneSchema, ChapterSchema, GraphJSONSchema, type Scene, type Chapter, type GraphJSON } from '@schemas';
import { createDB } from './db';

// Lazy DB init per port; keeps startup light
let dbPromise: Promise<ReturnType<typeof createDB>> | null = null;
const getDB = () => (dbPromise ??= createDB());

const api = {
  ping(): 'pong' {
    return 'pong' as const;
  },
  cards: {
    async create(s: Scene): Promise<Scene> {
      const parsed = SceneSchema.parse(s);
      const db = await getDB();
      return db.cards.create(parsed);
    },
    async get(id: string): Promise<Scene | null> {
      const db = await getDB();
      return db.cards.get(id);
    },
    async list(): Promise<Scene[]> {
      const db = await getDB();
      return db.cards.list();
    },
    async update(s: Scene): Promise<Scene> {
      const parsed = SceneSchema.parse(s);
      const db = await getDB();
      return db.cards.update(parsed);
    },
    async delete(id: string): Promise<boolean> {
      const db = await getDB();
      return db.cards.delete(id);
    },
  },
  chapters: {
    async create(c: Chapter): Promise<Chapter> {
      const parsed = ChapterSchema.parse(c);
      const db = await getDB();
      return db.chapters.create(parsed);
    },
    async get(id: string): Promise<Chapter | null> {
      const db = await getDB();
      return db.chapters.get(id);
    },
    async list(): Promise<Chapter[]> {
      const db = await getDB();
      return db.chapters.list();
    },
    async update(c: Chapter): Promise<Chapter> {
      const parsed = ChapterSchema.parse(c);
      const db = await getDB();
      return db.chapters.update(parsed);
    },
    async delete(id: string): Promise<boolean> {
      const db = await getDB();
      return db.chapters.delete(id);
    },
  },
  graph: {
    async getProjectGraph(projectId?: string): Promise<GraphJSON> {
      const db = await getDB();
      const scenes = await db.cards.list();
      const chaps = await db.chapters.list();
      const pos = await db.positions.all();
      const nodes = [
        ...chaps.map((c) => ({ id: `chapter:${c.chapterId}`, type: 'chapter', label: c.title, position: (pos.find(p=>p.nodeId===`chapter:${c.chapterId}`) ? { x: pos.find(p=>p.nodeId===`chapter:${c.chapterId}`)!.x, y: pos.find(p=>p.nodeId===`chapter:${c.chapterId}`)!.y } : undefined) })),
        ...scenes.map((s) => ({ id: `scene:${s.sceneId}`, type: 'scene', label: s.title, position: (pos.find(p=>p.nodeId===`scene:${s.sceneId}`) ? { x: pos.find(p=>p.nodeId===`scene:${s.sceneId}`)!.x, y: pos.find(p=>p.nodeId===`scene:${s.sceneId}`)!.y } : undefined) })),
      ];
      const edgesDb = await db.edges.list();
      const edges = edgesDb.map((e) => ({ id: `edge:${e.id}`, source: `scene:${e.source}`, target: `scene:${e.target}` }));
      const graph: GraphJSON = { projectId, nodes, edges };
      return GraphJSONSchema.parse(graph);
    },
    async getChapterGraph(chapterId: string, projectId?: string): Promise<GraphJSON> {
      const db = await getDB();
      const scenes = (await db.cards.list()).filter((s) => s.chapterId === chapterId);
      const chaps = (await db.chapters.list()).filter((c) => c.chapterId === chapterId);
      const pos = await db.positions.all();
      const nodes = [
        ...chaps.map((c) => ({ id: `chapter:${c.chapterId}`, type: 'chapter', label: c.title, position: (pos.find(p=>p.nodeId===`chapter:${c.chapterId}`) ? { x: pos.find(p=>p.nodeId===`chapter:${c.chapterId}`)!.x, y: pos.find(p=>p.nodeId===`chapter:${c.chapterId}`)!.y } : undefined) })),
        ...scenes.map((s) => ({ id: `scene:${s.sceneId}`, type: 'scene', label: s.title, position: (pos.find(p=>p.nodeId===`scene:${s.sceneId}`) ? { x: pos.find(p=>p.nodeId===`scene:${s.sceneId}`)!.x, y: pos.find(p=>p.nodeId===`scene:${s.sceneId}`)!.y } : undefined) })),
      ];
      const edgesDb = (await db.edges.list()).filter((e) => scenes.some((s) => s.sceneId === e.source || s.sceneId === e.target));
      const edges = edgesDb.map((e) => ({ id: `edge:${e.id}`, source: `scene:${e.source}`, target: `scene:${e.target}` }));
      const graph: GraphJSON = { projectId, nodes, edges };
      return GraphJSONSchema.parse(graph);
    },
    async createLink(sourceSceneId: string, targetSceneId: string) {
      const db = await getDB();
      return db.edges.create(sourceSceneId, targetSceneId);
    },
    async deleteLink(edgeId: string) {
      const db = await getDB();
      const id = edgeId.replace(/^edge:/, '');
      return db.edges.delete(id);
    },
    async setNodePosition(nodeId: string, x: number, y: number) {
      const db = await getDB();
      await db.positions.set(nodeId, x, y);
      return true;
    },
  },
};

// SharedWorker connect: expose API on each port via Comlink
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(self as any).onconnect = (event: MessageEvent) => {
  const port = (event as unknown as { ports: MessagePort[] }).ports[0];
  Comlink.expose(api, port);
  port.start();
};

// Minimal RPC client for the SharedWorker in workers/data
import type { Scene, Chapter } from '@schemas';
import * as Comlink from 'comlink';

type PingResult = 'pong';

type Response = { id: string; ok: true; result: unknown } | { id: string; ok: false; error: string };

type DataApi = {
  ping(): PingResult;
  cards: {
    create(s: Scene): Scene;
    get(id: string): Scene | null;
    list(): Scene[];
    update(s: Scene): Scene;
    delete(id: string): boolean;
  };
  chapters: {
    create(c: Chapter): Chapter;
    get(id: string): Chapter | null;
    list(): Chapter[];
    update(c: Chapter): Chapter;
    delete(id: string): boolean;
  };
};

export class DataWorkerClient {
  private worker: SharedWorker;
  private port: MessagePort;
  private api: Comlink.Remote<DataApi>;
  constructor() {
    this.worker = new SharedWorker(new URL('@workers-data/worker.ts', import.meta.url), { type: 'module' });
    this.port = this.worker.port;
    this.port.start();
    this.api = Comlink.wrap<DataApi>(this.port);
  }

  ping(): Promise<PingResult> {
    return this.api.ping();
  }

  // Cards namespace
  cards = {
    create: (scene: Scene) => this.api.cards.create(scene),
    get: (sceneId: string) => this.api.cards.get(sceneId),
    list: () => this.api.cards.list(),
    update: (scene: Scene) => this.api.cards.update(scene),
    delete: (sceneId: string) => this.api.cards.delete(sceneId),
  };

  // Chapters namespace
  chapters = {
    create: (chapter: Chapter) => this.api.chapters.create(chapter),
    get: (chapterId: string) => this.api.chapters.get(chapterId),
    list: () => this.api.chapters.list(),
    update: (chapter: Chapter) => this.api.chapters.update(chapter),
    delete: (chapterId: string) => this.api.chapters.delete(chapterId),
  };
}

export function createDataWorkerClient(): DataWorkerClient {
  return new DataWorkerClient();
}

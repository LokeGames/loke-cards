// Minimal RPC client for the SharedWorker in workers/data
import type { Scene, Chapter } from '@schemas';

type PingResult = 'pong';

type Response = { id: string; ok: true; result: unknown } | { id: string; ok: false; error: string };

export class DataWorkerClient {
  private worker: SharedWorker;
  private port: MessagePort;
  constructor() {
    this.worker = new SharedWorker(new URL('@workers-data/worker.ts', import.meta.url), { type: 'module' });
    this.port = this.worker.port;
    this.port.start();
  }

  private call<T>(ns: 'cards', method: string, params?: unknown): Promise<T> {
    const id = Math.random().toString(36).slice(2);
    return new Promise((resolve, reject) => {
      const onMessage = (e: MessageEvent<Response>) => {
        const data = e.data;
        if (!data || data.id !== id) return;
        this.port.removeEventListener('message', onMessage as EventListener);
        if (data.ok) resolve(data.result as T);
        else reject(new Error(data.error));
      };
      this.port.addEventListener('message', onMessage as EventListener);
      try {
        this.port.postMessage({ id, kind: 'rpc', ns, method, params });
      } catch (e) {
        this.port.removeEventListener('message', onMessage as EventListener);
        reject(e);
      }
    });
  }

  ping(): Promise<PingResult> {
    const id = Math.random().toString(36).slice(2);
    return new Promise((resolve, reject) => {
      const onMessage = (e: MessageEvent<Response>) => {
        const data = e.data;
        if (!data || data.id !== id) return;
        this.port.removeEventListener('message', onMessage as EventListener);
        if (data.ok && data.result === 'pong') resolve('pong');
        else reject(new Error('unexpected'));
      };
      this.port.addEventListener('message', onMessage as EventListener);
      try {
        this.port.postMessage({ id, kind: 'ping' });
      } catch (e) {
        this.port.removeEventListener('message', onMessage as EventListener);
        reject(e);
      }
    });
  }

  // Cards namespace
  cards = {
    create: (scene: Scene) => this.call<Scene>('cards', 'create', scene),
    get: (sceneId: string) => this.call<Scene | null>('cards', 'get', sceneId),
    list: () => this.call<Scene[]>('cards', 'list'),
    update: (scene: Scene) => this.call<Scene>('cards', 'update', scene),
    delete: (sceneId: string) => this.call<boolean>('cards', 'delete', sceneId),
  };

  // Chapters namespace
  chapters = {
    create: (chapter: Chapter) => this.call<Chapter>('chapters', 'create', chapter),
    get: (chapterId: string) => this.call<Chapter | null>('chapters', 'get', chapterId),
    list: () => this.call<Chapter[]>('chapters', 'list'),
    update: (chapter: Chapter) => this.call<Chapter>('chapters', 'update', chapter),
    delete: (chapterId: string) => this.call<boolean>('chapters', 'delete', chapterId),
  };
}

export function createDataWorkerClient(): DataWorkerClient {
  return new DataWorkerClient();
}

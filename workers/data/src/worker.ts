// Minimal SharedWorker that responds to 'ping' with 'pong'.
// No external dependencies; plain postMessage protocol.

import type { Scene } from '@schemas';

type Request =
  | { id: string; kind: 'ping' }
  | { id: string; kind: 'rpc'; ns: 'cards'; method: string; params?: unknown };

type Response = { id: string; ok: true; result: unknown } | { id: string; ok: false; error: string };

// In-memory stores (bootstrapping; replace with DB later)
const cards = new Map<string, Scene>();
type Chapter = { chapterId: string; title: string; createdAt: number; updatedAt: number };
const chapters = new Map<string, Chapter>();

function handleRpc(ns: string, method: string, params: unknown): unknown {
  if (ns === 'cards') {
    if (method === 'create') {
      const s = params as Scene;
      cards.set(s.sceneId, s);
      return s;
    }
    if (method === 'get') {
      const id = params as string;
      return cards.get(id) || null;
    }
    if (method === 'list') {
      return Array.from(cards.values());
    }
    if (method === 'update') {
      const s = params as Scene;
      if (!cards.has(s.sceneId)) throw new Error('not_found');
      cards.set(s.sceneId, s);
      return s;
    }
    if (method === 'delete') {
      const id = params as string;
      return cards.delete(id);
    }
  }
  if (ns === 'chapters') {
    if (method === 'create') {
      const c = params as Chapter;
      chapters.set(c.chapterId, c);
      return c;
    }
    if (method === 'get') {
      const id = params as string;
      return chapters.get(id) || null;
    }
    if (method === 'list') {
      return Array.from(chapters.values());
    }
    if (method === 'update') {
      const c = params as Chapter;
      if (!chapters.has(c.chapterId)) throw new Error('not_found');
      chapters.set(c.chapterId, c);
      return c;
    }
    if (method === 'delete') {
      const id = params as string;
      return chapters.delete(id);
    }
  }
  throw new Error(`unknown_method: ${ns}.${method}`);
}

// SharedWorker global scope typings are not present in TS DOM lib by default.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(self as any).onconnect = (event: MessageEvent) => {
  const port = (event as unknown as { ports: MessagePort[] }).ports[0];
  port.onmessage = (e: MessageEvent<Request>) => {
    const msg = e.data;
    if (!msg) return;
    if (msg.kind === 'ping') {
      const res: Response = { id: msg.id, ok: true, result: 'pong' };
      port.postMessage(res);
      return;
    }
    if (msg.kind === 'rpc') {
      try {
        const result = handleRpc(msg.ns, msg.method, msg.params);
        const res: Response = { id: msg.id, ok: true, result };
        port.postMessage(res);
      } catch (err) {
        const res: Response = { id: msg.id, ok: false, error: err instanceof Error ? err.message : String(err) };
        port.postMessage(res);
      }
      return;
    }
  };
  port.start();
};

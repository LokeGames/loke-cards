import * as Comlink from 'comlink';
import type { Chapter } from '@schemas';

type DataApi = {
  chapters: {
    list(): Promise<Chapter[]>;
  };
};

export async function getChapters(): Promise<Chapter[]> {
  const worker = new SharedWorker(new URL('@workers-data/worker.ts', import.meta.url), { type: 'module' });
  worker.port.start();
  const api = Comlink.wrap<DataApi>(worker.port);
  return api.chapters.list();
}


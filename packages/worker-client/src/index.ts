import * as Comlink from 'comlink';
import type { API } from '@loke/workers-data/src/worker'; // Assuming worker.ts exports its API type
import Worker from '@loke/workers-data/src/worker?worker'; // Import as a worker

let workerApi: Comlink.Remote<API> | null = null;

export async function getWorkerApi(): Promise<Comlink.Remote<API>> {
  if (!workerApi) {
    const worker = new Worker({ type: 'module', name: 'data-worker' });
    workerApi = Comlink.wrap<API>(worker.port);
  }
  return workerApi;
}

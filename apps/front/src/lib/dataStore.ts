import { writable, type Writable } from 'svelte/store';
import * as Comlink from 'comlink';

type DataApi = {
  ping(): 'pong';
};

export const dataApi: Writable<Comlink.Remote<DataApi> | null> = writable(null);

export function initDataApi(): void {
  try {
    // Using the same worker entry as cards; Comlink wraps the SharedWorker port
    const worker = new SharedWorker(new URL('@workers-data/worker.ts', import.meta.url), { type: 'module' });
    worker.port.start();
    const api = Comlink.wrap<DataApi>(worker.port);
    dataApi.set(api);
  } catch (e) {
    // In non-browser or unsupported environments just leave null
    dataApi.set(null);
  }
}


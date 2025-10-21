import { vi, test, expect, beforeEach } from 'vitest';
import * as Comlink from 'comlink';

beforeEach(() => {
  // @ts-ignore
  global.SharedWorker = class {
    port = { start: vi.fn() } as any;
    constructor(public url: string, _opts: any) {}
  } as any;
});

test('connects to SharedWorker on init', async () => {
  const wrapSpy = vi.spyOn(Comlink, 'wrap').mockImplementation(() => ({ ping: () => 'pong' } as any));
  const { dataApi, initDataApi } = await import('../src/lib/dataStore');
  let value: any = null;
  const unsub = dataApi.subscribe((v) => (value = v));
  initDataApi();
  expect(wrapSpy).toHaveBeenCalledTimes(1);
  expect(value).not.toBeNull();
  unsub();
});


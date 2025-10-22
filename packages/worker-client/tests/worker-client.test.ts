
import { describe, it, expect } from 'vitest';
import { getWorkerApi } from '../src';

describe('Worker Client', () => {
  it('should be able to get the worker API and call a method', async () => {
    const workerApi = await getWorkerApi();
    expect(workerApi).toBeDefined();
    expect(typeof workerApi.cards.list).toBe('function');

    // Call a method to ensure communication is working
    const cards = await workerApi.cards.list();
    expect(cards).toBeInstanceOf(Array);
  });
});

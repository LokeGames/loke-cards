import { writable, type Writable } from 'svelte/store';
import { db } from '@loke/shared/database';

// Simple store for database instance - no workers, no Comlink
export const dataApi: Writable<typeof db | null> = writable(db);

export function initDataApi(): void {
  // Database is already initialized as singleton
  dataApi.set(db);
}

import { writable, type Writable } from 'svelte/store';

export type SyncStatus = 'synced' | 'syncing' | 'idle' | 'offline' | 'error';

export const status: Writable<SyncStatus> = writable('idle');
export const pending: Writable<number> = writable(0);
export const lastSync: Writable<number | null> = writable(null);
export const error: Writable<unknown> = writable(null);

export function markOffline(): void { status.set('offline'); }
export function markSynced(): void { status.set('synced'); lastSync.set(Date.now()); }
export function setStatus(s: SyncStatus): void { status.set(s); }
export function setPending(n: number): void { pending.set(n); }
export function setError(e: unknown): void { error.set(e); status.set('error'); }


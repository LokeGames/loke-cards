import { writable, type Writable } from 'svelte/store';

export type Toast = { id: string; message: string; type?: 'info' | 'success' | 'warn' | 'error'; timeout?: number };

export const toasts: Writable<Toast[]> = writable([]);

export function addToast(message: string, opts: { type?: Toast['type']; timeout?: number } = {}): string {
  const id = crypto.randomUUID();
  const toast: Toast = { id, message, type: opts.type || 'info', timeout: opts.timeout ?? 3000 };
  toasts.update((arr) => [...arr, toast]);
  if (toast.timeout) setTimeout(() => removeToast(id), toast.timeout);
  return id;
}

export function removeToast(id: string): void {
  toasts.update((arr) => arr.filter((t) => t.id !== id));
}


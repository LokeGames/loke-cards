const EVT = 'lc:data-change';
const EVT_PROJECT = 'lc:project-change';

export function emitDataChange(detail: unknown): void {
  try { const ev = new CustomEvent(EVT, { detail }); window.dispatchEvent(ev); } catch {}
  try { const bc = new BroadcastChannel('loke-cards'); bc.postMessage({ type: EVT, detail }); bc.close(); } catch {}
}

export function onDataChange(handler: (_detail: unknown) => void): () => void {
  const wrapped = (e: Event) => handler((e as CustomEvent)?.detail);
  window.addEventListener(EVT, wrapped as EventListener);
  let bc: BroadcastChannel | undefined;
  try {
    bc = new BroadcastChannel('loke-cards');
    bc.onmessage = (msg) => { if ((msg?.data as any)?.type === EVT) handler((msg.data as any).detail); };
  } catch {}
  return () => { window.removeEventListener(EVT, wrapped as EventListener); try { bc?.close(); } catch {} };
}

export function emitProjectChange(detail: unknown): void {
  try { window.dispatchEvent(new CustomEvent(EVT_PROJECT, { detail })); } catch {}
  try { const bc = new BroadcastChannel('loke-cards'); bc.postMessage({ type: EVT_PROJECT, detail }); bc.close(); } catch {}
}

export function onProjectChange(handler: (_detail: unknown) => void): () => void {
  const wrapped = (e: Event) => handler((e as CustomEvent)?.detail);
  window.addEventListener(EVT_PROJECT, wrapped as EventListener);
  let bc: BroadcastChannel | undefined;
  try { bc = new BroadcastChannel('loke-cards'); bc.onmessage = (msg) => { if ((msg?.data as any)?.type === EVT_PROJECT) handler((msg.data as any).detail); }; } catch {}
  return () => { window.removeEventListener(EVT_PROJECT, wrapped as EventListener); try { bc?.close(); } catch {} };
}

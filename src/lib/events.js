// Lightweight event bus for app-wide data change notifications

const EVT = 'lc:data-change'
const EVT_PROJECT = 'lc:project-change'

export function emitDataChange(detail) {
  try {
    const ev = new CustomEvent(EVT, { detail })
    window.dispatchEvent(ev)
  } catch {}
  try {
    // Cross-tab notifications
    const bc = new BroadcastChannel('loke-cards')
    bc.postMessage({ type: EVT, detail })
    // close channel to avoid leaks
    bc.close()
  } catch {}
}

export function onDataChange(handler) {
  const wrapped = (e) => handler(e?.detail)
  window.addEventListener(EVT, wrapped)
  // Cross-tab listener
  let bc
  try {
    bc = new BroadcastChannel('loke-cards')
    bc.onmessage = (msg) => {
      if (msg?.data?.type === EVT) handler(msg.data.detail)
    }
  } catch {}
  return () => {
    window.removeEventListener(EVT, wrapped)
    try { if (bc) bc.close() } catch {}
  }
}

export function emitProjectChange(detail) {
  try { window.dispatchEvent(new CustomEvent(EVT_PROJECT, { detail })) } catch {}
  try { const bc = new BroadcastChannel('loke-cards'); bc.postMessage({ type: EVT_PROJECT, detail }); bc.close() } catch {}
}

export function onProjectChange(handler) {
  const wrapped = (e) => handler(e?.detail)
  window.addEventListener(EVT_PROJECT, wrapped)
  let bc
  try { bc = new BroadcastChannel('loke-cards'); bc.onmessage = (msg) => { if (msg?.data?.type === EVT_PROJECT) handler(msg.data.detail) } } catch {}
  return () => { window.removeEventListener(EVT_PROJECT, wrapped); try { if (bc) bc.close() } catch {} }
}

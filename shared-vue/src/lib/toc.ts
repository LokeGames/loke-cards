// Helpers to build a Git-style TOC (lanes) from scenes/choices

function hashColor(i) {
  const colors = ['#2563eb', '#16a34a', '#d97706', '#db2777', '#0891b2', '#7c3aed', '#ef4444']
  return colors[i % colors.length]
}

export function buildEdges(scenes: Array<any>) {
  const edges: Array<{ source: string; target: string }> = []
  const seen = new Set<string>()
  for (const s of scenes) {
    const src = s.sceneId || s.id
    if (!src) continue
    if (Array.isArray(s.choices)) {
      for (const ch of s.choices) {
        const tgt = ch?.nextScene
        if (!tgt) continue
        const key = `${src}->${tgt}`
        if (seen.has(key)) continue
        seen.add(key)
        edges.push({ source: src, target: tgt })
      }
    }
  }
  return edges
}

export function buildTocRows(scenes: Array<any>, { chapterIdFilter = null }: { chapterIdFilter?: string | null } = {}) {
  // Normalize
  const list = (Array.isArray(scenes) ? scenes : [])
    .filter(Boolean)
    .map(s => ({ id: s.sceneId || s.id, chapterId: s.chapterId || s.chapter, choices: Array.isArray(s.choices) ? s.choices : [] }))
    .filter(s => s.id)

  const byId = new Map<string, any>(list.map(s => [s.id, s]))
  const edges = buildEdges(list)

  // Incoming counts
  const incoming = new Map<string, number>()
  for (const e of edges) incoming.set(e.target, (incoming.get(e.target) || 0) + 1)

  // Entries: no incoming
  const entries = list.filter(s => !incoming.has(s.id))
  const order: string[] = []
  const visited = new Set<string>()
  const q = [...entries]
  while (q.length) {
    const cur = q.shift()
    if (!cur || visited.has(cur.id)) continue
    visited.add(cur.id)
    order.push(cur.id)
    // enqueue targets
    const outs = (cur.choices || []).map(c => c?.nextScene).filter(Boolean)
    for (const t of outs) {
      if (!visited.has(t) && byId.has(t)) q.push(byId.get(t))
    }
  }
  // Append any remaining (cycles, islands)
  for (const s of list) if (!visited.has(s.id)) order.push(s.id)

  // Lane assignment (git-style)
  const rows: Array<{ sceneId: string; chapterId?: string; lane: number; lanes: number; color: string }> = []
  const pendingLane = new Map<string, number>() // sceneId -> lane idx reserved by predecessor
  let activeLanes: string[] = [] // array of sceneIds occupying lanes (visual continuity)
  let maxLanes = 1
  for (const id of order) {
    const node = byId.get(id)
    if (!node) continue
    if (chapterIdFilter && node.chapterId !== chapterIdFilter) {
      // still maintain lane reservations to keep global shape
      continue
    }
    let lane = 0
    if (pendingLane.has(id)) {
      lane = pendingLane.get(id)
      pendingLane.delete(id)
    } else {
      // find first free lane
      const used = new Set(pendingLane.values())
      for (let i = 0; ; i++) {
        if (!used.has(i)) { lane = i; break }
      }
    }
    // Update max
    maxLanes = Math.max(maxLanes, lane + 1)

    // Reserve lanes for outgoing
    const outs = (node.choices || []).map(c => c?.nextScene).filter(Boolean)
    let first = true
    for (const t of outs) {
      if (!byId.has(t)) continue
      if (first) {
        pendingLane.set(t, lane)
        first = false
      } else {
        // allocate next lane to the right
        let newLane = lane + 1
        while ([...pendingLane.values()].includes(newLane)) newLane++
        pendingLane.set(t, newLane)
        maxLanes = Math.max(maxLanes, newLane + 1)
      }
    }

    rows.push({ sceneId: node.id, chapterId: node.chapterId, lane, lanes: maxLanes })
  }
  return rows.map(r => ({ ...r, color: hashColor(r.lane) }))
}

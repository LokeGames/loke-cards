import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();
const defaultOptions = { 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT', 'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX', 'elk.spacing.nodeNode': '40' };

export async function layoutScenes(nodes = [], edges = []) {
  if (!nodes.length) return nodes;
  const elkGraph = { id: 'root', children: nodes.map(n => ({ id: n.id, width: 180, height: 60 })), edges: edges.map(e => ({ id: e.id, sources: [e.source], targets: [e.target] })) };
  const res = await elk.layout(elkGraph, { layoutOptions: defaultOptions });
  const posById = new Map((res.children || []).map(c => [c.id, { x: c.x || 0, y: c.y || 0 }]));
  return nodes.map(n => ({ ...n, position: posById.get(n.id) ?? n.position }));
}


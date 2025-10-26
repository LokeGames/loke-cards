/**
 * Database to Graph Adapter
 *
 * Converts database scenes and links into TOCGraph format
 */

import type { TOCGraph, SceneNode, SceneEdge } from "./types";

/**
 * Database scene structure (from API)
 */
export interface DbScene {
  id: string;
  title: string;
  order?: number;
}

/**
 * Database link structure (from API)
 */
export interface DbLink {
  from_id: string;
  to_id: string;
  tag?: "choice" | "auto" | "conditional";
}

/**
 * Convert database scenes and links to TOCGraph format
 */
export function mapDbToGraph(dbScenes: DbScene[], dbLinks: DbLink[]): TOCGraph {
  const nodes: SceneNode[] = dbScenes.map((s, i) => ({
    id: s.id,
    title: s.title,
    order: s.order ?? i
  }));

  const edges: SceneEdge[] = dbLinks.map(l => ({
    from: l.from_id,
    to: l.to_id,
    tag: l.tag as any
  }));

  return { nodes, edges };
}

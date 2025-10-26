/**
 * TOC Graph Types
 *
 * Data model for GitKraken-style scene flow visualization
 */

export type SceneId = string;

export interface SceneNode {
  id: SceneId;
  title: string;
  order: number;     // global TOC order (0..N)
}

export interface SceneEdge {
  from: SceneId;
  to: SceneId;
  tag?: "choice" | "auto" | "conditional";
}

export interface TOCGraph {
  nodes: SceneNode[];
  edges: SceneEdge[];
}

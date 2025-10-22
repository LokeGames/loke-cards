import { z } from 'zod';

export const NodePositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const GraphNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  pos: NodePositionSchema.optional(), // LiteGraph uses 'pos' for position
  // Add other node properties as needed, e.g., title, data
});

export const GraphEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  // Add other edge properties as needed
});

export const GraphJSONSchema = z.object({
  nodes: z.array(GraphNodeSchema),
  edges: z.array(GraphEdgeSchema),
});

export type GraphNode = z.infer<typeof GraphNodeSchema>;
export type GraphEdge = z.infer<typeof GraphEdgeSchema>;
export type GraphJSON = z.infer<typeof GraphJSONSchema>;

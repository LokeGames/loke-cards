import { z } from 'zod';

export const SceneSchema = z.object({
  sceneId: z.string().min(1),
  chapterId: z.string().min(1),
  title: z.string().min(1),
  sceneText: z.string().optional(),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export const ChapterSchema = z.object({
  chapterId: z.string().min(1),
  title: z.string().min(1),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Scene = z.infer<typeof SceneSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;

// Graph schemas
export const GraphPositionSchema = z.object({ x: z.number(), y: z.number() });

export const GraphNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['scene', 'chapter']),
  label: z.string().min(1),
  position: GraphPositionSchema.optional(),
  data: z.record(z.any()).optional(),
});

export const GraphEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  label: z.string().optional(),
});

export const GraphJSONSchema = z.object({
  projectId: z.string().optional(),
  nodes: z.array(GraphNodeSchema),
  edges: z.array(GraphEdgeSchema),
});

export type GraphPosition = z.infer<typeof GraphPositionSchema>;
export type GraphNode = z.infer<typeof GraphNodeSchema>;
export type GraphEdge = z.infer<typeof GraphEdgeSchema>;
export type GraphJSON = z.infer<typeof GraphJSONSchema>;

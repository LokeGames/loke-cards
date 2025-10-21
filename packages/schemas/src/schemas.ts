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


import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const novels = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/novels' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    // Cover image fields
    cover: z.string().optional(),
    cover_url: z.string().optional(),
    cover_media_id: z.union([z.string(), z.number()]).optional(),
    // Optional metadata
    pov: z.string().optional(),
    timeline: z.string().optional(),
  }),
});

export const collections = { novels };

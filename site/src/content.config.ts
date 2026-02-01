import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const novels = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/novels' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    pov: z.string().optional(),
    timeline: z.string().optional(),
  }),
});

export const collections = { novels };

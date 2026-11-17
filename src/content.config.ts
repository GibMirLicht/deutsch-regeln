import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Stage 1 uses Starlight's default schema. The strict article schema
// (title {de, ru}, level, tags, weight, status, tree order) arrives in PLAN stage 3.
export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};

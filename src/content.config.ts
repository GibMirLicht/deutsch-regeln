import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { articleFields, articleSchema } from './lib/article.ts';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: (context) => articleSchema(docsSchema({ extend: articleFields })(context)),
  }),
};

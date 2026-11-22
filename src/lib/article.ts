import { z } from 'astro/zod';
import { REQUIRED_LANGS } from './i18n.ts';

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
export const STATUSES = ['unreviewed', 'reviewed'] as const;

const translationSchema = z
  .object(Object.fromEntries(REQUIRED_LANGS.map((l) => [l, z.string().trim().min(1)])))
  .catchall(z.string().trim().min(1));

/**
 * Fields added to Starlight's frontmatter. Rule articles (the default `kind`) must set all of them;
 * other pages (`kind: page`, e.g. the home page) only need Starlight's own fields.
 */
export const articleFields = z.object({
  kind: z.enum(['article', 'page']).default('article'),
  titles: translationSchema.optional(),
  level: z.enum(LEVELS).optional(),
  tags: z.array(z.string()).default([]),
  /** Search ranking among equal matches; default derives from tree depth (PLAN stage 8). */
  weight: z.number().optional(),
  status: z.enum(STATUSES).optional(),
  /** Position among siblings in the rule tree (1, 2, …). */
  order: z.number().int().positive().optional(),
});

type Data = Record<string, unknown>;

/**
 * Article frontmatter carries `title: { de, ru }`. Starlight needs a string title, so the map moves to
 * `titles` and `title` becomes "de — ru"; `order` also drives Starlight's sidebar order.
 */
export function normalizeFrontmatter(input: unknown): unknown {
  if (typeof input !== 'object' || input === null) return input;
  const data: Data = { ...(input as Data) };
  if (typeof data.title === 'object' && data.title !== null) {
    const titles = data.title as Record<string, unknown>;
    data.titles = titles;
    data.title = [titles.de, titles.ru].filter((t) => typeof t === 'string' && t.trim()).join(' — ');
  }
  if (typeof data.order === 'number' && data.sidebar === undefined) data.sidebar = { order: data.order };
  return data;
}

/** Every field an article needs, checked after Starlight's schema has parsed the frontmatter. */
export function requireArticleFields(data: Data, ctx: z.RefinementCtx): void {
  if (data.kind !== 'article') return;
  for (const field of ['titles', 'level', 'status', 'order'] as const) {
    if (data[field] === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: [field === 'titles' ? 'title' : field],
        message:
          field === 'titles'
            ? `an article needs title: { ${REQUIRED_LANGS.join(', ')} }`
            : `an article needs "${field}"`,
      });
    }
  }
}

/** Wraps an object schema (Starlight's docs schema extended with `articleFields`) with both steps. */
export function articleSchema<T extends z.ZodType>(base: T) {
  return z.preprocess(normalizeFrontmatter, base).superRefine((data, ctx) => requireArticleFields(data as Data, ctx));
}

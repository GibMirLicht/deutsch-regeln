import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';
import { articleFields, articleSchema } from '../../src/lib/article.ts';

// Stand-in for Starlight's docs schema: a string title plus the sidebar object, extended with our fields.
const schema = articleSchema(
  z.object({ title: z.string(), sidebar: z.object({ order: z.number().optional() }).optional() }).extend(articleFields.shape),
);

const article = { title: { de: 'Subjekt', ru: 'Подлежащее' }, level: 'A1', order: 1, status: 'unreviewed' };

function issues(input: unknown): string[] {
  const result = schema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
}

describe('article frontmatter', () => {
  it('accepts a complete article and derives the Starlight title and sidebar order', () => {
    const data = schema.parse(article) as Record<string, unknown>;
    expect(data.title).toBe('Subjekt');
    expect(data.titles).toEqual({ de: 'Subjekt', ru: 'Подлежащее' });
    expect(data.sidebar).toEqual({ order: 1 });
    expect(data.tags).toEqual([]);
  });

  it('fails on a missing title translation', () => {
    expect(issues({ ...article, title: { de: 'Subjekt' } })).toContainEqual(expect.stringMatching(/^titles\.ru: /));
  });

  it('fails on missing article fields', () => {
    const { level, status, ...rest } = article;
    void level;
    void status;
    expect(issues(rest)).toEqual(['level: an article needs "level"', 'status: an article needs "status"']);
  });

  it('fails on a string title for an article', () => {
    expect(issues({ ...article, title: 'Subjekt' })).toEqual(['title: an article needs title: { de, ru }']);
  });

  it('fails on an unknown level', () => {
    expect(issues({ ...article, level: 'B3' })).toContainEqual(expect.stringMatching(/^level: /));
  });

  it('lets non-article pages skip article fields', () => {
    expect(issues({ title: 'Deutsch-Regeln', kind: 'page' })).toEqual([]);
  });
});

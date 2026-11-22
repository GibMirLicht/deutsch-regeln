import { describe, expect, it } from 'vitest';
import { ancestorsOf, buildTree } from '../../src/lib/tree.ts';

const t = (de: string) => ({ de, ru: de.toLowerCase() });

describe('buildTree', () => {
  it('nests by folder, sorts by order and numbers from the root section', () => {
    const tree = buildTree([
      { id: 'satz/satzglieder/praedikat', order: 2, titles: t('Prädikat') },
      { id: 'satz/satzglieder', order: 1, titles: t('Satzglieder') },
      { id: 'satz/satzglieder/subjekt', order: 1, titles: t('Subjekt') },
      { id: 'satz/satzarten', order: 2, titles: t('Satzarten') },
    ]);
    expect(tree.map((n) => [n.number, n.id])).toEqual([
      ['1.1', 'satz/satzglieder'],
      ['1.2', 'satz/satzarten'],
    ]);
    expect(tree[0]!.children.map((n) => [n.number, n.titles.de])).toEqual([
      ['1.1.1', 'Subjekt'],
      ['1.1.2', 'Prädikat'],
    ]);
    expect(tree[1]!.children).toEqual([]);
  });
});

describe('ancestorsOf', () => {
  it('lists the path from the top to the page', () => {
    expect(ancestorsOf('satz/satzglieder/subjekt')).toEqual(['satz', 'satz/satzglieder', 'satz/satzglieder/subjekt']);
  });
});

import type { Translation } from './i18n.ts';

export interface TreeEntry {
  id: string;
  order: number;
  titles: Translation;
}

export interface TreeNode extends TreeEntry {
  /** Outline number, e.g. "1.1.2". */
  number: string;
  children: TreeNode[];
}

/**
 * Builds the rule tree from article ids (folder tree = rule tree). The root section has no page of its
 * own (owner, 2026-11-22), so its children are the top level; their numbers keep the root's number
 * as prefix, matching docs/outline.md.
 */
export function buildTree(entries: TreeEntry[], root = 'satz', rootNumber = '1'): TreeNode[] {
  const byParent = new Map<string, TreeEntry[]>();
  for (const e of entries) {
    const parent = e.id.includes('/') ? e.id.slice(0, e.id.lastIndexOf('/')) : '';
    byParent.set(parent, [...(byParent.get(parent) ?? []), e]);
  }
  const build = (parent: string, prefix: string): TreeNode[] =>
    (byParent.get(parent) ?? [])
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
      .map((e, i) => {
        const number = `${prefix}.${i + 1}`;
        return { ...e, number, children: build(e.id, number) };
      });
  return build(root, rootNumber);
}

/** Ids of the node and all its ancestors, used to open the branch that leads to the current page. */
export function ancestorsOf(id: string): string[] {
  const parts = id.split('/');
  return parts.map((_, i) => parts.slice(0, i + 1).join('/'));
}

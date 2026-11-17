// Content checks run by `npm run check` after `astro check` (which already
// validates frontmatter against the collection schema).
// Later stages add checks here, e.g. "every example word is in the dictionary" (PLAN stage 7).

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface Problem {
  file: string;
  line: number;
  message: string;
}

const CONTENT_DIR = fileURLToPath(new URL('../src/content/docs/', import.meta.url));

// Markdown links/images `](/x)` and HTML/JSX attributes `href="/x"`, `src='/x'`.
// Protocol-relative URLs (`//host/...`) are external and allowed.
const ROOT_ABSOLUTE_LINK = /\]\(\s*\/(?!\/)|\b(?:href|src)\s*=\s*\{?\s*["'`]\/(?!\/)/g;

/**
 * Finds links that start with `/`. The site is served under `/deutsch-regeln/`,
 * so such links break on GitHub Pages; they must be relative or go through `base`.
 * Fenced code blocks are skipped.
 */
export function findRootAbsoluteLinks(source: string): { line: number; text: string }[] {
  const found: { line: number; text: string }[] = [];
  let fence: string | null = null;
  source.split('\n').forEach((text, index) => {
    const marker = /^\s*(`{3,}|~{3,})/.exec(text)?.[1];
    if (marker && (fence === null || marker.startsWith(fence))) {
      fence = fence === null ? marker : null;
      return;
    }
    if (fence === null && ROOT_ABSOLUTE_LINK.test(text)) {
      found.push({ line: index + 1, text: text.trim() });
    }
    ROOT_ABSOLUTE_LINK.lastIndex = 0;
  });
  return found;
}

function listContentFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();
}

export function checkContent(dir: string = CONTENT_DIR): { files: number; problems: Problem[] } {
  const files = listContentFiles(dir);
  const problems: Problem[] = [];
  for (const file of files) {
    for (const { line, text } of findRootAbsoluteLinks(readFileSync(file, 'utf8'))) {
      problems.push({
        file: relative(process.cwd(), file),
        line,
        message: `root-absolute link (use a relative link or base): ${text}`,
      });
    }
  }
  return { files: files.length, problems };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { files, problems } = checkContent();
  for (const p of problems) console.error(`${p.file}:${p.line}  ${p.message}`);
  if (problems.length > 0) {
    console.error(`Content check failed: ${problems.length} problem(s) in ${files} file(s).`);
    process.exit(1);
  }
  console.log(`Content check passed: ${files} file(s).`);
}

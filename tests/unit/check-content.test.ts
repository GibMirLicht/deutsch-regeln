import { describe, expect, it } from 'vitest';
import { checkContent, findRootAbsoluteLinks } from '../../scripts/check-content.ts';

describe('findRootAbsoluteLinks', () => {
  it('flags Markdown and HTML links that start with /', () => {
    const source = [
      'See [Dativ](/satz/dativ/).',
      '<a href="/satz/">Satz</a>',
      '<img src={"/img.png"} />',
    ].join('\n');
    expect(findRootAbsoluteLinks(source).map((f) => f.line)).toEqual([1, 2, 3]);
  });

  it('allows relative, external and protocol-relative links', () => {
    const source = [
      'See [Dativ](../dativ/) and [Duden](https://www.duden.de/).',
      '<a href="//example.com/">x</a> <a href="./satz/">y</a>',
    ].join('\n');
    expect(findRootAbsoluteLinks(source)).toEqual([]);
  });

  it('skips fenced code blocks', () => {
    const source = ['```md', '[x](/root/)', '```', '[y](/root/)'].join('\n');
    expect(findRootAbsoluteLinks(source)).toEqual([{ line: 4, text: '[y](/root/)' }]);
  });
});

describe('checkContent', () => {
  it('passes on the current content', () => {
    const { files, problems } = checkContent();
    expect(files).toBeGreaterThan(0);
    expect(problems).toEqual([]);
  });
});

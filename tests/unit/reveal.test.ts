import { describe, expect, it } from 'vitest';
import { splitProgress, typingDuration } from '../../src/lib/reveal.ts';

describe('splitProgress', () => {
  it('fills text nodes in order', () => {
    expect(splitProgress([3, 4, 2], 0)).toEqual([0, 0, 0]);
    expect(splitProgress([3, 4, 2], 5)).toEqual([3, 2, 0]);
    expect(splitProgress([3, 4, 2], 99)).toEqual([3, 4, 2]);
  });
});

describe('typingDuration', () => {
  it('is quick for labels and capped for long paragraphs', () => {
    expect(typingDuration(10)).toBe(240);
    expect(typingDuration(500)).toBe(900);
  });
});

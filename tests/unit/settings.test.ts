import { describe, expect, it } from 'vitest';
import { parseSettings } from '../../src/lib/settings.ts';

describe('parseSettings', () => {
  it('shows translations by default and on broken storage', () => {
    expect(parseSettings(null).global.translation).toBe(true);
    expect(parseSettings('not json').global.translation).toBe(true);
  });

  it('keeps a hidden translation and page overrides', () => {
    expect(parseSettings('{"global":{"translation":false},"pages":{"a":{}}}')).toEqual({
      global: { translation: false },
      pages: { a: {} },
    });
  });
});

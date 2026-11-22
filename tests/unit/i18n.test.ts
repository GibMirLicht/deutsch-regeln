import { describe, expect, it } from 'vitest';
import { assertTranslation, translationLangs } from '../../src/lib/i18n.ts';
import { escapeHtml, inline } from '../../src/lib/inline.ts';
import { roleLabel } from '../../src/lib/roles.ts';

describe('assertTranslation', () => {
  it('accepts a map with every required language', () => {
    expect(() => assertTranslation({ de: 'Satz', ru: 'Предложение' }, 'test')).not.toThrow();
  });

  it('rejects a missing or empty translation', () => {
    expect(() => assertTranslation({ de: 'Satz' }, '<P> on /x/')).toThrow('<P> on /x/: missing "ru"');
    expect(() => assertTranslation({ de: 'Satz', ru: '  ' }, 'test')).toThrow('missing "ru"');
    expect(() => assertTranslation('Satz', 'test')).toThrow('expected a translation map');
  });

  it('lists translation languages without German, extra languages last', () => {
    expect(translationLangs({ de: 'a', ru: 'b', en: 'c' })).toEqual(['ru', 'en']);
  });
});

describe('inline', () => {
  it('renders bold and italic', () => {
    expect(inline('Sie **ruft** den Kunden *an*.')).toBe('Sie <strong>ruft</strong> den Kunden <em>an</em>.');
  });

  it('escapes HTML', () => {
    expect(escapeHtml('<b>"x"</b>')).toBe('&lt;b&gt;&quot;x&quot;&lt;/b&gt;');
    expect(inline('<script>')).toBe('&lt;script&gt;');
  });
});

describe('roleLabel', () => {
  it('returns the DE/RU label of a sentence part', () => {
    expect(roleLabel('subjekt', 'test')).toEqual({ de: 'Subjekt', ru: 'подлежащее' });
  });

  it('fails on an unknown part', () => {
    expect(() => roleLabel('subject', 'ex 1')).toThrow('ex 1: unknown sentence part "subject"');
  });
});

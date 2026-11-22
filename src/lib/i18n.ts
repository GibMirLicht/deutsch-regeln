/**
 * Content languages. German is the main text; every other language is a translation.
 * Translations are per-language maps ({ de, ru, … }), so a new language is a new key, not a new field.
 */
export const MAIN_LANG = 'de';
/** Languages every translation map must contain. Add 'en' here once English content exists. */
export const REQUIRED_LANGS = ['de', 'ru'] as const;

export type Lang = string;
export type Translation = { de: string; ru: string } & Record<Lang, string>;

/** Throws when a map misses a required language or has an empty value, so the build fails. */
export function assertTranslation(value: unknown, where: string): asserts value is Translation {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${where}: expected a translation map like { de, ru }, got ${JSON.stringify(value)}`);
  }
  const map = value as Record<string, unknown>;
  for (const lang of REQUIRED_LANGS) {
    const text = map[lang];
    if (typeof text !== 'string' || text.trim() === '') {
      throw new Error(`${where}: missing "${lang}" in ${JSON.stringify(value)}`);
    }
  }
}

/** The translation languages of a map, in a stable order: required ones first, then the rest. */
export function translationLangs(t: Translation): Lang[] {
  const rest = Object.keys(t).filter((l) => !(REQUIRED_LANGS as readonly string[]).includes(l)).sort();
  return [...REQUIRED_LANGS.filter((l) => l !== MAIN_LANG), ...rest];
}

/**
 * Display settings in localStorage, per device (SPEC: `{ global: {…}, pages: {…} }`).
 * Only the translation toggle exists so far; block modes and example tiers come in PLAN stage 5.
 */
export const SETTINGS_KEY = 'deutsch-regeln.settings';

export interface Settings {
  global: { translation: boolean };
  pages: Record<string, unknown>;
}

export const DEFAULT_SETTINGS: Settings = { global: { translation: true }, pages: {} };

export function parseSettings(raw: string | null): Settings {
  try {
    const data = raw ? JSON.parse(raw) : {};
    return {
      global: { translation: data?.global?.translation !== false },
      pages: typeof data?.pages === 'object' && data.pages !== null ? data.pages : {},
    };
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

/** Runs in <head> before the page paints, so hidden translations never flash. Must stay self-contained. */
export const APPLY_SETTINGS_SCRIPT = `try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(SETTINGS_KEY)})||'{}');if(s&&s.global&&s.global.translation===false)document.documentElement.dataset.tr='hidden'}catch(e){}`;

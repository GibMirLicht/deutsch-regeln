import type { Translation } from './i18n.ts';

/** Labels of sentence parts used in sentence-analysis examples. */
export const ROLES = {
  subjekt: { de: 'Subjekt', ru: 'подлежащее' },
  praedikat: { de: 'Prädikat', ru: 'сказуемое' },
  akkusativobjekt: { de: 'Akkusativobjekt', ru: 'дополнение в вин. п.' },
  dativobjekt: { de: 'Dativobjekt', ru: 'дополнение в дат. п.' },
  praepositionalobjekt: { de: 'Präpositionalobjekt', ru: 'предложное дополнение' },
  'adverbiale-zeit': { de: 'Adverbiale (Zeit)', ru: 'обстоятельство времени' },
  'adverbiale-ort': { de: 'Adverbiale (Ort)', ru: 'обстоятельство места' },
  'adverbiale-grund': { de: 'Adverbiale (Grund)', ru: 'обстоятельство причины' },
  'adverbiale-art': { de: 'Adverbiale (Art und Weise)', ru: 'обстоятельство образа действия' },
} as const satisfies Record<string, Translation>;

export type Role = keyof typeof ROLES;

export function roleLabel(role: string, where: string): Translation {
  if (!(role in ROLES)) {
    throw new Error(`${where}: unknown sentence part "${role}"; known: ${Object.keys(ROLES).join(', ')}`);
  }
  return ROLES[role as Role];
}

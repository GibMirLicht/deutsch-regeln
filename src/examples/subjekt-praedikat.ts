/** Sentence-analysis examples shared by 1.1.1 Subjekt and 1.1.2 Prädikat (approved 2026-11-22). */
export const subjektPraedikat = [
  {
    tier: 'basic',
    parts: [
      { role: 'subjekt', text: 'Mein Bruder' },
      { role: 'praedikat', text: 'wohnt' },
      { role: 'adverbiale-ort', text: 'in Berlin.' },
    ],
    tr: { ru: 'Мой брат живёт в Берлине.' },
  },
  {
    tier: 'advanced',
    parts: [
      { role: 'adverbiale-zeit', text: 'Gestern' },
      { role: 'praedikat', text: 'ist' },
      { role: 'adverbiale-ort', text: 'im Zentrum' },
      { role: 'subjekt', text: 'ein Unfall' },
      { role: 'praedikat', text: 'passiert.' },
    ],
    tr: { ru: 'Вчера в центре произошла авария.' },
    note: { ru: 'Подлежащее стоит после глагола, сказуемое разорвано на две части.' },
  },
  {
    tier: 'office',
    parts: [
      { role: 'subjekt', text: 'Die Kollegen aus dem Vertrieb' },
      { role: 'praedikat', text: 'haben' },
      { role: 'akkusativobjekt', text: 'die Präsentation' },
      { role: 'adverbiale-zeit', text: 'schon' },
      { role: 'praedikat', text: 'vorbereitet.' },
    ],
    tr: { ru: 'Коллеги из отдела продаж уже подготовили презентацию.' },
    note: { ru: '«aus dem Vertrieb» — определение внутри подлежащего.' },
  },
] as const;

# SPEC: deutsch-regeln

## Goal
A personal, well-organized reference of German grammar rules (levels A1–C2: all rules, owner 2026-11-23) with examples, an integrated dictionary, search, and per-user display settings. v1 is a reference only; exercises come in v2.

## Users and scenarios
- Single user (the owner), on desktop and phone. The site is reachable by anyone with the link but is not indexed (`noindex`).
- Look up a rule: browse the tree from general to specific, or search; expand a node to read it inline.
- Look up a word: search by any form or click a German word in an example; read its word card.
- Tune presentation: choose how each block type is shown, globally or per page.
- Review content: read new articles marked "unreviewed" on the site, send corrections in chat, approve.
- UI language: Russian.

## Requirements

### Structure (rule tree)
- Numbered tree from general to specific, e.g. `1. Satz → 1.1 Zeit → 1.2 Wortstellung → 1.3 Wortarten → 1.3.1 Substantive → 1.3.1.1 Deklination`. The full outline is drafted by Claude and approved by the owner (PLAN stage 2) before content is written.
- Every article has exactly one place in the tree. Cross-cutting overview topics (e.g. "Endungen") are separate articles, distinct from specific ones (e.g. "Substantive → Endungen"); related articles are linked.
- Tree view: expanding a node lazy-loads the article content inline below the node.
- Every article also has its own URL; opening it shows the tree with that node expanded.
- A link to another article opens it in the side panel, with a control to navigate to it fully.
- Level (A1–C2) is a label on each article, each advanced rule inside an article, and each word, plus a filter in search results. It does not hide or change the tree.

### Article content
- Main text in German. Under each paragraph a Russian translation line (smaller, italic). A global toggle shows/hides translations. The data model keeps translations as a per-language map so English can be added later.
- Examples come in three switchable tiers: `basic` (A1–A2), `advanced` (B1–C1), `office` (B1–C1, office/IT/business). Every example has DE + RU. The active tier is a setting (global + per page).
- Known block types in v1: explanation paragraphs, RU translation, examples (3 tiers), tables. The full block set is decided in PLAN stage 3 before page layout.
- Each article has a status: `unreviewed` (visible badge) or `reviewed`.

### Display settings
- Per block type, a display mode: `expanded`, `popup`, `panel`, `hidden`.
- Global settings plus per-page overrides; overrides are remembered per page.
- Stored in `localStorage`, per device, no sync. Overrides for pages that no longer exist are ignored.
- Phone: popup and panel open on tap (no hover); the side panel becomes a bottom sheet.

### Search
- One field in the header, hotkey `/`. Results in two groups: "Rules" and "Dictionary".
- Rules search ranking: tags > title > body text. Tags hold terms and synonyms in DE and RU (Dativ / дательный / Wem-Fall) and marker words (weil, seit, um…zu). Among equal matches, a higher `weight` ranks first; default weight derives from tree depth (shallower = higher), overridable in frontmatter.
- Dictionary search: by lemma or any inflected form (ging → gehen, Häuser → Haus); umlaut/ß-insensitive (Hauser, Haeuser, Häuser; Strasse = Straße); case-insensitive.
- Both searches accept Russian queries (дом → Haus via translations; Russian stemming for rules). English is planned for later; do not hard-code two languages.
- Level filter in results.

### Dictionary
- Scope: words of levels A1–C1 with emphasis on office, business and IT vocabulary. Source chosen in PLAN stage 6; own entries can be added.
- Word card: article/gender, plural, part of speech, RU translation, level, topic label (business/IT/…); inflection tables (noun/adjective declension; verb conjugation incl. Präsens, Präteritum, Perfekt with haben/sein); government (Rektion, e.g. warten auf + Akk) with examples; links to related rules.
- Browsing: topic lists, lists by level, alphabetical list.
- Every German word in examples is clickable and opens its word card in the configured display mode. German explanation text is not clickable in v1.
- Ambiguous forms (sein, die, Weg/weg) are annotated with the intended entry when examples are written; a click opens that card. Without an annotation, a click shows the list of candidates.
- Every word used in examples must exist in the dictionary; the build fails otherwise. Missing words are added in the same stage. Proper names (people, companies, products) are marked in content and are not clickable.

## Stack
- Starlight (Astro) + TypeScript. Custom components override Starlight's where needed: tree, search, settings, popup/panel.
- Content: MDX in Starlight content collections with a strict frontmatter schema; custom MDX components for DE/RU paragraphs, example tiers, tables.
- Rules search: Pagefind (bundled with Starlight) with weights. Dictionary: own form → lemma index built at build time, split into chunks, lazy-loaded.
- Tests: Vitest (search, normalization, form lookup, settings logic), Playwright (desktop and phone viewports).
- Everything runs in the browser; no server.

## Files and interfaces
- `src/content/docs/` — rule articles (MDX), folder structure mirrors the tree.
- `src/content.config.ts` — content collection schemas.
- `src/components/` — custom components (tree, search, settings, popup/panel, paragraph, examples, tables, word card).
- `src/lib/` — pure logic: normalization, form index, search ranking, settings store.
- `data/dictionary/` — dictionary JSON (imported + own entries).
- `scripts/` — dictionary import, form-index build, content checks.
- `tests/unit/`, `tests/e2e/`.
- Article frontmatter: `title` (`{de, ru}`), `level`, `tags`, `weight` (optional), `status`, tree number/order.
- Settings shape (localStorage): `{ global: {blocks: {<type>: mode}, translation: bool, exampleTier}, pages: {<id>: partial overrides} }`.

## Data and integrations
- Content and dictionary live in the repo as files; edits go through Claude sessions or the GitHub editor.
- No external APIs, no secrets.
- If the dictionary source requires attribution (e.g. CC BY-SA), the site has a sources page.

## Deployment
- Public repo `GibMirLicht/deutsch-regeln`; GitHub Pages via GitHub Actions on push to `main`; URL `https://gibmirlicht.github.io/deutsch-regeln/`.
- `noindex` on all pages.

## Risks and edge cases
- Dictionary size on phones: index loaded in chunks on demand.
- Ambiguous forms: annotation + candidate list fallback.
- Errors in generated grammar content: `unreviewed` status until owner approval.
- Mixed DE/RU text on one page and search stemming: tags carry both languages; verify ranking with tests.
- Stale per-page settings: ignored.

## Out of scope
Exercises (v2), English translations, audio, accounts and settings sync, favorites, notes, history, server-side anything.

## Assumptions
- UI language Russian.
- `hidden` is a display mode alongside expanded/popup/panel.
- Default search weight derives from tree depth.
- Only words in examples are clickable in v1.
- Proper names in examples are marked and not clickable.
- Cross-article links open in the side panel.

## Verification (end-to-end)
On the built site (desktop and phone viewport):
1. Tree loads; expanding a node shows its article inline; its URL opens the tree with it expanded.
2. Search "Dativ" → a tagged overview rule ranks above specific ones; "дательный" finds the same.
3. Search "ging" and "Haeuser" → cards for gehen and Haus.
4. Click a word in an example → its card opens in the configured mode; an ambiguous unannotated word shows candidates.
5. Change a block's mode globally and per page, reload → both persist; RU toggle and example tier switch work.
6. On phone viewport the panel is a bottom sheet.
7. Build fails if an example word is missing from the dictionary.

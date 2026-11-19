# PLAN

| # | Stage | Result | Check | Status |
|---|-------|--------|-------|--------|
| 1 | Skeleton + deploy | Starlight + TypeScript project, Russian UI, `noindex`; npm scripts `check`, `test`, `e2e`; Vitest and Playwright configured with one smoke test each; GitHub Actions: CI on PRs, deploy to Pages on `main`. Owner step: Settings → Pages → Source: GitHub Actions. | `npm run check`, `npm test`, `npm run e2e` pass; after merge the Pages URL returns 200 | done (Pages URL 200 verified 2026-11-19) |
| 2 | Tree outline | `docs/outline.md`: full numbered grammar tree A1–C1 incl. overview topics (e.g. Endungen), each node with level; approved by owner | owner approval recorded in PR | in review (draft, awaiting owner approval) |
| 3 | Article model | Block set agreed with owner; frontmatter schema (`title{de,ru}`, `level`, `tags`, `weight`, `status`); MDX components for DE/RU paragraph, 3-tier examples, tables; one sample article | `npm run check` fails on a missing translation/field (unit test); sample renders (e2e) | todo |
| 4 | Tree view | Tree from content folders with numbering; lazy inline expansion; per-article URL opens tree with node expanded; `unreviewed` badge | e2e: expand node, open deep link | todo |
| 5 | Display settings | Settings store (global + per page, localStorage); modes expanded/popup/panel/hidden per block type; RU toggle; example tier switch; bottom sheet on phone; cross-article links open in panel | unit tests for store; e2e desktop + phone: change, reload, persists | todo |
| 6 | Dictionary data | Source chosen with owner; import script to `data/dictionary/`; own-entries file; word card component; sources page if license requires | import script test on sample; e2e word card renders | todo |
| 7 | Words in examples | Form → lemma index (umlaut/ß-normalized, chunked); clickable example words; ambiguity annotation + candidate list; proper-name marker; build check "every example word in dictionary"; topic/level/alphabet lists | unit tests (ging→gehen, Haeuser→Haus); check fails on unknown word; e2e click opens card | todo |
| 8 | Search | Header field, hotkey `/`, two groups; Pagefind with tag > title > text and `weight`; RU queries; level filter | unit tests for ranking; e2e: "Dativ", "дательный", "ging" | todo |
| 9+ | Content | One top-level tree section per stage, status `unreviewed`; owner reviews on site, then `reviewed` | `npm run check` (schema + dictionary coverage) | todo |

Stages 1–8 end with the SPEC.md end-to-end check items they cover.

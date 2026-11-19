# deutsch-regeln

Requirements: SPEC.md. Stages and status: PLAN.md. Talk to the owner in Russian; code, docs and commits in English.

## Commands
Created in PLAN stage 1:
- `npm run check` — astro check + content checks (schema, every example word in dictionary)
- `npm test` — Vitest
- `npm run e2e` — Playwright, desktop and phone viewports

## Git
- One PLAN.md stage = one branch `stage-<N>-<slug>` + one PR to `main`. The owner decides, Claude executes: merge a PR only after the owner's explicit go-ahead in chat for that PR. Never push to `main` directly.
- When asking for a decision, explain in plain words what the PR changes for the owner and what happens after the merge.
- Run all three commands before opening the PR. Update the stage status in PLAN.md in the same PR; "done" only with the commands run and their output in the PR description. No screenshots.
- Commit style: `feat:`, `fix:`, `content:`, `docs:`, `chore:`, `test:`.

## Architecture
- Starlight (Astro) + TypeScript, static output, no server. Override Starlight components instead of forking it.
- Rule articles: MDX in `src/content/docs/`, folder tree = rule tree. Dictionary: JSON in `data/dictionary/`.
- Translations are per-language maps (`{de, ru}`), never two hard-coded fields: English comes later.
- Rules search: Pagefind with weights. Dictionary search: own form → lemma index, chunked, lazy-loaded.

## Content
- New or changed articles get `status: unreviewed`; set `reviewed` only after the owner approves.
- Every German word in examples must resolve in the dictionary: add missing entries, annotate ambiguous forms, mark proper names.

## Gotchas
- GitHub Pages serves under `/deutsch-regeln/`: use Astro `base`, never root-absolute links.
- Cloud sessions: Playwright's Chromium is preinstalled; don't run `playwright install`. If the pinned Playwright can't find it, use `executablePath: '/opt/pw-browsers/chromium'`.

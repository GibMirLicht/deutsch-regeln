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
- A PR that changes what the site shows: send the owner a preview (screenshots of the changed pages, desktop and phone, via SendUserFile; not in the PR) before asking whether to merge.
- Run all three commands before opening the PR. Update the stage status in PLAN.md in the same PR; "done" only with the commands run and their output in the PR description. No screenshots.
- Commit style: `feat:`, `fix:`, `content:`, `docs:`, `chore:`, `test:`.

## Architecture
- Starlight (Astro) + TypeScript, static output, no server. Override Starlight components instead of forking it.
- Rule articles: MDX in `src/content/docs/`, folder tree = rule tree. Dictionary: JSON in `data/dictionary/`.
- Translations are per-language maps (`{de, ru}`), never two hard-coded fields: English comes later.
- Rules search: Pagefind with weights. Dictionary search: own form → lemma index, chunked, lazy-loaded.

## Content
- New or changed articles get `status: unreviewed`; set `reviewed` only after the owner approves.
- Article texts are written top-down along `docs/outline.md` and approved by the owner in chat before they are coded into MDX. Approved texts are saved in `docs/texts/` (one file per top-level branch) so they survive between sessions.
- Text style: impersonal, as short as possible, only the essence of the rule; no general explanations (e.g. what a sentence is). Terms are explained concretely (with types and examples), not just named. Tables are translated cell by cell: the RU translation sits in the same cell under the German, in italics and a smaller font (all tables, present and future). Examples that analyse a sentence label each part above it. Blocks follow meaning, not line breaks: a rule and the examples that illustrate it share one card (`<Rule>`). One node per review round unless the owner asks for several at once.
- Coverage: every rule of the topic up to C2 (owner, 2026-11-23). The core of the rule comes first; rarer and finer points follow as rule cards (`<Rule title level>`), each with its level, with no "advanced" heading above them.
- Owner review rules (2026-11-23), applied to every topic:
  - Each term is explained where it first appears, also in the RU text (what a Präpositionalobjekt is, what an Adverbiale is).
  - Each rule card says plainly what it is in terms of the topic ("… ist ein zusätzliches Dativobjekt", "… ist eine adverbiale Bestimmung des Mittels"); no bare keyword lists or question marks as a rule.
  - A rule's short example goes in parentheses inside the rule sentence, not on a separate line.
  - Lists that are not complete end with "u. a." / "и др.".
  - Cross-references name the chapter ("Kapitel „Wortstellung“" / «раздел «Порядок слов»»), never a bare outline number.
- Every German word in examples must resolve in the dictionary: add missing entries, annotate ambiguous forms, mark proper names.

## Gotchas
- GitHub Pages serves under `/deutsch-regeln/`: use Astro `base`, never root-absolute links.
- Cloud sessions: Playwright's Chromium is preinstalled; don't run `playwright install`. If the pinned Playwright can't find it, use `executablePath: '/opt/pw-browsers/chromium'`.

# deutsch-regeln

A personal reference of German grammar rules (A1–C1) with examples, a dictionary and search. UI in Russian.

Site: https://gibmirlicht.github.io/deutsch-regeln/

Requirements: [SPEC.md](SPEC.md). Stages: [PLAN.md](PLAN.md).

## Commands

Node 22 (see `.nvmrc`).

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at `http://localhost:4321/deutsch-regeln/` |
| `npm run build` | Static build to `dist/` (incl. Pagefind index) |
| `npm run preview` | Serve the build |
| `npm run check` | `astro check` (types, content schema) + content checks (`scripts/check-content.ts`) |
| `npm test` | Unit tests (Vitest, `tests/unit/`) |
| `npm run e2e` | Build + Playwright tests (`tests/e2e/`), desktop and phone viewports |

## Deployment

GitHub Actions: `.github/workflows/ci.yml` runs check, test and e2e on pull requests; `.github/workflows/deploy.yml` deploys to GitHub Pages on push to `main`.

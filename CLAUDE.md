# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

«ngKittyDebug / delulu-church» — Angular 22 SPA (RS School team project), TypeScript strict, Taiga UI, NgRx Signals, Firebase (Auth + Firestore). Package manager pinned to `pnpm@10.30.0` (see `packageManager` in `package.json`).

**Deploy:** Netlify hosts the static SPA. Tarot readings are proxied to an external API (`deploytarot.com`) via redirect in [`netlify.toml`](netlify.toml). There are **no local Netlify Functions** in this repo.

## Commands

The full inventory lives in [`README.md`](README.md). Non-obvious ones:

- `pnpm start` — `ng serve -o` (dev server on port 4200; tarot calls go through [`proxy.conf.json`](proxy.conf.json) → `deploytarot.com`).
- `pnpm test` — Angular Vitest runner (jsdom). Single-file: `pnpm test -- --include='**/main-page.facade.spec.ts'`.
- `pnpm typecheck` — `tsc -b --noEmit` (project references, not a plain `tsc`).
- `pnpm lint` — eslint over `src` and stylelint over CSS/SCSS.
- `pnpm knip` — finds unused files, exports, and dependencies.

`.planning/` is git-ignored (per `eslint.config.js` `ignores`) and is the staging area for design handoffs / plans — safe to write into, never imported by app code.

## Architecture

### Frontend layers (`src/app`)

- `core/` — app-wide chrome (`LayoutComponent`), guards, global services (auth, user-profile, confess, candles, theme, modal), `uiStateStore`.
- `features/<name>/` — route-bound feature areas. Mature features use `data/` + `facades/` + `ui/`; simpler features may be flatter.
- `shared/` — reusable UI, validators, helpers, mocks, ambient types (`utility-types.d.ts`).
- Path aliases (`tsconfig.json`): `@core/*`, `@features/*`, `@shared/*`. Prefer them over deep relatives.
- Component selector prefix is `ngKitty` (Angular CLI `prefix` in `angular.json`).
- App bootstraps standalone via [`app.config.ts`](src/app/app.config.ts) with `provideRouter(withComponentInputBinding())`, `provideHttpClient()`, `provideTaiga()`, Firebase auth initializer. Add new app-wide providers there.

### Shared domain in `core/services/`

`ConfessService` and `CandlesService` live in `core/` **on purpose** — they are shared domain services used by shrift/altar today and will be reused by the profile page and profile services when that feature is complete. Do not move them into individual features without an explicit architectural decision.

| Service              | Persistence                          | Consumers                     |
| -------------------- | ------------------------------------ | ----------------------------- |
| `AuthService`        | Firebase Auth                        | app-wide                      |
| `UserProfileService` | Firestore `users/{uid}`              | auth, ui-state, profile (WIP) |
| `ConfessService`     | Firestore `users/{uid}/sins`         | shrift, profile (planned)     |
| `CandlesService`     | Firestore `users/{uid}.candleCounts` | altar, profile (planned)      |

### Feature pattern (canonical: `features/main`)

The main (tarot) feature is the reference for new HTTP-backed features. Route-scoped providers in [`app.routes.ts`](src/app/app.routes.ts) (not `providedIn: 'root'`):

1. **API service** — thin `HttpClient` wrapper ([`TarotService`](src/app/features/main/data/api/services/tarot/tarot.service.ts)).
2. **Facade** — the only API the UI talks to ([`MainPageFacade`](src/app/features/main/facades/main-page.facade.ts)); owns loading/error state, orchestrates translation.
3. **UI** — standalone components delegate to the facade; no direct HTTP or domain service calls.

Other features:

- **login / registration** — facades + form services, `TuiNotificationService` for errors.
- **shrift** — `ShriftPageFacade` → `ConfessService` (shared domain).
- **altar** — UI talks to `CandlesService` directly today; `AltarPageFacade` is planned.
- **profile** — WIP shell; will aggregate `UserProfileService` + `ConfessService` + `CandlesService` via a facade when implemented.

### Global state

[`uiStateStore`](src/app/core/store/ui-state.store.ts) — root `signalStore` for theme and language; syncs to Firestore `users/{uid}.uiState` when authenticated.

### Backend / external APIs

| Endpoint                  | Mechanism                                                                                | Notes                        |
| ------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------- |
| `/api/reading`            | Netlify redirect → `deploytarot.com` (prod); [`proxy.conf.json`](proxy.conf.json) in dev | Tarot cards                  |
| Firebase Auth / Firestore | `firebase` SDK via [`environment.ts`](src/environments/environment.ts)                   | Users, sins, candles, quotes |
| `/i18n/{lang}.json`       | static assets + [`TranslocoHttpLoader`](src/app/transloco-loader.ts)                     | i18n                         |

There is no `netlify/functions/` source, no `pnpm dev` (`netlify dev`), and no `pnpm test:functions`.

## Conventions & gotchas

- **Style preprocessing**: SCSS uses `includePaths: ["src", "src/styles"]` (`angular.json`), so `@use 'styles/foo'` resolves without `../../`. Global Taiga themes are loaded from `node_modules/@taiga-ui/styles/*.less` plus `src/styles.css`.
- **`.netlify/` vs `netlify/`**: `.netlify/` is local Netlify CLI state — never edit by hand. The `netlify/` directory may exist but carries no function source in the current branch.
- **Conventional commits enforced** by commitlint (`build|ci|docs|feat|fix|perf|refactor|revert|style|test|chore`). Header capped at 72 chars. Branch names validated against `^(chore|feat|fix|docs|style|refactor|perf)\/[a-zA-Z0-9-]+[_-][a-zA-Z0-9-]+$`.
- **Husky + lint-staged** run eslint+prettier on staged files — don't bypass with `--no-verify`.
- **ESLint custom rules** (`eslint.config.js`): strict `member-ordering`, mandatory `@typescript-eslint/explicit-member-accessibility`, `consistent-type-imports`, `consistent-type-definitions: ['error', 'interface']`, `filename-case` (camelCase or kebab-case only), and `padding-line-between-statements`. `.mock.ts` and `.spec.ts` relax `no-explicit-any` and unsafe-\* rules.
- **Change detection**: `ChangeDetectionStrategy.OnPush` is the **default in Angular 22**. Explicit `OnPush` in a component decorator is optional.
- **Angular 22 patterns** (standalone, `inject()`, signals, new control flow, typed reactive forms, `takeUntilDestroyed`, Resource API where appropriate) — see `.github/copilot-instructions.md` for the PR reviewer checklist.
- **`router` uses `withComponentInputBinding()`** — route params bind directly to `@Input()`/signal inputs on the routed component.

## Pre-flight checklist (run before declaring a task done / before commit / before PR)

Run **all three**, in this order, and fix anything that goes red before moving on. Husky/lint-staged will catch most lint issues at commit time, but typecheck/tests are not in the hooks — running them manually is mandatory.

1. `pnpm typecheck` — `tsc -b --noEmit` on the project references.
2. `pnpm lint` — eslint over `src` and stylelint over CSS/SCSS. Use `pnpm lint:fix` for autofixable parts.
3. `pnpm test` — Angular Vitest suite (frontend specs).

Optional but recommended for non-trivial changes:

- `pnpm format` — Prettier check; `pnpm format:fix` to autofix.
- `pnpm build` — production build, surfaces budget overruns (`anyComponentStyle` capped at 4 kB warn / 8 kB error in `angular.json`).
- Manual smoke on `pnpm start` for tarot draw (`/api/reading` via dev proxy).

When committing or opening a PR: use Conventional Commit type (`feat|fix|chore|refactor|docs|style|perf|test|build|ci|revert`), keep the subject ≤72 chars, and verify the branch name matches `^(chore|feat|fix|docs|style|refactor|perf)\/[a-z0-9-]+[_-][a-z0-9-]+$` (validated by `validate-branch-name`).

**Branching & PR base**: always branch off `develop`, and open PRs **against `develop`** (not `main`). `main` is the release branch; merges into it come from `develop` only.

# Agent instructions (Cursor + Codex)

This file is the source of truth for coding agents. Do not add a parallel `CLAUDE.md` body — that file only points here.

## Project

«delulu-church» — Angular 22 SPA, TypeScript strict, Taiga UI, NgRx Signals, Firebase (Auth + Firestore). Package manager is pinned to `pnpm@11.22.0` (`packageManager` in `package.json`). Use that version (`corepack prepare pnpm@11.22.0 --activate`).

**Deploy:** Netlify hosts the static SPA. Tarot readings are proxied to `deploytarot.com` via [`netlify.toml`](netlify.toml). There are **no local Netlify Functions** in this repo.

Default branch is `main`. Quality-check CI runs on `main`. Open PRs against `main`.

## Commands

Full inventory: [`README.md`](README.md). Non-obvious:

- `pnpm start` — `ng serve -o` (port 4200; tarot via [`proxy.conf.json`](proxy.conf.json) → `deploytarot.com`)
- `pnpm test` — Vitest (jsdom). Single file: `pnpm test -- --include='**/main-page.facade.spec.ts'`
- `pnpm typecheck` — `tsc -b --noEmit` (project references)
- `pnpm lint` — eslint `src` + stylelint CSS/SCSS
- `pnpm knip` — unused files, exports, dependencies

`.planning/` is git-ignored (see `eslint.config.js`) — staging for plans only, never imported by app code.

## Architecture

### Layers (`src/app`)

- `core/` — chrome (`LayoutComponent`), guards, shared domain (auth, user-profile, confess, candles, theme, modal), `uiStateStore`
- `features/<name>/` — route-bound. Mature features: `data/` + `facades/` + `ui/`; simpler ones may be flatter
- `shared/` — reusable UI, validators, helpers, mocks, `utility-types.d.ts`
- Path aliases (`tsconfig.json`): `@core/*`, `@features/*`, `@shared/*`. Prefer aliases over deep relatives
- Selector prefix: `ngKitty` (`angular.json`)
- Bootstrap: standalone [`app.config.ts`](src/app/app.config.ts) — `provideRouter(withComponentInputBinding())`, `provideHttpClient()`, `provideTaiga()`, Firebase auth initializer. App-wide providers go there

### Shared domain (`core/services/`)

`ConfessService` and `CandlesService` live in `core/` **on purpose** (shrift/altar today, profile tomorrow). Do not move them into a feature without an explicit decision.

| Service              | Persistence                          | Consumers                                                  |
| -------------------- | ------------------------------------ | ---------------------------------------------------------- |
| `AuthService`        | Firebase Auth                        | app-wide                                                   |
| `UserProfileService` | Firestore `users/{uid}`              | auth, ui-state, profile                                    |
| `ConfessService`     | Firestore `users/{uid}/sins`         | shrift, profile (stats still denormalized on the user doc) |
| `CandlesService`     | Firestore `users/{uid}.candleCounts` | altar, layout (spirit), profile (denormalized `candles`)   |

### Feature pattern

Canonical HTTP feature: `features/main`. Feature facades and HTTP services are **not** `providedIn: 'root'`. Scope them on the **routed component** `providers` array (`autoProvided: false` / `providedIn` unset). Do **not** put feature `providers` in [`app.routes.ts`](src/app/app.routes.ts) unless you are migrating the whole app at once.

1. **API service** — thin `HttpClient` wrapper ([`TarotService`](src/app/features/main/data/api/services/tarot/tarot.service.ts))
2. **Facade** — the only API the UI talks to ([`MainPageFacade`](src/app/features/main/facades/main-page.facade.ts)); owns loading/error, orchestrates translation
3. **UI** — standalone components; no direct HTTP or domain service calls

| Feature              | Pattern                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| login / registration | Facade + form service; errors via `HotToastService`                      |
| shrift               | `ShriftPageFacade` → `ConfessService`                                    |
| altar                | `AltarPageFacade` → `CandlesService`                                     |
| sanctum              | `SanctumPageFacade` + ritual/sound/quotes services                       |
| profile              | `ProfileFacade` exists; still incomplete (mock avatar, in-memory donuts) |
| ball                 | No facade — local UI state is fine at this size                          |

### Global state

[`uiStateStore`](src/app/core/store/ui-state.store.ts) — root `signalStore` for theme and language; syncs to Firestore `users/{uid}.uiState` when authenticated.

### Backend / external APIs

| Endpoint                  | Mechanism                                                                                | Notes                        |
| ------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------- |
| `/api/reading`            | Netlify redirect → `deploytarot.com` (prod); [`proxy.conf.json`](proxy.conf.json) in dev | Tarot                        |
| Firebase Auth / Firestore | `firebase` SDK via [`environment.ts`](src/environments/environment.ts)                   | Users, sins, candles, quotes |
| `/i18n/{lang}.json`       | static assets + [`TranslocoHttpLoader`](src/app/transloco-loader.ts)                     | i18n                         |

No `netlify/functions/` source, no `pnpm dev` (`netlify dev`), no `pnpm test:functions`.

On pnpm 11, `pnpm ci` (without `run`) deletes `node_modules` then frozen-installs. Local install: `pnpm run ci` or `pnpm install`.

## Conventions

- **SCSS** `includePaths: ["src", "src/styles"]` — `@use 'styles/foo'` without `../../`. Taiga themes from `node_modules/@taiga-ui/styles/*.less` + `src/styles.css`
- **`.netlify/`** — local CLI state, never edit. `netlify/` has no function source
- **Commits:** Conventional Commits (`build|ci|docs|feat|fix|perf|refactor|revert|style|test|chore`)
- **Branches:** `^(chore|feat|fix|docs|style|refactor|perf)\/[a-zA-Z0-9-]+[_-][a-zA-Z0-9-]+$` (`validate-branch-name`)
- **Husky:** pre-commit = lint-staged + typecheck + format + lint; commit-msg = commitlint; pre-push = branch-name + tests. Do not `--no-verify`
- **ESLint:** `member-ordering`, `@typescript-eslint/explicit-member-accessibility`, `consistent-type-imports`, `consistent-type-definitions: ['error', 'interface']`, `filename-case` (camelCase or kebab-case), `padding-line-between-statements`. Relaxed `any` / unsafe-\* in `.mock.ts` and `.spec.ts`
- **Angular 22:** standalone, `inject()`, signals, new control flow, typed reactive forms, `takeUntilDestroyed`, Resource API where it fits. `OnPush` is the default — do not add it unless you need to be explicit
- **Router** `withComponentInputBinding()` — route params bind to `@Input()` / signal inputs
- Feature facades: `@Service({ autoProvided: false })`. Do not make password/profile forms root singletons
- Domain services in `core/` must not import `@core/ui` (no ghost-coder / layout from confess/candles)

## Pre-flight (before done / commit / PR)

1. `pnpm typecheck`
2. `pnpm lint` (`pnpm lint:fix` if needed)
3. `pnpm test`

Also for non-trivial changes: `pnpm format`, `pnpm build` (`anyComponentStyle` 4 kB warn / 8 kB error), smoke tarot draw on `pnpm start`.

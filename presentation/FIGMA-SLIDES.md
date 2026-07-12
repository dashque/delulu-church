# delulu-church — контент для Figma Slides

Скопируйте текст слайд за слайдом в [Figma Slides](https://www.figma.com/slides/rARtFjeAXL3bYRqYZ06Qjo/delulu-church-presentation).

## Дизайн-система (из приложения)

| Токен | Значение |
|-------|----------|
| Background | `#14100f` |
| Background alt | `#1b1513` |
| Gold accent | `#d6a85f` |
| Gold soft | `#e8c98f` |
| Text primary | `#f4e7c8` |
| Text muted | `#c9b88a` |
| Шрифт заголовков | Science Gothic (или Oxanium 700) |
| Шрифт текста | Oxanium |

**Визуалы для вставки:** скриншоты с [delulu-church.netlify.app](https://delulu-church.netlify.app/) — главная, shrift, altar, sanctum, DevTools.

---

## Слайд 1 — Title

**Layout:** Title centered  
**Badge:** `RS School · Angular 2026 Q2 · Team Presentation`  
**Заголовок:** The Church of the Holy Deploy  
**Подзаголовок:** delulu-church — цифровой храм для программистов  
**Ссылка:** delulu-church.netlify.app  
**Speaker note (Daria, 30 сек):** Приветствие, название команды ngKittyDebug.

---

## Слайд 2 — Team

**Layout:** 3 cards  
**Badge:** Team  
**Заголовок:** Команда ngKittyDebug

| Имя | Роль | GitHub |
|-----|------|--------|
| Daria Melnikova | Frontend / Team Lead | @dashque |
| Alena Alekseeva | Frontend Developer | @Alena1409 |
| Nadezhda Kozochkina | Frontend Developer | @kozochkina82 |

**Speaker note (1 мин):** Кто за что отвечал в команде.

---

## Слайд 3 — Product

**Layout:** Two columns  
**Badge:** Product  
**Заголовок:** Что мы построили

**Колонка 1:**
- Главная — Tarot-оракул судьбы деплоя
- Исповедальня — список «грехов» (багов)
- Алтарь — свечи и благословение Духа Машины
- Санктум — ритуал суда над веткой

**Колонка 2:**
- Дед-сеньор — цифровая мудрость
- Crystal ball — магический шар
- Auth — email + GitHub + Google
- i18n + тема — RU/EN, light/dark

**Speaker note (Alena, 2 мин):** Обзор фич перед live demo.

---

## Слайд 4 — Live Demo

**Layout:** Center, large  
**Badge:** Live Demo  
**Заголовок:** Демонстрация продукта  
**Ссылка:** delulu-church.netlify.app

**Чеклист демо:**
1. Tarot draw + смена языка → перевод
2. Login → Исповедальня → Алтарь
3. Санктум: ритуал суда над веткой
4. Angular DevTools: component tree + CD profiler

**Speaker note:** Переключиться на live demo на 10–15 мин. Слайд — только как roadmap.

---

## Слайд 5 — Architecture

**Layout:** Flow + 2 cards  
**Badge:** Architecture  
**Заголовок:** Слои приложения

**Flow:** `UI → Facade → API / Service → HTTP / Firestore`

**Card core/:**
- Layout, guards, interceptors
- Auth, Confess, Candles
- uiStateStore (NgRx Signals)

**Card features/ + shared/:**
- Route-bound domains
- data/ + facades/ + ui/
- Validators, UI kit, helpers

**Speaker note (Daria, 2 мин):** Почему facade pattern и shared domain в core.

---

## Слайд 6 — Routing

**Badge:** Routing  
**Заголовок:** Маршрутизация и Guards

- Lazy loading — все фичи, кроме главной
- Functional guards — authGuard, guestGuard, dirtyFormGuard
- Route providers — facade и API только на маршруте
- UserStateStrategy — preload по auth-состоянию
- withComponentInputBinding + view transitions

**Speaker note (Nadezhda, 1.5 мин):** Показать app.routes.ts в IDE при Q&A.

---

## Слайд 7 — DI

**Badge:** Dependency Injection  
**Заголовок:** DI: границы фич

**Code block:**
```typescript
@Service({ autoProvided: false })
export class MainPageFacade {
  private readonly tarot = inject(TarotService);
  public readonly isLoading = computed(...);
}
```

- Фичевые сервисы — route-scoped
- Shared domain (Confess, Candles) — в core/ намеренно
- UI инжектит только facade

---

## Слайд 8 — Signals

**Badge:** Signals & State  
**Заголовок:** Signals-first реактивность

**Колонка 1:** signal, computed, linkedSignal, effect  
**Колонка 2:** rxResource, resource(), signalStore, takeUntilDestroyed

**Speaker note:** Главный Angular highlight — MainPageFacade + Sanctum.

---

## Слайд 9 — Forms

**Badge:** Forms  
**Заголовок:** Typed Reactive Forms

- FormBuilder.nonNullable.group<T>
- FormService на фичу
- tuiValidationErrorsProvider + Transloco
- dirtyFormGuard
- Cross-field password validator

---

## Слайд 10 — Change Detection

**Badge:** Change Detection  
**Заголовок:** Change Detection

- OnPush по умолчанию (Angular 22)
- Реактивность через signals
- Zone-based + eventCoalescing
- @if, @for во всех шаблонах

**Note:** Показать DevTools Profiler на демо.

---

## Слайд 11 — Error Handling

**Layout:** 2 cards  
**Badge:** Error Handling  
**Заголовок:** Обработка ошибок

**HTTP:** interceptor → HotToast, /i18n/ без toast  
**Firestore:** facade → HotToast, withTimeout 7с, loaders

---

## Слайд 12 — Tech Stack

**Badge:** Tech Stack  
**Заголовок:** Стек технологий

**Stats:** Angular 22 · 64 tests · 125+ PRs · 4 Sprints

- TypeScript 6 · Taiga UI 5 · Transloco · NgRx Signals · Vitest
- Firebase · Netlify CI/CD
- ESLint + Husky + commitlint

---

## Слайд 13 — Team Story (section)

**Layout:** Title  
**Badge:** Part 2  
**Заголовок:** Team Story  
**Подзаголовок:** Как мы работали, учили Angular и принимали решения

---

## Слайд 14 — Sprint Journey

**Badge:** Journey  
**Заголовок:** Путь через 4 спринта

- Sprint 1 — layout, routing, auth, главная
- Sprint 2 — shrift, altar, i18n, ghost-coder
- Sprint 3 — sanctum, error handling
- Sprint 4 — profile shell, CI, refactor

**Speaker note:** Каждый рассказывает свой вклад (по 3 мин).

---

## Слайд 15 — Challenge

**Badge:** Challenge  
**Заголовок:** Самое сложное

- Санктум — rxResource + звук + litany
- Error handling — HTTP + Firestore единый UX
- Архитектура — facade + route-scoped DI
- i18n pipeline — tarot EN → MyMemory перевод

---

## Слайд 16 — Decisions

**Badge:** Decisions  
**Заголовок:** Ключевые решения

- Facade pattern
- Shared domain в core
- Signals over NgRx Store
- Taiga UI
- Repository rulesets (1 approval + CI)

---

## Слайд 17 — Git & PM

**Layout:** 2 cards  
**Badge:** Git & PM  
**Заголовок:** Процессы команды

**Git:** Conventional Commits, pre-push hooks, PR review, CI  
**PM:** 136 issues, sprint labels, дневники, meeting notes

---

## Слайд 18 — Delivery

**Badge:** Delivery  
**Заголовок:** Deployment & CI/CD

**Flow:** git push → GitHub Actions → Netlify Deploy

- delulu-church.netlify.app
- Tarot redirect → deploytarot.com
- README: pnpm ci → pnpm start

---

## Слайд 19 — Q&A Prep

**Badge:** Q&A Prep  
**Заголовок:** Возможные вопросы жюри

**Колонка 1:** NgRx Store? · main не lazy? · Zoneless? · Profile WIP?  
**Колонка 2:** Тесты? · Firebase? · Form scoping? · Branch protection?

---

## Слайд 20 — Thank You

**Layout:** Title centered  
**Заголовок:** Спасибо!  
**Подзаголовок:** Вопросы?  
**Ссылки:** delulu-church.netlify.app · GitHub

---

## Тайминг презентации (~30 мин)

| Часть | Слайды | Время |
|-------|--------|-------|
| Intro + Product | 1–3 | 3 мин |
| Live Demo | 4 (+ app) | 10–15 мин |
| Angular deep dive | 5–12 | 5 мин (или во время Q&A) |
| Team Story | 13–18 | 10 мин |
| Q&A | 19–20 | 5–10 мин |

## Как перенести в Figma за 15 минут

1. Откройте Figma Slides → выберите тёмный template или создайте master slide с `#14100f` фоном.
2. Создайте 20 слайдов по структуре выше.
3. На слайды 3, 4, 11, 18 вставьте скриншоты приложения.
4. На слайд 7 вставьте snippet из `main-page.facade.ts`.
5. На слайд 12 добавьте 4 stat-блока (22, 64, 125+, 4).
6. Добавьте speaker notes из этого файла (View → Notes в Figma Slides).

## URL после деплоя

**Production:** [https://delulu-church.netlify.app/presentation/](https://delulu-church.netlify.app/presentation/)

Файл лежит в `presentation/index.html` и попадает в сборку через `angular.json` assets.

## Деплой

```bash
pnpm build
npx netlify login          # один раз, если ещё не залогинены
npx netlify deploy --prod --dir=dist/ngKittyDebugRight/browser
```

Либо смержить в `develop` — Netlify задеплоит автоматически через GitHub integration.

## Альтернатива

Готовая HTML-презентация: откройте `presentation/index.html` в браузере (стрелки / клик / N для notes). Можно презентовать напрямую или экспортировать скриншоты в Figma.

# ngKittyDebug

## :church: About the project

The Church of the Holy Deploy — цифровой храм для программистов: исповедь в багах, оракул о судьбе деплоя, алтарь со свечами, получение наставление от деда-сеньора, благословение Духа Машины и профиль верующего. Входите без страха, и да воздастся вам по вере вашей.

### Реализовано

- **Главная** — гадание на судьбу деплоя (расклад Tarot через внешний API)
- **Дед-сеньор** — генератор цифровой мудрости (ghost-coder)
- **Исповедальня (shrift)** — список грехов, добавление и удаление (Firebase Firestore)
- **Алтарь (altar)** — свечи, подсчёт подношений, уровень благословения Духа Машины
- **Санктум (sanctum)** — ритуал суда над веткой (litany, вердикт, digital priest, звук)
- **Crystal ball** — страница с магическим шаром и «мудростью»
- **Авторизация** — регистрация, вход (email + OAuth GitHub/Google), Firebase Auth
- **Профиль** — UI-shell (в разработке)
- **404** — страница для неизвестных маршрутов с возвратом на главную
- **i18n** — русский / английский (Transloco)
- **Тема** — светлая / тёмная, синхронизация с Firestore
- **Уведомления** — `@ngxpert/hot-toast` (тема glassmorphism): HTTP-ошибки через interceptor, ошибки Firestore — в facades страниц
- **Валидация форм** — login / register: `tui-error` привязан к `FormControl`, тексты ошибок централизованы через `tuiValidationErrorsProvider` + Transloco

## 🚀 Демонстрация обработки ошибок, состояния загрузки, 404

[Ссылка](https://drive.google.com/file/d/1xQl8qfHqrmiRhw6KaKnjK7WEUC5O3FE4/view?usp=sharing)

## 🚀 Deployment

**Production:** [https://delulu-church.netlify.app/](https://delulu-church.netlify.app/)

**Teamwork:** [`presentation/teamwork.md`](presentation/teamwork.md)

**Team presentation:** [https://delulu-church.netlify.app/presentation/](https://delulu-church.netlify.app/presentation/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/be597b1e-bdc6-4923-a2cc-0eb263412cab/deploy-status)](https://app.netlify.com/projects/delulu-church/deploys)

**CI/CD:** GitHub Actions [`quality-check`](.github/workflows/quality-check.yml) на каждый push/PR в `develop` и `main` (typecheck, lint, format, test, build). После merge в `develop` — автодеплой на Netlify.

## 📋 Project Management

| Артефакт                | Ссылка                                                                            |
| ----------------------- | --------------------------------------------------------------------------------- |
| **Issues / backlog**    | [GitHub Issues](https://github.com/ngKittyDebug/angular-ngKittyDebugRight/issues) |
| **Teamwork**            | [`presentation/teamwork.md`](presentation/teamwork.md)                            |
| **Дневники разработки** | [`development-notes/`](development-notes/)                                        |
| **Meeting notes**       | [`development-notes/meetings-notes/`](development-notes/meetings-notes/)          |

### Meeting notes

| Спринт   | Запись / заметки                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sprint 1 | [Запись встречи (Google Drive)](https://drive.google.com/file/d/1CzNgI0UiuxF0_Y4qsqid9KUsxPaGFleb/view?usp=sharing) · [meeting-notes](development-notes/meetings-notes/meeting-notes-sprint-1-2026-05-18.md)                                                                                                                                                                                                                        |
| Sprint 2 | [Запись 27.05 (Google Drive)](https://drive.google.com/file/d/11Bn0mX9QPjcSKq_shiMDHU79aO8QSnMo/view?usp=sharing) · [Запись 30.05 (Google Drive)](https://drive.google.com/file/d/1t1DQv65eqgCe_lI-5epvMVc4Fx0682dX/view?usp=sharing) · [meeting-notes 27.05](development-notes/meetings-notes/meeting-notes-sprint-2-2026-05-27.md) · [meeting-notes 30.05](development-notes/meetings-notes/meeting-notes-sprint-2-2026-05-30.md) |

Задачи декомпозированы по спринтам (`sprint-1`…`sprint-4` labels), у каждого issue — assignee и описание.

## 🔀 Git Culture

- **Ветки:** `feat/`, `fix/`, `docs/` и др. — валидация в pre-push hook
- **Коммиты:** [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `chore:` (commitlint в Husky)
- **Pull Requests:** шаблон в [`.github/pull_request_template.md`](.github/pull_request_template.md), auto-assign reviewers
- **Code review:** repository rulesets на `develop`/`main` — минимум 1 approval + required CI check `test-and-build`
- **Pre-push:** `typecheck` → `format` → `lint` → `test`

## 👥 Team Members

| Роль                           | Имя                 | Гитхаб                                          |
| ------------------------------ | ------------------- | ----------------------------------------------- |
| Frontend developer / Team Lead | Daria Melnikova     | [dashque](https://github.com/dashque)           |
| Frontend developer             | Alena Alekseeva     | [alena1409](https://github.com/Alena1409)       |
| Frontend developer             | Nadezhda Kozochkina | [kozochkina82](https://github.com/kozochkina82) |

## :closed_book: Требования

- `Node.js` (24.15.0)
- `pnpm` (в проекте зафиксирован `pnpm@10.30.0`)

## ⚡ Get Started

1. Клонировать репозиторий:

```bash
git clone https://github.com/ngKittyDebug/angular-ngKittyDebugRight.git
cd angular-ngKittyDebugRight
```

2. Установить зависимости и запустить dev-сервер:

```bash
pnpm run ci
pnpm start
```

После запуска приложение доступно по адресу `http://localhost:4200/`.

Для работы с Firebase нужны корректные значения в [`src/environments/environment.ts`](src/environments/environment.ts). Tarot-запросы (`/api/reading`) в dev проксируются через [`proxy.conf.json`](proxy.conf.json) на `deploytarot.com`.

## :gear: Основные команды

| Команда             | Что делает                                                   |
| ------------------- | ------------------------------------------------------------ |
| `pnpm run ci`       | Устанавливает зависимости (`pnpm install --frozen-lockfile`) |
| `pnpm start`        | Запускает dev-сервер Angular (`ng serve -o`)                 |
| `pnpm watch`        | Собирает проект в watch-режиме                               |
| `pnpm build`        | Создаёт production-сборку приложения                         |
| `pnpm typecheck`    | Проверяет TypeScript без генерации файлов                    |
| `pnpm lint`         | Запускает ESLint (`src`) и Stylelint                         |
| `pnpm lint:fix`     | Автоматически исправляет ошибки ESLint и Stylelint           |
| `pnpm format`       | Проверяет форматирование Prettier                            |
| `pnpm format:fix`   | Форматирует файлы через Prettier                             |
| `pnpm test`         | Запускает unit-тесты один раз                                |
| `pnpm test:watch`   | Запускает unit-тесты в watch-режиме                          |
| `pnpm test:cov`     | Запускает тесты с отчётом о покрытии                         |
| `pnpm i18n:extract` | Извлекает ключи локализации Transloco                        |
| `pnpm i18n:find`    | Ищет отсутствующие и неиспользуемые ключи                    |
| `pnpm knip`         | Поиск неиспользуемых файлов, экспортов и зависимостей        |
| `pnpm deploy`       | Деплоит приложение на Netlify                                |

## :hammer_and_wrench: Tech Stack

- Angular 22
- TypeScript 6
- Firebase (Auth, Firestore)
- Taiga UI 5
- Transloco (i18n)
- NgRx Signals (`uiStateStore`)
- Vitest
- ESLint + Stylelint + Prettier
- Netlify (static hosting + tarot API redirect)

# ФОРК delulu-church

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

## 🚀 Deployment

**Production:** [https://ng-delulu-church.netlify.app/](https://delulu-church.netlify.app/)

## :closed_book: Требования

- `Node.js` (24.15.0)
- `pnpm` (в проекте зафиксирован `pnpm@11.22.0`)

## ⚡ Get Started

1. Клонировать репозиторий:

```bash
git clone git@github.com:dashque/delulu-church.git
cd delulu-church
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

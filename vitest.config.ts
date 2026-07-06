import { defineConfig } from 'vitest/config';

// Loaded by the Angular `@angular/build:unit-test` builder via `runnerConfig: true`.
// Keep this minimal — the builder merges its own Angular-specific Vitest setup.
export default defineConfig({
  test: {
    clearMocks: true,
    setupFiles: ['src/firebase-vitest-setup.ts'],
  },
});

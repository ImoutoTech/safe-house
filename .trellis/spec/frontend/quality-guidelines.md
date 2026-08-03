# Quality Guidelines

## Required Checks

Use the package scripts as the source of truth:

```sh
pnpm type-check
pnpm lint
pnpm build
```

`pnpm build` runs type checking and the Vite production build in parallel. `pnpm lint` currently applies fixes, so inspect its diff after running it. Prettier is available through `pnpm format` and targets `src/`.

No automated test framework or test files are currently configured. Do not invent a testing command. For behavior changes, perform focused manual verification in addition to type-check/lint/build; adding a test framework is a separate scoped decision.

## Review Checklist

- The change stays within the established layer: views compose, composables own flows, API modules construct requests, stores own cross-route client state, and types describe contracts.
- New route-level functionality respects both route permissions (`src/router/index.ts`) and action-level permissions (`v-permission`) where applicable.
- Requests expose loading/error behavior and user-triggered requests are not accidentally immediate.
- Forms validate before submission and disable or show loading during an in-flight action.
- Lists have stable keys, empty/loading/error states are represented, and modal dialogs retain dialog accessibility attributes.
- Shared state mutations use store actions; reset paths also clear dependent permissions/tokens when necessary (`user-info.vue`, `useUserData.ts`).
- New API methods have complete generic response types and new public component contracts are typed.
- Responsive behavior at the project's `768px` breakpoint is preserved for affected layouts.

## Existing Patterns to Preserve

- Vue 3 Composition API with `<script setup lang="ts">` and explicit `defineOptions` names.
- Naive UI auto-imports configured in `vite.config.ts`; import library types explicitly but do not add unnecessary runtime imports for auto-imported APIs.
- Scoped SCSS for local styles and `src/assets/base.css` for global rules.
- Lazy-loaded route components for non-root screens in `src/router/index.ts` and `src/router/user-routes.ts`.

## Avoid

- Do not copy existing legacy `any` uses, debug `console.log`, inconsistent API casing, or formatting quirks into new code merely because they exist.
- Do not use `v-html` for untrusted content.
- Do not bypass the centralized Alova authentication/error handling in `src/api/api.ts`.
- Do not rely only on a successful Vite transpile; run `vue-tsc` through `pnpm type-check` or `pnpm build`.

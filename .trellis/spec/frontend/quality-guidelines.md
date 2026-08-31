# Quality Guidelines

## Required Checks

Use the package scripts as the source of truth:

```sh
pnpm test
pnpm type-check
pnpm lint
pnpm build
```

`pnpm build` runs type checking and the Vite production build in parallel. `pnpm lint` currently applies fixes, so inspect its diff after running it. Prettier is available through `pnpm format` and targets `src/`.

`pnpm test` runs the repository's focused TypeScript/Vue regression suite. UI foundation tests assert source-owned primitive contracts and legacy-library removal; feature tests should prefer semantic or behavioral assertions over snapshots of generated utility classes. For behavior changes, run the relevant focused tests and perform manual verification for browser-only interactions in addition to type-check/lint/build.

## Review Checklist

- The change stays within the established layer: views compose, composables own flows, API modules construct requests, stores own cross-route client state, and types describe contracts.
- New route-level functionality respects both route permissions (`src/router/index.ts`) and action-level permissions (`v-permission`) where applicable.
- Requests expose loading/error behavior and user-triggered requests are not accidentally immediate.
- Centralized request error handling tolerates transport failures where no HTTP `response` exists; inspect `response?.data` defensively and provide a stable fallback message.
- Forms validate before submission and disable or show loading during an in-flight action.
- Lists have stable keys, empty/loading/error states are represented, and modal dialogs retain dialog accessibility attributes.
- Shared state mutations use store actions; reset paths also clear dependent permissions/tokens when necessary (`user-info.vue`, `useUserData.ts`).
- New API methods have complete generic response types and new public component contracts are typed.
- Responsive behavior at the project's `768px` breakpoint is preserved for affected layouts.

## Existing Patterns to Preserve

- Vue 3 Composition API with `<script setup lang="ts">` and explicit `defineOptions` names.
- Vue/Pinia/Router APIs remain auto-imported. Origin UI components, Reka primitives, Lucide icons, and app feedback/form contracts are imported explicitly so dependencies stay visible at the call site.
- Scoped SCSS for local styles and `src/assets/base.css` for global rules.
- Lazy-loaded route components for non-root screens in `src/router/index.ts` and `src/router/user-routes.ts`.

## Avoid

- Do not copy existing legacy `any` uses, debug `console.log`, inconsistent API casing, or formatting quirks into new code merely because they exist.
- Do not use `v-html` for untrusted content.
- Do not bypass the centralized Alova authentication/error handling in `src/api/api.ts`.
- Do not rely only on a successful Vite transpile; run `vue-tsc` through `pnpm type-check` or `pnpm build`.

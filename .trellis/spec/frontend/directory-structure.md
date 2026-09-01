# Directory Structure

## Application Shape

This is a single-package Vue 3 application. Keep code under `src/` and use the `@/` alias for cross-directory imports.

```text
src/
├── api/          # Alova client setup and endpoint factories
├── assets/       # Global CSS and static source assets
├── components/   # App-wide presentational components
├── composables/  # Stateful feature/application logic (`use*.ts`)
├── directives/   # Global Vue directives and their installer
├── layout/       # Reusable router/slot layout shells
├── router/       # Router creation and route-record modules
├── stores/       # Pinia setup stores and Pinia plugin setup
├── types/        # Shared domain and transport types
├── utils/        # Pure constants and permission helpers
└── views/        # Route-level features and their local UI components
```

Evidence: `src/main.ts`, `src/router/index.ts`, `src/api/api.ts`, and `src/stores/pinia.ts` define these boundaries.

## Feature Organization

- Route-entry components live in `src/views/`. A feature with several screens uses a feature directory; the user area uses `src/views/user/pages/` for routes and `src/views/user/components/` for feature-only UI.
- Put a component in `src/components/` only when it is app-wide or domain-generic. `src/components/app-status.vue` and `src/components/user-role-tag.vue` are examples.
- Put stateful or side-effect-heavy logic in `src/composables/`, leaving views to compose UI and handle small local presentation state. `src/views/user/pages/user-app.vue` delegates list loading to `src/composables/useAppList.ts`.
- Put HTTP method construction in `src/api/`, not in components or stores. Domain interfaces belong in `src/types/` and are re-exported by `src/types/index.ts`.
- Layout shells belong in `src/layout/`; router configuration belongs in `src/router/`. Route-specific child records may be split out, as in `src/router/user-routes.ts`.
- `src/layout/BaseLayout.vue` is product chrome only: centered `ENV.TITLE` → `/`, footer facts, no session/nav/store. Session chrome belongs in the feature view (for example `src/views/user/view-index.vue`), not the shell.

## Naming

- Vue files and directories currently use kebab-case (`user-app-item.vue`, `home-view.vue`). Components declare a PascalCase runtime name with `defineOptions`, for example `UserAppItem`.
- Composables use PascalCase after the `use` prefix (`useUserData.ts`, `useAppSecret.ts`) and export a same-named function.
- Stores use lower-case domain filenames and export `use<Domain>Store` (`src/stores/user.ts`).
- API functions follow the existing endpoint vocabulary. Preserve neighboring casing when modifying an API module; the codebase currently contains both `GetUserApp` and lower-camel-case functions.

## Avoid

- Do not place feature-only dialogs or cards in the global `src/components/` directory.
- Do not call Alova endpoints directly from templates or duplicate request configuration outside `src/api/`.
- Do not add a new top-level layer when an existing boundary already owns the concern.

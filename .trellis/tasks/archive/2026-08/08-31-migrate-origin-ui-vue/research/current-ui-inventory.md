# Current UI inventory

## Scope snapshot

- The application is a single Vue 3 + TypeScript + Vite package. `package.json` declares Naive UI and Ionicons, while `vite.config.ts` configures Naive UI component and composable auto-imports.
- Naive UI is present in 31 Vue files. Those files contain 50 distinct `n-*` tags and about 3,150 lines of source.
- The most frequent primitives are buttons (57), flex layouts (47), inputs (31), form items (29), text (18), alerts (15), and cards (14). The migration also needs higher-order controls: dialogs/modals, tabs, selects, switches, collapses, tables, pagination, dynamic tags, confirmation popovers, results, loading and empty states.
- Naive UI types or injected APIs are referenced across 29 Vue/TypeScript files. These include `FormInst`, `FormRules`, `useMessage`, and `useDialog`.
- Eleven styles reach into Naive UI internals through `.n-*` or `:deep(.n-*)` selectors. These must be redesigned instead of mechanically renamed.
- `tsconfig.app.json` includes `naive-ui/volar`; `vite.config.ts` includes `NaiveUiResolver`; `App.vue` installs Naive message/dialog/modal providers.
- No Tailwind, Reka UI, Radix Vue, shadcn-vue, Lucide, class-variance-authority, VeeValidate, or Zod dependency is currently declared.

## User-facing surfaces

### Public and authentication

- `src/views/home-view.vue`: runtime-configured welcome copy and register/login actions.
- `src/views/user/pages/login-index.vue`: local credential form, validation, external-provider buttons, provider error/loading states.
- `src/views/user/pages/register-index.vue`: account registration and email verification.
- `src/views/oauth/ExternalCallbackView.vue`: callback progress, success, binding-required, unbound and error outcomes.

### Authorization

- `src/views/callback/view-index.vue`: legacy application login/consent card.
- `src/views/callback/authorize-index.vue`: OIDC interaction with client identity, requested scopes, completion error and approve/cancel actions.

### Account workspace

- `src/views/user/view-index.vue`: profile header plus permission-aware route tabs.
- `src/views/user/pages/user-info.vue`: account facts, edit and sign-out actions.
- `src/views/user/pages/user-identities.vue`: linked and available external identities with bind/unbind flows.
- `src/views/user/pages/user-app.vue`: searchable, paginated child-application list and creation/integration-guide entry points.

### Application and credential management

- `src/views/user/components/user-app-item.vue`: app status, callback URL, visit count, ID copy and inspect/edit/delete actions.
- `create-user-app.vue` and `update-user-app.vue`: modal forms.
- `user-app-secret.vue`: credential creation, activation, deletion and one-time-secret handling.
- `oidc-integration-guide.vue`: large responsive dialog with tabs, copy/download actions and embedded guide.

### Administrative settings

- `src/views/user/pages/user-manage.vue`: permission-aware accordion containing provider, notification channel, template and application-policy sections.
- Provider and notification components contain dense forms, switches, lists, API-key handling, error recovery and destructive actions.

## Architecture and behavior constraints

- Route-level views already delegate network state to composables. The migration should preserve this separation and replace only UI-facing types/services.
- Permission gates exist both in route metadata and through `v-permission`; visual restructuring cannot move actions outside these gates.
- Form validation currently depends on Naive UI rule objects and callback-based `FormInst.validate`. Replacing the form layer is a behavior migration, not a cosmetic tag swap.
- Toasts and confirmation dialogs are currently called from composables. Origin UI Vue components are source-owned and local, so a small app-level feedback/confirmation service boundary will likely be needed to prevent UI primitives from leaking further into business composables.
- `App.vue` owns backend loading and global feedback providers. Its provider removal and loading-state redesign are migration-critical.
- The current global stylesheet is very small; most visual behavior is local scoped SCSS. This limits global CSS debt but means every migrated surface must be deliberately recomposed.

## Highest-risk areas

1. Form contracts: validation semantics, disabled/loading behavior, error placement and password/email verification flows.
2. Overlay contracts: nested account-edit dialogs, large iframe guide dialog, one-time secret presentation, confirmation dialogs and focus return.
3. Imperative feedback: at least 15 composables/components call Naive UI messages or dialogs.
4. Dense admin controls: select, multi-select, dynamic tags, number input, switches and responsive grids need verified Origin-compatible implementations.
5. Authorization safety: client identity, requested scopes, approve/deny hierarchy and failure recovery must remain explicit after visual reorganization.
6. Existing source-assertion tests include Naive UI markup/CSS expectations (especially `tests/oidcIntegrationGuide.test.ts`) and must be rewritten to assert behavior/semantics rather than the old library implementation.

## Existing validation assets

- Package scripts: `pnpm type-check`, `pnpm lint`, and `pnpm build`.
- Repository tests under `tests/` use Node's test runner and source assertions for home fallback behavior, provider administration, and the OIDC integration guide.
- The tests currently have no package script or TypeScript loader. Running `node --test tests/*.test.ts` on Node 22.13.0 fails before executing assertions with `ERR_UNKNOWN_FILE_EXTENSION`.
- A planning-time `pnpm type-check` baseline could not start because the configured pnpm 10.7.0 package-manager switch refused an unverifiable/unreachable registry signature. This is an environment/package-manager bootstrap issue, not a source type-check result, and must be resolved or explicitly bypassed before implementation verification.
- No browser E2E suite is configured, so the migration plan needs an explicit desktop/mobile manual matrix for public, authenticated, permission-limited and administrator states.

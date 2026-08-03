# Type Safety

## Baseline

The application is TypeScript-first. Vue SFC scripts use `lang="ts"`, and `pnpm type-check` runs `vue-tsc --build --force`. Use `import type` when an import is type-only and use `@/` for source imports.

## Type Organization

- Shared domain and API payload types live in `src/types/<domain>.ts` and are re-exported by `src/types/index.ts`.
- Generic transport envelopes live in `src/types/index.ts`: `Restful<T>` and `Pagination<T>`.
- Keep a type local when it exists only to type one implementation detail. `Config` stays with `src/stores/config.ts`; `PermissionElement` and `PermissionBinding` stay in `src/directives/permission.ts`.
- Reuse authoritative external types such as `UserRole` and `UserJwtPayload` from `@reus-able/types` rather than recreating them.
- Model finite domain states with enums or literal unions. Examples include `AppStatus` and the layout prop `'router' | 'slot'`.

## API and Component Contracts

- Parameterize every Alova method with its full response type, for example `API.Get<Restful<AppInfo>>` in `src/api/app.ts`.
- Use `Partial<T>` only for genuinely partial updates, as in `updateUserData` and `useEditUser`.
- Type Vue boundaries with generic `defineProps`, `defineEmits`, and `withDefaults`. Type Naive UI refs and rules with library types (`FormInst`, `FormRules`).
- Use `keyof` for keyed mutation helpers. `handleUpdateVal(key: keyof UserLoginParams, val: string)` prevents invalid form field names.
- Use `as const` when a third-party prop expects a narrow literal, as in the status and role tag maps.

## Runtime Validation

There is no schema-validation library. Runtime checks currently occur at boundaries through Naive UI form rules, router normalization (`String(route.query...)`), enum/permission comparisons, and API error handling. Do not claim that TypeScript types validate server responses at runtime.

When adding a form, follow the existing `FormInst.validate` flow before submission. When adding a new external/untrusted payload whose shape cannot be trusted, introduce explicit validation as part of that feature rather than relying on an assertion.

## Avoid

- Do not introduce new unparameterized `any`. Existing `Restful<any>`, generic defaults of `any`, directive casts, and callback error handlers are legacy exceptions.
- Do not use type assertions to bypass a mismatched domain contract; narrow or fix the source type.
- Do not duplicate transport envelope or domain interfaces next to consumers.
- Do not import a symbol as a runtime value when it is used only as a type.

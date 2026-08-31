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
- Type Vue boundaries with generic `defineProps`, `defineEmits`, `defineModel`, and `withDefaults`. Source-owned UI primitives expose narrow literal variants and typed props/emits; feature components must not bypass those contracts with assertions.
- Use `keyof` for keyed mutation helpers. `handleUpdateVal(key: keyof UserLoginParams, val: string)` prevents invalid form field names.
- Use `as const` when a third-party prop expects a narrow literal, as in the status and role tag maps.

## Runtime Validation

Zod provides runtime form validation. `useFormValidation<T>()` is the project-owned adapter for schemas whose parsed shape matches the existing feature/API payload; it stores at most one message per top-level key and never replaces server-response validation. Router normalization (`String(route.query...)`), enum/permission comparisons, and API error handling remain separate boundary checks. Do not claim that TypeScript or a form schema validates server responses at runtime.

When adding a form, define a typed Zod schema, validate before submission, keep server errors separate from field errors, and associate each rendered error with its control. Use the local adapter instead of adding a second form-state owner. When adding a new external/untrusted payload whose shape cannot be trusted, introduce explicit response validation as part of that feature rather than relying on an assertion.

## Avoid

- Do not introduce new unparameterized `any`. Existing `Restful<any>`, generic defaults of `any`, directive casts, and callback error handlers are legacy exceptions.
- Do not use type assertions to bypass a mismatched domain contract; narrow or fix the source type.
- Do not duplicate transport envelope or domain interfaces next to consumers.
- Do not import a symbol as a runtime value when it is used only as a type.

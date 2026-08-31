# Composable Guidelines

The project calls Vue Composition API helpers “composables” and stores them in `src/composables/`. Every exported composable is named `use<Feature>` and lives in a same-named `.ts` file.

## Responsibilities

- Encapsulate a cohesive user flow or stateful concern: authentication (`useUserLogin`), paginated app loading (`useAppList`), editing (`useEditApp`), or app-secret operations (`useAppSecret`).
- Import endpoint factories from `src/api/`; do not construct URLs inside composables.
- Return the smallest state-and-action surface the component needs. Common return values are `loading`, request data, computed state, form parameters, and explicit actions such as `submit`, `refresh`, or `reset`.
- Accept an optional success callback when the owning component must close a modal or refresh parent state. This pattern is used by `useCreateApp`, `useEditApp`, `useEditUser`, and `useDeleteApp`.

## Requests and Errors

- Use Alova's `useRequest` for one request, `useSerialRequest` for dependent requests, and `usePagination` for paginated collections.
- Set `{ immediate: false }` when submission is user-triggered. Immediate reads either pass a method directly or calculate `immediate` from existing store state, as in `useConfig` and `useUserData`.
- Register lifecycle callbacks (`onSuccess`, `onError`) beside request creation. Update Pinia state there and route user-facing toast feedback through `useFeedback`; keep destructive confirmation state in the presenting component.
- Expose combined loading as `computed` when several operations contribute. `useAppSecret` and `useUserData` are the reference patterns.
- Keep loading cleanup in `finally` for manually managed Promise operations (`useAppSecret`).

## Reactive API Shape

- Use `ref` when the value is replaced and `reactive` for field-by-field form mutation. `useCreateApp` replaces a typed ref on reset; `useUserLogin` mutates a reactive form object.
- Derive state with `computed`, including component binding objects in `useAppList` and store projections in `useUserData`.
- Return `readonly(...)` when consumers should update state only through actions. `useUserLogin` and `useUserRegister` expose read-only form objects plus `handleUpdateVal`.
- Use `watch` for navigation or synchronization side effects, not for values that can be computed. `useAuthGuard` is the current side-effect example.

## Avoid

- Do not create a `use*` wrapper for a pure formatter or constant; those belong in `src/utils/`.
- Do not duplicate endpoint response handling across components when it belongs in one composable.
- Do not expose mutable state without also making the intended update path clear.
- Avoid adding new `any` error parameters. Existing `handleError(e: any)` uses in callback flows are legacy gaps, not a pattern to copy.

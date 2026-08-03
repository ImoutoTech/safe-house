# State Management

## State Categories

| Kind | Owner | Examples |
|---|---|---|
| Component UI state | Route/component `ref` or `reactive` | Modal visibility and selected app in `src/views/user/pages/user-app.vue` |
| Feature/request state | Composable and Alova hooks | Pagination in `useAppList`, form submission in `useCreateApp` |
| Cross-route client state | Pinia setup store | Tokens/profile/permissions in `src/stores/user.ts` |
| Persistent configuration | Pinia persisted store | `src/stores/config.ts` with key `sf-config` |
| Server state | Alova request results | `useRequest`, `useSerialRequest`, and `usePagination` data/loading/error refs |
| URL state | Vue Router | Callback path id and OAuth query values in callback views |

## Pinia Stores

Stores use setup syntax: `defineStore('<id>', () => { ... }, { persist })`. Register plugins once in `src/stores/pinia.ts`.

- Keep source state minimal and expose computed derivations such as `hasLogin` and `isCallback`.
- Expose named actions for mutations (`updateToken`, `updateUserData`, `updateUserPermissions`, `updateApp`). Consumers should call these actions rather than reproduce reset logic.
- Define typed reset constants at module scope and clone or `Object.assign` them when clearing state. See `INIT_USER_DATA` in `src/stores/user.ts` and `INIT_DATA` in `src/stores/callback.ts`.
- Add persistence only for state that must survive reloads. User and config stores use stable `sf-*` keys; callback state explicitly uses `persist: false`.
- Call `use<Domain>Store()` inside setup/composables/router guards after Pinia is installed. Router guards use `useUserStore` and redirect based on role/permission state.

## Ownership Rules

- Keep modal state, input drafts, and one-view selections local.
- Promote data to Pinia only when multiple routes/features need it or it must persist across reloads.
- Keep remote collection data in Alova request hooks rather than mirroring it in Pinia without a demonstrated cross-route need.
- Store permission codes in `userPermissions`; enforce route access in `src/router/index.ts` and element access with `src/directives/permission.ts`.

## Avoid

- Do not mutate persistent store fields ad hoc when an existing store action expresses the operation.
- Do not persist transient request loading/error state or callback flow state.
- Do not duplicate a computed value as independently mutable state.
- Do not treat route meta or query parameters as Pinia state.

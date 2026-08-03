# Component Guidelines

## SFC Pattern

Components use Vue 3 Composition API with `<script setup lang="ts">`. Existing files usually order sections as template, script, then scoped style; preserve the neighboring file's order when editing. Declare an explicit component name with `defineOptions({ name: '...' })`.

Representative files: `src/components/app-status.vue`, `src/layout/FlexCenterLayout.vue`, and `src/views/user/components/create-user-app.vue`.

## Component Boundaries and Data Flow

- Route views compose feature components and composables. `src/views/user/pages/user-app.vue` owns modal visibility and selected-app state while child components own their individual dialogs/cards.
- Pass typed inputs through `defineProps` and report changes through typed `defineEmits`. `src/views/user/components/user-app-item.vue` demonstrates required props plus `delete`, `update`, and `inspect` events.
- Use `defineModel` for genuine two-way state such as modal visibility. `create-user-app.vue`, `update-user-app.vue`, and `user-app-secret.vue` all expose `v-model:visible`.
- Use slots for layout shells. `src/layout/FlexCenterLayout.vue` supports either a default slot or nested router view through a typed `type` prop.
- Keep request state and business side effects in composables; components may own form refs, validation, modal state, and presentation-only computed values.

## Props, Emits, and Forms

Use type-based macros:

```ts
const props = defineProps<{ app: AppInfo }>()
const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'update'): void
}>()
```

Use `withDefaults(defineProps<...>(), defaults)` for optional props, as shown in `src/components/app-status.vue`. Do not mutate props. Clone domain objects when a local editable selection is needed (`editApp.value = { ...app }` in `user-app.vue`).

Naive UI forms use a typed `FormInst` ref, a rules object, and `validate` before invoking the composable action. See `create-user-app.vue` and `src/views/user/pages/register-index.vue`.

## Styling and UI

- Build UI primarily with auto-imported Naive UI components (`n-card`, `n-flex`, `n-form`, and related controls).
- Use `<style scoped lang="scss">` for component styles. Global rules and shared dialog sizing live in `src/assets/base.css`.
- Use class selectors and local SCSS nesting. Use `:deep()` only to target library internals, as in `src/views/user/pages/user-app.vue`.
- Existing responsive layout uses a `768px` breakpoint in `BaseLayout.vue`, `user-app.vue`, and `user/view-index.vue`.
- Modals include `role="dialog"` and `aria-modal="true"`; preserve this pattern. Icon-only or ambiguous actions should retain tooltip/visible context, as in `user-app-item.vue` and `user-app-secret.vue`.

## Avoid

- Do not move API calls or shared domain state into a presentational tag/card component.
- Do not use untyped props/emits or mutate a prop in place.
- Do not remove stable `:key` values from rendered lists.
- Do not add unscoped component CSS unless the rule is intentionally application-wide.

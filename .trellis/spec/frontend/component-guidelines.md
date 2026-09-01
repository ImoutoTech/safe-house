# Component Guidelines

## SFC Pattern

Components use Vue 3 Composition API with `<script setup lang="ts">`. Existing files usually order sections as template, script, then scoped style; preserve the neighboring file's order when editing. Declare an explicit component name with `defineOptions({ name: '...' })`.

Representative files: `src/components/app-status.vue`, `src/layout/FlexCenterLayout.vue`, and `src/views/user/components/create-user-app.vue`.

## Component Boundaries and Data Flow

- Route views compose feature components and composables. `src/views/user/pages/user-app.vue` owns modal visibility and selected-app state while child components own their individual dialogs/cards.
- Pass typed inputs through `defineProps` and report changes through typed `defineEmits`. `src/views/user/components/user-app-item.vue` demonstrates required props plus `delete`, `update`, and `inspect` events.
- Use `defineModel` for genuine two-way state such as modal visibility. `create-user-app.vue`, `update-user-app.vue`, and `user-app-secret.vue` all expose `v-model:visible`.
- Use slots for layout shells. `src/layout/FlexCenterLayout.vue` supports either a default slot or nested router view through a typed `type` prop.
- Keep request state and business side effects in composables; components may own validation schemas, modal state, and presentation-only computed values.

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

Forms keep the existing feature/composable state as their source of truth and validate it at submit with Zod. Reuse the typed project adapter in `src/composables/useFormValidation.ts` for ordinary object schemas; it returns parsed data or `null` plus keyed field errors. Render labels and errors through `UiField`, pass its `describedBy`/`invalid` slot values to the control, and do not submit while the request is loading. Complex cross-field forms may call `safeParse` locally when a computed schema is required.

## Styling and UI

- Import source-owned primitives explicitly from `@/components/ui/` and reusable product compositions from `@/components/patterns/`. Low-level UI primitives must not import Safe House domain types or issue requests.
- Use semantic HTML and Tailwind utilities for layout rather than adding wrapper primitives for flex, grid, lists, descriptions, or results. Keep Origin's neutral/New York tokens and focus treatments; do not recreate the retired component-library theme.
- Global Tailwind imports, semantic tokens, and intentional application-wide rules live in `src/assets/base.css`. Scoped CSS remains appropriate for component behavior that utilities cannot express clearly.
- Do not target Reka/Origin internal class names. Extend the owned primitive or pass a documented class/variant instead.
- Existing responsive layout uses a `768px` breakpoint in `BaseLayout.vue`, `user-app.vue`, and `user/view-index.vue`.
- `BaseLayout` is an identity plaque, not an admin toolbar. Header: document-flow (no `sticky`), centered `RouterLink` of `ENV.TITLE` to `/`, no login/avatar/nav/session. Footer: no `border-t`; copy well `mx-auto w-full max-w-4xl px-4 sm:px-6` (same well as account workspace, not home `max-w-2xl`); copyright year range + `ENV.COPYRIGHT.NAME` without `<strong>` / `font-medium`; `commit@branch` is only `UiTooltip` content on the author control, never a visible badge. Do not import `useUserStore` in the layout.
- Use `UiDialog` and `UiConfirmDialog` for overlays so Reka UI owns dialog roles, focus trapping, Escape behavior, announcements, and focus return. Every dialog needs a visible title and useful description. Icon-only actions require an `aria-label` or visible text.
- Large viewport-filling modals must keep their footer actions inside the mobile visual viewport. Provide a `vh` fallback followed by the equivalent `dvh` height, make the content area flex with `min-height: 0`, and let the content scroll independently instead of allowing a dynamic browser toolbar to cover the modal footer. `UiDialog` is a flex column; the scroll body needs at least `p-1.5` so a 3px focus ring is not clipped by `overflow-y-auto`.
- Toast feedback goes through `useFeedback`. `src/main.ts` must import `vue-sonner/style.css`; without it the Toaster host is in the DOM but has no fixed positioning or colors.
- Hover/focus hints use `UiTooltip` (Origin `tooltip.json` / `comp-354`). Keep it domain-free: pass a string `content` and a single focusable default-slot trigger. Do not import ENV, stores, or API modules in `src/components/ui/`.
- In-page or route-linked tablists use `UiTabs` (Origin `tabs.json` / `comp-427`). Keep the primitives domain-free: `v-model` and trigger/content `value` are `string | number`, `UiTabsTrigger` stays `type="button"`, and `activationMode` is an explicit optional `'automatic' | 'manual'` prop (default Reka automatic). Callers pass `aria-label` on `UiTabsList`. Account chrome binds the model to the current route name, left-aligns with `items-start` (not `items-center`), and leaves `<router-view />` outside the primitive so permission-filtered triggers still drive Vue Router. Route-linked tabs that unmount a form page must set `activation-mode="manual"` so arrow keys do not `router.push` and discard unsaved edits. An overflowing list needs at least `p-1.5` so the 3px focus ring is not clipped.
- Exclusive choices that should look like selectable cards use `UiRadioCards` (Origin `comp-164`). Keep hidden card radios as `type="button"` so they do not submit enclosing forms. Reka `RadioGroup` `modelValue` is `AcceptableValue` (`string | number | …`) and compares with value equality, so numeric enums such as `AppStatus` can bind without stringifying.
- `UiRadioCards` titles must use the same `grid gap-2` + `text-sm font-medium leading-none` stack as `UiField`. Do not use a native `legend` for that title: browsers pull it out of normal flow and the gap next to neighboring fields looks wrong.
- Card radios hide the control with `sr-only`. Do not reuse `UiRadioGroupItem` there: its `size-4` circle classes win over `sr-only` and inflate the card. Use a bare Reka `RadioGroupItem` with only `sr-only after:absolute after:inset-0`.

## Avoid

- Do not move API calls or shared domain state into a presentational tag/card component.
- Do not use untyped props/emits or mutate a prop in place.
- Do not remove stable `:key` values from rendered lists.
- Do not add unscoped component CSS unless the rule is intentionally application-wide.

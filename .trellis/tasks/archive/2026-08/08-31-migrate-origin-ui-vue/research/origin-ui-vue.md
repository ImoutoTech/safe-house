# Research: Origin UI Vue migration from Naive UI

- Query: Research the official Origin UI Vue component library and propose a staged migration from Naive UI for the existing Vue 3 + TypeScript application, including installation/ownership, design conventions, coverage, Extended patterns, accessibility, maintenance, risks, and rollout.
- Scope: mixed (official external sources plus current repository inspection)
- Date: 2026-08-31

## Findings

### Executive recommendation

Adopt Origin UI Vue as a **source-owned design-system layer**, not as a drop-in package replacement. Initialize Tailwind CSS v4 and a project-local shadcn-vue registry configuration, install only the required Origin registry items into `src/components/ui`, keep their neutral/New York defaults and semantic tokens intact, then migrate by route group while Naive UI temporarily remains installed.

This approach meets the visual-refresh requirement because it changes the styling foundation rather than wrapping Origin primitives in the old Naive look. Preserve application behavior, permission checks, responsive constraints, and accessibility contracts, but do not preserve Naive spacing, colors, cards, or deep selectors. Use Extended examples as source-owned composition references, then adapt their data flow and semantics to the product rather than treating them as finished business components.

The largest migration risks are not buttons or cards. They are:

1. replacing Naive UI form validation (`FormInst` / `FormRules`),
2. replacing imperative `useMessage()` and `useDialog()` calls,
3. recreating layout/loading/list/description primitives that Origin does not expose one-for-one,
4. introducing Tailwind Preflight and a new token layer into an existing scoped-SCSS application, and
5. accepting ongoing ownership of copied component source.

### 1. What Origin UI Vue is

- The official site describes Origin UI Vue as an open-source collection of **copy-and-paste** Vue components built with Tailwind CSS, not as an imported runtime component package: [Origin UI Vue home](https://www.originui-vue.com/).
- The official repository repeats that model, says the Vue port is unaffiliated with the original Origin UI project, and says it follows shadcn conventions. It recommends copying `.vue` UI files and utilities, with extra libraries noted per component: [official README](https://github.com/misbahansori/originui-vue#readme).
- The repository's own package is marked `"private": true`; it is the documentation/registry application, not a public consumer package. Its current metadata identifies repository version `0.3.2`, Nuxt 4, Tailwind CSS `^4.3.1`, Reka UI `^2.10.1`, shadcn-vue `^2.7.4`, VueUse `^14.3.0`, and supporting packages such as CVA, Lucide, Remix Icon, vue-sonner, Maska, and Embla: [official package.json](https://raw.githubusercontent.com/misbahansori/originui-vue/main/package.json).
- Current examples are distributed as shadcn-vue registry JSON. The official Snippet page shows the concrete pattern `pnpm dlx shadcn-vue@latest add https://www.originui-vue.com/r/extended-36.json`: [Extended Snippet](https://www.originui-vue.com/extended/snippet). shadcn-vue documents URL-based registry installation and dependency declarations: [registry getting started](https://www.shadcn-vue.com/docs/registry/getting-started).
- A live registry item contains the source files, npm dependencies, and registry dependencies that the CLI copies. For example, Origin's Dialog item delivers eleven local files, depends on `reka-ui`, `@vueuse/core`, and `lucide-vue-next`, and pulls Origin's Button item: [dialog registry item](https://www.originui-vue.com/r/dialog.json). The login composite delivers one local `extended-01.vue`, adds Remix/Lucide icons, and pulls Button, Checkbox, Input, and Label: [login composite registry item](https://www.originui-vue.com/r/extended-01.json).

**Implication:** after installation, `src/components/ui/**` and any copied Extended components belong to this repository. Normal dependency updates can update Reka UI or vue-sonner, but they do not automatically update copied component source.

### 2. Recommended installation and dependency model

For this Vite application, use the official shadcn-vue Vite path as the host configuration, then use the Origin registry URLs as the source of visual components:

1. Add `tailwindcss` and `@tailwindcss/vite`, register `tailwindcss()` alongside Vue in Vite, and import Tailwind from the global stylesheet. This is the current official Tailwind Vite setup: [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite) and [shadcn-vue Vite installation](https://www.shadcn-vue.com/docs/installation/vite).
2. Run `pnpm dlx shadcn-vue@latest init` and create this project's own `components.json`. Do **not** copy Origin's repository `components.json` verbatim because its aliases point at the documentation site's `@/registry/default/**` tree. The upstream configuration is useful only as the style reference: `style: "new-york"`, TypeScript enabled, neutral base color, CSS variables enabled, and Lucide icons: [Origin components.json](https://raw.githubusercontent.com/misbahansori/originui-vue/main/components.json).
3. Configure consumer aliases to project paths such as `@/components`, `@/components/ui`, and `@/lib/utils`. The project already has the `@/* -> ./src/*` TypeScript and Vite alias, so no alias redesign is required (`tsconfig.app.json:9-13`, `vite.config.ts:27-30`).
4. Add Origin items explicitly by URL, beginning with the minimal foundation set. Representative live items prove that the CLI resolves nested registry and npm dependencies: [Button](https://www.originui-vue.com/r/button.json), [Input](https://www.originui-vue.com/r/input.json), [Dialog](https://www.originui-vue.com/r/dialog.json), [Alert Dialog](https://www.originui-vue.com/r/alert-dialog.json), and [Sonner](https://www.originui-vue.com/r/sonner.json).
5. Commit all generated UI source. Record the source URL and an upstream snapshot date/commit in the migration task so later diffs are deliberate.

Expected dependency groups:

| Group | Role | Notes |
|---|---|---|
| `tailwindcss`, `@tailwindcss/vite`, `tw-animate-css` | styling/build | Origin's current canonical stylesheet imports Tailwind and `tw-animate-css`: [official Tailwind CSS](https://raw.githubusercontent.com/misbahansori/originui-vue/main/app/assets/css/tailwind.css). |
| `reka-ui` | accessible headless interactions | Required by dialog, select, tabs, accordion, tooltip, checkbox, and other complex primitives; live registry items declare it per component. |
| `@vueuse/core` | model/prop forwarding utilities | Already present locally at `^10.9.0` (`package.json:20`), while Origin's site currently uses `^14.3.0`; compatibility must be tested before accepting an automatic major upgrade. |
| `class-variance-authority`, `clsx`, `tailwind-merge` | variants and class composition | Origin Button uses CVA variants and components accept class overrides through the `cn()` utility: [Button item](https://www.originui-vue.com/r/button.json). |
| `lucide-vue-next`, sometimes `@remixicon/vue` | icons | Origin primitives use Lucide; the Extended authentication sample uses both Lucide and Remix: [extended-01](https://www.originui-vue.com/r/extended-01.json). |
| `vue-sonner` | imperative toast/message replacement | Origin's Sonner item declares `vue-sonner` and provides a local wrapper: [Sonner item](https://www.originui-vue.com/r/sonner.json). |
| component-specific packages | special features | The official repository currently carries `@internationalized/date`, `maska`, `embla-carousel-vue`, `@tanstack/vue-table`, `vaul-vue`, and others. Add these only when a selected registry item requires them; do not mirror the documentation site's whole dependency set: [official package.json](https://raw.githubusercontent.com/misbahansori/originui-vue/main/package.json). |

### 3. Design system and code conventions

Origin UI Vue is the styled/open-code layer, shadcn-vue is the distribution and composition convention, Reka UI is the headless behavior layer, and Tailwind/CSS variables are the visual system:

```text
product view/composite
        ↓
owned Origin/Extended Vue source
        ↓
owned shadcn-style UI wrappers + semantic Tailwind classes
        ↓
Reka UI headless primitives for complex interaction
        ↓
Vue DOM + CSS-variable theme tokens
```

- shadcn-vue explicitly says it is not a conventional component library; it hands the application the actual source code and expects the application to customize/own it: [shadcn-vue introduction](https://www.shadcn-vue.com/docs/introduction).
- Origin's configuration selects the `new-york` style, neutral base color, CSS-variable theming, and Lucide icon library: [Origin components.json](https://raw.githubusercontent.com/misbahansori/originui-vue/main/components.json).
- The upstream stylesheet maps semantic variables to Tailwind utilities and provides light/dark OKLCH token sets for background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, charts, sidebar, and radius: [official Origin Tailwind CSS](https://raw.githubusercontent.com/misbahansori/originui-vue/main/app/assets/css/tailwind.css). shadcn-vue documents the same background/foreground token pairs and their intended uses: [theming](https://www.shadcn-vue.com/docs/theming).
- Origin's Button is a Reka `Primitive`, supports `as` / `asChild`, exposes `variant` and `size`, computes classes with CVA, accepts an overriding `class`, and includes visible focus/invalid/disabled states: [Button registry source](https://www.originui-vue.com/r/button.json).
- Origin's Dialog wrappers forward Reka props/emits, portal content to the document body, animate through `data-state`, expose composable Title/Description/Footer parts, and include a screen-reader-only close label: [Dialog registry source](https://www.originui-vue.com/r/dialog.json).
- Reka UI is the current name of Radix Vue in its v2 evolution. In this migration, references to “Radix” in old tags/examples should be understood as the design/API lineage; the actual Vue runtime dependency is `reka-ui`, not React Radix packages: [Reka UI introduction](https://www.reka-ui.com/docs/overview/introduction).

Visual policy for this project:

- Start with Origin's default neutral tokens and `--radius: 0.625rem`; do not translate current Naive colors into the new tokens during the first pass.
- Use semantic classes (`bg-background`, `text-muted-foreground`, `border-border`, `ring-ring`) rather than hard-coded copies of Naive colors.
- Let Tailwind own the UI-system components and page composition. Keep scoped SCSS only for genuinely application-specific behavior that is awkward as utilities; delete `.n-*` deep selectors as their screens migrate.
- Preserve the existing 768px product breakpoint where behavior depends on it, but adopt Origin's default spacing, typography, surface, and control treatments.

### 4. Official component coverage

The current home page exposes 28 showcase categories and 579 displayed variants in total: Accordion, Alert, Avatar, Badge, Banner, Breadcrumb, Button, Calendar/Date Picker, Checkbox, Dialog, Dropdown, File Upload, Input, Navbar, Notification, Pagination, Popover, Radio, Select, Slider, Stepper, Switch, Table, Tabs, Textarea, Timeline, Tooltip, and Tree: [official component gallery](https://www.originui-vue.com/).

The official registry additionally contains foundational shadcn-style UI items used by those examples, including Alert Dialog, Card, Collapsible, Command, Date/Time/Number Field, Drawer, Input Group, Label, Progress, Scroll Area, Separator, Sonner, Tags Input, Toast, Toggle, and Kbd: [official registry manifest](https://raw.githubusercontent.com/misbahansori/originui-vue/main/registry.json).

Coverage against current Naive UI usage:

| Current need | Origin path | Migration note |
|---|---|---|
| button, input, select, number input, checkbox, radio, switch | direct Origin UI primitives | APIs change from Naive `v-model:value` to normal `v-model`/Reka controlled props. Loading buttons require composed spinner/icon + `disabled`; Origin Button has no Naive-style `loading` prop. |
| alert, tag, avatar, tooltip, pagination, table, tabs, collapse | direct or close Origin primitive | Rewrite composition rather than mechanically translating props/slots. |
| modal/dialog | Origin Dialog or Alert Dialog | State changes from `v-model:show` to `v-model:open`; use Alert Dialog for destructive confirmation rather than a generic imperative provider. |
| messages/toasts | Origin Sonner wrapper | Introduce one app-level Toaster and a small app-facing notification service; replace `useMessage()` calls incrementally. |
| dynamic tags | Origin Tags Input | Verify domain value types and keyboard behavior. |
| code/snippets | semantic `<pre><code>` plus Extended Snippet | Particularly relevant to OIDC and API-key instructions. |
| card/result/empty | Card plus Extended Empty State | Result/error states remain product composites, not a one-prop status component. |
| form/form-item/rules | no equivalent production form system in Origin's main gallery | Choose a project form strategy. shadcn-vue now recommends Field-style composition; its older Form abstraction uses VeeValidate and Zod and is no longer actively developed: [shadcn-vue Form](https://www.shadcn-vue.com/docs/components/form). |
| spin/loading | no current Origin `spinner.json` registry item found | Use a small owned token-aligned loader/skeleton or selectively add shadcn-vue Spinner; preserve `aria-busy` and status text. |
| layout/flex/grid/text/list/descriptions/thing | semantic HTML + Tailwind | These are not reasons to add another UI library. Build `header`, `main`, `footer`, `section`, `ul`, `dl`, flex, and grid directly. |

### 5. Current project migration surface

Repository inventory found 57 `n-button`, 47 `n-flex`, 31 `n-input`, 29 `n-form-item`, 18 `n-text`, 15 `n-alert`, 14 `n-card`, 11 `n-form`, 9 `n-spin`, 9 `n-modal`, and smaller usage of Switch, Tag, Avatar, Tooltip, List, Grid, Descriptions, Collapse, Tabs, Select, Result, Radio, Table, Pagination, Popconfirm, Dynamic Tags, and Code.

Important code patterns and coupling:

- Naive UI is a development dependency (`package.json:31-52`), but it is runtime-critical throughout the app.
- Vite auto-imports `useDialog`, `useMessage`, `useNotification`, and `useLoadingBar`, and auto-resolves every Naive component (`vite.config.ts:5-25`). Generated declarations also encode those APIs (`auto-imports.d.ts`, `components.d.ts`).
- `tsconfig.app.json:13` adds `naive-ui/volar`, which must be removed only after all Naive template and type usage is gone.
- The root app nests Naive message/dialog/modal providers and uses `n-spin` for backend initialization (`src/App.vue:1-16`). This should be the final provider cutover, not the first migration edit.
- The current base shell is entirely Naive Layout/Flex/Text/Tag (`src/layout/BaseLayout.vue:1-36`) and has Naive-internal styling at `src/layout/BaseLayout.vue:61-66`; it should become semantic HTML/Tailwind instead of a compatibility wrapper.
- Login currently couples `FormInst`, Naive form rules, validation callbacks, inputs, alerts, button loading, and external-provider buttons (`src/views/user/pages/login-index.vue:1-27`, `src/views/user/pages/login-index.vue:30-83`). Its rule type and imperative messages also live in the composable (`src/composables/useUserLogin.ts:5-16`, `src/composables/useUserLogin.ts:24-27`, `src/composables/useUserLogin.ts:49-82`).
- Registration has the same Naive `FormRules` and `useMessage()` coupling plus verification side effects (`src/composables/useUserRegister.ts:4-12`, `src/composables/useUserRegister.ts:21-45`).
- Dialog forms depend on `FormInst.validate`, `n-modal`, `n-card`, and `common-dialog`; the create-app dialog is representative (`src/views/user/components/create-user-app.vue:1-23`, `src/views/user/components/create-user-app.vue:27-55`).
- User settings contain nested modal transitions and current business rules that must survive the visual rewrite (`src/views/user/components/user-data-modify.vue:1-39`, `src/views/user/components/user-data-modify.vue:90-140`).
- The account area is a fixed-width central Card + Tabs shell (`src/views/user/view-index.vue:1-29`, `src/views/user/view-index.vue:82-91`). This is a good place for a visible settings-layout redesign after the auth pilot.
- The admin screen is a Collapse containing provider, notification-channel, template, and app-policy sections (`src/views/user/pages/user-manage.vue:87-148`) and currently deep-styles Naive internals (`src/views/user/pages/user-manage.vue:151-165`).
- App management combines search, list, pagination, tooltip actions, four dialogs, and empty/loading states (`src/views/user/pages/user-app.vue:1-60`, `src/views/user/pages/user-app.vue:94-129`).
- Destructive confirmation is currently imperative (`src/views/user/pages/user-identities.vue:8-31`) and credentials mix list, switch, tooltip, popconfirm, loading, permissions, and a viewport-constrained dialog (`src/views/user/components/user-app-secret.vue:1-81`, `src/views/user/components/user-app-secret.vue:129-139`).
- The OAuth callback screen needs Card, Avatar, Alert, action hierarchy, loading, and Result states (`src/views/callback/view-index.vue:1-38`).

### 6. Extended patterns relevant to the product

Origin explicitly says Extended components are not part of the main library. The current collection has Authentication (5), Empty State (4), Card (10), Contribution Graph (5), Statistic Card (15), Snippet (3), and Mini Calendar (11): [Extended index](https://www.originui-vue.com/extended).

Recommended references:

| Product surface | Extended reference | How to use it |
|---|---|---|
| Login and registration | Authentication 01/02 | Use the centered bordered panel, clear title/description, full-width primary action, divider, and provider buttons as the new visual direction. Preserve current routing, verification, loading, errors, and binding continuation. Sources: [Authentication gallery](https://www.originui-vue.com/extended/auth), [login source](https://www.originui-vue.com/r/extended-01.json), [registration source](https://www.originui-vue.com/r/extended-02.json). |
| Email verification / future password recovery | Authentication 03-05 | Authentication already offers verification sent, forgot-password, and reset-password compositions. The current app can reuse the verification-state visual language without adding routes not in scope: [Authentication gallery](https://www.originui-vue.com/extended/auth). |
| Empty app/template/identity lists and error-result screens | Empty State 06-09 | Replace minimal `n-empty`/`n-result` with a consistent icon, explanation, and contextual create/refresh action. Do not show actions the user lacks permission to use: [Empty State gallery](https://www.originui-vue.com/extended/empty-state). |
| User profile and app cards | Extended Card | Use its profile and compact information-card hierarchy as inspiration for the account header and application rows; keep this product's fields and actions: [Card gallery](https://www.originui-vue.com/extended/card). |
| OIDC integration guide, client secrets, API keys | Extended Snippet 35-38 | Adopt tabbed command/code blocks, copy affordances, monospace tokens, and dark snippet surface for integration instructions. Source: [Snippet gallery](https://www.originui-vue.com/extended/snippet). |
| Admin overview/dashboard only where real metrics exist | Statistic Card 28-34 | Tasks, API quota, support metrics, compliance, and feature-adoption compositions demonstrate responsive dashboard density. Do not invent decorative metrics; use only for real operational data. Sources: [Statistic Card gallery](https://www.originui-vue.com/extended/statistic-card), [API quota source](https://www.originui-vue.com/r/extended-30.json), [support metrics source](https://www.originui-vue.com/r/extended-31.json). |
| Broader shell exploration | SaaS Dashboard layout | Use as visual research for page rhythm and navigation, not as drop-in Vue code; the Layouts section links a separate experiment repository and is not an Origin registry item: [Layouts & Experiments](https://www.originui-vue.com/layouts). |

The current product does not have a metric dashboard, so the first redesign should focus on auth, account settings, administration forms, application lists, and integration instructions. Statistic cards are optional enhancement work, not a migration prerequisite.

### 7. Accessibility implications

Positive foundation:

- Reka UI says its primitives follow WAI-ARIA authoring practices and handle many difficult details including roles/ARIA attributes, focus management, keyboard navigation, and screen-reader behavior: [Reka accessibility](https://reka-ui.com/docs/overview/accessibility).
- Reka Dialog traps focus when modal, manages announcements through Title/Description, closes on Escape, and requires an accessible label on icon-only closes: [Reka Dialog](https://www.reka-ui.com/docs/components/dialog).
- Reka Tabs provides the expected arrow/Home/End keyboard behavior: [Reka Tabs](https://www.reka-ui.com/docs/components/tabs). Select and Accordion similarly document their WAI-ARIA patterns: [Reka Select](https://www.reka-ui.com/docs/components/select), [Reka Accordion](https://www.reka-ui.com/docs/components/accordion).

Application responsibility remains:

- Reka's own accessibility guide says developers ultimately must provide correct labels and context. Headless primitives cannot make an incorrectly composed application accessible: [Reka accessibility](https://reka-ui.com/docs/overview/accessibility).
- Extended examples are visual starting points. The current login source uses plain `<form>` markup and must be wired to the product's submit handler, disabled/loading/error states, and validation. It should also be audited for explicit `id`/`for` associations and control references before adoption: [extended-01 source](https://www.originui-vue.com/r/extended-01.json).
- Preserve existing visible/assistive context for icon-only actions, dialog semantics, permission-disabled controls, independent modal scrolling, and mobile-safe `dvh` behavior (`.trellis/spec/frontend/component-guidelines.md`; representative viewport contract at `src/views/user/components/user-app-secret.vue:129-139`).
- Every migrated route needs keyboard-only smoke testing, visible-focus inspection, dialog focus-return/Escape checks, screen-reader label checks, and loading/error announcement checks. A successful type-check is not an accessibility test.

### 8. Maintenance and ownership implications

- Source ownership is a benefit: visual defaults can be adopted directly, app-specific variants can be added without fighting library internals, and the local code is fully inspectable. This matches shadcn-vue's “Open Code” model: [shadcn-vue introduction](https://www.shadcn-vue.com/docs/introduction).
- Source ownership is also a maintenance obligation: copied fixes and accessibility improvements do not arrive through an `originui-vue` version bump. Track upstream registry URLs/snapshots, periodically diff selected items, and review local customizations before reapplying upstream changes.
- Runtime primitives still update conventionally. Keep `reka-ui`, `@vueuse/core`, icon libraries, Tailwind, and vue-sonner under dependency auditing and test their major upgrades. Origin's live registry dependency declarations omit exact versions, so installation can resolve newer majors than the current app expects.
- The Origin documentation application is Nuxt-based, while this project is Vite-based. The repository says the components work in Vue projects, and shadcn-vue has an official Vite installation path, but do not copy Nuxt-specific modules/configuration: [Origin README](https://github.com/misbahansori/originui-vue#readme), [shadcn-vue Vite installation](https://www.shadcn-vue.com/docs/installation/vite).
- The official repository is MIT licensed: [license](https://github.com/misbahansori/originui-vue/blob/main/LICENCE.md). Preserve any required notices when copying source.

### 9. Migration constraints and risks

| Risk | Why it matters here | Mitigation |
|---|---|---|
| No one-to-one form replacement | 11 forms, 29 form items, and several composables use Naive `FormRules`; validation gates business submissions. | Decide one form contract before broad migration. Recommended: project-owned Field/Form wrappers with VeeValidate + typed schema only if the team accepts new validation dependencies; otherwise create a small typed validation layer and render Origin Label/Input directly. Do not mix ad hoc native `required`, old Naive rules, and a third form API indefinitely. |
| Imperative UI services | At least 18 modules call `useMessage()` and several call `useDialog()`. | Add app-facing `useAppToast` and controlled confirmation primitives first; implement them with Origin Sonner/Alert Dialog, then move call sites without leaking vendor APIs back into domain composables. |
| Tailwind global effects | The app currently uses only small global CSS plus scoped SCSS; Tailwind's import and base layer affect global elements. | Add Tailwind in an isolated foundation commit, visually snapshot all routes, and inspect typography/forms before component migration. Treat intentional visual change separately from broken layout. |
| Dual-stack inconsistency | Route-by-route migration temporarily shows Naive and Origin styles together. | Migrate coherent route groups, not individual buttons. Avoid placing both libraries in the same dialog/form where possible. Set a short dual-stack window. |
| Auto-import/name collisions | Existing Naive components and APIs are globally auto-imported. Origin components are local source imports. | Use explicit Origin imports. Keep Naive resolver only during transition; remove resolver, auto-imports, Volar type, generated declarations, and dependency only after a zero-usage search. |
| Missing utility primitives | Origin registry does not currently expose direct counterparts for Naive Layout/Flex/Descriptions/Thing/Result or a Spinner item. | Use semantic HTML/Tailwind and a small owned loading/status layer; do not add a second broad component suite. |
| Responsive modal regressions | Several existing dialogs rely on mobile width and `dvh`/independent-scroll behavior. | Build one shared application Dialog content variant with safe width, `max-h-[90dvh]`, `min-h-0`, and scrollable body, then use it across dialogs. Test iOS/Android viewport behavior manually. |
| Dependency drift | Project VueUse `^10.9.0` differs from Origin site's `^14.3.0`; live items list unversioned package names. | Resolve and review exact versions in the lockfile, run type-check/build after each foundation addition, and isolate any VueUse major upgrade from page rewrites. |
| Copied-example quality | Extended examples contain placeholder links/content and demonstration-only state. | Copy as a visual scaffold only; replace routing, forms, permissions, loading, errors, localization, keys, and accessibility attributes with product-owned implementations. |

### 10. Recommended staged adoption

#### Stage 0 — Architecture and visual contract

- Confirm source-owned components under `src/components/ui/**` and feature-only composites under their existing feature directories.
- Select the upstream default: New York + neutral + CSS variables + Lucide.
- Choose the form-validation strategy and define app-facing toast/confirmation APIs.
- Capture current route screenshots and a keyboard/accessibility checklist for login, register, callback, account tabs, app management, identities, and admin.

Exit gate: no product UI changed; dependencies, ownership, folder paths, form policy, and QA matrix are documented.

#### Stage 1 — Foundation

- Add Tailwind v4 Vite integration and Origin's default light/dark semantic tokens.
- Initialize project-local `components.json` with project aliases.
- Add a minimal audited primitive set: Button, Input, Label, Card, Badge, Alert, Avatar, Separator, Tooltip, Dialog, Alert Dialog, Sonner, Tabs, Select, Switch, Radio Group, Checkbox, Accordion, Pagination, Table, Tags Input, Textarea, and needed utilities/icons.
- Build project-owned loading, empty/result, toast, confirmation, and shared dialog-shell patterns.
- Keep Naive UI operational.

Exit gate: a small internal showcase renders all selected primitives in light mode, responsive layouts work, and `pnpm type-check`, `pnpm lint`, and `pnpm build` pass.

#### Stage 2 — Auth and callback pilot

- Redesign login and register as coherent screens using Extended Authentication 01/02 defaults.
- Integrate existing external-login buttons, verification state, disabled/loading behavior, error alerts, routing continuation, and current hashing/API flow.
- Migrate OAuth callback/authorization surfaces using Origin Card/Alert/Avatar/Button and consistent result/empty states.
- Replace message calls only for the migrated flows through the new app toast interface.

Exit gate: password manager/autofill, Enter submit, error focus/announcements, external providers, mobile layout, and callback redirects are manually verified.

#### Stage 3 — Account shell and settings

- Replace the fixed Naive Card/Tabs account shell with semantic page layout, responsive profile header, and Origin Tabs/Card/Avatar/Badge.
- Migrate user information and identity management.
- Convert edit-email/password/profile dialogs to the shared Dialog shell and the chosen form strategy.
- Use Extended Empty State where identities/providers are unavailable.

Exit gate: account navigation, permissions, nested-dialog transitions, focus return, logout, and responsive behavior are verified.

#### Stage 4 — App management and integration surfaces

- Migrate search/list/pagination/app cards as a complete surface.
- Convert create/update/secret/integration dialogs together.
- Use Extended Snippet patterns for OIDC commands, client secrets, and API-key copy interactions.
- Preserve destructive confirmation, enabled/disabled switches, permission directives, credential secrecy, and `dvh` dialog behavior.

Exit gate: CRUD, search, pagination, copy actions, secret lifecycle, permission-disabled states, empty/loading/error paths, and mobile dialogs are verified.

#### Stage 5 — Administration

- Recompose provider, SMTP channel, templates, and app policy as clear Card/Accordion sections with consistent page heading and actions.
- Use Origin Table/List, Alert, Select, Switch, Dialog, and form primitives; remove Naive internal deep selectors.
- Add Extended statistic cards only if real backend metrics are available and useful; they are not needed for the component-library migration.

Exit gate: every permission combination, fetch/save/retry path, form validation, and responsive section layout is verified.

#### Stage 6 — Remove Naive UI and harden

- Migrate the root loading/provider layer and BaseLayout.
- Verify zero `naive-ui`, `<n-`, `useMessage`, `useDialog`, `useNotification`, and `useLoadingBar` references.
- Remove Naive auto-import/resolver configuration, `naive-ui/volar`, generated declarations, dependency, unused vfonts/vicons, and all `.n-*` deep selectors.
- Run required checks and full-route visual/keyboard smoke tests. Inspect the lint diff because this repository's lint command fixes files.
- Record the chosen Origin registry snapshot and local deviations for future maintenance.

Exit gate: only Origin/source-owned UI + Tailwind/Reka dependencies remain, all routes have the new visual language, and no compatibility CSS attempts to recreate Naive UI.

## Files Found

### Local project

- `package.json` — Vue/Vite dependencies, Naive UI dependency, and quality scripts (`package.json:6-13`, `package.json:15-52`).
- `vite.config.ts` — current Naive API/component auto-import configuration and `@` alias (`vite.config.ts:5-30`).
- `tsconfig.app.json` — current Naive Volar type and existing `@/*` alias (`tsconfig.app.json:9-14`).
- `src/App.vue` — Naive global providers and root loading screen (`src/App.vue:1-16`).
- `src/assets/base.css` — small existing global stylesheet and shared Naive dialog width (`src/assets/base.css:1-22`).
- `src/layout/BaseLayout.vue` — Naive-based header/content/footer shell (`src/layout/BaseLayout.vue:1-36`).
- `src/views/user/pages/login-index.vue` — representative auth form and external-login composition (`src/views/user/pages/login-index.vue:30-99`).
- `src/views/user/view-index.vue` — account Card/Tabs shell (`src/views/user/view-index.vue:1-29`).
- `src/views/user/pages/user-app.vue` — CRUD list/search/pagination/dialog surface (`src/views/user/pages/user-app.vue:1-60`).
- `src/views/user/pages/user-manage.vue` — permission-aware admin sections and Naive deep styling (`src/views/user/pages/user-manage.vue:87-165`).
- `src/views/user/components/create-user-app.vue` — representative modal form validation (`src/views/user/components/create-user-app.vue:1-55`).
- `src/views/user/components/user-app-secret.vue` — complex credential dialog and viewport constraint (`src/views/user/components/user-app-secret.vue:1-81`, `src/views/user/components/user-app-secret.vue:129-139`).
- `src/composables/useUserLogin.ts` — Naive rule/message coupling in business flow (`src/composables/useUserLogin.ts:5-16`, `src/composables/useUserLogin.ts:24-27`).
- `src/composables/useUserRegister.ts` — registration validation/message coupling (`src/composables/useUserRegister.ts:4-12`, `src/composables/useUserRegister.ts:21-45`).

### Official external source

- [Origin UI Vue website](https://www.originui-vue.com/) — official category/variant inventory and copy-paste positioning.
- [Origin UI Vue repository](https://github.com/misbahansori/originui-vue) — official README, source, registry manifests, and license.
- [Official package metadata](https://raw.githubusercontent.com/misbahansori/originui-vue/main/package.json) — current documentation-site versions and complete dependency inventory.
- [Official registry manifest](https://raw.githubusercontent.com/misbahansori/originui-vue/main/registry.json) — base UI and example item definitions.
- [Official Extended registry manifest](https://raw.githubusercontent.com/misbahansori/originui-vue/main/registry-extended.json) — Extended item categories and source files.
- [Official Origin Tailwind CSS](https://raw.githubusercontent.com/misbahansori/originui-vue/main/app/assets/css/tailwind.css) — canonical imports and semantic token values.
- [shadcn-vue Vite installation](https://www.shadcn-vue.com/docs/installation/vite) — supported consumer setup.
- [shadcn-vue introduction](https://www.shadcn-vue.com/docs/introduction) — open-code/source-owned model.
- [shadcn-vue theming](https://www.shadcn-vue.com/docs/theming) — semantic CSS-token conventions.
- [Reka UI accessibility](https://reka-ui.com/docs/overview/accessibility) — primitive accessibility guarantees and caller responsibilities.

## Related Specs

- `.trellis/spec/frontend/index.md` — identifies this as the single-package Vue 3 + TypeScript frontend and currently names Naive UI as the primary UI library.
- `.trellis/spec/frontend/component-guidelines.md` — SFC structure, typed props/emits, current Naive form conventions, scoped styling, 768px responsiveness, dialog accessibility, and mobile `dvh` constraints. This spec will need a deliberate update after the migration establishes the replacement conventions.
- `.trellis/spec/frontend/directory-structure.md` — source/component/feature boundaries; generated UI primitives belong in an explicit app-wide UI layer, while Extended adaptations remain feature-local unless reused.
- `.trellis/spec/frontend/type-safety.md` — typed component contracts and current `FormInst`/`FormRules` rules; the replacement form contract must remain typed and must not rely on TypeScript as runtime validation.
- `.trellis/spec/frontend/quality-guidelines.md` — required `pnpm type-check`, `pnpm lint`, and `pnpm build`; no automated test framework exists, so focused visual/behavior/accessibility smoke tests are required.
- `.trellis/spec/guides/code-reuse-thinking-guide.md` — relevant when deciding which copied primitives and product composites deserve shared wrappers.
- `.trellis/spec/guides/cross-layer-thinking-guide.md` — relevant to preserving form/request/permission flows while replacing only the presentation layer.

## Caveats / Not Found

- Origin UI Vue has no single formal documentation page that defines a stable consumer API or semantic-versioned component release train. The official README, live registry JSON, source repository, and shadcn-vue's registry documentation are the authoritative integration evidence.
- The official repository's `package.json` describes the Nuxt documentation/registry application. Its dependency versions are useful compatibility evidence but are not a requirement to install every listed package into this Vite consumer.
- The gallery's “component” counts are visual examples/variants, not 579 independently maintained primitive APIs. The current registry includes 640 total entries because it mixes foundational UI items and numbered examples.
- Extended is explicitly outside the main library. Its examples are source scaffolds with placeholder content and must be adapted; they are not supported product modules.
- No current Origin registry item was found for a spinner, and no direct equivalents were found for Naive Layout, Flex, Descriptions, Thing, or Result. Semantic HTML/Tailwind and a small owned loading/status layer are required.
- The current application has no automated component/e2e/a11y test harness. Adding one would be a separate scope decision; the migration plan therefore needs explicit manual browser and keyboard checkpoints.
- This research did not edit product code, dependencies, specs, task PRD/design, or implementation manifests.

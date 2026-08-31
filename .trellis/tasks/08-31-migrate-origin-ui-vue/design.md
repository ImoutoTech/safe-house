# Technical design: migrate to Origin UI Vue

## Decision summary

Adopt Origin UI Vue as a source-owned local component system, not as a monolithic package dependency. Establish its Tailwind v4, CSS-variable, Reka UI and shadcn-vue conventions under `src/components/ui/`, then migrate complete user-facing surfaces in bounded batches. The final visual authority is Origin UI Vue's default zinc/neutral system; the previous Naive UI-derived appearance will not be reproduced.

The product's behavior, runtime content, Chinese copy, Safe House identity and permission rules remain authoritative. The old `DESIGN.md` is implementation evidence only and will be regenerated from the finished Origin-based interface.

Primary references:

- https://www.originui-vue.com/
- https://www.originui-vue.com/extended
- https://github.com/misbahansori/originui-vue

## Library model and consequences

Origin UI Vue describes itself as an MIT-licensed, unaffiliated Vue port and a copy-and-paste collection. Its official repository instructs consumers to own local component and utility source, uses shadcn conventions, supports Tailwind CSS v4, and builds interactive primitives on Reka UI.

Consequences:

1. There is no single `OriginUiPlugin` replacing Naive UI. The project owns copied/generated Vue files and their updates.
2. Dependencies are component-specific. Registry additions must be reviewed before installation and pinned in the lockfile.
3. Upstream changes do not arrive automatically; local provenance and update notes are required.
4. This model enables incremental migration because new local components can coexist with Naive UI until a complete surface is switched.

## Target boundaries

```text
src/
  components/
    ui/                  # Origin/shadcn-style primitives, source-owned
    patterns/            # Safe House compositions derived from Extended
      auth-panel.vue
      empty-state.vue
      credential-snippet.vue
      app-summary-card.vue
  composables/
    useFeedback.ts       # stable toast facade for business flows
  lib/
    utils.ts             # cn() and shared UI utilities
  assets/
    base.css             # Tailwind v4 import + Origin CSS variables/base layer
```

- `components/ui/` contains low-level primitives and should not know Safe House domain types.
- `components/patterns/` contains only app-wide reusable product compositions with typed props/emits, real Chinese content slots and no network calls. Route-specific compositions such as the authorization consent panel stay under their feature directory.
- Route views remain composition surfaces; API, session and request state stay in existing composables/stores.
- Application feature components may use `ui/` and `patterns/`; business composables must not import concrete visual components.

## Foundation stack

- Add Tailwind CSS v4 through its Vite integration and make `src/assets/base.css` the global token/base entry.
- Add the local `cn()` merge utility and only the supporting packages required by selected components.
- Use Reka UI-backed primitives for dialogs, alert dialogs, tabs, selects, tooltips, popovers, accordions, switches, radio groups and other keyboard-sensitive controls.
- Replace Ionicons with Lucide Vue icons when the selected Origin component uses them, keeping visible labels or `aria-label` for icon-only actions.
- Use the Origin default light variables as shipped. Keep dark variables available in the token file only if they are generated with the selected components; do not add a theme switch or claim dark-mode acceptance in this task.
- Remove Naive UI auto-imports and providers only after the final migrated surface no longer depends on them.

## Primitive mapping

| Naive UI responsibility | Target implementation |
|---|---|
| Button, input, textarea, checkbox, radio, switch | local Origin/shadcn primitives |
| Card, badge/tag, avatar, alert | local Origin primitives and thin product patterns |
| Modal/dialog, popconfirm | Reka-backed Dialog and AlertDialog; declarative ownership in the presenting component |
| Tabs, accordion, select, tooltip, popover | Reka-backed local primitives |
| Table, pagination | semantic table + Origin table/pagination styling |
| Flex/grid/layout/text | semantic HTML and Tailwind layout/type utilities, not wrapper-component replicas |
| Spin/loading/result/empty | Loader/Skeleton plus explicit loading, result and Extended empty-state compositions |
| Message service | `useFeedback` facade backed by the selected Origin-compatible toast primitive |
| FormInst/FormRules | project-owned `useFormValidation` adapter + Zod schemas, adapted at feature boundaries without changing API payload types |
| Dynamic tags | a small local tag-input composition using Input, Badge and keyboard-removable items |
| Descriptions/list/thing | semantic `dl`, lists and product patterns rather than one-to-one compatibility components |

No `NButton`-style compatibility facade will be created. A compatibility layer would preserve the old component API and encourage a visual-only skin instead of the requested redesign.

## Form and feedback contracts

### Forms

- Each form owns a typed validation schema and produces the existing API/composable parameter shape on valid submit.
- Route/feature state remains the source of truth; schemas validate at submit and blur according to the field's risk.
- Server errors remain separate from field errors unless the API identifies a specific field.
- Loading disables only actions that can duplicate or corrupt a request; explanatory content remains readable.

Implementation outcome: the login vertical slice confirmed that a second VeeValidate-owned form state would duplicate the existing reactive feature/composable state. The migration therefore selected the documented fallback: Zod schemas plus the project-owned typed `useFormValidation` adapter and `UiField` error contract. VeeValidate is intentionally not installed. This keeps one authoritative payload state while adding runtime validation at submit.

### Feedback and confirmation

- Toast success/error calls go through `useFeedback`, preventing a new vendor API from spreading through business composables.
- Confirmation is declarative: feature components own AlertDialog open state and invoke the composable action only after confirmation.
- Existing `useDialog()` calls inside deletion/secret composables move outward to the presenting component.
- One-time credentials use an explicit blocking dialog and a credential snippet pattern; closing requires a visible acknowledgement when the secret cannot be recovered.

## Scene composition plan

Origin UI Vue Extended currently offers seven categories. Four map directly to Safe House; the rest should not be forced into the product.

| Safe House surface | Extended reference | Planned change |
|---|---|---|
| Login, registration, email verification | Authentication (5 examples) | adopt the centered auth-panel hierarchy, visible title/help text, provider separator and full-width provider actions while preserving current Chinese copy and flows |
| No apps, identities, templates or keys | Empty State (4 examples) | replace generic empty placeholders with contextual next action, permission-aware action visibility and optional retry |
| Profile, child app and authorization client | Card (10 examples) | use card headers, status metadata and grouped actions; avoid turning the compact product into a generic analytics dashboard |
| Client secret, notification API key, OIDC code/guide | Snippet (3 examples) | use code/snippet presentation with copy feedback, reveal rules and one-time-secret warning |
| App visit count | Statistic Card (selective) | use only if it improves an app detail surface; do not introduce synthetic dashboard metrics |
| Contribution Graph, Mini Calendar | none | out of scope because they do not represent existing product data or tasks |

### Surface-specific composition

- Public/auth: one consistent auth shell for login/register/callback results; keep the runtime-configured home content distinct and lightweight.
- Account workspace: replace the single large Naive card with a responsive profile header and accessible route tabs. On narrow screens tabs may become horizontally scrollable; do not invent a permanent dashboard sidebar for four routes.
- Child applications: use a compact toolbar, card/list rows with visible status and callback URL, and an action menu on narrow widths. Empty state owns the create action when permitted.
- Authorization: make client identity and requested scopes the dominant content, place deny/continue together, and keep deny visually available without competing with the primary continuation action.
- Administration: replace the long accordion as the only information architecture with clear section headings/cards. Preserve permission-driven section omission and avoid presenting inaccessible sections as disabled decoration.

## Component/data flow map

- `App.vue`: backend initialization + route outlet + toast host only.
- `BaseLayout.vue`: semantic app header/main/footer and responsive frame.
- `AuthPanel`: presentation-only shell; auth pages pass fields/actions/provider controls.
- `AccountWorkspace`: user summary + navigation + route outlet; no API calls beyond existing user composable.
- `AppSummaryCard`: `AppInfo`-derived display props in, typed inspect/edit/delete/copy events out.
- `ConsentPanel`: client/scopes/user display props in, approve/deny events out.
- `CredentialSnippet`: secret text/status props in, copy/reveal/acknowledge events out.
- Existing composables keep request and domain behavior; only UI-service calls and Naive form types are removed.

## Migration and rollout

The working branch may temporarily contain both libraries, but a route is never left half Naive/half Origin. Each batch switches a complete surface and passes its focused regression before the next batch.

1. Foundation and login vertical slice.
2. Public/auth/callback surfaces.
3. Account shell, profile and external identities.
4. Child applications, credential handling and integration guide.
5. Administrative provider/notification settings.
6. Global loading/layout cutover, dependency removal, hardening and documentation.

Rollback is commit/batch based. Keep Naive resolver/providers until the last dependent route is removed; then delete all Naive configuration, dependency and `.n-*` styles in one cleanup checkpoint.

## Verification design

- Static scans: no `naive-ui`, `NaiveUiResolver`, `naive-ui/volar`, `<n-`, `useMessage`, `useDialog`, or `.n-*` remains after cleanup.
- Automated: type-check, lint and production build; restore a working TypeScript test command and update old source assertions to semantic/behavior assertions.
- Manual route matrix at desktop and mobile widths: anonymous, authenticated user, permission-limited user and administrator.
- Keyboard checks: full auth submit, route tabs, dialogs/alert dialogs, select/accordion controls, action menus, focus trap and focus return.
- State checks: initial loading, request loading, empty, recoverable error, success, destructive confirmation, permission absence and one-time-secret acknowledgement.
- Visual checks: one batched desktop/mobile capture after each surface batch, then a final cross-route consistency review.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Origin UI Vue is a community, source-copy port rather than a supported package | keep copied-source provenance, pin registry URLs/commit references, review generated diffs and own accessibility/regression tests |
| Component examples have heterogeneous optional dependencies | add components from a curated allowlist; inspect registry JSON before install; avoid importing the showcase app wholesale |
| Tailwind v4 may collide with current scoped SCSS/reset assumptions | introduce it in the login vertical slice, inspect base element changes, keep temporary scoped legacy styles until each surface migrates |
| Form migration changes validation timing or payloads | schema tests plus focused login/register/admin form regression; preserve existing domain payload types |
| Long dual-library period increases CSS/bundle complexity | migrate whole surfaces, keep a finite six-batch plan, and make Naive removal a hard acceptance gate |
| Default components could make the product feel generic | use Origin's default component language but retain product-specific information hierarchy, Chinese microcopy and security states; do not add fake dashboard content |

## Deferred items

- User-facing dark-mode switch and persistence.
- New analytics/dashboard data.
- Broad E2E infrastructure beyond the focused migration regression scope.
- Upstream synchronization automation for copied Origin components; provenance documentation is required now, automation can follow later.

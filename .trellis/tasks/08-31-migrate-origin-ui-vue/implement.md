# Implementation plan: migrate to Origin UI Vue

## Delivery strategy

Execute six independently reviewable batches on one migration task. A batch changes a coherent surface, runs focused verification and creates a rollback checkpoint before the next batch. Naive UI may remain installed during batches 1–5, but a migrated route must not mix visual systems inside the same form/dialog. Batch 6 removes the legacy stack only after a zero-usage scan.

## Pre-start gate

- [ ] User approves `prd.md`, `design.md` and this execution plan.
- [ ] Resolve the package-manager bootstrap/signature failure so pinned dependencies and verification commands can run safely; do not use an unexplained global ignore.
- [ ] Record the selected Origin registry URLs and an upstream commit/snapshot date.
- [x] Record the login-pilot outcome: VeeValidate would duplicate authoritative feature state, so use Zod with the project-owned typed `useFormValidation` adapter and `UiField` wrappers.
- [ ] Capture current desktop/mobile reference screenshots for each accessible route/state available in the local environment.
- [ ] Add or document a runnable command for the existing `.ts` Node tests before treating them as a gate.

## Batch 1 — UI foundation and vertical slice

### Build/tooling

- [ ] Add Tailwind CSS v4 and its Vite integration in an isolated change.
- [ ] Initialize a project-local `components.json` using New York style, neutral base, CSS variables, TypeScript and Lucide.
- [ ] Add `src/lib/utils.ts` and Origin's semantic variables/base layer to `src/assets/base.css`.
- [ ] Inspect Tailwind Preflight effects on all current routes before adding page-level utilities.

### Curated primitives

- [ ] Import and review only the primitives required by the whole migration: Button, Input, Label, Textarea, Card, Badge, Avatar, Alert, Separator, Checkbox, Radio Group, Switch, Tabs, Accordion, Select, Tooltip, Dialog, Alert Dialog, Sonner, Table, Pagination and Tags Input.
- [ ] Add a local loader/skeleton and result/empty-state foundation for gaps not covered by the registry.
- [ ] Record each copied registry URL and notable local deviation near the component layer documentation.

### App contracts

- [ ] Add the app toast host and `useFeedback` facade.
- [ ] Add a shared dialog-content shell with mobile-safe `dvh`, scroll body, stable footer and focus-return expectations.
- [ ] Define project-owned Field/Form error rendering and validate it in the login pilot.
- [ ] Migrate login completely using Extended Authentication 01; keep external providers, Enter submission, password autocomplete, errors, loading and return routing.

### Gate / rollback

- [ ] Verify login at desktop and narrow mobile width using keyboard only.
- [ ] Run type-check, lint, build and the restored test command.
- [ ] If Tailwind base styles cause broad uncontrolled regressions, roll back the Tailwind commit and reintroduce the base layer with scoped/excluded rules before continuing.

## Batch 2 — Public authentication and callbacks

- [ ] Migrate registration with Extended Authentication 02 and reuse the verification-state language from Authentication 03.
- [ ] Migrate the runtime-configured home page while keeping its copy/actions product-specific.
- [ ] Migrate external-login callback results, legacy callback login/consent and OIDC authorization surfaces.
- [ ] Add reusable `AuthPanel` and `ConsentPanel` only after repeated composition is proven.
- [ ] Move migrated flows from direct `useMessage` calls to `useFeedback`.
- [ ] Verify local and external auth, authorization continuation, callback outcomes, requested scope display and approve/deny hierarchy.

Rollback point: public/auth routes can revert as one group while foundation remains available.

## Batch 3 — Account workspace and identities

- [ ] Replace the Naive card/layout shell with semantic app frame, responsive profile header and Origin tabs.
- [ ] Migrate account facts using semantic `dl`, profile edit, email/password dialogs and logout.
- [ ] Migrate external identity rows and bind/unbind actions.
- [ ] Move imperative unbind confirmation into a controlled AlertDialog.
- [ ] Use permission-aware Extended empty states when no providers/actions are available.
- [ ] Verify route-tab keyboard navigation, avatar fallback, permission filtering, nested dialog focus return and mobile width.

Rollback point: account workspace route group, without reverting foundation/auth.

## Batch 4 — Child applications, credentials and integration guide

- [ ] Migrate search, pagination, app list/cards, status badges and action hierarchy as one surface.
- [ ] Migrate create/update application forms to the chosen validation contract.
- [ ] Migrate secrets, API keys and destructive operations using Dialog/AlertDialog/Switch/Tooltip patterns.
- [ ] Adapt Extended Snippet 35–38 for copyable secrets/integration code while preserving one-time visibility and acknowledgements.
- [ ] Migrate the OIDC guide tabs, copy/download toolbar and iframe with existing accessibility and `dvh` constraints.
- [ ] Rewrite old source assertions that require `n-button` or `.n-*` implementation details.
- [ ] Verify CRUD, search/pagination, permission directives, copy/reveal, key lifecycle, empty/error/loading states and narrow-screen dialogs.

Rollback point: application management and its dialogs together.

## Batch 5 — Administrative settings

- [ ] Recompose provider, SMTP, notification-template and application-policy sections using explicit headings/cards and selective accordions.
- [ ] Migrate all selects, multi-selects, switches, number fields, tag inputs, template lists and edit dialogs.
- [ ] Preserve section omission for accounts without permission and retry/error behavior per data source.
- [ ] Do not add Extended statistic cards unless real existing data benefits from that presentation.
- [ ] Verify every permission combination, validation path, save/retry flow and desktop/mobile layout.

Rollback point: administration route group.

## Batch 6 — Global cutover, cleanup and hardening

- [ ] Migrate `App.vue` backend-loading state and remove Naive providers.
- [ ] Finish semantic `BaseLayout`/`FlexCenterLayout` migration and verify full-height scrolling/header/footer behavior.
- [ ] Replace remaining direct messages/dialogs, type imports, tags and internal selectors.
- [ ] Remove Naive auto-imports/resolver, `naive-ui/volar`, generated declarations, `naive-ui`, unused `@vicons/ionicons5`, legacy vfonts and obsolete SCSS.
- [ ] Run zero-usage scans and inspect the lockfile for removed transitive dependencies.
- [ ] Update `.trellis/spec/frontend/` component/type/quality guidance and regenerate final `DESIGN.md` from the implemented visual system.
- [ ] Perform the bounded Impeccable finish flow: desktop/mobile screenshots, one defect batch, one confirmation batch, design review verdict and system documentation.

Rollback point: keep the pre-cleanup checkpoint so provider/config removal can revert independently if a missed dependency appears.

## Validation commands

Run after each batch where available; run the full set after Batch 6:

```sh
pnpm type-check
pnpm lint
pnpm build
```

Additional scans after final cleanup:

```sh
rg -n "naive-ui|NaiveUiResolver|naive-ui/volar|<n-|useMessage\(|useDialog\(|useNotification\(|useLoadingBar\(|\.n-" src vite.config.ts tsconfig*.json package.json
rg -n "@vicons/ionicons5|vfonts/" src package.json
```

Run the repository's restored test command after it is defined. Do not use raw `node --test tests/*.test.ts` as the current Node runtime rejects `.ts` before executing tests.

## Manual regression matrix

| Surface | Required states |
|---|---|
| Home/auth | runtime config missing/present, anonymous/logged-in, local/external login, validation and request error |
| Registration | validation, verification request, loading/error/success |
| Callback/authorization | every external callback outcome, client missing/error, logged in/out, approve/deny, unknown scope |
| Account | avatar image/fallback, user/admin/limited permissions, edit email/password/profile, logout |
| Identities | linked, available, none, bind, unbind cancel/confirm/error |
| Applications | loading, empty, search result, pagination, CRUD, limited permissions, credentials and guide |
| Administration | no section access, each individual permission, admin all-access, load/save/retry errors |

Every row is checked at desktop and narrow mobile widths; interactive rows also get keyboard/focus checks.

## Review gates

- Architecture review after Batch 1: copied-source boundary, form/feedback contracts, Tailwind impact and dependency versions.
- UX review after Batches 2 and 4: Origin default visual fidelity, Extended adaptation quality and preservation of product-specific security hierarchy.
- Accessibility review after Batches 3 and 5: tabs, dialogs, selects, accordions, error announcements and permission-aware actions.
- Final spec/zero-usage review before dependency removal is committed.

## Definition of done

- All PRD acceptance criteria pass.
- All routes share the Origin UI Vue default visual language without a Naive compatibility skin.
- No Naive runtime/config/type/CSS dependency remains.
- Copied Origin source and dependency provenance are documented.
- Final required commands pass in a resolved package-manager environment.
- Desktop/mobile/keyboard regression evidence and final design-review verdict are recorded.

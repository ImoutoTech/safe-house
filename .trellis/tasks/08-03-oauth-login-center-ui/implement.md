# Implementation Plan

## Dependency gate

- [ ] The backend task `/Users/reuszeng/Code/Projects/h/.trellis/tasks/08-03-oauth-login-center` has frozen and documented all frontend-facing contracts listed in `design.md`.
- [ ] A reachable isolated backend environment or deterministic mocks are available.
- [ ] Any post-freeze contract change is reflected in both task artifacts before code changes continue.

## Ordered checklist

1. Add shared transport/domain types and typed API factories for public providers, callback outcomes, identities, admin configuration, and interactions.
2. Add composables that own external login/callback, bind/unbind, provider administration, and approve/deny request state.
3. Extend routing with callback, identity-management, provider-admin, and OIDC-interaction routes; apply auth/permission metadata.
4. Retain password login/register and add enabled GitHub/Google actions with accessible loading/error states.
5. Add callback outcome UI including `binding_required`, missing verified email, disabled/misconfigured provider, cancellation, invalid/expired state, and interaction resume.
6. Add linked-identity account UI with confirmation and last-login-method error handling.
7. Add admin provider configuration UI with write-only secret behavior, masking, validation, enable rules, permissions, and responsive layout.
8. Replace the legacy authorization callback page with interaction UID lookup and explicit approve/deny.
9. Add focused tests if the selected test setup is approved/compatible; complete the browser verification matrix in all cases.
10. Run cross-repository end-to-end checks against the frozen backend and record the matching backend/frontend commits.

## Validation commands

```bash
pnpm type-check
pnpm lint
pnpm build
```

Inspect the lint diff because the command applies fixes. Also verify no sensitive values enter browser persistence or callback URLs.

## Risk and rollback points

- Auth store/router changes can block every login path; validate password login after each flow integration.
- Callback/interaction continuation mistakes can create redirect loops or open redirects; use backend-owned opaque transactions.
- Never couple a frontend commit to an unfrozen backend response shape.
- The frontend is not independently deployable; rollback must match the backend release.

## Acceptance checkpoint (2026-08-04)

- [x] Password login plus real GitHub and Google login entry/callback smoke tests passed.
- [x] Linked GitHub/Google identities render correctly for an authenticated user.
- [x] Administrator provider configuration renders masked secrets, enabled state, and blank-secret preservation semantics.
- [x] `pnpm type-check`, `pnpm lint`, and `pnpm build` pass with a clean worktree.
- [x] The legacy authorization API is absent and the OIDC interaction route is wired to the opaque interaction UID contract.
- [ ] Complete ordinary-user provider-admin denial, approve/deny, cancellation/expiry, and desktop/mobile browser cases.
- [ ] Record the matching backend/frontend commits after the isolated migration and complete relying-party OIDC flow pass.

## Pre-start checks

- [ ] PRD/design/implementation artifacts are approved.
- [ ] `implement.jsonl` and `check.jsonl` contain real repo-local context.
- [ ] Backend dependency gate is explicit and understood; implementation may prepare types/mocks but integration waits for the contract freeze.

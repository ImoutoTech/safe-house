# Technical Design

## Cross-repository contract

Authoritative backend task: `/Users/reuszeng/Code/Projects/h/.trellis/tasks/08-03-oauth-login-center`.

This task starts implementation only after the backend task freezes:

- public enabled-provider response;
- external login start and callback outcome contract;
- linked-identity list/bind/unbind contract;
- admin provider read/update/enable contract;
- OIDC interaction read/approve/deny contract;
- normalized error codes and authentication-session behavior.

Contract changes after frontend implementation starts must update both task designs and repeat integration checks.

## Frontend boundaries

- `src/api/`: typed Alova endpoint factories for provider, identity, admin, and interaction operations.
- `src/types/`: provider configuration, identity summary, callback outcome, and interaction transport types.
- `src/composables/`: external login/callback, identity management, provider configuration, and interaction flows.
- `src/stores/`: retain existing application session ownership; persist only the local `h` session/profile as today. Do not persist provider or OIDC transaction material.
- `src/router/`: callback, account identity, provider admin, and interaction routes with appropriate auth/permission metadata.
- `src/views/`: route composition and Naive UI presentation; feature-specific dialogs remain under the user/admin feature directories.

## Flows

### External login

The login page reads enabled providers and redirects to a backend start endpoint. The backend owns state/PKCE/nonce and provider callbacks. The frontend callback receives only a normalized, short-lived result or resumes a local session. `binding_required` redirects to password login while retaining only an opaque binding transaction ID.

### Binding

An authenticated user starts a provider bind through the backend. On callback, the page refreshes the linked identity list. Unbind is confirmed, submitted once, and preserves UI state when the backend rejects removal of the last login method.

### Provider administration

The admin page renders one card/form per supported provider. Client secret is a write-only field that is empty on every load. Saving an empty secret omits it from the update payload. Enable controls are disabled or return actionable feedback when required configuration is incomplete.

### OIDC interaction

The route receives only an opaque interaction UID, loads trusted display data from the backend, and submits approve/deny. Login redirects preserve the UID. Approval response follows the backend-provided continuation URL; the frontend never constructs a relying-party redirect from arbitrary query values.

## Security and UX

- No provider access token, client secret, OIDC authorization code, code verifier, nonce, or signing material is stored in Pinia/localStorage/sessionStorage.
- External continuation URLs are accepted only from same-origin backend contracts or navigated through backend-owned endpoints; avoid frontend open redirects.
- All callback states include explicit loading, expiry, cancellation, retry guidance, and terminal error handling.
- Admin routes require route permission and action-level `v-permission`; backend authorization remains authoritative.
- Forms use typed Naive UI validation and preserve the existing 768px responsive breakpoint.

## Validation and release

- Use Vue type checking and production build as mandatory gates.
- Add focused tests only after selecting the smallest compatible test setup; regardless, run a browser matrix for password login, GitHub, Google, collision/binding, unbinding, provider administration, consent approve/deny, callback refresh, expiry, and mobile layout.
- Release only with the corresponding checked backend commit. Roll back both repositories together if the cutover fails.

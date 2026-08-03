# OAuth / OIDC UI Contracts

## Scenario: Login-center UI changes

### 1. Scope / Trigger

Use this contract for external login/callback, identity binding, provider administration, OIDC interaction pages, authentication-store updates, or OAuth-related routes/API types.

### 2. Signatures

- Provider callback route: `/external/callback?result=<opaque>`.
- Exchange: `GET /external/result/:id` with credentials; the result is single-use.
- Identity APIs: `/external/identities/me`, `/external/identities/:provider/start`, `/external/identities/bind`, `/external/identities/:id`.
- Provider admin APIs: `/external/admin/providers` and `/external/admin/providers/:provider`.
- Interaction APIs: `GET|POST /oauth/interaction/:uid`; POST returns `{ continuationUrl }`.

### 3. Contracts

- API calls remain in `src/api`, flows in typed composables, cross-route local session in the user store, and views own presentation state.
- All API requests use credentials for the OIDC interaction cookie. Local `token`/`refresh` are updated only from normalized local-session outcomes.
- Never persist opaque callback result IDs, binding tokens, provider tokens, client secrets, code verifiers, nonce, or interaction UIDs beyond the active flow.
- Callback outcomes include `authenticated`, `bound`, `binding_required`, `verified_email_required`, `cancelled`, `state_invalid_or_expired`, `provider_disabled`, `provider_misconfigured`, and `provider_error`.
- Admin client secret is write-only: start blank, omit when unchanged, and clear component memory immediately after submit.
- Navigate to `continuationUrl` only after it is returned by the authenticated backend interaction completion; never construct a relying-party callback from route query data.

### 4. Validation & Error Matrix

- Missing/replayed result -> terminal expired-state UI with retry to login; no loop.
- `binding_required` -> keep only the active in-memory binding token, authenticate locally, exchange once, then clear it on success/failure/cancel.
- `bound` callback without tokens -> keep existing session and refresh user/identity display; binding-token `bound` with tokens -> rotate the local session.
- `//host`, absolute, or malformed `return_to` -> reject and use a safe local fallback.
- Provider config enable without Client ID/configured secret -> form error; request rejection -> visible message and retry state.
- Interaction failure -> keep approve/deny page usable for retry; expired UID -> terminal state.

### 5. Good/Base/Bad Cases

- Good: model callback responses as a discriminated union and exhaustively render each outcome.
- Base: empty provider/identity lists show explicit empty states and refresh actions.
- Bad: store provider material in Pinia/localStorage, trust query-provided redirects/client names, swallow rejected promises, or leave submitted secrets in reactive state.

### 6. Tests Required

- Type/build/lint for every change.
- Focused tests when a runner exists: result exchange/replay, discriminated outcomes, session rotation, return-path normalization, secret clearing, permissions, and interaction continuation.
- Browser matrix: password/GitHub/Google login, collision/binding/unbinding, approve/deny/cancel/expiry, admin/non-admin, cross-origin cookie behavior, 768px mobile layout, and keyboard/error accessibility.

### 7. Wrong vs Correct

#### Wrong

```typescript
localStorage.setItem('binding', route.query.token as string)
window.location.href = route.query.redirect_uri as string
```

#### Correct

```typescript
const outcome = await exchangeOpaqueResult(resultId)
if (outcome.outcome === 'binding_required') bindingToken.value = outcome.bindingToken
window.location.assign(await approveInteraction(uid))
```

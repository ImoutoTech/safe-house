# OAuth / OIDC UI Contracts

## Scenario: Login-center UI changes

### 1. Scope / Trigger

Use this contract for external login/callback, identity binding, provider administration, OIDC interaction pages, authentication-store updates, or OAuth-related routes/API types.

### 2. Signatures

- Provider callback route: `/external/callback?result=<opaque>`.
- Exchange: `GET /external/result/:id` with credentials; the result is single-use.
- Identity APIs: `/external/identities/me`, `/external/identities/:provider/start`, `/external/identities/bind`, `/external/identities/:id`.
- Provider admin APIs: `/external/admin/providers` and `/external/admin/providers/:provider`.
- Provider admin UI route: `/user/manage`, nested under the user-center layout.
- Interaction APIs: `GET|POST /oauth/interaction/:uid`; POST returns `{ continuationUrl }`.
- Interaction page route: `/authorize/interaction/:uid`; keep it outside the `/oauth` API proxy prefix.

### 3. Contracts

- API calls remain in `src/api`, flows in typed composables, cross-route local session in the user store, and views own presentation state.
- All API requests use credentials for the OIDC interaction cookie. Local `token`/`refresh` are updated only from normalized local-session outcomes.
- Never persist opaque callback result IDs, binding tokens, provider tokens, client secrets, code verifiers, nonce, or interaction UIDs beyond the active flow.
- Callback outcomes include `authenticated`, `bound`, `identity_not_bound`, legacy `binding_required`, `verified_email_required`, `cancelled`, `state_invalid_or_expired`, `provider_disabled`, `provider_misconfigured`, and `provider_error`.
- `identity_not_bound` contains no local session or binding token. Keep its guidance visible until the user chooses to return to local login; after login, binding must start again from the login-method settings page.
- Admin client secret is write-only: start blank, omit when unchanged, and clear component memory immediately after submit.
- The provider-management tab and `/user/manage` route share the existing access semantics: allow `UserRole.ADMIN` or users with `oauth-provider-admin`; hiding the tab never replaces route protection.
- Navigate to `continuationUrl` only after it is returned by the authenticated backend interaction completion; never construct a relying-party callback from route query data.

### 4. Validation & Error Matrix

- Missing/replayed result -> terminal expired-state UI with retry to login; no loop.
- `identity_not_bound` -> do not update tokens, user data, or in-memory binding state; explain that binding must be reauthorized from login-method settings after local login.
- `binding_required` -> keep only the active in-memory binding token, authenticate locally, exchange once, then clear it on success/failure/cancel.
- `bound` callback without tokens -> keep existing session and refresh user/identity display; binding-token `bound` with tokens -> rotate the local session.
- `//host`, absolute, or malformed `return_to` -> reject and use a safe local fallback.
- Provider config enable without Client ID/configured secret -> form error; request rejection -> visible message and retry state.
- Interaction failure -> keep approve/deny page usable for retry; expired UID -> terminal state.

### 5. Good/Base/Bad Cases

- Good: model callback responses as a discriminated union and exhaustively render each outcome.
- Good: clear any stale legacy binding token before rendering `identity_not_bound`, then wait for an explicit user action to return to local login.
- Base: empty provider/identity lists show explicit empty states and refresh actions.
- Bad: let an `identity_not_bound` callback reuse or preserve a binding token from an earlier callback attempt.
- Bad: store provider material in Pinia/localStorage, trust query-provided redirects/client names, swallow rejected promises, or leave submitted secrets in reactive state.

### 6. Tests Required

- Type/build/lint for every change.
- Focused tests when a runner exists: result exchange/replay, discriminated outcomes, session rotation, return-path normalization, secret clearing, permissions, and interaction continuation.
- Browser matrix: password/GitHub/Google login, collision/binding/unbinding, approve/deny/cancel/expiry, provider-admin permission/admin/non-admin tab and direct-route access, cross-origin cookie behavior, 768px mobile layout, and keyboard/error accessibility.

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

#### Wrong

```typescript
if (outcome.outcome === 'identity_not_bound') router.push('/login')
// A stale binding token can survive and be consumed by the next local login.
```

#### Correct

```typescript
if (outcome.outcome === 'identity_not_bound') {
  clearBindingToken()
  showUnboundGuidance()
}
```

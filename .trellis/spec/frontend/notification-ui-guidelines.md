# Notification Administration UI Contracts

## Scenario: Safe House 通知管理与 Key 管理

### 1. Scope / Trigger

修改 SMTP 配置、消息模板、应用通知策略或 Notification Key UI 时使用本节。该 UI 横跨权限、一次性 secret 和 H 的最小披露接口。

### 2. Signatures

- API module: `src/api/notification.ts`; transport types: `src/types/notification.ts`。
- Policy selector reads `GET /notification-admin/apps` and `GET /notification-admin/template-options`。
- Full template CRUD is requested only with `notification-template-admin`。
- Owner Key lifecycle uses `/apps/:appId/notification-keys` and existing app-owner UI。

### 3. Contracts

- SMTP password is optional on update; empty/whitespace input is omitted and preserves the existing password.
- Channel projection must load successfully before save is enabled; a failed GET must never leave a blank saveable draft.
- Policy template options contain only `{id,key,name,enabled}`; policy-only admins must not fetch subject/text/html.
- Notification Key create response includes `value` once. Plaintext stays in local ephemeral state, is redacted from request-library response state immediately, and is cleared on close/app change/unmount.
- Full lists and policies use app/request identity guards so late responses cannot replace state for the newly selected app.

### 4. Validation & Error Matrix

| Condition | UI behavior |
|---|---|
| channel GET fails | show error/retry; disable save |
| blank SMTP password | omit field; preserve server secret |
| whitespace-only template name/subject/text | block submission |
| action in flight | disable conflicting create/update/toggle/delete actions |
| app changes before response | discard stale response |
| permission arrives asynchronously | load the newly authorized section |

### 5. Good / Base / Bad Cases

- Good: route view composes focused forms/lists; composables own requests, state guards and messages.
- Base: HTML is edited as source text; no preview is required.
- Bad: store password or Key plaintext in Pinia, localStorage/sessionStorage, URL state, or long-lived Alova response data.
- Bad: use `v-html` for administrator-authored email content.

### 6. Tests Required

- `vue-tsc`, non-mutating ESLint and production build must pass.
- Manual live verification covers permissions, empty/error/loading states, blank-password update and one-time Key clearing.
- Verify 768px/mobile layout, dialog footer visibility, keyboard navigation and screen-reader labels.
- Contract review must compare frontend endpoint shapes with H controllers/DTO projections.

### 7. Wrong vs Correct

Wrong:

```ts
const plaintext = createRequest.data; // retained by request cache
```

Correct:

```ts
const plaintext = response.value;
createRequest.data.value = undefined;
// clear plaintext again when dialog/app lifecycle ends
```

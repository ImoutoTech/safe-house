# 接入说明增加通知服务文档

## Goal

让子应用开发者在现有接入说明弹窗中，同时获得 H 登录接入和通知服务的可下载 HTML 文档。

## Confirmed Facts

- 入口位于「子应用」页面，当前打开 `oidc-integration-guide.vue`。
- 当前弹窗标题为「OIDC / SSO 接入说明」，通过 iframe 展示 `public/third-party-oidc-integration-guide.html`，并提供复制链接和下载 HTML。
- 通知外部 API 为 `POST /v1/notifications` 和 `GET /v1/notifications/:id`，使用 `Authorization: NotificationKey <value>`。
- 通知支持 SSO 用户和手动 Email 收件人、模板内容和受策略控制的直接内容、可选幂等键及状态查询。

## Requirements

- 弹窗标题改为「接入说明」，子应用页的按钮辅助文案与 tooltip 同步更新。
- 弹窗增加「登录接入」和「通知服务」两个 Tab，默认显示「登录接入」。
- 「登录接入」继续展示现有 OIDC HTML，不改变原文档内容。
- 新增独立的通知服务 HTML 页面，视觉风格与现有 OIDC 指南保持一致。
- 通知文档覆盖完整受控混合接入：Notification Key 签发与保管、SSO 用户与手动 Email 收件人、模板变量调用、策略允许时的直接内容、幂等键、状态查询、常见 HTTP 错误和安全注意事项。
- 文档提供 cURL 和 TypeScript/JavaScript 示例，示例基础 URL 为 `https://sf.imouto.tech`，密钥使用环境变量占位符。
- 复制链接和下载 HTML 始终针对当前 Tab 的文档，通知文档使用独立文件名。
- 通知文档不包含任何真实 Notification Key，示例仅使用占位值。

## Acceptance Criteria

- [ ] 打开子应用页的说明弹窗时，标题为「接入说明」且默认选中「登录接入」。
- [ ] 两个 Tab 可键盘操作并切换对应 HTML，iframe title 能正确表达当前文档。
- [ ] 切换 Tab 后，复制链接与下载按钮指向当前文档，下载文件名正确。
- [ ] 通知文档的 endpoint、Authorization header、recipient/content 结构、幂等与状态字段与 H 当前契约一致。
- [ ] 文档同时给出模板和直接内容示例，明确直接内容/手动收件人受应用策略限制，且不出现真实密钥。
- [ ] 通知文档在桌面和移动宽度下可读，代码块可横向滚动。
- [ ] `vue-tsc --build --force`、非修复 ESLint、Vite build 和 `git diff --check` 通过。

## Out of Scope

- 不修改 H 通知 API、数据库或权限模型。
- 不在文档中提供可执行的真实密钥。
- 不将静态 HTML 改造为 Vue 内嵌富文本。

# OAuth 登录中心前端

## Goal

在 `safe-house` 中交付 OAuth/OIDC 登录中心的完整用户界面，使用户可继续使用密码登录，也可使用 GitHub、Google 登录并管理身份绑定；管理员可安全配置外部提供方；子应用用户可完成标准 OIDC 授权确认。

## Dependency and Ownership

- 本任务依赖 `/Users/reuszeng/Code/Projects/h/.trellis/tasks/08-03-oauth-login-center` 提供并冻结后端 API、OIDC interaction 和错误状态契约。
- `h` 任务拥有协议实现、数据库、外部提供方回调、配置加密和最终跨仓库集成验收。
- 本任务只拥有 `safe-house` 前端代码、前端测试/构建验证及前端交互验收；不得在本任务中修改 `h` 产品代码。
- 本任务不能独立发布，必须与依赖的 `h` 版本在同一切换窗口上线。

## Confirmed Facts

- 项目为 Vue 3 + TypeScript + Vite + Naive UI，使用 Alova、Pinia 和 Vue Router。
- 当前已有邮箱密码登录/注册、用户资料、子应用管理和自定义 `/oauth/authorize` 授权页。
- 当前没有自动化测试框架；已有质量命令为 type-check、lint 和 build。

## Requirements

### R1 登录与回调

- 保留邮箱密码登录/注册，在登录页展示后端声明为启用的 GitHub、Google 登录入口。
- 外部登录开始、回调与临时状态均由后端负责；前端不得持久化 GitHub/Google token、授权码或 provider secret。
- 回调页处理成功、取消、state 过期/篡改、提供方禁用或配置错误、缺少已验证邮箱及 `binding_required` 等状态。
- 若外部登录发生在待完成的 OIDC interaction 中，登录完成后恢复该 interaction，而不是丢失原始子应用请求。

### R2 身份绑定

- 账号设置展示已绑定的 GitHub/Google 身份并提供绑定、解绑操作。
- 邮箱冲突时引导用户先使用现有本地凭据登录，再显式完成绑定，禁止呈现“已自动合并”的误导状态。
- 后端拒绝解绑最后一种登录方式时，页面显示明确错误且保持当前绑定状态。

### R3 Provider 管理

- 新增管理员专用配置页面，维护 GitHub/Google client ID、write-only client secret 和启停状态。
- secret 只显示“已配置”或掩码；空 secret 表示不修改，前端不得尝试读取或缓存明文。
- 页面具备路由和操作权限、表单校验、加载/错误/空状态及移动端布局。

### R4 OIDC interaction

- 用服务端 opaque interaction UID 加载可信客户端与 scope 展示数据，不直接相信 URL 中的 client 名称、redirect URI 或 scope。
- 每次授权都显示确认页面，允许批准或拒绝；完整保留 `state`、`nonce`、PKCE 等协议数据由后端 interaction 管理。
- 删除旧页面对自定义 `POST /oauth/authorize` 及 `access_token`-as-code 响应的依赖。

## Acceptance Criteria

- [ ] 密码登录/注册行为保持可用，启用的 GitHub/Google 登录入口和回调结果正确呈现。
- [ ] 浏览器存储、URL、日志和前端状态中不出现 provider access token、client secret 或 OIDC 签名材料。
- [ ] 用户可查看、绑定和解绑外部身份；邮箱冲突与最后登录方式保护均有正确交互。
- [ ] 管理员可查看配置状态、更新凭据及启停提供方，普通用户无法访问路由或执行操作。
- [ ] OIDC 页面通过 interaction UID 展示服务端数据，并能明确批准或拒绝；旧自定义 OAuth 契约不再被调用。
- [ ] 登录/绑定/consent 流程在回调刷新、取消、过期及错误状态下不会进入循环或丢失可恢复上下文。
- [ ] `pnpm type-check`、`pnpm lint`、`pnpm build` 通过，并完成桌面/移动端及跨仓库端到端检查矩阵。

## Out of Scope

- 后端 OAuth/OIDC 协议、数据库迁移、secret 加密和 provider token 交换实现。
- Refresh Token、offline access、长期 consent、MFA、SAML、LDAP 及 GitHub/Google 以外的提供方。
- 旧自定义 OAuth 接口兼容页面。

# Move provider management into user

## Goal

将外部登录提供商管理从独立的 `/admin/providers` 页面整合进现有用户中心，使具备管理资格的用户可通过用户中心的管理 Tab 访问 `/user/manage`，并避免无资格用户看到管理入口。

## Background

- 当前提供商管理页面是 `src/views/admin/ProviderAdminView.vue`，由 `src/router/index.ts` 中的独立 `/admin/providers` 路由承载。
- 当前独立路由使用 `oauth-provider-admin` 权限码保护；全局守卫会直接放行 `UserRole.ADMIN`，其他用户需要对应权限。
- 用户中心子路由集中定义于 `src/router/user-routes.ts`，`src/views/user/view-index.vue` 当前会将全部子路由无条件映射成 Tab。
- 现有测试 `tests/providerAdmin.test.ts` 明确断言旧路由和权限保护，迁移时需要同步调整。

## Requirements

- R1. 提供商管理内容应作为用户中心子页面呈现，地址为 `/user/manage`。
- R2. 用户中心应提供与该子页面对应的“管理”Tab。
- R3. “管理资格”沿用现有语义：`UserRole.ADMIN` 管理员角色，或拥有 `oauth-provider-admin` 权限的用户。
- R4. 无管理资格的用户不应看到“管理”Tab。
- R5. `/user/manage` 必须继续受到访问控制，不能仅依赖隐藏 Tab。
- R6. 旧 `/admin/providers` 路由应直接移除，不提供重定向或兼容入口。
- R7. 提供商列表、配置保存、加载、错误提示和重试能力保持不变。

## Acceptance Criteria

- [x] AC1. 访问 `/user/manage` 时，在用户中心布局内显示现有提供商管理界面。
- [x] AC2. 有管理资格的用户能看到管理 Tab，并可通过 Tab 导航到 `/user/manage`。
- [x] AC3. 无管理资格的用户看不到管理 Tab，直接访问 `/user/manage` 也会被拒绝并按现有守卫策略跳转。
- [x] AC4. `/admin/providers` 不再匹配原提供商管理页面，且不存在指向 `/user/manage` 的兼容重定向。
- [x] AC5. 原有提供商管理交互行为与权限保护测试继续覆盖迁移后的结构。

## Out of Scope

- 修改提供商管理 API 或后端权限模型。
- 重设计提供商配置卡片及其保存流程。
- 新增其他后台管理功能。

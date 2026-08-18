# 修复 OIDC 登录回归

## Goal

修复 OIDC 授权续接上线后出现的头像缺失和第三方登录 redirect_uri 校验失败回归。

## Requirements

- 授权页进入时刷新当前用户资料，使头像和名称使用服务端最新数据。
- OIDC 授权续接仅使用当前标签页的 sessionStorage，不再把续接路径作为第三方登录启动请求的 return_to 查询参数。
- 保持普通第三方登录、身份绑定和 OIDC 登录续接行为可用。

## Acceptance Criteria

- [ ] 已登录用户进入授权页时会加载并展示其头像；无头像时保留文字占位。
- [ ] 从 OIDC 登录页发起 Google/GitHub 登录时，前端启动请求不携带授权流程 return_to。
- [ ] 第三方登录成功后仍从 sessionStorage 恢复原授权流程。
- [ ] 针对性回归信号、类型检查、lint 和构建通过。

## Notes

- Keep `prd.md` focused on requirements, constraints, and acceptance criteria.
- Lightweight tasks can remain PRD-only.
- For complex tasks, add `design.md` for technical design and `implement.md` for execution planning before `task.py start`.

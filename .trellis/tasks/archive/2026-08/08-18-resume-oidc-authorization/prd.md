# 恢复 OIDC 授权流程并优化授权页

## Goal

未登录用户进入 OIDC 授权页时保留当前授权流程，完成登录后回到原授权请求，并优化授权确认页的信息层级与操作布局。

## Requirements

- 未登录访问授权交互路由时，暂存经过校验的站内回跳地址。
- 登录成功后优先恢复暂存的授权流程，并一次性清除暂存值。
- 不长期持久化 interaction UID，不信任外部或协议相对回跳地址。
- 授权页去掉外层卡片，依次展示用户头像、用户与应用的登录关系、权限表格，以及并排的“取消”“继续”按钮。
- 保留授权请求加载失败、重试和提交 loading 状态。

## Acceptance Criteria

- [ ] 未登录打开 `/authorize/interaction/:uid` 会进入登录页，登录成功后返回同一授权交互路由。
- [ ] 登录过程中即使查询参数丢失，当前标签页仍可恢复该授权流程。
- [ ] 暂存的回跳地址仅接受安全站内路径，消费后立即删除。
- [ ] 授权页无外层卡片，信息和按钮结构符合需求，并在窄屏可用。
- [ ] `pnpm type-check`、`pnpm lint`、`pnpm build` 通过。

## Notes

- Keep `prd.md` focused on requirements, constraints, and acceptance criteria.
- Lightweight tasks can remain PRD-only.
- For complex tasks, add `design.md` for technical design and `implement.md` for execution planning before `task.py start`.

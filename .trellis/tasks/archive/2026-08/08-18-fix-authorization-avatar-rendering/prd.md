# 修复授权页头像异步切换

## Goal

修复授权页异步加载用户资料后，头像 URL 已更新但仍停留在文字占位的渲染问题。

## Requirements

- 头像 URL 存在时只渲染图片头像，不向同一 `n-avatar` 传入默认文字插槽。
- 头像 URL 不存在时渲染独立的文字占位头像。
- 用户资料异步返回后，Vue 必须从占位分支切换到图片分支。

## Acceptance Criteria

- [ ] 初始无头像数据时展示用户名称首字占位。
- [ ] 接口返回头像 URL 后展示图片头像，无需刷新页面。
- [ ] 精准回归断言、类型检查、lint 和生产构建通过。

## Notes

- Keep `prd.md` focused on requirements, constraints, and acceptance criteria.
- Lightweight tasks can remain PRD-only.
- For complex tasks, add `design.md` for technical design and `implement.md` for execution planning before `task.py start`.

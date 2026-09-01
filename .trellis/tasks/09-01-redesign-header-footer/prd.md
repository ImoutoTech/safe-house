# 重设计顶栏与页脚

## Goal

把 Safe House 全局顶栏和页脚做成可辨认的居中身份门牌与作者栏。用户在任何页面都能认出这是哪座房子、点产品名回到入口，并在页脚看到版权、构建与署名。顶栏不承担导航或登录态，也不做成企业后台工具条。

## Background

- 全局 chrome 只在 `src/layout/BaseLayout.vue`，包裹首页、登录、注册、账号区、授权与回调页。
- 顶栏现状：居中渲染 `ENV.TITLE`（`VITE_APP_TITLE`），点击回 `/`。没有导航、没有登录态。
- 页脚现状：左侧版权年与 `ENV.COPYRIGHT.NAME`；右侧 `UiBadge` 显示 `ENV.BUILD.COMMIT@BRANCH`，以及 `Made with ❤️ by youranreus`（`sm` 以下隐藏）。
- 首页大标题来自远程配置 `config.title`，与顶栏 `ENV.TITLE` 不是同一数据源。
- 账号页自己有头像、昵称、账号导航和退出登录。顶栏不应重复这些。
- 视觉世界已成立：Origin New York neutral、数字门厅。仓库没有 logo 资产；最近一次 polish 已去掉装饰性钥匙 icon。

## Requirements

- R1. 顶栏只承担身份：居中展示可配置产品名，点击回到首页。不加入登录/注册、头像、会话菜单或全局导航。
- R2. 顶栏在桌面和移动端都可点、可聚焦；构图保持居中门牌，不做成左字标 + 右操作的后台条。
- R3. 页脚继续展示版权区间与版权名、作者署名。版权名不加重。构建 `commit@branch` 不单独成行，只在悬停/聚焦「Made with ❤️ by youranreus」时用 Origin tooltip（`comp-354` / `tooltip.json`）展示。页脚无顶部分割线；文案与账号工作区同宽居中（`mx-auto w-full max-w-4xl px-4 sm:px-6`）。
- R4. 产品名、版权名、版权年、构建信息继续读现有 `ENV`。作者署名保留现有文案，窄屏也必须可见。
- R5. 不引入虚构 logo、装饰性钥匙 icon、渐变、玻璃拟态或营销口号。沿用 Origin token 与系统字体。
- R6. 不改首页英雄区、账号页局部 header/tab、登录注册面板，以及 `FlexCenterLayout` 的任务居中结构。

## Acceptance Criteria

- [ ] 任意 `BaseLayout` 子路由都能看到居中产品名顶栏；点击产品名回到 `/`。
- [ ] 顶栏没有登录、注册、头像、退出或管理入口。
- [ ] 页脚可见版权与作者署名；版权名不加重。构建信息只在悬停/聚焦署名时以 tooltip 出现。
- [ ] 产品名、版权名、版权年、构建 commit/branch 仍来自环境变量。
- [ ] 视觉上不像企业后台顶栏：没有操作簇、面包屑，构建信息不是主导徽章。
- [ ] 首页、登录、账号页的既有内容与交互保持原样。
- [ ] `pnpm test`、`pnpm type-check`、`pnpm lint` 通过。

## Out of Scope

- 不新增全局导航或会话能力。
- 不替换整站视觉世界，不重写 `DESIGN.md` 的 Origin 门厅方向。
- 不重做首页英雄、账号页 header/tab、认证面板或授权页。
- 不发明品牌 logo，不把已去掉的钥匙 icon 加回顶栏。
- 不改后端、环境变量契约或版权/构建字段含义。

## Technical Notes

- 改动面以 `src/layout/BaseLayout.vue` 为主；不把 `useUserStore` 引入布局层。
- 这是轻量任务：无新数据契约、无跨层行为变化，不另写 `design.md` / `implement.md`。
- 实现时沿用现有 Origin token、焦点环和 `768px` 节奏；页脚署名在窄屏改为可见文本，而不是继续 `hidden sm:inline`。

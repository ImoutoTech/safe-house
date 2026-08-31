# 去除 AI Slop 与 UI 修复

## Goal

去掉首页和登录注册上多余的钥匙 icon，以及首页那句装饰性副标题；同时修好 Origin UI 迁移后留下的 toast 不可见、弹窗 focus 裁切、接入说明 iframe 留白，以及若干视觉噪音（分割线、卡片阴影、radio、通知渠道行高）。

## Confirmed Facts

- 钥匙 icon 在 `home-view.vue` 与 `auth-panel.vue`；首页副标题是「一把钥匙，安全进入属于你的应用与身份空间。」
- 登录/注册描述、密码 label「钥匙」、跳转文案由产品明确要求保留。
- `vue-sonner@2.0.9` 需要 `import 'vue-sonner/style.css'`，当前未导入，所以 toast 不显示。
- `UiDialog` 用 `grid` + `overflow-hidden` + 中间槽 `overflow-y-auto`，导致 iframe 吃不到剩余高度，并且裁掉 input 的 3px focus ring。
- 「默认发件人名称」与带 hint 的「SMTP 密码」同行，被 `items-stretch` 拉高。
- 子应用卡片走 `UiCard` 的默认 `shadow-sm`。
- 原生 radio 只出现在编辑子应用状态和编辑资料头像来源。

## Requirements

- R1. 去掉首页、登录注册表单的钥匙 icon；去掉首页副标题。不改任何「钥匙」文案。
- R2. 登录密码错误等 `useFeedback` 调用必须能看到 toast。
- R3. 接入说明弹窗去掉「在登录接入与通知服务指南之间切换。」；iframe 占标题和页脚之外的主要空间。
- R4. 创建/编辑子应用、编辑资料、更换邮箱、修改密码弹窗中，输入框 focus ring 水平方向不被截断。
- R5. 「默认发件人名称」字段高度与无 hint 的同列字段对齐，不再被同行 hint 拉高。
- R6. 子应用 item 卡片去掉阴影，不改全局 `UiCard` 默认阴影。
- R7. 去掉用户信息 header 底部分割线、子应用分页分割线、基本信息四宫格下方操作行分割线。保留四宫格内部格线和 tab 下划线。
- R8. 用 Origin UI Vue comp-164 的卡片式 radio 替换上述两处原生 radio。

## Acceptance Criteria

- [ ] 首页和登录注册不再渲染钥匙 icon；首页不再出现那句副标题；登录/注册钥匙文案保持原样。
- [ ] 登录失败时页面顶部可见 toast。
- [ ] 接入说明弹窗无多余切换说明文案；iframe 占主要可视区域。
- [ ] 所列表单弹窗中 input focus ring 完整可见。
- [ ] 通知渠道「默认发件人名称」不再明显高于相邻无 hint 字段。
- [ ] 子应用列表卡片无阴影。
- [ ] 三条指定分割线消失；四宫格内部格线和 tab 下划线仍在。
- [ ] 子应用状态和头像来源使用卡片式 radio。
- [ ] `pnpm test`、`pnpm type-check`、`pnpm lint` 通过。

## Out of Scope

- 不改任何「钥匙」文案（含登录/注册描述、字段 label、跳转、改密弹窗）。
- 不改 `UiCard` 默认阴影。
- 不拆四宫格内部格线。
- 不重做登录/首页视觉世界观。

---
name: Safe House
description: Origin New York neutral 视觉下的自托管身份数字门厅
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  border: "oklch(0.922 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"
typography:
  family: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
  body: "0.875rem"
  title: "1.25rem"
  display: "2.25rem"
rounded:
  base: "0.625rem"
  control: "calc(var(--radius) - 2px)"
  card: "calc(var(--radius) + 4px)"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
---

# Design System: Safe House

## Direction

Safe House 使用 Origin UI Vue 的 New York、neutral、CSS variables 默认语言。界面像一处安静、清晰的数字门厅：中性表面与精确边界让认证、授权和凭据操作成为视觉中心，中文“钥匙”“开门”等产品文案保留个人项目气质。旧 Naive UI 的绿色主题、紧小圆角和库内部样式不再是视觉依据。

这是操作型产品界面。设计优先级依次是安全后果可见、任务结构清楚、键盘与移动端可用、视觉一致。不要把管理页改造成指标仪表盘，也不要虚构统计数据。

## Foundations

- 主题 token 的唯一实现入口是 `src/assets/base.css`。组件使用 `background`、`foreground`、`primary`、`muted`、`border`、`ring`、`destructive` 等语义 token，不复制旧品牌色。
- 正文使用系统无衬线栈，代码、Client ID、scope 和凭据使用等宽字体。标题通过 500/600 字重、字号和间距建立层级。
- 基础圆角为 `0.625rem`；控件使用 `rounded-md`，卡片和对话框使用 `rounded-xl`。边框承担静态层级，阴影主要保留给卡片轻深度和真正的浮层。
- 主要节奏为 8、12、16、24px。认证面板最大宽度约 24rem；授权卡片约 30–34rem；账号工作区最大 56rem。

## Component ownership

- `src/components/ui/` 是项目自有的 Origin/shadcn 风格基础层。它只包含无业务知识的 typed primitives，并显式依赖 Tailwind、Reka UI、Lucide 或 vue-sonner。
- `src/components/patterns/` 保存跨功能复用的 Extended 同源组合，目前包括认证面板、空状态和凭据 snippet。
- 页面使用语义 HTML 与 Tailwind 组织布局，不创建 Flex、Grid、Descriptions、Result 等旧库兼容组件。
- 业务 composable 不导入具体组件。toast 统一通过 `useFeedback`；危险确认由呈现组件持有受控 `UiConfirmDialog` 状态。

## Forms

- `UiField` 提供可见标签、提示和 `role=alert` 错误。控件必须通过 `id/for` 关联，并在有错误时接收 `aria-invalid` 与 `aria-describedby`。
- 现有 feature/composable state 是表单唯一数据源。Zod 在提交边界执行运行时校验，普通对象 schema 复用 `useFormValidation`，不引入第二套表单状态。
- 发送验证码、复制、显示凭据等非提交按钮必须保持 `type=button`；提交按钮显式使用 `type=submit`。请求期间禁用会重复或破坏状态的操作，并显示 loading。

## Overlays and sensitive values

- `UiDialog` 基于 Reka UI，必须提供 title 和 description；主体独立滚动，最大高度先使用 `vh` fallback，再使用 `dvh`。页脚始终留在移动端可视区域内。
- `UiConfirmDialog` 用于删除、解绑和吊销。请求失败时保持确认框打开，成功后才关闭。
- 一次性 Client Secret 和 API Key 使用深色 `CredentialSnippet`，默认遮蔽，提供明确复制/显示动作。阻塞对话框只能通过“我已安全保存”关闭，关闭时立即清空本地明文。

## Scene patterns

- 认证：居中窄卡片、清楚标题/说明、全宽主动作、外部身份分隔区，来源于 Extended Authentication。
- 授权：客户端与当前用户在上，请求 scope 作为主要内容，拒绝和批准并列且后果直接表达。
- 账号与应用：资料摘要、可横向滚动的账号导航、紧凑应用卡片、权限感知的操作组和 Extended Empty State。
- 凭据与接入：Extended Snippet 的深色代码表面、一次性提示、复制反馈，以及 Reka Tabs 的键盘导航。
- 管理：按权限完全省略不可访问区块，以独立 section 组织 provider、SMTP、模板和应用策略；不以禁用装饰暴露无权功能。

## Interaction and accessibility

- 所有交互都有可见焦点环。图标按钮使用 `aria-label`，状态变化通过 alert/status/toast 或 `aria-live` 传达。
- 对话框、AlertDialog、Switch 和 Tabs 使用 Reka UI 语义与键盘行为。自定义导航使用原生 button/link 语义。
- 关键布局从窄屏开始，在 640/768px 附近增强。长 URL、凭据、页签和操作组必须换行、截断或横向滚动，不能撑破视口。
- 尊重 `prefers-reduced-motion`；加载状态仍保留可读文本，关闭旋转或过渡不能隐藏状态变化。

## Do / Don't

- Do：保留中文产品语言和真实权限/错误/空状态；让授权范围、客户端和敏感值比装饰更醒目。
- Do：显式导入本地 UI 组件，优先语义 token 和已有 variants。
- Don't：复刻 Naive UI 主题、添加 `.n-*` 兼容选择器、建立 `NButton` 一类 API 壳。
- Don't：混用第二套通用组件库、在业务 composable 中打开对话框、用 placeholder 代替表单标签。
- Don't：新增无真实数据的指标卡、装饰性渐变、玻璃拟态或与身份任务无关的插画。

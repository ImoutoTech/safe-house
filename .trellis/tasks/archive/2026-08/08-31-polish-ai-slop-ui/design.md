# Design: 去除 AI Slop 与 UI 修复

## Boundaries

- 视觉减法与组件修复集中在 `src/components/ui/`、`src/components/patterns/` 和受影响的 views。
- 不改 `useFeedback` 接口、不改业务 composable 的错误抛出路径。
- 新 radio 原语不引入 Safe House 领域类型。

## Toast

`vue-sonner@2.0.9` 把样式放在 `vue-sonner/style.css`。在 `src/main.ts` 导入该 CSS。`App.vue` 的 `<Toaster>` 补 Origin Sonner token（`--normal-bg` / `--normal-text` / `--normal-border`），`z` 高于 dialog 的 `z-50`。

## Dialog shell

`UiDialog` 从 `grid overflow-hidden` 改为 `flex flex-col`，保留 `max-h-[90vh]/dvh`。内容槽 `min-h-0 flex-1 overflow-y-auto p-0.5`，给 3px ring 留边。无可见 `description` 时用 `sr-only` 的 `DialogDescription`。

接入说明弹窗去掉装饰描述；`TabsRoot` / `TabsContent` 用 `flex-1 min-h-0 flex-col`，iframe `h-full w-full`。

## Radio cards

按现有 `Ui*` 约定新增：

- `ui-radio-group.vue` / `ui-radio-group-item.vue`：Reka 原语，写法对齐 `ui-switch.vue`。
- `ui-radio-cards.vue`：comp-164 卡片选项。`items: { value, label, disabled? }[]`，可选 `legend`，默认 `grid-cols-2`。

Reka RadioGroup 值按字符串走。`AppStatus` 是数字枚举，在卡片组件内做 string 往返，不改业务类型。

## Visual nits

- 通知渠道两列 grid 加 `items-start`。
- `user-app-item` 的 `UiCard` 传 `shadow-none`。
- 去掉 `view-index` header `border-b`、`user-app` footer `border-t`、`user-info` 操作行 `border-t`。

## Compatibility

无数据/API 变更。无迁移。回滚即还原这些 UI 文件。

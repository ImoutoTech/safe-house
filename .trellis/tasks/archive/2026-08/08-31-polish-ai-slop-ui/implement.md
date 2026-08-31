# Implement: 去除 AI Slop 与 UI 修复

## Checklist

1. 去掉 `home-view.vue` 钥匙 icon 与首页副标题；去掉 `auth-panel.vue` 钥匙 icon。不改正文案。
2. `main.ts` 导入 `vue-sonner/style.css`；`App.vue` Toaster 补 token 和更高 z-index。
3. 改 `ui-dialog.vue` 为 flex 壳 + ring padding + sr-only description fallback。
4. 改 `oidc-integration-guide.vue`：去描述文案，iframe 撑满。
5. `notification-channel-form.vue` 两列 grid 加 `items-start`。
6. `user-app-item.vue` 卡片 `shadow-none`。
7. 去掉三条指定分割线。
8. 新增 `UiRadioGroup` / `UiRadioGroupItem` / `UiRadioCards`，替换两处原生 radio。
9. 更新 `src/components/ui/README.md` 与 `tests/uiFoundation.test.ts`。
10. 跑 `pnpm test`、`pnpm type-check`、`pnpm lint`，浏览器核对 8 项。

## Validation

```sh
pnpm test
pnpm type-check
pnpm lint
```

浏览器：登录错误 toast；各表单弹窗 focus ring；接入说明 iframe 占满；通知渠道行高；子应用卡片无阴影；三条分割线消失；两处卡片 radio。

## Risky files

- `src/components/ui/ui-dialog.vue`：所有弹窗共用，改布局时必须同时满足普通表单和全屏接入说明。
- Radio 字符串往返：`AppStatus` 数字枚举不能被改成字符串提交。

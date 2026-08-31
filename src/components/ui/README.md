# Origin UI source ownership

This directory is the Safe House-owned UI layer based on Origin UI Vue's New York/neutral conventions.

- Audited registry items: `button.json`, `input.json`, `label.json`, `textarea.json`, `alert.json`, `avatar.json`, `badge.json`, `card.json`, `dialog.json`, `alert-dialog.json`, `switch.json`, `tabs.json`, `sonner.json`, `radio-group.json`, and `comp-164.json` under `https://www.originui-vue.com/r/`
- Upstream repository: `https://github.com/misbahansori/originui-vue`
- Snapshot reviewed: 2026-08-31
- Interaction primitives: Reka UI 2.x
- Styling: Tailwind CSS 4 with semantic CSS variables

The files are intentionally maintained in this repository. They keep Origin's semantic tokens, focus rings, radius, density, and open-code model, while consolidating repeated registry parts into a smaller project-owned API. Safe House domain types and network behavior must stay outside this directory.

Local deviations are deliberate: primitives use the `Ui*` filename/runtime prefix, repeated registry parts are consolidated, `UiButton` defaults to native `type="button"` for form safety, dialogs share the project's `vh`/`dvh` scroll shell, and loading/field helpers cover gaps in the upstream registry. Extended Authentication, Empty State, Card, and Snippet examples are adapted as product-owned compositions under `src/components/patterns/`; placeholder content and demo state are not copied.

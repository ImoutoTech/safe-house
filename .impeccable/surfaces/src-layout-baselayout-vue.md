---
version: 1
slug: "src-layout-baselayout-vue"
primary_target: "src/layout/BaseLayout.vue"
related_targets: []
---

# BaseLayout chrome

## Scope and visitor mode
Global header and footer of Safe House. Operate: recognize the house, return home, read authorship. Not a marketing nav and not an admin toolbar.

## Audience, job, constraints
- Audience: anyone on homepage, login, register, account, authorize, or callback.
- Job: show the configured product name as a centered foyer plaque that goes home; close the page with copyright, author line, and build.
- Constraints: ENV-sourced title/copyright/build; keep “Made with ❤️ by youranreus” on narrow screens; no session, nav, avatar, invented logo, or restored key icon.

## Direction
Centered document-flow plaque on the page field. No sticky full-bleed wordmark bar. Footer is a quiet colophon without a top hairline; copy sits in the same centered `max-w-4xl` well as the account workspace (`px-4 sm:px-6`). Copyright first, author visible, build in tooltip.

## Memorable moment
The name sits on the foyer field, not in a toolbar.

## Unresolved
None for this chrome pass.

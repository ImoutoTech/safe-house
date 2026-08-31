# Frontend Development Guidelines

These documents describe the current `safe-house` Vue 3 frontend. They are evidence-backed conventions for implementation and review, not a generic Vue style guide.

| Guide | Scope |
|---|---|
| [Directory Structure](./directory-structure.md) | Source boundaries, feature layout, and naming |
| [Component Guidelines](./component-guidelines.md) | Vue SFCs, typed component contracts, forms, and styling |
| [Composable Guidelines](./hook-guidelines.md) | Stateful flows, Alova request hooks, and reactive APIs |
| [State Management](./state-management.md) | Local state, Pinia, persistence, server state, and URL state |
| [Type Safety](./type-safety.md) | Domain/transport types and typed API/component boundaries |
| [Quality Guidelines](./quality-guidelines.md) | Validation commands, review checks, permissions, and accessibility |
| [OAuth / OIDC UI](./oauth-ui-guidelines.md) | Callback outcomes, session/binding state, Provider admin, interaction navigation, and browser checks |
| [Notification Administration UI](./notification-ui-guidelines.md) | SMTP/template/policy administration, owner Keys, least-privilege reads, and ephemeral secret handling |

The repository is a single-package Vue 3 + TypeScript application built with Vite. Its primary runtime libraries are the source-owned Origin UI layer (`src/components/ui/`), Tailwind CSS v4, Reka UI, Zod, Alova, Pinia, Vue Router, and VueUse.

When a local file disagrees with a broad guideline, inspect adjacent files and preserve the repeated project pattern. Record deliberate convention changes here when the codebase adopts them.

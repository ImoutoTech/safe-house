# Backend Dependency

- Authoritative task: `/Users/reuszeng/Code/Projects/h/.trellis/tasks/08-03-oauth-login-center`
- Authoritative design: `/Users/reuszeng/Code/Projects/h/.trellis/tasks/08-03-oauth-login-center/design.md`
- Dependency direction: this frontend consumes the backend API and OIDC interaction contracts.
- Release rule: both repositories ship in one cutover window; legacy OAuth compatibility is intentionally out of scope.
- Coordination rule: task status is repository-local. There is no native cross-repository parent/child link, so dependency completion and matching commit IDs must be recorded in both task artifacts/journals.

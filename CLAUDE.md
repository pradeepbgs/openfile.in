# Project instructions

## Git

- Before pushing any commit that changes app source (`apps/backend`, `apps/frontend`, `apps/mobile/app`, `apps/mobile/src`), bump the version in the root `package.json` first, as its own `chore: bump version to x.y.z` commit, then push. Don't push app source changes with a stale version.
- Dev tooling changes (build scripts, `eas.json`, CI config, lint/tooling config) don't require a version bump.

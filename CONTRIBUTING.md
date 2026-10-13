# Contributing to StudyFlow AI

## Branches

- `main`: release-ready code. Keep it stable.
- `develop`: integration branch for upcoming work.
- `feature/<short-topic>`: one focused feature or fix, branched from `develop` and merged back through a pull request. Examples: `feature/auth`, `feature/pdf-upload`.

Avoid direct feature commits to `main`. Merge `develop` into `main` when a release has been reviewed and verified.

## Commits

Use the form `<type>: <imperative summary>`, with a short English summary. Common types are `feat`, `fix`, `docs`, `refactor`, `test` and `chore`.

Examples:

- `feat: add study space creation`
- `fix: reject unsupported PDF files`
- `docs: describe local setup`

Keep each commit focused. Do not commit API keys, `.env.local`, uploaded study materials or generated build artifacts.

## Pull requests

Describe the user-visible change, how it was checked, and any database migration or environment variable changes. Review permissions and data isolation for features that read or write user content.

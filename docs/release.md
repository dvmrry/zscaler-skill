# Release Process

This repository uses Release Please to prepare semantic-versioned releases from
conventional commits on `main`.

## Version Source

- `VERSION` is the checked-in release version.
- `CHANGELOG.md` is updated by release PRs.
- `.release-please-manifest.json` records the last released version used by
  Release Please.

## Commit Conventions

Use conventional commit prefixes for changes that should affect release notes:

- `feat:` for user-visible additions.
- `fix:` for user-visible bug fixes.
- `docs:`, `chore:`, `test:`, or `ci:` for maintenance changes that usually do
  not bump the release by themselves.
- Use `!` or a `BREAKING CHANGE:` footer only for incompatible changes.

While the project is pre-1.0, breaking changes bump the minor version. Normal
features also move the minor version; fixes move the patch version.

## Release Flow

1. Merge normal PRs to `main`.
2. Release Please opens or updates a release PR when releasable commits exist.
3. Review the generated `VERSION` and `CHANGELOG.md` changes.
4. Merge the release PR.
5. Release Please creates the GitHub release and `vX.Y.Z` tag.

Do not hand-edit tags for ordinary releases. Use manual tags only for historical
backfills or repairs, and record that decision in the release PR or issue.

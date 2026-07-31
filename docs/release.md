# Release Process

This repository uses Release Please to prepare semantic-versioned release PRs
from conventional commits on `main`. After a release PR merges, Release Please
creates the matching tag and GitHub release. The separate `auto-tag.yml`
workflow is a manual repair path, not a second automatic publisher.

## Version Source

- `VERSION` is the checked-in release version.
- `CHANGELOG.md` is updated by release PRs.
- `.release-please-manifest.json` records the last released version used by
  Release Please.
- `pyproject.toml` mirrors the same version for workspace metadata.
- `uv.lock` mirrors the workspace package version generated from
  `pyproject.toml`.

`node scripts/check-release-state.mjs` fails when these five surfaces disagree
or when the repository already has a newer semantic-version tag.

## Commit Conventions

Use conventional commit prefixes for changes that should affect release notes:

- `feat:` for user-visible additions.
- `fix:` for user-visible bug fixes.
- `docs:` for documentation changes — these cut releases (v0.4.6 was cut by a
  docs commit; release-please-config.json marks `docs` as a visible section).
- `chore:`, `test:`, or `ci:` for maintenance changes that do not bump the
  release by themselves.
- Use `!` or a `BREAKING CHANGE:` footer only for incompatible changes.

While the project is pre-1.0, breaking changes bump the minor version. Normal
features also move the minor version; fixes move the patch version.

## Retroactive Feature Markers

If a feature lands before Release Please is active or before the commit uses a
releasable prefix, add a small follow-up PR with the correct conventional
commit type and a `Release-As:` footer. Do not edit release tags by hand for
this case; let Release Please generate the release PR, changelog, and tag from
the marker.

Before releasing a batch, compare the latest version tag with `main` and verify
that every user-visible merge in the range is represented by a releasable
commit or a retroactive marker. Review the generated changelog against that
full compare range; commits omitted from Release Please's notes are still part
of the tagged repository state.

## Release Flow

1. Merge normal PRs to `main`.
2. Release Please opens or updates a release PR when releasable commits land on
   `main`. Use the manual `release-please.yml` dispatch only for recovery or an
   explicit refresh.
3. Review the generated `VERSION`, `CHANGELOG.md`, manifest,
   `pyproject.toml`, and `uv.lock` changes.
4. Merge the release PR after required checks pass.
5. The next Release Please run recognizes the merged release PR and publishes
   exactly `v<contents-of-VERSION>` plus the matching GitHub release.

Release PRs must still receive the normal hygiene check before merge. The
release PR check behavior depends on token configuration:

- With `RELEASE_PLEASE_TOKEN` set to a fine-grained PAT (see
  `release-please.yml`), the release PR triggers required checks normally.
- Without it, the bot-created PR uses the default `GITHUB_TOKEN`, which cannot
  trigger required checks on its own PRs. Admin-merge is the standing procedure
  in that case.

Normal pushes to `main` do not create releases unless they merge a Release
Please release PR. Do not hand-edit tags for ordinary releases. Use manual tags
only for historical backfills or repairs, and record that decision in the
release PR or issue.

## Release Repair

Use the manual `auto-tag.yml` workflow only after the Release Please run has
finished unsuccessfully or completed without publishing the expected release.
Dispatch it from `main`; it derives the commit that introduced the current
`VERSION`, verifies that commit is reachable from `main`, and then creates only
the missing tag or release. A matching existing tag/release is a no-op, while a
tag that points at a different commit is a hard failure.

Do not dispatch the repair while Release Please publication is still running.
Keeping one automatic publisher avoids tag-push and release-creation races.

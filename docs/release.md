# Release Process

A release is a pull request that adds its own notes. The notes are written and reviewed with the change, and the
merge publishes them as they were reviewed. zscalerctl releases the same way.

## Version source

- `VERSION` is the checked-in release version. `pyproject.toml` and the workspace package in `uv.lock` mirror it.
- `docs/releases/vX.Y.Z.md` holds one release's notes. The newest notes file is the current `VERSION`.
- `CHANGELOG.md` is the record up to v0.18.3, when Release Please generated it. Later releases have their notes in
  `docs/releases/` only.

`node scripts/check-release-state.mjs` fails when these disagree, or when the repository already has a newer
semantic-version tag.

## Which number changes

The project is pre-1.0. A change that breaks a contract bumps the minor version. Contracts are the record schemas
under `references/_meta/schema/`, the overlay layout, `kb.mjs` commands and their output, and public IDs that a
company record can name. So does a release that adds a body of knowledge or a workflow. Fixes and refreshes bump
the patch version.

## Releasing

A pull request either adds one notes file, `docs/releases/vX.Y.Z.md`, or carries the `no-release` label. The
`release-notes` check requires exactly one of the two. The file name is the version and must be the next patch,
minor or major after the latest tag. The file's contents are the release notes.

The same pull request bumps `VERSION`, `pyproject.toml` and `uv.lock` to that version.

Released notes are never edited. A change may delete old ones, since the published release keeps its notes.

Merging a pull request that adds a notes file releases that version. The `release` workflow:

1. checks that `VERSION` matches the notes file;
2. runs the release-state check;
3. tags the merge commit;
4. publishes the GitHub release with the file as its notes.

Tags are made only by that workflow. `scripts/release-version.sh` decides the version for both the pull-request
check and the release, so the merge publishes what review saw.

Renovate and the weekly knowledge-graph refresh open their pull requests with `no-release`. Their changes ship
in the next release that someone writes notes for.

## Writing the notes

Write the notes for someone who uses the skill, not someone who reviewed the diff:

- what they can now ask or do;
- what sources the knowledge base now covers;
- what they must change: overlay records, `overlay.json`, commands;
- what is known not to work.

Lead with the numbers that changed. Link to the docs that explain the details, with links pinned to the release
tag.

## Release repair

If the `release` workflow fails, fix the cause and re-run the failed run. The publish step makes the tag only if
it is missing, skips a tag that already points at the merge, and fails on a tag that points at any other commit.
It also fails when the GitHub release already exists.

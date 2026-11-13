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

## Which changes release

A pull request that changes anything the skill's users get releases a version, in that same pull request. That
covers the knowledge graph and its generated layers under `references/`, the agent workflows and adapters, `SKILL.md`,
`AGENTS.md`, the README and user docs, the scripts agents and overlay authors run, and the vendored sources. Only
a pull request that changes nothing shipped carries `no-release`: CI and repository config, tests, gates, the
refresh, capture, eval and release tooling, generators, and the maintainer docs.

`scripts/release-scope.mjs` holds the list of what does not ship. Every other path ships, so a new file releases
until it is added to that list. The `release-notes` check fails a `no-release` pull request that changes a shipped
file, and lists the files.

The refresh and dependency bots (the knowledge-graph refresh, Renovate, Dependabot) are the one exception. They
open their pull requests with `no-release` and cannot write notes, so their changes ship in the next release.

## Which number changes

The project is pre-1.0. A change that breaks a contract bumps the minor version. Contracts are the record schemas
under `references/_meta/schema/`, the overlay layout, `kb.mjs` commands and their output, and public IDs that a
company record can name. A change that adds a body of knowledge or a workflow also bumps the minor version.
Everything else that ships bumps the patch version: new or corrected claims, fixes, adapter wording and docs.

## Releasing

A pull request either adds one notes file, `docs/releases/vX.Y.Z.md`, or carries the `no-release` label. The file
name is the version and must be the next patch, minor or major after the latest tag. The file's contents are the
release notes.

The `release-notes` check fails a pull request that has neither or both. It is not a required check. The weekly
refresh opens its pull request with the workflow token, which starts no `pull_request` workflows, so a required
`release-notes` check would leave that pull request waiting forever.

The same pull request bumps `VERSION`, `pyproject.toml` and `uv.lock` to that version.

Released notes are never edited. A change may delete old ones, since the published release keeps its notes.

Merging a pull request that adds a notes file releases that version. The `release` workflow:

1. checks that `VERSION` matches the notes file;
2. runs the release-state check;
3. tags the merge commit;
4. publishes the GitHub release with the file as its notes.

Tags are made only by that workflow, except in the repair below. `scripts/release-version.sh` decides the version
for both the pull-request check and the release, so the merge publishes what review saw.

Renovate and the knowledge-graph refresh open their pull requests with `no-release`. Their changes ship
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

If the `release` workflow fails after its gate passed, fix the cause and re-run the run. A re-run finds a tag that
already points at the merge and reuses it. It fails on a tag that points at any other commit. It also fails when
the GitHub release already exists.

If the gate fails, the merged tree's version surfaces disagree, which the pull-request checks should have caught.
`release-version.sh` will not accept the same notes file again, so the version cannot be released automatically.
Fix the tree in a `no-release` pull request, then tag that commit and publish by hand:

```bash
git tag -a vX.Y.Z <commit> -m vX.Y.Z && git push origin vX.Y.Z
gh release create vX.Y.Z --title vX.Y.Z --notes-file docs/releases/vX.Y.Z.md
```

Record the manual release in that pull request.

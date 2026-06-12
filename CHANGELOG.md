# Changelog

All notable changes to this skill are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project versions
the skill as a whole, not any single script.

## [0.5.2](https://github.com/dvmrry/zscaler-skill/compare/v0.5.1...v0.5.2) (2026-06-12)


### Documentation

* **zpa:** SDK/Postman deep dive — verified schema facts + cross-source divergence reference ([#89](https://github.com/dvmrry/zscaler-skill/issues/89)) ([5bb34c7](https://github.com/dvmrry/zscaler-skill/commit/5bb34c71750887def557e4a9dd7e48cfd74908ba))

## [0.5.1](https://github.com/dvmrry/zscaler-skill/compare/v0.5.0...v0.5.1) (2026-06-12)


### Bug Fixes

* **ci:** enforce full test suite, unblock Renovate, release token plumbing, and v0.5.0 doc-drift sweep ([#86](https://github.com/dvmrry/zscaler-skill/issues/86)) ([c1a1432](https://github.com/dvmrry/zscaler-skill/commit/c1a1432dae4eaace51539f08184a78d83c25606b))

## [0.5.0](https://github.com/dvmrry/zscaler-skill/compare/v0.4.6...v0.5.0) (2026-06-10)


### Features

* **investigator:** compound helper commands — one button press per gated phase ([#84](https://github.com/dvmrry/zscaler-skill/issues/84)) ([1fcf758](https://github.com/dvmrry/zscaler-skill/commit/1fcf7587f07a48e1f57e1007c08ece52b14bc922))
* **investigator:** record-loads Step 2 gate, status doctor command, and forge-resistant gate errors ([#82](https://github.com/dvmrry/zscaler-skill/issues/82)) ([7cc4880](https://github.com/dvmrry/zscaler-skill/commit/7cc48808d662f7515dcf4b49d0425e9483c0a848))

## [0.4.6](https://github.com/dvmrry/zscaler-skill/compare/v0.4.5...v0.4.6) (2026-06-09)


### Documentation

* **cloud-connector:** note ZTW location profile-tag asymmetry vs ZIA ([#80](https://github.com/dvmrry/zscaler-skill/issues/80)) ([158ea10](https://github.com/dvmrry/zscaler-skill/commit/158ea10c285a5266d45bc455687542141e19e972))

## [0.4.5](https://github.com/dvmrry/zscaler-skill/compare/v0.4.4...v0.4.5) (2026-06-09)


### Bug Fixes

* **docs:** correct invalid [@import](https://github.com/import) position and lint CSS in CI ([#76](https://github.com/dvmrry/zscaler-skill/issues/76)) ([de00f93](https://github.com/dvmrry/zscaler-skill/commit/de00f93419aa2e02090a73ec6db85cbf2315a053))

## [0.4.4](https://github.com/dvmrry/zscaler-skill/compare/v0.4.3...v0.4.4) (2026-06-09)


### Bug Fixes

* **docs:** sanitize the source viewer and dedup the docs JS ([#68](https://github.com/dvmrry/zscaler-skill/issues/68)) ([6f44076](https://github.com/dvmrry/zscaler-skill/commit/6f44076c5b3d78e4d43eb06f08ecb3e24fd2c978))

## [0.4.3](https://github.com/dvmrry/zscaler-skill/compare/v0.4.2...v0.4.3) (2026-06-09)


### Bug Fixes

* **scripts:** harden and dedup Node workflow helpers ([#66](https://github.com/dvmrry/zscaler-skill/issues/66)) ([a933305](https://github.com/dvmrry/zscaler-skill/commit/a933305e42e3cbd25e76c98aa9d62dffb00cd848))

## [0.4.2](https://github.com/dvmrry/zscaler-skill/compare/v0.4.1...v0.4.2) (2026-06-08)


### Documentation

* rework README to be value-first ([#64](https://github.com/dvmrry/zscaler-skill/issues/64)) ([ac8d787](https://github.com/dvmrry/zscaler-skill/commit/ac8d787cdebe9461d64249719beeb5a85102d818))

## [0.4.1](https://github.com/dvmrry/zscaler-skill/compare/v0.4.0...v0.4.1) (2026-06-08)


### Bug Fixes

* **release:** make docs commits trigger a patch bump ([#62](https://github.com/dvmrry/zscaler-skill/issues/62)) ([c1a442f](https://github.com/dvmrry/zscaler-skill/commit/c1a442fdcaa45732622ace9e6d9e9bc6e5f892e6))

## [0.4.0](https://github.com/dvmrry/zscaler-skill/compare/v0.3.0...v0.4.0) (2026-06-02)


### Features

* **zcc:** track Terraform provider coverage ([#59](https://github.com/dvmrry/zscaler-skill/issues/59)) ([c2d7442](https://github.com/dvmrry/zscaler-skill/commit/c2d74424aafc3cc6b463515e3885fef8bb846ad4))

## [0.3.0](https://github.com/dvmrry/zscaler-skill/compare/v0.2.0...v0.3.0) (2026-05-31)


### Features

* **refs:** recognize AI Guard coverage ([#55](https://github.com/dvmrry/zscaler-skill/issues/55)) ([476e50e](https://github.com/dvmrry/zscaler-skill/commit/476e50eaef8d1c2ee4affffa9dbeb80daa58d88b))

## [0.2.0] — 2026-05-18

The `v0.2.0` tag is the release anchor for this entry. 0.2.0 is the
runtime-migration line: canonical workflow logic was centralized and the
runtime surfaces reduced to thin loaders.

### Added

- Canonical `agents/<role>/workflow.md` entrypoint for every role
  (investigator, architect, auditor, researcher, retro, SOC, setup, and the
  ad-hoc `@zscaler` Q&A path). Each `workflow.md` owns its `required-reads`
  bootstrap list, command name, and adapter-pointer checks.
- Deterministic investigator gate: `scripts/investigator-artifacts.mjs`
  (`open-case` / `verify-case`, status recomputed from inputs rather than
  trusted), a turn-transaction ledger (`begin-turn` / `complete-turn`,
  helper-owned ordering token), and `abandon-turn` recovery for a blocked
  mid-turn so a case cannot wedge across a halt.
- Per-role `harness.md` (architect, auditor, retro, SOC) and `grounding/`
  index cards, right-sized per role rather than copied from investigator.
- `/z-researcher` as a canonical role (normalized from a `.claude`-only
  command to `agents/researcher/`).
- `scripts/prepare-overlay-submission.mjs`: validates selected `_data`
  artifacts against an allowlist, scans for credentials, and prepares an
  overlay branch without pushing by default.
- `scripts/check-data-contract.mjs` and `scripts/setup-data-mount.mjs` for the
  `_data` runtime mount; data-contract and Node helper regression suites wired
  into CI.
- This `CHANGELOG.md` and a top-level `VERSION` file.

### Changed

- `.devin/workflows/*`, `.claude/commands/*`, `.agents/skills/*`, and the
  repo-root `zscaler` loader are now thin pointers at the canonical workflows;
  the ~600-line Windsurf investigator body was removed in favor of the
  canonical contract.
- `_data` is documented and treated as a replaceable runtime mount, not repo
  content; its public shape lives in `docs/data-contract/`.
- Validators (`check-agent-skills.py`, `check-workflow-metadata.mjs`) enforce
  dependency coverage through `agents/<role>/workflow.md` instead of duplicated
  wrapper text.
- Zscaler upstream vendor submodules updated through `bc56b11`.

### Renamed

- `/z-investigator-load` → `/z-investigator-resume` (case resume entrypoint).
- The legacy `/researcher` command alias collapsed to `/z-researcher`.

### Fixed

- Citation-inventory baseline reconciled to the post-submodule-bump source
  count for `references/zpa/app-segments.md` (the long-standing red was the
  inventory lagging a legitimate upstream change, not a coverage loss); the
  citation gate remains blocking.
- README now linked `CHANGELOG.md` while none existed — this entry resolves
  that dangling reference.

### Known limitations

- Cascade-runtime behavior is validated by deterministic repo checks and
  proxy/representative smoke runs, not by automated Cascade regression.
  Off-smoke-path interpretation divergence is an accepted, bounded residual.
- Several live-tenant scripts remain scaffolded until response shapes can be
  validated against real deployments. The release ships the deterministic
  helper and contract-checking spine; tenant API completion remains explicit
  follow-up work.
- `author-status` is an authoring lifecycle field. For trust decisions, use
  each reference's `confidence`, `source-tier`, `sources`, and
  `verified-against` metadata.

## [0.1.0] — baseline

Pre-changelog baseline. No changelog was kept before 0.2.0; this is a marker,
not a reconstructed history. 0.1.0 denotes the skill prior to the
runtime-migration line: the Zscaler knowledge references, the original
investigator/architect/auditor/SOC/retro roles, snapshot tooling, and the
Windsurf/Claude adapters as full-bodied wrappers. See git history before
commit `e0c2255` for detail.

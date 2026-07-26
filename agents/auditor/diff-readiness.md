---
role: auditor
artifact: methodology
title: "Auditor diff and release-readiness playbook"
content-type: reference
last-verified: "2026-07-26"
confidence: high
source-tier: practice
sources:
  - "https://github.com/dvmrry/zscaler-skill/pull/214"
  - ".github/workflows/check-hygiene.yml"
  - "scripts/check-fast.mjs"
  - "scripts/check-release-state.mjs"
  - "scripts/check-verified-against.py"
  - "scripts/check-reference-freshness.mjs"
dependencies:
  - "harness.md"
  - "methodology.md"
author-status: reviewed
---

# Auditor diff and release-readiness playbook

Use this playbook when the audit scope is a pull request, branch, commit,
working-tree change, patch, or release-readiness decision. It supplements the
reference-focused checks in [`prompt.md`](./prompt.md); it does not replace the
shared evidence and register discipline.

## Resolve the change set

Record the exact base and head before reviewing content:

- **Pull request:** use the PR base SHA and head SHA.
- **Branch:** use `merge-base(<base>, <head>)..<head>`.
- **Commit:** use `<commit>^..<commit>` unless the user specifies another base.
- **Working tree:** use `HEAD` as the base and include staged, unstaged, and
  untracked files.
- **Release readiness:** inspect both the proposed change and the repository
  state that will exist after merge.

Do not silently substitute an easier scope. If a base or head cannot be
resolved, record that limitation and stop making merge-readiness claims.

## Build a changed-surface map

Classify every changed file before selecting checks:

| Surface | Examples | Required focus |
|---|---|---|
| Workflows / releases | `.github/workflows/**`, `VERSION`, manifests, changelog | event/ref/commit identity, retries, permissions, tag/release state |
| Parsers / validators | `scripts/check-*`, schema readers, frontmatter loaders | alternate valid forms, invalid types, duplicate keys, boundary paths |
| Skills / routing | `agents/**`, `.agents/skills/**`, adapters, capability registry | canonical ownership, discovery, thin adapters, generated inventory drift |
| References / docs | `references/**`, `docs/**`, README/PLAN | citations, confidence, source boundary, links, stale claims |
| Runtime / MCP | MCP servers, artifact helpers, bridge harness | gate order, artifact truth, recovery, read-only/write annotations |
| Dependencies / generated state | lockfiles, submodules, generated manifests | synchronized surfaces, shallow/uninitialized behavior, regeneration |

Run the smallest check set that covers every changed surface. A passing generic
wrapper is not evidence that a newly added checker actually runs in CI; inspect
the workflow invocation and path triggers too.

## Mechanical gate selection

Always run or inspect:

- `git diff --check`
- the relevant focused tests for changed code
- the CI workflow or local wrapper that is supposed to invoke each new check

Add surface-specific gates:

- **Broad repository changes:** `node scripts/check-fast.mjs`
- **Release/version changes:** `node scripts/check-release-state.mjs`, full tag
  history, workflow YAML parsing, and changed-path trigger inspection
- **Provenance changes:** `./scripts/check-verified-against.py` with initialized
  submodules when object resolution is claimed, plus
  `node scripts/check-reference-freshness.mjs --base <base>` for independent
  working-tree checks of date/pin agreement and cited-root initialization
  (pass `--head <head>` for a committed range)
- **Portable skill changes:** `./scripts/check-agent-skills.py` and the skill
  quick validator
- **Reference/doc changes:** hygiene, citations, staleness, orphans, doc links,
  and source-quality checks as applicable
- **Python/JavaScript changes:** the repository's pinned Ruff/Biome commands and
  focused regression tests

Treat the configured outcome honestly. A check marked advisory or
`continue-on-error` is evidence of backlog, not automatically a merge blocker.
Conversely, a green test suite does not disprove an untested state transition.

## Adversarial failure-mode matrix

Pressure-test changed behavior across these dimensions:

| Dimension | Questions |
|---|---|
| Identity | Which event, ref, branch, commit, tag, remote, and release target is authoritative? Can they diverge? |
| Lifecycle | What happens on first run, retry, partial completion, duplicate delivery, cancellation, and concurrency? |
| Input shape | Are block/flow forms, indentation, nulls, arrays, wrong types, duplicate fields/keys, labels, and trailing data handled? |
| Repository state | What changes with staged/untracked files, merge commits, multi-commit pushes, shallow history, missing tags, and uninitialized submodules? |
| Boundary paths | Are descendants, symlinks, traversal, unknown roots, and exact-root requirements distinguished? |
| CI reachability | Do changed-path filters trigger? Does CI invoke the new check directly or only a local wrapper? Are required dependencies initialized first? |
| Permissions | Can a manual dispatch, token, fork, or arbitrary ref perform a write outside the intended authority boundary? |
| Closure | Does the proposed fix fail the original reproduction? Can a nearby variant still bypass it? |

### Release workflow scenarios

For tag or release automation, explicitly test or reason through:

1. The version changes in a normal merge/squash commit.
2. A push contains the version change plus later commits.
3. `main` advances before a manual recovery dispatch.
4. Manual dispatch is attempted from a feature branch or tag.
5. The tag exists and points at the wrong commit.
6. The tag exists at the correct commit but the GitHub release is missing.
7. The tag and release both already exist.
8. The release commit is not reachable from the protected/default branch.

### Parser and provenance scenarios

For YAML/frontmatter and provenance validators, include:

1. Block and flow mappings, including alternate indentation.
2. Missing, null, scalar, list, and wrong-type values.
3. Duplicate top-level fields and duplicate mapping keys.
4. Exact roots versus descendant files/directories and traversal paths.
5. Declared-but-uninitialized and initialized-but-shallow submodules.
6. Historical resolvable commits versus malformed or missing object IDs.
7. Tracked non-submodule source roots with an explicit contract.

## Finding shape for change review

Use stable IDs such as `AUD-DIFF-001`. Each actionable finding must state:

- the failure scenario;
- exact source (`file:line`, recorded check, or precise cross-file comparison);
- impact if merged;
- severity and status;
- the smallest safe remediation; and
- the verification or disproof condition.

Do not report style preferences in an adversarial diff review. Put test gaps
that are not demonstrated defects under **Residual risks / test gaps**.

## Remediation closure

For each prior finding:

1. Reproduce or restate the original failure condition.
2. Read the changed implementation and focused tests.
3. Attempt at least one adjacent bypass or counterexample.
4. Re-run the relevant mechanical check.
5. Update the same finding ID to `Resolved` only when the failure no longer
   holds; otherwise leave it `Open` with new evidence.

Prefer an independent reviewer for closure when available. Never declare a
change merge-ready while a Critical or High finding remains Open.

## Cross-links

- [`prompt.md`](./prompt.md) — main audit routing and reference checks
- [`harness.md`](./harness.md) — gate contract
- [`methodology.md`](./methodology.md) — finding schema, severity, and lifecycle
- [`workflow.md`](./workflow.md) — runtime and transport selection

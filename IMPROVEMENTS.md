# Improvements backlog

Open work items for the skill kit. Triage by impact + cost; promote items to **In progress** when active, then to **Resolved** / **Wontfix** / **Deferred** with a one-line note when status changes.

This is a planning document, not a verification register — for evidence-based open questions about Zscaler concepts, use [`references/_meta/clarifications.md`](references/_meta/clarifications.md).

## Format

Each item:

- **Title** — short, specific
- **Status** — Proposed / In progress / Resolved / Deferred / Wontfix
- **Origin** — date / commit / conversation that surfaced it
- **Impact** — what changes for users / authors / agents if we do this
- **Cost** — rough effort estimate (low / medium / high)
- **Notes** — context, related files, blockers, links

New items go to the top of **Proposed**. Status changes leave a dated note.

---

## In progress

### Submodule drift detection

- **Status**: In progress (initial script landed in commit-pending)
- **Origin**: 2026-04-30 — PR #4 (Renovate vendor submodule bump) surfaced no automated way to flag refs whose cited sources may have drifted
- **Impact**: refs with `verified-against` frontmatter get drift flagging on every submodule bump; HIGH priority when a cited file actually changed, LOW priority for unrelated submodule churn
- **Cost**: low (script + optional frontmatter field + CI integration)
- **Notes**: `scripts/check-vendor-drift.py`. Adoption is gradual — refs add `verified-against` at next verification cycle. CI is advisory until enough refs have the field; can promote to strict (`--strict`) once coverage is broad
- **Next step**: backfill `verified-against` on the `confidence: high` refs that cite vendor/ paths

### Help-article scrape freshness

- **Status**: In progress (initial script landed in commit-pending)
- **Origin**: 2026-04-30 — `vendor/zscaler-help/*.md` captures have timestamps but no automated check
- **Impact**: stale scrapes flagged as advisory; refs citing them inherit known staleness rather than silent inheritance
- **Cost**: low
- **Notes**: `scripts/check-scrape-freshness.py`. Default 90-day threshold. 8 scrapes have no `**Captured:**` marker — backfill or note as intentional
- **Next step**: backfill `**Captured:**` markers on the 8 unmarked scrapes

---

## Proposed

### Determinism beyond scripts — soft-to-hard pairings

- **Status**: Proposed (framing exercise; individual patterns can be promoted as separate items)
- **Origin**: 2026-04-30 — design discussion on "non-scripted but deterministic" agent guidelines
- **Impact**: names the design space between hard scripts and loose agent prompts. Gives a vocabulary for which improvements buy script-level determinism without writing a Python check per every rule.
- **Cost**: variable per pattern; the framing itself is free, individual implementations vary
- **Notes**: The principle: **every "soft" guideline can be paired with a "hard" check that gates or verifies it.** The kit has been moving in this direction without naming the pattern. Examples already in place: status enum (soft) ↔ enum-validation in `check-hygiene.py` (hard); confidence calibration rules (soft) ↔ frontmatter validator that checks high-confidence-with-empty-sources (hard); bundle templates with `verification:` field (soft) ↔ could be paired with script that validates the field cites a real ticket / lab session / vendor doc (hard, not yet built).

  Patterns we haven't yet exploited, ordered roughly by leverage:

  **Cross-agent (works under Claude Code, Windsurf, and future agents loading the skill kit):**

  - **Schema-validated structured output for registers** — discovery journal / audit register / recommendation register currently emit Markdown tables. Could ALSO emit a JSON/YAML sidecar matching a schema. Hybrid keeps human-readable Markdown while making the register machine-checkable. Lowest cost, highest leverage of the cross-agent set.
  - **Pre-flight checks that gate generation** — hygiene runs after edits land. A pre-flight rubric ("before writing, check N invariants against existing state") moves determinism earlier. Closer to a type-check than a test-run.
  - **Decision-tree DSL for bundles** — bundles are free Markdown today. A small YAML schema (`if: <cond>; then: <action>; else: <next>`) lets scripts validate every branch has a mapped action and every termination condition is covered. Natural next step after structured registers.
  - **Self-evaluation rubrics at end-of-step** — each playbook ends with "before declaring done, fill in this YAML checklist." The checklist is deterministic structure even when the answers are agent-generated.
  - **Tool-call-anchored claims** — every claim in a register must trace to a specific tool invocation (read / bash / web). Auditable; "the system can verify" rather than "the agent says it cited." Depends on the agent's tool model, but most agents expose read/bash/web in similar shapes.

  **Claude-specific (or hard cross-agent):**

  - **Subagent / multi-agent rubric review** — Claude's Agent tool is Claude-specific. Windsurf workflows can't invoke other workflows (per `windsurf-runtime-notes.md`). Producer-reviewer pairs work under CC; not portable. Could still be a CC-mode-only enhancement, but explicitly scoped.

  **Not a determinism pattern (don't pursue as one):**

  - **Memory-as-constraint** — initially listed here, then ruled out. Memory (CC auto-memory, Windsurf memory) is a soft continuity signal, not a deterministic constraint: compaction can summarize-away specific entries, cross-session reads are optional, and unlike every other soft guideline in this list there's no introspectable hard check ("did the agent actually read memory entry X?" isn't verifiable from outside the agent). Useful for carrying user preferences across sessions (the `feedback_*` and `project_*` memory types) but not for enforcing discipline in the kit itself. Mentioned here so we don't accidentally re-propose it.

  **Action triggers**: promote individual patterns to their own IMPROVEMENTS.md items when there's a real reason to build them. Don't speculatively build — the framing is the contribution; individual investments need their own justification.

### URL content drift detection

- **Status**: Proposed
- **Origin**: 2026-04-30 (gap analysis after PR #4)
- **Impact**: catch when a cited URL's content changes (not just 404s, which `check-citations.sh --check-urls` already handles)
- **Cost**: medium (needs hashing or diff infrastructure; bandwidth implications)
- **Notes**: alternative pattern — enforce that every URL citation is paired with a `vendor/zscaler-help/` capture, and validate via "URL → local capture" cross-link. Requires no fetch infrastructure.

### Per-source last-verified granularity

- **Status**: Proposed (likely deferred)
- **Origin**: 2026-04-30 (gap analysis)
- **Impact**: track which of a ref's sources got re-verified vs. which inherited the date
- **Cost**: medium (schema + audit-workflow change)
- **Notes**: defer until we have evidence of refs going stale on a subset of sources. Current single `last-verified` is a weak claim but adequate for most refs.

### External-doc heading / anchor drift

- **Status**: Proposed
- **Origin**: 2026-04-30 (gap analysis)
- **Impact**: extend anchor checking to cited vendor/ markdown files, not just in-repo files
- **Cost**: low (extend `check-hygiene.py` anchor-resolution logic)
- **Notes**: `check-hygiene.py` currently catches in-repo anchor rot via the `[text](path#anchor)` pattern. Extend to follow vendor/ paths and check anchors there.

### Postman / API-spec drift detection

- **Status**: Proposed
- **Origin**: 2026-04-30 (gap analysis)
- **Impact**: same submodule-drift approach but with JSON-aware diff that surfaces endpoint-level changes (renamed paths, changed schemas)
- **Cost**: medium-high (need JSON diff tooling)
- **Notes**: depends on how often the api-specs submodule actually changes. Until then, `check-vendor-drift.py` already flags whole-file touches.

### Eval coverage as a freshness signal

- **Status**: Proposed
- **Origin**: 2026-04-30 (gap analysis)
- **Impact**: warn when a `confidence: high` ref has no corresponding entry in `references/_meta/evals/evals.json`
- **Cost**: low (extend `check-hygiene.py`)
- **Notes**: soft warning, not error. Useful indicator that a high-confidence claim isn't actually exercised by eval coverage.

### Subtype-parameterize `/z-audit`

- **Status**: Proposed (deferred until subtype #2 exists)
- **Origin**: 2026-04-29 (during command rename discussion)
- **Impact**: turn `/z-audit` from "lint flavor" into a parameterized command (`/z-audit lint`, `/z-audit policy`, `/z-audit access`, etc.)
- **Cost**: low (rename existing playbook to `audit-lint-prompt.md`, add subtype routing in playbook body) — but the *real* cost is building the subtype playbooks, each of which is ~200 lines
- **Notes**: see `audit-prompt.md` future-subtypes section. Decision point: when adding subtype #2 (probably `policy`), choose between auto-detect-from-scope vs. explicit-subtype-arg

### Verified bundle library

- **Status**: Proposed (templates landed; bundles need real ground truth)
- **Origin**: 2026-04-29 (bundle template work)
- **Impact**: as real investigations / scaling reviews land, capture the verified query sequences as bundles
- **Cost**: variable (per-bundle effort, depends on verification access)
- **Notes**: templates at `references/shared/investigation-bundles.md` and `architect-bundles.md`. Public skill kit should ship only verified bundles; speculative ones stay in private fork. The first ones are most likely to come from real production tickets.

### SDK quirk note: `cloud_firewall_nw_service` `isNameL10nTag` deserialization

- **Status**: Proposed (low priority)
- **Origin**: 2026-04-30 — issue-watch digest #5; upstream `zscaler-sdk-python#492`
- **Impact**: small caveat in `zia/sdk.md` or `zia/api.md` noting that `cloud_firewall.list_network_services_lite()` returns `isNameL10nTag` as `None` per the closed-but-acknowledged SDK bug
- **Cost**: low (one-line note + verified-against bump)
- **Notes**: field itself is documented in `references/zia/api-schemas.md` (lines 114, 505, 1901, 1928). The SDK isn't reading it correctly. Worth a "known SDK quirk" note when a related ref is next touched.

### SSL inspection rule cloud-app enum mapping

- **Status**: Proposed (deferred — content gap, not a fix)
- **Origin**: 2026-04-30 — issue-watch digest #5; upstream `zscaler-mcp-server#56` (closed wontfix)
- **Impact**: documenting the divergence between cloud app catalog naming/IDs and SSL inspection rule enum strings (e.g., catalog "Sharepoint Online" id=655377 vs. SSL inspection enum `ONEDRIVE` / `ONEDRIVE_PERSONAL`)
- **Cost**: medium (needs source verification — what IS the canonical enum list?)
- **Notes**: gap in our SSL inspection coverage. Defer until a content cycle on SSL inspection rules; not blocking. The `wontfix` close on the upstream issue means the divergence is permanent and worth documenting precisely *because* it traps users.

### First verified bundle from production

- **Status**: Proposed
- **Origin**: 2026-04-30 — bundle templates landed; speculative content is explicitly excluded from public skill per the verification-gating rule
- **Impact**: validates that the bundle template format works against real evidence; produces the first canonical example others can pattern-match against
- **Cost**: variable — depends on the production scenario; capturing should be cheap (template is in place) but the underlying investigation/audit determines the work
- **Notes**: when the first real production investigation or audit happens (a `/z-investigate` or `/z-audit` cycle that runs against actual tenant data, not template-mode), capture it as the first verified bundle in `references/shared/investigation-bundles.md` (or `architect-bundles.md`). Use it to: (a) confirm the template's required fields are right, (b) confirm the verification-gating language works as a discipline, (c) seed the public bundle library with one canonical example. Do NOT manufacture speculative bundles to fill the template — that defeats the verification-gating principle the templates are built around.

### `simulate-policy.py` snapshot path uses old per-product convention

- **Status**: Proposed
- **Origin**: 2026-04-30 — flagged when documenting the per-cloud subdir convention in `_data/README.md`
- **Impact**: script hardcodes `_data/snapshot/zia/url-filtering-rules.json` (per-product top-level), but documented convention is `_data/snapshot/<cloud>/<product>/...` (per-cloud, since each tenant lives on a specific Zscaler cloud)
- **Cost**: low — accept cloud as arg or read from `ZSCALER_CLOUD` env (already an SDK convention, see `references/shared/oneapi.md`); update the path construction
- **Notes**: do this when `simulate-policy.py` is next touched; not blocking. May affect other snapshot-reading scripts similarly — sweep `scripts/*.py` for hardcoded `_data/snapshot/<product>/` patterns at the same time.

### Primer files: `confidence: high` with empty `sources` ✅ RESOLVED 2026-04-30

- **Status**: Resolved (hygiene exemption added)
- **Origin**: 2026-04-30 — surfaced during `_meta/` consolidation hygiene check; affected 5 files: `_meta/primer/zero-trust.md`, `networking-basics.md`, `identity-saml-oidc.md`, `proxy-vs-gateway-vs-tunnel.md`, `zscaler-platform-shape.md`
- **Resolution**: added the third option (hygiene exemption). The existing aggregator exemption checked for a `_`-prefixed direct parent dir; updated to check any `_`-prefixed ancestor under `references/`, which now correctly catches `_meta/primer/*` (one level deeper after the consolidation). Primers are educational synthesis of common knowledge — high confidence is about quality of synthesis, not external citation density. Documented in `references/_meta/README.md` § Conventions.

### Tenant-side bundle storage convention

- **Status**: Proposed
- **Origin**: 2026-04-29 (bundle template work)
- **Impact**: documented `_local-bundles/` directory pattern (gitignored) for users to keep tenant-specific bundles alongside the kit
- **Cost**: low (add to `.gitignore`, document in bundle template)
- **Notes**: minor housekeeping; do when first user adopts the bundle pattern

---

## Resolved

(none yet — items move here after fix lands and is verified)

---

## Deferred / Wontfix

(none yet)

---

## Cross-links

- [`references/_meta/clarifications.md`](references/_meta/clarifications.md) — evidence-based open questions about Zscaler concepts (separate from this planning doc)
- [`PLAN.md`](PLAN.md) — original kit-building plan
- [`SKILL.md`](SKILL.md) — skill-routing entry point
- `scripts/check-*.py` / `check-*.sh` — the hygiene check suite that some of these items extend

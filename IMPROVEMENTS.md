# Improvements backlog

Open work items for the skill kit. Triage by impact + cost; promote items to **In progress** when active, then to **Resolved** / **Wontfix** / **Deferred** with a one-line note when status changes.

This is a planning document, not a verification register — for evidence-based open questions about Zscaler concepts, use [`references/_clarifications.md`](references/_clarifications.md).

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
- **Impact**: warn when a `confidence: high` ref has no corresponding entry in `evals/evals.json`
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

- [`references/_clarifications.md`](references/_clarifications.md) — evidence-based open questions about Zscaler concepts (separate from this planning doc)
- [`PLAN.md`](PLAN.md) — original kit-building plan
- [`SKILL.md`](SKILL.md) — skill-routing entry point
- `scripts/check-*.py` / `check-*.sh` — the hygiene check suite that some of these items extend

# Improvements backlog

Open work items for the skill. Triage by impact + cost; promote items to **In progress** when active, then to **Resolved** / **Wontfix** / **Deferred** with a one-line note when status changes.

This is a planning document, not a verification register — for evidence-based open questions about Zscaler concepts, use the gaps in the knowledge graph.

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

(none)

---

## Proposed

### Test the decision-table-first authoring pattern on a Devin workflow

- **Status**: Proposed (experiment, not commitment)
- **Origin**: 2026-05-03 — observed in `vendor/zscaler-terraform-skills`. Their authoring rules optimize for **retrieval economics**: SKILL.md + on-demand reference subsection per query.
- **Impact**: Their loading pattern matches Devin workflows better than Claude Code commands. CC commands load once at invocation and stay in context for the whole session — retrieval-economics doesn't apply. Devin workflows load per-trigger, closer to retrieval-on-demand.
- **Cost**: low. Pick one Devin workflow (e.g., `.devin/workflows/z-investigator.md`), rewrite structurally per their pattern (decision tables before prose, ❌/✅ rules), observe whether the agent's behavior actually differs.
- **Notes**: speculative refactor — no observed failure mode forces it. Worth running once just as an experiment to see whether the pattern pays off in our agent's behavior. Don't sweep across all workflows preemptively.

### Internal-fork override pattern for `_data/cases/`

- **Status**: Proposed
- **Origin**: 2026-04-30 — when establishing the default-private posture for case artifacts. Public skill gitignores the per-case dirs; internal fork should override.
- **Impact**: lets the internal/production fork commit case artifacts for institutional memory (journals, timelines, postmortems become a queryable history) while the public skill stays private-by-default. Without the override, every internal-fork operator has to remember to `git add -f` per-case or maintain their own gitignore patches.
- **Cost**: low. Two plausible mechanisms:
  - Internal fork maintains its own `.gitignore` rules in `.git/info/exclude` (per-clone, not committed) — simplest but doesn't survive re-cloning
  - Internal fork commits an alternate `.gitignore.internal` and switches via `git config core.excludesfile` — survives cloning but adds setup ceremony
- **Notes**: the public-vs-private fork divergence is already a documented pattern in the skill (see `.gitignore` line 2: "The private internal fork overrides this to commit snapshot/, schemas/, and cases/ contents"). Cases inherit the same shape. When the internal fork actually goes through a real production case, that's the moment to formalize the override mechanism.

### Auto-fix agent for hygiene failures (Claude-specific)

- **Status**: Proposed (the dogfood endgame for closing the action loop on CI failures)
- **Origin**: 2026-04-30 — discussion of how to close the loop after the 10-consecutive-CI-failure incident. Pre-push hook + branch protection cover the "human-in-the-loop with safety net" case; this is the "skill maintains itself" extension.
- **Impact**: when hygiene fails (e.g., post-merge regression on main, or a hard-to-reproduce Renovate-driven drift), a workflow triggers a Claude Code session with the skill + the failure log loaded. The session runs `/z-investigator hygiene failure on <commit>` to diagnose, proposes fixes, opens a PR. Engineer reviews and merges. The skill's whole point — scaffolding agents to operate — gets dogfooded on the skill itself.
- **Cost**: medium-to-high. Needs a workflow that calls Claude (via the GitHub action — anthropic/claude-code-action or equivalent), passes the failure context, and lets the agent push to a fix branch. Plus playbook content to handle "self-maintenance" as a recognized workflow shape.
- **Notes**: Claude-specific by design (uses Agent tool, CC's slash command surface). Not a cross-agent pattern. Conceptually the right "endgame" for closing the action loop, but real cost — defer until the manual loop (pre-push + branch protection + status badge + occasional manual `/z-investigator` on failures) demonstrably becomes a bottleneck. Until then, manual is fine.

### Determinism beyond scripts — soft-to-hard pairings

- **Status**: Proposed (framing exercise; individual patterns can be promoted as separate items)
- **Origin**: 2026-04-30 — design discussion on "non-scripted but deterministic" agent guidelines
- **Impact**: names the design space between hard scripts and loose agent prompts. Gives a vocabulary for which improvements buy script-level determinism without writing a Python check per every rule.
- **Cost**: variable per pattern; the framing itself is free, individual implementations vary
- **Notes**: The principle: **every "soft" guideline can be paired with a "hard" check that gates or verifies it.** The skill has been moving in this direction without naming the pattern. Examples already in place: gap status and claim tiers (soft) ↔ schema validation and `kb-lint.mjs` (hard); "a Tier A claim states only what its evidence states" (soft) ↔ the lint that checks versions, numbers and names against the quoted evidence (hard); quoted evidence (soft) ↔ `check-citations.mjs` re-anchoring each quote in its capture (hard); diagnostics templates with a `verification:` field (soft) ↔ could be paired with a script that validates the field cites a real ticket / lab session / vendor doc (hard, not yet built).

  Patterns we haven't yet exploited, ordered roughly by leverage:

  **Cross-agent (works under Claude Code, Devin, and future agents loading the skill):**

  - **Schema-validated structured output for registers** — discovery journal / audit register / recommendation register currently emit Markdown tables. Could ALSO emit a JSON/YAML sidecar matching a schema. Hybrid keeps human-readable Markdown while making the register machine-checkable. Lowest cost, highest leverage of the cross-agent set.
  - **Pre-flight checks that gate generation** — hygiene runs after edits land. A pre-flight rubric ("before writing, check N invariants against existing state") moves determinism earlier. Closer to a type-check than a test-run.
  - **Decision-tree DSL for diagnostics** — diagnostics are free Markdown today. A small YAML schema (`if: <cond>; then: <action>; else: <next>`) lets scripts validate every branch has a mapped action and every termination condition is covered. Natural next step after structured registers.
  - **Self-evaluation rubrics at end-of-step** — each playbook ends with "before declaring done, fill in this YAML checklist." The checklist is deterministic structure even when the answers are agent-generated.
  - **Tool-call-anchored claims** — every claim in a register must trace to a specific tool invocation (read / bash / web). Auditable; "the system can verify" rather than "the agent says it cited." Depends on the agent's tool model, but most agents expose read/bash/web in similar shapes.

  **Claude-specific (or hard cross-agent):**

  - **Subagent / multi-agent rubric review** — Claude's Agent tool is Claude-specific. Devin workflows can't invoke other workflows (per `devin-runtime-notes.md`). Producer-reviewer pairs work under CC; not portable. Could still be a CC-mode-only enhancement, but explicitly scoped.

  **Not a determinism pattern (don't pursue as one):**

  - **Memory-as-constraint** — initially listed here, then ruled out. Memory (CC auto-memory, Devin memory) is a soft continuity signal, not a deterministic constraint: compaction can summarize-away specific entries, cross-session reads are optional, and unlike every other soft guideline in this list there's no introspectable hard check ("did the agent actually read memory entry X?" isn't verifiable from outside the agent). Useful for carrying user preferences across sessions (the `feedback_*` and `project_*` memory types) but not for enforcing discipline in the skill itself. Mentioned here so we don't accidentally re-propose it.

  **Action triggers**: promote individual patterns to their own IMPROVEMENTS.md items when there's a real reason to build them. Don't speculatively build — the framing is the contribution; individual investments need their own justification.

### Postman / API-spec drift detection

- **Status**: Proposed
- **Origin**: 2026-04-30 (gap analysis)
- **Impact**: same submodule-drift approach but with JSON-aware diff that surfaces endpoint-level changes (renamed paths, changed schemas)
- **Cost**: medium-high (need JSON diff tooling)
- **Notes**: depends on how often the api-specs submodule actually changes. Until then, `check-vendor-drift.py` already flags whole-file touches.


### Subtype-parameterize `/z-auditor` (lint subtypes only)

- **Status**: Proposed (most original subtypes moved to `/z-soc` instead)
- **Origin**: 2026-04-29 (command rename discussion); partially redirected 2026-04-30 when `/z-soc` was created and absorbed the posture-shaped subtypes; clarified 2026-05-01 — the **original intent** of `/z-auditor` was tenant-config lint (audit the tenant config (overlay IaC or live `zscalerctl`) for misconfig / drift / dead rules). The graph-lint role that shipped is a divergence from intent. The earlier "charter" rabbit hole was an attempt to fabricate meta-purpose around the wrong shipped scope instead of naming the gap.
- **Impact**: split `/z-auditor` into lint-shape subtypes — `/z-auditor refs` (current default — knowledge-graph lint) and `/z-auditor tenant-config` (the **originally-intended scope**: orphan segments, disabled rules without rationale, unused URL categories, dead refs in tenant config). The originally-planned posture / access / coverage / activity subtypes are now `/z-soc` subtypes, not audit.
- **Cost**: low to add `tenant-config` subtype playbook content (~100-150 lines) and parameterize the entry point. Auto-detect-from-scope or explicit-subtype-arg remains the design choice.
- **Notes**: see `agents/auditor/prompt.md` § Future subtypes for the partition between audit (lint-shape) and `/z-soc` (posture-shape). Audit's role is graph hygiene; `/z-soc` is defensibility. **Pre-alpha team-share**: the misalignment is documented but not fixed — team will hit this and the friction tells us whether a rename, a subtype split, or repurposing is the right call.

### Verified diagnostics library

- **Status**: Proposed (templates landed; diagnostics need real ground truth)
- **Origin**: 2026-04-29 (diagnostics template work)
- **Impact**: as real investigations / scaling reviews land, capture the verified query sequences as diagnostics
- **Cost**: variable (per-diagnostic effort, depends on verification access)
- **Notes**: templates at `agents/investigator/diagnostics/template.md` and `agents/architect/diagnostics/template.md`. Public skill should ship only verified diagnostics; speculative ones stay in private fork. The first ones are most likely to come from real production tickets.

### SSL inspection rule cloud-app enum mapping

- **Status**: Proposed (deferred — content gap, not a fix)
- **Origin**: 2026-04-30 — issue-watch digest #5; upstream `zscaler-mcp-server#56` (closed wontfix)
- **Impact**: documenting the divergence between cloud app catalog naming/IDs and SSL inspection rule enum strings (e.g., catalog "Sharepoint Online" id=655377 vs. SSL inspection enum `ONEDRIVE` / `ONEDRIVE_PERSONAL`)
- **Cost**: medium (needs source verification — what IS the canonical enum list?)
- **Notes**: gap in our SSL inspection coverage. Defer until a content cycle on SSL inspection rules; not blocking. The `wontfix` close on the upstream issue means the divergence is permanent and worth documenting precisely *because* it traps users.

### First verified diagnostic from production

- **Status**: Proposed
- **Origin**: 2026-04-30 — diagnostics templates landed; speculative content is explicitly excluded from public skill per the verification-gating rule
- **Impact**: validates that the diagnostics template format works against real evidence; produces the first canonical example others can pattern-match against
- **Cost**: variable — depends on the production scenario; capturing should be cheap (template is in place) but the underlying investigation/audit determines the work
- **Notes**: when the first real production investigation or audit happens (a `/z-investigator` or `/z-auditor` cycle that runs against actual tenant data, not template-mode), capture it as the first verified diagnostic under the relevant role's `diagnostics/` directory. Use it to: (a) confirm the template's required fields are right, (b) confirm the verification-gating language works as a discipline, (c) seed the public diagnostics library with one canonical example. Do NOT manufacture speculative diagnostics to fill the template — that defeats the verification-gating principle the templates are built around.

### `simulate-policy.py` snapshot path uses old per-product convention ✅ RESOLVED 2026-05-16

- **Status**: Resolved
- **Origin**: 2026-04-30 — flagged when documenting the per-cloud subdir convention now captured in `docs/data-contract/README.md`
- **Resolution**: `scripts/simulate-policy.py` now accepts `--cloud` (defaulting to `ZSCALER_CLOUD`) and `--snapshot-root`. It tries `_data/snapshot/<cloud>/zia/` first, auto-detects a single per-cloud/private overlay when unambiguous, and keeps legacy product-first snapshots as a read fallback. Text and JSON output include the selected snapshot path.
- **Validation**: syntax parse; `./scripts/simulate-policy.py --help`; legacy product-first fixture; explicit `--cloud` fixture; `ZSCALER_CLOUD` fixture; single-cloud auto-detect fixture; missing-snapshot error path.

### Primer files: `confidence: high` with empty `sources` ✅ RESOLVED 2026-04-30

- **Status**: Resolved (hygiene exemption added)
- **Origin**: 2026-04-30 — surfaced during `_meta/` consolidation hygiene check; affected 5 files: `_meta/primer/zero-trust.md`, `networking-basics.md`, `identity-saml-oidc.md`, `proxy-vs-gateway-vs-tunnel.md`, `zscaler-platform-shape.md`
- **Resolution**: added the third option (hygiene exemption). The existing aggregator exemption checked for a `_`-prefixed direct parent dir; updated to check any `_`-prefixed ancestor under `references/`, which now correctly catches `_meta/primer/*` (one level deeper after the consolidation). Primers are educational synthesis of common knowledge — high confidence is about quality of synthesis, not external citation density. Documented in `references/_meta/README.md` § Conventions.

### Tenant-side diagnostics storage convention

- **Status**: Proposed
- **Origin**: 2026-04-29 (diagnostics template work)
- **Impact**: document `_local-diagnostics/` directory pattern (gitignored) for users to keep tenant-specific diagnostics alongside the skill
- **Cost**: low (add to `.gitignore`, document in diagnostics template)
- **Notes**: minor housekeeping; do when first user adopts the diagnostics pattern

---

## Resolved

### Knowledge base moved from Markdown to a JSON graph ✅ RESOLVED 2026-10

- **Status**: Resolved (design: `docs/superpowers/specs/2026-10-17-kb-graph-model-design.md`; layout: `docs/kb-layout.md`)
- **Origin**: the Markdown reference docs carried frontmatter (`confidence`, `source-tier`, `author-status`, `last-verified`), coverage tiers T1-T5, a clarification ledger and a portfolio map, all kept honest by hand and by `check-hygiene.py`.
- **Resolution**: `references/` is now JSON subjects (claims with quoted evidence, gaps, divergences) read with `node scripts/kb.mjs resolve`. That finished or made moot these backlog items:
  - **Token-budget hygiene check** (per-file line counts of Markdown refs): moot; there are no long Markdown refs to cap.
  - **Per-claim citation discipline audit**: done by construction. A claim needs quoted evidence, `kb-lint.mjs` checks that a Tier A claim's versions, numbers and names appear in it, and `check-citations.mjs` re-anchors every quote in its capture. The `check-citation-density.py` report now covers only the Markdown that remains.
  - **Per-source last-verified granularity**: evidence is per claim and per source, and `references/_meta/verified.json` records per-source citation counts at the current pins.
  - **URL content drift detection**: help and issue captures are hashed in `references/_meta/capture-manifest.json`; `help_capture.py` and `issue_capture.py` re-check them and `kb-drift.mjs` reviews the result, including quotes that no longer anchor.
  - **Clarification ledger / frontmatter / coverage-tier maintenance**: clarification IDs resolve to gaps, confidence is derived from tier and evidence, and the portfolio is a product (`references/portfolio/`).

### SDK quirk note: `cloud_firewall_nw_service` `isNameL10nTag` deserialization ✅ RESOLVED 2026-05-05

- **Status**: Resolved (note added; upstream already fixed)
- **Origin**: 2026-04-30 — issue-watch digest #5; upstream `zscaler-sdk-python#492`
- **Resolution**: Added historical-quirk paragraph after the FirewallResourcesAPI table in `references/zia/sdk.md`. **Surprise finding**: upstream PR #493 already closed the issue in SDK release 1.9.22 (April 23, 2026) — the fix replaced `pydash.strings.camel_case` with the SDK's own `to_lower_camel_case` helper in `APIClient.form_response_body()` and was applied centrally, so it affects every OneAPI endpoint with camelCase keys having digit/letter boundaries (e.g. `isNameL10nTag`, `ipV6Enabled`). The note now scopes the bug to SDK versions older than 1.9.22 and points to upgrade as the remediation. `verified-against:` bump deferred — would require a real re-verification pass against `vendor/zscaler-sdk-python` 197867f, which is more than a one-line note's worth of work.

### ZDX + ZIdentity reference flesh-out ✅ RESOLVED 2026-05-05

- **Status**: Resolved
- **Origin**: 2026-05-04 — `plans/2026-05-04-whole-repo-review.md` flagged ZDX (7 refs) and ZIdentity (7 refs) as the two T1 products with thinnest reference coverage. Plan at `plans/2026-05-04-zdx-zidentity-fleshout.md`.
- **Resolution**: executed via per-task extract → z-writer → verify pipeline on branch `zdx-zidentity-fleshout`. 11 new citation-backed reference docs + index updates:
  - **ZDX** (6 new refs, count now 13): `score.md` (`282acc8`), `cloud-architecture.md` (`5cd62b0`), `applications.md` (`3179b61`), `devices.md` (`f0f2514`), `reports.md` (`80df83e`), `administration.md` (`59f4211`); `score.md` follow-up correction at `7dd5637`
  - **ZIdentity** (5 new refs, count now 12): `admin-rbac.md` (`c345082`), `users.md` (`90a30cf`), `groups.md` (`0a3ca6e`), `resource-servers.md` (`bb2c505`), `user-entitlements.md` (`03c9dd1`)
- **Outcomes**: ZDX coverage gaps closed for score model, cloud architecture, applications, devices, reports, and the misleadingly-named administration SDK (read-only filter helpers only). ZIdentity coverage gaps closed for admin RBAC (4 system roles + 25-module permission matrix), users CRUD (17 fields + IdP-source distinction), groups (dynamic vs static + group-as-policy-principal), resource servers (read-only OAuth registry), and user entitlements (read-only admin/service entitlement query API). Pipeline caught ~10 extraction errors in flight (line-number imprecision, false "no Go equivalent" claims, struct-field-vs-function-body confusions); each was fixed before commit. Hygiene clean across all 6 checks.
- **Followups (non-blocking)**: 11 new `confidence: high` refs added without eval coverage (warning count up by 11 as predicted in the plan); evals are out of scope for this work. Some open questions surfaced in individual refs (e.g., `Entitlement.scope` field semantics, dynamic-group dual-flag behavior, IdP-sourced user mutation rules) — captured in each ref's "Open questions" section for future verification.

### Portfolio-map + tier schema cleanup ✅ RESOLVED 2026-05-04

- **Status**: Resolved
- **Origin**: 2026-05-04 — `plans/2026-05-04-whole-repo-review.md` audit found drift between `references/_meta/portfolio-map.md` and the filesystem, plus a tier schema (T1/T2a/T2b/T3) that conflated structural axes (has-API) with coverage-depth axes (file count).
- **Resolution**: executed via the `superpowers:writing-plans` → `superpowers:subagent-driven-development` flow on branch `portfolio-map-tier-cleanup`. Six commits on top of `c94e19a`:
  - `f77c15a` — Consolidate `workflow-automation/` into `zwa/` (canonical SDK-named dir); marketing-name alias added
  - `48cc436` — Address minor doc-quality review notes from f77c15a
  - `9f043ea` — Consolidate `zero-trust-browser/` into `zbi/`; ZTB added to naming list
  - `ae861f9` — Enumerate 4 orphaned product dirs in Tier 2b (breach-predictor, business-insights, soc-workbench, zero-trust-branch)
  - `9a2a804` — Apply T1-T5 flat tier schema (T1: 6 / T2: 2 / T3: 15 / T4: 12 / T5: 0); AppProtection folded into ZPA T1 row; ZDX flagged T1 borderline per Task-1 verification gate
  - `5350629` — `SKILL.md` synced to new schema (description string + body routing block)
- **Outcomes**: schema is now flat T1-T5 (no alpha-suffix sub-tiers); two duplicate dirs eliminated (citation-discipline closed); 4 orphan dirs now enumerated; ZBI/ZWA demoted to T2; AppProtection no longer a separate T1 row; CASB and architectural pillars explicitly outside the tier system.
- **Followups (cosmetic, non-blocking)**: CASB block still sits visually inside Tier 3 (could move to dedicated section between T3/T4); Tier-1 marketing-aliases section's ZTB entry has no reverse pointer to the Zero Trust Branch product; SKILL.md description string lengthened (~+8 lines); a future sweep could check for stale "Tier 2a"/"Tier 2b" mentions in `references/`. Review synthesis at `plans/2026-05-04-whole-repo-review.md`.

### Submodule drift detection ✅ RESOLVED 2026-05-03

- **Status**: Resolved (script landed; high-confidence backfill complete)
- **Origin**: 2026-04-30 — PR #4 (Renovate vendor submodule bump) surfaced no automated way to flag refs whose cited sources may have drifted
- **Resolution**: `scripts/check-vendor-drift.py` shipped. Backfilled `verified-against:` (full 40-char SHAs) on 18 `confidence: high` refs that cite vendor/ paths. 23 ref+submodule pairs now verified-and-current. Medium/low-confidence refs (123 unverified pairs remaining) are out of scope for this item — adoption can continue at each ref's next real verification cycle.

### Help-article scrape freshness ✅ RESOLVED 2026-05-03

- **Status**: Resolved
- **Origin**: 2026-04-30 — `vendor/zscaler-help/*.md` captures have timestamps but no automated check
- **Resolution**: `scripts/check-scrape-freshness.py` shipped (90-day threshold, advisory). Backfilled canonical `**Captured:** YYYY-MM-DD` markers on the 8 unmarked scrapes (7 log-field scrapes were using a non-canonical `Fetched:` marker; postman-collection-note used `**Captured reference:**`). README files now excluded from the script. 310/310 scrapes within threshold.

### `source.html?p=...` validation gap ✅ RESOLVED 2026-05-03

- **Status**: Resolved
- **Origin**: 2026-04-30 — welcome hub had a stale `?p=_primer` link that broke silently after the `_meta/` consolidation
- **Resolution**: extended `check-doc-links.py` to parse `?p=<slug>` query strings on `source.html` hrefs and verify the slug resolves to `references/<slug>.md` or `references/<slug>/`. Smoke-tested by deliberately breaking a slug and confirming the script catches it. All 13 HTML files now pass.

### External-doc heading / anchor drift ✅ RESOLVED 2026-05-03

- **Status**: Resolved (no-op — already covered)
- **Origin**: 2026-04-30 (gap analysis)
- **Resolution**: investigated and confirmed the existing `check_anchors` in `check-hygiene.py` already resolves vendor/ paths via standard relative-path resolution. Verified by writing a test ref with a markdown link to a real vendor heading + a deliberately-broken vendor anchor; the broken anchor was caught. The IMPROVEMENTS notes had been stale on this — the work was already done.

### Eval coverage as a freshness signal ✅ RESOLVED 2026-05-03

- **Status**: Resolved
- **Origin**: 2026-04-30 (gap analysis)
- **Resolution**: added check 5 to `check-hygiene.py` — surfaces `confidence: high` non-aggregator refs not cited by any eval in `evals.json`. Default mode emits a single summary warning with sample paths; `--strict` mode emits per-file warnings. Current state: 13/87 high-confidence refs covered (74 uncovered). Authors decide which to address; the count is the actionable signal.

---

## Deferred / Wontfix

(none yet)

---

## Cross-links

- [`PLAN.md`](PLAN.md) — original skill-building plan
- [`SKILL.md`](SKILL.md) — skill-routing entry point
- `scripts/check-*` and `scripts/kb-*.mjs` — the check suite that some of these items extend
- [`docs/kb-layout.md`](docs/kb-layout.md) — the knowledge-graph layout

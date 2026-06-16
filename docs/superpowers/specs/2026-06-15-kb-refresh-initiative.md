# Comprehensive KB Refresh & Methodology Hardening

**Status:** charter (approved scope, pre-execution) · **Date:** 2026-06-15 · **Tracker:** Linear (team Dave) · **Origin:** "we may be due for a massive deep dive" — full-repo refresh after the vendor-MCP scrape (#123) showed how much fresh, provable vendor content was available.

## Mission

Bring the entire Zscaler knowledge base back into provable alignment with current vendor source. For every product area: confirm what we can **definitively answer from source**, **record what we can't** as a registered clarification, **correct** what's stale or wrong, **expand** thin coverage and add missing product areas — then harden and automate the methodology so this stays true with less manual effort.

This KB is only as good as the information in it. The deliverable is a measurably more accurate, more complete, better-sourced repo plus the tooling to keep it that way.

## Source-of-truth hierarchy (non-negotiable)

Rank evidence in this order; flag disagreements as `api-divergences` entries rather than silently picking one:

1. **SDK service layer** — `vendor/zscaler-sdk-python`, `vendor/zscaler-sdk-go` (hardcoded endpoints, field models, `request_format` serialization, validators). Most reliable.
2. **MCP server** — `vendor/zscaler-mcp-server` (tool signatures, `rules/*.mdc`, `skills/`, `CLAUDE.md` operator-observation notes). Strong, but MCP-tooling ≠ product behavior (see scope rule).
3. **Postman / API schema collections**, then **Terraform providers** (`terraform-provider-{zia,zpa,zcc,ztc}`) & **Ansible** (`{zia,zpa}cloud-ansible`), then **`vendor/zscaler-help`** captures (UI-level, usually stalest).

## Hard scope rule

Document **how Zscaler behaves** (product/API/SDK semantics, divergences, gotchas, limits). Do **not** document MCP-server build details (auth wiring, write-gate confirmation tokens, tool discovery/naming) or provider/packaging bugs as product behavior — log them in the run notes and skip. Every fact-claim carries an inline `vendor/path:NN` citation that **actually states it**, verified by opening the line (the off-by-N citation class is invisible to the linters).

## Approved scope decisions (2026-06-15)

- **Write scope: correct + expand + net-new.** Fix stale/wrong claims, expand thin coverage, and create missing product areas (the way EASM was missing). Full treatment.
- **Delivery: one PR per product area** (like #123 was for the scrape) — independently reviewable and mergeable.
- **Sequencing: save this charter + file Linear, then run Phase 0**, gate between phases, human-in-the-loop on the worklist before any writing.

## Phases (gate between each)

**Phase 0 — Inventory & freshness (read-only).** Fetch every vendor submodule → "what moved" table (pin vs upstream HEAD, commits behind, changed-path summary). Enumerate open vendor issues/PRs across the repos, each tagged with the product/behavior it touches. Map `references/<product>/` (doc count, `last-verified` age, `confidence`, presence of `sdk.md`/`api-divergences.md`, open `clarifications.md` IDs). Account for already-landed work (#123 scrape, merged to main) and any remaining in-flight branches (e.g., Codex's branch) so we don't double-cover. → **prioritized worklist.**

**Phase 1 — Triage & routing.** Classify each delta/issue as behavior-teaching (scrape target) vs tooling/packaging (log & skip). Per product, decide refresh / expand / net-new.

**Phase 2 — Extract → Write → Verify (per target).** The proven pipeline: extract citation-backed findings from source → write into the doc (inline `vendor:NN`, field/endpoint tables, SDK divergences, unbacked → `## Open questions`) → verify by opening every cited line. Definitively-answerable → body; not answerable → registered clarification with `Resolves with`.

**Phase 3 — Divergences & clarifications sweep.** Extend `api-divergences.md` to every multi-source product (beyond ZPA/ZIA). Reconcile `clarifications.md` (resolve now-answerable, register new, bidirectional cross-links). Fix structural consistency (`portfolio-map.md` tiers/counts, `platform-shape.md` primer tier-model drift, stale `last-verified`).

**Phase 4 — Cross-model adversarial review.** Independent reviewers (different models than wrote) verify citations against source + scope discipline — the Codex/Gemini/DeepSeek convergence pattern proven on #123.

**Phase 5 — Methodology hardening & automation.** Review the disciplines; automate what's deterministic (targets below).

## Agent strategy

| Task | Model | Why |
|---|---|---|
| Phase 0 inventory / submodule diffs / issue enumeration | GPT-5.4-Mini · Haiku | High-volume, mechanical, cheap; breadth not judgment |
| Phase 1 behavior-vs-tooling triage (first pass) | Haiku | Cheap classification; borderline → Sonnet |
| Phase 2 extraction (source → cited report) | Opus | Where the off-by-N class lives; fidelity paramount |
| Phase 2 writing (report → docs) | Opus | Citation-accurate authoring (z-writer is Opus) |
| Phase 2/4 verification (open cited line, confirm) | Sonnet + GPT-5.5 (≠ the writer) | Independence catches what a same-model check misses; diversity > redundancy |
| Phase 3 divergence synthesis | Opus | Cross-source reasoning |
| Phase 4 adversarial review panel | GPT-5.5 + Sonnet + Opus | Proven convergence; GPT-5.5 as the strong second opinion |
| Phase 5 methodology/architecture critique | Opus | Highest-judgment design |
| Weak-model gate/route stress tests | GPT-5.4-Mini | Proven for black-box tests |

Principle: cheap models for breadth/discovery, Opus for extraction/authoring/divergences, a *different* strong model (GPT-5.5/Sonnet) for independent verification, mixed panel for final review. **Never let the model that wrote a claim be the only one that verifies it.**

## Automation to build (Phase 5)

1. **One `full-gate` command** running the complete `check-hygiene.yml` set locally — including strict `check-citation-density --strict-sources` and `--compare-citation-inventory --strict-inventory` — so "green locally" ≡ "green in CI." (Green-while-red happened repeatedly because these weren't in the default loop.)
2. **Clarifications-sync check** — fail when a doc's `## Open questions` item isn't registered in `clarifications.md` (the linter only enforces resolved→doc today).
3. **Auto-regenerate `citation-inventory.json`** in the gate / pre-commit hook.
4. **Scheduled vendor-submodule freshness check** (Phase 0 scan on cron) — answers "are we due?" automatically.
5. **`last-verified` staleness linter** — flag docs whose cited vendor files moved upstream since the doc's `last-verified`.

## Acceptance criteria

- Full CI gate green; `clarifications.md` consistent with all docs; `citation-inventory.json` current.
- Every multi-source product has an `api-divergences.md`; stale `last-verified` refreshed or doc re-verified.
- Open vendor issues triaged with a behavior/tooling disposition recorded.
- Automation items 1–5 shipped; methodology docs updated to reference them.

## Non-goals

- Owning/executing vendor tooling, or documenting MCP-server internals as product behavior.
- Boiling the ocean in one branch — work lands per-product, gated, reviewable.

## Session-derived discipline (carry into every phase)

- Verify citations against source (off-by-N class); `check-hygiene gfm_anchor` collapses whitespace to a single hyphen; run the FULL gate; keep `clarifications.md` in sync; SDK-vs-API divergences are the highest-value class; cross-model review converges. (Detailed session context comes from the PR #123 vendor-MCP scrape and the ZPA SDK/Postman deep-dive — recorded in project memory, not tracked in this repo.)

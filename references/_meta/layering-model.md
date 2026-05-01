---
product: shared
topic: "layering-model"
title: "Layering model — general knowledge, tenant data, SME tribal knowledge"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "PLAN.md (architectural decisions)"
  - "README.md (fork-portability framing)"
author-status: reviewed
---

# Layering model — general knowledge, tenant data, SME tribal knowledge

The skill answers questions by combining three distinct **knowledge layers**. Each has a different source of authority, freshness pattern, and trust calibration. Mixing them without naming the layer leads to wrong answers. This doc codifies the layers so the skill (and the fine-tune that consumes it) handles them deliberately.

## The three layers

### Layer 1 — General Zscaler knowledge

**What it is:** how Zscaler products behave, defined by Zscaler. Universal across tenants.

**Where it lives:**
- `references/**/*.md` — every reasoning and reference doc.
- `vendor/zscaler-help/**/*.md`, `*.pdf` — captured help articles and refarch PDFs.
- `vendor/zscaler-sdk-{python,go}/` — SDK source.
- `vendor/terraform-provider-{zia,zpa,ztc}/` — TF provider schemas.
- `vendor/zscaler-api-specs/` — Postman collection.
- `references/_meta/primer/` — prerequisite networking + identity knowledge.

**Authority pattern:** sourced from Zscaler-published material. Confidence label per doc; source-tier indicates the type of source (`doc` / `code` / `mixed`).

**Examples:**
- "ZIA URL Filtering uses first-match-wins with Admin Rank as a structural gate."
- "ZPA's default behavior when no rule matches is to block."
- "OneAPI requires `audience=https://api.zscaler.com` on the token request."
- "ZCC Z-Tunnel 2.0 requires a single egress IP NAT or it silently falls back to 1.0."

**Update cadence:** quarterly cycle — Zscaler ships product updates, we re-capture / re-sweep / re-thread. `scripts/check-staleness.sh` flags docs that haven't been re-validated.

### Layer 2 — Tenant configuration data

**What it is:** how a specific tenant has Zscaler configured. Different per fork; never committed upstream.

**Where it lives:**
- `_data/snapshot/zia/*.json`, `_data/snapshot/zpa/*.json`, `_data/snapshot/zcc/*.json` — config dumps from the API.
- `_data/snapshot/_manifest.json` — timestamps and per-resource counts.
- (Future) per-tenant operational logs in `_data/logs/` (gitignored).

**Authority pattern:** sourced from real tenant API. Authoritative for "what does this tenant actually have configured." Stale within hours-to-days depending on tenant change rate.

**Examples:**
- "Rule 47 in this tenant's URL Filtering blocks Social Networking for the Engineering department."
- "This tenant has 3 ZPA App Connector groups, each with 2 connectors at version 22.146.1."
- "URL category `Custom_Engineering` includes the FQDNs `slack.company.example.com` and `confluence.company.example.com`."

**Update cadence:** per-fork. Run `scripts/snapshot-refresh.py` when needed; cron weekly is reasonable for stable tenants. Log queries are on-demand.

**Critical property:** **never committed to the public upstream.** Tenant data lives in private forks. The public repo's `_data/snapshot/` ships with `.gitkeep` only.

### Layer 3 — SME tribal knowledge

**What it is:** what your team knows that isn't in Zscaler docs and isn't in tenant config. Operator experience.

**Where it lives:** today, in your team's heads (and Slack history, support-ticket archives, runbooks, post-mortems). The skill doesn't capture this layer in a structured way **yet**.

**Authority pattern:** experiential. Tribally-validated but not Zscaler-blessed. May be wrong (the team's mental model might lag a Zscaler product change), and may be right where docs are silent or stale.

**Examples:**
- "When this tenant's GRE tunnel flaps, MTU misconfiguration is usually the cause — check 1476 vs 1500."
- "Zscaler Support typically takes 4-6 hours on P3 tickets in our region; escalate to TAM at hour 8 if no movement."
- "Our finance team's SaaS app has a quirky Cloud App Control behavior — bypass URL filter on this category to keep it stable."
- "We learned the hard way that Multimatch + AppProtection silently breaks; documented in our internal runbook from incident #2348."

**Update cadence:** continuous and informal. Post-mortems, support cases, on-call hand-offs.

**Where it goes to be useful:**
- **As clarifications**: if SME knowledge contradicts or extends doc content, file a `clarifications.md` entry. Tribal knowledge becomes citable claim-with-context.
- **As operator-confirmed answers**: when the skill answers a question and the SME validates ("we've seen exactly this; the answer above is right"), that's tribal-knowledge-validated content. Mark in the answer's confidence rationale.
- **As future fine-tune training data**: the goal of this skill is partly to externalize tribal knowledge so it survives team turnover. Capturing tribal knowledge as `references/` content over time is a deliberate transfer.

## How the skill should combine layers

When answering a question, the skill should combine layers explicitly:

```
Layer 1 (general)
   ↓
Layer 2 (tenant config) — applied IF _data/snapshot/ is populated
   ↓
Layer 3 (tribal knowledge) — applied IF the SME has weighed in
   ↓
Final answer with explicit confidence + source breakdown
```

Cited sources in the answer should attribute by layer:

```
## Sources
- references/zia/url-filtering.md § Rule precedence (Layer 1: general)
- _data/snapshot/zia/url-filtering-rules.json rule 47 (Layer 2: this tenant)
- SME-confirmed via @alice (Layer 3: tribal knowledge — incident #2348 runbook)
```

## When the skill has only some layers

| Scenario | Skill behavior |
|---|---|
| Layer 1 only (no snapshot, no SME input) | General answer with appropriate confidence. Note the limitation: "I can describe how this works in Zscaler generally; for your tenant specifically, populate `_data/snapshot/` and re-ask." |
| Layer 1 + Layer 2 | Combined answer. Distinguish "Zscaler does X" from "your tenant has Y configured." |
| Layer 1 + Layer 3 | Combined answer. Tribal knowledge typically refines or extends Layer 1. |
| Layer 2 + Layer 3 without Layer 1 | Rare — usually means a question that's purely tenant-specific. Still answer but note no general framing. |
| All three | Highest-confidence answer. Cite each layer. |

## Anti-patterns

- **Treating Layer 2 inferences as Layer 1 facts.** "This tenant doesn't have Multimatch enabled" is a Layer 2 fact. "Zscaler doesn't support Multimatch" is a Layer 1 falsehood derived from over-generalizing.
- **Treating Layer 3 as Layer 1.** "Our team has never seen X happen" is Layer 3 (absence of tribal evidence). "Zscaler doesn't do X" is a Layer 1 claim that requires Zscaler documentation. They're not the same.
- **Citing Layer 1 when Layer 2 is required.** "ZIA blocks Social Networking by default" is wrong as a Layer 1 claim. Default policy varies; your tenant's default is in `_data/snapshot/zia/url-filtering-rules.json`, not in the help docs.
- **Letting Layer 3 quietly override Layer 1.** If tribal knowledge contradicts Zscaler docs, that's a clarification ("Zscaler docs say X but our experience is Y") — file it in `clarifications.md` rather than just trusting the tribe.

## Where tenant-data layering will eventually intersect the skill

Currently Layer 2 is a known gap because the public skill ships an empty `_data/snapshot/`. When a fork populates real tenant data:

1. The skill should **read _data/snapshot/ first** for any tenant-specific question — `SKILL.md` already includes a "Check for a snapshot first" preamble.
2. Reasoning docs cite `_data/snapshot/<product>/<resource>.json` paths inline (we do this today as aspirational citations; they become real once the file populates).
3. **Schema docs** (`references/zia/snapshot-schema.md`, `references/zpa/snapshot-schema.md`, `references/zcc/snapshot-schema.md`, `references/zidentity/snapshot-schema.md`) are **written** (drafted from Postman collection + SDK + TF provider; confidence: medium). Validate and bump to `high` after a real fork-admin run produces tenant output. The resource-level reasoning docs now cross-link to them.

## Where SME knowledge will eventually intersect

Two paths in:

1. **Clarifications**: an SME sees a Layer 1 claim that's wrong or incomplete. File a `clarifications.md` entry naming the discrepancy. Future re-validation pass picks it up. Stable IDs let the SME's contribution be cited.
2. **Direct doc edits**: an SME refines a `references/**/*.md` doc with experiential knowledge, citing it explicitly ("From operator experience: Y typically happens when X" with `confidence: medium` and a comment about source). Layer 3 → Layer 1 promotion via deliberate authoring.

The skill handles Layer 3 cleanly only when it's been **promoted** to Layer 1 with attribution. Pure tribal knowledge floating in chat or runbooks isn't accessible to the skill.

## Operational implications for the fine-tune

When training data flows from this skill into a fine-tuned model on RockAI:

- **Layer 1 content** (Zscaler-doc-sourced) is the foundation. Highest-confidence training signal. The model should learn to weight this content most heavily.
- **Layer 3-promoted content** (SME knowledge surfaced into reference docs with `confidence: medium` and attribution) gives the model SME flavor without misrepresenting it as authoritative.
- **Layer 2 content** is per-tenant and **should NOT enter a public fine-tune**. Tenant-specific config is private. A private per-tenant fine-tune is a different artifact than the public model.
- **Confidence labels + source-tier labels** are explicit weighting signals. A model trained on `confidence: high, source-tier: doc` content learns differently than on `confidence: medium, source-tier: mixed`.

## Cross-links

- The `sources:` array in each reference doc — explicit per-claim attribution. See `template.md`.
- `source-tier:` field — added across 65 docs in the 2026-04-24 labeling pass.
- `confidence:` field — Layer 1 content carries an honest confidence label.
- `clarifications.md` — the canonical place tribal knowledge gets promoted to Layer 1.
- `PLAN.md § 4. Snapshot schema docs` — Layer 2 schema deferral rationale.
- `README.md § Fork-admin first-run walkthrough` — how a fork-team operationalizes Layer 2 in their environment.

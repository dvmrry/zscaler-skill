---
product: shared
topic: "layering-model"
title: "Layering model — general knowledge, tenant data, SME tribal knowledge"
content-type: reasoning
last-verified: "2026-07-26"
confidence: high
source-tier: doc
sources:
  - "PLAN.md (architectural decisions)"
  - "README.md (fork-portability framing)"
  - "docs/data-contract/knowledge.md (structured Layer 3 contract)"
  - "agents/zscaler/prompt.md (tenant-observation source preference)"
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
- `vendor/terraform-provider-{zia,zpa,zcc,ztc}/` — TF provider schemas.
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
- The overlay's IaC (answer tier 2), when `overlay.json` declares `iac` — config as of the last backfill.
- Live read-only `zscalerctl` (answer tier 3), when `overlay.json` declares `live` — results are never kept as a standing tenant cache (a case may save them under its own `evidence/`).
- (Future) per-tenant log-schema decompositions and query skeletons in `_data/schemas/` (gitignored).

**Authority pattern:** sourced from real tenant API. Authoritative for "what does this tenant actually have configured." IaC is as stale as its last backfill; live reads are current as of the read.

**Examples:**
- "Rule 47 in this tenant's URL Filtering blocks Social Networking for the Engineering department."
- "This tenant has 3 ZPA App Connector groups, each with 2 connectors at version 22.146.1."
- "URL category `Custom_Engineering` includes the FQDNs `slack.company.example.com` and `confluence.company.example.com`."

**Update cadence:** per-fork. IaC is refreshed by the IaC backfill; live `zscalerctl` reads and log queries are on-demand.

**Critical property:** **never committed to the public upstream.** Tenant data lives in private runtime-data mounts or forks. Public upstream ignores `_data/` and documents the expected shape in `docs/data-contract/`.

### Layer 3 — SME tribal knowledge

**What it is:** what your team knows that isn't in Zscaler docs and isn't in tenant config. Operator experience.

**Where it lives:** company records in the private overlay
(`<mount>/overlay/knowledge/<scope>/<id>.json`, or `$ZSCALER_KB_OVERLAY`), each
attached to the public IDs it extends, narrows or contradicts, plus unstructured
sources such as team memory, support-ticket archives, runbooks, and post-mortems.
See [`../../docs/data-contract/knowledge.md`](../../docs/data-contract/knowledge.md).

**Authority pattern:** experiential. Tribally-validated but not Zscaler-blessed. May be wrong (the team's mental model might lag a Zscaler product change), and may be right where docs are silent or stale.

**Examples:**
- "When this tenant's GRE tunnel flaps, MTU misconfiguration is usually the cause — check 1476 vs 1500."
- "Zscaler Support typically takes 4-6 hours on P3 tickets in our region; escalate to TAM at hour 8 if no movement."
- "Our finance team's SaaS app has a quirky Cloud App Control behavior — bypass URL filter on this category to keep it stable."
- "We learned the hard way that Multimatch + AppProtection silently breaks; documented in our internal runbook from incident #2348."

**Update cadence:** continuous. Records carry a `validated` date and an
explicit confidence; unstructured team knowledge remains informal.

**Where it goes to be useful:** `node scripts/kb.mjs resolve` merges active
records into bundles as `layer: company` facets, which answers attribute with
scope, confidence and validation date disclosed. Records stay private. If a public source later
supports a claim, a human may re-author it upstream from that public source and
mark the private record promoted.

## How the skill should combine layers

When answering a question, the skill should combine layers explicitly:

```
Layer 1 (general)
   ↓
Layer 2 (tenant config) — applied IF the overlay declares `iac` or `live`
   ↓
Layer 3 (operational knowledge) — applied IF a relevant active record or SME input exists
   ↓
Final answer with explicit confidence + source breakdown
```

Cited sources in the answer should attribute by layer:

```
## Sources
- kb:zia.url-filtering § Rule precedence (Layer 1: general)
- overlay IaC for zia/url-filtering-rules, rule 47 (Layer 2: this tenant)
- company.zia.gre-mtu-flap (Layer 3: company knowledge, validated 2026-07-25)
```

## When the skill has only some layers

| Scenario | Skill behavior |
|---|---|
| Layer 1 only (no overlay IaC or live read, no SME input) | General answer with appropriate confidence. Note the limitation: "I can describe how this works in Zscaler generally; for your tenant specifically, configure the overlay's `iac` or `live` tier (or run `zscalerctl zia url-filtering-rules list`) and re-ask." |
| Layer 1 + Layer 2 | Combined answer. Distinguish "Zscaler does X" from "your tenant has Y configured." |
| Layer 1 + Layer 3 | Combined answer. Tribal knowledge typically refines or extends Layer 1. |
| Layer 2 + Layer 3 without Layer 1 | Rare — usually means a question that's purely tenant-specific. Still answer but note no general framing. |
| All three | Highest-confidence answer. Cite each layer. |

## Anti-patterns

- **Treating Layer 2 inferences as Layer 1 facts.** "This tenant doesn't have Multimatch enabled" is a Layer 2 fact. "Zscaler doesn't support Multimatch" is a Layer 1 falsehood derived from over-generalizing.
- **Treating Layer 3 as Layer 1.** "Our team has never seen X happen" is Layer 3 (absence of tribal evidence). "Zscaler doesn't do X" is a Layer 1 claim that requires Zscaler documentation. They're not the same.
- **Citing Layer 1 when Layer 2 is required.** "ZIA blocks Social Networking by default" is wrong as a Layer 1 claim. Default policy varies; your tenant's default is in the overlay's IaC for `zia/url-filtering-rules` (or `zscalerctl zia url-filtering-rules list`), not in the help docs.
- **Letting Layer 3 quietly override Layer 1.** If operational knowledge
  contradicts Zscaler docs, surface both claims with their scope, confidence,
  and source layer. Never resolve the disagreement silently.

## Where tenant-data layering will eventually intersect the skill

Currently Layer 2 is a known gap because the public skill has no tenant: tiers 2 and 3 exist only company-side. When a fork configures an overlay with `iac` or `live`:

1. The skill should **start from `node scripts/kb.mjs resolve`, then the overlay's IaC** for any tenant-specific
   question, using live `zscalerctl` only when IaC cannot answer or for drift. The canonical ad-hoc prompt's
   tenant-observation section already encodes this order.
2. Reasoning docs cite the overlay's IaC path or the `zscalerctl` command inline for tenant claims.
3. **Field shapes** come from `node scripts/kb.mjs resolve <type-id>` (for example `zia/url-filtering-rules`); the former `snapshot-schema.md` docs are retired.

## Where SME knowledge intersects

Company records in the overlay give private operational knowledge a durable
home, and reach answers as company facets on resolved bundles. Researcher and
auditor, whose output is upstream-bound, resolve with `--no-overlay` and never
read the overlay. Unstructured knowledge floating in chat or runbooks is
still unavailable unless the user supplies it in the current conversation.

Promotion does not copy or cite the private record. After a public source
supports the behavior, a human authors the Layer 1 material from that public
source and updates the private record's lifecycle metadata.

## Operational implications for the fine-tune

When training data flows from this skill into a fine-tuned model on RockAI:

- **Layer 1 content** (Zscaler-doc-sourced) is the foundation. Highest-confidence training signal. The model should learn to weight this content most heavily.
- **Layer 3 records should NOT enter a public fine-tune.** They are private
  overlay content. Public reference material created after promotion is grounded
  in its public source, not in the private record.
- **Layer 2 content** is per-tenant and **should NOT enter a public fine-tune**. Tenant-specific config is private. A private per-tenant fine-tune is a different artifact than the public model.
- **Confidence labels + source-tier labels** are explicit weighting signals. A model trained on `confidence: high, source-tier: doc` content learns differently than on `confidence: medium, source-tier: mixed`.

## Cross-links

- The `sources:` array in each reference doc — explicit per-claim attribution. See `template.md`.
- `source-tier:` field — added across 65 docs in the 2026-04-24 labeling pass.
- `confidence:` field — Layer 1 content carries an honest confidence label.
- `clarifications.md` — discrepancies in the public reference corpus that can
  be stated without citing private overlay evidence.
- `docs/data-contract/knowledge.md` — structured private Layer 3 records and
  their loading and promotion boundary.
- `PLAN.md § 4. Snapshot schema docs` — historical Layer 2 schema-design rationale; the snapshot-schema guides are retired in favor of `node scripts/kb.mjs resolve <type-id>`.
- `README.md § Fork-admin first-run walkthrough` — how a fork-team operationalizes Layer 2 in their environment.

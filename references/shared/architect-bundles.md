---
product: shared
topic: "architect-bundles"
title: "Architect query bundles — template + private-fork pattern"
content-type: reference
last-verified: "2026-04-29"
confidence: high
source-tier: practice
sources:
  - "references/shared/architect-prompt.md"
  - "references/shared/architect-methodology.md"
  - "references/shared/siem-emission-discipline.md"
author-status: draft
---

# Architect query bundles — template

A **query bundle** is a named, ordered sequence of queries (Zscaler API calls, SIEM queries, infrastructure metric pulls) that the `/z-architect` agent runs against a specific scaling concern to produce evidence-backed recommendations. Bundles encode the steps an experienced architect would take, with decision logic mapping results to recommendation register entries (risk + confidence).

## Why this file ships empty

Bundles are only useful when they're **verified**. Wrong queries, wrong thresholds, or wrong decision logic produces architectural recommendations that are confidently wrong — exactly the failure mode the architect methodology is designed to prevent.

This file ships the template only. The public skill does not include bundle content authored without verification.

## Where bundles live

Same boundary as investigation bundles:

| Location | Use when |
|---|---|
| **Private fork** | Bundles tied to your tenant's specific config patterns, deployment topology, or scaling decisions |
| **CLAUDE.md** | A short bundle the agent picks up automatically per session |
| **`_local-bundles/`** (gitignored) | Larger collections kept alongside the skill |
| **PR back to this repo** | A bundle that generalizes — placeholder plumbing, Zscaler-published surfaces, verification cited |

## Template

Copy this block for every new bundle. Every section is required unless marked optional.

```markdown
### `<bundle-name-slug>`

**Trigger**: which scaling concern this addresses
(e.g., "App Connector Group sizing review" / "PSE cluster health" /
"LSS receiver coverage gap" / "Version drift detection")

**Mode applicability**:
- Agent-direct: yes / no — can the agent run these with API access alone?
- User-handoff: yes / no — what does the user need to provide or paste?
- Coworking: typical mix

**Verification**: where and how this bundle was validated
(e.g., "Real scaling review for tenant X on 2026-Q1 — bundle's decision
logic accurately predicted the recommendation that landed" OR
"Lab tenant 'sandbox-a' on 2026-04-10 — reproduced the SPOF condition
and confirmed each query's decision threshold")

**Evidence layer**: which layer this bundle pulls from
- Config evidence (Zscaler API / SDK / reference docs)
- Utilization evidence (LSS / Splunk / Grafana / cloud monitoring)
- Both (cross-layer correlation)

**Queries** (priority-ordered):

1. **<source>** — query with placeholder plumbing per
   `siem-emission-discipline.md`
   ```
   <query body>
   ```
   **Field / result to inspect**: <specific field(s)>
   **Decision logic**:
   - <result A> → recommendation entry: `<text>`, risk `<level>`,
     confidence `<level>`
   - <result B> → continue to next query for further detail
   - <result C / no signal> → flag as `Info` recommendation
     ("configure observability to enable this analysis")

2. **<source>** — next query
   ...

**Output**:
- Produces <N> recommendations in the architect register, each with
  rationale citing the specific query result
- If config-only evidence: default `Medium` confidence per
  `architect-prompt.md` confidence calibration; bump to `High` only
  for unambiguous SPOFs / zero-connector groups / critical
  observability gaps per the explicit rule
- If both layers align: confidence can be `High`

**Caveats / edge cases** (optional but recommended):
- LSS feed prerequisites (e.g., "requires App Connector Metrics LSS
  configured")
- Tenant-version dependencies (e.g., "feature only in clouds X, Y")
- Conditions where the bundle's thresholds are wrong (e.g., low-traffic
  tenants, edge-case workloads)

**Last validated**: <YYYY-MM-DD> by <author / agent>
```

## Field guidance

### Trigger

One bundle = one scaling concern. If a bundle covers multiple concerns (sizing AND topology AND observability), split it. Each concern has its own evidence layer and its own decision logic; mixing them in one bundle obscures both.

Common architect concerns:

- Sizing (capacity / headroom for current and projected load)
- Topology (regional distribution, failover paths, latency-coupled failure modes)
- Observability (LSS / NSS feed coverage, audit logging)
- Version hygiene (drift across components in the same group)
- Cost / efficiency (over-provisioning, license utilization)

### Verification (the gating field)

Same standard as investigation bundles. A bundle without verification is speculation. Acceptable evidence:

- Real architectural review where this bundle's recommendations matched what landed
- Lab tenant reproduction confirming thresholds and decision points
- Direct mapping from a Zscaler vendor sizing doc / best-practices guide

**Not acceptable**:

- "This is what a typical architect would check" without specific reference
- "Per the methodology" — methodology defines the register format and risk scale, not specific thresholds
- Sizing thresholds copied from generic cloud-architecture docs without confirmation they apply to Zscaler workloads

### Evidence layer

Be explicit about which layer the bundle pulls from. This dictates:

- What confidence the bundle's recommendations can ship at (config-only defaults to Medium per `architect-prompt.md`)
- What modes are applicable (agent-direct requires API + relevant LSS; user-handoff is always available)
- What caveats matter (LSS receiver prerequisites for utilization evidence)

### Decision logic and confidence

Every possible result needs a mapped recommendation entry, with explicit risk and confidence calibration per `architect-methodology.md`:

- Default Medium confidence for config-only with pattern reasoning
- High only for unambiguous SPOFs, zero-connector groups, critical observability absence, critical version skew with known interop issues
- Low for speculative future-load reasoning without a current baseline

A bundle that says "result is X, recommend more capacity" without quantifying risk and confidence is incomplete.

### Caveats

If the bundle's recommendations only apply when:

- A specific LSS feed is configured
- A particular Zscaler cloud / region / SKU is in use
- The user's planning horizon is short (months) vs. long (years)

Document it explicitly. Silent assumptions cause incorrect recommendations.

## Naming convention

- Slugs are lowercase, hyphenated, scoped to one concern
- Examples: `acg-sizing-review`, `pse-cluster-health`, `lss-receiver-coverage`, `version-drift-scan`
- Avoid tenant-specific naming; bundles should generalize

## Privacy

- Placeholder plumbing in any bundle published outside private fork
- Tenant identifiers (real region names, real component IDs, real headcount) stay in private bundles
- Sample utilization data quoted in examples redacted per [`tenant-schema-derivation.md`](./tenant-schema-derivation.md) redaction patterns

## Cross-links

- [`architect-prompt.md`](./architect-prompt.md) — `/z-architect` playbook (where bundles get invoked)
- [`architect-methodology.md`](./architect-methodology.md) — recommendation register, risk scale, confidence calibration, status lifecycle
- [`siem-emission-discipline.md`](./siem-emission-discipline.md) — execution modes, placeholder plumbing, public/private boundary
- [`splunk-queries.md`](./splunk-queries.md) — named SPL patterns to reference from inside bundles
- [`investigation-bundles.md`](./investigation-bundles.md) — parallel template for `/z-investigator` query bundles

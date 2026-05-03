---
product: shared
topic: "investigation-bundles"
title: "Investigation query bundles — template + private-fork pattern"
content-type: reference
last-verified: "2026-04-29"
confidence: high
source-tier: practice
sources:
  - "references/shared/investigate-prompt.md"
  - "references/shared/troubleshooting-methodology.md"
  - "references/shared/siem-emission-discipline.md"
author-status: draft
---

# Investigation query bundles — template

A **query bundle** is a named, ordered sequence of queries (API calls, SPL patterns, manual tests) that the `/z-investigator` agent runs against a specific hypothesis to confirm or rule it out. Bundles encode the steps an experienced analyst would take, with decision logic mapping results to journal claim statuses.

## Why this file ships empty

Bundles are only useful when they're **verified**. Wrong queries, wrong thresholds, or wrong decision logic misleads investigations in ways that are hard to catch downstream. A bundle invented without ground truth — without a real ticket worked through, a lab tenant reproduction, or a Zscaler vendor doc prescribing the exact sequence — produces plausible-looking content that can be subtly wrong.

This file ships the template only. The public skill does not include bundle content authored without verification.

## Where bundles live

| Location | Use when |
|---|---|
| **Private fork** of this skill | Bundles specific to your tenant / SIEM plumbing / internal ticketing |
| **CLAUDE.md** (project or user level) | A short bundle the agent can pick up automatically every session |
| **`_local-bundles/`** (gitignored directory) | Larger bundle collections kept alongside the skill but not committed |
| **PR back to this repo** | A bundle that generalizes — placeholder plumbing only, queries derived from Zscaler-published surfaces, verification cited |

The same public/private boundary as tenant schemas (per [`tenant-schema-derivation.md`](./tenant-schema-derivation.md)) and Splunk plumbing (per [`siem-emission-discipline.md`](./siem-emission-discipline.md)).

## Template

Copy this block for every new bundle. Every section is required unless marked optional.

```markdown
### `<bundle-name-slug>`

**Trigger**: which playbook hypothesis this addresses
(e.g., "Connector health is degraded" / "Policy scope excludes location" /
"Port-specific failure with adjacent successes on the same destination")

**Mode applicability**:
- Agent-direct: yes / no — can the agent run these queries with API access alone?
- User-handoff: yes / no — what does the user need to provide or paste?
- Coworking: typical mix (which queries the agent runs vs. which the user runs)

**Verification**: where and how this bundle was validated
(e.g., "Real production ticket #12345 on 2026-03-15 — port-22 failure
root-caused via this exact sequence; documented in private fork at
`_local-bundles/sipa-port-22.md`" OR "Lab tenant 'sandbox-a' on
2026-04-10 — reproduced the failure mode and tested each query's
decision logic against expected outputs")

**Queries** (priority-ordered):

1. **<source — e.g., ZPA API / Splunk LSS / manual test>** — query with
   placeholder plumbing per `siem-emission-discipline.md`
   ```
   <query body>
   ```
   **Field / result to inspect**: <specific field name(s) from canonical schema>
   **Decision logic**:
   - <result A> → mark claim `<status>`; <next action>
   - <result B> → mark claim `<status>`; <next action>
   - <result C / no signal> → <next action; usually pivot or escalate>

2. **<source>** — next query in priority order
   ...

**Output**:
- Adds <N> claims to the discovery journal, each with citation to
  the query result
- If `Confirmed (high)` reached, recommend the next remediation path
- If all queries exhausted without confirmation, escalate per the
  methodology

**Caveats / edge cases** (optional but recommended):
- TA / parser / agent version dependencies
- Required LSS receiver configurations
- Zscaler-Support-enabled fields the bundle relies on
  (e.g., `clt_sport`, `srv_dport`, `dlprulename`)
- Conditions where this bundle's logic is wrong
  (e.g., multi-region tenants, BC mode active, ZIdentity vs. legacy SAML)

**Last validated**: <YYYY-MM-DD> by <author / agent>
```

## Field guidance

### Trigger

Map to a single hypothesis from the methodology's prioritization tiers (configuration / connector health / destination / policy edge case). One bundle = one hypothesis. If a bundle would cover multiple hypotheses, split it — keeps decision logic clear.

### Verification (the gating field)

A bundle without verification is speculation. Acceptable verification:

- Real production ticket worked through end-to-end with the bundle as documented
- Lab tenant reproduction with documented inputs and outputs
- Direct mapping from a Zscaler vendor doc that prescribes this exact query sequence (cite the doc)

**Not acceptable**:

- "This is what an experienced analyst would do" without specific reference
- "Per the methodology" — methodology defines discipline, not specific queries
- Generic SPL patterns without confirming they apply to *this* hypothesis

If you cannot cite verification, the bundle is not ready to ship.

### Queries

Each query follows the SIEM emission discipline:

- Placeholder plumbing (`$INDEX_X`, `<your_*>`)
- Zscaler-published field names only (cited per `references/{zia,zpa,zcc}/logs/`)
- Cite a named pattern from `splunk-queries.md` when one exists rather than freelancing SPL

### Decision logic

Every possible result needs a mapped action. Be explicit about:

- Confidence tier the result produces (`Open (likely)`, `Confirmed (medium)`, `Confirmed (high)`, `Ruled out`)
- Whether to continue to the next query or pivot to a different hypothesis
- What "no useful signal" means and what to do then

Decision logic that says "look at the result" without prescribing the action is too vague to be useful.

### Caveats

If the bundle's correctness depends on:

- A specific TA / parser / module / agent version
- An LSS receiver being configured for a specific log type
- A field that requires Zscaler Support enablement
- A feature only in newer Zscaler clouds (e.g., post-2025 LSS additions)

Document it explicitly. Silent dependencies cause confused investigations when the bundle is run in environments that don't satisfy them.

## Naming convention

- Slugs are lowercase, hyphenated, action-or-pattern-oriented
- Examples: `connector-health-baseline`, `port-specific-failure`, `saml-attribute-drift`
- Avoid tenant-specific naming; bundles should generalize

## Privacy

- Placeholder plumbing in any bundle published outside your private fork
- Tenant identifiers (real index / sourcetype / user / hostname / ticket number) stay in private fork or local-only bundles
- Sample results quoted in caveats / examples redacted per [`tenant-schema-derivation.md`](./tenant-schema-derivation.md) redaction patterns

## Cross-links

- [`investigate-prompt.md`](./investigate-prompt.md) — `/z-investigator` playbook (where bundles get invoked)
- [`troubleshooting-methodology.md`](./troubleshooting-methodology.md) — discovery journal, claim status, severity scale
- [`siem-emission-discipline.md`](./siem-emission-discipline.md) — execution modes, placeholder plumbing, public/private boundary
- [`splunk-queries.md`](./splunk-queries.md) — named SPL patterns to reference from inside bundles
- [`siem-log-mapping.md`](./siem-log-mapping.md) — log type catalog for picking the right Zscaler stream
- [`architect-bundles.md`](./architect-bundles.md) — parallel template for `/z-architect` recommendation bundles

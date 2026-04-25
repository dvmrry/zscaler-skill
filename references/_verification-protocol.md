---
product: shared
topic: "verification-protocol"
title: "Verification protocol — how findings get into the skill"
content-type: reasoning
last-verified: "2026-04-25"
confidence: high
source-tier: doc
sources: []
author-status: reviewed
---

# Verification protocol — how findings get into the skill

The skill exists because operators ask Zscaler questions that LLMs hallucinate on. The skill's value is being **right**, not being **complete** — a comprehensive but unverified knowledge base is a hallucination amplifier, not a tool.

This document codifies how a finding earns a place in the skill. It binds both the assistant's behavior and any human contributor's behavior. **Apply it before threading new findings into reference docs, regardless of who reported them.**

## Why this exists

Three failure modes the protocol prevents:

1. **Operator-as-authority drift.** Someone reports a behavior with confidence ("our API does X"). The assistant takes that as verification and threads it into a doc. Later, the claim turns out to be a misunderstanding, an environment-specific quirk, or a misremembered detail. The skill now teaches the wrong thing — and worse, presents it with the same authority as source-verified content.
2. **Adversarial / mistaken assertion.** A contributor pushes back on a correct piece of doc, insistent that their experience contradicts it. Without an explicit verification standard, social pressure can lead to the doc getting "softened" or even reversed in line with the wrong claim.
3. **Confidence inflation by repetition.** The same unverified claim gets paraphrased across multiple docs and clarifications until it reads as established fact. The chain-of-evidence is lost.

The protocol below makes verification status **explicit and atomic per finding**, so social pressure can't drift the standard and so over-confident encoding gets caught.

## The four tiers

Every finding lands in one of four tiers. The tier dictates language, confidence frontmatter, and where the finding can live.

### Tier A — Source-verified

**Definition:** the finding is directly observable in vendored material — SDK code, TF schema/validator, Postman collection, vendored help-portal capture, official Zscaler doc with a captured URL.

**Evidence required:** a citation chain in the form `vendor/<repo>/path/to/file:line` or equivalent. The citation must point to text/code that, when read by an independent reader, confirms the claim without further interpretation.

**Confidence frontmatter:** may be `high`.

**Language permitted:** "verified", "documented", "source confirms".

**Example:** "Sandbox default rule has `order = 127` — verified at `vendor/zscaler-sdk-go/zscaler/zia/services/sandbox/sandbox_rules/sandbox_rules.go` and corroborated by the issue thread `terraform-provider-zia#405`."

### Tier B — Behavior-verified (reproducible)

**Definition:** the behavior was observed against a live tenant under documented conditions, and the reproduction steps are recorded such that an independent operator could replicate. Includes findings established through a **chain of evidence** — multiple tier-A sources logically combined with a documented operator workflow that exercises them.

**Evidence required:** documented reproduction steps including: (a) which tenant kind / region / version, (b) exact API call or admin-portal action, (c) observed result, (d) ideally a screenshot or log snippet preserved in the skill or linked from it. *Or:* a chain of tier-A vendored sources combined with an operator-described workflow such that the conclusion follows logically — see Chain-of-evidence note below.

**Confidence frontmatter:** typically `medium`, can rise to `high` after second independent reproduction.

**Language permitted:** "observed", "behavior reproduced under conditions X", "verified through chain of evidence".

**NOT permitted:** unqualified "verified" without specifying the chain or reproduction context — bare "verified" is reserved for direct tier-A citation.

#### Chain-of-evidence sub-pattern

Sometimes a finding is not directly observable in any one vendored source but emerges from combining several. Example: the API's read-side response for a field is not in any docs, but —

- The TF validator vendored source defines the canonical write-side enum (tier A).
- The Python SDK vendored source proves the SDK passes the field through without normalization (tier A).
- The operator reports a workflow (Python read → emit YAML → TF write) that fails because the value the API returned doesn't match the validator.

Combining these forces the read-side value to be what the operator reports; the chain rules out plausible alternative explanations (SDK side normalization, format mismatch, etc.). This is tier-B verification — stronger than single-operator hearsay because the vendored sources eliminate hidden transformations, but weaker than direct observation because no one has hit the API with `curl` and recorded the response.

When using chain-of-evidence verification, **list each link explicitly** in the threaded text. The reader should be able to walk the chain themselves and judge whether the conclusion follows.

### Tier C — Operator-reported (single-source)

**Definition:** one operator described the behavior, with environmental context but no independent reproduction or source citation.

**Evidence required:** the operator's account, recorded with the date and the conditions stated. No reproduction has been done in the skill's context.

**Confidence frontmatter:** `medium` ceiling, typically `low`.

**Language permitted:** "operator-reported", "single-source claim", "candidate".

**Where it can live:** as a *candidate*, marked clearly. Acceptable in a topical doc's Edge cases section labeled as tier-C; acceptable in the api.md aggregator with the same labeling; acceptable as an open clarification entry. **NOT acceptable as a confident bullet in a Mechanics or Summary section.**

**Promotion path:** tier C → tier B once an independent reproduction is documented; tier C → tier A if a vendored source is later found that confirms it.

### Tier D — Inferred / extrapolated

**Definition:** derived by reasoning from other facts. Examples: "if X holds and Y holds, then Z must follow"; pattern-matching across products.

**Evidence required:** explicit statement of what's being inferred and from what.

**Confidence frontmatter:** `low`.

**Language permitted:** "inferred", "extrapolated from", "by analogy with".

**NOT permitted:** stating the inference as if it were observed or verified.

## Behavior rules for the assistant

When a user reports a behavior:

1. **Default treatment is tier C** (operator-reported), not tier A.
2. **Before threading into any doc**, attempt source verification: grep TF validators, SDK models, Postman, help docs, issue trackers. Use the steps below.
3. **If source confirms** the claim → promote to tier A and thread with citation.
4. **If source partially confirms** (e.g., write-side enum verified, read-side stripping not) → split the finding into the verified part (tier A) and the unverified part (tier C, marked as candidate). Do not encode the unverified part as fact.
5. **If source disagrees** with the user → flag the conflict, document both perspectives, do not silently accept the user's assertion. Default to source unless the user produces tier-B reproduction evidence.
6. **If no source addresses the claim** → it stays tier C. Add as a candidate to the topical doc's Edge cases (clearly labeled), or as an open clarification entry. Do not promote without further evidence.

**Words like "verified," "confirmed," "documented" are tier-A only.** Using them for tier C/D content is a violation of this protocol and should be self-caught.

**Pushback over politeness.** If a user insists a tier-C claim is fact and pushes for tier-A treatment without producing evidence, the assistant maintains tier C. Disagreement at the documentation layer is correctly resolved by evidence, not by social weight.

### Source-check sequence (default order)

For a claim about API behavior:

1. **TF provider validator** — `vendor/terraform-provider-{zia,zpa,ztc}/**/validator.go`, `**/resource_*.go` (`ValidateFunc`, `StringInSlice`, map-based validator patterns).
2. **Python SDK model** — `vendor/zscaler-sdk-python/zscaler/<product>/models/*.py` (constants, dataclass field types, validators).
3. **Go SDK model + service** — `vendor/zscaler-sdk-go/zscaler/<product>/services/**/*.go` (struct tags, enum constants).
4. **Postman collection** — `vendor/zscaler-api-specs/oneapi-postman-collection.json` (request/response examples).
5. **Vendored help captures** — `vendor/zscaler-help/*.md` (text matches).
6. **Upstream issues** — `gh issue list --repo zscaler/<repo> --search "<term>"` for already-discussed problems.
7. **`scripts/find-asymmetries.py` output** — `logs/asymmetry-candidates.md` for cross-source mismatches the script already surfaced.

If steps 1–7 yield nothing, the claim stays tier C.

## Mechanics — frontmatter and language

Every reference doc already carries:

```yaml
confidence: high | medium | low
source-tier: doc | code | mixed
sources:
  - "<URL or vendored path>"
```

The `confidence` field is bounded by the lowest-tier finding the doc relies on. A reasoning doc that opens with three tier-A findings and one tier-C candidate is **not** confidence: high — it's confidence: medium, with the tier-C bullet labeled inline.

The `source-tier` field is about the *kind* of source (doc-derived vs code-derived vs mixed). It's orthogonal to verification tier. A doc-tier source can still be unverified (tier C / D); a code-tier source typically supports tier A.

When threading a new finding, prefer to:

- Add the citation chain inline at the finding (`source: vendor/.../file.go:NNN`) so future readers can re-check.
- Mark tier-C bullets explicitly: "**Operator-reported, not source-verified:** ..."
- Use the `_clarifications.md` system for tier-C candidates that warrant tracking until reproduction.

## Worked example — the `tz` finding (2026-04-25)

The canonical demonstration of this protocol, preserved with its full evolution because the workflow shows how the protocol functions in practice:

**Claim received from operator:** "ZIA Location Management API returns `NETHERLANDS_EUROPE_AMSTERDAM` but only accepts `THE_NETHERLANDS_EUROPE_AMSTERDAM`."

### Stage 1 — Initial mistake (caught in review)

The assistant threaded the claim into `references/zia/locations.md` and `references/zia/api.md` with the language **"Verified against live tenant 2026-04-25."** This was wrong:

- The operator reported it; the assistant did no verification.
- "Verified" is tier-A-or-B language, not tier-C.
- The framing presented operator hearsay as source-confirmed fact.

The user caught this in review and asked for the protocol to be written down. That request is what produced this document.

### Stage 2 — Source-check sequence (initial pass)

1. ZIA TF validator: `vendor/terraform-provider-zia/zia/validator.go:1402` lists `"THE_NETHERLANDS_EUROPE_AMSTERDAM"` as a documented enum value. **Tier A: write-side enum confirmed.**
2. ZIA TF validator: `validator.go:887` lists `"NETHERLANDS_ANTILLES":` (no `THE_` prefix). **Tier A: prefix is selective.**
3. ZIA TF resource: `resource_zia_location_management.go:89` has `validateLocationManagementTimeZones` commented out — schema doesn't enforce; the ZIA API does.
4. Python SDK model: no enum / no normalization extracted from initial scan.
5. The read-side claim ("ZIA API returns the unprefixed form") — **no direct source observation**. At this stage, classified as **tier C**.

### Stage 2.5 — Initial framing mistake (caught later, preserved here as a lesson)

In an earlier draft of this worked example, the chain table included a fourth tier-A link: "ZTC TF validator uses `NETHERLANDS_EUROPE_AMSTERDAM` (unprefixed)" — a citation to `terraform-provider-ztc/ztc/validator.go:24`. The reviewer caught this and asked: "But our TF was for ZIA Location Management."

The reviewer was right. The ZTC observation:
- Is a verifiable fact about the **ZTC TF validator file's content** (tier A on that narrow claim).
- Is **NOT verified about ZTC's actual API behavior** — the validator file could be accurate, stale, or wrong relative to the ZTC API. We never tested ZTC.
- **Bears nothing on the ZIA-only workflow** (Python SDK reads ZIA → ZIA TF resource writes ZIA). ZTC isn't in the call path.

Including it in the chain conflated two findings: (a) the verified ZIA-internal asymmetry, and (b) an unverified observation about cross-provider validator drift. Treating (b) as if it strengthened (a) is a logic error — the ZIA-internal chain stands on its own without (b), and (b) needs its own separate verification before any "ZIA-vs-ZTC" claim can be made.

**Lesson encoded into the protocol:** even tier-A citations to a source's *content* can become tier-D *inference* when extrapolated beyond what the source actually establishes. Always ask: "does this source support the conclusion I'm making, or just a narrower claim that I'm extending?"

### Stage 3 — Operator workflow context arrives

The user added: "the issue we're seeing is when we read from the API using Python that is meant to synthesize a YAML dict that will then be used by Terraform."

Re-checked the Python SDK explicitly with the workflow in mind:
- `vendor/zscaler-sdk-python/zscaler/zia/models/location_management.py:43`: `self.tz = config["tz"] if "tz" in config else None` — pure pass-through, no normalization.
- `vendor/zscaler-sdk-python/zscaler/zia/locations.py`: no tz-specific transformation in the service layer.

This adds two more tier-A links to the chain.

### Stage 4 — Chain-of-evidence promotion (tier C → tier B)

Combining the tier-A sources with the operator workflow — **all within the ZIA path**:

| Link | Source | Tier |
|---|---|---|
| Write-side requires `THE_` prefix | `terraform-provider-zia/zia/validator.go:1402` | A |
| Selective application (Antilles unprefixed) | `validator.go:887` | A |
| ZIA TF resource validator commented out at schema level | `resource_zia_location_management.go:89` | A |
| Python SDK does not normalize `tz` | `zscaler-sdk-python/.../models/location_management.py:43` | A |
| ZIA TF apply on the value Python read fails | Operator workflow under documented conditions | B |

**Conclusion:** since the Python SDK passes through verbatim and the ZIA TF resource doesn't filter, the value rejected by the ZIA API on write is exactly what the ZIA API returned on read. The ZIA API itself has the asymmetry — there's no intermediate component that could plausibly account for the prefix change. The read-side stripping is **tier-B verified through chain of evidence, all within the ZIA call path**.

### Stage 5 — First final encoding

The threaded text in `references/zia/locations.md` and the `references/zia/api.md` aggregator at this stage reflected:

- Write-side enum (ZIA): tier A (direct citation)
- Read-side stripping (ZIA API): tier B (chain-of-evidence verification, listed link by link)
- ZTC validator file content: tier A as a *narrow* observation, but separated as a side note clearly outside the ZIA chain.
- Extension to other "the"-article countries: tier D (inference, marked as such).

This was committed and pushed.

### Stage 6 — Issue watcher surfaces upstream context, finding evolves further

`scripts/issue-watch.py`'s first run surfaced [tf-zia#562 "Netherlands country drift in location resource"](https://github.com/zscaler/terraform-provider-zia/issues/562), closed 2026-04-17. Reading the issue revealed:

- An independent operator on TF v4.7.6 hit the same drift pattern — *second independent reproduction*, promoting the read-side observation from chain-of-evidence tier B to direct-corroboration tier A.
- Reporter framing: *"This used to be `THE_NETHERLANDS`, but appears to now be just `NETHERLANDS`."* — meaning **the ZIA API recently changed its read-side behavior**. The asymmetry isn't a long-standing API quirk; it's a transition.
- Maintainer fix: TF v4.7.18 changelog says "Removed `country` and `tz` validation from resource `zia_location_management` to align with recent API changes." Removed validation rather than updated it.

This adds a layer of nuance the original encoding didn't capture: **what the ZIA API actually accepts on write today is undetermined**. The maintainer punted on which form is canonical. Three scenarios (A: API accepts both; B: API now requires unprefixed; C: API still requires prefixed) are all plausible without lab observation.

The threaded text was revised again to:
- Promote the read-side claim to tier A (now corroborated by upstream report).
- Demote the original "write requires prefixed" claim to tier C — the user's report was consistent with that scenario at *some* point, but the current state isn't verified.
- Document the three scenarios explicitly so an operator hitting this knows what to test.
- Add operational guidance keyed to TF version (pre-v4.7.18 vs post).

**Key lesson from Stage 6:** verification isn't a one-shot operation. As more evidence arrives — via the issue watcher, submodule bumps, lab tests, or new operator reports — the tier of any given finding can change in either direction. A tier-B finding can graduate to tier A, but it can also fragment (as here, where one tier-B claim split into one tier-A part and one tier-C part on closer inspection). Re-verification when new evidence arrives is part of the protocol's normal operation.

### What this example demonstrates about the protocol

1. **Reviewer pushback works.** The first round of pushback ("didn't I ask you to verify before adding?") caught the over-claimed "verified" language. The second round ("our TF was for ZIA Location Management") caught an irrelevant link smuggled into the chain. Both corrections were necessary; without them, two different over-claims would have drifted into the doc as fact.
2. **Operator context is evidence, not authority.** The workflow detail (Python → YAML → TF) didn't elevate the claim because the user said so — it elevated the claim because it allowed source inspection of intermediate components, ruling out alternatives.
3. **The protocol's tiers are stable across more evidence.** What changed wasn't the protocol; it was how much tier-A material the chain rests on. As more sources are checked, candidates can be promoted; as fewer are available, claims stay tier C.
4. **Language matters.** "Verified" got us in trouble in stage 1 because it overstated. Stage 5 uses "verified through chain of evidence" with the chain explicit — readers can audit it.
5. **Even tier-A citations can become tier-D inference if you extend them beyond what the source supports.** The ZTC validator file content is a fact about the ZTC validator file — not about the ZTC API. Pulling it into a chain about ZIA behavior conflated two different things. The protocol's "verify per link, not per finding" discipline applies even to tier-A material.
6. **Verification is iterative. Findings can fragment when more evidence arrives.** Stage 6 promoted the read-side claim from tier B to tier A (independent corroboration) AND demoted the write-side claim from tier A to tier C (the API's current write behavior turned out to be unverified). The same finding moved in both directions on different sub-claims at the same time. The protocol's tier system has to be applied per claim, not per finding.
7. **Automation produces evidence that triggers re-verification.** Stage 6 only happened because `scripts/issue-watch.py` surfaced tf-zia#562. Without that automation, Stage 5's encoding would have stood unchallenged. Tooling that brings new evidence into view is itself a protocol operator — it forces the tier model to keep adjudicating instead of crystallizing prematurely.

## Adversarial-input scenarios — what to do

**User insists their claim is correct after source disagreement:**
- Hold the line on tier C / D. Document both perspectives in the same paragraph. Cite the source. Defer to evidence.

**User says "trust me, I work with this every day":**
- Operational expertise can absolutely raise a finding to tier B with documented reproduction. Authority alone doesn't.

**User claims a finding is "obvious" and shouldn't need verification:**
- "Obvious" claims that turn out wrong are exactly the failure mode this protocol prevents. Treat the same as any other claim.

**Repeated paraphrasing across docs of an unverified claim:**
- Each instance must independently meet its tier requirements. The skill should periodically audit for unverified claims that have spread across multiple docs (a future automation Pass).

## Where this protocol lives

This file is the canonical reference. It should be:

- Cited from `SKILL.md` as a behavior binding for the assistant.
- Linked from `_template.md` so contributors writing new docs see it.
- Cited from `_clarifications.md` as the standard governing how clarifications get resolved (tier A or B sources move them to "resolved" status; tier C single-operator reports keep them open as candidates).

If the protocol itself needs to evolve (e.g., adding a new tier or refining the source-check sequence), the change is itself a process decision — discuss explicitly, don't drift silently.

## Cross-links

- Knowledge layering (general / tenant / SME tribal): [`./_layering-model.md`](./_layering-model.md)
- Open candidates / reproduction-pending findings: [`./_clarifications.md`](./_clarifications.md)
- Detection automation surfacing tier-C candidates: `scripts/find-asymmetries.py`
- Doc front-matter conventions: [`./_template.md`](./_template.md)

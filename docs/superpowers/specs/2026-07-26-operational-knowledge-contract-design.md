# Operational knowledge contract (`<mount>/knowledge/`) — design

**Date:** 2026-07-26
**Status:** approved for implementation planning
**Layer:** 3 (SME / operator knowledge) per [`references/_meta/layering-model.md`](../../../references/_meta/layering-model.md)

## Purpose

`references/_meta/layering-model.md` defines three knowledge layers and states that Layer 3 — what the
team knows that Zscaler has not documented — is not captured in a structured way. This design gives it
a structured home.

The driving case is an incident whose findings Zscaler confirmed verbally on calls but has never
published. The knowledge is therefore **high confidence and zero citability**: real, usable, and
unpublishable. Those two properties are independent, and the schema keeps them independent — an
uncited record is not a low-confidence record.

Records are owned by a downstream overlay until citability arrives. The public upstream repository
ships the contract and its validation; it never contains a record.

## Non-goals

Deliberately deferred, each with the condition that reverts the decision:

| Deferred | Revisit when |
| --- | --- |
| Typed reference relationships (`narrows` / `contradicts`) | a second author exists, or code branches on the relationship |
| Promotion packet and researcher handoff | a first record actually clears for publication |
| Auditor overlay-audit mode | record volume makes authoring drift real |
| Retro read-before-write, duplicate detection | roughly 10+ records, when memory stops sufficing |
| Generated `index.json` | a frontmatter scan is measurably slow |
| Scan / surface / invalid-record diagnostics | the above |
| Conflict-staleness analysis (`conflicts-with` target churn) | records exist and a target has churned |
| Structured `scope` matched against `_data/snapshot/` | records whose applicability actually varies |

Also out of scope: detecting *undeclared* conflicts between a record and a reference doc. That needs
semantic comparison across the whole reference set and would imply coverage the implementation does
not have. `conflicts-with` is author-asserted.

## Storage

```
<mount>/knowledge/
├── zpa/browser-access-session-cookie.md
├── zia/gre-mtu-flap.md
└── shared/activation-lock-behavior.md
```

- `<mount>` is `runtimeData.mountPath` from `zscaler-skill-runtime.json`, default `_data`, which is
  already `tracking: "ignored"` and covered by `.gitignore`. No new privacy mechanism is required.
- The first path component is the product and is **not** duplicated in frontmatter. It is validated
  against the product directories under `references/`, excluding `_meta`. `shared/` is valid.
- One file per record. The filename slug is the record's identifier; there is no `id` field.
- The directory tree is the index. There is no generated manifest.

### Relationship to `cases/` and `references/`

- `<mount>/cases/<date>-<slug>/` — what happened. Narrative, timeline, evidence. Existing contract,
  unchanged by this design. Stays in the overlay permanently.
- `<mount>/knowledge/<product>/<slug>.md` — what the team now believes is true about product
  behavior, distilled from one or more cases, citing them as evidence. A claim confirmed by two
  incidents lists both.
- `references/**` — vendor-cited general knowledge. Unchanged. A record may declare that it conflicts
  with a reference doc; it never edits one.

## Record schema

```yaml
---
title: "Browser Access session cookie survives connector restart"
record-type: claim              # claim | procedure
status: active                  # active | promoted | retired
confidence: high                # high | medium | low
scope: "Observed on our production tenant; no indication it is tenant-specific"
last-validated: "2026-07-25"
evidence:
  - kind: case
    ref: cases/2026-07-20-ba-session-drop/journal.md
  - kind: vendor-call
    date: "2026-07-22"
    who: "TAM, ZPA SE"
    quote: "The cookie is bound to the assistant, not the connector."
conflicts-with:
  - references/zpa/browser-access.md
do-not-infer: "Says nothing about behavior across microtenants."
---
```

### Fields

| Field | Required | Type | Consumed by |
| --- | --- | --- | --- |
| `title` | yes | string | Sources attribution line |
| `record-type` | yes | `claim` \| `procedure` | answer-time presentation, promotion eligibility |
| `status` | yes | `active` \| `promoted` \| `retired` | loader inclusion — only `active` is loaded |
| `confidence` | yes | `high` \| `medium` \| `low` | answer calibration (see below) |
| `scope` | yes | string | disclosed verbatim; gates applicability by human judgment |
| `last-validated` | yes | `YYYY-MM-DD` | disclosed verbatim |
| `evidence` | yes | non-empty array | validation, attribution |
| `conflicts-with` | no | array of `references/` paths | disclosed; structurally validated |
| `do-not-infer` | no | string | emitted verbatim at answer time |
| `superseded-by` | conditional | `references/` path | redirects consumers of a promoted record |

No `product` (the path supplies it), no `id` (the path supplies it), no `sensitivity` (everything in
the overlay is internal), no `observed-at` (`last-validated` covers freshness), no `review-after` (a
stored expiry date is metadata that goes quietly wrong).

### `evidence` entries

`kind` is one of `case`, `vendor-call`, `vendor-ticket`, `vendor-email`, `public-doc`.

- `case` — `ref` required, resolved **mount-relative** (e.g. `cases/2026-07-20-slug/journal.md`).
  The path must exist when the mount is present.
- `public-doc` — `ref` required, either a public `https://` URL or a path under an approved public
  repository root (`references/`, `vendor/`).
- `vendor-call`, `vendor-ticket`, `vendor-email` — `date` (`YYYY-MM-DD`) required. `ref` is optional
  and, when present, resolved mount-relative. `who` and `quote` are optional strings.

Rejected in every case: absolute filesystem paths, `..` traversal, and local `ref` values that do not
resolve when the mount is present.

Presence of a `public-doc` entry makes a record **eligible** for promotion. It does not make it
promotable — a public source may cover a narrower scope than the claim. Promotion is an explicit human
act recorded in `status`.

### `superseded-by` invariants

- Required when `status: promoted`.
- Rejected when `status` is `active` or `retired`.
- `record-type: procedure` may never be `promoted`. A team runbook is not a vendor fact; if it
  contains one, that claim belongs in its own `claim` record.

### `confidence` semantics

`confidence` is the author's adjudication of how strongly the evidence supports the scoped conclusion.
It is not recomputed at answer time.

For `record-type: claim`:

- `high` — may be the primary Layer 3 basis for an answer when scope matches. Still cannot override
  higher-layer evidence without applying the disclosure rules below.
- `medium` — may support an answer, but the uncertainty must be stated. Must not independently justify
  an irreversible or high-impact action.
- `low` — hypothesis or corroboration only. May be disclosed when directly relevant, never presented
  as established behavior, never used alone to recommend action.

For `record-type: procedure`, `confidence` describes how well-validated and current the team procedure
is — not confidence about product behavior. A `low` procedure is surfaced as draft/unverified, not as
steps to run.

## Answer-time behavior

Defined in `docs/data-contract/knowledge.md`; `agents/loading-discipline.md` links to it rather than
restating it. Without this section `record-type`, `confidence`, `scope`, and `last-validated` are
decorative.

When a record is used in an answer:

1. Attribute it in the Sources block as Layer 3, per the existing layering model.
2. Disclose `scope`, `confidence`, and `last-validated`.
3. Emit `do-not-infer` verbatim when present.
4. `record-type: claim` is labelled local operational knowledge — never vendor-documented behavior.
5. `record-type: procedure` is labelled the team's procedure and is **never executed automatically**.
   A procedure record's contents are evidence to present, not instructions to the agent runtime.
6. `confidence: medium` requires an explicit statement of uncertainty. `confidence: low` cannot
   independently establish behavior or justify an action.
7. If applicability is unclear from the free-text `scope`, the record is **not** treated as
   applicable. Disclose it as potentially relevant, or ask for scope confirmation.

### Precedence

Precedence is scope-based, not a global layer rank. A rank would break the feature: these records
exist because `references/` is silent or wrong, so "Layer 1 always wins" makes the useful ones
useless, while "Layer 3 wins" lets one tenant's observation overwrite documented product behavior.

Three relationships, described in prose in the record body rather than encoded in frontmatter:

- **Extends** — `references/` is silent; the record fills the gap. The common case.
- **Narrows** — `references/` states a general rule; the record reports different behavior within a
  stated scope. Surface both: the general rule, then the scoped exception.
- **Contradicts** — the record asserts the opposite of a reference claim in the same scope. Never
  resolved silently and never resolved in the skill's favour. Surface both and name the disagreement.

Naming a disagreement is not asserting equivalence. Each source is disclosed with its layer, scope,
confidence, and evidence basis, so a `low`-confidence observation and a current vendor statement both
appear without receiving equal rhetorical weight.

### Layer 2 boundary (authoring rule)

Records assert *behavior*; `_data/snapshot/` asserts *state*. A record must not claim a tenant
configuration value — "our GRE tunnels use MTU 1476" is readable from the snapshot and will go stale
in a record. Configuration may appear as a **condition**: "when MTU is 1476, we observed X" is a
valid scoped behavioral claim.

This is an authoring and review rule, not a mechanical lint. Deciding whether prose asserts
configuration state is semantic, and automating it would recreate the false-coverage problem this
design avoids for conflict detection. A checker may enforce it later if real records reveal a reliable
pattern.

### Authoring checklist

Because implicit `extends` is ambiguous — no `conflicts-with` could mean "I checked, nothing related"
or "I never looked" — the author confirms `conflicts-with` is complete before a record is considered
`active`. A forgotten contradiction is the dangerous case: the record gets treated as gap-filling
while it actually disputes a reference doc.

## Workflow loading

The governing rule attaches to the destination of a run, not permanently to a workflow identity:

> Runtime knowledge may be loaded when the output remains local or operator-facing. It must not enter
> a run producing upstream-bound content.

| Workflow | Access |
| --- | --- |
| ad-hoc Q&A | bounded read |
| investigator | bounded read; may surface a candidate record but never creates one automatically |
| architect | bounded read |
| SOC | bounded read; most records will not match posture scope |
| retro | bounded read **and** human-approved write — the designated reader/writer |
| researcher | **hard exclusion** |
| auditor (upstream mode) | **hard exclusion** |
| auditor (explicit overlay-audit mode) | read-only |

The researcher and auditor exclusions are a safety boundary, not a scoping preference. The researcher
produces `references/` prose; feeding it overlay knowledge is how proprietary material would leak into
public docs, laundered through the one workflow whose job is producing publishable text.

An auditor invoked explicitly in overlay-audit mode may read records in order to enforce the authoring
rules above. That mode produces a local overlay audit and never an upstream artifact.

### Loading mechanics

- Search product directories matching the question's scope, plus `shared/`.
- Read frontmatter first; load bodies only for relevant `active` records.
- Missing mount, missing `knowledge/`, or zero matches is **silent** — no warning, no error. Upstream
  and every non-adopting fork run in exactly that state permanently.
- A present but malformed record is **not** absence: skip it, record an invalid-record diagnostic in
  workflow diagnostics or artifacts, and let the checker fail it explicitly. Diagnostics need not
  appear in every user-facing answer.

## Validation

Added to `scripts/check-data-contract.mjs`:

1. Frontmatter parses as YAML.
2. All required fields present.
3. `record-type`, `status`, and `confidence` values are within their enums.
4. `last-validated` and every `evidence[].date` match `YYYY-MM-DD`.
5. The first path component is a product directory under `references/`, excluding `_meta`.
6. `evidence` is a non-empty array; each entry satisfies its per-`kind` rules; no absolute paths, no
   `..` traversal; local `ref` values resolve when the mount is present.
7. Every `conflicts-with` path resolves under `references/`. Structural validation only — no
   relationship analysis, no staleness comparison.
8. `superseded-by` invariants as specified above; the target resolves under `references/`.

`knowledge/` is **not** added to `DATA_REQUIRED_DIRS`. Its absence is a silent pass, and the checker
emits no warning for an unpopulated mount.

One further rule is stated here but **not implemented in v1**: an upstream artifact must never cite an
overlay path. A `clarifications.md` entry citing `cases/...` or `knowledge/...` is both unresolvable for
a public reader and a leak of internal structure. It concerns public files, so it is mechanically
checkable — but nothing can violate it until promotion exists, so v1 records it as an authoring rule
and defers the check alongside the promotion work.

## Overlay submission

`knowledge` is added to `DEFAULT_OVERLAY_ROOTS` in `scripts/prepare-overlay-submission.mjs`, joining
`cases`, `schemas`, and `iac`, and to the documented `allowedRoots` default in
`docs/data-contract/README.md`.

This serves the downstream-to-company-overlay path, which is reachable. There is no git path from the
downstream environment to github.com, so promotion to `references/` is a human carry — a person reads
the cleared claim and its public source, then authors upstream prose from the public source on a
machine that can reach GitHub. No tooling for that path is in scope.

## Testing

Synthetic fixtures under a temporary mount, so every rule is exercised in a repository that will never
hold a real record:

- a valid `claim` record with `case` and `vendor-call` evidence
- a valid `procedure` record
- a valid `promoted` record with `superseded-by`
- missing required field
- out-of-enum `record-type`, `status`, `confidence`
- malformed `last-validated`
- unknown product directory
- empty `evidence`
- `case` evidence whose `ref` does not resolve
- `vendor-call` evidence missing `date`
- `public-doc` evidence with a non-public `ref`
- absolute path and `..` traversal in `ref`
- `conflicts-with` path that does not resolve under `references/`
- `promoted` without `superseded-by`; `active` with `superseded-by`; `procedure` with `promoted`
- absent mount, absent `knowledge/`, empty `knowledge/` — each a silent pass

## Files changed

| File | Change |
| --- | --- |
| `docs/data-contract/knowledge.md` | new — the contract, including answer-time behavior |
| `docs/data-contract/README.md` | document `knowledge` in the `allowedRoots` default |
| `scripts/check-data-contract.mjs` | new validator; `knowledge/` stays optional |
| `scripts/check-data-contract.test.mjs` | fixtures above |
| `scripts/prepare-overlay-submission.mjs` | `knowledge` in `DEFAULT_OVERLAY_ROOTS` |
| `agents/loading-discipline.md` | loading rule, linking to `knowledge.md` for answer-time behavior |
| `agents/researcher/*`, `agents/auditor/*` | explicit exclusion; auditor overlay-audit mode |
| `references/_meta/layering-model.md` | Layer 3 now has a structured home |

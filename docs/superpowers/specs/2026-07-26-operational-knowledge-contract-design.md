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
| Mechanical gate on upstream artifacts citing overlay paths | the promotion workflow exists — nothing can violate it before then |
| Architect, SOC read access | someone wants a record surfaced in those workflows; none loads the shared discipline today |
| Retro read-before-write and duplicate detection | roughly 10+ records, when memory stops sufficing |
| Auditor overlay-audit mode | enough records exist that authoring drift is real |
| Generated `index.json` | a frontmatter scan is measurably slow |
| Scan / surface / invalid-record diagnostics | the above |
| Conflict-staleness analysis (`conflicts-with` target churn) | records exist and a target has churned |
| Structured `scope` matched against `_data/snapshot/` | records whose applicability actually varies |
| Structured vendor-citation fields (`date` / `who` / `quote`) | they gate something, which would also justify a YAML dependency |

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
  - case:cases/2026-07-20-ba-session-drop/journal.md
  - vendor-call
conflicts-with:
  - references/zpa/browser-access.md
do-not-infer: "Says nothing about behavior across microtenants."
---

## Evidence

- Case `2026-07-20-ba-session-drop` — session survived a rolling connector restart.
- Vendor call, 2026-07-22 (TAM, ZPA SE): "The cookie is bound to the assistant, not the connector."
```

Frontmatter is **flat by design**: scalar fields and scalar lists only. The repository's frontmatter
parser ([`scripts/check-workflow-metadata.mjs`](../../../scripts/check-workflow-metadata.mjs)) supports
exactly that. It captures a one-line mapping such as `- kind: case` as the literal scalar
`"kind: case"`; additional indented mapping lines are unsupported rather than becoming a nested
object. The schema stays within the parser's actual data model and keeps the repository at zero runtime
dependencies.

### Fields

| Field | Required | Type | Consumed by |
| --- | --- | --- | --- |
| `title` | yes | string | Sources attribution line |
| `record-type` | yes | `claim` \| `procedure` | answer-time presentation, promotion eligibility |
| `status` | yes | `active` \| `promoted` \| `retired` | loader inclusion — only `active` is loaded |
| `confidence` | yes | `high` \| `medium` \| `low` | answer calibration (see below) |
| `scope` | yes | string | disclosed verbatim; gates applicability by human judgment |
| `last-validated` | yes | `YYYY-MM-DD` | disclosed verbatim |
| `evidence` | yes | non-empty list of `kind` or `kind:ref` | validation, promotion eligibility, attribution |
| `conflicts-with` | no | list of `references/` paths | disclosed; structurally validated |
| `do-not-infer` | no | string | emitted verbatim at answer time |
| `superseded-by` | conditional | `references/` path | redirects consumers of a promoted record |

No `product` (the path supplies it), no `id` (the path supplies it), no `sensitivity` (everything in
the overlay is internal), no `observed-at` (`last-validated` covers freshness), no `review-after` (a
stored expiry date is metadata that goes quietly wrong).

### `evidence` entries

Each entry is a single scalar: a bare `kind`, or `kind:ref`. `kind` is one of `case`, `vendor-call`,
`vendor-ticket`, `vendor-email`, `public-doc`.

- `case` — `ref` required, resolved **mount-relative** (e.g. `cases/2026-07-20-slug/journal.md`). The
  path must exist when the mount is present.
- `public-doc` — `ref` required and must be a public `https://` URL. Repository paths do not qualify:
  a `references/` path would let the knowledge base make its own record promotion-eligible, which
  establishes nothing about whether Zscaler published the behavior, and a `vendor/` path is
  unresolvable when the submodule is uninitialized.
- `vendor-call`, `vendor-ticket`, `vendor-email` — `ref` optional; when present, resolved
  mount-relative. Dates, participants, and quotations belong in the body's `## Evidence` section,
  where prose reads naturally and a quotation containing punctuation is harmless.

Rejected in every case: absolute filesystem paths, `..` traversal, and local `ref` values that do not
resolve when the mount is present.

**Symlink containment.** Rejecting absolute paths and `..` does not prevent a symlink *inside* the
mount from resolving outside it, which would let a loader read arbitrary local files. Therefore: reject
a record file that is itself a symlink, reject an evidence `ref` that is a symlink, and verify the
`realpath` of every resolved local reference lies beneath the runtime mount. Both direct and nested
symlink escapes are tested.

Presence of a `public-doc` entry makes a record **eligible** for promotion. It does not make it
promotable — a public source may cover a narrower scope than the claim. Promotion is an explicit human
act recorded in `status`.

### `superseded-by` invariants

- Required when `status: promoted`.
- `status: promoted` also requires at least one valid `public-doc` evidence
  entry; public evidence is what makes the record eligible for the explicit
  human promotion decision.
- Rejected when `status: active`.
- Optional when `status: retired` — an observation may be disproven or superseded because a public
  reference now explains the authoritative behavior, and that pointer is worth keeping.
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

### Authoring rules

Enforced by review, not by tooling:

- **`conflicts-with` completeness.** Implicit `extends` is ambiguous — no `conflicts-with` could mean
  "I checked, nothing related" or "I never looked." The author confirms completeness before a record is
  `active`. A forgotten contradiction is the dangerous case: the record gets treated as gap-filling
  while it actually disputes a reference doc.
- **No configuration assertions**, per the Layer 2 boundary above.
- **No overlay paths in upstream artifacts.** An upstream artifact must never cite `cases/...` or
  `knowledge/...` — unresolvable for a public reader and a leak of internal structure. Mechanically
  checkable, but deferred: nothing can violate it until promotion exists.

## Workflow loading

The governing rule attaches to the destination of a run, not permanently to a workflow identity:

> Runtime knowledge may be loaded when the output remains local or operator-facing. It must not enter
> a run producing upstream-bound content.

v1 grants access only to the two workflows that already load `agents/loading-discipline.md`:

| Workflow | v1 access |
| --- | --- |
| ad-hoc Q&A (`agents/zscaler/`) | bounded read |
| investigator | bounded read; may surface a candidate record but never creates one automatically |
| researcher | **hard exclusion** |
| auditor | **hard exclusion** |
| architect, SOC, retro | no access in v1 — see Non-goals |

The researcher and auditor exclusions are a safety boundary, not a scoping preference. The researcher
produces `references/` prose; feeding it overlay knowledge is how proprietary material would leak into
public docs, laundered through the one workflow whose job is producing publishable text.

Architect, SOC, and retro are excluded from v1 for a mechanical reason rather than a policy one: none
of them references the shared loading discipline, so granting access means adding required reads to
three more prompt/workflow pairs. Retro is the eventual reader/writer, and its read exists to avoid
duplicate claims — a problem that does not exist at v1 volumes. Records are authored manually in v1.

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

1. Frontmatter parses, and every line is within the flat-scalar subset the parser supports. A line
   that would silently mis-parse is a finding, not a shrug.
2. All required fields present; unknown fields rejected.
3. `record-type`, `status`, and `confidence` values are within their enums.
4. `last-validated` matches `YYYY-MM-DD`.
5. The first path component is a product directory under `references/`, excluding `_meta`.
6. `evidence` is a non-empty list; each entry's `kind` is known; each entry satisfies its per-`kind`
   rule; `public-doc` refs are `https://` URLs.
7. No absolute paths, no `..` traversal; local `ref` values resolve when the mount is present; no
   record file or evidence target is a symlink; every resolved local `realpath` lies beneath the mount.
8. Every `conflicts-with` path resolves under `references/`. Structural validation only — no
   relationship analysis, no staleness comparison.
9. `superseded-by` invariants as specified above; the target resolves under `references/`.

`knowledge/` is **not** added to `DATA_REQUIRED_DIRS`. Its absence is a silent pass, and the checker
emits no warning merely because the optional directory is absent. The existing setup contract remains
unchanged: a missing runtime-data mount itself is an error when `check-data-contract.mjs` is invoked,
even though answer-time workflow loading treats unavailable runtime data as a silent no-op.

## Overlay submission

`knowledge` is added to `DEFAULT_OVERLAY_ROOTS` in `scripts/prepare-overlay-submission.mjs`, joining
`cases`, `schemas`, and `iac`, and to the documented `allowedRoots` default in
`docs/data-contract/README.md`.

Network topology is deployment-specific and not asserted here. Internal submission works when the
configured overlay remote is reachable; local-only operation — commit to the overlay checkout, no push
— remains valid; and the helper never pushes by default in either case. Promotion of a record to
`references/` is prohibited by this contract regardless of network reachability: upstream prose must be
authored from the public source, not derived from the private record. No tooling for that path is in
scope.

## Testing

Synthetic fixtures under a temporary mount, so every rule is exercised in a repository that will never
hold a real record:

- valid `claim` with `case` and `vendor-call` evidence; valid `procedure`; valid `promoted` with
  `superseded-by`; valid `retired` both with and without a successor
- one valid fixture per `evidence` kind
- missing required field; unknown field
- out-of-enum `record-type`, `status`, `confidence`; wrong-type values for scalar fields
- malformed `last-validated`
- unknown product directory
- unavailable product taxonomy, while `shared` remains independently valid
- nested mapping in frontmatter (the silent mis-parse case) — must be a finding
- empty `evidence`; unknown `evidence` kind
- `case` evidence whose `ref` does not resolve
- `public-doc` evidence with a non-`https://` ref
- `public-doc` evidence using a loopback, private, dotless, or internal host
- absolute path and `..` traversal in `ref`
- record file that is a symlink; evidence `ref` that is a symlink; nested symlink escaping the mount
- `conflicts-with` path that does not resolve under `references/`
- `promoted` without `superseded-by`; `promoted` without `public-doc`; `active`
  with `superseded-by`; `procedure` with `promoted`
- absent `knowledge/` and empty `knowledge/` — each a silent pass; absent runtime-data mount retains
  the checker's existing setup error
- `README.md` and `.gitkeep` skeleton markers — silent at the root and product levels
- unsupported record extensions, directory refs, `__proto__`, NUL bytes, and CLI nonzero exit

## Files changed

| File | Change |
| --- | --- |
| `docs/data-contract/knowledge.md` | new — the contract, including answer-time behavior |
| `docs/data-contract/README.md` | document `knowledge` in the `allowedRoots` default |
| `scripts/check-data-contract.mjs` | new validator; `knowledge/` stays optional |
| `scripts/check-data-contract.test.mjs` | fixtures above |
| `scripts/investigator-artifacts.mjs`, `scripts/investigator-artifacts.test.mjs` | enforce the bounded Step 2 runtime-data classes and exact approval for any other added load |
| `scripts/auditor-artifacts.mjs`, `scripts/auditor-artifacts.test.mjs` | reject private knowledge paths as auditor finding sources |
| `scripts/prepare-overlay-submission.mjs` | `knowledge` in `DEFAULT_OVERLAY_ROOTS` |
| `scripts/prepare-overlay-submission.test.mjs` | default-root submission coverage for knowledge records |
| `scripts/lib.mjs`, `scripts/lib.test.mjs` | accept mount-relative `knowledge` in configured allowed roots |
| `scripts/README.md`, `agents/setup/prompt.md` | document knowledge as a selectable overlay artifact |
| `agents/loading-discipline.md` | loading rule, linking to `knowledge.md` for answer-time behavior |
| `agents/zscaler/{prompt,workflow}.md`, `agents/investigator/{prompt,workflow}.md` | make the v1 reader trigger discoverable from required workflow content |
| `agents/investigator/{case-intake,harness}.md` | authorize bounded knowledge discovery through the existing Step 2 checkpoint/load gate |
| `agents/researcher/*`, `agents/auditor/*` | explicit exclusion statement only — no new modes |
| `references/_meta/layering-model.md` | Layer 3 now has a structured home |

---
title: "DAV-21 — automate.zscaler.com contract capture: proof + PR1"
date: "2026-06-16"
status: proof-accepted-pr1
scope: "Capture+parse the automate.zscaler.com per-operation API contract; reconcile vs SDK/TF to prove signal. PR1 = harness + parser + tests + 15-op ZPA subset."
---

# DAV-21 — automate.zscaler.com contract capture: proof + PR1

**Status:** proof accepted (GO); PR1 = reproducible proof artifact (capture harness +
parser + tests + 15-op ZPA subset). Reconciler and full sweep are later PRs.

## What this proves

The automate.zscaler.com OneAPI reference is the vendor's *actual* per-operation API
contract — field-level `required` / `readonly` / `enum`. It is not published as a
spec (no `openapi.json`; the schema is baked into Docusaurus JS), so it must be
rendered and read. The open question was never "can we capture it" but **"does the
captured contract, reconciled against the SDKs and the Terraform provider, surface
real divergences — or is it redundant?"** This proof answers yes.

## Method

15 ZPA operations across 5 resources (App Connector Group, Application Segment,
Server Group, Segment Group, Provisioning Key) × {create, update, get}, chosen for
maximum cross-family overlap (all 5 exist in Go SDK + TF + Postman + web reference).

- Capture: `scripts/automate-capture/capture.cjs` (headless Playwright). Persists a
  page only once it has fully rendered (method + path + `Responses` + the `curl`
  example) and the article text is stable across two reads; a partial render is
  retried once, then fails hard rather than being written. Only the contract region
  (everything before the multi-language code samples) is stored, keeping fixtures
  lean without losing anything the parser reads.
- Parse: `scripts/automate-capture/parse_contract.py` (deterministic, stdlib)
- Tests: `scripts/automate-capture/test_parse_contract.py` (15 cases across all 5
  resources — including the 204/no-response-schema update case and nested
  array/object types — all pass)

Artifacts committed by this PR:

- Raw text + provenance: `vendor/zscaler-help/automate-zscaler/api-reference/zpa/**`
  and `.../api-reference/provenance.json`
- Normalized contract: `vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json`
- Input record: `scripts/automate-capture/subset-urls.txt`

## Reconciliation findings (verified against vendored source)

The reconciler itself lands in PR2; the proof ran it against the same 15 ops and the
vendored Go SDK + Terraform provider. Every divergence below was confirmed by reading
the cited source.

### Headline — the numeric-as-string contract gap (tri-source confirmed)
The web contract types ZPA IDs (`id`, `geoLocationId`, `versionProfileId`,
`microtenantId`, `modifiedBy`, `creationTime`, `modifiedTime`) as `int64`/`int32`.
The Go SDK declares all of them `string`
(`vendor/zscaler-sdk-go/.../appconnectorgroup/zpa_app_connector_group.go`), and the
Terraform provider models `version_profile_id` as `schema.TypeString` with `.(string)`
casts (`vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go`). So the
contract is the *only* source claiming integer; everything that talks to the API treats
these as strings (the API serializes numeric IDs as JSON strings). 32 instances across
the 5 resources. Highest-value class — trusting the contract's type would be wrong.

### Required drift — the provider is stricter than the API (11)
TF enforces `Required` where the API marks the field optional: App Connector Group
`latitude` / `longitude` / `location`; Application Segment `domainNames` /
`serverGroups` / `zpnErId`; Server Group `appConnectorGroups` / `servers`; Provisioning
Key `maxUsage` / `zcomponentId`. One reverse case: Server Group `configSpace` is
`REQUIRED` in the contract but `Optional` in TF.

### Presence — each source carries fields the other lacks
Contract documents `city` / `ipAcl` / `upgradePriority` that the Go SDK struct omits;
the Go SDK exposes `readOnly` / `restrictionType` / `zscalerManaged` / `nameWithoutTrim`
/ `enrollmentCertId` beyond the contract.

### Enum — alignment is clean
8 enums match exactly across contract and TF (e.g. App Connector Group `dnsQueryType`
= `[IPV4_IPV6, IPV4, IPV6]`); 0 value-conflicts; 3 one-sided cases where TF adds a
validation the contract leaves open (e.g. `version_profile_id ∈ {0,1,2}`).

### False-positive accounting
One axis as first coded — readonly-vs-computed — was noisy: it flagged 34
"disagreements" that are all TF `Optional+Computed` (server-defaulted optionals), which
is not the contract's readonly concept. Narrowed to the 3 fields the contract actually
marks readonly, contract and TF agree 3/3. PR2's reconciler narrows this predicate;
after that, FP rate across all axes is ≈ 0.

## Verdict

GO. The pipeline captures cleanly (15/15), parses deterministically (15/15 tests), and
reconciles to real, explainable, source-verifiable divergences led by a genuinely
high-value class. This is the same content class `references/*/api-divergences.md` found
most valuable, now produced deterministically rather than by prose archaeology.

## Productionization plan

- **PR1 (this PR):** capture harness + parser + tests + 15-op ZPA proof subset.
- **PR2:** reconciler + report. Narrow the readonly/computed predicate; split enum
  one-sided from value-conflict. Conservative field matching only (exact JSON tags / TF
  keys; no fuzzy matching).
- **PR3:** full 1167-page sweep wired into `scripts/refresh-automate-zscaler.sh`; add the
  7th source family `automate-contract` to `scripts/l1_inventory.py`; source-precedence
  (contract > SDK for schema/field claims; SDK > contract for client behavior).

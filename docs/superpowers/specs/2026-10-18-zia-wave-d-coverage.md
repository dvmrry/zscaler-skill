# ZIA wave D: coverage record (API, SDK and Terraform references)

Eight legacy docs retired on 2026-10-18: `api.md`, `api-casb.md`, `api-divergences.md`, `api-schemas.md`,
`api-postman-schemas.md`, `legacy-endpoints.md`, `sdk.md` and `terraform.md` (all under `references/zia/`).

## How they were retired

- **Generated listings** (endpoint tables, schema field tables, Postman payloads, SDK method catalogs,
  Terraform argument tables) are replaced by the generated surface layer:
  `scripts/gen-surfaces.mjs` writes `references/_meta/surfaces/zia.json` from the pinned provider and SDKs and
  the captured OpenAPI spec, and `node scripts/kb.mjs surface <query>` looks it up. 177 of 203 Terraform
  resources and data sources link through their Go SDK packages to API operations; the other 26 call paths
  the captured contract does not have.
- **Behavior statements** in those docs (defaults, defects, version changes, gotchas, divergences) were
  extracted into claims, gaps and divergences, under the search-before-cut rule.
- **`api-casb.md`** and the narrative half of **`api.md`** were converted as topics.
- Nine workers wrote in parallel; additions to existing subjects came back as proposals, a consolidation
  pass set one home per fact by layer (`zia.api.*` API contract, `zia.sdk-python.*` / `zia.sdk-go.*`
  clients, `zia.terraform.*` provider, area subjects product behavior), cut proposals from 99 to 56, and the
  maintainer merged them serially. Four independent verifiers then checked every new item; their fixes
  are applied.

## New subjects

| Namespace | Subjects | Claims | Gaps | Divergences |
|---|---|---|---|---|
| `zia.api.*` | 11 | 63 | 5 | 7 |
| `zia.casb.*` | 10 | 121 | 15 | 1 |
| `zia.sdk-python.*` (with parent) | 12 | 91 | 5 | 1 |
| `zia.sdk-go.*` | 1 | 5 | 0 | 0 |
| `zia.terraform.*` (with parent) | 19 | 144 | 12 | 5 |

Plus 56 claims, gaps and divergences merged into 18 existing subjects (Cloud App Control, PAC files, URL
categories and filtering, DNS Control, DLP, sandbox, bandwidth, authentication, VSE, the reorder registry).

## Corrections the sources forced

- CASB: the legacy Insights log table invented ten columns (Conversation ID, Prompt/Response, Bucket Owner,
  Commit/File Path ...); a rule with no tenants applies to all tenants (not "does not run"); NSS VM allows 8
  feeds per server (not 16); rule order is documented as ascending, not first-match.
- API and SDKs: rate limits are documented (an Automate capture has the ZIA weight classes); the documented
  Python accessors in old samples do not exist; Go `devicegroups` is read-only; the Python SDK does define
  exception classes; the DNS gateway accessor really is misspelled; Go has CASB DLP/malware, custom file
  types and DNS gateways; the URL Filtering size quota is MB in the provider (KB only in a stale schema label
  and on the wire).
- Terraform: destroying a predefined firewall rule errors (not "silently ignored"); `risk_tolerance` is
  0–100 (not 1–5); admin rank is 0–7 with 0 highest; `zia_activation_status` is documented as not importable
  but registers an importer.

Ledger entries migrated: zia-49, zia-51, zia-52, zia-53, zia-54, zia-68, zia-72.

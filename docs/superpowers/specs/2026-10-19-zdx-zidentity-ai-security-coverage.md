# ZDX, ZIdentity, AI Security and the remaining products: coverage record

Fifty-three legacy docs retired on 2026-10-19, with fifteen `_claims-ledger.md` files:

- ZDX (13): `overview`, `cloud-architecture`, `score`, `applications`, `probes`, `administration`, `reports`,
  `devices`, `diagnostics-and-alerts`, `api`, `api-schemas`, `sdk`, `api-divergences`.
- ZIdentity (11): `overview`, `admin-rbac`, `step-up-authentication`, `users`, `user-entitlements`, `groups`,
  `api`, `sdk`, `api-divergences`, `api-clients`, `resource-servers`.
- AI Security (5): `overview`, `ai-guard`, `ai-guard-coverage`, `asset-management-api`, `api-divergences`.
- Zero Trust Browser (`zbi`, 3), Workflow Automation (`zwa`, 3), Business Insights (1), Cellular (2),
  Microsegmentation (2), EASM (3).
- One overview each for Zero Trust Branch, Risk360, Experience Center (`unified`), UVM, SOC Workbench, DSPM,
  AEM, Identity Protection, Breach Predictor and Deception.

The products' `index.md` files stay until the index pass.

## How

The generated layer came first. `scripts/gen-surfaces.mjs` no longer assumes a spec, Go SDK or Terraform
provider, and now covers `zdx`, `zid`, `aiguard`, `aisec` (spec only), `bi` (Business Insights: the Python
SDK's `zbi`, which is not the KB's Zero Trust Browser), `easm`, `zcell`, `zwa`, `zms`, `ztb` and `zins`. Go
packages that build paths from constants and `fmt.Sprintf` are resolved; Python bases held in any attribute
are recognised (which also added three ZPA LSS endpoints and full Cloud & Branch Connector paths).

Eight workers converted the docs in one batch, each owning its docs and namespace (ZDX and ZIdentity split
in two by area). Instead of a cross-review round, the maintainer read every Tier B claim, divergence and
correction and checked corrections against their sources; one fresh agent closed the 35 facts the ZDX and
ZIdentity workers had handed to each other (19 added, 12 already held, 1 duplicate removed, 3 left for
shared subjects); and the claim audit read every new Tier A claim (below). Seven proposals were merged into
`shared.oneapi.authentication` and `shared.secret-surfaces.revealed`.

119 subjects, 1,019 claims (130 Tier B), 200 gaps, 53 divergences:

| Product | Subjects | Claims | Gaps | Divergences |
|---|---|---|---|---|
| ZDX | 34 | 228 | 60 | 14 |
| ZIdentity | 21 | 185 | 39 | 10 |
| AI Security | 12 | 116 | 28 | 5 |
| Zero Trust Browser | 8 | 46 | 24 | 0 |
| Workflow Automation | 5 | 55 | 6 | 6 |
| Business Insights | 2 | 19 | 2 | 0 |
| Cellular | 8 | 59 | 8 | 7 |
| Microsegmentation | 7 | 94 | 15 | 2 |
| EASM | 4 | 37 | 3 | 5 |
| Ten single-overview products | 18 | 180 | 15 | 4 |

The claim audit (Ling 3.0 Flash, two reads plus a third where both passed; $0.34) flagged 226 of the 867 new
Tier A claims, and 12 of the 26 added afterwards. Four fresh fixers resolved all 244 flags (183 quoted, 45
narrowed, 6 moved to Tier B, 1 to a gap, 9 left on their locator with the reason recorded); among them three
ZDX Go claims were corrected (re-authentication reuses an unexpired cached token; some device reads take an
integer ID; `TraceID` sits on `DeepTraceSession`).

27 help pages were captured (manifest updated); many single-product pages had changed since the legacy docs
cited them, and statements no current page holds became gaps.

## Findings worth knowing (selected)

- ZDX has a configuration API (`/v1/config`: applications, monitors, collections, live tracing) that no SDK
  calls; the legacy docs called ZDX configuration portal-only. Probe frequency is per probe (default 300
  seconds in the contract); user reads carry a score and coordinates; `limit` defaults to 1000.
- ZDX score bands are 66/34 in the help and the Python docstring, 80/50 in the MCP server's prompt.
- ZIdentity step-up levels: a parent level is the stronger one (its validity must be shorter than its
  sub-levels'); the legacy doc had the tree upside down. One help page says step-up is OIDC-only, another
  recommends OIDC: a divergence.
- ZIdentity has custom roles (the legacy doc said four system roles), 18 permission modules and five levels;
  group sources are UI, API, SCIM and JIT (`MANUAL` is only a Python docstring example); a group has no
  enabled flag.
- Go does manage ZIdentity API clients and secrets (`api_clients`); resource servers are read-only in the
  contract.
- AI Guard's ZIA proxy chain host is `forward.prod.zsaiguard.net:9443`.
- Several Python SDK response models lose multi-word keys after the response camel-casing (ZDX, ZIdentity),
  and the ZWA Go client puts the incident ID after the action in notes and tickets paths.
- Most divergences in Cellular, ZMS and EASM are between the MCP server's tool documentation and its code.

Ledger: 118 entries migrated (`zdx-*`, `zid-*`, `ai-security-*`, `zbi-*`, `zwa-*`, `business-insights-01`,
`zscaler-cellular-*`, `zms-01`, `easm-*`, and the single-product entries): gaps carry them in `former_ids`;
entries answered by a claim are listed in the migrated paragraph. `zid-26` records a decision about this
skill's snapshot writer and stays in the ledger.

## Left open

- `vendor/zguard-ai-integrations` is vendored but not a registered source; `ai-security.ai-guard.integrations`
  is all gaps until it is.
- The Python SDK's request and response camel-casing and its JMESPath and paging helpers are SDK-wide
  mechanisms held per product (`zia.sdk-python.*`, `zcc.sdk-python.wire-keys`); a shared Python SDK subject
  would be their home. Which Go OneAPI exits bypass `ErrorResponse` belongs in
  `shared.sdk-go.request-handling`.
- `aem.secops-platform` holds Agentic SecOps facts shared by AEM, UVM, Agentic SOC and Identity Protection; a
  `secops` scope may be its better home.

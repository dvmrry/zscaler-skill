# Shared and Cloud & Branch Connector: coverage record

Fifty legacy docs retired on 2026-10-19: 30 under `references/shared/` (`oneapi`, `legacy-api`,
`analytics-graphql`, `event-monitoring`, `zsdk`, `mcp-server`, `terraform`, `secret-bearing-api-surfaces`,
`activation`, `admin-rbac`, `audit-logs`, `scim-provisioning`, `cloud-architecture`, `subclouds`, `terminology`,
`policy-evaluation`, `gre-tunnels`, `ipsec-tunnels`, `z-tunnel`, `pac-files`, `source-ip-anchoring`,
`multi-cluster-load-sharing`, `nss-architecture`, `log-export-architecture`, `siem-log-mapping`,
`log-correlation`, `splunk-queries`, `device-posture`, `m365-conditional-access`,
`cross-product-integrations`) plus the shared `_claims-ledger.md`, and 19 under `references/cloud-connector/`
(`overview`, `regions`, `forwarding`, `dns-subsystem`, `aws-deployment`, `gcp-zero-trust-gateway`,
`azure-deployment`, `gcp-deployment`, `aws-workload-discovery`, `source-ip-groups`, `zero-trust-sdwan`, `nss-va`,
`logs/log-schema`, `insights-monitoring`, `upgrade-and-credential-rotation`, `api`, `api-divergences`, `sdk`,
`terraform`). Both `index.md` files stay until the index pass.

## How

The generated layer came first. `scripts/gen-surfaces.mjs` covers Cloud & Branch Connector as product `ztw` (96
API paths, 29 Go packages, 20 Python modules, 37 Terraform types with every argument), and now strips Go comments
before reading packages, so commented-out functions are no longer listed as live (the ZIA surface lost the
disabled IPS signature import and two commented endpoints). `scripts/gen-log-types.mjs` generates the six
Cloud & Branch Connector NSS log types (`ztw/session-log`, `dns-log`, `event-log`, `metrics-vm-log`,
`metrics-instance-log`, `metrics-resource-log`; 241 fields) from four captured output-format articles.

Sixteen workers converted the docs in parallel, each owning its docs and namespace. Each then verified another
worker's output (every Tier B claim, divergence, gap, held row and Dropped or Corrected row, a fifth of the
Tier A claims, duplicates, prose: 246 findings), the claim audit (Ling 3.0 Flash, two reads plus a third where
both passed; $0.24) read all 1,262 new Tier A claims, and the authors fixed both in one round (570 items: 255
quoted, 138 fixed, 81 narrowed, 35 duplicates removed, 26 drops restored as gaps, 10 moved to Tier B, 11 rejected
with a reason). The maintainer merged 37 proposals into existing subjects and chose the one home for every
duplicate between workers.

190 subjects: shared 93 (621 claims, 145 gaps, 12 divergences), Cloud & Branch Connector 97 (809 claims, 136
gaps, 33 divergences). 32 help pages were captured (manifest updated).

## Gates added with this wave

- `kb.mjs validate` rejects a Tier B, C or D claim without `conditions`, and a Tier A claim derived from a
  non-Tier-A claim.
- The cheap claim audit runs per wave (outside the repo, in the audit bench): tasks for every Tier A claim new or
  changed since a git ref, two samples plus a third where both pass, a worklist joined with lint findings.

## Findings worth knowing (selected)

- ZIA keeps logs 180 days in the Nanolog (legacy: 14); ZPA audit logs are kept 6 months (legacy: 14 days).
- Cloud & Branch Connector writes its own NSS log types; session records do not carry ZIA firewall fields
  (`clt_src_ip`, `rdrrulename`).
- The API contract lists eleven Cloud & Branch Connector DNS rule actions; the Terraform resource accepts four.
- FedRAMP OneAPI hosts: the help page names `api.zscaler.us`/`.net`, both SDKs use `api.zscalergov.net`/`.us`.
- `/status/activate` allows 10 POSTs a minute and 40 an hour; ZDX rate-limit headers are `x-ratelimit-*`.
- VM-based NSS supports HTTP(S) as well as TCP; Duplicate Logs sets where replay starts, it is not at-least-once
  delivery.
- Help and the Zscaler deployment modules disagree on several defaults (GCP Health Monitor windows, Azure scale
  window, AWS GWLB probe interval, AWS small instance types); each is a divergence.
- `zpa.scim.api-surface:no-sdk-writes` was wrong at the pin (the Go `scim_api` package writes users and groups)
  and is narrowed to the management packages; `zia.casb.insights-logs:nss-vm-limits` was scoped to the Cloud &
  Branch Connector section of the limits page it quotes.

Ledger: 64 entries migrated (`shared-06`–`shared-40` except `shared-38`, already migrated; `cloud-connector-01`–`29`;
`log-22`): gaps carry them in `former_ids`; `shared-28` and `cloud-connector-07` are answered by claims.
`shared-01`–`shared-05` record decisions about this skill's own tooling, not product behavior, and stay in the
ledger.

## Left open

- Help captures to fetch: "About Upgrade Manager" and "Insights Logs Filters" (Cloud & Branch Connector), ZIA
  "Adding NSS Servers", and the two release-summary captures that hold only their introduction.
- `vendor/zscaler-terraformer` and `vendor/zscaler-terraform-skills` are vendored but not registered sources;
  statements resting only on them are gaps.
- The audit's third read flagged 60 claims the first two passed; they go to a follow-up pass.

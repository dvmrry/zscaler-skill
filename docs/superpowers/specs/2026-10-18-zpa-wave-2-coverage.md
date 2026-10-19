# ZPA wave 2: coverage record

Seventeen legacy docs retired on 2026-10-18 (all under `references/zpa/`): `api`, `api-schemas`,
`api-postman-schemas`, `api-divergences`, `legacy-endpoints`, `sdk`, `terraform`, and the ten log schema docs
under `logs/` (`access-log-schema`, `user-status-log-schema`, `browser-access-log-schema`,
`microsegmentation-flow-log-schema`, `app-connector-status`, `app-connector-metrics`,
`private-service-edge-status`, `private-service-edge-metrics`, `private-cloud-controller-status`,
`private-cloud-controller-metrics`). `references/zpa/index.md` stays until the ZPA index is converted.

## How

Eight workers extracted the docs in parallel at the old code pins, each with a coverage table, an anchor map and
a ledger mapping; a consolidation pass merged eight overlapping subjects and moved claims so each fact has one
home. The code pins were then moved to the newest releases (Go SDK v3.8.55, Python SDK v1.11.2, ZPA provider
v4.4.14) and every claim citing changed code was re-checked. Six independent verifiers then checked the wave at
the new pins: every Tier B claim, divergence and gap, most Tier A claims, every **Dropped** or **Corrected**
row, and the claims added to wave 1 subjects. Six fixers applied their lists, re-checking each item; the
maintainer spot-checked each verifier's main findings and the riskiest fixes against the sources.

54 subjects: 473 claims, 83 gaps, 65 divergences, in `zpa.api.*` (the contract, one `-wire` subject per area),
`zpa.sdk-python.*`, `zpa.terraform.*` and `zpa.logs.*`, with hubs `zpa.api`, `zpa.sdk-python` and
`zpa.terraform`. About 40 more items went into wave 1 subjects.

## Model changes the verification forced

- **Log types read the vendor's default templates.** The LSS API article's log-formats example gives the
  default tsv, csv and json template for every log type. `scripts/gen-log-types.mjs` now records, per field, how
  the default template writes it (`default_format`) and the type the json template emits, and adds fields only
  the template writes. The field tables and the templates disagree in places (`TimestampUnAuthnetication` vs
  `TimestampUnAuthentication`, `HostStartTime` vs `HostUpTime`, `PRAConsolesPolicyID` vs
  `PRACapabilityPolicyID`; audit log fields go out under PascalCase JSON keys); those are divergences in the
  `zpa.logs.*` subjects.
- **The Terraform surface carries every argument.** Authors had dropped argument, enum and environment-variable
  tables as "generated" when the surface held only files, SDK packages and API paths. `scripts/tf-schema.go`
  parses each provider with `go/ast` (stdlib only, no network) and interprets the schema-building functions:
  statements run in order with parameters bound, so helper functions, merges, constants, fields set after
  construction and deletes all count. It records type, required/optional/computed, ForceNew, defaults,
  deprecation, enum values and other validators (also on list elements), nested blocks, StateFunc,
  ConfigMode, plan-time CustomizeDiff checks, and the provider's own settings with their environment
  variables. ZIA: 204 types, ZPA: 126, nothing unresolved. A first version that pattern-matched literals
  missed a data source built in a local and 55 fields set after construction; an independent re-evaluation
  found them, and the interpreter replaced it. A commented-out provider registration
  (`zpa_browser_protection`) is no longer listed. The same re-evaluation checked every Terraform schema fact
  stated in the graph against the schema and fixed about a dozen (resource names, v1-only arguments, string
  vs integer types).

## Corrections the sources forced (selected)

- The Python SDK camel-cases every request body and every response key in its executor, so wire keys follow
  that path, not a model's `request_format`: `version_profile_gid` goes out as `versionProfileGid` and is never
  read back; provisioning-key `max_usage` works and only `component_id` goes wrong; a machine-group list does
  send `microtenantId`.
- The Python legacy client ignores `ZPA_CLOUD` (it reads `ZSCALER_CLOUD`, default PRODUCTION); the README says
  otherwise. The response wrapper's ZPA page-size clamp is computed but never sent.
- ZPA provider v4.4.14 rejects any segment group `applications` change at plan time and deprecates the
  argument; the old silent-drift gap is now version-scoped.
- The contract's `controlChannelStatus` enum is UNKNOWN, ZPN_STATUS_AUTHENTICATED and ZPN_STATUS_DISCONNECTED;
  the `lssPort` is a string in the help API article and an integer only in the OpenAPI document.
- Dropped legacy statements restored: the Python browser-protection CLIENT_TYPE injection, the bulk-console
  executor bypass, the provider's credential environment variables, the `zpn_trans_log` filter codes, and the
  OpenAPI connector status enums.

Ledger: 21 `zpa-*` and `log-*` entries migrated (gaps carry them in `former_ids`; zpa-21, zpa-24, zpa-76 and
zpa-84 are answered by claims). Still open: zpa-09 and zpa-10 (Terraform enum asymmetries the new surface can
now settle), zpa-73 to zpa-75 (retired snapshot schema), log-21 (ZCC) and log-22 (Cloud Connector).

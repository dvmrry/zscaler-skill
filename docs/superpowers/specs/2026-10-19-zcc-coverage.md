# ZCC: coverage record

Twenty-seven legacy docs retired on 2026-10-19 (all under `references/zcc/`): `forwarding-profiles`,
`forwarding-profile`, `z-tunnel`, `trusted-networks`, `web-policy`, `web-privacy`, `acceptable-use-policy`,
`entitlements`, `devices`, `device-posture`, `otp`, `support-options`, `install-parameters`,
`macos-install-customization`, `azure-vm-deployment`, `firefox-integration`, `ssl-inspection-zcc`,
`end-user-notifications`, `user-logging-controls`, `troubleshooting`, `logs/zcc-log-schema`, `api`,
`api-rate-limits`, `api-schemas`, `api-divergences`, `sdk` and `terraform`. `references/zcc/index.md` stays until
the index pass.

## How

The generated layer came first: `scripts/gen-surfaces.mjs` covers ZCC (49 API paths, 24 Go packages, 15 Python
modules, 23 Terraform types with every argument). The ZCC provider is a Plugin Framework provider, so
`scripts/tf-schema.go` learned to read Framework schemas (types discovered from `Resources()`/`DataSources()`,
named by `Metadata`, read from `Schema`), closures and loops over literal slices. Seven workers then converted
the docs in parallel (one wave: area, install, notifications and logging, API, SDK and Terraform), a
consolidation pass merged eight subjects and moved 106 items so each fact has one home, seven independent verifiers checked every Tier
B claim, divergence, gap and Dropped or Corrected row plus most Tier A claims, and seven fixers applied the
findings by subject ownership.

98 subjects: 733 claims, 189 gaps, 30 divergences, in `zcc.forwarding-profiles`, `.z-tunnel`,
`.trusted-networks`, `.app-profiles`, `.entitlements`, `.web-privacy`, `.acceptable-use`, `.devices`,
`.device-posture`, `.passwords-and-otp`, `.support-options`, `.install`, `.firefox`, `.ssl-inspection`,
`.notifications`, `.logging`, `.logs`, `.troubleshooting`, `zcc.api.*` (the contract, one `-wire` subject per
area, hub `zcc.api`), `zcc.sdk-python.*`, `zcc.sdk-go.*` and `zcc.terraform.*`. ZCC has no generated log type: no
captured help article has a field table for a ZCC log.

## Sources the verifiers found

- **Recorded vendor traffic.** The Python SDK ships VCR cassettes of live responses from a test tenant
  (`tests/integration/zcc/cassettes/`) and UI-captured web policy payloads (`tests/unit/zcc/fixtures/`); the Go SDK
  has UI-captured defaults. They settle or narrow about a dozen divergences and gaps (wire types of device
  `state`/`type`, the forwarding-profile ZPA latency keys, `evaluateTrustedNetwork` in listings, the trusted
  network v1 envelope, the device-details shape). Claims citing them carry the condition "one test tenant".

## Findings worth knowing (selected)

- The Python SDK camel-cases ZCC request bodies on both clients (the OneAPI client exempts
  `WebPolicy.SNAKE_CASE_KEYS`), and every query parameter key; claims about Python wire keys are scoped to the
  client.
- The Python legacy client's local rate-limit counter raises AttributeError, not its ValueError messages;
  `get_company_info`, `remove_devices` and `force_remove_devices` wrap results twice and drop most fields.
- The Go SDK loads `ZSCALER_PRIVATE_KEY` itself, so a key in the environment wins over an HCL secret in the
  ZCC provider; the provider replaces an explicit 0 for retries and timeout with 100 and 240 seconds.
- App profile rules apply in ascending precedence, but a profile matching both the user group and the device
  group wins regardless of rule order (longest match).
- Forwarding profiles set one of four Internet & SaaS actions per network type (Tunnel, Tunnel with Local
  Proxy, Enforce Proxy, None), separately from the Private Access action.
- Notification templates work only on Client Connector 4.8 and later for Windows; older clients get the Legacy
  Notification Settings template whatever the profile selects.

Ledger: 101 `zcc-*` entries and `log-21` migrated (93 gaps carry them in `former_ids`; zcc-12, 14, 33, 35, 58,
68, 86 and 99 are answered by claims). Still open in the ledger: `log-22` (Cloud Connector).

## Evidence standard

The claim-audit calibration run alongside this wave showed that a strictly literal reading fails about two
thirds of verified Tier A claims, mostly on locators. The design spec now states what Tier A evidence must
cover (material parts quoted; locators may come from where the quote sits), and the conversion briefs carry it.

# PLAN — zscaler-skill

**Purpose of this file:** crash-recovery artifact. If the session dies, read this to know what the project is, what's been done, and what's next without reconstructing from a 99MB transcript.

Last updated: 2026-04-24 (seventh pass — architectural components build-out: PAC / Locations / Device Posture / Firewall / Browser Access / PRA / Subclouds / NSS).

## TL;DR for new fork admins

If you just forked this and are here because [`README.md`](./README.md) step 2 said to read PLAN.md, the parts you actually need to know:

1. **The skill is feature-complete as a knowledge/reasoning artifact.** All `references/` docs are drafted and cited; `SKILL.md` routes to them; `evals/evals.json` exercises them. You can hand the skill to Claude and get useful answers about Zscaler policy evaluation today, with no further work.
2. **Scope: eight products + architectural layer.** Products covered: ZIA, ZPA, ZCC (Client Connector), ZDX (Digital Experience), ZBI (Cloud Browser Isolation), ZIdentity (unified auth + OneAPI + step-up), Cloud & Branch Connector (ZTW/ZTC/CBC), ZWA (Workflow Automation — DLP incidents). Architectural layer covered: policy evaluation, cloud architecture (Central Authority + Service Edges + BC Cloud), SIPA, SCIM, PAC files, Locations/sublocations/Location Groups, Device Posture, Firewall Control (Filtering/NAT/DNS/IPS), Browser Access, Privileged Remote Access, Subclouds, NSS architecture. **Out of scope:** ZMS, ZINS, EASM, ZAI Guard (vendored in SDKs, not written up), Federal Cloud (deferred — tenant signal pending).
3. **`snapshot/` is empty on purpose.** The public repo ships it empty so the fork doesn't inherit somebody else's tenant data. Run `scripts/snapshot-refresh.py` once your credentials are set up (README step 5) and commit the output to your internal fork. Script now dumps ZIA + ZPA + ZCC (use `--zia-only` / `--zpa-only` / `--zcc-only` to scope). Without a snapshot, the skill falls back to general answers for tenant-specific questions — still useful, just hedged.
4. **5 of 8 scripts are scaffolds, not functional code.** Only `url-lookup.py` and `snapshot-refresh.py` are complete end-to-end. The other five (`access-check.py`, `ssl-audit.py`, `sandbox-check.py`, `connector-health.py`, `zpa-app-check.py`) have docstrings, argument parsing, auth wiring, and logical structure but leave TODOs where live-API response shape needs confirmation. First-run-against-real-tenant is where those TODOs become tractable.
5. **Known API / documentation blind spots** — all have operator-level workarounds documented:
   - **Malware Protection and ATP block diagnosis** — no API, console-only (workflow codified in `references/zia/malware-and-atp.md`).
   - **Snapshot schema docs** — deferred until post-fork (decided; see §4 below).
   - **Z-Tunnel wire-format protocol internals** — permanently deferred after targeted search confirmed no public docs (operational layer codified in `references/zcc/z-tunnel.md`).
   - **ZCC int-enum semantic mappings** (`zcc-01` through `zcc-04`, `zcc-06`) — datatype resolved via Go SDK; integer-to-meaning mapping pending first tenant snapshot.
   - **Lab-testable clarifications** (6 remaining) — see §Pending lab tests.
6. **Rest of this document is the roadmap and the audit trail** — skim §7-step roadmap and subsequent ✅-DONE sections to see what's been built; skip to §Pending lab tests, §Known findings, and **§Priority recommendation for next session** for work you might want to pick up.

## Goal

Build a Claude skill that lets engineers and non-technical users ask questions about the user's Zscaler environment and get usable, sourced, confidence-scored answers across the full product suite — ZIA, ZPA, ZCC, ZDX, ZBI, ZIdentity, Cloud & Branch Connector, ZWA — plus the cross-cutting architectural concerns (policy evaluation, cloud architecture, PAC, Locations, Device Posture, Firewall, SIPA, SCIM, Subclouds, NSS, Browser Access, PRA). The skill's distinguishing value is **codified reasoning** about rule precedence, wildcard semantics, SSL inspection ordering, policy evaluation, and cross-product interactions — because Zscaler's own docs + MCP tools don't codify this, and raw LLMs hallucinate on precedence questions.

This repo is designed to be **forked privately to run against a real tenant**. The public upstream ships empty `snapshot/` and `logs/` directories; private forks populate them with tenant-specific data that never flows back upstream. Design decisions favor concrete operator workflows over general reusability — the pattern works best when one team owns the fork and can pin it to their environment.

## Durable state pointers (read these first)

| File | What it is |
|---|---|
| `SKILL.md` | Anthropic-canonical skill entrypoint — extensive question-routing table |
| `references/_clarifications.md` | **Canonical index** of open/partial/resolved ambiguities with sources. Status summary near the top is the quick-scan view (18 resolved / 6 partial / 1 investigating / 7 open as of 2026-04-24). |
| `references/zia/*.md`, `references/zpa/*.md`, `references/zcc/*.md`, `references/zdx/*.md`, `references/zbi/*.md`, `references/zidentity/*.md`, `references/cloud-connector/*.md`, `references/zwa/*.md`, `references/shared/*.md` | Distilled reference docs; each cites vendored sources and links to `_clarifications.md` by ID |
| `vendor/zscaler-help/README.md` | Drop convention, workflow, refresh instructions for the pinned bibliography |
| `vendor/zscaler-help/*.pdf`, `vendor/zscaler-help/*.md` | Pinned bibliography — every reference doc cites something here |
| `scripts/url-lookup.py`, `scripts/snapshot-refresh.py`, `scripts/splunk-query.sh` | Tooling scaffolds (Python via `uv run --script`). `snapshot-refresh.py` covers ZIA + ZPA + ZCC. |
| `evals/evals.json` | Skill eval prompts (14 canonical Q→A prompts with structured assertions, must_cite_files, must_not_say traps) |
| `snapshot/` | Where tenant snapshot JSON lands after fork (currently empty + `.gitkeep`) |

## 7-step roadmap — state

### 1. Citation audit ✅ DONE (2026-04-23)
- 7 uncited vendor PDFs identified and deleted (4 empty checklists, 1 ZPA AI-Recommendations UI walkthrough + its exact-content duplicate, 1 generic SSL/TLS primer).
- Vendor pile now 27 PDFs + 6 markdown captures, 100% cited.

### 2. Open-clarifications sweep ✅ MATERIALLY DONE (2026-04-23)
- **18 fully resolved** (see `_clarifications.md § Resolved`). After 2026-04-24 cleanup pass: added `shared-01`, `shared-02`, `shared-04`, `shared-05` (design decisions codified), and `zpa-07` (Deception docs captured).
- **6 partially resolved** — each with doc-backed answer plus a narrow gap that needs lab/operator data.
- **1 investigating** (`zpa-01` — schema shape evidence, awaiting doc or lab confirmation).
- **7 remain open** — 6 lab-testable (see §Pending lab tests below), 1 NSS-timezone-multi-region (`log-03`, technically lab-testable).
- Three rounds of help-doc reading (including Playwright captures). Verdict: help docs are exhausted; further resolution requires lab tests, operator experience, or design decisions.

### 3. SDK-driven `api.md` upgrade ✅ DONE (2026-04-23)
- `references/zia/api.md` and `references/zpa/api.md` upgraded with SDK-mined findings across URL categories, URL filtering rules, CAC, SSL inspection, advanced settings, Cloud NSS, tenancy restriction, app segments, segment groups, app connector groups, access policy, LSS.
- **Behavioral findings threaded into the corresponding reasoning docs:**
  - `references/zia/url-filtering.md` — `urlCategories` AND `urlCategories2` AND-semantic; extended action enum; `block_override`/`override_users` conditional dependency; regex patterns in custom categories; CIPA 4-way mutual exclusion; `enable_evaluate_policy_on_global_ssl_bypass` security toggle.
  - `references/zia/cloud-app-control.md` — per-app lifecycle flags (`deprecated`/`misc`/`app_not_ready`/`under_migration`/`app_cat_modified`); 16-app Tenant Profile list; Microsoft Login Services v1 vs v2 toggle; per-rule `cascading_enabled`.
  - `references/zia/ssl-inspection.md` — `platforms` enum (`SCAN_IOS`…`NO_CLIENT_CONNECTOR`); `road_warrior_for_kerberos`; nested action object with conditional `decryptSubActions` vs `doNotDecryptSubActions`; `zpa_app_segments` cross-product reference; `default_rule`/`predefined` markers.
  - `references/zpa/app-segments.md` — `enabled` defaults to True; dual port-range formats; `inspect_traffic_with_zia`; governance flags.
  - `references/zpa/policy-precedence.md` — `reauth_timeout` vs `reauth_idle_timeout`; conditional `zpn_isolation_profile_id`/`zpn_inspection_profile_id`; Operand `values` vs `entry_values` mutually exclusive; `credential`/`credential_pool` for PRA.
- **Tenancy Restriction**: SDK authoritative list (16 app types) propagated to `zia-08` clarification; help article's 13-app list marked stale.

### 4. Snapshot schema docs ⏸ DEFERRED until post-fork (decided 2026-04-23)
- Rationale: writing schema docs pre-fork risks describing a structure `snapshot-refresh.py` doesn't actually emit the way the SDK models suggest. Real tenant output is the authoritative reference.
- When the fork's first `snapshot-refresh.py` run produces output, return here and write `references/zia/snapshot-schema.md` + `references/zpa/snapshot-schema.md` from **real examples** — anonymized excerpts, wire-format (camelCase) key tables, and jq cheatsheets for common skill operations.
- Gap to manage in the meantime: `api.md` uses SDK snake_case in most places; snapshot JSON will be camelCase. Skill operators hitting the JSON directly need to translate mentally. If that friction shows up before the fork runs, fall back to option (B) from the discussion — a short wire-format-key table appended to each `api.md`.

### 5. TF provider schema mining ✅ DONE (2026-04-23)
- Mined `vendor/terraform-provider-zia/zia/resource_*.go` and `vendor/terraform-provider-zpa/zpa/resource_*.go` for ForceNew, ValidateFunc, ConflictsWith, ExactlyOneOf, MaxItems, DiffSuppressFunc, Sensitive attributes.
- **Findings threaded into reference docs:**
  - `references/terraform.md` — new "Schema patterns worth knowing" section: DiffSuppress patterns (multi-line text normalization, coordinate precision), ForceNew catalog for ZIA and ZPA, programmatic constraints not visible in schema (Browser Access mutual-exclusion, Server Group servers-required-when-dynamic-discovery-false), schema-level mutual exclusions (ExactlyOneOf / RequiredWith / ConflictsWith).
  - `references/zia/api.md` — URL Filtering `rank` range 0-7, `time_quota` 15-600 min / `size_quota` 10-100000 KB; URL Categories `url_type` EXACT/REGEX, `type` URL_CATEGORY/TLD_CATEGORY/ALL, scope types; full 21-value `nss_log_type` enum + `siem_type` including S3; VPN credential ForceNew fields + Sensitive PSK; DLP/security/auth/file-type-control MaxItems and size limits.
  - `references/zpa/api.md` — `select_connector_close_to_app` ForceNew; `bypass_type` includes `ON_NET`; `icmp_access_type` enum; `tcp_keep_alive` string-enum; PRA `VM_CONNECT`; Browser Access programmatic constraint; `credential`/`credential_pool` ExactlyOneOf; reauth_timeout/reauth_idle_timeout ForceNew; v2 policy 19-value object_type enum; forwarding/inspection rule action enums including `INTERCEPT_ACCESSIBLE` and `BYPASS_INSPECT`; LSS 9-value source_log_type; App Connector Group `-el8` version tracks + `ip_anchor_type` enum; Server Group programmatic servers-required constraint; Service Edge Group grace_distance triplet.
  - `references/zpa/policy-precedence.md` — reauth ForceNew correction (updates the earlier SDK-only threading with the TF-visible destroy-recreate implication).
  - `references/zpa/app-segments.md` — select_connector_close_to_app immutability, bypass_type `ON_NET`, icmp_access_type enum, tcp_keep_alive string-as-bool.
- **Corrections made**: the earlier SDK-only pass on `reauth_timeout` / `reauth_idle_timeout` described them as plain fields with `None` default; TF reveals they are immutable at the API layer. Operational implications significantly different.

### 6. MCP server sweep ✅ DONE (2026-04-23)
- Mined 13 in-scope commands + 9 ZIA/ZPA/cross-product skills (27 total minus ZDX/ZINS/ZMS/EASM which were out of scope). `investigate-url` was already distilled pre-fork into `scripts/url-lookup.py`.
- **New reference docs** (filling gaps the earlier help-doc sweep didn't):
  - `references/shared/activation.md` — ZIA activation gate (staged-vs-live config; pending-state pre-check for any troubleshooting flow). ZPA contrast noted.
  - `references/zia/sandbox.md` — Basic vs Advanced tiers, SSL-bypass prerequisite, static-analysis fast-path, three quarantine edge cases (one-time URLs, dynamic hashes, PSE cache lag), blocked-policy-type discriminator (Sandbox / Malware Protection / ATP — the last two have NO API coverage).
- **Threading into existing docs:**
  - `references/zia/ssl-inspection.md` — new "SSL bypass is a cross-policy gate" section listing which downstream features it breaks (DLP, Sandbox, Malware, File Type, ATP content rules, cert-pinned apps); new "Audit rubric for SSL bypass rules" with CRITICAL/HIGH/MEDIUM/LOW classification distilled from the MCP SSL audit skill.
  - `references/zpa/policy-precedence.md` — new "ZPA policy families and their evaluation order" section (Forwarding → Access → Timeout → Inspection), empty-conditions = global rule warning, timeout-value wire format (strings not ints), posture-based timeout tiering, condition AND/OR semantics (AND across blocks, OR within), PLATFORM `"true"`/`"false"` strings, RISK_FACTOR_TYPE as ZIA↔ZPA cross-product hook.
  - `references/zia/index.md` — added sandbox.md to topic list.
- **New scripts scaffolded** (all five from the MCP-distilled workflow list; each with env-driven auth, MCP-sourced reasoning in the docstring, and clearly-marked TODOs where live-API response shape needs confirmation post-fork):
  - `scripts/access-check.py` — walks the full ZIA policy chain (SSL → URL Filtering → CAC → DLP → Firewall) for a (user, URL) pair; reports per-layer verdict with DLP-ineffective-when-SSL-bypassed flagging; pre-checks activation status.
  - `scripts/connector-health.py` — ZPA App Connector health: provisioning-key usage (#1 enrollment failure cause), runtime status, version lag, cert expiry, VM-clone signal.
  - `scripts/ssl-audit.py` — enumerates SSL Inspection rules; classifies each by risk (CRITICAL/HIGH/MEDIUM/LOW) per the rubric in `ssl-inspection.md`; flags predefined rules (cannot be deleted via API), disabled rules (still hold order slots), transparent-forwarding over-exemption; supports `--min-risk`, `--forwarding`, `--with-dlp` flags.
  - `scripts/sandbox-check.py` — Sandbox diagnosis for an MD5 hash and/or source URL; detects static-analysis fast-path, SSL-bypass-prevents-Sandbox, Basic-vs-Advanced tier mismatch; surfaces the "Malware Protection / ATP have no API coverage" limitation explicitly.
  - `scripts/zpa-app-check.py` — walks ZPA onboarding chain for an FQDN: matching segments (with specificity ranking), port coverage, server-group + connector-group dependencies, microtenant flags, access-policy coverage; reports "default-deny will block everyone" gaps.
- **Known gaps documented** (rather than opening new clarifications): Malware Protection and ATP block diagnosis have NO API surface per the MCP `investigate-sandbox` skill — both `references/zia/sandbox.md` and the skill's operational answers should direct users to the ZIA Admin Console rather than attempt API diagnosis.

### 8. ZCC scope extension ✅ DONE (2026-04-24, follow-up round)

Product scope extended from ZIA+ZPA to ZIA+ZPA+ZCC after QA review surfaced that ZCC's forwarding profile and trusted-network evaluation are the client-side foundation every ZIA/ZPA answer leans on. New material:

- **`references/zcc/`** directory created with initial 4 docs (first pass 2026-04-24), then extended to 7 docs later same day:
  - `index.md` — topic map, what-is-covered / what-isn't
  - `forwarding-profile.md` — per-network-type action branches (TRUSTED/UNTRUSTED), ZIA actions vs ZPA actions, Z-Tunnel/PAC/NONE action types, fail-open policy, captive-portal grace period
  - `trusted-networks.md` — criteria fields (DNS, SSID, DHCP, subnet, egress IP), CSV wire format, AND/OR combination semantics (inferred)
  - `api.md` — `/zcc/papi/public/v1` endpoint prefix, service surface by module, wire-format quirks (WebPolicy snake_case exception, trustedNetworkContracts wrapping)
  - `web-policy.md` — (second pass) on-device policy: PAC URL, per-platform sub-policies (Windows/macOS/Linux/iOS/Android), uninstall protection, Disaster Recovery, On-Net policy, **the `forwarding_profile_id` link that answers `zcc-07`**
  - `web-privacy.md` — (second pass) telemetry / log-collection flags; `collect_zdx_location` dual-source with entitlements
  - `devices.md` — (second pass) inventory, Device state fields, remove vs force-remove, VM-cloning fingerprint pattern, device cleanup, CSV downloads
  - `entitlements.md` — (second pass) ZPA and ZDX group entitlements; `zpa_enable_for_all` trump card, Machine Tunnel gating, ZDX `collect_zdx_location` dual-source
- **SKILL.md updated:** scope description mentions ZCC; routing table adds three ZCC rows and a ZCC API row; "out of scope" note refined to list what's still out (ZDX, ZIdentity, ZMS, ZINS, EASM).
- **`_clarifications.md`:** added 7 new entries `zcc-01` through `zcc-07` covering enum values the SDK doesn't validate (condition_type, network_type, action_type, primary_transport) plus systemProxyData precedence and forwarding-profile assignment mechanism.
- **Snapshot scope gap closed (second pass 2026-04-24):** `scripts/snapshot-refresh.py` now dumps ZCC (forwarding-profiles, trusted-networks, fail-open-policy, web-policy) under `snapshot/zcc/`. New `--zcc-only` flag mirrors `--zia-only` / `--zpa-only`. First fork-admin run will resolve enum clarifications `zcc-01` through `zcc-04` and `zcc-06` via observed values.

Remaining ZCC areas **not written up**: ZCC admin users / roles / secrets (`client.zcc.admin_user`, `client.zcc.secrets`, `client.zcc.company`) — rarely relevant to policy-reasoning questions; captive-portal detection deep-dive (covered at feature level in forwarding-profile.md, but exact heuristics not documented); Z-Tunnel 1.0 vs 2.0 protocol internals (not customer-documented).

### 7. Eval assertions + README update ✅ DONE (2026-04-23)
- **`evals/evals.json` upgraded** from narrative `expected_output` to structured eval entries. Each of the 6 canonical prompts now includes:
  - `assertions` — substring checks the response must contain
  - `must_cite_files` — reference files the answer must cite
  - `must_not_say` — common wrong-answer traps (e.g., "Allow always wins over Block", "asterisks work in Zscaler", "URL filtering only runs after SSL decrypt")
  - `expected_confidence` — "high" (deterministic from docs) / "medium" (needs snapshot) / "low" (declines without data)
  - `tenant_data_required` — signals the harness whether to expect a decline-with-pointers when `snapshot/` is empty
  - Top-level `schema_notes` explains the format to any future reader.
- **`README.md` rewritten** as a fork-admin onboarding walkthrough:
  - 7-step first-run path: clone → read PLAN.md → install skill → set up creds → first snapshot → try a script → run evals
  - Helper scripts table (all 7 scripts with one-line "what question it answers" summaries)
  - Submodule-bump guidance (periodic work as upstream SDK / TF provider evolves)
  - Contributing guidance (stub→draft progression, clarification workflow)
  - **Known gaps** section up front: Malware Protection / ATP API blind spots, pending lab tests, deferred snapshot schema, Z-Tunnel undocumented.
- PLAN.md stays as the canonical hand-off doc; README points to it as step 2 of the onboarding path.

## Pending captures (web / Playwright)

Architecture coverage landed 2026-04-23. Captured articles (all in `vendor/zscaler-help/*.md`):

- ✅ `understanding-zscaler-cloud-architecture.md` — Central Authority, Public Service Edges, Nanolog clusters, Log Routers, Feed Central
- ✅ `understanding-subclouds.md` — subcloud types + PAC-file variables + propagation timing
- ✅ `understanding-multi-cluster-load-sharing.md` — VIP sharing across network address blocks
- ✅ `about-public-service-edges-internet-saas.md` — PSE operational architecture + Safe mode
- ✅ `understanding-private-service-edge-internet-saas.md` — ZIA PSE hardware (PSE 3 / PSE 5 / Dedicated LB), DSR, sizing
- ✅ `about-virtual-service-edges-internet-saas.md` — VSE VM form factor, clustering, maintenance, hardening
- ✅ `about-app-connectors.md` — ZPA App Connector platforms, enrollment, selection, outbound-only constraint
- ✅ `what-is-zscaler-client-connector.md` — ZCC architecture (Z-Tunnel to PSE, network adapter, mobile VPN, conflict handling, trusted-network / captive-portal detection)

**GRE tunnel docs (2026-04-23, follow-up round):**
- ✅ `understanding-generic-routing-encapsulation-gre.md` — protocol, bandwidth caps (1 Gbps non-NATed / 250 Mbps NATed), VSE unnumbered GRE
- ✅ `gre-deployment-scenarios.md` — internal-router / border-router / explicit-proxy mode with Global Public Service Edge IPs
- ✅ `best-practices-deploying-gre-tunnels.md` — MTU/MSS math (1500 → GRE MTU 1476 / MSS 1436), L7 health-check URL `http://gateway.<cloud>.net/vpntest`, Fast-vs-Conservative failover table, Cisco IPSLA sample

**Terminology resolution (no new capture needed):**
- **ZEN = Service Edge.** The LSS schema still emits `ClientZEN` / `ConnectorZEN` field names with values like `broker1b.pdx2`. Marketing/help docs say "Service Edge"; logs still say "ZEN".
- **PSEN ≈ Private Service Edge Node** (instance-level within a PSE cluster). Not a separate SKU — see `understanding-private-service-edge-internet-saas.md § Cluster Architecture`.
- **VSEN ≈ Virtual Service Edge Node** (per-VM instance within a VSE cluster).
- `broker*.region` style hostnames in log fields are per-ZEN identifiers — useful for support tickets and log correlation.
- Codified in `references/shared/terminology.md`.

**Remaining architecture gaps (lower priority):**
- **Z-Tunnel wire-format internals** — permanently deferred 2026-04-24 after second targeted search confirmed no public docs. Operational layer is covered in `references/zcc/z-tunnel.md`.
- **Central Authority** depth — covered at high level in `understanding-zscaler-cloud-architecture.md`; no standalone article found.
- **Federal Cloud** specifics — out of scope unless we later confirm tenant relevance.

## Pending lab tests (for fork admin)

Ranked by ease + value:

| ID | What to test |
|---|---|
| `zia-15` | Create custom category with `*.example.com` via console; GET via API to see what's stored; send traffic to `www.example.com` under a block-on-that-category rule; observe behavior. **Operator reports the console accepts asterisks despite docs saying invalid** — result reveals either doc staleness or silent-miss footgun. |
| `zia-14` | Block a category with `.safemarch.com`; send requests from 5-label and 6-label hostnames; confirm cap. Docs reasonably read as 5 inclusive / 6 exclusive; verify. |
| `zia-02` | Two custom categories both containing exact `www.example.com`; one in block rule, one in allow rule; observe which fires. Swap creation order; retest to isolate tiebreaker. |
| `zia-12` | SSL rule `Do Not Inspect + Evaluate Other Policies`; URL Filtering default rule = Block; no explicit URL Filtering rule for the test URL. Confirm whether the implicit default rule fires. |
| `zpa-04` | Two overlapping ZPA segments both with `Bypass = Always` on the same FQDN. Observe which "wins" via client logs / LSS. |
| `shared-06` | Disable an earlier ZPA access rule in the console. Verify rule-order skip-in-place vs removal. Docs never stated this for ZPA; lab test is the cheapest way to close. |

## Known findings awaiting action

- **Duplicate refarch PDF — resolved (2026-04-24).** Confirmed via `pypdf` text-diff: the two refarch PDFs differed only in an 8-char title prefix ("user-to-" on cover). Deleted `zpa-app-segmentation-refarch.pdf`; kept `zpa-user-to-app-segmentation-refarch.pdf`.
- **Keyword quota discrepancy resolved in `ranges-limitations-zia.md`.** `url-filtering.md` line 142 now cites the authoritative 256/2,048 values and flags the 30/1,000 values in `Configuring_URL_Categories_Using_API.pdf` p.12 as stale.
- **5-level wildcard cap needs "gotcha" elevation.** `wildcard-semantics.md` buries the 5-subdomain-levels-deep cap in a matching table. User flagged this as non-obvious for experienced operators; deserves a Surprises/Gotchas callout near the top, plus a cross-link from `url-filtering.md § Specificity`.

## Next buildout phase — architectural gaps and scope expansions

Organized by what a future session (or fork admin) would tackle next. Each entry notes what it is, why it matters, what resolving it would require, and rough effort. Cross-link to `_clarifications.md` where a specific behavior question is already tracked by ID; most of these are broader than any single clarification.

### Cross-SDK validation sweep — ✅ DONE (2026-04-24)

Vendored `zscaler-sdk-go` and `terraform-provider-ztc` submodules and ran a cross-SDK audit. Key findings threaded back into existing docs:

- **ZCC `conditionType` / `networkType` / `actionType` / `primaryTransport` / `tunnel2FallbackType` are all `int` on the wire, not string enums.** The Python SDK passes kwargs through without type enforcement, which made earlier docs imply string values. Clarifications `zcc-01` through `zcc-04` and `zcc-06` moved from Open to Partially resolved — datatype is known (`int`); integer-to-meaning mapping is still open (first tenant snapshot will reveal).
- **ZCC forwarding profile has ~15 fields Python SDK doesn't model**, plus an entire `UnifiedTunnel` sub-structure (a third tunnel mode alongside ZIA+ZPA actions). Threaded into `references/zcc/forwarding-profile.md` as a new "Fields Python SDK doesn't expose" section + "Unified Tunnel" section. Worth a dedicated help-article capture follow-up.
- **ZIA has Go-SDK-only surfaces**: `scim_api`, `email_profiles`, `eventlogentryreport`, `devicegroups`. Threaded into `references/zia/api.md § Go-SDK-only surfaces`.
- **ZPA has Go-SDK-only surfaces**: `applicationsegment_move`, `applicationsegment_share` (microtenant cross-segment ops), typed microtenant-sharing sub-objects on `ApplicationSegmentResource`. Threaded into `references/zpa/api.md § Go-SDK-only surfaces`.
- **ZID Python SDK is read-only on `resource_servers`** (Go has full CRUD). Will be threaded into the upcoming ZIdentity doc.
- **Two entirely Go-SDK-only products discovered**: ZTW (Zero Trust Workload / Cloud Connector) and ZWA (Workflow Automation / DLP Incident Management). Added to Section B product-scope-expansion list with scope sketches. ZTW has the companion TF provider (`terraform-provider-ztc`) we vendored; ZWA is SDK-only.

**Not revealed by Go SDK**: the integer-to-semantic mapping for any of the 5 int-enum fields. The Go SDK doesn't declare `const`/`iota` enums for these — the int codes are opaque in source. Still need first-tenant-snapshot observation.

### A. Fuzzy areas inside the current scope (ZIA + ZPA + ZCC)

These live inside what we've already declared "covered" but where the docs still hedge.

| Area | Question shape it unlocks | What resolves it | Effort |
|---|---|---|---|
| **Z-Tunnel 1.0 vs 2.0 protocol internals** | ~~"Is my transport problem Z-Tunnel 1.0 falling back from 2.0?" "Why does Z-Tunnel 2.0 perform differently on UDP-restricted networks?"~~ **DONE (2026-04-24).** Wrote `references/zcc/z-tunnel.md` covering CONNECT-vs-DTLS architecture, single-IP-NAT-or-silent-fallback footgun, GRE+2.0 incompatibility, the 4-layer Z-Tunnel-2.0 bypass architecture (VPN Gateway → Destination Exclusions/Inclusions with specificity-wins conflict resolution → Port-based Win/macOS-only → Domain-based PAC), and the 3.8+ Windows redirect-web-traffic truth table. Side effect: partially resolved `zcc-05` via the bypass article. **Wire-format protocol internals permanently deferred (2026-04-24):** a targeted search sweep across help.zscaler.com confirmed Zscaler does not publicly document DTLS cipher/version, frame format beyond HTTP CONNECT, fallback trigger timers, or telemetry fields. Protocol-level questions are Zscaler Support territory — do not re-investigate. | | Done (operational); wire-format internals permanently deferred — do not re-investigate |
| **Central Authority depth** | ~~"What happens to policy during a CA outage?" "When policy is 'pushed,' is it immediate or eventual-consistent across Service Edges?" "What does the activation mechanism actually do at the CA level?"~~ **DONE (2026-04-24).** Captured `understanding-private-access-architecture.md`, `understanding-business-continuity-cloud-components.md`, and `zia-activation.md`. Wrote `references/shared/cloud-architecture.md` synthesizing the full platform: ZIA CA (active-passive) vs ZPA CA (active-active) split, Service Edge form factors and data-plane properties, Nanolog / Feed Central / BC Cloud, Z-Tunnel vs M-Tunnel distinction (M-Tunnel is ZPA-only, MPLS-label-switched), PKI and certificate trust model. Extended `shared/activation.md` with EUSA endpoints + 3-value status enum. Added Microtunnel and BC Cloud rows to `shared/terminology.md`. Remaining fine-grained CA internals (cross-cluster replication protocol, policy-push serialization format) still not public. | | Done (operational); wire-level CA internals still deferred |
| **ZCC enum values (`zcc-01` through `zcc-04`, `zcc-06`)** | Every ZCC forwarding-profile / trusted-network answer currently hedges on the literal enum strings. | First tenant snapshot resolves the values-in-use for this tenant. Complete enum closure needs zscaler-doc discovery or Zscaler-support confirmation. | Low effort (snapshot) — 5 min to extend `snapshot-refresh.py`; schedule for first fork-admin run |
| **App Profile assignment (`zcc-07`)** | "Which forwarding profile does user X actually get?" Right now the skill can describe profile semantics but can't answer this from API data. | (a) Check for SDK version bump that adds App Profiles surface, (b) direct HTTP discovery against undocumented endpoints, (c) admin-portal walkthrough as the documented flow (accept "console-only" as the answer). | Medium effort; (c) is cheap and probably enough |
| **systemProxyData precedence (`zcc-05`)** | "Does ZCC honor the system proxy when `actionType: TUNNEL` is also set?" Cascade order between ZCC-native forwarding and OS-level proxy isn't documented. | Lab test: populate both on a profile, observe with Wireshark. | Low effort once a lab endpoint exists |
| **Captive-portal detection deep-dive** | ~~Currently covered as a FailOpenPolicy setting. Operational questions — "why did the grace period expire before I finished auth?" "how does ZCC detect the portal?" — need a dedicated doc.~~ **Partially done (2026-04-24).** Captured `vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md` which confirms captive-portal settings moved from global to App Profile scope. Threaded into `references/zcc/forwarding-profile.md`. Remaining gap: the actual detection heuristics (which HTTP probes ZCC uses, timing of state transitions) — no public doc found. | | Partially done |
| **Malware Protection / ATP console-only diagnosis workflow** | ~~Skill currently says "no API, use the console." That's correct but not helpful.~~ **DONE (2026-04-24).** Wrote `references/zia/malware-and-atp.md` covering both policies' mechanics, category shape, Page Risk scoring, Blocked Malicious URLs, AI/ML recategorization, security-exceptions bypass behavior, and the Security-Dashboard → Web-Insights → category-based-remediation workflow. Opened [`clarification log-04`](references/_clarifications.md#log-04-mp-atp-blocked-policy-type-log-field) for the exact `blockedpolicytype` field name + enum (first tenant Web Insights export closes it). | | Done |
| **ZCC deferred areas: web_policy, web_privacy, devices, entitlements** | ~~On-device URL filtering (distinct from ZIA URL filtering). Telemetry-collection policy. Device lifecycle (force-remove, inventory). Service entitlements (who gets ZPA/ZDX/Endpoint DLP). All SDK-surface-present, not written up.~~ **DONE (2026-04-24, second pass).** Wrote `web-policy.md`, `web-privacy.md`, `devices.md`, `entitlements.md`. Side effect: resolved `zcc-07` partially by discovering `WebPolicy.forwarding_profile_id` is the assignment mechanism. | | Done |
| **ZCC snapshot extension** | ~~`snapshot-refresh.py` doesn't dump ZCC. 10-line fix documented in `references/zcc/api.md § Snapshotting ZCC configuration`.~~ **DONE (2026-04-24).** `snapshot-refresh.py` now has `refresh_zcc()` covering forwarding-profiles, trusted-networks, fail-open-policy, and web-policy. New `--zcc-only` flag. | | Done |

### B. Product scope expansions

Zscaler products the skill doesn't cover, ranked by likely value to the fork team. The user has signalled "we will need everything eventually" — these are the candidates for that "eventually."

| Product | What it is | Why it matters | Available material | Effort to cover |
|---|---|---|---|---|
| **ZDX** (Digital Experience) | ~~User / app health monitoring, probes, deeptraces~~ **DONE (2026-04-24).** Captured 7 help articles (`understanding-zdx-cloud-architecture`, `about-zdx-score`, `about-probes`, `understanding-probing-criteria-logic`, `understanding-diagnostics-session-status`, `understanding-alert-status`, `understanding-zdx-api`). Wrote `references/zdx/` with 5 docs: `index.md`, `overview.md` (architecture + ZDX Score + lowest-value-wins aggregation), `probes.md` (Web + Cloud Path + criteria logic), `diagnostics-and-alerts.md` (bridges SDK "deeptrace" ↔ portal "Diagnostics Session" terminology), `api.md` (SDK surface summary). Threaded ZDX hooks into `shared/cross-product-integrations.md` (3 new sections + 3 question-routing rows). Added ZDX-specific terms to `shared/terminology.md` (Diagnostics Session ↔ deeptrace, Cloud Path, Page Fetch Time, TPG). Updated SKILL.md scope declaration and routing. **Remaining ZDX gaps** (explicitly flagged in `zdx/index.md`): application-specific call-quality deep-dives (Teams/Zoom), Zscaler Hosted Probes, Service Desk RBAC, Adaptive Mode probing. | | Done |
| **ZIdentity deeper coverage** | ~~Unified identity (currently referenced in passing)~~ **DONE (2026-04-24).** Captured 5 help articles (what-zidentity, zidentity-about-api-clients, understanding-zidentity-apis, understanding-step-up-authentication-zidentity, configuring-authentication-levels). Wrote `references/zidentity/` with 4 docs: `index.md`, `overview.md` (MFA defaults, SAML JIT vs SCIM, OIDC-for-step-up constraint), `api-clients.md` (OAuth 2.0 client-credentials flow, roles/scopes, secret-shown-once pattern, portal-only creation), `step-up-authentication.md` (Authentication Levels tree with 32-max / depth-4 limits, validity-inversion gotcha, OIDC `acr` mapping, ZCC-required prompt delivery), `api.md` (SDK surface + Python-read-only-on-resource_servers gap from cross-SDK sweep). Cross-linked from `shared/cross-product-integrations.md` (2 new sections + 4 question-routing rows), `shared/terminology.md` (6 new rows). Updated SKILL.md scope + routing. **Remaining ZIdentity gaps** (flagged in `zidentity/index.md`): IdP-specific config (Entra, AD FS, Okta), MFA method configs, device token auth, admin RBAC within ZIdentity, audit log deep-dive, migration-from-legacy flow. | | Done |
| **ZBI / Cloud Browser Isolation** | ~~Remote-browser rendering. Partially referenced (URL Filter `Isolate` action, Device Group = `Cloud Browser Isolation`) but no standalone doc.~~ **DONE (2026-04-24).** Captured 5 help articles (what-is-zero-trust-browser, configuring-smart-browser-isolation-policy, zpa-about-isolation-policy, understanding-turbo-mode-isolation, understanding-isolation-miscellaneous-unknown-category-zia). Wrote `references/zbi/` with 3 docs: `index.md`, `overview.md` (container architecture, double-PSE-traversal, Turbo Mode vs pixel streaming, 10-min idle timeout), `policy-integration.md` (isolation profiles, ZIA URL Filter Isolate action, Smart Browser Isolation AI/ML policy + its auto-created SSL rule, ZPA Isolation Policy, the Miscellaneous & Unknown tier's locked-profile settings). Cross-linked from `zia/url-filtering.md § Isolate action`, `zpa/policy-precedence.md § zpn_isolation_profile_id`, `shared/cross-product-integrations.md` (new ZBI section + 4 question-routing rows), `shared/terminology.md` (4 new rows). Updated SKILL.md scope + routing. **Remaining ZBI gaps** (flagged in `zbi/index.md`): Votiro CDR integration, Sandbox+Isolation, Local Browser Rendering, end-user UX features, Zero Trust Client Browser agent. | | Done |
| **ZCC deferred (re-list)** | Already in Section A as ZCC-inside-scope items. | | | |
| **ZMS** (Workload Microsegmentation) | East-west (server-to-server) policy; separate from ZPA's north-south model | Relevant only if fork team runs workloads behind ZMS | SDK (`zscaler/zms/*`), MCP skills (`assess-workload-protection`, `audit-microsegmentation-posture`, `analyze-policy-rules`, `review-tag-classification`, `troubleshoot-agent-deployment`) | High — new product, different mental model |
| **ZINS** | Shadow IT / IoT / SaaS security reporting. Overlaps ZIA reporting at a distance. | Mostly reporting-flavored, not policy-precedence-flavored. Lower skill ROI. | SDK (`zscaler/zins/*`), MCP skills | Medium, low ROI for this skill's reasoning focus |
| **EASM** | External attack-surface management. | Different audience (security researchers, not traffic operators). | SDK (`zscaler/zeasm/*`), one MCP skill (`review-attack-surface`) | Medium, low fit |
| **ZAI Guard** | AI/LLM traffic policy. Newer product. | Unclear fork-team relevance until AI traffic becomes material. | SDK (`zscaler/zaiguard/*`), help articles unknown | Defer until fork team signals need |
| **Cloud & Branch Connector (ZTW / ZTC)** | ~~Cloud Connector orchestration: Edge Connector groups, forwarding gateways, policy management, location management, provisioning, partner integrations.~~ **DONE (2026-04-24).** Captured 7 help articles (what-zscaler-cloud-connector, cbc-understanding-high-availability-and-failover, cbc-traffic-forwarding, cbc-configuring-traffic-forwarding-rule, cbc-about-cloud-connector-groups, cbc-configuring-cloud-provisioning-template, cbc-understanding-zscaler-cloud-branch-connector-api). Wrote `references/cloud-connector/` with 3 docs: `index.md` (5-names table: Cloud Connector / Branch Connector / ZTG / ZTW / ZTC / CBC), `overview.md` (Cloud Connector Group model, primary/secondary/tertiary gateway failover, fail-close-default-vs-fail-open inversion, autoscaling naming per cloud provider, Cloud Connector vs App Connector comparison), `forwarding.md` (5 forwarding methods — ZIA/ZPA/Direct/Drop/Local, rule-order first-match-wins, Application Service Groups predefined list, DNS-required-for-wildcard-non-web), `api.md` (Go SDK `client.ztw.*` 12 services, TF `ztc_*` resources incl. TF-only `ztc_ip_pool_groups`, provisioning template workflow, Python-SDK-has-NO-coverage caveat). Cross-linked from `shared/cross-product-integrations.md` (2 new sections + 5 question-routing rows), `shared/terminology.md` (8 new rows). Updated SKILL.md scope + routing. **Remaining gaps** (flagged in `cloud-connector/index.md`): per-cloud deployment guides, VMSS/ASG/MIG operational tuning, Zero Trust SD-WAN, Branch-Connector-specific details, rate-limits article, Log and Control Forwarding Rule deep-dive. | | Done |
| **ZWA (Workflow Automation / DLP Incident Management)** | ~~Narrow: DLP incident lifecycle CRUD + customer audit log.~~ **DONE (2026-04-24).** Captured 4 help articles (what-workflow-automation, zwa-managing-incidents, understanding-workflows-workflow-automation, dlp-incidents-workflow-automation-api). Wrote `references/zwa/` with 3 docs: `index.md`, `overview.md` (incident lifecycle, 9 predefined workflow templates with per-template semantics, workflow mappings, notification channels, ticketing integrations, ZIA DLP dependency chain), `api.md` (Python + Go SDK surface with cross-SDK parity notes, sensitive-evidence caveat). Cross-linked from `shared/cross-product-integrations.md` (new ZIA DLP → ZWA section + 2 question-routing rows) and `shared/terminology.md` (5 new rows). Updated SKILL.md scope + routing. **Remaining gaps** (flagged in `zwa/index.md`): per-cloud DLP integration configs (Azure, AWS), notification channel setup, ticketing integration setup — all operational. | | Done |
| **Federal Cloud** | `zscalergov` / `zscalerten` specifics; ZPA GOV/GOVUS | Only if tenant is gov. Most behavior inherits from commercial; gaps are auth paths and feature availability. | Scattered mentions in help-doc site; no consolidated reference | Defer until tenant relevance confirmed |

### C. Cross-product dossier — ✅ DONE (2026-04-24)

Wrote `references/shared/cross-product-integrations.md` — single-file catalog of hooks between ZIA, ZPA, and ZCC organized by direction of coupling (ZIA→ZPA, ZPA→ZIA, ZCC→ZPA, ZCC→ZIA, shared ZIdentity, SSL-bypass-as-gate, AI/ML recategorization, activation-model difference, BC-Cloud-is-ZIA-only, NSS↔LSS split). Each hook documents the failure mode (what silently breaks when it's misconfigured). Includes a question-shape routing table for pre-empting "I asked about ZIA but the answer is really about ZPA" mis-routings.

Threaded from SKILL.md routing table and cross-linked from `shared/policy-evaluation.md`.

Three recurring themes surfaced in the synthesis: (1) silent-miss flags — a feature appears configured but quietly doesn't apply because an enabling flag is off somewhere else; (2) one-way dependencies — SSL decrypt gates everything content-based; ZCC forwarding `actionType: NONE` gates everything ZIA; ZCC entitlement gates everything ZPA; (3) product-specific control plane — ZIA activates, ZPA propagates; ZIA has BC Cloud, ZPA doesn't; ZIA CA is active-passive, ZPA CA is active-active.

### Lower-ROI sweep: App Connector + SCIM + log-schema cross-check — ✅ DONE (2026-04-24, sixth pass)

Three items from the lower-ROI refinement list:

- **ZPA App Connector dedicated doc** — `references/zpa/app-connector.md`. Pulls together App Connector operational content previously scattered across 14 docs. 3 new help captures (about-connector-provisioning-keys, understanding-connector-software-updates, about-connector-groups). Covers: outbound-only VM architecture, groups as policy/upgrade/capacity unit, provisioning-key mechanics (with the #1-enrollment-failure utilization-count exhaustion pattern and the literal 401 error log from incorrect-key copy), scheduled 4-hour rolling upgrade window with Scheduled/Success/Failure status semantics, certificate enrollment + private-key-never-leaves-VM trust model, VM-cloning hardware-fingerprint collision, Cloud-Connector-vs-App-Connector comparison, cross-product SIPA/segment/CC hooks. Cross-linked from SKILL.md, zpa/index.md.
- **SCIM provisioning doc** — `references/shared/scim-provisioning.md`. Cross-product topic flagged by cross-SDK sweep (Go SDK has full SCIM CRUD Python doesn't). 2 new help captures (understanding-scim-zia, about-scim-zpa). Covers: SCIM 2.0, SAML-is-prerequisite, ZIA attribute mapping + endpoints, ZPA attribute mapping + endpoints, **ZIA vs ZPA subtle differences** (`names.givenName` vs `name.givenName`; `active=false` means disabled in ZIA and deleted in ZPA), 128-group-per-user cap, domain pre-registration requirement, Okta-specific PROVISION_OUT_OF_SYNC_USERS gotcha, cross-SDK Go-has-full-CRUD-Python-doesn't caveat. Cross-linked from SKILL.md, shared/index.md.
- **Log schema cross-check — `log-04` partially resolved.** Scanned `web-log-schema.md` for MP/ATP blocked-policy-type field. Found: `%s{ruletype}` (NSS field name) / `Blocked Policy Type` (Insights column) with illustrative values `File Type Control`, `Data Loss Prevention`, `Sandbox`; `%s{rulelabel}` (Blocked Policy Name); `%s{reason}` likely carries MP/ATP sub-category discriminator. Updated clarification `log-04` from Open to Partial (field name resolved, full enum still needs tenant export). Threaded the SPL query shape into `malware-and-atp.md`.

### High-ROI refinement trio — ✅ DONE (2026-04-24, fifth pass)

Three refinements the user picked from a larger list: (1) clarifications resolution pass; (2) Go SDK reasoning-doc sweep for ZIA/ZPA (parallel to the earlier cross-SDK sweep that only hit api.md files); (3) dedicated DLP reference doc to consolidate scattered mentions.

- **Clarifications resolution pass** — reviewed all Open and Partial entries in `_clarifications.md`. Net result: no new closures (remaining items are truly tenant/lab-blocked). Incidentally closed the Sandbox-quota open bullet in `sandbox.md` using Go SDK `RatingQuota` struct (time-bounded report-retrieval count, not byte volume).
- **Go SDK reasoning-doc sweep** — Sonnet subagent compared Python-SDK-derived reasoning docs against Go SDK typed structs. 4 blockers + 8 fixes surfaced and threaded:
  - BLOCKERS: `ssl-inspection.md` missing `BLOCK` action type and its validation constraints; `ssl-inspection.md` using Python snake_case (`http2_enabled`) for fields that are camelCase on the wire (`http2Enabled`); `url-filtering.md` prescribing a non-existent `patternsRetainingParentCategoryCount` field; `policy-precedence.md` using snake_case `device_posture_failure_notification_enabled` for a camelCase wire field.
  - FIXES: `sandbox.md` missing the full Sandbox Rule API (FirstTimeOperation enum, ML/threat-score actions, cross-product `ZPAAppSegments`) plus the `Discan` out-of-band inspection API; `url-filtering.md` missing 12 GenAI per-LLM-vendor prompt-tracking flags (DeepSeek, Grok, Mistral, Claude, Grammarly, etc.); `app-segments.md` missing 10 Go-SDK-only fields (notably `bypassOnReauth`) and cross-microtenant Move/Share ops; `policy-precedence.md` missing `Reorder` / `BulkReorder` APIs for programmatic rule-order changes; `cloud-app-control.md` missing `Actions []string` slice semantics, `CreateDuplicate` method, `AllAvailableActions` lookup.
- **Dedicated DLP reference doc** — wrote `references/zia/dlp.md` from 4 help-article captures (about-dlp-engines, about-dlp-dictionaries, configuring-dlp-policy-rules-content-inspection, understanding-predefined-dlp-dictionaries). Three-layer object model (dictionaries → engines → rules), the "rules reference engines not dictionaries" constraint, EDM / MIP / Patterns / Phrases dictionary types, file-size inspection limits (400MB / 100MB extracted text / 5-level archive recursion), Evaluate-All-Rules-mode branching, four forwarding destinations (ICAP / Incident Receiver / C2C / notifications), pipeline position (terminal tier of full-URL pass), ZWA downstream integration, Endpoint DLP channel distinction. Cross-linked from SKILL.md routing, zia/index.md, zwa/api.md (fixed prior stale reference), shared/cross-product-integrations.md (enhanced ZIA-DLP→ZWA section + 2 new routing rows), shared/terminology.md (7 new rows covering Dictionary/Engine/EDM/MIP/ICAP Receiver/ZIR/C2C).

### SIPA consolidation + duplicate PDF cleanup — ✅ DONE (2026-04-24, fourth pass)

- **Duplicate refarch PDF resolved.** `pypdf` text-diff confirmed the two ZPA refarch PDFs (`zpa-app-segmentation-refarch.pdf` and `zpa-user-to-app-segmentation-refarch.pdf`) are content-identical except for an 8-character title prefix ("user-to-" on the cover). Same 21 pages, same 42K char body. Deleted `zpa-app-segmentation-refarch.pdf`; kept the "user-to-app" variant (matches newer Zscaler naming convention, cited first in `references/zpa/app-segments.md`). Removed redundant citation from that doc's frontmatter sources list.

- **SIPA (Source IP Anchoring) dedicated reference doc.** SIPA was previously mentioned across 5 reference docs (ssl-inspection.md, app-segments.md, policy-precedence.md, cross-product-integrations.md, policy-evaluation.md) but had no consolidated home. Captured 4 help articles (understanding-source-ip-anchoring, understanding-source-ip-anchoring-direct, configuring-source-ip-anchoring, configuring-forwarding-policies-source-ip-anchoring-using-zpa) and wrote `references/shared/source-ip-anchoring.md` covering:
  - Traffic flow (ZIA PSE → ZPA App Connector → destination with customer-controlled IP)
  - Use cases (Office 365 Conditional Access, legacy IP-allowlist apps)
  - Licensing (SIPA subscription separate from ZPA license)
  - Full ZPA-side config chain (App Segment `Source IP Anchor` flag, Client Forwarding Policy rules for IP-based vs domain-based apps, Access Policy rules)
  - Full ZIA-side config chain (Forwarding Control rule with Method=ZPA, ZPA Gateway, DNS Control rules `ZPA Resolver for Road Warrior`/`Locations` with rule-order constraint)
  - **SIPA Direct variant** — disaster-recovery config that flips Client Forwarding Policy so ZCC clients forward directly; requires pre-planned Access Policy rules; must be manually reverted post-DR
  - Mutual-exclusion with Browser Access, Double Encryption, Multimatch
  - ICMP limitations (echo-only, 990-byte cap, no traceroute)
  - RTSP unsupported
  - Policy footguns: country-code uses ZIA PSE's country not user's; SSL Inspection's `zpa_app_segments` filter only shows SIPA-enabled segments; DNS resolution must flow through Zscaler for Synthetic-IP return
  - 8-step diagnostic workflow for "SIPA isn't working"
- Threaded into SKILL.md routing (new row), cross-product-integrations.md (new section with cross-link), ssl-inspection.md (cross-link added), app-segments.md (new mutual-exclusion bullet), policy-precedence.md (SIPA country-code footgun cross-link), shared/index.md (listed), terminology.md (6 new rows covering SIPA, SIPA Direct, ZPA Gateway, ZIA Service Edge client type, ZPA Resolver rules).

### QA sweep + evals extension + doc maintenance — ✅ DONE (2026-04-24, third pass)

After the product-scope build-out closed at ZWA, ran a consolidation pass covering three strands at once:

- **QA sweep** via a Sonnet subagent against the expanded 8-product scope (first attempt drifted off-script; retry with a tighter prompt produced a clean ~500-word report). Findings:
  1. One dead link — `references/zia/foo.md` cited in `_clarifications.md` workflow-template section. Fixed by replacing with `<product>/<topic>.md` placeholder.
  2. Two unrouted shared docs — `references/shared/activation.md` and `references/shared/terminology.md` existed but weren't in SKILL.md's routing table. Added routing rows for both.
  3. `references/shared/` had no `index.md`. Created one listing all 7 shared docs plus guidance on when to start there vs in a product directory.
  4. Three cross-product consistency checks (step-up-is-OIDC-only; SSL-decrypt-required-for-content-based-security-features; Cloud-Connector-fails-close-by-default) all passed — no contradictions across products.
- **evals extension** — extended `evals/evals.json` from 6 to 14 canonical prompts. 8 new prompts cover: ZCC forwarding-profile trusted-network bypass (#7), Z-Tunnel 2.0 single-IP-NAT requirement (#8), ZDX lowest-value-wins score aggregation (#9), ZBI Isolate+SSL-bypass interaction (#10), ZIdentity Conditional Access OIDC-only + ZCC-required (#11), Authentication Level validity inversion (#12), Cloud Connector fail-close default (#13), ZWA DLP incident diagnostic chain (#14). Each carries structured assertions, must_cite_files, must_not_say traps, and expected_confidence consistent with the existing schema.
- **Doc maintenance**:
  - 5-level wildcard "gotcha" elevation — added a **"Surprises worth flagging first"** section at the top of `wildcard-semantics.md` covering the 5-level cap, asterisk-not-valid, and specificity-wins-across-categories. Cross-linked from `url-filtering.md § The specificity rule`.
  - Duplicate refarch PDF — **deferred** (requires user confirmation per PLAN contract; hashes differ even though content is reportedly ~95% identical). Left in place.
  - `last-verified` date refresh pass — not done this session; low priority.

### D. Script completion backlog

Five scaffolds (`access-check.py`, `ssl-audit.py`, `sandbox-check.py`, `connector-health.py`, `zpa-app-check.py`) plus the bash stub (`splunk-query.sh`). Each scaffold's internal TODOs are specific and tractable **once a real tenant snapshot exists** to confirm SDK response shapes. First-run-against-tenant resolves most TODOs in one pass; the remainder need operator judgment on rule-classification thresholds etc.

Priority order for a fork admin: (1) `access-check.py` highest value, (2) `ssl-audit.py` and `sandbox-check.py` tie for second, (3) `zpa-app-check.py` and `connector-health.py` tie for third, (4) `splunk-query.sh` only if Splunk is the SIEM.

### E. Documentation maintenance

- **Duplicate refarch PDF** — see §Known findings above. Delete one after user confirms.
- **5-level wildcard cap "gotcha" elevation** — see §Known findings. Move the 5-level cap from a matching-table row to a Surprises/Gotchas callout at the top of `wildcard-semantics.md`; add a cross-link from `url-filtering.md § Specificity`.
- **Submodule bumps** — periodic work as upstream SDK / TF provider evolves. Guidance in `README.md § Submodule management`. A new SDK version typically adds resources and validator enums; skim the diff and propagate to `api.md` files.
- **`last-verified` refresh** — reference docs carry a per-file `last-verified` date. When revisiting a doc, update the date even if content stays the same, so staleness is visible.

### Architectural-components buildout — ✅ DONE (2026-04-24, seventh pass)

After the eight products were all written up, the skill still hand-waved on several cross-cutting architectural concerns that every product's docs assumed existed elsewhere. This pass added synthesis docs for each, plus captures of their source help articles. Three tiers of work:

**Tier 1 — foundational concepts (things everything else leans on):**
- `references/shared/pac-files.md` — four default Zscaler-hosted PACs (recommended / proxy / mobile / kerberos), server-side variable substitution (only when Zscaler-hosted), subcloud-qualified variables, 256-KB / 256-files / 10-versions limits, Kerberos port 8800 + KDC bypass, immediate-activation semantics (no staging gate), OR-heavy performance footguns. Captures: 6 help articles.
- `references/zia/locations.md` — three-tier model (Location Group → Location → Sublocation), 256-group + 32K-members caps, `other` / `other6` catch-alls, 5 predefined dynamic groups (Corporate/Guest/IoT/Server/Workload), XFF mechanic, AND-semantic dynamic-group matching. Captures: 4 help articles.
- `references/shared/device-posture.md` — 23 posture types with per-platform matrix, 15-min default cadence (2-min min on ZCC 4.4+/4.5+), 5 immediate-on-change types, 7 trigger events, existing-connection immunity, Machine Tunnel subset, partner-tenant integration. Captures: 2 help articles.

**Tier 2 — named features with real operator weight:**
- `references/zia/firewall.md` — four sub-policies (Firewall Filtering / NAT Control / DNS Control / IPS Control), Basic vs Advanced licensing, 5 actions incl. `EVAL_NWAPP`, pipeline ordering ahead of web-module, ATP-before-IPS evaluation order, Z-Tunnel-1.0/PAC gating, IPS default-block-all. Captures: 2 help articles.
- `references/zpa/browser-access.md` — clientless web-app access path (no ZCC), dual-access model (enabling BA auto-adds ZCC), TLS 1.2 cipher `ECDHE-RSA-AES128-GCM-SHA256`, wildcard-cert one-level-only gotcha, same-vs-different-hostname cert mechanics, mutual-exclusions with SIPA / Double Encryption / Multimatch, TF schema constraints. Captures: 2 help articles.
- `references/zpa/privileged-remote-access.md` — clientless RDP/SSH/VNC relay, 6-object config model, credential pooling (pool exhaustion = hard block not queue), time-bounded approvals, 6-status recording lifecycle, PRA-vs-Browser-Access-vs-ZCC decision matrix. Confidence marked **medium** because source articles returned Japanese-fallback during capture; consolidated-notes file at `vendor/zscaler-help/privileged-remote-access-captures.md` preserves URL attribution.

**Tier 3 — synthesis from already-captured sources (no new captures needed):**
- `references/shared/subclouds.md` — named subset of PSEs overriding geolocation default; three types (public / private / mixed), ≥2-datacenter minimum, Support-ticket-only setup, Zscaler-managed `CONUS`, subcloud-qualified PAC variables, 5m/15m/10-20m propagation cascade, BC-Cloud-bypasses-subclouds-on-outage gotcha.
- `references/shared/nss-architecture.md` — two delivery modes (VM-TCP vs Cloud-HTTPS), 5-step NSS pipeline, one-hour replay is opt-in (Support ticket required), feed-count caps (16 VM / 1-per-type Cloud), NSS Collector is the inverse direction (10K eps cap, Shadow IT only), LSS ≠ NSS.

**Side effects of the pass:**
- 5 clarifications closed (`shared-01`, `shared-02`, `shared-04`, `shared-05`, `zpa-07`). Open count went 12 → 7; all remaining are tenant/lab-blocked.
- Deception product captured (via `zpa-07` resolution) — 3 new help articles.
- Z-Tunnel wire-format internals **permanently deferred** after targeted search confirmed no public docs exist.
- SKILL.md routing table grew by 8 rows; `shared/index.md` grew by 4 rows; `zia/index.md` grew by 2 rows; `zpa/index.md` grew by 2 rows.
- 3 ZIA/ZPA index "stub" status labels corrected to "draft" (api.md files were materially filled in prior passes).
- README scope line, layout tree, scripts table, evals count updated to reflect full 8-product state.

### Deferred-gap triage (2026-04-24 sweep)

Aggregated every product `index.md`'s "what's not covered" tail into one triaged list. Three clusters:

**Cluster 1: Vendor-specific operational setup** — high effort, typically low-to-medium skill-reasoning value. Leave deferred until a concrete operator question lands on them.
- ZIdentity IdP integrations (Entra, AD FS, Okta, Ping — each has its own help article)
- ZIdentity MFA method configs (SMS / TOTP / FIDO per-method)
- CBC per-cloud deployment guides (CloudFormation, ARM, GCP, TF modules)
- ZWA per-cloud DLP integration configs (Azure DLP, AWS DLP)
- ZWA notification channel setup (Slack, Teams, email)
- ZWA ticketing integration setup (ServiceNow, Jira)
- ZBI Votiro CDR integration, Local Browser Rendering, ZTCB native extension

**Cluster 2: Zscaler-Support-only internals** — high effort, low value. Accept as permanent boundaries.
- Z-Tunnel wire-format (confirmed permanently deferred 2026-04-24)
- Captive-portal detection heuristics (probe URLs, state-transition timing)
- ZDX Hosted Probes server-side config
- ZCC admin users / roles / secrets (portal-only surface)

**Cluster 3: Stub API entries worth filling** — low effort, medium value. Candidate for a future session.
- `references/zia/api.md` — currently flagged "stub" in index; has been materially extended since that flag was set, consider marking "reviewed"
- `references/zpa/api.md` — same
- `references/zpa/policy-precedence.md` — marked "stub" in index but body was substantially filled in pass 5 (Reorder/BulkReorder, camelCase fixes, SIPA cross-link). Reassess status label.

Only follow up if a concrete question forces the issue. Don't proactively fill — "stub" in an index isn't automatically a gap if the content is actually useful.

### Priority recommendation for next session

As of the 2026-04-24 seventh-pass close-out, the content build-out is **materially complete**. Almost everything remaining is tenant-blocked or explicitly deferred. Forward-looking work, ranked by likely value:

**Actionable without a tenant (Tier 4 — niche items):** ✅ **DONE 2026-04-24 (eighth pass)**

1. ~~ZIA Bandwidth Control~~ → `references/zia/bandwidth-control.md`. Two-object model (Class + Rule), contention-driven enforcement, 245-class / 8-with-domains / 25K-domain caps, orphan-class default-rule inheritance, sublocation-shares-not-isolates gotcha.
2. ~~ZIA FTP Control / SSH / File Type Control~~ → `references/zia/content-inspection-extras.md`. FTP Control (Firewall module, passive-only, FTP-over-HTTP default-deny, URL-Filter-precedes), File Type Control (Web module, extension+MIME+archive+active-content, 400MB scan cap), **SSH has no content inspection — L4-only; PRA is the answer**.
3. ~~Admin RBAC cross-product~~ → `references/shared/admin-rbac.md`. Three separate systems (ZIA rank+scope / ZPA feature-flags / ZIdentity 25-module matrix), federation via Administrative Entitlements, ZIA-and-ZPA-NOT-auto-synced rule, API Clients ≠ admin users, 6-month ZIA audit retention, 5-failures/1-min → 5-min lockout.

Eighth pass also: SKILL.md (4 new routing rows), `shared/index.md` (1 row), `zia/index.md` (2 rows), 5 new help captures + 1 consolidated admin-RBAC captures file.

**Blocked on a real tenant (unblock with first fork-admin run):**

4. **5 script scaffolds** — `access-check.py`, `ssl-audit.py`, `sandbox-check.py`, `connector-health.py`, `zpa-app-check.py`. TODOs close on first live API run.
5. **ZCC int-enum semantic mappings** — `zcc-01` through `zcc-04`, `zcc-06`. First tenant snapshot reveals values-in-use.
6. **Six lab-testable clarifications** — `zia-02`, `zia-12`, `zia-14`, `zia-15`, `zpa-04`, `shared-06`. See § Pending lab tests.
7. **Snapshot schema docs** — deferred until first real output (decided in § 4 of 7-step roadmap). Write from real anonymized examples.
8. **`log-04` full enum** — needs tenant Web Insights export.

**Explicitly deferred (do not re-investigate):**

9. **Z-Tunnel wire-format internals** — confirmed permanently deferred 2026-04-24. Protocol-level is Zscaler Support territory.
10. **Federal Cloud** — fork team is not gov-cloud; not worth cycles unless that changes.
11. **ZMS / ZINS / EASM / ZAI Guard** — vendored in SDKs, not written up. Wait for fork-team signal.
12. **Vendor-specific operational setup** (IdP per-vendor configs, CBC per-cloud deploys, ZWA per-cloud DLP integrations) — see § Deferred-gap triage.

**Hygiene / maintenance (background, not blocking):**

13. **Submodule bumps** — upstream SDKs and TF providers ship new resources and validator enums. Skim diffs when bumping; propagate to `api.md` files.
14. **`last-verified` date refresh** — when touching a reference doc, bump the date even if content's unchanged, so staleness is visible.
15. **README + SKILL.md routing-table hygiene** — the routing-table rows grow as docs are added. Periodically review for redundancy or better question-shape phrasing.

**If picking one concrete next action now:** commit the current state. The skill has grown substantially; a commit here makes the seventh-pass work reviewable and bisectable before further work lands. *(2026-04-24: committed as `a1cf835` and pushed to `origin/main`.)*

## Discovered work — pending action (2026-04-24, post-eighth-pass)

After the eighth pass committed and pushed, a portfolio audit and a portal recon surfaced two distinct lines of work neither in the existing roadmap nor scoped under "blocked on tenant." Both are actionable now.

### Discovery 1: `automate.zscaler.com` is the public OneAPI Automation Hub

User asked whether we'd checked `automate.zscaler.com`. We hadn't. A Playwright recon (no auth wall — fully public) found:

- **What it is:** Zscaler's public OneAPI documentation hub. Docusaurus-based.
- **Three top sections:**
  - `https://automate.zscaler.com/docs/getting-started/` — auth flow + onboarding (likely refines `references/zidentity/api-clients.md` and `references/zidentity/overview.md`)
  - `https://automate.zscaler.com/docs/api-reference-and-guides/` — the API surface; **may contain direct OpenAPI / Swagger spec downloads**
  - `https://automate.zscaler.com/docs/tools/` — SDK + Postman docs
- **Why it matters:** if OpenAPI specs are publicly downloadable here, the **admin-portal Swagger extraction is unnecessary**. Specs would live as `vendor/zscaler-api-specs/{zia,zpa,zidentity,zcc,zdx}-openapi.json` and feed into:
  - Snapshot schema docs (currently deferred until post-fork)
  - ZCC int-enum semantic mappings (`zcc-01` through `zcc-04`, `zcc-06` — close immediately if the spec annotates enums)
  - `references/zia/api.md`, `references/zpa/api.md`, `references/zcc/api.md` accuracy beyond SDK source
  - Closing the "API blind spots" called out in the TL;DR

**Next-action options offered to user (awaiting selection):**
- (A) Targeted: Capture `/docs/api-reference-and-guides/` only and look for OpenAPI specs.
- (B) Full sweep: Capture all three top sections + rate limits + auth, then synthesize into reference doc updates.

**If the user picks neither in the current session,** a fresh agent should:
1. Navigate to `https://automate.zscaler.com/docs/api-reference-and-guides/` via Playwright (or `WebFetch` if simpler — Docusaurus is server-renderable).
2. Look for "Download Spec", `swagger.json`, or `openapi.json` links.
3. If specs exist, save under `vendor/zscaler-api-specs/<product>-openapi.json` (one per product) and commit.
4. If no direct spec downloads, capture the API Reference pages as markdown into `vendor/zscaler-help/automate-zscaler/<page-slug>.md` (or similar — pick a subdir to keep them grouped).

**Important:** the user's CLAUDE.md says to use Sonnet/Haiku for analysis/review agents, not Opus. Same constraint applies to capture agents launched by future passes.

### Discovery 2: Product portfolio audit — gaps vs Zscaler.com marketing

A WebSearch sweep against `zscaler.com` (not help.zscaler.com — product positioning, not config docs) ranked against our coverage list. Findings:

**High-priority gaps (typical customer reasoning lands here):**

1. **AppProtection** — ZPA-bundled WAF + identity-based attack defense (OWASP Top 10, LDAP/Kerberos enumeration, AD attacks, insider threats). **Surprising omission inside ZPA.** Operators with ZPA-protected web apps get this turned on without realizing they did.
2. **Risk360** — cyber risk quantification (Monte Carlo financial modeling on 115+ risk factors). Separate license. CISOs and risk execs ask about it directly.
3. **ITDR / Identity Protection** — credential theft, privilege escalation, DCSync, Kerberoasting detection. ZCC-agent-based. Distinct from ZIdentity (which is the IdP layer); ITDR sits on top to detect identity attacks in flight.
4. **Resilience** — automatic carrier/datacenter failover; bundled into Business+ editions of ZIA/ZPA/ZCC. Adjacent to BC Cloud (which we cover) but is a separate marketed capability.
5. **DSPM (Data Security Posture Management)** — AI-powered data discovery + classification across IaaS/SaaS/on-prem. Distinct from ZIA DLP (in-flight); DSPM is at-rest discovery.

**Medium-priority gaps:**

- **Asset Exposure Management** — CAASM with CMDB sync, coverage-gap detection. Newer (Feb 2025).
- **Unified Vulnerability Management (UVM)** — vulnerability prioritization, 150+ connectors. Powered by Data Fabric (Avalor acquisition).
- **Cloud Protection / Posture Control (CSPM)** — workload misconfig + access hygiene. Adjacent to Cloud Connector but different scope (config scan, not traffic).
- **Zscaler Cellular** — Zero Trust SIM for IoT/OT. Niche but growing.

**Underweighted (have material but no synthesis):**

- **Zscaler Deception** — we have 3 captures (`vendor/zscaler-help/what-is-zscaler-deception.md`, `about-deception-strategy.md`, `about-zpa-app-connectors-deception.md`) from the `zpa-07` resolution but no `references/zpa/deception.md` synthesis doc.
- **AI Security as a platform** — we have GenAI URL flags in URL Filtering and DLP coverage, but Zscaler markets AI Asset Management + AI Access Security + AI Red Teaming + AI Guardrails as a cohesive product family.

**Architectural pillars never named in our docs:**

- **Zero Trust Exchange (ZTE)** — the marketing umbrella name for the entire platform. We reference "Zero Trust" everywhere but don't have a doc tying everything to ZTE-the-named-thing.
- **Data Fabric for Security** — Avalor-powered aggregation layer; foundation for Risk360, Asset Exposure, UVM. Worth naming because customers ask "where does Risk360 get its data."
- **Agentic SecOps** — newer pillar; Red Canary acquisition (May 2025) reinforces this direction.

**Recommended top three to fill (next-pass candidates):**

1. **AppProtection** — surprising omission inside ZPA. Likely 1 capture sweep + small synthesis doc.
2. **Risk360** — distinct enough from existing coverage that it warrants its own doc. CISOs ask.
3. **Deception** — promote captures to a real reasoning doc. Cheap, captures already exist.

**Mentioned but lower urgency:**

4. **ITDR** — overlaps with ZIdentity coverage; could be a section there or its own doc.
5. **ZTE as a named architectural pillar** — short overview at top of `cloud-architecture.md` or its own doc.
6. **Resilience** — likely a paragraph in `cloud-architecture.md` rather than its own doc.

**Defer:** DSPM, Asset Exposure Management, UVM, Cloud Protection, Posture Control, Zscaler Cellular, AI Security platform — newer / niche / less likely to come up in policy-and-traffic reasoning, where the skill's core value lives. Add when fork-team signals demand.

### Cross-reference: API spec extraction strategy (regardless of which discovery path)

When OpenAPI/Swagger specs become available (either from `automate.zscaler.com` or admin-portal extraction):

- Save under `vendor/zscaler-api-specs/<product>-openapi.{json,yaml}` — one per product surface (ZIA / ZPA / ZIdentity / ZCC / ZDX / OneAPI gateway if consolidated).
- **Sanitize before committing**: strip auth tokens, customer hostnames, tenant-specific URLs that may have leaked from a logged-in session.
- Watch for fragmented specs (one per service area — URL Filtering API, App Segments API, etc.). Save each separately; synthesis can stitch them.
- These are upstream API surface (not tenant-specific), so they belong in the public repo.

**What spec availability unlocks:**

- Closes "API blind spots" in TL;DR.
- Pre-populates snapshot-schema reasoning before first fork-admin run.
- Closes ZCC enum clarifications (`zcc-01` through `zcc-04`, `zcc-06`) if the spec annotates enums.
- Tightens `references/zia/api.md`, `references/zpa/api.md`, `references/zcc/api.md` beyond SDK-derived knowledge.

## Crash-recovery hints

- **Resuming the `_clarifications.md` flow:** read Status summary at top → pick a Partial or Open → check origin reference doc for context → look in `vendor/zscaler-help/` for a candidate article → grep with `uv run --with pypdf …` (see transcripts for pattern).
- **Resuming Playwright captures:** existing captures live as `vendor/zscaler-help/<slug>.md` with frontmatter attribution. Pattern: navigate → wait 2.5s → expand accordion buttons (`aria-expanded="false"`) → `document.querySelector('article').innerText`.
- **Fork portability:** the skill is designed to be forked privately and run against a real tenant. Avoid prompts or scripts that depend on Claude Code-specific tooling; keep the skill runnable by whatever agent harness a fork uses.

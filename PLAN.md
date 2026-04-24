# PLAN — zscaler-skill

**Purpose of this file:** crash-recovery artifact. If the session dies, read this to know what the project is, what's been done, and what's next without reconstructing from a 99MB transcript.

Last updated: 2026-04-24.

## TL;DR for new fork admins

If you just forked this and are here because [`README.md`](./README.md) step 2 said to read PLAN.md, the parts you actually need to know:

1. **The skill is feature-complete as a knowledge/reasoning artifact.** All `references/` docs are drafted and cited; `SKILL.md` routes to them; `evals/evals.json` exercises them. You can hand the skill to Claude and get useful answers about Zscaler policy evaluation today, with no further work.
2. **Scope: ZIA + ZPA + ZCC.** ZCC (Client Connector — forwarding profiles, trusted networks, fail-open) was added in the 2026-04-24 follow-up round. Several ZCC enum values are inferred from SDK field names rather than Zscaler docs; those are tracked as `zcc-01` through `zcc-07` in `_clarifications.md`. **ZDX, ZIdentity, ZMS, ZINS, EASM, ZBI, ZAI Guard remain out of scope** — vendored in `vendor/zscaler-sdk-python/` but not written up.
3. **`snapshot/` is empty on purpose.** The public repo ships it empty so the fork doesn't inherit somebody else's tenant data. Run `scripts/snapshot-refresh.py` once your credentials are set up (README step 5) and commit the output to your internal fork. Without a snapshot, the skill falls back to general answers for tenant-specific questions — still useful, just hedged. Note: `snapshot-refresh.py` does not yet dump ZCC resources; see `references/zcc/api.md § Snapshotting ZCC configuration` for the follow-up work.
4. **5 of 8 scripts are scaffolds, not functional code.** Only `url-lookup.py` and `snapshot-refresh.py` are complete end-to-end. The other five (`access-check.py`, `ssl-audit.py`, `sandbox-check.py`, `connector-health.py`, `zpa-app-check.py`) have docstrings, argument parsing, auth wiring, and logical structure but leave TODOs where live-API response shape needs confirmation. First-run-against-real-tenant is where those TODOs become tractable — see §6 below and the script source for specifics.
5. **Four API blind spots you'll want to know about up front**: Malware Protection and ATP block diagnosis (no API — console only), Snapshot schema docs (deferred until post-fork, see §4), Z-Tunnel internals (not customer-documented), and several lab-testable clarifications (see §Pending lab tests).
6. **Rest of this document is the roadmap and the audit trail** — skim §7-step roadmap to see what's been done; skip to §Pending lab tests, §Known findings, and **§Next buildout phase** (architectural fuzzy areas + product scope expansions) for work you might want to pick up.

## Goal

Build a Claude skill that lets engineers and non-technical users ask questions about the user's Zscaler environment (ZIA + ZPA) and get usable, sourced, confidence-scored answers. The skill's distinguishing value is **codified reasoning** about rule precedence, wildcard semantics, SSL inspection ordering, policy evaluation, and cross-product interactions — because Zscaler's own docs + MCP tools don't codify this, and raw LLMs hallucinate on precedence questions.

This repo is designed to be **forked privately to run against a real tenant**. The public upstream ships empty `snapshot/` and `logs/` directories; private forks populate them with tenant-specific data that never flows back upstream. Design decisions favor concrete operator workflows over general reusability — the pattern works best when one team owns the fork and can pin it to their environment.

## Durable state pointers (read these first)

| File | What it is |
|---|---|
| `SKILL.md` | Anthropic-canonical skill entrypoint |
| `references/_clarifications.md` | **Canonical index** of open/partial/resolved ambiguities with sources. Status summary near the top is the quick-scan view. |
| `references/zia/*.md`, `references/zpa/*.md`, `references/shared/*.md` | Distilled reference docs; each cites vendored sources and links to `_clarifications.md` by ID |
| `vendor/zscaler-help/README.md` | Drop convention, workflow, refresh instructions for the pinned bibliography |
| `vendor/zscaler-help/*.pdf`, `vendor/zscaler-help/*.md` | Pinned bibliography — every reference doc cites something here |
| `scripts/url-lookup.py`, `scripts/snapshot-refresh.py`, `scripts/splunk-query.sh` | Tooling scaffolds (Python via `uv run --script`) |
| `evals/evals.json` | Skill eval prompts (baseline for fork) |
| `snapshot/` | Where tenant snapshot JSON lands after fork (currently empty + `.gitkeep`) |

## 7-step roadmap — state

### 1. Citation audit ✅ DONE (2026-04-23)
- 7 uncited vendor PDFs identified and deleted (4 empty checklists, 1 ZPA AI-Recommendations UI walkthrough + its exact-content duplicate, 1 generic SSL/TLS primer).
- Vendor pile now 27 PDFs + 6 markdown captures, 100% cited.

### 2. Open-clarifications sweep ✅ MATERIALLY DONE (2026-04-23)
- **13 fully resolved** (see `_clarifications.md § Resolved`).
- **6 partially resolved** — each with doc-backed answer plus a narrow gap that needs lab/operator data.
- **1 investigating** (`zpa-01` — schema shape evidence, awaiting doc or lab confirmation).
- **12 remain open** — 6 lab-testable (see §Pending lab tests below), 4 design decisions, 2 missing-doc.
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
- **Z-Tunnel protocol depth** — appears not documented customer-facing. Referenced in ZCC doc as "lightweight tunnel" between ZCC and Public Service Edge; no standalone doc found at any `/client-connector/*tunnel*` or `/zscaler-client-connector/*tunnel*` URL.
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

- **Duplicate refarch PDF.** `zpa-user-to-app-segmentation-refarch.pdf` and `zpa-app-segmentation-refarch.pdf` differ only in cover title (~5 lines); content-identical. Same pattern as the deleted AI-Recommendations dup. Delete one after user confirms.
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
| **Z-Tunnel 1.0 vs 2.0 protocol internals** | ~~"Is my transport problem Z-Tunnel 1.0 falling back from 2.0?" "Why does Z-Tunnel 2.0 perform differently on UDP-restricted networks?"~~ **DONE (2026-04-24).** Wrote `references/zcc/z-tunnel.md` covering CONNECT-vs-DTLS architecture, single-IP-NAT-or-silent-fallback footgun, GRE+2.0 incompatibility, the 4-layer Z-Tunnel-2.0 bypass architecture (VPN Gateway → Destination Exclusions/Inclusions with specificity-wins conflict resolution → Port-based Win/macOS-only → Domain-based PAC), and the 3.8+ Windows redirect-web-traffic truth table. Side effect: partially resolved `zcc-05` via the bypass article. **Wire-format protocol internals still undocumented customer-facing** (Zscaler Support territory) but the operational layer is covered. | | Done (operational); wire-format internals remain deferred |
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
| **ZWA (Workflow Automation / DLP Incident Management)** | Narrow: DLP incident lifecycle CRUD + customer audit log. ~10-12 methods total across 2 services. | Only relevant if tenant uses ZWA for DLP incident triage. | Go SDK (`vendor/zscaler-sdk-go/zscaler/zwa/services/`), Python SDK also has `zwa/dlp_incidents.py` with slightly different method set (triggers/tickets/group-search in Python but not Go) | Low effort — narrow surface; unknowns are the `IncidentDetails` shape and filtering query params |
| **Federal Cloud** | `zscalergov` / `zscalerten` specifics; ZPA GOV/GOVUS | Only if tenant is gov. Most behavior inherits from commercial; gaps are auth paths and feature availability. | Scattered mentions in help-doc site; no consolidated reference | Defer until tenant relevance confirmed |

### C. Cross-product dossier — ✅ DONE (2026-04-24)

Wrote `references/shared/cross-product-integrations.md` — single-file catalog of hooks between ZIA, ZPA, and ZCC organized by direction of coupling (ZIA→ZPA, ZPA→ZIA, ZCC→ZPA, ZCC→ZIA, shared ZIdentity, SSL-bypass-as-gate, AI/ML recategorization, activation-model difference, BC-Cloud-is-ZIA-only, NSS↔LSS split). Each hook documents the failure mode (what silently breaks when it's misconfigured). Includes a question-shape routing table for pre-empting "I asked about ZIA but the answer is really about ZPA" mis-routings.

Threaded from SKILL.md routing table and cross-linked from `shared/policy-evaluation.md`.

Three recurring themes surfaced in the synthesis: (1) silent-miss flags — a feature appears configured but quietly doesn't apply because an enabling flag is off somewhere else; (2) one-way dependencies — SSL decrypt gates everything content-based; ZCC forwarding `actionType: NONE` gates everything ZIA; ZCC entitlement gates everything ZPA; (3) product-specific control plane — ZIA activates, ZPA propagates; ZIA has BC Cloud, ZPA doesn't; ZIA CA is active-passive, ZPA CA is active-active.

### D. Script completion backlog

Five scaffolds (`access-check.py`, `ssl-audit.py`, `sandbox-check.py`, `connector-health.py`, `zpa-app-check.py`) plus the bash stub (`splunk-query.sh`). Each scaffold's internal TODOs are specific and tractable **once a real tenant snapshot exists** to confirm SDK response shapes. First-run-against-tenant resolves most TODOs in one pass; the remainder need operator judgment on rule-classification thresholds etc.

Priority order for a fork admin: (1) `access-check.py` highest value, (2) `ssl-audit.py` and `sandbox-check.py` tie for second, (3) `zpa-app-check.py` and `connector-health.py` tie for third, (4) `splunk-query.sh` only if Splunk is the SIEM.

### E. Documentation maintenance

- **Duplicate refarch PDF** — see §Known findings above. Delete one after user confirms.
- **5-level wildcard cap "gotcha" elevation** — see §Known findings. Move the 5-level cap from a matching-table row to a Surprises/Gotchas callout at the top of `wildcard-semantics.md`; add a cross-link from `url-filtering.md § Specificity`.
- **Submodule bumps** — periodic work as upstream SDK / TF provider evolves. Guidance in `README.md § Submodule management`. A new SDK version typically adds resources and validator enums; skim the diff and propagate to `api.md` files.
- **`last-verified` refresh** — reference docs carry a per-file `last-verified` date. When revisiting a doc, update the date even if content stays the same, so staleness is visible.

### Priority recommendation for next session

~~If picking one thing to do next, in order:~~

Priority list as of the 2026-04-24 follow-up round:

1. ~~**Cross-product integrations dossier** (Section C)~~ — **DONE 2026-04-24**.
2. ~~**ZCC snapshot extension + first tenant run** (Section A)~~ — **DONE 2026-04-24** (snapshot extension landed; tenant run pending fork).
3. ~~**Malware Protection / ATP console diagnostic workflow** (Section A)~~ — **DONE 2026-04-24**.
4. ~~**ZDX** (Section B)~~ — **DONE 2026-04-24**.
5. ~~**ZBI / Cloud Browser Isolation** (Section B)~~ — **DONE 2026-04-24**.
6. ~~**ZIdentity deeper** (Section B)~~ — **DONE 2026-04-24**.
7. ~~**ZTW / ZTC (Cloud & Branch Connector)**~~ — **DONE 2026-04-24**.
8. **ZWA (Workflow Automation)** — narrow DLP-incident-management surface; ~10-12 methods. Low effort if tenant uses ZWA.
9. **Federal Cloud specifics** — only if tenant is gov.

## Crash-recovery hints

- **Resuming the `_clarifications.md` flow:** read Status summary at top → pick a Partial or Open → check origin reference doc for context → look in `vendor/zscaler-help/` for a candidate article → grep with `uv run --with pypdf …` (see transcripts for pattern).
- **Resuming Playwright captures:** existing captures live as `vendor/zscaler-help/<slug>.md` with frontmatter attribution. Pattern: navigate → wait 2.5s → expand accordion buttons (`aria-expanded="false"`) → `document.querySelector('article').innerText`.
- **Fork portability:** the skill is designed to be forked privately and run against a real tenant. Avoid prompts or scripts that depend on Claude Code-specific tooling; keep the skill runnable by whatever agent harness a fork uses.

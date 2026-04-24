---
product: shared
topic: "cross-product-integrations"
title: "Cross-product integrations — where ZIA, ZPA, and ZCC reach into each other"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
sources:
  - "references/zia/ssl-inspection.md"
  - "references/zia/cloud-app-control.md"
  - "references/zia/url-filtering.md"
  - "references/zia/malware-and-atp.md"
  - "references/zpa/app-segments.md"
  - "references/zpa/policy-precedence.md"
  - "references/zcc/forwarding-profile.md"
  - "references/zcc/web-policy.md"
  - "references/zcc/entitlements.md"
  - "references/shared/cloud-architecture.md"
  - "references/shared/activation.md"
author-status: draft
---

# Cross-product integrations

Where ZIA, ZPA, and ZCC reach into each other. These hooks are **where confident-but-wrong answers come from** — a skill that knows ZIA's rule precedence but not that a ZIA SSL Inspection rule can scope by a ZPA App Segment will miss the cross-product answer when it matters.

## Summary

The Zscaler products are structurally separate (different Central Authorities, different Service Edges, different admin consoles), but configuration reaches across product boundaries in a small number of **directional hooks**. Each hook is a place where:

- A field on one product's object references another product's object, OR
- A policy decision in one product depends on state managed by another, OR
- A client-side evaluation in ZCC feeds a server-side decision in ZIA or ZPA.

Because the hooks live scattered across different docs, an agent answering a single-product question can miss them. This doc pulls them into one place, organized by **direction of coupling**.

## Directional hook catalog

### ZIA → ZPA

Fields on ZIA objects that reference ZPA state.

**SSL Inspection rules can scope by ZPA App Segment.** The `zpa_app_segments` list on a ZIA SSL Inspection rule (`zscaler/zia/models/ssl_inspection_rules.py:113-115`) restricts the rule to traffic going to specific ZPA segments. Non-obvious constraints:

- **Only ZPA segments with `Source IP Anchor` enabled appear** in the criterion's selector. A tenant that expects all segments to be available will miss non-anchor-enabled segments silently. This is because SSL-inspecting traffic bound for a ZPA segment only makes sense when that segment is serving SIPA-routed traffic (which ZIA can see); pure-ZPA traffic doesn't flow through ZIA's SSL pipeline. See [`./source-ip-anchoring.md`](./source-ip-anchoring.md).
- **Cap: 255 segments** per SSL rule.
- Absent from URL Filtering and Cloud App Control rules — **SSL Inspection is the only ZIA policy type with this cross-product selector.**
- See [`../zia/ssl-inspection.md § Rule criteria`](../zia/ssl-inspection.md).

**Failure mode**: operator configures a ZPA segment, adds it to a ZIA SSL rule's `zpa_app_segments`, sees the segment isn't listed, and assumes the rule doesn't work. Actual cause: Source IP Anchor isn't enabled on the segment.

### Source IP Anchoring (SIPA) — dedicated cross-product flow

SIPA gets its own dedicated reference doc at [`./source-ip-anchoring.md`](./source-ip-anchoring.md) — it's a multi-step cross-product feature (ZIA forwards → ZPA App Connector delivers, so destination sees customer-controlled IP). Common failure modes threaded throughout this integrations dossier all point back there.

Highlights relevant for cross-product routing:

- **Setup chain spans both portals.** ZPA Admin Portal (App Segment `Source IP Anchor` flag + Client Forwarding Policy + Access Policy) AND ZIA Admin Portal (Forwarding Control rule + ZPA Gateway + DNS Control rules). Most SIPA failures are one portal configured while the other isn't.
- **Licensing note**: SIPA subscription is separate; a ZPA license is NOT required. Operators can deploy App Connectors purely as SIPA egress points.
- **Two variants**: standard SIPA and SIPA Direct (DR-mode fallback). Direct mode requires pre-planned Access Policy rules that allow ZCC clients.
- **Mutual-exclusion** with Browser Access, Double Encryption, and Multimatch on the same App Segment.
- **Country-code policy misfires** — ZPA country criterion uses last-NATed layer-3 IP, which for SIPA traffic is the ZIA PSE's IP, not the user's. Country-scoped ZPA rules misfire for SIPA users. See [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md).

### ZPA → ZIA

Fields on ZPA objects that invoke ZIA processing.

**ZPA Application Segments can request ZIA inline inspection.** The `inspect_traffic_with_zia` boolean on an Application Segment (`zscaler/zpa/models/application_segment.py`) hands private-app traffic off to ZIA's Service Edge for inspection before returning it to the ZPA data plane. See [`../zpa/app-segments.md`](../zpa/app-segments.md).

**Multimatch is incompatible with this toggle.** A segment with `inspect_traffic_with_zia = true` cannot use `match_style = INCLUSIVE` (Multimatch). See *Configuring Defined Application Segments* p.16 — the mutual-exclusion list also covers Browser Access, AppProtection, Privileged Remote Access, Double Encryption, and Source IP Anchor.

**Failure mode**: enabling ZIA inspection on a segment silently disables Multimatch eligibility for that segment's domain set. An admin who relies on Multimatch to catch port ranges on a wildcard segment can't also enable ZIA inspection on either segment without breaking the Multimatch contract.

### ZPA Access Policy → ZIA user-risk state

ZPA Access Policy rules can gate on ZIA-computed user-risk signals.

**`RISK_FACTOR_TYPE` condition in ZPA Access Policy** pulls the user's risk score from ZIA's Security Dashboard (see `references/zia/malware-and-atp.md` for what contributes — Page Risk score, ATP detections, Suspicious Content Protection). Lets a ZPA rule say "block this user from reaching the app if their ZIA user risk is elevated."

**Prerequisite**: the tenant must use both products, and the user must have enough ZIA activity for a risk score to exist. Users with no ZIA history get a default-low score — the rule never fires for them. See [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md).

**Failure mode**: admin adds a RISK_FACTOR_TYPE condition expecting it to block a specific high-risk user; that user happens to have zero ZIA activity; rule doesn't fire. Check the user's actual ZIA score before diagnosing the ZPA rule.

### ZCC → ZPA

Client-side evaluation feeds ZPA policy.

**`sendTrustedNetworkResultToZpa` on ZCC Forwarding Profile → `TRUSTED_NETWORK` condition in ZPA Access Policy.** ZCC evaluates trusted-network criteria continuously on the endpoint (see [`../zcc/trusted-networks.md`](../zcc/trusted-networks.md)). The result flows to ZPA only when this toggle is enabled on the active forwarding profile's `forwardingProfileZpaActions` block. See [`../zcc/forwarding-profile.md § ForwardingProfileZpaActions`](../zcc/forwarding-profile.md).

**Failure mode**: admin adds a TRUSTED_NETWORK condition to a ZPA rule; rule silently never matches because the flag is off on the user's active forwarding profile. This is the **single most common cross-product ZPA rule failure**.

**ZCC Entitlements gate ZPA access itself.** A user not entitled to ZPA via `ZpaGroupEntitlements.group_list` (or the `zpa_enable_for_all` trump-card flag) has **no ZPA microtunnel** at all — ZPA policy never evaluates for them. Distinct from "entitled-but-Deny" (ZPA rule evaluates and denies; LSS records exist). See [`../zcc/entitlements.md`](../zcc/entitlements.md).

**Failure mode**: operator debugs ZPA Access Policy rules extensively for a user who isn't actually entitled. Check entitlements first — it's a one-API-call fast pre-check before rule analysis.

**Machine Tunnel is separately gated** (`machineTunEnabledForAll`) — an all-or-nothing tenant-wide toggle. A tenant that wants Machine Tunnel for a subset of devices doesn't have a group-level knob at the SDK layer we've seen.

### ZCC → ZIA

Client-side settings that shape ZIA's visibility.

**`WebPolicy.pac_url`** (called "App Profile PAC URL" in the admin portal) — the PAC file ZCC honors for traffic-forwarding decisions. Combines with the Forwarding Profile to determine which traffic reaches ZIA at all. See [`../zcc/web-policy.md`](../zcc/web-policy.md).

**`WebPolicy.install_ssl_certs`** (per platform) — whether ZCC installs the Zscaler root CA into the OS certificate store. **Required for ZIA SSL Inspection to work without cert errors on the endpoint.** A per-platform `install_ssl_certs = false` silently breaks SSL inspection for users on that platform — they see cert warnings or outright TLS failures.

**`WebPolicy.zia_posture_config_id`** — references a ZIA device-posture configuration. Cross-product hook for posture-gated access. Not yet written up as a dedicated reference doc.

**Forwarding Profile `actionType: NONE` on the Trusted branch** — ZCC bypasses ZIA entirely on trusted networks. A TrustedNetwork criterion that's too permissive (home Wi-Fi with a default consumer subnet) silently exempts users from ZIA inspection while off-corporate. See [`../zcc/forwarding-profile.md § ForwardingProfileActions`](../zcc/forwarding-profile.md).

### ZIdentity → ZIA + ZPA (shared step-up-auth layer)

**ZIdentity Conditional Access underpins both:**

- ZIA URL Filtering's **`Conditional` action** — step-up auth before allowing. Requires ZIdentity + Client Connector forwarding; not supported via Service Edges (per [`../zia/url-filtering.md`](../zia/url-filtering.md)).
- ZPA Access Policy's **`Require Approval` action** (sometimes shown as Conditional Access) — same step-up pattern, applied before granting access to a private app.

Both actions delegate auth-challenge presentation to ZIdentity. A tenant without ZIdentity configured can't use either action type, regardless of which product owns the rule.

**OIDC-only constraint**: per [`../zidentity/step-up-authentication.md`](../zidentity/step-up-authentication.md), step-up requires an OIDC IdP integration. **A tenant on SAML-only IdP integration silently fails to step up** — Conditional and Require Approval rules match but don't produce the MFA prompt. This is a doc-level warning that should surface in any skill answer about these two actions for SAML-IdP tenants.

**Authentication Levels** are a tenant-wide tree (max 32, max depth 4). Both ZIA Conditional and ZPA Require Approval rules pull from the same level tree — you can't define ZIA-only or ZPA-only levels. See [`../zidentity/step-up-authentication.md § Authentication Levels`](../zidentity/step-up-authentication.md).

**Failure modes:**

- **Conditional rule fires for a GRE/IPSec-forwarded user**: no MFA prompt delivered (no ZCC channel); user just sees "access denied."
- **Conditional rule on a SAML-IdP tenant**: prompt never appears; session never elevates. Migrate to OIDC or don't use Conditional.
- **Authentication level validity configured backwards**: admin intuition is "parent = short validity, child = long validity" because children are more specific/sensitive. ZIdentity requires the **opposite**: parent validity must be less than child. Save fails with validation error. See [`../zidentity/step-up-authentication.md § The validity inversion`](../zidentity/step-up-authentication.md).
- **OIDC `acr` value drift**: external IdP team changes the `acr` value without updating the ZIdentity mapping; step-up elevations stop being recognized. Diagnose via token inspection.

### ZIdentity → all products (OneAPI authentication)

**All OneAPI authentication flows through ZIdentity.** Scripts, SDKs, Terraform providers, and direct HTTP callers authenticate as ZIdentity API Clients (OAuth 2.0 client credentials), receive tokens, and present them to the OneAPI gateway. See [`../zidentity/api-clients.md`](../zidentity/api-clients.md).

**Cross-product implications**:

- **API client scope restricts product access.** A client scoped only to `zia.*` can't reach ZPA or ZDX endpoints regardless of tenant configuration. Always the first thing to check on 403 responses.
- **Token TTL is tenant-wide** — not per-product. A long-running script that's working fine for ZIA calls will also work for ZPA calls until the shared token expires.
- **Client secret rotation invalidates all callers immediately** — rotating the secret for a single automation breaks every script/CI/TF pipeline that shared it. Plan rotations.
- **Legacy-auth tenants can't use OneAPI.** They use per-product auth paths and don't have ZIdentity. Fork admins on legacy tenants need a different auth setup per [`../zia/api.md § Legacy`](../zia/api.md) and [`../zpa/api.md`](../zpa/api.md).

### Cloud Connector → ZIA + ZPA (workload-side traffic forwarding)

**Cloud Connector is the workload-side equivalent of ZCC** — a VM deployed in the customer's cloud account (AWS / Azure / GCP) that forwards cloud-workload traffic to Zscaler. For workloads that can't run ZCC (servers, containers, cloud-native apps), Cloud Connector provides the same ZIA/ZPA integration.

**Traffic forwarding rule methods decide what happens per-packet:**

- **ZIA** → forward internet-bound traffic to a ZIA gateway.
- **ZPA** → forward workload-to-internal-app traffic through ZPA (requires Cloud Connector ZPA enrollment + ZPA Application Segment + Access Policy allow).
- **Direct** → bypass Zscaler entirely. Used for cloud metadata endpoints, local VPC services.
- **Drop** → discard traffic.
- **Local** → Cloud Connector / ZTG only; cloud-to-cloud local inspection.

**Cross-product failure modes:**

- **Workload traffic fails to reach internet**: check Cloud Connector rule matching (Direct exemption above an intended ZIA rule?) AND ZIA gateway health (primary/secondary/tertiary chain).
- **Workload-to-workload ZPA access fails**: diagnose in layers. Cloud Connector ZPA enrollment → ZPA Access Policy for the destination → App Connector on the destination side. Multi-product chain.
- **Cloud provider metadata service (169.254.169.254) breaks**: almost always a missing Direct-method rule for that endpoint. Workloads requesting cloud IAM tokens fail until exempted.
- **Activation gate differs from ZPA**: Cloud Connector uses a ZIA-style activation gate (staged pending until explicit activate). An admin changing both a Cloud Connector rule and a ZPA rule sees ZPA propagate immediately, Cloud Connector wait for activation. See [`./activation.md`](./activation.md).

### ZIA DLP → ZWA (incident lifecycle)

**ZWA is downstream of ZIA DLP.** ZIA detects policy violations during traffic inspection; Workflow Automation ingests each detection as an **incident** and handles triage + remediation (notify user, escalate, create ticket, close). Full DLP mechanics in [`../zia/dlp.md`](../zia/dlp.md) — dictionaries, engines, policy rules, file-size inspection limits (400MB file / 100MB extracted text / 5-level archive recursion), and the Cloud-to-Cloud Incident Forwarding path that feeds ZWA.

**Multi-product dependency chain:**

```
SSL Inspection decrypts
    ↓
ZIA DLP engine sees content and matches policy
    ↓
Incident created and forwarded to ZWA
    ↓
Workflow mapping evaluates
    ↓
Workflow fires (Auto Notify / Auto Escalate / Auto Create Ticket / Auto Close)
```

**Break any link → no incident in ZWA:**

- **No SSL decrypt** → ZIA DLP can't see content → no detection → no incident. Most common failure mode. See [`../zia/ssl-inspection.md § SSL bypass is a cross-policy gate`](../zia/ssl-inspection.md).
- **ZIA DLP policy not configured** → no detection → no incident.
- **ZIA→ZWA integration disabled** → ZIA detects but doesn't forward to ZWA.
- **Workflow mapping doesn't match incident attributes** → incident lands in ZWA but no workflow triggers (admin must triage manually).

**Failure mode diagnosis order** for "DLP event didn't create a ticket" questions: (1) SSL decrypt, (2) ZIA DLP rule, (3) ZIA→ZWA forwarding, (4) ZWA workflow mapping. Don't skip to step 4; the earlier links are more commonly the cause.

**Evidence field is sensitive.** ZWA's `get_incident_evidence` API call (and the admin-portal Incidents page) returns the actual DLP-matched payload content — the exact data DLP was trying to protect. Admin portal RBAC for ZWA effectively controls access to this content. See [`../zwa/api.md § Sensitive data considerations`](../zwa/api.md).

### Cloud Connector ↔ ZPA App Connector (adjacent outbound-only VMs)

**Don't confuse Cloud Connector with App Connector** — they're both outbound-only Zscaler VMs but serve opposite sides of the ZPA traffic flow:

- **Cloud Connector**: deployed on the **workload side** (AWS/Azure/GCP customer account). Receives workload traffic, forwards to Zscaler.
- **App Connector**: deployed on the **application side** (data center / VPC hosting the private app). Receives requests from ZPA Service Edge, forwards to the app server.

They coexist in the same workload-to-private-app traffic flow: Cloud Connector → ZPA Service Edge → App Connector → app server.

See [`../cloud-connector/overview.md § Cloud Connector vs App Connector`](../cloud-connector/overview.md) for the full comparison table.

### ZIdentity → all products (user/group/department/location sync)

**ZIdentity is the source-of-truth for user directory data** that ZIA, ZPA, ZDX, and ZBI all reference in their policy rules. Other products pull from ZIdentity on a periodic sync — not real-time. See [`../zidentity/overview.md § Cross-product user sync`](../zidentity/overview.md).

**Failure mode**: admin adds user or group to ZIdentity and expects it to immediately appear in ZIA URL Filter rule dropdowns / ZPA Access Policy criteria. Sync latency is minutes-to-hours. Wait and refresh; this is not a bug.

### SSL Inspection → everything content-based

**SSL decrypt is a prerequisite for all content-layer inspection.** Cross-policy gate per [`../zia/ssl-inspection.md § SSL bypass is a cross-policy gate`](../zia/ssl-inspection.md):

| Feature | Breaks under SSL bypass? |
|---|---|
| URL Filtering (SNI/domain-level) | Partial — SNI match still works, path/method/body don't |
| Cloud App Control (app identification) | Yes — CAC can't disambiguate `docs.google.com` from `mail.google.com` without decrypt |
| DLP (Web DLP, Inline CASB) | Yes — completely ineffective for HTTPS |
| Sandbox | Yes — doesn't see files |
| Malware Protection (content-based) | Yes |
| ATP (content-based detections — not URL-based) | Yes |
| File Type Control | Yes — MIME sniffing falls back to host/path heuristics |
| IPS (signature-based content detection) | Yes |

**The `Do Not Inspect + Bypass Other Policies` variant** goes further — bypasses URL Filtering and CAC *in addition to* SSL inspection. The `Evaluate Other Policies` variant only bypasses SSL inspection.

**Failure mode**: tenant adds SSL Inspection bypass for a category (often Miscellaneous or Unknown under transparent forwarding) and is surprised when DLP/Sandbox/Malware stop catching things for traffic matching that category. All content-based detection silently degrades together.

### AI/ML recategorization (ATP → URL Filtering)

**ATP's AI/ML tools reclassify uncategorized URLs into Botnet Protection or Fraud Protection (Phishing) categories.** When enabled, this silently changes what category a URL "belongs to" — which is the input to URL Filtering's rule evaluation.

A URL that was `MISCELLANEOUS_OR_UNKNOWN` yesterday and matched no URL Filtering rule can be recategorized to "Phishing" today and block unexpectedly. See [`../zia/malware-and-atp.md § AI/ML-driven recategorization`](../zia/malware-and-atp.md).

**Failure mode**: operator reports "users could reach this URL last week and now can't" — no rule changed, but ATP's AI/ML classifier updated the URL's category. Check the Security Dashboard for recent ATP recategorizations before assuming a rule edit.

### Feed Central → CA → Service Edges (threat intel distribution)

Not a hook between products so much as a shared input path. **Feed Central distributes threat intel to each cloud's Central Authority**, which pushes to all Service Edges (ZIA and ZPA — though ZPA's primary use is access control, not threat inspection). Relevant because:

- **All tenants on a cloud receive the same classification feeds** simultaneously.
- A feed update that misclassifies a legitimate URL (false positive in Zscaler's shared threat intel) affects every tenant on that cloud.
- Feed Central failures don't immediately degrade security — Service Edges run on last-fetched feeds until Feed Central recovers.

See [`./cloud-architecture.md § Feed Central`](./cloud-architecture.md).

### Business Continuity Cloud → ZIA Private Service Edges

**BC Cloud is a ZIA-only construct.** Private Policy Cache and Private PAC Servers integrate with ZIA Private Service Edges. ZPA has no equivalent BC Cloud — ZPA's availability model is different (active-active CA with distributed nodes). See [`./cloud-architecture.md § Business Continuity Cloud`](./cloud-architecture.md).

**Z-Tunnel 2.0 doesn't work in BC mode.** Tenants migrated to 2.0 fall back to 1.0 during BC failover.

**Failure mode**: tenant plans BC by testing ZIA continuity, doesn't realize ZPA traffic doesn't flow through BC Cloud at all. ZPA keeps using its normal Service Edges (or fails) during a BC event depending on whether the ZPA cloud itself is degraded.

### Activation gate (ZIA-only) → propagation model

**ZIA has an activation gate; ZPA does not.** ZIA config changes are staged pending until `POST /status/activate`. ZPA changes propagate on write. See [`./activation.md`](./activation.md).

**Cross-product implication**: an admin who edits a ZIA rule and a ZPA rule in a single session sees the ZPA change take effect immediately and the ZIA change take effect only after activation. A skill answer that says "I just changed the rule, why isn't it working" needs to branch on product — check activation for ZIA, check rule evaluation for ZPA.

### NSS ↔ LSS (log streaming products)

**NSS (ZIA logs) and LSS (ZPA logs) are separate products with overlapping fields.** Both stream to a customer SIEM. Neither can carry the other's events. Cross-correlating a user's activity across ZIA and ZPA in a SIEM requires joining by user identity, not by a shared log field — and user identity field names differ between the two schemas. See [`../zia/logs/web-log-schema.md`](../zia/logs/web-log-schema.md) and [`../zpa/logs/access-log-schema.md`](../zpa/logs/access-log-schema.md).

### ZDX → ZCC + ZIA/ZPA definitions

**ZDX pulls user, department, and location definitions from ZIA and ZPA.** Per [`./cloud-architecture.md § ZDX integration with ZTE`](./cloud-architecture.md), ZDX's Zero Trust Exchange integration connects to ZIA and ZPA clouds to retrieve the org's users/departments/locations. Standalone ZDX tenants (without ZIA or ZPA) have their own user-definition infrastructure.

**Failure mode**: admin adds users to ZIA but ZDX dashboards don't immediately show them. ZDX is sourcing from its periodic sync with ZIA — expect minutes-to-hours propagation, not real-time.

**ZDX depends on ZCC entitlement to receive device metrics.** Without a user being entitled via `ZdxGroupEntitlements` (see [`../zcc/entitlements.md`](../zcc/entitlements.md)), ZCC doesn't send ZDX telemetry for them. No data → no ZDX Score.

### ZDX → Microsoft Azure Data Explorer (analytics backend)

ZDX's analytics layer is Microsoft-hosted (Azure Data Explorer / ADX) — an external cloud dependency worth knowing for data-residency/sovereignty reviews. See [`../zdx/overview.md § Components`](../zdx/overview.md).

### ZDX probes bypass SSL Inspection

**Synthetic ZDX Web probes skip SSL Inspection** to allow caching at destination servers — per [`../zdx/probes.md § Web probes`](../zdx/probes.md). URL Filtering, CAC, and Firewall rules still apply to probes.

**Failure mode**: "ZDX probe succeeds but real user traffic fails for the same URL" — the probe's SSL-exemption means the probe path differs from user traffic. The probe is not a valid test that SSL inspection isn't in the way.

### ZBI (Cloud Browser Isolation) — cross-product triggers

**ZIA URL Filter `Isolate` action routes to ZBI.** A URL Filter rule with action `Isolate` matching a user's request produces a 302 redirect to the configured isolation profile URL, which hands off to an ephemeral cloud browser container. See [`../zbi/overview.md`](../zbi/overview.md).

**ZPA Isolation Policy routes to ZBI for private apps.** ZPA's Isolation Policy family (alongside Access, Timeout, Forwarding, Inspection) decides which private-app requests go through an isolated browser. See [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md) for family evaluation order and [`../zbi/policy-integration.md`](../zbi/policy-integration.md) for ZPA Isolation rule shape.

**Smart Browser Isolation auto-creates an SSL Inspection rule.** When enabled, Smart Isolation silently adds a decrypt rule for suspicious websites. Operators auditing SSL Inspection rule count see a rule they didn't manually create. See [`../zbi/policy-integration.md § Smart Browser Isolation`](../zbi/policy-integration.md).

**ZIA policies apply twice on isolated traffic.** Traffic passes through Public Service Edges on both legs (user→ZBI and ZBI-container→destination). URL Filter, CAC, DLP, Sandbox, Malware Protection evaluate on both — the cloud browser's egress is subject to ZIA as if it were any other user's traffic.

**ZPA Isolation session timeout is the minimum of all configured ZPA timeout policies.** Not a dedicated isolation timeout — inherits the tightest timeout from any timeout-family rule. Can produce surprisingly-short isolation sessions if an unrelated ZPA timeout policy is aggressive.

**Failure modes:**

- **URL Filter Isolate rule matches but doesn't fire**: SSL Inspection isn't decrypting for that URL. Isolate needs to intercept HTTP to send the 302 redirect.
- **Smart Isolation doesn't fire despite being enabled**: Malware Protection's `Inspect Inbound Traffic` / `Inspect Outbound Traffic` toggles are off. Smart Isolation depends on the Malware Protection content-inspection pipeline to feed its AI/ML classifier.
- **Isolation unavailable during ZPA maintenance**: "If ZPA is undergoing a maintenance period, Isolation might not be available" per the ZPA Isolation Policy doc. Temporary operator-visible failure mode not common in other products.
- **M&U subscription tier user can't configure isolation profile settings**: tier limits the profile to pre-set values; upgrade required to unlock. See [`../zbi/policy-integration.md § Miscellaneous & Unknown`](../zbi/policy-integration.md).

## Common cross-product question shapes

Routing hints for question patterns that often hit these hooks. Use this section to pre-empt "I asked about ZIA but the answer is really about ZPA/ZCC."

| Question | Likely cross-product hook | Check first |
|---|---|---|
| "ZIA SSL rule isn't matching traffic to our ZPA app" | ZIA SSL `zpa_app_segments` — Source IP Anchor not enabled on the segment | [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md), then `../zpa/app-segments.md` |
| "Multimatch won't save on this segment" | `inspect_traffic_with_zia` on the segment is true (or one of the other Multimatch-incompatible features) | [`../zpa/app-segments.md § Edge cases`](../zpa/app-segments.md) |
| "Our ZPA TRUSTED_NETWORK rule never matches" | `sendTrustedNetworkResultToZpa` flag off on forwarding profile | [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md) |
| "User can't reach any ZPA app" | ZPA entitlement via ZCC (`zpa_enable_for_all` / `group_list`) | [`../zcc/entitlements.md`](../zcc/entitlements.md) before ZPA policy |
| "CAC can't tell apart these two Google apps" | SSL Inspection bypass prevents app identification | [`../zia/cloud-app-control.md § Interaction with SSL inspection`](../zia/cloud-app-control.md) |
| "DLP/Sandbox/Malware aren't catching this" | SSL Inspection bypass for the URL's category | [`../zia/ssl-inspection.md § SSL bypass is a cross-policy gate`](../zia/ssl-inspection.md) |
| "macOS users see cert errors but Windows doesn't" | `install_ssl_certs` per-platform on Web Policy | [`../zcc/web-policy.md`](../zcc/web-policy.md) |
| "URL was accessible last week, blocked now, no rule change" | ATP AI/ML recategorized to Botnet or Phishing | [`../zia/malware-and-atp.md § AI/ML-driven recategorization`](../zia/malware-and-atp.md) |
| "Conditional / Require Approval rule doesn't fire for GRE users" | Step-up auth needs ZCC forwarding, not GRE | [`../zia/url-filtering.md`](../zia/url-filtering.md) and `../zpa/policy-precedence.md` |
| "Activated my ZIA rule, still not working" | Activation gate — `GET /status` — or quota/validation activation failure | [`./activation.md`](./activation.md) |
| "Changes propagated for ZPA but not ZIA" | Product-specific activation model — not a bug | [`./activation.md`](./activation.md) |
| "During an outage, ZPA traffic broke but ZIA didn't" | BC Cloud is ZIA-only; ZPA has its own availability model | [`./cloud-architecture.md § Business Continuity Cloud`](./cloud-architecture.md) |
| "ZDX has no data for this user" | ZCC entitlement not granted — user can't report telemetry | [`../zcc/entitlements.md`](../zcc/entitlements.md), then [`../zdx/overview.md`](../zdx/overview.md) |
| "ZDX probe works but real traffic fails" | SSL Inspection skipped on synthetic probes only | [`../zdx/probes.md § Web probes`](../zdx/probes.md) |
| "ZDX data residency question" | Analytics backend is Microsoft Azure Data Explorer | [`../zdx/overview.md`](../zdx/overview.md) |
| "Isolate URL Filter rule matches but user doesn't get isolated" | SSL Inspection not decrypting that URL | [`../zbi/policy-integration.md`](../zbi/policy-integration.md), then [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md) |
| "Smart Isolation doesn't fire on suspicious sites" | Malware Protection inspection toggles off | [`../zbi/policy-integration.md § Smart Browser Isolation`](../zbi/policy-integration.md) |
| "Can't change copy/paste or file-transfer setting on isolation profile" | Miscellaneous & Unknown subscription tier locks those fields | [`../zbi/policy-integration.md § Miscellaneous & Unknown`](../zbi/policy-integration.md) |
| "Isolated session times out fast / unexpectedly" | ZPA Isolation uses min of all ZPA timeouts, or 10-min idle container timeout | [`../zbi/overview.md`](../zbi/overview.md) |
| "Conditional Access / Require Approval doesn't prompt for MFA" | Either SAML IdP (step-up is OIDC-only) or non-ZCC forwarding path | [`../zidentity/step-up-authentication.md`](../zidentity/step-up-authentication.md) |
| "Can't save authentication level — validation error on validity" | Parent-child validity inversion: parent MUST be less than child | [`../zidentity/step-up-authentication.md § The validity inversion`](../zidentity/step-up-authentication.md) |
| "API call returns 403 for a specific product" | API client scope doesn't include that product's resource server | [`../zidentity/api-clients.md`](../zidentity/api-clients.md) |
| "New user added to ZIdentity but not showing in ZIA/ZPA" | Sync latency — minutes to hours, not real-time | [`../zidentity/overview.md § Cross-product user sync`](../zidentity/overview.md) |
| "AWS/Azure/GCP workload traffic isn't going through Zscaler" | Cloud Connector rule match (Direct-exemption rule above intended ZIA rule?) or gateway health | [`../cloud-connector/forwarding.md`](../cloud-connector/forwarding.md), [`../cloud-connector/overview.md § Primary/secondary/tertiary`](../cloud-connector/overview.md) |
| "Workload can't reach AWS IMDS / cloud metadata" | Missing Direct-method rule for 169.254.169.254 | [`../cloud-connector/forwarding.md § Common patterns`](../cloud-connector/forwarding.md) |
| "Cloud Connector deployed but traffic not reaching — workloads failing" | Fail-close-by-default: if gateways unreachable, workloads lose internet. Check gateway health + fail-close/fail-open setting | [`../cloud-connector/overview.md § Fail-close vs fail-open`](../cloud-connector/overview.md) |
| "Workload-to-internal-app fails via Cloud Connector + ZPA" | Multi-product chain: CC rule → ZPA Access Policy → App Connector health | [`../cloud-connector/overview.md`](../cloud-connector/overview.md), [`../zpa/app-segments.md`](../zpa/app-segments.md) |
| "DLP event didn't create a ticket / notify user" | Multi-link chain: SSL decrypt → ZIA DLP rule → ZIA→ZWA integration → ZWA workflow mapping. Check in that order. | [`../zwa/overview.md § Dependencies`](../zwa/overview.md) |
| "DLP didn't catch this big file" / "DLP missed content in a 500MB document" | 400MB file-size cap + 100MB extracted-text inspection window + 5-level compression limit | [`../zia/dlp.md § Content inspection limits`](../zia/dlp.md) |
| "How do I write a DLP rule that matches my custom dictionary?" | Rules reference engines, not dictionaries — wrap the dictionary in an engine first | [`../zia/dlp.md § Three-layer object model`](../zia/dlp.md) |
| "Why is a DLP incident visible in the ZWA portal but no workflow fired?" | Workflow mapping missing or doesn't match the incident's attributes | [`../zwa/overview.md § Workflow mappings`](../zwa/overview.md) |

## The recurring patterns

Three themes show up across the hooks:

1. **Silent-miss flags.** A feature appears configured but quietly doesn't apply because an enabling flag is off somewhere else. `sendTrustedNetworkResultToZpa`, Source IP Anchor on ZPA segments, `install_ssl_certs` per platform, ZCC entitlements, `enable_evaluate_policy_on_global_ssl_bypass`. Pattern: when a rule "doesn't match but should," check the opposite product's enabling flag before analyzing the rule itself.
2. **One-way dependencies.** SSL decryption is the gating dependency for everything content-based. ZCC's forwarding-profile `actionType: NONE` is the gating dependency for anything ZIA does. ZCC entitlement is the gating dependency for anything ZPA does. These form a layered stack — break the lower layer, everything above silently degrades.
3. **Product-specific control plane.** ZIA activates; ZPA propagates. ZIA has BC Cloud; ZPA doesn't. ZIA CA is active-passive; ZPA CA is active-active. The products look similar from the outside and work very differently under the hood. An answer that generalizes across products is usually missing one of these distinctions.

## Cross-links

- Central cloud-architecture picture — [`./cloud-architecture.md`](./cloud-architecture.md)
- Terminology (renames and aliases) — [`./terminology.md`](./terminology.md)
- Policy evaluation meta-model — [`./policy-evaluation.md`](./policy-evaluation.md)
- Activation mechanics — [`./activation.md`](./activation.md)
- ZIA SSL inspection — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
- ZIA URL filtering — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZIA CAC — [`../zia/cloud-app-control.md`](../zia/cloud-app-control.md)
- ZIA Malware Protection / ATP — [`../zia/malware-and-atp.md`](../zia/malware-and-atp.md)
- ZPA app segments — [`../zpa/app-segments.md`](../zpa/app-segments.md)
- ZPA policy precedence — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- ZCC forwarding profile — [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md)
- ZCC trusted networks — [`../zcc/trusted-networks.md`](../zcc/trusted-networks.md)
- ZCC Web Policy / App Profile — [`../zcc/web-policy.md`](../zcc/web-policy.md)
- ZCC entitlements — [`../zcc/entitlements.md`](../zcc/entitlements.md)

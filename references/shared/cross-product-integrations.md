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

- **Only ZPA segments with `Source IP Anchor` enabled appear** in the criterion's selector. A tenant that expects all segments to be available will miss non-anchor-enabled segments silently.
- **Cap: 255 segments** per SSL rule.
- Absent from URL Filtering and Cloud App Control rules — **SSL Inspection is the only ZIA policy type with this cross-product selector.**
- See [`../zia/ssl-inspection.md § Rule criteria`](../zia/ssl-inspection.md).

**Failure mode**: operator configures a ZPA segment, adds it to a ZIA SSL rule's `zpa_app_segments`, sees the segment isn't listed, and assumes the rule doesn't work. Actual cause: Source IP Anchor isn't enabled on the segment.

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

**Failure mode**: operator configures a Conditional rule in ZIA URL Filtering expecting it to work everywhere; it silently doesn't fire for users forwarded via GRE/IPSec (non-ZCC paths). Only the ZCC forwarding path carries the identity context needed for step-up auth.

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

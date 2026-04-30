---
product: zpa
topic: "appprotection"
title: "ZPA AppProtection — inline WAF/IPS for ZPA-protected apps"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/protecting-private-applications-zpa-appprotection.md"
  - "vendor/zscaler-help/about-appprotection-controls.md"
  - "vendor/zscaler-help/about-appprotection-policy.md"
  - "vendor/zscaler-help/about-appprotection-profiles.md"
  - "vendor/zscaler-help/about-appprotection-applications.md"
  - "vendor/zscaler-help/about-active-directory-controls.md"
  - "vendor/zscaler-help/configuring-appprotection-policies.md"
author-status: draft
---

# ZPA AppProtection — inline WAF/IPS for ZPA-protected apps

AppProtection is ZPA's **inline application-layer security inspection engine** — a hybrid web-application-firewall + intrusion-prevention-system that sits inside the ZPA data path and inspects HTTP, HTTPS, and several application protocols for known attack patterns. It's not a separate appliance; it runs inside the Zero Trust Exchange (ZTE), engages only on application segments that opt into it, and produces its own log stream alongside ZPA's normal access logs.

**This is a major capability that complements rather than overlaps the rest of the ZPA suite.** Where standard ZPA Access Policy answers "should this user reach this app at all", AppProtection answers "is the traffic this user is sending to the app actually attacking it." Both layers can fire on the same connection.

**Note on naming**: AppProtection was previously called **Inspection** in the ZPA portal and SDKs. References to "ZPA Inspection Policy", "Inspection Profile", "Inspection Control" in older docs / SDKs / Terraform resources point at the same product. The skill's existing references to `zpn_inspection_profile_id` (in `policy-precedence.md`) and TF resources like `zpa_inspection_*` are AppProtection in current naming.

## Architecture

```
user (browser or ZCC)
        │
        ▼
ZPA App Connector ─────────► Zero Trust Exchange ─────────► protected app
                                    │
                                    ▼
                            AppProtection inline
                            (inspect HTTP/HTTPS/AD
                             protocols + apply profile)
                                    │
                                    ▼
                            allow / block / redirect
                                    │
                                    ▼
                            LSS log stream
                            (AppProtection event)
```

- **Inspection runs inline inside the ZTE** — no separate appliance, no traffic deflection.
- **TLS 1.2 decryption** with cipher `ECDHE-RSA-AES128-GCM-SHA256` to inspect HTTPS payloads. Browsers / clients that don't negotiate this cipher fail.
- **Engages per application segment** — flagged by enabling AppProtection on the application within an application segment. Other apps in the segment are unaffected.
- **Output goes to LSS, not NSS** — distinct log stream type "AppProtection" alongside User Activity, Audit Logs, etc. See [`./logs/access-log-schema.md`](./logs/access-log-schema.md) for the LSS context.
- **Browsers without ZCC can use AppProtection-protected apps** — same dual-access model as Browser Access (see [`./browser-access.md`](./browser-access.md)).

## The three-tier policy model

```
Controls         (atomic detection units)
  │ bundled into
  ▼
Profiles         (named configurations of controls + paranoia + actions)
  │ referenced by
  ▼
Policy Rules     (criteria + action + profile assignment, evaluated in order)
```

### Tier 1 — Controls (the detection atoms)

A Control is a single detection rule — "does this HTTP body contain SQL-injection patterns", "is this Kerberos AS-REQ from a suspicious source", etc. Each carries:

- **Control Number** — unique identifier
- **Description** — what it detects
- **Severity** — Low / Medium / High / Critical
- **Paranoia Level** — 1 (most conservative, fewer false positives) to 4 (most aggressive)
- **Default Action** — Allow / Block / Redirect

Controls come from **six categories**:

| Category | Source | What it covers |
|---|---|---|
| **OWASP** | OWASP Core Rule Set (current version `OWASP_CRS/4.8.0`) | 13 attack-class categories — see below |
| **ThreatLabZ** | Zscaler's threat-research team | Zero-day patterns, attacker tooling, Zscaler-curated rules |
| **Active Directory** | Zscaler-built | Kerberos / SMB / LDAP protocol-level attacks (enumeration, credential stuffing, abuse patterns) |
| **API** | Zscaler-built | API-segment-specific attack patterns |
| **WebSocket (predefined)** | Zscaler-built | WebSocket protocol-specific attacks |
| **WebSocket / HTTP (custom)** | Customer-authored | Tenant-specific detection rules |

#### OWASP control categories (13 groups)

From `vendor/zscaler-help/about-appprotection-controls.md`:

- Preprocessors
- Environment and Port Scanners
- Protocol Issues
- Request Smuggling / Response Splitting / Header Injection
- Local File Inclusion
- Remote File Inclusion
- Remote Code Execution
- PHP Injection
- Cross-Site Scripting (XSS)
- SQL Injection
- Session Fixation
- Deserialization
- Issues / Anomalies

Each group contains many specific Control Numbers (the OWASP CRS ships hundreds total). The page supports an `Unsupported` filter showing controls from older CRS versions, with a `Migrate` action to upgrade in bulk.

#### Active Directory protocol controls — the surprising one

Most ZPA users won't expect inline inspection of **Kerberos, SMB, and LDAP** as a feature. AppProtection inspects these for:

- AD enumeration patterns (LDAP queries that look like reconnaissance)
- Kerberoasting (suspicious AS-REQ / TGS-REQ patterns)
- DCSync-like access patterns
- SMB lateral-movement signatures

Enabled by **enabling Active Directory in an application segment**, not via the standard inspection toggle.

Output: **Active Directory Protection dashboard** in the ZPA Admin Console for in-console visibility. AD controls also flow through the AppProtection LSS log stream like other controls.

### Tier 2 — Profiles (bundles of controls)

A Profile is a named reusable bundle. Picks:

- Which controls to include (from any of the 6 categories)
- The **Paranoia Level** for predefined-control sub-bundles (1-4)
- The **action** for each control — either a global action across the profile or per-control overrides

**Default profile shipped:** `OWASP Top-10 for Visibility`
- Paranoia Level **1** (conservative)
- **Read-only** — cannot be edited or deleted
- Some controls excluded for higher efficacy (Zscaler tuning)
- Usable directly in policy rules; recommended starting point

Custom profiles are clones-of-default (or built-from-scratch) where you tune controls + actions for your environment.

### Tier 3 — Policy Rules (where + how to apply)

Policy rules at **Policies > Cybersecurity > Inline Security > Protection Policies > AppProtection** evaluate top-to-bottom:

- **Rule Order** — first match wins (same model as ZPA Access Policy)
- **Rule Action**:
  - `Inspect` — apply the named profile
  - `Bypass Inspection` — explicitly skip AppProtection for matching traffic
- **AppProtection Profile** — which profile to apply on Inspect actions
- **Criteria** — up to 10 condition sets

#### Criteria types

| Criterion | Combination |
|---|---|
| Applications (segments / segment groups) | OR between multiples |
| Client Connector Posture Profiles | AND between sets; OR within (toggleable) |
| Client Connector Trusted Networks | OR between multiples |
| Client Types | Client Connector / Cloud Browser / Cloud Connector / Machine Tunnel / Web Browser / ZIA Service Edge |
| Cloud Connector Groups | AND between multiples |
| Machine Groups + platform | — |
| SAML / SCIM Attributes (ZIdentity) | — |

**Criteria can be cloned from an existing Access Policy rule.** This is the operational best-practice — keeps inspection scope aligned with access scope so users who can reach an app are also the users whose traffic to it gets inspected.

## How AppProtection relates to other ZPA features

| Feature | Relationship |
|---|---|
| **Access Policy** | Independent. Access Policy decides "can this user reach this app"; AppProtection decides "is their traffic to that app malicious." Both fire on the same connection. Recommended: clone Access Policy criteria into AppProtection rules to keep them aligned. |
| **App Segments** | AppProtection is **opt-in per application** within a segment. Toggle: "enable AppProtection for the application." |
| **Browser Access** | Compatible — both use TLS 1.2 with the same cipher (`ECDHE-RSA-AES128-GCM-SHA256`). An AppProtection-protected segment with Browser Access enabled has its browser traffic both terminated at ZPA's ingress AND inspected by AppProtection. |
| **PRA** | Not directly mentioned in AppProtection docs; PRA traffic is RDP/SSH/VNC and not subject to HTTP/AD-protocol inspection. PRA's session-recording is the analogous oversight layer for those protocols. |
| **SIPA** | Compatible (presumably — not mentioned as mutually exclusive in captures). |
| **Multimatch** | Not flagged as mutually exclusive in current captures, but **was** previously flagged as conflicting with "Inspection" (the old name for AppProtection) in `app-segments.md` quote: *"Multimatch must be disabled if the configuration contains applications using the Access Type of Browser Access, AppProtection, or Privileged Remote Access."* So **Multimatch IS mutually exclusive with AppProtection**. |
| **Inspection Policy / Profile / Control** (legacy naming) | Same product; renamed to AppProtection. References in `policy-precedence.md` (`zpn_inspection_profile_id`), `terraform.md` (TF resources like `zpa_inspection_*`), and elsewhere are AppProtection. |

## Logging — LSS, not NSS

AppProtection events flow through ZPA's **Log Streaming Service (LSS)** as a dedicated log type called "AppProtection." Distinct from:

- **User Activity** logs (LSS) — access decisions and connection metadata
- **Audit Logs** (LSS) — admin actions
- **NSS** (ZIA's separate streaming layer) — does NOT receive AppProtection events

Operational implication: **SIEM integrations standardized on NSS for ZIA must add a separate LSS receiver to capture AppProtection events.** Common pattern: deploy LSS App Connector + log receiver alongside the existing NSS receiver, route both into the SIEM with appropriate index naming.

The "Understanding AppProtection Log Fields" article (referenced from the LSS overview) details the exact field set; not yet captured in this skill.

## Licensing

AppProtection appears bundled with ZPA — the default `OWASP Top-10 for Visibility` profile ships with every ZPA account, and the help docs don't gate basic AppProtection behind a separate SKU.

**However**, the captured *About AppProtection Policy* doc explicitly notes:

> Depending on your AppProtection subscription, you see the following Security policy option: Browser Protection.

This implies **tier-gated AppProtection capabilities**:

- Baseline AppProtection — bundled with ZPA
- Browser Protection — tier-gated, separate subscription consideration
- Possibly other tier-gated capabilities not captured (ThreatLabZ controls, advanced Active Directory protection, custom-rule limits, etc.)

Specific tier names (Business / Transformation / Workplace+) and what each unlocks aren't spelled out in captured help docs. **Confirm with TAM** for actual entitlement on a given tenant.

## Surprises worth flagging

1. **AppProtection was called Inspection until recently.** SDKs, Terraform resources, and older docs say "Inspection Policy", "Inspection Profile", `zpn_inspection_profile_id`. They're the same thing. A user looking at ZPA Terraform with `zpa_inspection_*` resources is configuring AppProtection.

2. **The default profile (`OWASP Top-10 for Visibility`) is fully immutable.** It cannot be edited or deleted, and its **Paranoia Level is permanently set to 1**. Some controls are deliberately excluded from it for higher efficacy — Zscaler-tuned. An operator wanting to tune Paranoia Level higher than 1 must clone the profile first, which changes the policy reference. Tenants new to AppProtection often start by trying to "edit OWASP Top-10 for Visibility" and find they can't change anything. Source: *About AppProtection Profiles* lines 27-32.

3. **Active Directory inspection is a feature people miss.** Kerberos / SMB / LDAP protocol inspection inside the ZPA tunnel is rare in WAF products and surprises operators expecting only HTTP/HTTPS scope.

4. **Per-control action granularity.** Within one profile, different controls can have different actions (some Block, some Allow with logging, some Redirect). Not just one global action. This is more granular than typical WAF tooling.

5. **AppProtection log type is LSS-distinct.** SIEM teams who only stream NSS will silently miss all AppProtection events. Verify LSS receiver is configured alongside any NSS deployment.

6. **Same TLS 1.2 cipher constraint as Browser Access.** `ECDHE-RSA-AES128-GCM-SHA256`. Old browsers / appliances that don't negotiate this cipher fail. Modern browsers handle it fine.

7. **Multimatch + AppProtection = mutually exclusive on the same segment.** Per `app-segments.md` quote (*User-to-App Segmentation Reference Architecture* p.10). Tenants using Multimatch must split AppProtection-needed apps into separate segments.

8. **Paranoia Level only applies to predefined controls.** Custom HTTP / WebSocket controls don't use Paranoia Level — they're just on/off with a chosen action. Operators tuning paranoia higher don't affect their custom rules.

9. **Browser Protection tier difference is not documented in captures.** What capabilities Browser Protection unlocks beyond baseline AppProtection isn't spelled out publicly. Operator-level question for TAM.

10. **OWASP CRS version migration is a deliberate operator action.** Older OWASP CRS controls don't auto-upgrade — operators must select and run the `Migrate` action. Tenants on long-running deployments may be using outdated rule sets without realizing.

## Common questions this unlocks

- **"Is AppProtection part of ZPA?"** → Yes, mostly bundled; some capabilities (Browser Protection) appear tier-gated. Confirm specifics with TAM.
- **"What's the difference between AppProtection and Inspection Policy?"** → Same product, renamed. Inspection is the old name; AppProtection is current.
- **"Does AppProtection cover Kerberos / LDAP attacks?"** → Yes, via the Active Directory controls category — distinct from OWASP controls. Enable AD on the application segment.
- **"Where do AppProtection events show up in our SIEM?"** → Through ZPA LSS, not NSS. Configure an LSS receiver if you don't have one.
- **"Why can't I edit OWASP Top-10 for Visibility?"** → Default profile is read-only by design. Clone it or build custom.
- **"What's a Paranoia Level?"** → A 1-4 scale on predefined controls. Higher = more aggressive matching, more potential false positives. Default profile uses Level 1.
- **"Can I have different actions for different controls in one profile?"** → Yes, per-control or global. Both modes supported.

## Cross-links

- ZPA app-segment toggle for AppProtection: [`./app-segments.md`](./app-segments.md)
- Multimatch ↔ AppProtection mutual exclusion: [`./app-segments.md`](./app-segments.md) (existing reference architecture quote)
- ZPA Access Policy as the precedent for AppProtection criteria cloning: [`./policy-precedence.md`](./policy-precedence.md)
- LSS log streaming layer (AppProtection log type): [`./logs/access-log-schema.md`](./logs/access-log-schema.md)
- Terraform `zpa_inspection_*` resources: [`../shared/terraform.md`](../shared/terraform.md) (legacy naming)
- Cross-product integrations (where AppProtection sits relative to ZIA / ZCC / Deception): [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)

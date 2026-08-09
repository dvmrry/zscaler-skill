---
product: zpa
topic: "appprotection"
title: "ZPA AppProtection — inline WAF/IPS for ZPA-protected apps"
content-type: reasoning
last-verified: "2026-07-20"
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/protecting-private-applications-zpa-appprotection.md"
  - "vendor/zscaler-help/about-appprotection-controls.md"
  - "vendor/zscaler-help/about-appprotection-policy.md"
  - "vendor/zscaler-help/about-appprotection-profiles.md"
  - "vendor/zscaler-help/about-appprotection-applications.md"
  - "vendor/zscaler-help/about-active-directory-controls.md"
  - "vendor/zscaler-help/configuring-appprotection-policies.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/app_protection.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/app_segments_inspection.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/zpa_service.py"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_audit_logs.md"
verified-against:
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
  vendor/zscaler-sdk-go: 8a73a5fcf0bbb8507a47c09e9a6f379447ce3807
author-status: draft
---

# ZPA AppProtection — inline WAF/IPS for ZPA-protected apps

AppProtection is ZPA's **inline application-layer security inspection engine** — a hybrid web-application-firewall + intrusion-prevention-system that sits inside the ZPA data path and inspects HTTP, HTTPS, and several application protocols for known attack patterns. It's not a separate appliance; it runs inside the Zero Trust Exchange (ZTE), engages only on application segments that opt into it, and produces its own log stream alongside ZPA's normal access logs.

**This is a major capability that complements rather than overlaps the rest of the ZPA suite.** Where standard ZPA Access Policy answers "should this user reach this app at all", AppProtection answers "is the traffic this user is sending to the app actually attacking it." Both layers can fire on the same connection.

**Note on naming**: AppProtection was previously called **Inspection** in the ZPA portal and SDKs. References to "ZPA Inspection Policy", "Inspection Profile", "Inspection Control" in older docs / SDKs / Terraform resources point at the same product. The skill's existing references to `zpn_inspection_profile_id` (in `policy-precedence.md`) and TF resources like `zpa_inspection_*` are AppProtection in current naming.

## Architecture

Source: `vendor/zscaler-help/protecting-private-applications-zpa-appprotection.md`; `vendor/zscaler-help/about-appprotection-applications.md`; `vendor/zscaler-help/about-appprotection-policy.md`.

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

Source: `vendor/zscaler-help/about-appprotection-controls.md`; `vendor/zscaler-help/about-appprotection-profiles.md`; `vendor/zscaler-help/about-appprotection-policy.md`; `vendor/zscaler-help/configuring-appprotection-policies.md`.

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

Source: `vendor/zscaler-help/about-appprotection-controls.md`; `vendor/zscaler-help/about-active-directory-controls.md`.

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

Source: `vendor/zscaler-help/about-appprotection-profiles.md`; `vendor/zscaler-help/about-appprotection-controls.md`.

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

Source: `vendor/zscaler-help/about-appprotection-policy.md`; `vendor/zscaler-help/configuring-appprotection-policies.md`.

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

## SDK / API / Terraform surface

Source: `vendor/zscaler-sdk-python/zscaler/zpa/app_protection.py`; `vendor/zscaler-sdk-python/zscaler/zpa/app_segments_inspection.py`; `vendor/zscaler-sdk-python/zscaler/zpa/zpa_service.py`.

The product behavior above maps onto a real, programmable surface. The Python SDK exposes it as `client.zpa.app_protection`, which returns an `InspectionControllerAPI` instance (`vendor/zscaler-sdk-python/zscaler/zpa/zpa_service.py:200-202`). **The class is still named `InspectionControllerAPI` while the property is `app_protection`** — concrete proof of the Inspection → AppProtection rename discussed above, frozen into the SDK itself.

### Profiles (Tier 2) → `client.zpa.app_protection`

| Operation | Method | Endpoint |
|---|---|---|
| List profiles | `list_profiles` (`app_protection.py:61`) | `GET .../inspectionProfile` |
| Get one profile | `get_profile` (`app_protection.py:107`) | `GET .../inspectionProfile/{id}` |
| Create profile | `add_profile` (`app_protection.py:137`) | `POST .../inspectionProfile` |
| Update profile | `update_profile` (`app_protection.py:284`) | `PUT .../inspectionProfile/{id}` |
| Delete profile | `delete_profile` (`app_protection.py:362`) | `DELETE .../inspectionProfile/{id}` |
| Attach/detach all predefined controls | `profile_control_attach` (`app_protection.py:390`) | `PUT .../inspectionProfile/{id}/associateAllPredefinedControls` (`app_protection.py:410`) or `.../deAssociateAllPredefinedControls` (`app_protection.py:413`) |

Note the SDK divergence worth flagging to an operator: `add_profile` and `update_profile` default `predefined_controls_version` to **`OWASP_CRS/3.3.0`** (`app_protection.py:222`, `:299`), even though the *portal* default version is `OWASP_CRS/4.8.0` (`vendor/zscaler-help/about-appprotection-controls.md:37`). Pass `predefined_controls_version="OWASP_CRS/4.8.0"` explicitly to match the console.

### Predefined and custom controls (Tier 1) → `client.zpa.app_protection`

| Operation | Method | Notes |
|---|---|---|
| List predefined controls | `list_predef_controls` (`app_protection.py:802`) | `version` is **required**; supported values `OWASP_CRS/3.3.0`, `OWASP_CRS/3.3.5`, `OWASP_CRS/4.8.0` (`app_protection.py:814`, `:833`) |
| List predefined ADP controls | `list_predef_control_adp` (`app_protection.py:1106`) | `GET .../inspectionControls/predefined/adp` |
| List predefined API controls | `list_predef_control_api` (`app_protection.py:1154`) | `GET .../inspectionControls/predefined/api` |
| Get custom control | `get_custom_control` (`app_protection.py:659`) | — |
| Create custom control | `add_custom_control` (`app_protection.py:688`) | `POST .../inspectionControls/custom` |
| Update custom control | `update_custom_control` (`app_protection.py:723`) | — |
| Delete custom control | `delete_custom_control` (`app_protection.py:776`) | — |

Enum helpers expose the valid values the console offers: `list_control_action_types` (`app_protection.py:874`), `list_control_severity_types` (`app_protection.py:921`), and `list_control_types` (`app_protection.py:968`).

### Per-segment opt-in (the app-level toggle) → `client.zpa.app_segments_inspection`

The "enable AppProtection on the application within a segment" toggle is its own SDK surface: `client.zpa.app_segments_inspection` returns `AppSegmentsInspectionAPI` (`vendor/zscaler-sdk-python/zscaler/zpa/zpa_service.py:125-127`), with `list_segment_inspection` / `get_segment_inspection` / `add_segment_inspection` / `update_segment_inspection` / `delete_segment_inspection` (`app_segments_inspection.py:43`, `:104`, `:144`, `:288`, `:477`). The opt-in is carried in the `common_apps_dto` object — an `apps_config` list whose blocks set `app_types` including `INSPECT` (`app_segments_inspection.py:183-192`). That `INSPECT` app type is the wire-level expression of "this app in this segment is inspected."

### Go SDK and Terraform

The Go SDK mirrors the same split: `inspectioncontrol` services (`vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_profile/zpa_inspection_profile.go:1`, `inspection_custom_controls/`, `inspection_predefined_controls/`) and `applicationsegmentinspection` (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go`). Terraform resources keep the legacy `zpa_inspection_*` naming (see [`../shared/terraform.md`](../shared/terraform.md)).

## How AppProtection relates to other ZPA features

Source: `vendor/zscaler-help/protecting-private-applications-zpa-appprotection.md`; `vendor/zscaler-help/about-appprotection-applications.md`; `vendor/zscaler-help/about-appprotection-policy.md`.

| Feature | Relationship |
|---|---|
| **Access Policy** | Independent. Access Policy decides "can this user reach this app"; AppProtection decides "is their traffic to that app malicious." Both fire on the same connection. Recommended: clone Access Policy criteria into AppProtection rules to keep them aligned. |
| **App Segments** | AppProtection is **opt-in per application** within a segment. Toggle: "enable AppProtection for the application." |
| **Browser Access** | Compatible — both use TLS 1.2 with the same cipher (`ECDHE-RSA-AES128-GCM-SHA256`). An AppProtection-protected segment with Browser Access enabled has its browser traffic both terminated at ZPA's ingress AND inspected by AppProtection. |
| **PRA** | Not directly mentioned in AppProtection docs; PRA traffic is RDP/SSH/VNC and not subject to HTTP/AD-protocol inspection. PRA's session-recording is the analogous oversight layer for those protocols. |
| **SIPA** | Compatible (presumably — not mentioned as mutually exclusive in captures). |
| **Multimatch** | Not flagged as mutually exclusive in current captures, but **was** previously flagged as conflicting with "Inspection" (the old name for AppProtection) in `app-segments.md` quote: *"Multimatch must be disabled if the configuration contains applications using the Access Type of Browser Access, AppProtection, or Privileged Remote Access."* So **Multimatch IS mutually exclusive with AppProtection**. |
| **Inspection Policy / Profile / Control** (legacy naming) | Same product; renamed to AppProtection. References in `policy-precedence.md` (`zpn_inspection_profile_id`), `terraform.md` (TF resources like `zpa_inspection_*`), and elsewhere are AppProtection. The Python SDK still names the class `InspectionControllerAPI` even though the access property is `app_protection` (`zpa_service.py:194`) — the rename is incomplete below the surface. |

## Logging — LSS, not NSS

Source: `vendor/zscaler-help/about-appprotection-policy.md`; `vendor/zscaler-help/protecting-private-applications-zpa-appprotection.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_lss_audit_logs.md`.

AppProtection events flow through ZPA's **Log Streaming Service (LSS)** as a dedicated log type. The wire identifier a SIEM/LSS engineer actually configures is **`zpn_waf_http_exchanges_log`** (described as "ZPA App Protection" in the LSS source-log-type table — `vendor/terraform-provider-zpa/docs/resources/zpa_lss_audit_logs.md:97`). This is the value you pass as `source_log_type` when standing up an LSS configuration. Distinct from:

- **User Activity** logs (LSS) — access decisions and connection metadata
- **Audit Logs** (LSS) — admin actions
- **NSS** (ZIA's separate streaming layer) — does NOT receive AppProtection events

Operational implication: **SIEM integrations standardized on NSS for ZIA must add a separate LSS receiver to capture AppProtection events.** Common pattern: deploy LSS App Connector + log receiver alongside the existing NSS receiver, route both into the SIEM with appropriate index naming.

The "Understanding AppProtection Log Fields" article (referenced from the LSS overview) details the exact per-field set for `zpn_waf_http_exchanges_log`; the field-level schema is not yet captured in this skill (see Open questions).

## Licensing

Source: `vendor/zscaler-help/about-appprotection-policy.md`; `vendor/zscaler-help/protecting-private-applications-zpa-appprotection.md`.

AppProtection appears bundled with ZPA — the default `OWASP Top-10 for Visibility` profile ships with every ZPA account, and the help docs don't gate basic AppProtection behind a separate SKU.

**However**, the captured *About AppProtection Policy* doc explicitly notes:

> Depending on your AppProtection subscription, you see the following Security policy option: Browser Protection.

This implies **tier-gated AppProtection capabilities**:

- Baseline AppProtection — bundled with ZPA
- Browser Protection — tier-gated, separate subscription consideration
- Possibly other tier-gated capabilities not captured (ThreatLabZ controls, advanced Active Directory protection, custom-rule limits, etc.)

Specific tier names (Business / Transformation / Workplace+) and what each unlocks aren't spelled out in captured help docs. **Confirm with TAM** for actual entitlement on a given tenant.

## Surprises worth flagging

Source: `vendor/zscaler-help/about-appprotection-controls.md`; `vendor/zscaler-help/about-appprotection-profiles.md`; `vendor/zscaler-help/about-appprotection-policy.md`; `vendor/zscaler-help/about-active-directory-controls.md`.

1. **AppProtection was called Inspection until recently.** SDKs, Terraform resources, and older docs say "Inspection Policy", "Inspection Profile", `zpn_inspection_profile_id`. They're the same thing. A user looking at ZPA Terraform with `zpa_inspection_*` resources is configuring AppProtection. The current Python SDK still carries the old name internally: `client.zpa.app_protection` returns a class named `InspectionControllerAPI` (`vendor/zscaler-sdk-python/zscaler/zpa/zpa_service.py:200-202`), and every API path is `.../inspectionProfile` and `.../inspectionControls/...` (`app_protection.py:86`, `:700`).

2. **The default profile (`OWASP Top-10 for Visibility`) is fully immutable.** It cannot be edited or deleted, and its **Paranoia Level is permanently set to 1**. Some controls are deliberately excluded from it for higher efficacy — Zscaler-tuned. An operator wanting to tune Paranoia Level higher than 1 must clone the profile first, which changes the policy reference. Tenants new to AppProtection often start by trying to "edit OWASP Top-10 for Visibility" and find they can't change anything.

3. **Active Directory inspection is a feature people miss.** Kerberos / SMB / LDAP protocol inspection inside the ZPA tunnel is rare in WAF products and surprises operators expecting only HTTP/HTTPS scope.

4. **Per-control action granularity.** Within one profile, different controls can have different actions (some Block, some Allow with logging, some Redirect). Not just one global action. This is more granular than typical WAF tooling.

5. **AppProtection log type is LSS-distinct.** SIEM teams who only stream NSS will silently miss all AppProtection events. Verify LSS receiver is configured alongside any NSS deployment.

6. **Same TLS 1.2 cipher constraint as Browser Access.** `ECDHE-RSA-AES128-GCM-SHA256`. Old browsers / appliances that don't negotiate this cipher fail. Modern browsers handle it fine.

7. **Multimatch + AppProtection = mutually exclusive on the same segment.** Per `app-segments.md` quote (*User-to-App Segmentation Reference Architecture* p.10). Tenants using Multimatch must split AppProtection-needed apps into separate segments.

8. **Paranoia Level only applies to predefined controls.** Custom HTTP / WebSocket controls don't use Paranoia Level — they're just on/off with a chosen action. Operators tuning paranoia higher don't affect their custom rules.

9. **Browser Protection tier difference is not documented in captures.** What capabilities Browser Protection unlocks beyond baseline AppProtection isn't spelled out publicly. Operator-level question for TAM.

10. **OWASP CRS version migration is a deliberate operator action.** Older OWASP CRS controls don't auto-upgrade — operators must select and run the `Migrate` action. Tenants on long-running deployments may be using outdated rule sets without realizing.

## Common questions this unlocks

Source: `vendor/zscaler-help/protecting-private-applications-zpa-appprotection.md`; `vendor/zscaler-help/about-appprotection-controls.md`; `vendor/zscaler-help/about-appprotection-profiles.md`; `vendor/zscaler-help/about-appprotection-policy.md`.

- **"Is AppProtection part of ZPA?"** → Yes, mostly bundled; some capabilities (Browser Protection) appear tier-gated. Confirm specifics with TAM.
- **"What's the difference between AppProtection and Inspection Policy?"** → Same product, renamed. Inspection is the old name; AppProtection is current.
- **"Does AppProtection cover Kerberos / LDAP attacks?"** → Yes, via the Active Directory controls category — distinct from OWASP controls. Enable AD on the application segment.
- **"Where do AppProtection events show up in our SIEM?"** → Through ZPA LSS, not NSS. Configure an LSS receiver if you don't have one.
- **"Why can't I edit OWASP Top-10 for Visibility?"** → Default profile is read-only by design. Clone it or build custom.
- **"What's a Paranoia Level?"** → A 1-4 scale on predefined controls. Higher = more aggressive matching, more potential false positives. Default profile uses Level 1.
- **"Can I have different actions for different controls in one profile?"** → Yes, per-control or global. Both modes supported.

## Open questions

These remain unbacked by vendor source at the source-tier hierarchy and should not be stated as fact:

- **Per-field log schema for `zpn_waf_http_exchanges_log`.** The "Understanding AppProtection Log Fields" article is referenced but not captured; the exact field list, types, and which fields carry control-number / severity / action is unverified. (Behavior named, schema not captured.)
- **Browser Protection tier entitlement.** What capabilities the Browser Protection subscription unlocks beyond baseline AppProtection, and the SKU/tier names that gate it, are not spelled out in captured help docs (`vendor/zscaler-help/about-appprotection-policy.md` notes only that the option appears "depending on your AppProtection subscription"). Confirm per-tenant with the account team.
- **Whether the SDK exposes the Active Directory / Kerberos / SMB / LDAP controls as a distinct surface** or folds them into the predefined/ADP control lists (`list_predef_control_adp`). The help captures describe AD controls as a first-class category, but the Python SDK only exposes generic predefined/ADP/API/custom control listings — no AD-specific method was found in `app_protection.py`. Unverified whether AD controls surface through `list_predef_control_adp` or another path.
- **TLS 1.2 cipher constraint (`ECDHE-RSA-AES128-GCM-SHA256`).** Sourced from help captures only; not confirmed against SDK/API or a current product note, and may have widened with newer connector builds.

## Cross-links

- ZPA app-segment toggle for AppProtection: [`./app-segments.md`](./app-segments.md)
- Multimatch ↔ AppProtection mutual exclusion: [`./app-segments.md`](./app-segments.md) (existing reference architecture quote)
- ZPA Access Policy as the precedent for AppProtection criteria cloning: [`./policy-precedence.md`](./policy-precedence.md)
- LSS log streaming layer (AppProtection log type): [`./logs/access-log-schema.md`](./logs/access-log-schema.md)
- Terraform `zpa_inspection_*` resources: [`../shared/terraform.md`](../shared/terraform.md) (legacy naming)
- Python SDK surface: `client.zpa.app_protection` (`InspectionControllerAPI`) and `client.zpa.app_segments_inspection` (`AppSegmentsInspectionAPI`) — see the SDK / API / Terraform surface section above
- Cross-product integrations (where AppProtection sits relative to ZIA / ZCC / Deception): [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)

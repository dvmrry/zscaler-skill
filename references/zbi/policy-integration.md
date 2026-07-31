---
product: zbi
topic: "zbi-policy-integration"
title: "ZBI policy integration — isolation profiles, ZIA and ZPA sides, subscription tiers"
content-type: reasoning
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: c26c394767d7344a4ac41658d1d5fb2c4b7d4716
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 1872e3bdad259457f9261801841b4a8d3f4a6074
confidence: high
source-tier: mixed
sources:
  - "https://help.zscaler.com/zia/configuring-smart-browser-isolation-policy"
  - "vendor/zscaler-help/configuring-smart-browser-isolation-policy.md"
  - "https://help.zscaler.com/zpa/about-isolation-policy"
  - "vendor/zscaler-help/zpa-about-isolation-policy.md"
  - "https://help.zscaler.com/zero-trust-browser/understanding-isolation-miscellaneous-and-unknown-category-zia"
  - "vendor/zscaler-help/understanding-isolation-miscellaneous-unknown-category-zia.md"
  - "vendor/zscaler-help/what-is-zero-trust-browser.md"
  - "vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zbi/custom_apps.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go"
  - "vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_browser_control_policy.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_url_filtering_rules.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_cloud_app_control_rules.go"
  - "vendor/terraform-provider-zia/zia/validator.go"
  - "vendor/terraform-provider-zpa/zpa/provider.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule_v2.go"
  - "vendor/ziacloud-ansible/plugins/modules/zia_cloud_browser_isolation_profile_info.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_profile_info.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_isolation_profile_info.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule_v2.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/access_isolation_rules.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner_info.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate_info.py"
author-status: draft
---

# ZBI policy integration — isolation profiles, ZIA and ZPA sides, subscription tiers

Zero Trust Browser has no standalone policy engine in the captured sources. Routing to an isolated session is decided by **ZIA URL Filter rules with `Isolate` action** for internet traffic or **ZPA Isolation Policy rules** for private-app access; both rely on an **isolation profile** that configures the session behavior (`vendor/zscaler-help/what-is-zero-trust-browser.md:28`, `:32`, `vendor/zscaler-help/zpa-about-isolation-policy.md:16`). The skill's job on browser-isolation questions is usually: route to the right product's policy, find the right isolation profile, and explain the interactions.

## Summary

Source: `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md`; `vendor/zscaler-help/zpa-about-isolation-policy.md`; `vendor/zscaler-help/understanding-isolation-miscellaneous-unknown-category-zia.md`.

Three config objects interact:

1. **Isolation profile** — tenant-level configurable object. Captured profile settings include Turbo Mode, PAC File URL, copy/paste, file transfer, print, read-only isolation, region selection, watermarking, persistent state, and related session behavior (`vendor/zscaler-help/understanding-isolation-miscellaneous-unknown-category-zia.md:19`, `:22-40`, `vendor/zscaler-help/understanding-turbo-mode-isolation.md:27`). Default isolation profiles are automatically created for organizations with Zero Trust Browser, and admins can manually create multiple profiles for both Internet & SaaS and Private Access (`vendor/zscaler-help/what-is-zero-trust-browser.md:32`).
2. **ZIA-side policy** — URL Filter rules with `Isolate` action pointing to an isolation profile, plus **Smart Browser Isolation**, the AI/ML-driven auto-isolation policy for suspicious sites (`vendor/zscaler-help/configuring-smart-browser-isolation-policy.md:16`, `:22-24`, `:32-34`).
3. **ZPA-side policy** — Isolation Policy rules with rule-order evaluation and AND/OR conditions, each pointing to a ZPA isolation profile (`vendor/zscaler-help/zpa-about-isolation-policy.md:16`, `:32-33`, `:48-50`).

Subscription tiers affect what an organization can isolate:

- **Full Zero Trust Browser access** — the captured help says admins can manually create multiple isolation profiles for both ZIA and ZPA (`vendor/zscaler-help/what-is-zero-trust-browser.md:32`).
- **"Miscellaneous & Unknown Category" limited subscription** — the captured help says this tier may only be able to isolate the M&U category and gets a preconfigured profile with mostly fixed settings (`vendor/zscaler-help/understanding-isolation-miscellaneous-unknown-category-zia.md:15`, `:17`, `:19-48`). The details matter for answering "why can't I configure this isolation profile the way I want?"

## Mechanics

Source: `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md`; `vendor/zscaler-help/zpa-about-isolation-policy.md`; `vendor/zscaler-help/understanding-isolation-miscellaneous-unknown-category-zia.md`.

### Isolation profiles — the shared config object

Isolation profiles carry:

- **Name** — identifier.
- **Turbo Mode** — enabled / disabled (see [`./overview.md § Rendering modes`](./overview.md)).
- **PAC File URL** / Override PAC File — outbound proxy behavior of the cloud browser.
- **Debug Mode** — end-user-facing debug tools in isolated session.
- **Root Certificate** — which cert authority the cloud browser trusts; default is Zscaler's root.
- **Copy / Paste / Print / File Transfer** — per-direction allow/deny. Independent flags.
- **Read-Only Isolation** — display-only mode; user can see but not interact beyond scroll/navigation.
- **View office files in Isolation** — whether Office file types (DOCX, XLSX, etc.) render in the cloud browser rather than downloading.
- **Local browser rendering** — alternative rendering path (referenced in separate help article, not captured).
- **Application Deep Linking** — whether links from isolated session can open non-web apps on the endpoint.
- **Votiro CDR** — integration with Votiro Secure File Gateway for content disarm & reconstruction. Third-party integration.
- **Region Selection** — which Zscaler region hosts the container. Relevant for data residency.
- **Isolation Banner** — UI strip shown during isolated session.
- **Persist Browser Isolation URL bar** — whether the URL bar in the isolated session shows the real destination URL.
- **Isolation Experience** — Native Browser Experience vs other experience modes.
- **Enable Watermarking** — overlay that identifies the user / session. Anti-screenshot / anti-screen-share control.
- **Persistent State** — whether the session survives browser close (for pen-test / research workflows).

Profiles are created in the ZIA Admin Portal or ZPA Admin Console according to the help text (`vendor/zscaler-help/what-is-zero-trust-browser.md:32`, `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md:34`), and ZPA exposes a separate CBI profile configuration API (`vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py:35`, `:37-84`, `:124-246`). Treat ZIA and ZPA profile identity as distinct unless a tenant-side API comparison proves they map one-to-one.

### ZIA side — URL Filter `Isolate` action

From [`../zia/url-filtering.md`](../zia/url-filtering.md):

> Isolate — Remote browser — Requires Zero Trust Browser

When a URL Filter rule with action `Isolate` matches a user's request, ZIA returns a **302 redirect** pointing to the configured isolation profile URL, with the original URL in the query string. The user's browser follows the redirect; the rest of the flow proceeds as [`./overview.md`](./overview.md) describes.

**Prerequisites:**

- **The isolation profile must exist in the tenant** and be referenced by the rule.
- **Manual URL Filter `Isolate` HTTPS decrypt behavior is unresolved in captured sources.** The traffic-flow article states that an HTTP/HTTPS request matching a URL filtering policy is redirected to the isolation profile URL (`vendor/zscaler-help/what-is-zero-trust-browser.md:28`), but it does not state the exact SSL Inspection precondition for manual URL Filtering rules. Do not claim "the API/policy will fail" without tenant evidence.

**Operator patterns:**

- "Isolate high-risk categories, allow normal traffic through": URL Filter rule with Isolate action on Miscellaneous or Unknown, Newly Registered Domains, Adult content, etc.
- "Isolate traffic from unmanaged devices": Isolate rule with Device Group = non-ZCC-forwarded, so only unmanaged devices get isolated sessions.
- "Isolate specific custom categories": custom URL category with known-risky sites + URL Filter rule targeting that category with Isolate.

### Smart Browser Isolation — the AI/ML overlay

A ZIA-side policy that **automatically isolates suspicious websites** identified by AI/ML models. Distinct from manual Isolate rules; operates at tenant scope.

Location: **Policy > Secure Browsing > Smart Isolate**.

Configuration:

- **Enable AI/ML based Smart Browser Isolation** — master toggle.
- **Users** — up to 32 (contact Support to raise).
- **Groups** — up to 32 (contact Support to raise).
- **Browser Isolation Profile** — which isolation profile to use for Smart-isolated sessions.

**Non-obvious prerequisites:**

- **Malware Protection `Inspect Inbound Traffic` and `Inspect Outbound Traffic` must be enabled** (Policy > Malware Protection > Malware Policy) for Smart Isolation to work (`vendor/zscaler-help/configuring-smart-browser-isolation-policy.md:18`).
- **Enabling Smart Isolation automatically creates an editable SSL/TLS Inspection rule** to decrypt suspicious websites (`vendor/zscaler-help/configuring-smart-browser-isolation-policy.md:24`). This rule appears in the SSL Inspection policy list — operators auditing SSL rule count will see a new entry they didn't manually create.
- **Isolation profiles for the relevant users/groups must exist** — the field chooses an existing Browser Isolation Profile, and the help page says to create profiles in the ZIA Admin Portal for them to appear in the field (`vendor/zscaler-help/configuring-smart-browser-isolation-policy.md:32`, `:34`).

**Failure modes:**

- Malware Protection inspection toggles off → Smart Isolation silently doesn't fire. The tenant might see occasional isolated sessions (from explicit URL Filter Isolate rules) but never AI/ML-driven ones.
- SSL Inspection rule auto-created at enablement is later modified to `Do Not Inspect` by an admin cleaning up → Smart Isolation stops intercepting suspicious traffic, but the Smart Isolation toggle appears still enabled.

### ZPA side — Isolation Policy

ZPA's Isolation Policy lives in its own policy family (see [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md) for the ZPA family evaluation order).

From *About Isolation Policy*:

- Rules define **when application requests are redirected to Isolation**.
- **Prerequisites**: (1) Isolation enabled for the org, (2) an Isolation profile must exist before the rule can reference it, (3) an access policy for the application must also be defined (isolation *plus* access — not instead-of).
- Rule evaluation is top-down by rule order. Criteria combine with AND and OR only (no NOT operator).
- **Session timeout**: "the minimum timeout across all configured timeout policies" — ZPA Isolation inherits the tightest timeout from all timeout-family rules, not a dedicated isolation timeout.
- **Default rule cannot be edited** — a terminal rule exists automatically and can't be modified.

**ZPA Isolation Policy page** (Policy > Isolation Policy) supports: list, filter, add/edit/copy/delete rules, rule-order reorder.

**Rule actions**: "allow or bypass Isolation." So a rule either sends the request into an isolated session or explicitly bypasses (for a subset of users / apps / postures).

### Subscription tier: "Miscellaneous & Unknown Category"

A limited-scope ZBI subscription that only lets the tenant isolate the **Miscellaneous & Unknown URL category**. From *Understanding Isolation of Miscellaneous & Unknown Category in ZIA*:

- Preconfigured isolation profile is auto-created at first login.
- **The profile is distinct from the default isolation profiles** created for full-access tenants.
- A ZIA URL Filter rule for Miscellaneous & Unknown category is **automatically created and enabled by default for new tenants** (disabled by default for existing tenants upgrading to this subscription).

**Locked fields on the preconfigured M&U profile:**

| Field | Forced value | Notes |
|---|---|---|
| Name | `Misc & Unknown` | Cannot rename. |
| PAC File URL | Recommended PAC file | Cannot override. |
| Override PAC File | Disabled | Forced off. |
| Allow Copy & Paste From | Disabled | Data exfil block. |
| Allow File Transfer | Disabled | Data exfil block. |
| Allow Print | Disabled | Data exfil block. |
| View office files in Isolation | Disabled | Forces download instead. |
| Allow local browser rendering | Disabled | Forces cloud rendering. |
| Application Deep Linking | Disabled | No handoff to local apps. |
| Votiro CDR | Disabled | Unavailable on this tier. |
| Persist Browser Isolation URL bar | Disabled | URL bar hidden. |
| Isolation Experience | Native Browser Experience | Fixed. |
| Enable Watermarking | Disabled | Watermarking unavailable on this tier. |
| Persistent State | Disabled | Sessions always ephemeral. |
| Enable Turbo Mode | **Enabled** | On-by-default (admin can disable). |
| Read-Only Isolation | **Enabled** | On-by-default (admin can disable). |

**Editable fields on the M&U profile**:

- Turbo Mode (can disable)
- Debug Mode
- Root Certificate
- Read-Only Isolation (can disable)
- Region Selection

**Operational implication**: a tenant on the M&U tier asking "why can't I allow copy/paste on my isolation profile?" is hitting a subscription limit, not a configuration error. Upgrading to full ZBI access unlocks the remaining fields.

### Programmable surface and `client.zbi` caveat

Source: `vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py`; `vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go`; `vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go`; `vendor/terraform-provider-zia/zia/resource_zia_browser_control_policy.go`; `vendor/terraform-provider-zpa/zpa/provider.go`; `vendor/ziacloud-ansible/plugins/modules/zia_cloud_browser_isolation_profile_info.py`; `vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule_v2.py`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/access_isolation_rules.py`.

Do not use Python `client.zbi.*` for Zero Trust Browser. The current SDK labels that namespace as **Zscaler Business Insights** and exposes custom-app/report surfaces under `/bi/api/v1` (`vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py:23-24`, `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:237`, `:331-335`, `vendor/zscaler-sdk-python/zscaler/zbi/custom_apps.py:28-34`).

Browser-isolation policy and profile automation is split across ZIA and ZPA:

| Surface | What it supports | Source line(s) |
|---|---|---|
| ZIA profile lookup | Python and Go list Cloud Browser Isolation profiles at `/zia/api/v1/browserIsolation/profiles`. | `vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py:37-60`; `vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go:13`, `:30-48` |
| ZPA CBI profile management | Python and Go expose CBI profile create/read/update/delete. | `vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py:37`, `:86`, `:124`, `:248`, `:351`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:102`, `:137`, `:146`, `:155`, `:164` |
| Terraform ZIA policy references | `zia_browser_control_policy` includes Smart Isolation toggle/profile fields; URL Filtering requires `cbi_profile` when action is `ISOLATE`; Cloud App Control carries `cbi_profile` for isolate action families. | `vendor/terraform-provider-zia/zia/resource_zia_browser_control_policy.go:116-126`, `:170-177`, `:297-317`; `vendor/terraform-provider-zia/zia/resource_zia_url_filtering_rules.go:52-63`, `:288-305`; `vendor/terraform-provider-zia/zia/resource_zia_cloud_app_control_rules.go:198-210`, `:698-705`; `vendor/terraform-provider-zia/zia/validator.go:650-667` |
| Terraform ZPA CBI / Isolation Policy | Provider registers CBI banner, certificate, external profile, v1/v2 isolation-rule resources, and CBI/isolation profile data sources; v1 wraps `policysetcontroller`, while v2 wraps `policysetcontrollerv2`. | `vendor/terraform-provider-zpa/zpa/provider.go:157-159`, `:169`, `:172`, `:226-232`; `vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule.go:11`, `:122`, `:199`, `:230`; `vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule_v2.go:11`, `:171`, `:258`, `:282` |
| Ansible ZIA/ZPA Browser Isolation | Ansible has one ZIA read-only profile-info module and eight ZPA modules: banner/certificate CRUD plus `_info`, CBI profile info, isolation-profile info, and v1/v2 isolation-rule management. | `vendor/ziacloud-ansible/plugins/modules/zia_cloud_browser_isolation_profile_info.py:31`, `:121-140`; `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner.py:31`, `:203-225`, `:231-233`; `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner_info.py:31`; `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate.py:31`, `:175-193`, `:202-204`; `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate_info.py:31`; `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_profile_info.py:31`, `:230`, `:240`, `:251`; `vendor/zpacloud-ansible/plugins/modules/zpa_isolation_profile_info.py:31`, `:153-154`; `vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule.py:31`, `:378-399`, `:407-409`; `vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule_v2.py:31`, `:379-399`, `:409-411` |
| MCP ZPA isolation rules | MCP can list/get/create/update/delete ZPA isolation policy rules; the create tool rejects `isolate` without `zpn_isolation_profile_id`. | `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/access_isolation_rules.py:64-85`, `:88-117`, `:120-144`, `:147-157` |

**Audit-scoped absence:** this refresh did not find a browser-isolation admin surface under Python `client.zbi`; that namespace is Business Insights. It also did not resolve all console-only UX feature toggles. Use [`./api.md`](./api.md) and [`./_claims-ledger.md`](./_claims-ledger.md) before claiming a surface is read-only, write-capable, or absent.

## Cross-product dependencies worth naming

Source: `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md`; `vendor/zscaler-help/zpa-about-isolation-policy.md`; `vendor/zscaler-help/understanding-isolation-miscellaneous-unknown-category-zia.md`.

| Dependency | Direction | Failure mode |
|---|---|---|
| SSL Inspection decrypt | Smart Browser Isolation depends on ZIA | Captured source says Smart Isolation decrypts suspicious sites and auto-creates an editable SSL/TLS Inspection rule |
| Malware Protection inspection toggles | Smart Isolation depends on ZIA Malware Protection | Smart Isolation silently doesn't fire |
| Isolation profile existence | Policy rules depend on profile | Save-time validation usually catches; runtime if profile is deleted after rule creation is undocumented |
| ZPA timeout family | ZPA Isolation session duration | "Minimum across all timeout policies" — can be surprisingly short if any ZPA timeout rule is tight |
| ZPA maintenance window | Isolation availability | Temporary unavailability during maintenance — operator-visible |

All of these surface in [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md).

## Edge cases

Source: `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md`; `vendor/zscaler-help/zpa-about-isolation-policy.md`; `vendor/zscaler-help/understanding-isolation-miscellaneous-unknown-category-zia.md`.

- **Default rule in ZPA Isolation Policy is uneditable** — consistent with other ZPA policy families.
- **ZPA Isolation requires an access policy AND an isolation policy** — both must evaluate favorably. A user can pass isolation policy (session gets isolated) but still fail access policy (app is unreachable) — results in "isolated session loads but the app inside is denied."
- **Criteria use AND and OR only** on ZPA Isolation — no NOT. Contrast with ZDX's probing criteria which does use NOT.
- **Smart Isolation's auto-generated SSL Inspection rule is editable** — admins can scope it narrower, but captured sources do not state every runtime consequence of changing it.
- **Misc & Unknown tier's auto-created URL Filter rule** — enabled-by-default-for-new, disabled-by-default-for-existing. An existing tenant upgrading to the tier won't see isolation happening until an admin enables the rule.

## Open questions

Source: `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md`; `vendor/zscaler-help/zpa-about-isolation-policy.md`; `vendor/zscaler-help/understanding-isolation-miscellaneous-unknown-category-zia.md`.

- Whether deleting an isolation profile that's still referenced by a rule breaks the rule silently or with an error — not documented.
- How profile updates propagate to in-flight isolated sessions — change the profile while sessions are active: do they rebuild, finish on the old profile, or fail?
- Whether Smart Isolation's AI/ML classifier is the same classifier as ATP's AI/ML (which recategorizes to Botnet / Phishing per [`../zia/malware-and-atp.md`](../zia/malware-and-atp.md)) or a separate model.
- Whether manual URL Filtering `Isolate` has the same SSL/TLS Inspection prerequisite as Smart Isolation — not stated in captured sources.

## Cross-links

- Overview (architecture + rendering) — [`./overview.md`](./overview.md)
- Claims ledger for this refresh — [`./_claims-ledger.md`](./_claims-ledger.md)
- ZIA URL Filtering (`Isolate` action origin) — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZIA Malware Protection and ATP (prerequisites for Smart Isolation) — [`../zia/malware-and-atp.md`](../zia/malware-and-atp.md)
- ZPA policy precedence (Isolation Policy's place in family order) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- SSL Inspection (prerequisite for HTTPS isolation) — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
- Cross-product integration catalog — [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)

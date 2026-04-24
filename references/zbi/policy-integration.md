---
product: zbi
topic: "zbi-policy-integration"
title: "ZBI policy integration — isolation profiles, ZIA and ZPA sides, subscription tiers"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
sources:
  - "https://help.zscaler.com/zia/configuring-smart-browser-isolation-policy"
  - "vendor/zscaler-help/configuring-smart-browser-isolation-policy.md"
  - "https://help.zscaler.com/zpa/about-isolation-policy"
  - "vendor/zscaler-help/zpa-about-isolation-policy.md"
  - "https://help.zscaler.com/zero-trust-browser/understanding-isolation-miscellaneous-and-unknown-category-zia"
  - "vendor/zscaler-help/understanding-isolation-miscellaneous-unknown-category-zia.md"
author-status: draft
---

# ZBI policy integration — isolation profiles, ZIA and ZPA sides, subscription tiers

ZBI has no standalone policy engine. Routing to an isolated session is decided by **ZIA URL Filter rules with `Isolate` action** (for internet traffic) or **ZPA Isolation Policy rules** (for private-app access). Both reference an **isolation profile** that configures the isolated session's behavior. The skill's job on ZBI questions is usually: route to the right product's policy, find the right isolation profile, and explain the interactions.

## Summary

Three config objects interact:

1. **Isolation profile** — tenant-level configurable object. Specifies Turbo Mode, copy/paste, file transfer, print, read-only, region selection, persistent state, PAC file, watermarking, etc. Separate isolation profiles exist for ZIA and for ZPA. **Default profiles are auto-created per organization at first ZBI login.**
2. **ZIA-side policy** — URL Filter rules with `Isolate` action pointing to an isolation profile. Plus **Smart Browser Isolation** (the AI/ML-driven auto-isolation for suspicious sites).
3. **ZPA-side policy** — Isolation Policy rules with rule-order evaluation and AND/OR conditions, each pointing to a ZPA isolation profile.

Subscription tiers affect what an organization can isolate:

- **Full ZBI access** — isolate any URL categories via URL Filter rules, full isolation-profile customization.
- **"Miscellaneous & Unknown Category" limited subscription** — can only isolate the M&U category; a preconfigured isolation profile with mostly-locked settings is auto-provisioned. The details matter for answering "why can't I configure this isolation profile the way I want?"

## Mechanics

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

Profiles are created in the ZIA Admin Portal (for ZIA use) or ZPA Admin Console (for ZPA use). A profile configured for ZIA isn't automatically available for ZPA — they are separate objects even though the feature set overlaps.

### ZIA side — URL Filter `Isolate` action

From [`../zia/url-filtering.md`](../zia/url-filtering.md):

> Isolate — Remote browser — Requires Zero Trust Browser

When a URL Filter rule with action `Isolate` matches a user's request, ZIA returns a **302 redirect** pointing to the configured isolation profile URL, with the original URL in the query string. The user's browser follows the redirect; the rest of the flow proceeds as [`./overview.md`](./overview.md) describes.

**Prerequisites:**

- **SSL Inspection must decrypt the URL** for Isolate to fire on HTTPS traffic. Without decrypt, ZIA can only match on SNI; the 302-redirect response requires intercepting the request at the HTTP layer.
- **The isolation profile must exist in the tenant** and be referenced by the rule.

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

- **Malware Protection `Inspect Inbound Traffic` and `Inspect Outbound Traffic` must be enabled** (Policy > Malware Protection > Malware Policy). Smart Isolation relies on Malware Protection's content inspection to feed the AI/ML classifier.
- **Enabling Smart Isolation automatically creates an editable SSL/TLS Inspection rule** to decrypt suspicious websites. This rule appears in the SSL Inspection policy list — operators auditing SSL rule count will see a new entry they didn't manually create.
- **Isolation profiles for the relevant users/groups must exist** — Smart Isolation uses an existing profile, doesn't auto-create one (except on first login to tiered subscription — see next section).

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

**Operational implication**: a tenant on the M&U tier asking "why can't I allow copy/paste on my isolation profile?" — the answer is subscription, not configuration. Upgrading to full ZBI access unlocks the remaining fields.

### ZBI SDK surface

From `vendor/zscaler-sdk-python/zscaler/zbi/`, the SDK covers:

| Service | Methods | Purpose |
|---|---|---|
| `client.zbi.custom_apps` | list / get / create / update / delete | Custom-defined applications for ZBI. |
| `client.zbi.report_configs` | list / get / create / update / delete report configs | Reporting configuration objects. |
| `client.zbi.reports` | list / download reports | Historical report retrieval. |

**Notable absence**: the SDK does NOT expose isolation profile management, URL Filter rule Isolate action configuration, ZPA Isolation Policy management, or Smart Isolation toggles. **Policy configuration is entirely in ZIA/ZPA/ZIA-Admin-Console-only** — the `zbi` SDK module is a reporting-and-custom-apps surface, not a policy surface. Scripts that want to audit ZBI policy need to pull from ZIA's URL Filter rules and ZPA's Isolation Policy, not from `client.zbi.*`.

## Cross-product dependencies worth naming

| Dependency | Direction | Failure mode |
|---|---|---|
| SSL Inspection decrypt | ZBI depends on ZIA | Isolate action silently doesn't fire on SSL-bypassed URLs |
| Malware Protection inspection toggles | Smart Isolation depends on ZIA Malware Protection | Smart Isolation silently doesn't fire |
| Isolation profile existence | Policy rules depend on profile | Save-time validation usually catches; runtime if profile is deleted after rule creation is undocumented |
| ZPA timeout family | ZPA Isolation session duration | "Minimum across all timeout policies" — can be surprisingly short if any ZPA timeout rule is tight |
| ZPA maintenance window | Isolation availability | Temporary unavailability during maintenance — operator-visible |

All of these surface in [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md).

## Edge cases

- **Default rule in ZPA Isolation Policy is uneditable** — consistent with other ZPA policy families.
- **ZPA Isolation requires an access policy AND an isolation policy** — both must evaluate favorably. A user can pass isolation policy (session gets isolated) but still fail access policy (app is unreachable) — results in "isolated session loads but the app inside is denied."
- **Criteria use AND and OR only** on ZPA Isolation — no NOT. Contrast with ZDX's probing criteria which does use NOT.
- **Smart Isolation's auto-generated SSL Inspection rule is editable** — admins can scope it narrower, which is sometimes the right call (e.g., exclude specific categories). Editing it to Do Not Inspect effectively disables Smart Isolation silently.
- **Misc & Unknown tier's auto-created URL Filter rule** — enabled-by-default-for-new, disabled-by-default-for-existing. An existing tenant upgrading to the tier won't see isolation happening until an admin enables the rule.

## Open questions

- Whether deleting an isolation profile that's still referenced by a rule breaks the rule silently or with an error — not documented.
- How profile updates propagate to in-flight isolated sessions — change the profile while sessions are active: do they rebuild, finish on the old profile, or fail?
- Whether Smart Isolation's AI/ML classifier is the same classifier as ATP's AI/ML (which recategorizes to Botnet / Phishing per [`../zia/malware-and-atp.md`](../zia/malware-and-atp.md)) or a separate model.

## Cross-links

- Overview (architecture + rendering) — [`./overview.md`](./overview.md)
- ZIA URL Filtering (`Isolate` action origin) — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZIA Malware Protection and ATP (prerequisites for Smart Isolation) — [`../zia/malware-and-atp.md`](../zia/malware-and-atp.md)
- ZPA policy precedence (Isolation Policy's place in family order) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- SSL Inspection (prerequisite for HTTPS isolation) — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
- Cross-product integration catalog — [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)

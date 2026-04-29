---
product: zpa
topic: saml-attributes
title: "ZPA SAML attributes — IdP attribute mapping for access policy and log streaming"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/about-saml-attributes.md"
author-status: draft
---

# ZPA SAML attributes — IdP attribute mapping for access policy and log streaming

## What ZPA SAML attributes are

SAML attributes in ZPA are the IdP-asserted user and device properties that the ZPA policy engine uses as criteria in access policy rules. They are distinct from ZIA SAML attributes: in ZPA, the SAML assertion can carry any arbitrary user attribute from the IdP, not just identity, group, and department (Tier A — vendor/zscaler-help/about-saml-attributes.md).

When a user authenticates to ZPA via ZCC, the IdP issues a SAML assertion to ZCC. That assertion is encrypted and stored locally by ZCC. On each application access attempt, ZCC presents the assertion (or derived claims) to ZPA for policy evaluation. SAML attributes defined in the ZPA Admin Console map the IdP assertion fields to named attribute objects that policy rules can reference.

**Key architectural detail:** ZPA does not maintain a hosted user database for provisioning, so user attributes from SAML assertions are not visible within the ZPA Admin Console as stored records. Assertions are encrypted and stored client-side by ZCC. This means admins cannot browse or audit individual user attribute values from the ZPA admin UI — they can only configure which attributes are recognized and how policy uses them.

---

## Relationship to ZIdentity (Session Attributes)

When an organization subscribes to **ZIdentity for users**, the SAML Attributes page is replaced by the **Session Attributes** page. In this mode:

- The "SAML Attribute" column in the attribute table becomes the "Session Attribute" column
- The Add, Edit, and Delete buttons on the attribute management page are hidden
- The IdP-specific filter (to view attributes per IdP) is hidden

The underlying policy function is the same — attributes are used as criteria in access policy rules — but the attribute lifecycle and page UI differ. If an operator reports that they cannot add or edit SAML attributes in the ZPA console, check whether the tenant is subscribed to ZIdentity for users (Tier A — vendor/zscaler-help/about-saml-attributes.md).

---

## Configuration methods

SAML attributes can be added to ZPA in two ways (Tier A — vendor/zscaler-help/about-saml-attributes.md):

### Import from IdP

Generate a complete list of SAML attributes from the IdP (e.g., export the attribute release list from Okta, Azure AD, or other SAML provider), then import that list into the ZPA Admin Console. Import maps IdP attribute names to ZPA attribute objects in bulk.

### Manual addition

Add individual attributes one at a time. Each attribute record requires:

- **Name** — the label used in the ZPA Admin Console (for reference; does not need to match the IdP attribute name exactly)
- **SAML Attribute** — the attribute name exactly as it appears in the SAML assertion from the IdP
- **IdP** — which IdP configuration this attribute belongs to (an organization may have multiple IdP configurations)

---

## SAML attribute fields

Each attribute record in the ZPA Admin Console has the following columns (Tier A — vendor/zscaler-help/about-saml-attributes.md):

| Field | Description |
|---|---|
| Name | Display name in the ZPA console. Admin-chosen; for reference only. May differ from the IdP attribute name. |
| SAML Attribute | The attribute as specified in the IdP SAML assertion. This must match the IdP's assertion exactly for policy evaluation to work. If ZIdentity is in use, this column is "Session Attribute". |
| IdP Name | The IdP configuration record in ZPA that issues assertions containing this attribute. |

---

## How SAML attributes are used in access policy

SAML attributes are referenced as **criteria** in ZPA access policy rules. A policy rule can require that the user's SAML assertion contains a specific attribute with a specific value.

Examples of SAML attribute-based policy criteria:

- `emailAddress = user@example.com` — restrict access to a specific user
- `department = Engineering` — allow access to all users whose IdP assertion includes `department: Engineering`
- `role = ZPA-Admin-Access` — gate on an IdP-managed role claim
- `country = US` — geo-restriction using an attribute from the IdP assertion

Attribute-based criteria can be combined with other policy criteria (posture profile, platform, trusted network, SCIM group) using AND/OR logic in the policy rule builder.

**Scoping:** Access policy rules can reference SAML attributes configured for a specific IdP. In multi-IdP deployments, attributes from different IdPs are separately registered and can be independently referenced in rules.

---

## SAML attributes as log streaming criteria

In addition to access policy, SAML attributes can be used to define streaming criteria when configuring a log receiver (LSS). This allows tenants to stream logs only for users matching a specific attribute value (e.g., stream only logs for users in a specific department to a dedicated SIEM destination) (Tier A — vendor/zscaler-help/about-saml-attributes.md).

---

## Limits

From the ZSDK ranges document (directly comparable to ZPA):

- **SAML Attributes**: 100 per organization (Tier A — vendor/zscaler-help/zsdk-ranges-limitations.md)

The ZPA-specific limit is not stated in the captured ZPA vendor sources; the ZSDK figure is noted here as a reference point. Verify with Zscaler Support for the authoritative ZPA SAML attribute limit.

---

## SAML attributes in the ZPA API

ZPA's SAML attributes are accessible via the ZPA management API. From the API feature list (Tier A — vendor/zscaler-help/legacy-understanding-zpa-api.md):

- SAML Attributes are a named resource in the ZPA API
- SAML Attributes appear as a folder in the OneAPI Postman collection (`vendor/zscaler-api-specs/oneapi-postman-collection.json`)

SDK and Terraform references:

- The ZPA Terraform provider (`vendor/terraform-provider-zpa/`) includes SAML attribute data source resources for use in policy rule conditions
- The Python SDK ZPA services include SAML attribute management (under `vendor/zscaler-sdk-python/zscaler/zpa/`)
- SAML attributes are used as criteria in `zpa_policy_access_rule` Terraform resource via `saml_attribute_values` blocks

---

## Portal navigation

SAML Attributes page: **Administration > Identity > Private Access > Session Attributes**

(The path label "Session Attributes" applies to both SAML and ZIdentity tenants; the underlying page is the same navigation target.)

Available operations:

- View applied filters from current and previous user sessions
- Filter the attribute list by IdP
- Save applied filters as preferences for future sessions
- Add new SAML attributes (import or manual)
- Edit an existing SAML attribute (hidden when ZIdentity for users is active)
- Delete a SAML attribute (hidden when ZIdentity for users is active)
- Refresh the page

---

## Operational notes

### Attribute name mismatch is the most common policy failure

If an access policy rule references a SAML attribute and the policy never matches despite the user appearing to have the right attribute, check:

1. The **SAML Attribute** field in the ZPA console matches the attribute name exactly as the IdP sends it in the assertion (case-sensitive in most assertions)
2. The attribute is registered under the correct **IdP** configuration — if the user authenticates via a different IdP than the one the attribute is registered under, the attribute won't be evaluated

### Assertions are not visible in the admin console

Because SAML assertions are encrypted and stored client-side, admins cannot inspect what attributes a specific user's assertion contains from the ZPA admin UI. Debugging typically requires examining the IdP's audit logs (to confirm what was asserted) or using a SAML debugging tool (browser extension or proxy intercept) during the user's authentication flow.

### ZIdentity migration changes the attribute model

When migrating to ZIdentity for users, the SAML Attribute objects are converted to Session Attributes. Existing policy rules that reference SAML attributes should continue to work post-migration, but attribute management (add/edit/delete) moves to ZIdentity. Verify attribute continuity during ZIdentity migration planning.

### Multi-IdP configurations

Organizations with multiple IdP configurations (e.g., primary IdP for employees, separate IdP for contractors) must register attributes separately per IdP. A policy rule referencing an attribute from IdP-A does not match users authenticating through IdP-B, even if that IdP-B assertion contains an identically-named attribute. The IdP association is part of the attribute object's identity in ZPA.

---

## Cross-links

- ZPA access policy (where SAML attributes are used as rule criteria) — [`./policy-precedence.md`](./policy-precedence.md)
- SCIM attributes and SCIM groups (separate IdP-provisioned attribute path) — [`../shared/scim-provisioning.md`](../shared/scim-provisioning.md)
- ZPA SDK (Python/Go) — [`./sdk.md`](./sdk.md)
- ZPA API surface — [`./api.md`](./api.md)
- ZPA LSS log streaming (where SAML attributes can gate streaming criteria) — [`./log-receivers.md`](./log-receivers.md)
- ZPA SCIM policy mapping (ZIdentity replaces this page for ZIdentity-subscribed tenants) — [`./scim-policy-mapping.md`](./scim-policy-mapping.md)

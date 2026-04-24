---
product: shared
topic: "admin-rbac"
title: "Admin RBAC — ZIA, ZPA, ZIdentity, and the cross-product federation story"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
sources:
  - "vendor/zscaler-help/admin-rbac-captures.md"
author-status: draft
---

# Admin RBAC — ZIA, ZPA, ZIdentity, and the cross-product federation story

Admin role management in Zscaler is **three separate systems that federate through ZIdentity in modern tenants**. Each product — ZIA, ZPA, ZIdentity — has its own admin-role object model with different primitives (rank, scope, feature permissions, entitlements). Understanding the per-product model AND the federation story matters whenever a user asks "why can this admin do X here but not Y there?" or "how do I grant cross-product admin access?"

## The three admin models at a glance

| Surface | Role components | Scope mechanism | Default roles |
|---|---|---|---|
| **ZIA** | Admin Rank + Permissions + Functional Scope | Org / Department / Location / Location Group (one only — not combinable) | Default super admin (full access) |
| **ZPA** | Feature-flag permissions across 23 modules | No hierarchical scoping; microtenant-level isolation | ZPA Administrator, ZPA Read Only Administrator |
| **ZIdentity** | Module-level permissions (25+ modules) at Full / View Only / Restricted / None | None explicitly documented | Super Admin, View Only Admin, User Admin, CXO Insight User |

## ZIA admin model

Every ZIA admin is two-dimensional: **a role** (what can be done) and **a scope** (where it applies).

### Role components (three-tuple)

1. **Admin Rank** — the hierarchy gate. Higher-rank admins can manage lower-rank admins' roles and assignments. **Admins with role-management permission can only add / edit / delete roles with less scope and lower rank than their own.**
2. **Permissions** — what features the role grants access to in the ZIA Admin Portal (policies, users, reports, settings, etc.).
3. **Functional scope** — additional per-module permissions within the role's overall permission set.

### Scope — the "where"

A ZIA admin's scope must be **one** of:

- **Organization** — full tenant visibility.
- **Department** — a single department's users.
- **Location** — a single location's traffic.
- **Location Group** — a bundle of locations (Manual or Dynamic; see [`../zia/locations.md`](../zia/locations.md)).

**You cannot combine scope types.** A department admin can't also be scoped to a specific location group. This is the skill-relevant footgun: "I made this admin department-scoped but also want them to see the NYC location" → impossible within ZIA's scope model; solution is either two admin accounts or scope-up to org.

Scope governs: rule criteria the admin sees, editing rules / settings, assigning scope for new admins, access to org resources, access to ZIA Admin Portal features.

### Admin account columns (for reference)

Login ID, Name, Role, Status, Scope, Login Type, Comments, Password Expired, Type (Standard / SD-WAN partner API / Executive App Admin / combined).

### Default admin login format

```
admin@<Organization ID>.<Zscaler Cloud>.net
```

## ZPA admin model

ZPA is **flatter than ZIA** — no rank-based hierarchy, no location-group scoping, just feature-permission flags.

### Predefined roles

- **ZPA Administrator** — read, add, edit, delete across the console. Default.
- **ZPA Read Only Administrator** — read-only across everything.

### Custom roles

A ZPA Administrator can create custom roles with **equal-or-lower privileges than their own**. (Can't grant privileges you don't have.)

Custom role columns: Name, Description, 23 feature permissions:

Administration Control · API Key Management · App Connector Management · Authentication · Business Continuity Management · Certificate Management · Client Connector Portal · Client Sessions · Cloud Connector Management · Company Information · Configuration · Dashboard · Diagnostics · Log Streaming · Machine Management · Notification Management · Policies · Private Service Edge Management · Privileged Remote Access · Privileged Sessions · Security Management · SCIM Management · VPN (For Legacy Apps)

**Permission changes take up to 2 minutes to take effect.** Missing permissions display a warning icon.

### Scoping (implicit)

ZPA doesn't have ZIA-style explicit scoping. The closest equivalent is **microtenant isolation** — a separate microtenant is its own admin universe with its own admin list. "Scope" in ZPA = which microtenant(s) an admin has access to.

## ZIdentity admin model

ZIdentity is the **unified identity layer** shipped by Zscaler for the OneAPI / modern-auth path. It has its own admin model that spans the whole platform.

### Four predefined roles

1. **Super Admin** — full permissions.
2. **View Only Admin** — view-only across the platform.
3. **User Admin** — user management only.
4. **CXO Insight User** — Executive Insights access only.

### The 25-module permission matrix

ZIdentity admin permissions are **granular per-module**, with four levels: **Full / Restricted Full / View Only / Restrictive View / None**.

Module list:

Admin Sign on Policy · Authentication Methods · Users and Groups · User Credentials · Roles · External Identities · IP Locations & Groups · Authentication Session · **Administrative Entitlements** · **Service Entitlements** · Audit Logs · Guest Domain · Remote Assistance · Branding · API Clients & Resources · Executive Insights · Token Validators · Log Streaming

The **bolded entitlement modules** are the cross-product glue — see Federation below.

### Migration state matters

For ZIdentity-enabled tenants, **admin roles must be assigned in the Zscaler Admin Console** (not per-product). For tenants migrated to the Zscaler Admin Console, at least View Only permission on Users + User Groups is required to submit a Zscaler Support ticket — a non-obvious gotcha.

## Federation: how the three systems talk

**Critical non-obvious rule: ZIA and ZPA admin systems are NOT synchronized by default.** A ZIA Super Admin is NOT automatically a ZPA Administrator; each product requires separate admin provisioning UNLESS ZIdentity is the federated admin source.

### Pre-ZIdentity (legacy)

- Provision admin in ZIA Admin Portal with ZIA role + scope.
- Separately provision admin in ZPA Admin Console with ZPA role.
- Two admin accounts, two auth paths, two audit streams.

### With ZIdentity (modern path)

- Admin provisioned in ZIdentity with a role.
- ZIdentity's **Administrative Entitlements** module grants access to ZIA and/or ZPA.
- Single-sign-on via ZIdentity; per-product role still applies at the product level (ZIA scope still matters, ZPA feature flags still apply), but the admin identity + access assignment is centralized.

This is the "unified admin" story Zscaler markets — identity in ZIdentity, authorization in-product, federation via Administrative Entitlements.

### OneAPI API clients vs admin users

**API Clients are separate from admin users.** Managed under ZIdentity **API Clients & Resources** module. OAuth 2.0 client-credentials (see [`../zidentity/api-clients.md`](../zidentity/api-clients.md)). An API Client's permissions are defined by its granted scopes, independent of any admin user's role assignments.

Practical implication: automation workflows (Terraform, snapshot scripts, CI/CD) should use API Clients, not admin-user credentials. API Client rotations don't impact admin-user access and vice versa.

## Audit logs

### ZIA audit log

- Records **every admin portal action + every Cloud Service API call**.
- Per-event columns: Timestamp · Action · Category · Sub-Category · Resource · Admin ID · Client IP · Interface (UI / API) · Trace ID · Result (success/failure).
- **Retention: 6 months.**
- Failed-login lockout: **5 failures in 1 minute → 5-minute account lock.** Failed attempts logged separately.
- Filter + search + CSV export available.
- **Audit-log report is async**: `POST /zia/api/v1/auditlogEntryReport` starts a job, `GET /zia/api/v1/auditlogEntryReport` polls status, `GET /auditlogEntryReport/download` retrieves the CSV when ready, `DELETE /auditlogEntryReport` clears the job. Don't expect synchronous completion on POST — script must poll.

### ZIA `authType` distinguishes session source

`GET /zia/api/v1/authenticatedSession` returns an `authType` field that identifies how the current session was established. Useful when correlating audit events to "who/what made this API call":

| `authType` | Meaning |
|---|---|
| `ADMIN_LOGIN` | Standard admin password login |
| `ADMIN_SAML_SSO_LOGIN` | Admin via SAML SSO |
| `DEFAULT_LOGIN` | Initial / default tenant admin |
| `MOBILE_APP_TOKEN` | Mobile app session token |
| `INTEGRATION_PARTNER_ACCESS` | Partner integration role (SD-WAN partner API etc.) |
| `PARTNER_ACCESS` | Generic partner access |
| `SUPPORT_ACCESS_FULL` | Zscaler Support full read/write |
| `SUPPORT_ACCESS_PARTIAL` | Zscaler Support limited write |
| `SUPPORT_ACCESS_READ_ONLY` | Zscaler Support read-only |

Implication: **support-access sessions are tracked distinctly from customer-admin sessions** — useful when investigating "did Zscaler Support change something during a ticket window?" Filter audit logs by `authType` to isolate.

### ZIA admin-user mutability

Admin users are **mutable across types** via `POST /zia/api/v1/adminUsers/{userId}/convert`. Standard Admin / SD-WAN partner API / Executive App Admin / combined types can be converted between forms — meaning admin types are not as fixed as they look at creation. Useful when role responsibilities change without forcing recreation.

### ZPA audit log

- Separate audit log, not unified with ZIA.
- Per-event granularity similar to ZIA's.
- Retention and export specifics not fully captured in this pass (re-capture ZPA audit log article if needed).

### ZIdentity audit log

- ZIdentity audit logs are view-only for admins with the **Audit Logs** module permission.
- Log retention and API audit integration differ per-product.
- **Cross-product tracing**: OneAPI Trace IDs link API calls to admin identities. When debugging "who made this API call and through which product," the OneAPI Trace ID is the stable correlator across ZIA + ZPA + ZIdentity logs.

## ZCC has its own admin copy — sync is operator-controlled

ZCC maintains a **local copy** of admin users from the other products. Three sync endpoints push admin lists into ZCC's database:

| Endpoint | Source |
|---|---|
| `POST /zcc/papi/public/v1/sync/admins` | Generic admin sync |
| `POST /zcc/papi/public/v1/sync/ziaZdxAdmins` | Pull ZIA + ZDX admins |
| `POST /zcc/papi/public/v1/sync/zpaAdmins` | Pull ZPA admins |

Implication: **a newly-added ZIA admin is NOT automatically visible in the ZCC portal.** A sync must run first. This explains "I'm a ZIA admin but the ZCC portal says I don't have access" — the sync hasn't propagated. Operator action: run the appropriate `/sync/*` endpoint, or wait for the periodic background sync (cadence not documented).

This is the inverse of ZIdentity-based federation (where admins flow through Administrative Entitlements). ZCC's sync is product-local and explicitly imperative.

## Operational patterns

### Provisioning a new admin (ZIdentity-enabled tenant)

1. Add user in ZIdentity → Users.
2. Assign ZIdentity role (Super Admin / View Only / User Admin / CXO Insight User or custom).
3. Grant Administrative Entitlements → add ZIA entitlement with appropriate role + scope.
4. Grant Administrative Entitlements → add ZPA entitlement with appropriate role.
5. Admin SSOs via ZIdentity → lands in each product with the configured role.

### Provisioning API automation

1. Create API Client in ZIdentity (Integrations → API Clients → Add).
2. Grant scopes — `zia.*:read`, `zpa.*:read`, `zcc.*:read` etc.
3. Store Client ID + Secret (shown once) in env vars — see `README.md § 4`.
4. Rotation: create new client, cut traffic, deprecate old. Admin users are not affected.

### Scoping admin rights to one region (ZIA)

Cannot combine scope types. Options:

- **Create a Dynamic Location Group** covering the region ("all locations in EU-West"), assign the admin to that Location-Group scope.
- **Create a separate admin account** with Location scope to a single location, if group-scoping isn't enough.
- **Accept Organization scope** if granularity isn't critical — but understand the admin sees everything.

### Investigating who changed a rule

1. Check ZIA Audit Log → filter by Timestamp around rule change.
2. Pull Admin ID + OneAPI Trace ID.
3. If via API, correlate with ZIdentity API Client logs to identify the automation that made the call.
4. If via UI, correlate with admin user's ZIdentity login events.

## Surprises worth flagging

1. **ZIA and ZPA admins are separate by default.** Common misperception: "I'm an admin in ZIA, I should be able to admin ZPA too." No — separate provisioning unless ZIdentity federation is configured.

2. **ZIA scope is single-dimension-only.** No composite scope (Department AND Location). Tenants needing multi-dimensional scoping must use multiple admin accounts or scope up to organization.

3. **ZPA custom roles can grant equal-but-not-higher.** A ZPA admin with "all except Certificate Management" can't delegate someone with "Certificate Management enabled." Avoid privilege-escalation paths by design.

4. **ZIdentity is not optional for modern tenants.** If your tenant is OneAPI-based (any tenant created after late-2024 typically is), ZIdentity is where admin roles live. Legacy paths are being deprecated.

5. **API Clients are not admin users.** Don't grant a human admin role to an automation principal; create an API Client with appropriate scopes. Admin-user credentials in CI pipelines are an antipattern.

6. **Audit log retention is 6 months for ZIA.** Tenants with compliance retention requirements longer than 6 months must export to a SIEM (via NSS or Cloud NSS — see [`./nss-architecture.md`](./nss-architecture.md)) and retain there.

7. **Failed-login lockout is 5-in-1-minute → 5-minute lock.** Brute-force-detection threshold is generous; a real attacker can slow-drip. Layer MFA + geographic-IP gating at ZIdentity for real protection.

8. **Role changes take up to 2 minutes (ZPA).** Not instant. An admin whose role was just expanded may still see the old permissions briefly. Same for revocation — de-privileged admins can still act for up to 2 minutes.

## Cross-links

- ZIdentity unified auth: [`../zidentity/overview.md`](../zidentity/overview.md).
- ZIdentity API Client creation: [`../zidentity/api-clients.md`](../zidentity/api-clients.md).
- ZIA scope vs Location / Location Group: [`../zia/locations.md`](../zia/locations.md).
- OneAPI authentication flow: [`../zidentity/overview.md`](../zidentity/overview.md).
- Audit log → SIEM streaming: [`./nss-architecture.md`](./nss-architecture.md).
- ZCC admin users (separate surface — portal-only, not cross-federated): see ZCC product docs, not yet codified.

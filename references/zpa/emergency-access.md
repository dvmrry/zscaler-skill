---
product: zpa
topic: "emergency-access"
title: "ZPA Emergency Access — time-bounded out-of-band access via Okta"
content-type: reasoning
last-verified: "2026-06-15"
verified-against:
  vendor/zscaler-sdk-python: b3c3645fd530b668c463ce5f1331cfcfc7cb4c00
  vendor/terraform-provider-zpa: a3c845f3366cc2267e1b244f9968e727c92bad3d
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/about-emergency-access-users.md"
  - "vendor/zscaler-help/configuring-emergency-access.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/emergency_access.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/emergency_access.py"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_emergency_access.go"
author-status: draft
---

# ZPA Emergency Access — time-bounded out-of-band access via Okta

Emergency Access is a ZPA feature for provisioning third-party users — contractors, vendors, incident responders — into **time-bounded Privileged Remote Access** without onboarding them through the tenant's primary SSO or SCIM flow. Users are created and managed in an Okta IdP; ZPA does not store the users itself. Access is scoped through Privileged Approvals.

**Limited Availability** — must be enabled by Zscaler Support before the Emergency Access page appears in the Admin Console. (Tier A — vendor/zscaler-help/configuring-emergency-access.md: "This feature and its procedures are in limited availability.")

## What ZPA emergency access is

ZPA Emergency Access provides browser-based Privileged Remote Access (PRA) for external users who have no existing corporate identity in the organization's SSO system. It is distinct from the standard ZPA "Browser Access" pattern (which serves any user with a web browser) — Emergency Access specifically targets PRA use cases with time-bounded approvals.

Unlike ZCC-based ZPA access or standard Browser Access, Emergency Access:
- Does not require ZCC installation on the user's device
- Does not go through the organization's primary IdP (SAML/OIDC SSO)
- Does not require the organization's ZIA service to be in path
- Uses Okta email OTP as the authentication mechanism
- Is scoped only to apps covered by a specific Privileged Approval object — there is no "general access" path

Emergency Access is not a bypass of ZPA policy enforcement — it operates through PRA policy (capability policy, credential policy, privileged portal policy), which remain fully in effect. It bypasses only the identity-provisioning requirement: the user needs no pre-existing corporate account.

## Trust model

- **Okta is the authoritative store.** Emergency access users live in Okta, not in ZPA. The Emergency Access Users page reads from Okta in real time via the IdP API Token. (Tier A — vendor/zscaler-help/configuring-emergency-access.md: "Users are not stored in Private Access. All users listed on the Emergency Access Users page come directly from Okta via the Okta API.")
- **Email OTP authentication.** Users authenticate via the Okta email authenticator — no password required if the Okta authentication policy is configured for Email OTP. The activation email is sent by Okta, not Zscaler. Branding, reply-to addresses, and email customization are the operator's responsibility. (Tier A — vendor/zscaler-help/configuring-emergency-access.md.)
- **Okta-only.** No other IdP is supported. The IdP must have **Use with Arbitrary Domains** enabled. (Tier A — vendor/zscaler-help/configuring-emergency-access.md, Prerequisites.)
- **Access is scoped to Privileged Approvals.** Emergency access does not create a general ZPA user; it creates a user that can be referenced in a privileged approval for a specific PRA App Segment. Emergency access is only supported for Privileged Remote Access. (Tier A — vendor/zscaler-help/configuring-emergency-access.md.)

## When to use

- Incident response — external IR firm or vendor needs temporary PRA access to a specific App Segment without being issued an SSO account.
- Contractor or vendor with no SSO entitlement — short-engagement access where full SCIM provisioning is disproportionate.
- M&A integration windows — acquired-company users not yet migrated into the primary IdP.
- Vendor temporary access — time-limited support access to a specific resource with a hard expiry.

## Configuration

**Step 1 — Enable via Zscaler Support.**
Emergency Access is Limited Availability. File a support request to have it enabled on the tenant.

**Step 2 — Okta prerequisites.**
In Okta, create a group for emergency access users and configure:
- Group administrator privileges for the service account that will hold the API token.
- The email authenticator.
- Authentication policies allowing Email OTP. If the authentication policy utilizes Email OTPs, the invited user can authenticate without a password by providing the OTP sent to the registered email address. (Tier A — vendor/zscaler-help/configuring-emergency-access.md.)

**Step 3 — Configure the Emergency Access page.**
Admin Console: Administration > Identity > Private Access > Emergency Access.

| Field | Notes |
|---|---|
| IdP | Read-only. Auto-populated from the Okta IdP that has Use with Arbitrary Domains enabled. Only Okta IdPs are supported. |
| IdP API Token | Okta API token with group-admin permissions for the designated emergency access group. Zscaler recommends scoping this token narrowly — over-permissive tokens expose additional Okta groups on the Emergency Access Users page. |
| User Group Name | The Okta group into which emergency access users are created. |
| Emergency Authentication Domains | (Optional) Restricts the email domains allowed when creating privileged approvals. If left blank, any domain not already used as a primary or secondary authentication domain is valid. Removing a domain from this field does not revoke existing privileged approvals created with it. |

**Step 4 — Create emergency access users and privileged approvals.**
Users are added via the Emergency Access Users page (Administration > Identity > Private Access > Emergency Access Users) or the API/SDK. Each user is then referenced in a Privileged Approval, which sets the access scope (App Segment) and expiry.

## User lifecycle and status

User status comes from Okta and reflects the Okta lifecycle. (Tier A — vendor/zscaler-help/about-emergency-access-users.md.)

| Status | Meaning |
|---|---|
| Staged | Created in Okta; not yet activated or deactivated. |
| Provisioned | Created and activated in Okta; user has not yet completed email-based authentication. |
| Active | Activated and email authentication completed. |
| Deprovisioned | Created in IdP but not activated. |
| Suspended | User does not have access to applications within Okta. |

Additional Okta-side statuses (Password Expired, Locked Out, Recovery) may appear; consult the Okta Help Center for those.

The Emergency Access Users page also shows **Activation Date** (when admin activated the user) and **Last Login Date**. (Tier A — vendor/zscaler-help/about-emergency-access-users.md.)

## SDK and API surface

**Service:** `client.zpa.emergency_access` (`EmergencyAccessAPI`, `vendor/zscaler-sdk-python/zscaler/zpa/emergency_access.py`)

**Pagination note:** Uses `page_id` (not `page`) as the pagination key — the only ZPA service in the SDK to do so; every other ZPA service (e.g. application_segment, c2c_ip_ranges, microtenants, scim_attributes, saml_attributes) documents `page`. (Tier A — `vendor/zscaler-sdk-python/zscaler/zpa/emergency_access.py:46` docstring lists `page_id` as the page-number parameter; Go parity at `vendor/zscaler-sdk-go/zscaler/zpa/services/emergencyaccess/emergencyaccess.go:123` builds the URL with `pageId=`.)

| Method | Signature | Notes |
|---|---|---|
| `list_users` | `(query_params=None, **kwargs)` (`:37`) | `search` supports `first_name+EQ+Emily` style (`:59`) |
| `get_user` | `(user_id: str, query_params=None)` (`:102`) | |
| `add_user` | `(activate_now=True, **kwargs)` (`:145`) | `activate_now=True` (default) triggers immediate activation (`:155`) |
| `update_user` | `(user_id: str, activate_now=True, **kwargs)` (`:206`) | |
| `activate_user` | `(user_id: str, send_email: bool = False, **kwargs)` (`:272`) | Activates independently of create |
| `deactivate_user` | `(user_id: str, **kwargs)` (`:318`) | Deactivates without deleting |

**EmergencyAccessUser model fields** (from `models/emergency_access.py`:33-42 — there is no `id` field; the identity field is `user_id`):

| Field | Wire key | Notes |
|---|---|---|
| `user_id` | `userId` | Okta-side user ID — the model's identity field (:33). |
| `first_name` | `firstName` | Display name field (:34). |
| `last_name` | `lastName` | Display name field (:35). |
| `email_id` | `emailId` | Email address (:36). |
| `user_status` | `userStatus` | Mirrors the Okta lifecycle tabulated under "User lifecycle and status" above — Staged / Provisioned / Active / Deprovisioned / Suspended (:37). |
| `activated_on` | `activatedOn` | Backs the **Activation Date** UI column on the Emergency Access Users page (:38). |
| `last_login_time` | `lastLoginTime` | Backs the **Last Login Date** UI column on the Emergency Access Users page (:39). |
| `allowed_activate` | `allowedActivate` | Boolean field; also accepted as an `add_user` request key (:40; `emergency_access.py:167`). |
| `allowed_deactivate` | `allowedDeactivate` | Boolean field; also accepted as an `add_user` request key (:41; `emergency_access.py:168`). |
| `update_enabled` | `updateEnabled` | "Indicates if the emergency access user can be updated (true) or not (false)" per the `add_user` docstring (:42; `emergency_access.py:154`). |

**API endpoints** (base `/zpa/mgmtconfig/v1/admin/customers/{customerId}`):

| Operation | Method + path |
|---|---|
| List users | `GET …/emergencyAccess/users` (plural; `emergency_access.py:76-79`) |
| Get user | `GET …/emergencyAccess/user/{user_id}` (`:120-123`) |
| Add user | `POST …/emergencyAccess/user` (`:176-179`) |
| Update user | `PUT …/emergencyAccess/user/{user_id}` (`:238-241`) |
| Activate user | `PUT …/emergencyAccess/user/{user_id}/activate` (`:284-287`) |
| Deactivate user | `PUT …/emergencyAccess/user/{user_id}/deactivate` (`:329-332`) |

Note the list path is plural (`/users`) while single-resource operations are singular (`/user`). There is **no DELETE endpoint** — the SDK exposes no delete method (deactivation, not deletion, is the removal path; see Terraform note below). The list endpoint paginates with `page_id` (not the standard `page` parameter).

**Go SDK parity:** `emergencyaccess/` service. (Tier A — sdk.md §2.16.)

**Terraform resource:** `zpa_emergency_access_user`. The resource's `DeleteContext` maps to a deactivate handler that calls `emergencyaccess.Deactivate` (not delete) — removing the TF resource deactivates the user rather than deleting the Okta account. (Tier C — `vendor/terraform-provider-zpa/zpa/resource_zpa_emergency_access.go:18,128,139`.) `email_id` is `ForceNew` — changing the email destroys and recreates the user. (`resource_zpa_emergency_access.go:33`.)

## Limitations

- **Okta-only.** No SAML IdP, no Entra ID, no generic OIDC provider — specifically Okta with the email authenticator.
- **PRA only.** Standard ZPA app access (non-PRA App Segments) is not supported via Emergency Access.
- **No ZIA policy enforcement path.** Emergency Access users access ZPA via the PRA portal/browser mechanism, not ZCC. ZIA policies (URL filtering, SSL inspection, DLP) are not applied to their sessions.
- **No general policy bypass.** ZPA PRA policies (capability, credential, portal) still apply. Emergency Access only bypasses the identity-provisioning requirement.
- **Audit coverage unconfirmed.** Whether emergency access activations and authentications appear in ZPA admin audit logs or LSS access logs is not documented in available sources. (Tier D — treat audit coverage as unconfirmed; verify in a lab tenant before relying on log-based alerting.)

## Microtenant interaction

The Emergency Access and Emergency Access Users pages are hidden for Microtenants with Privileged Approvals disabled. This is not a permission error — the pages are simply not surfaced in the UI for that scope. (Tier A — vendor/zscaler-help/about-emergency-access-users.md and vendor/zscaler-help/configuring-emergency-access.md.)

Microtenant constraints (Tier A — vendor/zscaler-help/configuring-emergency-access.md):
- Only the **Default Microtenant** can configure Emergency Access settings.
- Microtenants with Privileged Approvals disabled can still create or edit emergency access users, but the Emergency Access Users page is not visible to them.
- To expose Emergency Access within a Microtenant, Privileged Approvals must be enabled on that Microtenant object.

## Operational gotchas

**1. Limited Availability — coordinate with Zscaler Support.**
The feature gate must be opened before any configuration is possible. The Emergency Access page does not appear until Support enables it.

**2. Okta-only — no other IdP.**
Tenants without an Okta IdP configured in ZPA cannot use Emergency Access. There is no workaround; the feature is architecturally coupled to Okta's user lifecycle and email authenticator.

**3. Over-permissive API token exposes extra users.**
If the Okta API Token has permissions over multiple groups, all users from those groups appear on the Emergency Access Users page and can be activated or deactivated, regardless of whether they are in the designated emergency access group. (Tier A — vendor/zscaler-help/configuring-emergency-access.md: "If the specified IdP API Token is more permissive, additional users might be displayed.") Scope the token to the designated group only.

**4. Removing an authentication domain does not revoke existing approvals.**
Privileged approvals created with a domain that is subsequently removed from the Emergency Authentication Domains field remain active. Expiry or manual deactivation is the only removal path. (Tier A — vendor/zscaler-help/configuring-emergency-access.md.)

**5. Deleted group still shows users.**
If the Okta group designated for emergency access is deleted, users not part of the group are still shown on the Emergency Access Users page as long as the settings are configured. If the credentials have permission over multiple groups, Private Access continues to show users of those groups even after the designated group is deleted. (Tier A — vendor/zscaler-help/configuring-emergency-access.md.)

**6. Special characters in email addresses.**
A `+` in the email address (e.g., `user+emergency@example.com`) renders as a blank space in the username field on the Okta login page when a login hint is used. Depending on Okta login rules, this may prevent login. (Tier A — vendor/zscaler-help/configuring-emergency-access.md.) Avoid `+` addressing for emergency access users.

**7. `activate_now=False` in SDK.**
The `add_user` method's `activate_now` parameter defaults to `True`, triggering immediate activation and sending the email. Set `activate_now=False` to create the user in Staged state and activate later. (Tier A — `emergency_access.py` docstring.)

## Cross-links

- Microtenant Privileged Approvals flag — page visibility dependency — [`./microtenants.md`](./microtenants.md)
- App Segments targeted by privileged approvals — [`./app-segments.md`](./app-segments.md)
- Privileged Remote Access (the access method Emergency Access feeds into) — [`./privileged-remote-access.md`](./privileged-remote-access.md)
- Policy precedence and access rule interactions — [`./policy-precedence.md`](./policy-precedence.md)
- EmergencyAccessAPI in SDK catalog — [`./sdk.md`](./sdk.md) §2.16

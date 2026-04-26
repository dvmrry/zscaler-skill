---
product: zpa
topic: "emergency-access"
title: "ZPA Emergency Access — time-bounded out-of-band access via Okta"
content-type: reasoning
last-verified: "2026-04-26"
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

**Limited Availability** — must be enabled by Zscaler Support before the Emergency Access page appears in the Admin Console.

## Trust model

- **Okta is the authoritative store.** Emergency access users live in Okta, not in ZPA. The Emergency Access Users page (Administration > Identity > Private Access > Emergency Access Users) reads from Okta in real time via the IdP API Token. Source: *configuring-emergency-access.md* — "Users are not stored in Private Access. All users listed on the Emergency Access Users page come directly from Okta via the Okta API."
- **Email OTP authentication.** Users authenticate via the Okta email authenticator — no password required if the Okta authentication policy is configured for Email OTP. The activation email is sent by Okta, not Zscaler. Branding, reply-to addresses, and email customization are the operator's responsibility.
- **Okta-only.** No other IdP is supported. The IdP must have **Use with Arbitrary Domains** enabled. Source: *configuring-emergency-access.md*, Prerequisites.
- **Access is scoped to Privileged Approvals.** Emergency access does not create a general ZPA user; it creates a user that can be referenced in a privileged approval for a specific PRA App Segment. Emergency access is only supported for Privileged Remote Access.

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
- Authentication policies allowing Email OTP.

**Step 3 — Configure the Emergency Access page.**
Admin Console: Administration > Identity > Private Access > Emergency Access.

| Field | Notes |
|---|---|
| IdP | Read-only. Auto-populated from the Okta IdP that has Use with Arbitrary Domains enabled. |
| IdP API Token | Okta API token with group-admin permissions for the designated emergency access group. Zscaler recommends scoping this token narrowly — over-permissive tokens expose additional Okta groups on the Emergency Access Users page. |
| User Group Name | The Okta group into which emergency access users are created. |
| Emergency Authentication Domains | (Optional) Restricts the email domains allowed when creating privileged approvals. If left blank, any domain not already used as a primary or secondary authentication domain is valid. Removing a domain from this field does not revoke existing privileged approvals created with it. |

**Step 4 — Create emergency access users and privileged approvals.**
Users are added via the Emergency Access Users page or the API/SDK. Each user is then referenced in a Privileged Approval, which sets the access scope (App Segment) and expiry.

## User lifecycle and status

User status comes from Okta and reflects the Okta lifecycle. States visible in the Admin Console (source: *about-emergency-access-users.md*):

| Status | Meaning |
|---|---|
| Staged | Created in Okta; not yet activated or deactivated. |
| Provisioned | Created and activated in Okta; user has not yet completed email-based authentication. |
| Active | Activated and email authentication completed. |
| Deprovisioned | Created in IdP but not activated. |
| Suspended | User does not have access to applications within Okta. |

Additional Okta-side statuses (Password Expired, Locked Out, Recovery) may appear; consult the Okta Help Center for those.

**SDK — activate / deactivate independently of create:**
The Python SDK `EmergencyAccessAPI` exposes `activate_user(user_id, send_email=False)` and `deactivate_user(user_id)` as separate operations in addition to `add_user(activate_now=True)`. The `activate_now` parameter on create defaults to `True`, triggering immediate activation and sending the email. Set `activate_now=False` to create the user in Staged state and activate later.

TF resource `zpa_emergency_access`: the destroy operation calls `Deactivate` (not delete) — removing the TF resource deactivates the user rather than deleting the Okta account. `email_id` is `ForceNew` — changing the email destroys and recreates the user.

## Microtenant interaction

The Emergency Access and Emergency Access Users pages are **hidden for Microtenants with Privileged Approvals disabled**. This is not a permission error — the pages are simply not surfaced in the UI for that scope. Source: *about-emergency-access-users.md* and *configuring-emergency-access.md*.

Microtenant constraints (source: *configuring-emergency-access.md*):
- Only the **Default Microtenant** can configure Emergency Access settings (the Emergency Access page in step 3 above).
- Microtenants with Privileged Approvals disabled can still create or edit emergency access users, but the Emergency Access Users page is not visible to them.
- To expose Emergency Access within a Microtenant, Privileged Approvals must be enabled on that Microtenant object.

See [`./microtenants.md`](./microtenants.md) — specifically the "Emergency Access interaction" and "Privileged Approvals is per-Microtenant" sections.

## Operational gotchas

**1. Limited Availability — coordinate with Zscaler Support.**
The feature gate must be opened before any configuration is possible. The Emergency Access page does not appear until Support enables it.

**2. Okta-only — no other IdP.**
Tenants without an Okta IdP configured in ZPA cannot use Emergency Access. There is no workaround; the feature is architecturally coupled to Okta's user lifecycle and email authenticator.

**3. Over-permissive API token exposes extra users.**
If the Okta API Token has permissions over multiple groups, all users from those groups appear on the Emergency Access Users page and can be activated or deactivated, regardless of whether they are in the designated emergency access group. Scope the token to the designated group only.

**4. Removing an authentication domain does not revoke existing approvals.**
Privileged approvals created with a domain that is subsequently removed from the Emergency Authentication Domains field remain active. Expiry or manual deactivation is the only removal path.

**5. Audit logging — not confirmed in source.**
Neither the help-portal captures nor the SDK source document whether emergency access activations, deactivations, or authentications appear in ZPA admin audit logs or access logs. Treat audit coverage as unconfirmed (Tier D). Verify in a lab tenant before relying on log-based alerting for emergency access events.

**6. Special characters in email addresses.**
A `+` in the email address (e.g., `user+emergency@example.com`) renders as a blank space in the username field on the Okta login page when a login hint is used. Depending on Okta login rules, this may prevent login. Avoid `+` addressing for emergency access users.

## Cross-links

- Microtenant Privileged Approvals flag — page visibility dependency — [`./microtenants.md`](./microtenants.md)
- App Segments targeted by privileged approvals — [`./app-segments.md`](./app-segments.md)
- Privileged Remote Access (the access method Emergency Access feeds into) — [`./privileged-remote-access.md`](./privileged-remote-access.md)
- Policy precedence and access rule interactions — [`./policy-precedence.md`](./policy-precedence.md)

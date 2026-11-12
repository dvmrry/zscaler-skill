# Emergency Access Users page: statuses, dates and actions (zpa.emergency-access.users)
Also called: emergency access user status; staged provisioned active deprovisioned suspended; emergency access activation date; emergency access last login; activate deactivate emergency access user

The page shows each user's state in the identity provider. The Emergency Access Users page lists First Name, Last Name, Email Address, Status, Activation Date (when the admin activated the user) and Last Login Date. [zpa.emergency-access.users:page-columns]

**Status.** The status is Active (activated and email authentication completed), Staged (created in the IdP, neither activated nor deactivated), Provisioned (created and activated, still to complete email authentication), Deprovisioned (created in the IdP but not activated) or Suspended (no access to applications within the IdP). [zpa.emergency-access.users:status-values] Other statuses, such as Password Expired, Locked Out and Recovery, might appear. [zpa.emergency-access.users:other-statuses]

**Actions.** From the page an emergency access user can be edited, activated and deactivated. [zpa.emergency-access.users:page-actions]

**Editing.** Only the First Name and Last Name fields of an emergency access user can be edited. [zpa.emergency-access.users:edit-names-only]

Where these users come from and who can see them: [Emergency Access identity: where users live, which IdPs, and how they sign in](kb:zpa.emergency-access.identity) and [Configuring Emergency Access: availability, settings, authentication domains, Microtenants](kb:zpa.emergency-access.configuration). The same fields through the API: [Emergency Access through the API, the Python SDK and Terraform](kb:zpa.emergency-access.api-surface).

What to check:
1. The user's status, and what that status means: whether email authentication has completed.
2. Activation Date and Last Login Date for evidence the user activated and signed in.

Area: zpa.emergency-access, its subjects in references/_meta/spine/zpa/zpa.emergency-access.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.emergency-access.identity.md (Emergency Access identity: where users live, which IdPs, and how they sign in): Emergency access users are not stored in Private Access: the Emergency Access Users page lists users directly from Okta via the Okta API, or from Authentication Service when that is the IdP. [zpa.emergency-access.identity:users-not-stored]
- depends-on references/_meta/text/zpa/zpa.emergency-access.configuration.md (Configuring Emergency Access: availability, settings, authentication domains, Microtenants), from zpa.emergency-access: Emergency Access is in limited availability, and Zscaler Support enables it for an organization. [zpa.emergency-access.configuration:limited-availability]
- logged-in references/_meta/text/zpa/zpa.audit-logs.what-is-recorded.md (What the ZPA admin audit log records, how long it is kept, and whether it can be pulled), from zpa.emergency-access: The admin audit log lists Emergency Access and Emergency Access User as resource types. [zpa.emergency-access.scope:audit-resource-types]
- scoped-by references/_meta/text/zpa/zpa.pra.approvals.md (PRA approvals: requesting, reviewing and expiry), from zpa.emergency-access: Emergency access users have permissions limited to privileged approvals in the IdP enabled for emergency access. [zpa.emergency-access.scope:scoped-to-approvals]
- links-to references/_meta/text/zpa/zpa.emergency-access.api-surface.md (Emergency Access through the API, the Python SDK and Terraform)

# Terraform admin roles, admin users and local users in ZIA (zia.terraform.admin-identity)
Also called: zia_admin_roles; zia_admin_users; zia_user_management; role_type PUBLIC_API; role_type cannot be changed; admin rank terraform; user management perpetual drift; admin password drift

The provider manages ZIA administrator roles, administrator accounts and local users as separate resources, and several of their attributes are validated or refreshed in ways the schema alone does not show. Role type, rank and password handling are the places a plan most often surprises an operator.

**Admin roles.** The `role_type` validator on `zia_admin_roles` accepts ORG_ADMIN, EXEC_INSIGHT, EXEC_INSIGHT_AND_ORG_ADMIN, SDWAN and PUBLIC_API, so a role can declare PUBLIC_API in HCL without failing validation. [zia.terraform.admin-identity:role-type-values] Provider issue #572, still open, reports against v4.7.18 that `role_type = "PUBLIC_API"` on `zia_admin_roles` failed validation with an enum error listing only ORG_ADMIN, EXEC_INSIGHT, EXEC_INSIGHT_AND_ORG_ADMIN and SDWAN, and that omitting `role_type` on an imported role failed with a `cannot be changed once the resource is created` error, so the reporter's four imported API roles needed `lifecycle { ignore_changes = [role_type] }`. [zia.terraform.admin-identity:issue-572-validator-rejects-public-api] Which release changed the validator is open [gap:zia.terraform.admin-identity:issue-572-open-though-validator-accepts]. A plan-time check rejects any change to `role_type` once the `zia_admin_roles` resource has an ID, with the error "the role_type cannot be changed once the resource is created"; so a role's type cannot be changed in place. [zia.terraform.admin-identity:role-type-immutable] When `role_type` is SDWAN, the same plan-time check requires `policy_access` to be READ_WRITE and `alerting_access` to be NONE, and fails the plan otherwise. [zia.terraform.admin-identity:sdwan-role-constraints]

**Rank.** The `rank` attribute of `zia_admin_roles` is an optional integer with no range validator in the schema; its description gives 7 as the default and lowest rank and says it applies only when admin rank is enabled in Advanced Settings. [zia.terraform.admin-identity:rank-unvalidated] The documented range and direction of rank are in [Web DLP policy rules: order, criteria and actions](kb:zia.dlp.rules). Whether the values are the same in every tenant is open [gap:zia.terraform.admin-identity:rank-values-fixed].

**Admin passwords.** The `zia_admin_users` password is sensitive, is mandatory for creation when admin single sign-on is disabled, and the schema says the API does not provide it in a GET response. [zia.terraform.admin-identity:admin-password-not-returned]

**Local users.** The `zia_user_management` Read copies name, email, comments, temp_auth_email, groups and department from the response into state and sets neither `password` nor `auth_methods`, so the password in state is never refreshed from ZIA. [zia.terraform.admin-identity:user-read-sets-no-password] Since provider v4.7.24 the `zia_user_management` Read resolves the user from the list endpoint (name-filtered first, then a full list scan) instead of the per-ID lookup, because on Zidentity-migrated tenants the per-ID lookup returns name and email in an encoded form that produced a perpetual in-place update on every plan. [zia.terraform.admin-identity:user-read-from-list] The provider documents that a user email need not be a valid address but must be unique and its domain must belong to the organization. [zia.terraform.admin-identity:user-email-unique] The enrollment of authentication methods is covered in [ZIA Terraform operations that take several API writes with no rollback](kb:zia.terraform.multi-step-writes), and the first-role-only expansion of admin users in [ZIA Terraform resource fields that are not sent, not read back, or sent wrongly](kb:zia.terraform.field-fidelity).

What to check:
1. Whether a plan that changes `role_type` on an existing admin role failed on the immutability check, which needs a destroy and recreate.
2. Whether an SDWAN role sets `policy_access` to READ_WRITE and `alerting_access` to NONE before suspecting the API.
3. Whether an imported API-only role declares `role_type = "PUBLIC_API"` directly rather than ignoring the attribute.
4. Whether a user plan that shows name or email drift on a Zidentity-migrated tenant runs a provider older than v4.7.24.
5. Whether a password or auth-method difference is expected, since neither is refreshed from ZIA on read.

Not known (open gaps):
- Whether admin rank values are fixed ZIA system values rather than organization-specific [gap:zia.terraform.admin-identity:rank-values-fixed]: settled by support-ticket or tenant-data. Blocks: saying whether a rank number means the same thing in every tenant
- Which release added PUBLIC_API to the role_type validator, and whether the omitted-role_type error remains [gap:zia.terraform.admin-identity:issue-572-open-though-validator-accepts]: settled by lab-test. Blocks: saying which provider versions accept PUBLIC_API, or that an imported API role plans cleanly

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.dlp.rules.md (Web DLP policy rules: order, criteria and actions)
- links-to references/_meta/text/zia/zia.terraform.field-fidelity.md (ZIA Terraform resource fields that are not sent, not read back, or sent wrongly)
- links-to references/_meta/text/zia/zia.terraform.multi-step-writes.md (ZIA Terraform operations that take several API writes with no rollback)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.ad-integration.terraform.md (What Terraform manages for ZIA users and authentication settings)

# How users, groups and departments get into ZIA (zia.ad-integration)
Also called: active directory integration; AD integration; user provisioning; ldap sync; user not found in policy; group not available in rule; provisioning vs authentication; ZIA user database

"Why can policy not see this user, group or department?" has two separate halves, and tenants mix them freely: how the identity reaches the ZIA user database (provisioning), and how traffic proves who it is (authentication). Enforcing policy by department, group and user, and reporting by user, requires users, groups and departments to be provisioned into the Zscaler database first and authentication to be enabled. With authentication disabled at a known location the service does not know who the users are and applies the location's policies. [zia.ad-integration:identity-needed] A rule scoped by user, group or department is therefore judged against whatever the two halves produced; for the authentication half see [ZIA authentication: how a request gets a user identity](kb:zia.authentication) and [What happens to traffic with no user identity](kb:zia.authentication.unauthenticated-traffic).

1. **Which provisioning method is in use, and which authentication methods can it pair with?** [ZIA provisioning methods and which authentication each allows](kb:zia.ad-integration.provisioning-methods). SCIM is its own area: [ZIA SCIM provisioning](kb:zia.scim). Users, groups and departments added by hand or by CSV, and one-time tokens and links: [Hosted User Database: adding users by hand, importing users, groups and departments by CSV, and one-time tokens and links](kb:zia.ad-integration.hosted-user-database). Deploying the Zscaler Authentication Bridge: [Deploying the Zscaler Authentication Bridge (ZAB): requirements, certificates, commands and renewal](kb:zia.ad-integration.authentication-bridge).
2. **If it is directory synchronization,** how it syncs, how often, and what it does to users removed from the directory: [Directory (LDAP/AD) synchronization behavior](kb:zia.ad-integration.directory-sync).
3. **If it is SAML,** what auto-provisioning creates and overwrites at login: [SAML auto-provisioning: what login creates and overwrites](kb:zia.ad-integration.saml-auto-provisioning).
4. **What do the resulting objects look like, and what limits apply?** [ZIA users, groups and departments: shape and limits](kb:zia.ad-integration.identity-objects).
5. **Is it managed as code?** [What Terraform manages for ZIA users and authentication settings](kb:zia.ad-integration.terraform).

The organization-wide switches that tie these together (auto-provision, the directory-sync migration flag, SAML) are one settings object, documented in [The organization-wide authentication settings object](kb:zia.authentication.settings) and [SAML and Kerberos: what each needs to work](kb:zia.authentication.methods); they are not restated here. Per-location Kerberos and Surrogate IP behavior is in [SAML and Kerberos: what each needs to work](kb:zia.authentication.methods) and [Surrogate IP: mapping a private IP to an authenticated user](kb:zia.authentication.surrogate-ip).

What reporting and cross-product policy show for users that were never provisioned is open [gap:zia.ad-integration:web-insights-attribution].

Traffic without authentication is covered in [What happens to traffic with no user identity](kb:zia.authentication.unauthenticated-traffic). The ZPA Active Directory controls (AppProtection inspection of Kerberos, SMB and LDAP) are a different feature; see [Active Directory controls: Kerberos, SMB and LDAP inspection](kb:zpa.appprotection.active-directory). The user and department log fields are documented in the [What a ZIA web log record is and how its fields are named](kb:zia.logs.web-records).

Not known (open gaps):
- What reporting and cross-product policy show for users that were never provisioned [gap:zia.ad-integration:web-insights-attribution]: settled by lab-test or tenant-data. Blocks: advice on what to expect in reports and ZPA policy for unprovisioned users

Area: zia.ad-integration, its subjects in references/_meta/spine/zia/zia.ad-integration.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.authentication.unauthenticated-traffic.md (What happens to traffic with no user identity): Enforcing policy by department, group and user, and reporting by user, requires users, groups and departments to be provisioned into the Zscaler database first and authentication to be enabled. With authentication disabled at a known location the service does not know who the users are and applies the location's policies. [zia.ad-integration:identity-needed]
- depends-on references/_meta/text/zia/zia.authentication.md (ZIA authentication: how a request gets a user identity): Enforcing policy by department, group and user, and reporting by user, requires users, groups and departments to be provisioned into the Zscaler database first and authentication to be enabled. With authentication disabled at a known location the service does not know who the users are and applies the location's policies. [zia.ad-integration:identity-needed]
- links-to references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work)
- interacts-with references/_meta/text/zia/zia.scim.setup.md (Enabling ZIA SCIM: prerequisites, base URL and token): SCIM provisioning is not supported with Active Directory or OpenLDAP user repositories. To migrate from directory synchronization, enable Disable Directory Sync and Enable SCIM Provisioning on the Authentication Default Settings page. [zia.scim.setup:not-with-directory]
- links-to references/_meta/text/zia/zia.ad-integration.authentication-bridge.md (Deploying the Zscaler Authentication Bridge (ZAB): requirements, certificates, commands and renewal)
- links-to references/_meta/text/zia/zia.ad-integration.directory-sync.md (Directory (LDAP/AD) synchronization behavior)
- links-to references/_meta/text/zia/zia.ad-integration.hosted-user-database.md (Hosted User Database: adding users by hand, importing users, groups and departments by CSV, and one-time tokens and links)
- links-to references/_meta/text/zia/zia.ad-integration.identity-objects.md (ZIA users, groups and departments: shape and limits)
- links-to references/_meta/text/zia/zia.ad-integration.provisioning-methods.md (ZIA provisioning methods and which authentication each allows)
- links-to references/_meta/text/zia/zia.ad-integration.saml-auto-provisioning.md (SAML auto-provisioning: what login creates and overwrites)
- links-to references/_meta/text/zia/zia.ad-integration.terraform.md (What Terraform manages for ZIA users and authentication settings)
- links-to references/_meta/text/zia/zia.authentication.settings.md (The organization-wide authentication settings object)
- links-to references/_meta/text/zia/zia.authentication.surrogate-ip.md (Surrogate IP: mapping a private IP to an authenticated user)
- links-to references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named)
- links-to references/_meta/text/zia/zia.scim.md (ZIA SCIM provisioning)
- links-to references/_meta/text/zpa/zpa.appprotection.active-directory.md (Active Directory controls: Kerberos, SMB and LDAP inspection)

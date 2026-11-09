# What Terraform manages for ZIA users and authentication settings (zia.ad-integration.terraform)
Also called: terraform auth settings; zia_user_management; zia_auth_settings_urls; manage users as code; terraform authSettings

Terraform's coverage of authentication is narrow. The ZIA Terraform provider registers a zia_user_management resource and data source and a zia_auth_settings_urls resource and data source. It registers no resource for the organization-wide authSettings object, so the tenant authentication mode (orgAuthType, samlEnabled and the rest) is not managed as code by the provider. [zia.ad-integration.terraform:provider-surface]

The exempted-URL list resource has its own write-order and no-op-delete traps, recorded in [Destinations that skip authentication](kb:zia.authentication.exemptions); user enrollment of authentication methods is a separate call that can fail silently, recorded in [ZIA Terraform operations that take several API writes with no rollback](kb:zia.terraform.multi-step-writes). The org settings object that Terraform does not manage is described in [The organization-wide authentication settings object](kb:zia.authentication.settings).

What to check:
1. Whether a drift report on authentication mode can come from Terraform, given that the provider does not manage the org authentication settings object.
2. Which of the two resources a configuration actually uses, zia_user_management or zia_auth_settings_urls.

Inferred, not quoted (say so when an answer rests on one):
- [zia.ad-integration.terraform:provider-surface] Tier B: Search run: the provider.go resource map and the file list under zia/ were read at the pin (v4.8.8); no resource or data source for authSettings, SCIM or identity providers was found. Absence in that pin only.

Area: zia.ad-integration, its subjects in references/_meta/spine/zia/zia.ad-integration.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.authentication.md (ZIA authentication: how a request gets a user identity), from zia.ad-integration: Enforcing policy by department, group and user, and reporting by user, requires users, groups and departments to be provisioned into the Zscaler database first and authentication to be enabled. With authentication disabled at a known location the service does not know who the users are and applies the location's policies. [zia.ad-integration:identity-needed]
- interacts-with references/_meta/text/zia/zia.authentication.unauthenticated-traffic.md (What happens to traffic with no user identity), from zia.ad-integration: Enforcing policy by department, group and user, and reporting by user, requires users, groups and departments to be provisioned into the Zscaler database first and authentication to be enabled. With authentication disabled at a known location the service does not know who the users are and applies the location's policies. [zia.ad-integration:identity-needed]
- interacts-with references/_meta/text/zia/zia.scim.setup.md (Enabling ZIA SCIM: prerequisites, base URL and token), from zia.ad-integration: SCIM provisioning is not supported with Active Directory or OpenLDAP user repositories. To migrate from directory synchronization, enable Disable Directory Sync and Enable SCIM Provisioning on the Authentication Default Settings page. [zia.scim.setup:not-with-directory]
- links-to references/_meta/text/zia/zia.authentication.exemptions.md (Destinations that skip authentication)
- links-to references/_meta/text/zia/zia.authentication.settings.md (The organization-wide authentication settings object)
- links-to references/_meta/text/zia/zia.terraform.multi-step-writes.md (ZIA Terraform operations that take several API writes with no rollback)

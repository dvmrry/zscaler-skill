# Enabling SCIM for Private Access: endpoint, token, policy setting and IdP guides (zpa.scim.setup)
Also called: enable SCIM ZPA; SCIM Sync; SCIM Service Provider Endpoint; bearer token; Generate New Token; SCIM Attributes for Policy

SCIM is enabled per IdP in the Admin Console. An IdP for SAML authentication should be configured for single sign-on before SCIM is enabled, and Zscaler supports only SCIM version 2.0. [zpa.scim.setup:prerequisites] SCIM is enabled by selecting Enabled for SCIM Sync in the Edit IdP Configuration window. The SCIM Service Provider Endpoint is used when configuring SCIM in the IdP, and Generate New Token creates the bearer token, a unique alphanumeric string that authenticates SCIM requests; the token does not display again after saving. [zpa.scim.setup:enable-endpoint-token] To disable SCIM for identity management, Disabled must be selected for SCIM Sync. [zpa.scim.setup:disable-scim]

**Policy setting.** When SCIM Attributes for Policy is first enabled, an existing user's Client Connector connection also needs to be enabled for SCIM, and only policies with SCIM criteria are evaluated for that user after the user successfully reauthenticates. Reauthentication does not impact ongoing connections to applications or the ability to use SAML as a criteria in Private Access policies. [zpa.scim.setup:policy-setting-reauth] The setting is named differently on the IdP configuration and access policy pages; the divergence is in [Configuring an IdP for Private Access single sign-on](kb:zpa.authentication.idp-configuration). Zscaler recommends enabling SCIM Sync in advance of SCIM Attributes for Policy, and waiting a minimum of 48 hours, or up to a week, after SCIM Sync is enabled before enabling SCIM policies; the Azure AD SCIM guide says the same wait. After SCIM is enabled Zscaler checks whether a user is present in the SCIM database and, based on this, decides whether the user is allowed or blocked access to Private Access. [zpa.scim.setup:sync-before-policy] The wait is also in [Zscaler recommends waiting a minimum of 48 hours, sometimes up to a week, after SCIM sync is enabled before enabling SCIM policies.](kb:zpa.policy.scim-sync:scim-wait-48-hours).

**IdP guides.** The enabling page links SCIM guides for Microsoft Azure AD, PingFederate and Okta, and says Okta does not sync users to Private Access before SCIM is enabled. [zpa.scim.setup:idp-guides]

**Azure AD.** Azure AD SCIM needs a premium Azure AD subscription and is configured on the Zscaler Private Access (ZPA) application added as part of configuring Azure as an IdP, with a configuration separate from the IdP setup. Provisioning Mode is Automatic, Tenant URL is the SCIM Service Provider Endpoint, Secret Token is the Bearer Token, and Scope is set to Sync only assigned users and groups. [zpa.scim.setup:azure-ad]

**Okta.** Okta SCIM uses Zscaler Private Access 2.0, which lets SAML be the authentication method and SCIM the provisioning method, and needs a SCIM provisioning subscription for Okta. Base URL is the SCIM Service Provider Endpoint and API Token is the Bearer Token; if the connection test fails the guide says to save the IdP configuration in the Admin Console and try again. The Create Users, Update User Attributes and Deactivate Users Enable checkboxes are selected. [zpa.scim.setup:okta-api-integration] Before enabling SCIM for policies with Okta, Zscaler recommends monitoring the Admin Console's user and group count until it equals Okta's. The sync duration depends on the number of users and groups synced and can take up to a week in certain scenarios. [zpa.scim.setup:okta-sync-readiness] For Okta, Zscaler recommends one assignment group with all Okta users and then pushing the groups to sync. Additional attributes (the examples are user.department and user.jobtitle) are added with data type string and external namespace urn:ietf:params:scim:schemas:extension:enterprise:2.0:User, and the SCIM user can be confirmed with the View icon next to an internal user ID. [zpa.scim.setup:okta-groups-and-attributes]

What is synced is in [SCIM attributes and groups in Private Access](kb:zpa.scim.attributes-and-groups), timing in [When SCIM data is ready for ZPA policy](kb:zpa.scim.provisioning-timing), policy use in [SCIM groups and attributes as ZPA policy criteria](kb:zpa.scim.policy-criteria), and the server API in [The Private Access SCIM server API: operations, paging and request rules](kb:zpa.scim.server-operations). The PingFederate guide the enabling page links is not captured [gap:zpa.scim.setup:pingfederate-guide].

What to check:
1. Whether SCIM Sync is enabled on the IdP and whether the bearer token was copied before saving, since it is not shown again.
2. Whether SCIM Sync was enabled well before SCIM Attributes for Policy, and whether the Admin Console's user and group counts match the IdP's.
3. For an existing user, whether Client Connector has reauthenticated since SCIM Attributes for Policy was first enabled.

Not known (open gaps):
- PingFederate SCIM guide [gap:zpa.scim.setup:pingfederate-guide]: settled by source-read

Area: zpa.scim, its subjects in references/_meta/spine/zpa/zpa.scim.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.scim.provisioning-timing.md (When SCIM data is ready for ZPA policy), from zpa.scim: It can take several days for the IdP to sync all user information to ZPA completely. [zpa.scim.provisioning-timing:several-days]
- links-to references/_meta/text/zpa/zpa.authentication.idp-configuration.md (Configuring an IdP for Private Access single sign-on)
- links-to references/_meta/text/zpa/zpa.policy.scim-sync.md (SCIM sync timing before SCIM criteria are used)
- links-to references/_meta/text/zpa/zpa.scim.attributes-and-groups.md (SCIM attributes and groups in Private Access)
- links-to references/_meta/text/zpa/zpa.scim.policy-criteria.md (SCIM groups and attributes as ZPA policy criteria)
- links-to references/_meta/text/zpa/zpa.scim.server-operations.md (The Private Access SCIM server API: operations, paging and request rules)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.scim.md (ZPA SCIM groups and attributes in policy)
- see-also references/_meta/text/zia/zia.scim.setup.md (Enabling ZIA SCIM: prerequisites, base URL and token)

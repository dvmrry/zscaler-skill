# SCIM provisioning across ZIA and ZPA: where the two differ (shared.scim)
Also called: scim provisioning; scim zia vs zpa; active=false scim; user deleted in idp still present; scim sync; scim not syncing

ZIA and ZPA each run their own SCIM server, configured per IdP, and the same IdP push can mean different things to each. The per-product subjects hold the detail; this table lines up the differences.

| Question | ZIA | ZPA |
| --- | --- | --- |
| Overview | [ZIA SCIM provisioning](kb:zia.scim) | [ZPA SCIM groups and attributes in policy](kb:zpa.scim) |
| Prerequisites | [Zscaler supports only SCIM version 2.0, and SAML must be the authentication method to use SCIM for provisioning.](kb:zia.scim.setup:scim2-and-saml), [When creating users, the domain in the username must be preregistered with Zscaler; for test@safemarch.com, safemarch.com must be registered to the tenant, and Zscaler Support can assist.](kb:zia.scim.setup:domain-preregistered) | [Private Access works with any IdP that supports the SCIM standard, SailPoint being one example, and the IdP set up for SAML authentication is most often the one used for SCIM.](kb:zpa.scim.attributes-and-groups:any-idp), [Currently only the username is a required attribute and the only unique attribute, and the SCIM username attribute must match nameID in the SAML attribute.](kb:zpa.scim.attributes-and-groups:required-unique) |
| active=false | [When active=false is sent for a user, Zscaler disables the user; when active=true, Zscaler enables the user.](kb:zia.scim.deactivation:active-flag) | [In ZPA, active=false deletes the user, so the same IdP action is reversible in ZIA and destructive in ZPA.](kb:zia.scim.deactivation:zpa-deletes), [With Okta as the IdP, users are not deleted but deactivated, and deactivated users can no longer access private applications.](kb:zpa.scim.group-lifecycle:okta-deactivates) |
| Attributes | [ZIA maps these SCIM user attributes: id to a Zscaler-generated unique ID; externalId to scim_externalid; userName to the user ID (login_name) in user@domain form; displayName to the display name (user_name); groups to Groups; active to enabled or disabled; department to Department; name.givenName and name.familyName to first and last name; emails.value to scim_emails.](kb:zia.scim.attribute-mapping:user-fields), [ZIA's SCIM name attributes use the singular prefix name. (name.givenName, name.familyName); the ZPA mapping uses names.givenName.](kb:zia.scim.attribute-mapping:name-prefix) | [The supported SCIM attributes are active, costCenter, department, displayName, division, emails.value, names.givenName, name.formatted, name.familyName, a Zscaler-generated id, organization, title, userName and userType.](kb:zpa.scim.attributes-and-groups:supported-attributes), [The SCIM group and SCIM attribute API resources are described as allowing you to read them, the SCIM Attributes page is a read-only table, and Private Access does not support custom SCIM attributes; SCIM groups are pulled in from the IdP when SCIM is enabled.](kb:zpa.scim.attributes-and-groups:read-only-objects) |
| Groups and limits | [How SCIM groups and departments land in ZIA](kb:zia.scim.groups-and-departments), [Zscaler SCIM servers have a rate limit of 5 requests per second, and applications should be configured to comply to avoid retries.](kb:zia.scim.operations:rate-limit) | [Private Access syncs at most 1,000 groups per user, leaving the rest unsynced until some are removed for that user in the IdP, with no limit on the number of SCIM groups synced, and lists a limit of 50 SCIM updates per second.](kb:zpa.scim.provisioning-timing:group-limits), [A SCIM group criterion is an operand with object_type SCIM_GROUP whose lhs is the IdP's ID (the zpa_idp_controller id) and whose rhs is the SCIM group's ID (the zpa_scim_groups id); the v1 resources set them as lhs and rhs, and the v2 resources as an entry_values pair.](kb:zpa.scim.policy-criteria:scim-group-operand) |
| How fast changes land | [With SCIM, users and groups are provisioned through APIs. There is no wait for synchronization intervals or for the user to log in, a group or department change updates the Zscaler user database in near real time, and no inbound connection from Zscaler to the customer's directory or network is required.](kb:zia.scim.propagation:push-near-real-time) | [It can take several days for the IdP to sync all user information to ZPA completely.](kb:zpa.scim.provisioning-timing:several-days), [Zscaler recommends waiting a minimum of 48 hours, sometimes up to a week, after SCIM sync is enabled before enabling SCIM policies.](kb:zpa.policy.scim-sync:scim-wait-48-hours) |
| Client authentication | [SCIM clients authenticate with a unique alphanumeric bearer token, copied from the identity provider's Edit IdP window in the Zscaler Admin Console and needed when configuring the IdP for SCIM provisioning. Generate Token issues a new one, and the IdP must then be updated with it. The informational calls /Schemas, /ServiceProviderConfig and /ResourceTypes need no authentication.](kb:zia.scim.setup:bearer-token) | [The IdP object carries scimEnabled, enableScimBasedPolicy, disableSamlBasedPolicy, scimServiceProviderEndpoint and scimSharedSecretExists.](kb:zpa.scim.policy-criteria:idp-flags), [The Go SCIM client always sends Content-Type application/scim+json and a bearer token, a different client from the one that sends application/json to the ZPA management API.](kb:zpa.api.idp-scim-wire:scim-requests-use-scim-json) |
| SDKs | [What the Go and Python SDKs do for ZIA SCIM](kb:zia.scim.sdk-coverage) | [The SCIM API, SDK and Terraform read surface in ZPA](kb:zpa.scim.api-surface), [IdP, SCIM and SAML attribute API: wire keys, types and the Go SCIM client](kb:zpa.api.idp-scim-wire) |
| First sync with Okta | Not documented | [When SCIM sync is enabled with Okta, users may see a connection error in Zscaler Client Connector because Okta had not synced users to Private Access before SCIM was enabled; Zscaler recommends enabling PROVISION_OUT_OF_SYNC_USERS in Okta and unassigning and reassigning all users and groups from Zscaler Private Access in Okta, then waiting for the sync.](kb:zpa.scim.provisioning-timing:okta-first-enable) |

**SAML beside SCIM.** In ZIA, SAML auto-provisioning is to be disabled when SCIM is enabled for the IdP: [SAML auto-provisioning is to be disabled when SCIM provisioning is enabled for an IdP.](kb:zia.ad-integration.saml-auto-provisioning:scim-excludes). Whether a session links to a SCIM user only when userName equals the SAML nameID is open in ZIA: [Whether userName must equal the SAML nameID to link a session to a SCIM-provisioned user](kb:zia.ad-integration.saml-auto-provisioning:username-nameid-link). What happens when an IdP changes a user's userName and nameID is open [gap:shared.scim:username-change].

**Ordering and nesting.** Whether a user pushed before its group keeps the membership is open [gap:shared.scim:group-user-order], as is how nested groups are treated [gap:shared.scim:nested-groups].

**Deprovisioning.** Whether disabling or deleting a user revokes tokens the user holds is open: [Whether SCIM disable or delete revokes tokens the user already holds](kb:zia.scim.deactivation:token-revocation). What a ZPA user loses when deleted through active=false and later re-created is open [gap:shared.scim:zpa-recreate-loses-settings].

**IdP differences.** How each IdP populates SCIM fields and how often it pushes is not consolidated [gap:shared.scim:per-idp-quirks]; the ZIA cadence question is held in [How fast SCIM changes reach ZIA](kb:zia.scim.propagation).

What to check:
1. Which product the user or group is missing from, and whether the IdP sent active=false or a delete, since ZIA disables while ZPA deletes.
2. For ZPA, whether the initial sync has had time to complete before SCIM criteria are used.
3. Whether the user exceeds a group limit (ZIA per-user cap, ZPA 1,000 groups per user).
4. Whether a ZIA username's domain is registered to the tenant.

Not known (open gaps):
- What happens when an IdP changes a user's userName [gap:shared.scim:username-change]: settled by lab-test. Blocks: diagnosing a renamed user who stops matching policy
- A user pushed with a group that does not exist yet [gap:shared.scim:group-user-order]: settled by lab-test
- How ZIA and ZPA treat nested SCIM groups [gap:shared.scim:nested-groups]: settled by lab-test or support-ticket
- What a ZPA user re-created after a SCIM delete loses [gap:shared.scim:zpa-recreate-loses-settings]: settled by lab-test
- Per-IdP SCIM attribute mapping and push cadence [gap:shared.scim:per-idp-quirks]: settled by source-read

Area: shared.scim, its subjects in references/_meta/spine/shared/shared.scim.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.scim.attributes-and-groups.md (SCIM attributes and groups in Private Access)
- links-to references/_meta/text/zia/zia.scim.deactivation.md (What SCIM does when a user is disabled or deleted)
- links-to references/_meta/text/zia/zia.scim.setup.md (Enabling ZIA SCIM: prerequisites, base URL and token)
- links-to references/_meta/text/zpa/zpa.scim.provisioning-timing.md (When SCIM data is ready for ZPA policy)
- links-to references/_meta/text/zia/zia.ad-integration.saml-auto-provisioning.md (SAML auto-provisioning: what login creates and overwrites)
- links-to references/_meta/text/zia/zia.scim.attribute-mapping.md (ZIA SCIM attribute mapping)
- links-to references/_meta/text/zia/zia.scim.propagation.md (How fast SCIM changes reach ZIA)
- links-to references/_meta/text/zpa/zpa.api.idp-scim-wire.md (IdP, SCIM and SAML attribute API: wire keys, types and the Go SCIM client)
- links-to references/_meta/text/zpa/zpa.scim.policy-criteria.md (SCIM groups and attributes as ZPA policy criteria)
- links-to references/_meta/text/zia/zia.scim.groups-and-departments.md (How SCIM groups and departments land in ZIA)
- links-to references/_meta/text/zia/zia.scim.operations.md (ZIA SCIM server operations, paging and rate limit)
- links-to references/_meta/text/zia/zia.scim.sdk-coverage.md (What the Go and Python SDKs do for ZIA SCIM)
- links-to references/_meta/text/zpa/zpa.policy.scim-sync.md (SCIM sync timing before SCIM criteria are used)
- links-to references/_meta/text/zpa/zpa.scim.md (ZPA SCIM groups and attributes in policy)
- links-to references/_meta/text/zpa/zpa.scim.api-surface.md (The SCIM API, SDK and Terraform read surface in ZPA)
- links-to references/_meta/text/zpa/zpa.scim.group-lifecycle.md (What happens when SCIM users and groups are deleted or renamed)

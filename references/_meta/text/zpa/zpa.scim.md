# ZPA SCIM groups and attributes in policy (zpa.scim)
Also called: zpa scim; scim policy; scim groups ZPA; idp scim access decision; scim_group; scim attribute policy; scim policy mapping

"Why did a SCIM-based ZPA rule allow or deny this user?" takes five questions in order.

1. **What is synced?** Supported attributes, groups and what cannot be authored: [SCIM attributes and groups in Private Access](kb:zpa.scim.attributes-and-groups).
2. **Is the data there yet?** First sync, the wait before enabling SCIM policy and limits: [When SCIM data is ready for ZPA policy](kb:zpa.scim.provisioning-timing).
3. **How does the rule use it?** Operands, the IdP setting that switches SCIM criteria on, IdP scoping and rule families: [SCIM groups and attributes as ZPA policy criteria](kb:zpa.scim.policy-criteria).
4. **What changed in the IdP?** Deleted users and groups and renames: [What happens when SCIM users and groups are deleted or renamed](kb:zpa.scim.group-lifecycle).
5. **What do the API and tooling show?** Endpoints, fields, SDKs and data sources: [The SCIM API, SDK and Terraform read surface in ZPA](kb:zpa.scim.api-surface).

Switching SCIM on, the endpoint, token and IdP guides are in [Enabling SCIM for Private Access: endpoint, token, policy setting and IdP guides](kb:zpa.scim.setup); the SCIM server API that custom clients call is in [The Private Access SCIM server API: operations, paging and request rules](kb:zpa.scim.server-operations); and the log of operations between the IdP and the SCIM service is in [SCIM Sync Logs in Private Access](kb:zpa.scim.sync-logs).

SAML attributes are in [ZPA SAML attributes](kb:zpa.saml-attributes). ZIA SCIM is in [ZIA SCIM provisioning](kb:zia.scim), the contrast on deactivation is in [What SCIM does when a user is disabled or deleted](kb:zia.scim.deactivation), and the shared mechanics are in the general [SCIM provisioning across ZIA and ZPA: where the two differ](kb:shared.scim) reference.

Area: zpa.scim, its subjects in references/_meta/spine/zpa/zpa.scim.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.scim.provisioning-timing.md (When SCIM data is ready for ZPA policy): It can take several days for the IdP to sync all user information to ZPA completely. [zpa.scim.provisioning-timing:several-days]
- links-to references/_meta/text/shared/shared.scim.md (SCIM provisioning across ZIA and ZPA: where the two differ)
- links-to references/_meta/text/zia/zia.scim.md (ZIA SCIM provisioning)
- links-to references/_meta/text/zia/zia.scim.deactivation.md (What SCIM does when a user is disabled or deleted)
- links-to references/_meta/text/zpa/zpa.saml-attributes.md (ZPA SAML attributes)
- links-to references/_meta/text/zpa/zpa.scim.api-surface.md (The SCIM API, SDK and Terraform read surface in ZPA)
- links-to references/_meta/text/zpa/zpa.scim.attributes-and-groups.md (SCIM attributes and groups in Private Access)
- links-to references/_meta/text/zpa/zpa.scim.group-lifecycle.md (What happens when SCIM users and groups are deleted or renamed)
- links-to references/_meta/text/zpa/zpa.scim.policy-criteria.md (SCIM groups and attributes as ZPA policy criteria)
- links-to references/_meta/text/zpa/zpa.scim.server-operations.md (The Private Access SCIM server API: operations, paging and request rules)
- links-to references/_meta/text/zpa/zpa.scim.setup.md (Enabling SCIM for Private Access: endpoint, token, policy setting and IdP guides)
- links-to references/_meta/text/zpa/zpa.scim.sync-logs.md (SCIM Sync Logs in Private Access)

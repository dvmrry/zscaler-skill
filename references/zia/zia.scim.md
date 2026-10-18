"The user is in the IdP but not in ZIA policy" or "the group is missing from the rule" has a short list of places to look. {{purpose}}

1. **Is SCIM actually enabled for this IdP, with the right prerequisites?** [[zia.scim.setup]].
2. **Did the attribute the rule needs get sent and mapped?** [[zia.scim.attribute-mapping]].
3. **Did the group or department land as the object the rule references?** [[zia.scim.groups-and-departments]].
4. **Is the client within the server's operations and limits?** Endpoints, filters, paging and the rate limit: [[zia.scim.operations]].
5. **What does disabling or deleting do?** [[zia.scim.deactivation]].
6. **How quickly does a change show up?** [[zia.scim.propagation]].
7. **Is the problem the Go or Python client rather than the service?** [[zia.scim.sdk-coverage]].

The shared SCIM protocol mechanics are in [shared SCIM provisioning](../shared/scim-provisioning.md), and the ZPA side is in [ZPA SCIM policy mapping](../zpa/scim-policy-mapping.md). Provisioning choices around SCIM (the alternatives, the directory-sync migration) are in [[zia.ad-integration.provisioning-methods]]. What SAML does to the same users is in [[zia.ad-integration.saml-auto-provisioning]]. The migration flag is in [[zia.authentication.settings:scim-migration-flag]].

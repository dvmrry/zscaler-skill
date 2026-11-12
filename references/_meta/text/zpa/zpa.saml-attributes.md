# ZPA SAML attributes (zpa.saml-attributes)
Also called: saml attributes; zpa saml attribute; idp attribute mapping; session attributes; saml attribute policy

"Why does a SAML criterion not match?" takes three questions in order.

1. **Is the attribute registered, and under which IdP?** Registration, fields, the limit and the Authentication Service replacement are in [Registering SAML attributes in Private Access](kb:zpa.saml-attributes.registration).
2. **How does the rule use it?** IdP selection, operators, the IdP setting that switches SAML criteria on and the Terraform form are in [How SAML attributes act as policy criteria](kb:zpa.saml-attributes.policy-criteria).
3. **What does the API or tooling see?** Endpoints, fields, write support and the data source are in [The SAML attribute API, SDK and Terraform surface](kb:zpa.saml-attributes.api-surface).

SCIM attributes and groups are in [ZPA SCIM groups and attributes in policy](kb:zpa.scim); ZIA's SCIM attribute mapping is in [ZIA SCIM attribute mapping](kb:zia.scim.attribute-mapping).

Area: zpa.saml-attributes, its subjects in references/_meta/spine/zpa/zpa.saml-attributes.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.saml-attributes.registration.md (Registering SAML attributes in Private Access): SAML attributes must be configured in the Admin Console before they can be used as policy rule criteria. [zpa.saml-attributes.registration:configure-first]
- links-to references/_meta/text/zia/zia.scim.attribute-mapping.md (ZIA SCIM attribute mapping)
- links-to references/_meta/text/zpa/zpa.saml-attributes.api-surface.md (The SAML attribute API, SDK and Terraform surface)
- links-to references/_meta/text/zpa/zpa.saml-attributes.policy-criteria.md (How SAML attributes act as policy criteria)
- links-to references/_meta/text/zpa/zpa.scim.md (ZPA SCIM groups and attributes in policy)

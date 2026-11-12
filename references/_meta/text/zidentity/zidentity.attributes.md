# User and session attributes in Authentication Service: system-defined sets, custom attributes, device-attribute values and where each is used (zidentity.attributes)
Also called: user attributes; session attributes; custom attributes; system-defined attributes; is_device_managed; is_device_compliant; is_device_domain_joined

Authentication Service has two attribute sets, user attributes and session attributes. Authentication Service supports user attributes and session attributes, needed to configure SAML-based SSO access for users; for both, custom attributes can be defined beside the system-defined ones. [zidentity.attributes:two-kinds]

**System-defined sets.** The About Attributes page says there are by default 14 system-defined user attributes (displayname, firstname, lastname, nickname, primaryemail, department, organization, title, division, costcenter, usertype, formattedname, manager, addresses) and 6 session attributes (created_at, last_authenticated_at, identity_provider, is_device_managed, is_device_compliant, is_device_domain_joined). [zidentity.attributes:system-defined] How many user attributes count as system-defined differs between pages [divergence:zidentity.attributes:system-defined-count]. Each user attribute shows its data type, whether it is required, and its origin (system-defined or user-defined); system-defined attributes cannot be edited or deleted. [zidentity.attributes:attribute-columns]

**Where they are used.** User attributes are used in ZIA and ZPA policies and, with an external IdP, for JIT and SCIM provisioning; session attributes are used in Internet & SaaS Identity Proxy and Private Access policies. [zidentity.attributes:uses] SCIM's attribute table is in [The Authentication Service SCIM server: operations, attribute mapping, authentication and rate limits](kb:zidentity.users.provisioning.scim) and the IdP-side mapping in [Configuring an external IdP in Authentication Service: domains, login ID attribute, OIDC and SAML fields, admin MFA enforcement, signing certificates and IdP-initiated sign-in](kb:zidentity.overview.external-idps.configuration). How user attributes reach ZIA policy is open [gap:zidentity.attributes:zia-policy-use].

**Adding user attributes.** Up to 128 user attributes can be added, singly or by CSV import. [zidentity.attributes:user-attribute-limit] A user attribute has an attribute name (the name to be mapped to an external IdP, such as Manager or Organization), a data type (String, Integer, Boolean, Date or Decimal) and an Attribute Required option that makes the value mandatory when adding a user. [zidentity.attributes:user-attribute-fields] On a user attribute CSV import, Override Existing Entries replaces the existing list of user attributes. [zidentity.attributes:user-attribute-csv-override] The CSV format and the attribute-name syntax are open [gap:zidentity.attributes:csv-and-name-syntax].

**Session attributes.** A session attribute can be used only when the user is authenticated by an IdP, and it must be selected in the IdP configuration to be passed to Zscaler services during authentication. [zidentity.attributes:session-needs-idp] Session attributes, system-defined or custom, that are mapped to IdP attributes are sent to Zscaler services such as ZIA and ZPA with the values received from the external IdP in SAML assertions or OIDC tokens. [zidentity.attributes:session-values-from-idp] Session attributes are equivalent to the SAML attributes Private Access supports when a Private Access tenant is linked with Authentication Service for admins and users; session attributes created in Authentication Service are used in Private Access access policies, and the system-defined device attributes (is_device_managed, is_device_compliant, is_device_domain_joined) in Internet & SaaS Identity Proxies. [zidentity.attributes:session-zpa-zia-use] For the system-defined device attributes, Authentication Service accepts True, true, TRUE, 1, Trusted, trusted and TRUSTED from the external IdP, sending true to Zscaler services when the received value matches and false otherwise. [zidentity.attributes:device-attribute-values] Configuring an identity proxy for cloud apps requires mapping is_device_managed to an IdP attribute and then configuring the managed devices settings in Internet & SaaS. [zidentity.attributes:identity-proxy-mapping] A session attribute has a data type (String, Integer, Boolean, Date or Decimal); a CSV import of session attributes adds them to the existing list and shows them on the Attributes page. [zidentity.attributes:session-attribute-fields] Whether session attributes share the user attribute limit is open [gap:zidentity.attributes:session-attribute-limit].

What to check:
1. Whether a session attribute is selected in the IdP configuration and the user was authenticated by an IdP, since it is passed only then.
2. Which list of system-defined user attributes an answer relies on, since About Attributes and the SCIM table differ.

Sources disagree (name both sides):
- How many user attributes are system-defined: About Attributes says 14 and lists them, while the Understanding SCIM table of system-defined user attributes has rows that are not among the 14. [divergence:zidentity.attributes:system-defined-count]
  - zscaler-help: There are 14 system-defined user attributes, listed on the page.
  - zscaler-help: The SCIM table of system-defined user attributes includes Middle Name, Mobile Phone and TIME ZONE, which are not among About Attributes' 14.
  Impact: An answer that quotes 14 leaves out attributes the SCIM page treats as system-defined; which list a tenant's Attributes page shows is not stated.

Not known (open gaps):
- The attribute CSV format and the attribute-name syntax [gap:zidentity.attributes:csv-and-name-syntax]: settled by source-read or lab-test. Blocks: building an attribute import file
- Whether session attributes share the 128-attribute limit [gap:zidentity.attributes:session-attribute-limit]: settled by source-read or lab-test. Blocks: planning a large set of session attributes
- How user attributes reach ZIA policy [gap:zidentity.attributes:zia-policy-use]: settled by source-read or lab-test. Blocks: writing a ZIA rule on a custom user attribute

Area: zidentity.attributes, its subjects in references/_meta/spine/zidentity/zidentity.attributes.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zidentity/zidentity.overview.external-idps.configuration.md (Configuring an external IdP in Authentication Service: domains, login ID attribute, OIDC and SAML fields, admin MFA enforcement, signing certificates and IdP-initiated sign-in)
- links-to references/_meta/text/zidentity/zidentity.users.provisioning.scim.md (The Authentication Service SCIM server: operations, attribute mapping, authentication and rate limits)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zidentity/zidentity.overview.md (What ZIdentity (Authentication Service) is, and where each part of it is covered)
- see-also references/_meta/text/zidentity/zidentity.users.md (Authentication Service users: where they come from, status, bulk actions and admin-side actions)
- see-also references/_meta/text/zidentity/zidentity.users.provisioning.md (Getting users into and out of Authentication Service: JIT, SCIM, and what IdP removals do to admins)
- see-also references/_meta/text/zpa/zpa.saml-attributes.md (ZPA SAML attributes)

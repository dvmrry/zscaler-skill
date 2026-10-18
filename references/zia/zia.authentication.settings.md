Everything organization-wide about how users authenticate sits in one object. {{org-object}}

**Values.** {{enum-values}} The older legacy API page lists different names for the same fields {{divergence:enum-vocabulary}}, and the legacy KB doc, the legacy API page and the OpenAPI document give different orgAuthType values {{divergence:org-auth-type-vocabulary}}. The frequency field is covered in [[zia.authentication.frequency]].

**What depends on what.** {{ldap-and-saml-completeness}} {{hosted-db-only}} {{one-time-auth}}

**Fields that bite.** {{kerberos-pwd-read-only}} {{auto-provision}} {{scim-migration-flag}} For the SCIM side see [[zia.scim]].

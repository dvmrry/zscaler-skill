Everything organization-wide about how users authenticate sits in one object. {{org-object}}

**Values.** {{enum-values}} The older legacy API page lists different names for the same fields (see the divergence below); the frequency field has the same problem and is covered in [[zia.authentication.frequency]].

**What depends on what.** {{ldap-and-saml-completeness}} {{hosted-db-only}} {{one-time-auth}}

**Fields that bite.** {{kerberos-pwd-read-only}} {{auto-provision}} {{scim-migration-flag}} For the SCIM side see [[zia.scim]].

What to check: the exact value names against the spec (not the older page), and whether the field you are setting is read-only.

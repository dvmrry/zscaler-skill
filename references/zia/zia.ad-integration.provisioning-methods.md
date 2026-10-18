Provisioning (getting users into the Zscaler database) and authentication (identifying traffic) are separate choices, but not independent ones. {{five-methods}} {{recommendation}}

**Pairing.** {{auth-pairing}}

**Directory synchronization.** {{directory-sync-needs-reach}} What it does once connected is in [[zia.ad-integration.directory-sync]].

**ZAB.** {{zab-outbound}} {{zab-exclusions}}

**SAML and SCIM** are covered in [[zia.ad-integration.saml-auto-provisioning]] and [[zia.scim]]. The org-level migration switch from directory sync to SCIM is [[zia.authentication.settings:scim-migration-flag]], with its reversibility question open in [[zia.authentication.settings]].

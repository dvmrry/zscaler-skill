Provisioning (getting users into the Zscaler database) and authentication (identifying traffic) are separate choices, but not independent ones. {{five-methods}} {{recommendation}}

The pairing is the constraint to check first when a tenant "wants SAML but has directory sync" or the reverse. {{auth-pairing}} So a tenant that provisions by SCIM authenticates with SAML and nothing else, while the combinations an operator might assume (Kerberos with directory sync) are not offered by the pairing table.

**Directory synchronization.** {{directory-sync-needs-reach}} What it does once connected is in [[zia.ad-integration.directory-sync]].

**ZAB.** {{zab-outbound}} {{zab-exclusions}} That exclusion matters when planning a move from the ZAB to SCIM: it is a cutover, not an overlap.

**SAML and SCIM** are covered in [[zia.ad-integration.saml-auto-provisioning]] and [[zia.scim]]. The org-level migration switch from directory sync to SCIM is [[zia.authentication.settings:scim-migration-flag]], with its reversibility question open in [[zia.authentication.settings]].

What to check: which method the tenant actually provisions with (the Identity Providers and directory settings in the Admin Console), and whether the authentication method in use is one the pairing allows.

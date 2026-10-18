SAML can do more than authenticate: with auto-provisioning on it also writes the user database. {{create-update}} That overwrite-and-remove behavior so a tenant should not run SAML auto-provisioning and SCIM against the same users: {{scim-excludes}}

What the assertion can carry is narrower than in ZPA. {{response-limits}} {{attribute-scope}} A policy requirement for an attribute beyond identity, group and department cannot be met from the ZIA assertion alone.

The org-level switch is [[zia.authentication.settings:auto-provision]], and the SAML service-provider and IdP reachability points are in [[zia.authentication.methods]].

Three questions in the legacy guidance stay open and are recorded as gaps rather than answers: which source wins when SCIM and SAML disagree, whether the SCIM userName must equal the SAML nameID, and whether SAML ever removes a user.

What to check: whether auto-provisioning is on for the IdP, what the IdP actually puts in the response, and whether SCIM is also enabled on the same IdP.

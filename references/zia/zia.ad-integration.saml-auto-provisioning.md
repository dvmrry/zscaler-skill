SAML auto-provisioning also writes the user database. {{create-update}} {{scim-excludes}}

{{response-limits}} {{attribute-scope}}

The org-level switch is [[zia.authentication.settings:auto-provision]], and the SAML service-provider and IdP reachability points are in [[zia.authentication.methods]].

Which source wins when SCIM and SAML disagree is open {{gap:scim-vs-saml-precedence}}, whether the SCIM userName must equal the SAML nameID is open {{gap:username-nameid-link}}, and whether SAML ever removes a user is open {{gap:saml-deprovisioning}}.

Authentication method decides how a request gets an identity; whether it is demanded at all is [[zia.authentication.location-enforcement]].

**SAML.** {{saml-sp}} {{saml-idp-reachability}} Org-level SAML switches (samlEnabled, autoProvision) are in [[zia.authentication.settings]].

**Kerberos.** {{kerberos-no-cookie}} {{kerberos-explicit-only}} {{kerberos-clients}} {{kerberos-network}} The per-location Kerberos switch is in [[zia.authentication.location-enforcement]].

Hosted DB (form-based login with the service's own users) is the third method; its password fields are in [[zia.authentication.settings]]. Which method tenants favour is open {{gap:deployment-defaults}}.

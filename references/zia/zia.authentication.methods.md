Authentication method decides how a request gets an identity; whether it is demanded at all is [[zia.authentication.location-enforcement]].

**SAML.** {{saml-sp}} {{saml-idp-reachability}} The IdP itself has to be reachable without the identity it is about to issue. Org-level SAML switches (samlEnabled, autoProvision) are in [[zia.authentication.settings]].

**Kerberos.** {{kerberos-no-cookie}} {{kerberos-explicit-only}} That second limit matters when the fix for a non-browser client is "use Kerberos": it works only if that client's traffic is explicitly forwarded through a PAC file. {{kerberos-clients}} {{kerberos-network}} The per-location Kerberos switch is in [[zia.authentication.location-enforcement]].

Hosted DB (form-based login with the service's own users) is the third method; its password fields are in [[zia.authentication.settings]]. Which method tenants favour is not documented, so the gap below records the old guidance rather than asserting it.

What to check: how the failing traffic is forwarded (PAC or tunnel), whether the IdP host is exempted on that path, and whether a cookie was present on the request.

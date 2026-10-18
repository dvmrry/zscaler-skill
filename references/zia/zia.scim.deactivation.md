"We disabled the user in the IdP, why can they still browse?" starts with which SCIM action the IdP really sends. {{active-flag}} {{delete-removes}}

{{zpa-deletes}} Directory synchronization behaves differently again: users removed from the directory are deactivated and have their cookies invalidated, see [[zia.ad-integration.directory-sync]].

Whether a live session survives a disable is open {{gap:session-kill}}, and whether tokens or SAML sessions already issued are revoked is open {{gap:token-revocation}}.

The verbs and endpoints are in [[zia.scim.operations]]; how soon the IdP's change arrives at all is in [[zia.scim.propagation]].

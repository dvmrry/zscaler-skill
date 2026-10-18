"We disabled the user in the IdP, why can they still browse?" starts with which SCIM action the IdP really sends. {{active-flag}} {{delete-removes}}

The contrast with ZPA is what trips tenants running one connector against both products. {{zpa-deletes}} Directory synchronization behaves differently again: users removed from the directory are deactivated and have their cookies invalidated, see [[zia.ad-integration.directory-sync]].

What is not known is how soon a disable bites. Whether a live session survives, and whether tokens or SAML sessions already issued are revoked, are recorded as open questions; until they are settled, do not describe SCIM disable as an immediate access kill.

The verbs and endpoints are in [[zia.scim.operations]]; how soon the IdP's change arrives at all is in [[zia.scim.propagation]].

What to check: whether the IdP sent active=false or a DELETE, whether the push reached ZIA, and, for urgent revocation, the separate session and token controls rather than SCIM alone.

"The group changed in the IdP, how long until ZIA policy sees it?" {{push-near-real-time}} {{no-zia-side-pull}}

That is the practical advantage over directory sync, where a change waits for the next synchronization, see [[zia.ad-integration.directory-sync]]. It also means the cadence is not a ZIA property: per-IdP timing and ZIA-side error visibility are not documented here, and are recorded as open questions.

A large first push is limited by the server's request rate, see [[zia.scim.operations]]. If SAML auto-provisioning is also writing the same users, which source wins is open in [[zia.ad-integration.saml-auto-provisioning]].

What to check: when the IdP last pushed that user or group, the IdP's own provisioning log for rejected requests, and whether the change was in the connector's scope.

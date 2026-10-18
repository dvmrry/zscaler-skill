"The group changed in the IdP, how long until ZIA policy sees it?" {{push-near-real-time}} {{no-zia-side-pull}}

Directory synchronization, by contrast, waits for the next synchronization, see [[zia.ad-integration.directory-sync]]. How often each IdP pushes group and membership changes is open {{gap:per-idp-cadence}}, and whether ZIA shows SCIM sync errors is open {{gap:sync-log-visibility}}.

A large first push is limited by the server's request rate, see [[zia.scim.operations]]. If SAML auto-provisioning also writes the same users, which source wins is open [[zia.ad-integration.saml-auto-provisioning:scim-vs-saml-precedence]].

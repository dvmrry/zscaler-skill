# Access policies for federated applications (zpa.b2b-federation.access-policy)
Also called: defined by partners; defined by my tenant; guest partner access policy; federated application criteria; federated access policy criteria; partner policy rules

The host owns the application and the guest writes the rules that govern its users.

**Ownership.** Federated applications are the defined application segments created, owned and managed by the host partner and shared with guest partners. [zpa.b2b-federation.access-policy:federated-apps-ownership]

**Where rules appear.** The Defined by Partners page lists policy rules created by the guest partner for the host partner's applications, and the Defined by My Tenant page lists rules defined by the host partner for internal applications and users. [zpa.b2b-federation.access-policy:partner-vs-tenant-pages] Defined-by-partners policies give the host partner visibility into how guest partners configured access policies on its hosted applications, without managing them directly. [zpa.b2b-federation.access-policy:host-visibility-only] A partner-defined rule shows its action as Allow Access, Block Access or Require Approval. [zpa.b2b-federation.access-policy:rule-actions]

**Criteria.** Federated access policies support only these criteria for the guest partner: Client Type (only Client Connector), Client Connector Posture Profiles, Country Codes, Locations, Machine Groups, Platforms, Risk Scores, SAML and SCIM Attributes, and Trusted Networks. [zpa.b2b-federation.access-policy:guest-criteria-limited] If an access policy rule contains a federated application or a federated partner that no longer exists, an inconsistency occurs with the rule criteria and the rule must be deleted to proceed. [zpa.b2b-federation.access-policy:deleted-reference-inconsistency] The route that returns partner rules is in [B2B Federation API routes](kb:zpa.b2b-federation.api-routes).

What to check:
1. Whether the guest partner's rule uses only the criteria federated access policies support.
2. Whether the host looked at Defined by Partners or Defined by My Tenant, and that the host views but does not manage guest rules.
3. Whether a rule still references a federated application or partner that no longer exists.

Area: zpa.b2b-federation, its subjects in references/_meta/spine/zpa/zpa.b2b-federation.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.b2b-federation.federate-applications.md (Federating application segments to a partner): Federated applications are the defined application segments created, owned and managed by the host partner and shared with guest partners. [zpa.b2b-federation.access-policy:federated-apps-ownership]
- depends-on references/_meta/text/zpa/zpa.b2b-federation.prerequisites.md (B2B Federation prerequisites and limits), from zpa.b2b-federation: B2B Federation is in limited availability and requires a Private Access (ZPA) Federation license. [zpa.b2b-federation.prerequisites:limited-availability-license]
- depends-on references/_meta/text/zpa/zpa.b2b-federation.trust-workflow.md (B2B Federation trust workflow and statuses), from zpa.b2b-federation: The console process has three steps: generate an access token and share it with the partner, verify the token and send an approval request to the partner, then approve the federation request. [zpa.b2b-federation.trust-workflow:three-steps]
- interacts-with references/_meta/text/zpa/zpa.microtenants.api-scoping.md (How an API call selects a Microtenant), from zpa.b2b-federation: The ZPA API reference for the application federation and tenant federation operations (`application/federate`, `application/host/{host_id}` and the `tenant-federation` paths) says that if you are within a Microtenant you must pass `microtenantId` to retrieve that Microtenant's data, and that a create or update that omits it takes effect in the Default Microtenant. [zpa.microtenants.api-scoping:omitted-scope-defaults-default]
- links-to references/_meta/text/zpa/zpa.b2b-federation.api-routes.md (B2B Federation API routes)

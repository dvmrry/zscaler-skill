# B2B Federation prerequisites and limits (zpa.b2b-federation.prerequisites)
Also called: b2b federation license; b2b federation requirements; federation limited availability; federation same cloud; federate application permission; partner permission; b2b federation client connector version; federation partner limit

Federation needs both tenants to meet the same list before any trust step works.

**Licensing and availability.** B2B Federation is in limited availability and requires a Private Access (ZPA) Federation license. [zpa.b2b-federation.prerequisites:limited-availability-license] Both the host and guest partners must have a Private Access tenant, complete migration to Authentication Service for admins, and have Zscaler Experience Center enabled; both need an active Private Access license, but only the host partner needs a Federation license to share applications. [zpa.b2b-federation.prerequisites:both-partners-requirements]

**Roles.** The host partner is the partner that owns the private applications, and the guest partner is the partner that requires access to them. [zpa.b2b-federation.prerequisites:partner-definitions] Both partners' admin roles need the Partner permission, and the host partner's admin role also needs the Federate Application permission. [zpa.b2b-federation.prerequisites:admin-roles]

**Cloud.** Both the host and guest partners must originate from the same cloud. [zpa.b2b-federation.prerequisites:same-cloud]

**Versions.** App Connectors and Private Service Edges must be upgraded to version 24.298.1 or later. [zpa.b2b-federation.prerequisites:component-versions] Zscaler Client Connector must be at Windows 4.7.0.88 or 4.6.0.282 or later, macOS 4.5.2.98, Android 3.10, Linux 4.2 or iOS 4.4.1, and Use Tunnel SDK version 4.3 or above must be enabled in the Client Connector Portal. [zpa.b2b-federation.prerequisites:client-connector-versions]

**Limits.** The ranges and limitations article allows 1,000 federated applications and 25 partners for B2B Federation, and Zscaler Support can upgrade those limits. [zpa.b2b-federation.prerequisites:limits] The next stage is [B2B Federation trust workflow and statuses](kb:zpa.b2b-federation.trust-workflow).

What to check:
1. Whether both tenants hold the licenses, roles and Experience Center and Authentication Service setup before testing the trust steps.
2. Whether the two tenants are on the same cloud.
3. The App Connector, Private Service Edge and Client Connector versions against the minimums.
4. The partner and federated application counts against the limits.

Area: zpa.b2b-federation, its subjects in references/_meta/spine/zpa/zpa.b2b-federation.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.b2b-federation.trust-workflow.md (B2B Federation trust workflow and statuses), from zpa.b2b-federation: The console process has three steps: generate an access token and share it with the partner, verify the token and send an approval request to the partner, then approve the federation request. [zpa.b2b-federation.trust-workflow:three-steps]
- decided-by references/_meta/text/zpa/zpa.b2b-federation.access-policy.md (Access policies for federated applications), from zpa.b2b-federation: Federated access policies support only these criteria for the guest partner: Client Type (only Client Connector), Client Connector Posture Profiles, Country Codes, Locations, Machine Groups, Platforms, Risk Scores, SAML and SCIM Attributes, and Trusted Networks. [zpa.b2b-federation.access-policy:guest-criteria-limited]
- scoped-by references/_meta/text/zpa/zpa.b2b-federation.federate-applications.md (Federating application segments to a partner), from zpa.b2b-federation: On the Defined Application Segments page the host selects a segment's Federate Application icon, selects one or more partners to share with, and saves. [zpa.b2b-federation.federate-applications:federate-flow]
- interacts-with references/_meta/text/zpa/zpa.microtenants.api-scoping.md (How an API call selects a Microtenant), from zpa.b2b-federation: The ZPA API reference for the application federation and tenant federation operations (`application/federate`, `application/host/{host_id}` and the `tenant-federation` paths) says that if you are within a Microtenant you must pass `microtenantId` to retrieve that Microtenant's data, and that a create or update that omits it takes effect in the Default Microtenant. [zpa.microtenants.api-scoping:omitted-scope-defaults-default]

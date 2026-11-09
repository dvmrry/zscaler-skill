# ZPA Business-to-Business Federation (zpa.b2b-federation)
Also called: b2b federation; business-to-business federation; zpa federation; federated partners; host partner guest partner; partner federation; tenant federation; federate application

B2B Federation questions split by stage, and each stage has a different source.

1. **Can the tenants federate at all?** The license, roles, cloud and version prerequisites and the documented limits: [B2B Federation prerequisites and limits](kb:zpa.b2b-federation.prerequisites).
2. **How is trust established and what state is it in?** Token, verification, approval and the status values: [B2B Federation trust workflow and statuses](kb:zpa.b2b-federation.trust-workflow).
3. **What can be shared with a partner?** Federating application segments and their restrictions: [Federating application segments to a partner](kb:zpa.b2b-federation.federate-applications).
4. **Who controls access to the shared application?** The guest partner's policies and the host's view of them: [Access policies for federated applications](kb:zpa.b2b-federation.access-policy).
5. **Which API routes exist?** The published routes, their bodies and the token-expiry mismatch: [B2B Federation API routes](kb:zpa.b2b-federation.api-routes).
6. **What do the SDKs and Terraform cover?** Python and Go coverage and where they disagree with the specification: [B2B Federation SDK coverage and contract differences](kb:zpa.b2b-federation.sdk-contract).

Area: zpa.b2b-federation, its subjects in references/_meta/spine/zpa/zpa.b2b-federation.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.b2b-federation.access-policy.md (Access policies for federated applications): Federated access policies support only these criteria for the guest partner: Client Type (only Client Connector), Client Connector Posture Profiles, Country Codes, Locations, Machine Groups, Platforms, Risk Scores, SAML and SCIM Attributes, and Trusted Networks. [zpa.b2b-federation.access-policy:guest-criteria-limited]
- scoped-by references/_meta/text/zpa/zpa.b2b-federation.federate-applications.md (Federating application segments to a partner): On the Defined Application Segments page the host selects a segment's Federate Application icon, selects one or more partners to share with, and saves. [zpa.b2b-federation.federate-applications:federate-flow]
- depends-on references/_meta/text/zpa/zpa.b2b-federation.prerequisites.md (B2B Federation prerequisites and limits): B2B Federation is in limited availability and requires a Private Access (ZPA) Federation license. [zpa.b2b-federation.prerequisites:limited-availability-license]
- depends-on references/_meta/text/zpa/zpa.b2b-federation.trust-workflow.md (B2B Federation trust workflow and statuses): The console process has three steps: generate an access token and share it with the partner, verify the token and send an approval request to the partner, then approve the federation request. [zpa.b2b-federation.trust-workflow:three-steps]
- interacts-with references/_meta/text/zpa/zpa.microtenants.api-scoping.md (How an API call selects a Microtenant): The ZPA API reference for the application federation and tenant federation operations (`application/federate`, `application/host/{host_id}` and the `tenant-federation` paths) says that if you are within a Microtenant you must pass `microtenantId` to retrieve that Microtenant's data, and that a create or update that omits it takes effect in the Default Microtenant. [zpa.microtenants.api-scoping:omitted-scope-defaults-default]
- links-to references/_meta/text/zpa/zpa.b2b-federation.api-routes.md (B2B Federation API routes)
- links-to references/_meta/text/zpa/zpa.b2b-federation.sdk-contract.md (B2B Federation SDK coverage and contract differences)

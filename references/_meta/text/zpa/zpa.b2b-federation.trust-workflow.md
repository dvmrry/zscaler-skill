# B2B Federation trust workflow and statuses (zpa.b2b-federation.trust-workflow)
Also called: generate access token federation; verify access token; send approval request; pending requests; federated partners page; federation token single use; pause terminate federation; token verified pending approval; federation token validity

Trust is built in three steps and then lives as a status on two pages.

**Steps.** Both the host partner admin and guest partner admin must be available to complete the process within the designated Token Validity (In Hours) time range, and either business partner can initiate B2B Federation. [zpa.b2b-federation.trust-workflow:both-admins-available] The console process has three steps: generate an access token and share it with the partner, verify the token and send an approval request to the partner, then approve the federation request. [zpa.b2b-federation.trust-workflow:three-steps]

**Token.** The access token is valid for the time specified in the Token Validity (In Hours) field and is only visible once. [zpa.b2b-federation.trust-workflow:token-visible-once] An access token can only be used once, is invalid if used or expired, and a separate token is required for each partner. [zpa.b2b-federation.trust-workflow:token-single-use]

**Approval.** After the token is validated, Send Approval Request sends a request to the B2B partner admin and the pending request appears on the Pending Requests page. [zpa.b2b-federation.trust-workflow:verify-then-send] On a pending request the guest partner admin submits the tenant name and token details and the host partner admin reviews, validates, and approves or denies it. [zpa.b2b-federation.trust-workflow:pending-roles] After an access token is verified, the host and guest partner must approve or deny the pending request on the Pending Requests page, and approved requests appear on the Federated Partners page. [zpa.b2b-federation.trust-workflow:pending-needs-both] After the process is completed, both partners can take the role of host partner or guest partner, depending on who owns the application. [zpa.b2b-federation.trust-workflow:partners-swap-roles]

**Statuses.** The Pending Requests page shows the statuses Token Verified, Pending Approval and Pending Verification. [zpa.b2b-federation.trust-workflow:pending-statuses] A federated partner is a guest or host partner admin approved by two business partners, and the Federated Partners page shows its status as Active, Pause or Terminate. [zpa.b2b-federation.trust-workflow:federated-statuses] How these map to the API values is open [gap:zpa.b2b-federation.trust-workflow:ui-api-status-mapping]. The routes behind these steps are in [B2B Federation API routes](kb:zpa.b2b-federation.api-routes).

What to check:
1. Which of the three steps the partners are at, and whether both admins were available within the Token Validity period.
2. Whether the token was already used or expired, and whether a separate token was generated for each partner.
3. The status shown on the Pending Requests or Federated Partners page against the documented values.
4. Whether both partners approved after the token was verified.

Not known (open gaps):
- How Token Verified and Terminate map to the API's states [gap:zpa.b2b-federation.trust-workflow:ui-api-status-mapping]: settled by lab-test or support-ticket. Blocks: translating a console status into the API value to read or set

Area: zpa.b2b-federation, its subjects in references/_meta/spine/zpa/zpa.b2b-federation.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.b2b-federation.prerequisites.md (B2B Federation prerequisites and limits): Both the host and guest partners must have a Private Access tenant, complete migration to Authentication Service for admins, and have Zscaler Experience Center enabled; both need an active Private Access license, but only the host partner needs a Federation license to share applications. [zpa.b2b-federation.prerequisites:both-partners-requirements]
- decided-by references/_meta/text/zpa/zpa.b2b-federation.access-policy.md (Access policies for federated applications), from zpa.b2b-federation: Federated access policies support only these criteria for the guest partner: Client Type (only Client Connector), Client Connector Posture Profiles, Country Codes, Locations, Machine Groups, Platforms, Risk Scores, SAML and SCIM Attributes, and Trusted Networks. [zpa.b2b-federation.access-policy:guest-criteria-limited]
- scoped-by references/_meta/text/zpa/zpa.b2b-federation.federate-applications.md (Federating application segments to a partner), from zpa.b2b-federation: On the Defined Application Segments page the host selects a segment's Federate Application icon, selects one or more partners to share with, and saves. [zpa.b2b-federation.federate-applications:federate-flow]
- interacts-with references/_meta/text/zpa/zpa.microtenants.api-scoping.md (How an API call selects a Microtenant), from zpa.b2b-federation: The ZPA API reference for the application federation and tenant federation operations (`application/federate`, `application/host/{host_id}` and the `tenant-federation` paths) says that if you are within a Microtenant you must pass `microtenantId` to retrieve that Microtenant's data, and that a create or update that omits it takes effect in the Default Microtenant. [zpa.microtenants.api-scoping:omitted-scope-defaults-default]
- links-to references/_meta/text/zpa/zpa.b2b-federation.api-routes.md (B2B Federation API routes)

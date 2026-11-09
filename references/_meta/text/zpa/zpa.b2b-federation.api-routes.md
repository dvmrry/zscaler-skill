# B2B Federation API routes (zpa.b2b-federation.api-routes)
Also called: tenant-federation api; create federation token api; verify federation token api; request approval api; update provisioning state; federation-state; federate application api; application/host; GLOBAL_POLICY guest; expiryTimeInSeconds

The routes are published in the Automate ZPA specification and are not entitlement checks.

**Base and scope.** The federation operations are published under `/mgmtconfig/v1/customers/{customerId}` (not the `/admin/customers` base used by the Microtenant operations), against the server `https://api.zsapi.net/zpa`, which is the `/zpa` prefix the SDKs write into the same paths. [zpa.b2b-federation.api-routes:federation-base-path] The \`application/federate\` operation and the nine \`tenant-federation\` operations each take an optional integer \`microtenantId\` query parameter. [zpa.b2b-federation.api-routes:microtenant-id-optional]

**Application routes.** `PUT /application/federate` federates an existing application segment from a host partner with one or more guest partners, and its body requires `applicationGid` and `guestGids`. [zpa.b2b-federation.api-routes:federate-application] `GET /application/host/{host_id}` returns the federated applications for a customer, filtered by host ID, domain names and enabled status, with `search`, `page` and `pagesize` parameters. [zpa.b2b-federation.api-routes:list-federated-from-host]

**Trust routes.** `POST /tenant-federation/token` creates a federation token for the customer; its body requires `expiryTimeInSeconds` and takes optional `notes`. [zpa.b2b-federation.api-routes:create-token] `POST /tenant-federation/token/verify` verifies a federation token, and its body requires `token`. [zpa.b2b-federation.api-routes:verify-token] `PUT /tenant-federation/approval` approves a partner federation using a token, and its body requires `token` and takes optional `partnerNotes` of up to 1000 characters. [zpa.b2b-federation.api-routes:request-approval] `PUT /tenant-federation/{federation_id}/notes` updates the notes for a partner federation; the initiator updates `initiatorNotes` and the partner updates `partnerNotes`. [zpa.b2b-federation.api-routes:update-notes]

**State routes.** `PUT /tenant-federation/{federation_id}/provisioning-state/{status}` updates the provisioning status of the partner federation request to APPROVED, DENIED or TERMINATED. [zpa.b2b-federation.api-routes:provisioning-state] `PUT /tenant-federation/{federation_id}/federation-state/{status}` updates the status of an existing federation to ACTIVE or INACTIVE. [zpa.b2b-federation.api-routes:federation-state] The federation-state `status` path parameter is documented as ACTIVE (i.e., Active) or INACTIVE (i.e., Pause). [zpa.b2b-federation.api-routes:federation-state-status-meaning] The console's Pause status for a federated partner corresponds to the API's INACTIVE. [zpa.b2b-federation.api-routes:pause-is-inactive] `DELETE /tenant-federation/{federation_id}` deletes the partner federation for the specified ID. [zpa.b2b-federation.api-routes:delete-provisioning]

**Read routes.** `GET /tenant-federation` lists provisioning requests with search, sorting and pagination, and each entry's `provisioningStatus` is PENDING_VERIFICATION, PENDING_APPROVAL, APPROVED, DENIED or TERMINATED. [zpa.b2b-federation.api-routes:list-provisionings] `GET /tenant-federation/partners` lists the active federation partners for a customer with search, sorting and pagination. [zpa.b2b-federation.api-routes:list-partners] `GET /policySet/rules/policyType/GLOBAL_POLICY/guest/{guest_id}` returns a paginated list of policy rules a partner customer created on applications federated to it, sanitized to hide sensitive information. [zpa.b2b-federation.api-routes:partner-policy-rules]

**Token lifetime.** The create-token body declares `expiryTimeInSeconds` with a numeric minimum of 3600 and maximum of 86400. [zpa.b2b-federation.api-routes:token-expiry-range-values] The description disagrees [divergence:zpa.b2b-federation.api-routes:token-expiry-range].

**Acceptance.** Whether a tenant accepts these calls is open [gap:zpa.b2b-federation.api-routes:live-acceptance]. The scope parameter is in [How an API call selects a Microtenant](kb:zpa.microtenants.api-scoping), and SDK coverage of these routes is in [B2B Federation SDK coverage and contract differences](kb:zpa.b2b-federation.sdk-contract).

What to check:
1. Which route performs the step, and whether the operation is on the non-admin federation base.
2. The token lifetime a caller sends, because the specification states two different minimums.
3. Whether the `microtenantId` query parameter is sent on an application federation or tenant federation operation, and what omitting it does there.
4. Whether the call is documented to work on this tenant, which the routes alone do not show.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.b2b-federation.api-routes:federation-base-path] Tier B: The route equivalence between `/zpa/mgmtconfig/v1/customers/...` in the SDKs and the published `/mgmtconfig/v1/customers/...` is inferred from the server URL ending in `/zpa`; no request was sent to either form.
- [zpa.b2b-federation.api-routes:pause-is-inactive] Tier B: Follows from federation-state-status-meaning: the API description glosses INACTIVE as "(i.e., Pause)", and the Federated Partners help page lists the console statuses as Active, Pause or Terminate. Neither source states that pausing a partner in the console sends INACTIVE to this route, and no request was observed.

Sources disagree (name both sides):
- The create-token field description gives a minimum of 33,600 seconds while the same field's schema minimum is 3600. [divergence:zpa.b2b-federation.api-routes:token-expiry-range]
  - api-specs: The minimum supported value is 33,600 and the maximum is 86,400.
  - api-specs: The schema minimum is 3600 and the maximum is 86400.
  Impact: A caller sending a lifetime between 3600 and 33,599 seconds follows the schema but not the description, and the specification does not show which the API enforces; the console's Token Validity is in hours.

Not known (open gaps):
- Whether the published routes are accepted on a tenant, and the authentication scope they need [gap:zpa.b2b-federation.api-routes:live-acceptance]: settled by lab-test or tenant-data. Blocks: telling whether a tenant without the Federation license can call the routes, and which API client scope is required

Area: zpa.b2b-federation, its subjects in references/_meta/spine/zpa/zpa.b2b-federation.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.microtenants.api-scoping.md (How an API call selects a Microtenant): The \`application/federate\` operation and the nine \`tenant-federation\` operations each take an optional integer \`microtenantId\` query parameter. [zpa.b2b-federation.api-routes:microtenant-id-optional]
- decided-by references/_meta/text/zpa/zpa.b2b-federation.access-policy.md (Access policies for federated applications), from zpa.b2b-federation: Federated access policies support only these criteria for the guest partner: Client Type (only Client Connector), Client Connector Posture Profiles, Country Codes, Locations, Machine Groups, Platforms, Risk Scores, SAML and SCIM Attributes, and Trusted Networks. [zpa.b2b-federation.access-policy:guest-criteria-limited]
- scoped-by references/_meta/text/zpa/zpa.b2b-federation.federate-applications.md (Federating application segments to a partner), from zpa.b2b-federation: On the Defined Application Segments page the host selects a segment's Federate Application icon, selects one or more partners to share with, and saves. [zpa.b2b-federation.federate-applications:federate-flow]
- depends-on references/_meta/text/zpa/zpa.b2b-federation.prerequisites.md (B2B Federation prerequisites and limits), from zpa.b2b-federation: B2B Federation is in limited availability and requires a Private Access (ZPA) Federation license. [zpa.b2b-federation.prerequisites:limited-availability-license]
- depends-on references/_meta/text/zpa/zpa.b2b-federation.trust-workflow.md (B2B Federation trust workflow and statuses), from zpa.b2b-federation: The console process has three steps: generate an access token and share it with the partner, verify the token and send an approval request to the partner, then approve the federation request. [zpa.b2b-federation.trust-workflow:three-steps]
- links-to references/_meta/text/zpa/zpa.b2b-federation.sdk-contract.md (B2B Federation SDK coverage and contract differences)

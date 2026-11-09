# B2B Federation SDK coverage and contract differences (zpa.b2b-federation.sdk-contract)
Also called: python sdk tenant_federation_provisioning; python sdk application_federation; python b2b_policy; go sdk federated_application; go b2b_policy_controller; customer_domain_controller; iamidpmapping; browser_access_groups; policy group sdk; federation sdk gap

Neither SDK covers every published federation route, and where they overlap they disagree.

**Coverage.** The Python SDK has `application_federation` (list applications for a host, update an application), `tenant_federation_provisioning` (list provisionings, list partners, add, update, delete) and `b2b_policy` (get global policy rules), and no methods for token create, token verify, approval, federation state, notes or provisioning state. [zpa.b2b-federation.sdk-contract:python-covers-partial] The Go SDK has `federated_application` (list by host and federate) and `b2b_policy_controller` (guest policy rules), and no package for the `tenant-federation` routes. [zpa.b2b-federation.sdk-contract:go-covers-two-routes] The pinned ZPA Terraform provider has no federation or B2B resource or data source. [zpa.b2b-federation.sdk-contract:no-federation-terraform] The Python provisioning routes differ from the changelog and specification [divergence:zpa.b2b-federation.sdk-contract:python-provisioning-routes].

**Guest policy.** The Go B2B policy controller calls the guest-policy path with GET through the paged helper under the admin-customer base, and its comment says the endpoint does not support the microtenant filter. [zpa.b2b-federation.sdk-contract:go-guest-policy-get] The Python `b2b_policy` wrapper calls the guest-policy path with GET under the non-admin customer base and returns the raw response, not typed rules. [zpa.b2b-federation.sdk-contract:python-guest-policy-get] The Go changelog says PUT [divergence:zpa.b2b-federation.sdk-contract:guest-policy-method], and the bases differ [divergence:zpa.b2b-federation.sdk-contract:guest-policy-base].

**Federated applications.** The Go and Python paths differ from each other and the specification [divergence:zpa.b2b-federation.sdk-contract:federated-application-paths]. The segment-side `guestDetails` field and its Python decode defect are in [Federating application segments to a partner](kb:zpa.b2b-federation.federate-applications).

**Adjacent packages.** The same Go change adds packages whose contract is unresolved across the SDKs: domains [divergence:zpa.b2b-federation.sdk-contract:customer-domain-write], identity mapping [divergence:zpa.b2b-federation.sdk-contract:iamidpmapping-shape] and policy groups [divergence:zpa.b2b-federation.sdk-contract:policy-group-routes]. Browser Access groups are Go-only [gap:zpa.b2b-federation.sdk-contract:browser-access-groups-go-only]. General Go SDK defects are in [ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input](kb:zpa.sdk-go.service-defects).

The Python policy group controllers, including a docstring example that cannot run as written, are in [Python SDK policy group, rule and set controllers](kb:zpa.sdk-python.policy-groups).

The Go SDK release metadata was out of step with itself: From v3.8.48 through v3.8.52 the Go SDK's `VERSION` constant in oneapiclient.go stayed at 3.8.48 while the changelog moved on (its newest entry at v3.8.52 is 3.8.52), so the user agent the client sends named an older version; from v3.8.53 through v3.8.55 the constant matches the release (3.8.55 at v3.8.55); from v3.8.56 through v3.8.58 it stays at 3.8.55 while the changelog's newest entry moves on (3.8.56, 3.8.57, 3.8.58). [zpa.b2b-federation.sdk-contract:go-version-constant-behind-changelog]

What to check:
1. Which SDK implements the operation, since neither covers all published federation routes.
2. Which method the guest-policy call uses, and which base path.
3. Which path the federated application list and update call, and whether the host ID is in the path.
4. Whether the Python provisioning methods match the routes the specification and changelog describe.
5. Whether the adjacent Go packages (customer domains, identity mapping, policy groups) match Python and the changelog before relying on either.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.b2b-federation.sdk-contract:python-covers-partial] Tier B: Absence search of the pinned Python tree (`grep -rn 'tenant-federation' zscaler`): the only matches are tenant_federation_provisioning.py, legacy.py and zpa_service.py, and the methods in that module are the five listed; no search covered the docs.
- [zpa.b2b-federation.sdk-contract:go-covers-two-routes] Tier B: Absence search of the pinned Go tree: `grep -rln tenant-federation vendor/zscaler-sdk-go` returns nothing.
- [zpa.b2b-federation.sdk-contract:no-federation-terraform] Tier B: Absence search: `grep -rli 'tenant-federation\|b2b' vendor/terraform-provider-zpa/zpa` returns nothing at the pin; federation names other than 'b2b' and 'tenant-federation' were not searched.

Sources disagree (name both sides):
- The Go changelog lists the guest-policy operation as PUT, while both SDKs and the specification use GET. [divergence:zpa.b2b-federation.sdk-contract:guest-policy-method]
  - sdk-go: The operation is PUT.
  - api-specs: The specification documents the operation as GET.
  - sdk-python: Python calls GET.
  Impact: A caller built from the Go changelog would send PUT to a read route; the code and specification agree on GET.
- The Go B2B policy controller uses the admin-customer base and says the endpoint does not support the microtenant filter, while the specification and Python use the non-admin base and the specification declares an optional `microtenantId`. [divergence:zpa.b2b-federation.sdk-contract:guest-policy-base]
  - sdk-go: Admin-customer base; no microtenant filter.
  - api-specs: The non-admin path takes an optional microtenantId query parameter.
  - sdk-python: Python uses the non-admin customer base.
  Impact: The same operation is addressed on two bases; the sources do not show whether the admin form is accepted or whether microtenant scoping works.
- The Go federated-application package calls `/application/host/{hostID}` and `/application/federate`, while the Python wrapper lists `/application/host` without the ID and updates `/application/{application_id}`. [divergence:zpa.b2b-federation.sdk-contract:federated-application-paths]
  - sdk-go: Go lists `/application/host/{hostID}` and federates with `PUT /application/federate`.
  - api-specs: The specification documents `GET /application/host/{host_id}`.
  - sdk-python: Python lists `/application/host` with no host ID and updates `PUT /application/{application_id}`.
  Impact: Python's update route does not match the documented federate route, so a Python update_application call may not federate; whether the Python paths are accepted is unknown.
- The Python changelog lists the token, verify, approval, state and notes routes, while the module implements POST `/tenant-federation` and PUT `/tenant-federation/{id}`, which the specification does not list. [divergence:zpa.b2b-federation.sdk-contract:python-provisioning-routes]
  - sdk-python: The release added the token and approval routes.
  - sdk-python: The module has add (POST `/tenant-federation`) and update (PUT `/tenant-federation/{id}`) methods and no token or approval methods.
  - api-specs: The specification lists GET on `/tenant-federation`, with POST only on the `/token` and `/token/verify` sub-routes.
  Impact: A caller that trusts the changelog finds no method for the advertised routes, and a caller that uses add_tenant_federation sends a POST the specification does not document.
- The Go customer-domain package has only GET, while the Go changelog and the Python module add a POST to the same path. [divergence:zpa.b2b-federation.sdk-contract:customer-domain-write]
  - sdk-go: The changelog advertises POST.
  - sdk-go: Go implements only the GET reader.
  - sdk-python: Python implements the POST as add_update_domain.
  Impact: Whether the POST is a supported write is not shown: the specification has no associationtype route.
- The Go identity-mapping reader decodes one object and omits `syncVersion`, while the Python reader treats the response as a list and its model has `syncVersion`. [divergence:zpa.b2b-federation.sdk-contract:iamidpmapping-shape]
  - sdk-go: Go returns one OneIdentityController object.
  - sdk-python: Python lists OneIdentity entries.
  - sdk-python: The Python model has syncVersion.
  Impact: The route is not in the specification; one of the two decodes the response wrongly or the response differs by tenant.
- The Go policy-group package creates and reorders at `/rule` paths and the changelog describes `GET .../group` as Add and reorder as POST, while Python creates with POST `.../group` and reorders with PUT `.../group/{id}/reorder`. [divergence:zpa.b2b-federation.sdk-contract:policy-group-routes]
  - sdk-go: Go CreateRule posts to `/policyGroupSet/{set}/rule` and ReorderGroup puts to `/policyGroupSet/{set}/rule/{group}/reorder/{n}`.
  - sdk-python: Python reorders at `/policyGroupSet/{set}/group/{group}/reorder/{n}`.
  - sdk-go: The Go changelog lists GET on `.../group` as the add route.
  Impact: The group-create and reorder routes have three descriptions and the specification has no policyGroupSet route, so none can be confirmed.

Not known (open gaps):
- Whether browser_access_groups is intentionally Go-only [gap:zpa.b2b-federation.sdk-contract:browser-access-groups-go-only]: settled by support-ticket or tenant-data. Blocks: relying on Browser Access groups from the Python SDK

Area: zpa.b2b-federation, its subjects in references/_meta/spine/zpa/zpa.b2b-federation.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zpa/zpa.b2b-federation.federate-applications.md (Federating application segments to a partner), from zpa.b2b-federation: On the Defined Application Segments page the host selects a segment's Federate Application icon, selects one or more partners to share with, and saves. [zpa.b2b-federation.federate-applications:federate-flow]
- decided-by references/_meta/text/zpa/zpa.b2b-federation.access-policy.md (Access policies for federated applications), from zpa.b2b-federation: Federated access policies support only these criteria for the guest partner: Client Type (only Client Connector), Client Connector Posture Profiles, Country Codes, Locations, Machine Groups, Platforms, Risk Scores, SAML and SCIM Attributes, and Trusted Networks. [zpa.b2b-federation.access-policy:guest-criteria-limited]
- depends-on references/_meta/text/zpa/zpa.b2b-federation.prerequisites.md (B2B Federation prerequisites and limits), from zpa.b2b-federation: B2B Federation is in limited availability and requires a Private Access (ZPA) Federation license. [zpa.b2b-federation.prerequisites:limited-availability-license]
- depends-on references/_meta/text/zpa/zpa.b2b-federation.trust-workflow.md (B2B Federation trust workflow and statuses), from zpa.b2b-federation: The console process has three steps: generate an access token and share it with the partner, verify the token and send an approval request to the partner, then approve the federation request. [zpa.b2b-federation.trust-workflow:three-steps]
- interacts-with references/_meta/text/zpa/zpa.microtenants.api-scoping.md (How an API call selects a Microtenant), from zpa.b2b-federation: The ZPA API reference for the application federation and tenant federation operations (`application/federate`, `application/host/{host_id}` and the `tenant-federation` paths) says that if you are within a Microtenant you must pass `microtenantId` to retrieve that Microtenant's data, and that a create or update that omits it takes effect in the Default Microtenant. [zpa.microtenants.api-scoping:omitted-scope-defaults-default]
- links-to references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
- links-to references/_meta/text/zpa/zpa.sdk-python.policy-groups.md (Python SDK policy group, rule and set controllers)

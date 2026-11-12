# ZPA API base paths: hosts, the /zpa prefix, v1 and v2 versions, userconfig and cbiconfig (zpa.api.base-paths)
Also called: config.private.zscaler.com; mgmtconfig v1 v2; /zpa prefix legacy; customerId in every path; api.zsapi.net/zpa; userconfig scimgroup base; cbiconfig base; mgmtConfigV2; ZPA legacy host
Former IDs: zpa-38

Every ZPA route carries the tenant's customer ID in its path, and the same route is written with a /zpa prefix on OneAPI and without it on the legacy hosts. The endpoint and method listing itself is generated, not restated here.

**One path shape, three families.** Operations under `/customers/{customerId}` in the mgmtconfig v1 and v2, userconfig and cbiconfig path families take the customer ID as a required path parameter, as the application, posture, SCIM group and CBI regions reads show. [zpa.api.base-paths:customer-id-in-path] The ZPA OpenAPI document gives paths without a prefix (for example /mgmtconfig/v1/admin/customers/{customerId}/application) under the server https://api.zsapi.net/zpa, so the OneAPI route is /zpa/mgmtconfig/.... [zpa.api.base-paths:oneapi-prefix]

**Legacy hosts.** The Python SDK's legacy host table maps cloud names to config hosts: PRODUCTION to config.private.zscaler.com, ZPATWO to config.zpatwo.net, BETA to config.zpabeta.net, GOV to config.zpagov.net, GOVUS to config.zpagov.us and PREVIEW to config.zpapreview.net. [zpa.api.base-paths:legacy-hosts] Go SDK service packages build ZPA paths from constants that begin /zpa/mgmtconfig/v1/admin/customers/ (and /zpa/userconfig, /zpa/cbiconfig), so the SDK's paths carry the OneAPI /zpa prefix; the legacy client strips it before sending. [zpa.api.base-paths:go-service-constants] When the Go SDK is in legacy mode its ZPA request path removes the /zpa prefix from the endpoint before sending to the legacy ZPA client. [zpa.api.base-paths:go-strips-prefix] Some of the Python SDK's ZPA modules (for example `oauth2_user_code`, `machine_groups` and `idp`) build ZPA paths with a /zpa/mgmtconfig/v1/admin/customers/{customer_id} base, and its executor removes /zpa from the URL when the legacy client is in use. [zpa.api.base-paths:python-strips-prefix]

**Versions are not only v1.** The Go SDK reaches the mgmtconfig v2 base from more than the LSS configuration (`/lssConfig`) package: the posture profile, identity provider, SAML attribute, trusted network, enrollment certificate and Browser Access certificate packages contain the v2 base path, and so do the segment group package (`UpdateV2`, `UpdateV2Changes`), the user portal link package (`CreatePortalLinkBulk`, `/bulk`) and the v2 policy package (`CreateRule`, `UpdateRule`). [zpa.api.base-paths:v2-packages] The ZPA OpenAPI document has mgmtconfig v2 operations for IdP, posture, SAML attribute, certificate and enrollment-certificate reads, a segment group update, v2 policy rule create and update, and the lssConfig family. [zpa.api.base-paths:v2-openapi] Some Go SDK routes carry v2 as a path segment appended to the v1 base rather than using the v2 base: the C2C IP ranges (c2c_ip_ranges, /v2/ipRanges), customer domains (/v2/associationtype) and SSO login options (/v2/ssoLoginOptions). [zpa.api.base-paths:v2-segment-under-v1]

**Other bases.** SCIM group routes sit under /userconfig/v1/customers/{customerId} and Cloud Browser Isolation routes under /cbiconfig/cbi/api/customers/{customerId}, each a base of its own beside /mgmtconfig. [zpa.api.base-paths:userconfig-cbi] The federation routes use a different customer base, held in [The federation operations are published under `/mgmtconfig/v1/customers/{customerId}` (not the `/admin/customers` base used by the Microtenant operations), against the server `https://api.zsapi.net/zpa`, which is the `/zpa` prefix the SDKs write into the same paths.](kb:zpa.b2b-federation.api-routes:federation-base-path), and the receiver routes are in [The API article creates a receiver with POST, reads one with GET, updates it with PUT and deletes it with DELETE, on /mgmtconfig/v2/admin/customers/{customerId}/lssConfig and .../lssConfig/{lssId}, and the specification lists GET, PUT and DELETE on the item path.](kb:zpa.log-receivers.api:endpoints).

**Open.** Whether a legacy cloud host serves a route that still carries the /zpa prefix is not shown by any source [gap:zpa.api.base-paths:legacy-host-accepts-zpa-prefix].

What to check:
1. Which base a failing call used: the OneAPI /zpa prefix on api.zsapi.net, or a legacy cloud host without the prefix.
2. Whether the resource is one of the packages on the v2 base, since an assumption that only LSS uses v2 is wrong.
3. Whether a path with a v2 segment sits under the v1 base rather than the v2 base.

Not known (open gaps):
- Whether a legacy ZPA cloud host accepts the /zpa prefix [gap:zpa.api.base-paths:legacy-host-accepts-zpa-prefix]: settled by lab-test or support-ticket. Blocks: building raw legacy requests from OneAPI paths

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zpa/zpa.b2b-federation.api-routes.md (B2B Federation API routes)
- links-to references/_meta/text/zpa/zpa.log-receivers.api.md (Managing ZPA log receivers through the API and SDKs)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.api.legacy-endpoints.md (ZPA legacy endpoint wiring: shared paths, schedules, user codes and step-up levels)
- see-also references/_meta/text/zpa/zpa.api.policy-wire.md (ZPA policy rule wire behavior: routes, request fields and ordering)

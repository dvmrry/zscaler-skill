# OneAPI hosts and per-product base paths (shared.oneapi.base-urls)
Also called: api.zsapi.net; oneapi base url; oneapi base path; api.beta.zsapi.net; zia api v1 oneapi path; ztw api v1; zcc papi public v1; ziam admin api v1

The OneAPI host for commercial customers is api.zsapi.net. [shared.oneapi.base-urls:commercial-host] Each API has its own base path, and every endpoint is relative to that base URL: a ZIA call to /users goes to https://api.zsapi.net/zia/api/v1/users, and ZPA, Client Connector and Cloud & Branch Connector calls append the endpoint to their own base URLs. [shared.oneapi.base-urls:relative-endpoints]

**Base paths.** The guide's base paths are: ZIA `/zia/api/v1`; ZPA `/zpa/mgmtconfig/v1`, `/zpa/mgmtconfig/v2` and `/zpa/userconfig/v1` (the last for SCIM attribute and group endpoints); ZDX `/zdx/v1`; Authentication Service `/ziam/admin/api/v1`; Client Connector `/zcc/papi/public/v1`; Cloud & Branch Connector `/ztw/api/v1`; Business Insights `/bi/api/v1`; EASM `/easm/easm-ui/v1`; Cellular `/zcell/config/api/v1`; Event Monitoring & Notification `/event-monitoring`; Unified RBAC `/urbac/urbac`; AI Security `/aisecurity/aispm/v1` (AI Infrastructure) and `/aisecurity/airt/api/v2` (AI Red Teaming); AI Guard `/aiguard/v1`. [shared.oneapi.base-urls:base-path-table] The same guide's EASM example request uses `https://api.zsapi.net/easm-ui/v1/organizations`, without the `/easm` prefix its base-path table gives. [shared.oneapi.base-urls:easm-example-path]

**Beta.** A beta OneAPI endpoint uses api.beta.zsapi.net as the host with the same base path for each API, for example https://api.beta.zsapi.net/zia/api/v1/users. [shared.oneapi.base-urls:beta-host]

**Tenant identifiers in the path.** ZPA requests need a `customerId`, the customer's ZPA tenant ID, which can be read from the ZPA OneAPI resource's scope in Authentication Service or copied from the ZPA API Keys page. [shared.oneapi.base-urls:zpa-customer-id] How the ZPA path families take the customer ID is in [Operations under `/customers/{customerId}` in the mgmtconfig v1 and v2, userconfig and cbiconfig path families take the customer ID as a required path parameter, as the application, posture, SCIM group and CBI regions reads show.](kb:zpa.api.base-paths:customer-id-in-path). Cellular requests likewise need a `customer_id`, the customer's Cellular tenant ID (spelled 'Celullar' in the guide). [shared.oneapi.base-urls:cellular-customer-id] Event Monitoring calls carry tenant headers instead: [The Event Monitoring & Notification API: what it does, access, headers and limits](kb:shared.event-monitoring.api).

**Elsewhere.** The Analytics GraphQL endpoint is in [The Analytics (Z-Insights) GraphQL API: endpoint, access and scope](kb:shared.analytics.graphql). The Go SDK's OneAPI client checks for the `ziam` prefix before the `zia` prefix so that ZIdentity calls are not metered against ZIA's rate limiter, and sends `ziam` and `admin` paths through its default HTTP client. [shared.oneapi.base-urls:go-ziam-routing] The older Go ZIdentity routing is discussed in [The ZIdentity (Authentication Service) admin API from a client's side: route, coverage and wire notes](kb:zidentity.api). Government hosts are in [Reaching OneAPI on government (FedRAMP) and non-production clouds](kb:shared.oneapi.government-clouds).

What to check:
1. Whether the request URL is the product's base URL with the endpoint appended, on api.zsapi.net (or the beta or government host the tenant uses).
2. For ZPA, whether the customer ID is in the path.

Area: shared.oneapi, its subjects in references/_meta/spine/shared/shared.oneapi.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.analytics.graphql.md (The Analytics (Z-Insights) GraphQL API: endpoint, access and scope)
- links-to references/_meta/text/shared/shared.event-monitoring.api.md (The Event Monitoring & Notification API: what it does, access, headers and limits)
- links-to references/_meta/text/shared/shared.oneapi.government-clouds.md (Reaching OneAPI on government (FedRAMP) and non-production clouds)
- links-to references/_meta/text/zidentity/zidentity.api.md (The ZIdentity (Authentication Service) admin API from a client's side: route, coverage and wire notes)
- links-to references/_meta/text/zpa/zpa.api.base-paths.md (ZPA API base paths: hosts, the /zpa prefix, v1 and v2 versions, userconfig and cbiconfig)

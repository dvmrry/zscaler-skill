# Conventions of the Cloud Connector API capture: base path, default responses, paging and decoding (cloud-connector.api.conventions)
Also called: ztw api base url; ztw default response; zcloudconnector default response as success; cloud connector api conventions; /ztw/api/v1; ztw postman collection; ZTWBaseUrl; ztGateway api
Former IDs: cloud-connector-25

The captured Cloud & Branch Connector contract is a reconstruction of the vendor's published reference, and some of its structure is an artifact of that capture. This subject records the conventions an agent needs before reading a path or a response schema from it.

**Base path.** The captured contract's server is `https://api.zsapi.net/ztw/api/v1`, so its paths (such as `/ecRules/ecRdr`) sit under `/ztw/api/v1` on api.zsapi.net. [cloud-connector.api.conventions:oneapi-base-path] The hosts and sign-in for each path are in [Reaching and signing in to the Cloud Connector API: OneAPI, legacy ZTC credentials and government clouds](kb:cloud-connector.api.authentication).

**OneAPI Postman collection.** The OneAPI Postman collection sets `ZTWBaseUrl` to `{{oneAPIBaseUrl}}/ztw/api/v1`, and has folders named `Cloud & Branch Connector` and `Zscaler Cloud & Branch Connector`. [cloud-connector.api.conventions:postman-base-variable] In the Postman collection, the list requests for DNS gateways, DNS forwarding rules, log and control forwarding rules and workload groups carry a note that the endpoint is accessible only via OneAPI. [cloud-connector.api.conventions:postman-oneapi-only-notes] The provider documentation carries the same note for DNS and log rules only: [The documentation for `ztc_traffic_forwarding_dns_rule` and `ztc_traffic_forwarding_log_rule` (resources and data sources) says each is available only via OneAPI; the `ztc_traffic_forwarding_rule` pages carry no such note.](kb:cloud-connector.terraform.provider-config:dns-log-rules-oneapi-only). The Postman collection has a `Zero Trust Gateway` folder of `/ztGateway` requests (list, create, update, delete, lite, count, status, config status and compare, events, license info, supported regions and traffic tests), and the captured OneAPI contract has no `/ztGateway` path; the Cloud & Branch Connector release notes for July 06, 2026 announce these endpoints as new. [cloud-connector.api.conventions:postman-ztgateway-not-in-contract] Zero Trust Gateways themselves are described in [Zero Trust Gateways versus Cloud Connectors: who runs what, and where it is available](kb:cloud-connector.overview.zero-trust-gateways).

**Success responses.** The structural validation report of the OpenAPI snapshot counts 165 Cloud & Branch Connector operations on 96 paths and flags 124 of them with the issue `default_response_as_success`. [cloud-connector.api.conventions:default-response-as-success] In the contract the activate operation carries `x-zscaler-default-as-success` and a `default` response, with no 200 or 204 response. [cloud-connector.api.conventions:default-as-success-marker] Which status code those operations return on success, and whether the default schema is a success body at all, is open [gap:cloud-connector.api.conventions:default-response-semantics].

**Paging.** The Go SDK's list helper for ZTW requests 1000 items a page and stops at the first shorter page: [The ZTC (ztw) `ReadAllPages` helper requests `pageSize=1000` on every page and stops at the first page with fewer than 1000 items.](kb:shared.sdk-go.list-pagination:ztw-stops-on-page-shorter-than-1000), with the truncation risk in [If a ZTC list endpoint returns fewer than 1000 items for a full page (a server cap), the helper reads that page as the last one and returns a partial list with no error.](kb:shared.sdk-go.list-pagination:ztw-capped-page-truncates).

**Decoding.** The Go SDK decodes a ZTW create response into its typed object only when the Content-Type is exactly JSON: [ZTW `CreateResource` decodes the response into the typed object only when the `Content-Type` header equals `application/json` exactly (case-insensitive). Any other value, including a valid `application/json; charset=utf-8`, takes the else branch, which returns the raw `*http.Response` with a nil error.](kb:shared.sdk-go.request-handling:ztw-create-requires-exact-content-type).

What to check:
1. Before treating a status code from the captured ZTW contract as the operation's success code, whether that operation's response is the reconstructed default response.
2. Before calling a `/ztGateway` path, that it comes from the Postman collection only: the captured contract and the clients have no Zero Trust Gateway endpoints to check it against.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.api.conventions:postman-ztgateway-not-in-contract] Tier B: Absence: the contract's /paths was checked for the /ztGateway paths; under vendor/ the string ztGateway occurs only in the Postman collection and that release note, so no captured SDK, Terraform provider or MCP source calls these endpoints either.

Not known (open gaps):
- Success status and body of the ZTW operations whose contract has only a default response [gap:cloud-connector.api.conventions:default-response-semantics]: settled by source-read or tenant-data. Blocks: asserting a success status code or response body for most ZTW operations from the contract alone

Area: cloud-connector.api, its subjects in references/_meta/spine/cloud-connector/cloud-connector.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/cloud-connector/cloud-connector.api.authentication.md (Reaching and signing in to the Cloud Connector API: OneAPI, legacy ZTC credentials and government clouds)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.zero-trust-gateways.md (Zero Trust Gateways versus Cloud Connectors: who runs what, and where it is available)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.provider-config.md (ZTC Terraform provider configuration: OneAPI or legacy credentials, environment variables, defaults and government clouds)
- links-to references/_meta/text/shared/shared.sdk-go.request-handling.md (How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes)

# What goes on the wire for ZCC trusted networks: the v1 webTrustedNetwork and v2 trusted-networks APIs (zcc.api.trusted-networks-wire)
Also called: trustedNetworkContracts; webTrustedNetwork listByCompany; zcc trusted networks v2; trusted-networks type filter; zcc trusted network comma separated; zcc v1 vs v2 trusted networks

Trusted networks have two API families: the v1 verb-suffixed `webTrustedNetwork` endpoints, which the captured contract describes, and the RESTful v2 `trusted-networks` endpoints, which only the Go SDK and the Terraform provider use. Their record shapes differ.

## v1

Both SDKs read the v1 list as an object and take the networks from its `trustedNetworkContracts` member (Go also reads `totalCount` and errors when it is positive but no networks came back). [zcc.api.trusted-networks-wire:list-envelope] The contract describes the list response differently [divergence:zcc.api.trusted-networks-wire:v1-list-shape].

In v1 each criterion of a trusted network (`dnsServers`, `dnsSearchDomains`, `hostnames`, `resolvedIpsForHostname`, `ssids`, `trustedDhcpServers`, `trustedGateways`, `trustedSubnets`, `trustedEgressIps`) is one comma-separated string, not a list: the contract and the Go SDK type them as strings, the Python SDK's examples pass values such as '10.11.12.13, 10.11.12.14' and '' for unused criteria, and the Terraform provider's v1 adapter splits and joins them on commas, noting that the v1 API returns values like "10.0.0.5, 10.0.0.6". [zcc.api.trusted-networks-wire:v1-criteria-strings] How the provider splits and trims them is [Converting v1 criteria, the provider splits each comma-separated string into a list, trimming spaces and dropping empty items, and joins lists back with bare commas.](kb:zcc.terraform.trusted-network-backend:csv-trim).

The v1 `conditionType` is a string in the contract and an integer in the Go SDK [divergence:zcc.api.trusted-networks-wire:condition-type-wire-type]. Which code means All is open in [Which trusted network conditionType code is All and which Any](kb:zcc.trusted-networks.object:condition-type-values).

The Go SDK documents that v1 create and edit return only a status such as {"success":"true","errorCode":"0"}, not the trusted network, so it resolves the record by name after create and by ID after update. Recorded responses from one test tenant agree that neither returns the record, but differ on the create: there the API answered `{"conditionType" : 0, "active" : false}`, while the edit answered `{"success" : "true", "errorCode" : "0"}`. [zcc.api.trusted-networks-wire:mutation-response] The Go SDK's trusted network create and update return an error when the mutation response's `errorCode` is non-empty and not "0"; an empty or "0" `errorCode` passes that check whatever `success` says. [zcc.api.trusted-networks-wire:error-code] Deleting a v1 trusted network ID that does not exist returned HTTP 200 with `{"success" : "false", "errorCode" : "3005"}` in a recorded response, and the Go `DeleteTrustedNetwork` passes no response target and returns success whenever the request itself did not fail. [zcc.api.trusted-networks-wire:delete-missing-silent] The Go SDK therefore reports success when deleting a trusted network ID that does not exist. [zcc.api.trusted-networks-wire:delete-missing-reports-success] The Python create returns that acknowledgement as its result: [The recorded v1 create response carries only `conditionType` and `active`, so the object `add_trusted_network` returns has no ID or name of the new network.](kb:zcc.sdk-python.return-shapes:add-result-has-no-id).

## v2

The Go SDK's v2 trusted networks live at `/zcc/papi/public/v2/trusted-networks` and use RESTful verbs: POST to the collection to create, and GET, PUT, PATCH and DELETE on the collection path followed by the numeric ID (`%s/%d`). [zcc.api.trusted-networks-wire:v2-restful] A v2 trusted network as the Go SDK models it has an integer `id`, a string `conditionType`, a `name`, and its criteria as string arrays (`dnsServerIps`, `trustedSubnetIps`, `trustedGatewayIps`, `trustedDhcpServersIps`, `trustedEgressIps`, `resolvedIpsForHostname`); the v1 type holds its criteria as single strings, four of them under other keys (`dnsServers`, `trustedSubnets`, `trustedGateways`, `trustedDhcpServers`). [zcc.api.trusted-networks-wire:v2-record-shape] The Go SDK says the v2 list endpoint's `type` parameter scopes the keyword search to one field, one of `NAME`, `DNS_SERVERS`, `DNS_SEARCH_DOMAINS`, `HOST_NAME_IP`, `TRUSTED_SUBNETS`, `TRUSTED_GATEWAYS`, `TRUSTED_DHCP_SERVERS`, `TRUSTED_EGRESS_IPS` or `SSID`, and that the keyword is a substring match, so its name lookup still matches the whole name on the client, ignoring case (`strings.EqualFold`). [zcc.api.trusted-networks-wire:v2-type-filter]

The paged envelope and its walk are in [The ZCC v2 API: RESTful paths, offset paging and the list envelope](kb:zcc.api.v2-wire).

## Which family a tenant has

The captured Automate contract describes only the v1 `webTrustedNetwork` operations; the reconciliation report shipped with it notes that Terraform uses the Go SDK's v2 trusted-network API instead. [zcc.api.trusted-networks-wire:contract-v1-only] The Terraform provider chooses between the two by probing the v2 list: [The ZCC provider's trusted-network resource calls the SDK's v1 create (`CreateTrustedNetwork`) only from its v1 backend, which serves tenants where the v2 trusted-networks endpoints are not enabled: the first trusted-network operation probes the v2 list endpoint once and caches the verdict for the provider's SDK service handle.](kb:zcc.terraform.field-fidelity:v1-backend-serves-tenants-without-v2). Whether v2 replaces v1, and whether the two share state, is open [gap:zcc.api.trusted-networks-wire:v1-v2-coexistence].

What to check:
1. Which family the tenant answers on: a GET of `/zcc/papi/public/v2/trusted-networks` with `perPage=1`, before comparing a v1 record with a v2 one.
2. Whether a v1 list was read from `trustedNetworkContracts` in an object or as a bare array.
3. After a v1 create, update or delete, re-read the record: the mutation response does not carry it, and a delete can answer HTTP 200 with `success` "false".
4. Before reading All or Any from a v1 `conditionType`, whether the code has been checked against the console for that tenant.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.api.trusted-networks-wire:delete-missing-reports-success] Tier B: Follows from delete-missing-silent: the recorded delete of a missing ID answered HTTP 200 with `success` "false", and `DeleteTrustedNetwork` decodes no body. It rests on the request path raising no error for an HTTP 200 whose body reports failure: `grep -rn -E '"success"|errorCode|ErrorCode' zscaler/*.go zscaler/zcc/*.go` in the Go SDK at v3.8.58 returns nothing, so neither `NewZccRequestDo` and `ExecuteRequest` nor the legacy client reads the body's `success` or `errorCode`. Not run against the API; the recording is from one test tenant (Python SDK cassette).

Sources disagree (name both sides):
- The shape of the v1 trusted-network list response: the contract defines a bare array of records, while both SDKs read an object with `trustedNetworkContracts`. [divergence:zcc.api.trusted-networks-wire:v1-list-shape]
  - api-specs: The contract's 200 response for `webTrustedNetwork/listByCompany` is an array of `TrustedNetworkContract` items.
  - sdk-go: The Go SDK decodes the list into an object with `totalCount` and `trustedNetworkContracts`.
  - sdk-python: The Python SDK takes the records from the response's `trustedNetworkContracts` key, defaulting to an empty list.
  - sdk-python: A recorded `listByCompany` response from one test tenant (recorded with SDK 1.9.13, Python SDK cassette) is an object with `totalCount` and `trustedNetworkContracts`, as the SDKs expect.
  Impact: The recording supports the SDKs: a client built from the contract that expects an array fails on the object the API returned. If a tenant did send the bare array the contract describes, both SDKs would return an error, not an empty list: Go fails to decode an array into its response object, and Python's lookup on a list raises inside a block that returns the exception as the error.
- The wire type of the trusted network's `conditionType`: the Go SDK sends an integer, the API contract types it as a string of format byte, and the Python SDK's docstring documents a string. [divergence:zcc.api.trusted-networks-wire:condition-type-wire-type]
  - sdk-go: int
  - api-specs: string, format byte
  - sdk-python: str (docstring only; the code passes the value through)
  - sdk-python: A recorded `listByCompany` response from one test tenant (recorded with SDK 1.9.13, Python SDK cassette) returns `conditionType` as a JSON number.
  Impact: A caller following the Python docstring or the contract may send "0" where the Go SDK sends 0; the recorded read returns a number, but whether the API accepts a string on write is not documented. The Terraform provider documents both string forms as accepted for its own input, which says nothing about the API.

Not known (open gaps):
- Whether the v2 trusted-network API replaces v1 and shares its records [gap:zcc.api.trusted-networks-wire:v1-v2-coexistence]: settled by support-ticket or lab-test. Blocks: deciding whether a v1 and a v2 trusted network with the same name are the same object, and which family to automate against

Area: zcc.api, its subjects in references/_meta/spine/zcc/zcc.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.api.v2-wire.md (The ZCC v2 API: RESTful paths, offset paging and the list envelope)
- links-to references/_meta/text/zcc/zcc.sdk-python.return-shapes.md (What the Python SDK's ZCC methods return, and the ones that break the tuple convention)
- links-to references/_meta/text/zcc/zcc.terraform.field-fidelity.md (ZCC Terraform provider fields that are not sent, not read back, or collapsed)
- links-to references/_meta/text/zcc/zcc.terraform.trusted-network-backend.md (How the ZCC provider picks the v1 or v2 trusted-network API and converts between them)
- links-to references/_meta/text/zcc/zcc.trusted-networks.object.md (The Client Connector trusted network object and its v1 API)

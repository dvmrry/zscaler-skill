# The ZPA API from a client's side: paths, authentication, paging, limits and wire notes (zpa.api)
Also called: zpa api; zpa api overview; zpa api surface; how to call the zpa api

Endpoint lists, request and response schemas, and SDK method tables are generated from the OpenAPI specification and the SDKs: run `node scripts/kb.mjs surface <query>`. This subject family holds only the behavior around them.

**Calling the API.** Hosts, the `/zpa` prefix and API versions are in [ZPA API base paths: hosts, the /zpa prefix, v1 and v2 versions, userconfig and cbiconfig](kb:zpa.api.base-paths), signing in in [How a client authenticates to the ZPA API: OneAPI, legacy and government clouds](kb:zpa.api.authentication), paging and search in [ZPA list pagination, search syntax and client-side filtering](kb:zpa.api.pagination), and limits in [ZPA API rate limits](kb:zpa.api.rate-limits). Whether a write needs an activation step is in [Whether ZPA changes need an activation step](kb:zpa.api.activation). Which services each SDK covers is in [Which ZPA services the Go and Python SDKs cover differently, and the Go packages behind Python-only module names](kb:zpa.api.sdk-coverage), operations the Automate contract lacks are in [Create operations missing from the Automate contract for ZPA](kb:zpa.api.operation-inventory), and the older endpoints still in use are in [ZPA legacy endpoint wiring: shared paths, schedules, user codes and step-up levels](kb:zpa.api.legacy-endpoints).

**Wire notes by area.** Application segments: [Application segment wire behavior: what each SDK sends, drops and matches across the four segment kinds](kb:zpa.api.app-segments-wire). Server groups: [Server group and application server wire details: write responses, always-sent keys, nested fields and the extranet object](kb:zpa.api.server-groups-wire). App Connectors: [ZPA App Connector, group, schedule and version profile calls: what is sent and where the sources differ](kb:zpa.api.app-connectors-wire); Private Service Edges: [ZPA Private Service Edge and private cloud controller calls: what is sent and where the sources differ](kb:zpa.api.service-edges-wire); provisioning keys: [Provisioning key API: association types and update responses](kb:zpa.api.provisioning-keys-wire). Policy: [ZPA policy rule wire behavior: routes, request fields and ordering](kb:zpa.api.policy-wire). Identity: [IdP, SCIM and SAML attribute API: wire keys, types and the Go SCIM client](kb:zpa.api.idp-scim-wire); posture and trusted networks: [Posture profile and trusted network wire details the SDK models drop](kb:zpa.api.posture-trusted-networks-wire); client settings: [Client settings and managed browser profile: what the SDKs send and decode](kb:zpa.api.client-settings-wire); machine groups: [Machine group list scoping and vpnConnectedUsers wire details](kb:zpa.api.machine-groups-wire). Certificates: [Enrollment and Browser Access certificate API: wire keys, paths and client quirks](kb:zpa.api.certificates-wire). Privileged Remote Access: [What the SDKs send and receive for ZPA Privileged Remote Access objects](kb:zpa.api.pra-wire); Cloud Browser Isolation and AppProtection: [Cloud Browser Isolation and AppProtection API: paths, writes and version handling](kb:zpa.api.cbi-appprotection-wire). Log receivers: [What the SDKs and provider send for a ZPA log receiver (LSS)](kb:zpa.api.lss-wire). Microtenants: [What the SDKs send and receive for ZPA Microtenants](kb:zpa.api.microtenants-wire).

**Clients.** How the Python and Go SDKs behave is in [The Zscaler Python SDK against ZPA: where its behavior is described](kb:zpa.sdk-python), and the Terraform provider in [The ZPA Terraform provider: where its behavior is described](kb:zpa.terraform).

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds): The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zpa/zpa.api.activation.md (Whether ZPA changes need an activation step)
- links-to references/_meta/text/zpa/zpa.api.app-connectors-wire.md (ZPA App Connector, group, schedule and version profile calls: what is sent and where the sources differ)
- links-to references/_meta/text/zpa/zpa.api.app-segments-wire.md (Application segment wire behavior: what each SDK sends, drops and matches across the four segment kinds)
- links-to references/_meta/text/zpa/zpa.api.base-paths.md (ZPA API base paths: hosts, the /zpa prefix, v1 and v2 versions, userconfig and cbiconfig)
- links-to references/_meta/text/zpa/zpa.api.cbi-appprotection-wire.md (Cloud Browser Isolation and AppProtection API: paths, writes and version handling)
- links-to references/_meta/text/zpa/zpa.api.certificates-wire.md (Enrollment and Browser Access certificate API: wire keys, paths and client quirks)
- links-to references/_meta/text/zpa/zpa.api.client-settings-wire.md (Client settings and managed browser profile: what the SDKs send and decode)
- links-to references/_meta/text/zpa/zpa.api.idp-scim-wire.md (IdP, SCIM and SAML attribute API: wire keys, types and the Go SCIM client)
- links-to references/_meta/text/zpa/zpa.api.legacy-endpoints.md (ZPA legacy endpoint wiring: shared paths, schedules, user codes and step-up levels)
- links-to references/_meta/text/zpa/zpa.api.lss-wire.md (What the SDKs and provider send for a ZPA log receiver (LSS))
- links-to references/_meta/text/zpa/zpa.api.machine-groups-wire.md (Machine group list scoping and vpnConnectedUsers wire details)
- links-to references/_meta/text/zpa/zpa.api.microtenants-wire.md (What the SDKs send and receive for ZPA Microtenants)
- links-to references/_meta/text/zpa/zpa.api.operation-inventory.md (Create operations missing from the Automate contract for ZPA)
- links-to references/_meta/text/zpa/zpa.api.pagination.md (ZPA list pagination, search syntax and client-side filtering)
- links-to references/_meta/text/zpa/zpa.api.policy-wire.md (ZPA policy rule wire behavior: routes, request fields and ordering)
- links-to references/_meta/text/zpa/zpa.api.posture-trusted-networks-wire.md (Posture profile and trusted network wire details the SDK models drop)
- links-to references/_meta/text/zpa/zpa.api.pra-wire.md (What the SDKs send and receive for ZPA Privileged Remote Access objects)
- links-to references/_meta/text/zpa/zpa.api.provisioning-keys-wire.md (Provisioning key API: association types and update responses)
- links-to references/_meta/text/zpa/zpa.api.rate-limits.md (ZPA API rate limits)
- links-to references/_meta/text/zpa/zpa.api.sdk-coverage.md (Which ZPA services the Go and Python SDKs cover differently, and the Go packages behind Python-only module names)
- links-to references/_meta/text/zpa/zpa.api.server-groups-wire.md (Server group and application server wire details: write responses, always-sent keys, nested fields and the extranet object)
- links-to references/_meta/text/zpa/zpa.api.service-edges-wire.md (ZPA Private Service Edge and private cloud controller calls: what is sent and where the sources differ)
- links-to references/_meta/text/zpa/zpa.sdk-python.md (The Zscaler Python SDK against ZPA: where its behavior is described)
- links-to references/_meta/text/zpa/zpa.terraform.md (The ZPA Terraform provider: where its behavior is described)

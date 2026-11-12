# The ZCC API from a client's side: hosts, sign-in, limits, conventions and wire notes (zcc.api)
Also called: zcc api; zcc api overview; zcc api surface; client connector api; how to call the zcc api; zcc papi

Endpoint lists, HTTP methods, query parameters and request and response fields are generated from the captured contract and the SDKs: run `node scripts/kb.mjs surface zcc` and read `vendor/zscaler-api-specs/automate-zscaler/openapi/zcc.openapi.json`. This subject family holds only the behavior around them.

**Calling the API.** Hosts and signing in, on the OneAPI gateway or the legacy login, are in [Reaching and signing in to the ZCC API: OneAPI gateway and legacy login](kb:zcc.api.authentication). Limits and how the clients back off are in [ZCC API rate limits: 100 calls an hour, 3 a day for downloads, and how the SDKs back off](kb:zcc.api.rate-limits). Casing, query parameters, caching and status codes are in [Conventions of the ZCC v1 API: casing, query parameters, caching, status codes](kb:zcc.api.conventions). The RESTful v2 families and their paging are in [The ZCC v2 API: RESTful paths, offset paging and the list envelope](kb:zcc.api.v2-wire).

**Wire notes by area.** Web policies (app profiles): [What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate](kb:zcc.api.web-policy-wire). Trusted networks, v1 and v2: [What goes on the wire for ZCC trusted networks: the v1 webTrustedNetwork and v2 trusted-networks APIs](kb:zcc.api.trusted-networks-wire). Forwarding profiles and the fail-open policy: [ZCC forwarding profile calls: integer codes, read and write types, and where the contract and SDKs differ](kb:zcc.api.forwarding-profile-wire). Devices, downloads and device secrets: [ZCC device endpoints on the wire: removal, CSV downloads, OTPs and app profile passwords](kb:zcc.api.devices-wire). Admin users and admin sync: [ZCC admin users on the wire: the admin sync operations and the serviceType field](kb:zcc.api.admin-users-wire). Company info and password management: [ZCC company info and password management calls: who may read, and which clients can write](kb:zcc.api.company-wire). Web privacy (User Privacy) settings: [ZCC web privacy (User Privacy) calls: string flags, fields the contract lacks, and key casing](kb:zcc.api.web-privacy-wire). Entitlements: [ZCC entitlement calls: response and update body shapes](kb:zcc.api.entitlements-wire).

**Clients.** The Go SDK's legacy-mode routing defect is in [ZCC SDK calls in legacy-client mode routed to the ZIA client](kb:zcc.sdk-go.legacy-routing), and the Terraform provider's handling of forwarding-profile and other fields is in [ZCC Terraform provider fields that are not sent, not read back, or collapsed](kb:zcc.terraform.field-fidelity).

Area: zcc.api, its subjects in references/_meta/spine/zcc/zcc.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.api.admin-users-wire.md (ZCC admin users on the wire: the admin sync operations and the serviceType field)
- links-to references/_meta/text/zcc/zcc.api.authentication.md (Reaching and signing in to the ZCC API: OneAPI gateway and legacy login)
- links-to references/_meta/text/zcc/zcc.api.company-wire.md (ZCC company info and password management calls: who may read, and which clients can write)
- links-to references/_meta/text/zcc/zcc.api.conventions.md (Conventions of the ZCC v1 API: casing, query parameters, caching, status codes)
- links-to references/_meta/text/zcc/zcc.api.devices-wire.md (ZCC device endpoints on the wire: removal, CSV downloads, OTPs and app profile passwords)
- links-to references/_meta/text/zcc/zcc.api.entitlements-wire.md (ZCC entitlement calls: response and update body shapes)
- links-to references/_meta/text/zcc/zcc.api.forwarding-profile-wire.md (ZCC forwarding profile calls: integer codes, read and write types, and where the contract and SDKs differ)
- links-to references/_meta/text/zcc/zcc.api.rate-limits.md (ZCC API rate limits: 100 calls an hour, 3 a day for downloads, and how the SDKs back off)
- links-to references/_meta/text/zcc/zcc.api.trusted-networks-wire.md (What goes on the wire for ZCC trusted networks: the v1 webTrustedNetwork and v2 trusted-networks APIs)
- links-to references/_meta/text/zcc/zcc.api.v2-wire.md (The ZCC v2 API: RESTful paths, offset paging and the list envelope)
- links-to references/_meta/text/zcc/zcc.api.web-policy-wire.md (What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate)
- links-to references/_meta/text/zcc/zcc.api.web-privacy-wire.md (ZCC web privacy (User Privacy) calls: string flags, fields the contract lacks, and key casing)
- links-to references/_meta/text/zcc/zcc.sdk-go.legacy-routing.md (ZCC SDK calls in legacy-client mode routed to the ZIA client)
- links-to references/_meta/text/zcc/zcc.terraform.field-fidelity.md (ZCC Terraform provider fields that are not sent, not read back, or collapsed)

# The Zscaler SDKs against ZCC: where their behavior is described (zcc.sdk-python)
Also called: zcc python sdk; zscaler-sdk-python zcc; zcc sdk; client.zcc; zcc go sdk

Method tables are generated: run `node scripts/kb.mjs surface <query>` for a module's methods, a Go package's functions and the endpoints they call. The surface has no method parameters: filters such as `list_devices`' `username`, `list_admin_users`' `user_type`, the web policy `list_by_company`'s `search_type`, the `search` filter on the forwarding-profile and web-app-service lists, and `get_passwords`' `username` and `os_type` are documented in each method's docstring in the vendored SDK. These subjects hold the client behavior around them; the API itself is in [The ZCC API from a client's side: hosts, sign-in, limits, conventions and wire notes](kb:zcc.api).

**Python client.** The OneAPI and legacy clients are in [The Python SDK's two ZCC clients: OneAPI service and legacy helper](kb:zcc.sdk-python.client-configuration), paging in [Paging through ZCC lists with the Python SDK](kb:zcc.sdk-python.pagination), key casing and the parameter mapper in [How the Python SDK names ZCC keys on the wire: the model serializer and the parameter mapper](kb:zcc.sdk-python.wire-keys), and return values in [What the Python SDK's ZCC methods return, and the ones that break the tuple convention](kb:zcc.sdk-python.return-shapes).

**Go SDK.** The request helper and the v1 and v2 paging helpers are in [How the Go SDK sends ZCC requests and pages v1 and v2 lists](kb:zcc.sdk-go.paging-and-requests), and legacy-mode routing in [ZCC SDK calls in legacy-client mode routed to the ZIA client](kb:zcc.sdk-go.legacy-routing).

**By area.** Forwarding profiles: [ZCC forwarding profile calls: integer codes, read and write types, and where the contract and SDKs differ](kb:zcc.api.forwarding-profile-wire). Web policies: [What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate](kb:zcc.api.web-policy-wire). Trusted networks: [What goes on the wire for ZCC trusted networks: the v1 webTrustedNetwork and v2 trusted-networks APIs](kb:zcc.api.trusted-networks-wire). Web privacy: [ZCC web privacy (User Privacy) calls: string flags, fields the contract lacks, and key casing](kb:zcc.api.web-privacy-wire). Company info and password management: [ZCC company info and password management calls: who may read, and which clients can write](kb:zcc.api.company-wire). Entitlements: [The Python SDK's ZCC entitlement methods: what they read and why they cannot write](kb:zcc.sdk-python.entitlements). Device removal: [Removing devices and machine tunnels through the API and SDKs](kb:zcc.devices.removal-api).

Area: zcc.sdk-python, its subjects in references/_meta/spine/zcc/zcc.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.api.md (The ZCC API from a client's side: hosts, sign-in, limits, conventions and wire notes)
- links-to references/_meta/text/zcc/zcc.api.company-wire.md (ZCC company info and password management calls: who may read, and which clients can write)
- links-to references/_meta/text/zcc/zcc.api.forwarding-profile-wire.md (ZCC forwarding profile calls: integer codes, read and write types, and where the contract and SDKs differ)
- links-to references/_meta/text/zcc/zcc.api.trusted-networks-wire.md (What goes on the wire for ZCC trusted networks: the v1 webTrustedNetwork and v2 trusted-networks APIs)
- links-to references/_meta/text/zcc/zcc.api.web-policy-wire.md (What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate)
- links-to references/_meta/text/zcc/zcc.api.web-privacy-wire.md (ZCC web privacy (User Privacy) calls: string flags, fields the contract lacks, and key casing)
- links-to references/_meta/text/zcc/zcc.devices.removal-api.md (Removing devices and machine tunnels through the API and SDKs)
- links-to references/_meta/text/zcc/zcc.sdk-go.legacy-routing.md (ZCC SDK calls in legacy-client mode routed to the ZIA client)
- links-to references/_meta/text/zcc/zcc.sdk-go.paging-and-requests.md (How the Go SDK sends ZCC requests and pages v1 and v2 lists)
- links-to references/_meta/text/zcc/zcc.sdk-python.client-configuration.md (The Python SDK's two ZCC clients: OneAPI service and legacy helper)
- links-to references/_meta/text/zcc/zcc.sdk-python.entitlements.md (The Python SDK's ZCC entitlement methods: what they read and why they cannot write)
- links-to references/_meta/text/zcc/zcc.sdk-python.pagination.md (Paging through ZCC lists with the Python SDK)
- links-to references/_meta/text/zcc/zcc.sdk-python.return-shapes.md (What the Python SDK's ZCC methods return, and the ones that break the tuple convention)
- links-to references/_meta/text/zcc/zcc.sdk-python.wire-keys.md (How the Python SDK names ZCC keys on the wire: the model serializer and the parameter mapper)

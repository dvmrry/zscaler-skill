# Machine group list scoping and vpnConnectedUsers wire details (zpa.api.machine-groups-wire)
Also called: machine group microtenantId 0; vpnConnectedUsers; NPClient UserName; default microtenant query parameter

Machine group and VPN-connected-user API details beyond the read-only surface already described in [Machine groups through the ZPA API, SDKs and Terraform](kb:zpa.machine-groups.api-surface). The machine-group model gaps, the signingCert versus enrollmentCert divergence and the summary endpoint are in that subject.

The OpenAPI machine group list says microtenantId is 0 for the Default microtenant and null for Customer data microtenant. The Python list_machine_groups maps microtenant_id only when it is truthy, but the executor camel-cases ZPA query keys, so a caller's `microtenant_id` reaches the wire as `microtenantId` whether or not the module maps it. A falsy value is replaced by the client's configured microtenantId when one is set. The Go pagination struct omits microtenantId only when its pointer is nil. [zpa.api.machine-groups-wire:microtenant-default-zero]

## VPN connected users

The Go np_client service passes an empty common.Filter to the paging helper in both GetAll and GetByName for vpnConnectedUsers, so neither function puts the service's microtenant ID in the filter, and the helper, which takes the client and the filter rather than the service, has no service to read it from. The Python NPNClientControllerAPI list_vpn_connected_users forwards query_params without the microtenant_id mapping that list_machine_groups performs, but Python scopes it anyway, because the executor camel-cases microtenant_id and falls back to the client's configured microtenantId. [zpa.api.machine-groups-wire:np-client-no-microtenant-filter] The Go NPClient struct types id, modifiedBy, modifiedTime, creationTime, deviceState and vpnServiceEdgeId as int (the App Connector struct, for example, types id, modifiedBy, modifiedTime and creationTime as string) and tags the user name key `UserName` with a capital U and N. [zpa.api.machine-groups-wire:np-client-wire-shape] The console VPN Connected Users page is in [VPN Connected Users and the VPN Diagnostics pages: user logs, traffic flow logs and access policy data](kb:zpa.vpn.diagnostics).

What to check:
1. Whether a Python machine group list for the Default microtenant (0) was overridden by the client's configured microtenantId.
2. Whether a vpnConnectedUsers read was expected to be microtenant-scoped, which the Go SDK does not do.

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- scoped-by references/_meta/text/zpa/zpa.microtenants.api-scoping.md (How an API call selects a Microtenant): The ZPA API reference describes the `microtenantId` query parameter on the application move operation as the Microtenant's unique identifier, where 0 is passed for the Default Microtenant and null for the customer data Microtenant. [zpa.microtenants.api-scoping:scope-param-values]
- links-to references/_meta/text/zpa/zpa.machine-groups.api-surface.md (Machine groups through the ZPA API, SDKs and Terraform)
- links-to references/_meta/text/zpa/zpa.vpn.diagnostics.md (VPN Connected Users and the VPN Diagnostics pages: user logs, traffic flow logs and access policy data)

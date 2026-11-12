# ZPA machine tunnels (zpa.machine-tunnels)
Also called: machine tunnel; pre-login tunnel; pre-windows login; zpn_client_type_machine_tunnel; machine tunnel not connecting; machine authentication

"Why does or doesn't this device have a ZPA connection before login?" takes five questions in order. The tunnel transport belongs to Zscaler Client Connector and is covered in [Z-Tunnel](kb:zcc.z-tunnel) and [ZCC forwarding profiles](kb:zcc.forwarding-profiles).

1. **Is a machine tunnel possible and switched on at all?** Platforms, the tenant-wide switch and the authentication options: [What a ZPA machine tunnel needs before it can connect](kb:zpa.machine-tunnels.requirements).
2. **Does the device hold a valid key for a machine group?** [Machine provisioning keys for ZPA machine tunnels](kb:zpa.machine-tunnels.provisioning-keys), with the group itself in [ZPA machine groups](kb:zpa.machine-groups).
3. **Does an access rule cover a machine tunnel session?** The Machine Tunnel client type and what each policy type accepts: [The Machine Tunnel client type in ZPA policy](kb:zpa.machine-tunnels.client-type-policy), with group conditions in [Using a machine group in a ZPA policy rule](kb:zpa.machine-groups.policy-use).
4. **Do posture checks apply to the pre-login tunnel?** [Device posture on the ZPA machine tunnel](kb:zpa.machine-tunnels.posture).
5. **What does the tunnel look like from the Client Connector side?** Status values, search and removal: [Machine tunnel status and removal in Client Connector](kb:zpa.machine-tunnels.monitoring).

Area: zpa.machine-tunnels, its subjects in references/_meta/spine/zpa/zpa.machine-tunnels.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.machine-groups.md (ZPA machine groups): Using a machine tunnel takes four things: machine groups and machine provisioning keys configured in the Admin Console, the keys added to Zscaler Client Connector app profile rules for Windows or macOS, and the Private Access machine tunnel enabled for all. [zpa.machine-tunnels.requirements:components]
- interacts-with references/_meta/text/zpa/zpa.machine-tunnels.client-type-policy.md (The Machine Tunnel client type in ZPA policy): An access rule that selects only the Client Connector client type does not select Machine Tunnel, so a machine tunnel session is covered only by a rule that selects Machine Tunnel; a session no rule covers meets the default Block Access outcome. [zpa.machine-tunnels.client-type-policy:machine-tunnel-needs-own-rule]
- logged-in references/_meta/text/zpa/zpa.machine-tunnels.monitoring.md (Machine tunnel status and removal in Client Connector): A machine tunnel's status is Active, Inactive, Removed or Unregistered. Active, the default, means connected to Private Access before user login; Removed means the configuration was deleted or deactivated in the Admin Console; Unregistered means it is no longer connected to Zscaler services or policies. [zpa.machine-tunnels.monitoring:status-values]
- interacts-with references/_meta/text/zpa/zpa.machine-tunnels.posture.md (Device posture on the ZPA machine tunnel): An access policy can use posture profile criteria with the Machine Tunnel client type when the device runs Zscaler Client Connector 3.9 or later. [zpa.machine-tunnels.posture:policy-client-version]
- depends-on references/_meta/text/zpa/zpa.machine-tunnels.provisioning-keys.md (Machine provisioning keys for ZPA machine tunnels): Using a machine tunnel takes four things: machine groups and machine provisioning keys configured in the Admin Console, the keys added to Zscaler Client Connector app profile rules for Windows or macOS, and the Private Access machine tunnel enabled for all. [zpa.machine-tunnels.requirements:components]
- depends-on references/_meta/text/zcc/zcc.entitlements.zpa.md (Private Access entitlement and the machine tunnel switch): With Enable Machine Tunnel For All on, all users whose app profile has a machine token can connect to Private Access without being logged in, on Windows or macOS. [zcc.entitlements.zpa:machine-tunnel-for-all]
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.md (ZCC forwarding profiles)
- links-to references/_meta/text/zcc/zcc.z-tunnel.md (Z-Tunnel)
- links-to references/_meta/text/zpa/zpa.machine-groups.policy-use.md (Using a machine group in a ZPA policy rule)
- links-to references/_meta/text/zpa/zpa.machine-tunnels.requirements.md (What a ZPA machine tunnel needs before it can connect)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/client-types.md (config type)
- configured-via references/_meta/text/types/zpa/machine-groups.md (config type)

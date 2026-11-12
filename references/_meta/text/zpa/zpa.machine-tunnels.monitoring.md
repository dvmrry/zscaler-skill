# Machine tunnel status and removal in Client Connector (zpa.machine-tunnels.monitoring)
Also called: machine tunnel status; machine tunnel inactive; machine tunnel unregistered; remove machine tunnel; machine tunnel page; machine tunnel token; removeMachineTunnel

This subject covers the Machine Tunnel page and removal of machine tunnels. Device records in general: [ZCC enrolled devices](kb:zcc.devices).

**Status.** A machine tunnel's status is Active, Inactive, Removed or Unregistered. Active, the default, means connected to Private Access before user login; Removed means the configuration was deleted or deactivated in the Admin Console; Unregistered means it is no longer connected to Zscaler services or policies. [zpa.machine-tunnels.monitoring:status-values] Inactive covers: the tunnel was turned off by the admin, the device was off or off the network, the tunnel failed on connection or authentication, or the tunnel was not enabled for the device in Zscaler Service Entitlement. [zpa.machine-tunnels.monitoring:inactive-reasons]

**Finding a machine.** The Machine Tunnel page can be filtered by operating system and status and searched by hostname, machine tunnel token, hardware fingerprint or Zscaler Client Connector version. It lists hostname, OS type, device model, Client Connector version and status, shows the token for each machine, and exports the list as CSV. [zpa.machine-tunnels.monitoring:search-columns]

**Verifying a deployment.** After deploying the Machine Group, restarting, logging off or locking the computer returns to the Windows Login screen, where a successful Machine Tunnel deployment shows a Zscaler Diagnostics tab and Get Status shows the tunnel status. In the Admin Console, enrolled Machine Tunnels are listed and active ones appear on the Current Connected Users dashboard. [zpa.machine-tunnels.monitoring:verify-deployment]

**Removing one.** Machine tunnels are removed from the Admin Console with Delete from the Actions menu or the Delete icon. [zpa.machine-tunnels.monitoring:console-removal] Machine tunnel devices are removed through the Client Connector API with `POST /zcc/papi/public/v1/removeMachineTunnel`, whose body takes hostnames or a machine token. [zpa.machine-tunnels.monitoring:remove-api]

What to check:
1. Which status the tunnel shows and which Inactive reason fits the device.
2. Which search field finds the machine: hostname, token, fingerprint or version.
3. Which call removes a stale machine tunnel.

Area: zpa.machine-tunnels, its subjects in references/_meta/spine/zpa/zpa.machine-tunnels.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zcc/zcc.entitlements.zpa.md (Private Access entitlement and the machine tunnel switch), from zpa.machine-tunnels: With Enable Machine Tunnel For All on, all users whose app profile has a machine token can connect to Private Access without being logged in, on Windows or macOS. [zcc.entitlements.zpa:machine-tunnel-for-all]
- depends-on references/_meta/text/zpa/zpa.machine-groups.md (ZPA machine groups), from zpa.machine-tunnels: Using a machine tunnel takes four things: machine groups and machine provisioning keys configured in the Admin Console, the keys added to Zscaler Client Connector app profile rules for Windows or macOS, and the Private Access machine tunnel enabled for all. [zpa.machine-tunnels.requirements:components]
- interacts-with references/_meta/text/zpa/zpa.machine-tunnels.client-type-policy.md (The Machine Tunnel client type in ZPA policy), from zpa.machine-tunnels: An access rule that selects only the Client Connector client type does not select Machine Tunnel, so a machine tunnel session is covered only by a rule that selects Machine Tunnel; a session no rule covers meets the default Block Access outcome. [zpa.machine-tunnels.client-type-policy:machine-tunnel-needs-own-rule]
- interacts-with references/_meta/text/zpa/zpa.machine-tunnels.posture.md (Device posture on the ZPA machine tunnel), from zpa.machine-tunnels: An access policy can use posture profile criteria with the Machine Tunnel client type when the device runs Zscaler Client Connector 3.9 or later. [zpa.machine-tunnels.posture:policy-client-version]
- depends-on references/_meta/text/zpa/zpa.machine-tunnels.provisioning-keys.md (Machine provisioning keys for ZPA machine tunnels), from zpa.machine-tunnels: Using a machine tunnel takes four things: machine groups and machine provisioning keys configured in the Admin Console, the keys added to Zscaler Client Connector app profile rules for Windows or macOS, and the Private Access machine tunnel enabled for all. [zpa.machine-tunnels.requirements:components]
- links-to references/_meta/text/zcc/zcc.devices.md (ZCC enrolled devices)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/client-types.md (config type)
- see-also references/_meta/text/zpa/zpa.machine-tunnels.requirements.md (What a ZPA machine tunnel needs before it can connect)

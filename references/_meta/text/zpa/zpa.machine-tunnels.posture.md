# Device posture on the ZPA machine tunnel (zpa.machine-tunnels.posture)
Also called: apply to machine tunnel; posture profile machine tunnel; posture before login; applyToMachineTunnelEnabled; posture types for machine tunnel

This subject covers device posture on the pre-login machine tunnel.

**The setting.** A device posture profile has Apply to Windows Machine Tunnel and Apply to macOS Machine Tunnel settings. When selected, the posture type is evaluated for the pre-login Private Access machine tunnel; when not selected, it is evaluated only for Private Access and Internet & SaaS tunnels. [zpa.machine-tunnels.posture:apply-toggles] The ZPA posture profile object carries a boolean `applyToMachineTunnelEnabled`. [zpa.machine-tunnels.posture:api-field]

**Which checks.** On the Windows machine tunnel the posture types that apply are Client Certificate, Certificate Trust, File Path, Registry Key, Firewall, Full Disk Encryption, Domain Joined, AzureAD Domain Joined, Server Validated Client Certificate, OS Version and Zscaler Client Connector Version. [zpa.machine-tunnels.posture:windows-types] On the macOS machine tunnel the posture types that apply are CrowdStrike ZTA Score, Full Disk Encryption, File Path, Firewall, Domain Joined, OS Version and Zscaler Client Connector Version. [zpa.machine-tunnels.posture:macos-types]

**In policy.** An access policy can use posture profile criteria with the Machine Tunnel client type when the device runs Zscaler Client Connector 3.9 or later. [zpa.machine-tunnels.posture:policy-client-version] Posture profiles in general: [ZPA posture profiles](kb:zpa.posture-profiles).

What to check:
1. Whether the posture profile has the machine tunnel setting for the device's platform.
2. Whether the posture type is one that applies to the machine tunnel on that platform.
3. Whether the device runs a Client Connector version that supports posture criteria with the Machine Tunnel client type.

Area: zpa.machine-tunnels, its subjects in references/_meta/spine/zpa/zpa.machine-tunnels.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.machine-tunnels.client-type-policy.md (The Machine Tunnel client type in ZPA policy): An access policy can use posture profile criteria with the Machine Tunnel client type when the device runs Zscaler Client Connector 3.9 or later. [zpa.machine-tunnels.posture:policy-client-version]
- depends-on references/_meta/text/zcc/zcc.entitlements.zpa.md (Private Access entitlement and the machine tunnel switch), from zpa.machine-tunnels: With Enable Machine Tunnel For All on, all users whose app profile has a machine token can connect to Private Access without being logged in, on Windows or macOS. [zcc.entitlements.zpa:machine-tunnel-for-all]
- depends-on references/_meta/text/zpa/zpa.machine-groups.md (ZPA machine groups), from zpa.machine-tunnels: Using a machine tunnel takes four things: machine groups and machine provisioning keys configured in the Admin Console, the keys added to Zscaler Client Connector app profile rules for Windows or macOS, and the Private Access machine tunnel enabled for all. [zpa.machine-tunnels.requirements:components]
- logged-in references/_meta/text/zpa/zpa.machine-tunnels.monitoring.md (Machine tunnel status and removal in Client Connector), from zpa.machine-tunnels: A machine tunnel's status is Active, Inactive, Removed or Unregistered. Active, the default, means connected to Private Access before user login; Removed means the configuration was deleted or deactivated in the Admin Console; Unregistered means it is no longer connected to Zscaler services or policies. [zpa.machine-tunnels.monitoring:status-values]
- depends-on references/_meta/text/zpa/zpa.machine-tunnels.provisioning-keys.md (Machine provisioning keys for ZPA machine tunnels), from zpa.machine-tunnels: Using a machine tunnel takes four things: machine groups and machine provisioning keys configured in the Admin Console, the keys added to Zscaler Client Connector app profile rules for Windows or macOS, and the Private Access machine tunnel enabled for all. [zpa.machine-tunnels.requirements:components]
- depends-on references/_meta/text/zpa/zpa.posture-profiles.object-model.md (The ZPA posture profile object and where it comes from): The ZPA posture profile object carries a boolean `applyToMachineTunnelEnabled`. [zpa.machine-tunnels.posture:api-field]
- links-to references/_meta/text/zpa/zpa.posture-profiles.md (ZPA posture profiles)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/posture-profiles.md (config type)
- configured-via references/_meta/text/types/zpa/client-types.md (config type)
- see-also references/_meta/text/zpa/zpa.machine-tunnels.requirements.md (What a ZPA machine tunnel needs before it can connect)

# Client Connector in Azure desktops: Windows 365 Cloud PCs and Azure Virtual Desktop (zcc.install.azure-virtual-desktop)
Also called: zcc azure vm; zcc avd; azure virtual desktop zcc; windows virtual desktop zcc; wvd zcc; windows 365 cloud pc zcc; cloud pc rdp freeze; multi-session avd zcc; pooled host pool zcc; windows 365 & azure virtual desktop bypass

Client Connector runs inside an Azure desktop the user owns: a Windows 365 Cloud PC or a personal Azure Virtual Desktop VM. Forwarding traffic from server and container workloads is a different product, Cloud Connector: [Cloud Connector on Azure: deployment methods, prerequisites and provisioning](kb:cloud-connector.azure). The multi-session Windows agent for nonpersistent VDI hosts is a separate product: [Client Connector for VDI: the multi-session Windows agent that tunnels users' traffic to Cloud and Branch Connector](kb:cloud-connector.vdi).

## Which desktops can run it

In a Windows Virtual Desktop (WVD) host pool, Client Connector supports only single-session desktops: it runs on a personal Windows 10 Enterprise VM, and multisession is not supported. [zcc.install.azure-virtual-desktop:single-session] Client Connector is not supported on pooled (shared) host pool machines, which run a Windows 10 multi-session OS. [zcc.install.azure-virtual-desktop:pooled-unsupported] Pooled machines reach Zscaler by other means: a PAC file in the browsers (with a dedicated proxy port where needed), a virtual Cloud Connector, or a tunnel from a firewall or network device in Azure, such as an IPsec tunnel to ZIA from an Azure virtual network gateway. [zcc.install.azure-virtual-desktop:pooled-alternatives] Whether Azure Marketplace offers a ready-made Client Connector image is open [gap:zcc.install.azure-virtual-desktop:marketplace-image].

## Windows 365 Cloud PCs

- **Getting it onto the Cloud PC.** Client Connector reaches a Windows 365 Cloud PC either in a custom image, installed before the Cloud PC is provisioned, or through Intune after provisioning, with a custom or gallery image; Intune is Microsoft's recommended approach. [zcc.install.azure-virtual-desktop:w365-deploy]
- **The RDP bypass.** The RDP traffic used to reach a Cloud PC is bypassed from Client Connector onto a direct path by selecting Windows 365 & Azure Visual Desktop in the app profile's Predefined IP-Based Application Bypass. The predefined bypass includes the IP addresses used for Cloud PC health monitoring, the Azure Instance Metadata Service (IMDS) endpoint, and gateway addresses with the WindowsVirtualDesktop service tag from Public Azure. [zcc.install.azure-virtual-desktop:predefined-bypass] If the connecting client also uses Client Connector to optimize RDP traffic, Zscaler and Microsoft recommend the same bypasses on both the Cloud PC and the connecting client. [zcc.install.azure-virtual-desktop:bypass-both-ends] The exact addresses the bypass covers, including the Azure platform addresses, are open [gap:zcc.install.azure-virtual-desktop:fabric-addresses], and so is its version history [gap:zcc.install.azure-virtual-desktop:predefined-bypass-history].
- **Without it.** Without the bypass, the user's RDP session freezes while the connection drops and is re-established each time the user logs in to or out of Client Connector, turns Internet & SaaS off or on, or restarts the Internet & SaaS service. The session then works, because once the tunnel is up all inbound traffic, RDP included, flows through it. [zcc.install.azure-virtual-desktop:no-bypass-freeze]
- **With strict enforcement.** When Client Connector is installed in strict enforcement mode on a Cloud PC, the policy named in POLICYTOKEN must carry these bypasses, or users lose access to the Cloud PC; once access is lost, the only way back is restoring a previous snapshot. [zcc.install.azure-virtual-desktop:strict-snapshot] Strict enforcement itself: [Strict enforcement, the policy token, and the fail-close configuration](kb:zcc.install.strict-enforcement).

## Personal AVD host pools (deployment guide)

The Azure deployment guide describes Tunnel-1 as forwarding only HTTP and HTTPS to ZIA, with other traffic sent direct, and Tunnel-2 as forwarding all TCP, UDP and ICMP traffic; Tunnel-2 is the mode for Cloud Firewall or the standard L4 firewall. [zcc.install.azure-virtual-desktop:guide-tunnel-modes] Whether a private (personal) AVD VM runs Client Connector or a pooled VM uses a PAC file, bypasses keep traffic away from Zscaler and keep control traffic local to Azure. For Client Connector the guide puts them in PAC files: for Tunnel-1 an application PAC file as the app profile's Custom PAC URL; for Tunnel-2 that application PAC plus a forwarding profile PAC with the same bypasses. [zcc.install.azure-virtual-desktop:guide-pac-bypass] Whether Z-Tunnel 2.0 needs IP-based rather than PAC bypasses for RDP's UDP path is open [gap:zcc.install.azure-virtual-desktop:rdp-udp-z-tunnel-2].

## Machine tunnels

Pre-login Private Access for a Windows desktop is a machine tunnel; what it needs, how it authenticates and how its status reads are in [ZPA machine tunnels](kb:zpa.machine-tunnels), with the requirements in [What a ZPA machine tunnel needs before it can connect](kb:zpa.machine-tunnels.requirements), status values in [Machine tunnel status and removal in Client Connector](kb:zpa.machine-tunnels.monitoring), provisioning keys in [Machine provisioning keys for ZPA machine tunnels](kb:zpa.machine-tunnels.provisioning-keys) and machine groups in [What a ZPA machine group is and how machines join it](kb:zpa.machine-groups.definition). The tenant-wide switch that enables them is in [With Enable Machine Tunnel For All on, all users whose app profile has a machine token can connect to Private Access without being logged in, on Windows or macOS.](kb:zcc.entitlements.zpa:machine-tunnel-for-all), and removing a machine tunnel through the API in [Removing devices and machine tunnels through the API and SDKs](kb:zcc.devices.removal-api).

## Not covered by any source

- Trusted network criteria inside an Azure VM [gap:zcc.install.azure-virtual-desktop:azure-trusted-network].
- Start-up order against the Azure Guest Agent [gap:zcc.install.azure-virtual-desktop:boot-ordering].
- Azure NAT Gateway with several public IPs and Z-Tunnel 2.0 [gap:zcc.install.azure-virtual-desktop:nat-gateway-multi-ip].
- Accelerated Networking and the Z-Tunnel 2.0 MTU [gap:zcc.install.azure-virtual-desktop:accelerated-networking-mtu].
- Device records left by short-lived personal hosts [gap:zcc.install.azure-virtual-desktop:ephemeral-host-records].
- VPN-trusted network detection behind an Azure VPN Gateway [gap:zcc.install.azure-virtual-desktop:azure-vpn-gateway-trust].

What to check:
1. Whether the host pool is personal (single-session) or pooled (multi-session); Client Connector is not supported on pooled hosts.
2. On a Cloud PC, whether the Windows 365 & Azure Virtual Desktop predefined bypass is selected in the app profile of both the Cloud PC and the connecting client.
3. With strict enforcement on a Cloud PC, whether the policy named by POLICYTOKEN carries the bypass, before installing.

Not known (open gaps):
- Whether Azure Marketplace has a Client Connector VM image [gap:zcc.install.azure-virtual-desktop:marketplace-image]: settled by source-read. Blocks: answers to requests for a Client Connector Marketplace image
- Which Azure platform addresses the predefined bypass covers [gap:zcc.install.azure-virtual-desktop:fabric-addresses]: settled by source-read or tenant-data. Blocks: whether a Cloud PC or AVD host needs bypasses beyond the predefined one
- When the Windows 365 and AVD predefined bypass appeared, and what it replaced [gap:zcc.install.azure-virtual-desktop:predefined-bypass-history]: settled by source-read. Blocks: advice for tenants on Client Connector versions without the predefined bypass
- How Z-Tunnel 2.0 treats RDP's UDP path without an IP bypass [gap:zcc.install.azure-virtual-desktop:rdp-udp-z-tunnel-2]: settled by lab-test or source-read. Blocks: choosing bypass types for AVD on Z-Tunnel 2.0
- Trusted network criteria for Client Connector inside an Azure VM [gap:zcc.install.azure-virtual-desktop:azure-trusted-network]: settled by lab-test. Blocks: forwarding profiles that should treat an Azure desktop as on-network
- Start-up order of Client Connector and the Azure agents [gap:zcc.install.azure-virtual-desktop:boot-ordering]: settled by lab-test. Blocks: diagnosing Azure VM extension failures after Client Connector is installed
- Azure NAT Gateway with several public IPs and Z-Tunnel 2.0 [gap:zcc.install.azure-virtual-desktop:nat-gateway-multi-ip]: settled by lab-test or source-read. Blocks: Z-Tunnel 2.0 designs that egress through Azure NAT Gateway
- Accelerated Networking and the Z-Tunnel 2.0 DTLS MTU [gap:zcc.install.azure-virtual-desktop:accelerated-networking-mtu]: settled by lab-test. Blocks: diagnosing throughput or fragmentation problems on Azure desktops
- Device records left by short-lived personal hosts [gap:zcc.install.azure-virtual-desktop:ephemeral-host-records]: settled by lab-test or tenant-data. Blocks: license and device-inventory hygiene for rebuilt hosts
- VPN-trusted network detection when the VPN is an Azure VPN Gateway [gap:zcc.install.azure-virtual-desktop:azure-vpn-gateway-trust]: settled by lab-test. Blocks: forwarding profile design for Azure desktops reached over a site-to-site VPN

Area: zcc.install, its subjects in references/_meta/spine/zcc/zcc.install.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.install.strict-enforcement.md (Strict enforcement, the policy token, and the fail-close configuration): When Client Connector is installed in strict enforcement mode on a Cloud PC, the policy named in POLICYTOKEN must carry these bypasses, or users lose access to the Cloud PC; once access is lost, the only way back is restoring a previous snapshot. [zcc.install.azure-virtual-desktop:strict-snapshot]
- links-to references/_meta/text/cloud-connector/cloud-connector.azure.md (Cloud Connector on Azure: deployment methods, prerequisites and provisioning)
- links-to references/_meta/text/cloud-connector/cloud-connector.vdi.md (Client Connector for VDI: the multi-session Windows agent that tunnels users' traffic to Cloud and Branch Connector)
- links-to references/_meta/text/zcc/zcc.devices.removal-api.md (Removing devices and machine tunnels through the API and SDKs)
- links-to references/_meta/text/zcc/zcc.entitlements.zpa.md (Private Access entitlement and the machine tunnel switch)
- links-to references/_meta/text/zpa/zpa.machine-groups.definition.md (What a ZPA machine group is and how machines join it)
- links-to references/_meta/text/zpa/zpa.machine-tunnels.md (ZPA machine tunnels)
- links-to references/_meta/text/zpa/zpa.machine-tunnels.monitoring.md (Machine tunnel status and removal in Client Connector)
- links-to references/_meta/text/zpa/zpa.machine-tunnels.provisioning-keys.md (Machine provisioning keys for ZPA machine tunnels)
- links-to references/_meta/text/zpa/zpa.machine-tunnels.requirements.md (What a ZPA machine tunnel needs before it can connect)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zcc/predefined-ip-apps.md (config type)
- see-also references/_meta/text/zcc/zcc.install.md (Client Connector install parameters and deployment)
- see-also references/_meta/text/zia/zia.traffic-forwarding.zcc.md (Client Connector as a forwarding method: benefits, limits and Z-Tunnel modes)

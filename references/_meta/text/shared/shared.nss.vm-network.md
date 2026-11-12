# NSS VM interfaces and firewall requirements: management and service roles, outbound-only, no SSL inspection (shared.nss.vm-network)
Also called: nss management interface; nss service interface; nss firewall requirements; nss ssl inspection exclusion; nss nat; nss mtls

The AWS guide says the first network interface is the management IP address, used for control connections to the Zscaler cloud and for SSH to the NSS VM, and the second is the service IP address, used for data connections to the Zscaler cloud and to the SIEM. A separate IP address can be defined for the SSH connection. [shared.nss.vm-network:two-interfaces]

**Reaching the Zscaler cloud.** The NSS instance is deployed behind a VM network security group and requires only outbound connections to the Zscaler cloud, with no inbound connections from the Zscaler cloud. Firewall requirements for a given account are at config.zscaler.com/<Zscaler Cloud Name>/nss, and the IP address ranges keep the service unaffected by future Zscaler cloud expansion. [shared.nss.vm-network:outbound-only] Communication from the NSS instance to the Zscaler cloud must be excluded from SSL inspection to ensure that the NSS can authenticate to the Nanolog cluster using Mutual Transport Layer Security (mTLS). [shared.nss.vm-network:no-ssl-inspection] Zscaler does not recommend or support forwarding outbound traffic from the NSS to or through the Public Service Edge for Internet Access (ZIA), as this can result in networking, latency, and administration issues. [shared.nss.vm-network:not-through-zia] The AWS guide says the two elastic IPs are not required when using a NAT, which works correctly as long as it has sufficient network bandwidth. [shared.nss.vm-network:nat]

**Reaching the VM.** To connect to the EC2 instance via SSH, port 22 must be open for inbound connections, and in production only a specific IP address or range of addresses should be authorized, not 0.0.0.0. [shared.nss.vm-network:ssh-inbound] The vSphere guide says internal IP addresses are allowed, and the management IP address and service IP address can be on different subnets, as long as the DNS server can be reached on both subnets. [shared.nss.vm-network:subnets-dns]

**More interfaces.** A second management or service interface is in [Advanced NSS VM settings: extra interfaces, local NTP, explicit proxy, hostname and SSH](kb:shared.nss.vm-advanced-settings).

Area: shared.nss, its subjects in references/_meta/spine/shared/shared.nss.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.nss.vm-advanced-settings.md (Advanced NSS VM settings: extra interfaces, local NTP, explicit proxy, hostname and SSH)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.nss.md (Nanolog Streaming Service (NSS): how ZIA logs leave the Zscaler cloud)
- see-also references/_meta/text/shared/shared.nss.servers.md (NSS servers: the VM record, its certificate, platforms and Nanolog capacity)
- see-also references/_meta/text/shared/shared.nss.vm-platforms.md (Deploying the NSS VM on AWS, GCP, Azure, Hyper-V, Nutanix and vSphere)
- see-also references/_meta/text/shared/shared.nss.vm-operations.md (Operating and troubleshooting a deployed NSS VM: the nss command set, error codes and connection checks)

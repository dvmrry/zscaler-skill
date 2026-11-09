# Deploying the NSS VM on AWS, GCP, Azure, Hyper-V, Nutanix and vSphere (shared.nss.vm-platforms)
Also called: nss deployment guide; nss on aws; nss on gcp; nss on azure; nss on hyper-v; nss on nutanix; nss on vsphere; zsos42; zscaleros 42

A new or clean NSS deployment requires a VM image running ZscalerOS version 42. [shared.nss.vm-platforms:zscaleros-42]

**Amazon Web Services.** On AWS the NSS runs on an EC2 instance; the guide selects AWS Marketplace AMIs, searches for zsos42 and selects the Zscaler NSS (ZSOS42) AMI. [shared.nss.vm-platforms:aws-ami] On AWS the NSS needs a second interface (eth1) in the same subnet as the first (eth0). Auto-assign IP can only be assigned to instances with one network interface. Second management or service network interfaces are currently not supported in the NSS over AWS deployment. [shared.nss.vm-platforms:aws-interfaces] On AWS, General purpose SSD (gp3) is recommended and Magnetic (standard) is sufficient. The admin logs in over SSH as zsroot with the key pair's PEM file. Zscaler's EC2 instance type recommendation is based on the expected number of transactions, users and the most economical option, and if the recommended type cannot be selected, the guide says to contact Zscaler Support. [shared.nss.vm-platforms:aws-storage-and-login]

**Google Cloud Platform.** On GCP, access to the Zscaler-owned NSS VMDK file comes from Zscaler Support. A TSV file contains the signed URL of the VMDK file, which expires after 24 hours, and the guide imports the file into Compute Engine as a custom image with Skip OS adaptation enabled. [shared.nss.vm-platforms:gcp-image] On GCP, Zscaler recommends an MTU of 1460. The instance has IP forwarding enabled and the VirtIO network interface card, and the management interface is assigned to vtnet0 and the service interface to vtnet1. [shared.nss.vm-platforms:gcp-network] On GCP, if the NSS connection with the Zscaler CA fluctuates, the guide gives the command `ifconfig vtnet1 -rxcsum -txcsum -rxcsum6 -txcsum6 -tso4`. It also gives an `smnet_route` line for the SIEM, and Zscaler recommends a custom route in the sc.conf file if the downstream SIEM IP address is in the same subnet. [shared.nss.vm-platforms:gcp-troubleshooting]

**Microsoft Azure.** On Azure, the NSS VHD SAS token and the Azure VM instance type recommendations come from Zscaler Support. The OS-disk VHD znss_5_2_osdisk.vhd is published at Zscaler storage accounts for USA, Europe and Australia, is approximately 500 GB, and the script that copies it then creates an Azure Managed Image. [shared.nss.vm-platforms:azure-image] On Azure only XEON CPUs are supported, the disk size is changed to 512 GiB, and a second network interface is attached after the VM is created. The NSS configuration steps run over an SSH terminal connection that must use basic authentication with zsroot/zsroot, and Zscaler recommends restarting the VM externally from the Azure Portal. [shared.nss.vm-platforms:azure-vm] Zscaler's own ARM template is in [Zscaler's ARM template for an NSS VM in Azure](kb:shared.nss.azure-arm-template).

**Hyper-V.** On Hyper-V the NSS VHDX is downloaded with Download NSS Virtual Appliance and the VM is Generation 1. At least two network adapters are added, one for management and one for service, and the guide's table lists hn2 and hn3 as optional second management and second service addresses. [shared.nss.vm-platforms:hyperv] The guides disagree on whether a second management or service interface is available [divergence:shared.nss.vm-platforms:extra-interfaces-scope]: [Advanced NSS VM settings: extra interfaces, local NTP, explicit proxy, hostname and SSH](kb:shared.nss.vm-advanced-settings).

**Nutanix.** On Nutanix the image downloaded from the console is uploaded with Image Type DISK, and the VM disk uses the operation Clone from Image Service on the SCSI bus. [shared.nss.vm-platforms:nutanix]

**VMware vSphere.** On vSphere the NSS OVA is downloaded from the console and the hypervisor is VMware ESX/ESXi v5.0 and later. The first network adapter em0 is the management IP address and the second em1 the service IP address. The default login credentials differ from those of NSS VM versions earlier than 4.2.1, and Zscaler strongly recommends changing the default password with passwd. [shared.nss.vm-platforms:vsphere]

**Next.** Memory, CPU and disk are in [NSS VM specs: cores, memory by user count, disk, bandwidth and the console's sizing inputs](kb:shared.nss.vm-sizing), interface roles and firewall rules in [NSS VM interfaces and firewall requirements: management and service roles, outbound-only, no SSL inspection](kb:shared.nss.vm-network), and the `nss` command set in [Operating and troubleshooting a deployed NSS VM: the nss command set, error codes and connection checks](kb:shared.nss.vm-operations).

Sources disagree (name both sides):
- The vendor docs disagree on whether a second management or service interface exists outside vSphere. [divergence:shared.nss.vm-platforms:extra-interfaces-scope]
  - zscaler-help: The advanced settings article limits its first three sections, second management interface, second service interface and additional interfaces from the console, to vSphere.
  - zscaler-help: The Hyper-V guide lists an optional hn2 adapter for a second management IP address, and hn3 for a second service address.
  - zscaler-help: The AWS guide says second management or service interfaces are not supported on AWS.
  Impact: Whether a Hyper-V NSS can use a second management or service interface cannot be settled from the vendor text; the vSphere-only reading and the Hyper-V table conflict.

Area: shared.nss, its subjects in references/_meta/spine/shared/shared.nss.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.nss.azure-arm-template.md (Zscaler's ARM template for an NSS VM in Azure)
- links-to references/_meta/text/shared/shared.nss.vm-advanced-settings.md (Advanced NSS VM settings: extra interfaces, local NTP, explicit proxy, hostname and SSH)
- links-to references/_meta/text/shared/shared.nss.vm-network.md (NSS VM interfaces and firewall requirements: management and service roles, outbound-only, no SSL inspection)
- links-to references/_meta/text/shared/shared.nss.vm-operations.md (Operating and troubleshooting a deployed NSS VM: the nss command set, error codes and connection checks)
- links-to references/_meta/text/shared/shared.nss.vm-sizing.md (NSS VM specs: cores, memory by user count, disk, bandwidth and the console's sizing inputs)

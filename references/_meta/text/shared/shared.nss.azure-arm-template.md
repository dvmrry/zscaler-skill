# Zscaler's ARM template for an NSS VM in Azure (shared.nss.azure-arm-template)
Also called: nss azure arm template; nss-azure-deploy; znss vhd sas token; nss vhd; deploy nss in azure; nss azure vm size; znssprod; nss azure government

For VM-based NSS on Azure ([NSS servers: the VM record, its certificate, platforms and Nanolog capacity](kb:shared.nss.servers)), Zscaler publishes an Azure Resource Manager template. It builds the NSS VM and its networking, and leaves the NSS server record, certificate and feeds to the Admin Console ([NSS feeds: limits, log types, filters and the output format string](kb:shared.nss.feeds)).

**What it builds.** The NSS ARM template creates two network interfaces (management and service), a NAT gateway, two public IP addresses and a public IP prefix, a virtual network with two subnets, a network security group, a storage account, an automation account and one virtual machine. [shared.nss.azure-arm-template:creates] The NSS VM's primary interface is the management interface and carries a public IP address; the second interface is the service interface, on a private subnet behind a NAT Gateway. [shared.nss.azure-arm-template:interfaces]

**Before deploying.** Deployment needs an NSS VHD SAS token for the chosen region, obtained from Zscaler Support, and each VHD region requires its own dedicated SAS token. [shared.nss.azure-arm-template:sas-token] The VHD source region is selectable: znssprod (US Commercial), znssprodeu (Europe) and znssprodau (Australia) for commercial Azure, and zsgovnsstexas, zsgovnssarizona, zsgovnssiowa and zsgovnssvirginia for Azure Government; a government region in a commercial account is not supported and fails the deployment. [shared.nss.azure-arm-template:vhd-regions] In the template the management public IP (`<vmName>-MGMT-IP`) is declared with `publicIPAllocationMethod` `Dynamic` and no `sku`, while the service public IP (`<vmName>-SRVC-IP`) takes its `sku` from the `publicIpSku` parameter, whose default is `Standard`, and is `Static`. Issue #12 reports that selecting a Standard SKU still fails at the management IP with the Azure error that no more than 0 IPv4 Basic SKU public IP addresses can be created for the subscription in that region; it was open when captured. [shared.nss.azure-arm-template:mgmt-ip-no-sku] Whether it can be deployed where Basic SKU addresses are unavailable is open [gap:shared.nss.azure-arm-template:mgmt-ip-basic-sku].

**Sizing and timing.** The template's allowed VM sizes are Standard_D2_v4 (default, 2 vCPUs and 8 GB), Standard_D4_v4 (4 vCPUs, 16 GB), Standard_D8_v4 (8 vCPUs, 32 GB) and Standard_D16_v4 (16 vCPUs, 64 GB). [shared.nss.azure-arm-template:vm-sizes] The template uses an Azure automation account runbook to copy the new NSS OS disk into the new or existing storage account, which takes about 20 to 30 minutes because the VHD is about 500 GB or more; the deployment must not be cancelled once started. [shared.nss.azure-arm-template:disk-copy]

**Security.** The template launches NSS but the operator must modify the network security group to secure inbound connections; the sshSourceAddressPrefix parameter defaults to '*', which allows SSH from any IP and is not recommended for production. [shared.nss.azure-arm-template:nsg-open]

**Version and support.** Release 1.0.5 of the template (December 3, 2025) was updated to support NSS VHD image 5.2.0, and the template's source VHD file name is znss_5_2_osdisk.vhd. [shared.nss.azure-arm-template:image-version] Support for the ARM template is exclusively through GitHub issue tracking on its repository. [shared.nss.azure-arm-template:support]

What to check:
1. Whether the deployed NSS VM's inbound access has been restricted from the template's open default.
2. Which VHD region and SAS token a deployment needs, especially for Azure Government.
3. Whether the target subscription and region allow Basic SKU public IP addresses, because the template's management IP is created without a SKU.

Not known (open gaps):
- Whether the management public IP can be deployed in a subscription without Basic SKU quota [gap:shared.nss.azure-arm-template:mgmt-ip-basic-sku]: settled by source-read or tenant-data. Blocks: deploying the NSS template into a subscription and region with no Basic SKU public IP quota

Area: shared.nss, its subjects in references/_meta/spine/shared/shared.nss.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.nss.servers.md (NSS servers: the VM record, its certificate, platforms and Nanolog capacity): An NSS server is the representation of the NSS VM in the Admin Console; after a server is created, Zscaler issues a client certificate and private key to install on the NSS VM so that it can authenticate to the Zscaler service. [shared.nss.servers:server-record]
- links-to references/_meta/text/shared/shared.nss.feeds.md (NSS feeds: limits, log types, filters and the output format string)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.nss.md (Nanolog Streaming Service (NSS): how ZIA logs leave the Zscaler cloud)
- see-also references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs)

# NSS VM specs: cores, memory by user count, disk, bandwidth and the console's sizing inputs (shared.nss.vm-sizing)
Also called: nss vm size; nss memory per user; nss instance type; nss sizing; nss vm specs; nss bandwidth

In the AWS guide's NSS Virtual Appliance Deployment window, the NSS for Web type takes Number of Users and Peak Transactions per Hour, and the NSS for Firewall type takes Number of Users, Peak Sessions per Hour and Peak DNS Requests per Hour. [shared.nss.vm-sizing:sizing-inputs] Which memory tier is current is not stated [gap:shared.nss.vm-sizing:sizing-source-of-truth].

**Cores.** The AWS guide lists dual-core instances and says the NSS uses one core for the control plane and another core for the data plane. [shared.nss.vm-sizing:cores-aws] The GCP and Nutanix guides state 2 vCPU (1 shared core) and a CPU speed of greater than or equal to 2.40GHz. [shared.nss.vm-sizing:cores-gcp-nutanix] The AWS prerequisite and its own table disagree [divergence:shared.nss.vm-sizing:aws-dual-core].

**Memory by user count.** The AWS guide gives 8 GB for up to 15K users, 16 GB for up to 40K users and 32 GB for up to 100K users. The vSphere guide has the 8 GB and 32 GB lines and says that with more than 100K users, contact Zscaler Support. [shared.nss.vm-sizing:memory-tiers-aws-vsphere] The Azure guide gives 8 GB for up to 8K users, 16 GB for up to 20K, 32 GB for up to 50K, 48 GB for up to 75K and 64 GB for more than 75K users. The Hyper-V guide has the 8K and more-than-75K lines. [shared.nss.vm-sizing:memory-tiers-other] The two sets differ for the same VM [divergence:shared.nss.vm-sizing:memory-tiers].

**Disk.** The AWS guide lists a 500 GB data disk and the Hyper-V guide a recommended disk size of 500 GB. [shared.nss.vm-sizing:disk] Azure's managed disk size is in [On Azure only XEON CPUs are supported, the disk size is changed to 512 GiB, and a second network interface is attached after the VM is created. The NSS configuration steps run over an SSH terminal connection that must use basic authentication with zsroot/zsroot, and Zscaler recommends restarting the VM externally from the Azure Portal.](kb:shared.nss.vm-platforms:azure-vm).

**Instance tables.** The AWS guide's EC2 table lists memory and cores per instance type: t2.large 8 GB and 2, t2.xlarge 16 GB and 4, t2.2xlarge 32 GB and 8, m4.large 8 GB and 2, m4.4xlarge 64 GB and 16, r4.large 15.25 GB and 2, r4.xlarge 30.5 GB and 4, r4.4xlarge 122 GB and 16, and c4.8xlarge 60 GB and 36. Zscaler's recommendation rests on the expected number of transactions, users, and the most economical option for the customer. [shared.nss.vm-sizing:aws-instance-table] The Azure guide's VM table lists Standard_D2_v4 with 8 GB, 2 cores and 1 GBPS, Standard_D4_v4 with 16 GB, 4 cores and 2 GBPS, Standard_D8_v4 with 32 GB, 8 cores and 4 GBPS, and Standard_D16_v4 with 64 GB, 16 cores and 8 GBPS. [shared.nss.vm-sizing:azure-vm-table] The Azure table matches Zscaler's ARM template: [Zscaler's ARM template for an NSS VM in Azure](kb:shared.nss.azure-arm-template).

**Bandwidth and buffer.** The AWS guide gives 11 Mbps for 10K users as an example average value for log download bandwidth. The recommended internet bandwidth is the peak bandwidth required to download the logs from the Nanolog in the Zscaler cloud, and if NSS is not allocated the bandwidth it needs, logs can accumulate in the Nanolog, which can result in frequent connection resets and the logs not being streamed. [shared.nss.vm-sizing:bandwidth] The amount of memory required to buffer the logs is incorporated into the VM spec computation, and the buffer size increases proportionally to the amount of RAM allocated to the NSS. [shared.nss.vm-sizing:buffer-in-sizing] What a buffer does during an outage is in [What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery](kb:shared.nss.reliability).

**MCAS.** For an MCAS NSS feed to perform optimally, the VM deployed for the NSS server requires a minimum of 8GB of RAM. [shared.nss.vm-sizing:mcas-ram]

Sources disagree (name both sides):
- The platform guides give different user-count tiers for the same NSS VM memory sizes. [divergence:shared.nss.vm-sizing:memory-tiers]
  - zscaler-help: The AWS guide, and the vSphere guide, give 8 GB for up to 15K users.
  - zscaler-help: The Hyper-V guide, like the Azure guide, gives 8 GB for up to 8K users.
  Impact: The same 8 GB VM is rated for 15K or 8K users depending on which platform guide is read, so a user count near that range needs the console's computed recommendation.
- The AWS guide describes its instances as dual-core, but its table lists instance types with more cores. [divergence:shared.nss.vm-sizing:aws-dual-core]
  - zscaler-help: The prerequisite says the instances are dual-core.
  - zscaler-help: The guide's own table lists c4.8xlarge with 60 GB and 36 cores.
  Impact: The table, not the prerequisite sentence, is the usable list of instance types, and the sentence cannot be read as a core count.

Not known (open gaps):
- Which memory-per-user tier set is current [gap:shared.nss.vm-sizing:sizing-source-of-truth]: settled by support-ticket or source-read. Blocks: telling an operator which VM size a given user count needs

Area: shared.nss, its subjects in references/_meta/spine/shared/shared.nss.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.nss.azure-arm-template.md (Zscaler's ARM template for an NSS VM in Azure)
- links-to references/_meta/text/shared/shared.nss.reliability.md (What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery)
- links-to references/_meta/text/shared/shared.nss.vm-platforms.md (Deploying the NSS VM on AWS, GCP, Azure, Hyper-V, Nutanix and vSphere)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.nss.md (Nanolog Streaming Service (NSS): how ZIA logs leave the Zscaler cloud)
- see-also references/_meta/text/shared/shared.nss.servers.md (NSS servers: the VM record, its certificate, platforms and Nanolog capacity)

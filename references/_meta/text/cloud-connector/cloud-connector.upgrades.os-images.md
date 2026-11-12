# Cloud Connector OS upgrades: redeployment and the ZscalerOS 24 end of support (cloud-connector.upgrades.os-images)
Also called: cloud connector os upgrade; zscaleros 24 end of support; zscaleros 42; zsos24; cloud connector redeploy image; branch connector zscaleros 24; cloud connector marketplace image

The weekly upgrade replaces connector software but not the operating system image. OS changes, including the move off ZscalerOS 24, need new deployments.

**OS images.** OS upgrades do not happen the way other packages do: after the latest images are posted in the public cloud for Cloud Connector, new deployments must be created for the OS upgrade. [cloud-connector.upgrades.os-images:os-not-in-place] For Branch Connector VMs the images are hosted in the Admin Console for download, and the devices are reprovisioned with the latest images. [cloud-connector.upgrades.os-images:branch-images] How physical Branch Connector appliances receive new images is open [gap:cloud-connector.upgrades.os-images:branch-hardware-images]. Whether scale-set members pick up new images or weekly upgrades as they are replaced is open [gap:cloud-connector.upgrades.os-images:scale-set-members].

**Identifying the version.** Zscaler's automation templates for the clouds always detect the latest virtual machine (VM) version when Cloud Connector is deployed, so as long as the latest automation templates are deployed there is no action required when deploying new VMs. [cloud-connector.upgrades.os-images:templates-detect-latest] The AWS version table has release rows ZS42.1.0 (March 10, 2026), ZS6.1.26.1 (November 14, 2023), ZS6.1.26.0 (October 19, 2023) and ZS6.1.24.6 (January 19, 2023), the last two with N/A in their Region and AMI ID columns; the version shows under Instance details in AMI ID and AMI name. [cloud-connector.upgrades.os-images:aws-ami-table] On Azure the version is read with az vm image show --urn zscaler1579058425289:zia_cloud_connector:zs_ser_gen1_cc_01:latest, and the Azure image table lists 42.1.0 released March 10, 2026. [cloud-connector.upgrades.os-images:azure-version] On GCP the version is shown in the Boot disk source image field under Basic information on the VM's Details tab, and the GCP image table lists zs-cc-ga-03092026 released March 10, 2026. [cloud-connector.upgrades.os-images:gcp-version] The module README dates the same GCP image differently [divergence:cloud-connector.upgrades.os-images:gcp-image-date]. Minimum images for the repository certificate renewal are in [The pkg-repo.zscaler.com certificate renewal: minimum images, autoscaling templates and why connectors might not update automatically](kb:cloud-connector.upgrades.repo-certificate).

**ZscalerOS 24, Cloud Connector.** The notice announced August 30, 2026 says Cloud Connector deployments with ZscalerOS 24 and earlier are no longer supported on AWS, Microsoft Azure and GCP, and directs them to migrate to ZscalerOS 42 or higher by November 30, 2026 to ensure service continuity; Cloud Connectors running ZscalerOS 42 need no action. [cloud-connector.upgrades.os-images:os24-cloud]

**ZscalerOS 24, Branch Connector.** The notice announced August 30, 2026 says Branch Connector appliances based on ZscalerOS 24 and earlier are no longer supported, both virtual appliances (VMware platforms, Linux KVM, Microsoft Hyper-V) and hardware appliances (ZT-400, ZT-600, ZT-800), and that affected deployments must upgrade to ZscalerOS 42 or higher by December 31, 2026 to ensure service continuity; Branch Connectors on ZscalerOS 42 need no action, and the notice does not apply to Zero Trust Branch appliances. [cloud-connector.upgrades.os-images:os24-branch]

**Supported Versions page.** The Supported Versions page gives December 31, 2026 as the End-of-Life of ZscalerOS 24. [cloud-connector.upgrades.os-images:os24-eol] Its tables still list ZscalerOS 24 for these connectors [divergence:cloud-connector.upgrades.os-images:os24-support-status].

What to check:
1. Which ZscalerOS version each connector runs before relying on the weekly upgrade to bring it current, since an OS change needs a new deployment.
2. Which deadline applies: November 30, 2026 for Cloud Connector, December 31, 2026 for Branch Connector, without treating the general EOL date as an extension of the Cloud Connector date.

Sources disagree (name both sides):
- The version page's GCP image table dates image zs-cc-ga-03092026 March 10, 2026, while the GCP Terraform module README lists the same image with release date 3/9/2026. [divergence:cloud-connector.upgrades.os-images:gcp-image-date]
  - zscaler-help: Image zs-cc-ga-03092026 was released March 10, 2026.
  - tfmod-gcp-cloud-connector: Image zs-cc-ga-03092026 has release date 3/9/2026.
  Impact: The release date of the GCP image differs by one day between the pages (gcp-version holds the help page's date); the image name itself, zs-cc-ga-03092026, matches in both, and no source says which date is right or what time zone either uses.
- The end-of-support notices say connectors on ZscalerOS 24 are no longer supported, while the Supported Versions tables list ZscalerOS 24 as a supported version for the same connectors. [divergence:cloud-connector.upgrades.os-images:os24-support-status]
  - zscaler-help: Cloud Connector deployments with ZscalerOS 24 and earlier are no longer supported on AWS, Azure and GCP.
  - zscaler-help: Branch Connector appliances based on ZscalerOS 24 and earlier are no longer supported.
  - zscaler-help: Zscaler supports ZscalerOS 24 and ZscalerOS 42 for Cloud Connector on AWS, Azure and GCP, and for Branch Connector on VMware platforms, Linux KVM, Hyper-V and the ZT-400, ZT-600 and ZT-800.
  Impact: An answer about whether a ZscalerOS 24 connector is supported depends on which page it reads; the notices' migration dates are the ones stated for service continuity, and no source says the tables extend them.

Not known (open gaps):
- How physical Branch Connector appliances receive OS images [gap:cloud-connector.upgrades.os-images:branch-hardware-images]: settled by source-read. Blocks: planning an OS upgrade of a hardware Branch Connector
- How scale-set and autoscaling members are upgraded [gap:cloud-connector.upgrades.os-images:scale-set-members]: settled by source-read or lab-test. Blocks: knowing whether an autoscaled group's members run current software and OS

Area: cloud-connector.upgrades, its subjects in references/_meta/spine/cloud-connector/cloud-connector.upgrades.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/cloud-connector/cloud-connector.logs.event-records.md (Cloud Connector event logs: state changes for health, tunnels, gateways and upgrades), from cloud-connector.upgrades: UPGRADE_START (Info) carries the current version, the new version and the package name; UPGRADE_END carries the current version, an upgrade status of Success for Info and Fail for Error, and the package name. [cloud-connector.logs.event-records:upgrade-events]
- scoped-by references/_meta/text/cloud-connector/cloud-connector.overview.groups.md (Cloud Connector groups: what they are for, autoscaling names, status and disabling), from cloud-connector.upgrades: On the Cloud Connector Groups overview, selected groups or connectors can be given an upgrade schedule (a day and time for periodic software updates) or a new release channel, and each group shows its Upgrade Window. [cloud-connector.upgrades:group-actions]
- logged-in references/_meta/text/types/ztw/event-log.md (Cloud & Branch Connector Event log (NSS feed)), from cloud-connector.upgrades: UPGRADE_START (Info) carries the current version, the new version and the package name; UPGRADE_END carries the current version, an upgrade status of Success for Info and Fail for Error, and the package name. [cloud-connector.logs.event-records:upgrade-events]
- links-to references/_meta/text/cloud-connector/cloud-connector.upgrades.repo-certificate.md (The pkg-repo.zscaler.com certificate renewal: minimum images, autoscaling templates and why connectors might not update automatically)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.upgrades.md (Cloud & Branch Connector software upgrades: weekly window, stagger and release channels)

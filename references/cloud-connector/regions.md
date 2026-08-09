---
product: cloud-connector
topic: "cc-regions"
title: "Cloud Connector and Zero Trust Gateway regions — AWS / Azure / GCP"
content-type: reference
last-verified: "2026-07-22"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md"
  - "vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md"
  - "vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md"
  - "vendor/zscaler-help/cbc-release-upgrade-summary-2026.md"
  - "vendor/zscaler-help/cbc-release-upgrade-summary-2025.md"
  - "vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-amazon-web-services.md"
  - "vendor/zscaler-help/cbc-deploying-cloud-connector-microsoft-azure.md"
  - "vendor/zscaler-help/cbc-about-cloud-connector-groups.md"
  - "vendor/zscaler-help/cbc-about-cloud-provisioning-templates.md"
  - "vendor/zscaler-help/cbc-configuring-cloud-provisioning-template.md"
  - "vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md"
  - "vendor/zscaler-help/cbc-understanding-namespaces-amazon-web-services-and-microsoft-azure-accounts.md"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go"
  - "vendor/terraform-provider-ztc/ztc/data_source_ztc_supported_regions.go"
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/README.md"
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf"
author-status: draft
---

# Cloud Connector and Zero Trust Gateway regions — AWS / Azure / GCP

Source: `vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md`; `vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-amazon-web-services.md`; `vendor/zscaler-help/cbc-deploying-cloud-connector-microsoft-azure.md`; `vendor/zscaler-help/cbc-about-cloud-connector-groups.md`; `vendor/zscaler-help/cbc-configuring-cloud-provisioning-template.md`; `vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md`.

This document separates three region surfaces that must not be conflated: customer-deployed Cloud Connector availability, the documented Zscaler-managed **GCP** Zero Trust Gateway availability, and the workload-discovery supported-region API. The current source set does not establish the same ownership model for AWS ZTG.

> **Confidence note.** The Help capture dated 2026-08-04 explicitly lists 18 AWS and 16 GCP **Zero Trust Gateway** regions (`vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md:8-53`). Those lists do not establish standard Cloud Connector VM deployment availability or the values returned by workload discovery.

---

## Keep the three region surfaces separate

Source: `vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md`; `vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-amazon-web-services.md`; `vendor/zscaler-help/cbc-deploying-cloud-connector-microsoft-azure.md`; `vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md`.

1. **Standard Cloud Connector deployment** is the customer-deployed VM path. GCP Help documents Terraform deployment and a Marketplace image, but does not enumerate a GCP standard-CC region list (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:8-10`; `vendor/zscaler-help/cbc-release-upgrade-summary-2026.md:38-42`).
2. **GCP Zero Trust Gateway deployment** is a separate managed-service surface. GCP ZTG is Zscaler cloud-native, Limited Availability, and Support-enabled (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:8-17`). The current static region article includes both AWS and GCP availability, but it does not establish that AWS uses the same managed-service ownership model.
3. **Workload discovery** exposes a live per-cloud supported-region set through `/publicCloudInfo/supportedRegions`. That set governs discovery and is not documented as equal to either deployment surface (`vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go:13,33-53`).

Subcloud/PSE selection is another independent control; see [`../shared/subclouds.md`](../shared/subclouds.md). Nothing in the current ZTG matrix proves one-to-one parity with Public Service Edge locations.

---

## Programmatic region enumeration

Source: `vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go`; `vendor/terraform-provider-ztc/ztc/data_source_ztc_supported_regions.go`.

There **is** a programmatic surface that enumerates supported regions per cloud — the **workload-discovery (WDS) supported-region set**. It is exposed three ways, all backed by the same endpoint:

- **API:** `GET /ztw/api/v1/publicCloudInfo/supportedRegions`. The base path `/ztw/api/v1/publicCloudInfo` is defined in `partner_integrations.go:13`; the `/supportedRegions` suffix is appended at `partner_integrations.go:35`.
- **Go SDK:** `partner_integrations.GetSupportedRegions(ctx, service)` returns the full list (`partner_integrations.go:33`); `partner_integrations.GetSupportedRegionsByName(ctx, service, regionName)` fetches one by name (`partner_integrations.go:42`).
- **Terraform:** the `ztc_supported_regions` data source (`data_source_ztc_supported_regions.go`). Its read function branches on the supplied argument: the `id` branch and the no-argument (all-regions) branch both call `partner_integrations.GetSupportedRegions` and then filter/flatten in the provider (`data_source_ztc_supported_regions.go:74` and `:107`), while the `name` branch calls `partner_integrations.GetSupportedRegionsByName` (`data_source_ztc_supported_regions.go:95`).

Each returned region carries three fields (`common.go:168-178`):

| Field | Type | Notes |
|---|---|---|
| `id` | int | Unique ID of the supported region (`common.go:171`). |
| `name` | string | Region name (`common.go:174`). |
| `cloud_type` | string | Cloud type; supported values `AWS`, `AZURE`, `GCP` (`common.go:177`; mirrored in the TF schema description at `data_source_ztc_supported_regions.go:33,54`). |

This surface is typed for all three clouds—AWS, Azure, and GCP—and returns the tenant-visible workload-discovery region set (`vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go:168-178`).

**Important scope distinction.** This is the **workload-discovery** supported-region set, not the **Zero Trust Gateway deployment** region list. The two are different surfaces:

- The current Help table explicitly lists 18 AWS and 16 GCP ZTG regions (`vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md:8-50`).
- The WDS set above governs which regions workload discovery can enumerate/scan per cloud. It does **not** replace the ZTG table, and the captured source does not assert the two lists are identical.

Query the WDS endpoint, Go SDK, or Terraform data source against the tenant for the current workload-discovery set. The SDK/provider source defines the shape but does not embed the returned values (`vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go:33-53`; `vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go:168-178`).

---

## AWS region matrix

Source: `vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md`; `vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-amazon-web-services.md`.

### Zero Trust Gateway supported regions (authoritative)

The table below is scoped to **Zero Trust Gateway**, not standard Cloud Connector AMI deployment or workload discovery (`vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md:8-30`).

| Region code | Display name | Location |
|---|---|---|
| `us-east-1` | US East (N. Virginia) | Virginia, USA |
| `us-east-2` | US East (Ohio) | Ohio, USA |
| `us-west-1` | US West (N. California) | California, USA |
| `us-west-2` | US West (Oregon) | Oregon, USA |
| `eu-north-1` | Europe (Stockholm) | Stockholm, Sweden |
| `eu-central-1` | Europe (Frankfurt) | Frankfurt, Germany |
| `eu-south-2` | Europe (Spain) | Madrid, Spain |
| `eu-west-1` | Europe (Ireland) | Dublin, Ireland |
| `eu-west-2` | Europe (London) | London, UK |
| `eu-west-3` | Europe (Paris) | Paris, France |
| `ap-southeast-1` | Asia Pacific (Singapore) | Singapore |
| `ap-south-1` | Asia Pacific (Mumbai) | Mumbai, India |
| `ap-south-2` | Asia Pacific (Hyderabad) | Hyderabad, India |
| `ap-southeast-2` | Asia Pacific (Sydney) | Sydney, Australia |
| `ap-southeast-4` | Asia Pacific (Melbourne) | Melbourne, Australia |
| `ca-central-1` | Canada (Central) | Montreal, Canada |
| `sa-east-1` | South America (São Paulo) | São Paulo, Brazil |
| `me-south-1` | Middle East (Bahrain) | Bahrain |

Source: `vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md`.

The article's closing note says to contact Zscaler Support for unavailable regions.

**18 AWS regions** are present in the current Help capture. The May 29 release entry identifies `ap-south-2` and `ap-southeast-4` as additions (`vendor/zscaler-help/cbc-release-upgrade-summary-2026.md:24-26`).

### AMI availability (standard CC deployment)

The standard CC AMI deployment does not have a separately enumerated region list in the current captures. Verify Marketplace availability rather than treating the 18-region ZTG table as an AMI allowlist.

### Restricted / unsupported AWS regions

**AWS GovCloud (`us-gov-east-1`, `us-gov-west-1`):** Not listed in the captured docs. The ZTG region table covers only commercial regions. Whether Cloud Connector AMI is available in GovCloud, and whether Zscaler operates ZTG or PSE infrastructure there, is not stated in available captures. Zscaler does operate a FedRAMP GovCloud offering for ZIA/ZPA, and the GovCloud blog post mentions Cloud Connector as part of the GovCloud product set — but does not enumerate regional specifics for CC. This is an open question; see § Open questions below.

**AWS China (`cn-north-1`, `cn-northwest-1`):** Not listed. The ZTG table contains no China regions. The Azure deployment doc's explicit China callout (see Azure section) suggests China is a special case requiring separate handling; the same likely applies to AWS China, but this is not confirmed in captured docs.

**Other unlisted regions** (for example, `ap-east-1`, `af-south-1`, `eu-south-1`, `ap-southeast-3`, `me-central-1`, and `il-central-1`) remain unconfirmed for ZTG. Help directs customers to Support for regions not listed (`vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md:52-53`).

---

## Azure region matrix

Source: `vendor/zscaler-help/cbc-deploying-cloud-connector-microsoft-azure.md`; `vendor/zscaler-help/cbc-about-cloud-provisioning-templates.md`.

### Marketplace availability

The Azure deployment doc (`cbc-deploying-cloud-connector-microsoft-azure.md`) contains the clearest regional statement for Azure:

> *"The Zscaler Cloud Connector Application in the Azure Marketplace is available in all regions except China. If you are deploying Cloud Connector from the China region, you must use Terraform."*

This means:
- **Azure Marketplace deployment:** available in all Azure commercial regions globally.
- **Azure China (`chinanorth`, `chinanorth2`, `chinanorth3`, `chinaeast`, `chinaeast2`, `chinaeast3`):** Marketplace path unavailable; Terraform is required.
- **Azure Government (`usgovarizona`, `usgovtexas`, `usgovvirginia`, `usdodcentral`, `usdodeast`):** Not explicitly addressed in captured docs. Whether the Marketplace listing is available in Azure Government clouds is unconfirmed; see § Open questions.

### China-specific deployment note

The Azure doc provides specific guidance for China deployments:

> *"If you are deploying Cloud Connector in China, Zscaler recommends creating a custom gateway with Zscaler China data centers and traffic forwarding policies referencing your China location and custom gateway. To learn more, see China Premium Internet Access and Deploying Zscaler Internet Access in China."*

This implies: (a) CC deployment in Azure China is technically possible via Terraform, (b) the PSE path must be explicitly configured to use Zscaler's China data centers rather than the default geolocation-based selection, and (c) "China Premium Internet Access" is a separate Zscaler product/configuration required alongside CC in that geography.

### VM image terms

The CC VM image on Azure Marketplace (publisher `zscaler1579058425289`, offer `zia_cloud_connector`) requires image terms acceptance before any deployment can succeed. This is a per-subscription, per-region step:

```bash
az vm image terms accept --urn zscaler1579058425289:zia_cloud_connector:zs_ser_gen1_cc_01:latest
```

This applies in any region where the Marketplace listing is available. Failing to accept terms produces an ARM-level error that may be misread as a regional or network issue.

### Azure sovereign clouds (non-China)

The deployment doc does not enumerate support status for Azure Government, Azure Germany (legacy), or Azure China beyond the China note above. Treat any sovereign cloud except commercial Azure as unconfirmed. See § Open questions.

### VMSS regional caveat

The VMSS (autoscaling) deployment on Azure requires a **Function App** for health monitoring and orphan cleanup. The Terraform reference module notes that the Flex Consumption plan for Azure Functions is not available in all Azure regions. Where it is unavailable and VNet integration is required, operators must upgrade to the Elastic Premium (EP1) plan. Skipping this degrades the VMSS deployment — health-driven instance termination and CC group orphan cleanup will not function. This is a within-Azure regional capability difference, not a CC availability gap per se, but it affects the supportable deployment shape in affected regions.

---

## GCP region matrix

Source: `vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md`; `vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md`; `vendor/zscaler-help/cbc-release-upgrade-summary-2026.md`.

### Zero Trust Gateway supported regions

| Region code | Location |
|---|---|
| `us-west1` | Oregon, USA |
| `us-west2` | Los Angeles, California, USA |
| `us-west3` | Salt Lake City, Utah, USA |
| `us-west4` | Las Vegas, Nevada, USA |
| `us-east1` | South Carolina, USA |
| `us-east4` | N. Virginia, USA |
| `us-east5` | Columbus, Ohio, USA |
| `us-central1` | Iowa, USA |
| `us-south1` | Dallas, Texas, USA |
| `europe-west1` | Belgium |
| `europe-west3` | Frankfurt, Germany |
| `europe-west4` | Netherlands |
| `australia-southeast1` | Sydney, Australia |
| `asia-south1` | Mumbai, India |
| `asia-south2` | Delhi, India |
| `asia-southeast1` | Singapore |

These are the **16 GCP Zero Trust Gateway regions** in the current Help table (`vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md:31-50`). GCP ZTG is a Zscaler-managed, Limited Availability service, not a customer-deployed connector VM (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:8-17`).

### Standard Cloud Connector deployment

Current Help documents the standard GCP Cloud Connector deployment method as Terraform and the 2026 release summary identifies a Google Cloud Marketplace image (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:8-10`; `vendor/zscaler-help/cbc-release-upgrade-summary-2026.md:38-42`). The captured sources do not enumerate the regions in which that customer-deployed VM path is available. See [`./gcp-deployment.md`](./gcp-deployment.md) for its service-account, routing, MIG, health, and resource-sync architecture.

### Workload-discovery regions

The separate `GET /ztw/api/v1/publicCloudInfo/supportedRegions` surface can return rows whose `cloud_type` is `GCP`, but the SDK source does not embed the returned region values (`vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go:33-53`; `vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go:168-178`). Query the tenant for that current WDS set; do not substitute the 16-region ZTG table.

---

## Cross-region considerations

Source: `vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md`; `vendor/zscaler-help/cbc-understanding-namespaces-amazon-web-services-and-microsoft-azure-accounts.md`; `vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md`.

### CC placement relative to workloads

Cloud Connector should always be deployed in the same region as the workloads it serves. Cross-region workload traffic to a CC incurs both cloud-provider cross-region data transfer charges and added latency before the traffic even reaches the ZTE. There is no documented benefit to cross-region CC placement.

The HA doc confirms the regional isolation model: *"each region serves a number of different egress points for Cloud Connector and does not affect other regions even if there is a cloud provider outage."* Regions are intended to be operationally independent.

### Centralized vs decentralized topology

The HA doc (`cbc-understanding-high-availability-and-failover.md`) explicitly documents two patterns:

**Centralized (hub-and-spoke):** A single transit/egress VPC or VNet in one region hosts Cloud Connectors. Workload VPCs/VNets in other regions route to the hub via **AWS Transit Gateway** or **Azure Virtual WAN Hub** (both named explicitly in the HA doc). This reduces CC instance count and administrative surface at the cost of cross-region data transfer:

- AWS Transit Gateway attachment charges apply per AZ per VPC.
- Intra-region traffic to a cross-region TGW incurs AWS inter-region data transfer costs.
- Azure Virtual WAN Hub has similar inter-region routing costs.

**Decentralized (direct egress per VPC/VNet):** Each VPC or VNet has its own Cloud Connector(s) with direct internet access. No cross-region data transfer for the CC-to-PSE path, but more CC instances to manage and more egress IPs to register with ZIA.

The choice between these is a cost-vs-operational-complexity tradeoff, not a Zscaler-imposed constraint. Most production deployments with significant multi-region footprint use the centralized hub pattern and accept the TGW/VWAN cost in exchange for fewer CC instances and a single egress identity.

### VPC peering and overlapping CIDRs

The namespace doc (`cbc-understanding-namespaces-amazon-web-services-and-microsoft-azure-accounts.md`) notes a constraint specific to Azure VPC peering with overlapping CIDRs:

> *"When deploying applications in Azure, you can reuse the same CIDR block in a deployment. When using VPC peering, you cannot use endpoints to separate traffic. You must duplicate the Cloud Connector group stack."*

This is a regional / multi-VNet architecture constraint, not a region-availability issue. For AWS, overlapping CIDRs are handled via namespaces and VPC endpoints (which can isolate traffic even with overlapping IP space). Azure lacks an equivalent mechanism in the peering case and requires a separate CC stack per namespace.

### Latency to nearest Zscaler PSE

CC selects PSEs by geolocation. The HA doc states PSE selection is automatic: *"the Internet & SaaS Public Service Edges or Private Service Edges are selected using geolocation."* Operators can override PSE selection per CC Group via traffic forwarding rules referencing specific gateways or subclouds.

Do not use the 18-region AWS or 16-region GCP ZTG tables as a Public Service Edge map. The current region article defines ZTG availability and directs unlisted-region requests to Support; it does not assert one-to-one correspondence with PSE locations (`vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md:8-53`).

### Failover across regions

By design, CC failover is within the CC Group (same region / same deployment). If all CCs in a group fail, the fail-close behavior drops workload internet traffic (configurable to fail-open). There is no automatic cross-region CC failover — a workload VPC in `us-east-1` does not automatically reroute through `us-west-2` CCs if the `us-east-1` group fails. Cross-region recovery requires either a hub-spoke TGW topology (where the hub CC group spans AZs within a single region) or operator-managed route-table changes.

For the Zscaler-side tunnel: CC automatically fails over from primary to secondary to tertiary PSE, but this is within the ZTE PSE mesh, not across cloud provider regions. A CC in `eu-west-1` failing over its PSE tunnel does not route through US PSEs unless the subcloud config (or lack thereof) permits it.

---

## Open questions register

Source: `vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md`; `vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-amazon-web-services.md`; `vendor/zscaler-help/cbc-deploying-cloud-connector-microsoft-azure.md`; `vendor/zscaler-help/cbc-about-cloud-provisioning-templates.md`; `vendor/zscaler-help/cbc-configuring-cloud-provisioning-template.md`.

The `OQ-CCR-*` IDs below are this doc's per-question handles; the set is filed in the central register as [clarification `cloud-connector-22`](../_meta/clarifications.md#cloud-connector-22-cc-region-coverage-govcloud-china-gcp-deployment-and-wds-vs-ztg-region-set-parity).

| ID | Question | Why it matters | How to resolve |
|---|---|---|---|
| OQ-CCR-01 | Does AWS Cloud Connector AMI support AWS GovCloud (`us-gov-east-1`, `us-gov-west-1`)? | Federal / DoD deployments; FedRAMP High may require workloads in GovCloud with CC. | Check AWS GovCloud Marketplace; ask Zscaler GovCloud team. |
| OQ-CCR-02 | Does Azure Cloud Connector Marketplace listing exist in Azure Government (`usgovarizona`, `usgovtexas`, `usgovvirginia`)? | Same federal use-case; Zscaler has a GovCloud ZIA/ZPA offering — unclear if CC image is available in Azure Gov. | Check Azure Government Marketplace; contact Zscaler FedRAMP team. |
| OQ-CCR-03 | Which specific GCP regions support standard customer-deployed Cloud Connector? | Help now confirms Terraform deployment and a Marketplace image, but the 16 named GCP regions are explicitly the ZTG surface, not a standard-CC deployment list (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:8-10`; `vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md:31-50`). | Check current Marketplace availability and obtain a standard-CC deployment matrix from Zscaler. |
| OQ-CCR-04 | What is the exact lower-level GCP load-balancer/template contract for each deployment family? | Help now establishes the separate VPCs, internal TCP/UDP load-balancer routing, and MIG topology, but lower-level variant-specific behavior still depends on the selected Terraform template (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:31-44`). | Validate the chosen template and deployed GCP resources. |
| OQ-CCR-05 | Do unlisted AWS regions such as `ap-east-1`, `af-south-1`, `eu-south-1`, `me-central-1`, `il-central-1`, or `ap-southeast-3` support CC AMI and/or ZTG? | These regions do not appear in the current 18-region ZTG table. | Contact Zscaler Support, as the region article directs for unlisted regions (`vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md:52-53`). |
| OQ-CCR-06 | Is the Azure Function App Flex Consumption plan gap documented per region, and is there a published list of affected Azure regions? | Affects VMSS supportability in those regions. | Check Azure documentation for Flex Consumption plan regional availability; update `./azure-deployment.md`. |
| OQ-CCR-07 | Does CC in AWS China (`cn-north-1`, `cn-northwest-1`) require the same special gateway configuration as Azure China? | Expected yes by analogy with the Azure guidance, but not confirmed in captured docs. | Check for a China-specific CC deployment page; contact Zscaler Support. |
| OQ-CCR-08 | Are there regional differences in which CC VM size options are available (Small / Medium / Large per cloud / region)? | The provisioning template config shows `Large` option for AWS but only `Small` for Azure and GCP. Whether this is cloud-type or region-specific is unclear. | Capture the provisioning template help page's full sizing table. |
| OQ-CCR-09 | What values does the workload-discovery `GET /ztw/api/v1/publicCloudInfo/supportedRegions` surface return per cloud, and how do they differ from ZTG and standard-CC deployment availability? | SDK/TF source defines only id/name/cloud type and does not assert WDS == ZTG == deployment availability (`vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go:168-178`). | Query `ztc_supported_regions` or the raw endpoint against a live tenant and compare it with the 18-AWS/16-GCP ZTG tables. |
| OQ-CCR-10 | Did `eu-central-2` become a supported AWS ZTG region and then get withdrawn, or is the current matrix incomplete? | The December 15, 2025 release entry says ZTG added `eu-central-2`, but the current captured matrix omits it (`vendor/zscaler-help/cbc-release-upgrade-summary-2025.md:11-18`; `vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md:8-29`). Neither source explains the discrepancy; see [clarification `cloud-connector-27`](../_meta/clarifications.md#cloud-connector-27-eu-central-2-ztg-region-source-conflict). | Check the current portal/tenant and obtain vendor clarification; do not interpret omission alone as withdrawal. |

---

## Cross-links

- AWS deployment mechanics (ENI model, GWLB, ASG, CloudFormation): [`./aws-deployment.md`](./aws-deployment.md)
- Azure deployment mechanics (NIC model, ILB, VMSS, Function App): [`./azure-deployment.md`](./azure-deployment.md)
- GCP Cloud Connector deployment mechanics: [`./gcp-deployment.md`](./gcp-deployment.md)
- GCP Zero Trust Gateway managed-service boundary: [`./gcp-zero-trust-gateway.md`](./gcp-zero-trust-gateway.md)
- Subclouds — restricting which PSEs handle tenant traffic: [`../shared/subclouds.md`](../shared/subclouds.md)
- Cloud Connector product overview (CC Groups, forwarding rule evaluation): [`./overview.md`](./overview.md)
- Traffic forwarding rules (including GCP VPC-to-VPC forwarding): [`./forwarding.md`](./forwarding.md)

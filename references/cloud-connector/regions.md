---
product: cloud-connector
topic: "cc-regions"
title: "Cloud Connector supported regions — AWS / Azure / GCP coverage"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md"
  - "vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-amazon-web-services.md"
  - "vendor/zscaler-help/cbc-deploying-cloud-connector-microsoft-azure.md"
  - "vendor/zscaler-help/cbc-about-cloud-connector-groups.md"
  - "vendor/zscaler-help/cbc-about-cloud-provisioning-templates.md"
  - "vendor/zscaler-help/cbc-configuring-cloud-provisioning-template.md"
  - "vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md"
  - "vendor/zscaler-help/cbc-understanding-namespaces-amazon-web-services-and-microsoft-azure-accounts.md"
author-status: draft
---

# Cloud Connector supported regions — AWS / Azure / GCP coverage

This document covers which cloud provider regions support Zscaler Cloud Connector (CC) deployment, the mechanism by which Cloud Connector selects Zscaler Public Service Edges, how that interacts with the concept of subclouds, and any known regional capability restrictions or gaps.

> **Confidence note.** Regional support lists change without announcement. Zscaler's help documentation as captured for this skill dates from 2026-04-26. The explicit region matrix below (for the Zero Trust Gateway / AWS subset) comes directly from the canonical help article. Azure and GCP region lists are not enumerated in the captured docs — see the confidence callouts in each section. Treat any claim marked Tier D as requiring verification against current Zscaler documentation.

---

## How Zscaler decides where to support CC

Cloud Connector is a VM image (AMI on AWS, VM image on Azure/GCP) deployed inside the customer's own cloud account. Zscaler does not operate Cloud Connector in its own infrastructure — the customer deploys it into their VPC/VNet/VPC (Google). This means "Cloud Connector regional support" has two distinct meanings:

1. **CC VM image availability** — whether Zscaler publishes a Cloud Connector image to that region's Marketplace listing. If the image isn't listed, Terraform can still pull it from another region or from a Zscaler-provided image repository, but Marketplace-wizard deployment fails.

2. **Zero Trust Exchange reachability** — whether the Zscaler PSE (Public Service Edge) network has presence near that region. CC selects PSEs by geolocation; a CC in a region with no nearby PSE will still connect — it just incurs higher latency and potential cross-region egress charges to reach the nearest PSE. Zscaler's HA doc states the ZTE operates "over 150 global data centers."

These two concerns are independent. A region can have full CC Marketplace support but no adjacent Zscaler PSE (rare in practice, but possible in emerging regions). Conversely, Zscaler may have PSE presence near a region where CC isn't Marketplace-listed and must be deployed via Terraform.

The relationship to subclouds: subclouds restrict *which PSEs handle tenant traffic* — they override geolocation-based PSE selection. A CC in `ap-southeast-2` (Sydney) would by default select the nearest PSE geographically; a subcloud pinned to EU PSEs would force that CC's traffic to route through Europe. That is almost always wrong for workload latency and egress cost. Subclouds and CC regional placement are orthogonal controls; see [`../shared/subclouds.md`](../shared/subclouds.md) for subcloud mechanics.

---

## AWS region matrix

### Zero Trust Gateway supported regions (authoritative)

The help article *Supported Regions for Zero Trust Gateways* (`cbc-supported-regions-zero-trust-gateways.md`) provides the only explicit, enumerated region list in the captured documentation. It covers the **Zero Trust Gateway** (ZTG) feature — a VPC Endpoint-based path where Zscaler presents an AWS VPC Endpoint Service in each supported region, and the customer registers an endpoint to it. This is distinct from the standard CC deployment (where the customer deploys the CC AMI themselves), but it is the only source that names specific supported regions.

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
| `ap-southeast-2` | Asia Pacific (Sydney) | Sydney, Australia |
| `ca-central-1` | Canada (Central) | Montreal, Canada |
| `sa-east-1` | South America (São Paulo) | São Paulo, Brazil |
| `me-south-1` | Middle East (Bahrain) | Bahrain |

Source: `help.zscaler.com/cloud-branch-connector/supported-regions-zero-trust-gateways`, captured 2026-04-26. The article's closing note: *"If you are interested in support for a region that is currently unavailable, contact Zscaler Support."*

**16 regions** across North America (4), Europe (6), Asia-Pacific (3), Canada (1), South America (1), Middle East (1).

### AMI availability (standard CC deployment)

The standard CC AMI deployment (via CloudFormation or Terraform) does not have a separately enumerated region list in the captured docs. The AWS Marketplace listing for Cloud Connector is published by Zscaler as an AMI; AWS Marketplace AMIs are typically available in all standard commercial regions, but Zscaler has not published a region-by-region availability statement for the AMI itself in the captured material.

**Practical guidance:** assume the AMI is available in any AWS commercial region. The ZTG supported-region list above reflects Zscaler's *operational* commitment to that region (Zscaler operates endpoint infrastructure there). For standard CC AMI deployment, the binding constraint is likely PSE proximity rather than AMI availability. Verify current Marketplace listing availability before planning a deployment in a region not on the ZTG list above.

### Restricted / unsupported AWS regions

**AWS GovCloud (`us-gov-east-1`, `us-gov-west-1`):** Not listed in the captured docs. The ZTG region table covers only commercial regions. Whether Cloud Connector AMI is available in GovCloud, and whether Zscaler operates ZTG or PSE infrastructure there, is not stated in available captures. Zscaler does operate a FedRAMP GovCloud offering for ZIA/ZPA, and the GovCloud blog post mentions Cloud Connector as part of the GovCloud product set — but does not enumerate regional specifics for CC. This is an open question; see § Open questions below.

**AWS China (`cn-north-1`, `cn-northwest-1`):** Not listed. The ZTG table contains no China regions. The Azure deployment doc's explicit China callout (see Azure section) suggests China is a special case requiring separate handling; the same likely applies to AWS China, but this is not confirmed in captured docs.

**Other opt-in regions** (e.g., `ap-east-1` Hong Kong, `af-south-1` Cape Town, `eu-south-1` Milan, `ap-southeast-3` Jakarta, `ap-southeast-4` Melbourne, `me-central-1` UAE, `il-central-1` Israel): none of these appear in the ZTG table. Whether CC AMI is available and/or ZTG is supported there is unconfirmed. Contact Zscaler Support for any region outside the 16 listed above.

---

## Azure region matrix

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

### Coverage status: unconfirmed

GCP is confirmed as a supported cloud provider for Cloud Connector at the product level. Multiple help docs establish this:

- CC Groups are "automatically created when you deploy a Zscaler Cloud Connector in Amazon Web Services (AWS), Microsoft Azure, or **Google Cloud Platform (GCP)**." (`cbc-about-cloud-connector-groups.md`)
- Provisioning templates support `Google Cloud` as a cloud provider type alongside AWS and Azure. (`cbc-configuring-cloud-provisioning-template.md`)
- Autoscaling on GCP uses a **Managed Instance Group (MIG) with autoscaling** — equivalent to AWS ASG and Azure VMSS. MIG autoscaling requires Zscaler Support enablement, same as the other clouds. (`cbc-about-cloud-provisioning-templates.md`)
- The Admin Console monitoring page shows GCP project name as the Account ID field for CC VMs. (`cbc-accessing-cloud-branch-connector-monitoring.md`)
- Traffic forwarding rules reference workload discovery for GCP alongside AWS and Azure. (`cbc-configuring-traffic-forwarding-rule.md`)
- The provisioning template VM size for GCP defaults to **Small**. (`cbc-configuring-cloud-provisioning-template.md`)
- When a GCP instance in an instance group is deleted, it is automatically replaced. (`cbc-about-cloud-connector-groups.md`)

**What is not in the captured docs:** a GCP-specific deployment guide analogous to the AWS and Azure ones. The provisioning template config doc references *"Deploying Zscaler Cloud Connector on the Google Cloud Platform"* as a related article (implying such a page exists), but that page was not captured. No captured doc enumerates which GCP regions are supported, whether a Google Cloud Marketplace listing exists, or what the GCP-specific networking model looks like (GCP uses a different model than AWS VPC or Azure VNet — e.g., VPC is global, subnets are regional, no native load balancer equivalent to GWLB).

**Summary:** GCP is a first-class supported cloud for CC deployment. The deployment mechanics and supported region list are not covered in the skill's current vendor captures. Register as an open question; do not invent region lists.

---

## Cross-region considerations

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

The 16-region ZTG list above correlates roughly with Zscaler's PSE density in those geographies — these are regions where Zscaler has made a formal operational commitment. For CC deployments in regions outside the list (e.g., `af-south-1` Cape Town), the CC will still connect to the nearest available PSE but may experience higher latency and asymmetric routing to destinations that a regional PSE would serve more directly.

Zscaler's HA doc states the ZTE has "over 150 global data centers," meaning PSE coverage is broader than the 16-region ZTG list. The ZTG list represents where Zscaler has deployed its own endpoint infrastructure (a stronger commitment) rather than the full PSE footprint.

### Failover across regions

By design, CC failover is within the CC Group (same region / same deployment). If all CCs in a group fail, the fail-close behavior drops workload internet traffic (configurable to fail-open). There is no automatic cross-region CC failover — a workload VPC in `us-east-1` does not automatically reroute through `us-west-2` CCs if the `us-east-1` group fails. Cross-region recovery requires either a hub-spoke TGW topology (where the hub CC group spans AZs within a single region) or operator-managed route-table changes.

For the Zscaler-side tunnel: CC automatically fails over from primary to secondary to tertiary PSE, but this is within the ZTE PSE mesh, not across cloud provider regions. A CC in `eu-west-1` failing over its PSE tunnel does not route through US PSEs unless the subcloud config (or lack thereof) permits it.

---

## Open questions register

| ID | Question | Why it matters | How to resolve |
|---|---|---|---|
| OQ-CCR-01 | Does AWS Cloud Connector AMI support AWS GovCloud (`us-gov-east-1`, `us-gov-west-1`)? | Federal / DoD deployments; FedRAMP High may require workloads in GovCloud with CC. | Check AWS GovCloud Marketplace; ask Zscaler GovCloud team. |
| OQ-CCR-02 | Does Azure Cloud Connector Marketplace listing exist in Azure Government (`usgovarizona`, `usgovtexas`, `usgovvirginia`)? | Same federal use-case; Zscaler has a GovCloud ZIA/ZPA offering — unclear if CC image is available in Azure Gov. | Check Azure Government Marketplace; contact Zscaler FedRAMP team. |
| OQ-CCR-03 | Which specific GCP regions does Zscaler support for CC deployment? Is there a Google Cloud Marketplace listing? | GCP CC is documented as supported at product level but no region list or Marketplace listing was confirmed in captured docs. | Capture `help.zscaler.com/cloud-branch-connector/deploying-zscaler-cloud-connector-google-cloud-platform` (linked-but-not-captured). |
| OQ-CCR-04 | What is the GCP-specific networking model for CC (instance template, load balancer type, NIC configuration)? | GCP networking differs materially from AWS and Azure. The CC deployment doc for GCP was not captured. | Same capture target as OQ-CCR-03. |
| OQ-CCR-05 | Do AWS opt-in regions (`ap-east-1`, `af-south-1`, `eu-south-1`, `me-central-1`, `il-central-1`, `ap-southeast-3`, `ap-southeast-4`) support CC AMI and/or ZTG? | Some customers have workloads in newer opt-in regions not on the ZTG list. | Contact Zscaler Support (the ZTG article explicitly directs there for unlisted regions). |
| OQ-CCR-06 | Is the Azure Function App Flex Consumption plan gap documented per region, and is there a published list of affected Azure regions? | Affects VMSS supportability in those regions. | Check Azure documentation for Flex Consumption plan regional availability; update `./azure-deployment.md`. |
| OQ-CCR-07 | Does CC in AWS China (`cn-north-1`, `cn-northwest-1`) require the same special gateway configuration as Azure China? | Expected yes by analogy with the Azure guidance, but not confirmed in captured docs. | Check for a China-specific CC deployment page; contact Zscaler Support. |
| OQ-CCR-08 | Are there regional differences in which CC VM size options are available (Small / Medium / Large per cloud / region)? | The provisioning template config shows `Large` option for AWS but only `Small` for Azure and GCP. Whether this is cloud-type or region-specific is unclear. | Capture the provisioning template help page's full sizing table. |

---

## Cross-links

- AWS deployment mechanics (ENI model, GWLB, ASG, CloudFormation): [`./aws-deployment.md`](./aws-deployment.md)
- Azure deployment mechanics (NIC model, ILB, VMSS, Function App): [`./azure-deployment.md`](./azure-deployment.md)
- Subclouds — restricting which PSEs handle tenant traffic: [`../shared/subclouds.md`](../shared/subclouds.md)
- Cloud Connector product overview (CC Groups, forwarding rule evaluation): [`./overview.md`](./overview.md)
- Traffic forwarding rules (including GCP VPC-to-VPC forwarding): [`./forwarding.md`](./forwarding.md)

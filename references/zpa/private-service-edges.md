---
product: zpa
topic: "zpa-private-service-edges"
title: "ZPA Private Service Edges — on-prem brokering for private app access"
content-type: reference
last-verified: "2026-07-26"
confidence: medium
source-tier: doc
verified-against:
  vendor/terraform-aws-zpa-private-service-edge-modules: b555a112e27ac25a018b8681a5a339fe7c40458a
  vendor/terraform-azurerm-zpa-private-service-edge-modules: bdfecd0adaef82e50a4575d4d6252395aca706b2
sources:
  - "vendor/zscaler-help/about-private-service-edges.md"
  - "vendor/zscaler-help/about-private-service-edge-groups.md"
  - "vendor/zscaler-help/understanding-private-access-architecture.md"
  - "vendor/zscaler-help/zsdk-about-zsdk-private-service-edges.md"
  - "vendor/zscaler-help/zsdk-deploying-zsdk-private-service-edges.md"
  - "vendor/zscaler-help/zsdk-about-zsdk-private-service-edge-groups.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_private_cloud_group.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_private_service_edge_status.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/service_edges.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/service_edge_group.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/private_cloud_group.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/private_cloud_controller.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/service_edge_schedule.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/service_edge_schedule.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/zpa_service.py"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgegroup/zpa_service_edge_group.go"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/main.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-provisioning-key/main.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-provisioning-key/variables.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-asg-aws/variables.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-asg-aws/main.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-psevm-aws/variables.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-psevm-aws/main.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-sg-aws/main.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-iam-aws/main.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/examples/README.md"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/README.md"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/main.tf"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpse-vm-azure/variables.tf"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zsac-pse-vmss-azure/main.tf"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/README.md"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/base_pse_vmss/README.md"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/pse_vmss/README.md"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/pse_vmss/variables.tf"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/pse_vmss/main.tf"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/README.md"
author-status: draft
---

# ZPA Private Service Edges — on-prem brokering for private app access

> **Name collision warning.** "Private Service Edge" exists in both ZPA and ZIA but refers to completely different products. This document covers the ZPA variant only — an on-prem broker for private application access. The ZIA Private Service Edge is an inline traffic inspection cluster for internet-bound traffic and is documented separately at [`../zia/private-service-edge.md`](../zia/private-service-edge.md). Do not conflate these: different product, different architecture, different use case, different Terraform resources.

## Overview

Source: `vendor/zscaler-help/about-private-service-edges.md`; `vendor/zscaler-help/understanding-private-access-architecture.md`; `vendor/zscaler-help/zsdk-about-zsdk-private-service-edges.md`.

A ZPA Private Service Edge (PSE) is a **single-tenant instance broker** that delivers the same ZPA session-brokering function as a ZPA Public Service Edge, but runs inside the operator's own environment — data center, private cloud, or cloud-hosted tenant VPC — rather than in a Zscaler PoP.

Like its Public counterpart, a ZPA PSE manages ZPA data-plane sessions: it authenticates ZCC clients and App Connectors, enforces ZPA access policy, selects the best-path App Connector, and manages the Microtunnel (M-Tunnel) end-to-end from user to application. The PSE is not doing internet inspection (that is ZIA's domain); it is solely a ZPA session coordinator that sits between ZCC and the App Connector.

**Why deploy one?**

| Trigger | Rationale |
|---|---|
| Regulatory / data residency | ZPA session traffic must remain within a defined jurisdiction and cannot transit Zscaler's multi-tenant cloud infrastructure |
| Air-gapped or restricted networks | Client devices or App Connectors cannot reach Zscaler's public PoPs |
| Latency optimization | For users and apps both on the LAN or in a co-located DC, a local broker avoids internet hairpins to a distant PoP |
| Business continuity | A local PSE continues servicing sessions if Zscaler PoP connectivity is degraded |
| Private routing requirements | Traffic must stay on private interconnects (MPLS, ExpressRoute, DirectConnect) without internet breakout |

### Positioning vs ZIA Private Service Edge

| Dimension | ZPA PSE (this document) | ZIA PSE |
|---|---|---|
| Product | ZPA (private app access) | ZIA (internet / SaaS inspection) |
| Function | Session broker for ZPA M-Tunnels | Inline inspection cluster (Firewall, DLP, Sandbox) |
| Data plane | ZCC → PSE → App Connector → private app | Client → PSE → internet / SaaS |
| Deployment model | Operator deploys VM or appliance; Zscaler manages software | Zscaler Cloud Ops manages hardware cluster; near-zero operator touch |
| Terraform resources | `zpa_service_edge_group`, `zpa_private_cloud_group` | None — hardware-only, managed by Zscaler |
| HA design | PSE Group (operator-managed, N+1) | N+1 cluster with Zscaler-managed LB |
| Control plane | Registers with ZPA Central Authority (CA) | Connects to ZIA CA, cloud routers, Nanolog |

### Positioning vs ZPA Public Service Edges

ZPA Public Service Edges are Zscaler-operated, multi-tenant, globally distributed. They are the default path for ZPA traffic. Operators observe them in logs but cannot configure or deploy them. ZPA PSEs are operator-deployed, single-tenant, and sit in the operator's infrastructure. A ZPA tenant can use both: Public SEs for general road-warrior traffic and PSEs for specific sites, user populations, or regulated workloads. See [`./public-service-edges.md`](./public-service-edges.md) for the Public SE reference.

## Architecture

Source: `vendor/zscaler-help/understanding-private-access-architecture.md`; `vendor/zscaler-help/about-private-service-edges.md`; `vendor/zscaler-help/zsdk-about-zsdk-private-service-edges.md`.

### Data path

A ZPA session brokered by a Private Service Edge follows the same logical path as one brokered by a Public SE:

```
ZCC (user device)
  → ZPA PSE (operator's DC / cloud)
    → App Connector (near the private application)
      → Private application server
```

1. ZCC initiates a session for a private application defined in a ZPA Application Segment.
2. ZPA's Central Authority routes the client to the selected PSE (see "Policy implications" below).
3. ZCC establishes a Z-Tunnel (mutually-authenticated TLS) to the PSE.
4. The PSE applies access policy, selects the best App Connector for the application, and stitches together the M-Tunnel: ZCC Z-Tunnel ↔ PSE ↔ App Connector Z-Tunnel.
5. The App Connector connects to the application server on behalf of the user.
6. No IP network access is granted to the user — only the application protocol traverses the M-Tunnel.

All traffic between ZCC and the PSE, and between the App Connector and the PSE, is end-to-end encrypted (Z-Tunnel/M-Tunnel using pinned certificates). The PSE never terminates or inspects application-layer content; it is a session coordinator, not a proxy or inspection engine.

### Control plane

The PSE registers with the **ZPA Central Authority (CA)** — the ZPA cloud's control plane. Enrollment can use the traditional provisioning-key flow or the newer OAuth2 user-code flow; the current AWS module defaults to OAuth2 and retains provisioning keys as a supported secondary method (`vendor/terraform-aws-zpa-private-service-edge-modules/README.md:21-48`). After enrollment:

- The PSE downloads ZPA policy and configuration from the CA.
- It caches path-selection decisions to reduce latency on repeat sessions.
- Ongoing health and telemetry signals flow back to the CA.
- Software updates are pushed from the CA on the schedule configured in the PSE Group.

The PSE does not communicate directly with ZIA infrastructure. ZPA and ZIA run on separate, isolated multi-tenant infrastructures — a ZPA PSE registers to the ZPA CA, not the ZIA CA.

### Z-Tunnel and M-Tunnel mechanics

Every connection in the ZPA data path uses the **Zscaler Tunnel (Z-Tunnel)** protocol: a mutually-authenticated TLS connection using pinned certificates. A Z-Tunnel exists between ZCC and the PSE, and a second Z-Tunnel exists between the App Connector and the PSE. Within the Z-Tunnels, **Microtunnels (M-Tunnels)** carry individual application sessions.

The authentication model matters for PSE deployments:

- ZCC and App Connectors authenticate using the **organization's PKI** (certificates issued by the ZPA tenant's CA).
- The PSE authenticates using **Zscaler's PKI** (a certificate issued during enrollment by the ZPA CA).
- No private keys leave the device on which they were generated.
- The pinning means that any third-party CA compromise cannot produce a certificate that would be accepted in either direction — Man-in-the-Middle attacks against the Z-Tunnel are cryptographically prevented.

Because the pinning is against Zscaler's CA specifically, enterprise SSL inspection appliances placed in the path between ZCC and the PSE will break connectivity. The Z-Tunnel must traverse any intermediate firewalls without interception.

### When to deploy a Private Service Edge

Deploy a PSE (rather than relying solely on Public Service Edges) when at least one of the following conditions is true:

- Users, applications, or the network path between them are inside a regulated boundary that prohibits cloud transit for ZPA session traffic.
- Network topology prevents ZCC or App Connectors from reaching Zscaler's public PoPs (firewall policy, air-gap, restricted internet access at a site).
- Round-trip latency to the nearest Public SE is high enough to affect application experience, and both users and App Connectors are in the same geographic cluster.
- Business continuity posture requires local session brokering to be available even when external internet connectivity is interrupted.

A PSE is not required — and adds operational overhead — in standard deployments where users and App Connectors have reliable internet access and no regulatory constraint on cloud transit.

## Form factors and deployment

Source: `vendor/zscaler-help/zsdk-deploying-zsdk-private-service-edges.md`; `vendor/terraform-aws-zpa-app-connector-modules/README.md`; `vendor/terraform-azurerm-zpa-app-connector-modules/README.md`.

### VM / virtual appliance

ZPA PSEs are distributed as **virtual machine images** for deployment on enterprise hypervisors. Supported platforms include VMware (ESXi/vSphere). Cloud deployments are possible in private cloud environments that support the VM image format. Zscaler distributes the images; the operator provisions the VM and handles the enrollment step.

This is distinct from ZIA's Virtual Service Edge (VSE), which runs on a broader range of platforms (VMware, Azure, AWS, Hyper-V, GCP) and does inline inspection. ZPA PSEs are not available on public cloud marketplaces in the same way as ZIA VSEs.

### Sizing

Zscaler publishes sizing guidance in the **ZPA Private Service Edge Deployment Prerequisites** document (not captured in vendor sources as of this writing — see open questions). The sizing parameters cover:

- VM CPU and memory allocation per PSE instance.
- Maximum concurrent sessions and session rate per instance.
- NIC requirements (management + data plane separation is typical).

Operators should read the Deployment Prerequisites before provisioning VMs. The PSE is not a generic Linux appliance; it runs Zscaler's embedded OS and has specific resource requirements.

### High availability model

Zscaler recommends deploying PSEs in **pairs (minimum two) per PSE Group**. This mirrors the App Connector Group recommendation. There is no active/passive concept — all PSEs in a group are active simultaneously. The ZPA CA selects among them for each session based on the PSE's health and proximity to the connecting client.

Deployment guidance: **deploy in N+1 configuration**, where N PSEs carry the expected session load and the +1 provides headroom for rolling software updates (the CA does one-at-a-time upgrades within a group so the group stays available during the upgrade window).

A PSE Group can also be designated for **disaster recovery** (`use_in_dr_mode` / `exclusive_for_business_continuity`). In this mode the group is held in reserve and only activated when primary groups are unavailable.

### Enrollment methods

Enrollment is the one-time process by which a PSE obtains its identity. In the traditional provisioning-key flow:

1. On first boot, the PSE generates a local private key encrypted against the VM's hardware fingerprint.
2. It generates a Certificate Signing Request (CSR) and authenticates it to the ZPA CA using the **provisioning key** configured for its PSE Group.
3. The CA returns a signed TLS client certificate.
4. The signed certificate is pinned to the hardware fingerprint of that specific VM.

The current AWS module also supports an OAuth2 user-code flow and makes it the default: each VM publishes its generated code to AWS SSM Parameter Store, Terraform collects the codes, and the Service Edge Group is created with them. This path requires ZPA Terraform provider 4.4.0 or later and does not require a provisioning key (`vendor/terraform-aws-zpa-private-service-edge-modules/README.md:21-48`).

After enrollment, the PSE is paired with a single customer account and cannot be enrolled again. To replace or scale out, deploy a new VM and enroll that new instance with fresh material for the selected OAuth2 or provisioning-key flow. **PSE VMs must not be cloned** after enrollment — the cloned VM's hardware fingerprint will not match the enrolled certificate, and enrollment will fail.

## Configuration

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_private_cloud_group.md`; `vendor/terraform-aws-zpa-app-connector-modules/README.md`; `vendor/terraform-azurerm-zpa-app-connector-modules/README.md`.

### Terraform resources

Three Terraform resources are relevant:

**`zpa_service_edge_group`** — the primary resource for creating and managing a PSE Group. This is the administrative grouping unit for ZPA Private Service Edges. Required arguments: `name`, `latitude`, `longitude`, `location`, `city_country`, `country_code`. Key optional arguments:

| Argument | Purpose |
|---|---|
| `enabled` | Enable/disable the group. Default: `true`. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:201`) |
| `is_public` | Allow remote users outside trusted networks to reach this PSE group. Requires the PSE to be reachable via a public IP. Default: `false`. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:203`) |
| `trusted_networks` | Trusted Network objects whose users are preferentially routed to this PSE group. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:233-234`) |
| `grace_distance_enabled` | Allow this PSE group to override a closer Public SE when the PSE is within `grace_distance_value` of the user. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:205`) |
| `grace_distance_value` | Distance threshold (miles or km, per `grace_distance_value_unit`) within which the PSE overrides a Public SE. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:206-207`) |
| `use_in_dr_mode` | Designate this group for disaster recovery only — held in reserve. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:223`) |
| `upgrade_day` / `upgrade_time_in_secs` | Maintenance window for software updates. Default: `SUNDAY` / `66600` (18:30 UTC). (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:221-222`) |
| `version_profile_name` / `version_profile_id` | Software release track: `Default`, `Previous Default`, `New Release`, or EL8 variants. Set `override_version_profile = true` (`:209`) to use a non-default track. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:211-219`) |
| `enrollment_cert_id` + `user_codes` | OAuth2 enrollment path — provide the enrollment cert and the user codes displayed on the PSE VMs after boot to complete enrollment via Terraform. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:230-231`) |
| `microtenant_id` | Scope to a microtenant (requires microtenant license). (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:224`) |

> **Module coverage gap — `grace_distance_*` and `use_in_dr_mode`**: These are valid provider arguments (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:205-207, :223`) but are **absent from both the AWS and Azure reference module wrappers** (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf:1-95`; `vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf:1-82`). Operators using those modules who need grace distance or DR mode must extend the module or switch to the raw `zpa_service_edge_group` resource directly.

The `service_edges` block within `zpa_service_edge_group` is deprecated and scheduled for removal. PSE membership is established through enrollment rather than by populating this block. Omit it in new configurations.

```hcl
resource "zpa_service_edge_group" "dc_east" {
  name                 = "PSE Group — DC East"
  description          = "Regulated workloads, DC East"
  enabled              = true
  is_public            = false
  latitude             = "40.7128"
  longitude            = "-73.935242"
  location             = "New York, NY, USA"
  city_country         = "New York, US"
  country_code         = "US"
  upgrade_day          = "SUNDAY"
  upgrade_time_in_secs = "66600"
  version_profile_name = "Default"
  use_in_dr_mode       = false

  grace_distance_enabled    = true
  grace_distance_value      = "10"
  grace_distance_value_unit = "MILES"

  trusted_networks {
    id = [data.zpa_trusted_network.dc_east_lan.id]
  }
}
```

**`zpa_private_cloud_group`** — manages a Private Cloud Controller Group, which is a distinct grouping construct used in environments with ZPA Private Cloud Controller deployments (an enterprise private-cloud variant of ZPA control-plane infrastructure). Not required for standard PSE deployments that use Zscaler's public ZPA CA. Key fields mirror `zpa_service_edge_group` (name, location coordinates, upgrade schedule, version profile) and add `site_id` to associate the group with a ZPA site.

**`zpa_lss_config_controller`** (Log Streaming Service) — use `source_log_type = "zpn_sys_auth_log"` to stream PSE Status logs. A second log type, `zpn_pbroker_comprehensive_stats`, streams PSE Metrics. Both require an App Connector Group to relay the logs.

```hcl
data "zpa_lss_config_log_type_formats" "pse_status" {
  log_type = "zpn_sys_auth_log"
}

resource "zpa_lss_config_controller" "pse_status_logs" {
  config {
    name            = "PSE Status → SIEM"
    enabled         = true
    format          = data.zpa_lss_config_log_type_formats.pse_status.json
    lss_host        = "siem.corp.example.com"
    lss_port        = "5001"
    source_log_type = "zpn_sys_auth_log"
    use_tls         = true
    filter          = ["ZPN_STATUS_AUTH_FAILED", "ZPN_STATUS_DISCONNECTED", "ZPN_STATUS_AUTHENTICATED"]
  }
  connector_groups {
    id = [data.zpa_app_connector_group.relay.id]
  }
}
```

### Reference deployment examples

The vendor repos ship ready-to-run example configurations. Summaries below; see `examples/README.md` in each repo for full usage instructions.

**AWS** (`vendor/terraform-aws-zpa-private-service-edge-modules/examples/README.md:46-78`):

| Example | Type | Description |
|---|---|---|
| `base` | Greenfield | VPC + subnets + IGW + NAT Gateway + bastion host; no PSEs deployed |
| `base_pse` | Greenfield | `base` + 2 PSE VMs (1 per AZ), each egressing through the AZ-local NAT Gateway |
| `base_pse_asg` | Greenfield | `base` + PSE Auto Scaling Group (min 2 / max 4 by default) |
| `pse` | Brownfield | 2 PSE VMs in an existing or new VPC; supports BYO VPC/subnets/IGW/NAT/IAM/SG |
| `pse_asg` | Brownfield | ASG variant of `pse`; same BYO options |

**Azure** (`vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/README.md:48-84`; VMSS examples at `vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/base_pse_vmss/README.md:1-9` and `vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/pse_vmss/README.md:1-11`):

| Example | Type | Description |
|---|---|---|
| `base` | Greenfield | Resource Group + VNet + bastion subnet; no PSEs deployed |
| `base_pse` | Greenfield | `base` + 1 or more PSE VMs in an availability set (or zones if supported); count controlled by `pse_count` |
| `pse` | Brownfield | PSE VM(s) in an existing or new VNet; supports BYO Resource Group/VNet/subnets/PIP/NAT GW |
| `base_pse_vmss` | Greenfield | Flexible-orchestration PSE VMSS plus the network and bastion resources used for a testbed deployment |
| `pse_vmss` | Brownfield | Flexible-orchestration PSE VMSS with autoscaling in an existing or newly created Azure environment |

**AWS and Azure autoscaling implementations differ.** AWS uses an Auto Scaling
Group with target tracking; its defaults are min 2, max 4, and a 50% average-CPU
target (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-asg-aws/variables.tf:66-76`,
`:120-138`; ASG and policy at
`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-asg-aws/main.tf:62-68`,
`:107-117`). Azure's flexible VMSS defaults to 2 instances, min 2, max 10,
with CPU-based scale-out and scale-in rules plus optional scheduled scaling
(`vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/pse_vmss/variables.tf:403-472`;
VMSS and autoscale resources at
`vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zsac-pse-vmss-azure/main.tf:5-14`,
`:94-227`).

The Azure VMSS examples default to OAuth2 user-code onboarding. Each instance
publishes its code to Azure Key Vault through a user-assigned managed identity;
Terraform reads the collected codes and supplies them to the Service Edge Group.
Setting `onboarding_method = "provisioning_key"` selects the provisioning-key
path instead (`vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/pse_vmss/README.md:7-11`;
`vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/pse_vmss/variables.tf:125-134`;
`vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/pse_vmss/main.tf:138-194`,
`:273-390`).

### Module defaults and instance types

The AWS and Azure `terraform-zpa-service-edge-group` wrappers still share several defaults, but they are no longer identical (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf:12-95`; `vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf:12-82`):

| Variable | Default | Provider field |
|---|---|---|
| `pse_group_enabled` | `true` | `enabled` |
| `pse_is_public` | `false` | `is_public` |
| `pse_group_upgrade_day` | `SUNDAY` | `upgrade_day` |
| `pse_group_upgrade_time_in_secs` | `66600` (18:30 UTC) | `upgrade_time_in_secs` |
| `pse_group_override_version_profile` | `false` | `override_version_profile` |

Both current cloud wrappers default `pse_group_version_profile_id` to an empty
string and expose `pse_group_city_country` plus OAuth2 `user_codes`
(`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf:24-28`,
`:57-76`, `:91-95`;
`vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf:24-27`,
`:63-76`, `:91-95`). The Azure wrapper passes those values to the provider's
Service Edge Group resource
(`vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/main.tf:22-54`).

**AWS PSE VM** (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-psevm-aws/variables.tf:34-47,78-93`; `vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-psevm-aws/main.tf:16-28`):
- Default instance type: `m5.large`
- Approved types: `t3.xlarge`, `m5.large`, `m5.xlarge`, `m5.2xlarge`, `m5.4xlarge`
- EBS: `gp3`, encrypted; IMDSv2 enforced

**Azure PSE VM** (`vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpse-vm-azure/variables.tf:45-95`):
- Default instance size: `Standard_D2s_v3`
- Approved sizes: `Standard_D2s_v3`, `Standard_D4s_v3` (only 2 SKUs validated)
- Image: RedHat / `rh-rhel` / `rh-rhel9` (latest)
- `zones_enabled` defaults to `false`

**AWS ASG defaults** (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-asg-aws/variables.tf:66-138`; `vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-asg-aws/main.tf:62-68,86-100,107-117`):

| Parameter | Default |
|---|---|
| `min_size` | `2` |
| `max_size` | `4` |
| `health_check_grace_period` | `300` s |
| `health_check_type` | `EC2` |
| `target_tracking_metric` | `ASGAverageCPUUtilization` |
| `target_cpu_util_value` | `50` % |
| `warm_pool_enabled` | `false` |

Enabled CloudWatch metrics (8): GroupDesiredCapacity, GroupInServiceInstances, GroupMaxSize, GroupMinSize, GroupPendingInstances, GroupStandbyInstances, GroupTerminatingInstances, GroupTotalInstances (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-asg-aws/main.tf:75-84`).

### IAM and security groups (AWS)

The `terraform-zspse-iam-aws` module creates an `aws_iam_role` with an `ec2.amazonaws.com` assume-role trust and an instance profile (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-iam-aws/main.tf:8-46`). It also attaches an inline SSM policy for the OAuth token relay, granting `PutParameter`, `AddTagsToResource`, `GetParameter`, and `DeleteParameter` on `parameter/zpa/oauth-tokens/*` (`:49-73`). Operators remain responsible for any unrelated AWS-service permissions.

The `terraform-zspse-sg-aws` module creates three inbound security group rules (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-sg-aws/main.tf:42-73`):
- SSH TCP/22 from VPC CIDR
- HTTPS TCP/443 from VPC CIDR (or `0.0.0.0/0` when `associate_public_ip_address = true`)
- HTTPS UDP/443 from VPC CIDR (or `0.0.0.0/0` when public)

This is consistent with the gotcha documented above that ZPA Z-Tunnel traffic uses port 443 TCP and optionally UDP/443 for DTLS.

### Python SDK methods

**Service Edge Group** (`client.zpa.service_edge_group`):

| Method | HTTP | Endpoint |
|---|---|---|
| `list_service_edge_groups(query_params)` | GET | `/serviceEdgeGroup` |
| `get_service_edge_group(group_id)` | GET | `/serviceEdgeGroup/{id}` |
| `add_service_edge_group(**kwargs)` | POST | `/serviceEdgeGroup` |
| `update_service_edge_group(group_id, **kwargs)` | PUT | `/serviceEdgeGroup/{id}` |
| `delete_service_edge_group(group_id)` | DELETE | `/serviceEdgeGroup/{id}` |

Key kwargs for `add_service_edge_group` / `update_service_edge_group`: `name`, `latitude`, `longitude`, `location`, `city_country`, `country_code`, `enabled`, `is_public`, `upgrade_day`, `upgrade_time_in_secs`, `version_profile_id`, `grace_distance_enabled`, `grace_distance_value`, `grace_distance_value_unit`, `trusted_network_ids` (list → serialized to `trustedNetworks`), `service_edge_ids` (list → serialized to `serviceEdges`, deprecated), `use_in_dr_mode`.

**Individual Service Edges** (`client.zpa.service_edges`):

| Method | HTTP | Endpoint |
|---|---|---|
| `list_service_edges(query_params)` | GET | `/serviceEdge` |
| `get_service_edge(service_edge_id)` | GET | `/serviceEdge/{id}` |
| `update_service_edge(service_edge_id, **kwargs)` | PUT | `/serviceEdge/{id}` |
| `delete_service_edge(service_edge_id)` | DELETE | `/serviceEdge/{id}` |
| `bulk_delete_service_edges(service_edge_ids)` | POST | `/serviceEdge/bulkDelete` |

Individual PSE instances are enrolled rather than created through the Service Edge CRUD surface. The current AWS module supports either OAuth2 user codes or provisioning keys; after enrollment, the API manages the instance record (rename, enable/disable, deregister).

**Private Cloud Group** (`client.zpa.private_cloud_group`):

| Method | HTTP | Endpoint |
|---|---|---|
| `list_cloud_groups(query_params)` | GET | `/privateCloudControllerGroup` (`private_cloud_group.py:38`, `:79`) |
| `get_cloud_group(group_id)` | GET | `/privateCloudControllerGroup/{id}` (`private_cloud_group.py:103`, `:125`) |
| `add_cloud_group(**kwargs)` | POST | `/privateCloudControllerGroup` (`private_cloud_group.py:147`, `:217`) |
| `update_cloud_group(group_id, **kwargs)` | PUT | `/privateCloudControllerGroup/{id}` (`private_cloud_group.py:239`, `:311`) |
| `delete_cloud_group(group_id)` | DELETE | `/privateCloudControllerGroup/{id}` (`private_cloud_group.py:338`, `:361`) |
| `list_private_cloud_group_summary()` | GET | `/privateCloudControllerGroup/summary` (`private_cloud_group.py:376`, `:414`) |

**Private Cloud Controller** (`client.zpa.private_cloud_controller`):

This is the controller-level (instance) resource, the same relationship to Private Cloud Group that the individual `service_edges` resource has to `service_edge_group`: the group is the administrative container, the controller is a member instance. It targets the singular `/privateCloudController` endpoint (vs the group's `/privateCloudControllerGroup`).

| Method | HTTP | Endpoint |
|---|---|---|
| `list_cloud_controllers(query_params)` | GET | `/privateCloudController` (`private_cloud_controller.py:37`, `:83`) |
| `get_cloud_controller(controller_id, query_params)` | GET | `/privateCloudController/{id}` (`private_cloud_controller.py:107`, `:127`) |
| `update_cloud_controller(controller_id, **kwargs)` | PUT | `/privateCloudController/{id}` (`private_cloud_controller.py:149`, `:181`) |
| `delete_cloud_controller(controller_id)` | DELETE | `/privateCloudController/{id}` (`private_cloud_controller.py:208`, `:230`) |
| `restart_private_controller(controller_id)` | PUT | `/privateCloudController/{id}/restart` (`private_cloud_controller.py:245`, `:267`) |

`update_cloud_controller` accepts `name`, `description`, and `enabled` kwargs (`private_cloud_controller.py:156-159`). `restart_private_controller` triggers an instance restart with no body — the controller-level counterpart to a maintenance action, with no equivalent on the group resource. The accessor is registered at `vendor/zscaler-sdk-python/zscaler/zpa/zpa_service.py:346-348`.

### Go SDK

`serviceedgegroup` package (`zscaler/zpa/services/serviceedgegroup/`): `Get`, `GetByName`, `Create`, `Update`, `Delete`, `GetAll` — all using `*ServiceEdgeGroup` struct. Key struct fields from the Go model: `GraceDistanceEnabled`, `GraceDistanceValue`, `GraceDistanceValueUnit`, `UseInDrMode`, `ExclusiveForBusinessContinuity`, `IsPublic`, `AltCloud` (alternative cloud domain override), `SiteID`, `TrustedNetworks`, `ServiceEdges`, `EnrollmentCertID`. Every ZPA call must pass `common.Filter{MicroTenantID: service.MicroTenantID()}`.

### Enrollment credentials

A provisioning key is a shared enrollment secret that associates a PSE with a PSE Group. Provisioning keys for PSEs are managed separately from App Connector provisioning keys in the ZPA Admin Console (Infrastructure > Private Access > Component > Private Service Edge Groups > Provisioning Keys). The key is presented during enrollment; the TLS client certificate takes over for ongoing authentication.

The AWS module's secondary provisioning-key flow creates the generic Terraform `zpa_provisioning_key` resource with association type `SERVICE_EDGE_GRP` and binds it to the PSE Group, or reads a caller-supplied key (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-provisioning-key/main.tf:9-23`; `vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-provisioning-key/variables.tf:25-35,43-58`). The default OAuth2 flow does not use a provisioning key; it relays per-VM user codes through SSM instead (`vendor/terraform-aws-zpa-private-service-edge-modules/README.md:21-48`).

## Admin Console navigation

Source: `vendor/zscaler-help/about-private-service-edges.md`; `vendor/zscaler-help/about-private-service-edge-groups.md`.

ZPA Private Service Edges and their groups are managed under **Infrastructure > Private Access > Component**:

- **Private Service Edges** — lists all enrolled and deployed PSE instances. Instances that have been added (provisioning key generated) but not yet deployed (VM not enrolled) do not appear here. From this view you can rename, enable/disable, or delete a PSE record. PSE Groups that are Zscaler-managed are read-only in this view.
- **Private Service Edge Groups** — lists all PSE Groups. Supports both table and map views. From this view you manage group configuration: location, trusted networks, upgrade schedule, version profile, DR mode, and proximity override settings. Each group shows its member PSEs, provisioning keys, and the next scheduled software update time.

The Auto Delete feature (configurable under Private Service Edges page settings) automatically removes PSE records that have been disconnected or disabled for a configured number of days. This helps keep the Admin Console clean in environments where PSE VMs are frequently replaced. Although the help docs present Auto Delete as an Admin Console setting, it has a full API/SDK surface — see [§Auto Delete schedule (API)](#auto-delete-schedule-api) below.

## Auto Delete schedule (API)

Source: `vendor/zscaler-sdk-python/zscaler/zpa/service_edge_schedule.py`.

The Admin Console Auto Delete setting is backed programmatically by `ServiceEdgeScheduleAPI` (`client.zpa.service_edge_schedule`, registered in `vendor/zscaler-sdk-python/zscaler/zpa/zpa_service.py:296-298`). It manages the org-wide schedule that purges disconnected/disabled Service Edge records on a configured cadence.

| Method | HTTP | Endpoint |
|---|---|---|
| `get_service_edge_schedule(customer_id=None)` | GET | `/serviceEdgeSchedule` (`service_edge_schedule.py:41`, `:54-57`) |
| `add_service_edge_schedule(schedule)` | POST | `/serviceEdgeSchedule` (`service_edge_schedule.py:85`, `:100-103`) |
| `update_service_edge_schedule(scheduler_id, schedule)` | PUT | `/serviceEdgeSchedule/{scheduler_id}` (`service_edge_schedule.py:149`, `:166-169`) |

The request payload uses these fields (`service_edge_schedule.py:119-127`); the SDK converts snake_case kwargs to the camelCase wire fields shown:

| Wire field (camelCase) | SDK kwarg | Meaning |
|---|---|---|
| `frequency` | `frequency` | Cadence at which disconnected Service Edges are deleted (`service_edge_schedule.py:91`, `:121`). |
| `frequencyInterval` | `frequency_interval` | Interval value for that frequency (`service_edge_schedule.py:122`). |
| `deleteDisabled` | `delete_disabled` | Whether disabled (not just disconnected) Service Edges are also eligible for deletion (`service_edge_schedule.py:124-125`). |
| `enabled` | `enabled` | Whether the auto-delete schedule is active (`service_edge_schedule.py:126-127`). |

The response model (`vendor/zscaler-sdk-python/zscaler/zpa/models/service_edge_schedule.py:32-37`) exposes `id`, `frequency`, `frequency_interval`, `enabled`, `delete_disabled`, and `customer_id`. `customer_id` is sourced from the client config or the `ZPA_CUSTOMER_ID` environment variable; `microtenant_id` (if set) is passed as the `microtenantId` query parameter (`service_edge_schedule.py:62-64`, `:130-131`). This is the same singleton-schedule pattern the App Connector side uses for its own auto-delete schedule.

## Software version profiles

Source: `vendor/zscaler-help/about-private-service-edge-groups.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md`.

Each PSE Group is assigned a **version profile** that controls which release track the PSEs in that group follow. Supported profile names:

| Profile name | Description |
|---|---|
| `Default` | The standard production release. Most tenants use this. |
| `Previous Default` | One release behind Default — used when a rollback cadence is needed. |
| `New Release` | The latest release ahead of Default — used for early validation. |
| `Default - el8` | Default release built against EL8 (RHEL 8-compatible) OS. |
| `New Release - el8` | New Release built against EL8 OS. |
| `Previous Default - el8` | Previous Default on EL8. |

The `el8` variants exist for environments that require OS-level compatibility with RHEL 8 or compatible distributions. Set `override_version_profile = true` in Terraform to use a profile other than the tenant's global default; otherwise the PSE Group inherits the tenant-wide version profile setting.

## Policy implications

Source: `vendor/zscaler-help/understanding-private-access-architecture.md`; `vendor/zscaler-help/about-private-service-edges.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md`.

### PSE selection by ZCC

ZPA's Central Authority selects which Service Edge (Public or Private) to route a given client to. The selection logic considers:

1. **Trusted Networks matching.** If a client is on a network that matches a Trusted Network associated with a PSE Group, that PSE Group is preferred. This is the primary mechanism for routing on-campus users to an on-prem PSE rather than to a Public SE in a distant PoP.

2. **Geographic proximity.** Among available PSE Groups (and Public SEs), the CA selects the nearest based on latitude/longitude coordinates. This is why accurate location coordinates on the PSE Group matter operationally — incorrect coordinates cause sub-optimal routing.

3. **`is_public` flag.** If `is_public` is `false` on the PSE Group, only users on matching Trusted Networks will be routed to that group. Remote users (outside the trusted networks) will fall back to Public SEs. Set `is_public = true` only if the PSE is reachable via a public IP and remote users should be directed to it.

4. **Grace distance override.** The `grace_distance_enabled` / `grace_distance_value` parameters allow a PSE Group to be preferred over a closer Public SE when the PSE is within the specified distance threshold of the user. This handles the common case where a user is on the LAN near the PSE but the nearest Zscaler PoP is also geographically close — without grace distance, the PoP might win on raw proximity.

5. **Disaster recovery mode.** PSE Groups with `use_in_dr_mode = true` are excluded from normal selection. They only become active if the primary groups (and Public SEs) are unavailable.

### Policy enforcement on the PSE

Once a session is routed to a PSE, it enforces all standard ZPA access policy: segment-level rules, posture check conditions, SAML attribute matching, timeout policies. The PSE downloads current policy from the CA at enrollment and refreshes it on a continuous basis. There is no separate policy configuration for PSEs — policy is uniform across Public and Private SEs.

**Location-based policy.** When a client connects to a PSE with an RFC 1918 source IP (i.e., from the LAN), the PSE uses the **PSE Group's own location** (not the client's IP) for country-based policy evaluation. When the client connects with a public IP, the client's public IP determines the country. This matters for access policies with country criteria — a PSE deployed in a different country from most users may produce unexpected policy outcomes for LAN clients.

**Alternative cloud domain.** The `AltCloud` / `alt_cloud_domain` field on a PSE Group overrides the default cloud domain for that group. This is used in sovereign cloud or private cloud topologies where the ZPA control plane is served from a non-standard domain. Uncommon in standard enterprise deployments.

### Regulatory and geographic constraints

PSEs are the mechanism for enforcing ZPA session-level data residency. Configuring a PSE Group in a specific country and binding it to the Trusted Networks for that site ensures that ZPA session metadata and session-brokering traffic stay within the geographic boundary. This is sufficient for many regulatory frameworks that require ZPA control-plane traffic to remain in-country.

Note that the PSE manages session setup, not application data persistence. Application data still flows from the App Connector to the application server; the App Connector's placement (and the application server's location) determines where application data resides. The PSE constrains only the ZPA brokering path.

### Microtenants and PSE Group scoping

ZPA Microtenants allow a single ZPA tenant to host logically isolated sub-tenants, each with their own policy, users, and infrastructure objects. PSE Groups support microtenant scoping via the `microtenant_id` field. A PSE Group scoped to a microtenant is only visible and usable within that microtenant's context. This is relevant in managed-service or multi-entity deployments where different business units or customers share a ZPA tenant but require dedicated PSE infrastructure.

The microtenant feature requires a license. In standard single-tenant deployments, leave `microtenant_id` unset. The Go SDK requires `common.Filter{MicroTenantID: service.MicroTenantID()}` on every API call; if no microtenant is configured the value is nil and the filter is omitted from the request — no additional handling needed.

## Common gotchas

Source: `vendor/zscaler-help/about-private-service-edges.md`; `vendor/zscaler-help/about-private-service-edge-groups.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md`.

Note: This section summarizes the cited PSE material above.

**1. PSE vs Public SE selection criteria — grace distance is required for LAN preference.**
Without `grace_distance_enabled`, ZPA may route LAN users to a geographically close Zscaler PoP rather than to the on-prem PSE. This defeats the purpose of the PSE for latency and regulatory use cases. Always configure grace distance when deploying a PSE for on-premises users. Test from client devices on the Trusted Network to confirm PSE selection is occurring (check LSS logs for the Service Edge identity).

**2. `is_public = false` means remote users do not reach the PSE.**
A PSE Group with `is_public = false` is invisible to users outside the mapped Trusted Networks. This is often the correct posture for regulated-site PSEs. But if business continuity or remote-to-PSE use cases are required, `is_public = true` with a publicly reachable PSE IP is necessary. Mixing this with a PSE behind a firewall that only allows LAN traffic will silently fail for remote users.

**3. Certificate trust chain — Zscaler PKI, not the enterprise CA.**
ZCC and App Connectors authenticate the PSE using Zscaler's PKI — the same PKI used for Public SEs. There is no mechanism to use an enterprise internal CA for PSE authentication. Firewall SSL inspection between ZCC and the PSE will break the Z-Tunnel if the firewall is re-signing certificates with an enterprise CA — the pinned-certificate verification will fail. Traffic between ZCC and the PSE must not be subjected to MITM / SSL break-and-inspect.

**4. PSE VM cloning breaks enrollment.**
The enrollment certificate is pinned to the hardware fingerprint of the VM at enrollment time. Cloning the VM after enrollment creates a second VM with a different hardware fingerprint. The cloned VM cannot use the enrolled certificate and will fail to authenticate to the CA. If you need to scale out PSEs, enroll each new VM separately with fresh material for the selected OAuth2 or provisioning-key flow.

**5. NAT and firewall transit.**
The PSE must be able to reach the ZPA CA (outbound to Zscaler cloud infrastructure). If the PSE is behind NAT, the CA sees the NAT public IP rather than the PSE's private IP; this is generally fine for control-plane connectivity. Inbound from ZCC: ZCC clients establish connections to the PSE's data-plane IP or FQDN. If the PSE is behind a firewall, the firewall must allow inbound ZPA tunnel traffic (port 443 TCP, plus optionally UDP for DTLS) from client source IPs to the PSE's data-plane IP. App Connectors connect outbound to the PSE on the same port; no inbound from App Connectors to the PSE is required on the App Connector's firewall.

**6. Software updates are automated — set a maintenance window.**
The CA pushes software updates to PSEs on the schedule configured in the PSE Group (`upgrade_day`, `upgrade_time_in_secs`). Unlike ZIA PSE clusters where Zscaler Cloud Ops coordinates updates, ZPA PSE updates are automated per the schedule. Set the maintenance window to an off-hours period for the PSE's geographic region. Updates happen one PSE at a time within a group to preserve session availability.

**7. LSS log source types for PSEs.**
Two distinct LSS source log types cover PSEs: `zpn_sys_auth_log` (PSE Status — connection state changes, auth failures) and `zpn_pbroker_comprehensive_stats` (PSE Metrics — capacity and performance counters). Both require an App Connector Group as the log relay. Configuring only `zpn_sys_auth_log` gives visibility into PSE health events; `zpn_pbroker_comprehensive_stats` is needed for capacity monitoring.

**8. Relationship to App Connectors.**
App Connectors connect outbound to the PSE (or to Public SEs). When a PSE is deployed, App Connectors in the same geographic scope will prefer connecting to it over a distant Public SE. This is the correct behavior — the PSE is upstream of the App Connector in the session path. However, App Connectors do not automatically know about a new PSE; they receive updated topology from the CA. After enrolling a new PSE, allow a short CA propagation interval before testing App Connector connectivity to it. See [`./app-connector.md`](./app-connector.md) for App Connector group and routing mechanics.

**9. PSE Group location and GeoIP for policy evaluation.**
The PSE Group's configured location (latitude, longitude, `country_code`) is used for two purposes: routing proximity calculations and country-based policy evaluation for RFC 1918 clients. If the location is misconfigured — for example, pointing to the wrong city or country — on-LAN users with RFC 1918 IPs will have country-based ZPA policies applied for the wrong country. This is a silent misconfiguration: ZPA will not error, but policies with country conditions will behave incorrectly. Verify that `country_code` matches the physical location of the PSE.

**10. `ReadOnly` and Zscaler-managed PSE Groups.**
The `ReadOnly` and `ZscalerManaged` fields on the `ServiceEdgeGroup` struct (Go SDK) indicate PSE Groups that Zscaler has pre-provisioned in a tenant. These groups cannot be edited or deleted through the Admin Console or API. Any Terraform `import` of such a group will result in a plan that cannot apply — the provider will attempt to reconcile and the API will reject mutations. Do not import Zscaler-managed PSE Groups into Terraform state.

## Open questions

- **PSE VM sizing specifics** — the Deployment Prerequisites document referenced in help sources was not available in the captured vendor corpus. vCPU, vRAM, and disk requirements per PSE VM and per-instance session limits are not confirmed. Validate against the current Deployment Prerequisites doc before provisioning. (Tracked as [`zpa-47`](../_meta/clarifications.md#zpa-47-private-service-edge-vm-sizing-and-per-instance-session-limits).)
- **Supported hypervisor list** — VMware (ESXi/vSphere) is confirmed. It is not confirmed whether OVA images are provided for Hyper-V, KVM, or cloud-native VM formats (AWS AMI, Azure image) for ZPA PSEs specifically. ZIA VSEs support those platforms, but ZPA PSEs may differ. (Tracked as [`zpa-49`](../_meta/clarifications.md#zpa-49-supported-hypervisor-cloud-image-formats-for-zpa-pses).)
- **PSE hardware appliance** — the ZIA PSE product has dedicated hardware appliances (PSE 3, PSE 5 physical clusters). It is not confirmed whether ZPA PSEs are virtual-only or also available as dedicated hardware. The help sources describe only VM images. (Tracked as [`zpa-50`](../_meta/clarifications.md#zpa-50-zpa-pse-dedicated-hardware-appliance-availability).)
- **Private Cloud Controller vs PSE Group — product positioning** — the SDK surface is now documented above: `/privateCloudControllerGroup` (group container) and `/privateCloudController` (member instance) form the same group/instance pairing as `/serviceEdgeGroup` ÷ `/serviceEdge`, with `site_id` and `privateBrokerGroupIds` linking the group to a ZPA site (`vendor/zscaler-sdk-python/zscaler/zpa/private_cloud_group.py:180`, `:201`). What the SDK source does **not** settle is the product semantics: whether the Private Cloud Controller family is a sovereign/private-cloud ZPA control-plane variant or simply an alternate PSE grouping type, and whether it is in scope for standard PSE deployments using Zscaler's public ZPA CA. Confirm against ZPA Private Cloud product docs before treating it as part of a standard PSE rollout. (Tracked as [`zpa-51`](../_meta/clarifications.md#zpa-51-private-cloud-controller-product-positioning).)
- **`restart_private_controller` operational semantics** — the SDK exposes `PUT /privateCloudController/{id}/restart` (`vendor/zscaler-sdk-python/zscaler/zpa/private_cloud_controller.py:245`, `:267`), but the source does not state whether the restart is graceful (drains sessions first) or hard, nor whether an equivalent restart action exists for ordinary `serviceEdge` instances (none is present in `service_edges.py` as captured). Confirm restart behavior and session impact before using it on a live controller. (Tracked as [`zpa-52`](../_meta/clarifications.md#zpa-52-restart_private_controller-operational-semantics).)
- **Auto Delete schedule defaults and accepted `frequency` values** — `ServiceEdgeScheduleAPI` accepts `frequency` / `frequencyInterval` (`vendor/zscaler-sdk-python/zscaler/zpa/service_edge_schedule.py:121-122`), but the SDK does not enumerate the accepted enum values (e.g. days vs weeks) or the default cadence when the schedule is first enabled. Confirm the accepted values and defaults against the ZPA API reference or Admin Console. (Tracked as [`zpa-53`](../_meta/clarifications.md#zpa-53-service-edge-auto-delete-schedule-accepted-frequency-values-and-defaults).)
- **Location / GeoIP update behavior** — the help docs note that if the PSE Group location is updated for an existing active connection, the PSE uses the old location until the next new connection. The propagation delay for location changes across the CA topology is not quantified. Treat location changes as requiring a maintenance window. (Tracked as [`zpa-54`](../_meta/clarifications.md#zpa-54-pse-location-geoip-update-propagation-delay).)
- **OAuth2 enrollment licensing prerequisites** — the AWS module now establishes that OAuth2 user-code enrollment is the default and provisioning-key enrollment remains supported, but it does not state whether OAuth2 requires a particular ZPA license or tenant-side enablement beyond provider 4.4.0+. Confirm that prerequisite before standardizing on the default flow. (Tracked as [`zpa-55`](../_meta/clarifications.md#zpa-55-pse-oauth2-enrollment-path-licensereplacement-semantics).)
- **Maximum PSEs per group** — unlike App Connector Groups, no documented maximum PSE count per PSE Group was found in the captured sources. Confirm with Zscaler documentation or support for large-scale deployments. (Tracked as [`zpa-56`](../_meta/clarifications.md#zpa-56-maximum-pses-per-group).)

## Cross-links

- ZPA Public Service Edges (Zscaler-managed, default path; read-only to operators) — [`./public-service-edges.md`](./public-service-edges.md)
- ZIA Private Service Edge (completely separate product — inline ZIA traffic inspection cluster, not related to ZPA) — [`../zia/private-service-edge.md`](../zia/private-service-edge.md)
- App Connector (the downstream hop from the PSE to the private application) — [`./app-connector.md`](./app-connector.md)
- Trusted Networks (binding of LAN subnets to PSE Groups for routing preference) — [`./trusted-networks.md`](./trusted-networks.md)
- ZPA access policy and country-based policy evaluation (how the PSE Group location affects policy) — [`./policy-precedence.md`](./policy-precedence.md)
- Log Streaming Service / Log Receivers (PSE status `zpn_sys_auth_log` and metrics `zpn_pbroker_comprehensive_stats`) — [`./log-receivers.md`](./log-receivers.md)
- Microtenants (PSE Group microtenant scoping for multi-entity deployments) — [`./microtenants.md`](./microtenants.md)
- ZPA architecture overview (Z-Tunnel, M-Tunnel, Central Authority, full component topology) — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
- ZPA SDK reference (Python and Go SDK patterns for all ZPA resources) — [`./sdk.md`](./sdk.md)
- ZPA Terraform reference (provider usage, import patterns, state management) — [`./terraform.md`](./terraform.md)

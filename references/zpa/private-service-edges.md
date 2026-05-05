---
product: zpa
topic: "zpa-private-service-edges"
title: "ZPA Private Service Edges — on-prem brokering for private app access"
content-type: reference
last-verified: "2026-05-05"
confidence: medium
source-tier: doc
verified-against:
  vendor/terraform-aws-zpa-private-service-edge-modules: 281208029caac90939ab0b8b335342f5cb39fe4d
  vendor/terraform-azurerm-zpa-private-service-edge-modules: 7c64477411d028ee67c47d58c1cde872d469ec44
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
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgegroup/zpa_service_edge_group.go"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-asg-aws/variables.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-asg-aws/main.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-psevm-aws/variables.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-sg-aws/main.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-iam-aws/main.tf"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/examples/README.md"
  - "vendor/terraform-aws-zpa-private-service-edge-modules/README.md"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpse-vm-azure/variables.tf"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/README.md"
  - "vendor/terraform-azurerm-zpa-private-service-edge-modules/README.md"
author-status: draft
---

# ZPA Private Service Edges — on-prem brokering for private app access

> **Name collision warning.** "Private Service Edge" exists in both ZPA and ZIA but refers to completely different products. This document covers the ZPA variant only — an on-prem broker for private application access. The ZIA Private Service Edge is an inline traffic inspection cluster for internet-bound traffic and is documented separately at [`../zia/private-service-edge.md`](../zia/private-service-edge.md). Do not conflate these: different product, different architecture, different use case, different Terraform resources.

## Overview

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

The PSE registers with the **ZPA Central Authority (CA)** — the ZPA cloud's control plane. Registration uses a provisioning key, which the PSE presents to the CA during enrollment to obtain a signed TLS client certificate. After enrollment:

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

### Enrollment and the provisioning key

Enrollment is the one-time process by which a PSE obtains its identity:

1. On first boot, the PSE generates a local private key encrypted against the VM's hardware fingerprint.
2. It generates a Certificate Signing Request (CSR) and authenticates it to the ZPA CA using the **provisioning key** configured for its PSE Group.
3. The CA returns a signed TLS client certificate.
4. The signed certificate is pinned to the hardware fingerprint of that specific VM.

After enrollment, the PSE is bound to a single ZPA tenant. It cannot be re-enrolled without a new provisioning key. **PSE VMs must not be cloned** after enrollment — the cloned VM's hardware fingerprint will not match the enrolled certificate, and enrollment will fail.

## Configuration

### Terraform resources

Three Terraform resources are relevant:

**`zpa_service_edge_group`** — the primary resource for creating and managing a PSE Group. This is the administrative grouping unit for ZPA Private Service Edges. Required arguments: `name`, `latitude`, `longitude`, `location`, `city_country`, `country_code`. Key optional arguments:

| Argument | Purpose |
|---|---|
| `enabled` | Enable/disable the group. Default: `true`. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:142`) |
| `is_public` | Allow remote users outside trusted networks to reach this PSE group. Requires the PSE to be reachable via a public IP. Default: `false`. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:144`) |
| `trusted_networks` | Trusted Network objects whose users are preferentially routed to this PSE group. |
| `grace_distance_enabled` | Allow this PSE group to override a closer Public SE when the PSE is within `grace_distance_value` of the user. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:146`) |
| `grace_distance_value` | Distance threshold (miles or km, per `grace_distance_value_unit`) within which the PSE overrides a Public SE. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:147`) |
| `use_in_dr_mode` | Designate this group for disaster recovery only — held in reserve. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:164`) |
| `upgrade_day` / `upgrade_time_in_secs` | Maintenance window for software updates. Default: `SUNDAY` / `66600` (18:30 UTC). (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:162-163`) |
| `version_profile_name` / `version_profile_id` | Software release track: `Default`, `Previous Default`, `New Release`, or EL8 variants. (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:152-160`) |
| `enrollment_cert_id` + `user_codes` | OAuth2 enrollment path — provide the enrollment cert and the user codes displayed on the PSE VMs after boot to complete enrollment via Terraform. |
| `microtenant_id` | Scope to a microtenant (requires microtenant license). (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:165`) |

> **Module coverage gap — `grace_distance_*` and `use_in_dr_mode`**: These are valid provider arguments (`vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md:146-148, :164`) but are **absent from both the AWS and Azure reference module wrappers** (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf:1-83`; `vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf:1-83`). Operators using those modules who need grace distance or DR mode must extend the module or switch to the raw `zpa_service_edge_group` resource directly.

The `service_edges` block within `zpa_service_edge_group` is deprecated and scheduled for removal. PSE membership is managed externally (via provisioning key enrollment), not by Terraform. Omit this block in new configurations.

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

**Azure** (`vendor/terraform-azurerm-zpa-private-service-edge-modules/examples/README.md:48-84`):

| Example | Type | Description |
|---|---|---|
| `base` | Greenfield | Resource Group + VNet + bastion subnet; no PSEs deployed |
| `base_pse` | Greenfield | `base` + 1 or more PSE VMs in an availability set (or zones if supported); count controlled by `pse_count` |
| `pse` | Brownfield | PSE VM(s) in an existing or new VNet; supports BYO Resource Group/VNet/subnets/PIP/NAT GW |

**AWS vs Azure scaling asymmetry**: The AWS modules include a native Auto Scaling Group (`terraform-zspse-asg-aws`) with target-tracking autoscaling (default min 2 / max 4, CPU target 50%) (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-asg-aws/variables.tf:66-76, :134-138`). The Azure modules have **no VMSS or equivalent autoscaling construct** — the only multi-VM mechanism is the manual `pse_count` variable (default 1, max 250) (`vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpse-vm-azure/variables.tf:87-94`). Azure PSE scale-out requires re-running Terraform with an updated `pse_count`, not policy-driven autoscaling.

### Module defaults and instance types

The `terraform-zpa-service-edge-group` module wrapper (identical in both the AWS and Azure repos) applies these defaults (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf:12-83`; `vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpa-service-edge-group/variables.tf:12-83`):

| Variable | Default | Provider field |
|---|---|---|
| `pse_group_enabled` | `true` | `enabled` |
| `pse_is_public` | `false` | `is_public` |
| `pse_group_upgrade_day` | `SUNDAY` | `upgrade_day` |
| `pse_group_upgrade_time_in_secs` | `66600` (18:30 UTC) | `upgrade_time_in_secs` |
| `pse_group_version_profile_id` | `2` (New Release) | `version_profile_id` |
| `pse_group_override_version_profile` | `false` | `override_version_profile` |

**AWS PSE VM** (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-psevm-aws/variables.tf:34-47`):
- Default instance type: `m5.large`
- Approved types: `t3.xlarge`, `m5.large`, `m5.xlarge`, `m5.2xlarge`, `m5.4xlarge`
- EBS: `gp3`, encrypted; IMDSv2 enforced

**Azure PSE VM** (`vendor/terraform-azurerm-zpa-private-service-edge-modules/modules/terraform-zpse-vm-azure/variables.tf:45-95`):
- Default instance size: `Standard_D2s_v3`
- Approved sizes: `Standard_D2s_v3`, `Standard_D4s_v3` (only 2 SKUs validated)
- Image: RedHat / `rh-rhel` / `rh-rhel9` (latest)
- `zones_enabled` defaults to `false`

**AWS ASG defaults** (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-asg-aws/variables.tf:66-138`; `vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-asg-aws/main.tf:84, 92-101`):

| Parameter | Default |
|---|---|
| `min_size` | `2` |
| `max_size` | `4` |
| `health_check_grace_period` | `300` s |
| `health_check_type` | `EC2` |
| `target_tracking_metric` | `ASGAverageCPUUtilization` |
| `target_cpu_util_value` | `50` % |
| `warm_pool_enabled` | `false` |

Enabled CloudWatch metrics (8): GroupDesiredCapacity, GroupInServiceInstances, GroupMaxSize, GroupMinSize, GroupPendingInstances, GroupStandbyInstances, GroupTerminatingInstances, GroupTotalInstances (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-asg-aws/main.tf:92-101`).

### IAM and security groups (AWS)

The `terraform-zspse-iam-aws` module creates an `aws_iam_role` with an `ec2.amazonaws.com` assume-role trust and an instance profile (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zspse-iam-aws/main.tf:8-46`). No IAM policies are attached — operators must attach any additional policies required for the PSE VM to access other AWS services.

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

Individual PSE instances are enrolled via provisioning key, not created via the API. The API manages the instance record after enrollment (rename, enable/disable, deregister).

**Private Cloud Group** (`client.zpa.private_cloud_group`):

| Method | HTTP | Endpoint |
|---|---|---|
| `list_cloud_groups(query_params)` | GET | `/privateCloudControllerGroup` |
| `get_cloud_group(group_id)` | GET | `/privateCloudControllerGroup/{id}` |
| `add_cloud_group(**kwargs)` | POST | `/privateCloudControllerGroup` |
| `update_cloud_group(group_id, **kwargs)` | PUT | `/privateCloudControllerGroup/{id}` |
| `delete_cloud_group(group_id)` | DELETE | `/privateCloudControllerGroup/{id}` |
| `list_private_cloud_group_summary()` | GET | `/privateCloudControllerGroup/summary` |

### Go SDK

`serviceedgegroup` package (`zscaler/zpa/services/serviceedgegroup/`): `Get`, `GetByName`, `Create`, `Update`, `Delete`, `GetAll` — all using `*ServiceEdgeGroup` struct. Key struct fields from the Go model: `GraceDistanceEnabled`, `GraceDistanceValue`, `GraceDistanceValueUnit`, `UseInDrMode`, `ExclusiveForBusinessContinuity`, `IsPublic`, `AltCloud` (alternative cloud domain override), `SiteID`, `TrustedNetworks`, `ServiceEdges`, `EnrollmentCertID`. Every ZPA call must pass `common.Filter{MicroTenantID: service.MicroTenantID()}`.

### Provisioning keys

A provisioning key is a single-use-per-instance shared secret that associates a PSE with a PSE Group during enrollment. Provisioning keys for PSEs are managed separately from App Connector provisioning keys in the ZPA Admin Console (Infrastructure > Private Access > Component > Private Service Edge Groups > Provisioning Keys). Each PSE Group has its own provisioning key; a single key can be used to enroll multiple PSEs into the same group. The key is presented by the PSE VM during enrollment; it does not persist on the PSE after enrollment completes (the TLS client cert takes over for ongoing authentication).

There is no Terraform resource for ZPA PSE provisioning keys in the captured vendor sources (unlike App Connector provisioning keys, which have `zpa_provisioning_key`). Provisioning key generation must be done via the Admin Console or ZPA API directly.

## Admin Console navigation

ZPA Private Service Edges and their groups are managed under **Infrastructure > Private Access > Component**:

- **Private Service Edges** — lists all enrolled and deployed PSE instances. Instances that have been added (provisioning key generated) but not yet deployed (VM not enrolled) do not appear here. From this view you can rename, enable/disable, or delete a PSE record. PSE Groups that are Zscaler-managed are read-only in this view.
- **Private Service Edge Groups** — lists all PSE Groups. Supports both table and map views. From this view you manage group configuration: location, trusted networks, upgrade schedule, version profile, DR mode, and proximity override settings. Each group shows its member PSEs, provisioning keys, and the next scheduled software update time.

The Auto Delete feature (configurable under Private Service Edges page settings) automatically removes PSE records that have been disconnected or disabled for a configured number of days. This helps keep the Admin Console clean in environments where PSE VMs are frequently replaced.

## Software version profiles

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

**1. PSE vs Public SE selection criteria — grace distance is required for LAN preference.**
Without `grace_distance_enabled`, ZPA may route LAN users to a geographically close Zscaler PoP rather than to the on-prem PSE. This defeats the purpose of the PSE for latency and regulatory use cases. Always configure grace distance when deploying a PSE for on-premises users. Test from client devices on the Trusted Network to confirm PSE selection is occurring (check LSS logs for the Service Edge identity).

**2. `is_public = false` means remote users do not reach the PSE.**
A PSE Group with `is_public = false` is invisible to users outside the mapped Trusted Networks. This is often the correct posture for regulated-site PSEs. But if business continuity or remote-to-PSE use cases are required, `is_public = true` with a publicly reachable PSE IP is necessary. Mixing this with a PSE behind a firewall that only allows LAN traffic will silently fail for remote users.

**3. Certificate trust chain — Zscaler PKI, not the enterprise CA.**
ZCC and App Connectors authenticate the PSE using Zscaler's PKI — the same PKI used for Public SEs. There is no mechanism to use an enterprise internal CA for PSE authentication. Firewall SSL inspection between ZCC and the PSE will break the Z-Tunnel if the firewall is re-signing certificates with an enterprise CA — the pinned-certificate verification will fail. Traffic between ZCC and the PSE must not be subjected to MITM / SSL break-and-inspect.

**4. PSE VM cloning breaks enrollment.**
The enrollment certificate is pinned to the hardware fingerprint of the VM at enrollment time. Cloning the VM after enrollment creates a second VM with a different hardware fingerprint. The cloned VM cannot use the enrolled certificate and will fail to authenticate to the CA. If you need to scale out PSEs, enroll each new VM separately using the PSE Group's provisioning key.

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

- **PSE VM sizing specifics** — the Deployment Prerequisites document referenced in help sources was not available in the captured vendor corpus. vCPU, vRAM, and disk requirements per PSE VM and per-instance session limits are not confirmed. Validate against the current Deployment Prerequisites doc before provisioning.
- **Provisioning key Terraform resource** — there is no `zpa_service_edge_provisioning_key` resource in the captured Terraform provider docs. The App Connector equivalent (`zpa_provisioning_key`) exists. Confirm whether PSE provisioning keys can be created via the API/Terraform or are Admin Console-only.
- **Supported hypervisor list** — VMware (ESXi/vSphere) is confirmed. It is not confirmed whether OVA images are provided for Hyper-V, KVM, or cloud-native VM formats (AWS AMI, Azure image) for ZPA PSEs specifically. ZIA VSEs support those platforms, but ZPA PSEs may differ.
- **PSE hardware appliance** — the ZIA PSE product has dedicated hardware appliances (PSE 3, PSE 5 physical clusters). It is not confirmed whether ZPA PSEs are virtual-only or also available as dedicated hardware. The help sources describe only VM images.
- **Private Cloud Controller vs PSE Group relationship** — the `zpa_private_cloud_group` resource (`/privateCloudControllerGroup` API endpoint) appears to be a distinct grouping construct from `zpa_service_edge_group` (`/serviceEdgeGroup`). It references a `site_id` field and `privateBrokerGroupIds` in its SDK examples. The exact relationship — whether Private Cloud Groups represent a sovereign/private-cloud ZPA control plane variant or a distinct PSE grouping type — is not fully resolved from the captured sources. Treat `zpa_private_cloud_group` as potentially out-of-scope for standard PSE deployments until confirmed.
- **Location / GeoIP update behavior** — the help docs note that if the PSE Group location is updated for an existing active connection, the PSE uses the old location until the next new connection. The propagation delay for location changes across the CA topology is not quantified. Treat location changes as requiring a maintenance window.
- **OAuth2 enrollment path** — the `enrollment_cert_id` + `user_codes` pattern in `zpa_service_edge_group` suggests a newer enrollment flow distinct from the traditional provisioning-key-only path. Whether this requires a specific ZPA license tier or replaces the provisioning key flow (or supplements it) is not resolved from the available sources.
- **Maximum PSEs per group** — unlike App Connector Groups, no documented maximum PSE count per PSE Group was found in the captured sources. Confirm with Zscaler documentation or support for large-scale deployments.

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

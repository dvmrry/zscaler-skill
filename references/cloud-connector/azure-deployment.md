---
product: ztw
topic: "azure-deployment"
title: "Cloud Connector on Azure — deployment shape, NIC model, scaling, HA"
content-type: reasoning
last-verified: "2026-07-22"
confidence: high
source-tier: mixed
verified-against:
  vendor/terraform-azurerm-cloud-connector-modules: abdd217051e014544de376442521a4d20934ef5a
  vendor/zscaler-help: f25ce272f7a62b45afbbabb6cf475cd325700201
sources:
  - "github.com/zscaler/terraform-azurerm-cloud-connector-modules"
  - "vendor/zscaler-help/cbc-configuring-cloud-provisioning-template.md"
  - "vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md"
  - "vendor/zscaler-help/cbc-about-cloud-connector-groups.md"
  - "vendor/zscaler-help/what-zscaler-cloud-connector.md"
  - "https://help.zscaler.com/cloud-branch-connector/deploying-zscaler-cloud-connector-microsoft-azure (URL only — JS-gated)"
  - "https://azuremarketplace.microsoft.com/en/marketplace/apps/zscaler1579058425289.zia_cloud_connector (publisher + offer ID confirmed)"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvm-azure/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvm-azure/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvmss-azure/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvmss-azure/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-nsg-azure/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-nsg-azure/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-lb-azure/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-lb-azure/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-gwlb-azure/README.md"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-public-lb-azure/README.md"
  - "vendor/terraform-azurerm-cloud-connector-modules/CHANGELOG.md"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-function-app-azure/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-function-app-azure/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/README.md"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/README.md"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/ (directory inventory)"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvm-azure/versions.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvmss-azure/versions.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_vmss/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/cc_vmss/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/zsec"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_1cc/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_1cc_zpa/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_lb/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_lb_zpa/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_vmss/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_vmss_zpa/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/cc_lb/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/cc_vmss/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_gwlb/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_gwlb/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_gwlb_vmss/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_gwlb_vmss/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_public_lb/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_public_lb/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_public_vmss/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_public_vmss/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/cc_gwlb/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/cc_gwlb/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/cc_gwlb_vmss/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/cc_gwlb_vmss/main.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/cc_public_lb/variables.tf"
  - "vendor/terraform-azurerm-cloud-connector-modules/examples/cc_public_lb/main.tf"
author-status: draft
---

# Cloud Connector on Azure — deployment shape, NIC model, scaling, HA

The Azure-specific deployment of [Cloud Connector](./overview.md). For the cloud-agnostic architecture (CC Groups, forwarding rules, HA concept), start with [`./overview.md`](./overview.md). This doc captures the Azure-specific NIC model, networking requirements, VMSS scaling, and the gotchas that bite Azure deployments specifically.

> **Reference IaC vs production IaC.** Most claims below are derived from **Zscaler's published Terraform modules** at `github.com/zscaler/terraform-azurerm-cloud-connector-modules`. Those modules are **reference implementations** — one valid way to deploy, what Zscaler considers idiomatic. They are *not* product specification. The runtime requirements of the Cloud Connector VM image vs. the patterns Zscaler's TF chooses to enforce aren't separately documented; where the distinction matters, this doc tries to flag it. A different working IaC implementation (yours, or another vendor's) isn't wrong because it diverges from the reference. **Fork agents:** if `_data/iac/` is populated for this fork, treat it as production truth and use this doc for context, not as the deployment spec.

## Marketplace listing and image terms

| Field | Value |
|---|---|
| Publisher | `zscaler1579058425289` (`modules/terraform-zscc-ccvm-azure/variables.tf:79-83`) |
| Offer | `zia_cloud_connector` (`modules/terraform-zscc-ccvm-azure/variables.tf:85-89`) |
| Primary SKU | `zs_ser_gen1_cc_01` (`modules/terraform-zscc-ccvm-azure/variables.tf:91-95`) |
| Default image version | `latest` — pin a specific version in tfvars if reproducibility is required (`modules/terraform-zscc-ccvm-azure/variables.tf:97-101`; `modules/terraform-zscc-ccvmss-azure/variables.tf:102-106`) |
| Default VM size (single CC) | `Standard_D2ds_v5`; direct-module allow-list: `Standard_D2s_v3`, `Standard_DS2_v2`, `Standard_DS3_v2`, `Standard_D2ds_v5`, `Standard_D2ads_v5` (`modules/terraform-zscc-ccvm-azure/variables.tf:58-72`) |
| Default VM size (VMSS) | `Standard_D2ds_v5`; direct-module allow-list: `Standard_D2s_v3`, `Standard_DS3_v2`, `Standard_D2ds_v5`, `Standard_D2ads_v5` (`modules/terraform-zscc-ccvmss-azure/variables.tf:64-77`) |

**Image terms must be accepted before any IaC deployment can succeed** (`examples/README.md:19`):
```bash
az vm image terms accept --urn zscaler1579058425289:zia_cloud_connector:zs_ser_gen1_cc_01:latest
```
Skipping this produces an ARM-level error, not a Zscaler error — easy to misdiagnose.

The direct module allow-lists above are the Terraform validation contract. The `zsec` helper presents a different, region-aware menu: `Standard_DS2_v2` in `chinanorth`/`chinaeast`, three choices in the `*2` China regions, four choices in the `*3` China regions, and only `Standard_D2ds_v5`/`Standard_D2ads_v5` in other regions (`vendor/terraform-azurerm-cloud-connector-modules/examples/zsec:635-655`). The helper menu is a convenience/tooling boundary and must not be promoted into a universal VM-size or product limit; conversely, the direct module's allow-list does not prove that every listed size is available in every Azure region. The changelog's narrative about legacy China sizes is retained as release context, but the current module source above is authoritative for the current direct validation (`vendor/terraform-azurerm-cloud-connector-modules/CHANGELOG.md:23-25`).

There is a VMSS-specific mismatch in that source matrix: the same helper offers
`Standard_DS2_v2` in China, and the VMSS example wrappers accept it (for
example, `vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_vmss/variables.tf:92-104`), but the direct
`terraform-zscc-ccvmss-azure` child module rejects it because its allow-list
omits DS2 (`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvmss-azure/variables.tf:64-75`). The
wrappers pass the selected value to that child (`vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_vmss/main.tf:128-145`),
so selecting DS2 for a China VMSS can pass the root validation and then fail
the child-module validation. This is a Terraform-wrapper/helper contract
defect; it does not establish that Azure or the Cloud Connector service
backend rejects the SKU universally. The changelog's statement that DS2
remains in both VM/VMSS allow-lists is not true for the pinned VMSS source.

Both current direct Azure modules require `azurerm >= 4.9.0, < 5.0.0` (`modules/terraform-zscc-ccvm-azure/versions.tf:1-16`; `modules/terraform-zscc-ccvmss-azure/versions.tf:1-16`). The current changelog entry that says `>= 3.108.0, < 5.0.0` is stale relative to those files (`vendor/terraform-azurerm-cloud-connector-modules/CHANGELOG.md:1-5`); treat it as release-note text, not the active provider constraint.

The generated Azure package documentation has the same source/tooling drift:
the active direct-module `versions.tf` files require azurerm 4.9–<5, while the
direct module READMEs still render `>= 3.108.0, < 5.0.0`
(`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvm-azure/README.md:30,38`;
`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvmss-azure/README.md:30,38`). A representative
root README has the same mismatch: `examples/base_1cc/README.md:44` says
3.108, while `examples/base_1cc/versions.tf:5` requires 4.9. The newer GWLB
and Public-LB READMEs still render the old `3.108.0, <= 3.116` range
(`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-gwlb-azure/README.md:17,23`;
`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-public-lb-azure/README.md:18,24`). Follow the active `.tf` constraints until the generated READMEs are
regenerated; this is package documentation/provider behavior, not an Azure
Cloud Connector service-side requirement.

The direct VMSS README also still renders `vmss_max_ccs` with a default of 16
(`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvmss-azure/README.md:94-96`), while the pinned
source default is 4 with a 1–16 validator (`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvmss-azure/variables.tf:205-215`).
That discrepancy is another generated-document defect; use the source
declarations and the wrapper-specific caveat below when sizing a Terraform
deployment.

The pinned Zscaler Terraform repo contains **17 actual example directories**:
11 greenfield roots, 5 brownfield roots, and one standalone ZTags root. The
package root README documents the newer GWLB/Public-LB entries but does not
list the `base` greenfield root or `cc_public_lb` brownfield root in its
enumerations (`vendor/terraform-azurerm-cloud-connector-modules/README.md:75-175`);
the older `examples/README.md` lists nine Cloud Connector example roots and
omits the newer roots, while the package README separately documents the
standalone ZTags root (`vendor/terraform-azurerm-cloud-connector-modules/examples/README.md:59-104`;
`vendor/terraform-azurerm-cloud-connector-modules/README.md:155-175`).
The table below is the directory-level inventory from the pinned worktree, not
a claim that either generated README is complete. ARM templates exist as a
Marketplace-wizard path but are not separately published as a standalone repo.
**No Bicep templates** are published by Zscaler — defer to TF or ARM. These
counts and deployment names describe the vendored Terraform package, not a
claim about which Azure Cloud Connector topologies the service backend
universally supports.

### Reference deployment examples

Seventeen example directories ship under `examples/`; the package root README
and the physical directory list together inform the current matrix
(`vendor/terraform-azurerm-cloud-connector-modules/README.md:75-175`).

**Greenfield (11 examples):**

| Example directory | Description |
|---|---|
| `base` | Bastion + workload only (no CCs) |
| `base_1cc` | 1 CC in availability set, NAT GW, no LB |
| `base_1cc_zpa` | `base_1cc` + Azure Private DNS Resolver |
| `base_cc_lb` | 2+ CCs in availability set behind Standard ILB |
| `base_cc_lb_zpa` | `base_cc_lb` + Azure Private DNS Resolver |
| `base_cc_vmss` | VMSS with Function App, Standard ILB, autoscaling |
| `base_cc_vmss_zpa` | `base_cc_vmss` + Azure Private DNS Resolver |
| `base_cc_gwlb` | Cloud Connectors behind an Azure Gateway Load Balancer for inline inspection |
| `base_cc_gwlb_vmss` | Gateway Load Balancer with VMSS autoscaling for inline inspection |
| `base_cc_public_lb` | Cloud Connectors behind an Azure Standard Public Load Balancer for inbound traffic distribution |
| `base_cc_public_vmss` | Standard Public Load Balancer with VMSS for inbound traffic handling |

**Brownfield (5 examples):**

| Example directory | Description |
|---|---|
| `cc_lb` | Production-style: custom VNet/RG, multi-CC behind LB |
| `cc_vmss` | Production-style: custom VNet/RG, VMSS with autoscaling |
| `cc_gwlb` | Custom VNet/RG with Gateway Load Balancer for inline inspection |
| `cc_gwlb_vmss` | Custom VNet/RG with Gateway Load Balancer and VMSS autoscaling |
| `cc_public_lb` | Custom VNet/RG with Standard Public Load Balancer for inbound traffic |

**Standalone (1 example):**

| Example directory | Description |
|---|---|
| `ztags_standalone` | ZTags Event Grid integration — not a CC deployment; assumes CC resources already exist |

## Dual-NIC architecture (reference pattern)

Zscaler's reference TF deploys Azure Cloud Connector with **two NICs per VM** in a fixed order:

| NIC | Subnet | IP Forwarding | Notes |
|---|---|---|---|
| #0 (primary) — Management | `mgmt-subnet` | **Disabled** | SSH (TCP 22), ICMP, ZIA support tunnel (`modules/terraform-zscc-ccvm-azure/main.tf:5-19`) |
| #1 — Service / Forwarding | `service-subnet` | **Enabled** | Workload traffic, attaches to LB backend pool, accelerated networking on (`modules/terraform-zscc-ccvm-azure/main.tf:38-56`) |

The service NIC has `ip_forwarding_enabled = true` (`modules/terraform-zscc-ccvm-azure/main.tf:43`) and `accelerated_networking_enabled` defaulting to `true` (`modules/terraform-zscc-ccvm-azure/variables.tf:178-182`). The reference module enforces this ordering: *"the ordering of `network_interface_ids` associated to the `azurerm_linux_virtual_machine` are #1/first 'Management'."* (`modules/terraform-zscc-ccvm-azure/main.tf:97-100`) The TF module's documentation states the CC expects management traffic on the first interface — swapping subnet IDs produces VMs that fail at boot in the reference deployment shape.

Whether this is a hard runtime requirement of the CC VM image vs. an enforced convention of the reference TF isn't separately documented by Zscaler. Treat the dual-NIC pattern as load-bearing for any deployment derived from the reference module; a custom deployment that differs may or may not work and would need to be validated.

The reference module does not provide a single-NIC deployment path. The "single-arm" framing in some general Zscaler material refers to forwarding topology in other cloud products and does not apply to Azure CC's reference deployment shape.

## Provisioning URL handoff

The ZIA Admin Console generates a per-template provisioning URL that bootstraps each VM. The flow:

1. ZIA Admin Console → **Infrastructure > Connectors > Cloud > Management > Provisioning** → create a Cloud Provisioning Template; select Azure as cloud provider; optionally enable VMSS autoscaling (gated — see § VMSS).
2. Save → ZIA generates a `prov_url`. The Terraform `ztc_provisioning_url` resource creates this programmatically (`prov_url_data.cloud_provider_type = "AZURE"`).
3. The URL is injected into the Azure VM via `cloud_init` / `custom_data`. Modules deliver it as `CC_URL=<prov_url>` inside a `[ZSCALER]` INI block in `user_data`, alongside `AZURE_VAULT_URL`, `AZURE_MANAGED_IDENTITY_CLIENT_ID`, and `HTTP_PROBE_PORT`.

If the provisioning URL is regenerated in the ZIA console (key rotation, template recreation) and the Terraform state isn't refreshed, **VMSS scale-out events will produce CCs that fail to register**. (Tier D — structural inference; not an explicitly documented failure but follows from the bootstrap flow.)

## VNet design

### Hub-spoke topology (Tier B)

Zscaler's reference architecture places Cloud Connectors in a **transit/egress hub VNet**, with spoke workload VNets routing default traffic to the CC ILB via VNet peering + UDRs. Quoted from the reference architecture PDF: *"Spoke VNet workloads requiring internet or private access are directed towards the front-end load balancer IP address using a simple default route."* This reduces CC instance count vs per-spoke deployment.

The reference architecture PDF exists at `help.zscaler.com/downloads/cloud-branch-connector/reference-architecture/zero-trust-security-azure-workloads-zscaler-cloud-connector/` but is binary and not text-extractable. Tier B until captured.

### Routing — UDRs

Workload subnets need a route table with `0.0.0.0/0` pointing at the ILB frontend IP (or directly at the CC service NIC IP in single-CC non-LB deployments). The Terraform modules create `workload_rt` and `private_dns_rt` route tables automatically.

**BGP route propagation gotcha**: when CC coexists with an ExpressRoute or VPN Gateway in the same VNet, learned routes can override the static `0.0.0.0/0`. Disable propagation on the workload route table and rely on the UDR for explicit control. (Tier B — standard Azure routing pattern; not Zscaler-specific.)

### Private DNS Resolver (ZPA-enabled deployments only)

For deployments using Cloud Connector to broker ZPA private-app DNS, the `terraform-zscc-private-dns-azure` module deploys an **Azure Private DNS Resolver** (not Private DNS Zones) in a delegated `/28`–`/24` subnet, with up to 25 forwarding rules per ruleset linked to up to 10 VNets per region. Forwarding targets are Zscaler Global VIPs (`185.46.212.88` and `185.46.212.89` are the defaults) or the local CC service IP.

For pure ZIA workload egress, the Private DNS Resolver is not required.

## NSG requirements

Two NSGs are deployed — one per NIC:

**Management NSG** (`modules/terraform-zscc-nsg-azure/main.tf`)

| Direction | Priority | Source/Dest | Port | Notes |
|---|---|---|---|---|
| Inbound | 4000 | `VirtualNetwork` | TCP 22 | SSH from bastion (`main.tf:10-20`) |
| Inbound | 4001 | `VirtualNetwork` | ICMP | Health checks (`main.tf:22-32`) |
| Outbound | 3000 | Any → `199.168.148.101` | TCP 12002 | Zscaler Support tunnel; conditional on `support_access_enabled = true` (default) (`main.tf:34-49`; `variables.tf:54-57`; destination IP `variables.tf:59-63`) |
| Outbound | 4000 | Any → Any | All | Default allow-out (`main.tf:51-61`) |

**Service NSG** (`modules/terraform-zscc-nsg-azure/main.tf`)

| Direction | Priority | Source/Dest | Port |
|---|---|---|---|
| Inbound | 4000 | `VirtualNetwork` | All (`main.tf:83-93`) |
| Outbound | 4000 | Any → Any | All (`main.tf:95-105`) |

The Service NSG's permissive `VirtualNetwork` inbound implicitly covers Azure Load Balancer health probe traffic. **No explicit rules for Azure Fabric IPs** (`168.63.129.16`, `169.254.169.254`) — Cloud Connector relies on standard Azure platform reachability for IMDS and DHCP. This is different from ZCC, which actively tunnels and needs explicit Fabric IP bypass.

## Load Balancer (reference defaults)

The reference TF deploys an Azure Standard ILB with the following defaults:

| Setting | Reference value |
|---|---|
| SKU | `Standard` ILB (`modules/terraform-zscc-lb-azure/main.tf:14`) |
| Probe protocol/port | HTTP on TCP 50000 (`modules/terraform-zscc-lb-azure/variables.tf:34-45`; `main.tf:49-50`) |
| Probe path | `/?cchealth` (`modules/terraform-zscc-lb-azure/main.tf:51`) |
| Probe interval | 15 seconds (`modules/terraform-zscc-lb-azure/variables.tf:88-98`) |
| Failures to unhealthy | 2 consecutive (`modules/terraform-zscc-lb-azure/variables.tf:100-104`) |
| Successes to recovery | 1 (`modules/terraform-zscc-lb-azure/variables.tf:106-110`) |
| Distribution | `Default` (5-tuple hash) (`modules/terraform-zscc-lb-azure/variables.tf:47-59`) |
| LB rule protocol | `All`, frontend/backend ports 0 (`modules/terraform-zscc-lb-azure/main.tf:64`) |

The CC instances respond `200 OK` when healthy, `503` or no response when unhealthy. The probe path + port are runtime endpoints CC exposes; the rest are LB-side configuration choices the reference module makes (and that you can override in your own deployment if you have reason to).

## NAT Gateway (reference pattern)

The reference TF deploys a NAT Gateway with a dedicated Public IP per CC service subnet for egress to ZIA Public Service Edges. The NAT Gateway's public IP becomes the egress source IP that ZIA sees — register/allow it at the ZIA tenant where appropriate.

For multi-AZ deployments, **one NAT Gateway per availability zone** is Zscaler's recommendation in the reference architecture. Azure NAT Gateways are zone-specific; a shared NAT GW across AZs is a single point of AZ failure for egress. Whether you can deploy without a NAT Gateway at all (e.g., using direct public IPs on the VMs, or routing through Azure Firewall) isn't covered by the reference module — alternatives may be possible but aren't validated by Zscaler's published patterns.

## VMSS autoscaling

**Tenant-side enablement is gated** by Zscaler Support — the help docs explicitly require this for the provisioning template UI:
> "To enable Auto Scaling, VMSS, or a MIG with autoscaling, contact Zscaler Support."

The reference TF deploys VMSS with the following defaults (all tunable in your own deployment):

| Setting | Reference default |
|---|---|
| Orchestration mode | Flexible (`azurerm_orchestrated_virtual_machine_scale_set`) (`modules/terraform-zscc-ccvmss-azure/main.tf:5`) |
| Default instances | 2; direct-module validation range 1–16 (`modules/terraform-zscc-ccvmss-azure/variables.tf:179-189`) |
| Minimum | 2; direct-module validation range 1–16 (`modules/terraform-zscc-ccvmss-azure/variables.tf:192-202`) |
| Maximum | 4; direct-module validation range 1–16, with a hard limit of 16 (`modules/terraform-zscc-ccvmss-azure/variables.tf:205-215`) |
| Scale-out trigger | metric `smedge_metrics` (namespace `Zscaler/CloudConnectors`), dimension `metric_name=smedge_cpu_utilization` > 70%, 5-min eval (`PT5M`), 15-min cooldown (`PT15M`) (`modules/terraform-zscc-ccvmss-azure/variables.tf:218-240`; `main.tf:116-139`) |
| Scale-in trigger | same metric/dimension < 50%, 5-min eval (`PT5M`) (`modules/terraform-zscc-ccvmss-azure/variables.tf:242-264`; `main.tf:142-165`) |
| Scheduled scaling | Optional; distinct from Admin Console upgrade window scheduling (`modules/terraform-zscc-ccvmss-azure/variables.tf:266-312`) |

The direct VMSS module's three count inputs therefore validate 1–16, and its `vmss_max_ccs` default is 4. The greenfield and brownfield example wrappers instead default `vmss_max_ccs` to 16 without adding validation (`examples/base_cc_vmss/variables.tf:241-257`; `examples/cc_vmss/variables.tf:219-234`). The `zsec` helper accepts 1–20 for VMSS minimum, default, and maximum prompts (`examples/zsec:1023-1067`), so values 17–20 can pass the helper and then fail the direct module's 1–16 validation. These are IaC wrapper/tooling mismatches, not evidence of a 20-VM Cloud Connector runtime limit. Static `cc_count` is a separate non-autoscaling input (`examples/zsec:743-761`).

VMSS deployments include a **mandatory Azure Function App** with two functions:

1. **Health Monitoring Function** — runs every 60s, terminates instances reporting health 0 for 5 consecutive checks or flapping (7/10 unhealthy). Controlled by `terminate_unhealthy_instances` (default `true`) (`modules/terraform-zscc-function-app-azure/variables.tf:51-55`).
2. **Resource Sync Function** — runs every 30 minutes, reconciles ZIA Cloud Connector Group membership against the VMSS instance list. **If a CC exists in the Group but not in the VMSS, it cleans up the orphan from the Group.** This is the documented orphan-cleanup mechanism — not folklore.

> **Note on Function App scheduling thresholds.** The 60s health-check interval, the 5-failure termination threshold, and the 30-min sync cadence are defined inside the bundled `zscaler_cc_function_app.zip` (`modules/terraform-zscc-function-app-azure/main.tf:40-46`). The TF module only orchestrates deployment of that zip — those values are not readable in Terraform source. The module surface-exposes `terminate_unhealthy_instances` (`variables.tf:51-55`) and Function App app settings including `CC_URL`, `VAULT_URL`, and `TERMINATE_UNHEALTHY_INSTANCES` (`main.tf:105-117`); the internal scheduling is opaque at the TF layer.

**Function App ASP SKU options**: `Y1` (Flex Consumption, default), `FC1`, `EP1`, `B1` (`modules/terraform-zscc-function-app-azure/variables.tf:126-139`).

**Regional caveat**: Flex Consumption plan is not available in all Azure regions. When unavailable but VNet integration is required, upgrade to Elastic Premium (EP1). Skipping this produces a degraded VMSS deployment with no orphan cleanup or unhealthy-instance termination.

### Legacy VM NVA compatibility tag

The single-VM and VMSS modules expose `enable_legacy_vm_nva_tag` as a boolean that defaults to `true`; each variable description says to set it to `false` once MANA host support is available (`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvm-azure/variables.tf:19-23`; `vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvmss-azure/variables.tf:25-29`). With the default enabled, both modules merge `LegacyVMNVA = "true"` into the resource tags; disabling the variable merges an empty map instead, while retaining `global_tags` (`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvm-azure/main.tf:155`; `vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvmss-azure/main.tf:91`).

This source establishes only the emitted Azure resource tag and its MANA-related configuration guidance. It does not identify a consumer of `LegacyVMNVA` or establish any traffic or policy effect; treat the setting as deployment metadata unless another source documents its runtime use (`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvm-azure/variables.tf:19-23`; `vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvm-azure/main.tf:155`; `vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvmss-azure/variables.tf:25-29`; `vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvmss-azure/main.tf:91`).

## HA model in Azure

The reference TF + Zscaler's published HA guidance recommend:

| Layer | Reference recommendation | Notes |
|---|---|---|
| CC instances | 2 per AZ across at least 2 AZs (4 total) | Zscaler's stated minimum for production HA — not enforced by the runtime |
| Load balancer | Standard ILB, 15s probe | Reference module setting |
| Tunnel failover (CC → ZIA) | ~30 seconds on primary tunnel failure | Runtime behavior; primary/secondary/tertiary gateway selection is automatic by geolocation |
| Default behavior on full ZIA unreachability | Fail-close (drop) — switchable to fail-open | Runtime behavior, not IaC-derived |
| NAT Gateway | One per AZ | Reference recommendation per the Azure NAT Gateway zone-pinning model |
| Upgrade window | Configurable per CC Group (Admin Console) | Maintains redundancy during upgrade — Zscaler-managed |

### Azure GWLB ingress-inspection support

The vendored Azure Terraform modules now include first-class Gateway Load Balancer support for Cloud Connector. The module changelog describes Azure GWLB as enabling transparent inline inspection for ingress traffic that the older egress-only private-LB topology did not cover, and adds both greenfield and brownfield GWLB examples (`vendor/terraform-azurerm-cloud-connector-modules/CHANGELOG.md:7-21`). The new `terraform-zscc-gwlb-azure` module creates an Azure Gateway Load Balancer with dual VXLAN tunnel interfaces, an HTTP probe, and a backend pool for Cloud Connectors; it is intended to chain behind a consumer Public Load Balancer (`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-gwlb-azure/README.md:1-9`). The public-LB module exposes `gateway_load_balancer_frontend_ip_configuration_id`; setting it redirects inbound public-LB traffic through the GWLB and Cloud Connector VMs before reaching the original backend (`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-public-lb-azure/README.md:1-10`, `:45`).

### FIPS user-data coverage

The refreshed Azure examples add a `fips_enabled` input and emit `FIPS_ENABLED` in Cloud Connector user data; the changelog describes this as FIPS enablement via user data (`vendor/terraform-azurerm-cloud-connector-modules/CHANGELOG.md:1-5`; `vendor/terraform-azurerm-cloud-connector-modules/examples/base_1cc/main.tf:107-116`; `vendor/terraform-azurerm-cloud-connector-modules/examples/base_cc_vmss/main.tf:107-120`). The setting is present in `base_1cc`, `base_1cc_zpa`, `base_cc_lb`, `base_cc_lb_zpa`, `base_cc_vmss`, `base_cc_vmss_zpa`, `cc_lb`, and `cc_vmss`. It is absent from the newer `base_cc_gwlb`, `base_cc_gwlb_vmss`, `base_cc_public_lb`, `base_cc_public_vmss`, `cc_gwlb`, `cc_gwlb_vmss`, and `cc_public_lb` examples (and the `base`/`ztags_standalone` non-CC examples). The `zsec` helper itself prompts for FIPS and exports `TF_VAR_fips_enabled` (`vendor/terraform-azurerm-cloud-connector-modules/examples/zsec:675-692`).

> **Known-bad helper/example behavior — FIPS is ignored/no-op for seven Azure topologies.** The `zsec` FIPS prompt is inside the global non-`base` path (`vendor/terraform-azurerm-cloud-connector-modules/examples/zsec:574-656`) and always exports `TF_VAR_fips_enabled` (`vendor/terraform-azurerm-cloud-connector-modules/examples/zsec:675-692`). The selected roots `base_cc_gwlb`, `base_cc_gwlb_vmss`, `base_cc_public_lb`, `base_cc_public_vmss`, `cc_gwlb`, `cc_gwlb_vmss`, and `cc_public_lb` contain no `fips_enabled` declaration in their `variables.tf` or `FIPS_ENABLED` serialization in their `main.tf`. Because those root modules have no matching input, Terraform cannot consume that environment value or serialize it into their `user_data`; answering yes is therefore a no-op for these seven roots. This is a helper/example contract defect; it does not establish whether the Azure Cloud Connector service backend supports or rejects FIPS for those topologies.

FIPS is therefore example/topology coverage in the published reference IaC, not a universal Azure module guarantee. The direct VM and VMSS modules accept caller-provided `user_data` and do not expose a direct `fips_enabled` variable (`vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvm-azure/variables.tf:74-77`; `vendor/terraform-azurerm-cloud-connector-modules/modules/terraform-zscc-ccvmss-azure/variables.tf:79-82`). The helper/example matrix can be incomplete even when the Cloud Connector VM path is otherwise supported.

## Common failure modes

**Documented (Tier A):**
- **Marketplace image terms not accepted** — `az vm image terms accept` must run before any IaC deploy.
- **VMSS without Support enablement** — provisioning template will be misconfigured if you toggle VMSS without Zscaler Support enabling it on the tenant first.
- **Function App regional gap** — Flex Consumption plan unavailability requires Elastic Premium fallback; otherwise no orphan cleanup or health-driven termination.
- **Managed Identity permissions** — at minimum `Microsoft.Network/networkInterfaces/read` (or `Network Contributor`). Missing this causes VM bootstrap failure when the CC tries to discover its own NIC config at startup.

**Inferred (Tier D — verify against your deployment):**
- **Provisioning URL stale on VMSS** — if the URL is regenerated in ZIA Admin and Terraform state isn't refreshed, scale-out events produce CCs that fail to register.
- **NIC ordering wrong** — module enforces management-NIC-first; swapping produces boot failures.
- **`ip_forwarding_enabled` not set on service NIC** — VM is healthy from Azure's perspective but passes no traffic; LB health probe fails to 503 quickly.
- **NAT Gateway missing or misconfigured** — service NIC has no public egress path; CC can't reach ZIA Service Edges; LB probe shows 503.

## Source-citation gaps (future capture targets)

These pages exist but are JS-gated and weren't text-extractable at last verification:

- `help.zscaler.com/cloud-branch-connector/deploying-zscaler-cloud-connector-microsoft-azure` — main per-cloud deployment help page
- `help.zscaler.com/cloud-branch-connector/troubleshooting-cloud-connector-microsoft-azure` — troubleshooting page
- `help.zscaler.com/zscaler-technology-partners/zscaler-and-azure-traffic-forwarding-deployment-guide` — also covers ExpressRoute/VPN Gateway coexistence
- The reference architecture PDF (binary, not extractable via WebFetch)

ExpressRoute / VPN Gateway coexistence and Azure Route Server interaction remain Tier D until those captures land.

## Cross-links

- Cloud-agnostic architecture: [`./overview.md`](./overview.md)
- Forwarding rules + methods: [`./forwarding.md`](./forwarding.md)
- API + Terraform surface: [`./api.md`](./api.md)
- Portfolio context: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)

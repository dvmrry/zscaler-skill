---
product: ztw
topic: "gcp-deployment"
title: "Cloud Connector on GCP — deployment, MIG autoscaling, and workload discovery"
content-type: reference
last-verified: "2026-08-04"
confidence: high
source-tier: mixed
verified-against:
  vendor/terraform-gcp-cloud-connector-modules: e54dbcac71c0779a49999cd11c279ee78ba31c97
  vendor/zscaler-help: f25ce272f7a62b45afbbabb6cf475cd325700201
sources:
  - "vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md"
  - "vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md"
  - "vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md"
  - "vendor/zscaler-help/cbc-deployment-templates-zscaler-cloud-connector.md"
  - "vendor/zscaler-help/cbc-configuring-workload-discovery-workloads-google-cloud-platform.md"
  - "vendor/zscaler-help/cbc-release-upgrade-summary-2026.md"
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/README.md"
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-iam-service-account-gcp/README.md"
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-iam-service-account-gcp/main.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-iam-service-account-gcp/variables.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-ccvm-gcp/README.md"
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-ccvm-gcp/main.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-ccvm-gcp/variables.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/base_1cc/variables.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/base_1cc_zpa/variables.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/base_cc_asg/variables.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/base_cc_asg_zpa/variables.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/base_cc_ilb/variables.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/base_cc_ilb_zpa/variables.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/cc_asg/variables.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/cc_ilb/variables.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/base_1cc/main.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/base_1cc_zpa/main.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/base_cc_asg/main.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/base_cc_asg_zpa/main.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/base_cc_ilb/main.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/base_cc_ilb_zpa/main.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/cc_asg/main.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/cc_ilb/main.tf"
  - "vendor/terraform-gcp-cloud-connector-modules/examples/zsec"
  - "vendor/zscaler-upstream-notes/terraform-gcp-cloud-connector-pr-33.md"
author-status: draft
---

# Cloud Connector on GCP — deployment, MIG autoscaling, and workload discovery

This document covers the customer-deployed Cloud Connector VM path on GCP. It is distinct from the Zscaler-managed GCP Zero Trust Gateway described in [`./gcp-zero-trust-gateway.md`](./gcp-zero-trust-gateway.md) (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:8-17`).

## Deployment contract

The documented deployment method is Terraform. Zscaler requires an autoscaling template for an autoscaling deployment and a non-autoscaling template for a non-autoscaling deployment (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:8-10`). The March 2026 release directs new deployments to the GCP Terraform package and says it defaults to the new Google Cloud Marketplace image (`vendor/zscaler-help/cbc-release-upgrade-summary-2026.md:38-42`).

The current CCVM module README lists `zs-cc-ga-2-08132026` in project `mpi-zscalercloudconnector-publ` with release date `8/28/2026`; its `*` marker identifies it as the minimum image required for Auto Scaling. The image ID's embedded `08132026` and the separately stated release date are preserved as published, not normalized into one date (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-ccvm-gcp/README.md:5-13`). The same table marks older `**` images as deprecated as of April 15, 2026.

### Service-account boundaries

The deployment separates three identities:

1. A deployment service account runs Terraform.
2. A VM service account is assigned to each Cloud Connector VM.
3. Autoscaling deployments use a separate service account for the Cloud Run functions (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:12-18`).

The VM identity reads credentials from GCP Secret Manager or HashiCorp Vault and, for autoscaling, writes monitoring metrics. The function identity receives the compute, monitoring, logging, invocation, and secret-access roles needed for Health Monitor and Resource Sync (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:20-29`).

#### Pinned-module least-privilege caveat: Pub/Sub Editor defaults on

At the current pinned GCP module commit, `grant_pubsub_editor` defaults to
`true` and is documented as a project-scope `roles/pubsub.editor` grant
(`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-iam-service-account-gcp/variables.tf:52-55`;
`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-iam-service-account-gcp/README.md:47-54`).
When enabled, the module creates that project IAM binding for either the
module-created CCVM service account or a caller-supplied service account; using
a bring-your-own account does not by itself avoid the grant
(`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-iam-service-account-gcp/main.tf:66-90`).
Set `grant_pubsub_editor = false` unless the deployment's Pub/Sub workflow
explicitly requires Editor, and review the project-scope binding before apply
when it is required. The pinned gitlink is the operational contract; do not
assume an untagged upstream head changes this default.

The `zsec` helper deliberately defaults its Workload Discovery prompt to
`no` and exports `TF_VAR_grant_pubsub_editor=false`; choosing `yes` exports
`true` (`vendor/terraform-gcp-cloud-connector-modules/examples/zsec:931-948`).
Thus the direct module's default is the broader project-scope Editor grant,
while the helper's default is least privilege. This is an IaC/helper default
difference, not evidence that the Cloud Connector product universally
requires or forbids `roles/pubsub.editor`.

The published example wrappers do not all inherit the helper's least-privilege
default. Their current root-module defaults are:

| Example wrapper | `grant_pubsub_editor` default |
|---|---|
| `base_1cc` | `true` (`examples/base_1cc/variables.tf:297-300`) |
| `base_1cc_zpa` | `true` (`examples/base_1cc_zpa/variables.tf:301-304`) |
| `base_cc_asg` | `true` (`examples/base_cc_asg/variables.tf:359-362`) |
| `base_cc_asg_zpa` | `true` (`examples/base_cc_asg_zpa/variables.tf:359-362`) |
| `base_cc_ilb` | `true` (`examples/base_cc_ilb/variables.tf:365-368`) |
| `base_cc_ilb_zpa` | `true` (`examples/base_cc_ilb_zpa/variables.tf:371-374`) |
| `cc_asg` | `false` (`examples/cc_asg/variables.tf:418-421`) |
| `cc_ilb` | `true` (`examples/cc_ilb/variables.tf:424-427`) |

These are Terraform wrapper defaults and project-IAM behavior in the pinned
reference package, not a statement that the GCP Cloud Connector service
requires Pub/Sub Editor. Review or override the value before applying an
example, especially when least privilege is the goal.

### Network and routing shape

A deployment can place the security stack in a dedicated project or the workload project. Because GCP requires distinct VPC networks for interfaces on a multi-interface VM, the documented design uses separate management and service/security VPCs; workload custom routes direct traffic to the load balancer in front of the connectors (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:16-20`).

After deployment, the documented workload route is a static IPv4 `0.0.0.0/0` route whose next hop is an internal TCP/UDP load-balancer forwarding rule. The route is scoped with the workload network tag and workload VPC (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:31-44`). Once traffic reaches the deployment, the portal can apply Traffic Forwarding, Log and Control Forwarding, and DNS Control policies (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:46-47`).

Published GCP templates cover Basic, Internal Load Balancer, and MIG Autoscaling with Internal Load Balancer families, each with starter, Private Access, or custom variants where documented (`vendor/zscaler-help/cbc-deployment-templates-zscaler-cloud-connector.md:8-23`). Template descriptions include separate management and service networks, Cloud NAT, subnets, connector instance templates, health checks, forwarding rules, and the Cloud Function/Scheduler resources used by MIG autoscaling (`vendor/zscaler-help/cbc-deployment-templates-zscaler-cloud-connector.md:25-46`).

## MIG autoscaling and health

A GCP Managed Instance Group adds and removes Cloud Connector VMs as load changes, replaces unhealthy members, and replaces a member that an administrator terminates. Stopping or rebooting a member in the Google Cloud console can itself cause termination (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:8-14`). Zonal MIGs provide inter-zone availability, and a Cloud NAT gateway is deployed in each region for outbound access and dedicated external IPs (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:22-25`).

### Scaling policy

Each connector publishes `smedge_cpu_utilization` at one-minute intervals, and the autoscaler evaluates its aggregate for the MIG. Help documents an 80% default target over two to three minutes and a 900-second initialization period (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:34-48`).

The direct `terraform-zscc-ccvm-gcp` module now defaults `min_replicas` to **2** and `max_replicas` to **4**, and validates both direct inputs from **1–16**; the maximum validator calls 16 a hard Cloud Connector group limit (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-ccvm-gcp/variables.tf:165-189`). The generated module README still renders a `min_replicas` default of **1** (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-ccvm-gcp/README.md:50-65`), so use the source variable declarations for the current direct Terraform defaults.

The Help capture separately states a minimum of **1** VM and a maximum of **10** VMs, and says the maximum cannot exceed the Cloud Connector group limit of **16 VMs per group** (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:40-52`). This is a public product statement, but the capture does not prove how a live tenant or API enforces the 16-VM group limit (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:50-52`). Keep the Help limits and direct Terraform validation as separate source-layer statements.

The autoscaling example wrappers still validate `max_replicas` only from 1–10 (`examples/base_cc_asg/variables.tf:377-385`; `examples/base_cc_asg_zpa/variables.tf:376-384`; `examples/cc_asg/variables.tf:436-444`), and `zsec` accepts only 1–10 for its ASG minimum and maximum prompts (`examples/zsec:557-591`). Those narrower example/helper checks are tooling behavior, not an independent Cloud Connector runtime limit. The helper's static `cc_count` check is also separate: it accepts 1–10 while its rejection text says 1–20 (`examples/zsec:539-554`), an evident helper-message mismatch rather than a product-limit definition.

The default values also differ by layer: the direct module defaults to
`min_replicas = 2` and `max_replicas = 4`; the ASG example wrappers default to
`min_replicas = 1` and `max_replicas = 4`; and `zsec` starts its prompts at
minimum 2 and maximum 4 (`examples/base_cc_asg/variables.tf:377-391`;
`examples/base_cc_asg_zpa/variables.tf:376-390`;
`examples/cc_asg/variables.tf:436-450`; `examples/zsec:557-591`). Treat these
as Terraform-root/helper defaults and validation behavior, not as proof of a
backend Cloud Connector limit. The generated direct-module README's
`min_replicas = 1` row remains stale relative to the source declaration above.

### Health Monitor

Each VM publishes `cloud_connector_aggr_health` once per minute, using 0 for unhealthy and 100 for healthy. Defaults are a 10-minute evaluation window, five consecutive unhealthy minutes, and a seven-sample flapping tolerance (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:54-59`). Missing metrics produce warning, critical, and deletion actions at two, five, and 10 minutes respectively; a deleted VM is replaced immediately (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:61-63`).

The Terraform module implements a one-minute Health Monitor scheduler and invokes the Cloud Function with an OIDC token (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf:305-329`).

## Resource Sync: Help and module cadence differ

Both sources describe the same responsibility: reconcile MIG membership with the Cloud Connector Admin Console and remove a console VM record that belongs to no instance group (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:26-32`; `vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/README.md:22-26`). They disagree on the default cadence:

| Source | Stated or configured cadence |
|---|---|
| Current Help capture | Every 10 minutes by default (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:28-30`). |
| Pinned Terraform module | Every 30 minutes, cron `*/30 * * * *` in UTC (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf:331-353`). |

For a deployment created from the pinned module, the Terraform scheduler is the concrete configured value: 30 minutes. Do not rewrite the Help statement as 30 minutes globally or treat its 10-minute statement as proof that the module runs every 10 minutes.

The 30-minute module value came from a change intended to reduce the probability of a TOCTOU delete race. Upstream explicitly describes it as a statistical mitigation; the underlying fix requires a minimum-age gate in the private `resource_sync_entry` implementation (`vendor/zscaler-upstream-notes/terraform-gcp-cloud-connector-pr-33.md:10-19`). The Terraform file identifies `resource_sync_entry` and deploys it from a storage object, but does not contain the function body (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf:249-262`).

## FIPS and Cloud Function artifact integrity

The current GCP CC-bearing examples expose `fips_enabled` and attempt to
include it in the JSON user-data passed to the Cloud Connector VM: `base_1cc`,
`base_1cc_zpa`, `base_cc_asg`, `base_cc_asg_zpa`, `base_cc_ilb`,
`base_cc_ilb_zpa`, `cc_asg`, and `cc_ilb`. Representative single-CC and
autoscaling paths show the same field (`vendor/terraform-gcp-cloud-connector-modules/examples/base_1cc/main.tf:110-134`; `vendor/terraform-gcp-cloud-connector-modules/examples/base_cc_asg/main.tf:112-138`). The `zsec` helper also prompts for FIPS and exports `TF_VAR_fips_enabled` (`vendor/terraform-gcp-cloud-connector-modules/examples/zsec:497-514`). The direct CCVM module instead accepts generic `user_data` and has no direct `fips_enabled` input (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-ccvm-gcp/variables.tf:13-16`; `vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-ccvm-gcp/main.tf:33-38`), so this is reference-example/helper coverage rather than a universal module or runtime guarantee.

> **Known-bad pinned example behavior — default non-HCP ILB user-data is not valid JSON.** With the default `hcp_vault_enabled = false`, `base_cc_ilb` emits standard `local.userdata` at `vendor/terraform-gcp-cloud-connector-modules/examples/base_cc_ilb/main.tf:131-142`: the `gcp_service_account` member at line 139 has no comma before the new `fips_enabled` member at line 140, and line 140 has a trailing comma before the closing brace. `cc_ilb` has the same defect at `vendor/terraform-gcp-cloud-connector-modules/examples/cc_ilb/main.tf:101-112` (lines 109-110). A JSON-consuming bootstrap or other downstream consumer will reject these strings; the actual Cloud Connector VM outcome is not established by this source-only check. This is a vendored Terraform example defect, not evidence of a GCP Cloud Connector service-side FIPS or JSON behavior. `terraform validate` does not parse heredoc JSON, so validate the rendered standard and HCP payloads separately before using either default ILB example.

When `zsec` is intended to download a missing Cloud Function ZIP for an
autoscaling deployment, the helper downloads the selected URL, attempts its
`.sha256` companion, compares the published digest with a local SHA-256, and
removes the ZIP and exits on mismatch. A missing checksum file only emits a
warning that integrity cannot be verified and continues
(`vendor/terraform-gcp-cloud-connector-modules/examples/zsec:651-700`).
The Terraform child module's `upload_cloud_function_zip = false` branch is
supposed to look up the existing bucket object named by
`cloud_function_source_object_name` (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf:24-37`).
However, the outer condition at
`vendor/terraform-gcp-cloud-connector-modules/examples/zsec:651` quotes the entire
`$upload_function_zip == true` expression. Because that quoted expression is
non-empty, an ASG `up` run can enter this flow even after the existing-object
path set `upload_function_zip=false` at
`vendor/terraform-gcp-cloud-connector-modules/examples/zsec:620-627`; it can then
select a local ZIP or download a remote ZIP and replace the requested object
name/path with that file's name/path. Because the upload flag remains false,
the child module can then look up the wrong or nonexistent bucket object
instead of the object the operator selected; a downloaded ZIP is not uploaded
by that false branch. The manually selected existing-ZIP/checksum distinction
is therefore an intended helper path, not a guarantee of the current script.
These are helper supply-chain checks and source-selection defects, not Cloud
Connector runtime behavior; the quoted condition predates this refresh.

## GCP workload discovery

Workload discovery is a Zscaler-managed service that discovers GCP workloads and metadata for use in policy. Captured attributes include labels, tags, network and subnetwork, service-account email, machine type, zone, and disk source image (`vendor/zscaler-help/cbc-configuring-workload-discovery-workloads-google-cloud-platform.md:8-22`).

The service uses Cloud Asset Inventory `searchAllResources`, service-account impersonation, and short-lived credentials. Required customer-side access includes Compute Viewer, Cloud Asset Viewer, Browser, and Service Account Token Creator, with the listed GCP APIs enabled (`vendor/zscaler-help/cbc-configuring-workload-discovery-workloads-google-cloud-platform.md:24-42`).

Default polling is every five minutes. An optional Pub/Sub/logging-sink path reacts to `compute.instances.start` for near-immediate discovery polling (`vendor/zscaler-help/cbc-configuring-workload-discovery-workloads-google-cloud-platform.md:44-50`). The Admin Console supplies Terraform packages for core infrastructure and centralized cross-project grants (`vendor/zscaler-help/cbc-configuring-workload-discovery-workloads-google-cloud-platform.md:52-60`).

## Open questions

- **Standard Cloud Connector deployment regions** — the current sources prove Terraform deployment and a Google Cloud Marketplace image, but do not enumerate a standard-CC region list. Do not substitute the 16-region GCP Zero Trust Gateway table or the tenant's workload-discovery region set.
- **Resource Sync default** — Help says 10 minutes while the pinned module configures 30 minutes. Confirm whether Help describes a managed/default template other than the pinned public module. Tracked as [clarification `cloud-connector-28`](../_meta/clarifications.md#cloud-connector-28-gcp-resource-sync-default-cadence-help-vs-terraform-module).
- **Live 16-VM enforcement** — Help calls 16 the Cloud Connector group limit, but live API/tenant enforcement was not tested (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:44-52`).
- **Private Resource Sync implementation** — the minimum-age race fix is outside the public Terraform source (`vendor/zscaler-upstream-notes/terraform-gcp-cloud-connector-pr-33.md:15-19`).

## Cross-links

- Managed GCP Zero Trust Gateway: [`./gcp-zero-trust-gateway.md`](./gcp-zero-trust-gateway.md)
- Supported-region boundaries: [`./regions.md`](./regions.md)
- Cloud-agnostic architecture: [`./overview.md`](./overview.md)
- API and partner integrations: [`./api.md`](./api.md)

---
product: ztw
topic: "gcp-deployment"
title: "Cloud Connector on GCP — deployment, MIG autoscaling, and workload discovery"
content-type: reference
last-verified: "2026-08-04"
confidence: high
source-tier: mixed
verified-against:
  vendor/terraform-gcp-cloud-connector-modules: 0e8a8b82c45c7317d00f052a0b036396a1a184d8
sources:
  - "vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md"
  - "vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md"
  - "vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md"
  - "vendor/zscaler-help/cbc-deployment-templates-zscaler-cloud-connector.md"
  - "vendor/zscaler-help/cbc-configuring-workload-discovery-workloads-google-cloud-platform.md"
  - "vendor/zscaler-help/cbc-release-upgrade-summary-2026.md"
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/README.md"
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf"
  - "vendor/zscaler-upstream-notes/terraform-gcp-cloud-connector-pr-33.md"
author-status: draft
---

# Cloud Connector on GCP — deployment, MIG autoscaling, and workload discovery

This document covers the customer-deployed Cloud Connector VM path on GCP. It is distinct from the Zscaler-managed GCP Zero Trust Gateway described in [`./gcp-zero-trust-gateway.md`](./gcp-zero-trust-gateway.md) (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:8-17`).

## Deployment contract

The documented deployment method is Terraform. Zscaler requires an autoscaling template for an autoscaling deployment and a non-autoscaling template for a non-autoscaling deployment (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:8-10`). The March 2026 release directs new deployments to the GCP Terraform package and says it defaults to the new Google Cloud Marketplace image (`vendor/zscaler-help/cbc-release-upgrade-summary-2026.md:38-42`).

### Service-account boundaries

The deployment separates three identities:

1. A deployment service account runs Terraform.
2. A VM service account is assigned to each Cloud Connector VM.
3. Autoscaling deployments use a separate service account for the Cloud Run functions (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:12-18`).

The VM identity reads credentials from GCP Secret Manager or HashiCorp Vault and, for autoscaling, writes monitoring metrics. The function identity receives the compute, monitoring, logging, invocation, and secret-access roles needed for Health Monitor and Resource Sync (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:20-29`).

### Network and routing shape

A deployment can place the security stack in a dedicated project or the workload project. Because GCP requires distinct VPC networks for interfaces on a multi-interface VM, the documented design uses separate management and service/security VPCs; workload custom routes direct traffic to the load balancer in front of the connectors (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:16-20`).

After deployment, the documented workload route is a static IPv4 `0.0.0.0/0` route whose next hop is an internal TCP/UDP load-balancer forwarding rule. The route is scoped with the workload network tag and workload VPC (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:31-44`). Once traffic reaches the deployment, the portal can apply Traffic Forwarding, Log and Control Forwarding, and DNS Control policies (`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.md:46-47`).

Published GCP templates cover Basic, Internal Load Balancer, and MIG Autoscaling with Internal Load Balancer families, each with starter, Private Access, or custom variants where documented (`vendor/zscaler-help/cbc-deployment-templates-zscaler-cloud-connector.md:8-23`). Template descriptions include separate management and service networks, Cloud NAT, subnets, connector instance templates, health checks, forwarding rules, and the Cloud Function/Scheduler resources used by MIG autoscaling (`vendor/zscaler-help/cbc-deployment-templates-zscaler-cloud-connector.md:25-46`).

## MIG autoscaling and health

A GCP Managed Instance Group adds and removes Cloud Connector VMs as load changes, replaces unhealthy members, and replaces a member that an administrator terminates. Stopping or rebooting a member in the Google Cloud console can itself cause termination (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:8-14`). Zonal MIGs provide inter-zone availability, and a Cloud NAT gateway is deployed in each region for outbound access and dedicated external IPs (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:22-25`).

### Scaling policy

Each connector publishes `smedge_cpu_utilization` at one-minute intervals, and the autoscaler evaluates its aggregate for the MIG. Help documents an 80% default target over two to three minutes and a 900-second initialization period (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:34-48`).

The Help defaults are a minimum of **1** VM and a maximum of **10** VMs. The same scaling-policy section states that the maximum cannot exceed the Cloud Connector group limit of **16 VMs per group** (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:40-52`). This is a public product statement, but the capture does not prove how a live tenant or API enforces the 16-VM group limit (`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.md:50-52`).

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

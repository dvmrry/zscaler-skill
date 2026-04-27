---
product: cloud-connector
topic: "cloud-connector-index"
title: "Cloud & Branch Connector reference hub"
content-type: reference
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: draft
---

# Zscaler Cloud & Branch Connector reference hub

Entry point for the Cloud Connector / Branch Connector / Zero Trust Gateway product family — Zscaler's VM-based traffic forwarder for **cloud workloads** (AWS/Azure/GCP) and **branch offices**. Extends ZIA and ZPA to workloads that aren't end-user devices (no ZCC installed).

## Naming — one product, several names

| Name | Context |
|---|---|
| **Cloud Connector** | Marketing for the cloud-workload VM |
| **Branch Connector** | Marketing for the branch-office sibling appliance |
| **Zero Trust Gateway (ZTG)** | Newer marketing term used in the admin console group-type enum |
| **Zero Trust Workload (ZTW)** | Go SDK module path: `vendor/zscaler-sdk-go/zscaler/ztw/` |
| **Zero Trust Cloud (ZTC)** | Terraform provider path: `vendor/terraform-provider-ztc/ztc/` |
| **Cloud & Branch Connector (CBC)** | Help-site URL path: `help.zscaler.com/cloud-branch-connector/...` |

All refer to the same product suite. Operators will use whichever term comes up in their context — console, help docs, SDK, or marketing material. Translate as needed.

**Python SDK has no module for this product.** Go SDK and the Zscaler Terraform provider are the two programmatic surfaces; the Python SDK at `vendor/zscaler-sdk-python/zscaler/` does not include ZTW coverage. Fork teams building Python automations for Cloud Connector must call HTTP directly or use a language-ported client.

## What this product is for

Cloud Connector extends ZIA and ZPA to **workloads** (servers, cloud-native applications) that can't run ZCC. From *What Is Zscaler Cloud Connector?*:

> Internet & SaaS is used when a private workload is communicating to a public workload through the ZTE. Private Access is used when two private workloads are communicating with each other through the ZTE.

Two primary use cases:

- **Workload-to-Internet** — server in AWS/Azure/GCP needs to call a third-party API, fetch software updates, or reach a SaaS service. Cloud Connector forwards to ZIA for inspection.
- **Workload-to-Workload** — server in AWS needs to reach a server in an on-prem data center (or in a different cloud). Cloud Connector forwards to ZPA for inter-workload zero-trust access.

Branch Connector is the same idea for physical branch locations — an on-prem virtual-device that forwards branch traffic without deploying ZCC on every endpoint.

## Topics

| Topic | File | Status |
|---|---|---|
| Overview — VM architecture, Cloud Connector Groups, autoscaling (ASG/VMSS/MIG), HA model, data vs control plane | [`./overview.md`](./overview.md) | draft |
| Traffic forwarding — the five forwarding methods (ZIA / ZPA / direct / drop / local), rule criteria, rule evaluation, DNS forwarding gateways | [`./forwarding.md`](./forwarding.md) | draft |
| API and Terraform surface — `client.ztw.*` in Go SDK, `ztc_*` resources in TF, provisioning templates, activation | [`./api.md`](./api.md) | draft |
| **Azure deployment** — Marketplace listing, dual-NIC architecture, Standard ILB + 15s probe, NAT Gateway per AZ, VMSS scaling + Function App orphan cleanup, HA model | [`./azure-deployment.md`](./azure-deployment.md) | draft |
| **AWS deployment** — Marketplace listing, dual-ENI model, GWLB vs ENI endpoint patterns, ASG with custom CloudWatch CPU metrics, CloudFormation deployment flow, route-table modification post-deploy step, HA model | [`./aws-deployment.md`](./aws-deployment.md) | draft |
| **AWS workload discovery** — Account trust setup (External ID + Trusted Account ID + IAM role assumption), permission states, EventBridge metadata pipeline, AWS Account Groups, sublocation scopes, `zs:namespace` VPC tag for overlapping CIDRs | [`./aws-workload-discovery.md`](./aws-workload-discovery.md) | draft |
| **DNS subsystems** — three distinct components: DNS Gateways (resolver pairs), DNS Policies (DoH, tunnel detection, response rewriting), Log & Control Forwarding (telemetry routing); subsystem interactions and failure modes | [`./dns-subsystem.md`](./dns-subsystem.md) | draft |
| **Upgrades + credential rotation** — Sunday midnight local upgrade cadence (2-hour stagger, OS-image vs package distinction), zsroot rotation procedure (CC vs BC), combined sequencing for in-place vs re-deploy windows | [`./upgrade-and-credential-rotation.md`](./upgrade-and-credential-rotation.md) | draft |
| **Supported regions** — AWS (16 ZTG regions enumerated), Azure (all commercial regions; China via Terraform), GCP (supported at product level; region list unconfirmed); cross-region topology tradeoffs; open questions register | [`./regions.md`](./regions.md) | draft |
| **Insights & monitoring** — health metrics, traffic visibility, operational dashboards; what signals are available; latency and throughput reporting | [`./insights-monitoring.md`](./insights-monitoring.md) | draft |
| **NSS Virtual Appliance** — NSS VA deployment alongside Cloud Connector; log forwarding configuration; NSS VA vs Cloud NSS for workload log egress | [`./nss-va.md`](./nss-va.md) | draft |
| **Source IP Groups** — network-primitive building blocks for traffic-forwarding rule match criteria; group types and usage | [`./source-ip-groups.md`](./source-ip-groups.md) | draft |
| **SDK** — Go SDK (`client.ztw.*`) and Terraform (`ztc_*`) surface; Python SDK absence; method-to-resource mapping | [`./sdk.md`](./sdk.md) | draft |
| **Terraform** — `ztc_*` resource catalog; provider configuration; activation behavior | [`./terraform.md`](./terraform.md) | draft |

## Scope

In scope:

- Cloud Connector VM deployment model + Cloud Connector Groups
- HA and failover (fail-close vs fail-open, primary/secondary/tertiary gateway)
- Traffic forwarding rules + the 5 forwarding methods
- DNS forwarding gateways
- Network services + Network service groups
- Cloud provisioning templates + autoscaling options
- Location templates
- Go SDK and Terraform provider surface

Not in scope (explicitly deferred):

- **Branch Connector zero-trust appliance specifics** — referenced in the shared help section but not deeply covered here. The configuration model is similar to Cloud Connector; Branch-specific details (hardware, zero-touch provisioning) are operational and vendor-specific.
- **Per-cloud deployment guides** — Azure is now covered at [`./azure-deployment.md`](./azure-deployment.md). AWS CloudFormation and GCP templates remain deferred; reference architecture PDFs exist under `help.zscaler.com/downloads/cloud-branch-connector/reference-architecture/`.
- **VMSS / ASG / MIG operational tuning** — help articles cover this; captured at architecture level only.
- **Zscaler Zero Trust SD-WAN** — now covered at [`./zero-trust-sdwan.md`](./zero-trust-sdwan.md). Covers positioning vs traditional SD-WAN, Cloud/Branch Connector roles, capabilities and limits, vendor comparison by axis, and operational gotchas.

## When the question spans Cloud Connector + another product

- **"Why can't my AWS server reach Slack?"** — Cloud Connector forwards to ZIA; the issue could be in Cloud Connector's traffic-forwarding rules (matching direct instead of ZIA?) or in ZIA URL Filtering / SSL Inspection after the forward. Start at [`./forwarding.md`](./forwarding.md).
- **"Workload-to-workload access to our on-prem app is failing"** — Cloud Connector → ZPA → App Connector chain. Check Cloud Connector's ZPA enrollment first, then ZPA Application Segment + Access Policy. See [`./overview.md § Private Apps (Private Access)`](./overview.md) and cross to [`../zpa/app-segments.md`](../zpa/app-segments.md).
- **"Traffic from one cloud to another is going direct instead of through Zscaler"** — check the forwarding rule evaluation. Default rule is `ZIA` forwarding, but a more-specific rule with `direct` or `drop` action may be matching first. [`./forwarding.md § Rule evaluation`](./forwarding.md).
- **"Cloud Connector fails to come up after deployment"** — most commonly a provisioning URL / location template mismatch or a cloud-provider IAM permission. [`./api.md § Provisioning`](./api.md).

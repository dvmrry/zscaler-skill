---
product: cloud-connector
topic: "gcp-zero-trust-gateway"
title: "GCP Zero Trust Gateway — managed service boundary and operating model"
content-type: reference
last-verified: "2026-08-04"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/cbc-about-amazon-web-services-zero-trust-gateways.md"
  - "https://help.zscaler.com/cloud-branch-connector/about-google-cloud-platform-zero-trust-gateways"
  - "vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md"
  - "https://help.zscaler.com/cloud-branch-connector/adding-google-cloud-platform-zero-trust-gateway"
  - "vendor/zscaler-help/cbc-adding-google-cloud-platform-zero-trust-gateway.md"
  - "https://help.zscaler.com/cloud-branch-connector/analyzing-google-cloud-platform-zero-trust-gateway-details"
  - "vendor/zscaler-help/cbc-analyzing-google-cloud-platform-zero-trust-gateway-details.md"
  - "https://help.zscaler.com/cloud-branch-connector/supported-regions-zero-trust-gateways"
  - "vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md"
author-status: draft
---

# GCP Zero Trust Gateway — managed service boundary and operating model

Source: `vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md`; `vendor/zscaler-help/cbc-adding-google-cloud-platform-zero-trust-gateway.md`; `vendor/zscaler-help/cbc-analyzing-google-cloud-platform-zero-trust-gateway-details.md`; `vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md`.

## Summary

GCP Zero Trust Gateway is a Zscaler cloud-native service in Google Cloud, not a customer-deployed Cloud Connector VM. Zscaler operates the security infrastructure while the service secures internet-bound and private-destination workload traffic (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:8-17`).

The service is in **Limited Availability** and requires Zscaler Support enablement. Internet & SaaS is supported, while Private Access support is limited to web traffic (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:12-17`). Do not project standard Cloud Connector VM deployment, lifecycle, or region assumptions onto this managed service.

## Service restrictions

The current Help contract documents these boundaries:

- DNS interception is unsupported (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:19-21`).
- Network Security Integration packet interception removes the high-bandwidth benefit of third-generation-or-newer GCP machine series; the article says not to use NSI for a VM requiring more than 7 Gbps (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:22-25`).
- Regional network firewall policies are unsupported for packet interception (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:26`).
- In-band integration is unsupported for Google Cloud VMware Engine, Google Distributed Cloud-Hosted, Google Distributed Cloud-Edge, Google Private Cloud, Cloud Run, and GKE Enterprise (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:27-29`).

The article also renders a `gcloud compute networks update` command for placing a network firewall policy before classic VPC firewall rules, but the captured command may have lost whitespace during rendering. Preserve it exactly as captured rather than repairing it by inference (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:30-38`).

## Creation contract

The add workflow is under **Infrastructure > Connectors > Cloud > Zero Trust Gateway -- GCP** (`vendor/zscaler-help/cbc-adding-google-cloud-platform-zero-trust-gateway.md:8-12`).

| Setting | Documented behavior |
|---|---|
| Gateway Name | Identifies the gateway (`vendor/zscaler-help/cbc-adding-google-cloud-platform-zero-trust-gateway.md:14`). |
| Region | One GCP region per gateway; immutable after creation (`vendor/zscaler-help/cbc-adding-google-cloud-platform-zero-trust-gateway.md:15-16`). |
| Availability Zone | At least two zones are required (`vendor/zscaler-help/cbc-adding-google-cloud-platform-zero-trust-gateway.md:17-18`). |
| Location Name | Optional; when set, the location is available to policy and synchronized between Cloud Connector and Internet & SaaS policy pages (`vendor/zscaler-help/cbc-adding-google-cloud-platform-zero-trust-gateway.md:19-21`). |
| Location Template | Selects the template for the associated location (`vendor/zscaler-help/cbc-adding-google-cloud-platform-zero-trust-gateway.md:22`). |
| IAM Principals | Accepts User, Group, or Service Account principals associated with the customer's VPC (`vendor/zscaler-help/cbc-adding-google-cloud-platform-zero-trust-gateway.md:24-28`). |

The service allows a connection when it comes from an intercept endpoint group associated with one of the configured IAM principals (`vendor/zscaler-help/cbc-adding-google-cloud-platform-zero-trust-gateway.md:24-28`).

## Intercept resources and health

An **intercept deployment group** is the GCP resource through which Zscaler intercepts and inspects VPC workload traffic. An **intercept endpoint group** is the project-wide resource through which a project accesses the Zscaler-managed security service (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:51-54`).

The gateway list exposes region, availability-zone ID, intercept deployment group, intercept-endpoint-group count, location, timestamps, and service status. List-level service states are **Healthy**, **Unhealthy**, and **Not Available** (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:40-49`).

The detail view exposes Dashboard, Status, Intercept Information, Config, Analytics, Events, and Traffic Simulation (`vendor/zscaler-help/cbc-analyzing-google-cloud-platform-zero-trust-gateway-details.md:8-12`). Per availability zone it reports Internet, Local Egress, and Private Applications health; **Unhealthy** means traffic is dropped because no healthy backend is available, while **Degraded** means traffic still forwards with reduced redundancy (`vendor/zscaler-help/cbc-analyzing-google-cloud-platform-zero-trust-gateway-details.md:21-32`).

An activated Internet & SaaS configuration version can be rejected if it prevents the gateway from functioning; the Config view records versions and supports comparing two versions (`vendor/zscaler-help/cbc-analyzing-google-cloud-platform-zero-trust-gateway-details.md:37-42`). Analytics reports load-balancer bytes and packets, while Events reports event metadata and status (`vendor/zscaler-help/cbc-analyzing-google-cloud-platform-zero-trust-gateway-details.md:44-46`).

## Traffic simulation

Traffic Simulation creates a temporary environment in Zscaler's GCP account, sends traffic through the endpoint, and returns GCP curl output for forwarding and Internet & SaaS policy tests. Creation takes approximately five minutes; the environment lasts one hour and can be renewed for another hour (`vendor/zscaler-help/cbc-analyzing-google-cloud-platform-zero-trust-gateway-details.md:48-54`). A simulation created for one gateway is shared with the other GCP gateways in the same Cloud Connector account, including across regions (`vendor/zscaler-help/cbc-analyzing-google-cloud-platform-zero-trust-gateway-details.md:53-55`).

## Region scope

The current Help table lists 16 GCP Zero Trust Gateway regions spanning the United States, Europe, Australia, India, and Singapore (`vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md:31-50`). See [`./regions.md`](./regions.md) for the exact matrix and for the distinction among Zero Trust Gateway regions, standard Cloud Connector deployment availability, and workload-discovery regions. Help directs customers to Support for an unlisted region (`vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md:52-53`).

## Open questions

- **GA timing and default entitlement** — the captured service is Limited Availability and Support-enabled; no GA date or default-entitlement contract is documented (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:12-13`).
- **Non-web Private Access** — the captured service supports Private Access only for web traffic; no roadmap or fallback for non-web private applications is documented (`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:14-17`).
- **Cross-surface region parity** — the source does not state that the 16 GCP ZTG regions equal standard Cloud Connector deployment regions or workload-discovery supported regions (`vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md:31-53`).
- **AWS/GCP contract parity** — cloud-specific Help establishes a Zscaler-managed, Support-enabled service boundary for both AWS and GCP (`vendor/zscaler-help/cbc-about-amazon-web-services-zero-trust-gateways.md:8-21`; `vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.md:8-17`). It does not prove identical IAM, endpoint, interception, control, API, or service-restriction semantics across the two clouds.

## Cross-links

- Standard customer-deployed GCP Cloud Connector: [`./gcp-deployment.md`](./gcp-deployment.md)
- Region matrices and scope boundaries: [`./regions.md`](./regions.md)
- Product-family architecture: [`./overview.md`](./overview.md)
- Traffic-forwarding methods: [`./forwarding.md`](./forwarding.md)

---
product: cloud-connector
topic: "cc-nss-va"
title: "NSS Virtual Appliance with Cloud Connector — deployment and forwarding"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/cbc-deploying-nss-virtual-appliances.md"
  - "vendor/zscaler-help/cbc-about-log-and-control-forwarding.md"
  - "vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md"
  - "vendor/zscaler-help/understanding-nanolog-streaming-service.md"
  - "vendor/zscaler-help/about-nss-servers.md"
  - "vendor/zscaler-help/about-cloud-nss-feeds.md"
author-status: draft
---

# NSS Virtual Appliance with Cloud Connector — deployment and forwarding

This document covers the CBC-specific angle of NSS: what log data Cloud Connector generates, how that data exits the Zscaler cloud, and how an NSS Virtual Appliance (VA) is deployed and wired to receive it in a CBC environment. For the cross-product NSS architecture (Nanolog, feed pipeline, reliability model, VM-based vs Cloud NSS comparison), see [`../shared/nss-architecture.md`](../shared/nss-architecture.md). This doc does not duplicate that material.

## Overview

Source: `vendor/zscaler-help/cbc-deploying-nss-virtual-appliances.md`; `vendor/zscaler-help/understanding-nanolog-streaming-service.md`; `vendor/zscaler-help/about-nss-servers.md`; `vendor/zscaler-help/about-cloud-nss-feeds.md`.

### What an NSS VA is in the CBC context

In a Cloud Connector deployment, workload traffic is forwarded to ZIA for inspection, and the Zscaler Firewall processes that traffic. Log records — firewall session events, DNS queries, tunnel-level events — accumulate in Zscaler's Nanolog, the same central log store used by all Zscaler products. Getting those logs into a customer SIEM requires NSS: either a VM-based NSS Virtual Appliance that the customer operates, or Cloud NSS (a fully managed HTTPS push from Zscaler). This doc focuses on the VM-based path.

In the CBC context, the NSS VA serves as the **egress conduit** for Zscaler-processed log data back into the customer's environment, where an on-prem or cloud-hosted SIEM can receive it. The VA sits at the boundary between the Zscaler cloud (Nanolog) and the customer's log-ingestion infrastructure.

### Why an NSS VA is needed

Cloud Connector is a workload-side VM — it intercepts and forwards traffic but is not itself a log receiver. Logs for Cloud Connector workloads are stored in the Zscaler Nanolog after ZIA/firewall inspection. An NSS VA is the mechanism by which those logs leave the Nanolog and arrive at the customer's SIEM. Without an NSS VA (or Cloud NSS as the alternative), there is no SIEM-side visibility into CBC workload traffic.

### NSS VA vs Cloud NSS in this scenario

| | NSS VA (VM-based) | Cloud NSS |
|---|---|---|
| Deployment overhead | Customer deploys and operates a VM (AWS, Azure, or vSphere) | None; Zscaler-managed HTTPS push |
| Transport to SIEM | Raw TCP connection from the VA to a SIEM listener | HTTPS POST to a cloud-based SIEM ingestion API |
| On-prem buffer | VM memory (bounded) | None; connectivity gaps = data gap |
| Multi-SIEM fan-out | Up to 16 feeds per VA instance (8 Firewall + 8 Web) — cross-product NSS limit, see [`../shared/nss-architecture.md § Feed-count limits`](../shared/nss-architecture.md) | 1 feed per log type per Cloud NSS instance |
| Required for CBC | NSS for Firewall subscription (CBC-specific) | Cloud NSS for Firewall subscription |
| Operating model | Customer-managed | Zscaler CloudOps |

**Key CBC constraint:** for Cloud & Branch Connector, **only the NSS for Firewall configurations apply**. The NSS for Web subscription and its configurations are not applicable to CBC. Operators following generic NSS deployment guides must ignore Web-only sections.

Cloud NSS is the lower-friction path when the SIEM exposes a publicly routable HTTPS ingestion API (e.g., Splunk HEC, Sentinel HTTPS collector, Elastic). The NSS VA is appropriate when the SIEM is on-premises or behind a firewall that can accept a raw TCP connection from a VM in the cloud account but not an inbound HTTPS call from Zscaler's cloud.

## Deployment model

Source: `vendor/zscaler-help/cbc-deploying-nss-virtual-appliances.md`; `vendor/zscaler-help/understanding-nanolog-streaming-service.md`; `vendor/zscaler-help/about-nss-servers.md`.

### Form factor and subscription

An NSS VA in the CBC context is a **standard Zscaler NSS virtual machine** — the same appliance image used for ZIA Firewall NSS. It is deployed into a cloud account (AWS, Azure) or on-premises vSphere, and its log output is scoped to firewall-type logs from CBC-forwarded traffic. Zscaler provides cloud-platform-specific deployment guides (AWS, Azure, vSphere) linked from the admin console under Administration > Nanolog Streaming Service.

**Subscription requirement:** you must be subscribed to **NSS for Firewall, Cloud and Branch Connector** to create and manage an NSS server that receives CBC traffic. This is a distinct SKU from NSS for Web. Operators attempting to register an NSS server for CBC log streaming without this subscription will not be able to proceed.

### Where the VA lives in the network

The NSS VA must be placed where it can:

1. **Open an outbound TCP tunnel to the Zscaler Nanolog** — the VA initiates the connection to the Nanolog cluster; the Nanolog streams compressed, tokenized log records to the VA. No inbound connections from Zscaler are required.
2. **Deliver logs to the SIEM over raw TCP** — the VA opens an outbound TCP connection to the SIEM's log receiver. The SIEM must be reachable from wherever the VA is deployed.

In cloud deployments (AWS, Azure), the VA is typically placed in the same VPC/VNet as the Cloud Connector, or in a dedicated security/logging VPC with VPN or peering connectivity to the Cloud Connector's network. In hybrid scenarios, the VA may be on-premises if the SIEM is on-premises, with the Nanolog tunnel traversing the internet.

**Egress requirements:** the VA needs outbound internet access to reach the Nanolog (Zscaler cloud endpoints). In Cloud Connector environments running in isolated VPCs, ensure the VA's subnet has a NAT gateway or equivalent providing internet egress. The Nanolog connection goes to Zscaler cloud, not to the Cloud Connector VMs themselves.

### Sizing

The CBC NSS deployment guides provide compute sizing recommendations tied to expected log volume. Sizing follows the same model as ZIA NSS for Firewall. Operators should use the cloud-platform-specific deployment guide to right-size the VA's CPU and memory for the anticipated events-per-second rate from their Cloud Connector fleet.

No CBC-specific sizing numbers are captured in this skill. Consult the Zscaler deployment guide for your platform.

### Redundancy

CBC inherits the standard Zscaler NSS HA model — it is not CBC-specific. The reliability and replay behavior below is a cross-product NSS fact; see [`../shared/nss-architecture.md § Reliability + replay`](../shared/nss-architecture.md) for the canonical detail and citations.

- The **VM memory buffer** provides short-term resilience for SIEM-side outages. If the SIEM receiver goes down, the VA buffers log records in VM memory and replays them when the connection restores, subject to the **Duplicate Logs** setting (cross-product NSS behavior — [`../shared/nss-architecture.md § Reliability + replay`](../shared/nss-architecture.md)).
- **If the VA itself becomes unavailable** (e.g., VM host failure, cloud-instance termination), logs that arrive at the Nanolog during the outage are missed — the Nanolog streams to the VA in real time and does not hold logs indefinitely.
- **NSS one-hour recovery** (opt-in, requires Zscaler Support ticket) lets the Nanolog replay up to one hour of logs after the VA reconnects. Outages longer than one hour create a permanent SIEM gap even if the VA recovers. This is the generic NSS Nanolog→NSS replay window, not a CBC capability — see [`../shared/nss-architecture.md § Reliability + replay`](../shared/nss-architecture.md) for full detail.

Operators with high availability requirements should consider running two NSS VAs in separate availability zones / cloud regions and configuring two NSS server records in the admin console, each with its own set of feeds. Nanolog supports multiple concurrent connections.

## Configuration

Source: `vendor/zscaler-help/cbc-deploying-nss-virtual-appliances.md`; `vendor/zscaler-help/about-nss-servers.md`; `vendor/zscaler-help/about-cloud-nss-feeds.md`.

### Registering the NSS VA with the CBC tenant

Before the VA can receive logs, an **NSS server record** must be created in the Zscaler admin console under Administration > Nanolog Streaming Service > NSS Servers. The registration flow:

1. Create the NSS server record — this triggers Zscaler to issue a **client certificate and private key**.
2. Install the certificate and private key on the NSS VA so it can authenticate to the Nanolog service.
3. The VA opens a TLS-authenticated tunnel to the Nanolog; status appears in the admin console (Active / Inactive / Degraded).

The NSS server type for CBC is **NSS for Firewall**. Selecting the wrong type (NSS for Web) will connect to the wrong Nanolog partition and produce no useful CBC logs.

### Configuring NSS feeds on the VA

NSS feeds define what log data the VA extracts from the Nanolog stream and how it formats and delivers that data to the SIEM. For CBC:

- **Use Firewall-type feeds only.** Web feeds are not applicable (CBC-specific constraint — `vendor/zscaler-help/cbc-deploying-nss-virtual-appliances.md:24`).
- The per-server feed ceiling (up to 8 Firewall feeds; 16 total per server split 8 Web + 8 Firewall) is a cross-product NSS limit, not CBC-specific — see [`../shared/nss-architecture.md § Feed-count limits`](../shared/nss-architecture.md). In the CBC context the Web slots are simply unused because Cloud Connector emits no Web-type records.
- Per feed, configure: log type filter criteria, output format (CSV, JSON, or custom template), destination TCP address:port for the SIEM receiver.

Feed-count limits and format options are documented in [`../shared/nss-architecture.md § Feed-count limits`](../shared/nss-architecture.md).

### Log forwarding rule configuration

Separate from NSS feed configuration, CBC has a **Log and Control Forwarding Rule** policy (Forwarding > Log and Control Forwarding in the CBC admin console). This policy controls how the **Cloud Connector VMs themselves** route their control-plane and log traffic back to the Zscaler cloud — it does not control where the NSS VA sends data to the SIEM. The distinction is:

- **Log and Control Forwarding Rule** — governs the CC VM → Zscaler cloud control channel and log upload path (enrollment, policy updates, software updates, log uploading from the CC to the Nanolog).
- **NSS feed** — governs the Nanolog → NSS VA → SIEM data path.

Both must be functional for end-to-end SIEM visibility. An operator diagnosing missing SIEM logs should check both.

### Downstream SIEM destination

The NSS VA connects to the SIEM over raw TCP. The SIEM must expose a syslog-style TCP listener or a supported NSS TCP receiver. Common integrations:

- **Splunk** — Splunk Universal Forwarder or HEC (but HEC is HTTPS-based, so use a raw TCP input on a Splunk Heavy Forwarder for VM-NSS; HEC is natural for Cloud NSS).
- **ArcSight** — CEF-over-TCP receiver (configure NSS feed to output CEF format).
- **QRadar** — syslog TCP receiver.
- **Elastic** — Logstash TCP input with NSS-compatible parsing.

If the SIEM is cloud-native and only exposes HTTPS ingestion, **Cloud NSS is the better fit** — the NSS VA's raw TCP output cannot directly hit an HTTPS endpoint without a middleware adapter.

## CBC log-and-control forwarding rules

Source: `vendor/zscaler-help/cbc-about-log-and-control-forwarding.md`; `vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md`.

### What they are

Log and Control Forwarding Rules (Forwarding > Log and Control Forwarding) are a distinct CBC policy surface from traffic forwarding rules. They control:

- **Which gateway** the Cloud Connector VMs use to route their own control-plane traffic to Zscaler (enrollment, policy sync, software updates).
- **How logs generated by the CC VMs** (before they reach the Nanolog) are uploaded.

A **default Log and Control Forwarding Rule** is automatically created for every CBC tenant. It uses the default gateway. Operators can add custom rules above the default to route different CC groups or locations through different gateways.

### Rule structure and fields

Each Log and Control Forwarding Rule has:

- **Rule Order** — ascending integer; rules evaluate in ascending numerical order (Rule 1 before Rule 2), and the Rule Order reflects the rule's place in that order (`vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md:34`). Whether evaluation stops at the first matching rule (first-match-wins) is not stated in captured CBC source — see Open questions.
- **Rule Name** — display name, max 31 characters (`vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md:35`).
- **Rule Status** — Enabled or Disabled. A disabled rule **retains its position** in the rule order and is skipped at evaluation time; it does not disappear from the sequence (`vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md:36`).
- **Location** — up to 8 locations, or Any (`vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md:38`).
- **Cloud & Branch Connector Groups** — specific groups, or Any (`vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md:39`). The field is SDK-backed as `ECTrafficLogRules.ECGroups` (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/traffic_log_rules/traffic_log_rules.go:59`), the name-ID set of Cloud Connector groups the rule applies to.
- **Gateway** — the Log and Control Gateway used to forward control-plane traffic (`vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md:40`).
- **Description** — notes, max 10,240 characters (`vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md:42`).

### What log-and-control rules apply to

Log and Control Forwarding Rules apply to the **CC VM → Zscaler cloud control channel**. They are the mechanism by which:

- Cloud Connector VMs enroll with the CBC tenant.
- Policy changes propagate from the CBC admin console to CC VMs.
- Software update downloads are routed.
- Logs are uploaded from the CC VM to the Nanolog.

They do **not** apply to:
- End-user workload traffic (that's Traffic Forwarding Rules — see [`./forwarding.md`](./forwarding.md)).
- The NSS VA's connection to the Nanolog (the VA authenticates directly to the Nanolog using its client certificate, independent of any CC log/control rule).
- The NSS VA's delivery of logs to the SIEM.

### Rule-precedence semantics

Rules evaluate in ascending numerical order — Rule 1 before Rule 2 — and the Rule Order reflects each rule's place in that order (`vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md:34`). A default Log and Control Forwarding rule with a default-gateway action is created automatically for every tenant, and it cannot be duplicated or deleted (`vendor/zscaler-help/cbc-about-log-and-control-forwarding.md:18,41`). Disabling a rule does not remove it from the sequence — the service skips the disabled rule and moves to the next one, and the rule retains its place in the Rule Order (`vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md:36`).

Whether evaluation stops at the first matching rule (first-match-wins) and whether the default rule occupies the terminal catch-all position are not stated in captured CBC source material; see Open questions. For the documented evaluation pattern of traffic forwarding rules, see [`./forwarding.md`](./forwarding.md).

## Common gotchas

Source: `vendor/zscaler-help/cbc-deploying-nss-virtual-appliances.md`; `vendor/zscaler-help/cbc-about-log-and-control-forwarding.md`; `vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md`; `vendor/zscaler-help/understanding-nanolog-streaming-service.md`; `vendor/zscaler-help/about-nss-servers.md`; `vendor/zscaler-help/about-cloud-nss-feeds.md`.

### Clock sync (NTP)

NSS VAs use TLS certificates with expiry timestamps. If the VM's clock drifts, TLS handshakes to the Nanolog fail with certificate validation errors that can look like network connectivity issues. Ensure the NSS VA and all Cloud Connector VMs are NTP-synchronized. In cloud environments, the hypervisor clock and the cloud provider's NTP endpoint (169.254.169.123 on AWS, time.windows.com on Azure) are usually sufficient. Verify NTP is not blocked by a security group or NSG rule on the VA's subnet.

### Certificate trust

The NSS VA authenticates to the Nanolog using the client certificate issued during NSS server registration. If the certificate expires, is revoked, or the private key is rotated on the VM without updating the server record, the Nanolog tunnel drops. Zscaler does not automatically push new certificates; operators must track certificate expiry and re-register if needed. Loss of the Nanolog tunnel = silent SIEM gap until the operator notices the VA state is not Active in the admin console.

### Egress filter requirements

The NSS VA must have outbound internet access to reach Zscaler's Nanolog cluster endpoints. In Cloud Connector deployments where VPCs are locked down by restrictive security groups, NSGs, or on-premises firewall rules, the VA subnet must be explicitly permitted to reach Zscaler cloud endpoints on the required ports. Operators should consult the Zscaler IP/port reference for NSS for the current list of required destinations. Blocking egress from the VA to Zscaler cloud is a common misconfiguration in security-hardened cloud accounts where "allow only known destinations" policies are enforced.

**Separate concern:** Log and Control Forwarding Rules control which gateway Cloud Connector VMs use for their own control traffic — not the NSS VA's egress. Even if CC VMs route their control channel correctly, the NSS VA needs its own direct internet path (or an explicit allowed path through a firewall) to reach the Nanolog.

### NSS for Web configurations do not apply to CBC

The Zscaler NSS deployment guides cover both NSS for Web and NSS for Firewall. In the CBC context, **only NSS for Firewall applies**. Operators following a deployment guide that is not CBC-specific (e.g., a ZIA-focused guide) must skip Web-type configuration sections. Configuring Web feeds on a CBC NSS server produces no output because Cloud Connector does not generate Web-type log records — workload traffic that Cloud Connector forwards to ZIA for inspection appears in ZIA's Firewall/DNS logs, not Web transaction logs.

### Multi-region considerations

Cloud Connector deployments that span multiple cloud regions need NSS coverage in each region, or a centralized NSS VA that can be reached from all regions. Options:

- **Centralized NSS VA** — single VA with internet egress connecting to the Nanolog (the Nanolog is cloud-global; the VA doesn't need to be co-located with CC VMs). Suitable if the VA has reliable internet egress and sufficient capacity for all regions' log volume.
- **Per-region NSS VA** — one VA per region, each with its own NSS server record and feeds. Eliminates cross-region log traffic but multiplies the administrative surface.

Log and Control Forwarding Rules can target specific Cloud Connector Groups (which are region-specific), allowing the CC VMs in different regions to route through different gateways. This is a traffic-forwarding concern separate from NSS VA placement — but multi-region operators should align their log/control gateway selection with their NSS VA deployment topology.

### Feed limits and log-type scope

Each NSS server handles up to 8 Firewall feeds (cross-product NSS limit — [`../shared/nss-architecture.md § Feed-count limits`](../shared/nss-architecture.md)). Whether CBC DNS log records arrive under the Firewall log stream (as the shared NSS model suggests for VM-based NSS, where DNS flows through the Firewall subscription) or surface as a separate DNS feed type is **not confirmed in captured CBC source material** — the CBC NSS guidance only references Firewall. Operators expecting a dedicated DNS feed type should verify against their tenant; flagged under open questions.

### Cloud NSS as the alternative

If the SIEM is a cloud SaaS product with an HTTPS ingestion API, Cloud NSS (not NSS VA) is the appropriate path. A Cloud NSS for Firewall subscription covers CBC log types. No VM to operate, no certificate to manage, no egress filter to configure — Zscaler's cloud pushes to the SIEM's API endpoint. Cloud NSS has its own limitations (1 feed per log type per instance, no VM-side buffer, separate subscription SKU) documented in [`../shared/nss-architecture.md`](../shared/nss-architecture.md).

## Open questions register

Source: `vendor/zscaler-help/cbc-deploying-nss-virtual-appliances.md`; `vendor/zscaler-help/cbc-about-log-and-control-forwarding.md`; `vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md`; `vendor/zscaler-help/understanding-nanolog-streaming-service.md`; `vendor/zscaler-help/about-nss-servers.md`; `vendor/zscaler-help/about-cloud-nss-feeds.md`.

- **DNS log type in CBC**: Does CBC DNS (from the DNS Forwarding Gateway / DNS policy) appear under the Firewall log type in NSS, or is it a separate log type? Zscaler's generic NSS docs list DNS as a separate type, but CBC's NSS guidance only references Firewall. Need to confirm whether an NSS Firewall feed covers DNS events from Cloud Connector, or whether a separate feed (if available under the CBC subscription) is needed.
- **NSS VA sizing numbers for CBC**: No CBC-specific sizing table is captured. The deployment guides reference Zscaler's sizing tool, but what the tool outputs for typical CC fleet sizes (50 CCs, 500 CCs) is unknown. Operators should use the deployment guide's interactive sizing before provisioning.
- **Certificate renewal process**: Zscaler issues the NSS client certificate at registration time. The certificate's validity period and whether Zscaler provides an automated renewal path or requires manual re-registration is not documented in captured source material.
- **HA / active-active NSS VA support**: Whether two NSS VAs can consume from the same Nanolog partition simultaneously (for redundancy) or whether the Nanolog streams to exactly one VA at a time is not confirmed. If active-active is supported, this is the natural HA pattern; if not, a standby VA must wait for the primary to drop before connecting.
- **Log and Control Forwarding vs NSS VA interaction**: Whether the Log and Control Forwarding gateway selection affects the path that CC VMs take to upload logs to the Nanolog — and therefore whether a misconfigured log/control rule could starve the Nanolog of CC-generated logs before the NSS VA can pull them — is not confirmed.
- **Feed output format recommendations for CBC Firewall logs**: The shared NSS doc notes Zscaler recommends JSON for Cloud NSS. For VM-based NSS in the CBC context, whether JSON is supported as a Firewall feed output format (or whether CSV is the only tested format) is not captured.
- **Log and Control Forwarding rule match behavior**: Captured CBC source confirms rules evaluate in ascending numerical order and that a disabled rule is skipped while keeping its place (`vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md:34,36`), but does not state whether evaluation stops at the first matching rule (first-match-wins) or whether the auto-created default rule occupies the terminal catch-all position. The earlier comparison to traffic forwarding rules and the ZIA URL Filter was an inference, not a sourced fact — needs confirmation against tenant behavior or a source that explicitly establishes the stop-on-first-match semantics.

All seven items above are filed together as [clarification `cloud-connector-20`](../_meta/clarifications.md#cloud-connector-20-nss-va-for-cbc-feed-coverage-sizing-certs-ha-and-rule-match-semantics).

## Cross-links

- Shared NSS architecture (Nanolog, feed pipeline, reliability, VM vs Cloud NSS comparison) — [`../shared/nss-architecture.md`](../shared/nss-architecture.md)
- Traffic forwarding rules (data-plane routing, separate from log/control forwarding) — [`./forwarding.md`](./forwarding.md)
- Cloud Connector overview (groups, HA, enrollment) — [`./overview.md`](./overview.md)
- DNS subsystem (DNS gateway rules, separate from NSS) — [`./dns-subsystem.md`](./dns-subsystem.md)

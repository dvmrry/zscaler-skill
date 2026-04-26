---
product: cloud-connector
topic: "cloud-connector-forwarding"
title: "Cloud Connector traffic forwarding — rules, methods, criteria, DNS"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/cloud-branch-connector/configuring-traffic-forwarding-rule"
  - "vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md"
author-status: draft
---

# Cloud Connector traffic forwarding

How Cloud Connector decides what to do with each packet it receives. Traffic forwarding rules are the policy engine — they match on workload/service/destination criteria and apply one of five forwarding methods. Parallel concept to ZCC's Forwarding Profile (client-side) but shaped for workloads.

## Summary

Five forwarding methods:

| Method | What it does | When to use |
|---|---|---|
| **ZIA** | Forward to ZIA for internet inspection | Workload-to-internet; default for internet-bound traffic |
| **ZPA** | Forward to ZPA for private-app access | Workload-to-workload (private) |
| **Direct** | Bypass Zscaler; send to destination directly | Exempt traffic (e.g., local cloud metadata endpoints, intra-VPC health checks) |
| **Drop** | Discard traffic | Policy deny |
| **Local** | Forward locally (Cloud Connector + ZTG only) | Cloud-to-cloud workload communication with local inspection |

Rules are evaluated **top-down by rule order, first match wins**. Same pattern as ZIA URL Filter. A default rule with a default gateway is predefined for ZIA forwarding; custom rules evaluate before the default.

**DNS is required for non-HTTP traffic with wildcard/FQDN matching.** Cloud Connector resolves wildcards against DNS responses; if workloads bypass Cloud Connector for DNS, UDP and non-web traffic match on IP only.

## Mechanics

### Rule structure

From *Configuring Traffic Forwarding Rules*, each rule has:

**Forwarding Rule section:**

- **Rule Order** — integer. Rules evaluate in ascending numerical order (Rule 1 before Rule 2). **Changing rule order moves the rule in the evaluation sequence** — same semantics as ZIA URL Filter's rule order.
- **Rule Name** — display name. Auto-generated but editable. Max 31 chars.
- **Rule Status** — enabled or disabled. **A disabled rule does not lose its place in the rule order** (same pattern as ZIA — see [`../zia/url-filtering.md § Disabled rules`](../zia/url-filtering.md)). The service skips it and moves to the next rule.
- **Forwarding Method** — ZIA / ZPA / Direct / Drop / Local. Mutually exclusive per rule.

**Criteria section:**

All criteria ANDed together within a single rule. Multiple items within one criterion field OR together (same AND-across-fields / OR-within-field pattern as ZCC probing criteria and ZIA URL Filter).

- **Location / Sublocation** — up to **8** locations/sublocations. If empty, rule applies to all locations.
- **Cloud & Branch Connector Groups** — up to **32** groups. If empty, applies to all groups.
- **Network Services** — any number. If empty, applies to all services.
- **Network Services Group** — any number of predefined or custom groups. If empty, applies to all groups.
- **Application Service Groups** — predefined groups Zscaler maintains: Office365, Zoom, Webex, RingCentral, LogMeIn, BlueJeans, AWS, Azure, GCP, Zscaler Cloud Endpoints, Talk_Desk, and others. Used to quickly scope a rule to "all Office 365 traffic" without enumerating endpoints.
- **Applications** (per-application selection).
- **Application Groups** (custom groupings of applications).
- **Source IP Groups** — the workload-side source IPs.
- **Destination IP Groups** — the destination addresses.
- **Domains / FQDN** — domain-based matching.
- **Custom Domain Groups** — tenant-defined groups of domains.

### The five forwarding methods

#### ZIA

Internet-bound traffic matching a rule with `Forwarding Method = ZIA` goes through a ZIA gateway over a configurable encrypted or unencrypted tunnel. The gateway is the configured primary/secondary/tertiary chain (see [`./overview.md § Primary/secondary/tertiary`](./overview.md)).

**Default rule exists** — the tenant ships with a default ZIA rule + default gateway. Custom rules above the default in rule order apply first; traffic not matching any custom rule falls through to the default.

#### ZPA

Application traffic matching a rule with `Forwarding Method = ZPA` tunnels through ZPA to reach an internal application. Requires:

- Cloud Connector is ZPA-enrolled (per [`./overview.md § ZPA enrollment`](./overview.md)).
- A ZPA Application Segment exists for the destination — see [`../zpa/app-segments.md`](../zpa/app-segments.md).
- ZPA Access Policy permits the Cloud Connector's identity / tags.

**Failure mode**: ZPA rule matches but traffic fails. Usual causes: (a) no matching ZPA segment on the destination, (b) ZPA Access Policy denies, (c) App Connector side down. Diagnose ZPA-side first before suspecting Cloud Connector.

#### Direct

Traffic bypasses Zscaler entirely. Cloud Connector routes it via the cloud provider's native networking (VPC routing tables / Azure UDRs / GCP routes). Used for:

- Cloud metadata endpoints (e.g. 169.254.169.254 for AWS IMDS).
- Intra-VPC health checks or service communication that shouldn't traverse Zscaler.
- Cloud-provider-specific services (S3 endpoints, Azure Storage, GCP Cloud Storage) where direct VPC-private connectivity is preferred.

**Security trade-off**: direct-forwarded traffic is uninspected. Use sparingly and narrowly.

#### Drop

Traffic is discarded. No forwarding; workload sees connection failure. Used for explicit deny rules — a specific destination the tenant wants to block for workloads.

#### Local (Cloud Connector + ZTG only)

> The local forwarding method is only available for Cloud Connector and Zscaler Zero Trust Gateways.

Not available on Branch Connector. Forwards traffic locally within the Cloud Connector's own network context — used for cloud-to-cloud workload communication where the destination is reachable via local cloud networking but still needs local inspection. Semantics not fully documented in captured material.

### Predefined rules and gateway-mode gating

Per `vendor/zscaler-help/cbc-about-traffic-forwarding.md`, two predefined rules ship with every CC group:

- **Direct for Zscaler Cloud Endpoints** — sends Zscaler control-plane traffic direct (e.g., the CC's own connectivity to ZIA peer discovery). Always present, gateway-mode-only.
- **WAN/LAN Destinations Group** — predefined destination set used by gateway-mode forwarding rules.

**Both predefined rules are gateway-mode-only and license-gated.** A non-gateway-mode CC won't see them; a tenant without the relevant license tier won't be able to enable them. This matters for CC groups that operate in non-gateway mode (e.g., simpler workload-to-internet forwarding without ZIA inspection).

### AWS-specific: GWLB vs ENI endpoint selection

Per `vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-amazon-web-services.md` and `cbc-zero-trust-security-aws-workloads-zscaler-cloud-connector.md`, AWS deployments choose between two traffic-redirect mechanisms:

- **Gateway Load Balancer (GWLB)** — preferred for multi-VPC fleets where AWS GWLB handles transparent traffic insertion. Spoke VPCs route via VPC Endpoint to a Gateway Load Balancer pointed at the CC ENI.
- **ENI / route-table modification** — direct route-table updates pointing 0.0.0.0/0 (or specific CIDRs) at the CC's service ENI. Simpler for single-VPC deployments; doesn't scale well across many spoke VPCs.

This is an AWS-specific topology choice with no Azure equivalent (Azure deployments use UDRs to ILB frontend). Choice impacts blast radius of route changes, multi-AZ failover behavior, and how new spoke VPCs onboard. See [`./aws-deployment.md`](./aws-deployment.md) for the full deployment context.

### Rule evaluation order

First-match-wins top-down, same as ZIA URL Filter. Disabled rules skip without losing position.

**Default rule fires last** — the pre-provisioned "default gateway" ZIA rule sits at the terminal position. Traffic not matching any custom rule routes to ZIA via the default gateway.

### DNS forwarding gateway — separate from traffic forwarding

Cloud Connector also forwards DNS queries. The DNS path is configured separately via **DNS Forwarding Gateway** rules. From the Go SDK (`ztw/services/dns_gateway/` and `ztw/services/forwarding_gateways/`) and TF provider (`resource_ztc_dns_forwarding_gateway.go`, `resource_ztc_dns_gateway.go`), DNS gateways are distinct resources with their own rule surface.

**When DNS matters**: workloads resolving wildcard or FQDN destinations through Cloud Connector need DNS routed through Cloud Connector's DNS forwarding for the wildcard-domain criteria to match. HTTP/HTTPS traffic doesn't require this (Cloud Connector can match on SNI / Host header). **UDP and non-web TCP traffic to wildcard domains only works if DNS flows through Cloud Connector.**

### Log and Control Forwarding Rule — the other rule type

There's a separate rule type called **Log and Control Forwarding Rule** (Go SDK: `ztw/services/policy_management/traffic_log_rules`). Configures where Cloud Connector sends logs and control-plane events (to Nanolog / NSS / SIEM). Distinct from traffic forwarding rules — the traffic rule controls data-plane routing; the log/control rule controls observability streams.

Not captured in depth; referenced here so an operator asking "why aren't my Cloud Connector logs reaching our SIEM" lands in the right place: Log and Control Forwarding Rules, not traffic forwarding rules.

## Common patterns

- **Exempt cloud metadata service**: `Rule 1 — destination 169.254.169.254, method Direct`. Prevents metadata-service calls from hitting ZIA (which would either block or add latency).
- **Route cloud provider storage direct**: `Rule N — Application Service Group = Amazon Web Services (or Azure, GCP), method Direct`. VPC-endpoint-friendly.
- **Force workload-to-internal-app via ZPA**: `Rule 5 — destination = internal-CIDR, method ZPA`. Workloads reaching the internal app go through ZPA's zero-trust tunnel.
- **Block crypto-mining destinations**: `Rule 10 — Custom Domain Group = mining-pools, method Drop`.
- **Default (pre-provisioned)**: `Rule 999 (terminal) — match all, method ZIA via default gateway`. Internet-bound traffic not exempted goes to ZIA.

## Edge cases

- **Rule ordering mistakes**: placing a Direct exemption rule **below** a broad ZIA rule causes the ZIA rule to match first; the exemption never fires. Same footgun as ZIA URL Filter's first-match-wins.
- **Wildcard domain matching without DNS through Cloud Connector**: UDP and non-web traffic to wildcard destinations fails to match — Cloud Connector only sees the destination IP, not the hostname. Either route DNS through Cloud Connector, or use IP-based criteria instead of FQDN.
- **Application Service Groups updated by Zscaler**: Zscaler maintains the predefined service groups (Office365, Zoom, etc.). When Zscaler adds new endpoints to Office365's IP/domain list, your rule matching "Office365" automatically picks them up. Can be surprising if a new endpoint lands in a direction you didn't intend.
- **Forwarding Method change on existing rule**: changing from ZIA to Direct (or vice versa) mid-session likely terminates in-flight sessions. Plan rule changes during low-traffic windows for anything with long-lived connections.
- **Local forwarding + Branch Connector**: Branch Connector doesn't support the Local method. Rules built for Cloud Connector that use Local don't port to Branch deployments.
- **Drop rule false-positive**: dropping traffic shows as "connection refused" or timeout to the workload. Hard to diagnose from the workload side — the workload doesn't see "blocked by Zscaler," just network failure. Operators debugging workload-side should check Cloud Connector rule logs before blaming network/DNS.

## Open questions

- **Local forwarding method full semantics** — doc doesn't explain where "local" traffic goes (to an intra-Cloud-Connector module? to the same VPC's egress?). Needs clarification.
- **Rule limits** — how many traffic forwarding rules can a tenant define? Not captured.
- **Rule-rank-like admin ordering** — does Cloud Connector have the "admin rank gates order values" pattern that ZIA URL Filter has? Unclear.

## Cross-links

- Overview (HA, Cloud Connector Groups) — [`./overview.md`](./overview.md)
- API / Terraform surface — [`./api.md`](./api.md)
- ZIA URL Filter (adjacent first-match-wins rule pattern) — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZPA Application Segments (destination model for ZPA-forwarded traffic) — [`../zpa/app-segments.md`](../zpa/app-segments.md)
- ZCC forwarding profile (endpoint-side parallel) — [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md)

---
product: cloud-connector
topic: "cloud-connector-forwarding"
title: "Cloud Connector traffic forwarding — rules, methods, criteria, DNS"
content-type: reasoning
last-verified: "2026-06-15"
confidence: high
source-tier: mixed
sources:
  - "https://help.zscaler.com/cloud-branch-connector/configuring-traffic-forwarding-rule"
  - "vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md"
  - "vendor/zscaler-help/cbc-about-traffic-forwarding.md"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go"
  - "vendor/terraform-provider-ztc/docs/resources/ztc_traffic_forwarding_rule.md"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_rule.go"
author-status: draft
---

# Cloud Connector traffic forwarding

How Cloud Connector decides what to do with each packet it receives. Traffic forwarding rules are the policy engine — they match on workload/service/destination criteria and apply a forwarding method. Parallel concept to ZCC's Forwarding Profile (client-side) but shaped for workloads.

## Summary

Source: `vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md`; `vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go`.

The admin console exposes five forwarding-method labels — **ZIA, ZPA, Direct, Drop, Local** (`cbc-about-traffic-forwarding.md:38`). But the API `ForwardMethod` field carries a wider enum (`forwarding_rules.go:44` Supported Values: `INVALID`, `DIRECT`, `PROXYCHAIN`, `ZIA`, `ZPA`, `ECZPA`, `ECSELF`, `DROP`, `ENATDEDIP`, `GEOIP`), and two of the console labels map to different enum strings when you drive the rule through the SDK / Terraform / API:

| Console label | API `ForwardMethod` | What it does | When to use |
|---|---|---|---|
| **ZIA** | `ZIA` | Forward to ZIA for internet inspection | Workload-to-internet; default for internet-bound traffic |
| **ZPA** | `ECZPA` | Forward to ZPA for private-app access (Cloud Connector / `EC_RDR` rule) | Workload-to-workload (private) |
| **Direct** | `DIRECT` | Bypass Zscaler; send to destination directly | Exempt traffic (e.g., local cloud metadata endpoints, intra-VPC health checks) |
| **Drop** | `DROP` | Discard traffic | Policy deny |
| **Local** | `LOCAL_SWITCH` (TF) / `ECSELF` (Go SDK enum) | Forward locally without leaving the public cloud | East-west / macrosegmentation between VPCs |

The console→API mapping for ZPA→`ECZPA` is shown in `vendor/terraform-provider-ztc/docs/resources/ztc_traffic_forwarding_rule.md:206` (`forward_method = "ECZPA"`). The **Local** method is the one case where the layers disagree on the token: the Terraform provider's traffic-forwarding-rule resource validates `forward_method` against `LOCAL_SWITCH` (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_rule.go:169`; also listed in `vendor/terraform-provider-ztc/docs/resources/ztc_traffic_forwarding_rule.md:248`), while the Go SDK's `ForwardMethod` doc-comment enum for the same `/ecRules/ecRdr` data-plane rule lists `ECSELF` instead (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go:44`). The wire field is a free string, so neither value is proven against a live backend — see [`./api-divergences.md § forwardMethod enum`](./api-divergences.md). (Don't confuse this with the separate **Log and Control Forwarding** rule, whose `forward_method` is the fixed value `ECSELF` — that is a different rule type, covered in [Log and Control Forwarding Rule](#log-and-control-forwarding-rule-the-other-rule-type).) The remaining enum values (`PROXYCHAIN`, `ENATDEDIP`, `GEOIP`, `INVALID`) have no clean console label in the captured material:

- **`PROXYCHAIN`** — proxy chaining: the rule forwards matched traffic to a configured proxy gateway (set via the **Forward to Proxy Gateway** action field, `cbc-configuring-traffic-forwarding-rule.md:120`; `proxyGateway` is only honored for this method, `forwarding_rules.go:154`). Only TCP-based network services are considered for policy match under proxy chaining (`forwarding_rules.go:135`).
- **`ENATDEDIP`** / **`GEOIP`** — present in the API enum (`forwarding_rules.go:44`); their semantics are not documented in the captured material. See [Open questions](#open-questions).

**Rule `Type` is a separate axis from `ForwardMethod`.** Each rule also carries a `Type` field (`forwarding_rules.go:34` Supported Values: `FIREWALL`, `DNS`, `DNAT`, `SNAT`, `FORWARDING`, `INTRUSION_PREVENTION`, `EC_DNS`, `EC_RDR`, `EC_SELF`, `DNS_RESPONSE`) that classifies the *kind* of rule, distinct from the forwarding *action*. Cloud Connector traffic-forwarding rules are `EC_RDR` type (see the `ECZPA` Terraform example, `ztc_traffic_forwarding_rule.md:205`). Don't conflate rule type with forwarding method.

Rules are evaluated **top-down by rule order, first match wins**. Same pattern as ZIA URL Filter. A default rule with a default gateway is predefined for ZIA forwarding; custom rules evaluate before the default.

**DNS is required for non-HTTP traffic with wildcard/FQDN matching.** Cloud Connector resolves wildcards against DNS responses; if workloads bypass Cloud Connector for DNS, UDP and non-web traffic match on IP only.

## Mechanics

### Rule structure

Source: `vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md`; `vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go`.

**API surface.** Traffic forwarding rules live under `GET /ztw/api/v1/ecRules/ecRdr` (`forwarding_rules.go:17`), with the usual `Get`/`Create` (POST)/`Update` (PUT)/`Delete` operations on `/ecRules/ecRdr/{id}`, a `/ecRules/ecRdr/count` sub-endpoint (`forwarding_rules.go:348`), and a paginated `GetAll` that reads all pages (`forwarding_rules.go:287,321`). Filterable by `ruleName`, `ruleOrder`, `ruleDescription`, `ruleForwardMethod`, and `location` (`forwarding_rules.go:294-307`).

From *Configuring Traffic Forwarding Rules*, each rule has:

**Forwarding Rule section:**

- **Rule Order** — integer. Rules evaluate in ascending numerical order (Rule 1 before Rule 2). **Changing rule order moves the rule in the evaluation sequence** — same semantics as ZIA URL Filter's rule order.
- **Rule Name** — display name. Auto-generated but editable. Max 31 chars.
- **Rule Status** — enabled or disabled. **A disabled rule does not lose its place in the rule order** (same pattern as ZIA — see [`../zia/url-filtering.md § Disabled rules`](../zia/url-filtering.md)). The service skips it and moves to the next rule.
- **Admin Rank** — integer rank assigned to the rule (`forwarding_rules.go:41` "Admin rank assigned to the forwarding rule"; exposed in Terraform as `rank`, `ztc_traffic_forwarding_rule.md:203`). Cloud Connector forwarding rules carry a Rank field, the same admin-rank construct ZIA URL Filtering rules use.
- **Forwarding Method** — ZIA / ZPA / Direct / Drop / Local (console labels; see the console→API enum table in [Summary](#summary)). Mutually exclusive per rule.

**Criteria section:**

All criteria ANDed together within a single rule. Multiple items within one criterion field OR together (same AND-across-fields / OR-within-field pattern as ZCC probing criteria and ZIA URL Filter).

- **Location / Sublocation** — up to **8** locations/sublocations. If empty, rule applies to all locations.
- **Cloud & Branch Connector Groups** — up to **32** groups. If empty, applies to all groups.
- **Network Services** — any number. If empty, applies to all services.
- **Network Services Group** — any number of predefined or custom groups. If empty, applies to all groups.
- **Application Service Groups** — predefined groups Zscaler maintains: Office365, Zoom, Webex, RingCentral, LogMeIn, BlueJeans, AWS, Azure, GCP, Zscaler Cloud Endpoints, Talk_Desk, and others. Used to quickly scope a rule to "all Office 365 traffic" without enumerating endpoints.
- **Applications** (per-application selection).
- **Application Groups** (custom groupings of applications).
- **Source IP Groups** — the workload-side source IPs (`SrcIpGroups`, `forwarding_rules.go:120`). Can also reference App Connector source IP addresses (`cbc-configuring-traffic-forwarding-rule.md:88`).
- **Source Workload Groups** — tag-based workload selectors from the workload-discovery service (`cbc-configuring-traffic-forwarding-rule.md:94`; `SrcWorkloadGroups`, `forwarding_rules.go:152`). "Referenced as a source object for the Local, Direct, ZIA, and ZPA criteria… only applicable to Cloud Connector traffic forwarding policies" (`:94`), and only available when workload discovery is enabled (`:96`). This is Cloud-Connector-specific and the policy hook for the tag-based workload-discovery integration — see [`./aws-workload-discovery.md`](./aws-workload-discovery.md).
- **Destination IP Groups** — the destination addresses (`DestIpGroups`, `forwarding_rules.go:128`). Console label "Destination IPv4 Groups" (`cbc-configuring-traffic-forwarding-rule.md:104`).
- **Destination Workload Groups** — tag-based VPC/traffic criteria (`cbc-configuring-traffic-forwarding-rule.md:422`,`:530`). **Local-method only**: "can only be applied to Cloud Connector traffic forwarding policies and are only applicable to the Local traffic forwarding method" (`:422`,`:530`). Workload-discovery-gated (`:424`,`:532`).
- **Domains / FQDN** — domain-based matching ("IP Address Or WildCard FQDN", `cbc-configuring-traffic-forwarding-rule.md:106`). Wildcard domains/FQDNs limited to 16K per organization and 8,000 per rule (`:108`).
- **Custom Domain Groups** — tenant-defined groups of domains.

**Action section:**

Source: `vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md`; `vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go`.

- **Forward to Proxy Gateway** — optional drop-down to select a proxy gateway (`cbc-configuring-traffic-forwarding-rule.md:120`). This is the action that backs the `PROXYCHAIN` forwarding method; the `proxyGateway` field is "applicable only for the Proxy Chaining forwarding method" (`forwarding_rules.go:154`).
- **WAN Selection** — `None` (default) / `Balanced` / `Best Link` (`cbc-configuring-traffic-forwarding-rule.md:316`). `None` defers to the Branch Configuration Template's Traffic Distribution setting; `Balanced` distributes evenly; `Best Link` always uses the best-performing WAN link. **Only applicable to hardware devices deployed in gateway mode** (`:322`) — Branch-side. (The API `WanSelection` field is marked deprecated/no-longer-configurable in the SDK, `forwarding_rules.go:49-51`, though the console still exposes it for gateway-mode Branch Connectors.)

### The forwarding methods

Source: `vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md`.

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

#### Local (Cloud Connector + ZTG only) — API `LOCAL_SWITCH` / `ECSELF`

> The local forwarding method is only available for Cloud Connector and Zscaler Zero Trust Gateways.

Source: `vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md`.

Not available on Branch Connector. Local is the **east-west / macrosegmentation** method: it "facilitates subnet-to-subnet or virtual private cloud (VPC)-to-VPC communication across Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP), allowing you to permit ingress traffic to publicly hosted applications in AWS" and controls "traffic for east-west segmentation and macrosegmentation using 5-tuples" (`cbc-configuring-traffic-forwarding-rule.md:436`).

Key properties (`cbc-configuring-traffic-forwarding-rule.md:450`):

- Forwards traffic locally **within the public cloud** to the intended destination (an IP address or tag). **Traffic does not egress out of the public cloud.**
- Can forward from any IP address or tag in a VPC to another IP address or tag in the **same or a different VPC**.
- **Preserves the original client IP address.**

Local pairs with **Destination Workload Groups**, which are "only applicable to the Local traffic forwarding method" (`cbc-configuring-traffic-forwarding-rule.md:422`,`:530`) — they tag VPC/traffic criteria for the local destination. Source Workload Groups can also scope a Local rule (`:94`).

### Predefined rules and gateway-mode gating

Source: `vendor/zscaler-help/cbc-about-traffic-forwarding.md`; `vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md`.

Per `vendor/zscaler-help/cbc-about-traffic-forwarding.md:41-45`, **three** predefined Direct rules ship, created by Zscaler. They are **disabled by default** (you can enable them), and they appear based on the licenses enabled in your tenant:

- **Direct rule for Zscaler Cloud Endpoints** — "if the destination is a Zscaler Cloud Endpoints application service group, then the forwarding method is set to Direct" (`cbc-about-traffic-forwarding.md:42`). It matches on **destination = the Zscaler Cloud Endpoints application service group**, not on Cloud Connector control-plane / peer-discovery traffic.
- **Direct rule for WAN Destinations Group** — "if the destination is a WAN IP group, then the forwarding method is set to Direct" (`cbc-about-traffic-forwarding.md:43`).
- **Direct rule for LAN Destinations Group** — "if the destination is a LAN IP group, then the forwarding method is set to Direct" (`cbc-about-traffic-forwarding.md:45`). WAN and LAN are **separate** predefined rules, not one combined rule.

**Gateway-mode-only.** "Predefined forwarding rules are only applicable to hardware devices deployed in gateway mode" and require a location or Branch Connector group configured for them; only gateway-mode devices can join the mandatory group used for these rules (`cbc-about-traffic-forwarding.md:47`). On a predefined rule you can edit **only** Rule Order, Rule Status, Location/Sublocation, and Cloud & Branch Connector Groups (`cbc-about-traffic-forwarding.md:49`) — the match/action are fixed.

**ZPA predefined rules** (`cbc-configuring-traffic-forwarding-rule.md:135-138`):

- **ZPA Forwarding Rule** (with default gateway) — created when the tenant is subscribed to the ZPA license.
- **ZPA Pool For Stray Traffic** — a predefined rule with forwarding method **Drop**, "automatically created with view-only access when you enable a ZPA server's SKU on your Cloud or Branch Connector" (`cbc-configuring-traffic-forwarding-rule.md:138`). It is read-only and catches stray ZPA-server traffic.

### AWS-specific: GWLB vs ENI endpoint selection

Source: `vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-amazon-web-services.md`; `vendor/zscaler-help/cbc-zero-trust-security-aws-workloads-zscaler-cloud-connector.md`.

Per `vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-amazon-web-services.md` and `cbc-zero-trust-security-aws-workloads-zscaler-cloud-connector.md`, AWS deployments choose between two traffic-redirect mechanisms:

- **Gateway Load Balancer (GWLB)** — preferred for multi-VPC fleets where AWS GWLB handles transparent traffic insertion. Spoke VPCs route via VPC Endpoint to a Gateway Load Balancer pointed at the CC ENI.
- **ENI / route-table modification** — direct route-table updates pointing 0.0.0.0/0 (or specific CIDRs) at the CC's service ENI. Simpler for single-VPC deployments; doesn't scale well across many spoke VPCs.

This is an AWS-specific topology choice with no Azure equivalent (Azure deployments use UDRs to ILB frontend). Choice impacts blast radius of route changes, multi-AZ failover behavior, and how new spoke VPCs onboard. See [`./aws-deployment.md`](./aws-deployment.md) for the full deployment context.

### Rule evaluation order

Source: `vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md`.

First-match-wins top-down, same as ZIA URL Filter. Disabled rules skip without losing position.

**Default rule fires last** — the pre-provisioned "default gateway" ZIA rule sits at the terminal position. Traffic not matching any custom rule routes to ZIA via the default gateway.

### DNS forwarding gateway — separate from traffic forwarding

Source: `vendor/zscaler-sdk-go/zscaler/ztw/services/dns_gateway/dns_gateway.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/forwarding_gateways/dns_forwarding_gateway/dns_forwarding_gateway.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/forwarding_gateways/zia_forwarding_gateway/zia_forwarding_gateway.go`; `vendor/terraform-provider-ztc/docs/resources/ztc_dns_forwarding_gateway.md`; `vendor/terraform-provider-ztc/docs/resources/ztc_dns_gateway.md`.

Cloud Connector also forwards DNS queries. The DNS path is configured separately via **DNS Forwarding Gateway** rules. From the Go SDK (`ztw/services/dns_gateway/` and `ztw/services/forwarding_gateways/`) and TF provider (`resource_ztc_dns_forwarding_gateway.go`, `resource_ztc_dns_gateway.go`), DNS gateways are distinct resources with their own rule surface.

**When DNS matters**: workloads resolving wildcard or FQDN destinations through Cloud Connector need DNS routed through Cloud Connector's DNS forwarding for the wildcard-domain criteria to match. HTTP/HTTPS traffic doesn't require this (Cloud Connector can match on SNI / Host header). **UDP and non-web TCP traffic to wildcard domains only works if DNS flows through Cloud Connector.**

### Log and Control Forwarding Rule — the other rule type

Source: `vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/traffic_log_rules/traffic_log_rules.go`.

There's a separate rule type called **Log and Control Forwarding Rule** (Go SDK: `ztw/services/policy_management/traffic_log_rules`). Configures where Cloud Connector sends logs and control-plane events (to Nanolog / NSS / SIEM). Distinct from traffic forwarding rules — the traffic rule controls data-plane routing; the log/control rule controls observability streams.

Not captured in depth; referenced here so an operator asking "why aren't my Cloud Connector logs reaching our SIEM" lands in the right place: Log and Control Forwarding Rules, not traffic forwarding rules.

## Common patterns

Source: `vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md`; `vendor/zscaler-help/cbc-about-traffic-forwarding.md`.

- **Exempt cloud metadata service**: `Rule 1 — destination 169.254.169.254, method Direct`. Prevents metadata-service calls from hitting ZIA (which would either block or add latency).
- **Route cloud provider storage direct**: `Rule N — Application Service Group = Amazon Web Services (or Azure, GCP), method Direct`. VPC-endpoint-friendly.
- **Force workload-to-internal-app via ZPA**: `Rule 5 — destination = internal-CIDR, method ZPA`. Workloads reaching the internal app go through ZPA's zero-trust tunnel.
- **Block crypto-mining destinations**: `Rule 10 — Custom Domain Group = mining-pools, method Drop`.
- **Default (pre-provisioned)**: `Rule 999 (terminal) — match all, method ZIA via default gateway`. Internet-bound traffic not exempted goes to ZIA.

## Edge cases

Source: `vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md`; `vendor/zscaler-help/cbc-about-traffic-forwarding.md`; `vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-amazon-web-services.md`.

- **Rule ordering mistakes**: placing a Direct exemption rule **below** a broad ZIA rule causes the ZIA rule to match first; the exemption never fires. Same footgun as ZIA URL Filter's first-match-wins.
- **Wildcard domain matching without DNS through Cloud Connector**: UDP and non-web traffic to wildcard destinations fails to match — Cloud Connector only sees the destination IP, not the hostname. Either route DNS through Cloud Connector, or use IP-based criteria instead of FQDN.
- **Application Service Groups updated by Zscaler**: Zscaler maintains the predefined service groups (Office365, Zoom, etc.). When Zscaler adds new endpoints to Office365's IP/domain list, your rule matching "Office365" automatically picks them up. Can be surprising if a new endpoint lands in a direction you didn't intend.
- **Forwarding Method change on existing rule**: changing from ZIA to Direct (or vice versa) mid-session likely terminates in-flight sessions. Plan rule changes during low-traffic windows for anything with long-lived connections.
- **Local forwarding + Branch Connector**: Branch Connector doesn't support the Local method. Rules built for Cloud Connector that use Local don't port to Branch deployments.
- **Drop rule false-positive**: dropping traffic shows as "connection refused" or timeout to the workload. Hard to diagnose from the workload side — the workload doesn't see "blocked by Zscaler," just network failure. Operators debugging workload-side should check Cloud Connector rule logs before blaming network/DNS.

## Open questions

- **`ENATDEDIP` and `GEOIP` forwarding methods** — both appear in the API `ForwardMethod` enum (`forwarding_rules.go:44`) with no console label or documented semantics in the captured material. `ENATDEDIP` reads as some form of dedicated-IP NAT and `GEOIP` as geo-based forwarding, but neither is confirmed by source. Filed with `PROXYCHAIN` and the true backend enum as [clarification `cloud-connector-09`](../_meta/clarifications.md#cloud-connector-09-forwarding-method-semantics-and-the-true-backend-forwardmethod-enum).
- **`PROXYCHAIN` end-to-end behavior** — the proxy-gateway action field and the method's TCP-only network-service constraint are sourced, but the full chaining topology (where the proxy gateway sits, auth, failover) is not in the captured material. See [clarification `cloud-connector-09`](../_meta/clarifications.md#cloud-connector-09-forwarding-method-semantics-and-the-true-backend-forwardmethod-enum).
- **Rule limits** — how many traffic forwarding rules can a tenant define? Not captured. (Note: wildcard-domain/FQDN entries are capped at 16K per organization and 8,000 per rule, `cbc-configuring-traffic-forwarding-rule.md:108` — but that is the FQDN-entry limit, not a rule-count limit.) Filed with the admin-rank question as [clarification `cloud-connector-10`](../_meta/clarifications.md#cloud-connector-10-forwarding-rule-count-limit-and-admin-rank-rule-order-interaction).
- **Admin Rank ↔ Rule Order interaction** — Cloud Connector forwarding rules carry an Admin Rank field (`forwarding_rules.go:41`), confirming the field exists, but whether rank *gates* the editable Rule Order values the way ZIA URL Filtering's admin-rank does is not stated in the captured source. See [clarification `cloud-connector-10`](../_meta/clarifications.md#cloud-connector-10-forwarding-rule-count-limit-and-admin-rank-rule-order-interaction).

## Cross-links

- Overview (HA, Cloud Connector Groups) — [`./overview.md`](./overview.md)
- API / Terraform surface — [`./api.md`](./api.md)
- ZIA URL Filter (adjacent first-match-wins rule pattern) — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZPA Application Segments (destination model for ZPA-forwarded traffic) — [`../zpa/app-segments.md`](../zpa/app-segments.md)
- ZCC forwarding profile (endpoint-side parallel) — [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md)

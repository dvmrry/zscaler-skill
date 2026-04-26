---
product: ztw
topic: "dns-subsystem"
title: "Cloud Connector DNS subsystems — Gateways, Policies, Log & Control Forwarding"
content-type: reasoning
last-verified: "2026-04-26"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/cbc-about-dns-gateways.md"
  - "vendor/zscaler-help/cbc-configuring-dns-gateway.md"
  - "vendor/zscaler-help/cbc-about-dns-policies.md"
  - "vendor/zscaler-help/cbc-about-log-and-control-forwarding.md"
  - "vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md"
author-status: draft
---

# Cloud Connector DNS subsystems — Gateways, Policies, Log & Control Forwarding

Cloud Connector's DNS handling is not one system. It is three distinct subsystems, each with its own admin surface, rule set, and gateway model:

| Subsystem | Admin location | Primary function |
|---|---|---|
| **DNS Gateways** | Administration > Gateways > DNS Gateway tab | Define upstream resolver pairs with failover behavior |
| **DNS Policies** | Forwarding > DNS Policies | Rule-based control over DNS requests and responses |
| **Log & Control Forwarding** | Forwarding > Log and Control Forwarding | Route telemetry, enrollment, policy-sync, and software-update traffic to Zscaler cloud |

The three interact in sequence: Gateway resolution provides the resolvers DNS Policy rules can redirect toward; both subsystems generate events that Log & Control Forwarding routes back to Zscaler. An operator who treats "DNS" as a single knob will miss failure modes that live at the seams between them.

## DNS Gateways

DNS Gateways redirect DNS queries received by Cloud Connector to specific upstream servers. Each gateway is a named object with a primary resolver, an optional secondary resolver, and a failure behavior.

### Resolver configuration

- **Primary DNS Server** — IPv4 only. Options: custom IP, LAN Primary DNS Server, or LAN Secondary DNS Server.
- **Secondary DNS Server** — same options as primary.
- IPv6 resolvers are not supported. (Tier A — documented limitation in the configuration UI.)
- Up to **255 DNS gateways** can be created.

For hardware devices in gateway mode, Zscaler pre-creates two non-editable gateways:

| Predefined gateway | Source |
|---|---|
| **LAN CTR** (LAN Customer Trusted Resolver) | DNS servers from the LAN section of the Branch Connector Configuration Template |
| **WAN CTR** | DNS servers from the WAN section (manual or DHCP-assigned) |

These predefined gateways are disabled by default. They apply only to hardware devices in gateway mode; they have no effect in Cloud Connector virtual-appliance deployments.

In gateway mode, if the template specifies a WAN override, WAN DNS resolvers take precedence. For non-gateway hardware devices, LAN DNS fields reference the primary and secondary DNS servers from the forwarding interface section of the template.

### Failure behavior

When the configured DNS server is unreachable, each gateway enforces one of two behaviors:

| Failure behavior | What happens |
|---|---|
| **Return error response** | CC returns SERVFAIL to the requesting client |
| **Forward to Original DNS Server** | DNS packet is sent to the original destination IP (the server the client was originally trying to reach) |

There is no documented automatic promotion of secondary to primary on failure — the failure behavior fires when the primary is unreachable, regardless of secondary configuration. Whether the secondary is tried before the failure behavior triggers is **Tier D** (not explicitly stated in available captures).

The SERVFAIL path is operationally safe but visible: clients get an explicit resolution failure. The "Forward to Original DNS Server" path preserves connectivity at the cost of bypassing whatever policy the DNS Gateway was meant to enforce — relevant when operators are using DNS Gateways to enforce Protective DNS compliance.

### Default gateway

A default DNS gateway exists and cannot be deleted. The configuration of that default is not described in captured sources — treat as Tier D until the Ranges & Limitations page or default-gateway documentation is captured.

## DNS Policies

DNS Policies define rule-based control over DNS requests and responses traversing Cloud Connector. The key architectural distinction: DNS Policies cover **all DNS traffic regardless of transport or encryption**, including UDP, TCP, and DNS-over-HTTPS (DoH). This is broader than ZIA's DNS Control, which only sees plaintext DNS port-53 traffic unless DoH flows are separately decrypted.

### Rule model

Rules are evaluated in **ascending numerical order** (Rule 1 before Rule 2); first match wins. The page ships with two predefined rules:

| Predefined rule | Default state | Notes |
|---|---|---|
| **Redirect Resolution of Zscaler Domains to WAN CTR** | Disabled | Matches the Zscaler Cloud Endpoints app service group; only applies to hardware gateway-mode devices; only certain fields editable |
| **Default Connector DNS Rule** | Enabled (allow all) | Catch-all; always lowest precedence; action is modifiable but rule cannot be deleted |

Because the default rule allows all traffic, new filtering rules must be placed above it in rule order to have effect.

### Criteria

The documentation references the following rule-match dimensions (exhaustive list not captured — Tier B for full attribute coverage):

- Users, groups, or departments
- Client locations
- Domain categorization / IP address categorization
- DNS record types
- Location of resolved IP addresses

### Actions

| Action | Effect |
|---|---|
| **Allow** | Permit the DNS transaction |
| **Block** | Deny the DNS transaction |
| **Resolved by ZPA** | Hand off resolution to Zscaler Private Access |
| **Redirect** (inferred from "redirecting requests to specific DNS servers") | Route the query to a specific DNS server (e.g., a DNS Gateway) |
| **Overwrite DNS response** | Rewrite the response returned to the client |

The full action-field enumeration is not captured in available sources — treat the redirect and overwrite entries above as Tier B (consistent with documented capabilities; exact UI field names unconfirmed).

### DoH handling

DNS Policies inspect DoH (DNS-over-HTTPS) traffic in addition to cleartext UDP/TCP DNS. This is a meaningful distinction: DoH is HTTPS-encapsulated, so a tool that only intercepts port-53 traffic would miss it entirely. CC's DNS Policy engine handles it at the application layer rather than requiring separate SSL inspection of the DoH flow.

The mechanism by which CC identifies and decrypts DoH is not described in captured sources. (Tier D — the capability is stated; the implementation is not.)

### DNS tunnel detection

DNS tunnel detection is listed as a DNS Policy capability. The sources state: *"Detect and prevent DNS-based attacks and data exfiltration through DNS tunnels."* Trigger criteria and response actions for tunnel detection are not enumerated in captured sources — Tier D for specifics.

### Response rewriting

DNS response rewriting (overwriting DNS responses) enables redirection at the DNS layer — pointing clients to a sinkhole, a different host, or a ZPA-brokered address — without requiring an upstream firewall or NAT rule. Common use cases:

- Sinkholing known-bad domains
- Steering internal service FQDNs to private IP addresses for workloads routing through CC
- ZPA split-DNS: sending private-app domain resolution to ZPA while leaving public DNS untouched

## Log & Control Forwarding

Log & Control Forwarding is not about end-user traffic logs in the conventional NSS/Cloud NSS sense. It controls how Cloud Connector's own operational messages reach Zscaler's cloud:

- **Enrollment** — CC registration with the Zscaler cloud tenant
- **Policy changes** — delivery of updated policy to the CC instance
- **Software updates** — CC software update traffic
- **Traffic logs** — CC-generated forwarding logs sent back to Zscaler

A default Log & Control Forwarding rule with a default gateway is created automatically and cannot be duplicated or deleted.

### Rule model

Rules are evaluated in ascending order. Each rule has:

| Field | Options / limits |
|---|---|
| Rule Order | Numeric; ascending |
| Rule Name | Up to 31 characters |
| Rule Status | Enabled / Disabled (disabled rules retain their order position) |
| Location | Any, or up to 8 specific locations |
| Cloud & Branch Connector Groups | Any, or specific groups |
| Gateway | A Log and Control Gateway (separate gateway type from DNS Gateways) |
| Description | Up to 10,240 characters |

### Relationship to Cloud NSS / standard log forwarding

Log & Control Forwarding is CC-side: it controls the channel through which CC sends its own operational logs upstream to the cloud. Cloud NSS (ZIA's Nanolog Streaming Service) is the separate ZIA-side system that exports user/session logs to SIEM destinations — configured in the ZIA Admin Console, not here. Operators expecting standard SIEM export via this surface will not find it; this is CC-to-cloud control-plane reachability.

## Interactions between the three subsystems

Flow: DNS query arrives at CC → DNS Policy rules evaluated (ascending order, DoH included) → matching rule's action selects or redirects to a DNS Gateway → Gateway resolves (or applies failure behavior) → response returned to client → events flow upstream via Log & Control Forwarding.

Key interaction points:

1. **Gateway selection is a DNS Policy action.** A redirect rule references a DNS Gateway object. The Gateway's failure behavior then applies if that resolver is unreachable. A misconfigured gateway can look like a DNS Policy problem — check both layers.

2. **DNS Policy outcomes are logged via Log & Control Forwarding.** A block or redirect with no visible cloud event usually means Log & Control Forwarding is broken, not that the policy rule didn't fire. Rule misfires and log gaps look identical from the cloud side.

3. **Log & Control Forwarding outage causes stale policy delivery.** CC may fail to receive updated DNS Policy rules or DNS Gateway definitions. A CC running stale policy most often has a Log & Control Forwarding problem, not a DNS problem.

## Common failure modes

**Documented (Tier A):**
- **SERVFAIL loop from wrong failure behavior** — DNS Gateway set to "Return error response" when the primary resolver is routinely unreachable (e.g., a private resolver not reachable from CC's network position). Clients see SERVFAIL instead of falling back to a public resolver. Correct either the resolver IP or switch failure behavior to "Forward to Original DNS Server."
- **Default DNS Policy rule at position 1** — the catch-all allow rule that ships at lowest precedence cannot be deleted but can be reordered. If it ends up above blocking rules, nothing is ever blocked. Verify rule order after any bulk import or reorder operation.
- **DNS Policy targeting DoH bypasses** — if a client is configured with a hardcoded DoH resolver (e.g., `dns.google` over HTTPS port 443), and CC's DNS Policy only gates port-53, the DoH queries bypass policy. CC's stated DoH coverage depends on the client's DNS traffic actually transiting CC; split-tunneling or direct-internet DoH traffic is out of scope.
- **Log & Control Forwarding gateway unreachable** — CC enrollment and policy sync fail silently from an operator perspective in the cloud console. The CC may appear registered but run stale policy. Check the Log and Control Gateway's connectivity separately from workload-path testing.

**Inferred (Tier D — verify against your deployment):**
- **Secondary resolver never tried before SERVFAIL fires** — if failure behavior fires on primary-unreachable without attempting secondary, deployments that rely on secondary as a hot standby will see client-visible failures rather than seamless failover. Test failover explicitly.
- **DNS Policy rule order drift after API writes** — rules written via API without explicit rule-order management can accumulate in unexpected positions. The default catch-all at "lowest precedence" may not mean position N; confirm after programmatic rule creation.
- **Stale DNS Gateway reference in DNS Policy after gateway deletion** — the 255-gateway cap is generous, but a deleted gateway referenced by a policy rule behavior is not documented as producing an error or automatic fallback. Policy rules that reference a removed gateway may fail open or silently misroute.
- **Log & Control Forwarding scope gap** — if groups or locations are not covered by any Log & Control Forwarding rule (because rules are scoped too narrowly), those CC instances use the default rule. If the default rule's gateway is the wrong path for a given network segment, log delivery silently degrades.

## Source-citation gaps (Tier D — future capture targets)

- **DNS Policy rule criteria full list** — the about-dns-policies capture names criteria categories but does not enumerate every available field. The "Configuring the DNS Filtering Rule" help page was not captured in this pass.
- **DNS tunnel detection specifics** — trigger heuristics, threshold tuning, and response actions are not in available captures.
- **DoH interception mechanism** — how CC identifies and handles DoH at the app layer is not documented in captures.
- **Secondary resolver failover sequence** — whether secondary is tried before failure behavior, and under what conditions, is not stated.
- **Default DNS gateway configuration** — what the default gateway resolves to (and whether it is operator-modifiable) is not in captures.
- **Log & Control Gateway configuration** — the gateway object referenced by Log & Control Forwarding rules is a distinct type from DNS Gateways; its configuration surface was not captured in this pass.
- **DNS Policy action field enumeration** — exact UI labels for redirect and overwrite actions were not captured; entries above are inferred from capability descriptions.

## Cross-links

- Cloud Connector architecture: [`./overview.md`](./overview.md)
- Forwarding rules and methods: [`./forwarding.md`](./forwarding.md)
- Azure deployment (NIC model, HA, VMSS): [`./azure-deployment.md`](./azure-deployment.md)
- AWS deployment: `./aws-deployment.md` (in flight)
- ZIA DNS Control (distinct from CC DNS Policies): [`../zia/firewall.md § DNS Control`](../zia/firewall.md)

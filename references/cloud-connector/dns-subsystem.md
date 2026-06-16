---
product: ztw
topic: "dns-subsystem"
title: "Cloud Connector DNS subsystems — Gateways, Policies, Log & Control Forwarding"
content-type: reasoning
last-verified: "2026-06-15"
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/cbc-about-dns-gateways.md"
  - "vendor/zscaler-help/cbc-configuring-dns-gateway.md"
  - "vendor/zscaler-help/cbc-about-dns-policies.md"
  - "vendor/zscaler-help/cbc-about-log-and-control-forwarding.md"
  - "vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/dns_gateway/dns_gateway.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/traffic_dns_rules/traffic_dns_rules.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/traffic_log_rules/traffic_log_rules.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/forwarding_gateways/dns_forwarding_gateway/dns_forwarding_gateway.go"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_dns_gateway.go"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_dns_rule.go"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_dns_forwarding_gateway.go"
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

- **Primary DNS Server** — the help-page drop-down (`vendor/zscaler-help/cbc-configuring-dns-gateway.md:31-35`) lists three choices: a Custom DNS Server (a user-entered IP), the LAN Primary DNS Server, or the LAN Secondary DNS Server. The SDK-backed enum behind this field (`ecDnsGatewayOptionsPrimary`) is broader: it accepts `LAN_PRI_DNS_AS_PRI`, `LAN_SEC_DNS_AS_SEC`, `WAN_PRI_DNS_AS_PRI`, and `WAN_SEC_DNS_AS_SEC` (`vendor/terraform-provider-ztc/ztc/resource_ztc_dns_gateway.go:71-76`) — the two `WAN_*` values are not surfaced in the captured help drop-down (they map to the WAN-CTR predefined gateway). See the enum table under *SDK / Terraform surface* for the full set.
- **Secondary DNS Server** — same drop-down choices and same enum (`ecDnsGatewayOptionsSecondary`, `vendor/terraform-provider-ztc/ztc/resource_ztc_dns_gateway.go:78-87`).
- For a **Custom DNS Server** entry, "Zscaler only supports IPv4 addresses" (`vendor/zscaler-help/cbc-configuring-dns-gateway.md:32,40`). Whether the LAN/WAN-referenced resolvers can themselves be IPv6 is not stated in captures — treat a blanket "no IPv6 anywhere on the gateway" as unconfirmed (see Open questions).
- Up to **255 DNS gateways** can be created (`vendor/zscaler-help/cbc-configuring-dns-gateway.md:56`).

For hardware devices in gateway mode, Zscaler pre-creates two non-editable gateways:

| Predefined gateway | Source |
|---|---|
| **LAN CTR** (LAN Customer Trusted Resolver) | DNS servers from the LAN section of the Branch Connector Configuration Template |
| **WAN CTR** | DNS servers from the WAN section (manual or DHCP-assigned) |

These predefined gateways are disabled by default. They apply only to hardware devices in gateway mode; they have no effect in Cloud Connector virtual-appliance deployments.

In gateway mode, if the template specifies a WAN override, WAN DNS resolvers take precedence. For non-gateway hardware devices, LAN DNS fields reference the primary and secondary DNS servers from the forwarding interface section of the template.

The LAN-vs-WAN-as-primary-vs-secondary selection is not free text — it is an enum on the gateway object. The `ecDnsGatewayOptionsPrimary` and `ecDnsGatewayOptionsSecondary` fields each accept exactly `LAN_PRI_DNS_AS_PRI`, `LAN_SEC_DNS_AS_SEC`, `WAN_PRI_DNS_AS_PRI`, or `WAN_SEC_DNS_AS_SEC` (`vendor/terraform-provider-ztc/ztc/resource_ztc_dns_gateway.go:71-87`; serialized as `ecDnsGatewayOptionsPrimary`/`ecDnsGatewayOptionsSecondary` in `vendor/zscaler-sdk-go/zscaler/ztw/services/dns_gateway/dns_gateway.go:23-24`). These enum values are what bind the predefined LAN/WAN CTR gateways to the corresponding template-derived resolver slots.

The gateway object also carries a `dnsGatewayType`. For the Edge Connector (Cloud/Branch Connector) DNS gateway, the only accepted value is `EC_DNS_GW` (`vendor/terraform-provider-ztc/ztc/resource_ztc_dns_gateway.go:63-65`; serialized as `dnsGatewayType` in `vendor/zscaler-sdk-go/zscaler/ztw/services/dns_gateway/dns_gateway.go:22`).

### Failure behavior

When the configured DNS server is unreachable, each gateway enforces one of two behaviors. These are the only two values the `failureBehavior` field accepts (SDK-backed):

| Failure behavior (UI) | Enum value | What happens |
|---|---|---|
| **Return error response** | `FAIL_RET_ERR` | CC returns SERVFAIL to the requesting client |
| **Forward to Original DNS Server** | `FAIL_ALLOW_IGNORE_DNAT` | DNS packet is sent to the original destination IP (the server the client was originally trying to reach), ignoring the gateway's DNAT |

The enum is validated in `vendor/terraform-provider-ztc/ztc/resource_ztc_dns_gateway.go:93-96` and serialized as `failureBehavior` on the gateway object (`vendor/zscaler-sdk-go/zscaler/ztw/services/dns_gateway/dns_gateway.go:25`).

There is no documented automatic promotion of secondary to primary on failure — the failure behavior fires when the primary is unreachable, regardless of secondary configuration. Whether the secondary is tried before the failure behavior triggers is not exposed in the SDK/TF surface and remains an **open question**.

The SERVFAIL path is operationally safe but visible: clients get an explicit resolution failure. The "Forward to Original DNS Server" path preserves connectivity at the cost of bypassing whatever policy the DNS Gateway was meant to enforce — relevant when operators are using DNS Gateways to enforce Protective DNS compliance.

### Default gateway

A default DNS gateway exists and cannot be deleted. The configuration of that default is not described in captured sources — treat as Tier D until the Ranges & Limitations page or default-gateway documentation is captured.

## DNS Policies

DNS Policies define rule-based control over DNS requests and responses traversing Cloud Connector. The key architectural distinction: DNS Policies cover **all DNS traffic regardless of transport or encryption**, including UDP, TCP, and DNS-over-HTTPS (DoH). This is broader than ZIA's DNS Control, which only sees plaintext DNS port-53 traffic unless DoH flows are separately decrypted.

### Rule model

Rules are evaluated in **ascending numerical order** (Rule 1 before Rule 2); first match wins. The captured help page (`vendor/zscaler-help/cbc-about-dns-policies.md:40-42`) names two predefined rules; the Terraform provider's `validatePredefinedDNSRules` function names a third (`ZPA Resolver`), though that guard is currently commented out of the delete path (see the `ZPA Resolver` row):

| Predefined rule | Default state | Notes |
|---|---|---|
| **Redirect Resolution of Zscaler Domains to WAN CTR** | Disabled | Matches the Zscaler Cloud Endpoints app service group; only applies to hardware devices in gateway mode, and "appears based on the licenses enabled in your tenant"; only certain fields editable (Rule Order, Rule Status, Location/Sublocation, Cloud & Branch Connector Groups) (`vendor/zscaler-help/cbc-about-dns-policies.md:40-41`) |
| **ZPA Resolver** | Not stated in captures | Named only in the TF provider's `validatePredefinedDNSRules` function, which is written to reject deleting a rule named `ZPA Resolver` or `Redirect Resolution of Zscaler Domains to WAN CTR` (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_dns_rule.go:135-139`). Note that this guard is currently inactive — the call to it in the delete function is commented out (`resource_ztc_traffic_forwarding_dns_rule.go:378-387`), so the present provider does not actually block the deletion. The function records the *intent* to treat these as predefined. The help capture does not describe `ZPA Resolver`; its default state, criteria, and appearance conditions are an open question. |
| **Default Connector DNS Rule** | Enabled (allow all) | Catch-all; always lowest precedence; action is modifiable but rule cannot be deleted (`vendor/zscaler-help/cbc-about-dns-policies.md:26,42`) |

Because the default rule allows all traffic, new filtering rules must be placed above it in rule order to have effect.

### Criteria

The help documentation names these rule-match dimensions (UI-facing labels):

- Users, groups, or departments
- Client locations
- Domain categorization / IP address categorization
- DNS record types
- Location of resolved IP addresses

The SDK rule model (`ECDNSRules`, `vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/traffic_dns_rules/traffic_dns_rules.go:20-85`) and the Terraform resource confirm the following match attributes that a DNS rule actually carries on the wire:

| Attribute | SDK field (JSON) | Notes |
|---|---|---|
| Source IPs | `srcIps` (`traffic_dns_rules.go:51`) | User-defined source IP addresses |
| Destination addresses | `destAddresses` (`traffic_dns_rules.go:55`) | IPs/FQDNs; CIDR allowed for IPs |
| Locations | `locations` (`traffic_dns_rules.go:58`) | Max 8 (`resource_ztc_traffic_forwarding_dns_rule.go:124`) |
| Location groups | `locationGroups` (`traffic_dns_rules.go:61`) | Max 32 (`resource_ztc_traffic_forwarding_dns_rule.go:125`) |
| Cloud/Branch Connector groups | `ecGroups` (`traffic_dns_rules.go:64`) | Max 32 (`resource_ztc_traffic_forwarding_dns_rule.go:126`) |
| Source IP groups | `srcIpGroups` (`traffic_dns_rules.go:68`) | |
| Destination IP groups | `destIpGroups` (`traffic_dns_rules.go:72`) | Not supported when action is `REDIR_ZPA` (`vendor/terraform-provider-ztc/docs/resources/ztc_traffic_forwarding_dns_rule.md:171`) |

Note the SDK attributes (IP/group-based) and the UI labels (users/groups/departments, categorization, record types, resolved-IP location) do not map one-to-one. The categorization, DNS-record-type, and user/department dimensions named in the help UI are **not** present as fields on the `ECDNSRules` object in the captured SDK; treat those as UI-only until a richer rule schema is captured (see Open questions).

### Actions

The DNS rule `action` field is an enum with exactly four values (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_dns_rule.go:105-110`; serialized as `action` in `vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/traffic_dns_rules/traffic_dns_rules.go:34`):

| Action (enum) | Effect | Bound object |
|---|---|---|
| `ALLOW` | Permit the DNS transaction | — |
| `BLOCK` | Deny the DNS transaction | — |
| `REDIR_REQ` | Redirect the request to a specific DNS Gateway | `dnsGateway` (`traffic_dns_rules.go:75`); applicable only when action is `REDIR_REQ` (`vendor/terraform-provider-ztc/docs/resources/ztc_traffic_forwarding_dns_rule.md:175`) |
| `REDIR_ZPA` | Hand off resolution to Zscaler Private Access | `zpaIpGroup` (`traffic_dns_rules.go:78`); applicable only when action is `REDIR_ZPA` (`resource_ztc_traffic_forwarding_dns_rule.go:130`) |

The UI's "Resolved by ZPA" maps to `REDIR_ZPA` (the rule binds a `zpaIpGroup`), and the UI "Redirect to a specific DNS server" maps to `REDIR_REQ` (the rule binds a `dnsGateway`). These are the redirect/handoff entries previously inferred — now SDK-confirmed.

**Correction:** there is no `OVERWRITE` (or equivalent) value in the DNS rule action enum. The previously listed "Overwrite DNS response" action does not exist as a DNS *rule* action in the captured SDK/TF surface (no `overwrite` token appears anywhere in the ZTW SDK or Terraform provider). DNS response rewriting, if it exists as a capability, is not a `traffic_dns_rules` action — see Open questions and the "Response rewriting" note below, which is now scoped to capability-description level only.

### DoH handling

DNS Policies inspect DoH (DNS-over-HTTPS) traffic in addition to cleartext UDP/TCP DNS. This is a meaningful distinction: DoH is HTTPS-encapsulated, so a tool that only intercepts port-53 traffic would miss it entirely. CC's DNS Policy engine handles it at the application layer rather than requiring separate SSL inspection of the DoH flow.

The mechanism by which CC identifies and decrypts DoH is not described in captured sources. (Tier D — the capability is stated; the implementation is not.)

### DNS tunnel detection

DNS tunnel detection is listed as a DNS Policy capability. The sources state: *"Detect and prevent DNS-based attacks and data exfiltration through DNS tunnels."* Trigger criteria and response actions for tunnel detection are not enumerated in captured sources — Tier D for specifics.

### Response rewriting

> **Scope note:** "Overwrite DNS response" is described in help-page capability text but is **not** a value in the DNS rule `action` enum (which is `ALLOW`/`BLOCK`/`REDIR_REQ`/`REDIR_ZPA` only — see Actions above). The redirection patterns below are achievable through `REDIR_REQ` (to a DNS Gateway) and `REDIR_ZPA` (to a ZPA IP group); a distinct "rewrite the A/AAAA answer in place" action is not present in the captured SDK/TF surface. Where it lives — if it is a separate feature rather than a marketing description of REDIR behavior — is an open question.

DNS-layer redirection enables steering clients toward a sinkhole, a different host, or a ZPA-brokered address — without requiring an upstream firewall or NAT rule. Common use cases:

- Sinkholing known-bad domains (via `BLOCK`, or redirect to a controlled resolver)
- Steering internal service FQDNs to private IP addresses for workloads routing through CC
- ZPA split-DNS: sending private-app domain resolution to ZPA (`REDIR_ZPA`) while leaving public DNS untouched

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
| Gateway | A Log and Control Gateway (see note below) |
| Description | Up to 10,240 characters |

The SDK backs this rule as `ECTrafficLogRules` at endpoint `/ztw/api/v1/ecRules/self` (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/traffic_log_rules/traffic_log_rules.go:15,18-60`). Unlike DNS Policy rules, a log rule has no `action` field — it carries a `forwardMethod` (`traffic_log_rules.go:42`) and a `proxyGateway` reference (`traffic_log_rules.go:50`) instead, with `locations` and `ecGroups` as its scope fields. The character limits in the table above (name ≤ 31, description ≤ 10,240) are from the help-page UI and not enforced in the captured SDK struct (the fields are plain strings) — treat the exact limits as doc-tier.

On the "separate gateway type" point: the Log & Control gateway is **not** a distinct API path. It is served by the same `/ztw/api/v1/dnsGateways` endpoint as a DNS Gateway, discriminated by the `type` field, whose documented values are `ZIA` and `ECSELF` (the latter being the Log and Control gateway) — see `vendor/zscaler-sdk-go/zscaler/ztw/services/forwarding_gateways/dns_forwarding_gateway/dns_forwarding_gateway.go:16,26-27`. So "separate gateway type" is accurate at the object level (a different `type` value) but not at the API-path level (same endpoint).

### Relationship to Cloud NSS / standard log forwarding

Log & Control Forwarding is CC-side: it controls the channel through which CC sends its own operational logs upstream to the cloud. Cloud NSS (ZIA's Nanolog Streaming Service) is the separate ZIA-side system that exports user/session logs to SIEM destinations — configured in the ZIA Admin Console, not here. Operators expecting standard SIEM export via this surface will not find it; this is CC-to-cloud control-plane reachability.

## SDK / Terraform surface

The three subsystems are all reachable through the ZTW (Cloud/Branch Connector) API, the `zscaler-sdk-go` `ztw` service packages, and the `terraform-provider-ztc`. This is the machine-facing contract behind the admin-console surfaces described above.

| Subsystem | API endpoint | Go SDK package | Terraform resource |
|---|---|---|---|
| DNS Gateway | `/ztw/api/v1/dnsGateways` (`dns_gateway.go:15`) | `ztw/services/dns_gateway` | `ztc_dns_gateway` (`resource_ztc_dns_gateway.go`) |
| DNS Policy rule | `/ztw/api/v1/ecRules/ecDns` (`traffic_dns_rules.go:17`) | `ztw/services/policy_management/traffic_dns_rules` | `ztc_traffic_forwarding_dns_rule` (`resource_ztc_traffic_forwarding_dns_rule.go`) |
| Log & Control Forwarding rule | `/ztw/api/v1/ecRules/self` (`traffic_log_rules.go:15`) | `ztw/services/policy_management/traffic_log_rules` | `ztc_traffic_forwarding_log_rule` (`provider.go:114`) |
| Log & Control gateway | `/ztw/api/v1/dnsGateways` (same path, `type=ECSELF`) (`dns_forwarding_gateway.go:16,26-27`) | `ztw/services/forwarding_gateways/dns_forwarding_gateway` | `ztc_dns_forwarding_gateway` (`resource_ztc_dns_forwarding_gateway.go`) |

Enum-backed fields worth pinning (all values exact, from the cited validators/struct tags):

- **DNS Gateway `failureBehavior`** — `FAIL_RET_ERR` | `FAIL_ALLOW_IGNORE_DNAT` (`resource_ztc_dns_gateway.go:93-96`).
- **DNS Gateway `dnsGatewayType`** — `EC_DNS_GW` (`resource_ztc_dns_gateway.go:63-65`).
- **DNS Gateway `ecDnsGatewayOptionsPrimary` / `ecDnsGatewayOptionsSecondary`** — `LAN_PRI_DNS_AS_PRI` | `LAN_SEC_DNS_AS_SEC` | `WAN_PRI_DNS_AS_PRI` | `WAN_SEC_DNS_AS_SEC` (`resource_ztc_dns_gateway.go:71-87`).
- **DNS Policy rule `action`** — `ALLOW` | `BLOCK` | `REDIR_REQ` | `REDIR_ZPA` (`resource_ztc_traffic_forwarding_dns_rule.go:105-110`). `REDIR_REQ` binds a `dnsGateway`; `REDIR_ZPA` binds a `zpaIpGroup`.
- **DNS Policy rule `state`** — `ENABLED` | `DISABLED` (`resource_ztc_traffic_forwarding_dns_rule.go:96-99`).

Note both the DNS Gateway service and the Log & Control gateway service (`dns_forwarding_gateway`) hit the same `/ztw/api/v1/dnsGateways` path; they are differentiated by the gateway object's `type` field, not by a separate endpoint.

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
- **DNS Policy rule order drift after API writes** — rules written via API without explicit rule-order management can accumulate in unexpected positions. The default catch-all at "lowest precedence" may not mean position N; confirm after programmatic rule creation. This is concrete in the Terraform provider, which does not trust the API to place a rule: it reads all existing rules, creates at the current max order, then runs a reorder pass to move the rule to its intended order/rank (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_dns_rule.go:151-228`). A raw API caller that skips this reorder step inherits whatever order the create returned.
- **Stale DNS Gateway reference in DNS Policy after gateway deletion** — the 255-gateway cap is generous, but a deleted gateway referenced by a policy rule behavior is not documented as producing an error or automatic fallback. Policy rules that reference a removed gateway may fail open or silently misroute.
- **Log & Control Forwarding scope gap** — if groups or locations are not covered by any Log & Control Forwarding rule (because rules are scoped too narrowly), those CC instances use the default rule. If the default rule's gateway is the wrong path for a given network segment, log delivery silently degrades.

## Open questions

Items below are not resolvable from the captured SDK/API/Terraform/help sources. The DNS rule **action enum** and the Log & Control **gateway type/config** that were formerly listed here are now resolved (see "## SDK / Terraform surface") and have been removed.

- **"Overwrite DNS response" — does a response-rewrite action exist at all?** It is named in help-page capability text but absent from the DNS rule `action` enum (`ALLOW`/`BLOCK`/`REDIR_REQ`/`REDIR_ZPA`) and from every `*ztw*` SDK/TF source. Open question: is it a separate feature with its own object/endpoint, a different rule type, or just marketing wording for `REDIR_*`? No source found. See [clarification `cloud-connector-11`](../_meta/clarifications.md#cloud-connector-11-overwrite-dns-response-does-a-response-rewrite-action-exist-at-all).
- **UI criteria not present in the SDK rule struct** — the help UI names "users/groups/departments," "domain categorization / IP categorization," "DNS record types," and "location of resolved IP addresses" as match dimensions, but the captured `ECDNSRules` struct exposes only IP/group/location/ecGroup fields. Whether these UI criteria map to fields on a richer (uncaptured) schema, or are ZIA-DNS-Control concepts mislabeled in shared help text, is unresolved. Filed with tunnel detection and DoH as [clarification `cloud-connector-12`](../_meta/clarifications.md#cloud-connector-12-dns-rule-ui-match-criteria-tunnel-detection-and-doh-interception-not-in-the-sdk).
- **DNS tunnel detection specifics** — trigger heuristics, threshold tuning, and response actions are not in available captures, and no SDK field models them. See [clarification `cloud-connector-12`](../_meta/clarifications.md#cloud-connector-12-dns-rule-ui-match-criteria-tunnel-detection-and-doh-interception-not-in-the-sdk).
- **DoH interception mechanism** — how CC identifies and handles DoH at the app layer is not documented in captures and is not exposed in the SDK. See [clarification `cloud-connector-12`](../_meta/clarifications.md#cloud-connector-12-dns-rule-ui-match-criteria-tunnel-detection-and-doh-interception-not-in-the-sdk).
- **Secondary resolver failover sequence** — whether the secondary resolver is tried before `failureBehavior` fires (and under what conditions) is not exposed in the gateway object; the SDK carries `primaryIp`/`secondaryIp`/`failureBehavior` but no field describing the try-order. Filed with default-gateway, IPv6-resolver, and `ZPA Resolver` questions as [clarification `cloud-connector-13`](../_meta/clarifications.md#cloud-connector-13-dns-gateway-failover-order-default-gateway-config-and-ipv6-on-referenced-resolvers).
- **Default DNS gateway configuration** — what the default (non-deletable) gateway resolves to, and whether it is operator-modifiable, is not in captures; the SDK has no "isDefault" discriminator on the gateway object. See [clarification `cloud-connector-13`](../_meta/clarifications.md#cloud-connector-13-dns-gateway-failover-order-default-gateway-config-and-ipv6-on-referenced-resolvers).
- **`ZPA Resolver` predefined DNS rule** — the TF provider's `validatePredefinedDNSRules` function (`resource_ztc_traffic_forwarding_dns_rule.go:135-139`) is written to treat `ZPA Resolver` as a predefined, non-deletable rule, but the call to that function in the delete path is commented out (`resource_ztc_traffic_forwarding_dns_rule.go:378-387`), so the guard does not actually fire in the current provider. No captured help page or SDK comment describes the rule: its default state, match criteria, action (presumably `REDIR_ZPA`), and whether it is license- or mode-gated like the WAN-CTR rule are unconfirmed. See [clarification `cloud-connector-13`](../_meta/clarifications.md#cloud-connector-13-dns-gateway-failover-order-default-gateway-config-and-ipv6-on-referenced-resolvers).
- **IPv6 on LAN/WAN-referenced resolvers** — the "IPv4 only" statement in the help capture is scoped to the **Custom DNS Server** entry (`cbc-configuring-dns-gateway.md:32,40`). Whether a LAN- or WAN-referenced resolver slot can carry an IPv6 address is not addressed in captures, and the gateway struct's `primaryIp`/`secondaryIp` are plain strings with no documented address-family constraint. See [clarification `cloud-connector-13`](../_meta/clarifications.md#cloud-connector-13-dns-gateway-failover-order-default-gateway-config-and-ipv6-on-referenced-resolvers).
- **Character limits on Log & Control rule fields** — the help-page limits (name ≤ 31, description ≤ 10,240) are not enforced in the captured `ECTrafficLogRules` struct (plain string fields); treat as doc-tier until confirmed by the API's validation behavior. See [clarification `cloud-connector-24`](../_meta/clarifications.md#cloud-connector-24-field-character-limit-enforcement-on-dns-and-log-and-control-rules).

## Cross-links

- Cloud Connector architecture: [`./overview.md`](./overview.md)
- Forwarding rules and methods: [`./forwarding.md`](./forwarding.md)
- Azure deployment (NIC model, HA, VMSS): [`./azure-deployment.md`](./azure-deployment.md)
- AWS deployment: `./aws-deployment.md` (in flight)
- ZIA DNS Control (distinct from CC DNS Policies): [`../zia/firewall.md § DNS Control`](../zia/firewall.md)

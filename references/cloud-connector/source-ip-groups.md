---
product: cloud-connector
topic: cc-source-ip-groups
title: "Cloud Connector Source IP Groups — primitives and policy use"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/cbc-about-source-ip-groups.md"
  - "vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md"
  - "vendor/terraform-provider-ztc/docs/resources/ztc_ip_source_groups.md"
  - "vendor/terraform-provider-ztc/docs/data-sources/ztc_ip_source_groups.md"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_ip_source_groups.go"
  - "vendor/terraform-provider-ztc/examples/ztc_traffic_forwarding_rule/basic_forward_method_zia.tf"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/policyresources/ipsourcegroups/ipsourcegroups.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go"
author-status: draft
---

# Cloud Connector Source IP Groups — primitives and policy use

Source IP Groups (also rendered as "IP Source Groups" in API/provider naming) are named,
reusable sets of IP addresses that identify workload sources in Cloud Connector forwarding
and DNS policy rules. They are the source-side counterpart to IP Destination Groups and are
distinct from IP Pool Groups (which are used as ZPA redirect targets in DNS rules).

## Overview

Source IP Groups let operators:

- Apply a single forwarding or DNS rule to an arbitrary set of workload IPs without
  enumerating those IPs in every rule.
- Add or remove workloads from a group without creating or modifying policy rules —
  the rule references the group object; membership changes take effect on activation.

They are one of three IP grouping primitives in the Cloud & Branch Connector portal:

| Primitive | Purpose | Rule field |
|---|---|---|
| **Source IP Groups** | Identify traffic originators (workload source IPs) | `src_ip_groups` / `srcIpGroups` |
| **IP Destination Groups** | Identify traffic destinations (CIDR, FQDN, domain, country) | `dest_ip_groups` / `destIpGroups` |
| **IP Pool Groups** | NAT pool for ZPA DNS redirect (`REDIR_ZPA` DNS action only) | `zpa_ip_group` / `zpaIpGroup` |

Cross-links:
- Traffic forwarding rule mechanics: [`./forwarding.md`](./forwarding.md)
- Full provider resource catalog: [`./terraform.md`](./terraform.md)

---

## Object model

### Fields

| Field | Type | Required | Constraints |
|---|---|---|---|
| `id` | Integer | Computed | API-assigned; `int` (ZTW convention) |
| `name` | String | Yes | Max 255 characters (from TF schema `ValidateFunc`) |
| `description` | String | No | Max 10 240 characters |
| `ip_addresses` | List of String | Yes | Each entry: individual IP, CIDR subnet, or hyphen-range |
| `creator_context` | String | Computed | Read-only; `"EC"` for groups created in Cloud & Branch Connector portal; `"ZIA"` for ZIA-origin groups surfaced to CBC |
| `is_non_editable` | Boolean | Computed | `true` for Zscaler-predefined groups; editable groups are `false` |

### Accepted address syntax

From the portal docs and SDK comment context, each entry in `ip_addresses` accepts:

- **Individual host IP**: `192.0.2.1`
- **CIDR subnet**: `192.0.2.0/24`
- **Hyphen range**: `192.0.2.1-192.0.2.5`

These three formats align with the inline `src_ips` (ad-hoc source IPs) field in forwarding
rules. The key difference is that Source IP Group entries are stored as a named object and
referenced by ID, whereas `src_ips` in a rule is a literal list embedded in the rule payload.

### Naming constraints

- Max name length: 255 characters.
- Names are matched case-insensitively by the SDK `GetByName` function
  (`strings.EqualFold`). Two groups with names that differ only in case are distinguishable
  by ID but will collide on `GetByName` lookups — avoid.

### Counts and limits

No explicit per-group member limit or per-tenant group count limit is documented in available
sources. A per-rule limit on how many groups can be referenced is also not documented.

### Non-editable (predefined) groups

Groups with `is_non_editable = true` are Zscaler-provisioned and cannot be modified. They
appear in list responses and can be referenced by forwarding rules but cannot be updated or
deleted. Attempting to do so returns an API error.

### Creator context

`creator_context` is `"EC"` for groups native to the Cloud & Branch Connector portal. ZIA
also has an `ipsourcegroups` service under `zia/services/firewallpolicies/`; groups created
there may surface in CBC with `creator_context = "ZIA"`. The TF provider example
`basic_forward_method_zia.tf` references a `zia_ip_source_groups` data source to pull a
ZIA-managed group into a ZTC forwarding rule — demonstrating that cross-portal group
referencing is possible but requires using the ZIA provider's data source to resolve the ID.

---

## Policy interaction

### Rule types that accept Source IP Groups as a criterion

| Rule type | TF resource | API endpoint | `src_ip_groups` field |
|---|---|---|---|
| Traffic forwarding rule | `ztc_traffic_forwarding_rule` | `/ztw/api/v1/ecRules/ecRdr` | `src_ip_groups` block (ZTW: `SrcIpGroups []IDNameExtensions`) |
| DNS forwarding rule | `ztc_traffic_forwarding_dns_rule` | `/ztw/api/v1/ecRules/ecDns` | `src_ip_groups` block (ZTW: `SrcIpGroups []IDNameExtensions`) |
| Log and control forwarding rule | `ztc_traffic_forwarding_log_rule` | `/ztw/api/v1/ecRules/self` | Not present — log/control rules do not expose `src_ip_groups` |

Source IP Groups are **not** a criterion in log and control forwarding rules. Log rules scope
by location and CC group only.

### How matching works

When a Source IP Group is specified in a rule's criteria, the packet's source IP is checked
against every entry in every referenced group (OR logic within and across groups). If any
entry matches, the source criterion is satisfied. All criteria in a rule are ANDed together —
source IP group match AND destination match AND network service match, etc.

If `src_ip_groups` is not set on a rule, the rule applies to all source IPs (unrestricted).

Multiple Source IP Groups can be referenced in one rule. A packet need only match one group.

The `source_ip_group_exclusion` boolean on the forwarding rule struct inverts matching: when
`true`, the rule applies to traffic whose source does **not** match the listed groups. The
SDK struct comment notes this field is "Not applicable to Cloud & Branch Connector" — treat
it as unavailable until confirmed otherwise.

### Inline vs. group source criteria

A forwarding rule exposes two parallel source-IP fields:

- `src_ips` / `srcIps` — literal list of IP addresses, subnets, or ranges embedded in the
  rule payload. No separate object; managed inline.
- `src_ip_groups` / `srcIpGroups` — references to Source IP Group objects by ID+name.

Both can coexist in a single rule. The rule matches if **either** the inline `src_ips` or
any referenced `src_ip_groups` entry matches the packet source. Using groups is preferred
for addresses shared across multiple rules because it avoids duplicating and maintaining
address lists in each rule.

### Precedence with other criteria

Rules evaluate top-down by `order` (ascending integer). Within a rule, criteria AND together.
Source IP Groups are one criterion; a rule does not fire unless all other criteria (location,
CC group, destination, network service, etc.) also match.

Source IP Groups have no inherent precedence over `src_ips` or `src_workload_groups` within
the same rule — all source criteria are OR-aggregated before being ANDed with non-source
criteria.

### IPv6

The SDK forwarding rule struct includes a parallel `SrcIpv6Groups` field
(`json:"srcIpv6Groups"`). This is distinct from `SrcIpGroups` and is intended for
organizations with IPv6 enabled. The Cloud & Branch Connector portal doc for Source IP Groups
does not address IPv6 group objects; whether a separate IPv6 source group resource type
exists in the ZTC provider is not confirmed from available sources. The `ip_addresses` field
in `ztc_ip_source_groups` does not specify IPv4-only; this is an open question.

---

## Terraform and SDK surface

### Terraform resource: `ztc_ip_source_groups`

**Registry subcategory**: Policy Resources  
**API endpoint**: `POST /ztw/api/v1/ipSourceGroups`

```hcl
resource "ztc_ip_source_groups" "web_tier" {
  name        = "web-tier-sources"
  description = "Source IPs for the web application tier"
  ip_addresses = [
    "10.0.1.0/24",
    "10.0.2.10",
    "10.0.3.50-10.0.3.60",
  ]
}
```

**Full schema**:

| Argument | Type | Required | Notes |
|---|---|---|---|
| `name` | String | Required | Max 255 chars |
| `description` | String | Optional | Max 10 240 chars; multi-line normalized |
| `ip_addresses` | Set of String | Required | Individual IPs, CIDRs, or hyphen ranges |

**Computed attributes** (exported, read-only):

| Attribute | Type | Notes |
|---|---|---|
| `id` | String | Terraform resource ID (string form of integer) |
| `group_id` | Number | Numeric API ID — use this when referencing in rule blocks |
| `creator_context` | String | `"EC"` for groups managed by this provider |
| `is_non_editable` | Boolean | Always `false` for provider-managed groups |

**Import**:

```shell
# By numeric ID
terraform import ztc_ip_source_groups.web_tier 1234567

# By name
terraform import ztc_ip_source_groups.web_tier web-tier-sources
```

Import is also supported via [Zscaler-Terraformer](https://github.com/zscaler/zscaler-terraformer).

### Terraform data source: `ztc_ip_source_groups`

```hcl
data "ztc_ip_source_groups" "existing" {
  name = "web-tier-sources"
}

# or by ID:
data "ztc_ip_source_groups" "existing" {
  id = 1234567
}
```

Exported attributes match the resource schema. Use `data.ztc_ip_source_groups.<name>.id`
(the string Terraform resource ID) or `data.ztc_ip_source_groups.<name>.group_id` (the
integer) when composing rule references.

### Referencing in a forwarding rule

```hcl
resource "ztc_traffic_forwarding_rule" "web_to_zia" {
  name           = "web-tier-to-zia"
  order          = 10
  rank           = 7
  state          = "ENABLED"
  type           = "EC_RDR"
  forward_method = "ZIA"

  src_ip_groups {
    id = [ztc_ip_source_groups.web_tier.id]
  }

  proxy_gateway {
    id   = ztc_forwarding_gateway.primary.id
    name = ztc_forwarding_gateway.primary.name
  }
}
```

The `src_ip_groups` block takes a list of IDs — multiple groups can be supplied:

```hcl
  src_ip_groups {
    id = [
      ztc_ip_source_groups.web_tier.id,
      ztc_ip_source_groups.api_tier.id,
    ]
  }
```

### SDK: Go package `ipsourcegroups`

**Package path**: `github.com/zscaler/zscaler-sdk-go/v3/zscaler/ztw/services/policyresources/ipsourcegroups`

**Struct**:

```go
type IPSourceGroups struct {
    ID             int      `json:"id"`
    Name           string   `json:"name,omitempty"`
    Description    string   `json:"description,omitempty"`
    IPAddresses    []string `json:"ipAddresses,omitempty"`
    CreatorContext string   `json:"creatorContext,omitempty"`
    IsNonEditable  bool     `json:"isNonEditable,omitempty"`
}
```

**Note**: The JSON key for addresses is `"ipAddresses"` (camelCase). The TF schema field is
`ip_addresses`. These are consistent. The documentation error described in the Gotchas
section below is about the resource type name in the doc's example block, not the field name.

**CRUD functions** (all ZTW pattern — `Resource`-suffixed client methods):

```go
Get(ctx, service, ipGroupID int) (*IPSourceGroups, error)
GetByName(ctx, service, name string) (*IPSourceGroups, error)
Create(ctx, service, group *IPSourceGroups) (*IPSourceGroups, *http.Response, error)
Update(ctx, service, id int, group *IPSourceGroups) (*IPSourceGroups, *http.Response, error)
Delete(ctx, service, id int) (*http.Response, error)
GetAll(ctx, service) ([]IPSourceGroups, error)
GetAllLite(ctx, service) ([]IPSourceGroups, error)   // /ipSourceGroups/lite — lighter payload
```

`GetByName` uses `strings.EqualFold` — case-insensitive, exact match.

`GetAllLite` calls `/ztw/api/v1/ipSourceGroups/lite`, which returns a reduced payload (ID
and name only). Use it when you only need IDs for rule composition and want to avoid
transferring full address lists.

**ZTW activation**: changes to Source IP Groups (create, update, delete) are staged and do
not take effect until `ztc_activation_status` triggers activation. The SDK does not
auto-activate.

### Deletion behavior: rule detachment

The TF provider's delete handler (`resourceIPSourceGroupsGroupsDelete`) calls
`DetachRuleIDNameExtensions` before deleting the group. This function scans all forwarding
rules that reference the group via `SrcIpGroups` and removes the reference before the delete
call. Attempting to delete a group still referenced by rules via the raw API (without this
detachment step) will fail with a dependency error from the API.

---

## Known gotchas

### Bug: wrong resource type in the doc example

`vendor/terraform-provider-ztc/docs/resources/ztc_ip_source_groups.md` contains:

```hcl
resource "zia_ip_source_groups" "this" {  # WRONG: zia_ prefix
  name         = "example1"
  ...
}
```

The correct resource type is `ztc_ip_source_groups`. The `zia_ip_source_groups` resource
belongs to the ZIA Terraform provider and manages ZIA firewall policy source groups — a
separate resource in a separate product. Mixing them is not interchangeable.

### Cross-provider ZIA group reference (existing ZIA groups in ZTC rules)

The `basic_forward_method_zia.tf` example in the provider repo uses a **ZIA data source** to
reference an existing ZIA source group in a ZTC forwarding rule:

```hcl
data "zia_ip_source_groups" "this" {
  name = "example"
}

resource "ztc_traffic_forwarding_rule" "this1" {
  ...
  src_ip_groups {
    id = [data.zia_ip_source_groups.this.id]
  }
}
```

This works because ZIA source groups with `creator_context = "ZIA"` are visible in the CBC
portal. However, it requires the ZIA Terraform provider to be configured alongside the ZTC
provider. Groups created natively via `ztc_ip_source_groups` do not require this cross-provider
lookup.

### Inline `src_ips` vs `src_ip_groups` — no group semantics for inline IPs

Addresses in the rule's inline `src_ips` field are not shared objects — they are embedded
in the rule payload. If the same subnet needs to appear in 10 rules, inline `src_ips` means
10 separate copies; a Source IP Group is one object referenced 10 times. Membership changes
to a group propagate to all rules on next activation; inline lists require editing each rule.

### Range syntax vs CIDR precedence

Both `192.0.2.1-192.0.2.5` (hyphen range) and `192.0.2.0/24` (CIDR) are accepted in the
same group. The API does not prefer one form over the other for matching purposes — both
evaluate equivalently at the dataplane. However, overlapping entries (e.g., a /24 that
contains a specific host also listed as an individual IP) do not cause errors; they are
redundant, not contradictory.

### NAT and source IP visibility

Cloud Connector intercepts traffic from workloads in the VPC. The source IP presented to
the forwarding rule engine is the workload's **pre-NAT IP** as seen by the CC data plane.
If traffic has already been SNATed before reaching Cloud Connector (e.g., by a cloud-provider
NAT gateway upstream of the CC path), the source IP group matching will see the NAT pool
address, not the originating workload IP. Ensure routing topology sends traffic to CC before
any SNAT occurs for source-IP-based policy to work as expected.

### IPv6 source groups — parallel but separate

The forwarding rule struct exposes a distinct `SrcIpv6Groups` field alongside `SrcIpGroups`.
Whether the `ztc_ip_source_groups` resource supports IPv6 addresses in `ip_addresses` is not
confirmed. If IPv6 support is needed, verify via the API whether a separate group type is
required or whether the existing resource accepts IPv6 CIDR notation.

### Activation required

All changes are staged. Source IP Group creates, updates, and deletes — and any forwarding
rule updates that reference them — do not take effect until the ZTC configuration is
activated. The provider's `ztc_activation_status` resource handles this in-plan, or the
`ztc activator` CLI can be run out-of-band.

---

## Open questions register

1. **Per-group member limit**: No documented upper bound on entries per group. Confirm with
   Zscaler support whether there is a platform limit.

2. **Per-tenant group count limit**: Not documented in available sources.

3. **IPv6 address entries in `ztc_ip_source_groups`**: Whether the `ip_addresses` field
   accepts IPv6 CIDR notation is unconfirmed. The SDK `SrcIpv6Groups` field on the
   forwarding rule struct is distinct from `SrcIpGroups`; it's unclear if they reference
   the same group object type.

4. **`source_ip_group_exclusion` on forwarding rules**: The SDK struct comment says "Not
   applicable to Cloud & Branch Connector." The TF provider exposes it as a boolean field.
   Confirm whether the API accepts and enforces this flag for CC tenants.

5. **ZIA-origin groups (`creator_context = "ZIA"`) — editability from ZTC**: Whether groups
   created in ZIA can be modified via the ZTC provider/API (or only via ZIA) is not
   confirmed.

6. **`/ipSourceGroups/lite` payload shape**: Only confirmed to return id+name. Whether
   additional fields (e.g., `creator_context`) are included in the lite response is not
   documented in available sources.

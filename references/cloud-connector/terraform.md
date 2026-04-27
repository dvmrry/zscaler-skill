---
product: cloud-connector
topic: cc-terraform
title: Cloud Connector Terraform provider
content-type: reference
last-verified: 2026-04-26
confidence: medium
source-tier: code
sources:
  - vendor/terraform-provider-ztc/docs/index.md
  - vendor/terraform-provider-ztc/docs/resources/
  - vendor/terraform-provider-ztc/docs/data-sources/
  - vendor/terraform-provider-ztc/README.md
---

# Cloud Connector Terraform provider

## Provider overview

**Registry source**: `zscaler/ztc`  
**Current version** (from README badge / index.md examples): `~> 0.1.6`  
**Terraform minimum version**: 0.12.x

The provider is named ZTC (Zero Trust Cloud) in Zscaler naming. It manages the Cloud & Branch Connector portal: traffic forwarding rules, DNS gateways, provisioning URLs, location templates, partner (AWS/Azure/GCP) integrations, and network policy objects.

Every configuration change is staged. Changes do not take effect until activation is triggered, either via the `ztc_activation_status` resource or the out-of-band `ztc activator` CLI tool.

### Authentication

Two auth frameworks are supported, controlled by `use_legacy_client`.

#### OneAPI (recommended for new deployments)

Uses Zscaler OAuth 2.0 Client Credentials via ZIdentity. Not supported for `zscalergov` and `zscalerten` clouds.

```hcl
provider "ztc" {
  client_id     = var.zscaler_client_id
  client_secret = var.zscaler_client_secret
  vanity_domain = var.zscaler_vanity_domain
  zscaler_cloud = "zscloud"   # optional; required for non-production environments
}
```

| Argument | Env var | Notes |
|---|---|---|
| `client_id` | `ZSCALER_CLIENT_ID` | Required |
| `client_secret` | `ZSCALER_CLIENT_SECRET` | Conflicts with `private_key` |
| `private_key` | `ZSCALER_PRIVATE_KEY` | PKCS#1 or PKCS#8 unencrypted PEM; conflicts with `client_secret` |
| `vanity_domain` | `ZSCALER_VANITY_DOMAIN` | Tenant's vanity domain |
| `zscaler_cloud` | `ZSCALER_CLOUD` | Cloud instance name, e.g., `beta` |

#### Legacy API (backwards compatibility, v4.0.0+)

```hcl
provider "ztc" {
  username          = var.ztc_username
  password          = var.ztc_password
  api_key           = var.ztc_api_key
  ztc_cloud         = "zscaler"
  use_legacy_client = true
}
```

| Argument | Env var | Notes |
|---|---|---|
| `username` | `ZTC_USERNAME` | Admin email |
| `password` | `ZTC_PASSWORD` | Admin password |
| `api_key` | `ZTC_API_KEY` | Obfuscated API key; requires `Z_API` SKU |
| `ztc_cloud` | `ZTC_CLOUD` | One of: `zscaler`, `zscloud`, `zscalerone`, `zscalertwo`, `zscalerthree`, `zscalerbeta`, `zscalergov`, `zscalerten`, `zspreview` |
| `use_legacy_client` | `ZSCALER_USE_LEGACY_CLIENT` | Must be `true` to activate legacy path |

#### Optional provider-level tuning (OneAPI)

| Argument | Default | Notes |
|---|---|---|
| `parallelism` | 1 | Worker pool size for non-bulk operations |
| `max_retries` | 5 | Retries before returning an error |
| `request_timeout` | 0 (unlimited) | Per-request timeout in seconds; max 300 |
| `http_proxy` | — | Custom proxy URL; also `ZSCALER_HTTP_PROXY` |

---

## Resources (14 total)

### Forwarding Gateways

#### `ztc_forwarding_gateway`

Source: `docs/resources/ztc_forwarding_gateway.md`

Manages ZIA forwarding gateways and log/control (ECSELF) forwarding gateways. A gateway defines primary and secondary proxy endpoints used by traffic forwarding rules.

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `description` | String | Optional |
| `type` | String | `ZIA` (traffic to ZIA) or `ECSELF` (log-and-control path) |
| `fail_closed` | Bool | `true` = drop traffic when both proxies unreachable; `false` = allow |
| `primary_type` | String | `AUTO`, `DC`, `MANUAL_OVERRIDE` |
| `secondary_type` | String | Same values as `primary_type` |
| `manual_primary` | String | Hostname or IP when type is `DC` or `MANUAL_OVERRIDE` |
| `manual_secondary` | String | Hostname or IP when type is `DC` or `MANUAL_OVERRIDE` |
| `subcloud_primary` | Block | ID of subcloud entity; only relevant when `primary_type = DC` and subclouds are configured |
| `subcloud_secondary` | Block | Same, for secondary |

Import: by `<GATEWAY_ID>` or `<GATEWAY_NAME>`.

Gotchas:
- When `primary_type = MANUAL_OVERRIDE`, set `manual_primary` to a raw IP or hostname, not a data-center name.
- `subcloud_primary` / `subcloud_secondary` are not applicable to Cloud & Branch Connector per SDK struct comments; field exists in the schema but may have no effect.

---

#### `ztc_dns_forwarding_gateway`

Source: `docs/resources/ztc_dns_forwarding_gateway.md`

Manages DNS forwarding gateways used in DNS traffic forwarding rules. Two mutually exclusive configuration modes:

1. Custom DNS server IPs (`primary_ip` / `secondary_ip`)
2. Edge Connector LAN/WAN DNS options (`ec_dns_gateway_options_primary` / `ec_dns_gateway_options_secondary`)

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `primary_ip` | String | IP of primary custom DNS server |
| `secondary_ip` | String | IP of secondary custom DNS server |
| `ec_dns_gateway_options_primary` | String | `LAN_PRI_DNS_AS_PRI`, `LAN_SEC_DNS_AS_SEC`, `WAN_PRI_DNS_AS_PRI`, `WAN_SEC_DNS_AS_SEC` |
| `ec_dns_gateway_options_secondary` | String | Same enum values |
| `failure_behavior` | String | `FAIL_RET_ERR` (return error) or `FAIL_ALLOW_IGNORE_DNAT` (allow traffic) |

Import: by `<GATEWAY_ID>` or `<GATEWAY_NAME>`.

Gotchas:
- The provider also exposes a separate `ztc_dns_gateway` resource (see below). The two resources appear to target the same `/ztw/api/v1/dnsGateways` endpoint. The difference in schema is that `ztc_dns_gateway` adds a `dns_gateway_type` field (value `EC_DNS_GW`) and exposes `gateway_id` as a separate computed attribute alongside `id`. Open question: whether they are truly distinct resources or aliases.

---

#### `ztc_dns_gateway`

Source: `docs/resources/ztc_dns_gateway.md`

Alternative resource for DNS gateway configuration. Shares the same API endpoint as `ztc_dns_forwarding_gateway` but exposes a `dns_gateway_type` field.

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `dns_gateway_type` | String | `EC_DNS_GW` |
| `ec_dns_gateway_options_primary` | String | Same enum as `ztc_dns_forwarding_gateway` |
| `ec_dns_gateway_options_secondary` | String | Same enum |
| `failure_behavior` | String | `FAIL_RET_ERR` or `FAIL_ALLOW_IGNORE_DNAT` |
| `primary_ip` | String | Custom DNS server IP |
| `secondary_ip` | String | Custom DNS server IP |
| `gateway_id` | Number | Computed; numeric API-assigned ID (separate from Terraform's `id` string) |

Import: by `<GATEWAY_ID>` or `<GATEWAY_NAME>`.

---

### Policy Management — Traffic Forwarding Rules

#### `ztc_traffic_forwarding_rule`

Source: `docs/resources/ztc_traffic_forwarding_rule.md`

The primary traffic forwarding rule. Controls how traffic is forwarded from Cloud Connector to a destination: directly, through ZIA, through ZPA, or dropped.

API endpoint (from SDK): `POST /ztw/api/v1/ecRules/ecRdr`

**NOTE**: `ztc_traffic_forwarding_dns_rule` and `ztc_traffic_forwarding_log_rule` are available only via OneAPI. `ztc_traffic_forwarding_rule` does not carry that restriction in its docs.

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `description` | String | Optional |
| `state` | String | `ENABLED` or `DISABLED` |
| `order` | Number | Execution order (lower = higher priority) |
| `rank` | Number | Admin rank |
| `type` | String | Rule category: `EC_RDR` for forwarding rules |
| `forward_method` | String | `DIRECT`, `ZIA`, `ECZPA`, `DROP`, `LOCAL_SWITCH`, `PROXYCHAIN`, `ECSELF` |
| `wan_selection` | String | `BALANCED_RULE`, `BESTLINK_RULE`, etc. — hardware gateway-mode only |
| `src_ips` | List(String) | Source IPs; unrestricted if omitted |
| `dest_addresses` | List(String) | Destination IPs or FQDNs; CIDR accepted |
| `dest_countries` | List(String) | ISO 3166-1 alpha-2 country codes |
| `source_ip_group_exclusion` | Bool | Exclude matching source IP groups |
| `locations` | Block | Location name-ID pairs |
| `ec_groups` | Block | Cloud Connector group name-ID pairs |
| `src_ip_groups` | Block | Source IP group IDs |
| `dest_ip_groups` | Block | Destination IP group IDs |
| `nw_services` | Block | Network service IDs |
| `nw_service_groups` | Block | Network service group IDs |
| `app_service_groups` | Block | Application service group IDs |
| `proxy_gateway` | Block | Gateway ID+name for `PROXYCHAIN`/`ZIA` methods |
| `src_workload_groups` | Block | Workload group IDs |
| `zpa_application_segments` | Block | ZPA Application Segment IDs (ECZPA only); no data source available — IDs must be hardcoded |
| `zpa_application_segment_groups` | Block | ZPA App Segment Group IDs (ECZPA only); same limitation |

Import: by `<RULE_ID>` or `<RULE_NAME>`.

Gotchas:
- `src_workload_groups` IDs must currently be retrieved using the ZIA provider's `zia_workload_groups` data source — there is no native `ztc_workload_groups` data source.
- `zpa_application_segments` and `zpa_application_segment_groups` have no corresponding data sources in the ZTC provider. IDs must be obtained outside Terraform and hardcoded.
- `wan_selection` is noted in the SDK as deprecated and no longer configurable in some contexts.

---

#### `ztc_traffic_forwarding_dns_rule`

Source: `docs/resources/ztc_traffic_forwarding_dns_rule.md`

**OneAPI only.**

Manages DNS forwarding rules. Controls how DNS queries are handled: allow, block, redirect to a DNS gateway, or redirect to ZPA.

API endpoint: `POST /ztw/api/v1/ecRules/ecDns`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `description` | String | Optional |
| `state` | String | `ENABLED` or `DISABLED` |
| `order` | Number | Rule execution order |
| `rank` | Number | Admin rank |
| `action` | String | `ALLOW`, `BLOCK`, `REDIR_REQ`, `REDIR_ZPA` |
| `src_ips` | List(String) | Source IP addresses |
| `dest_addresses` | List(String) | Destination FQDNs or IPs |
| `locations` | Block | Location IDs |
| `ec_groups` | Block | Cloud Connector group IDs |
| `location_groups` | Block | Location group IDs |
| `src_ip_groups` | Block | Source IP group IDs |
| `dest_ip_groups` | Block | Destination IP group IDs; not valid when `action = REDIR_ZPA` |
| `dns_gateway` | Block | DNS gateway ID+name; only for `action = REDIR_REQ` |
| `zpa_ip_group` | Block | IP pool group ID+name; only for `action = REDIR_ZPA` |

Import: by `<RULE_ID>` or `<RULE_NAME>`.

Gotchas:
- `dest_ip_groups` and `dns_gateway` are mutually exclusive with the `REDIR_ZPA` action.
- `zpa_ip_group` references an `ztc_ip_pool_groups` resource.

---

#### `ztc_traffic_forwarding_log_rule`

Source: `docs/resources/ztc_traffic_forwarding_log_rule.md`

**OneAPI only.**

Manages log-and-control forwarding rules. These rules govern how Cloud Connector sends its own control/log traffic.

API endpoint: `POST /ztw/api/v1/ecRules/self`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `description` | String | Optional |
| `state` | String | `ENABLED` or `DISABLED` |
| `order` | Number | Rule execution order |
| `rank` | Number | Admin rank |
| `forward_method` | String | `ECSELF` (only supported value) |
| `locations` | Block | Location IDs |
| `ec_groups` | Block | Cloud Connector group IDs |
| `proxy_gateway` | Block | Gateway ID+name |

Import: by `<RULE_ID>` or `<RULE_NAME>`.

Note: The resource doc page header incorrectly labels this as a Data Source. It is a resource.

---

### Policy Resources

#### `ztc_ip_destination_groups`

Source: `docs/resources/ztc_ip_destination_groups.md`

Manages IP destination groups used as match criteria in traffic forwarding and DNS rules.

API endpoint: `/ztw/api/v1/ipDestinationGroups`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `description` | String | Optional |
| `type` | String | `DSTN_IP` (IP ranges), `DSTN_FQDN` (FQDNs), `DSTN_DOMAIN` (domain suffixes), `DSTN_OTHER` (country-based) |
| `addresses` | List(String) | IPs, FQDNs, domain names, or IP ranges depending on `type` |
| `countries` | List(String) | ISO 3166-1 alpha-2 codes; only used when `type = DSTN_OTHER` |

Import: by `<GROUP_ID>` or `<GROUP_NAME>`.

Note: The attribute reference in the doc uses `ip_addresses` but the example and SDK struct use `addresses`. The TF schema field is `addresses`; `ip_addresses` in the attribute table appears to be a documentation error.

---

#### `ztc_ip_source_groups`

Source: `docs/resources/ztc_ip_source_groups.md`

Manages IP source groups used as source-match criteria in rules.

API endpoint: `/ztw/api/v1/ipSourceGroups`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `description` | String | Optional |
| `ip_addresses` | List(String) | Individual IP addresses |

Import: by `<GROUP_ID>` or `<GROUP_NAME>`.

Note: The example in the doc uses the resource type `zia_ip_source_groups`, which is incorrect. The correct type is `ztc_ip_source_groups`.

---

#### `ztc_ip_pool_groups`

Source: `docs/resources/ztc_ip_pool_groups.md`

Manages IP pool groups. Used as ZPA IP group targets in DNS forwarding rules (`REDIR_ZPA` action).

API endpoint: `/ztw/api/v1/ipGroups`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `description` | String | Optional |
| `ip_addresses` | List(String) | CIDR subnets; doc states only one CIDR subnet is allowed per group |

Import: by `<GROUP_ID>` or `<GROUP_NAME>`.

---

#### `ztc_network_services`

Source: `docs/resources/ztc_network_services.md`

Manages individual network service definitions (protocol + port ranges).

API endpoint: `/ztw/api/v1/networkServices`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `description` | String | Optional |
| `type` | String | `CUSTOM`, `STANDARD`, `PREDEFINED` |
| `tag` | String | Optional tag |
| `src_tcp_ports` | Block list | `start` and `end` port numbers |
| `dest_tcp_ports` | Block list | `start` and `end` port numbers |
| `src_udp_ports` | Block list | `start` and `end` port numbers |
| `dest_udp_ports` | Block list | `start` and `end` port numbers |

Import: by `<SERVICE_ID>` or `<SERVICE_NAME>`.

---

#### `ztc_network_service_groups`

Source: `docs/resources/ztc_network_service_groups.md`

Manages groups of network services for use in forwarding rules.

API endpoint: `/ztw/api/v1/networkServiceGroups`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `description` | String | Optional |
| `services` | Block | List of service IDs; each block has an `id` list |

Import: by `<GROUP_ID>` or `<GROUP_NAME>`.

---

### Location Management

#### `ztc_location_template`

Source: `docs/resources/ztc_location_template.md`

Manages location templates. Templates are applied to provisioning URLs to configure the ZIA location settings that Cloud Connector locations inherit.

API endpoint: `/ztw/api/v1/locationTemplate`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `desc` | String | Optional description |
| `editable` | Bool | Read-only; whether the template is editable |
| `last_mod_time` | Number | Computed; last modification timestamp |
| `template` | Block | Policy settings (see below) |
| `last_mod_uid` | Block | Computed; last modifier user info |

`template` block fields:

| Field | Type | Notes |
|---|---|---|
| `template_prefix` | String | Prefix applied to location names created from this template |
| `xff_forward_enabled` | Bool | Pass X-Forwarded-For header |
| `auth_required` | Bool | Enforce authentication |
| `caution_enabled` | Bool | Show caution notification |
| `aup_enabled` | Bool | Enable Acceptable Use Policy |
| `aup_timeout_in_days` | Number | AUP timeout; `0` = no timeout |
| `ofw_enabled` | Bool | Enable Cloud Firewall |
| `ips_control` | Bool | Enable IPS (requires firewall enabled) |
| `enforce_bandwidth_control` | Bool | Enable bandwidth limits |
| `up_bandwidth` | Number | Upload limit in Kbps; `0` = no limit |
| `dn_bandwidth` | Number | Download limit in Kbps; `0` = no limit |

Import: by `<TEMPLATE_ID>` or `<TEMPLATE_NAME>`.

---

### Provisioning

#### `ztc_provisioning_url`

Source: `docs/resources/ztc_provisioning_url.md`

Manages provisioning URLs. A provisioning URL encodes the bootstrap configuration that a Cloud Connector VM fetches at first boot.

API endpoint: `/ztw/api/v1/provUrl`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `desc` | String | Optional |
| `prov_url_type` | String | `ONPREM` or `CLOUD` |
| `prov_url` | String | Computed; the actual URL string |
| `status` | String | Computed |
| `last_mod_time` | Number | Computed |
| `prov_url_data` | Block | Configuration details (see below) |

`prov_url_data` block fields:

| Field | Type | Notes |
|---|---|---|
| `cloud_provider_type` | String | `AWS`, `AZURE`, `GCP` |
| `form_factor` | String | `SMALL`, `MEDIUM`, `LARGE` |
| `location_template` | Block | Reference to a `ztc_location_template` by ID |

The data source version of `ztc_provisioning_url` exposes additional computed fields: `prov_url_data.zs_cloud_domain`, `.org_id`, `.config_server`, `.registration_server`, `.api_server`, `.pac_server`, `.hypervisors`, `.bc_group`, and `used_in_ec_groups`.

Import: by `<PROV_URL_ID>` or `<PROV_URL_NAME>`.

---

### Partner Integrations

#### `ztc_public_cloud_info`

Source: `docs/resources/ztc_public_cloud_info.md`

Registers an AWS (or Azure/GCP) account with the Cloud Connector portal for workload discovery. Corresponds to the "Workload Discovery Settings" feature.

API endpoint: `/ztw/api/v1/publicCloudInfo`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required; account name in the portal |
| `cloud_type` | String | `AWS`, `AZURE`, `GCP`; default `AWS` |
| `supported_regions` | Block | List of region IDs from `ztc_supported_regions` data source |
| `account_groups` | Block | Immutable reference to account groups; ID list |
| `account_details` | Block | AWS-specific account details (see below) |

`account_details` block fields:

| Field | Type | Notes |
|---|---|---|
| `aws_account_id` | String | 12-digit AWS account ID |
| `aws_role_name` | String | IAM role name in the customer account (max 64 chars) |
| `cloud_watch_group_arn` | String | CloudWatch log group ARN; `DISABLED` to disable |
| `event_bus_name` | String | EventBridge bus name for change notifications |
| `external_id` | String | Optional; must match `externalId` at root level if provided |
| `trouble_shooting_logging` | Bool | Enable troubleshooting logs |
| `trusted_account_id` | String | Zscaler's AWS account ID |
| `trusted_role` | String | ARN of the trusted role in Zscaler's account |

Import: by `<CLOUD_ID>` or `<CLOUD_NAME>`.

---

## Data Sources (19 total)

The following data sources are available. All support lookup by `id` (Number) or `name` (String) unless noted.

| Data source | Purpose | Key exported attributes |
|---|---|---|
| `ztc_activation_status` | Current activation state of the tenant; no arguments required | `org_edit_status`, `org_last_activate_status`, `admin_activate_status`, `admin_status_map` |
| `ztc_edge_connector_group` | Cloud Connector group details including VM inventory | `deploy_type`, `platform`, `aws_availability_zone`, `azure_availability_zone`, `max_ec_count`, `tunnel_mode`, `location`, `prov_template`, `ec_vms` (full VM detail including network config) |
| `ztc_location_management` | Location details | `parent_id`, `ec_location`, `auth_required`, `ofw_enabled`, `ips_control`, `enforce_bandwidth_control`, `public_cloud_account_id` |
| `ztc_location_template` | Location template details | All `template` block fields; `last_mod_uid` |
| `ztc_provisioning_url` | Provisioning URL details | All `prov_url_data` fields including `bc_group`, `used_in_ec_groups` |
| `ztc_forwarding_gateway` | ZIA/ECSELF forwarding gateway | `type`, `fail_closed`, `primary_type`, `secondary_type`, `manual_primary`, `manual_secondary`, `subcloud_primary`, `subcloud_secondary`, `last_modified_time`, `last_modified_by` |
| `ztc_dns_forwarding_gateway` | DNS forwarding gateway | `primary_ip`, `secondary_ip`, `ec_dns_gateway_options_primary`, `ec_dns_gateway_options_secondary`, `failure_behavior` |
| `ztc_dns_gateway` | DNS gateway (alternative data source) | Same fields as `ztc_dns_forwarding_gateway` plus `dns_gateway_type`, `gateway_id` |
| `ztc_ip_destination_groups` | IP destination group | `type`, `addresses`, `countries` |
| `ztc_ip_source_groups` | IP source group | `ip_addresses` |
| `ztc_ip_pool_groups` | IP pool group | `ip_addresses` |
| `ztc_network_services` | Individual network service | `type`, `tag`, `src_tcp_ports`, `dest_tcp_ports`, `src_udp_ports`, `dest_udp_ports` |
| `ztc_network_service_groups` | Network service group | `services` (list with port detail) |
| `ztc_traffic_forwarding_rule` | Traffic forwarding rule | All rule attributes |
| `ztc_traffic_forwarding_dns_rule` | DNS forwarding rule | All DNS rule attributes |
| `ztc_traffic_forwarding_log_rule` | Log forwarding rule | All log rule attributes |
| `ztc_provisioning_url` | (read-only version) | `prov_url_data`, `used_in_ec_groups`, `last_mod_uid` |
| `ztc_account_groups` | AWS account groups | `cloud_type`, `cloud_connector_groups`, `public_cloud_accounts` |
| `ztc_supported_regions` | AWS/Azure/GCP regions for workload discovery | When `name`/`id` supplied: `cloud_type`; when neither supplied: `regions` list with id/name/cloud_type per region |

---

## Activation

The ZTC platform requires explicit activation after configuration changes. The provider exposes this in two ways:

1. **`ztc_activation_status` resource** — include in a Terraform plan to trigger activation as part of `apply`.
2. **Out-of-band CLI** (`ztc activator`) — documented in `guides/ztc-activator-overview.md`; useful when activation should not be tied to the Terraform plan cycle.

The `ztc_activation_status` data source (read-only) exposes current status without triggering activation.

---

## Import

All resources support import via Zscaler-Terraformer (`github.com/zscaler/zscaler-terraformer`) or standard `terraform import`:

```shell
terraform import ztc_<resource_type>.<local_name> <resource_id_or_name>
```

Both numeric ID and name are accepted as the import identifier for all resources.

---

## Open questions / clarifications register

1. **`ztc_dns_forwarding_gateway` vs `ztc_dns_gateway`**: Both resources appear to target `/ztw/api/v1/dnsGateways`. Are they truly distinct resource types or aliases with different schema presentations? The SDK has two separate packages (`dns_gateway` and `forwarding_gateways/dns_forwarding_gateway`) that both point to the same endpoint. Clarification needed on whether the API distinguishes them by `dnsGatewayType`.

2. **`ztc_traffic_forwarding_log_rule` doc label**: The resource doc page (`ztc_traffic_forwarding_log_rule.md`) has `# ztc_traffic_forwarding_log_rule (Data Source)` in its header despite being under `docs/resources/`. Confirm this is a resource, not a data source.

3. **`ztc_ip_destination_groups` field name**: The attribute reference table uses `ip_addresses` but the SDK struct field is `addresses` and examples use `addresses`. The correct TF argument name requires confirmation against the provider source code.

4. **`ztc_ip_source_groups` example**: The example block uses resource type `zia_ip_source_groups` instead of `ztc_ip_source_groups`. Confirm the correct resource type and whether cross-provider use is intended.

5. **ZPA Application Segment IDs**: `zpa_application_segments` and `zpa_application_segment_groups` in `ztc_traffic_forwarding_rule` have no corresponding ZTC data sources. The provider docs acknowledge this and suggest ZIA provider data sources may return the same IDs. Confirm the cross-provider ID sharing pattern.

6. **`ztc_traffic_forwarding_rule` and OneAPI restriction**: The resource docs do not explicitly state an OneAPI-only restriction (unlike the DNS and log rule resources). Confirm whether the traffic forwarding rule works with both auth frameworks.

7. **`wan_selection` deprecation**: The SDK struct comments note this field was deprecated and is no longer configurable in some contexts. Confirm current behavior.

8. **`subcloud_primary` / `subcloud_secondary` applicability**: SDK struct comments mark these as "Not applicable to Cloud & Branch Connector." Confirm whether these fields should be omitted from the TF schema entirely.

9. **Provider version parity**: The index.md examples show `~> 0.1.6` but also `~> 0.1.0` for the legacy client example. Confirm the current stable version and whether v4.0.0 (referenced for legacy backwards compatibility) implies a different version numbering scheme than the `0.1.x` examples suggest.

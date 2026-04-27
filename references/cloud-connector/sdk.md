---
product: cloud-connector
topic: cc-sdk
title: Cloud Connector Go SDK — service catalog
content-type: reference
last-verified: 2026-04-26
confidence: medium
source-tier: code
sources:
  - vendor/zscaler-sdk-go/zscaler/ztw/services/
  - vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go
  - vendor/zscaler-sdk-go/CLAUDE.md
---

# Cloud Connector Go SDK — service catalog

## No Python SDK

Cloud Connector (ZTW) is not covered by zscaler-sdk-python. The Python SDK historically lacked ZTW coverage. Do not search for a `zscaler.ztw` Python module — it does not exist. All programmatic access from Python must use the REST API directly or the Terraform provider.

The Go SDK (`github.com/zscaler/zscaler-sdk-go/v3`) is the only supported SDK path for Cloud Connector.

---

## SDK overview

### Module and package structure

```
github.com/zscaler/zscaler-sdk-go/v3/zscaler/ztw/
├── v2_client.go          # ZTW client initialization
├── v2_config.go          # ZTW-specific config
└── services/
    ├── common/common.go  # Shared types, ReadAllPages (fixed pageSize=1000)
    ├── activation/
    ├── activation_cli/   # (no source file found; may be internal)
    ├── adminuserrolemgmt/
    │   ├── adminroles/
    │   └── adminusers/
    ├── dns_gateway/
    ├── ecgroup/
    ├── forwarding_gateways/
    │   ├── dns_forwarding_gateway/
    │   └── zia_forwarding_gateway/
    ├── locationmanagement/
    │   ├── location/
    │   ├── locationlite/
    │   └── locationtemplate/
    ├── partner_integrations/
    │   ├── account_groups/
    │   ├── partner_integrations.go
    │   └── public_cloud_info/
    ├── policy_management/
    │   ├── forwarding_rules/
    │   ├── traffic_dns_rules/
    │   └── traffic_log_rules/
    ├── policyresources/
    │   ├── ipdestinationgroups/
    │   ├── ipgroups/
    │   ├── ipsourcegroups/
    │   ├── networkservicegroups/
    │   ├── networkservices/
    │   └── zparesources/
    ├── provisioning/
    │   ├── api_keys/
    │   ├── provisioning_url/
    │   └── public_cloud_account/
    └── workload_groups/
```

### Client construction

```go
import "github.com/zscaler/zscaler-sdk-go/v3/zscaler"

config, err := zscaler.NewConfiguration(
    zscaler.WithClientID("your-client-id"),
    zscaler.WithClientSecret("your-client-secret"),
    zscaler.WithVanityDomain("acme"),
    zscaler.WithCloud("zscloud"),     // omit for production default
    zscaler.WithCache(true),
    zscaler.WithCacheTtl(10 * time.Minute),
)
if err != nil {
    return err
}
service, err := zscaler.NewOneAPIClient(config)
```

Environment variables (alternative to code-level config): `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET`, `ZSCALER_VANITY_DOMAIN`, `ZSCALER_CLOUD`.

### Authentication: OneAPI vs legacy

**OneAPI** (default, v4.0.0+): OAuth 2.0 Client Credentials via ZIdentity. Token is obtained on first request and auto-refreshed on 401. Not available for `zscalergov` or `zscalerten` clouds.

**Legacy CBC API**: Username/password/API-key authentication against the ZTC portal directly. Activated by setting `use_legacy_client = true` in provider config or the equivalent SDK option. The SDK maintains backwards compatibility.

### Function signature convention

All ZTW service functions are **package-level functions** (not methods on a struct). Every function takes `ctx context.Context` as the first argument and `service *zscaler.Service` as the second.

### HTTP methods

ZTW uses a `Resource`-suffixed set of HTTP methods, distinct from ZIA's methods:

| Operation | Method |
|---|---|
| Read by ID | `service.Client.ReadResource(ctx, endpoint, &target)` |
| Create | `service.Client.CreateResource(ctx, endpoint, body)` → `interface{}` |
| Update | `service.Client.UpdateWithPutResource(ctx, endpoint, body)` → `interface{}` |
| Delete | `service.Client.DeleteResource(ctx, endpoint)` |

Some older services in the `provisioning` package use the non-`Resource` methods (`service.Client.Create`, `service.Client.UpdateWithPut`, `service.Client.Delete`). This inconsistency exists in the codebase.

### Pagination

`common.ReadAllPages` in `vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go`:

- Fixed `pageSize = 1000`
- Appends `?pageSize=1000&page=N` to the endpoint
- Stops when `len(items) < 1000`
- Applies JMESPath client-side filtering from context if set (via `zscaler.ApplyJMESPathFromContext`)
- All `GetAll` and `GetByName` functions go through this helper

### GetByName pattern

All `GetByName` implementations call `ReadAllPages` to fetch all objects, then iterate with `strings.EqualFold` for case-insensitive matching. No server-side name filter is used (except `ecgroup/GetEcGroupLiteByName`, which passes `?name=<encoded>` to the lite endpoint as an optimization).

### ID types

All ZTW IDs are `int`. Never use string IDs.

### Activation requirement

ZTW changes are staged and do not take effect until activation is triggered. The SDK does **not** auto-activate. Callers must explicitly call `activation.UpdateActivationStatus` or `activation.ForceActivationStatus` after mutations.

---

## Service catalog

### Activation

**Package**: `zscaler/ztw/services/activation`  
**File**: `activation/activation.go`

Manages the activation gate. All configuration changes in the ZTC portal are staged until activation is called.

| Function | Signature | API endpoint | Notes |
|---|---|---|---|
| `GetActivationStatus` | `(ctx, service) (*ECAdminActivation, error)` | `GET /ztw/api/v1/ecAdminActivateStatus` | Returns current org and admin activation state |
| `UpdateActivationStatus` | `(ctx, service, activation ECAdminActivation) (*ECAdminActivation, error)` | `PUT /ztw/api/v1/ecAdminActivateStatus/activate` | Triggers normal activation |
| `ForceActivationStatus` | `(ctx, service, forceActivation ECAdminActivation) (*ECAdminActivation, error)` | `PUT /ztw/api/v1/ecAdminActivateStatus/forcedActivate` | Force-activates; use when a lock prevents normal activation |

`ECAdminActivation` struct fields: `OrgEditStatus`, `OrgLastActivateStatus`, `AdminStatusMap` (map), `AdminActivateStatus`.

TF resource: `ztc_activation_status`  
TF data source: `ztc_activation_status`

---

### Edge Connector Groups (ecgroup)

**Package**: `zscaler/ztw/services/ecgroup`  
**File**: `ecgroup/ecgroup.go`

Manages Cloud Connector groups — the logical groupings of Cloud Connector VM instances. Read-only from this package (no `Create` or `Update`).

| Function | Signature | API endpoint | Notes |
|---|---|---|---|
| `Get` | `(ctx, service, ecGroupID int) (*EcGroup, error)` | `GET /ztw/api/v1/ecgroup/{id}` | Full group detail |
| `GetByName` | `(ctx, service, ecGroupName string) (*EcGroup, error)` | `GET /ztw/api/v1/ecgroup` + client filter | Paginates all; case-insensitive match |
| `Delete` | `(ctx, service, ecGroupID int) (*http.Response, error)` | `DELETE /ztw/api/v1/ecgroup/{id}` | |
| `GetAll` | `(ctx, service) ([]EcGroup, error)` | `GET /ztw/api/v1/ecgroup` | Full detail, paginated |
| `GetEcGroupLiteID` | `(ctx, service, ecGroupID int) (*EcGroup, error)` | `GET /ztw/api/v1/ecgroup/lite/{id}` | Lightweight response |
| `GetEcGroupLiteByName` | `(ctx, service, ecGroupLiteName string) (*EcGroup, error)` | `GET /ztw/api/v1/ecgroup/lite?name=<encoded>` | Server-side name filter + client confirm |

`EcGroup` key fields: `ID`, `Name`, `Description` (JSON: `desc`), `DeployType`, `Status` ([]string), `Platform`, `AWSAvailabilityZone`, `AzureAvailabilityZone`, `MaxEcCount`, `TunnelMode`, `Location` (`*CommonIDNameExternalID`), `ProvTemplate` (`*CommonIDNameExternalID`), `ECVMs` ([]ECVMs with full network detail).

TF data source: `ztc_edge_connector_group`

---

### DNS Gateway

**Package**: `zscaler/ztw/services/dns_gateway`  
**File**: `dns_gateway/dns_gateway.go`

Full CRUD for DNS gateways. Note: a second package (`forwarding_gateways/dns_forwarding_gateway`) targets the same endpoint — see open questions.

| Function | Signature | API endpoint | Notes |
|---|---|---|---|
| `Get` | `(ctx, service, gatewayID int) (*DNSGateway, error)` | `GET /ztw/api/v1/dnsGateways/{id}` | |
| `GetByName` | `(ctx, service, gatewayName string) (*DNSGateway, error)` | `GET /ztw/api/v1/dnsGateways` + client filter | |
| `Create` | `(ctx, service, gateway *DNSGateway) (*DNSGateway, error)` | `POST /ztw/api/v1/dnsGateways` | |
| `Update` | `(ctx, service, gatewayID int, gateway *DNSGateway) (*DNSGateway, *http.Response, error)` | `PUT /ztw/api/v1/dnsGateways/{id}` | |
| `Delete` | `(ctx, service, gatewayID int) (*http.Response, error)` | `DELETE /ztw/api/v1/dnsGateways/{id}` | |
| `GetAll` | `(ctx, service) ([]DNSGateway, error)` | `GET /ztw/api/v1/dnsGateways` | |
| `GetAllLite` | `(ctx, service) ([]DNSGateway, error)` | `GET /ztw/api/v1/dnsGateways/lite` | |

`DNSGateway` key fields: `ID`, `Name`, `DNSGatewayType`, `ECDnsGatewayOptionsPrimary`, `ECDnsGatewayOptionsSecondary`, `FailureBehavior`, `PrimaryIP`, `SecondaryIP`, `LastModifiedTime`, `LastModifiedBy`.

TF resources: `ztc_dns_gateway`, `ztc_dns_forwarding_gateway`

---

### Forwarding Gateways

Two sub-packages under `forwarding_gateways/`, both providing full CRUD:

#### dns_forwarding_gateway

**Package**: `zscaler/ztw/services/forwarding_gateways/dns_forwarding_gateway`  
**File**: `forwarding_gateways/dns_forwarding_gateway/dns_forwarding_gateway.go`  
**Endpoint**: `/ztw/api/v1/dnsGateways` (same as `dns_gateway` package)

| Function | Signature | Notes |
|---|---|---|
| `Get` | `(ctx, service, id int) (*DNSGateway, *http.Response, error)` | Returns `*http.Response` unlike the `dns_gateway` package |
| `GetByName` | `(ctx, service, name string) (*DNSGateway, error)` | |
| `Create` | `(ctx, service, rules *DNSGateway) (*DNSGateway, *http.Response, error)` | |
| `Update` | `(ctx, service, ruleID int, rules *DNSGateway) (*DNSGateway, *http.Response, error)` | |
| `Delete` | `(ctx, service, id int) (*http.Response, error)` | |
| `GetAll` | `(ctx, service) ([]DNSGateway, error)` | |
| `GetAllLite` | `(ctx, service) ([]DNSGateway, error)` | `/dnsGateways/lite` |

`DNSGateway` struct in this package adds a `Type` field not present in the `dns_gateway` package's struct.

TF resource: `ztc_dns_forwarding_gateway`

#### zia_forwarding_gateway

**Package**: `zscaler/ztw/services/forwarding_gateways/zia_forwarding_gateway`  
**File**: `forwarding_gateways/zia_forwarding_gateway/zia_forwarding_gateway.go`  
**Endpoint**: `/ztw/api/v1/gateways`

| Function | Signature | Notes |
|---|---|---|
| `Get` | `(ctx, service, id int) (*ECGateway, *http.Response, error)` | |
| `GetByName` | `(ctx, service, name string) (*ECGateway, error)` | |
| `Create` | `(ctx, service, rules *ECGateway) (*ECGateway, *http.Response, error)` | |
| `Update` | `(ctx, service, ruleID int, rules *ECGateway) (*ECGateway, *http.Response, error)` | |
| `Delete` | `(ctx, service, id int) (*http.Response, error)` | |
| `GetAll` | `(ctx, service) ([]ECGateway, error)` | |
| `GetAllLite` | `(ctx, service) ([]ECGateway, error)` | `/gateways/lite` |

`ECGateway` key fields: `ID`, `Name`, `Description`, `FailClosed`, `ManualPrimary`, `ManualSecondary`, `SubCloudPrimary` (`*CommonIDNameExternalID`), `SubCloudSecondary`, `PrimaryType`, `SecondaryType`, `Type` (`ZIA` or `ECSELF`), `FailureBehavior`, `PrimaryIP`, `SecondaryIP`, `ECDNSGatewayOptionsPrimary`, `ECDNSGatewayOptionsSecondary`.

Supported values for `PrimaryType`/`SecondaryType`: `NONE`, `AUTO`, `MANUAL_OVERRIDE`, `SUBCLOUD`, `VZEN`, `PZEN`, `DC`.

TF resource: `ztc_forwarding_gateway`

---

### Location Management

Three sub-packages under `locationmanagement/`:

#### location

**Package**: `zscaler/ztw/services/locationmanagement/location`  
**File**: `locationmanagement/location/location.go`  
**Endpoint**: `/ztw/api/v1/location`

Full CRUD for Cloud Connector locations.

| Function | Signature | Notes |
|---|---|---|
| `GetLocation` | `(ctx, service, locationID int) (*Locations, error)` | Non-standard name (`GetLocation` vs `Get`) |
| `GetLocationByName` | `(ctx, service, locationName string) (*Locations, error)` | |
| `Create` | `(ctx, service, locations *Locations) (*Locations, error)` | |
| `Update` | `(ctx, service, locationID int, locations *Locations) (*Locations, *http.Response, error)` | |
| `Delete` | `(ctx, service, locationID int) (*http.Response, error)` | |
| `GetAll` | `(ctx, service) ([]Locations, error)` | |

`Locations` struct is large. Key fields relevant to Cloud Connector: `ID`, `Name`, `ParentID`, `ECLocation` (bool — marks as CC location), `Country`, `State`, `TZ`, `AuthRequired`, `XFFForwardEnabled`, `OFWEnabled`, `IPSControl`, `AUPEnabled`, `CautionEnabled`, `EnforceBandwidthControl`, `UpBandwidth`, `DnBandwidth`, `PublicCloudAccountID` (`*CommonIDName`), `VPCInfo`.

Many fields on the struct are annotated "Not applicable to Cloud & Branch Connector" (e.g., `OverrideUpBandwidth`, `SharedUpBandwidth`, `VirtualZens`, `StaticLocationGroups`, `DynamiclocationGroups`). These are present because the struct is shared with ZIA location management.

TF data source: `ztc_location_management`

#### locationlite

Lightweight location listing. Package and file not directly inspected; follows the `lite` endpoint pattern (`/ztw/api/v1/location/lite`).

#### locationtemplate

**Package**: `zscaler/ztw/services/locationmanagement/locationtemplate`  
**File**: `locationmanagement/locationtemplate/` (imported by `provisioning_url.go`)  
**Endpoint**: `/ztw/api/v1/locationTemplate`

Provides `LocationTemplate` struct used by `provisioning_url`. Full CRUD details not directly verified from source (file not found at expected path); existence confirmed by import in `provisioning_url.go`.

TF resource: `ztc_location_template`  
TF data source: `ztc_location_template`

---

### Policy Management

Three sub-packages under `policy_management/`:

#### forwarding_rules

**Package**: `zscaler/ztw/services/policy_management/forwarding_rules`  
**File**: `policy_management/forwarding_rules/forwarding_rules.go`  
**Endpoint**: `/ztw/api/v1/ecRules/ecRdr`

Full CRUD for traffic forwarding rules. Includes an optional server-side filter on `GetAll` and a count endpoint.

| Function | Signature | Notes |
|---|---|---|
| `Get` | `(ctx, service, ruleID int) (*ForwardingRules, error)` | |
| `GetRulesByName` | `(ctx, service, ruleName string) (*ForwardingRules, error)` | Non-standard name vs `GetByName` |
| `Create` | `(ctx, service, rules *ForwardingRules) (*ForwardingRules, error)` | |
| `Update` | `(ctx, service, ruleID int, rules *ForwardingRules) (*ForwardingRules, error)` | |
| `Delete` | `(ctx, service, ruleID int) (*http.Response, error)` | |
| `GetAll` | `(ctx, service, params ...ForwardingRulesQuery) ([]ForwardingRules, error)` | Optional filter: `RuleName`, `RuleOrder`, `RuleDescription`, `RuleForwardMethod`, `Location`, `SortBy`, `SortOrder` |
| `GetEcRDRCount` | `(ctx, service, params *ForwardingRulesCountQuery) (*ForwardingRulesCountResponse, error)` | `GET /ztw/api/v1/ecRules/ecRdr/count` |

`ForwardingRules` key fields: `ID`, `Name`, `Description`, `Type`, `Order`, `Rank`, `ForwardMethod` (`DIRECT`, `ZIA`, `ECZPA`, `ECSELF`, `DROP`, `PROXYCHAIN`, `ENATDEDIP`, `GEOIP`), `State`, `WanSelection`, `SrcIps`, `DestAddresses`, `DestCountries`, `Locations`, `LocationsGroups`, `ECGroups`, `SrcIpGroups`, `DestIpGroups`, `NwServices`, `NwServiceGroups`, `SrcWorkloadGroups`, `ProxyGateway` (`*CommonIDName`), `ZPAApplicationSegments`, `ZPAApplicationSegmentGroups`.

TF resource: `ztc_traffic_forwarding_rule`

#### traffic_dns_rules

**Package**: `zscaler/ztw/services/policy_management/traffic_dns_rules`  
**File**: `policy_management/traffic_dns_rules/traffic_dns_rules.go`  
**Endpoint**: `/ztw/api/v1/ecRules/ecDns`

Full CRUD for DNS forwarding rules.

| Function | Signature | Notes |
|---|---|---|
| `Get` | `(ctx, service, ruleID int) (*ECDNSRules, error)` | |
| `GetRulesByName` | `(ctx, service, ruleName string) (*ECDNSRules, error)` | |
| `Create` | `(ctx, service, rules *ECDNSRules) (*ECDNSRules, error)` | |
| `Update` | `(ctx, service, ruleID int, rules *ECDNSRules) (*ECDNSRules, error)` | |
| `Delete` | `(ctx, service, ruleID int) (*http.Response, error)` | |
| `GetAll` | `(ctx, service) ([]ECDNSRules, error)` | No filter params (unlike forwarding_rules) |
| `GetEcRDRCount` | `(ctx, service, params *DNSRulesCountQuery) (*DNSRulesCountResponse, error)` | `GET /ztw/api/v1/ecRules/ecDns/count` |

`ECDNSRules` key fields: `ID`, `Name`, `Description`, `Action` (`ALLOW`, `BLOCK`, `REDIR_REQ`, `REDIR_ZPA`), `Order`, `Rank`, `State`, `SrcIps`, `DestAddresses`, `Locations`, `LocationsGroups`, `ECGroups`, `SrcIpGroups`, `DestIpGroups`, `DNSGateway` (`*CommonIDName` — for `REDIR_REQ`), `ZPAIPGroup` (`*CommonIDName` — for `REDIR_ZPA`).

TF resource: `ztc_traffic_forwarding_dns_rule`

#### traffic_log_rules

**Package**: `zscaler/ztw/services/policy_management/traffic_log_rules`  
**File**: `policy_management/traffic_log_rules/traffic_log_rules.go`  
**Endpoint**: `/ztw/api/v1/ecRules/self`

Full CRUD for log-and-control forwarding rules. `GetEcRDRCount` is commented out in the source (not yet implemented).

| Function | Signature | Notes |
|---|---|---|
| `Get` | `(ctx, service, ruleID int) (*ECTrafficLogRules, error)` | |
| `GetRulesByName` | `(ctx, service, ruleName string) (*ECTrafficLogRules, error)` | |
| `Create` | `(ctx, service, rules *ECTrafficLogRules) (*ECTrafficLogRules, error)` | |
| `Update` | `(ctx, service, ruleID int, rules *ECTrafficLogRules) (*ECTrafficLogRules, error)` | |
| `Delete` | `(ctx, service, ruleID int) (*http.Response, error)` | |
| `GetAll` | `(ctx, service) ([]ECTrafficLogRules, error)` | |

`ECTrafficLogRules` key fields: `ID`, `Name`, `Description`, `Order`, `Rank`, `State`, `ForwardMethod` (`ECSELF`), `Locations`, `ECGroups`, `ProxyGateway` (`*CommonIDName`).

TF resource: `ztc_traffic_forwarding_log_rule`

---

### Policy Resources

Five sub-packages under `policyresources/`:

#### ipdestinationgroups

**Package**: `zscaler/ztw/services/policyresources/ipdestinationgroups`  
**File**: `policyresources/ipdestinationgroups/ipdestinationgroups.go`  
**Endpoint**: `/ztw/api/v1/ipDestinationGroups`

| Function | Signature | Notes |
|---|---|---|
| `Get` | `(ctx, service, ipGroupID int) (*IPDestinationGroups, error)` | |
| `GetByName` | `(ctx, service, name string) (*IPDestinationGroups, error)` | |
| `Create` | `(ctx, service, ipGroupID *IPDestinationGroups) (*IPDestinationGroups, error)` | |
| `Update` | `(ctx, service, ipGroupID int, ipGroup *IPDestinationGroups) (*IPDestinationGroups, *http.Response, error)` | |
| `Delete` | `(ctx, service, ipGroupID int) (*http.Response, error)` | |
| `GetAll` | `(ctx, service) ([]IPDestinationGroups, error)` | |
| `GetAllLite` | `(ctx, service) ([]IPDestinationGroups, error)` | `/ipDestinationGroups/lite` |

`IPDestinationGroups` fields: `ID`, `Name`, `Description`, `Type` (`DSTN_IP`, `DSTN_FQDN`, `DSTN_DOMAIN`, `DSTN_OTHER`), `Addresses` ([]string), `IPCategories` ([]string), `Countries` ([]string), `IsNonEditable`.

TF resource: `ztc_ip_destination_groups`

#### ipgroups (IP pool groups)

**Endpoint**: `/ztw/api/v1/ipGroups`

Manages IP pool groups used as ZPA IP targets in DNS rules. Source file not directly read but confirmed from directory listing.

TF resource: `ztc_ip_pool_groups`

#### ipsourcegroups

**Endpoint**: `/ztw/api/v1/ipSourceGroups`

Manages source IP groups. Standard CRUD pattern.

TF resource: `ztc_ip_source_groups`

#### networkservices

**Package**: `zscaler/ztw/services/policyresources/networkservices`  
**File**: `policyresources/networkservices/networkservices.go`  
**Endpoint**: `/ztw/api/v1/networkServices`

| Function | Signature | Notes |
|---|---|---|
| `Get` | `(ctx, service, serviceID int) (*NetworkServices, error)` | |
| `GetByName` | `(ctx, service, name string) (*NetworkServices, error)` | |
| `Create` | `(ctx, service, ...) (*NetworkServices, error)` | |
| `Update` | ... | |
| `Delete` | ... | |
| `GetAll` | `(ctx, service) ([]NetworkServices, error)` | |

`NetworkServices` fields: `ID`, `Name`, `Description`, `Tag`, `Type` (`STANDARD`, `PREDEFINED`, `CUSTOM`), `SrcTCPPorts`, `DestTCPPorts`, `SrcUDPPorts`, `DestUDPPorts` (each a `[]NetworkPorts{Start, End}`), `IsNameL10nTag`, `CreatorContext`.

TF resource: `ztc_network_services`

#### networkservicegroups

**Endpoint**: `/ztw/api/v1/networkServiceGroups`

Manages groups of network services. Standard CRUD pattern.

TF resource: `ztc_network_service_groups`

#### zparesources

**Package**: `zscaler/ztw/services/policyresources/zparesources`  
**File**: `policyresources/zparesources/zparesources.go`

Read-only access to ZPA Application Segments for use in Cloud Connector traffic forwarding rules. Exports `GetZPAApplicationSegments(ctx, service)` — returns the list of ZPA Application Segments visible to the Cloud Connector tenant. This solves the hardcoded-ID problem for `zpa_application_segments` in `ztc_traffic_forwarding_rule`: callers can look up IDs at runtime rather than hardcoding them.

---

### Partner Integrations

#### public_cloud_info

**Package**: `zscaler/ztw/services/partner_integrations/public_cloud_info`  
**File**: `partner_integrations/public_cloud_info/public_cloud_info.go`  
**Endpoint**: `/ztw/api/v1/publicCloudInfo`

Manages AWS/Azure/GCP account registration for workload discovery.

| Function | Signature | Notes |
|---|---|---|
| `GetPublicCloudInfo` | `(ctx, service, cloudID int) (*PublicCloudInfo, error)` | Non-standard name |
| `GetByName` | `(ctx, service, name string) (*PublicCloudInfo, error)` | |
| `GetPublicCloudInfoLite` | `(ctx, service) ([]PublicCloudInfoLite, error)` | `/publicCloudInfo/lite` |
| `GetAllPublicCloudInfo` | `(ctx, service) ([]PublicCloudInfo, error)` | |
| `GetPublicCloudInfoCount` | `(ctx, service) (int, error)` | `/publicCloudInfo/count` |
| `CreatePublicCloudInfo` | `(ctx, service, cloudInfo *PublicCloudInfo) (*PublicCloudInfo, error)` | |
| `UpdatePublicCloudInfo` | `(ctx, service, awsAccountID int, cloudInfo *PublicCloudInfo) (*PublicCloudInfo, error)` | |
| `DeletePublicCloudInfo` | `(ctx, service, awsAccountID int) error` | Returns `error` only, not `*http.Response` |
| `UpdatePublicCloudChangeState` | `(ctx, service, awsAccountID int, enable bool) error` | `PUT /publicCloudInfo/{id}/changeState?enable=<bool>` — enable/disable an account |
| `GenerateExternalID` | `(ctx, service, accountDetails *AccountDetails) (*AccountDetails, error)` | `POST /publicCloudInfo/generateExternalId` |

`PublicCloudInfo` key fields: `ID`, `Name`, `CloudType`, `ExternalID`, `AccountGroups` ([]IDNameExtensions), `RegionStatus` ([]RegionStatus), `SupportedRegions` ([]SupportedRegions), `AccountDetails` (*AccountDetails).

`AccountDetails` fields: `Name`, `AwsAccountID` (12-digit), `AwsRoleName` (max 64 chars), `CloudWatchGroupArn`, `EventBusName`, `ExternalID`, `LogInfoType` (`INFO`/`ERROR`), `TroubleShootingLogging`, `TrustedAccountID`, `TrustedRole`.

TF resource: `ztc_public_cloud_info`

#### account_groups

**Endpoint**: `/ztw/api/v1/accountGroups` (inferred from API docs)

Read-only access to AWS account groups. Standard Get/GetByName/GetAll pattern.

TF data source: `ztc_account_groups`

---

### Provisioning

#### provisioning_url

**Package**: `zscaler/ztw/services/provisioning/provisioning_url`  
**File**: `provisioning/provisioning_url/provisioning_url.go`  
**Endpoint**: `/ztw/api/v1/provUrl`

Manages provisioning URLs that Cloud Connector VMs fetch at boot.

| Function | Signature | Notes |
|---|---|---|
| `Get` | `(ctx, service, provUrlID int) (*ProvisioningURL, error)` | |
| `GetByName` | `(ctx, service, provUrlName string) (*ProvisioningURL, error)` | |
| `Create` | `(ctx, service, ProvURL *ProvisioningURL) (*ProvisioningURL, *http.Response, error)` | Uses `service.Client.Create` (not `CreateResource`) |
| `Update` | `(ctx, service, id int, provisioningUrl *ProvisioningURL) (*ProvisioningURL, *http.Response, error)` | Uses `service.Client.UpdateWithPut` (not `UpdateWithPutResource`) |
| `Delete` | `(ctx, service, id int) (*http.Response, error)` | Uses `service.Client.Delete` (not `DeleteResource`) |
| `GetAll` | `(ctx, service) ([]ProvisioningURL, error)` | |

`ProvisioningURL` fields: `ID`, `Name`, `Desc`, `ProvUrl` (computed URL), `ProvUrlType` (`ONPREM`/`CLOUD`), `LastModTime`, `Status`, `ProvUrlData` (ProvUrlData struct), `LastModUid`, `UsedInEcGroups`.

`ProvUrlData` key fields: `ZsCloudDomain`, `OrgID`, `ConfigServer`, `RegistrationServer`, `ApiServer`, `PacServer`, `CloudProviderType`, `FormFactor`, `LocationTemplate` (embedded `locationtemplate.LocationTemplate`), `AutoScaleDetails`, `CellEdgeDeploy`, `ReleaseChannel`.

TF resource: `ztc_provisioning_url`

Note: This package uses the non-`Resource` client methods (`Create`, `UpdateWithPut`, `Delete`) rather than `CreateResource` etc. This is inconsistent with other ZTW services.

#### api_keys

Directory exists; contents not inspected. Manages portal API keys.

#### public_cloud_account

**Package**: `zscaler/ztw/services/provisioning/public_cloud_account`  
**File**: `provisioning/public_cloud_account/public_cloud_account.go`  
**Endpoint**: `/ztw/api/v1/publicCloudAccountDetails`

Distinct from `partner_integrations/public_cloud_info` (which targets `/publicCloudInfo`). This package reads cloud account detail records. Contents not fully inspected beyond endpoint; appears to be an alternate or narrower view of public cloud account data compared to the full CRUD surface in `public_cloud_info`.

---

### Admin User and Role Management

**Package**: `zscaler/ztw/services/adminuserrolemgmt`  
**Sub-packages**: `adminroles/`, `adminusers/`

Manages admin RBAC in the Cloud Connector portal. Contents not directly inspected. Standard CRUD pattern expected.

---

### Workload Groups

**Package**: `zscaler/ztw/services/workload_groups`  
**File**: `workload_groups/workload_groups.go`  
**Endpoint**: `/ztw/api/v1/workloadGroups`

Workload groups (tag-based workload abstractions used in forwarding rule `src_workload_groups`). Create/Update/Delete are exported in the SDK source. However, the Terraform provider does not expose a resource for workload group mutation; IDs must be sourced from the ZIA provider (`zia_workload_groups` data source).

| Function | Signature | Notes |
|---|---|---|
| `Get` | `(ctx, service, workloadID int) (*WorkloadGroup, error)` | Uses `service.Client.Read` (not `ReadResource`) |
| `GetByName` | `(ctx, service, workloadName string) (*WorkloadGroup, error)` | |
| `GetAll` | `(ctx, service) ([]WorkloadGroup, error)` | |

`WorkloadGroup` fields: `ID`, `Name`, `Description`, `Expression` (string), `LastModifiedTime`, `LastModifiedBy`, `WorkloadTagExpression` (JSON: `expressionJson` — structured form of the expression).

`WorkloadTagExpression` → `ExpressionContainers[]` → each with `TagType`, `Operator`, `TagContainer` → `Tags[]` (key-value pairs), max 8 tags total.

Note: Create/Update/Delete are exported in the SDK (`vendor/zscaler-sdk-go/zscaler/ztw/services/workload_groups/workload_groups.go`). The Terraform provider does not expose a resource for workload group mutation; `src_workload_groups` IDs must be retrieved from the ZIA provider (`zia_workload_groups` data source).

No TF resource. No TF data source in ZTC provider (use ZIA's `zia_workload_groups`).

---

## Common types

Source: `vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go`

| Type | Fields | Usage |
|---|---|---|
| `IDName` | `ID int`, `Name string` | Basic name-ID pair |
| `CommonIDName` | `ID int`, `Name string` | Gateway references in rules (`ProxyGateway`, `DNSGateway`, `ZPAIPGroup`) |
| `IDNameExtensions` | `ID int`, `Name string`, `Extensions map[string]interface{}` | Location, EC group, and policy object references in rules |
| `CommonIDNameExternalID` | `ID int`, `Name string`, `IsNameL10nTag bool`, `Extensions map`, `Deleted bool`, `ExternalID string`, `AssociationTime int` | Immutable entity references (locations, templates) |
| `ECVMs` | VM detail: `ID`, `Name`, `Status`, `FormFactor`, `NATIP`, `ZiaGateway`, `ZpaBroker`, `BuildVersion`, upgrade timestamps, `ManagementNw`, `ECInstances` | Embedded in `EcGroup` |
| `ManagementNw` | `ID`, `IPStart`, `IPEnd`, `Netmask`, `DefaultGateway`, `NWType`, `DNS` | Network config for EC VMs and instances |
| `SupportedRegions` | `ID int`, `Name string`, `CloudType string` | Regions for workload discovery |
| `RegionStatus` | `ID int`, `Name string`, `CloudType string`, `Status bool` | Region operational status |
| `ZPAApplicationSegments` | `ID int`, `Name string`, `Description string`, `ZPAID int`, `Deleted bool` | ZPA app segment reference in forwarding rules |
| `ZPAApplicationSegmentGroups` | `ID int`, `Name string`, `ZPAID int`, `Deleted bool`, `ZPAAppSegmentsCount int` | ZPA app segment group reference |

Pagination helper:

```go
// common.ReadAllPages — all ZTW GetAll functions use this
func ReadAllPages[T any](ctx context.Context, client *zscaler.Client, endpoint string, list *[]T) error
// pageSize = 1000; stops when len(page) < 1000; applies JMESPath from context
```

---

## Common patterns

### Standard CRUD call

```go
import (
    "context"
    "github.com/zscaler/zscaler-sdk-go/v3/zscaler"
    "github.com/zscaler/zscaler-sdk-go/v3/zscaler/ztw/services/policyresources/ipdestinationgroups"
)

ctx := context.Background()

// Create
group := &ipdestinationgroups.IPDestinationGroups{
    Name:      "MyGroup",
    Type:      "DSTN_FQDN",
    Addresses: []string{"example.com"},
}
created, err := ipdestinationgroups.Create(ctx, service, group)

// Read by name
existing, err := ipdestinationgroups.GetByName(ctx, service, "MyGroup")

// Update
existing.Addresses = append(existing.Addresses, "other.com")
updated, _, err := ipdestinationgroups.Update(ctx, service, existing.ID, existing)

// Delete
_, err = ipdestinationgroups.Delete(ctx, service, existing.ID)
```

### Activation after mutations

```go
import "github.com/zscaler/zscaler-sdk-go/v3/zscaler/ztw/services/activation"

status, err := activation.UpdateActivationStatus(ctx, service, activation.ECAdminActivation{})
```

### JMESPath client-side filtering

```go
import "github.com/zscaler/zscaler-sdk-go/v3/zscaler"

ctx = zscaler.ContextWithJMESPath(ctx, "[?type=='DSTN_FQDN']")
groups, err := ipdestinationgroups.GetAll(ctx, service)
// groups contains only DSTN_FQDN entries
```

---

## Open questions register

1. **Duplicate DNS gateway packages**: `dns_gateway/dns_gateway.go` and `forwarding_gateways/dns_forwarding_gateway/dns_forwarding_gateway.go` both target `/ztw/api/v1/dnsGateways`. The `dns_gateway` package omits `*http.Response` from `Get`/`Create`/`Update` return signatures; the `dns_forwarding_gateway` package includes it. The `dns_gateway` package's struct omits the `Type` field present in the other. Which package is canonical for the Terraform provider is not confirmed from available sources — both exist in the SDK without clear deprecation notes.

2. **`provisioning_url` uses non-`Resource` methods**: `Create`, `UpdateWithPut`, and `Delete` in `provisioning_url` use the ZIA-style methods (`service.Client.Create`, not `CreateResource`). Source: `vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/provisioning_url/provisioning_url.go`. Whether this is intentional or a bug is not confirmed from available sources.

3. **Resolved 2026-04-26.** `workload_groups` Create/Update/Delete are NOT commented out in the current source. `vendor/zscaler-sdk-go/zscaler/ztw/services/workload_groups/workload_groups.go` exports `Create` (line 98), `Update` (line 113), and `Delete` (line 124). The earlier claim that they were "commented out" was inaccurate — the doc has been corrected above. However, the TF provider does not expose a resource for workload groups, and the note "likely authored in ZIA" still applies per TF docs.

4. **Resolved 2026-04-26.** `activation_cli` is a standalone CLI program, not a library package. `vendor/zscaler-sdk-go/zscaler/ztw/services/activation_cli/zconActivator.go` declares `package main` and contains a `main()` function that calls `activation.ForceActivationStatus`. It reads credentials from legacy environment variables (`ZCON_USERNAME`, `ZCON_PASSWORD`, `ZCON_API_KEY`, `ZCON_CLOUD`). It is not importable as a Go package — it is a command-line utility bundled with the SDK for force-activating ZTC configurations.

5. **Resolved 2026-04-26.** `public_cloud_account` and `public_cloud_info` target different endpoints and serve different purposes. `provisioning/public_cloud_account/` calls `/ztw/api/v1/publicCloudAccountDetails` (source: `vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/public_cloud_account/public_cloud_account.go`). `partner_integrations/public_cloud_info/` calls `/ztw/api/v1/publicCloudInfo` — this is the cloud account registration surface with full CRUD including `UpdatePublicCloudChangeState` and `GenerateExternalID`. The `public_cloud_account` package appears to be a precursor or alternative view of cloud account detail; the `public_cloud_info` package is the authoritative management surface.

6. **Resolved 2026-04-26.** `zparesources` exposes read-only access to ZPA Application Segments usable in traffic forwarding rules. Source: `vendor/zscaler-sdk-go/zscaler/ztw/services/policyresources/zparesources/zparesources.go` — exports `GetZPAApplicationSegments`. This addresses the hardcoded-ID limitation in `ztc_traffic_forwarding_rule`: callers can look up ZPA Application Segment IDs via this function rather than hardcoding them. No write operations are present.

7. **Resolved 2026-04-26.** `workload_groups.Get` calls `service.Client.Read` (not `ReadResource`) — confirmed in `vendor/zscaler-sdk-go/zscaler/ztw/services/workload_groups/workload_groups.go`. This is inconsistent with the ZTW convention of using `ReadResource` for GET operations. The workload groups endpoint may use the ZIA-compatible request path rather than the ZTW Resource-suffixed path; the exact reason is not documented in available sources.

8. **Supported cloud environments**: OneAPI is documented as unavailable for `zscalergov` and `zscalerten`. Whether the SDK surfaces this restriction as an error or silently falls back to legacy auth for those clouds is not confirmed from available sources.

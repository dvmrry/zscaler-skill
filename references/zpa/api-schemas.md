---
product: zpa
topic: "api-schemas"
title: "ZPA API resource schemas"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: f38edc59c5c6d05a13fe2cc88d6782e349276586
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/**"
  - "vendor/zscaler-sdk-python/pyproject.toml"
  - "vendor/zscaler-sdk-python/zscaler/zpa/**"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
  - "vendor/terraform-provider-zpa/zpa/**"
author-status: draft
---

# ZPA API resource schemas

Resource-level schemas for the ZPA management API, extracted directly from the Go SDK service layer (the canonical implementation, since ZPA OneAPI web documentation does not exist).

**Cross-references:**
- Endpoint paths: [`./legacy-endpoints.md`](./legacy-endpoints.md)
- Auth flow: [`../shared/legacy-api.md`](../shared/legacy-api.md)


## AdminSSOLoginOptions

**Service:** `admin_sso_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SSOLoginOnly | ssologinonly | bool | ✓ |  |

## AdministratorController

**Service:** `administrator_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Username | username | string | ✓ |  |
| DisplayName | displayName | string | ✓ |  |
| Email | email | string | ✓ |  |
| Timezone | timezone | string | ✓ |  |
| Password | password | string | ✓ |  |
| TmpPassword | tmpPassword | string | ✓ |  |
| RoleId | roleId | string | ✓ |  |
| Comments | comments | string | ✓ |  |
| LanguageCode | languageCode | string | ✓ |  |
| Eula | eula | string | ✓ |  |
| IsEnabled | isEnabled | bool | ✓ |  |
| ForcePwdChange | forcePwdChange | bool | ✓ |  |
| TwoFactorAuthEnabled | twoFactorAuthEnabled | bool | ✓ |  |
| TwoFactorAuthType | twoFactorAuthType | string | ✓ |  |
| TokenId | tokenId | string | ✓ |  |
| PhoneNumber | phoneNumber | string | ✓ |  |
| LocalLoginDisabled | localLoginDisabled | bool | ✓ |  |
| PinSession | pinSession | bool | ✓ |  |
| IsLocked | isLocked | bool | ✓ |  |
| SyncVersion | syncVersion | string | ✓ |  |
| DeliveryTag | deliveryTag | string | ✓ |  |
| OperationType | operationType | string | ✓ |  |
| GroupIds | groupIds | []string | ✓ |  |
| MicrotenantId | microtenantId | string | ✓ |  |
| MicrotenantName | microtenantName | string | ✓ |  |
| Role | role | Role | ✓ |  |

## Role

**Service:** `administrator_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |

## APIKeys

**Service:** `api_keys`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ClientID | clientId | string | ✓ |  |
| ClientSecret | clientSecret | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| IamClientId | iamClientId | string | ✓ |  |
| ID | id | string | ✓ |  |
| IsLocked | isLocked | bool | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| PinSessionEnabled | pinSessionEnabled | bool | ✓ |  |
| ReadOnly | readOnly | bool | ✓ |  |
| RestrictionType | restrictionType | string | ✓ |  |
| RoleID | roleId | string | ✓ |  |
| MicrotenantId | microtenantId | string | ✓ |  |
| MicrotenantName | microtenantName | string | ✓ |  |
| SyncVersion | syncVersion | string | ✓ |  |
| TokenExpiryTimeInSec | tokenExpiryTimeInSec | string | ✓ |  |
| ZscalerManaged | zscalerManaged | bool | ✓ |  |

## AppConnector

**Service:** `appconnectorcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ApplicationStartTime | applicationStartTime | string | ✓ |  |
| AppConnectorGroupID | appConnectorGroupId | string | ✓ |  |
| AppConnectorGroupName | appConnectorGroupName | string | ✓ |  |
| AssistantVersion | assistantVersion | AssistantVersion | ✓ |  |
| ControlChannelStatus | controlChannelStatus | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| CtrlBrokerName | ctrlBrokerName | string | ✓ |  |
| CurrentVersion | currentVersion | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| ExpectedUpgradeTime | expectedUpgradeTime | string | ✓ |  |
| ExpectedVersion | expectedVersion | string | ✓ |  |
| Fingerprint | fingerprint | string | ✓ |  |
| ID | id | string | ✓ |  |
| IPACL | ipAcl | string | ✓ |  |
| IssuedCertID | issuedCertId | string | ✓ |  |
| LastBrokerConnectTime | lastBrokerConnectTime | string | ✓ |  |
| LastBrokerConnectTimeDuration | lastBrokerConnectTimeDuration | string | ✓ |  |
| LastBrokerDisconnectTime | lastBrokerDisconnectTime | string | ✓ |  |
| LastBrokerDisconnectTimeDuration | lastBrokerDisconnectTimeDuration | string | ✓ |  |
| LastUpgradeTime | lastUpgradeTime | string | ✓ |  |
| Latitude | latitude | string | ✓ |  |
| Location | location | string | ✓ |  |
| Longitude | longitude | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| ProvisioningKeyID | provisioningKeyId | string |  |  |
| ProvisioningKeyName | provisioningKeyName | string |  |  |
| Platform | platform | string | ✓ |  |
| PlatformDetail | platformDetail | string | ✓ |  |
| PreviousVersion | previousVersion | string | ✓ |  |
| PrivateIP | privateIp | string | ✓ |  |
| PublicIP | publicIp | string | ✓ |  |
| RuntimeOS | runtimeOS | string | ✓ |  |
| SargeVersion | sargeVersion | string | ✓ |  |

## AssistantVersion

**Service:** `appconnectorcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| ApplicationStartTime | applicationStartTime | string | ✓ |  |
| AppConnectorGroupID | appConnectorGroupId | string | ✓ |  |
| BrokerId | brokerId | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| CtrlChannelStatus | ctrlChannelStatus | string | ✓ |  |
| CurrentVersion | currentVersion | string | ✓ |  |
| DisableAutoUpdate | disableAutoUpdate | bool | ✓ |  |
| ExpectedVersion | expectedVersion | string | ✓ |  |
| LastBrokerConnectTime | lastBrokerConnectTime | string | ✓ |  |
| LastBrokerDisconnectTime | lastBrokerDisconnectTime | string | ✓ |  |
| LastUpgradedTime | lastUpgradedTime | string | ✓ |  |
| LoneWarrior | loneWarrior | bool | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Latitude | latitude | string | ✓ |  |
| Longitude | longitude | string | ✓ |  |
| MtunnelID | mtunnelId | string | ✓ |  |
| Platform | platform | string | ✓ |  |
| PlatformDetail | platformDetail | string | ✓ |  |
| PreviousVersion | previousVersion | string | ✓ |  |
| PrivateIP | privateIp | string | ✓ |  |
| PublicIP | publicIp | string | ✓ |  |
| RestartTimeInSec | restartTimeInSec | string | ✓ |  |
| RuntimeOS | runtimeOS | string | ✓ |  |
| SargeVersion | sargeVersion | string | ✓ |  |
| SystemStartTime | systemStartTime | string | ✓ |  |
| UpgradeAttempt | upgradeAttempt | string | ✓ |  |
| UpgradeStatus | upgradeStatus | string | ✓ |  |
| UpgradeNowOnce | upgradeNowOnce | bool | ✓ |  |

## AppConnectorGroup

**Service:** `appconnectorgroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| CityCountry | cityCountry | string |  |  |
| CountryCode | countryCode | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| DNSQueryType | dnsQueryType | string | ✓ |  |
| ConnectorGroupType | connectorGroupType | string | ✓ |  |
| GeoLocationID | geoLocationId | string | ✓ |  |
| Latitude | latitude | string | ✓ |  |
| Location | location | string | ✓ |  |
| Longitude | longitude | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| OverrideVersionProfile | overrideVersionProfile | bool |  |  |
| PRAEnabled | praEnabled | bool |  |  |
| WAFDisabled | wafDisabled | bool |  |  |
| UpgradeDay | upgradeDay | string | ✓ |  |
| UpgradeTimeInSecs | upgradeTimeInSecs | string | ✓ |  |
| VersionProfileID | versionProfileId | string | ✓ |  |
| VersionProfileName | versionProfileName | string | ✓ |  |
| VersionProfileVisibilityScope | versionProfileVisibilityScope | string | ✓ |  |
| TCPQuickAckApp | tcpQuickAckApp | bool |  |  |
| TCPQuickAckAssistant | tcpQuickAckAssistant | bool |  |  |
| UseInDrMode | useInDrMode | bool |  |  |
| TCPQuickAckReadAssistant | tcpQuickAckReadAssistant | bool |  |  |
| LSSAppConnectorGroup | lssAppConnectorGroup | bool |  |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| SiteID | siteId | string | ✓ |  |
| SiteName | siteName | string | ✓ |  |
| ReadOnly | readOnly | bool | ✓ |  |
| RestrictionType | restrictionType | string | ✓ |  |
| ZscalerManaged | zscalerManaged | bool | ✓ |  |
| DCHostingInfo | dcHostingInfo | string |  |  |
| NameWithoutTrim | nameWithoutTrim | string | ✓ |  |
| AppServerGroup | serverGroups | []AppServerGroup | ✓ |  |
| Connectors | connectors | []appconnectorcontroller.AppConnector | ✓ |  |
| NPAssistantGroup | npAssistantGroup | NPAssistantGroup | ✓ |  |
| EnrollmentCertID | enrollmentCertId | string | ✓ |  |

## AppServerGroup

**Service:** `appconnectorgroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ConfigSpace | configSpace | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| ID | id | string | ✓ |  |
| DynamicDiscovery | dynamicDiscovery | bool | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |

## LanSubnet

**Service:** `appconnectorgroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| AppConnectorGroupID | appConnectorGroupId | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| NPDnsNsRecord | npDnsNsRecord | NPDnsNsRecord | ✓ |  |
| OldAuditString | oldAuditString | string | ✓ |  |
| Subnet | subnet | string | ✓ |  |
| NPServerIPs | npserverips | []string | ✓ |  |
| FQDNs | fqdns | []string | ✓ |  |

## NPAssistantGroup

**Service:** `appconnectorgroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| AppConnectorGroupID | appConnectorGroupId | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| MTU | mtu | string | ✓ |  |
| LanSubnets | lanSubnets | []LanSubnet | ✓ |  |

## NPDnsNsRecord

**Service:** `appconnectorgroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | string | ✓ |  |
| FQDN | fqdn | []string | ✓ |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| NameserverIPs | nameserverIps | []string | ✓ |  |

## AssistantSchedule

**Service:** `appconnectorschedule`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| CustomerID | customerId | string |  |  |
| DeleteDisabled | deleteDisabled | bool |  |  |
| Enabled | enabled | bool |  |  |
| Frequency | frequency | string |  |  |
| FrequencyInterval | frequencyInterval | string |  |  |

## AppServerGroups

**Service:** `applicationsegment`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ConfigSpace | configSpace | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| ID | id | string | ✓ |  |
| DynamicDiscovery | dynamicDiscovery | bool |  |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string |  |  |

## ApplicationMappings

**Service:** `applicationsegment`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Name | name | string | ✓ |  |
| Type | type | string | ✓ |  |

## ApplicationSegmentResource

**Service:** `applicationsegment`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| DomainNames | domainNames | []string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| ExtranetEnabled | extranetEnabled | bool |  |  |
| APIProtectionEnabled | apiProtectionEnabled | bool |  |  |
| AutoAppProtectEnabled | autoAppProtectEnabled | bool |  |  |
| ADPEnabled | adpEnabled | bool |  |  |
| PassiveHealthEnabled | passiveHealthEnabled | bool |  |  |
| DoubleEncrypt | doubleEncrypt | bool |  |  |
| ConfigSpace | configSpace | string | ✓ |  |
| Applications | applications | string | ✓ |  |
| BypassType | bypassType | string | ✓ |  |
| BypassOnReauth | bypassOnReauth | bool |  |  |
| HealthCheckType | healthCheckType | string | ✓ |  |
| IsCnameEnabled | isCnameEnabled | bool |  |  |
| IpAnchored | ipAnchored | bool |  |  |
| FQDNDnsCheck | fqdnDnsCheck | bool |  |  |
| HealthReporting | healthReporting | string | ✓ |  |
| SelectConnectorCloseToApp | selectConnectorCloseToApp | bool |  |  |
| IcmpAccessType | icmpAccessType | string | ✓ |  |
| AppRecommendationId | appRecommendationId | string | ✓ |  |
| SegmentGroupID | segmentGroupId | string |  |  |
| SegmentGroupName | segmentGroupName | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| TCPKeepAlive | tcpKeepAlive | string | ✓ |  |
| IsIncompleteDRConfig | isIncompleteDRConfig | bool |  |  |
| UseInDrMode | useInDrMode | bool |  |  |
| InspectTrafficWithZia | inspectTrafficWithZia | bool |  |  |
| WeightedLoadBalancing | weightedLoadBalancing | bool |  |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| MatchStyle | matchStyle | string | ✓ |  |
| ReadOnly | readOnly | bool | ✓ |  |
| RestrictionType | restrictionType | string | ✓ |  |
| ZscalerManaged | zscalerManaged | bool | ✓ |  |
| TCPPortRanges | tcpPortRanges | []string |  |  |
| UDPPortRanges | udpPortRanges | []string |  |  |
| TCPAppPortRange | tcpPortRange | []common.NetworkPorts | ✓ |  |
| UDPAppPortRange | udpPortRange | []common.NetworkPorts | ✓ |  |
| ServerGroups | serverGroups | []servergroup.ServerGroup |  |  |
| DefaultIdleTimeout | defaultIdleTimeout | string | ✓ |  |
| DefaultMaxAge | defaultMaxAge | string | ✓ |  |
| ClientlessApps | clientlessApps | []applicationsegmentbrowseraccess.ClientlessApps | ✓ |  |
| ShareToMicrotenants | shareToMicrotenants | []string |  |  |
| SharedMicrotenantDetails | sharedMicrotenantDetails | SharedMicrotenantDetails | ✓ |  |
| ZPNERID | zpnErId | *common.ZPNERID |  |  |
| Tags | tags | []Tag | ✓ |  |
| PolicyStyle | policyStyle | string | ✓ |  |

## ApplicationToServerGroupMapping

**Service:** `applicationsegment`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Name | name | string |  |  |
| Passive | passive | bool |  |  |
| Weight | weight | string |  |  |

## ApplicationValidationError

**Service:** `applicationsegment`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Params | params | []string |  |  |
| ID | id | string |  |  |
| Reason | reason | string |  |  |

## BulkUpdateMultiMatchPayload

**Service:** `applicationsegment`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ApplicationIDs | applicationIds | []int |  |  |
| MatchStyle | matchStyle | string |  |  |

## SharedFromMicrotenant

**Service:** `applicationsegment`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## SharedMicrotenantDetails

**Service:** `applicationsegment`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SharedFromMicrotenant | sharedFromMicrotenant | SharedFromMicrotenant | ✓ |  |
| SharedToMicrotenants | sharedToMicrotenants | []SharedToMicrotenant | ✓ |  |

## SharedToMicrotenant

**Service:** `applicationsegment`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## Tag

**Service:** `applicationsegment`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Namespace | namespace | common.CommonSummary | ✓ |  |
| TagKey | tagKey | common.CommonSummary | ✓ |  |
| TagValue | tagValue | common.CommonIDName | ✓ |  |
| Origin | origin | string | ✓ |  |

## WeightedLoadBalancerConfig

**Service:** `applicationsegment`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ApplicationID | applicationId | string |  |  |
| ApplicationToServerGroupMaps | applicationToServerGroupMappings | []ApplicationToServerGroupMapping |  |  |
| WeightedLoadBalancing | weightedLoadBalancing | bool |  |  |

## AppSegmentSharedToMicrotenant

**Service:** `applicationsegment_share`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ApplicationID | applicationId | string | ✓ |  |
| ShareToMicrotenants | shareToMicrotenants | []string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |

## BrowserAccess

**Service:** `applicationsegmentbrowseraccess`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| SegmentGroupID | segmentGroupId | string | ✓ |  |
| SegmentGroupName | segmentGroupName | string | ✓ |  |
| BypassType | bypassType | string | ✓ |  |
| BypassOnReauth | bypassOnReauth | bool |  |  |
| ExtranetEnabled | extranetEnabled | bool |  |  |
| AppRecommendationId | appRecommendationId | string | ✓ |  |
| MatchStyle | matchStyle | string | ✓ |  |
| ConfigSpace | configSpace | string | ✓ |  |
| DomainNames | domainNames | []string | ✓ |  |
| Enabled | enabled | bool |  |  |
| PassiveHealthEnabled | passiveHealthEnabled | bool |  |  |
| FQDNDnsCheck | fqdnDnsCheck | bool |  |  |
| APIProtectionEnabled | apiProtectionEnabled | bool |  |  |
| SelectConnectorCloseToApp | selectConnectorCloseToApp | bool |  |  |
| DoubleEncrypt | doubleEncrypt | bool |  |  |
| HealthCheckType | healthCheckType | string | ✓ |  |
| IsCnameEnabled | isCnameEnabled | bool |  |  |
| IPAnchored | ipAnchored | bool |  |  |
| TCPKeepAlive | tcpKeepAlive | string | ✓ |  |
| IsIncompleteDRConfig | isIncompleteDRConfig | bool |  |  |
| UseInDrMode | useInDrMode | bool |  |  |
| InspectTrafficWithZia | inspectTrafficWithZia | bool |  |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| HealthReporting | healthReporting | string | ✓ |  |
| ICMPAccessType | icmpAccessType | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| ReadOnly | readOnly | bool | ✓ |  |
| RestrictionType | restrictionType | string | ✓ |  |
| ZscalerManaged | zscalerManaged | bool | ✓ |  |
| WeightedLoadBalancing | weightedLoadBalancing | bool | ✓ |  |
| TCPPortRanges | tcpPortRanges | []string | ✓ |  |
| UDPPortRanges | udpPortRanges | []string | ✓ |  |
| TCPAppPortRange | tcpPortRange | []common.NetworkPorts | ✓ |  |
| UDPAppPortRange | udpPortRange | []common.NetworkPorts | ✓ |  |
| ClientlessApps | clientlessApps | []ClientlessApps | ✓ |  |
| AppServerGroups | serverGroups | []servergroup.ServerGroup | ✓ |  |
| SharedMicrotenantDetails | sharedMicrotenantDetails | SharedMicrotenantDetails | ✓ |  |
| PolicyStyle | policyStyle | string | ✓ |  |
| ZPNERID | zpnErId | *common.ZPNERID |  |  |

## ClientlessApps

**Service:** `applicationsegmentbrowseraccess`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AllowOptions | allowOptions | bool |  |  |
| AppID | appId | string | ✓ |  |
| ApplicationPort | applicationPort | string | ✓ |  |
| ApplicationProtocol | applicationProtocol | string | ✓ |  |
| CertificateID | certificateId | string | ✓ |  |
| CertificateName | certificateName | string | ✓ |  |
| Cname | cname | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| Domain | domain | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| Hidden | hidden | bool |  |  |
| ID | id | string | ✓ |  |
| LocalDomain | localDomain | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| Path | path | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| TrustUntrustedCert | trustUntrustedCert | bool |  |  |
| ExtDomain | extDomain | string |  |  |
| ExtLabel | extLabel | string |  |  |
| ExtDomainName | extDomainName | string |  |  |
| ExtID | extId | string |  |  |

## SharedFromMicrotenant

**Service:** `applicationsegmentbrowseraccess`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## SharedMicrotenantDetails

**Service:** `applicationsegmentbrowseraccess`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SharedFromMicrotenant | sharedFromMicrotenant | SharedFromMicrotenant | ✓ |  |
| SharedToMicrotenants | sharedToMicrotenants | []SharedToMicrotenant | ✓ |  |

## SharedToMicrotenant

**Service:** `applicationsegmentbrowseraccess`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## AppSegmentBaseAppDto

**Service:** `applicationsegmentbytype`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| AppID | appId | string | ✓ |  |
| Name | name | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| Domain | domain | string | ✓ |  |
| ApplicationPort | applicationPort | string | ✓ |  |
| ApplicationProtocol | applicationProtocol | string | ✓ |  |
| CertificateID | certificateId | string | ✓ |  |
| CertificateName | certificateName | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |

## AppSegmentInspection

**Service:** `applicationsegmentinspection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| SegmentGroupID | segmentGroupId | string | ✓ |  |
| SegmentGroupName | segmentGroupName | string | ✓ |  |
| BypassType | bypassType | string | ✓ |  |
| BypassOnReauth | bypassOnReauth | bool | ✓ |  |
| ConfigSpace | configSpace | string | ✓ |  |
| DomainNames | domainNames | []string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| AdpEnabled | adpEnabled | bool | ✓ |  |
| AppRecommendationId | appRecommendationId | string | ✓ |  |
| AutoAppProtectEnabled | autoAppProtectEnabled | bool | ✓ |  |
| ICMPAccessType | icmpAccessType | string | ✓ |  |
| PassiveHealthEnabled | passiveHealthEnabled | bool | ✓ |  |
| FQDNDnsCheck | fqdnDnsCheck | bool |  |  |
| APIProtectionEnabled | apiProtectionEnabled | bool |  |  |
| ExtranetEnabled | extranetEnabled | bool |  |  |
| MatchStyle | matchStyle | string | ✓ |  |
| SelectConnectorCloseToApp | selectConnectorCloseToApp | bool |  |  |
| DoubleEncrypt | doubleEncrypt | bool |  |  |
| HealthCheckType | healthCheckType | string | ✓ |  |
| IsCnameEnabled | isCnameEnabled | bool |  |  |
| IPAnchored | ipAnchored | bool |  |  |
| HealthReporting | healthReporting | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| TCPKeepAlive | tcpKeepAlive | string | ✓ |  |
| IsIncompleteDRConfig | isIncompleteDRConfig | bool |  |  |
| UseInDrMode | useInDrMode | bool |  |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| ReadOnly | readOnly | bool | ✓ |  |
| RestrictionType | restrictionType | string | ✓ |  |
| ZscalerManaged | zscalerManaged | bool | ✓ |  |
| WeightedLoadBalancing | weightedLoadBalancing | bool | ✓ |  |
| TCPPortRanges | tcpPortRanges | []string | ✓ |  |
| UDPPortRanges | udpPortRanges | []string | ✓ |  |
| TCPAppPortRange | tcpPortRange | []common.NetworkPorts | ✓ |  |
| UDPAppPortRange | udpPortRange | []common.NetworkPorts | ✓ |  |
| TCPProtocols | tcpProtocols | []string |  |  |
| UDPProtocols | udpProtocols | []string | ✓ |  |
| InspectionAppDto | inspectionApps | []InspectionAppDto | ✓ |  |
| CommonAppsDto | commonAppsDto | CommonAppsDto | ✓ |  |
| AppServerGroups | serverGroups | []servergroup.ServerGroup | ✓ |  |
| PolicyStyle | policyStyle | string | ✓ |  |
| SharedMicrotenantDetails | sharedMicrotenantDetails | SharedMicrotenantDetails | ✓ |  |

## AppServerGroups

**Service:** `applicationsegmentinspection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |

## AppsConfig

**Service:** `applicationsegmentinspection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| AppID | appId | string | ✓ |  |
| InspectAppID | inspectAppId | string |  |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| AdpEnabled | adpEnabled | bool |  |  |
| AllowOptions | allowOptions | bool |  |  |
| AppTypes | appTypes | []string | ✓ |  |
| ApplicationPort | applicationPort | string | ✓ |  |
| ApplicationProtocol | applicationProtocol | string | ✓ |  |
| Protocols | protocols | []string | ✓ |  |
| CertificateID | certificateId | string | ✓ |  |
| CertificateName | certificateName | string | ✓ |  |
| Cname | cname | string | ✓ |  |
| Domain | domain | string | ✓ |  |
| Hidden | hidden | bool |  |  |
| TrustUntrustedCert | trustUntrustedCert | bool |  |  |
| LocalDomain | localDomain | string | ✓ |  |
| Portal | portal | bool |  |  |

## InspectionAppDto

**Service:** `applicationsegmentinspection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| AppID | appId | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| ApplicationPort | applicationPort | string | ✓ |  |
| ApplicationProtocol | applicationProtocol | string | ✓ |  |
| CertificateID | certificateId | string | ✓ |  |
| CertificateName | certificateName | string | ✓ |  |
| Domain | domain | string | ✓ |  |
| Protocols | protocols | []string | ✓ |  |
| TrustUntrustedCert | trustUntrustedCert | bool |  |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |

## SharedFromMicrotenant

**Service:** `applicationsegmentinspection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## SharedMicrotenantDetails

**Service:** `applicationsegmentinspection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SharedFromMicrotenant | sharedFromMicrotenant | SharedFromMicrotenant | ✓ |  |
| SharedToMicrotenants | sharedToMicrotenants | []SharedToMicrotenant | ✓ |  |

## SharedToMicrotenant

**Service:** `applicationsegmentinspection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## AppSegmentPRA

**Service:** `applicationsegmentpra`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| DomainNames | domainNames | []string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| PassiveHealthEnabled | passiveHealthEnabled | bool |  |  |
| SelectConnectorCloseToApp | selectConnectorCloseToApp | bool |  |  |
| DoubleEncrypt | doubleEncrypt | bool |  |  |
| AppRecommendationId | appRecommendationId | string | ✓ |  |
| ConfigSpace | configSpace | string | ✓ |  |
| Applications | applications | string | ✓ |  |
| BypassType | bypassType | string | ✓ |  |
| MatchStyle | matchStyle | string | ✓ |  |
| BypassOnReauth | bypassOnReauth | bool | ✓ |  |
| FQDNDnsCheck | fqdnDnsCheck | bool |  |  |
| ExtranetEnabled | extranetEnabled | bool |  |  |
| APIProtectionEnabled | apiProtectionEnabled | bool |  |  |
| HealthCheckType | healthCheckType | string | ✓ |  |
| IsCnameEnabled | isCnameEnabled | bool |  |  |
| IpAnchored | ipAnchored | bool |  |  |
| HealthReporting | healthReporting | string | ✓ |  |
| IcmpAccessType | icmpAccessType | string | ✓ |  |
| SegmentGroupID | segmentGroupId | string |  |  |
| SegmentGroupName | segmentGroupName | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| TCPKeepAlive | tcpKeepAlive | string | ✓ |  |
| IsIncompleteDRConfig | isIncompleteDRConfig | bool |  |  |
| UseInDrMode | useInDrMode | bool |  |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| ReadOnly | readOnly | bool | ✓ |  |
| RestrictionType | restrictionType | string | ✓ |  |
| ZscalerManaged | zscalerManaged | bool | ✓ |  |
| WeightedLoadBalancing | weightedLoadBalancing | bool | ✓ |  |
| TCPAppPortRange | tcpPortRange | []common.NetworkPorts | ✓ |  |
| UDPAppPortRange | udpPortRange | []common.NetworkPorts | ✓ |  |
| TCPPortRanges | tcpPortRanges | []string | ✓ |  |
| UDPPortRanges | udpPortRanges | []string | ✓ |  |
| ServerGroups | serverGroups | []servergroup.ServerGroup | ✓ |  |
| DefaultIdleTimeout | defaultIdleTimeout | string | ✓ |  |
| DefaultMaxAge | defaultMaxAge | string | ✓ |  |
| PRAApps | praApps | []PRAApps |  |  |
| CommonAppsDto | commonAppsDto | CommonAppsDto |  |  |
| SharedMicrotenantDetails | sharedMicrotenantDetails | SharedMicrotenantDetails | ✓ |  |
| PolicyStyle | policyStyle | string | ✓ |  |
| ZPNERID | zpnErId | *common.ZPNERID |  |  |

## AppServerGroups

**Service:** `applicationsegmentpra`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |

## AppsConfig

**Service:** `applicationsegmentpra`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| AppID | appId | string |  |  |
| PRAAppID | praAppId | string |  |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| AppTypes | appTypes | []string | ✓ |  |
| ApplicationPort | applicationPort | string | ✓ |  |
| ApplicationProtocol | applicationProtocol | string | ✓ |  |
| Cname | cname | string | ✓ |  |
| ConnectionSecurity | connectionSecurity | string | ✓ |  |
| Domain | domain | string | ✓ |  |
| Hidden | hidden | bool | ✓ |  |
| LocalDomain | localDomain | string | ✓ |  |
| Portal | portal | bool | ✓ |  |

## PRAApps

**Service:** `applicationsegmentpra`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| AppID | appId | string |  |  |
| ApplicationPort | applicationPort | string | ✓ |  |
| ApplicationProtocol | applicationProtocol | string | ✓ |  |
| CertificateID | certificateId | string | ✓ |  |
| CertificateName | certificateName | string | ✓ |  |
| ConnectionSecurity | connectionSecurity | string | ✓ |  |
| Hidden | hidden | bool |  |  |
| Portal | portal | bool |  |  |
| Description | description | string | ✓ |  |
| Domain | domain | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |

## SharedFromMicrotenant

**Service:** `applicationsegmentpra`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## SharedMicrotenantDetails

**Service:** `applicationsegmentpra`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SharedFromMicrotenant | sharedFromMicrotenant | SharedFromMicrotenant | ✓ |  |
| SharedToMicrotenants | sharedToMicrotenants | []SharedToMicrotenant | ✓ |  |

## SharedToMicrotenant

**Service:** `applicationsegmentpra`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## ApplicationServer

**Service:** `appservercontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Address | address | string |  |  |
| AppServerGroupIds | appServerGroupIds | []string |  |  |
| ConfigSpace | configSpace | string | ✓ |  |
| CreationTime | creationTime | string |  |  |
| Description | description | string |  |  |
| Enabled | enabled | bool |  |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string |  |  |
| ModifiedTime | modifiedTime | string |  |  |
| Name | name | string |  |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |

## BaCertificate

**Service:** `bacertificate`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| CName | cName | string | ✓ |  |
| CertChain | certChain | string | ✓ |  |
| CertBlob | certBlob | string | ✓ |  |
| Certificate | certificate | string | ✓ |  |
| PublicKey | publicKey | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| IssuedBy | issuedBy | string | ✓ |  |
| IssuedTo | issuedTo | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| San | san | []string | ✓ |  |
| SerialNo | serialNo | string | ✓ |  |
| Status | status | string | ✓ |  |
| ValidFromInEpochSec | validFromInEpochSec | string | ✓ |  |
| ValidToInEpochSec | validToInEpochSec | string | ✓ |  |
| MicrotenantID | microtenantId | string | ✓ |  |
| MicrotenantName | microtenantName | string | ✓ |  |

## BranchConnector

**Service:** `branch_connector`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| BranchConnectorGroupID | branchConnectorGroupId | string | ✓ |  |
| BranchConnectorGroupName | branchConnectorGroupName | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| EdgeConnectorGroupID | edgeConnectorGroupId | string | ✓ |  |
| EdgeConnectorGroupName | edgeConnectorGroupName | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| Fingerprint | fingerprint | string | ✓ |  |
| ID | id | string | ✓ |  |
| IpAcl | ipAcl | []string | ✓ |  |
| IssuedCertID | issuedCertId | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |

## BrowserCriteria

**Service:** `browser_protection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| BrowserEng | browser_eng | bool | ✓ |  |
| BrowserEngVer | browser_eng_ver | bool | ✓ |  |
| BrowserName | browser_name | bool | ✓ |  |
| BrowserVersion | browser_version | bool | ✓ |  |
| Canvas | canvas | bool | ✓ |  |
| FlashVer | flash_ver | bool | ✓ |  |
| FpUsrAgentStr | fp_usr_agent_str | bool | ✓ |  |
| IsCookie | is_cookie | bool | ✓ |  |
| IsLocalStorage | is_local_storage | bool | ✓ |  |
| IsSessStorage | is_sess_storage | bool | ✓ |  |
| Ja3 | ja3 | bool | ✓ |  |
| Mime | mime | bool | ✓ |  |
| Plugin | plugin | bool | ✓ |  |
| SilverlightVer | silverlight_ver | bool | ✓ |  |

## BrowserProtection

**Service:** `browser_protection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | string | ✓ |  |
| Criteria | criteria | Criteria | ✓ |  |
| CriteriaFlagsMask | criteriaFlagsMask | string | ✓ |  |
| DefaultCSP | defaultCSP | bool | ✓ |  |
| Description | description | string | ✓ |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |

## Criteria

**Service:** `browser_protection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| FingerPrintCriteria | fingerPrintCriteria | FingerPrintCriteria | ✓ |  |

## FingerPrintCriteria

**Service:** `browser_protection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Browser | browser | BrowserCriteria | ✓ |  |
| CollectLocation | collect_location | bool | ✓ |  |
| FingerprintTimeout | fingerprint_timeout | string | ✓ |  |
| Location | location | LocationCriteria | ✓ |  |
| System | system | SystemCriteria | ✓ |  |

## LocationCriteria

**Service:** `browser_protection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Lat | lat | bool | ✓ |  |
| Lon | lon | bool | ✓ |  |

## SystemCriteria

**Service:** `browser_protection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AvailScreenResolution | avail_screen_resolution | bool | ✓ |  |
| CPUArch | cpu_arch | bool | ✓ |  |
| CurrScreenResolution | curr_screen_resolution | bool | ✓ |  |
| Font | font | bool | ✓ |  |
| JavaVer | java_ver | bool | ✓ |  |
| MobileDevType | mobile_dev_type | bool | ✓ |  |
| MonitorMobile | monitor_mobile | bool | ✓ |  |
| OSName | os_name | bool | ✓ |  |
| OSVersion | os_version | bool | ✓ |  |
| SysLang | sys_lang | bool | ✓ |  |
| Tz | tz | bool | ✓ |  |
| UsrLang | usr_lang | bool | ✓ |  |

## IPRanges

**Service:** `c2c_ip_ranges`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AvailableIps | availableIps | string | ✓ |  |
| CountryCode | countryCode | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| CustomerId | customerId | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| ID | id | string | ✓ |  |
| IpRangeBegin | ipRangeBegin | string | ✓ |  |
| IpRangeEnd | ipRangeEnd | string | ✓ |  |
| IsDeleted | isDeleted | string | ✓ |  |
| LatitudeInDb | latitudeInDb | string | ✓ |  |
| Location | location | string | ✓ |  |
| LocationHint | locationHint | string | ✓ |  |
| LongitudeInDb | longitudeInDb | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| SccmFlag | sccmFlag | bool | ✓ |  |
| SubnetCidr | subnetCidr | string | ✓ |  |
| TotalIps | totalIps | string | ✓ |  |
| UsedIps | usedIps | string | ✓ |  |

## ClientSettings

**Service:** `client_settings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ClientCertificateType | clientCertificateType | string | ✓ |  |
| SingningCertExpiryInEpochSec | singningCertExpiryInEpochSec | string | ✓ |  |
| Name | name | string | ✓ |  |
| EnrollmentCertId | enrollmentCertId | string | ✓ |  |
| EnrollmentCertName | enrollmentCertName | string | ✓ |  |

## ClientTypes

**Service:** `clienttypes`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ZPNClientTypeExplorer | zpn_client_type_exporter | string |  |  |
| ZPNClientTypeNoAuth | zpn_client_type_exporter_noauth | string |  |  |
| ZPNClientTypeBrowserIsolation | zpn_client_type_browser_isolation | string |  |  |
| ZPNClientTypeMachineTunnel | zpn_client_type_machine_tunnel | string |  |  |
| ZPNClientTypeIPAnchoring | zpn_client_type_ip_anchoring | string |  |  |
| ZPNClientTypeEdgeConnector | zpn_client_type_edge_connector | string |  |  |
| ZPNClientTypeZAPP | zpn_client_type_zapp | string |  |  |
| ZPNClientTypeSlogger | zpn_client_type_slogger | string |  |  |
| ZPNClientTypeBranchConnector | zpn_client_type_branch_connector | string |  |  |
| ZPNClientTypePartner | zpn_client_type_zapp_partner | string |  |  |
| ZPNClientTypeVDI | zpn_client_type_vdi | string |  |  |
| ZPNClientTypeZIAInspection | zpn_client_type_zia_inspection | string |  |  |

## CloudConnector

**Service:** `cloud_connector`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| EdgeConnectorGroupID | edgeConnectorGroupId | string | ✓ |  |
| EdgeConnectorGroupName | edgeConnectorGroupName | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| Fingerprint | fingerprint | string | ✓ |  |
| ID | id | string | ✓ |  |
| IpAcl | ipAcl | []string | ✓ |  |
| IssuedCertID | issuedCertId | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | int | ✓ |  |
| Name | name | string | ✓ |  |

## CloudConnectorGroup

**Service:** `cloud_connector_group`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| CloudConnectors | cloudConnectors | []CloudConnectors | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| GeolocationID | geoLocationId | string | ✓ |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| ZiaCloud | ziaCloud | string | ✓ |  |
| ZiaOrgid | ziaOrgId | string | ✓ |  |
| ZnfGroupType | znfGroupType | string | ✓ |  |

## CloudConnectors

**Service:** `cloud_connector_group`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| Fingerprint | fingerprint | string | ✓ |  |
| IPACL | ipAcl | []string | ✓ |  |
| IssuedCertID | issuedCertId | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |

## CBIBannerController

**Service:** `cloudbrowserisolation/cbibannercontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| PrimaryColor | primaryColor | string | ✓ |  |
| TextColor | textColor | string | ✓ |  |
| NotificationTitle | notificationTitle | string | ✓ |  |
| NotificationText | notificationText | string | ✓ |  |
| Logo | logo | string | ✓ |  |
| Banner | banner | bool | ✓ |  |
| IsDefault | isDefault | bool | ✓ |  |
| Persist | persist | bool | ✓ |  |

## CBICertificate

**Service:** `cloudbrowserisolation/cbicertificatecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| PEM | pem | string | ✓ |  |
| IsDefault | isDefault | bool | ✓ |  |

## Banner

**Service:** `cloudbrowserisolation/cbiprofilecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |

## Certificates

**Service:** `cloudbrowserisolation/cbiprofilecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| IsDefault | isDefault | bool | ✓ |  |

## DebugMode

**Service:** `cloudbrowserisolation/cbiprofilecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Allowed | allowed | bool | ✓ |  |
| FilePassword | filePassword | string | ✓ |  |

## DeepLink

**Service:** `cloudbrowserisolation/cbiprofilecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Enabled | enabled | bool | ✓ |  |
| Applications | applications | []string | ✓ |  |

## ForwardToZia

**Service:** `cloudbrowserisolation/cbiprofilecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Enabled | enabled | bool |  |  |
| OrganizationID | organizationId | string |  |  |
| CloudName | cloudName | string | ✓ |  |
| PacFileUrl | pacFileUrl | string | ✓ |  |

## IsolationProfile

**Service:** `cloudbrowserisolation/cbiprofilecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| CBITenantID | cbiTenantId | string | ✓ |  |
| CBIProfileID | cbiProfileId | string | ✓ |  |
| CBIURL | cbiUrl | string | ✓ |  |
| BannerID | bannerId | string | ✓ |  |
| SecurityControls | securityControls | *SecurityControls | ✓ |  |
| IsDefault | isDefault | bool | ✓ |  |
| Regions | regions | []Regions | ✓ |  |
| RegionIDs | regionIds | []string | ✓ |  |
| Href | href | string | ✓ |  |
| UserExperience | userExperience | *UserExperience | ✓ |  |
| Certificates | certificates | []Certificates | ✓ |  |
| CertificateIDs | certificateIds | []string | ✓ |  |
| Banner | banner | *Banner | ✓ |  |
| DebugMode | debugMode | *DebugMode | ✓ |  |

## Regions

**Service:** `cloudbrowserisolation/cbiprofilecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Name | name | string | ✓ |  |
| ID | id | string | ✓ |  |

## SecurityControls

**Service:** `cloudbrowserisolation/cbiprofilecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| DocumentViewer | documentViewer | bool | ✓ |  |
| AllowPrinting | allowPrinting | bool | ✓ |  |
| Watermark | watermark | *Watermark | ✓ |  |
| FlattenedPdf | flattenedPdf | bool | ✓ |  |
| UploadDownload | uploadDownload | string | ✓ |  |
| RestrictKeystrokes | restrictKeystrokes | bool | ✓ |  |
| CopyPaste | copyPaste | string | ✓ |  |
| LocalRender | localRender | bool | ✓ |  |
| DeepLink | deepLink | *DeepLink | ✓ |  |

## UserExperience

**Service:** `cloudbrowserisolation/cbiprofilecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SessionPersistence | sessionPersistence | bool |  |  |
| BrowserInBrowser | browserInBrowser | bool |  |  |
| PersistIsolationBar | persistIsolationBar | bool |  |  |
| Translate | translate | bool |  |  |
| ZGPU | zgpu | bool | ✓ |  |
| ForwardToZia | forwardToZia | *ForwardToZia | ✓ |  |

## Watermark

**Service:** `cloudbrowserisolation/cbiprofilecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Enabled | enabled | bool | ✓ |  |
| ShowUserID | showUserId | bool | ✓ |  |
| ShowTimestamp | showTimestamp | bool | ✓ |  |
| ShowMessage | showMessage | bool | ✓ |  |
| Message | message | string | ✓ |  |

## CBIRegions

**Service:** `cloudbrowserisolation/cbiregions`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## ZPAProfiles

**Service:** `cloudbrowserisolation/cbizpaprofile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| CBITenantID | cbiTenantId | string | ✓ |  |
| CBIProfileID | cbiProfileId | string | ✓ |  |
| CBIURL | cbiUrl | string |  |  |

## IsolationProfile

**Service:** `cloudbrowserisolation/isolationprofile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| IsolationProfileID | isolationProfileId | string | ✓ |  |
| IsolationTenantID | isolationTenantId | string | ✓ |  |
| IsolationURL | isolationUrl | string |  |  |

## AssociatedProfileNames

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## Conditions

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| LHS | lhs | string | ✓ |  |
| OP | op | string | ✓ |  |
| RHS | rhs | string | ✓ |  |

## CustomCommonControls

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Action | action | string | ✓ |  |
| ActionValue | actionValue | string | ✓ |  |
| AssociatedInspectionProfileNames | associatedInspectionProfileNames | []AssociatedProfileNames | ✓ |  |
| Attachment | attachment | string | ✓ |  |
| ControlGroup | controlGroup | string | ✓ |  |
| ControlNumber | controlNumber | string | ✓ |  |
| ControlType | controlType | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| DefaultAction | defaultAction | string | ✓ |  |
| DefaultActionValue | defaultActionValue | string | ✓ |  |
| Description | description | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| ParanoiaLevel | paranoiaLevel | string | ✓ |  |
| ProtocolType | protocolType | string | ✓ |  |
| Severity | severity | string | ✓ |  |
| Version | version | string | ✓ |  |

## ExtranetDTO

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| LocationDTO | locationDTO | []LocationDTO | ✓ |  |
| LocationGroupDTO | locationGroupDTO | []LocationGroupDTO | ✓ |  |
| ZiaErName | ziaErName | string | ✓ |  |
| ZpnErID | zpnErId | string | ✓ |  |

## LocationDTO

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## LocationGroupDTO

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| ZiaLocations | ziaLocations | []CommonSummary | ✓ |  |

## Meta

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Created | created | time.Time |  |  |
| LastModified | lastModified | time.Time |  |  |
| Location | location | string |  |  |
| ResourceType | resourceType | string |  |  |

## NetworkPorts

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| From | from | string | ✓ |  |
| To | to | string | ✓ |  |

## Rules

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Conditions | conditions | []Conditions | ✓ |  |
| Names | names | string | ✓ |  |
| Type | type | string | ✓ |  |
| Version | version | string | ✓ |  |

## SearchFilterBy

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| FilterGroups | filterGroups | []SearchFilterGroup | ✓ |  |
| Operator | operator | string | ✓ |  |

## SearchFilterGroup

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Filters | filters | []SearchFilterItem | ✓ |  |
| Operator | operator | string | ✓ |  |

## SearchFilterItem

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CommaSepValues | commaSepValues | string | ✓ |  |
| FilterName | filterName | string | ✓ |  |
| Operator | operator | string | ✓ |  |
| Value | value | string | ✓ |  |
| Values | values | []string | ✓ |  |

## SearchPageBy

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Page | page | int | ✓ |  |
| PageSize | pageSize | int | ✓ |  |
| ValidPage | validPage | int | ✓ |  |
| ValidPageSize | validPageSize | int | ✓ |  |

## SearchSortBy

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SortName | sortName | string | ✓ |  |
| SortOrder | sortOrder | string | ✓ |  |

## ZPNERID

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| ZIACloud | ziaCloud | string | ✓ |  |
| ZIAErID | ziaErId | string | ✓ |  |
| ZIAErName | ziaErName | string | ✓ |  |
| ZIAModifiedTime | ziaModifiedTime | string | ✓ |  |
| ZIAOrgID | ziaOrgId | string | ✓ |  |

## ZPNSubModuleUpgrade

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| CurrentVersion | currentVersion | string | ✓ |  |
| EntityGid | entityGid | string | ✓ |  |
| EntityType | entityType | string | ✓ |  |
| ExpectedVersion | expectedVersion | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| PreviousVersion | previousVersion | string | ✓ |  |
| Role | role | string | ✓ |  |
| UpgradeStatus | upgradeStatus | string | ✓ |  |
| UpgradeTime | upgradeTime | string | ✓ |  |

## microTenantSample

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## ConfigOverrides

**Service:** `config_override`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| BrokerName | brokerName | string | ✓ |  |
| ConfigKey | configKey | string | ✓ |  |
| ConfigValue | configValue | string | ✓ |  |
| ConfigValueInt | configValueInt | string | ✓ |  |
| CustomerId | customerId | string | ✓ |  |
| CustomerName | customerName | string | ✓ |  |
| Description | description | string | ✓ |  |
| TargetGid | targetGid | string | ✓ |  |
| TargetName | targetName | string | ✓ |  |
| TargetType | targetType | string | ✓ |  |

## SessionTerminationOnReath

**Service:** `custom_config_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AllowDisableSessionTerminationOnReauth | allowDisableSessionTerminationOnReauth | bool | ✓ |  |
| SessionTerminationOnReauth | sessionTerminationOnReauth | bool | ✓ |  |

## ZIACloudConfig

**Service:** `custom_config_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ZIACloudDomain | ziaCloudDomain | string | ✓ |  |
| ZIACloudServiceApiKey | ziaCloudServiceApiKey | string | ✓ |  |
| ZIAPassword | ziaPassword | string | ✓ |  |
| ZIASandboxApiToken | ziaSandboxApiToken | string | ✓ |  |
| ZIAUsername | ziaUsername | string | ✓ |  |

## AccessMappings

**Service:** `customer_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| AncestorCustomerID | ancestorCustomerId | string | ✓ |  |
| RoleID | roleId | string | ✓ |  |
| CustomerID | customerId | string | ✓ |  |

## AncestorPolicy

**Service:** `customer_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AccessType | accessType | string | ✓ |  |
| AccessMappings | accessMappings | []AccessMappings | ✓ |  |

## AuthDomain

**Service:** `customer_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AuthDomains | authDomains | []string |  |  |

## CustomerDrTool

**Service:** `customer_dr_tool`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | string | ✓ |  |
| CustomerId | customerId | string | ✓ |  |
| ID | id | string | ✓ |  |
| Latest | latest | bool | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| Platform | platform | string | ✓ |  |
| Version | version | string | ✓ |  |

## CustomScopeCustomerIDs

**Service:** `customerversionprofile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Name | name | string |  |  |
| CustomerID | customerId | string |  |  |
| ExcludeConstellation | excludeConstellation | bool |  |  |
| IsPartner | isPartner | bool |  |  |

## CustomScopeRequestCustomerIDs

**Service:** `customerversionprofile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AddCustomerIDs | addCustomerIds | string |  |  |
| DeletecustomerIDs | deleteCustomerIds | string |  |  |

## CustomerVersionProfile

**Service:** `customerversionprofile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | string | ✓ |  |
| CustomScopeCustomerIDs | customScopeCustomerIds | []CustomScopeCustomerIDs |  |  |
| CustomScopeRequestCustomerIDs | customScopeRequestCustomerIds | CustomScopeRequestCustomerIDs |  |  |
| CustomerID | customerId | string |  |  |
| Description | description | string |  |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string |  |  |
| ModifiedTime | modifiedTime | string |  |  |
| Name | name | string |  |  |
| Versions | versions | []Versions |  |  |
| VisibilityScope | visibilityScope | string |  |  |
| UpgradePriority | upgradePriority | string |  |  |
| NumberOfAssistants | numberOfAssistants | string |  |  |
| NumberOfCustomers | numberOfCustomers | string |  |  |
| NumberOfPrivateBrokers | numberOfPrivateBrokers | string |  |  |
| NumberOfSiteControllers | numberOfSiteControllers | string |  |  |
| NumberOfUpdatedAssistants | numberOfUpdatedAssistants | string |  |  |
| NumberOfUpdatedPrivateBrokers | numberOfUpdatedPrivateBrokers | string |  |  |
| NumberOfUpdatedSiteControllers | numberOfUpdatedSiteControllers | string |  |  |

## Versions

**Service:** `customerversionprofile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| CustomerID | customerId | string |  |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string |  |  |
| ModifiedTime | modifiedTime | string |  |  |
| Platform | platform | string |  |  |
| RestartAfterUptimeInDays | restartAfterUptimeInDays | string |  |  |
| Role | role | string |  |  |
| Version | version | string |  |  |
| VersionProfileGID | version_profile_gid | string |  |  |

## EmergencyAccess

**Service:** `emergencyaccess`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ActivatedOn | activatedOn | string | ✓ |  |
| AllowedActivate | allowedActivate | bool |  |  |
| AllowedDeactivate | allowedDeactivate | bool |  |  |
| EmailID | emailId | string | ✓ |  |
| FirstName | firstName | string | ✓ |  |
| LastLoginTime | lastLoginTime | string | ✓ |  |
| LastName | lastName | string | ✓ |  |
| UpdateEnabled | updateEnabled | bool |  |  |
| UserID | userId | string | ✓ |  |
| UserStatus | userStatus | string | ✓ |  |

## EnrollmentCert

**Service:** `enrollmentcert`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AllowSigning | allowSigning | bool | ✓ |  |
| Cname | cName | string | ✓ |  |
| Certificate | certificate | string | ✓ |  |
| ClientCertType | clientCertType | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| CSR | csr | string | ✓ |  |
| Description | description | string | ✓ |  |
| ID | id | string | ✓ |  |
| IssuedBy | issuedBy | string | ✓ |  |
| IssuedTo | issuedTo | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| ParentCertID | parentCertId | string | ✓ |  |
| ParentCertName | parentCertName | string | ✓ |  |
| PrivateKey | privateKey | string | ✓ |  |
| PrivateKeyPresent | privateKeyPresent | bool | ✓ |  |
| SerialNo | serialNo | string | ✓ |  |
| ValidFromInEpochSec | validFromInEpochSec | string | ✓ |  |
| ValidToInEpochSec | validToInEpochSec | string | ✓ |  |
| ZrsaEncryptedPrivateKey | zrsaencryptedprivatekey | string | ✓ |  |
| ZrsaEncryptedSessionKey | zrsaencryptedsessionkey | string | ✓ |  |
| MicrotenantID | microtenantId | string | ✓ |  |

## GenerateEnrollmentCSR

**Service:** `enrollmentcert`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| ZRSAEncryptedPrivateKey | zrsaencryptedprivatekey | string | ✓ |  |
| CSR | csr | string | ✓ |  |

## GenerateSelfSignedCert

**Service:** `enrollmentcert`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| ValidFromInEpochSec | validFromInEpochSec | string | ✓ |  |
| ValidToInEpochSec | validToInEpochSec | string | ✓ |  |
| RootCertificateID | rootCertificateId | string | ✓ |  |
| MicrotenantID | microtenantId | string | ✓ |  |
| ZRSAEncryptedPrivateKey | zrsaencryptedprivatekey | string | ✓ |  |
| Certificate | certificate | string | ✓ |  |

## AdminMetadata

**Service:** `idpcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CertificateURL | certificateUrl | string |  |  |
| SpBaseURL | spBaseUrl | string |  |  |
| SpEntityID | spEntityId | string |  |  |
| SpMetadataURL | spMetadataUrl | string |  |  |
| SpPostURL | spPostUrl | string |  |  |

## IdpController

**Service:** `idpcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AdminSpSigningCertID | adminSpSigningCertId | string | ✓ |  |
| AutoProvision | autoProvision | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| DisableSamlBasedPolicy | disableSamlBasedPolicy | bool |  |  |
| Domainlist | domainList | []string | ✓ |  |
| EnableScimBasedPolicy | enableScimBasedPolicy | bool |  |  |
| EnableArbitraryAuthDomains | enableArbitraryAuthDomains | string |  |  |
| Enabled | enabled | bool |  |  |
| ForceAuth | forceAuth | bool |  |  |
| ID | id | string | ✓ |  |
| IdpEntityID | idpEntityId | string | ✓ |  |
| LoginHint | loginHint | bool | ✓ |  |
| LoginNameAttribute | loginNameAttribute | string | ✓ |  |
| LoginURL | loginUrl | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| ReauthOnUserUpdate | reauthOnUserUpdate | bool |  |  |
| RedirectBinding | redirectBinding | bool |  |  |
| ScimEnabled | scimEnabled | bool |  |  |
| ScimServiceProviderEndpoint | scimServiceProviderEndpoint | string | ✓ |  |
| ScimSharedSecretExists | scimSharedSecretExists | bool | ✓ |  |
| SignSamlRequest | signSamlRequest | string | ✓ |  |
| SsoType | ssoType | []string | ✓ |  |
| UseCustomSpMetadata | useCustomSPMetadata | bool |  |  |
| UserSpSigningCertID | userSpSigningCertId | string | ✓ |  |
| AdminMetadata | adminMetadata | *AdminMetadata | ✓ |  |
| UserMetadata | userMetadata | *UserMetadata | ✓ |  |

## UserMetadata

**Service:** `idpcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CertificateURL | certificateUrl | string | ✓ |  |
| SpBaseURL | spBaseUrl | string |  |  |
| SpEntityID | spEntityId | string | ✓ |  |
| SpMetadataURL | spMetadataUrl | string | ✓ |  |
| SpPostURL | spPostUrl | string | ✓ |  |

## Conditions

**Service:** `inspectioncontrol/inspection_custom_controls`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| LHS | lhs | string | ✓ |  |
| OP | op | string | ✓ |  |
| RHS | rhs | string | ✓ |  |

## InspectionCustomControl

**Service:** `inspectioncontrol/inspection_custom_controls`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Action | action | string | ✓ |  |
| ActionValue | actionValue | string | ✓ |  |
| AssociatedInspectionProfileNames | associatedInspectionProfileNames | []common.AssociatedProfileNames | ✓ |  |
| Rules | rules | []Rules | ✓ |  |
| ControlNumber | controlNumber | string | ✓ |  |
| ControlType | controlType | string | ✓ |  |
| ControlRuleJson | controlRuleJson | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| DefaultAction | defaultAction | string | ✓ |  |
| DefaultActionValue | defaultActionValue | string | ✓ |  |
| Description | description | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| ParanoiaLevel | paranoiaLevel | string | ✓ |  |
| ProtocolType | protocolType | string | ✓ |  |
| Severity | severity | string | ✓ |  |
| Type | type | string | ✓ |  |
| Version | version | string | ✓ |  |

## Rules

**Service:** `inspectioncontrol/inspection_custom_controls`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Conditions | conditions | []Conditions | ✓ |  |
| Names | names | []string | ✓ |  |
| Type | type | string | ✓ |  |

## ControlGroupItem

**Service:** `inspectioncontrol/inspection_predefined_controls`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ControlGroup | controlGroup | string | ✓ |  |
| PredefinedInspectionControls | predefinedInspectionControls | []PredefinedControls | ✓ |  |
| DefaultGroup | defaultGroup | bool | ✓ |  |

## PredefinedControls

**Service:** `inspectioncontrol/inspection_predefined_controls`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Action | action | string | ✓ |  |
| ActionValue | actionValue | string | ✓ |  |
| AssociatedInspectionProfileNames | associatedInspectionProfileNames | []common.AssociatedProfileNames | ✓ |  |
| Attachment | attachment | string | ✓ |  |
| ControlGroup | controlGroup | string | ✓ |  |
| ControlType | controlType | string | ✓ |  |
| ControlNumber | controlNumber | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| DefaultAction | defaultAction | string | ✓ |  |
| DefaultActionValue | defaultActionValue | string | ✓ |  |
| Description | description | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| ParanoiaLevel | paranoiaLevel | string | ✓ |  |
| ProtocolType | protocolType | string | ✓ |  |
| Severity | severity | string | ✓ |  |
| Version | version | string | ✓ |  |

## AssociatedCustomers

**Service:** `inspectioncontrol/inspection_profile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CustomerID | customerId | string | ✓ |  |
| ExcludeConstellation | excludeConstellation | bool | ✓ |  |
| IsPartner | isPartner | bool | ✓ |  |
| Name | name | string | ✓ |  |

## ControlInfoResource

**Service:** `inspectioncontrol/inspection_profile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ControlType | controlType | string | ✓ |  |
| Count | count | string | ✓ |  |

## InspectionCustomControl

**Service:** `inspectioncontrol/inspection_profile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Action | action | string | ✓ |  |
| ActionValue | actionValue | string | ✓ |  |
| ControlNumber | controlNumber | string | ✓ |  |
| ControlRuleJson | controlRuleJson | string | ✓ |  |
| ControlType | controlType | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| DefaultAction | defaultAction | string | ✓ |  |
| DefaultActionValue | defaultActionValue | string | ✓ |  |
| Description | description | string | ✓ |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| ProtocolType | protocolType | string | ✓ |  |
| ParanoiaLevel | paranoiaLevel | string | ✓ |  |
| Severity | severity | string | ✓ |  |
| Type | type | string | ✓ |  |
| Version | version | string | ✓ |  |
| AssociatedInspectionProfileNames | associatedInspectionProfileNames | []common.AssociatedProfileNames | ✓ |  |
| Rules | rules | []common.Rules | ✓ |  |

## InspectionProfile

**Service:** `inspectioncontrol/inspection_profile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| APIProfile | apiProfile | bool | ✓ |  |
| OverrideAction | overrideAction | string | ✓ |  |

## ThreatLabzControls

**Service:** `inspectioncontrol/inspection_profile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| Action | action | string | ✓ |  |
| ActionValue | actionValue | string | ✓ |  |
| Attachment | attachment | string | ✓ |  |
| ControlGroup | controlGroup | string | ✓ |  |
| ControlNumber | controlNumber | string | ✓ |  |
| ControlType | controlType | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| DefaultAction | defaultAction | string | ✓ |  |
| DefaultActionValue | defaultActionValue | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| ParanoiaLevel | paranoiaLevel | string | ✓ |  |
| Severity | severity | string | ✓ |  |
| Version | version | string | ✓ |  |
| EngineVersion | engineVersion | string | ✓ |  |
| LastDeploymentTime | lastDeploymentTime | string | ✓ |  |
| RuleDeploymentState | ruleDeploymentState | string | ✓ |  |
| RuleMetadata | ruleMetadata | string | ✓ |  |
| RuleProcessor | ruleProcessor | string | ✓ |  |
| RulesetName | rulesetName | string | ✓ |  |
| RulesetVersion | rulesetVersion | string | ✓ |  |
| ZscalerInfoUrl | zscalerInfoUrl | string | ✓ |  |
| AssociatedCustomers | associatedCustomers | []AssociatedCustomers | ✓ |  |
| AssociatedInspectionProfileNames | associatedInspectionProfileNames | []common.AssociatedProfileNames | ✓ |  |

## WebSocketControls

**Service:** `inspectioncontrol/inspection_profile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Action | action | string | ✓ |  |
| ActionValue | actionValue | string | ✓ |  |
| ControlNumber | controlNumber | string | ✓ |  |
| ControlType | controlType | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| DefaultAction | defaultAction | string | ✓ |  |
| DefaultActionValue | defaultActionValue | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| ParanoiaLevel | paranoiaLevel | string | ✓ |  |
| Severity | severity | string | ✓ |  |
| Version | version | string | ✓ |  |
| ZSDefinedControlChoice | zsDefinedControlChoice | string | ✓ |  |
| AssociatedInspectionProfileNames | associatedInspectionProfileNames | []common.AssociatedProfileNames | ✓ |  |

## LSSFormats

**Service:** `lssconfigcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Csv | csv | string |  |  |
| Tsv | tsv | string |  |  |
| Json | json | string |  |  |

## MachineGroup

**Service:** `machinegroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Machines | machines | []Machines | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |

## Machines

**Service:** `machinegroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Fingerprint | fingerprint | string | ✓ |  |
| IssuedCertID | issuedCertId | string | ✓ |  |
| MachineGroupID | machineGroupId | string | ✓ |  |
| MachineGroupName | machineGroupName | string | ✓ |  |
| MachineTokenID | machineTokenId | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |

## ChromePostureProfile

**Service:** `managed_browser`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| BrowserType | browserType | string | ✓ |  |
| CrowdStrikeAgent | crowdStrikeAgent | bool | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |

## ManagedBrowserProfile

**Service:** `managed_browser`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| BrowserType | browserType | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| CustomerID | customerId | string | ✓ |  |
| Description | description | string | ✓ |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| MicrotenantID | microtenantId | string | ✓ |  |
| MicrotenantName | microtenantName | string | ✓ |  |
| ChromePostureProfile | chromePostureProfile | ChromePostureProfile | ✓ |  |

## MicroTenant

**Service:** `microtenants`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| CriteriaAttribute | criteriaAttribute | string | ✓ |  |
| CriteriaAttributeValues | criteriaAttributeValues | []string | ✓ |  |
| PrivilegedApprovalsEnabled | privilegedApprovalsEnabled | bool |  |  |
| Operator | operator | string | ✓ |  |
| Priority | priority | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Roles | roles | []Roles | ✓ |  |
| UserResource | user | *UserResource | ✓ |  |

## MicroTenantSummary

**Service:** `microtenants`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Name | name | string |  |  |

## Roles

**Service:** `microtenants`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Name | name | string | ✓ |  |
| CustomRole | customRole | bool | ✓ |  |

## UserResource

**Service:** `microtenants`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| Comments | comments | string | ✓ |  |
| CustomerID | customerId | string | ✓ |  |
| DeliveryTag | deliveryTag | string | ✓ |  |
| DisplayName | displayName | string | ✓ |  |
| Email | email | string | ✓ |  |
| Eula | eula | string | ✓ |  |
| ForcePwdChange | forcePwdChange | bool | ✓ |  |
| GroupIDs | groupIds | []string | ✓ |  |
| IAMUserID | iamUserId | string | ✓ |  |
| IsEnabled | isEnabled | bool | ✓ |  |
| IsLocked | isLocked | bool | ✓ |  |
| LanguageCode | languageCode | string | ✓ |  |
| LocalLoginDisabled | localLoginDisabled | bool | ✓ |  |
| OneIdentityUser | oneIdentityUser | bool | ✓ |  |
| OperationType | operationType | string | ✓ |  |
| Password | password | string | ✓ |  |
| PhoneNumber | phoneNumber | string | ✓ |  |
| PinSession | pinSession | bool | ✓ |  |
| RoleID | roleId | string | ✓ |  |
| MicrotenantID | microtenantId | string | ✓ |  |
| MicrotenantName | microtenantName | string | ✓ |  |
| SyncVersion | syncVersion | string | ✓ |  |
| Timezone | timezone | string | ✓ |  |
| TmpPassword | tmpPassword | string | ✓ |  |
| TokenID | tokenId | string | ✓ |  |
| TwoFactorAuthEnabled | twoFactorAuthEnabled | bool | ✓ |  |
| TwoFactorAuthType | twoFactorAuthType | string | ✓ |  |
| Username | username | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |

## NPClient

**Service:** `np_client`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ClientIpAddress | clientIpAddress | string | ✓ |  |
| CommonName | commonName | string | ✓ |  |
| CreationTime | creationTime | int | ✓ |  |
| DeviceState | deviceState | int | ✓ |  |
| Id | id | int | ✓ |  |
| ModifiedBy | modifiedBy | int | ✓ |  |
| ModifiedTime | modifiedTime | int | ✓ |  |
| VpnServiceEdgeName | vpnServiceEdgeName | string | ✓ |  |
| VpnServiceEdgeId | vpnServiceEdgeId | int | ✓ |  |
| UserName | UserName | string | ✓ |  |

## OauthUser

**Service:** `oauth2_user`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ComponentGroupID | componentGroupId | string | ✓ |  |
| ConfigCloudName | configCloudName | string | ✓ |  |
| EnrollmentServer | enrollmentServer | string | ✓ |  |
| NonceAssociationType | nonceAssociationType | string | ✓ |  |
| TenantID | tenantId | string | ✓ |  |
| UserCodes | userCodes | []string | ✓ |  |
| ZcomponentID | zcomponentId | string | ✓ |  |

## UserCodeInfo

**Service:** `oauth2_user`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Code | code | string | ✓ |  |
| UserCode | userCode | string | ✓ |  |
| Status | status | string | ✓ |  |
| ConfigCloudName | configCloudName | string | ✓ |  |
| EnrollmentServer | enrollmentServer | string | ✓ |  |
| NonceAssociationType | nonceAssociationType | string | ✓ |  |
| TenantID | tenantId | string | ✓ |  |
| ZcomponentID | zcomponentId | string | ✓ |  |

## Platforms

**Service:** `platforms`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Linux | linux | string |  |  |
| Android | android | string |  |  |
| Windows | windows | string |  |  |
| IOS | ios | string |  |  |
| MacOS | mac | string |  |  |

## Policy-group controller response routing

Python v1.9.39 adds three unified controllers beneath
`/zpa/mgmtconfig/v1/admin/customers/{customerId}`
(`vendor/zscaler-sdk-python/pyproject.toml:1-4`;
`vendor/zscaler-sdk-python/zscaler/zpa/zpa_service.py:504-517`;
`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:32-36`). Their response
model routing is:

| Controller | Response models and operation boundary |
|---|---|
| `policy_group` | Create/get/update decode `PolicyGroup`; list returns the current page of `PolicyGroup`; advanced search decodes `CommonFilterSearch`; delete/reorder return no resource model (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:38-388`). |
| `policy_group_rule` | List/create/get decode `PolicyRule`; delete/reorder return no resource model. The controller has no direct update operation (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_rule.py:37-321`). |
| `policy_group_set` | List, by-policy-type, and summary reads decode `PolicyGroupSetSummary`; cross-group rule list decodes `PolicyRule`; summary stats decode `PolicyGroupSetSummaryStat`; get-by-ID decodes `PolicyGroupSet` (`vendor/zscaler-sdk-python/zscaler/zpa/policy_group_set.py:40-340`). |

## Conditions

**Service:** `policysetcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | string | ✓ |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Negated | negated | bool |  |  |
| Operands | operands | []Operands |  |  |
| Operator | operator | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |

## Count

**Service:** `policysetcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Count | count | string |  |  |

## Credential

**Service:** `policysetcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Name | name | string | ✓ |  |

## DesktopPolicyMappings

**Service:** `policysetcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AppSegments | appSegments | []applicationsegment.ApplicationSegmentResource | ✓ |  |
| ID | id | string |  |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| ImageID | imageId | string | ✓ |  |
| ImageName | imageName | string | ✓ |  |

## Operands

**Service:** `policysetcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | string | ✓ |  |
| ID | id | string | ✓ |  |
| IdpID | idpId | string | ✓ |  |
| LHS | lhs | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| ObjectType | objectType | string | ✓ |  |
| RHS | rhs | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |

## PolicyRule

**Service:** `policysetcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Disabled | disabled | string | ✓ |  |
| Action | action | string | ✓ |  |
| ActionID | actionId | string | ✓ |  |
| DevicePostureFailureNotificationEnabled | devicePostureFailureNotificationEnabled | bool |  |  |

## PolicySet

**Service:** `policysetcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| Sorted | sorted | bool |  |  |
| PolicyType | policyType | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| Rules | rules | []PolicyRule |  |  |

## PrivilegedCapabilities

**Service:** `policysetcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| Capabilities | capabilities | []string | ✓ |  |

## PrivilegedPortalCapabilities

**Service:** `policysetcontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Capabilities | capabilities | []string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |

## Conditions

**Service:** `policysetcontrollerv2`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | string | ✓ |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Negated | negated | bool |  |  |
| Operands | operands | []Operands | ✓ |  |
| Operator | operator | string | ✓ |  |

## Credential

**Service:** `policysetcontrollerv2`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## DesktopPolicyMappings

**Service:** `policysetcontrollerv2`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AppSegments | appSegments | []applicationsegment.ApplicationSegmentResource | ✓ |  |
| ID | id | string |  |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| ImageID | imageId | string | ✓ |  |
| ImageName | imageName | string | ✓ |  |

## Operands

**Service:** `policysetcontrollerv2`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| IdpID | idpId | string | ✓ |  |
| LHS | lhs | string | ✓ |  |
| RHS | rhs | string | ✓ |  |
| ObjectType | objectType | string | ✓ |  |

## OperandsResourceLHSRHSValue

**Service:** `policysetcontrollerv2`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| RHS | rhs | string | ✓ |  |
| LHS | lhs | string | ✓ |  |

## PolicyRule

**Service:** `policysetcontrollerv2`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Action | action | string | ✓ |  |
| ActionID | actionId | string | ✓ |  |
| DevicePostureFailureNotificationEnabled | devicePostureFailureNotificationEnabled | bool |  |  |

## PolicyRuleResource

**Service:** `policysetcontrollerv2`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Disabled | disabled | string | ✓ |  |
| ExtranetEnabled | extranetEnabled | bool | ✓ |  |
| Action | action | string | ✓ |  |
| ActionID | actionId | string | ✓ |  |
| DevicePostureFailureNotificationEnabled | devicePostureFailureNotificationEnabled | bool | ✓ |  |

## PolicyRuleResourceConditions

**Service:** `policysetcontrollerv2`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Negated | negated | bool |  |  |
| Operator | operator | string | ✓ |  |
| Operands | operands | []PolicyRuleResourceOperands | ✓ |  |

## PolicyRuleResourceOperands

**Service:** `policysetcontrollerv2`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| ObjectType | objectType | string | ✓ |  |
| Values | values | []string | ✓ |  |
| IDPID | idpId | string | ✓ |  |
| LHS | lhs | string | ✓ |  |
| RHS | rhs | string | ✓ |  |
| EntryValuesLHSRHS | entryValues | []OperandsResourceLHSRHSValue | ✓ |  |

## PolicySet

**Service:** `policysetcontrollerv2`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| Sorted | sorted | bool |  |  |
| PolicyType | policyType | string | ✓ |  |
| MicroTenantID | microtenantId | string |  |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| Rules | rules | []PolicyRule |  |  |

## PrivilegedCapabilities

**Service:** `policysetcontrollerv2`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| MicroTenantID | microtenantId | string |  |  |
| Capabilities | capabilities | []string | ✓ |  |

## PrivilegedPortalCapabilities

**Service:** `policysetcontrollerv2`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Capabilities | capabilities | []string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |

## PostureProfile

**Service:** `postureprofile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| ApplyToMachineTunnelEnabled | applyToMachineTunnelEnabled | bool |  |  |
| CRLCheckEnabled | crlCheckEnabled | bool |  |  |
| NonExportablePrivateKeyEnabled | nonExportablePrivateKeyEnabled | bool |  |  |
| Platform | platform | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Domain | domain | string | ✓ |  |
| MasterCustomerID | masterCustomerId | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| PostureType | postureType | string | ✓ |  |
| PostureudID | postureUdid | string | ✓ |  |
| RootCert | rootCert | string | ✓ |  |
| ZscalerCloud | zscalerCloud | string | ✓ |  |
| ZscalerCustomerID | zscalerCustomerId | string | ✓ |  |

## PrivateCloudController

**Service:** `private_cloud_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ApplicationStartTime | applicationStartTime | string | ✓ |  |
| ControlChannelStatus | controlChannelStatus | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| CtrlBrokerName | ctrlBrokerName | string | ✓ |  |
| CurrentVersion | currentVersion | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| ExpectedSargeVersion | expectedSargeVersion | string | ✓ |  |
| ExpectedUpgradeTime | expectedUpgradeTime | string | ✓ |  |
| ExpectedVersion | expectedVersion | string | ✓ |  |
| Fingerprint | fingerprint | string | ✓ |  |
| ID | id | string | ✓ |  |
| IpAcl | ipAcl | []string | ✓ |  |
| IssuedCertId | issuedCertId | string | ✓ |  |
| LastBrokerConnectTime | lastBrokerConnectTime | string | ✓ |  |
| LastBrokerConnectTimeDuration | lastBrokerConnectTimeDuration | string | ✓ |  |
| LastBrokerDisconnectTime | lastBrokerDisconnectTime | string | ✓ |  |
| LastBrokerDisconnectTimeDuration | lastBrokerDisconnectTimeDuration | string | ✓ |  |
| LastOsUpgradeTime | lastOSUpgradeTime | string | ✓ |  |
| LastSargeUpgradeTime | lastSargeUpgradeTime | string | ✓ |  |
| LastUpgradeTime | lastUpgradeTime | string | ✓ |  |
| Latitude | latitude | string | ✓ |  |
| ListenIps | listenIps | []string | ✓ |  |
| Location | location | string | ✓ |  |
| Longitude | longitude | string | ✓ |  |
| MasterLastSyncTime | masterLastSyncTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| ProvisioningKeyId | provisioningKeyId | string | ✓ |  |
| ProvisioningKeyName | provisioningKeyName | string | ✓ |  |
| OsUpgradeEnabled | osUpgradeEnabled | bool | ✓ |  |
| OsUpgradeStatus | osUpgradeStatus | string | ✓ |  |
| Platform | platform | string | ✓ |  |
| PlatformDetail | platformDetail | string | ✓ |  |
| PlatformVersion | platformVersion | string | ✓ |  |
| PreviousVersion | previousVersion | string | ✓ |  |
| PrivateIp | privateIp | string | ✓ |  |
| PublicIp | publicIp | string | ✓ |  |
| PublishIps | publishIps | []string | ✓ |  |
| ReadOnly | readOnly | bool | ✓ |  |
| RestrictionType | restrictionType | string | ✓ |  |
| Runtime | runtimeOS | string | ✓ |  |
| SargeUpgradeAttempt | sargeUpgradeAttempt | string | ✓ |  |
| SargeUpgradeStatus | sargeUpgradeStatus | string | ✓ |  |
| SargeVersion | sargeVersion | string | ✓ |  |
| MicrotenantId | microtenantId | string | ✓ |  |
| MicrotenantName | microtenantName | string | ✓ |  |
| ShardLastSyncTime | shardLastSyncTime | string | ✓ |  |

## PrivateCloudGroup

**Service:** `private_cloud_group`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| City | city | string | ✓ |  |
| CityCountry | cityCountry | string | ✓ |  |
| CountryCode | countryCode | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| GeoLocationID | geoLocationId | string | ✓ |  |
| IsPublic | isPublic | string | ✓ |  |
| Latitude | latitude | string | ✓ |  |
| Location | location | string | ✓ |  |
| Longitude | longitude | string | ✓ |  |
| Name | name | string | ✓ |  |
| OverrideVersionProfile | overrideVersionProfile | bool | ✓ |  |
| ReadOnly | readOnly | bool | ✓ |  |
| RestrictionType | restrictionType | string | ✓ |  |
| MicrotenantID | microtenantId | string | ✓ |  |
| MicrotenantName | microtenantName | string | ✓ |  |
| SiteID | siteId | string | ✓ |  |
| SiteName | siteName | string | ✓ |  |
| UpgradeDay | upgradeDay | string | ✓ |  |
| UpgradeTimeInSecs | upgradeTimeInSecs | string | ✓ |  |
| VersionProfileID | versionProfileId | string | ✓ |  |
| VersionProfileName | versionProfileName | string | ✓ |  |
| ZscalerManaged | zscalerManaged | bool | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |

## Applications

**Service:** `privilegedremoteaccess/praapproval`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## PrivilegedApproval

**Service:** `privilegedremoteaccess/praapproval`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| EmailIDs | emailIds | []string | ✓ |  |
| StartTime | startTime | string | ✓ |  |
| EndTime | endTime | string | ✓ |  |
| Status | status | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| WorkingHours | workingHours | *WorkingHours |  |  |
| Applications | applications | []Applications |  |  |

## WorkingHours

**Service:** `privilegedremoteaccess/praapproval`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Days | days | []string | ✓ |  |
| StartTime | startTime | string | ✓ |  |
| EndTime | endTime | string | ✓ |  |
| StartTimeCron | startTimeCron | string | ✓ |  |
| EndTimeCron | endTimeCron | string | ✓ |  |
| TimeZone | timeZone | string | ✓ |  |

## PRAApplication

**Service:** `privilegedremoteaccess/praconsole`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## PRAConsole

**Service:** `privilegedremoteaccess/praconsole`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| IconText | iconText | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| PRAApplication | praApplication | PRAApplication | ✓ |  |
| PRAPortals | praPortals | []PRAPortals |  |  |

## PRAPortals

**Service:** `privilegedremoteaccess/praconsole`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## Credential

**Service:** `privilegedremoteaccess/pracredential`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| LastCredentialResetTime | lastCredentialResetTime | string | ✓ |  |
| CredentialType | credentialType | string | ✓ |  |
| Passphrase | passphrase | string | ✓ |  |
| Password | password | string | ✓ |  |
| PrivateKey | privateKey | string | ✓ |  |
| UserDomain | userDomain | string | ✓ |  |
| UserName | userName | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| TargetMicrotenantId | targetMicrotenantId | string | ✓ |  |

## CredentialPool

**Service:** `privilegedremoteaccess/pracredentialpool`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| CredentialType | credentialType | string | ✓ |  |
| PRACredentials | credentials | []common.CommonIDName |  |  |
| CredentialMappingCount | credentialMappingCount | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |

## PRAPortal

**Service:** `privilegedremoteaccess/praportal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| CName | cName | string | ✓ |  |
| Domain | domain | string | ✓ |  |
| CertificateID | certificateId | string | ✓ |  |
| CertificateName | certificateName | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| UserNotification | userNotification | string |  |  |
| UserNotificationEnabled | userNotificationEnabled | bool |  |  |
| ExtDomain | extDomain | string |  |  |
| ExtDomainName | extDomainName | string |  |  |
| ExtDomainTranslation | extDomainTranslation | string |  |  |
| ExtLabel | extLabel | string |  |  |
| UserPortalGid | userPortalGid | string | ✓ |  |
| UserPortalName | userPortalName | string | ✓ |  |
| GetcName | getcName | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| ObjectType | objectType | string | ✓ |  |
| Action | action | string | ✓ |  |
| CertManagedByZsRadio | certManagedByZsRadio | string | ✓ |  |
| IsSRAPortal | isSRAPortal | bool | ✓ |  |
| ManagedByZs | managedByZs | bool | ✓ |  |
| ScopeName | scopeName | string | ✓ |  |
| HideInfoTooltip | hideInfoTooltip | bool | ✓ |  |
| RestrictedEntity | restrictedEntity | bool | ✓ |  |
| ApprovalReviewers | approvalReviewers | []string | ✓ |  |

## ProvisioningKey

**Service:** `provisioningkey`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AppConnectorGroupID | appConnectorGroupId | string | ✓ |  |
| AppConnectorGroupName | appConnectorGroupName | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| ExpirationInEpochSec | expirationInEpochSec | string | ✓ |  |
| ID | id | string | ✓ |  |
| IPACL | ipAcl | []string | ✓ |  |
| MaxUsage | maxUsage | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| ProvisioningKey | provisioningKey | string | ✓ |  |
| EnrollmentCertID | enrollmentCertId | string | ✓ |  |
| EnrollmentCertName | enrollmentCertName | string | ✓ |  |
| UIConfig | uiConfig | string | ✓ |  |
| UsageCount | usageCount | string | ✓ |  |
| ZcomponentID | zcomponentId | string | ✓ |  |
| ZcomponentName | zcomponentName | string | ✓ |  |
| AssociationType | associationType | string |  |  |
| ReadOnly | readOnly | bool | ✓ |  |
| RestrictionType | restrictionType | string | ✓ |  |
| ZscalerManaged | zscalerManaged | bool | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |

## ClassPermission

**Service:** `role_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Permission | permission | PermissionDetail | ✓ |  |
| ClassType | classType | ClassType | ✓ |  |
| ID | id | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |

## ClassPermissionGroup

**Service:** `role_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| Hidden | hidden | bool | ✓ |  |
| Internal | internal | bool | ✓ |  |
| LocalScopePermissionGroup | localScopePermissionGroup | bool | ✓ |  |
| ClassPermissions | classPermissions | []ClassPermission | ✓ |  |

## ClassType

**Service:** `role_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| ACLClass | aclClass | string | ✓ |  |
| FriendlyName | friendlyName | string | ✓ |  |
| CustomerID | customerId | string | ✓ |  |
| LocalScopeMask | localScopeMask | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |

## Permission

**Service:** `role_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| PermissionMask | permissionMask | string | ✓ |  |
| Role | role | string | ✓ |  |
| CustomerID | customerId | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ClassType | classType | ClassType | ✓ |  |

## PermissionDetail

**Service:** `role_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Mask | mask | string | ✓ |  |
| MaxMask | maxMask | string | ✓ |  |
| Type | type | string | ✓ | FULL or VIEW_ONLY |

## RoleController

**Service:** `role_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| Name | name | string | ✓ |  |
| MicrotenantID | microtenantId | string | ✓ |  |
| MicrotenantName | microtenantName | string | ✓ |  |
| Description | description | string | ✓ |  |
| BypassAccestorAccessCheck | bypassRemoteAssistanceCheck | bool | ✓ |  |
| CustomRole | customRole | bool | ✓ |  |
| SystemRole | systemRole | bool | ✓ |  |
| RestrictedRole | restrictedRole | bool | ✓ |  |
| Users | users | string | ✓ |  |
| APIKeys | apiKeys | string | ✓ |  |
| NewAuditMessage | newAuditMessage | string | ✓ |  |
| OldAuditMessage | oldAuditMessage | string | ✓ |  |
| ClassPermissionGroups | classPermissionGroups | []ClassPermissionGroup | ✓ |  |
| Permissions | permissions | []Permission | ✓ |  |

## SamlAttribute

**Service:** `samlattribute`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| IdpID | idpId | string | ✓ |  |
| IdpName | idpName | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| SamlName | samlName | string | ✓ |  |
| Delta | delta | string | ✓ |  |
| UserAttribute | userAttribute | bool | ✓ |  |

## Email

**Service:** `scim_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Value | value | string |  |  |

## EnterpriseFields

**Service:** `scim_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Division | division | string | ✓ |  |
| Organization | organization | string | ✓ |  |
| CostCenter | costCenter | string | ✓ |  |
| Department | department | string | ✓ |  |

## Name

**Service:** `scim_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Formatted | formatted | string | ✓ |  |
| FamilyName | familyName | string | ✓ |  |
| GivenName | givenName | string | ✓ |  |

## ScimUser

**Service:** `scim_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Schemas | schemas | []string |  |  |
| ID | id | string | ✓ |  |
| ExternalID | externalId | string | ✓ |  |
| Division | division | string | ✓ |  |
| NickName | nickName | string | ✓ |  |
| Organization | organization | string | ✓ |  |
| UserType | userType | string | ✓ |  |
| CostCenter | costCenter | string | ✓ |  |
| UserName | userName | string | ✓ |  |
| Active | active | bool | ✓ |  |
| DisplayName | displayName | string | ✓ |  |
| Enterprise | urn:ietf:params:scim:schemas:extension:enterprise:2.0:User | EnterpriseFields | ✓ |  |
| Name | name | Name | ✓ |  |
| Emails | emails | []Email | ✓ |  |
| Meta | meta | common.Meta | ✓ |  |

## ScimAttributeHeader

**Service:** `scimattributeheader`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CanonicalValues | canonicalValues | []string | ✓ |  |
| CaseSensitive | caseSensitive | bool | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| DataType | dataType | string | ✓ |  |
| Description | description | string | ✓ |  |
| ID | id | string | ✓ |  |
| IdpID | idpId | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| MultiValued | multivalued | bool | ✓ |  |
| Mutability | mutability | string | ✓ |  |
| Name | name | string | ✓ |  |
| Required | required | bool | ✓ |  |
| Returned | returned | string | ✓ |  |
| SchemaURI | schemaURI | string | ✓ |  |
| Uniqueness | uniqueness | bool | ✓ |  |

## ScimGroup

**Service:** `scimgroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | int64 | ✓ |  |
| ID | id | int64 | ✓ |  |
| IdpGroupID | idpGroupId | string | ✓ |  |
| IdpID | idpId | int64 | ✓ |  |
| IdpName | idpName | string | ✓ |  |
| ModifiedTime | modifiedTime | int64 | ✓ |  |
| Name | name | string | ✓ |  |
| InternalID | internalId | string | ✓ |  |

## AppServerGroup

**Service:** `segmentgroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ConfigSpace | configSpace | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| ID | id | string | ✓ |  |
| DynamicDiscovery | dynamicDiscovery | bool |  |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string |  |  |

## Application

**Service:** `segmentgroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| BypassType | bypassType | string | ✓ |  |
| ConfigSpace | configSpace | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| DefaultIdleTimeout | defaultIdleTimeout | string | ✓ |  |
| DefaultMaxAge | defaultMaxAge | string | ✓ |  |
| Description | description | string | ✓ |  |
| DomainName | domainName | string | ✓ |  |
| DomainNames | domainNames | []string | ✓ |  |
| DoubleEncrypt | doubleEncrypt | bool |  |  |
| Enabled | enabled | bool |  |  |
| HealthCheckType | healthCheckType | string | ✓ |  |
| ID | id | string | ✓ |  |
| IPAnchored | ipAnchored | bool |  |  |
| LogFeatures | logFeatures | []string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string |  |  |
| PassiveHealthEnabled | passiveHealthEnabled | bool |  |  |
| ServerGroup | serverGroups | []AppServerGroup | ✓ |  |

## ApplicationNames

**Service:** `segmentgroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string |  |  |

## SegmentGroup

**Service:** `segmentgroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string |  |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| ConfigSpace | configSpace | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| PolicyMigrated | policyMigrated | bool |  |  |
| TcpKeepAliveEnabled | tcpKeepAliveEnabled | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| AddedApps | addedApps | string | ✓ |  |
| DeletedApps | deletedApps | string | ✓ |  |
| Applications | applications | []Application |  |  |
| ApplicationNames | applicationNames | []ApplicationNames | ✓ |  |

## AppConnectorGroups

**Service:** `servergroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Citycountry | cityCountry | string | ✓ |  |
| CountryCode | countryCode | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| DnsqueryType | dnsQueryType | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| GeolocationID | geoLocationId | string | ✓ |  |
| ID | id | string | ✓ |  |
| Latitude | latitude | string | ✓ |  |
| Location | location | string | ✓ |  |
| Longitude | longitude | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string |  |  |
| SiemAppconnectorGroup | siemAppConnectorGroup | bool |  |  |
| UpgradeDay | upgradeDay | string | ✓ |  |
| UpgradeTimeinSecs | upgradeTimeInSecs | string | ✓ |  |
| VersionProfileID | versionProfileId | string | ✓ |  |
| AppServerGroups | serverGroups | []AppServerGroups | ✓ |  |
| Connectors | connectors | []Connectors | ✓ |  |

## AppServerGroups

**Service:** `servergroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ConfigSpace | configSpace | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| ID | id | string | ✓ |  |
| DynamicDiscovery | dynamicDiscovery | bool |  |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string |  |  |

## ApplicationServer

**Service:** `servergroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Address | address | string | ✓ |  |
| AppServerGroupIds | appServerGroupIds | []string | ✓ |  |
| ConfigSpace | configSpace | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string |  |  |

## Applications

**Service:** `servergroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## Connectors

**Service:** `servergroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ApplicationStartTime | applicationStartTime | string | ✓ |  |
| AppConnectorGroupID | appConnectorGroupId | string | ✓ |  |
| AppConnectorGroupName | appConnectorGroupName | string | ✓ |  |
| ControlChannelStatus | controlChannelStatus | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| CtrlBrokerName | ctrlBrokerName | string | ✓ |  |
| CurrentVersion | currentVersion | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| ExpectedUpgradeTime | expectedUpgradeTime | string | ✓ |  |
| ExpectedVersion | expectedVersion | string | ✓ |  |
| Fingerprint | fingerprint | string | ✓ |  |
| ID | id | string | ✓ |  |
| IPACL | ipAcl | []string | ✓ |  |
| IssuedCertID | issuedCertId | string | ✓ |  |
| LastBrokerConnecttime | lastBrokerConnectTime | string | ✓ |  |
| LastBrokerDisconnectTime | lastBrokerDisconnectTime | string | ✓ |  |
| LastUpgradeTime | lastUpgradeTime | string | ✓ |  |
| Latitude | latitude | float64 | ✓ |  |
| Location | location | string | ✓ |  |
| Longitude | longitude | float64 | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string |  |  |
| Platform | platform | string | ✓ |  |
| PreviousVersion | previousVersion | string | ✓ |  |
| PrivateIP | privateIp | string | ✓ |  |
| PublicIP | publicIp | string | ✓ |  |

## ServerGroup

**Service:** `servergroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| IpAnchored | ipAnchored | bool |  |  |
| ConfigSpace | configSpace | string | ✓ |  |
| DynamicDiscovery | dynamicDiscovery | bool |  |  |
| ExtranetEnabled | extranetEnabled | bool |  |  |
| CreationTime | creationTime | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| ReadOnly | readOnly | bool | ✓ |  |
| RestrictionType | restrictionType | string | ✓ |  |
| ZscalerManaged | zscalerManaged | bool | ✓ |  |
| AppConnectorGroups | appConnectorGroups | []appconnectorgroup.AppConnectorGroup |  |  |
| Servers | servers | []appservercontroller.ApplicationServer |  |  |
| Applications | applications | []Applications |  |  |
| ExtranetDTO | extranetDTO | common.ExtranetDTO | ✓ |  |

## AssistantSchedule

**Service:** `serviceedgecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| CustomerID | customerId | string |  |  |
| DeleteDisabled | deleteDisabled | bool |  |  |
| Enabled | enabled | bool |  |  |
| Frequency | frequency | string |  |  |
| FrequencyInterval | frequencyInterval | string |  |  |

## PrivateBrokerVersion

**Service:** `serviceedgecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| ApplicationStartTime | applicationStartTime | string | ✓ |  |
| BrokerId | brokerId | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| CtrlChannelStatus | ctrlChannelStatus | string | ✓ |  |
| CurrentVersion | currentVersion | string | ✓ |  |
| DisableAutoUpdate | disableAutoUpdate | bool | ✓ |  |
| LastConnectTime | lastConnectTime | string | ✓ |  |
| LastDisconnectTime | lastDisconnectTime | string | ✓ |  |
| LastUpgradedTime | lastUpgradedTime | string | ✓ |  |
| LoneWarrior | loneWarrior | bool | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Platform | platform | string | ✓ |  |
| PlatformDetail | platformDetail | string | ✓ |  |
| PreviousVersion | previousVersion | string | ✓ |  |
| ServiceEdgeGroupID | serviceEdgeGroupId | string | ✓ |  |
| PrivateIP | privateIp | string | ✓ |  |
| PublicIP | publicIp | string | ✓ |  |
| RestartInstructions | restartInstructions | string | ✓ |  |
| RestartTimeInSec | restartTimeInSec | string | ✓ |  |
| RuntimeOS | runtimeOS | string | ✓ |  |
| SargeVersion | sargeVersion | string | ✓ |  |
| SystemStartTime | systemStartTime | string | ✓ |  |
| TunnelId | tunnelId | string | ✓ |  |
| UpgradeAttempt | upgradeAttempt | string | ✓ |  |
| UpgradeStatus | upgradeStatus | string | ✓ |  |
| UpgradeNowOnce | upgradeNowOnce | bool | ✓ |  |
| ZPNSubModuleUpgradeList | zpnSubModuleUpgradeList | []common.ZPNSubModuleUpgrade | ✓ |  |

## ServiceEdgeController

**Service:** `serviceedgecontroller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ApplicationStartTime | applicationStartTime | string | ✓ |  |
| ServiceEdgeGroupID | serviceEdgeGroupId | string | ✓ |  |
| ServiceEdgeGroupName | serviceEdgeGroupName | string | ✓ |  |
| ControlChannelStatus | controlChannelStatus | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| CtrlBrokerName | ctrlBrokerName | string | ✓ |  |
| CurrentVersion | currentVersion | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| ExpectedUpgradeTime | expectedUpgradeTime | string | ✓ |  |
| ExpectedVersion | expectedVersion | string | ✓ |  |
| Fingerprint | fingerprint | string | ✓ |  |
| ID | id | string | ✓ |  |
| IPACL | ipAcl | string | ✓ |  |
| IssuedCertID | issuedCertId | string | ✓ |  |
| LastBrokerConnectTime | lastBrokerConnectTime | string | ✓ |  |
| LastBrokerConnectTimeDuration | lastBrokerConnectTimeDuration | string | ✓ |  |
| LastBrokerDisconnectTime | lastBrokerDisconnectTime | string | ✓ |  |
| LastBrokerDisconnectTimeDuration | lastBrokerDisconnectTimeDuration | string | ✓ |  |
| LastUpgradeTime | lastUpgradeTime | string | ✓ |  |
| Latitude | latitude | string | ✓ |  |
| Location | location | string | ✓ |  |
| Longitude | longitude | string | ✓ |  |
| ListenIPs | listenIps | []string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| ProvisioningKeyID | provisioningKeyId | string |  |  |
| ProvisioningKeyName | provisioningKeyName | string |  |  |
| Platform | platform | string | ✓ |  |
| PlatformDetail | platformDetail | string | ✓ |  |
| PreviousVersion | previousVersion | string | ✓ |  |
| PrivateIP | privateIp | string | ✓ |  |
| PublicIP | publicIp | string | ✓ |  |
| PublishIPs | publishIps | []string | ✓ |  |
| PublishIPv6 | publishIpv6 | bool | ✓ |  |
| RuntimeOS | runtimeOS | string | ✓ |  |
| SargeVersion | sargeVersion | string | ✓ |  |

## ServiceEdgeGroup

**Service:** `serviceedgegroup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| CityCountry | cityCountry | string | ✓ |  |
| City | city | string | ✓ |  |
| CountryCode | countryCode | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| GeoLocationID | geoLocationId | string | ✓ |  |
| GraceDistanceEnabled | graceDistanceEnabled | bool |  |  |
| GraceDistanceValue | graceDistanceValue | string | ✓ |  |
| GraceDistanceValueUnit | graceDistanceValueUnit | string | ✓ |  |
| IsPublic | isPublic | string | ✓ |  |
| Latitude | latitude | string | ✓ |  |
| Location | location | string | ✓ |  |
| Longitude | longitude | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| UseInDrMode | useInDrMode | bool |  |  |
| OverrideVersionProfile | overrideVersionProfile | bool |  |  |
| UpgradeDay | upgradeDay | string | ✓ |  |
| UpgradeTimeInSecs | upgradeTimeInSecs | string | ✓ |  |
| VersionProfileID | versionProfileId | string | ✓ |  |
| VersionProfileName | versionProfileName | string | ✓ |  |
| VersionProfileVisibilityScope | versionProfileVisibilityScope | string | ✓ |  |
| ObjectType | objectType | string | ✓ |  |
| ScopeName | scopeName | string | ✓ |  |
| RestrictedEntity | restrictedEntity | bool | ✓ |  |
| AltCloud | altCloud | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| SiteID | siteId | string | ✓ |  |
| SiteName | siteName | string | ✓ |  |
| ReadOnly | readOnly | bool | ✓ |  |
| RestrictionType | restrictionType | string | ✓ |  |
| ZscalerManaged | zscalerManaged | bool | ✓ |  |
| ExclusiveForBusinessContinuity | exclusiveForBusinessContinuity | bool | ✓ |  |
| NameWithoutTrim | nameWithoutTrim | string | ✓ |  |
| ServiceEdges | serviceEdges | []serviceedgecontroller.ServiceEdgeController | ✓ |  |
| TrustedNetworks | trustedNetworks | []trustednetwork.TrustedNetwork | ✓ |  |
| EnrollmentCertID | enrollmentCertId | string | ✓ |  |

## AssistantSchedule

**Service:** `serviceedgeschedule`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| CustomerID | customerId | string |  |  |
| DeleteDisabled | deleteDisabled | bool |  |  |
| Enabled | enabled | bool |  |  |
| Frequency | frequency | string |  |  |
| FrequencyInterval | frequencyInterval | string |  |  |

## StepAuthLevel

**Service:** `step_up_auth`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | string | ✓ |  |
| Delta | delta | string | ✓ |  |
| Description | description | string | ✓ |  |
| IamAuthLevelID | iamAuthLevelId | string | ✓ |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| ParentIamAuthLevelID | parentIamAuthLevelId | string | ✓ |  |
| MicrotenantID | microtenantId | string | ✓ |  |
| MicrotenantName | microtenantName | string | ✓ |  |
| UserMessage | userMessage | string | ✓ |  |

## Tag

**Service:** `tag_controller/tag_group`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Namespace | namespace | *TagNamespace | ✓ |  |
| Origin | origin | string | ✓ |  |
| TagKey | tagKey | *TagKey | ✓ |  |
| TagValue | tagValue | *TagValue | ✓ |  |

## TagGroup

**Service:** `tag_controller/tag_group`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| Tags | tags | []Tag |  |  |

## TagKey

**Service:** `tag_controller/tag_group`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Enabled | enabled | bool |  |  |

## TagNamespace

**Service:** `tag_controller/tag_group`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Enabled | enabled | bool |  |  |

## TagValue

**Service:** `tag_controller/tag_group`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## TagKey

**Service:** `tag_controller/tag_key`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| CustomerID | customerId | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| NamespaceID | namespaceId | string | ✓ |  |
| Origin | origin | string | ✓ |  |
| Type | type | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |
| SkipAudit | skipAudit | bool | ✓ |  |
| TagValues | tagValues | []TagValue |  |  |

## TagValue

**Service:** `tag_controller/tag_key`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |

## Namespace

**Service:** `tag_controller/tag_namespace`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool |  |  |
| Origin | origin | string | ✓ |  |
| Type | type | string | ✓ |  |
| MicroTenantID | microtenantId | string | ✓ |  |
| MicroTenantName | microtenantName | string | ✓ |  |

## TrustedNetwork

**Service:** `trustednetwork`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CreationTime | creationTime | string | ✓ |  |
| Domain | domain | string | ✓ |  |
| ID | id | string | ✓ |  |
| MasterCustomerID | masterCustomerId | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| NetworkID | networkId | string | ✓ |  |
| ZscalerCloud | zscalerCloud | string | ✓ |  |

## UserPortalAup

**Service:** `userportal/aup`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Aup | aup | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| Email | email | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| ID | id | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| PhoneNum | phoneNum | string | ✓ |  |
| MicrotenantID | microtenantId | string | ✓ |  |
| MicrotenantName | microtenantName | string | ✓ |  |

## UserPortalController

**Service:** `userportal/portal_controller`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CertificateId | certificateId | string | ✓ |  |
| CertificateName | certificateName | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| Domain | domain | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| ExtDomain | extDomain | string | ✓ |  |
| ExtDomainName | extDomainName | string | ✓ |  |
| ExtDomainTranslation | extDomainTranslation | string | ✓ |  |
| ExtLabel | extLabel | string | ✓ |  |
| GetcName | getcName | string | ✓ |  |
| ID | id | string | ✓ |  |
| ImageData | imageData | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| MicrotenantId | microtenantId | string | ✓ |  |
| MicrotenantName | microtenantName | string | ✓ |  |
| UserNotification | userNotification | string | ✓ |  |
| UserNotificationEnabled | userNotificationEnabled | bool | ✓ |  |
| ManagedByZS | managedByZs | bool | ✓ |  |

## UserPortalLink

**Service:** `userportal/portal_link`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ApplicationID | applicationId | string | ✓ |  |
| CreationTime | creationTime | string | ✓ |  |
| Description | description | string | ✓ |  |
| Enabled | enabled | bool | ✓ |  |
| IconText | iconText | string | ✓ |  |
| ID | id | string | ✓ |  |
| Link | link | string | ✓ |  |
| LinkPath | linkPath | string | ✓ |  |
| ModifiedBy | modifiedBy | string | ✓ |  |
| ModifiedTime | modifiedTime | string | ✓ |  |
| Name | name | string | ✓ |  |
| Protocol | protocol | string | ✓ |  |
| MicrotenantID | microtenantId | string | ✓ |  |
| MicrotenantName | microtenantName | string | ✓ |  |
| NameWithoutTrim | nameWithoutTrim | string | ✓ |  |
| UserPortalID | userPortalId | string | ✓ |  |
| UserPortals | userPortals | []portal_controller.UserPortalController |  |  |

---

## Behavioral notes, serialization quirks, and SDK divergences

The sections below record wire-level behavior, cross-SDK divergences, and serialization quirks extracted from the Go SDK, Python SDK, and OneAPI Postman collection. Every claim carries a file:line citation to its primary source.

### Application Segments (all variants)

**Shared base path — type differentiation is payload-driven, not URL-driven.**
All AppSegment variants (core, Browser Access, PRA, Inspection) share `/zpa/mgmtconfig/v1/admin/customers/{customerId}/application[/{id}]` for GET/POST/PUT/DELETE. The variant is determined by the presence of `inspectionApps`, `praApps`, or `clientlessApps` arrays in the payload, not by a different URL path. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:16`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:16`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentbrowseraccess/application_segment_browser_access.go:16`, `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:88-91`)

**AppSegmentInspection — read vs. write duality for sub-apps.**
GET returns sub-app details in `inspectionApps` (`[]InspectionAppDto`, `json:"inspectionApps,omitempty"`). POST/PUT sends sub-app configuration in `commonAppsDto.appsConfig` (`[]AppsConfig`). These are two distinct fields. `CommonAppsDto` on `AppSegmentInspection` carries `json:"commonAppsDto,omitempty"` — an empty struct is omitted from the wire. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:64-65`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:86-88`)

**AppSegmentPRA — both sub-app fields always serialized (no omitempty).**
`praApps` (`[]PRAApps`, `json:"praApps"`) and `commonAppsDto` (`CommonAppsDto`, `json:"commonAppsDto"`) both lack omitempty. An empty `CommonAppsDto{}` will appear on the wire as `{"commonAppsDto":{}}`. This contrasts with Inspection where `commonAppsDto` has omitempty. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:64-65`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:85-88`)

**SegmentGroupID omitempty divergence across variants.**
`AppSegmentPRA.SegmentGroupID` is `json:"segmentGroupId"` with no omitempty — an empty string is sent on the wire. `AppSegmentInspection.SegmentGroupID` and `BrowserAccess.SegmentGroupID` both carry omitempty. Core `ApplicationSegmentResource.SegmentGroupID` also has no omitempty. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:43`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:22`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentbrowseraccess/application_segment_browser_access.go:24`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:47`)

**AppSegmentInspection.adpEnabled and autoAppProtectEnabled carry omitempty; core ApplicationSegmentResource does not.**
In `AppSegmentInspection` both fields are `json:"adpEnabled,omitempty"` and `json:"autoAppProtectEnabled,omitempty"` — false is not sent. In `ApplicationSegmentResource` both have no omitempty — false is sent explicitly. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:31-33`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:31-32`)

**ZPNERID field presence by variant.**
`AppSegmentInspection` has no `ZPNERID` field at all. `AppSegmentPRA` and `BrowserAccess` both carry `ZPNERID *common.ZPNERID` with `json:"zpnErId"` (no omitempty) — a nil pointer serializes as JSON null. Core `ApplicationSegmentResource` also carries `ZPNERID` with no omitempty. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:68`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentbrowseraccess/application_segment_browser_access.go:65`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:74`)

**Sub-app ID field names differ by variant.**
Inspection `AppsConfig` uses `InspectAppID` (`json:"inspectAppId"`, no omitempty). PRA `AppsConfig` uses `PRAAppID` (`json:"praAppId"`, no omitempty). Both carry `AppID` (`json:"appId"`) referencing the parent segment. PRA `AppsConfig.Enabled` has omitempty (setting false is not sent); Inspection `AppsConfig.Enabled` has no omitempty (false is sent). (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:94,97`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:92-93,96`)

**AppSegmentInspection Update — name-based ID injection; deletedInspectApps not auto-computed by Go SDK.**
The Go SDK Update for Inspection does a pre-flight GET, builds a map of existing `inspectionApps` keyed by Name, and injects `AppID` and `InspectAppID` into each `AppsConfig` entry by name match. Sub-apps not found by name get no IDs injected. The Go SDK does NOT automatically populate `DeletedInspectApps` — callers must supply it manually. The Python SDK takes the opposite approach: it matches by domain (not name) and auto-computes `deleted_inspect_apps`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:168-203`, `vendor/zscaler-sdk-python/zscaler/zpa/app_segments_inspection.py:415-433`)

**AppSegmentPRA Update — name-based ID injection in Go SDK; domain-based in Python SDK; Go auto-computes deletedPraApps.**
The Go SDK PRA Update builds a map of existing `praApps` keyed by Name, injects `AppID` and `PRAAppID` by name match, then auto-computes `DeletedPraApps` by comparing existing `PRAApps` against remaining `AppsConfig` entries. The Python SDK instead maps existing sub-apps by domain (fetched via `getAppsByType SECURE_REMOTE_ACCESS`), injects `pra_app_id` by domain match, and also auto-computes `deleted_pra_apps`. An engineer calling the Go SDK with mismatched sub-app names will fail to inject IDs; the Python SDK is insensitive to sub-app name but requires domain to match. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:199-247`, `vendor/zscaler-sdk-python/zscaler/zpa/app_segments_pra.py:370-394`)

**BrowserAccess Update — index-based ID injection in Go SDK; domain-based in Python SDK v2.**
The Go SDK BA Update fills in missing `clientlessApps[i].ID` by matching on array index position from `existingState.ClientlessApps[i]`, not by name or domain. Reordering `clientlessApps` in the payload will map wrong existing IDs. The Python SDK BA v2 (`AppSegmentsBAV2API`) instead matches by domain, injects `ba_app_id`, and auto-computes `deleted_ba_apps`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentbrowseraccess/application_segment_browser_access.go:151-159`, `vendor/zscaler-sdk-python/zscaler/zpa/app_segments_ba_v2.py:380-398`)

**Port zeroing on Python SDK update.**
On any Python SDK update (`update_segment`, `update_segment_ba`, `update_segment_pra`, `update_segment_inspection`), unspecified port fields are explicitly set to empty arrays: `tcpPortRanges=[]`, `tcpPortRange=[]`, `udpPortRanges=[]`, `udpPortRange=[]`. Omitting ports in an update call clears all existing ports. The Go SDK does not perform this zeroing. (`vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:435-453`)

**auto-inject app_types on CREATE — PRA, Inspection, and BA v2 only.**
`add_segment_pra` auto-adds `app_types=["SECURE_REMOTE_ACCESS"]` if missing; `add_segment_inspection` auto-adds `app_types=["INSPECT"]`; `AppSegmentsBAV2API.add_segment_ba` auto-adds `app_types=["BROWSER_ACCESS"]`. The original `ApplicationSegmentBAAPI` (`app_segments_ba.py`) does NOT auto-inject `app_types`. This injection is silent — no warning is emitted if `app_types` is missing. (`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_pra.py:255-260`, `vendor/zscaler-sdk-python/zscaler/zpa/app_segments_inspection.py:163-164`)

**ApplicationSegmentResource.ShareToMicrotenants — no omitempty; inadvertent share removal risk on PUT.**
`json:"shareToMicrotenants"` with no omitempty. An empty slice serializes and can trigger removal of existing shares on an inadvertent PUT. The dedicated share endpoint is the intended mechanism for modifying shares. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:72`)

**BulkUpdateMultiMatch — applicationIds is []int not []string.**
`BulkUpdateMultiMatchPayload.ApplicationIDs` is typed as `[]int` (`json:"applicationIds"`) despite ZPA IDs being strings elsewhere. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:128-131`, `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:971-974`)

**ApplicationToServerGroupMapping.Weight is a string.**
Numeric weight must be serialized as a JSON string. `UpdateWeightedLoadBalancerConfig` returns `(nil, resp, nil)` — the first return value (the config struct) is always nil; the function does not echo back the updated config. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:290,370-378`, `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:876-880`)

**Count endpoints — all fields are strings, not integers.**
`GET /application/configured/count` returns `[]ApplicationCountResponse{appsConfigured string, configuredDateInEpochSeconds string}`. `GET /application/count/currentAndMaxLimit` returns `ApplicationCurrentMaxLimitResponse{currentAppsCount string, maxAppsLimit string}`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:133-142`, `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:1072-1116`)

**GetApplicationSummary returns 400.**
The Go SDK comment at `GetApplicationSummary` reads: "Need to review as the API is returning 400 error". Do not rely on `GET /application/summary`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:240-241`)

**Provision endpoint — Python SDK only.**
`POST /zpa/mgmtconfig/v1/admin/customers/{customerId}/application/provision` exists in the Python SDK only; there is no corresponding function in the Go SDK. (`vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:663,759-762`)

**deleteAppByType — applicationType is a query param; no forceDelete.**
`DELETE /zpa/mgmtconfig/v1/admin/customers/{customerId}/application/{applicationId}/deleteAppByType?applicationType={type}`. This endpoint does NOT accept a `forceDelete` parameter. It deletes only the typed sub-app child record, not the parent `ApplicationSegment`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentbytype/applicationsegmentbytype.go:85-93`, `vendor/zscaler-sdk-python/zscaler/zpa/app_segment_by_type.py:130-138`)

**applicationType valid values — client-side validated.**
`BROWSER_ACCESS`, `INSPECT`, `SECURE_REMOTE_ACCESS`. Both SDKs validate against this exact set client-side before sending any HTTP request. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentbytype/applicationsegmentbytype.go:34-41`, `vendor/zscaler-sdk-python/zscaler/zpa/app_segment_by_type.py:44-45`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:10007`)

**connectionSecurity valid values for PRA sub-apps.**
Postman and Go SDK agree on: `ANY`, `TLS`, `RDP`, `NLA_EXT`, `VM_CONNECT`. Python SDK docstring additionally lists `NLA` as a valid value — not present in Postman or Go SDK struct. Treat `NLA` as potentially valid at the API level but unconfirmed by Postman examples. (`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_pra.py:188`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:11008`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:101`)

**icmpAccessType valid values — Postman adds PING_TRACEROUTING.**
Postman response examples show `PING_TRACEROUTING` as a valid value in addition to `PING` and `NONE`. Python SDK docstring lists only `PING` and `NONE`. Go SDK uses `icmpAccessType` as a plain string with no SDK-level enum validation. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:11008`, `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:687`, `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:34`)

**applicationsegment_move endpoint.**
`POST /zpa/mgmtconfig/v1/admin/customers/{customerId}/application/{applicationId}/move`. Postman and Python both send only 3 fields in the body: `targetSegmentGroupId`, `targetMicrotenantId`, `targetServerGroupId`. The Go SDK struct additionally includes `applicationId` and `microtenantId` fields (both with omitempty), but the function passes `microtenantId` as a query filter rather than in the body. Returns 204 No Content; Python SDK normalizes to `{"message": "Move operation completed successfully."}`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment_move/applicationsegment_move.go:17-42`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:15068`, `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:561-588`)

**applicationsegment_share endpoint — shareToMicrotenants type divergence.**
`PUT /zpa/mgmtconfig/v1/admin/customers/{customerId}/application/{applicationId}/share`. Body: `{shareToMicrotenants: [...]}`. Go SDK models `ShareToMicrotenants` as `[]string` with omitempty; Postman shows values as `<long>` (integer type). Returns 204 No Content. Sending an empty list removes all shares. (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment_share/applicationsegment_share.go:17-21,37`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:14320`, `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py:627-653`)

### Access, Timeout, Forwarding, and Inspection Policy

**v2 package — CREATE uses v2 path; GET/DELETE use v1 path.**
`POST /zpa/mgmtconfig/v2/admin/customers/{customerId}/policySet/{policySetId}/rule` (create). `GET /zpa/mgmtconfig/v1/…/rule/{ruleId}` (single rule). `DELETE /zpa/mgmtconfig/v1/…/rule/{ruleId}`. All three sources agree: only POST (and PUT) differ by API version. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:250,295`, `vendor/zscaler-sdk-python/zscaler/zpa/policies.py:1617-1619,3966-3969`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:73638,80514`)

**PolicyRuleResource (v2 response struct) — field serialization notes.**
`microtenantId` has no omitempty on the response struct (always serialized). `conditions`, `appServerGroups`, `appConnectorGroups`, `serviceEdgeGroups` all lack omitempty on the response struct (always serialized). `credentialPool` has no omitempty on the response struct (a nil pointer serializes as null); on the request struct (`PolicyRule`) `credentialPool` does have omitempty. `policySetId` on `PolicyRule` (request) has omitempty; on `PolicyRuleResource` (response) it has NO omitempty (always serialized). (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:47-93`)

**v1 UpdateRule strips operand Name; v2 UpdateRule strips operand ID.**
Before PUT, v1 `UpdateRule` iterates all conditions/operands and clears `operand.Name` if non-empty. v2 `UpdateRule` clears `operand.ID` if non-empty instead. Both also ensure `Conditions` is set to an empty slice (not nil) when zero-length, so the API receives an empty JSON array rather than null. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/policysetcontroller.go:192-202`, `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:263-280`)

**Process-level mutex on all write operations (both SDKs).**
Go SDK: package-level `sync.Mutex` (`ruleMutex`) is acquired before `CreateRule`, `UpdateRule`, `Delete`, `Reorder`, and `BulkReorder` in both v1 and v2 packages. GET operations skip the lock. Python SDK: `@synchronized(global_rule_lock)` module-level decorator on all add/update/delete/reorder methods. Both serialize concurrent writes in the same process. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:26,245-246`, `vendor/zscaler-sdk-python/zscaler/zpa/policies.py:29-43,527`)

**BulkReorder — Go SDK pins Default_Rule last; Python SDK does not.**
Go SDK `BulkReorder` (both v1 and v2) scans all rules, skips any rule named exactly `Default_Rule` (case-sensitive), sorts the rest by caller-supplied order map, then appends the `Default_Rule` ID at the end. Python `bulk_reorder_rules` sends the caller's `rules_orders` list unmodified. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:378-396`, `vendor/zscaler-sdk-python/zscaler/zpa/policies.py:4132-4147`)

**Bulk reorder — execute-once warning.**
Postman endpoint name states "Execute this API only once to reorder the rules". The endpoint replaces the entire rule order atomically from the submitted array. Sending it twice in quick succession risks a race. Go SDK `BulkReorder` holds `ruleMutex` during the call. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:75114`, `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:343-345`)

**v2 condition operand wire format.**
Operand: `{id, creationTime, modifiedBy, modifiedTime, objectType, values ([]string, omitempty), idpId, lhs, rhs, entryValues ([]OperandsResourceLHSRHSValue, omitempty)}`. Use `entryValues` for `POSTURE`, `TRUSTED_NETWORK`, `COUNTRY_CODE`, `PLATFORM`, `RISK_FACTOR_TYPE`, `SAML`, `SCIM`, `SCIM_GROUP`. Use `values[]` for `CLIENT_TYPE`, `APP_GROUP`, and similar. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:162-188`, `vendor/zscaler-sdk-python/zscaler/zpa/policies.py:171-187,300-316`)

**v1 vs. v2 condition format differences.**
v1 operand shape: `{objectType, lhs, rhs}` flat. v2 operand shape: `{objectType, values:[...]}` for simple types; `{objectType, entryValues:[{lhs,rhs},...]}` for multi-value types. v2 conditions add a `setIds` array (array of longs) absent from v1; v1 conditions include `microtenantId` absent from v2. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:132-133,300-316`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:73629`)

**version field required on PUT (v2 only).**
v2 rule body includes a `version` field (long per Postman, string per Go SDK struct) absent from v1. Must be supplied on PUT to prevent optimistic-lock conflicts. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:73629`, `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:67`)

**disabled field — string in Go SDK; integer in Postman.**
Both Go v1 and v2 declare `disabled` as string with omitempty. Postman v2 POST body types it as integer. Using boolean `true`/`false` will likely be rejected or misinterpreted. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:51,130`, `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/policysetcontroller.go:46`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:73629`)

**reauthTimeout and reauthIdleTimeout — string in Go SDK; integer in Postman.**
Both fields are typed as string in both Go SDK packages (v1 and v2). Sample values: `'600'` (idle) and `'172800'` (48h total). Postman declares them as integer. Python SDK defaults: `reauth_timeout=172800`, `reauth_idle_timeout=600`; docstrings say str but defaults are int; the API appears to accept both. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/zpa_policy_access_timeout_rule_test.go:62-63`, `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:69-70`, `vendor/zscaler-sdk-python/zscaler/zpa/policies.py:1930-1931`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:74375`)

**credential_id and credential_pool_id are mutually exclusive (Python SDK enforced).**
Exactly one must be supplied; both present or both absent returns an error tuple without calling the API. Wire format: `credential_id → {credential: {id: ...}}`, `credential_pool_id → {credentialPool: {id: ...}}`. Go SDK v2 `PolicyRule` has both `Credential *Credential` and `CredentialPool *Credential` (both omitempty on request struct; `CredentialPool` has no omitempty on response struct). (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:2920-2923`, `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:89,155-156`)

**CLIENT_TYPE auto-injected for isolation rules — Python SDK only.**
If no `CLIENT_TYPE` condition is present in an isolation or browser-protection rule, the Python SDK silently appends `{objectType:'CLIENT_TYPE', values:['zpn_client_type_exporter']}` (v2). Go SDK has no equivalent auto-injection. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:1203-1209,2410-2416`)

**policyType valid values.**
Confirmed across all three sources: `ACCESS_POLICY`, `TIMEOUT_POLICY`, `CLIENT_FORWARDING_POLICY`, `ISOLATION_POLICY`, `INSPECTION_POLICY`, `CREDENTIAL_POLICY`, `CAPABILITIES_POLICY`, `CLIENTLESS_SESSION_PROTECTION_POLICY`, `REDIRECTION_POLICY`, `SIEM_POLICY`. Additionally `PRIVILEGED_PORTAL_POLICY`, `VPN_TUNNEL_POLICY`, `USER_PORTAL` appear in Python SDK `POLICY_MAP` and Postman aliases but are absent from Go SDK edge-case test iteration. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/edge_cases_test.go:12-14`, `vendor/zscaler-sdk-python/zscaler/zpa/policies.py:59-73`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:73052`)

**CAPABILITIES_POLICY — PrivilegedCapabilities enum values diverge between SDKs.**
Go SDK tests (v1 and v2): `INSPECT_FILE_UPLOAD`, `FILE_UPLOAD`, `FILE_DOWNLOAD`, `CLIPBOARD_COPY`, `CLIPBOARD_PASTE` (5 values). Python SDK supports additionally: `INSPECT_FILE_DOWNLOAD`, `MONITOR_SESSION`, `RECORD_SESSION`, `SHARE_SESSION` (9 total). Python also has a bug: setting `file_upload=False` maps to `INSPECT_FILE_UPLOAD` (not `FILE_UPLOAD`); setting `file_upload=True` maps to `FILE_UPLOAD`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/zpa_policy_access_capability_rule_test.go:64`, `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/zpa_policy_access_capability_rule_v2_test.go:64`, `vendor/zscaler-sdk-python/zscaler/zpa/policies.py:3207-3230`)

**REDIRECTION_POLICY action values — Python adds redirect_default.**
Go SDK tests: `REDIRECT_PREFERRED`, `REDIRECT_ALWAYS`. Python SDK: `redirect_default` (no `service_edge_group_ids` allowed), `redirect_preferred` (`service_edge_group_ids` required), `redirect_always` (`service_edge_group_ids` required; `zpn_client_type_branch_connector` and `zpn_client_type_edge_connector` disallowed in conditions). All three values are uppercased before sending. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/zpa_policy_access_redirection_rule_test.go:74`, `vendor/zscaler-sdk-python/zscaler/zpa/policies.py:3419-3423,3465-3468,3514-3523`)

**ZPA policy rule IDs must remain strings (coerce_ids=False enforced).**
Python SDK calls `transform_common_id_fields` with `coerce_ids=False` in all ZPA policy methods. ZPA IDs are 19-digit strings that exceed JS Number precision (2^53). Converting to int is unsafe. Go SDK uses string type for all ID fields in both v1 and v2 packages. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:612,704`, `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:48`)

**reformat_params bug — app_connector_group_ids maps to 'PolicySetControllers' key.**
Python SDK `reformat_params` table maps `app_connector_group_ids` to the wire key `'PolicySetControllers'` — an apparent copy-paste error. In practice this is a dead path: access rule methods manually build `appConnectorGroups` before the helper runs, so the mismapped key is never exercised. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:75-79`)

**StepAuthLevel — Go GetStepupAuthLevel unmarshals into []string, not []StepAuthLevel.**
The `StepAuthLevel` struct is defined but not used by any function in the Go package. `GetStepupAuthLevel` unmarshals into `[]string`. Python `get_step_up_auth_levels` returns the full `StepUpAuthLevel` object list. (`vendor/zscaler-sdk-go/zscaler/zpa/services/step_up_auth/step_up_auth.go:15-28,30-38`, `vendor/zscaler-sdk-python/zscaler/zpa/stepup_auth_level.py:91-101`)

**GetPolicyByApplication uses v1 URL path despite living in v2 package; Python method name has typo.**
`GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/policySet/rules/policyType/{policyType}/application/{applicationId}`. Both Go v2 package and Python SDK use the v1 URL path. Python method name: `list_rules_by_appplication_id` (double-p). (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:441-442`, `vendor/zscaler-sdk-python/zscaler/zpa/policies.py:4411-4414`)

**GetPolicyCount — Go SDK decodes into wrong type.**
`GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/policySet/rules/policyType/{policyType}/count`. Python SDK method `get_policy_rule_count` returns dict with `'count'` key as string. Go SDK v2 `GetPolicyCount` calls this URL but decodes into `[]PolicyRuleResource` — a mismatched type. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:4303-4306`, `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:432-439`)

**PrivilegedCapabilities.microtenantId — present in v1, absent from v2 request body.**
Go v1 `PrivilegedCapabilities` struct includes `MicroTenantID` (omitempty). Go v2 `PrivilegedCapabilities` struct includes `MicroTenantID` without omitempty. Postman v1 POST body shows `privilegedCapabilities.microtenantId`; Postman v2 POST body omits it. (`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontroller/policysetcontroller.go:122-128`, `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:195-201`)

**Update returns 204 No Content — Python SDK synthesizes stub.**
When the API returns 204 (no body), the Python SDK synthesizes a minimal object containing only the rule id. Callers cannot rely on the full rule object being returned on update. All three SDKs agree that PUT returns 204 No Content. (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:724-725`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:79734,77032`)

### App Connectors, Groups, and Schedules

**AssistantSchedule.FrequencyInterval — valid enum values and type mismatch.**
Must be one of: `"5"`, `"7"`, `"14"`, `"30"`, `"60"`, `"90"` (days). The Go SDK validates this client-side in `UpdateSchedule` before the PUT is sent. Postman types `frequencyInterval` as integer; Go SDK stores and validates it as a string. Python SDK performs no client-side validation. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorschedule/appconnectorschedule.go:60-63`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:31272`)

**AssistantSchedule.Enabled — client-side update gate.**
`UpdateSchedule` in the Go SDK returns error "cannot update a disabled schedule" if `Enabled` is false. The PUT is never sent, and the SDK's own integration test asserts this rejection. This guard is client-side only; Postman and the Python SDK perform no equivalent check. Consequence: a disabled schedule cannot be re-enabled through `UpdateSchedule` in the Go SDK — `CreateSchedule` (POST) is the remaining write path. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorschedule/appconnectorschedule.go:65-68`, `vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorschedule/appconnectorschedule_test.go:103-109`)

**App Connector Schedule — endpoint paths and HTTP methods.**
`GET /connectorSchedule` returns a single object (not a list). `POST /connectorSchedule` creates (returns 204 or 200, not 201). `PUT /connectorSchedule/{id}` updates. The `appconnectorcontroller` package contains a dead constant `assistantSchedule` — the actual schedule package uses `connectorSchedule`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorschedule/appconnectorschedule.go:11-14`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:31993,32542`)

**CreateSchedule returns resource.already.exist if schedule exists.**
Callers must `GetSchedule` first and branch to `Update`. The Go SDK test explicitly handles this pattern. The Python SDK `add_connector_schedule` has no equivalent guard. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorschedule/appconnectorschedule_test.go:25-33`)

**AssistantSchedule.Frequency — known value.**
The Go SDK test uses `"days"` as the Frequency string value. The Postman collection types frequency as an untyped string with no enum — no other values are documented in either source. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorschedule/appconnectorschedule_test.go:22-23`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:31272`)

**AppConnectorGroup boolean fields serialized without omitempty.**
`overrideVersionProfile`, `praEnabled`, `wafDisabled`, `tcpQuickAckApp`, `tcpQuickAckAssistant`, `useInDrMode`, `tcpQuickAckReadAssistant`, `lssAppConnectorGroup`, `enabled`, and `cityCountry` all lack omitempty — false/empty serializes on every write. `dcHostingInfo` is a string field that also lacks omitempty. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group.go:23-24,35-55`, `vendor/zscaler-sdk-python/zscaler/zpa/models/app_connector_groups.py:57-69`)

**AppConnectorGroup.Latitude and Longitude — string type; nested connector lat/lon is double.**
Group-level `Latitude` and `Longitude` are Go `string` type. Postman types the group-level values as `<string>` but the nested connector's lat/lon (inside `assistantVersion`) as `<double>` — a level-dependent type difference. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group.go:30-32`, `vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py:303-305`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:33311`)

**AppConnectorGroup.serverGroups field name mismatch.**
Go struct field is `AppServerGroup` but JSON tag is `'serverGroups'`. Python SDK `reformat_params` maps `'server_group_ids'` to wire key `'serverGroups'` (building `[{"id":...}]` objects). (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group.go:57`, `vendor/zscaler-sdk-python/zscaler/zpa/app_connectors.py:31-34`)

**connector.appConnectorGroupId type differs by nesting level.**
At the top-level connector object, `appConnectorGroupId` is typed string. Inside the nested `assistantVersion` sub-object, the same field name is typed long. Confirmed in the Postman collection. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:29077`, `vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorcontroller/zpa_app_connector_controller.go:21,70`)

**AppConnector — no Create operation.**
The `appconnectorcontroller` package exposes Get, GetByName, GetAll, Update, Delete, and BulkDelete — no Create. Connectors enroll via provisioning key. `AppConnector.Enabled` has omitempty (false is omitted on writes), unlike `AppConnectorGroup.Enabled` which lacks omitempty. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorcontroller/zpa_app_connector_controller.go:104-181,29`)

**AppConnector.ProvisioningKeyID and ProvisioningKeyName — always serialized.**
Both fields lack omitempty (`json:"provisioningKeyId"` and `json:"provisioningKeyName"` without omitempty) and are always sent on writes. All other `AppConnector` string fields have omitempty. `EnrollmentCert` is typed as `map[string]interface{}` — an unstructured blob. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorcontroller/zpa_app_connector_controller.go:47-48,56`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:29077`)

**AppConnector.ZPNSubModuleUpgrade — JSON key has 'List' suffix.**
Go field `ZPNSubModuleUpgrade` maps to JSON key `'zpnSubModuleUpgradeList'`. Postman confirms this wire key. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorcontroller/zpa_app_connector_controller.go:64`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:29077`)

**version_profile_gid snake_case anomaly.**
Inside the `versions[]` array, the field `version_profile_gid` uses snake_case while every sibling field uses camelCase. Confirmed in the Go SDK JSON tag (`json:"version_profile_gid"`), the Postman collection, and the Python SDK (which reads from config key `'version_profile_gid'` but serializes as `'versionProfileGid'` in `request_format`, creating an asymmetric read/write path). (`vendor/zscaler-sdk-go/zscaler/zpa/services/customerversionprofile/zpa_customer_version_profile.go:62`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:41304`, `vendor/zscaler-sdk-python/zscaler/zpa/models/app_connector_groups.py:320`)

**CustomerVersionProfile — read-only via /visible/versionProfiles; Python adds PUT.**
`GET /visible/versionProfiles` lists all visible profiles (paginated). `GET /versionProfile` (singular, no ID) returns the profile associated with the current customer. Both are read-only in the Go SDK. The Python SDK adds an update via `PUT /versionProfiles/{id}` with body `{"removeOverrideFlag": bool}` returning 204. (`vendor/zscaler-sdk-go/zscaler/zpa/services/customerversionprofile/zpa_customer_version_profile.go:13-16,79-95`, `vendor/zscaler-sdk-python/zscaler/zpa/customer_version_profile.py:122-125,169-184`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:41200`)

**VersionProfileID well-known value.**
String type. Value `"0"` corresponds to the "Default" version profile. Python SDK documents `version_profile` accepted values as lowercase slugs: `"default"`, `"previous_default"`, `"new_release"` — these map to IDs at the API layer. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group_test.go:43-44`, `vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py:289-291`)

**CustomerVersionProfile.Name — known platform profile names.**
`"New Release"`, `"Default"`, `"Previous Default"`, `"Default - el8"` — confirmed by Go SDK case-sensitivity test. Python SDK documents version_profile accepted values as `"default"`, `"previous_default"`, `"new_release"` (no el8 variant in Python). (`vendor/zscaler-sdk-go/zscaler/zpa/services/customerversionprofile/zpa_customer_version_profile_test.go:72`, `vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py:289-291`)

**App Connector Group — sub-resource endpoints.**
`GET /appConnectorGroup/summary` returns `CommonSummary` (id, name, enabled only). `GET /appConnectorGroup/{id}/sg` returns full `AppConnectorGroup` shape with embedded server group details. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group.go:174-192`, `vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py:140-143,230-233`)

**GET /connector and /appConnectorGroup — pagination params.**
Default page size 20, max 500. `GET /connector` supports `sortBy` and `sortDir` query params; `GET /appConnectorGroup` does not. Both support `search` and `microtenantId`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:31210,35121`, `vendor/zscaler-sdk-python/zscaler/zpa/app_connectors.py:53-56`)

### Server Groups and Application Servers

**ServerGroup and ApplicationServer base paths.**
ServerGroup: `/zpa/mgmtconfig/v1/admin/customers/{customerId}/serverGroup`. ApplicationServer: `/zpa/mgmtconfig/v1/admin/customers/{customerId}/server` (singular, not 'servers' or 'appserver'). PUT returns 204 No Content with empty body; caller must issue a separate GET to retrieve updated state. (`vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:15-17`, `vendor/zscaler-sdk-go/zscaler/zpa/services/appservercontroller/zpa_app_server_controller.go:13-15`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:118819,119563,106643,107387`)

**ApplicationServer.CreationTime — malformed JSON tag.**
The Go struct has `json:"creationTime,"` (trailing comma) — a bug. The field serializes with key `'creationTime,'` including the comma, though API reads are lenient and the malformed key is ignored on ingestion. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appservercontroller/zpa_app_server_controller.go:18-31`)

**ApplicationServer.Address — omitempty divergence between canonical and shadow struct.**
The canonical `appservercontroller.ApplicationServer` has `json:"address"` with no omitempty. The `servergroup` package defines a local shadow `ApplicationServer` struct where `Address` has omitempty. The shadow is never used by `ServerGroup.Servers` (which imports the canonical type) and appears to be dead code, but using it directly would silently omit Address when empty. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appservercontroller/zpa_app_server_controller.go:19`, `vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:117-128`)

**ServerGroup boolean fields — no omitempty on meaningful false values.**
`Enabled`, `IpAnchored`, `DynamicDiscovery`, and `ExtranetEnabled` all lack omitempty — false is always serialized. `ReadOnly` and `ZscalerManaged` use omitempty. `AppConnectorGroups` and `Servers` slices also lack omitempty — an empty slice explicitly removes all associations. (`vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:22-39`)

**update_group fetches existing group before PUT; update_server does not.**
`update_group` calls `get_group(group_id)` to seed the PUT body before merging kwargs — mandatory fields like `appConnectorGroups` are preserved even when the caller passes only a subset. `update_server` builds its PUT body purely from kwargs with no prior GET; callers must supply all fields they want preserved. Both return a stub `{id}` object when the PUT returns 204. (`vendor/zscaler-sdk-python/zscaler/zpa/server_groups.py:267-272,306-307`, `vendor/zscaler-sdk-python/zscaler/zpa/servers.py:292-294,309-311`)

**update_group strips 'applications' from PUT body by default.**
`update_group` drops the `'applications'` field from the PUT body unless the caller explicitly passes `applications=` in kwargs. This prevents HTTP 413 / payload-too-large errors on tenants where the server group is linked to many application segments. The Go SDK always serializes `Applications` (no omitempty on `ServerGroup.Applications`). (`vendor/zscaler-sdk-python/zscaler/zpa/server_groups.py:278-280`, `vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:39`)

**server_ids and app_connector_group_ids wire serialization (Python SDK).**
`server_ids` is expanded to `servers:[{id:...}]` and `app_connector_group_ids` is expanded to `appConnectorGroups:[{id:...}]` before POST/PUT. The snake-case key is popped from the body dict so only the camelCase form reaches the wire. (`vendor/zscaler-sdk-python/zscaler/zpa/server_groups.py:31-34,214-218,291-294`)

**Python SDK ServerGroup model — 'servers' field absent.**
The Python `ServerGroup` model has no `'servers'` attribute. GET responses that include a `'servers'` array are silently dropped by the model constructor. Server membership must be set via `server_ids` kwarg at write time. The Go SDK `ServerGroup.Servers` field is `[]appservercontroller.ApplicationServer` with no omitempty. (`vendor/zscaler-sdk-python/zscaler/zpa/models/server_group.py:89-116`, `vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:38`)

**configSpace accepted values.**
`DEFAULT` and `SIEM`. Applies to both `ServerGroup` and `ApplicationServer`. `ServerGroup.ConfigSpace` uses omitempty — when absent the API defaults to DEFAULT. The Python SDK's AppServers model hard-codes DEFAULT as the default value. (`vendor/zscaler-sdk-python/zscaler/zpa/server_groups.py:163-164`, `vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:26`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:119576`, `vendor/zscaler-sdk-python/zscaler/zpa/models/application_servers.py:38`)

**AppConnectorGroups latitude/longitude type mismatch (server group context).**
`Latitude` and `Longitude` on the nested `Connectors` struct in the Go SDK are `float64` (json omitempty). On the top-level `AppConnectorGroups` struct they are `string` (json omitempty). Postman confirms the same: AppConnectorGroup latitude/longitude are `<string>`, while Connector latitude/longitude are `<double>`. Deserializing a group-level latitude into a float will fail. (`vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:56-57,90-91`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:119576`)

**ExtranetDTO field divergence between Go and Python SDKs.**
Go SDK `ExtranetDTO`: `{ locationDTO, locationGroupDTO, ziaErName, zpnErId }` — all fields omitempty. Python SDK `ExtranetDTO`: `{ id, modifiedTime, creationTime, modifiedBy, ziaErName, ziaErId, locationDTO, locationGroupDTO }`. Go SDK has `zpnErId` (ZPA-side extranet resource ID); Python SDK has `ziaErId` (ZIA-side ID) but lacks `zpnErId`. Postman does not document `extranetDTO` or `extranetEnabled` at all. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:125-141`, `vendor/zscaler-sdk-python/zscaler/zpa/models/common.py:101-147`)

**ExtranetDTO.locationGroupDTO omitted from Python SDK request_format.**
`locationGroupDTO` is deserialized from responses in the Python `ExtranetDTO` model but is absent from its `request_format()` output. Additionally, `location_group_dto` is not initialized in the else-branch of `__init__`, meaning instances created without config will raise `AttributeError` if `location_group_dto` is accessed. (`vendor/zscaler-sdk-python/zscaler/zpa/models/common.py:134-147`)

**Postman AppServerGroups join-table includes 'passive' and 'weight' fields absent from both SDKs.**
When a `ServerGroup` appears nested inside an `AppConnectorGroup` response, Postman additionally includes `'passive'` (boolean) and `'weight'` (integer) in this join-table representation. Neither the Go SDK `AppServerGroups` struct nor the Python SDK `ServerGroup` model carries these fields. (`vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:105-115`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:119576`)

**ApplicationServer.Create passes struct by value; ServerGroup.Create uses pointer.**
`appservercontroller.Create` takes `ApplicationServer` by value (not `*ApplicationServer`). `servergroup.Create` takes `*ServerGroup`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/appservercontroller/zpa_app_server_controller.go:57`, `vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go:154`)

**GetByName — special character stripping and multi-word fallback.**
`GetByName` passes the name through `convertZPASearchToFilter`, which strips characters outside `[a-zA-Z0-9 _/-.] ` before building a `'name+EQ+{value}'` search param. A client-side EqualFold match is applied over the returned page. If the initial fetch returns a hard error and the name contains spaces, the SDK retries with only the first two words. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:477-521,339-378`)

### Posture Profiles and Trusted Networks

**v1/v2 endpoint asymmetry.**
Single-object GET uses `/mgmtconfig/v1/…/posture/{id}` (or `/network/{id}`); all list operations use the `/v2/` path. No v1 list endpoint exists. (`vendor/zscaler-sdk-go/zscaler/zpa/services/postureprofile/zpa_posture_profile.go:14-16,41`, `vendor/zscaler-sdk-go/zscaler/zpa/services/trustednetwork/zpa_trusted_network.go:14-16,32-33`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:81132,81148,81652`)

**PostureProfile and TrustedNetwork — read-only from the management API.**
Neither `PostureProfilesAPI` nor `TrustedNetworksAPI` expose create, update, or delete methods in either SDK. Postman collection has no POST/PUT/DELETE endpoints. Posture profiles originate from ZCC enrollment; trusted networks are managed via ZPA console. (`vendor/zscaler-sdk-python/zscaler/zpa/posture_profiles.py:38-149`, `vendor/zscaler-sdk-python/zscaler/zpa/trusted_networks.py:38-153`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:81132`)

**GetByPostureUDID and GetByNetID — full client-side scan, no server-side filter.**
Both functions call `GetAllPagesGeneric` with an empty search string, then iterate all results client-side. Large tenants will page through every profile at 500 items/page before returning. (`vendor/zscaler-sdk-go/zscaler/zpa/services/postureprofile/zpa_posture_profile.go:50-62`, `vendor/zscaler-sdk-go/zscaler/zpa/services/trustednetwork/zpa_trusted_network.go:42-54`)

**PostureProfile boolean fields — no omitempty; false is sent explicitly.**
`applyToMachineTunnelEnabled`, `crlCheckEnabled`, and `nonExportablePrivateKeyEnabled` are declared without omitempty in Go. Python defaults all three to False and includes them in `request_format`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/postureprofile/zpa_posture_profile.go:23-25`, `vendor/zscaler-sdk-python/zscaler/zpa/models/posture_profiles.py:45-51`)

**PostureProfile Go field name vs JSON key mismatch: PostureudID / postureUdid.**
Go field is `'PostureudID'`; wire key is `'postureUdid'`. Python uses `posture_udid` (attribute) → `postureUdid` (wire). (`vendor/zscaler-sdk-go/zscaler/zpa/services/postureprofile/zpa_posture_profile.go:33`, `vendor/zscaler-sdk-python/zscaler/zpa/models/posture_profiles.py:43,90-108`)

**PostureProfile Python request_format rootCert tab-key bug.**
The key at `posture_profiles.py` line 105 is `'rootCert\t'` — it contains a trailing tab character. Any write payload built via `request_format()` will silently drop `rootCert` because the API will not recognise the tab-suffixed key. (`vendor/zscaler-sdk-python/zscaler/zpa/models/posture_profiles.py:105`)

**PostureProfile.platform — type differs by source.**
Go SDK: `string` (scalar, omitempty). Python SDK: `List[str]` via `ZscalerCollection.form_list`. Postman: array of string. The Go SDK scalar cannot hold multiple values. (`vendor/zscaler-sdk-go/zscaler/zpa/services/postureprofile/zpa_posture_profile.go:26`, `vendor/zscaler-sdk-python/zscaler/zpa/models/posture_profiles.py:63`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:81220`)

**PostureProfile.domain — present in Go SDK and Postman, absent from Python model.**
Go struct has `Domain string json:"domain,omitempty"`. Postman v1 GET response body includes domain. Python `PostureProfile` model does not declare a domain attribute or map it in `request_format`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/postureprofile/zpa_posture_profile.go:28`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:81220`)

**RemoveCloudSuffix regex uses \\s (whitespace class), not literal space.**
Actual regex at `common.go:163`: `(.*)[\\ s]+\\([a-zA-Z0-9\\-_\\.]*\\)[\\s]*$` — tabs and any whitespace are also stripped, not just ASCII space. The trailing trim is `strings.Trim(res, " ")` (literal space only). (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:163-165`)

**ZPA pagination — Go SDK default page size vs Postman default.**
Go SDK `DefaultPageSize = 500` items per page (`common.go:18`). Postman collection documents default pagesize = 20, max = 500. Python `trusted_networks` docstring agrees with Postman. The Go SDK ignores the 20-item default and always requests 500. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:18`, `vendor/zscaler-sdk-python/zscaler/zpa/trusted_networks.py:47-48`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:81680`)

**ZPA pagination envelope.**
Response envelope has `'totalPages'` (parsed as `interface{}` via `strconv.Atoi` — if null/absent, only page 1 is returned) and `'list'` (`[]T`). Postman confirms: `currentCount (long)`, `list ([...])`, `totalCount (long)`, `totalPages (integer)`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:219-222,243-247`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:81754`)

**MicroTenantName resolution triggers an extra round-trip.**
If `MicroTenantID` is absent but `MicroTenantName` is set, the engine resolves name→ID via `GET /microtenants` before paginating. Posture and trusted network lookups using `MicroTenantName` will incur this extra call. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:313-323`)

**GetClientSettings (Go) — response-decode bug.**
`NewRequestDo(ctx, "GET", baseURL, nil, &settings, nil)` — the 5th param (body) is `&settings`, which gets JSON-marshalled and sent as the request body. The 6th param (response destination) is nil, so the HTTP response is never decoded into `settings`. `GetClientSettings` always returns an empty slice in the current Go SDK. (`vendor/zscaler-sdk-go/zscaler/zpa/services/client_settings/client_settings.go:47`)

**ClientSettings singningCertExpiryInEpochSec — wire key typo confirmed in both SDKs.**
Wire key is `'singningCertExpiryInEpochSec'` — 'signing' misspelled as 'singning' (missing second 'i'). Both Go and Python SDKs reproduce this typo exactly; raw API calls must match it. (`vendor/zscaler-sdk-go/zscaler/zpa/services/client_settings/client_settings.go:29`, `vendor/zscaler-sdk-python/zscaler/zpa/models/client_settings.py:45-46`)

**ClientSettings type query param — validated enum, normalised to upper-case.**
Valid values: `ZAPP_CLIENT`, `ISOLATION_CLIENT`, `APP_PROTECTION`. Go SDK applies `strings.ToUpper(strings.TrimSpace(*clientType))` before the allowlist check; callers may pass lowercase and it will be normalised. (`vendor/zscaler-sdk-go/zscaler/zpa/services/client_settings/client_settings.go:18-22,40`, `vendor/zscaler-sdk-python/zscaler/zpa/client_settings.py:40-44`)

**ClientSettings CRUD endpoints (all v1).**
`GET /clientSetting?type={type}` (filtered list); `GET /clientSetting/all` (unfiltered single object); `POST /clientSetting` (create); `DELETE /clientSetting` (no ID — deletes the customer-level setting). (`vendor/zscaler-sdk-go/zscaler/zpa/services/client_settings/client_settings.go:14-15,37-44,56-57,66-70,75-82`, `vendor/zscaler-sdk-python/zscaler/zpa/client_settings.py:71-74,111-114,153-156,192-195`)

**add_client_setting (Python) passes kwargs directly as body without camelCase conversion.**
`body = kwargs` is passed to `create_request` unchanged; callers must supply camelCase keys directly. The docstring shows snake_case arg names which do not match the wire format — a bug. (`vendor/zscaler-sdk-python/zscaler/zpa/client_settings.py:158-160`)

**delete_client_setting (Python) — 2-tuple anomaly on create_request error path.**
Line 199 returns `(None, error)` — a 2-tuple — on `create_request` failure. All other paths return 3-tuples. This breaks callers expecting consistent 3-tuple unpacking. (`vendor/zscaler-sdk-python/zscaler/zpa/client_settings.py:197-205`)

**ManagedBrowserProfile — v1 path with /search suffix.**
`GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/managedBrowserProfile/search`. `GetAll` uses GET via `GetAllPagesGenericWithCustomFilters`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/managed_browser/managed_browser.go:14-16,42-43`, `vendor/zscaler-sdk-python/zscaler/zpa/managed_browser_profile.py:75-79`)

**ClientSettings Python model adds microtenantId; Go struct does not.**
Python `ClientSettings` model includes `microtenant_id` (`microtenantId`). The Go struct has no `microtenantId` field. (`vendor/zscaler-sdk-python/zscaler/zpa/models/client_settings.py:37-48,61-78`)

### Service Edges (Private and Public)

**AssistantSchedule (ServiceEdgeSchedule) — single schedule per customer.**
`GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/serviceEdgeSchedule` returns a single schedule object (not a list); `POST` creates, `PUT /{id}` updates. One schedule per customer. (`vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgeschedule/serviceedgeschedule.go:37-56`, `vendor/zscaler-sdk-python/zscaler/zpa/service_edge_schedule.py:54-57`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:110730`)

**AssistantSchedule duplicated across two Go packages; serviceedgeschedule is canonical.**
Identical `AssistantSchedule` struct and `/serviceEdgeSchedule` endpoint constant are defined in both `serviceedgecontroller` and `serviceedgeschedule` packages. The `serviceedgeschedule` package is canonical for schedule CRUD. (`vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgecontroller/zpa_service_edge_controller.go:16,98-116`, `vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgeschedule/serviceedgeschedule.go:13,16-34`)

**update_service_edge_schedule Python bug — sends raw snake_case body.**
`update_service_edge_schedule` (PUT) constructs a camelCase payload dict but passes the original snake_case `body` variable to `create_request` at line 200 instead of `payload`. `add_service_edge_schedule` (POST) correctly passes `payload` at line 134. The PUT will send snake_case keys to the wire, bypassing the `frequency_interval` → `frequencyInterval` mapping. (`vendor/zscaler-sdk-python/zscaler/zpa/service_edge_schedule.py:185-200`)

**ServiceEdgeController.ProvisioningKeyID and ProvisioningKeyName — always serialized.**
Both lack omitempty, unlike every other string field. An unpopulated PUT body sends these as empty strings. `PrivateCloudController.ProvisioningKeyId` DOES have omitempty by contrast. (`vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgecontroller/zpa_service_edge_controller.go:47-48`, `vendor/zscaler-sdk-go/zscaler/zpa/services/private_cloud_controller/private_cloud_controller.go:48-49`)

**PrivateBrokerVersion — non-pointer struct with omitempty tag; zero-value not actually omitted.**
The field is declared as `PrivateBrokerVersion PrivateBrokerVersion json:"privateBrokerVersion,omitempty"`. Despite the omitempty tag, Go's `encoding/json` does NOT omit zero-value non-pointer structs — a zero `PrivateBrokerVersion` serializes as `{}`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgecontroller/zpa_service_edge_controller.go:63,66-96`)

**PrivateBrokerVersion.UpgradeNowOnce — sends only when true, triggering one-time upgrade.**
`bool` with omitempty: field is omitted when false, only sent when true, which triggers an immediate one-time upgrade action at the appliance. (`vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgecontroller/zpa_service_edge_controller.go:94`)

**PrivateCloudController.IpAcl is []string; ServiceEdgeController.IPACL is string — same JSON key.**
`PrivateCloudController.IpAcl json:"ipAcl,omitempty"` is `[]string`. `ServiceEdgeController.IPACL json:"ipAcl,omitempty"` is a scalar string. The wire key is identical across both resources but the expected type differs. (`vendor/zscaler-sdk-go/zscaler/zpa/services/private_cloud_controller/private_cloud_controller.go:31`, `vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgecontroller/zpa_service_edge_controller.go:33`)

**PrivateCloudController.Runtime Go field maps to runtimeOS JSON key; Python inbound parsing accepts three casings.**
Go field name is `Runtime` but JSON tag is `"runtimeOS,omitempty"`. Python inbound parsing tries config keys in order: `runtime_os`, `runtimeOs`, `runtimeOS`, then falls back to `False`. Outbound `request_format` always emits `runtimeOS`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/private_cloud_controller/private_cloud_controller.go:61`, `vendor/zscaler-sdk-python/zscaler/zpa/models/private_cloud_controller.py:84-89`)

**PrivateCloudController zpnSubModuleUpgrade inbound key vs zpnSubModuleUpgradeList outbound key mismatch in Python.**
Python model reads from API key `zpnSubModuleUpgrade` (line 126) and stores to attribute `zpn_sub_module_upgrade_list`. `request_format()` emits the wire key as `zpnSubModuleUpgradeList` — a suffix mismatch between what the API sends and what the Python SDK sends back. (`vendor/zscaler-sdk-python/zscaler/zpa/models/private_cloud_controller.py:126,253`, `vendor/zscaler-sdk-go/zscaler/zpa/services/private_cloud_controller/private_cloud_controller.go:76`)

**PrivateCloudGroup.Enabled has omitempty (false omitted); ServiceEdgeGroup.Enabled lacks omitempty (false always sent).**
Go: `PrivateCloudGroup.Enabled bool json:"enabled,omitempty"` — explicit disable requires a workaround. `ServiceEdgeGroup.Enabled bool json:"enabled"` — false always serialized, explicit disable works. (`vendor/zscaler-sdk-go/zscaler/zpa/services/private_cloud_group/private_cloud_group.go:24`, `vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgegroup/zpa_service_edge_group.go:24`)

**PrivateCloudController restart path — Go vs Python use different URL shapes.**
Go SDK `ControllerRestart` builds path as `privateCloudControllerEndpoint+"/restart/"+controllerID`, producing `/privateCloudController/restart/{id}`. Python SDK `restart_private_controller` builds `/privateCloudController/{controller_id}/restart`. These are structurally different REST paths; Postman has no entry for `PrivateCloudController` to settle the canonical path. (`vendor/zscaler-sdk-go/zscaler/zpa/services/private_cloud_controller/private_cloud_controller.go:128-135`, `vendor/zscaler-sdk-python/zscaler/zpa/private_cloud_controller.py:265-268`)

**ServiceEdgeGroup.IsPublic — string type, not boolean.**
Go SDK: `string json:"isPublic,omitempty"`. Python test uses value `"TRUE"` (string). Postman describes it as string. Despite boolean semantics, this field must be sent as a string value (e.g., `"TRUE"` not `true`). (`vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgegroup/zpa_service_edge_group.go:33`, `vendor/zscaler-sdk-python/zscaler/zpa/models/service_edge_groups.py:38`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:115554`)

**ServiceEdge.enrollmentCert — Go is untyped map; Python extracts only .name.**
Go SDK: `EnrollmentCert map[string]interface{}` — no schema. Python model extracts only `config["enrollmentCert"]["name"]` and stores as a bare string; on `request_format` re-wraps to `{"name": self.enrollment_cert}`. All sub-fields other than name are silently dropped by the Python model. (`vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgecontroller/zpa_service_edge_controller.go:58`, `vendor/zscaler-sdk-python/zscaler/zpa/models/service_edges.py:72-74`)

**serviceedgeschedule has no GetAll/list operation.**
Only `GetSchedule`, `CreateSchedule`, `UpdateSchedule` exist. (`vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgeschedule/serviceedgeschedule.go:36-77`)

**Service Edge list endpoints — default page size 20, max 500.**
Python SDK passes page as string. Postman documents page as integer. `PrivateCloudController` list additionally supports `sort_by` and `sort_dir` (default `dsc`) in Python SDK and Postman. (`vendor/zscaler-sdk-python/zscaler/zpa/service_edges.py:49-50`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:113886`, `vendor/zscaler-sdk-python/zscaler/zpa/private_cloud_controller.py:52-55`)

### LSS (Log Streaming Service)

**LSSFormats — output format enum values.**
`csv`, `tsv`, `json` — all three fields are always present with no omitempty; an empty value for any field signals an API-side error for that log type. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_formats.go:11-15`, `vendor/zscaler-sdk-python/zscaler/zpa/lss.py:583-596`)

**sourceLogType — full validated sets by surface.**
TF resource (9): `zpn_trans_log`, `zpn_auth_log`, `zpn_ast_auth_log`, `zpn_http_trans_log`, `zpn_audit_log`, `zpn_ast_comprehensive_stats`, `zpn_sys_auth_log`, `zpn_waf_http_exchanges_log`, `zpn_pbroker_comprehensive_stats`. TF data source (16): adds `zpn_smb_inspection_log`, `zpn_auth_log_1id`, `zpn_sitec_auth_log`, `zpn_sitec_comprehensive_stats`, `zpn_ldap_inspection_log`, `zms_flow_log`, `zpn_krb_inspection_log`. Postman format-lookup (11): includes `zpn_sitec_auth_log` and `zpn_sitec_comprehensive_stats` in addition to the 9-value TF resource set — but the Postman collection reflects `GET /lssConfig/logType/formats` query scope, not the receiver-write accepted set; whether these two codes are accepted by a receiver's `sourceLogType` is unresolved (zpa-41). Python SDK `source_log_map` (8): maps human-readable keys to internal codes and does not include `zpn_sys_auth_log` or `zpn_pbroker_comprehensive_stats` by name. Use the TF data source's 16-value list as the broadest known set when querying `GetFormats`. The TF resource validator only allows 9 on write. (`vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go:216-226`, `vendor/terraform-provider-zpa/zpa/data_source_zpa_lss_config_log_types_formats.go:22-38`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:63679`, `vendor/zscaler-sdk-python/zscaler/zpa/lss.py:27-36`)

**LSSConfig.UseTLS and Enabled — both carry omitempty; false is never transmitted.**
`UseTLS bool json:"useTls,omitempty"` and `Enabled bool json:"enabled,omitempty"` — both drop false from the request body. JSON key is `useTls` (lowercase 's' in Tls, not TLS). Python SDK defaults `enabled=True` both in the `LSSConfig` model and in `add_lss_config`; `use_tls` defaults to `False`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go:31,43`, `vendor/zscaler-sdk-python/zscaler/zpa/models/lss.py:120`, `vendor/zscaler-sdk-python/zscaler/zpa/lss.py:228,230`)

**LSSConfig.LSSPort — string on the wire in Go SDK and TF provider; Postman documents integer.**
Go struct: `string json:"lssPort,omitempty"`. TF provider schema: `TypeString`. Send quoted value e.g. `"9200"` not `9200`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go:39`, `vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go:207-211`)

**LSSConfig.MicroTenantID JSON key — lowercase t.**
`json:"microtenantId"` (lowercase 't' — not `microTenantId`). The Go field name is `MicroTenantID` (uppercase T) but the wire key uses lowercase 't'. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go:41`)

**PolicyRuleResourceConditions.Negated — no omitempty; false is always transmitted.**
`bool json:"negated"` — explicitly sends false. Applies to both `PolicyRuleResourceConditions` (line 129) and the legacy `Conditions` struct (line 119). (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go:119,129`)

**PolicyRuleResourceOperands.entryValues wire key.**
Wire key is `entryValues`; Go struct field is `OperandsResourceLHSRHSValue`. SAML/SCIM/SCIM_GROUP/IDP conditions must use `entryValues` with `{lhs, rhs}` pairs. `CLIENT_TYPE` conditions must use `values` (`[]string`) and must NOT include `entryValues`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go:142`, `vendor/terraform-provider-zpa/zpa/validator.go:276-289`, `vendor/zscaler-sdk-python/zscaler/zpa/lss.py:63-91`)

**PolicyRuleResource.Action for LSS policy rules — LOG only.**
`LOG` is the only valid action for LSS (SIEM) policy rules. Postman example bodies show `INTERCEPT` as the action value — this is a generic Postman template placeholder, not a valid LSS action. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller_test.go:206`, `vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go:18-25`)

**policySetId for LSS policyRuleResource — must be resolved at runtime via SIEM_POLICY lookup.**
The LSS resource's `policyRuleResource.policySetId` must be set to the tenant's SIEM_POLICY policy set ID, fetched via `GET /zpa/mgmtconfig/v1/admin/customers/{id}/policySet/policyType/SIEM_POLICY` before create/update. Both SDKs look up SIEM_POLICY at runtime. Python SDK uses the v1 endpoint for this lookup even though the LSS config itself is managed via v2. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller_test.go:17-36`, `vendor/zscaler-sdk-python/zscaler/zpa/lss.py:95-131`)

**ZPNClientTypeSlogger — omitempty in LSSClientTypes struct.**
All other `LSSClientTypes` fields have no omitempty and are always present. `zpn_client_type_slogger` has omitempty, signaling it may not be provisioned in all tenants. Code consuming `LSSClientTypes` must not assume slogger is present. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_client_types.go:20`)

**get_client_types (Python SDK) — response is reversed and normalized to human-readable keys.**
The API returns `{wire_code: display_name}`. The Python SDK reverses this to `{display_name.lower().replace(' ','_'): wire_code}` before returning. When used in `_create_policy` for `CLIENT_TYPE` conditions, the reverse map translates caller-supplied human-readable names to wire codes. (`vendor/zscaler-sdk-python/zscaler/zpa/lss.py:558-559`)

**zpn_client_type_browser_isolation — status differs by source.**
Commented out in the Go SDK integration test (treated as unsupported/removed). Listed as valid in the TF validator's `supportedClientTypes` (12-value set). Treat as suspect; test against the tenant before using. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller_test.go:242-245`, `vendor/terraform-provider-zpa/zpa/validator.go:178`)

**LSSResource — config field always serialized; Update returns no decoded body.**
`LSSResource.config` has no omitempty — always present even when the pointer is nil. `Update` (PUT) passes nil as the response target and returns `(*http.Response, error)`. Unlike `Create` which returns `*LSSResource`, `Update` decodes nothing. Python SDK returns `LSSResourceModel({'id': lss_config_id})` as a minimal stand-in on 204. (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go:19-25,195-202`, `vendor/zscaler-sdk-python/zscaler/zpa/lss.py:492-493`)

**add_lss_config validation asymmetry.**
`add_lss_config` raises `KeyError` directly on invalid `source_log_type` (no guard). `update_lss_config` validates `source_log_type` and returns `(None, None, error-string)` on miss. Callers of `add_lss_config` must validate `source_log_type` against the `source_log_map` keys before calling, or catch `KeyError`. (`vendor/zscaler-sdk-python/zscaler/zpa/lss.py:424-427`)

**connectorGroups wire shape — id-only objects on write.**
`connectorGroups` is serialized as `[{"id": group_id}]` on create/update — name is not sent. The GET response includes both id and name. (`vendor/zscaler-sdk-python/zscaler/zpa/lss.py:309`)

### Privileged Remote Access (PRA)

**CredentialPool — distinct API base path.**
CredentialPool uses `/zpa/waap-pra-config/v1/admin/customers/{customerId}/credential-pool`. All other PRA objects (Approval, Console, Credential, Portal) use `/zpa/mgmtconfig/v1/admin/customers/{customerId}/`. Mixing paths will 404. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredentialpool/pracredentialpool.go:13-16`, `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential_pool.py:39`)

**CredentialPool.PRACredentials — wire key is 'credentials', not 'praCredentials'.**
Serialized to wire key `'credentials'` (not `'praCredentials'`). Go SDK: no omitempty — always sent even when empty. Python SDK: `credential_ids` list converted to `[{id: <value>}, ...]` before send. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredentialpool/pracredentialpool.go:30`, `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential_pool.py:230-233`)

**CredentialPool.CredentialMappingCount — string type, omitempty, read-only.**
Typed as string (not int) in both Go and Python SDKs, despite representing a count. Has omitempty — omitted when empty. Read-only; not needed on create/update. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredentialpool/pracredentialpool.go:32`, `vendor/zscaler-sdk-python/zscaler/zpa/models/pra_cred_pool_controller.py:35`)

**CredentialPool Create — Go SDK does post-create GetAll to locate new record ID.**
The Go SDK's `Create` function sends POST then immediately calls `GetAll` and matches by name to locate the new record's ID, because the POST response body does not include the created ID. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredentialpool/pracredentialpool.go:77-96`, `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential_pool.py:239-247`)

**CredentialPool — uses legacy add_id_groups, not transform_common_id_fields.**
`pra_credential_pool.py` uses `add_id_groups` (the phased-out ZPA helper) rather than `transform_common_id_fields(..., coerce_ids=False)`. The manual block at line 231 fires first and pops `credential_ids`, so `add_id_groups` finds nothing to coerce for that key. (`vendor/zscaler-sdk-python/zscaler/zpa/pra_credential_pool.py:22,233,288`)

**PRAConsole bulk create — request and response shape.**
`POST /zpa/mgmtconfig/v1/admin/customers/{customerId}/praConsole/bulk`. Request body is a top-level JSON array (not a wrapped object). Response is also a top-level JSON array of `PRAConsole` objects. Sending a single object not wrapped in an array will fail. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praconsole/praconsole.go:108-116`, `vendor/zscaler-sdk-python/zscaler/zpa/pra_console.py:386-390`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:90529`)

**PRAConsole bulk create — Python SDK bypasses camelCase conversion.**
The Python SDK sets `body=None` in `create_request`, then manually assigns `request['json'] = body` (the array). This bypasses the executor's body-preparation path, so no automatic snake_case-to-camelCase conversion is applied. All field names in the bulk array must already be in camelCase wire format: `name`, `enabled`, `praApplication`, `praPortals`, `description`. `enabled` defaults to `True` and `description` defaults to `''` when omitted. (`vendor/zscaler-sdk-python/zscaler/zpa/pra_console.py:401,404,414-423`)

**WorkingHours — 7-field cron format.**
`WorkingHours` fields: `days` (`[]string` — abbreviated uppercase day names e.g. `MON`, `TUE`), `startTime` (string HH:MM), `endTime` (string HH:MM), `startTimeCron` (7-field cron expression), `endTimeCron` (7-field cron expression), `timeZone` (IANA string). 7-field cron: `[Seconds][Minutes][Hours][Day of Month][Month][Day of Week][Year]`. Example: `'0 0 17 ? * MON,TUE,WED,THU,FRI'`. Both human-readable times and cron expressions are present simultaneously in the object. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praapproval/praapproval.go:68-93`, `vendor/zscaler-sdk-python/zscaler/zpa/models/pra_approval.py:102-112`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:82474`)

**PrivilegedApproval.StartTime / EndTime — epoch integer on wire.**
Top-level `startTime` and `endTime` on the approval object are Unix epoch integers (integer type per Postman, decimal string per Go SDK struct, converted from RFC1123 string by Python SDK). Python SDK validates: `start_time` cannot be more than 1 hour in the past; `end_time` cannot be more than 365 days after `start_time`. Distinct from `WorkingHours.startTime`/`endTime` which are HH:MM strings. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praapproval/praapproval.go:27-31`, `vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py:191-197`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:83217`)

**PrivilegedApproval.WorkingHours — pointer without omitempty; nil serializes as null.**
`WorkingHours` is `*WorkingHours` in Go with no omitempty (`json:"workingHours"`). A nil `workingHours` is explicitly sent as null, which may clear an existing schedule. `Applications` is a slice with no omitempty — always serialized even when empty. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praapproval/praapproval.go:57-59`)

**PrivilegedApproval.Status valid values.**
`INVALID`, `ACTIVE`, `FUTURE`, `EXPIRED` — agreed across Go and Python SDKs. `INVALID` means the approval itself is malformed/unusable. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praapproval/praapproval.go:33-38`, `vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py:155`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:82474`)

**DeleteExpired approvals — 200 OK, optional microtenantId query param.**
`DELETE /zpa/mgmtconfig/v1/admin/customers/{customerId}/approval/expired`. Postman documents 200 OK with empty JSON object body `{}`. Accepts optional `microtenantId` query param. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praapproval/praapproval.go:148-155`, `vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py:374-381`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:85810`)

**Credential move — target_microtenant_id '0' vs integer 0.**
`POST /zpa/mgmtconfig/v1/admin/customers/{customerId}/credential/{id}/move` with no request body; returns 204 No Content. `targetMicrotenantId` is passed as a query parameter. Python SDK guard is `'if not target_microtenant_id: raise ValueError(…)'`. The integer `0` is falsy and triggers the error. The docstring types the param as str; only string `'0'` (truthy) passes the guard. Pass `'0'` as a string for the Default microtenant, not integer 0. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredential/credential_controller.go:127-143`, `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py:368-370`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:36571`)

**Credential.credentialType valid values.**
Go SDK comment lists SSH, RDP, VNC as protocol type options; integration tests use `USERNAME_PASSWORD`. Python SDK validates `USERNAME_PASSWORD`, `SSH_KEY`, `PASSWORD` and raises `ValueError` for anything else. `SSH_KEY` requires private key matching OPENSSH, RSA, or EC PEM headers. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredential/credential_controller.go:31-33`, `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py:181-199`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:37381`)

**Credential — sensitive fields absent from Python SDK response model.**
Python `PrivilegedRemoteAccessCredential` model excludes password and private_key from response fields — it maps only: id, name, description, userDomain, userName, credentialType, lastCredentialResetTime, microtenantId, microtenantName. Whether password/privateKey/passphrase are actually returned by the API or are Postman placeholder artifacts is unresolved. (`vendor/zscaler-sdk-python/zscaler/zpa/models/pra_credential.py:30-50`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:37381`)

**PRAPortal — Go struct has two separate CNAME fields.**
Go struct has both `CName (json:"cName",omitempty)` — a writable canonical name field — and `GetcName (json:"getcName",omitempty)` — the computed CNAME record the portal domain must resolve to. Postman response examples use only `'getcName'`. Python model maps `'getcName'` to `get_cname` attribute; there is no separate `cName` attribute in the Python model. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praportal/praportal.go:32-71`, `vendor/zscaler-sdk-python/zscaler/zpa/models/pra_portal.py:42-43`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:91373`)

**PRAPortal bool fields without omitempty.**
`Enabled (json:"enabled")` and `UserNotificationEnabled (json:"userNotificationEnabled")` have no omitempty — false values are always serialized. `UserNotification (json:"userNotification")` has no omitempty — always serialized even as empty string. `ExtDomain`, `ExtDomainName`, `ExtDomainTranslation`, `ExtLabel` all have no omitempty. (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praportal/praportal.go:29-65`)

**Update endpoints return 204 No Content — SDK stub handling.**
`PUT /approval/{id}`, `PUT /praConsole/{id}`, `PUT /credential/{id}` all return 204 No Content. Python SDKs return a stub object containing only the ID. Callers must not rely on the update response for field values. (`vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py:318-320`, `vendor/zscaler-sdk-python/zscaler/zpa/pra_console.py:307-308`, `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py:288-289`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:84491`)

### Microtenants

**MicroTenant.Enabled and PrivilegedApprovalsEnabled — no omitempty.**
Go SDK always serializes false on PUT/POST. Python SDK sets `self.enabled = None` when the key is absent, leaving defaulting to the server side. (`vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:22,25`, `vendor/zscaler-sdk-python/zscaler/zpa/models/microtenants.py:40,44-46`)

**UserResource.Enabled carries omitempty — unlike MicroTenant.Enabled.**
`UserResource.Enabled` (line 45) has omitempty in the Go SDK, so a Go `false` value is omitted from the request body. This is the opposite behaviour from `MicroTenant.Enabled` (no omitempty). (`vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:45,22`)

**UserResource JSON key is 'user', not 'userResource'.**
The `UserResource` pointer is serialized under the JSON key `'user'` (`json:"user,omitempty"`). Sending the key `'userResource'` in the body will be silently ignored by the API. (`vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:32`)

**roles and user sub-objects are output-only — absent from POST/PUT request bodies.**
Both appear only in GET, POST create 201, and POST search responses. Postman confirms this explicitly. (`vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:31-32`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:71406,69116`)

**CriteriaAttribute: only observed value is 'AuthDomain'.**
Go SDK tests hardcode `CriteriaAttribute: 'AuthDomain'` paired with a domain string in `CriteriaAttributeValues`. Python SDK docstring also shows only `'AuthDomain'` in examples. No enum is enforced at either SDK layer. If the supplied domain is not registered to the parent customer, the API returns error code `'domains.does.not.belong.to.customer'`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants_test.go:51-60`, `vendor/zscaler-sdk-python/zscaler/zpa/microtenants.py:263`)

**GET /microtenants/summary returns a bare JSON array of {id, name}.**
Not wrapped in `{totalPages, list[]}`. Python SDK returns an empty list if response body is not a list. Postman confirms bare array with `{id: long, name: string}` elements. (`vendor/zscaler-sdk-python/zscaler/zpa/microtenants.py:162-168`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:70318,70254`)

**get_microtenant_summary returns a 2-tuple (list, error), not the standard 3-tuple.**
All other microtenant methods return `(result, response, error)`. The summary method returns `(list, error)`, omitting the response object. (`vendor/zscaler-sdk-python/zscaler/zpa/microtenants.py:155-168`)

**update_microtenant — Python sends microtenantId as query param AND keeps it in the request body.**
Python SDK uses `body.get()` (not `pop()`) so `microtenant_id` remains in the body while also being sent as a `microtenantId` URL query parameter. (`vendor/zscaler-sdk-python/zscaler/zpa/microtenants.py:340-345`)

**PUT /microtenants returns 204 No Content.**
Python SDK synthesizes `Microtenant({'id': microtenant_id})` to avoid returning None. Go SDK `Update()` returns `(*http.Response, error)` only. (`vendor/zscaler-sdk-python/zscaler/zpa/microtenants.py:354-357`, `vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:162-169`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:69197`)

**delete_microtenant — Python type annotation says int but implementation returns 3-tuple.**
The declared return type is `int` (status code) but the actual return is `(None, response, None)`. Callers must unpack as a tuple, not treat the return as an integer. (`vendor/zscaler-sdk-python/zscaler/zpa/microtenants.py:366-395`)

**GET list uses simple GET pagination; POST search uses POST pagination.**
`GetByName` (Go) uses `GET /microtenants` + client-side EqualFold match. `GetMicrotenantByName` (Go) uses `POST /microtenants/search` + EqualFold match. Both exist in the same package. (`vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:107-149`)

**POST /microtenants/search — microtenantId passed as URL query parameter, not in POST body.**
`GetMicrotenantByName` passes `Filter{MicroTenantID: service.MicroTenantID()}` as a URL query parameter to `GetAllPagesGenericWithPostSearch`. The filter serializes to query params, not into the POST body. (`vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:140`)

**POST search pagination: Go SDK always sends validPage=0, validPageSize=0.**
`GetAllPagesGenericWithPostSearch` injects `SearchPageBy{page, pageSize=500, validPage=0, validPageSize=0}` into each request body. Postman documents `validPage` as integer while `page` and `pageSize` are typed as string — a type inconsistency in the Postman spec. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:575-615`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:72018`)

**Go SDK POST search body nests filters inside filterBy.filterGroups — Postman shows flat filterBy array.**
Go SDK `SearchRequest` uses `filterBy: {filterGroups: [{filters: [], operator}], operator}` — a two-level nesting. Postman documents `filterBy` as a flat array of filter objects with no `filterGroups` wrapper. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:532-566`, `vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:122-139`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:72018`)

**SearchFilterItem.Operator: Go SDK uses 'EQ'; Python SDK docstring uses 'EQUALS' and 'LIKE'.**
Go SDK hardcodes `Operator: 'EQ'`. Python SDK docstring examples show `'EQUALS'` and `'LIKE'`. The Go SDK executable path is the higher-trust reference. (`vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:130`, `vendor/zscaler-sdk-python/zscaler/zpa/microtenants.py:184-185`)

**Go SDK Create takes MicroTenant by value; Update takes *MicroTenant pointer.**
`func Create(…, microTenant MicroTenant)` passes the struct by value. `func Update(…, microTenant *MicroTenant)` takes a pointer. (`vendor/zscaler-sdk-go/zscaler/zpa/services/microtenants/microtenants.go:152,163`)

### Certificates and Enrollment

**EnrollmentCert — v1 vs v2 split.**
`GET /zpa/mgmtconfig/v1/…/enrollmentCert/{id}`, POST/PUT/DELETE on v1. `GET /zpa/mgmtconfig/v2/…/enrollmentCert` for list and `GetByName`. The most common mistake is mixing versions. (`vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:13-17,63-116`, `vendor/zscaler-sdk-python/zscaler/zpa/enrollment_certificates.py:35-36,78-81,122-125,180-183,241-244,302-305`)

**EnrollmentCert and BaCertificate — wire key for CNAME field is 'getcName', not 'cName'.**
The actual wire JSON key for the CNAME field on both `EnrollmentCert` and `BaCertificate` responses is `'getcName'` (lowercase 'get' prefix, capital N). Postman and Python `EnrollmentCertificate` model use `'getcName'`. Go SDK incorrectly tags both structs as `json:"cName"`. The Python `Certificate` model for BaCert also incorrectly uses `'cName'`. Go SDK will silently fail to unmarshal/marshal this field. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:46169,25489`, `vendor/zscaler-sdk-python/zscaler/zpa/models/enrollment_certificates.py:36,97`, `vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:21`, `vendor/zscaler-sdk-go/zscaler/zpa/services/bacertificate/zpa_ba_certificate.go:23`)

**EnrollmentCert zrsaencryptedprivatekey / zrsaencryptedsessionkey — fully-lowercase JSON keys.**
Both fields serialize to all-lowercase wire keys with no camelCase separators: `'zrsaencryptedprivatekey'` and `'zrsaencryptedsessionkey'`. Any code assuming camelCase will produce silent marshal/unmarshal mismatches. (`vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:40-41`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:46169`, `vendor/zscaler-sdk-python/zscaler/zpa/models/enrollment_certificates.py:52-56`)

**Python EnrollmentCertificate model — zrsaencryptedprivatekey attribute name bug in else-branch.**
In the config-present branch the attribute is `self.zrsaencryptedprivatekey` (no underscore). In the else (empty-init) branch it is `self.zrsaencryptedprivate_key` (underscore before 'key'). `request_format()` references `self.zrsaencryptedprivatekey`, so accessing the attribute on an uninitialized instance will raise `AttributeError`. (`vendor/zscaler-sdk-python/zscaler/zpa/models/enrollment_certificates.py:52-53,82,111`)

**EnrollmentCert ValidFromInEpochSec / ValidToInEpochSec — string in SDKs; long in Postman.**
Go SDK and Python SDK serialize both validity timestamps as string. Postman documents them as long. The server accepts string-encoded epoch seconds from both SDKs in practice. (`vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:38-39`, `vendor/zscaler-sdk-python/zscaler/zpa/enrollment_certificates.py:192-193`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:46169`)

**Python enrollment cert time validation — client-side constraints.**
`valid_from` cannot be more than 1 hour in the past (raises `ValueError`). `valid_to` cannot exceed `valid_from` by more than 365 days. `time_zone` must be a valid IANA string (validated against pytz). Go SDK has no equivalent. (`vendor/zscaler-sdk-python/zscaler/zpa/../utils.py:685-686,689-690,659`)

**EnrollmentCert system-provisioned names — present on every tenant.**
`"Root"`, `"Client"`, `"Connector"`, `"Service Edge"`, `"Isolation Client"` — all five are asserted by the Go integration test as present in every tenant's `GetAll` response. Treat these as system-owned, unmanageable entries. (`vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert_test.go:36-37`)

**EnrollmentCert GetByName — case-insensitive (EqualFold); BaCertificate GetIssuedByName — case-sensitive (exact).**
Passing a wrong-case name to `GetIssuedByName` returns an error; for `EnrollmentCert` it succeeds. (`vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:81`, `vendor/zscaler-sdk-go/zscaler/zpa/services/bacertificate/zpa_ba_certificate.go:60`)

**EnrollmentCert Delete passes MicroTenantID filter; Create and Update do not.**
In a microtenant context, Create and Update may operate on the wrong scope. (`vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:90,99,108`)

**EnrollmentCert.AllowSigning — omitempty prevents explicit false.**
`AllowSigning bool` carries omitempty. A `false` value is dropped from the serialized payload. (`vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:20,36`)

**BaCertificate issued-cert list — both SDKs use deprecated /clientlessCertificate/issued path.**
Postman marks `GET /mgmtconfig/v2/…/clientlessCertificate/issued` as deprecated with replacement at `GET /mgmtconfig/v2/…/certificate/issued`. Both Go SDK (`baCertificateIssuedEndpoint`) and Python SDK (`list_issued_certificates`) still call the deprecated path. (`vendor/zscaler-sdk-go/zscaler/zpa/services/bacertificate/zpa_ba_certificate.go:16-17,87`, `vendor/zscaler-sdk-python/zscaler/zpa/certificates.py:145`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:22434,24646`)

**BaCertificate — deletion returns HTTP 400 on re-fetch, not 404.**
After a successful Delete, attempting Get by ID returns an error containing `'400'`, not 404. Do not use `errorx.IsObjectNotFound()` to detect post-delete state. (`vendor/zscaler-sdk-go/zscaler/zpa/services/bacertificate/zpa_ba_certificate_test.go:157-160`)

**BaCertificate upload — CertBlob must be PEM cert + RSA private key concatenated.**
`CertBlob` must contain a `CERTIFICATE` PEM block concatenated with an `RSA PRIVATE KEY` block (PKCS#1). Empty `CertBlob` yields an API error. (`vendor/zscaler-sdk-go/zscaler/zpa/services/bacertificate/zpa_ba_certificate_test.go:32,65-76,80-90`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:23951`)

**BaCertificate — no Update (PUT) endpoint in Go SDK or Postman.**
Go SDK has no Update function for `BaCertificate`. Postman collection has no `PUT /mgmtconfig/…/certificate/:id`. Python SDK's `update_certificate` calls `PUT /certificate/{certificate_id}`. Trust Go SDK and Postman — the Python `update_certificate` may not be a valid API operation. (`vendor/zscaler-sdk-go/zscaler/zpa/services/bacertificate/zpa_ba_certificate.go`, `vendor/zscaler-sdk-python/zscaler/zpa/certificates.py:266-321`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:23202`)

**EnrollmentCert — Generate CSR and Generate Self-Signed both on v1.**
`POST /zpa/mgmtconfig/v1/…/enrollmentCert/csr/generate` and `POST /zpa/mgmtconfig/v1/…/enrollmentCert/selfsigned/generate`. Both SDKs agree. (`vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:126,135`, `vendor/zscaler-sdk-python/zscaler/zpa/enrollment_certificates.py:344-347,416-419`)

**Python EnrollmentCertificate model missing description.**
`description` is set to None only in the else (empty-init) branch; it is never parsed from API config and is absent from `request_format()`. Go SDK and Postman both include description. Sending a description via Python SDK will silently drop it. (`vendor/zscaler-sdk-python/zscaler/zpa/models/enrollment_certificates.py:67`, `vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:26`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:46169`)

**list_enrolment (Python) does not support microtenant_id query param; Go SDK GetAll passes MicroTenantID.**
Go SDK `GetAll` passes `common.Filter{MicroTenantID:…}` on the v2 list call. Python `list_enrolment` has no `microtenant_id` extraction or `microtenantId` injection. (`vendor/zscaler-sdk-python/zscaler/zpa/enrollment_certificates.py:83-88`, `vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:116-117`)

**delete_enrollment_certificate dry_run — omitted when falsy.**
`dry_run=False` is equivalent to omitting the parameter — the `dryRun` query param is only injected when truthy. (`vendor/zscaler-sdk-python/zscaler/zpa/enrollment_certificates.py:307`)

### Provisioning Keys

**ProvisioningKeyAssociationTypes — documented wire values.**
`CONNECTOR_GRP` and `SERVICE_EDGE_GRP` are the two publicly documented and Postman-confirmed wire values. `NP_ASSISTANT_GRP` is present in the Go SDK enum slice but absent from the Python SDK's `simplify_key_type()` and from all Postman collection entries — treat it as an internal/preview value. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:18-22`, `vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:36-41`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:94652`)

**No single list-all endpoint — fan-out required.**
There is no API endpoint to list all provisioning keys regardless of type. Callers must issue one GET per association type and merge results. Go SDK's `GetAll()` iterates all three known association types. Python SDK does not implement an equivalent cross-type list. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:17,165-173`)

**AssociationType is a path segment, not a request body field.**
The key type is encoded only as a URL path segment. The Go SDK struct includes `AssociationType` but without omitempty, so it is emitted in JSON payloads. The API never echoes `AssociationType` in response bodies — the Go SDK manually back-fills it after every API call. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:43,59,72,119,133,145,160`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:94620`)

**GetAll silently suppresses per-type errors.**
Go SDK `GetAll()` uses a blank identifier for the error returned by `GetAllByAssociationType` on each iteration. If one association type query fails, the error is discarded and results from the remaining types are still returned. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:167`)

**GetByNameAllAssociations — first match wins (CONNECTOR_GRP first).**
Tries `CONNECTOR_GRP` first, then `SERVICE_EDGE_GRP`, then `NP_ASSISTANT_GRP`. If a key name exists in multiple association types, the `CONNECTOR_GRP` result wins. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:111-122`)

**MaxUsage and UsageCount — strings in both SDKs; Postman documents them as integers.**
SDK integration tests pass `MaxUsage` as the string literal `'10'`. Postman documents both as integer type. Treat both as strings when using the SDKs. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:32,40`, `vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key_connector_test.go:89`, `vendor/zscaler-sdk-python/zscaler/zpa/models/provisioning_keys.py:36`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:94720`)

**ExpirationInEpochSec — string in Go SDK; Postman documents as integer.**
Go SDK declares `ExpirationInEpochSec` as a Go string. Postman schema shows it as an integer. Python model does not include this field. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:29`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:94720`)

**Enabled — omitempty on boolean; false is not sent in Go SDK.**
The Go SDK uses omitempty on `Enabled`. Explicitly disabling a key requires a workaround. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:28`, `vendor/zscaler-sdk-python/zscaler/zpa/models/provisioning_keys.py:38`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:94720`)

**IPACL is a JSON array of strings, not a comma-delimited string.**
Go SDK declares `IPACL` as `[]string` with JSON tag `'ipAcl'`. Postman confirms array of strings. Python model has no `ipAcl` field. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:31`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:94720`)

**ZcomponentID — wire key 'zcomponentId', serialized as string; same value as AppConnectorGroupID for CONNECTOR_GRP keys.**
Both SDKs treat it as a string. Postman documents type as long. The Python SDK user-facing kwarg for create is `'component_id'`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:41`, `vendor/zscaler-sdk-python/zscaler/zpa/models/provisioning_keys.py:37`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:94720`)

**Python add_provisioning_key leaks snake_case keys into wire payload.**
`component_id` and `enrollment_cert_id` are read via `body.get()` (not `pop()`), so the original snake_case keys remain in the dict alongside the remapped camelCase keys when the body is sent to the API. (`vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:312-319`)

**Python update_provisioning_key requires wire-cased keys from caller.**
`update_provisioning_key` passes the kwargs body through to the request executor without any key remapping. Unlike `add_provisioning_key` which accepts snake_case kwargs, update callers must supply wire-cased keys directly. (`vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:380-384`)

**Python get_provisioning_key_by_zcomponent — URL construction bug.**
Path is built as `'…associationType/{key_type}zcomponent/{zcomponent_id}/provisioningKey'` — there is no slash between the `associationType` value and the `'zcomponent'` literal. The Go SDK correctly includes the slash at line 151. (`vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:242-244`, `vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:151`)

**Python ProvisioningKey model is missing 11 fields present in the Go struct.**
Missing from the Python model: `AssociationType`, `AppConnectorGroupID`, `AppConnectorGroupName`, `IPACL`, `ReadOnly`, `RestrictionType`, `ZscalerManaged`, `MicroTenantID`, `MicroTenantName`, `UIConfig`, `ExpirationInEpochSec`. The Python model has 13 fields vs the Go struct's 24. (`vendor/zscaler-sdk-python/zscaler/zpa/models/provisioning_keys.py:27-56`, `vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:24-49`)

**ProvisioningKey token field — read-only, absent from create request.**
The actual provisioning token string is returned in the `'provisioningKey'` field. In the Go SDK it uses omitempty — absent from create/update request bodies. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:36`, `vendor/zscaler-sdk-python/zscaler/zpa/models/provisioning_keys.py:40`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:94720`)

**Update returns no body — callers must re-GET.**
Go SDK `Update()` accepts nil as the response body target. Postman documents PUT as returning 204 No Content. Python SDK returns a minimal `ProvisioningKey({'id': key_id})` stub. (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:91-98`, `vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:392-393`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:95325`)

### Machine Groups and Tunnels

**MachineGroup.Enabled — omitempty is a latent write bug.**
Go SDK struct tags `json:"enabled,omitempty"` on the `Enabled` bool field. Sending `enabled=false` via Go SDK silently drops the field from the request body. Python SDK defaults `enabled=True` when the key is absent from the API response. (`vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go:22`, `vendor/zscaler-sdk-python/zscaler/zpa/models/machine_groups.py:37,47`)

**Machine sub-object cert field — Go SDK uses signingCert; Postman/API uses enrollmentCert.**
The Go SDK models the machine certificate field as `SigningCert map[string]interface{}` with JSON tag `signingCert`. The OneAPI Postman collection consistently uses the field name `enrollmentCert`. If the API sends `enrollmentCert` the Go SDK tag will not deserialize it. (`vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go:45`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:67353`)

**MachineGroup ID and Machine ID — string in Go/Python; long in Postman.**
The Go SDK declares `MachineGroup.ID` and `Machines.ID` as string. Postman types them as `<long>`. Pass as string to all SDK calls regardless of the Postman annotation. Do not cast to int. (`vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go:19,32`, `vendor/zscaler-sdk-python/zscaler/zpa/machine_groups.py:164`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:67294-67295,67353`)

**Machine.issuedCertId and machineTokenId — string in Go SDK; long in Postman.**
Go SDK: `IssuedCertID string` / `MachineTokenID string` (both omitempty). Postman: `issuedCertId <long>` / `machineTokenId <long>`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go:37,40`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:67353`)

**Python SDK MachineGroup model omits machines sub-list, microtenant fields, and all machine-identity fields.**
The Python SDK `MachineGroup` model exposes only: id, name, enabled, description, creation_time, modified_time, modified_by. Missing: machines sub-list, microtenantId, microtenantName, fingerprint, issuedCertId, machineGroupId, machineGroupName, machineTokenId, signingCert/enrollmentCert. The Go SDK `Machines` struct exposes all of these. (`vendor/zscaler-sdk-python/zscaler/zpa/models/machine_groups.py:33-42`, `vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go:31-46`)

**pagesize wire key — lowercase for all ZPA endpoints except /emergencyAccess/users.**
Postman uses lowercase `pagesize` for `GET /machineGroup`. Python SDK `request_executor` preserves lowercase `pagesize` for all standard ZPA endpoints; only `/emergencyAccess/users` gets camelCase `pageSize`. Go SDK `Pagination` struct uses `url:"pagesize,omitempty"`. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:67877-67879`, `vendor/zscaler-sdk-python/zscaler/request_executor.py:402-412`, `vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:22`)

**microtenantId query param semantics — 0 for default microtenant, null/absent for customer data microtenant.**
Postman documents: "For Default microtenant 0 should be passed and for Customer data microtenant should be null." Neither Go SDK nor Python SDK sends 0 for the default microtenant — both omit the param when the value is falsy. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:67280-67283,67889-67892`, `vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go:51`, `vendor/zscaler-sdk-python/zscaler/zpa/machine_groups.py:81-82`)

**summary endpoint present in both SDKs, absent from OneAPI Postman collection.**
`GET /machineGroup/summary` is implemented in both Go SDK (`GetMachineGroupSummary`) and Python SDK (`list_machine_group_summary`) and returns only name and ID. The OneAPI Postman collection contains only two `machineGroup` endpoints (GET by ID and GET list) and does not include `/summary`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go:81-88`, `vendor/zscaler-sdk-python/zscaler/zpa/machine_groups.py:100-162`)

**NPClient (vpnConnectedUsers) omits MicroTenantID from all filter calls.**
The Go SDK `np_client` service passes an empty `common.Filter{}` to both `GetAll` and `GetByName`, with no `MicroTenantID` injected. Every other ZPA service passes `common.Filter{MicroTenantID: service.MicroTenantID()}`. Python SDK has no equivalent service for `NPClient`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/np_client/np_client.go:34-36,46-48`)

**NPClient struct — all IDs are int (not string); UserName JSON tag is uppercase.**
`NPClient` breaks the ZPA string-ID convention: `id`, `modifiedBy`, `modifiedTime`, `creationTime`, `deviceState`, and `vpnServiceEdgeId` are all typed `int`. `clientIpAddress`, `commonName`, `vpnServiceEdgeName`, and `UserName` are string. JSON tag for username is `json:"UserName,omitempty"` (capital U and N). (`vendor/zscaler-sdk-go/zscaler/zpa/services/np_client/np_client.go:18-29`)

**Legacy ZPAClient.machine_groups constructs a new MachineGroupsAPI instance on every property access.**
The legacy `ZPAClient.machine_groups` is a `@property` that instantiates a fresh `MachineGroupsAPI` on every call (no caching). Code that accesses `client.zpa.machine_groups` in a tight loop on the legacy client creates N object instances. (`vendor/zscaler-sdk-python/zscaler/zpa/legacy.py:571-579`, `vendor/zscaler-sdk-python/zscaler/zpa/zpa_service.py:204-206`)

**Pagination.Search vs Search2 — callers must set Filter.Search.**
`Pagination` struct has `Search` (never serialized) and `Search2` (`url:"search"`, the actual wire field). `getAllPagesGenericWithCustomFilters` copies `Filter.Search` into `pagination.Search2` internally. Callers must set `filters.Search` on the `Filter` struct. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:24-25,233-234`)

**MachineGroup.creationTime, modifiedTime — string in Go SDK; integer in Postman.**
Go SDK declares `CreationTime` and `ModifiedTime` as string. Postman documents them as `<integer>` (epoch seconds). `ModifiedBy`: string in Go SDK, `<long>` in Postman. (`vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go:23,25,26`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:67353`)

### IdP, SAML, and SCIM

**IdpController.useCustomSPMetadata wire key — SP is fully uppercased.**
Wire key is `'useCustomSPMetadata'` (SP fully uppercased), not `'useCustomSpMetadata'`. Both Go SDK struct tag and Python model agree. (`vendor/zscaler-sdk-go/zscaler/zpa/services/idpcontroller/zpa_idp_controller.go:44`, `vendor/zscaler-sdk-python/zscaler/zpa/models/idp.py:71`)

**IdpController.autoProvision and signSamlRequest — string-encoded integers.**
Both fields are typed as string in the Go SDK and deserialize as string in Python. The API returns them as string-encoded integers: `autoProvision='0'` and `signSamlRequest='1'` (observed in a recorded live-API response cassette). Postman spec types them as `<integer>` but the actual wire format is string. (`vendor/zscaler-sdk-go/zscaler/zpa/services/idpcontroller/zpa_idp_controller.go:20,42`, `vendor/zscaler-sdk-python/tests/integration/zpa/cassettes/TestScimGroups.yaml:23`)

**IdpController.ssoType enum values.**
`[]string` typed field. Known values are `'USER'` (end-user authentication) and `'ADMIN'` (ZPA admin console login). To retrieve SCIM groups or SCIM attribute headers you must first locate an IdP whose `ssoType` slice contains `'USER'`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/idpcontroller/zpa_idp_controller.go:43`, `vendor/zscaler-sdk-python/zscaler/zpa/models/idp.py:77`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:47255`)

**IdpController.SignSamlRequest Go struct tag — double comma.**
The Go struct tag is `json:"signSamlRequest,,omitempty"` — a double comma. Go's `encoding/json` silently ignores the extra comma. The same double-punctuation bug appears in `ScimAttributeHeader.CreationTime`: `json:"creationTime,omitempty,"` (trailing comma). (`vendor/zscaler-sdk-go/zscaler/zpa/services/idpcontroller/zpa_idp_controller.go:42`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scimattributeheader/zpa_scim_attribute_header.go:23`)

**IdpController v1/v2 endpoint split.**
Single-item GET uses mgmtconfig v1. List, GetAll, and GetByName all use mgmtconfig v2. (`vendor/zscaler-sdk-go/zscaler/zpa/services/idpcontroller/zpa_idp_controller.go:13-15,68`, `vendor/zscaler-sdk-python/zscaler/zpa/idp.py:83-86,127-130`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:47255,48054`)

**IdpController.domainList wire key — domainList (capital L).**
Wire JSON key is `'domainList'`. Go field name is `'Domainlist'` (lowercase l in struct). ZIdentity-backed IdPs include synthetic domains like `'<customerId>.zpa-customer.com'` and `'<name>.zslogin.net'` (observed in a recorded live-API response cassette). (`vendor/zscaler-sdk-go/zscaler/zpa/services/idpcontroller/zpa_idp_controller.go:24`, `vendor/zscaler-sdk-python/zscaler/zpa/models/idp.py:75`, `vendor/zscaler-sdk-python/tests/integration/zpa/cassettes/TestScimGroups.yaml:23,25`)

**AdminMetadata vs UserMetadata serialization asymmetry.**
`AdminMetadata`: all five fields have no omitempty — always serialized. `UserMetadata`: `SpBaseURL` has no omitempty (always serialized); `CertificateURL`, `SpEntityID`, `SpMetadataURL`, `SpPostURL` all have omitempty. Python `ServiceProvider` model defaults `sp_entity_id`, `sp_metadata_url`, and `sp_post_url` to boolean `False` (not `None`) when the key is absent — a bug for URL-typed fields. (`vendor/zscaler-sdk-go/zscaler/zpa/services/idpcontroller/zpa_idp_controller.go:50-64`, `vendor/zscaler-sdk-python/zscaler/zpa/models/idp.py:183-225`)

**IdP fields in Python SDK and cassette but absent from Go struct.**
Python `IDPController` has `delta`, `iam_idp_id`, `migration_detail`, `one_identity_enabled`, and `certificates` — none present in the Go struct. Go SDK callers silently drop these fields on read. (`vendor/zscaler-sdk-python/zscaler/zpa/models/idp.py:43,52,57,61,79-81`)

**SCIM group endpoints — userconfig only, read-only.**
Both list-by-IdP (`GET /zpa/userconfig/v1/customers/{customerId}/scimgroup/idpId/{idpId}`) and single-get route to userconfig v1, not mgmtconfig. No Create/Update/Delete endpoints — SCIM groups originate from IdP push. (`vendor/zscaler-sdk-go/zscaler/zpa/services/scimgroup/zpa_scim_group.go:14-16,31-33,64-65`, `vendor/zscaler-sdk-python/zscaler/zpa/scim_groups.py:94-97,138-141`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:101988,102357`)

**ScimGroup ID types — int64 in Go; idpName absent from API.**
`ID` and `IdpID` are `int64`. Postman confirms `id` and `idpId` as `<long>`. The Go SDK struct includes `IdpName` (string) but neither Postman nor Python model returns `idpName` in ScimGroup responses — the field will always be empty on deserialization. (`vendor/zscaler-sdk-go/zscaler/zpa/services/scimgroup/zpa_scim_group.go:19-28`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:102020`)

**ScimGroup list — sortOrder uses 'DSC' not 'DESC'.**
The `sortOrder` parameter accepts `'ASC'` or `'DSC'` (not `'DESC'`). Default is `DSC`. Both `startTime` and `endTime` must be provided together; either alone is invalid. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:102410,102398`, `vendor/zscaler-sdk-python/zscaler/zpa/scim_groups.py:61`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scimgroup/zpa_scim_group.go:45-49`)

**ScimAttributeHeader — mgmtconfig v1 for schema headers; userconfig v1 for values.**
Schema header list and single-get use mgmtconfig v1 with `idpId` mandatory in path. Attribute value enumeration uses userconfig v1. (`vendor/zscaler-sdk-go/zscaler/zpa/services/scimattributeheader/zpa_scim_attribute_header.go:13-17,39-47,52-55`, `vendor/zscaler-sdk-python/zscaler/zpa/scim_attributes.py:75-78,116-119,165-168`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:100189,100924,101485`)

**ScimAttributeHeader.SearchValues strips email domain before query.**
`SearchValues` calls `strings.Split(searchQuery, "@")[0]` before building the request URL, discarding everything from the @ character onward. Python SDK passes the query through without this transformation. (`vendor/zscaler-sdk-go/zscaler/zpa/services/scimattributeheader/zpa_scim_attribute_header.go:52`)

**ScimAttributeHeader delta field — in Python model; absent from Go struct.**
Python `SCIMAttributeHeader` model has a `delta` field (line 45). Go SDK `ScimAttributeHeader` struct has no delta field. (`vendor/zscaler-sdk-python/zscaler/zpa/models/scim_attributes.py:45`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scimattributeheader/zpa_scim_attribute_header.go:20-37`)

**scim_api ScimGroup.ExternalID is *string; ScimUser.ExternalID is string.**
Within the same package both represent the SCIM `externalId` field but use inconsistent types. (`vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_group_api.go:21`, `vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_user_api.go:22`)

**ScimUser.Active bool with omitempty — deactivation bug.**
`ScimUser.Active` is `bool` with `json:"active,omitempty"`. A PUT to deactivate a user will silently drop `Active=false`, leaving the user active. (`vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_user_api.go:31`)

**GetUserByName matches on DisplayName, not UserName.**
The parameter is named `userName` but the comparison field is `DisplayName`. If a user's `DisplayName` differs from their `UserName` (login), the function will not find them by login. (`vendor/zscaler-sdk-go/zscaler/zpa/services/scim_api/scim_user_api.go:74-91`)

**ZPA SCIM configuration is a process-level singleton (sync.Once).**
`NewScimConfig` uses a package-level `globalScimConfig` and `scimConfigOnce` (`sync.Once`). A single process can only target one IdP via the SCIM protocol client. (`vendor/zscaler-sdk-go/zscaler/zpa/config_scim.go:41-42,82,110-113`)

**SCIM API pagination — startIndex-based with 10 default and 100 max.**
`GetAllPagesScimGenericWithSearch` enforces: default `itemsPerPage=10` (when <=0), max=100 (clamped). Uses `startIndex` (1-based) and `count` parameters. Response envelope: `{Resources: []T, totalResults: int}`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:408-456`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:47294`)

**SCIM API uses Content-Type: application/scim+json, not application/json.**
The `scim_api` `DoRequest` method always sets `Content-Type: application/scim+json`. Using the regular ZPA `NewRequestDo` client against SCIM endpoints will send `application/json` and will likely fail. (`vendor/zscaler-sdk-go/zscaler/zpa/config_scim.go:244-245`)

**ScimAttributeHeader.GetByName case-insensitive; SamlAttribute.GetByName exact-match.**
`ScimAttributeHeader.GetByName` uses `strings.EqualFold`. `SamlAttribute.GetByName` uses exact string equality. (`vendor/zscaler-sdk-go/zscaler/zpa/services/scimattributeheader/zpa_scim_attribute_header.go:71`, `vendor/zscaler-sdk-go/zscaler/zpa/services/samlattribute/zpa_saml_attribute.go:49`)

**ZPA SCIM base URL cloud variants.**
`PRODUCTION` (default): `https://scim1.private.zscaler.com/scim/1/` | `BETA`: `https://scim1.zpabeta.net/scim/1/` | `ZPATWO`: `https://scim1.zpatwo.net/scim/1/` | `GOV`: `https://scim1.zpagov.net/scim/1/` | `GOVUS`: `https://scim1.zpagov.us/scim/1/` | `PREVIEW`: `https://scim1.zpapreview.net/scim/1/`. (`vendor/zscaler-sdk-go/zscaler/zpa/config_scim.go:30-36`)

**list_saml_attributes_by_idp — omits SAMLAttribute model class in execute call.**
`list_saml_attributes_by_idp` calls `self._request_executor.execute(request)` without passing `SAMLAttribute` as the model class, unlike `list_saml_attributes` which passes it. Output is still correct (objects are constructed manually), but the executor will not auto-deserialize. (`vendor/zscaler-sdk-python/zscaler/zpa/saml_attributes.py:143,83`)

### Cloud Browser Isolation (CBI) and AppProtection/Inspection

**All CBI resources share /zpa/cbiconfig/cbi/api/customers/{customerID} base path.**
`CBIRegions`, `ZPAProfiles`, `IsolationProfile` (cbiconfig), `CBIBanner`, and `CBICertificate` all use this prefix. Distinct from the `/zpa/mgmtconfig/v1/admin/customers/{customerID}` path used by `isolationprofile` (mgmtconfig), `BrowserProtection`, and `InspectionProfile`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiregions/cbiregions.go:13`, `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbizpaprofile/cbizpaprofile.go:13`, `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:13`, `vendor/zscaler-sdk-python/zscaler/zpa/cbi_banner.py:35`)

**CBIRegions and ZPAProfiles — no server-side search; flat array response.**
Both `GET /regions` and `GET /zpaprofiles` return a bare JSON array with no `totalPages` or `list` wrapper. Neither endpoint supports server-side filtering. (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiregions/cbiregions.go:22-44`, `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbizpaprofile/cbizpaprofile.go:30-70`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:19299`)

**ZPAProfiles — enabled and cbiUrl lack omitempty; always serialized.**
`ZPAProfiles.enabled (bool)` and `cbiUrl (string)` both lack omitempty — false/empty-string are sent on PUT/POST. (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbizpaprofile/cbizpaprofile.go:17-28`, `vendor/zscaler-sdk-python/zscaler/zpa/models/cbi_zpa_profile.py:36-45`)

**CBIBanner and CBICertificate — POST uses singular path; all other ops use plural.**
`CBIBanner`: `POST /banner` (singular) to create; GET/PUT/DELETE use `/banners` or `/banners/{id}`. `CBICertificate`: `POST /certificate` (singular) to create; GET/PUT/DELETE use `/certificates` or `/certificates/{id}`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbibannercontroller/cbibannercontroller.go:14-16,66-91`, `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbicertificatecontroller/cbicertificatecontroller.go:14-16,70-105`, `vendor/zscaler-sdk-python/zscaler/zpa/cbi_banner.py:62-65,148-152`, `vendor/zscaler-sdk-python/zscaler/zpa/cbi_certificate.py:143-146`)

**CBI IsolationProfile (cbiconfig/profiles) — no pagination envelope.**
`GetAll` unmarshals directly into `[]IsolationProfile` with no `totalPages` envelope. Contrasts with `isolationprofile` (mgmtconfig) which uses the standard ZPA pagination engine. (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:164-172`, `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/isolationprofile/isolationprofile.go:52-59`)

**CBI IsolationProfile — dual region/certificate representation; write ID-only, read full objects.**
Profile struct carries both `Regions []Regions` and `RegionIDs []string`, and both `Certificates []Certificates` and `CertificateIDs []string`. On write, send `RegionIDs` and `CertificateIDs` (flat string arrays). On read, the API populates the full `Regions`/`Certificates` object arrays. Python SDK enforces minimum 2 `region_ids` client-side before sending. (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:31-36`, `vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py:227-228`)

**CBI IsolationProfile UserExperience — four booleans lack omitempty.**
`sessionPersistence`, `browserInBrowser`, `persistIsolationBar`, and `translate` all use `json:"<field>"` without omitempty and will always be serialized as false when unset. `zgpu` uses omitempty. `ForwardToZia.Enabled` and `ForwardToZia.OrganizationID` also lack omitempty. (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:51-65`)

**BrowserProtection — two read endpoints; setActive is the only write operation.**
`GET /activeBrowserProtectionProfile` returns the active profile. `GET /browserProtectionProfile` returns all profiles. Only write operation: `PUT /browserProtectionProfile/setActive/{profileID}`. No Create or Delete in the SDK. (`vendor/zscaler-sdk-go/zscaler/zpa/services/browser_protection/browser_protection.go:79-118`, `vendor/zscaler-sdk-python/zscaler/zpa/browser_protection.py:64-67,208-210`)

**Predefined controls — version query param is required.**
`GET /inspectionControls/predefined` requires `version` as a query parameter. Response is `[]ControlGroupItem {controlGroup, defaultGroup bool, predefinedInspectionControls []}`. Both SDKs flatten this to a list of controls for callers. `GetByName` adds `?search=name+EQ+{name}` server-side then does client-side EqualFold as safety. (`vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_predefined_controls/zpa_inspection_predefined_controls.go:67-110`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:55420,55512`)

**InspectionProfile — default predefinedControlsVersion is OWASP_CRS/3.3.0.**
Go SDK's `setVersion()` helper applies `OWASP_CRS/3.3.0` when `PredefinedControlsVersion` is empty. Python SDK defaults `predefined_controls_version` kwarg to `OWASP_CRS/3.3.0`. Supported versions validated by Python SDK: `OWASP_CRS/3.3.0`, `OWASP_CRS/3.3.5`, `OWASP_CRS/4.8.0`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_profile/zpa_inspection_profile.go:16,144-159`, `vendor/zscaler-sdk-python/zscaler/zpa/app_protection.py:222,299,833-843`)

**InspectionCustomControl.ControlRuleJson — rules double-encoded as JSON string on read.**
The API returns `Rules` as a JSON-encoded string in the `controlRuleJson` field. `Get()` and `GetByName()` call `unmarshalRulesJson()` to decode it into the `Rules` slice. Create/Update send `Rules` as a normal Go slice. (`vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_custom_controls/zpa_inspection_custom_controls.go:42-70`)

**Postman documents both dissociateAllPredefinedControls and deAssociateAllPredefinedControls as separate paths.**
Go SDK uses `deAssociateAllPredefinedControls`; Python SDK uses `deAssociateAllPredefinedControls` for detach. Engineers should test both spellings against live tenants to determine which is canonical. (`vendor/zscaler-api-specs/oneapi-postman-collection.json:56049,60744`, `vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_profile/zpa_inspection_profile.go:208-216`)

**CBIProfile (isolation profile) Python model — microtenant fields use snake_case wire keys.**
`CBIProfile.request_format()` emits `microtenant_id` and `microtenant_name` as snake_case wire keys instead of camelCase. Additionally, `microtenant_name` defaults to `True` (boolean) rather than `None` — almost certainly a bug for a string field. (`vendor/zscaler-sdk-python/zscaler/zpa/models/cbi_zpa_profile.py:116-117,96`)

**InspectionProfile.zsDefinedControlChoice — observed values.**
Python SDK enum: `ALL` (Zscaler manages ThreatLabZ controls automatically), `SPECIFIC` (caller manages manually). Postman examples show only `ALL`. (`vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_profile/zpa_inspection_profile.go:31,129`, `vendor/zscaler-sdk-python/zscaler/zpa/app_protection.py:166-170`, `vendor/zscaler-api-specs/oneapi-postman-collection.json:56656`)

**Python InspectionProfile update_profile_and_controls — custom_controls format and bare print() debug statement.**
`update_profile_and_controls` requires `custom_controls` as list of 2-tuples `(id, action)`. This differs from `add_profile` where `custom_controls` items are plain dicts. Additionally, the function contains a bare `print()` debug statement at line 501 that will emit to stdout in production — not gated behind a flag. (`vendor/zscaler-sdk-python/zscaler/zpa/app_protection.py:494-496,501`)

---

## Open questions

- **PrivateCloudController canonical restart path** — Go SDK uses `/restart/{id}`; Python SDK uses `/{id}/restart`. Postman has no entry for PrivateCloudController to settle the canonical path. — *unverified, requires lab test against live tenant*. (Tracked as [`zpa-22`](../_meta/clarifications.md#zpa-22-privatecloudcontroller-canonical-restart-path).)

- **Credential sensitive fields in GET response** — Python SDK model excludes `password` and `private_key` from response fields; Postman collection shows them present in GET list example bodies. Whether these are actually returned or are Postman placeholder artifacts is unresolved. — *unverified, requires tenant-side check*. (Tracked as [`zpa-23`](../_meta/clarifications.md#zpa-23-credential-sensitive-fields-in-get-response).)

- **NLA as a valid connectionSecurity value for PRA sub-apps** — Python SDK docstring lists it; not present in Postman or Go SDK struct. — *unverified, requires API-level test*. (Tracked as [`zpa-24`](../_meta/clarifications.md#zpa-24-nla-as-a-valid-connectionsecurity-value-for-pra-sub-apps).)

- **ScimAttributeHeader delta field accuracy** — The extraction report initially claimed Postman cited the Go struct (line 20-37) as proof of delta. Spot-check showed the Go struct at those lines has no delta field. The claim that delta exists in the Python model is verified; the claim it exists in Go is not. — *extraction report citation for Go struct was inaccurate; do not rely on Go SDK for this field*

- **BaCertificate update_certificate (Python) — validity as API operation** — Go SDK and Postman have no PUT for `/certificate/:id`. Python SDK exposes `update_certificate`. — *unverified, requires lab test*. (Tracked as [`zpa-25`](../_meta/clarifications.md#zpa-25-bacertificate-update_certificate-validity-as-an-api-operation).)

- **zpn_client_type_browser_isolation in LSS policy conditions** — Commented out in Go SDK integration test; listed as valid in TF validator. Status at API level is unknown. — *unverified, requires tenant-side check*. (Tracked as [`zpa-26`](../_meta/clarifications.md#zpa-26-zpn_client_type_browser_isolation-in-lss-policy-conditions).)

---

## Cross-links

- Endpoint paths: [`./legacy-endpoints.md`](./legacy-endpoints.md)
- Auth flow: [`../shared/legacy-api.md`](../shared/legacy-api.md)

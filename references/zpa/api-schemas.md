---
product: zpa
topic: "api-schemas"
title: "ZPA API resource schemas"
content-type: reference
last-verified: "2026-04-28"
verified-against:
  vendor/zscaler-sdk-go: b14f8696c5008f8ea6ea6025b0c691835d9373b4
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/**"
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
| BypassOnReauth | bypassOnReauth | bool | ✓ |  |
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
| BypassOnReauth | bypassOnReauth | bool | ✓ |  |
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

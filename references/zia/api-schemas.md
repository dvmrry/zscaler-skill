---
product: zia
topic: "api-schemas"
title: "ZIA API resource schemas"
content-type: reference
last-verified: "2026-04-28"
verified-against:
  vendor/zscaler-sdk-go: b14f8696c5008f8ea6ea6025b0c691835d9373b4
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-go/zscaler/zia/services/**"
author-status: draft
---

# ZIA API resource schemas

Resource-level schemas for the ZIA legacy API, extracted directly from the Go SDK service layer.

**Cross-references:**
- Endpoint paths: [`./legacy-endpoints.md`](./legacy-endpoints.md)
- Auth flow: [`../shared/legacy-api.md`](../shared/legacy-api.md)


## Activation

**Service:** `activation`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Status | status | string |  |  |

## ZiaEusaStatus

**Service:** `activation`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Version | version | *common.IDNameExtensions | ✓ |  |
| AcceptedStatus | acceptedStatus | bool | ✓ |  |

## AuditLogEntryReportTaskInfo

**Service:** `adminauditlogs`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Status | status | string | ✓ |  |
| ProgressItemsComplete | progressItemsComplete | int | ✓ |  |
| ProgressEndTime | progressEndTime | int | ✓ |  |
| ErrorMessage | errorMessage | string | ✓ |  |
| ErrorCode | errorCode | string | ✓ |  |

## AdminUsers

**Service:** `adminuserrolemgmt/admins`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| LoginName | loginName | string | ✓ |  |
| UserName | userName | string | ✓ |  |
| Email | email | string | ✓ |  |
| Comments | comments | string | ✓ |  |
| Disabled | disabled | bool | ✓ |  |
| Password | password | string | ✓ |  |
| PasswordLastModifiedTime | pwdLastModifiedTime | int | ✓ |  |
| IsNonEditable | isNonEditable | bool | ✓ |  |
| IsPasswordLoginAllowed | isPasswordLoginAllowed | bool | ✓ |  |
| IsPasswordExpired | isPasswordExpired | bool | ✓ |  |
| IsAuditor | isAuditor | bool | ✓ |  |
| IsSecurityReportCommEnabled | isSecurityReportCommEnabled | bool | ✓ |  |
| IsServiceUpdateCommEnabled | isServiceUpdateCommEnabled | bool | ✓ |  |
| IsProductUpdateCommEnabled | isProductUpdateCommEnabled | bool | ✓ |  |
| IsExecMobileAppEnabled | isExecMobileAppEnabled | bool | ✓ |  |
| AdminScopeGroupMemberEntities | adminScopescopeGroupMemberEntities | []common.IDNameExtensions | ✓ |  |
| AdminScopeEntities | adminScopeScopeEntities | []common.IDNameExtensions | ✓ |  |
| AdminScopeType | adminScopeType | string | ✓ |  |
| Role | role | *Role | ✓ |  |
| ExecMobileAppTokens | execMobileAppTokens | []ExecMobileAppTokens | ✓ |  |

## ExecMobileAppTokens

**Service:** `adminuserrolemgmt/admins`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Cloud | cloud | string | ✓ |  |
| OrgId | orgId | int | ✓ |  |
| Name | name | string | ✓ |  |
| TokenId | tokenId | string | ✓ |  |
| Token | token | string | ✓ |  |
| TokenExpiry | tokenExpiry | int | ✓ |  |
| CreateTime | createTime | int | ✓ |  |
| DeviceId | deviceId | string | ✓ |  |
| DeviceName | deviceName | string | ✓ |  |

## PasswordExpiry

**Service:** `adminuserrolemgmt/admins`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| PasswordExpirationEnabled | passwordExpirationEnabled | bool | ✓ |  |
| PasswordExpiryDays | passwordExpiryDays | int | ✓ |  |

## Role

**Service:** `adminuserrolemgmt/admins`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| IsNameL10Tag | isNameL10nTag | bool | ✓ |  |

## AdminRoles

**Service:** `adminuserrolemgmt/roles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Rank | rank | int | ✓ |  |
| Name | name | string | ✓ |  |
| PolicyAccess | policyAccess | string | ✓ |  |
| AlertingAccess | alertingAccess | string | ✓ |  |
| UsernameAccess | usernameAccess | string | ✓ |  |
| DeviceInfoAccess | deviceInfoAccess | string | ✓ |  |
| DashboardAccess | dashboardAccess | string | ✓ |  |
| ReportAccess | reportAccess | string | ✓ |  |
| AnalysisAccess | analysisAccess | string | ✓ |  |
| AdminAcctAccess | adminAcctAccess | string | ✓ |  |
| IsAuditor | isAuditor | bool | ✓ |  |
| Permissions | permissions | []string |  |  |

## AdvancedSettings

**Service:** `advanced_settings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AuthBypassUrls | authBypassUrls | []string | ✓ |  |
| KerberosBypassUrls | kerberosBypassUrls | []string | ✓ |  |
| DigestAuthBypassUrls | digestAuthBypassUrls | []string | ✓ |  |
| DnsResolutionOnTransparentProxyExemptUrls | dnsResolutionOnTransparentProxyExemptUrls | []string | ✓ |  |
| DnsResolutionOnTransparentProxyUrls | dnsResolutionOnTransparentProxyUrls | []string | ✓ |  |
| EnableDnsResolutionOnTransparentProxy | enableDnsResolutionOnTransparentProxy | bool | ✓ |  |
| EnableIPv6DnsResolutionOnTransparentProxy | enableIPv6DnsResolutionOnTransparentProxy | bool | ✓ |  |
| EnableIPv6DnsOptimizationOnAllTransparentProxy | enableIPv6DnsOptimizationOnAllTransparentProxy | bool | ✓ |  |
| EnableEvaluatePolicyOnGlobalSSLBypass | enableEvaluatePolicyOnGlobalSSLBypass | bool | ✓ |  |
| EnableOffice365 | enableOffice365 | bool | ✓ |  |
| LogInternalIp | logInternalIp | bool | ✓ |  |
| EnforceSurrogateIpForWindowsApp | enforceSurrogateIpForWindowsApp | bool | ✓ |  |
| TrackHttpTunnelOnHttpPorts | trackHttpTunnelOnHttpPorts | bool | ✓ |  |
| BlockHttpTunnelOnNonHttpPorts | blockHttpTunnelOnNonHttpPorts | bool | ✓ |  |
| BlockDomainFrontingOnHostHeader | blockDomainFrontingOnHostHeader | bool | ✓ |  |
| ZscalerClientConnector1AndPacRoadWarriorInFirewall | zscalerClientConnector1AndPacRoadWarriorInFirewall | bool | ✓ |  |
| CascadeUrlFiltering | cascadeUrlFiltering | bool | ✓ |  |
| EnablePolicyForUnauthenticatedTraffic | enablePolicyForUnauthenticatedTraffic | bool | ✓ |  |
| BlockNonCompliantHttpRequestOnHttpPorts | blockNonCompliantHttpRequestOnHttpPorts | bool | ✓ |  |
| EnableAdminRankAccess | enableAdminRankAccess | bool | ✓ |  |
| Http2NonbrowserTrafficEnabled | http2NonbrowserTrafficEnabled | bool | ✓ |  |
| EcsForAllEnabled | ecsForAllEnabled | bool | ✓ |  |
| DynamicUserRiskEnabled | dynamicUserRiskEnabled | bool | ✓ |  |
| BlockConnectHostSniMismatch | blockConnectHostSniMismatch | bool | ✓ |  |
| PreferSniOverConnHost | preferSniOverConnHost | bool | ✓ |  |
| SipaXffHeaderEnabled | sipaXffHeaderEnabled | bool | ✓ |  |
| BlockNonHttpOnHttpPortEnabled | blockNonHttpOnHttpPortEnabled | bool | ✓ |  |
| UISessionTimeout | uiSessionTimeout | int | ✓ |  |
| EcsObject | ecsObject | common.IDNameExternalID | ✓ |  |
| AuthBypassApps | authBypassApps | []string | ✓ |  |
| KerberosBypassApps | kerberosBypassApps | []string | ✓ |  |
| BasicBypassApps | basicBypassApps | []string | ✓ |  |
| DigestAuthBypassApps | digestAuthBypassApps | []string | ✓ |  |
| DnsResolutionOnTransparentProxyExemptApps | dnsResolutionOnTransparentProxyExemptApps | []string | ✓ |  |
| DnsResolutionOnTransparentProxyIPv6ExemptApps | dnsResolutionOnTransparentProxyIPv6ExemptApps | []string | ✓ |  |
| DnsResolutionOnTransparentProxyApps | dnsResolutionOnTransparentProxyApps | []string | ✓ |  |
| DnsResolutionOnTransparentProxyIPv6Apps | dnsResolutionOnTransparentProxyIPv6Apps | []string | ✓ |  |
| BlockDomainFrontingApps | blockDomainFrontingApps | []string | ✓ |  |
| PreferSniOverConnHostApps | preferSniOverConnHostApps | []string | ✓ |  |
| DnsResolutionOnTransparentProxyExemptUrlCategories | dnsResolutionOnTransparentProxyExemptUrlCategories | []string | ✓ |  |
| DnsResolutionOnTransparentProxyIPv6ExemptUrlCategories | dnsResolutionOnTransparentProxyIPv6ExemptUrlCategories | []string | ✓ |  |
| DnsResolutionOnTransparentProxyUrlCategories | dnsResolutionOnTransparentProxyUrlCategories | []string | ✓ |  |
| DnsResolutionOnTransparentProxyIPv6UrlCategories | dnsResolutionOnTransparentProxyIPv6UrlCategories | []string | ✓ |  |
| AuthBypassUrlCategories | authBypassUrlCategories | []string | ✓ |  |
| DomainFrontingBypassUrlCategories | domainFrontingBypassUrlCategories | []string | ✓ |  |
| KerberosBypassUrlCategories | kerberosBypassUrlCategories | []string | ✓ |  |
| BasicBypassUrlCategories | basicBypassUrlCategories | []string | ✓ |  |
| HttpRangeHeaderRemoveUrlCategories | httpRangeHeaderRemoveUrlCategories | []string | ✓ |  |
| DigestAuthBypassUrlCategories | digestAuthBypassUrlCategories | []string | ✓ |  |
| SniDnsOptimizationBypassUrlCategories | sniDnsOptimizationBypassUrlCategories | []string | ✓ |  |

## AdvancedThreatSettings

**Service:** `advancedthreatsettings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| RiskTolerance | riskTolerance | int |  |  |
| RiskToleranceCapture | riskToleranceCapture | bool |  |  |
| CmdCtlServerBlocked | cmdCtlServerBlocked | bool |  |  |
| CmdCtlServerCapture | cmdCtlServerCapture | bool |  |  |
| CmdCtlTrafficBlocked | cmdCtlTrafficBlocked | bool |  |  |
| CmdCtlTrafficCapture | cmdCtlTrafficCapture | bool |  |  |
| MalwareSitesBlocked | malwareSitesBlocked | bool |  |  |
| MalwareSitesCapture | malwareSitesCapture | bool |  |  |
| ActiveXBlocked | activeXBlocked | bool |  |  |
| ActiveXCapture | activeXCapture | bool |  |  |
| BrowserExploitsBlocked | browserExploitsBlocked | bool |  |  |
| BrowserExploitsCapture | browserExploitsCapture | bool |  |  |
| FileFormatVulnerabilitiesBlocked | fileFormatVunerabilitesBlocked | bool |  |  |
| FileFormatVulnerabilitiesCapture | fileFormatVunerabilitesCapture | bool |  |  |
| KnownPhishingSitesBlocked | knownPhishingSitesBlocked | bool |  |  |
| KnownPhishingSitesCapture | knownPhishingSitesCapture | bool |  |  |
| SuspectedPhishingSitesBlocked | suspectedPhishingSitesBlocked | bool |  |  |
| SuspectedPhishingSitesCapture | suspectedPhishingSitesCapture | bool |  |  |
| SuspectAdwareSpywareSitesBlocked | suspectAdwareSpywareSitesBlocked | bool |  |  |
| SuspectAdwareSpywareSitesCapture | suspectAdwareSpywareSitesCapture | bool |  |  |
| WebspamBlocked | webspamBlocked | bool |  |  |
| WebspamCapture | webspamCapture | bool |  |  |
| IrcTunnellingBlocked | ircTunnellingBlocked | bool |  |  |
| IrcTunnellingCapture | ircTunnellingCapture | bool |  |  |
| AnonymizerBlocked | anonymizerBlocked | bool |  |  |
| AnonymizerCapture | anonymizerCapture | bool |  |  |
| CookieStealingBlocked | cookieStealingBlocked | bool |  |  |
| CookieStealingPCAPEnabled | cookieStealingPCAPEnabled | bool |  |  |
| PotentialMaliciousRequestsBlocked | potentialMaliciousRequestsBlocked | bool |  |  |
| PotentialMaliciousRequestsCapture | potentialMaliciousRequestsCapture | bool |  |  |
| BlockedCountries | blockedCountries | []string |  |  |
| BlockCountriesCapture | blockCountriesCapture | bool |  |  |
| BitTorrentBlocked | bitTorrentBlocked | bool |  |  |
| BitTorrentCapture | bitTorrentCapture | bool |  |  |
| TorBlocked | torBlocked | bool |  |  |
| TorCapture | torCapture | bool |  |  |
| GoogleTalkBlocked | googleTalkBlocked | bool |  |  |
| GoogleTalkCapture | googleTalkCapture | bool |  |  |
| SshTunnellingBlocked | sshTunnellingBlocked | bool |  |  |
| SshTunnellingCapture | sshTunnellingCapture | bool |  |  |
| CryptoMiningBlocked | cryptoMiningBlocked | bool |  |  |
| CryptoMiningCapture | cryptoMiningCapture | bool |  |  |
| AdSpywareSitesBlocked | adSpywareSitesBlocked | bool |  |  |
| AdSpywareSitesCapture | adSpywareSitesCapture | bool |  |  |
| DgaDomainsBlocked | dgaDomainsBlocked | bool |  |  |
| AlertForUnknownOrSuspiciousC2Traffic | alertForUnknownOrSuspiciousC2Traffic | bool |  |  |
| DgaDomainsCapture | dgaDomainsCapture | bool |  |  |
| MaliciousUrlsCapture | maliciousUrlsCapture | bool |  |  |

## MaliciousURLs

**Service:** `advancedthreatsettings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| MaliciousUrls | maliciousUrls | []string |  |  |

## SecurityExceptions

**Service:** `advancedthreatsettings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| BypassUrls | bypassUrls | []string |  |  |

## AlertSubscriptions

**Service:** `alerts`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Description | description | string | ✓ |  |
| Email | email | string | ✓ |  |
| Deleted | deleted | bool | ✓ |  |
| Pt0Severities | pt0Severities | []string | ✓ |  |
| SecureSeverities | secureSeverities | []string | ✓ |  |
| ManageSeverities | manageSeverities | []string | ✓ |  |
| ComplySeverities | complySeverities | []string | ✓ |  |
| SystemSeverities | systemSeverities | []string | ✓ |  |

## ApiActivity

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| OperationType | operationType | string |  |  |
| Percentage | percentage | float64 |  |  |

## AppDetails

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AppID | appId | string |  |  |
| Name | name | string |  |  |
| Provider | provider | string |  |  |
| Publisher | publisher | string |  |  |

## AppPayload

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AppID | appId | string |  |  |

## AppViewsList

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| AppIDs | appIds | []string |  | Used to retrieve all assets |
| Name | name | string |  |  |
| CreatedBy | createdBy | string |  |  |
| CreatedAt | createdAt | int64 |  |  |
| Spec | spec | SpecDetails |  |  |

## ApplicationCatalog

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Name | name | string |  |  |
| Publisher | publisher | Publisher |  |  |
| Platform | platform | string |  |  |
| Description | description | string |  |  |
| RedirectUrls | redirectUrls | []string |  |  |
| WebsiteUrls | websiteUrls | []string |  |  |
| Categories | categories | []string |  |  |
| Tags | tags | []string |  |  |
| PermissionLevel | permissionLevel | float64 |  |  |
| RiskScore | riskScore | float64 |  |  |
| Risk | risk | string |  |  |
| ExternalIds | externalIds | []ExternalID |  |  |
| ClientId | clientId | string |  |  |
| Permissions | permissions | []Permission |  |  |
| Compliance | compliance | []string |  |  |
| DataRetention | dataRetention | string |  |  |
| ClientType | clientType | string |  |  |
| LogoUrl | logoUrl | string |  |  |
| PrivacyPolicyUrl | privacyPolicyUrl | string |  |  |
| TermsOfServiceUrl | termsOfServiceUrl | string |  |  |
| MarketplaceUrl | marketplaceUrl | string |  |  |
| MarketplaceData | marketplaceData | MarketplaceData |  |  |
| PlatformVerified | platformVerified | bool |  |  |
| CanonicVerified | canonicVerified | bool |  |  |
| DeveloperEmail | developerEmail | string |  |  |
| ConsentScreenshot | consentScreenshot | string |  |  |
| IPAddresses | ipAddresses | []IPAddress |  |  |
| ExtractedUrls | extractedUrls | []string |  |  |
| ExtractedApiCalls | extractedApiCalls | []string |  |  |
| Vulnerabilities | vulnerabilities | []Vulnerability |  |  |
| ApiActivities | apiActivities | []ApiActivity |  |  |
| Risks | risks | []Risk |  |  |
| Insights | insights | []Insight |  |  |
| Instances | instances | []Instance |  |  |

## ExternalID

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Type | type | string |  |  |

## IPAddress

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ISPName | ispName | string |  |  |
| IPAddress | ipAddress | string |  |  |
| ProxyType | proxyType | string |  |  |
| UsageType | usageType | string |  |  |
| DomainName | domainName | string |  |  |
| CountryCode | countryCode | string |  |  |

## Insight

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Description | description | string |  |  |
| Timestamp | timestamp | int64 |  |  |
| Urls | urls | map[string]string |  |  |

## Instance

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| IntegrationId | integrationId | string |  |  |
| Status | status | string |  |  |
| Classification | classification | string |  |  |

## MarketplaceData

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Stars | stars | int |  |  |
| Downloads | downloads | int |  |  |
| Reviews | reviews | int |  |  |

## Permission

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Scope | scope | string |  |  |
| Service | service | string |  |  |
| Description | description | string |  |  |
| AccessType | accessType | string |  |  |
| Level | level | string |  |  |

## Publisher

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Name | name | string |  |  |
| Description | description | string |  |  |
| SiteUrl | siteUrl | string |  |  |
| LogoUrl | logoUrl | string |  |  |

## Result

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Result | result | AppDetails |  |  |

## Risk

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Name | name | string |  |  |
| Description | description | string |  |  |
| Category | category | string |  |  |
| Severity | severity | string |  |  |

## SpecDetails

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Map | map | string |  |  |

## Vulnerability

**Service:** `apptotal`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Name | name | string |  |  |
| Version | version | string |  |  |
| CVEId | cveId | string |  |  |
| Summary | summary | string |  |  |
| Severity | severity | string |  |  |

## AuthenticationSettings

**Service:** `auth_settings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| OrgAuthType | orgAuthType | string |  |  |
| OneTimeAuth | oneTimeAuth | string |  |  |
| SamlEnabled | samlEnabled | bool |  |  |
| KerberosEnabled | kerberosEnabled | bool |  |  |
| KerberosPwd | kerberosPwd | string |  |  |
| AuthFrequency | authFrequency | string |  |  |
| AuthCustomFrequency | authCustomFrequency | int |  |  |
| PasswordStrength | passwordStrength | string |  |  |
| PasswordExpiry | passwordExpiry | string |  |  |
| LastSyncStartTime | lastSyncStartTime | int64 |  |  |
| LastSyncEndTime | lastSyncEndTime | int64 |  |  |
| MobileAdminSamlIdpEnabled | mobileAdminSamlIdpEnabled | bool |  |  |
| AutoProvision | autoProvision | bool |  |  |
| DirectorySyncMigrateToScimEnabled | directorySyncMigrateToScimEnabled | bool |  |  |

## BandwidthClasses

**Service:** `bandwidth_control/bandwidth_classes`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| IsNameL10nTag | isNameL10nTag | bool | ✓ |  |
| Name | name | string | ✓ |  |
| GetfileSize | getfileSize | string | ✓ |  |
| FileSize | fileSize | string | ✓ |  |
| Type | type | string | ✓ |  |
| WebApplications | webApplications | []string | ✓ |  |
| Urls | urls | []string | ✓ |  |
| ApplicationServiceGroups | applicationServiceGroups | []string | ✓ |  |
| NetworkApplications | networkApplications | []string | ✓ |  |
| NetworkServices | networkServices | []string | ✓ |  |
| UrlCategories | urlCategories | []string | ✓ |  |
| Applications | applications | []string | ✓ |  |

## BandwidthControlRules

**Service:** `bandwidth_control/bandwidth_control_rules`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Order | order | int | ✓ |  |
| State | state | string | ✓ |  |
| Description | description | string | ✓ |  |
| MaxBandwidth | maxBandwidth | int | ✓ |  |
| MinBandwidth | minBandwidth | int | ✓ |  |
| Rank | rank | int | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| AccessControl | accessControl | string | ✓ |  |
| DefaultRule | defaultRule | bool | ✓ |  |
| Protocols | protocols | []string | ✓ |  |
| DeviceTrustLevels | deviceTrustLevels | []string | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| BandwidthClasses | bandwidthClasses | []common.IDNameExtensions | ✓ |  |
| LocationGroups | locationGroups | []common.IDNameExtensions | ✓ |  |
| Labels | labels | []common.IDNameExtensions | ✓ |  |
| Devices | devices | []common.IDNameExtensions | ✓ |  |
| DeviceGroups | deviceGroups | []common.IDNameExtensions | ✓ |  |
| Locations | locations | []common.IDNameExtensions | ✓ |  |
| TimeWindows | timeWindows | []common.IDNameExtensions | ✓ |  |

## BrowserControlSettings

**Service:** `browser_control_settings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| PluginCheckFrequency | pluginCheckFrequency | string | ✓ |  |
| BypassPlugins | bypassPlugins | []string | ✓ |  |
| BypassApplications | bypassApplications | []string | ✓ |  |
| BlockedInternetExplorerVersions | blockedInternetExplorerVersions | []string | ✓ |  |
| BlockedChromeVersions | blockedChromeVersions | []string | ✓ |  |
| BlockedFirefoxVersions | blockedFirefoxVersions | []string | ✓ |  |
| BlockedSafariVersions | blockedSafariVersions | []string | ✓ |  |
| BlockedOperaVersions | blockedOperaVersions | []string | ✓ |  |
| SmartIsolationUsers | smartIsolationUsers | []common.IDNameExtensions | ✓ |  |
| SmartIsolationGroups | smartIsolationGroups | []common.IDNameExtensions | ✓ |  |
| SmartIsolationProfile | smartIsolationProfile | SmartIsolationProfile | ✓ |  |
| BypassAllBrowsers | bypassAllBrowsers | bool | ✓ |  |
| AllowAllBrowsers | allowAllBrowsers | bool | ✓ |  |
| EnableWarnings | enableWarnings | bool | ✓ |  |
| EnableSmartBrowserIsolation | enableSmartBrowserIsolation | bool | ✓ |  |
| SmartIsolationProfileID | smartIsolationProfileId | int | ✓ |  |

## SmartIsolationProfile

**Service:** `browser_control_settings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Name | name | string |  |  |
| URL | url | string |  |  |
| DefaultProfile | defaultProfile | bool |  |  |

## CBIProfile

**Service:** `browser_isolation`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| URL | url | string | ✓ |  |
| DefaultProfile | defaultProfile | bool | ✓ |  |

**Methods:** Error

## C2CIncidentReceiver

**Service:** `c2c_incident_receiver`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Status | status | []string | ✓ |  |
| ModifiedTime | modifiedTime | int | ✓ |  |
| LastTenantValidationTime | lastTenantValidationTime | int | ✓ |  |
| LastValidationMsg | lastValidationMsg | *LastValidationMsg | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| OnboardableEntity | onboardableEntity | *OnboardableEntity | ✓ |  |

## LastValidationMsg

**Service:** `c2c_incident_receiver`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ErrorMsg | errorMsg | string | ✓ |  |
| ErrorCode | errorCode | string | ✓ |  |

## OnboardableEntity

**Service:** `c2c_incident_receiver`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Type | type | string | ✓ |  |
| EnterpriseTenantID | enterpriseTenantId | string | ✓ |  |
| Application | application | string | ✓ |  |
| LastValidationMsg | lastValidationMsg | LastValidationMsg | ✓ |  |
| TenantAuthorizationInfo | tenantAuthorizationInfo | TenantAuthorizationInfo | ✓ |  |
| ZscalerAppTenantID | zscalerAppTenantId | *common.IDNameExtensions | ✓ |  |

## SmirBucketConfig

**Service:** `c2c_incident_receiver`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ConfigName | configName | string | ✓ |  |
| MetadataBucketName | metadataBucketName | string | ✓ |  |
| DataBucketName | dataBucketName | string | ✓ |  |
| ID | id | int | ✓ |  |

## TenantAuthorizationInfo

**Service:** `c2c_incident_receiver`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AccessToken | accessToken | string | ✓ |  |
| BotToken | botToken | string | ✓ |  |
| RedirectUrl | redirectUrl | string | ✓ |  |
| Type | type | string | ✓ |  |
| Env | env | string | ✓ |  |
| TempAuthCode | tempAuthCode | string | ✓ |  |
| Subdomain | subdomain | string | ✓ |  |
| Apicp | apicp | string | ✓ |  |
| ClientID | clientId | string | ✓ |  |
| ClientSecret | clientSecret | string | ✓ |  |
| SecretToken | secretToken | string | ✓ |  |
| UserName | userName | string | ✓ |  |
| UserPwd | userPwd | string | ✓ |  |
| InstanceUrl | instanceUrl | string | ✓ |  |
| RoleArn | roleArn | string | ✓ |  |
| QuarantineBucketName | quarantineBucketName | string | ✓ |  |
| CloudTrailBucketName | cloudTrailBucketName | string | ✓ |  |
| BotID | botId | string | ✓ |  |
| OrgApiKey | orgApiKey | string | ✓ |  |
| ExternalID | externalId | string | ✓ |  |
| EnterpriseID | enterpriseId | string | ✓ |  |
| CredJson | credJson | string | ✓ |  |
| Role | role | string | ✓ |  |
| OrganizationID | organizationId | string | ✓ |  |
| WorkspaceName | workspaceName | string | ✓ |  |
| WorkspaceID | workspaceId | string | ✓ |  |
| QtnChannelUrl | qtnChannelUrl | string | ✓ |  |
| FeaturesSupported | featuresSupported | []string | ✓ |  |
| MalQtnLibName | malQtnLibName | string | ✓ |  |
| DlpQtnLibName | dlpQtnLibName | string | ✓ |  |
| Credentials | credentials | string | ✓ |  |
| TokenEndpoint | tokenEndpoint | string | ✓ |  |
| RestApiEndpoint | restApiEndpoint | string | ✓ |  |
| SmirBucketConfig | smirBucketConfig | []SmirBucketConfig | ✓ |  |

## CloudApplicationInstances

**Service:** `cloud_app_instances`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| InstanceID | instanceId | int | ✓ |  |
| InstanceType | instanceType | string | ✓ |  |
| InstanceName | instanceName | string | ✓ |  |
| ModifiedBy | modifiedBy | *common.IDNameExtensions | ✓ |  |
| ModifiedAt | modifiedAt | int | ✓ |  |
| InstanceIdentifiers | instanceIdentifiers | []InstanceIdentifiers | ✓ |  |

## InstanceIdentifiers

**Service:** `cloud_app_instances`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| InstanceID | instanceId | int | ✓ |  |
| InstanceIdentifier | instanceIdentifier | string | ✓ |  |
| InstanceIdentifierName | instanceIdentifierName | string | ✓ |  |
| IdentifierType | identifierType | string | ✓ |  |
| ModifiedAt | modifiedAt | int | ✓ |  |
| ModifiedBy | modifiedBy | *common.IDNameExtensions | ✓ |  |

## CBIProfile

**Service:** `cloudappcontrol`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ProfileSeq | profileSeq | int | ✓ |  |
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| URL | url | string | ✓ |  |
| DefaultProfile | defaultProfile | bool | ✓ |  |
| SandboxMode | sandboxMode | bool | ✓ |  |

## CloudApp

**Service:** `cloudappcontrol`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Val | val | int | ✓ |  |
| WebApplicationClass | webApplicationClass | string | ✓ |  |
| BackendName | backendName | string | ✓ |  |
| OriginalName | originalName | string | ✓ |  |
| Name | name | string | ✓ |  |
| Deprecated | deprecated | bool | ✓ |  |
| Misc | misc | bool | ✓ |  |
| AppNotReady | appNotReady | bool | ✓ |  |
| UnderMigration | underMigration | bool | ✓ |  |
| AppCatModified | appCatModified | bool | ✓ |  |

## CloudAppInstances

**Service:** `cloudappcontrol`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Type | type | string | ✓ |  |

## WebApplicationRules

**Service:** `cloudappcontrol`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Actions | actions | []string | ✓ |  |
| State | state | string | ✓ |  |
| Rank | rank | int | ✓ |  |
| Type | type | string | ✓ |  |
| Order | order | int | ✓ |  |
| TimeQuota | timeQuota | int | ✓ |  |
| SizeQuota | sizeQuota | int | ✓ |  |
| CascadingEnabled | cascadingEnabled | bool | ✓ |  |
| AccessControl | accessControl | string | ✓ |  |
| Applications | applications | []string | ✓ |  |
| NumberOfApplications | numberOfApplications | int | ✓ |  |
| EunEnabled | eunEnabled | bool | ✓ |  |
| EunTemplateID | eunTemplateId | int | ✓ |  |
| BrowserEunTemplateID | browserEunTemplateId | int | ✓ |  |
| Predefined | predefined | bool | ✓ |  |
| ValidityStartTime | validityStartTime | int | ✓ |  |
| ValidityEndTime | validityEndTime | int | ✓ |  |
| ValidityTimeZoneID | validityTimeZoneId | string | ✓ |  |
| UserAgentTypes | userAgentTypes | []string | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| EnforceTimeValidity | enforceTimeValidity | bool | ✓ |  |
| DeviceTrustLevels | deviceTrustLevels | []string | ✓ |  |
| UserRiskScoreLevels | userRiskScoreLevels | []string | ✓ |  |
| DeviceGroups | deviceGroups | []common.IDNameExtensions |  |  |
| Devices | devices | []common.IDNameExtensions | ✓ |  |
| Departments | departments | []common.IDNameExtensions | ✓ |  |
| Groups | groups | []common.IDNameExtensions | ✓ |  |
| Labels | labels | []common.IDNameExtensions | ✓ |  |
| Users | users | []common.IDNameExtensions | ✓ |  |
| Locations | locations | []common.IDNameExtensions | ✓ |  |
| LocationGroups | locationGroups | []common.IDNameExtensions | ✓ |  |
| TimeWindows | timeWindows | []common.IDNameExtensions | ✓ |  |
| CloudAppInstances | cloudAppInstances | []CloudAppInstances | ✓ |  |
| TenancyProfileIDs | tenancyProfileIds | []common.IDNameExtensions | ✓ |  |
| CloudAppRiskProfile | cloudAppRiskProfile | *common.IDCustom | ✓ |  |
| CBIProfile | cbiProfile | CBIProfile | ✓ |  |

## CloudApplications

**Service:** `cloudapplications/cloudapplications`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| App | app | string | ✓ |  |
| AppName | appName | string | ✓ |  |
| Parent | parent | string | ✓ |  |
| ParentName | parentName | string | ✓ |  |

## RiskProfiles

**Service:** `cloudapplications/risk_profiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| ProfileName | profileName | string | ✓ |  |
| ProfileType | profileType | string | ✓ |  |
| Status | status | string | ✓ |  |
| ExcludeCertificates | excludeCertificates | int | ✓ |  |
| PoorItemsOfService | poorItemsOfService | string | ✓ |  |
| AdminAuditLogs | adminAuditLogs | string | ✓ |  |
| DataBreach | dataBreach | string | ✓ |  |
| SourceIpRestrictions | sourceIpRestrictions | string | ✓ |  |
| MfaSupport | mfaSupport | string | ✓ |  |
| SslPinned | sslPinned | string | ✓ |  |
| HttpSecurityHeaders | httpSecurityHeaders | string | ✓ |  |
| Evasive | evasive | string | ✓ |  |
| DnsCaaPolicy | dnsCaaPolicy | string | ✓ |  |
| WeakCipherSupport | weakCipherSupport | string | ✓ |  |
| PasswordStrength | passwordStrength | string | ✓ |  |
| SslCertValidity | sslCertValidity | string | ✓ |  |
| Vulnerability | vulnerability | string | ✓ |  |
| MalwareScanningForContent | malwareScanningForContent | string | ✓ |  |
| FileSharing | fileSharing | string | ✓ |  |
| SslCertKeySize | sslCertKeySize | string | ✓ |  |
| VulnerableToHeartBleed | vulnerableToHeartBleed | string | ✓ |  |
| VulnerableToLogJam | vulnerableToLogJam | string | ✓ |  |
| VulnerableToPoodle | vulnerableToPoodle | string | ✓ |  |
| VulnerabilityDisclosure | vulnerabilityDisclosure | string | ✓ |  |
| SupportForWaf | supportForWaf | string | ✓ |  |
| RemoteScreenSharing | remoteScreenSharing | string | ✓ |  |
| SenderPolicyFramework | senderPolicyFramework | string | ✓ |  |
| DomainKeysIdentifiedMail | domainKeysIdentifiedMail | string | ✓ |  |
| DomainBasedMessageAuth | domainBasedMessageAuth | string | ✓ |  |
| LastModTime | lastModTime | int | ✓ |  |
| CreateTime | createTime | int | ✓ |  |
| Certifications | certifications | []string | ✓ |  |
| DataEncryptionInTransit | dataEncryptionInTransit | []string | ✓ |  |
| RiskIndex | riskIndex | []int | ✓ |  |
| ModifiedBy | modifiedBy | *common.IDNameExtensions | ✓ |  |
| CustomTags | customTags | []common.IDNameExternalID | ✓ |  |

## IDNameDescription

**Service:** `cloudnss/cloudnss`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| PID | pid | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Deleted | deleted | bool | ✓ |  |
| GetlID | getlId | int | ✓ |  |

## NSSFeed

**Service:** `cloudnss/cloudnss`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| FeedStatus | feedStatus | string | ✓ |  |
| NssLogType | nssLogType | string | ✓ |  |
| NssFeedType | nssFeedType | string | ✓ |  |
| FeedOutputFormat | feedOutputFormat | string |  |  |
| UserObfuscation | userObfuscation | string | ✓ |  |
| TimeZone | timeZone | string | ✓ |  |
| CustomEscapedCharacter | customEscapedCharacter | []string | ✓ |  |
| EpsRateLimit | epsRateLimit | int | ✓ |  |
| JsonArrayToggle | jsonArrayToggle | bool | ✓ |  |
| SiemType | siemType | string | ✓ |  |
| MaxBatchSize | maxBatchSize | int | ✓ |  |
| ConnectionURL | connectionURL | string | ✓ |  |
| AuthenticationToken | authenticationToken | string | ✓ |  |
| ConnectionHeaders | connectionHeaders | []string | ✓ |  |
| LastSuccessFullTest | lastSuccessFullTest | int | ✓ |  |
| TestConnectivityCode | testConnectivityCode | int | ✓ |  |
| Base64EncodedCertificate | base64EncodedCertificate | string | ✓ |  |
| NssType | nssType | string | ✓ |  |
| ClientID | clientId | string | ✓ |  |
| ClientSecret | clientSecret | string | ✓ |  |
| AuthenticationUrl | authenticationUrl | string | ✓ |  |
| GrantType | grantType | string | ✓ |  |
| Scope | scope | string | ✓ |  |
| CloudNSS | cloudNss | bool | ✓ |  |
| OauthAuthentication | oauthAuthentication | bool | ✓ |  |
| ServerIps | serverIps | []string | ✓ |  |
| ClientIps | clientIps | []string | ✓ |  |
| Domains | domains | []string | ✓ |  |
| DNSRequestTypes | dnsRequestTypes | []string | ✓ |  |
| DNSResponseTypes | dnsResponseTypes | []string | ✓ |  |
| DNSResponses | dnsResponses | []string | ✓ |  |
| Durations | durations | []string | ✓ |  |
| DNSActions | dnsActions | []string | ✓ |  |
| FirewallLoggingMode | firewallLoggingMode | string | ✓ |  |
| ClientSourceIps | clientSourceIps | []string | ✓ |  |
| FirewallActions | firewallActions | []string | ✓ |  |
| Countries | countries | []string | ✓ |  |
| ServerSourcePorts | serverSourcePorts | []string | ✓ |  |
| ClientSourcePorts | clientSourcePorts | []string | ✓ |  |
| ActionFilter | actionFilter | string | ✓ |  |
| EmailDlpPolicyAction | emailDlpPolicyAction | string | ✓ |  |
| Direction | direction | string | ✓ |  |
| Event | event | string | ✓ |  |
| PolicyReasons | policyReasons | []string | ✓ |  |
| ProtocolTypes | protocolTypes | []string | ✓ |  |
| UserAgents | userAgents | []string | ✓ |  |
| RequestMethods | requestMethods | []string | ✓ |  |
| CasbSeverity | casbSeverity | []string | ✓ |  |
| CasbPolicyTypes | casbPolicyTypes | []string | ✓ |  |
| CasbApplications | casbApplications | []string | ✓ |  |
| CasbAction | casbAction | []string | ✓ |  |
| URLSuperCategories | urlSuperCategories | []string | ✓ |  |
| WebApplications | webApplications | []string | ✓ |  |
| WebApplicationClasses | webApplicationClasses | []string | ✓ |  |
| MalwareNames | malwareNames | []string | ✓ |  |
| URLClasses | urlClasses | []string | ✓ |  |
| MalwareClasses | malwareClasses | []string | ✓ |  |
| AdvancedThreats | advancedThreats | []string | ✓ |  |
| ResponseCodes | responseCodes | []string | ✓ |  |
| NwApplications | nwApplications | []string | ✓ |  |
| NatActions | natActions | []string | ✓ |  |
| TrafficForwards | trafficForwards | []string | ✓ |  |
| WebTrafficForwards | webTrafficForwards | []string | ✓ |  |
| TunnelTypes | tunnelTypes | []string | ✓ |  |
| Alerts | alerts | []string | ✓ |  |
| ObjectType | objectType | []string | ✓ |  |
| Activity | activity | []string | ✓ |  |
| ObjectType1 | objectType1 | []string | ✓ |  |
| ObjectType2 | objectType2 | []string | ✓ |  |
| EndPointDLPLogType | endPointDLPLogType | []string | ✓ |  |
| EmailDLPLogType | emailDLPLogType | []string | ✓ |  |
| FileTypeSuperCategories | fileTypeSuperCategories | []string | ✓ |  |
| FileTypeCategories | fileTypeCategories | []string | ✓ |  |
| CasbFileType | casbFileType | []string | ✓ |  |
| CasbFileTypeSuperCategories | casbFileTypeSuperCategories | []string | ✓ |  |
| MessageSize | messageSize | []string | ✓ |  |
| FileSizes | fileSizes | []string | ✓ |  |
| RequestSizes | requestSizes | []string | ✓ |  |
| ResponseSizes | responseSizes | []string | ✓ |  |
| TransactionSizes | transactionSizes | []string | ✓ |  |
| InBoundBytes | inBoundBytes | []string | ✓ |  |
| OutBoundBytes | outBoundBytes | []string | ✓ |  |
| DownloadTime | downloadTime | []string | ✓ |  |
| ScanTime | scanTime | []string | ✓ |  |
| ServerSourceIps | serverSourceIps | []string | ✓ |  |
| ServerDestinationIps | serverDestinationIps | []string | ✓ |  |
| TunnelIps | tunnelIps | []string | ✓ |  |
| InternalIps | internalIps | []string | ✓ |  |
| TunnelSourceIps | tunnelSourceIps | []string | ✓ |  |
| TunnelDestIps | tunnelDestIps | []string | ✓ |  |
| ClientDestinationIps | clientDestinationIps | []string | ✓ |  |
| AuditLogType | auditLogType | []string | ✓ |  |
| ProjectName | projectName | []string | ✓ |  |
| RepoName | repoName | []string | ✓ |  |
| ObjectName | objectName | []string | ✓ |  |
| ChannelName | channelName | []string | ✓ |  |
| FileSource | fileSource | []string | ✓ |  |
| FileName | fileName | []string | ✓ |  |
| SessionCounts | sessionCounts | []string | ✓ |  |
| AdvUserAgents | advUserAgents | []string | ✓ |  |
| RefererUrls | refererUrls | []string | ✓ |  |
| HostNames | hostNames | []string | ✓ |  |
| FullUrls | fullUrls | []string | ✓ |  |
| ThreatNames | threatNames | []string | ✓ |  |
| PageRiskIndexes | pageRiskIndexes | []string | ✓ |  |
| ClientDestinationPorts | clientDestinationPorts | []string | ✓ |  |
| TunnelSourcePort | tunnelSourcePort | []string | ✓ |  |
| CasbTenant | casbTenant | []common.CommonNSS | ✓ |  |
| Locations | locations | []common.CommonNSS | ✓ |  |
| LocationGroups | locationGroups | []common.CommonNSS | ✓ |  |
| Users | users | []common.CommonNSS | ✓ |  |
| Departments | departments | []common.CommonNSS | ✓ |  |
| SenderName | senderName | []common.CommonNSS | ✓ |  |
| Buckets | buckets | []common.CommonNSS | ✓ |  |
| VPNCredentials | vpnCredentials | []common.CommonNSS | ✓ |  |
| ExternalOwners | externalOwners | []common.IDNameExtensions | ✓ |  |
| ExternalCollaborators | externalCollaborators | []common.IDNameExtensions | ✓ |  |
| InternalCollaborators | internalCollaborators | []common.IDNameExtensions | ✓ |  |
| ItsmObjectType | itsmObjectType | []common.IDNameExtensions | ✓ |  |
| URLCategories | urlCategories | []common.IDNameExtensions | ✓ |  |
| DLPEngines | dlpEngines | []common.IDNameExtensions | ✓ |  |
| DLPDictionaries | dlpDictionaries | []common.IDNameExtensions | ✓ |  |
| Rules | rules | []common.IDNameExtensions | ✓ |  |
| NwServices | nwServices | []common.IDNameExtensions | ✓ |  |

## WebApplication

**Service:** `cloudnss/cloudnss`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Val | val | int | ✓ |  |
| WebApplicationClass | webApplicationClass | string | ✓ |  |
| BackendName | backendName | string | ✓ |  |
| OriginalName | originalName | string | ✓ |  |
| Extended | extended | bool | ✓ |  |
| Misc | misc | bool | ✓ |  |
| Name | name | string | ✓ |  |
| Deprecated | deprecated | bool | ✓ |  |

## NSSServers

**Service:** `cloudnss/nss_servers`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Status | status | string | ✓ |  |
| State | state | string | ✓ |  |
| Type | type | string | ✓ |  |
| IcapSvrId | icapSvrId | int | ✓ |  |

## DataConsumed

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Min | min | int | ✓ |  |
| Max | max | int | ✓ |  |

## DeviceGroups

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## Devices

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## IDCustom

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## IDExtensions

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |

## IDName

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Parent | parent | string | ✓ |  |

## IDNameExtensions

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## IDNameExternalID

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| ExternalID | externalId | string | ✓ |  |

## IDNameWorkloadGroup

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## Order

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| On | on | string | ✓ |  |
| By | by | string | ✓ |  |

## SandboxRSS

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Risk | Risk | string | ✓ |  |
| Signature | Signature | string | ✓ |  |
| SignatureSources | SignatureSources | string | ✓ |  |

## UserDepartment

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| IdpID | idp_id | int | ✓ |  |
| Comments | comments | string | ✓ |  |
| Deleted | deleted | bool | ✓ |  |

## UserGroups

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| IdpID | idp_id | int | ✓ |  |
| Comments | comments | string | ✓ |  |
| IsSystemDefined | isSystemDefined | string | ✓ |  |

## ZPAAppSegments

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| ExternalID | externalId | string |  |  |

## DeviceGroups

**Service:** `devicegroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| GroupType | groupType | string | ✓ |  |
| Description | description | string | ✓ |  |
| OSType | osType | string | ✓ |  |
| Predefined | predefined | bool |  |  |
| DeviceNames | deviceNames | string | ✓ |  |
| DeviceCount | deviceCount | int | ✓ |  |

## Devices

**Service:** `devicegroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| DeviceGroupType | deviceGroupType | string | ✓ |  |
| DeviceModel | deviceModel | string | ✓ |  |
| OSType | osType | string | ✓ |  |
| OSVersion | osVersion | string | ✓ |  |
| Description | description | string | ✓ |  |
| OwnerUserId | ownerUserId | int | ✓ |  |
| OwnerName | ownerName | string | ✓ |  |
| HostName | hostName | string | ✓ |  |

## DLPEngines

**Service:** `dlp/dlp_engines`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| PredefinedEngineName | predefinedEngineName | string | ✓ |  |
| EngineExpression | engineExpression | string | ✓ |  |
| CustomDlpEngine | customDlpEngine | bool | ✓ |  |

## DLPEDMSchema

**Service:** `dlp/dlp_exact_data_match`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SchemaID | schemaId | int | ✓ |  |
| EDMClient | edmClient | *common.IDNameExtensions | ✓ |  |
| ProjectName | projectName | string | ✓ |  |
| Revision | revision | int | ✓ |  |
| Filename | filename | string | ✓ |  |
| OriginalFileName | originalFileName | string | ✓ |  |
| FileUploadStatus | fileUploadStatus | string | ✓ |  |
| SchemaStatus | schemaStatus | string | ✓ |  |
| OrigColCount | origColCount | int | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| ModifiedBy | modifiedBy | *common.IDNameExtensions | ✓ |  |
| CreatedBy | createdBy | *common.IDNameExtensions | ✓ |  |
| CellsUsed | cellsUsed | int | ✓ |  |
| SchemaActive | schemaActive | bool | ✓ |  |
| SchedulePresent | schedulePresent | bool | ✓ |  |
| TokenList | tokenList | []TokenList | ✓ |  |
| Schedule | schedule | Schedule | ✓ |  |

## Schedule

**Service:** `dlp/dlp_exact_data_match`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ScheduleType | scheduleType | string | ✓ |  |
| ScheduleDayOfMonth | scheduleDayOfMonth | []string | ✓ |  |
| ScheduleDayOfWeek | scheduleDayOfWeek | []string | ✓ |  |
| ScheduleTime | scheduleTime | int | ✓ |  |
| ScheduleDisabled | scheduleDisabled | bool | ✓ |  |

## TokenList

**Service:** `dlp/dlp_exact_data_match`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Name | name | string | ✓ |  |
| Type | type | string | ✓ |  |
| PrimaryKey | primaryKey | bool | ✓ |  |
| OriginalColumn | originalColumn | int | ✓ |  |
| HashfileColumnOrder | hashfileColumnOrder | int | ✓ |  |
| ColLengthBitmap | colLengthBitmap | int | ✓ |  |

## DLPEDMLite

**Service:** `dlp/dlp_exact_data_match_lite`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Schema | schema | SchemaIDNameExtension | ✓ |  |
| TokenList | tokenList | []TokenList | ✓ |  |

## SchemaIDNameExtension

**Service:** `dlp/dlp_exact_data_match_lite`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | ID | int | ✓ |  |
| Name | name | string | ✓ |  |
| ExternalID | externalId | string | ✓ |  |

## TokenList

**Service:** `dlp/dlp_exact_data_match_lite`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Name | name | string | ✓ |  |
| Type | type | string | ✓ |  |
| PrimaryKey | primaryKey | bool | ✓ |  |
| OriginalColumn | originalColumn | int | ✓ |  |
| HashfileColumnOrder | hashfileColumnOrder | int | ✓ |  |
| ColLengthBitmap | colLengthBitmap | int | ✓ |  |

## DLPICAPServers

**Service:** `dlp/dlp_icap_servers`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| URL | url | string | ✓ |  |
| Status | status | string | ✓ |  |

## DLPIDMProfileLite

**Service:** `dlp/dlp_idm_profile_lite`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ProfileID | profileId | int | ✓ |  |
| TemplateName | templateName | string | ✓ |  |
| ClientVM | clientVm | *common.IDNameExtensions | ✓ |  |
| NumDocuments | numDocuments | int | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| ModifiedBy | modifiedBy | *common.IDNameExtensions | ✓ |  |

## DLPIDMProfile

**Service:** `dlp/dlp_idm_profiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ProfileID | profileId | int | ✓ |  |
| ProfileName | profileName | string | ✓ |  |
| ProfileDesc | profileDesc | string | ✓ |  |
| ProfileType | profileType | string | ✓ |  |
| Host | host | string | ✓ |  |
| Port | port | int | ✓ |  |
| ProfileDirPath | profileDirPath | string | ✓ |  |
| ScheduleType | scheduleType | string | ✓ |  |
| ScheduleDay | scheduleDay | int | ✓ |  |
| ScheduleDayOfMonth | scheduleDayOfMonth | []string | ✓ |  |
| ScheduleDayOfWeek | scheduleDayOfWeek | []string | ✓ |  |
| ScheduleTime | scheduleTime | int | ✓ |  |
| ScheduleDisabled | scheduleDisabled | bool | ✓ |  |
| UploadStatus | uploadStatus | string |  |  |
| UserName | userName | string | ✓ |  |
| Version | version | int | ✓ |  |
| IDMClient | idmClient | *common.IDNameExtensions | ✓ |  |
| VolumeOfDocuments | volumeOfDocuments | int | ✓ |  |
| NumDocuments | numDocuments | int | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| ModifiedBy | modifiedBy | *common.IDNameExtensions | ✓ |  |

## IncidentReceiverServers

**Service:** `dlp/dlp_incident_receiver_servers`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| URL | url | string | ✓ |  |
| Status | status | string | ✓ |  |
| Flags | flags | int | ✓ |  |

## DlpNotificationTemplates

**Service:** `dlp/dlp_notification_templates`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Subject | subject | string | ✓ |  |
| AttachContent | attachContent | bool | ✓ |  |
| PlainTextMessage | plainTextMessage | string | ✓ |  |
| HtmlMessage | htmlMessage | string | ✓ |  |
| TLSEnabled | tlsEnabled | bool | ✓ |  |

## Receiver

**Service:** `dlp/dlp_web_rules`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Type | type | string | ✓ |  |
| Tenant | tenant | *common.IDNameExtensions | ✓ |  |

## WebDLPRules

**Service:** `dlp/dlp_web_rules`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Order | order | int | ✓ |  |
| AccessControl | accessControl | string | ✓ |  |
| Protocols | protocols | []string | ✓ |  |
| Rank | rank | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| FileTypes | fileTypes | []string | ✓ |  |
| CloudApplications | cloudApplications | []string | ✓ |  |
| MinSize | minSize | int | ✓ |  |
| Action | action | string | ✓ |  |
| State | state | string | ✓ |  |
| MatchOnly | matchOnly | bool | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| WithoutContentInspection | withoutContentInspection | bool | ✓ |  |
| OcrEnabled | ocrEnabled | bool | ✓ |  |
| DLPDownloadScanEnabled | dlpDownloadScanEnabled | bool | ✓ |  |
| ZCCNotificationsEnabled | zccNotificationsEnabled | bool | ✓ |  |
| ZscalerIncidentReceiver | zscalerIncidentReceiver | bool | ✓ |  |
| EUNTemplateID | eunTemplateId | int | ✓ |  |
| ExternalAuditorEmail | externalAuditorEmail | string | ✓ |  |
| Auditor | auditor | *common.IDCustom | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| NotificationTemplate | notificationTemplate | *common.IDCustom | ✓ |  |
| IcapServer | icapServer | *common.IDCustom | ✓ |  |
| Receiver | receiver | *Receiver | ✓ |  |
| Locations | locations | []common.IDNameExtensions | ✓ |  |
| LocationGroups | locationGroups | []common.IDNameExtensions | ✓ |  |
| Groups | groups | []common.IDNameExtensions | ✓ |  |
| Departments | departments | []common.IDNameExtensions | ✓ |  |
| Users | users | []common.IDNameExtensions | ✓ |  |
| URLCategories | urlCategories | []common.IDNameExtensions | ✓ |  |
| DLPEngines | dlpEngines | []common.IDNameExtensions | ✓ |  |
| TimeWindows | timeWindows | []common.IDNameExtensions | ✓ |  |
| Labels | labels | []common.IDNameExtensions | ✓ |  |
| ExcludedGroups | excludedGroups | []common.IDNameExtensions | ✓ |  |
| ExcludedDepartments | excludedDepartments | []common.IDNameExtensions | ✓ |  |
| ExcludedUsers | excludedUsers | []common.IDNameExtensions | ✓ |  |
| IncludedDomainProfiles | includedDomainProfiles | []common.IDNameExtensions | ✓ |  |
| ExcludedDomainProfiles | excludedDomainProfiles | []common.IDNameExtensions | ✓ |  |
| SourceIpGroups | sourceIpGroups | []common.IDNameExtensions | ✓ |  |
| WorkloadGroups | workloadGroups | []common.IDName | ✓ |  |
| FileTypeCategories | fileTypeCategories | []common.IDName | ✓ |  |
| Severity | severity | string | ✓ |  |
| ParentRule | parentRule | int | ✓ |  |
| SubRules | subRules | []WebDLPRules | ✓ |  |
| UserRiskScoreLevels | userRiskScoreLevels | []string | ✓ |  |
| DlpContentLocationsScopes | dlpContentLocationsScopes | []string | ✓ |  |
| InspectHttpGetEnabled | inspectHttpGetEnabled | bool | ✓ |  |

## DlpDictionary

**Service:** `dlp/dlpdictionaries`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| ConfidenceThreshold | confidenceThreshold | string | ✓ |  |
| CustomPhraseMatchType | customPhraseMatchType | string | ✓ |  |
| NameL10nTag | nameL10nTag | bool |  |  |
| Custom | custom | bool | ✓ |  |
| ThresholdType | thresholdType | string | ✓ |  |
| DictionaryType | dictionaryType | string | ✓ |  |
| Proximity | proximity | int | ✓ |  |
| Phrases | phrases | []Phrases |  |  |
| Patterns | patterns | []Patterns |  |  |
| EDMMatchDetails | exactDataMatchDetails | []EDMMatchDetails |  |  |
| IDMProfileMatchAccuracy | idmProfileMatchAccuracyDetails | []IDMProfileMatchAccuracy |  |  |
| IgnoreExactMatchIdmDict | ignoreExactMatchIdmDict | bool | ✓ |  |
| IncludeBinNumbers | includeBinNumbers | bool | ✓ |  |
| BinNumbers | binNumbers | []int | ✓ |  |
| DictTemplateId | dictTemplateId | int | ✓ |  |
| PredefinedClone | predefinedClone | bool | ✓ |  |
| PredefinedCountActionType | predefinedCountActionType | string | ✓ |  |
| ProximityLengthEnabled | proximityLengthEnabled | bool | ✓ |  |
| ProximityEnabledForCustomDictionary | proximityEnabledForCustomDictionary | bool | ✓ |  |
| DictionaryCloningEnabled | dictionaryCloningEnabled | bool |  |  |
| CustomPhraseSupported | customPhraseSupported | bool | ✓ |  |
| HierarchicalDictionary | hierarchicalDictionary | bool | ✓ |  |

## EDMMatchDetails

**Service:** `dlp/dlpdictionaries`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| DictionaryEdmMappingID | dictionaryEdmMappingId | int | ✓ |  |
| SchemaID | schemaId | int | ✓ |  |
| PrimaryFields | primaryFields | []int | ✓ |  |
| SecondaryFields | secondaryFields | []int | ✓ |  |
| SecondaryFieldMatchOn | secondaryFieldMatchOn | string | ✓ |  |

## IDMProfileMatchAccuracy

**Service:** `dlp/dlpdictionaries`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AdpIdmProfile | adpIdmProfile | *common.IDNameExtensions | ✓ |  |
| MatchAccuracy | matchAccuracy | string | ✓ |  |

## Patterns

**Service:** `dlp/dlpdictionaries`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Action | action | string |  |  |
| Pattern | pattern | string |  |  |

## Phrases

**Service:** `dlp/dlpdictionaries`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Action | action | string |  |  |
| Phrase | phrase | string |  |  |

## EmailProfiles

**Service:** `email_profiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Emails | emails | []string | ✓ |  |

## UserNotificationSettings

**Service:** `end_user_notification`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AUPFrequency | aupFrequency | string |  |  |
| AUPCustomFrequency | aupCustomFrequency | int |  |  |
| AUPDayOffset | aupDayOffset | int |  |  |
| AUPMessage | aupMessage | string |  |  |
| NotificationType | notificationType | string |  |  |
| DisplayReason | displayReason | bool |  |  |
| DisplayCompName | displayCompName | bool |  |  |
| DisplayCompLogo | displayCompLogo | bool |  |  |
| CustomText | customText | string |  |  |
| URLCatReviewEnabled | urlCatReviewEnabled | bool |  |  |
| URLCatReviewSubmitToSecurityCloud | urlCatReviewSubmitToSecurityCloud | bool |  |  |
| URLCatReviewCustomLocation | urlCatReviewCustomLocation | string |  |  |
| URLCatReviewText | urlCatReviewText | string |  |  |
| SecurityReviewEnabled | securityReviewEnabled | bool |  |  |
| SecurityReviewSubmitToSecurityCloud | securityReviewSubmitToSecurityCloud | bool |  |  |
| SecurityReviewCustomLocation | securityReviewCustomLocation | string |  |  |
| SecurityReviewText | securityReviewText | string |  |  |
| WebDLPReviewEnabled | webDlpReviewEnabled | bool |  |  |
| WebDLPReviewSubmitToSecurityCloud | webDlpReviewSubmitToSecurityCloud | bool |  |  |
| WebDLPReviewCustomLocation | webDlpReviewCustomLocation | string |  |  |
| WebDLPReviewText | webDlpReviewText | string |  |  |
| RedirectURL | redirectUrl | string | ✓ |  |
| SupportEmail | supportEmail | string |  |  |
| SupportPhone | supportPhone | string |  |  |
| OrgPolicyLink | orgPolicyLink | string |  |  |
| CautionAgainAfter | cautionAgainAfter | int |  |  |
| CautionPerDomain | cautionPerDomain | bool |  |  |
| CautionCustomText | cautionCustomText | string |  |  |
| IDPProxyNotificationText | idpProxyNotificationText | string |  |  |
| QuarantineCustomNotificationText | quarantineCustomNotificationText | string |  |  |

## EventLogEntryReport

**Service:** `eventlogentryreport`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| StartTime | startTime | int | ✓ |  |
| EndTime | endTime | int | ✓ |  |
| Page | page | int | ✓ |  |
| PageSize | pageSize | string | ✓ |  |
| Category | category | string | ✓ |  |
| Subcategories | subcategories | []string | ✓ |  |
| ActionResult | actionResult | string | ✓ |  |
| Message | message | string | ✓ |  |
| ErrorCode | errorCode | string | ✓ |  |
| StatusCode | statusCode | string | ✓ |  |

## EventLogEntryReportTaskInfo

**Service:** `eventlogentryreport`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Status | status | string | ✓ |  |
| ProgressItemsComplete | progressItemsComplete | int | ✓ |  |
| ProgressEndTime | progressEndTime | int | ✓ |  |
| ErrorMessage | errorMessage | string | ✓ |  |
| ErrorCode | errorCode | string | ✓ |  |

## CustomFileTypes

**Service:** `filetypecontrol`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Extension | extension | string | ✓ |  |
| FileTypeId | fileTypeId | string | ✓ |  |

## FileTypeCategory

**Service:** `filetypecontrol`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Parent | parent | string | ✓ |  |

## FileTypeRules

**Service:** `filetypecontrol`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| State | state | string | ✓ |  |
| Order | order | int | ✓ |  |
| FilteringAction | filteringAction | string | ✓ |  |
| TimeQuota | timeQuota | int | ✓ |  |
| SizeQuota | sizeQuota | int | ✓ |  |
| AccessControl | accessControl | string | ✓ |  |
| Rank | rank | int | ✓ |  |
| CapturePCAP | capturePCAP | bool |  |  |
| PasswordProtected | passwordProtected | bool |  |  |
| Operation | operation | string |  |  |
| ActiveContent | activeContent | bool |  |  |
| Unscannable | unscannable | bool |  |  |
| BrowserEunTemplateID | browserEunTemplateId | int | ✓ |  |
| CloudApplications | cloudApplications | []string | ✓ |  |
| FileTypes | fileTypes | []string | ✓ |  |
| MinSize | minSize | int | ✓ |  |
| MaxSize | maxSize | int | ✓ |  |
| Protocols | protocols | []string | ✓ |  |
| URLCategories | urlCategories | []string | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| Locations | locations | []common.IDNameExtensions | ✓ |  |
| LocationGroups | locationGroups | []common.IDNameExtensions | ✓ |  |
| Groups | groups | []common.IDNameExtensions | ✓ |  |
| Departments | departments | []common.IDNameExtensions | ✓ |  |
| Users | users | []common.IDNameExtensions | ✓ |  |
| TimeWindows | timeWindows | []common.IDNameExtensions | ✓ |  |
| Labels | labels | []common.IDNameExtensions | ✓ |  |
| DeviceGroups | deviceGroups | []common.IDNameExtensions |  |  |
| Devices | devices | []common.IDNameExtensions |  |  |
| DeviceTrustLevels | deviceTrustLevels | []string | ✓ |  |
| ZPAAppSegments | zpaAppSegments | []common.ZPAAppSegments |  |  |

## FirewallDNSRules

**Service:** `firewalldnscontrolpolicies`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Order | order | int | ✓ |  |
| Rank | rank | int | ✓ |  |
| AccessControl | accessControl | string | ✓ |  |
| Action | action | string | ✓ |  |
| State | state | string | ✓ |  |
| Description | description | string | ✓ |  |
| RedirectIP | redirectIp | string | ✓ |  |
| BlockResponseCode | blockResponseCode | string | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| SrcIps | srcIps | []string | ✓ |  |
| DestAddresses | destAddresses | []string | ✓ |  |
| DestIpCategories | destIpCategories | []string | ✓ |  |
| DestCountries | destCountries | []string | ✓ |  |
| SourceCountries | sourceCountries | []string | ✓ |  |
| ResCategories | resCategories | []string | ✓ |  |
| Applications | applications | []string | ✓ |  |
| DNSRuleRequestTypes | dnsRuleRequestTypes | []string | ✓ |  |
| Protocols | protocols | []string | ✓ |  |
| DefaultRule | defaultRule | bool | ✓ |  |
| CapturePCAP | capturePCAP | bool |  |  |
| Predefined | predefined | bool | ✓ |  |
| IsWebEUNEnabled | isWebEunEnabled | bool | ✓ |  |
| DefaultDNSRuleNameUsed | defaultDnsRuleNameUsed | bool | ✓ |  |
| ApplicationGroups | applicationGroups | []common.IDNameExtensions | ✓ |  |
| DNSGateway | dnsGateway | *common.IDName | ✓ |  |
| ZPAIPGroup | zpaIpGroup | *common.IDName |  |  |
| EDNSEcsObject | ednsEcsObject | *common.IDName | ✓ |  |
| Locations | locations | []common.IDNameExtensions | ✓ |  |
| LocationsGroups | locationGroups | []common.IDNameExtensions | ✓ |  |
| Departments | departments | []common.IDNameExtensions | ✓ |  |
| Groups | groups | []common.IDNameExtensions | ✓ |  |
| Users | users | []common.IDNameExtensions | ✓ |  |
| TimeWindows | timeWindows | []common.IDNameExtensions | ✓ |  |
| Labels | labels | []common.IDNameExtensions | ✓ |  |
| DestIpGroups | destIpGroups | []common.IDNameExtensions | ✓ |  |
| DestIpv6Groups | destIpv6Groups | []common.IDNameExtensions | ✓ |  |
| SrcIpGroups | srcIpGroups | []common.IDNameExtensions | ✓ |  |
| SrcIpv6Groups | srcIpv6Groups | []common.IDNameExtensions | ✓ |  |
| DeviceGroups | deviceGroups | []common.IDNameExtensions |  |  |
| Devices | devices | []common.IDNameExtensions |  |  |

## FirewallIPSRules

**Service:** `firewallipscontrolpolicies`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Order | order | int |  |  |
| Rank | rank | int |  |  |
| AccessControl | accessControl | string | ✓ |  |
| EnableFullLogging | enableFullLogging | bool |  |  |
| Action | action | string | ✓ |  |
| State | state | string | ✓ |  |
| Description | description | string | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| SrcIps | srcIps | []string | ✓ |  |
| DestAddresses | destAddresses | []string | ✓ |  |
| DestIpCategories | destIpCategories | []string | ✓ |  |
| DestCountries | destCountries | []string | ✓ |  |
| SourceCountries | sourceCountries | []string | ✓ |  |
| ResCategories | resCategories | []string | ✓ |  |
| DefaultRule | defaultRule | bool |  |  |
| CapturePCAP | capturePCAP | bool |  |  |
| Predefined | predefined | bool |  |  |
| IsEUNEnabled | isEunEnabled | bool | ✓ |  |
| EUNTemplateID | eunTemplateId | int | ✓ |  |
| Locations | locations | []common.IDNameExtensions | ✓ |  |
| LocationsGroups | locationGroups | []common.IDNameExtensions | ✓ |  |
| Departments | departments | []common.IDNameExtensions | ✓ |  |
| Groups | groups | []common.IDNameExtensions | ✓ |  |
| Users | users | []common.IDNameExtensions | ✓ |  |
| TimeWindows | timeWindows | []common.IDNameExtensions | ✓ |  |
| Labels | labels | []common.IDNameExtensions | ✓ |  |
| DestIpGroups | destIpGroups | []common.IDNameExtensions | ✓ |  |
| DestIpv6Groups | destIpv6Groups | []common.IDNameExtensions | ✓ |  |
| NwServices | nwServices | []common.IDNameExtensions | ✓ |  |
| NwServiceGroups | nwServiceGroups | []common.IDNameExtensions | ✓ |  |
| SrcIpGroups | srcIpGroups | []common.IDNameExtensions | ✓ |  |
| SrcIpv6Groups | srcIpv6Groups | []common.IDNameExtensions | ✓ |  |
| DeviceGroups | deviceGroups | []common.IDNameExtensions |  |  |
| Devices | devices | []common.IDNameExtensions |  |  |
| ThreatCategories | threatCategories | []common.IDNameExtensions | ✓ |  |
| ZPAAppSegments | zpaAppSegments | []common.ZPAAppSegments |  |  |

## ApplicationServicesLite

**Service:** `firewallpolicies/applicationservices`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| NameL10nTag | nameL10nTag | bool |  |  |

## ApplicationServicesGroupLite

**Service:** `firewallpolicies/appservicegroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| NameL10nTag | nameL10nTag | bool |  |  |

## DNSGateways

**Service:** `firewallpolicies/dns_gateways`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| DnsGatewayType | dnsGatewayType | string | ✓ |  |
| PrimaryIpOrFqdn | primaryIpOrFqdn | string | ✓ |  |
| PrimaryPorts | primaryPorts | []int | ✓ |  |
| SecondaryIpOrFqdn | secondaryIpOrFqdn | string | ✓ |  |
| SecondaryPorts | secondaryPorts | []int | ✓ |  |
| Protocols | protocols | []string | ✓ |  |
| FailureBehavior | failureBehavior | string | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| AutoCreated | autoCreated | bool | ✓ |  |
| NatZtrGateway | natZtrGateway | bool | ✓ |  |
| DnsGatewayProtocols | dnsGatewayProtocols | []string | ✓ |  |

## FirewallFilteringRules

**Service:** `firewallpolicies/filteringrules`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Order | order | int |  |  |
| Rank | rank | int |  |  |
| AccessControl | accessControl | string | ✓ |  |
| EnableFullLogging | enableFullLogging | bool |  |  |
| Action | action | string | ✓ |  |
| State | state | string | ✓ |  |
| Description | description | string | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| SrcIps | srcIps | []string | ✓ |  |
| DestAddresses | destAddresses | []string | ✓ |  |
| DestIpCategories | destIpCategories | []string | ✓ |  |
| DestCountries | destCountries | []string | ✓ |  |
| SourceCountries | sourceCountries | []string | ✓ |  |
| ExcludeSrcCountries | excludeSrcCountries | bool | ✓ |  |
| NwApplications | nwApplications | []string | ✓ |  |
| DefaultRule | defaultRule | bool |  |  |
| Predefined | predefined | bool |  |  |
| Locations | locations | []common.IDNameExtensions | ✓ |  |
| LocationsGroups | locationGroups | []common.IDNameExtensions | ✓ |  |
| Departments | departments | []common.IDNameExtensions | ✓ |  |
| Groups | groups | []common.IDNameExtensions | ✓ |  |
| Users | users | []common.IDNameExtensions | ✓ |  |
| TimeWindows | timeWindows | []common.IDNameExtensions | ✓ |  |
| NwApplicationGroups | nwApplicationGroups | []common.IDNameExtensions | ✓ |  |
| AppServices | appServices | []common.IDNameExtensions | ✓ |  |
| AppServiceGroups | appServiceGroups | []common.IDNameExtensions | ✓ |  |
| Labels | labels | []common.IDNameExtensions | ✓ |  |
| DestIpGroups | destIpGroups | []common.IDNameExtensions | ✓ |  |
| NwServices | nwServices | []common.IDNameExtensions | ✓ |  |
| NwServiceGroups | nwServiceGroups | []common.IDNameExtensions | ✓ |  |
| SrcIpGroups | srcIpGroups | []common.IDNameExtensions | ✓ |  |
| DeviceTrustLevels | deviceTrustLevels | []string | ✓ |  |
| DeviceGroups | deviceGroups | []common.IDNameExtensions |  |  |
| Devices | devices | []common.IDNameExtensions |  |  |
| WorkloadGroups | workloadGroups | []common.IDName | ✓ |  |
| ZPAAppSegments | zpaAppSegments | []common.ZPAAppSegments |  |  |

## IPDestinationGroups

**Service:** `firewallpolicies/ipdestinationgroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Type | type | string | ✓ |  |
| Addresses | addresses | []string | ✓ |  |
| IPCategories | ipCategories | []string | ✓ |  |
| Countries | countries | []string | ✓ |  |
| IsNonEditable | isNonEditable | bool | ✓ |  |

## IPSourceGroups

**Service:** `firewallpolicies/ipsourcegroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| IPAddresses | ipAddresses | []string | ✓ |  |
| IsNonEditable | isNonEditable | bool | ✓ |  |

## NetworkApplicationGroups

**Service:** `firewallpolicies/networkapplicationgroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| NetworkApplications | networkApplications | []string | ✓ |  |
| Description | description | string | ✓ |  |

## NetworkApplications

**Service:** `firewallpolicies/networkapplications`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| ParentCategory | parentCategory | string | ✓ |  |
| Description | description | string | ✓ |  |
| Deprecated | deprecated | bool |  |  |

## NetworkServiceGroups

**Service:** `firewallpolicies/networkservicegroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Services | services | []Services | ✓ |  |
| Description | description | string | ✓ |  |

## Services

**Service:** `firewallpolicies/networkservicegroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Tag | tag | string | ✓ |  |
| SrcTCPPorts | srcTcpPorts | []networkservices.NetworkPorts | ✓ |  |
| DestTCPPorts | destTcpPorts | []networkservices.NetworkPorts | ✓ |  |
| SrcUDPPorts | srcUdpPorts | []networkservices.NetworkPorts | ✓ |  |
| DestUDPPorts | destUdpPorts | []networkservices.NetworkPorts | ✓ |  |
| Type | type | string | ✓ |  |
| Description | description | string | ✓ |  |
| IsNameL10nTag | isNameL10nTag | bool | ✓ |  |

## NetworkPorts

**Service:** `firewallpolicies/networkservices`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Start | start | int | ✓ |  |
| End | end | int | ✓ |  |

## NetworkServices

**Service:** `firewallpolicies/networkservices`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Tag | tag | string | ✓ |  |
| SrcTCPPorts | srcTcpPorts | []NetworkPorts | ✓ |  |
| DestTCPPorts | destTcpPorts | []NetworkPorts | ✓ |  |
| SrcUDPPorts | srcUdpPorts | []NetworkPorts | ✓ |  |
| DestUDPPorts | destUdpPorts | []NetworkPorts | ✓ |  |
| Type | type | string | ✓ |  |
| Description | description | string | ✓ |  |
| Protocol | protocol | string | ✓ |  |
| IsNameL10nTag | isNameL10nTag | bool | ✓ |  |

## TimeWindow

**Service:** `firewallpolicies/timewindow`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| StartTime | startTime | int32 | ✓ |  |
| EndTime | endTime | int32 | ✓ |  |
| DayOfWeek | dayOfWeek | []string | ✓ |  |

## ForwardingRules

**Service:** `forwarding_control_policy/forwarding_rules`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Type | type | string | ✓ |  |
| Order | order | int |  |  |
| Rank | rank | int |  |  |
| Locations | locations | []common.IDNameExtensions | ✓ |  |
| LocationsGroups | locationGroups | []common.IDNameExtensions | ✓ |  |
| ECGroups | ecGroups | []common.IDNameExtensions | ✓ |  |
| Departments | departments | []common.IDNameExtensions | ✓ |  |
| Groups | groups | []common.IDNameExtensions | ✓ |  |
| Users | users | []common.IDNameExtensions | ✓ |  |
| ForwardMethod | forwardMethod | string | ✓ |  |
| State | state | string | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| SrcIps | srcIps | []string | ✓ |  |
| SrcIpGroups | srcIpGroups | []common.IDNameExtensions | ✓ |  |
| SrcIpv6Groups | srcIpv6Groups | []common.IDNameExtensions | ✓ |  |
| DestAddresses | destAddresses | []string | ✓ |  |
| DestIpCategories | destIpCategories | []string | ✓ |  |
| ResCategories | resCategories | []string | ✓ |  |
| DestCountries | destCountries | []string | ✓ |  |
| DestIpGroups | destIpGroups | []common.IDNameExtensions | ✓ |  |
| DestIpv6Groups | destIpv6Groups | []common.IDNameExtensions | ✓ |  |
| NwServices | nwServices | []common.IDNameExtensions | ✓ |  |
| NwServiceGroups | nwServiceGroups | []common.IDNameExtensions | ✓ |  |
| Labels | labels | []common.IDNameExtensions | ✓ |  |
| NwApplicationGroups | nwApplicationGroups | []common.IDNameExtensions | ✓ |  |
| AppServiceGroups | appServiceGroups | []common.IDNameExtensions | ✓ |  |
| ProxyGateway | proxyGateway | *common.IDName | ✓ |  |
| DedicatedIPGateway | dedicatedIPGateway | *common.IDName | ✓ |  |
| ZPAGateway | zpaGateway | *common.IDName | ✓ |  |
| ZPAAppSegments | zpaAppSegments | []common.ZPAAppSegments |  |  |
| ZPAApplicationSegments | zpaApplicationSegments | []ZPAApplicationSegments | ✓ |  |
| ZPAApplicationSegmentGroups | zpaApplicationSegmentGroups | []ZPAApplicationSegmentGroups | ✓ |  |
| ZPABrokerRule | zpaBrokerRule | bool | ✓ |  |
| DeviceGroups | deviceGroups | []common.IDNameExtensions |  |  |

## ZPAApplicationSegmentGroups

**Service:** `forwarding_control_policy/forwarding_rules`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| ZPAID | zpaId | int | ✓ |  |
| Deleted | deleted | bool | ✓ |  |
| ZPAAppSegmentsCount | zpaAppSegmentsCount | int | ✓ |  |

## ZPAApplicationSegments

**Service:** `forwarding_control_policy/forwarding_rules`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| ZPAID | zpaId | int | ✓ |  |
| Deleted | deleted | bool | ✓ |  |

## DedicatedIPGateways

**Service:** `forwarding_control_policy/proxies`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Id | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| PrimaryDataCenter | primaryDataCenter | *common.IDNameExtensions | ✓ |  |
| SecondaryDataCenter | secondaryDataCenter | *common.IDNameExtensions | ✓ |  |
| CreateTime | createTime | int | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| Default | default | bool | ✓ |  |

## Proxies

**Service:** `forwarding_control_policy/proxies`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Type | type | string | ✓ |  |
| Address | address | string | ✓ |  |
| Port | port | int | ✓ |  |
| Cert | cert | *common.IDNameExternalID | ✓ |  |
| Description | description | string | ✓ |  |
| InsertXauHeader | insertXauHeader | bool | ✓ |  |
| Base64EncodeXauHeader | base64EncodeXauHeader | bool | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExternalID | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |

## ProxyGateways

**Service:** `forwarding_control_policy/proxy_gateways`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| PrimaryProxy | primaryProxy | *common.IDNameExternalID | ✓ |  |
| SecondaryProxy | secondaryProxy | *common.IDNameExternalID | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| FailClosed | failClosed | bool |  |  |
| Type | type | string |  |  |

## ZPAAppSegments

**Service:** `forwarding_control_policy/zpa_gateways`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| ExternalID | externalId | string | ✓ |  |

## ZPAGateways

**Service:** `forwarding_control_policy/zpa_gateways`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| ZPAServerGroup | zpaServerGroup | ZPAServerGroup | ✓ |  |
| ZPAAppSegments | zpaAppSegments | []ZPAAppSegments | ✓ |  |
| ZPATenantId | zpaTenantId | int | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| Type | type | string |  |  |

## ZPAServerGroup

**Service:** `forwarding_control_policy/zpa_gateways`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| ExternalID | externalId | string | ✓ |  |

## FTPControlPolicy

**Service:** `ftp_control_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| FtpOverHttpEnabled | ftpOverHttpEnabled | bool | ✓ |  |
| FtpEnabled | ftpEnabled | bool | ✓ |  |
| UrlCategories | urlCategories | []string | ✓ |  |
| Urls | urls | []string | ✓ |  |

## IntermediateCACertificate

**Service:** `intermediatecacertificates`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Type | type | string | ✓ |  |
| Region | region | string | ✓ |  |
| Status | status | string | ✓ |  |
| DefaultCertificate | defaultCertificate | bool | ✓ |  |
| CertStartDate | certStartDate | int | ✓ |  |
| CertExpDate | certExpDate | int | ✓ |  |
| CurrentState | currentState | string | ✓ |  |
| PublicKey | publicKey | string | ✓ |  |
| KeyGenerationTime | keyGenerationTime | int | ✓ |  |
| HSMAttestationVerifiedTime | hsmAttestationVerifiedTime | int | ✓ |  |
| CSRFileName | csrFileName | string | ✓ |  |
| CSRGenerationTime | csrGenerationTime | int | ✓ |  |

## Device

**Service:** `iotreport`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| LocationID | locationId | string |  |  |
| DeviceUUID | deviceUuid | string |  |  |
| IPAddress | ipAddress | string |  |  |
| DeviceTypeUUID | deviceTypeUuid | string |  |  |
| AutoLabel | autoLabel | string |  |  |
| ClassificationUUID | classificationUuid | string |  |  |
| CategoryUUID | categoryUuid | string |  |  |
| FlowStartTime | flowStartTime | int |  |  |
| FlowEndTime | flowEndTime | int |  |  |

## IOTDeviceList

**Service:** `iotreport`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CloudName | cloudName | string |  |  |
| CustomerID | customerId | int |  |  |
| Devices | devices | []Device |  |  |

## City

**Service:** `location/locationgroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| MatchString | matchString | string | ✓ |  |
| MatchType | matchType | string | ✓ |  |

## DynamicLocationGroupCriteria

**Service:** `location/locationgroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Name | name | *Name | ✓ |  |
| Countries | countries | []string | ✓ |  |
| City | city | *City | ✓ |  |
| ManagedBy | managedBy | []ManagedBy | ✓ |  |
| EnforceAuthentication | enforceAuthentication | bool |  |  |
| EnforceAup | enforceAup | bool |  |  |
| EnforceFirewallControl | enforceFirewallControl | bool |  |  |
| EnableXffForwarding | enableXffForwarding | bool |  |  |
| EnableCaution | enableCaution | bool |  |  |
| EnableBandwidthControl | enableBandwidthControl | bool |  |  |
| Profiles | profiles | []string |  |  |

## LastModUser

**Service:** `location/locationgroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## LocationGroup

**Service:** `location/locationgroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Deleted | deleted | bool | ✓ |  |
| GroupType | groupType | string | ✓ |  |
| DynamicLocationGroupCriteria | dynamicLocationGroupCriteria | *DynamicLocationGroupCriteria | ✓ |  |
| Comments | comments | string |  |  |
| Locations | locations | []common.IDNameExtensions |  |  |
| LastModUser | lastModUser | *LastModUser |  |  |
| LastModTime | lastModTime | int |  |  |
| Predefined | predefined | bool |  |  |

## ManagedBy

**Service:** `location/locationgroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## Name

**Service:** `location/locationgroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| MatchString | matchString | string | ✓ |  |
| MatchType | matchType | string | ✓ |  |

## LocationLite

**Service:** `location/locationlite`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| ParentID | parentId | int | ✓ |  |
| TZ | tz | string | ✓ |  |
| XFFForwardEnabled | xffForwardEnabled | bool | ✓ |  |
| AUPEnabled | aupEnabled | bool |  |  |
| CautionEnabled | cautionEnabled | bool |  |  |
| AUPBlockInternetUntilAccepted | aupBlockInternetUntilAccepted | bool |  |  |
| AUPForceSSLInspection | aupForceSslInspection | bool |  |  |
| SurrogateIP | surrogateIP | bool |  |  |
| SurrogateIPEnforcedForKnownBrowsers | surrogateIPEnforcedForKnownBrowsers | bool |  |  |
| OtherSubLocation | otherSubLocation | bool | ✓ |  |
| Other6SubLocation | other6SubLocation | bool | ✓ |  |
| OFWEnabled | ofwEnabled | bool |  |  |
| IPSControl | ipsControl | bool |  |  |
| ZappSSLScanEnabled | zappSslScanEnabled | bool |  |  |
| IPv6Enabled | ipv6Enabled | bool | ✓ |  |
| SubLocScopeEnabled | subLocScopeEnabled | bool | ✓ |  |
| SubLocScope | subLocScope | string | ✓ |  |
| SubLocScopeValues | subLocScopeValues | []string | ✓ |  |
| SubLocAccIDs | subLocAccIds | []string | ✓ |  |

## DynamiclocationGroups

**Service:** `location/locationmanagement`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## Location

**Service:** `location/locationmanagement`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## Locations

**Service:** `location/locationmanagement`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| ParentID | parentId | int | ✓ |  |
| UpBandwidth | upBandwidth | int | ✓ |  |
| DnBandwidth | dnBandwidth | int | ✓ |  |
| Country | country | string | ✓ |  |
| State | state | string | ✓ |  |
| Language | language | string | ✓ |  |
| TZ | tz | string | ✓ |  |
| ChildCount | childCount | int | ✓ |  |
| MatchInChild | matchInChild | bool | ✓ |  |
| GeoOverride | geoOverride | bool | ✓ |  |
| IPAddresses | ipAddresses | []string | ✓ |  |
| Ports | ports | []int | ✓ |  |
| SubLocScopeEnabled | subLocScopeEnabled | bool | ✓ |  |
| SubLocScope | subLocScope | string | ✓ |  |
| SubLocScopeValues | subLocScopeValues | []string | ✓ |  |
| SubLocAccIDs | subLocAccIds | []string | ✓ |  |
| VPNCredentials | vpnCredentials | []VPNCredentials | ✓ |  |
| AuthRequired | authRequired | bool |  |  |
| BasicAuthEnabled | basicAuthEnabled | bool |  |  |
| DigestAuthEnabled | digestAuthEnabled | bool |  |  |
| KerberosAuth | kerberosAuth | bool |  |  |
| IOTDiscoveryEnabled | iotDiscoveryEnabled | bool |  |  |
| IOTEnforcePolicySet | iotEnforcePolicySet | bool |  |  |
| CookiesAndProxy | cookiesAndProxy | bool |  |  |
| SSLScanEnabled | sslScanEnabled | bool |  |  |
| ZappSSLScanEnabled | zappSSLScanEnabled | bool |  |  |
| XFFForwardEnabled | xffForwardEnabled | bool |  |  |
| SurrogateIP | surrogateIP | bool |  |  |
| IdleTimeInMinutes | idleTimeInMinutes | int | ✓ |  |
| DisplayTimeUnit | displayTimeUnit | string | ✓ |  |
| SurrogateIPEnforcedForKnownBrowsers | surrogateIPEnforcedForKnownBrowsers | bool |  |  |
| SurrogateRefreshTimeInMinutes | surrogateRefreshTimeInMinutes | int | ✓ |  |
| SurrogateRefreshTimeUnit | surrogateRefreshTimeUnit | string | ✓ |  |
| OFWEnabled | ofwEnabled | bool |  |  |
| IPSControl | ipsControl | bool |  |  |
| AUPEnabled | aupEnabled | bool |  |  |
| CautionEnabled | cautionEnabled | bool |  |  |
| AUPBlockInternetUntilAccepted | aupBlockInternetUntilAccepted | bool |  |  |
| AUPForceSSLInspection | aupForceSslInspection | bool |  |  |
| AUPTimeoutInDays | aupTimeoutInDays | int | ✓ |  |
| Profile | profile | string | ✓ |  |
| ExcludeFromDynamicGroups | excludeFromDynamicGroups | bool | ✓ |  |
| ExcludeFromManualGroups | excludeFromManualGroups | bool | ✓ |  |
| Description | description | string | ✓ |  |
| OtherSubLocation | otherSubLocation | bool | ✓ |  |
| Other6SubLocation | other6SubLocation | bool | ✓ |  |
| ECLocation | ecLocation | bool | ✓ |  |
| IPv6Enabled | ipv6Enabled | bool | ✓ |  |
| DefaultExtranetTsPool | defaultExtranetTsPool | bool | ✓ |  |
| DefaultExtranetDns | defaultExtranetDns | bool | ✓ |  |
| Extranet | extranet | *common.IDCustom | ✓ |  |
| ExtranetIpPool | extranetIpPool | *common.IDCustom | ✓ |  |
| ExtranetDns | extranetDns | *common.IDCustom | ✓ |  |
| IPv6Dns64Prefix | ipv6Dns64Prefix | bool | ✓ |  |
| DynamiclocationGroups | dynamiclocationGroups | []common.IDNameExtensions |  |  |
| StaticLocationGroups | staticLocationGroups | []common.IDNameExtensions |  |  |
| VirtualZenClusters | virtualZenClusters | []common.IDNameExtensions |  |  |
| VirtualZens | virtualZens | []common.IDNameExtensions |  |  |

## ManagedBy

**Service:** `location/locationmanagement`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## StaticLocationGroups

**Service:** `location/locationmanagement`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## VPNCredentials

**Service:** `location/locationmanagement`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Type | type | string | ✓ |  |
| FQDN | fqdn | string | ✓ |  |
| IPAddress | ipAddress | string |  |  |
| PreSharedKey | preSharedKey | string | ✓ |  |
| Comments | comments | string | ✓ |  |
| Location | location | []Location | ✓ |  |
| ManagedBy | managedBy | []ManagedBy | ✓ |  |

## ATPMalwareInspection

**Service:** `malware_protection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| InspectInbound | inspectInbound | bool |  |  |
| InspectOutbound | inspectOutbound | bool |  |  |

## ATPMalwareProtocols

**Service:** `malware_protection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| InspectHttp | inspectHttp | bool |  |  |
| InspectFtpOverHttp | inspectFtpOverHttp | bool |  |  |
| InspectFtp | inspectFtp | bool |  |  |

## MalwarePolicy

**Service:** `malware_protection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| BlockUnscannableFiles | blockUnscannableFiles | bool |  |  |
| BlockPasswordProtectedArchiveFiles | blockPasswordProtectedArchiveFiles | bool |  |  |

## MalwareSettings

**Service:** `malware_protection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| VirusBlocked | virusBlocked | bool |  |  |
| VirusCapture | virusCapture | bool |  |  |
| UnwantedApplicationsBlocked | unwantedApplicationsBlocked | bool |  |  |
| UnwantedApplicationsCapture | unwantedApplicationsCapture | bool |  |  |
| TrojanBlocked | trojanBlocked | bool |  |  |
| TrojanCapture | trojanCapture | bool |  |  |
| WormBlocked | wormBlocked | bool |  |  |
| WormCapture | wormCapture | bool |  |  |
| AdwareBlocked | adwareBlocked | bool |  |  |
| AdwareCapture | adwareCapture | bool |  |  |
| SpywareBlocked | spywareBlocked | bool |  |  |
| SpywareCapture | spywareCapture | bool |  |  |
| RansomwareBlocked | ransomwareBlocked | bool |  |  |
| RansomwareCapture | ransomwareCapture | bool |  |  |
| RemoteAccessToolBlocked | remoteAccessToolBlocked | bool |  |  |
| RemoteAccessToolCapture | remoteAccessToolCapture | bool |  |  |

## MobileAdvanceThreatSettings

**Service:** `mobile_threat_settings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| BlockAppsWithMaliciousActivity | blockAppsWithMaliciousActivity | bool | ✓ |  |
| BlockAppsWithKnownVulnerabilities | blockAppsWithKnownVulnerabilities | bool | ✓ |  |
| BlockAppsSendingUnencryptedUserCredentials | blockAppsSendingUnencryptedUserCredentials | bool | ✓ |  |
| BlockAppsSendingLocationInfo | blockAppsSendingLocationInfo | bool | ✓ |  |
| BlockAppsSendingPersonallyIdentifiableInfo | blockAppsSendingPersonallyIdentifiableInfo | bool | ✓ |  |
| BlockAppsSendingDeviceIdentifier | blockAppsSendingDeviceIdentifier | bool | ✓ |  |
| BlockAppsCommunicatingWithAdWebsites | blockAppsCommunicatingWithAdWebsites | bool | ✓ |  |
| BlockAppsCommunicatingWithRemoteUnknownServers | blockAppsCommunicatingWithRemoteUnknownServers | bool | ✓ |  |

## NatControlPolicies

**Service:** `nat_control_policies`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AccessControl | accessControl | string | ✓ |  |
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Order | order | int | ✓ |  |
| Rank | rank | int | ✓ |  |
| Description | description | string | ✓ |  |
| State | state | string | ✓ |  |
| RedirectFqdn | redirectFqdn | string | ✓ |  |
| RedirectIp | redirectIp | string | ✓ |  |
| RedirectPort | redirectPort | int | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| TrustedResolverRule | trustedResolverRule | bool | ✓ |  |
| EnableFullLogging | enableFullLogging | bool | ✓ |  |
| Predefined | predefined | bool | ✓ |  |
| DefaultRule | defaultRule | bool | ✓ |  |
| DestAddresses | destAddresses | []string | ✓ |  |
| SrcIps | srcIps | []string | ✓ |  |
| DestCountries | destCountries | []string | ✓ |  |
| DestIpCategories | destIpCategories | []string | ✓ |  |
| ResCategories | resCategories | []string | ✓ |  |
| Locations | locations | []common.IDNameExtensions | ✓ |  |
| LocationGroups | locationGroups | []common.IDNameExtensions | ✓ |  |
| Groups | groups | []common.IDNameExtensions | ✓ |  |
| Departments | departments | []common.IDNameExtensions | ✓ |  |
| Users | users | []common.IDNameExtensions | ✓ |  |
| TimeWindows | timeWindows | []common.IDNameExtensions | ✓ |  |
| SrcIpGroups | srcIpGroups | []common.IDNameExtensions | ✓ |  |
| SrcIpv6Groups | srcIpv6Groups | []common.IDNameExtensions | ✓ |  |
| DestIpGroups | destIpGroups | []common.IDNameExtensions | ✓ |  |
| DestIpv6Groups | destIpv6Groups | []common.IDNameExtensions | ✓ |  |
| NwServices | nwServices | []common.IDNameExtensions | ✓ |  |
| NwServiceGroups | nwServiceGroups | []common.IDNameExtensions | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| Devices | devices | []common.IDNameExtensions | ✓ |  |
| DeviceGroups | deviceGroups | []common.IDNameExtensions | ✓ |  |
| Labels | labels | []common.IDNameExtensions | ✓ |  |

## Organization

**Service:** `organization_details`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| OrgID | orgId | int |  |  |
| Name | name | string |  |  |
| HQLocation | hqLocation | string |  |  |
| Domains | domains | []string |  |  |
| GeoLocation | geoLocation | string |  |  |
| IndustryVertical | industryVertical | string |  |  |
| AddrLine1 | addrLine1 | string |  |  |
| AddrLine2 | addrLine2 | string |  |  |
| City | city | string |  |  |
| State | state | string |  |  |
| ZipCode | zipcode | string |  |  |
| Country | country | string |  |  |
| EmployeeCount | employeeCount | string |  |  |
| Language | language | string |  |  |
| Timezone | timezone | string |  |  |
| AlertTimer | alertTimer | string |  |  |
| PDomain | pdomain | string |  |  |
| InternalCompany | internalCompany | bool |  |  |
| PrimaryTechnicalContactType | primaryTechnicalContactcontactType | string |  |  |
| PrimaryTechnicalContactName | primaryTechnicalContactName | string |  |  |
| PrimaryTechnicalContactTitle | primaryTechnicalContactTitle | string |  |  |
| PrimaryTechnicalContactEmail | primaryTechnicalContactEmail | string |  |  |
| PrimaryTechnicalContactPhone | primaryTechnicalContactPhone | string |  |  |
| PrimaryTechnicalContactAltPhone | primaryTechnicalContactAltPhone | string |  |  |
| PrimaryTechnicalContactInsightsHref | primaryTechnicalContactInsightsHref | string |  |  |
| SecondaryTechnicalContactType | secondaryTechnicalContactcontactType | string |  |  |
| SecondaryTechnicalContactName | secondaryTechnicalContactName | string |  |  |
| SecondaryTechnicalContactTitle | secondaryTechnicalContactTitle | string |  |  |
| SecondaryTechnicalContactEmail | secondaryTechnicalContactEmail | string |  |  |
| SecondaryTechnicalContactPhone | secondaryTechnicalContactPhone | string |  |  |
| SecondaryTechnicalContactAltPhone | secondaryTechnicalContactAltPhone | string |  |  |
| SecondaryTechnicalContactInsightsHref | secondaryTechnicalContactInsightsHref | string |  |  |
| PrimaryBillingContactType | primaryBillingContactcontactType | string |  |  |
| PrimaryBillingContactName | primaryBillingContactName | string |  |  |
| PrimaryBillingContactTitle | primaryBillingContactTitle | string |  |  |
| PrimaryBillingContactEmail | primaryBillingContactEmail | string |  |  |
| PrimaryBillingContactPhone | primaryBillingContactPhone | string |  |  |
| PrimaryBillingContactAltPhone | primaryBillingContactAltPhone | string |  |  |
| PrimaryBillingContactInsightsHref | primaryBillingContactInsightsHref | string |  |  |
| SecondaryBillingContactType | secondaryBillingContactcontactType | string |  |  |
| SecondaryBillingContactName | secondaryBillingContactName | string |  |  |
| SecondaryBillingContactTitle | secondaryBillingContactTitle | string |  |  |
| SecondaryBillingContactEmail | secondaryBillingContactEmail | string |  |  |
| SecondaryBillingContactPhone | secondaryBillingContactPhone | string |  |  |
| SecondaryBillingContactAltPhone | secondaryBillingContactAltPhone | string |  |  |
| SecondaryBillingContactInsightsHref | secondaryBillingContactInsightsHref | string |  |  |
| PrimaryBusinessContactType | primaryBusinessContactcontactType | string |  |  |
| PrimaryBusinessContactName | primaryBusinessContactName | string |  |  |
| PrimaryBusinessContactTitle | primaryBusinessContactTitle | string |  |  |
| PrimaryBusinessContactEmail | primaryBusinessContactEmail | string |  |  |
| PrimaryBusinessContactPhone | primaryBusinessContactPhone | string |  |  |
| PrimaryBusinessContactAltPhone | primaryBusinessContactAltPhone | string |  |  |
| PrimaryBusinessContactInsightsHref | primaryBusinessContactInsightsHref | string |  |  |
| SecondaryBusinessContactType | secondaryBusinessContactcontactType | string |  |  |
| SecondaryBusinessContactName | secondaryBusinessContactName | string |  |  |
| SecondaryBusinessContactTitle | secondaryBusinessContactTitle | string |  |  |
| SecondaryBusinessContactEmail | secondaryBusinessContactEmail | string |  |  |
| SecondaryBusinessContactPhone | secondaryBusinessContactPhone | string |  |  |
| SecondaryBusinessContactAltPhone | secondaryBusinessContactAltPhone | string |  |  |
| SecondaryBusinessContactInsightsHref | secondaryBusinessContactInsightsHref | string |  |  |
| ExecInsightsHref | execInsightsHref | string |  |  |
| LegacyInsightsReportWasEnabled | legacyInsightsReportWasEnabled | bool |  |  |
| LogoBase64Data | logoBase64Data | string |  |  |
| LogoMimeType | logoMimeType | string |  |  |
| CloudName | cloudName | string |  |  |
| ExternalEmailPortal | externalEmailPortal | bool |  |  |
| ZpaTenantID | zpaTenantId | int64 |  |  |
| ZpaTenantCloud | zpaTenantCloud | string |  |  |
| CustomerContactInherit | customerContactInherit | bool |  |  |

## OrganizationInfoLite

**Service:** `organization_details`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| OrgID | orgId | int |  |  |
| Name | name | string |  |  |
| CloudName | cloudName | string |  |  |
| Domains | domains | []string |  |  |
| Language | language | string |  |  |
| Timezone | timezone | string |  |  |
| OrgDisabled | orgDisabled | bool |  |  |

## Subscription

**Service:** `organization_details`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Status | status | string |  |  |
| State | state | string |  |  |
| Licenses | licenses | int |  |  |
| StartDate | startDate | int |  |  |
| StrStartDate | strStartDate | string |  |  |
| StrEndDate | strEndDate | string |  |  |
| EndDate | endDate | int |  |  |
| SKU | sku | string |  |  |
| CellCount | cellCount | string |  |  |
| UpdatedAtTimestamp | updatedAtTimestamp | int |  |  |
| Subscribed | subscribed | bool |  |  |

## LastModifiedBy

**Service:** `pacfiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| ExternalID | externalId | string | ✓ |  |

## PACFileConfig

**Service:** `pacfiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Domain | domain | string | ✓ |  |
| PACUrl | pacUrl | string | ✓ |  |
| PACContent | pacContent | string | ✓ |  |
| Editable | editable | bool | ✓ |  |
| PACSubURL | pacSubURL | string | ✓ |  |
| PACUrlObfuscated | pacUrlObfuscated | bool | ✓ |  |
| PACVerificationStatus | pacVerificationStatus | string | ✓ |  |
| PACVersionStatus | pacVersionStatus | string | ✓ |  |
| PACVersion | pacVersion | int | ✓ |  |
| PACCommitMessage | pacCommitMessage | string | ✓ |  |
| TotalHits | totalHits | int | ✓ |  |
| LastModificationTime | lastModificationTime | int64 | ✓ |  |
| LastModifiedBy | lastModifiedBy | LastModifiedBy | ✓ |  |
| CreateTime | createTime | int64 | ✓ |  |

## PacResult

**Service:** `pacfiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Success | success | bool |  |  |
| Messages | messages | []PacValidationMessage |  |  |
| WarningCount | warningCount | int |  |  |
| ErrorCount | errorCount | int |  |  |

## PacValidationMessage

**Service:** `pacfiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Severity | severity | int |  |  |
| EndLine | endLine | int |  |  |
| EndColumn | endColumn | int |  |  |
| Line | line | int |  |  |
| Column | column | int |  |  |
| Message | message | string |  |  |
| Fatal | fatal | bool |  |  |

## RemoteAssistance

**Service:** `remote_assistance`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ViewOnlyUntil | viewOnlyUntil | int64 | ✓ |  |
| FullAccessUntil | fullAccessUntil | int64 | ✓ |  |
| UsernameObfuscated | usernameObfuscated | bool |  |  |
| DeviceInfoObfuscate | deviceInfoObfuscate | bool |  |  |

## RuleLabels

**Service:** `rule_labels`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| CreatedBy | createdBy | *common.IDNameExtensions | ✓ |  |
| ReferencedRuleCount | referencedRuleCount | int | ✓ |  |

## CasbEmailLabel

**Service:** `saas_security_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| LabelDesc | labelDesc | string | ✓ |  |
| LabelColor | labelColor | string | ✓ |  |
| LabelDeleted | labelDeleted | bool | ✓ |  |

## CasbTenantScanInfo

**Service:** `saas_security_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| TenantName | tenantName | string | ✓ |  |
| TenantID | tenantId | int | ✓ |  |
| SaasApplication | saasApplication | string | ✓ |  |
| ScanInfo | scanInfo | ScanInfo | ✓ |  |
| ScanAction | scanAction | int | ✓ |  |

## CasbTenantTags

**Service:** `saas_security_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| TagID | tagId | int | ✓ |  |
| TenantID | tenantId | int | ✓ |  |
| TagUUID | tagUUID | string | ✓ |  |
| TagName | tagName | string | ✓ |  |
| Deleted | deleted | bool | ✓ |  |

## CasbTenants

**Service:** `saas_security_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| TenantID | tenantId | int | ✓ |  |
| ModifiedTime | modifiedTime | int | ✓ |  |
| LastTenantValidationTime | lastTenantValidationTime | int | ✓ |  |
| TenantDeleted | tenantDeleted | bool | ✓ |  |
| TenantWebhookEnabled | tenantWebhookEnabled | bool | ✓ |  |
| ReAuth | reAuth | bool | ✓ |  |
| FeaturesSupported | featuresSupported | []string | ✓ |  |
| Status | status | []string | ✓ |  |
| EnterpriseTenantID | enterpriseTenantId | string | ✓ |  |
| TenantName | tenantName | string | ✓ |  |
| SaaSApplication | saasApplication | string | ✓ |  |
| ZscalerAppTenantID | zscalerAppTenantId | *common.IDName | ✓ |  |

## DomainProfiles

**Service:** `saas_security_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ProfileID | profileId | int | ✓ |  |
| ProfileName | profileName | string | ✓ |  |
| IncludeCompanyDomains | includeCompanyDomains | bool | ✓ |  |
| IncludeSubdomains | includeSubdomains | bool | ✓ |  |
| Description | description | string | ✓ |  |
| CustomDomains | customDomains | []string | ✓ |  |
| PredefinedEmailDomains | predefinedEmailDomains | []string |  |  |

## QuarantineTombstoneLite

**Service:** `saas_security_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |

## ScanInfo

**Service:** `saas_security_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CurScanStartTime | cur_scan_start_time | int | ✓ |  |
| PrevScanEndTime | prev_scan_end_time | int | ✓ |  |
| ScanResetNum | scan_reset_num | int | ✓ |  |

## Classification

**Service:** `sandbox/sandbox_report`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Type | Type | string | ✓ |  |
| Category | Category | string | ✓ |  |
| Score | Score | int | ✓ |  |
| DetectedMalware | DetectedMalware | string | ✓ |  |

## FileProperties

**Service:** `sandbox/sandbox_report`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| FileType | FileType | string | ✓ |  |
| FileSize | FileSize | int | ✓ |  |
| MD5 | MD5 | string | ✓ |  |
| SHA1 | SHA1 | string | ✓ |  |
| SHA256 | Sha256 | string | ✓ |  |
| Issuer | Issuer | string | ✓ |  |
| DigitalCerificate | DigitalCerificate | string | ✓ |  |
| SSDeep | SSDeep | string | ✓ |  |
| RootCA | RootCA | string | ✓ |  |

## FullDetails

**Service:** `sandbox/sandbox_report`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Summary | Summary | SummaryDetail | ✓ |  |
| Classification | Classification | Classification | ✓ |  |
| FileProperties | FileProperties | FileProperties | ✓ |  |
| Origin | Origin | *Origin | ✓ |  |
| SystemSummary | SystemSummary | []SystemSummaryDetail | ✓ |  |
| Spyware | Spyware | []*common.SandboxRSS | ✓ |  |
| Networking | Networking | []*common.SandboxRSS | ✓ |  |
| SecurityBypass | SecurityBypass | []*common.SandboxRSS | ✓ |  |
| Exploit | Exploit | []*common.SandboxRSS | ✓ |  |
| Stealth | Stealth | []*common.SandboxRSS | ✓ |  |
| Persistence | Persistence | []*common.SandboxRSS | ✓ |  |

## Origin

**Service:** `sandbox/sandbox_report`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Risk | Risk | string | ✓ |  |
| Language | Language | string | ✓ |  |
| Country | Country | string | ✓ |  |

## RatingQuota

**Service:** `sandbox/sandbox_report`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| StartTime | startTime | int | ✓ |  |
| Used | used | int | ✓ |  |
| Allowed | allowed | int | ✓ |  |
| Scale | scale | string | ✓ |  |
| Unused | unused | int | ✓ |  |

## ReportMD5Hash

**Service:** `sandbox/sandbox_report`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Details | details | *FullDetails | ✓ |  |

## Summary

**Service:** `sandbox/sandbox_report`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Detail | Summary | *SummaryDetail | ✓ |  |
| Classification | Classification | *Classification | ✓ |  |
| FileProperties | FileProperties | *FileProperties | ✓ |  |

## SummaryDetail

**Service:** `sandbox/sandbox_report`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Status | Status | string | ✓ |  |
| Category | Category | string | ✓ |  |
| FileType | FileType | string | ✓ |  |
| StartTime | StartTime | int | ✓ |  |
| Duration | Duration | int | ✓ |  |

## SystemSummaryDetail

**Service:** `sandbox/sandbox_report`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Risk | Risk | string | ✓ |  |
| Signature | Signature | string | ✓ |  |
| SignatureSources | SignatureSources | []string | ✓ |  |

## SandboxRules

**Service:** `sandbox/sandbox_rules`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| State | state | string | ✓ |  |
| Order | order | int | ✓ |  |
| BaRuleAction | baRuleAction | string | ✓ |  |
| FirstTimeEnable | firstTimeEnable | bool |  |  |
| FirstTimeOperation | firstTimeOperation | string |  |  |
| MLActionEnabled | mlActionEnabled | bool |  |  |
| ByThreatScore | byThreatScore | int | ✓ |  |
| AccessControl | accessControl | string | ✓ |  |
| Protocols | protocols | []string | ✓ |  |
| Rank | rank | int | ✓ |  |
| BaPolicyCategories | baPolicyCategories | []string | ✓ |  |
| FileTypes | fileTypes | []string | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| Locations | locations | []common.IDNameExtensions | ✓ |  |
| LocationGroups | locationGroups | []common.IDNameExtensions | ✓ |  |
| Groups | groups | []common.IDNameExtensions | ✓ |  |
| Departments | departments | []common.IDNameExtensions | ✓ |  |
| Users | users | []common.IDNameExtensions | ✓ |  |
| TimeWindows | timeWindows | []common.IDNameExtensions | ✓ |  |
| Labels | labels | []common.IDNameExtensions | ✓ |  |
| DeviceGroups | deviceGroups | []common.IDNameExtensions |  |  |
| Devices | devices | []common.IDNameExtensions |  |  |
| URLCategories | urlCategories | []string | ✓ |  |
| ZPAAppSegments | zpaAppSegments | []common.ZPAAppSegments |  |  |
| DefaultRule | defaultRule | bool |  |  |

## BaAdvancedSettings

**Service:** `sandbox/sandbox_settings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| FileHashesToBeBlocked | fileHashesToBeBlocked | []string | ✓ |  |

## FileHashCount

**Service:** `sandbox/sandbox_settings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| BlockedFileHashesCount | blockedFileHashesCount | int | ✓ |  |
| RemainingFileHashes | remainingFileHashes | int | ✓ |  |

## Md5HashValue

**Service:** `sandbox/sandbox_settings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| URL | url | string | ✓ |  |
| URLComment | urlComment | string | ✓ |  |
| Type | type | string | ✓ | e.g. "MALWARE" |

## Md5HashValueListPayload

**Service:** `sandbox/sandbox_settings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Md5HashValueList | md5HashValueList | []Md5HashValue |  |  |

## ScanResult

**Service:** `sandbox/sandbox_submission`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Code | code | int | ✓ |  |
| Message | message | string | ✓ |  |
| FileType | fileType | string | ✓ |  |
| Md5 | md5 | string | ✓ |  |
| SandboxSubmission | sandboxSubmission | string | ✓ |  |
| VirusName | virusName | string | ✓ |  |
| VirusType | virusType | string | ✓ |  |

## EnterpriseUser

**Service:** `scim_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Department | department | string | ✓ |  |

## Meta

**Service:** `scim_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Created | created | string | ✓ |  |
| LastModified | lastModified | string | ✓ |  |
| Location | location | string | ✓ |  |
| ResourceType | resourceType | string | ✓ |  |

## SCIMUser

**Service:** `scim_api`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Schemas | schemas | []string | ✓ |  |
| ID | id | string | ✓ |  |
| UserName | userName | string | ✓ |  |
| DisplayName | displayName | string | ✓ |  |
| EnterpriseExtension | urn:ietf:params:scim:schemas:extension:enterprise:2.0:User | *EnterpriseUser | ✓ |  |
| Meta | meta | *Meta | ✓ |  |

## ListUrls

**Service:** `security_policy_settings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| White | whitelistUrls | []string | ✓ |  |
| Black | blacklistUrls | []string | ✓ |  |

## ApplicationBulkUpdate

**Service:** `shadowitreport`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SanctionedState | sanctionedState | string | ✓ |  |
| ApplicationIDs | applicationIds | []int | ✓ |  |
| CloudApplicationsAndCustomTags | customTags | []CloudApplicationsAndCustomTags | ✓ |  |

## CertKeySize

**Service:** `shadowitreport`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Operation | operation | string | ✓ |  |
| Value | value | []string | ✓ |  |

## CloudApplicationsAndCustomTags

**Service:** `shadowitreport`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |

## CloudApplicationsExport

**Service:** `shadowitreport`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Duration | duration | string | ✓ |  |
| Application | application | []string | ✓ |  |
| AppName | appName | string | ✓ |  |
| ApplicationCategory | applicationCategory | []string | ✓ |  |
| DataConsumed | dataConsumed | []common.DataConsumed | ✓ |  |
| RiskIndex | riskIndex | []int | ✓ |  |
| Order | order | *common.Order | ✓ |  |
| SanctionedState | sanctionedState | []string | ✓ |  |
| Employees | employees | []string | ✓ |  |
| SupportedCertifications | supportedCertifications | *SupportedCertifications | ✓ |  |
| SourceIpRestriction | sourceIpRestriction | []string | ✓ |  |
| MfaSupport | mfaSupport | []string | ✓ |  |
| AdminAuditLogs | adminAuditLogs | []string | ✓ |  |
| HadBreachInLast3Years | hadBreachInLast3Years | []string | ✓ |  |
| HavePoorItemsOfService | havePoorItemsOfService | []string | ✓ |  |
| PasswordStrength | passwordStrength | []string | ✓ |  |
| SslPinned | sslPinned | []string | ✓ |  |
| Evasive | evasive | []string | ✓ |  |
| HaveHTTPSecurityHeaderSupport | haveHTTPSecurityHeaderSupport | []string | ✓ |  |
| DnsCAAPolicy | dnsCAAPolicy | []string | ✓ |  |
| HaveWeakCipherSupport | haveWeakCipherSupport | []string | ✓ |  |
| SslCertificationValidity | sslCertificationValidity | []string | ✓ |  |
| MalwareScanningContent | malwareScanningContent | []string | ✓ |  |
| FileSharing | fileSharing | []string | ✓ |  |
| RemoteAccessScreenSharing | remoteAccessScreenSharing | []string | ✓ |  |
| SenderPolicyFramework | senderPolicyFramework | []string | ✓ |  |
| DomainKeysIdentifiedMail | domainKeysIdentifiedMail | []string | ✓ |  |
| DomainBasedMessageAuthentication | domainBasedMessageAuthentication | []string | ✓ |  |
| VulnerableDisclosureProgram | vulnerableDisclosureProgram | []string | ✓ |  |
| WafSupport | wafSupport | []string | ✓ |  |
| Vulnerability | vulnerability | []string | ✓ |  |
| ValidSSLCertificate | validSSLCertificate | []string | ✓ |  |
| DataEncryptionInTransit | dataEncryptionInTransit | []string | ✓ |  |
| VulnerableToHeartBleed | vulnerableToHeartBleed | []string | ✓ |  |
| VulnerableToPoodle | vulnerableToPoodle | []string | ✓ |  |
| VulnerableToLogJam | vulnerableToLogJam | []string | ✓ |  |
| CertKeySize | certKeySize | *CertKeySize | ✓ |  |

## CloudApplicationsExportCSV

**Service:** `shadowitreport`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Duration | duration | string | ✓ |  |
| Application | application | []string | ✓ |  |
| Order | order | *common.Order | ✓ |  |
| DownloadBytes | downloadBytes | []common.DataConsumed | ✓ |  |
| UploadBytes | uploadBytes | []common.DataConsumed | ✓ |  |
| DataConsumed | dataConsumed | []common.DataConsumed | ✓ |  |
| Users | users | []User | ✓ |  |
| Locations | locations | []Location | ✓ |  |
| Departments | departments | []Department | ✓ |  |

## Department

**Service:** `shadowitreport`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| PID | pid | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Deleted | deleted | bool | ✓ |  |
| GetlID | getlId | int | ✓ |  |

## Location

**Service:** `shadowitreport`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| PID | pid | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Deleted | deleted | bool | ✓ |  |
| GetlID | getlId | int | ✓ |  |

## SupportedCertifications

**Service:** `shadowitreport`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Operation | operation | string | ✓ |  |
| Value | value | []string | ✓ |  |

## User

**Service:** `shadowitreport`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| PID | pid | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Deleted | deleted | bool | ✓ |  |
| GetlID | getlId | int | ✓ |  |

## Action

**Service:** `sslinspection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Type | type | string | ✓ |  |
| ShowEUN | showEUN | bool | ✓ |  |
| ShowEUNATP | showEUNATP | bool | ✓ |  |
| OverrideDefaultCertificate | overrideDefaultCertificate | bool | ✓ |  |
| SSLInterceptionCert | sslInterceptionCert | *SSLInterceptionCert | ✓ |  |
| DecryptSubActions | decryptSubActions | *DecryptSubActions | ✓ |  |
| DoNotDecryptSubActions | doNotDecryptSubActions | *DoNotDecryptSubActions | ✓ |  |

## DecryptSubActions

**Service:** `sslinspection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ServerCertificates | serverCertificates | string | ✓ |  |
| OcspCheck | ocspCheck | bool | ✓ |  |
| BlockSslTrafficWithNoSniEnabled | blockSslTrafficWithNoSniEnabled | bool | ✓ |  |
| MinClientTLSVersion | minClientTLSVersion | string | ✓ |  |
| MinServerTLSVersion | minServerTLSVersion | string | ✓ |  |
| BlockUndecrypt | blockUndecrypt | bool | ✓ |  |
| HTTP2Enabled | http2Enabled | bool | ✓ |  |

## DoNotDecryptSubActions

**Service:** `sslinspection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| BypassOtherPolicies | bypassOtherPolicies | bool | ✓ |  |
| ServerCertificates | serverCertificates | string | ✓ |  |
| OcspCheck | ocspCheck | bool | ✓ |  |
| BlockSslTrafficWithNoSniEnabled | blockSslTrafficWithNoSniEnabled | bool | ✓ |  |
| MinTLSVersion | minTLSVersion | string | ✓ |  |

## SSLInspectionRules

**Service:** `sslinspection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Action | action | Action | ✓ |  |
| State | state | string | ✓ |  |
| AccessControl | accessControl | string | ✓ |  |
| Order | order | int | ✓ |  |
| Rank | rank | int | ✓ |  |
| Locations | locations | []common.IDNameExtensions | ✓ |  |
| LocationGroups | locationGroups | []common.IDNameExtensions | ✓ |  |
| Groups | groups | []common.IDNameExtensions | ✓ |  |
| Departments | departments | []common.IDNameExtensions | ✓ |  |
| Users | users | []common.IDNameExtensions | ✓ |  |
| Platforms | platforms | []string | ✓ |  |
| RoadWarriorForKerberos | roadWarriorForKerberos | bool |  |  |
| URLCategories | urlCategories | []string | ✓ |  |
| CloudApplications | cloudApplications | []string | ✓ |  |
| UserAgentTypes | userAgentTypes | []string | ✓ |  |
| DeviceTrustLevels | deviceTrustLevels | []string | ✓ |  |
| DeviceGroups | deviceGroups | []common.IDNameExtensions | ✓ |  |
| Devices | devices | []common.IDNameExtensions | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| DestIpGroups | destIpGroups | []common.IDNameExtensions | ✓ |  |
| SourceIPGroups | sourceIpGroups | []common.IDNameExtensions | ✓ |  |
| ProxyGateways | proxyGateways | []common.IDNameExtensions | ✓ |  |
| Labels | labels | []common.IDNameExtensions | ✓ |  |
| TimeWindows | timeWindows | []common.IDNameExtensions | ✓ |  |
| ZPAAppSegments | zpaAppSegments | []common.ZPAAppSegments | ✓ |  |
| WorkloadGroups | workloadGroups | []common.IDName | ✓ |  |
| DefaultRule | defaultRule | bool | ✓ |  |
| Predefined | predefined | bool | ✓ |  |

## SSLInterceptionCert

**Service:** `sslinspection`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| DefaultCertificate | defaultCertificate | bool | ✓ |  |

## TenancyRestrictionProfile

**Service:** `tenancy_restriction`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| AppType | appType | string | ✓ |  |
| Description | description | string | ✓ |  |
| ItemTypePrimary | itemTypePrimary | string | ✓ |  |
| ItemTypeSecondary | itemTypeSecondary | string | ✓ |  |
| RestrictPersonalO365Domains | restrictPersonalO365Domains | bool | ✓ |  |
| AllowGoogleConsumers | allowGoogleConsumers | bool | ✓ |  |
| MsLoginServicesTrV2 | msLoginServicesTrV2 | bool | ✓ |  |
| AllowGoogleVisitors | allowGoogleVisitors | bool | ✓ |  |
| AllowGcpCloudStorageRead | allowGcpCloudStorageRead | bool | ✓ |  |
| ItemDataPrimary | itemDataPrimary | []string | ✓ |  |
| ItemDataSecondary | itemDataSecondary | []string | ✓ |  |
| ItemValue | itemValue | []string | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| LastModifiedUserID | lastModifiedUserId | int | ✓ |  |

## TimeInterval

**Service:** `time_intervals`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| StartTime | startTime | int |  |  |
| EndTime | endTime | int | ✓ |  |
| DaysOfWeek | daysOfWeek | []string | ✓ |  |

## RankOrderRange

**Service:** `traffic_capture`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| StartOrder | startOrder | int |  |  |
| EndOrder | endOrder | int |  |  |

## RuleLabelInfo

**Service:** `traffic_capture`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string |  |  |
| OrgID | orgId | int |  |  |

## TrafficCaptureRuleOrderInfo

**Service:** `traffic_capture`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| RuleOrderRange | ruleOrderRange | map[string]RankOrderRange |  |  |
| MaxOrderConfigured | maxOrderConfigured | int |  |  |

## TrafficCaptureRules

**Service:** `traffic_capture`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Order | order | int |  |  |
| Rank | rank | int |  |  |
| AccessControl | accessControl | string | ✓ |  |
| Action | action | string | ✓ |  |
| State | state | string | ✓ |  |
| Description | description | string | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| SrcIps | srcIps | []string | ✓ |  |
| DestAddresses | destAddresses | []string | ✓ |  |
| DestIpCategories | destIpCategories | []string | ✓ |  |
| DestCountries | destCountries | []string | ✓ |  |
| SourceCountries | sourceCountries | []string | ✓ |  |
| ExcludeSrcCountries | excludeSrcCountries | bool | ✓ |  |
| NwApplications | nwApplications | []string | ✓ |  |
| DefaultRule | defaultRule | bool |  |  |
| Predefined | predefined | bool |  |  |
| TxnSizeLimit | txnSizeLimit | string | ✓ |  |
| TxnSampling | txnSampling | string | ✓ |  |
| Locations | locations | []common.IDNameExtensions | ✓ |  |
| LocationsGroups | locationGroups | []common.IDNameExtensions | ✓ |  |
| Departments | departments | []common.IDNameExtensions | ✓ |  |
| Groups | groups | []common.IDNameExtensions | ✓ |  |
| Users | users | []common.IDNameExtensions | ✓ |  |
| TimeWindows | timeWindows | []common.IDNameExtensions | ✓ |  |
| NwApplicationGroups | nwApplicationGroups | []common.IDNameExtensions | ✓ |  |
| AppServiceGroups | appServiceGroups | []common.IDNameExtensions | ✓ |  |
| Labels | labels | []common.IDNameExtensions | ✓ |  |
| DestIpGroups | destIpGroups | []common.IDNameExtensions | ✓ |  |
| NwServices | nwServices | []common.IDNameExtensions | ✓ |  |
| NwServiceGroups | nwServiceGroups | []common.IDNameExtensions | ✓ |  |
| SrcIpGroups | srcIpGroups | []common.IDNameExtensions | ✓ |  |
| DeviceTrustLevels | deviceTrustLevels | []string | ✓ |  |
| DeviceGroups | deviceGroups | []common.IDNameExtensions |  |  |
| Devices | devices | []common.IDNameExtensions |  |  |
| WorkloadGroups | workloadGroups | []common.IDName | ✓ |  |
| SrcIpv6Groups | srcIpv6Groups | []common.IDNameExtensions | ✓ |  |
| DestIpv6Groups | destIpv6Groups | []common.IDNameExtensions | ✓ |  |

## DCExclusions

**Service:** `trafficforwarding/dc_exclusions`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| DcID | dcid | int | ✓ |  |
| Expired | expired | bool | ✓ |  |
| StartTime | startTime | int | ✓ |  |
| EndTime | endTime | int | ✓ |  |
| Description | description | string | ✓ |  |
| DcName | dcName | *common.IDNameExtensions | ✓ |  |

## Datacenter

**Service:** `trafficforwarding/dc_exclusions`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Provider | provider | string | ✓ |  |
| City | city | string | ✓ |  |
| Timezone | timezone | string | ✓ |  |
| Lat | lat | int | ✓ |  |
| Longi | longi | int | ✓ |  |
| Latitude | latitude | float64 | ✓ |  |
| Longitude | longitude | float64 | ✓ |  |
| GovOnly | govOnly | bool | ✓ |  |
| ThirdPartyCloud | thirdPartyCloud | bool | ✓ |  |
| UploadBandwidth | uploadBandwidth | int | ✓ |  |
| DownloadBandwidth | downloadBandwidth | int | ✓ |  |
| OwnedByCustomer | ownedByCustomer | bool | ✓ |  |
| ManagedBcp | managedBcp | bool | ✓ |  |
| DontPublish | dontPublish | bool | ✓ |  |
| DontProvision | dontProvision | bool | ✓ |  |
| NotReadyForUse | notReadyForUse | bool | ✓ |  |
| ForFutureUse | forFutureUse | bool | ✓ |  |
| RegionalSurcharge | regionalSurcharge | bool | ✓ |  |
| CreateTime | createTime | int | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| Virtual | virtual | bool | ✓ |  |
| Datacenter | datacenter | string | ✓ |  |

## Extranet

**Service:** `trafficforwarding/extranet`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| ExtranetDNSList | extranetDNSList | []ExtranetDNSList | ✓ |  |
| ExtranetIpPoolList | extranetIpPoolList | []ExtranetPoolList | ✓ |  |
| CreatedAt | createdAt | int | ✓ |  |
| ModifiedAt | modifiedAt | int | ✓ |  |

## ExtranetDNSList

**Service:** `trafficforwarding/extranet`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| PrimaryDNSServer | primaryDNSServer | string | ✓ |  |
| SecondaryDNSServer | secondaryDNSServer | string | ✓ |  |
| UseAsDefault | useAsDefault | bool | ✓ |  |

## ExtranetPoolList

**Service:** `trafficforwarding/extranet`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| IPStart | ipStart | string | ✓ |  |
| IPEnd | ipEnd | string | ✓ |  |
| UseAsDefault | useAsDefault | bool | ✓ |  |

## GREInternalIPRange

**Service:** `trafficforwarding/greinternalipranges`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| StartIPAddress | startIPAddress | string | ✓ |  |
| EndIPAddress | endIPAddress | string | ✓ |  |

## GRETunnelInfo

**Service:** `trafficforwarding/gretunnelinfo`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| TunID | tunID | int | ✓ |  |
| IPaddress | ipAddress | string | ✓ |  |
| GREEnabled | greEnabled | bool | ✓ |  |
| GREtunnelIP | greTunnelIP | string | ✓ |  |
| PrimaryGW | primaryGW | string | ✓ |  |
| SecondaryGW | secondaryGW | string | ✓ |  |
| GRERangePrimary | greRangePrimary | string | ✓ |  |
| GRERangeSecondary | greRangeSecondary | string | ✓ |  |

## GreTunnels

**Service:** `trafficforwarding/gretunnels`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| SourceIP | sourceIp | string | ✓ |  |
| InternalIpRange | internalIpRange | string | ✓ |  |
| LastModificationTime | lastModificationTime | int | ✓ |  |
| WithinCountry | withinCountry | *bool |  |  |
| Comment | comment | string | ✓ |  |
| IPUnnumbered | ipUnnumbered | bool |  |  |
| SubCloud | subcloud | string | ✓ |  |
| ManagedBy | managedBy | *ManagedBy | ✓ | Should probably move this to a common package. Used by multiple resources |
| LastModifiedBy | lastModifiedBy | *LastModifiedBy | ✓ | Should probably move this to a common package. Used by multiple resources |
| PrimaryDestVip | primaryDestVip | *PrimaryDestVip | ✓ |  |
| SecondaryDestVip | secondaryDestVip | *SecondaryDestVip | ✓ |  |

## LastModifiedBy

**Service:** `trafficforwarding/gretunnels`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## ManagedBy

**Service:** `trafficforwarding/gretunnels`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## PrimaryDestVip

**Service:** `trafficforwarding/gretunnels`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| VirtualIP | virtualIp | string | ✓ |  |
| PrivateServiceEdge | privateServiceEdge | bool |  |  |
| Datacenter | datacenter | string | ✓ |  |
| Latitude | latitude | float64 | ✓ |  |
| Longitude | longitude | float64 | ✓ |  |
| City | city | string | ✓ |  |
| CountryCode | countryCode | string | ✓ |  |
| Region | region | string | ✓ |  |

## SecondaryDestVip

**Service:** `trafficforwarding/gretunnels`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| VirtualIP | virtualIp | string | ✓ |  |
| PrivateServiceEdge | privateServiceEdge | bool |  |  |
| Datacenter | datacenter | string | ✓ |  |
| Latitude | latitude | float64 | ✓ |  |
| Longitude | longitude | float64 | ✓ |  |
| City | city | string | ✓ |  |
| CountryCode | countryCode | string | ✓ |  |
| Region | region | string | ✓ |  |

## IPv6Config

**Service:** `trafficforwarding/ipv6_config`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| IpV6Enabled | ipV6Enabled | bool | ✓ |  |
| NatPrefixes | natPrefixes | []IPv6ConfigPrefix | ✓ |  |
| DnsPrefix | dnsPrefix | string | ✓ |  |

## IPv6ConfigPrefix

**Service:** `trafficforwarding/ipv6_config`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| PrefixMask | prefixMask | string | ✓ |  |
| DnsPrefix | dnsPrefix | bool | ✓ |  |
| NonEditable | nonEditable | bool | ✓ |  |

## City

**Service:** `trafficforwarding/staticips`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## LastModifiedBy

**Service:** `trafficforwarding/staticips`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## ManagedBy

**Service:** `trafficforwarding/staticips`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## StaticIP

**Service:** `trafficforwarding/staticips`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| IpAddress | ipAddress | string |  |  |
| GeoOverride | geoOverride | bool |  |  |
| Latitude | latitude | float64 | ✓ |  |
| Longitude | longitude | float64 | ✓ |  |
| RoutableIP | routableIP | bool | ✓ |  |
| City | city | *City | ✓ |  |
| LastModificationTime | lastModificationTime | int |  |  |
| Comment | comment | string | ✓ |  |
| ManagedBy | managedBy | *ManagedBy | ✓ | Should probably move this to a common package. Used by multiple resources |
| LastModifiedBy | lastModifiedBy | *LastModifiedBy | ✓ | Should probably move this to a common package. Used by multiple resources |

## DCs

**Service:** `trafficforwarding/sub_clouds`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Country | country | string | ✓ |  |

## Exclusions

**Service:** `trafficforwarding/sub_clouds`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Datacenter | datacenter | *common.IDNameExtensions | ✓ |  |
| LastModifiedUser | lastModifiedUser | *common.IDNameExtensions | ✓ |  |
| Country | country | string | ✓ |  |
| Expired | expired | bool | ✓ |  |
| DisabledByOps | disabledByOps | bool | ✓ |  |
| CreateTime | createTime | int | ✓ |  |
| StartTime | startTime | int | ✓ |  |
| EndTime | endTime | int | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |

## SubCloudCountryDCExclusionInfo

**Service:** `trafficforwarding/sub_clouds`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| DcIDs | dcIds | []int | ✓ |  |
| Country | country | string | ✓ |  |
| LastDCExclusion | lastDCExclusion | bool | ✓ |  |

## SubClouds

**Service:** `trafficforwarding/sub_clouds`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Dcs | dcs | []DCs | ✓ |  |
| Exclusions | exclusions | []Exclusions | ✓ |  |

## GREVirtualIPList

**Service:** `trafficforwarding/virtualipaddress`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| VirtualIp | virtualIp | string | ✓ |  |
| PrivateServiceEdge | privateServiceEdge | bool | ✓ |  |
| DataCenter | dataCenter | string | ✓ |  |
| CountryCode | countryCode | string | ✓ |  |
| City | city | string | ✓ |  |
| Region | region | string | ✓ |  |
| Latitude | latitude | float64 |  |  |
| Longitude | longitude | float64 |  |  |

## ZscalerVIPs

**Service:** `trafficforwarding/virtualipaddress`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CloudName | cloudName | string |  |  |
| Region | region | string |  |  |
| City | city | string |  |  |
| DataCenter | dataCenter | string |  |  |
| Location | location | string |  |  |
| VPNIPs | vpnIps | []string |  |  |
| VPNDomainName | vpnDomainName | string |  |  |
| GREIPs | greIps | []string |  |  |
| GREDomainName | greDomainName | string |  |  |
| PACIPs | pacIps | []string |  |  |
| PACDomainName | pacDomainName | string |  |  |

## Location

**Service:** `trafficforwarding/vpncredentials`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string |  |  |

## ManagedBy

**Service:** `trafficforwarding/vpncredentials`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string |  |  |

## VPNCredentials

**Service:** `trafficforwarding/vpncredentials`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Type | type | string | ✓ |  |
| FQDN | fqdn | string | ✓ |  |
| IPAddress | ipAddress | string | ✓ |  |
| PreSharedKey | preSharedKey | string | ✓ |  |
| Comments | comments | string | ✓ |  |
| Location | location | *Location | ✓ |  |
| ManagedBy | managedBy | *ManagedBy | ✓ |  |

## DomainMatch

**Service:** `urlcategories`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Name | name | string |  |  |

## Scopes

**Service:** `urlcategories`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ScopeGroupMemberEntities | scopeGroupMemberEntities | []common.IDNameExtensions | ✓ |  |
| Type | Type | string | ✓ |  |
| ScopeEntities | ScopeEntities | []common.IDNameExtensions | ✓ |  |

## URLCategory

**Service:** `urlcategories`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| ConfiguredName | configuredName | string | ✓ |  |
| Keywords | keywords | []string |  |  |
| KeywordsRetainingParentCategory | keywordsRetainingParentCategory | []string |  |  |
| Urls | urls | []string |  |  |
| DBCategorizedUrls | dbCategorizedUrls | []string |  |  |
| CustomCategory | customCategory | bool |  |  |
| Scopes | scopes | []Scopes | ✓ |  |
| Editable | editable | bool |  |  |
| Description | description | string | ✓ |  |
| Type | type | string | ✓ |  |
| URLKeywordCounts | urlKeywordCounts | *URLKeywordCounts | ✓ |  |
| Val | val | int | ✓ |  |
| CustomUrlsCount | customUrlsCount | int | ✓ |  |
| SuperCategory | superCategory | string | ✓ |  |
| CategoryGroup | categoryGroup | string | ✓ |  |
| UrlType | urlType | string | ✓ |  |
| UrlsRetainingParentCategoryCount | urlsRetainingParentCategoryCount | int |  |  |
| IPRanges | ipRanges | []string |  |  |
| IPRangesRetainingParentCategory | ipRangesRetainingParentCategory | []string |  |  |
| CustomIpRangesCount | customIpRangesCount | int |  |  |
| IPRangesRetainingParentCategoryCount | ipRangesRetainingParentCategoryCount | int |  |  |
| RegexPatterns | regexPatterns | []string |  |  |
| RegexPatternsRetainingParentCategory | regexPatternsRetainingParentCategory | []string |  |  |

## URLClassification

**Service:** `urlcategories`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| URL | url | string | ✓ |  |
| URLClassifications | urlClassifications | []string | ✓ |  |
| URLClassificationsWithSecurityAlert | urlClassificationsWithSecurityAlert | []string | ✓ |  |
| Application | application | string | ✓ |  |

## URLKeywordCounts

**Service:** `urlcategories`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| TotalURLCount | totalUrlCount | int | ✓ |  |
| RetainParentURLCount | retainParentUrlCount | int | ✓ |  |
| TotalKeywordCount | totalKeywordCount | int | ✓ |  |
| RetainParentKeywordCount | retainParentKeywordCount | int | ✓ |  |

## URLQuota

**Service:** `urlcategories`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| UniqueUrlsProvisioned | uniqueUrlsProvisioned | int | ✓ |  |
| RemainingUrlsQuota | remainingUrlsQuota | int | ✓ |  |

## URLReview

**Service:** `urlcategories`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| URL | url | string |  |  |
| DomainType | domainType | string |  |  |
| Matches | matches | []DomainMatch |  |  |

## CBIProfile

**Service:** `urlfilteringpolicies`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string | ✓ |  |
| URL | url | string | ✓ |  |
| ProfileSeq | profileSeq | int | ✓ |  |

## URLAdvancedPolicySettings

**Service:** `urlfilteringpolicies`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| EnableDynamicContentCat | enableDynamicContentCat | bool | ✓ |  |
| ConsiderEmbeddedSites | considerEmbeddedSites | bool | ✓ |  |
| EnforceSafeSearch | enforceSafeSearch | bool | ✓ |  |
| EnableOffice365 | enableOffice365 | bool | ✓ |  |
| EnableMsftO365 | enableMsftO365 | bool | ✓ |  |
| EnableUcaasZoom | enableUcaasZoom | bool | ✓ |  |
| EnableUcaasLogMeIn | enableUcaasLogMeIn | bool | ✓ |  |
| EnableUcaasRingCentral | enableUcaasRingCentral | bool | ✓ |  |
| EnableUcaasWebex | enableUcaasWebex | bool | ✓ |  |
| EnableUcaasTalkdesk | enableUcaasTalkdesk | bool | ✓ |  |
| EnableChatGptPrompt | enableChatGptPrompt | bool | ✓ |  |
| EnableMicrosoftCoPilotPrompt | enableMicrosoftCoPilotPrompt | bool | ✓ |  |
| EnableGeminiPrompt | enableGeminiPrompt | bool | ✓ |  |
| EnablePOEPrompt | enablePOEPrompt | bool | ✓ |  |
| EnableMetaPrompt | enableMetaPrompt | bool | ✓ |  |
| EnablePerPlexityPrompt | enablePerPlexityPrompt | bool | ✓ |  |
| EnableDeepSeekPrompt | enableDeepSeekPrompt | bool | ✓ |  |
| EnableWriterPrompt | enableWriterPrompt | bool | ✓ |  |
| EnableGrokPrompt | enableGrokPrompt | bool | ✓ |  |
| EnableMistralAIPrompt | enableMistralAIPrompt | bool | ✓ |  |
| EnableClaudePrompt | enableClaudePrompt | bool | ✓ |  |
| EnableGrammarlyPrompt | enableGrammarlyPrompt | bool | ✓ |  |
| BlockSkype | blockSkype | bool | ✓ |  |
| EnableNewlyRegisteredDomains | enableNewlyRegisteredDomains | bool | ✓ |  |
| EnableBlockOverrideForNonAuthUser | enableBlockOverrideForNonAuthUser | bool | ✓ |  |
| EnableCIPACompliance | enableCIPACompliance | bool | ✓ |  |
| SafeSearchApps | safeSearchApps | []string | ✓ |  |
| ZveloDbLookupDisabled | zveloDbLookupDisabled | bool | ✓ |  |
| EnableCreativeCommonsSearchResults | enableCreativeCommonsSearchResults | bool | ✓ |  |

## URLFilteringRule

**Service:** `urlfilteringpolicies`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Order | order | int | ✓ |  |
| Protocols | protocols | []string | ✓ |  |
| URLCategories | urlCategories | []string |  |  |
| URLCategories2 | urlCategories2 | []string |  |  |
| UserRiskScoreLevels | userRiskScoreLevels | []string | ✓ |  |
| State | state | string | ✓ |  |
| UserAgentTypes | userAgentTypes | []string | ✓ |  |
| Rank | rank | int | ✓ |  |
| RequestMethods | requestMethods | []string | ✓ |  |
| SourceCountries | sourceCountries | []string | ✓ |  |
| EndUserNotificationURL | endUserNotificationUrl | string | ✓ |  |
| BlockOverride | blockOverride | bool | ✓ |  |
| BrowserEunTemplateID | browserEunTemplateId | int | ✓ |  |
| TimeQuota | timeQuota | int | ✓ |  |
| SizeQuota | sizeQuota | int | ✓ |  |
| Description | description | string | ✓ |  |
| ValidityStartTime | validityStartTime | int | ✓ |  |
| ValidityEndTime | validityEndTime | int | ✓ |  |
| ValidityTimeZoneID | validityTimeZoneId | string | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| EnforceTimeValidity | enforceTimeValidity | bool | ✓ |  |
| Action | action | string | ✓ |  |
| Ciparule | ciparule | bool | ✓ |  |
| DeviceTrustLevels | deviceTrustLevels | []string | ✓ |  |
| DeviceGroups | deviceGroups | []common.IDNameExtensions |  |  |
| Devices | devices | []common.IDNameExtensions |  |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| OverrideUsers | overrideUsers | []common.IDNameExtensions | ✓ |  |
| OverrideGroups | overrideGroups | []common.IDNameExtensions | ✓ |  |
| LocationGroups | locationGroups | []common.IDNameExtensions | ✓ |  |
| Labels | labels | []common.IDNameExtensions | ✓ |  |
| Locations | locations | []common.IDNameExtensions | ✓ |  |
| Groups | groups | []common.IDNameExtensions | ✓ |  |
| Departments | departments | []common.IDNameExtensions | ✓ |  |
| Users | users | []common.IDNameExtensions | ✓ |  |
| SourceIPGroups | sourceIpGroups | []common.IDNameExtensions | ✓ |  |
| TimeWindows | timeWindows | []common.IDNameExtensions | ✓ |  |
| WorkloadGroups | workloadGroups | []common.IDName | ✓ |  |
| CBIProfile | cbiProfile | *CBIProfile | ✓ |  |
| CBIProfileID | cbiProfileId | int | ✓ |  |

## ExemptedUrls

**Service:** `user_authentication_settings`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| URLs | urls | []string |  |  |

## Department

**Service:** `usermanagement/departments`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| IdpID | idpId | int |  |  |
| Comments | comments | string | ✓ |  |
| Deleted | deleted | bool |  |  |

## Groups

**Service:** `usermanagement/groups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| IdpID | idpId | int |  |  |
| Comments | comments | string | ✓ |  |
| IsSystemDefined | isSystemDefined | bool | ✓ |  |

## EnrollResult

**Service:** `usermanagement/users`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| UserID | userId | int |  |  |

## Users

**Service:** `usermanagement/users`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Email | email | string | ✓ |  |
| Groups | groups | []common.UserGroups | ✓ |  |
| Department | department | *common.UserDepartment | ✓ |  |
| Comments | comments | string | ✓ |  |
| TempAuthEmail | tempAuthEmail | string | ✓ |  |
| AuthMethods | authMethods | []string | ✓ |  |
| Password | password | string | ✓ |  |
| AdminUser | adminUser | bool |  |  |
| Type | type | string | ✓ |  |
| Deleted | deleted | bool |  |  |

## VZENClusters

**Service:** `vzen_clusters`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Status | status | string | ✓ |  |
| IpAddress | ipAddress | string | ✓ |  |
| SubnetMask | subnetMask | string | ✓ |  |
| DefaultGateway | defaultGateway | string | ✓ |  |
| Type | type | string | ✓ |  |
| IpSecEnabled | ipSecEnabled | bool | ✓ |  |
| VirtualZenNodes | virtualZenNodes | []common.IDNameExternalID | ✓ |  |

## VZENNodes

**Service:** `vzen_nodes`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| ZGatewayID | zgatewayId | int | ✓ |  |
| Name | name | string | ✓ |  |
| Status | status | string | ✓ |  |
| InProduction | inProduction | bool | ✓ |  |
| IPAddress | ipAddress | string | ✓ |  |
| SubnetMask | subnetMask | string | ✓ |  |
| DefaultGateway | defaultGateway | string | ✓ |  |
| Type | type | string | ✓ |  |
| IPSecEnabled | ipSecEnabled | bool | ✓ |  |
| OnDemandSupportTunnelEnabled | onDemandSupportTunnelEnabled | bool | ✓ |  |
| EstablishSupportTunnelEnabled | establishSupportTunnelEnabled | bool | ✓ |  |
| LoadBalancerIPAddress | loadBalancerIpAddress | string | ✓ |  |
| DeploymentMode | deploymentMode | string | ✓ |  |
| ClusterName | clusterName | string | ✓ |  |
| VzenSkuType | vzenSkuType | string | ✓ |  |

## ExpressionContainer

**Service:** `workloadgroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| TagType | tagType | string | ✓ |  |
| Operator | operator | string | ✓ |  |
| TagContainer | tagContainer | TagContainer |  |  |

## TagContainer

**Service:** `workloadgroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Tags | tags | []Tags |  |  |
| Operator | operator | string | ✓ |  |

## Tags

**Service:** `workloadgroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Key | key | string | ✓ |  |
| Value | value | string | ✓ |  |

## WorkloadGroup

**Service:** `workloadgroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| Expression | expression | string | ✓ |  |
| LastModifiedTime | lastModifiedTime | int | ✓ |  |
| LastModifiedBy | lastModifiedBy | *common.IDNameExtensions | ✓ |  |
| WorkloadTagExpression | expressionJson | WorkloadTagExpression | ✓ |  |

## WorkloadTagExpression

**Service:** `workloadgroups`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ExpressionContainers | expressionContainers | []ExpressionContainer |  |  |

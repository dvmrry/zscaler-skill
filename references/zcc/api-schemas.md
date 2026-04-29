---
product: zcc
topic: "api-schemas"
title: "ZCC API resource schemas"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/**"
author-status: draft
---

# ZCC API resource schemas

Resource-level schemas for the ZCC API, extracted from the Go SDK service layer.


## AdminRole

**Service:** `admin_roles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AdminManagement | adminManagement | string |  |  |
| AdministratorGroup | administratorGroup | string |  |  |
| AndroidProfile | androidProfile | string |  |  |
| AppBypass | appBypass | string |  |  |
| AppProfileGroup | appProfileGroup | string |  |  |
| AuditLogs | auditLogs | string |  |  |
| AuthSetting | authSetting | string |  |  |
| ClientConnectorAppStore | clientConnectorAppStore | string |  |  |
| ClientConnectorIDP | clientConnectorIdp | string |  |  |
| ClientConnectorNotifications | clientConnectorNotifications | string |  |  |
| ClientConnectorSupport | clientConnectorSupport | string |  |  |
| CompanyID | companyId | string |  |  |
| CreatedBy | createdBy | string |  |  |
| Dashboard | dashboard | string |  |  |
| DDILConfiguration | ddilConfiguration | string |  |  |
| DedicatedProxyPorts | dedicatedProxyPorts | string |  |  |
| DeviceGroups | deviceGroups | string |  |  |
| DeviceOverview | deviceOverview | string |  |  |
| DevicePosture | devicePosture | string |  |  |
| EnrolledDevicesGroup | enrolledDevicesGroup | string |  |  |
| ForwardingProfile | forwardingProfile | string |  |  |
| ID | id | string |  |  |
| IOSProfile | iosProfile | string |  |  |
| IsEditable | isEditable | bool |  |  |
| LinuxProfile | linuxProfile | string |  |  |
| MACProfile | macProfile | string |  |  |
| MachineTunnel | machineTunnel | string |  |  |
| ObfuscateData | obfuscateData | string |  |  |
| PartnerDeviceOverview | partnerDeviceOverview | string |  |  |
| PublicAPI | publicApi | string |  |  |
| RoleName | roleName | string |  |  |
| TrustedNetwork | trustedNetwork | string |  |  |
| UpdatedBy | updatedBy | string |  |  |
| UserAgent | userAgent | string |  |  |
| WindowsProfile | windowsProfile | string |  |  |
| ZPAPartnerLogin | zpaPartnerLogin | string |  |  |
| ZscalerDeception | zscalerDeception | string |  |  |
| ZscalerEntitlement | zscalerEntitlement | string |  |  |

## AdminUser

**Service:** `admin_users`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AccountEnabled | accountEnabled | string |  |  |
| CompanyID | companyId | string |  |  |
| CompanyRole | companyRole | Role |  |  |
| EditEnabled | editEnabled | string |  |  |
| ID | id | int |  |  |
| IsDefaultAdmin | isDefaultAdmin | string |  |  |
| ServiceType | serviceType | string |  |  |
| UserName | userName | string |  |  |

## Role

**Service:** `admin_users`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AdminManagement | adminManagement | string |  |  |
| AdministratorGroup | administratorGroup | string |  |  |
| AndroidProfile | androidProfile | string |  |  |
| AppBypass | appBypass | string |  |  |
| AppProfileGroup | appProfileGroup | string |  |  |
| AuditLogs | auditLogs | string |  |  |
| AuthSetting | authSetting | string |  |  |
| ClientConnectorAppStore | clientConnectorAppStore | string |  |  |
| ClientConnectorIDP | clientConnectorIdp | string |  |  |
| ClientConnectorSupport | clientConnectorSupport | string |  |  |
| ClientConnectorNotifications | clientConnectorNotifications | string |  |  |
| CompanyID | companyId | string |  |  |
| CreatedBy | createdBy | string |  |  |
| Dashboard | dashboard | string |  |  |
| DDILConfiguration | ddilConfiguration | string |  |  |
| DedicatedProxyPorts | dedicatedProxyPorts | string |  |  |
| DeviceGroups | deviceGroups | string |  |  |
| DeviceOverview | deviceOverview | string |  |  |
| DevicePosture | devicePosture | string |  |  |
| EnrolledDevicesGroup | enrolledDevicesGroup | string |  |  |
| ForwardingProfile | forwardingProfile | string |  |  |
| ID | id | string |  |  |
| IOSProfile | iosProfile | string |  |  |
| IsEditable | isEditable | bool |  |  |
| LinuxProfile | linuxProfile | string |  |  |
| MACProfile | macProfile | string |  |  |
| MachineTunnel | machineTunnel | string |  |  |
| ObfuscateData | obfuscateData | string |  |  |
| PartnerDeviceOverview | partnerDeviceOverview | string |  |  |
| PublicAPI | publicApi | string |  |  |
| RoleName | roleName | string |  |  |
| TrustedNetwork | trustedNetwork | string |  |  |
| UpdatedBy | updatedBy | string |  |  |
| UserAgent | userAgent | string |  |  |
| WindowsProfile | windowsProfile | string |  |  |
| ZPAPartnerLogin | zpaPartnerLogin | string |  |  |
| ZscalerDeception | zscalerDeception | string |  |  |
| ZscalerEntitlement | zscalerEntitlement | string |  |  |

## SyncZiaZdxZpaAdminUsers

**Service:** `admin_users`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CompanyIDs | companyIds | []int |  |  |
| ErrorCode | errorCode | string |  |  |
| ErrorInfoArguments | errorInfoArguments | []string |  |  |
| ErrorMessage | errorMessage | string |  |  |

## AppDataBlob

**Service:** `application_profiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Fqdn | fqdn | string | ✓ |  |
| Ipaddr | ipaddr | string | ✓ |  |
| Port | port | string | ✓ |  |

## AppService

**Service:** `application_profiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Active | active | bool |  |  |
| AppDataBlob | appDataBlob | []AppDataBlob | ✓ |  |

## ApplicationPolicyGroup

**Service:** `application_profiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int64 |  |  |
| Name | name | string | ✓ |  |
| AuthType | authType | string | ✓ |  |
| Active | active | int | ✓ |  |
| LastModification | lastModification | string | ✓ |  |

## ApplicationPolicyUser

**Service:** `application_profiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| LoginName | loginName | string | ✓ |  |
| LastModification | lastModification | string | ✓ |  |
| Active | active | int | ✓ |  |
| CompanyID | companyId | string | ✓ |  |

## ApplicationProfile

**Service:** `application_profiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| DeviceType | deviceType | string | ✓ |  |
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Description | description | string | ✓ |  |
| PacURL | pac_url | string | ✓ |  |
| Active | active | int |  |  |
| RuleOrder | ruleOrder | int | ✓ |  |
| LogMode | logMode | int | ✓ |  |
| LogLevel | logLevel | int | ✓ |  |
| LogFileSize | logFileSize | int | ✓ |  |
| ReauthPeriod | reauth_period | *string | ✓ |  |
| ReactivateWebSecurityMinutes | reactivateWebSecurityMinutes | string | ✓ |  |
| HighlightActiveControl | highlightActiveControl | int | ✓ |  |
| SendDisableServiceReason | sendDisableServiceReason | int | ✓ |  |
| RefreshKerberosToken | refreshKerberosToken | int | ✓ |  |
| EnableDeviceGroups | enableDeviceGroups | int | ✓ |  |
| Groups | groups | []ApplicationPolicyGroup | ✓ |  |
| DeviceGroups | deviceGroups | []ApplicationPolicyGroup | ✓ |  |

## DisasterRecovery

**Service:** `application_profiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| PolicyID | policyId | string | ✓ |  |
| EnableZiaDR | enableZiaDR | bool |  |  |
| EnableZpaDR | enableZpaDR | bool |  |  |
| ZiaDRMethod | ziaDRMethod | int | ✓ |  |
| ZiaCustomDbUrl | ziaCustomDbUrl | string | ✓ |  |
| UseZiaGlobalDb | useZiaGlobalDb | bool |  |  |
| ZiaGlobalDbUrl | ziaGlobalDbUrl | string | ✓ |  |
| ZiaGlobalDbUrlv2 | ziaGlobalDbUrlv2 | string | ✓ |  |
| ZiaDomainName | ziaDomainName | string | ✓ |  |
| ZiaRSAPubKeyName | ziaRSAPubKeyName | string | ✓ |  |
| ZiaRSAPubKey | ziaRSAPubKey | string | ✓ |  |
| ZpaDomainName | zpaDomainName | string | ✓ |  |
| ZpaRSAPubKeyName | zpaRSAPubKeyName | string | ✓ |  |
| ZpaRSAPubKey | zpaRSAPubKey | string | ✓ |  |
| AllowZiaTest | allowZiaTest | bool |  |  |
| AllowZpaTest | allowZpaTest | bool |  |  |

## GenerateCliPasswordContract

**Service:** `application_profiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| PolicyID | policyId | int | ✓ |  |
| EnableCli | enableCli | bool |  |  |
| AllowZpaDisableWithoutPassword | allowZpaDisableWithoutPassword | bool |  |  |
| AllowZiaDisableWithoutPassword | allowZiaDisableWithoutPassword | bool |  |  |
| AllowZdxDisableWithoutPassword | allowZdxDisableWithoutPassword | bool |  |  |

## LocationPolicy

**Service:** `application_profiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |

## LocationRulesetPolicies

**Service:** `application_profiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| OffTrusted | offTrusted | LocationPolicy | ✓ |  |
| Trusted | trusted | LocationPolicy | ✓ |  |
| VpnTrusted | vpnTrusted | LocationPolicy | ✓ |  |
| SplitVpnTrusted | splitVpnTrusted | LocationPolicy | ✓ |  |

## PolicyExtension

**Service:** `application_profiles`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| SourcePortBasedBypasses | sourcePortBasedBypasses | string | ✓ |  |
| PacketTunnelExcludeList | packetTunnelExcludeList | string | ✓ |  |
| PacketTunnelIncludeList | packetTunnelIncludeList | string | ✓ |  |
| CustomDNS | customDNS | string | ✓ |  |
| ExitPassword | exitPassword | string | ✓ |  |
| UseV8JsEngine | useV8JsEngine | string | ✓ |  |
| ZdxDisablePassword | zdxDisablePassword | string | ✓ |  |
| ZdDisablePassword | zdDisablePassword | string | ✓ |  |
| ZpaDisablePassword | zpaDisablePassword | string | ✓ |  |
| ZdpDisablePassword | zdpDisablePassword | string | ✓ |  |
| FollowRoutingTable | followRoutingTable | string | ✓ |  |
| UseWsaPollForZpa | useWsaPollForZpa | string | ✓ |  |
| UseDefaultAdapterForDNS | useDefaultAdapterForDNS | string | ✓ |  |
| UseZscalerNotificationFramework | useZscalerNotificationFramework | string | ✓ |  |
| SwitchFocusToNotification | switchFocusToNotification | string | ✓ |  |
| FallbackToGatewayDomain | fallbackToGatewayDomain | string | ✓ |  |
| EnableZCCRevert | enableZCCRevert | string | ✓ |  |
| ZccRevertPassword | zccRevertPassword | string | ✓ |  |
| ZpaAuthExpOnSleep | zpaAuthExpOnSleep | int | ✓ |  |
| ZpaAuthExpOnSysRestart | zpaAuthExpOnSysRestart | int | ✓ |  |
| ZpaAuthExpOnNetIpChange | zpaAuthExpOnNetIpChange | int | ✓ |  |
| InstantForceZPAReauthStateUpdate | instantForceZPAReauthStateUpdate | int | ✓ |  |
| ZpaAuthExpOnWinLogonSession | zpaAuthExpOnWinLogonSession | int | ✓ |  |
| ZpaAuthExpOnWinSessionLock | zpaAuthExpOnWinSessionLock | int | ✓ |  |
| ZpaAuthExpSessionLockStateMinTimeInSecond | zpaAuthExpSessionLockStateMinTimeInSecond | int | ✓ |  |
| PacketTunnelExcludeListForIPv6 | packetTunnelExcludeListForIPv6 | string | ✓ |  |
| PacketTunnelIncludeListForIPv6 | packetTunnelIncludeListForIPv6 | string | ✓ |  |
| EnableSetProxyOnVPNAdapters | enableSetProxyOnVPNAdapters | int | ✓ |  |
| DisableDNSRouteExclusion | disableDNSRouteExclusion | int | ✓ |  |
| AdvanceZpaReauth | advanceZpaReauth | bool |  |  |
| UseProxyPortForT1 | useProxyPortForT1 | string | ✓ |  |
| UseProxyPortForT2 | useProxyPortForT2 | string | ✓ |  |
| AllowPacExclusionsOnly | allowPacExclusionsOnly | string | ✓ |  |
| InterceptZIATrafficAllAdapters | interceptZIATrafficAllAdapters | string | ✓ |  |
| EnableAntiTampering | enableAntiTampering | string | ✓ |  |
| OverrideATCmdByPolicy | overrideATCmdByPolicy | string | ✓ |  |
| ReactivateAntiTamperingTime | reactivateAntiTamperingTime | int | ✓ |  |
| EnforceSplitDNS | enforceSplitDNS | int | ✓ |  |
| DropQuicTraffic | dropQuicTraffic | int | ✓ |  |
| EnableZdpService | enableZdpService | string | ✓ |  |
| UpdateDnsSearchOrder | updateDnsSearchOrder | int | ✓ |  |
| TruncateLargeUDPDNSResponse | truncateLargeUDPDNSResponse | int | ✓ |  |
| PrioritizeDnsExclusions | prioritizeDnsExclusions | int | ✓ |  |
| PurgeKerberosPreferredDCCache | purgeKerberosPreferredDCCache | string | ✓ |  |
| DeleteDHCPOption121Routes | deleteDHCPOption121Routes | string | ✓ |  |
| EnableLocationPolicyOverride | enableLocationPolicyOverride | int | ✓ |  |
| EnableCustomTheme | enableCustomTheme | int | ✓ |  |
| LocationRulesetPolicies | locationRulesetPolicies | LocationRulesetPolicies | ✓ |  |
| GenerateCliPasswordContract | generateCliPasswordContract | GenerateCliPasswordContract | ✓ |  |
| ZdxLiteConfigObj | zdxLiteConfigObj | string | ✓ |  |
| DdilConfig | ddilConfig | string | ✓ |  |
| ZccFailCloseSettingsIpBypasses | zccFailCloseSettingsIpBypasses | string | ✓ |  |
| ZccFailCloseSettingsExitUninstallPassword | zccFailCloseSettingsExitUninstallPassword | string | ✓ |  |
| ZccFailCloseSettingsLockdownOnTunnelProcExit | zccFailCloseSettingsLockdownOnTunnelProcessExit | int | ✓ |  |
| ZccFailCloseSettingsLockdownOnFirewallError | zccFailCloseSettingsLockdownOnFirewallError | int | ✓ |  |
| ZccFailCloseSettingsLockdownOnDriverError | zccFailCloseSettingsLockdownOnDriverError | int | ✓ |  |
| ZccFailCloseSettingsThumbPrint | zccFailCloseSettingsThumbPrint | string | ✓ |  |
| ZccAppFailOpenPolicy | zccAppFailOpenPolicy | int | ✓ |  |
| ZccTunnelFailPolicy | zccTunnelFailPolicy | int | ✓ |  |
| FollowGlobalForPartnerLogin | followGlobalForPartnerLogin | string | ✓ |  |
| UserAllowedToAddPartner | userAllowedToAddPartner | string | ✓ |  |
| AllowClientCertCachingForWebView2 | allowClientCertCachingForWebView2 | string | ✓ |  |
| ShowConfirmationDialogForCachedCert | showConfirmationDialogForCachedCert | string | ✓ |  |
| EnableFlowBasedTunnel | enableFlowBasedTunnel | int | ✓ |  |
| EnableNetworkTrafficProcessMapping | enableNetworkTrafficProcessMapping | int | ✓ |  |
| EnableLocalPacketCapture | enableLocalPacketCapture | string | ✓ |  |
| OneIdMTDeviceAuthEnabled | oneIdMTDeviceAuthEnabled | string | ✓ |  |
| EnableCustomProxyDetection | enableCustomProxyDetection | string | ✓ |  |
| PreventAutoReauthDuringDeviceLock | preventAutoReauthDuringDeviceLock | string | ✓ |  |
| UseEndPointLocationForDCSelection | useEndPointLocationForDCSelection | string | ✓ |  |
| EnableCrashReporting | enableCrashReporting | int | ✓ |  |
| RecacheSystemProxy | recacheSystemProxy | string | ✓ |  |
| EnableAutomaticPacketCapture | enableAutomaticPacketCapture | int | ✓ |  |
| EnableAPCforCriticalSections | enableAPCforCriticalSections | int | ✓ |  |
| EnableAPCforOtherSections | enableAPCforOtherSections | int | ✓ |  |
| EnablePCAdditionalSpace | enablePCAdditionalSpace | int | ✓ |  |
| PcAdditionalSpace | pcAdditionalSpace | int | ✓ |  |
| ClientConnectorUiLanguage | clientConnectorUiLanguage | int | ✓ |  |
| BlockPrivateRelay | blockPrivateRelay | string | ✓ |  |
| BypassDNSTrafficUsingUDPProxy | bypassDNSTrafficUsingUDPProxy | int | ✓ |  |
| ReconnectTunOnWakeup | reconnectTunOnWakeup | int | ✓ |  |
| BrowserAuthType | browserAuthType | string | ✓ |  |
| UseDefaultBrowser | useDefaultBrowser | string | ✓ |  |

## AppDataBlob

**Service:** `custom_ip_apps`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Proto | proto | string | ✓ |  |
| Port | port | string | ✓ |  |
| Ipaddr | ipaddr | string | ✓ |  |
| Fqdn | fqdn | string | ✓ |  |

## CustomIPApp

**Service:** `custom_ip_apps`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| AppName | appName | string | ✓ |  |
| Active | active | bool |  |  |
| UID | uid | string | ✓ |  |
| AppDataBlob | appDataBlob | []AppDataBlob | ✓ |  |
| AppDataBlobV6 | appDataBlobV6 | []AppDataBlob | ✓ |  |
| CreatedBy | createdBy | string | ✓ |  |
| EditedBy | editedBy | string | ✓ |  |
| EditedTimestamp | editedTimestamp | string | ✓ |  |
| ZappDataBlob | zappDataBlob | string | ✓ |  |
| ZappDataBlobV6 | zappDataBlobV6 | string | ✓ |  |

## DeviceCleanupInfo

**Service:** `devices`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Active | active | string |  |  |
| ForceRemoveType | forceRemoveType | string |  |  |
| DeviceExceedLimit | deviceExceedLimit | string |  |  |
| AutoRemovalDays | autoRemovalDays | string |  |  |
| AutoPurgeDays | autoPurgeDays | string |  |  |

## DeviceDetails

**Service:** `devices`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AgentVersion | agent_version | string |  |  |
| Carrier | carrier | string |  |  |
| ConfigDownloadTime | config_download_time | string |  |  |
| DeregistrationTime | deregistration_time | string |  |  |
| DevicePolicyName | devicePolicyName | string |  |  |
| DeviceLocale | device_locale | string |  |  |
| DownloadCount | download_count | int |  |  |
| ExternalModel | external_model | string |  |  |
| HardwareFingerprint | hardwareFingerprint | string |  |  |
| KeepAliveTime | keep_alive_time | string |  |  |
| LastSeenTime | last_seen_time | string |  |  |
| MacAddress | mac_address | string |  |  |
| MachineHostname | machineHostname | string |  |  |
| Manufacturer | manufacturer | string |  |  |
| OSVersion | os_version | string |  |  |
| Owner | owner | string |  |  |
| RegistrationTime | registration_time | string |  |  |
| Rooted | rooted | int |  |  |
| State | state | string |  |  |
| TunnelVersion | tunnelVersion | string |  |  |
| Type | type | string |  |  |
| UniqueID | unique_id | string |  |  |
| UpmVersion | upmVersion | string |  |  |
| UserName | user_name | string |  |  |
| ZadVersion | zadVersion | string |  |  |
| ZappArch | zappArch | string |  |  |

## GetDevices

**Service:** `devices`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AgentVersion | agentVersion | string |  |  |
| CompanyName | companyName | string |  |  |
| ConfigDownloadTime | config_download_time | string |  |  |
| DeregistrationTimestamp | deregistrationTimestamp | string |  |  |
| Detail | detail | string |  |  |
| DownloadCount | download_count | int |  |  |
| HardwareFingerprint | hardwareFingerprint | string |  |  |
| KeepAliveTime | keepAliveTime | string |  |  |
| LastSeenTime | last_seen_time | string |  |  |
| MacAddress | macAddress | string |  |  |
| MachineHostname | machineHostname | string |  |  |
| Manufacturer | manufacturer | string |  |  |
| OsVersion | osVersion | string |  |  |
| Owner | owner | string |  |  |
| PolicyName | policyName | string |  |  |
| RegistrationState | registrationState | string |  |  |
| RegistrationTime | registration_time | string |  |  |
| State | state | int |  |  |
| TunnelVersion | tunnelVersion | *string | ✓ |  |
| Type | type | int |  |  |
| Udid | udid | string |  |  |
| UpmVersion | upmVersion | string |  |  |
| User | user | string |  |  |
| VpnState | vpnState | int |  |  |
| ZappArch | zappArch | *string | ✓ |  |

## DeviceGroup

**Service:** `entitlements`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Active | active | int |  |  |
| AuthType | authType | string |  |  |
| GroupID | groupId | int |  |  |
| GroupName | groupName | string |  |  |
| UpmEnabled | upmEnabled | int |  |  |

## DeviceGroupItem

**Service:** `entitlements`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Active | active | int |  |  |
| AuthType | authType | string |  |  |
| GroupID | groupId | int |  |  |
| GroupName | groupName | string |  |  |
| ZpaEnabled | zpaEnabled | int |  |  |

## GroupListItem

**Service:** `entitlements`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Active | active | int |  |  |
| AuthType | authType | string |  |  |
| GroupID | groupId | int |  |  |
| GroupName | groupName | string |  |  |
| ZpaEnabled | zpaEnabled | int |  |  |

## ZdxGroupEntitlements

**Service:** `entitlements`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CollectZdxLocation | collectZdxLocation | int |  |  |
| ComputeDeviceGroupsForZDX | computeDeviceGroupsForZDX | int |  |  |
| LogoutZCCForZDXService | logoutZCCForZDXService | int |  |  |
| TotalCount | totalCount | int |  |  |
| UpmDeviceGroupList | upmDeviceGroupList | []DeviceGroup |  |  |
| UpmEnableForAll | upmEnableForAll | int |  |  |
| UpmGroupList | upmGroupList | []DeviceGroup |  |  |

## ZpaGroupEntitlements

**Service:** `entitlements`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ComputeDeviceGroupsForZPA | computeDeviceGroupsForZPA | int |  |  |
| DeviceGroupList | deviceGroupList | []DeviceGroupItem |  |  |
| GroupList | groupList | []GroupListItem |  |  |
| MachineTunEnabledForAll | machineTunEnabledForAll | int |  |  |
| TotalCount | totalCount | int |  |  |
| ZpaEnableForAll | zpaEnableForAll | int |  |  |

## WebFailOpenPolicy

**Service:** `failopen_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Active | active | string |  |  |
| CaptivePortalWebSecDisableMinutes | captivePortalWebSecDisableMinutes | int |  |  |
| CompanyID | companyId | string | ✓ |  |
| CreatedBy | createdBy | string | ✓ |  |
| EditedBy | editedBy | string | ✓ |  |
| EnableCaptivePortalDetection | enableCaptivePortalDetection | int |  |  |
| EnableFailOpen | enableFailOpen | int |  |  |
| EnableStrictEnforcementPrompt | enableStrictEnforcementPrompt | int |  |  |
| EnableWebSecOnProxyUnreachable | enableWebSecOnProxyUnreachable | string |  |  |
| EnableWebSecOnTunnelFailure | enableWebSecOnTunnelFailure | string |  |  |
| ID | id | string |  |  |
| StrictEnforcementPromptDelayMins | strictEnforcementPromptDelayMinutes | int |  |  |
| StrictEnforcementPromptMessage | strictEnforcementPromptMessage | string |  |  |
| TunnelFailureRetryCount | tunnelFailureRetryCount | int |  |  |

## ForwardingProfile

**Service:** `forwarding_profile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | IntOrString | ✓ |  |
| Active | active | string |  |  |
| Name | name | string |  |  |
| ConditionType | conditionType | int |  |  |
| DnsServers | dnsServers | string |  |  |
| DnsSearchDomains | dnsSearchDomains | string |  |  |
| EnableLWFDriver | enableLWFDriver | string |  |  |
| Hostname | hostname | string |  |  |
| ResolvedIpsForHostname | resolvedIpsForHostname | string |  |  |
| TrustedSubnets | trustedSubnets | string |  |  |
| TrustedGateways | trustedGateways | string |  |  |
| TrustedDhcpServers | trustedDhcpServers | string |  |  |
| TrustedEgressIps | trustedEgressIps | string |  |  |
| PredefinedTrustedNetworks | predefinedTrustedNetworks | bool |  |  |
| PredefinedTnAll | predefinedTnAll | bool |  |  |
| ForwardingProfileActions | forwardingProfileActions | []ForwardingProfileAction |  |  |
| ForwardingProfileZpaActions | forwardingProfileZpaActions | []ForwardingProfileZpaAction |  |  |
| EnableUnifiedTunnel | enableUnifiedTunnel | int |  |  |
| UnifiedTunnel | unifiedTunnel | []UnifiedTunnel |  |  |
| EnableAllDefaultAdaptersTN | enableAllDefaultAdaptersTN | int |  |  |
| EnableSplitVpnTN | enableSplitVpnTN | int |  |  |
| EvaluateTrustedNetwork | evaluateTrustedNetwork | int |  |  |
| SkipTrustedCriteriaMatch | skipTrustedCriteriaMatch | int |  |  |
| TrustedNetworkIds | trustedNetworkIds | []int |  |  |
| TrustedNetworks | trustedNetworks | []string |  |  |
| TrustedNetworkIdsSelected | trustedNetworkIdsSelected | []int |  |  |

## ForwardingProfileAction

**Service:** `forwarding_profile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| NetworkType | networkType | int |  |  |
| ActionType | actionType | int |  |  |
| SystemProxy | systemProxy | int |  |  |
| CustomPac | customPac | string |  |  |
| EnablePacketTunnel | enablePacketTunnel | int |  |  |
| SystemProxyData | systemProxyData | SystemProxyData |  |  |
| PrimaryTransport | primaryTransport | int |  |  |
| DTLSTimeout | DTLSTimeout | int |  |  |
| UDPTimeout | UDPTimeout | int |  |  |
| TLSTimeout | TLSTimeout | int |  |  |
| MtuForZadapter | mtuForZadapter | IntOrString |  |  |
| BlockUnreachableDomainsTraffic | blockUnreachableDomainsTraffic | IntOrString |  |  |
| AllowTLSFallback | allowTLSFallback | int |  |  |
| Tunnel2FallbackType | tunnel2FallbackType | int |  |  |
| SendAllDNSToTrustedServer | sendAllDNSToTrustedServer | int |  |  |
| DropIpv6Traffic | dropIpv6Traffic | IntOrString |  |  |
| RedirectWebTraffic | redirectWebTraffic | IntOrString |  |  |
| DropIpv6IncludeTrafficInT2 | dropIpv6IncludeTrafficInT2 | IntOrString |  |  |
| UseTunnel2ForProxiedWebTraffic | useTunnel2ForProxiedWebTraffic | int |  |  |
| UseTunnel2ForUnencryptedWebTraffic | useTunnel2ForUnencryptedWebTraffic | int |  |  |
| PathMtuDiscovery | pathMtuDiscovery | int |  |  |
| LatencyBasedZenEnablement | latencyBasedZenEnablement | IntOrString |  |  |
| ZenProbeInterval | zenProbeInterval | int |  |  |
| ZenProbeSampleSize | zenProbeSampleSize | int |  |  |
| ZenThresholdLimit | zenThresholdLimit | int |  |  |
| DropIpv6TrafficInIpv6Network | dropIpv6TrafficInIpv6Network | IntOrString |  |  |
| OptimiseForUnstableConnections | optimiseForUnstableConnections | int |  |  |
| LatencyBasedServerEnablement | latencyBasedServerEnablement | int | ✓ |  |
| LbsProbeInterval | lbsProbeInterval | int | ✓ |  |
| LbsProbeSampleSize | lbsProbeSampleSize | int | ✓ |  |
| LbsThresholdLimit | lbsThresholdLimit | int | ✓ |  |
| LatencyBasedServerMTEnablement | latencyBasedServerMTEnablement | int | ✓ |  |
| IsSameAsOnTrustedNetwork | isSameAsOnTrustedNetwork | bool | ✓ |  |

## ForwardingProfileZpaAction

**Service:** `forwarding_profile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| NetworkType | networkType | int |  |  |
| ActionType | actionType | int |  |  |
| PrimaryTransport | primaryTransport | int |  |  |
| DTLSTimeout | DTLSTimeout | int |  |  |
| TLSTimeout | TLSTimeout | int |  |  |
| MtuForZadapter | mtuForZadapter | int |  |  |
| SendTrustedNetworkResultToZpa | sendTrustedNetworkResultToZpa | int |  |  |
| PartnerInfo | partnerInfo | PartnerInfo |  |  |
| LatencyBasedServerEnablement | latencyBasedZpaServerEnablement | int |  |  |
| LbsProbeInterval | lbsZpaProbeInterval | int |  |  |
| LbsProbeSampleSize | lbsZpaProbeSampleSize | int |  |  |
| LbsThresholdLimit | lbsZpaThresholdLimit | int |  |  |
| LatencyBasedServerMTEnablement | latencyBasedServerMTEnablement | int |  |  |
| IsSameAsOnTrustedNetwork | isSameAsOnTrustedNetwork | bool |  |  |

## PartnerInfo

**Service:** `forwarding_profile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| PrimaryTransport | primaryTransport | int |  |  |
| AllowTlsFallback | allowTlsFallback | int |  |  |
| MtuForZadapter | mtuForZadapter | int |  |  |

## SystemProxyData

**Service:** `forwarding_profile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ProxyAction | proxyAction | int |  |  |
| EnableAutoDetect | enableAutoDetect | int |  |  |
| EnablePAC | enablePAC | int |  |  |
| PacURL | pacURL | string |  |  |
| EnableProxyServer | enableProxyServer | int |  |  |
| ProxyServerAddress | proxyServerAddress | string |  |  |
| ProxyServerPort | proxyServerPort | string |  |  |
| BypassProxyForPrivateIP | bypassProxyForPrivateIP | int |  |  |
| PerformGPUpdate | performGPUpdate | int |  |  |
| PacDataPath | pacDataPath | string |  |  |

## UnifiedTunnel

**Service:** `forwarding_profile`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| NetworkType | networkType | int |  |  |
| ActionTypeZIA | actionTypeZIA | int |  |  |
| ActionTypeZPA | actionTypeZPA | int |  |  |
| PrimaryTransport | primaryTransport | int |  |  |
| DTLSTimeout | DTLSTimeout | int |  |  |
| TLSTimeout | TLSTimeout | int |  |  |
| MtuForZadapter | mtuForZadapter | int |  |  |
| AllowTLSFallback | allowTLSFallback | int |  |  |
| PathMtuDiscovery | pathMtuDiscovery | int |  |  |
| OptimiseForUnstableConnections | optimiseForUnstableConnections | int |  |  |
| Tunnel2FallbackType | tunnel2FallbackType | int |  |  |
| RedirectWebTraffic | redirectWebTraffic | int |  |  |
| DropIpv6Traffic | dropIpv6Traffic | int |  |  |
| DropIpv6TrafficInIpv6Network | dropIpv6TrafficInIpv6Network | int |  |  |
| BlockUnreachableDomainsTraffic | blockUnreachableDomainsTraffic | int |  |  |
| DropIpv6IncludeTrafficInT2 | dropIpv6IncludeTrafficInT2 | int |  |  |
| SendAllDNSToTrustedServer | sendAllDNSToTrustedServer | int |  |  |
| SystemProxyData | systemProxyData | SystemProxyData |  |  |
| SameAsOnTrusted | sameAsOnTrusted | int |  |  |

## ManagePass

**Service:** `manage_pass`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CompanyID | companyId | int |  |  |
| DeviceType | deviceType | int |  |  |
| ExitPass | exitPass | string |  |  |
| LogoutPass | logoutPass | string |  |  |
| PolicyName | policyName | string |  |  |
| UninstallPass | uninstallPass | string |  |  |
| ZadDisablePass | zadDisablePass | string |  |  |
| ZdpDisablePass | zdpDisablePass | string |  |  |
| ZdxDisablePass | zdxDisablePass | string |  |  |
| ZiaDisablePass | ziaDisablePass | string |  |  |
| ZpaDisablePass | zpaDisablePass | string |  |  |

## ManagePassResponseContract

**Service:** `manage_pass`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ErrorMessage | errorMessage | string |  |  |

## AppDataBlob

**Service:** `predefined_ip_apps`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Proto | proto | string | ✓ |  |
| Port | port | string | ✓ |  |
| Ipaddr | ipaddr | string | ✓ |  |
| Fqdn | fqdn | string | ✓ |  |

## PredefinedIPApp

**Service:** `predefined_ip_apps`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| AppVersion | appVersion | int | ✓ |  |
| AppSvcId | appSvcId | int | ✓ |  |
| AppName | appName | string | ✓ |  |
| Active | active | bool |  |  |
| UID | uid | string | ✓ |  |
| AppDataBlob | appDataBlob | []AppDataBlob | ✓ |  |
| AppDataBlobV6 | appDataBlobV6 | []AppDataBlob | ✓ |  |
| CreatedBy | createdBy | string | ✓ |  |
| EditedBy | editedBy | string | ✓ |  |
| EditedTimestamp | editedTimestamp | string | ✓ |  |
| ZappDataBlob | zappDataBlob | string | ✓ |  |
| ZappDataBlobV6 | zappDataBlobV6 | string | ✓ |  |

## ProcessBasedApp

**Service:** `process_based_apps`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| AppName | appName | string | ✓ |  |
| FileNames | fileNames | []string | ✓ |  |
| FilePaths | filePaths | []string | ✓ |  |
| MatchingCriteria | matchingCriteria | int | ✓ |  |
| SignaturePayload | signaturePayload | string | ✓ |  |
| CertificatePayload | certificatePayload | string | ✓ |  |
| CreatedBy | createdBy | string | ✓ |  |
| EditedBy | editedBy | string | ✓ |  |
| EditedTimestamp | editedTimestamp | string | ✓ |  |

## TrustedNetwork

**Service:** `trusted_network`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Active | active | bool |  |  |
| CompanyID | companyId | string | ✓ |  |
| ConditionType | conditionType | int |  |  |
| CreatedBy | createdBy | string | ✓ |  |
| DnsSearchDomains | dnsSearchDomains | string |  |  |
| DnsServers | dnsServers | string |  |  |
| EditedBy | editedBy | string | ✓ |  |
| Guid | guid | string | ✓ |  |
| Hostnames | hostnames | string |  |  |
| NetworkName | networkName | string |  |  |
| ResolvedIpsForHostname | resolvedIpsForHostname | string |  |  |
| Ssids | ssids | string | ✓ |  |
| TrustedDhcpServers | trustedDhcpServers | string |  |  |
| TrustedEgressIps | trustedEgressIps | string | ✓ |  |
| TrustedGateways | trustedGateways | string |  |  |
| TrustedSubnets | trustedSubnets | string |  |  |

## AppDataBlob

**Service:** `web_app_service`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Proto | proto | string | ✓ |  |
| Port | port | string | ✓ |  |
| Ipaddr | ipaddr | string | ✓ |  |
| Fqdn | fqdn | string | ✓ |  |

## WebAppService

**Service:** `web_app_service`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| AppVersion | appVersion | int | ✓ |  |
| AppSvcId | appSvcId | int | ✓ |  |
| AppName | appName | string | ✓ |  |
| Active | active | bool |  |  |
| UID | uid | string | ✓ |  |
| AppDataBlob | appDataBlob | []AppDataBlob | ✓ |  |
| AppDataBlobV6 | appDataBlobV6 | []AppDataBlob | ✓ |  |
| CreatedBy | createdBy | string | ✓ |  |
| EditedBy | editedBy | string | ✓ |  |
| EditedTimestamp | editedTimestamp | string | ✓ |  |
| ZappDataBlob | zappDataBlob | string | ✓ |  |
| ZappDataBlobV6 | zappDataBlobV6 | string | ✓ |  |
| Version | version | int | ✓ |  |

## AndroidPolicy

**Service:** `web_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AllowedApps | allowedApps | string |  |  |
| BillingDay | billingDay | string |  |  |
| BypassAndroidApp | bypassAndroidApps | string |  |  |
| BypassMmsApps | bypassMmsApps | string |  |  |
| CustomText | customText | string |  |  |
| DisablePassword | disablePassword | string |  |  |
| EnableVerboseLog | enableVerboseLog | string |  |  |
| Enforced | enforced | string |  |  |
| InstallCerts | installCerts | string |  |  |
| Limit | limit | string |  |  |
| LogoutPassword | logoutPassword | string |  |  |
| QuotaRoaming | quotaRoaming | string |  |  |
| UninstallPass | uninstallPassword | string |  |  |
| WifiSsid | wifissid | string |  |  |

## DisasterRecovery

**Service:** `web_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AllowZiaTest | allowZiaTest | bool |  |  |
| AllowZpaTest | allowZpaTest | bool |  |  |
| EnableZiaDR | enableZiaDR | bool |  |  |
| EnableZpaDR | enableZpaDR | bool |  |  |
| PolicyId | policyId | string |  |  |
| UseZiaGlobalDb | useZiaGlobalDb | bool |  |  |
| ZiaDRRecoveryMethod | ziaDRRecoveryMethod | int |  |  |
| ZiaDomainName | ziaDomainName | string |  |  |
| ZiaGlobalDbURL | ziaGlobalDbUrl | string |  |  |
| ZiaGlobalDbURLV2 | ziaGlobalDbUrlv2 | string |  |  |
| ZiaPacURL | ziaPacUrl | string |  |  |
| ZiaSecretKeyData | ziaSecretKeyData | string |  |  |
| ZiaSecretKeyName | ziaSecretKeyName | string |  |  |
| ZpaDomainName | zpaDomainName | string |  |  |
| ZpaSecretKeyData | zpaSecretKeyData | string |  |  |
| ZpaSecretKeyName | zpaSecretKeyName | string |  |  |

## GenerateCliPasswordContract

**Service:** `web_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AllowZpaDisableWithoutPassword | allowZpaDisableWithoutPassword | bool |  |  |
| EnableCli | enableCli | bool |  |  |
| PolicyId | policyId | int |  |  |

## IosPolicy

**Service:** `web_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| DisablePassword | disablePassword | string |  |  |
| Ipv6Mode | ipv6Mode | string |  |  |
| LogoutPassword | logoutPassword | string |  |  |
| Passcode | passcode | string |  |  |
| ShowVPNTunNotification | showVPNTunNotification | string |  |  |
| UninstallPassword | uninstallPassword | string |  |  |

## LinuxPolicy

**Service:** `web_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| DisablePassword | disablePassword | string |  |  |
| InstallCerts | installCerts | string |  |  |
| LogoutPassword | logoutPassword | string |  |  |
| UninstallPassword | uninstallPassword | string |  |  |

## MacPolicy

**Service:** `web_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AddIfscopeRoute | addIfscopeRoute | string |  |  |
| CacheSystemProxy | cacheSystemProxy | string |  |  |
| ClearArpCache | clearArpCache | string |  |  |
| DisablePassword | disablePassword | string |  |  |
| DnsPriorityOrdering | dnsPriorityOrdering | string |  |  |
| DnsPriorityOrderingForTrustedDnsCrit | dnsPriorityOrderingForTrustedDnsCriteria | string |  |  |
| EnableAppBasedBypass | enableApplicationBasedBypass | string |  |  |
| EnableZscalerFirewall | enableZscalerFirewall | string |  |  |
| InstallCerts | installCerts | string |  |  |
| LogoutPassword | logoutPassword | string |  |  |
| PersistentZscalerFirewall | persistentZscalerFirewall | string |  |  |
| UninstallPassword | uninstallPassword | string |  |  |

## PolicyExtension

**Service:** `web_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AdvanceZpaReauth | advanceZpaReauth | bool |  |  |
| AdvanceZpaReauthTime | advanceZpaReauthTime | int |  |  |
| CustomDNS | customDNS | string |  |  |
| DdilConfig | ddilConfig | string |  |  |
| DeleteDHCPOption121Routes | deleteDHCPOption121Routes | string |  |  |
| DisableDNSRouteExclusion | disableDNSRouteExclusion | string |  |  |
| DropQuicTraffic | dropQuicTraffic | string |  |  |
| EnableAntiTampering | enableAntiTampering | string |  |  |
| EnableSetProxyOnVPNAdapters | enableSetProxyOnVPNAdapters | string |  |  |
| EnableZCCRevert | enableZCCRevert | string |  |  |
| EnableZdpService | enableZdpService | string |  |  |
| EnforceSplitDNS | enforceSplitDNS | string |  |  |
| ExitPassword | exitPassword | string |  |  |
| FallbackToGatewayDomain | fallbackToGatewayDomain | string |  |  |
| FollowGlobalForPartnerLogin | followGlobalForPartnerLogin | string |  |  |
| FollowRoutingTable | followRoutingTable | string |  |  |
| GenerateCliPasswordContract | generateCliPasswordContract | GenerateCliPasswordContract |  |  |
| InterceptZIATrafficAllAdapters | interceptZIATrafficAllAdapters | string |  |  |
| MachineIdpAuth | machineIdpAuth | bool |  |  |
| Nonce | nonce | string |  |  |
| OverrideATCmdByPolicy | overrideATCmdByPolicy | string |  |  |
| PacketTunnelDnsExcludeList | packetTunnelDnsExcludeList | string |  |  |
| PacketTunnelDnsIncludeList | packetTunnelDnsIncludeList | string |  |  |
| PacketTunnelExcludeList | packetTunnelExcludeList | string |  |  |
| PacketTunnelExcludeListForIPv6 | packetTunnelExcludeListForIPv6 | string |  |  |
| PacketTunnelIncludeList | packetTunnelIncludeList | string |  |  |
| PacketTunnelIncludeListForIPv6 | packetTunnelIncludeListForIPv6 | string |  |  |
| PartnerDomains | partnerDomains | string |  |  |
| PrioritizeDnsExclusions | prioritizeDnsExclusions | string |  |  |
| PurgeKerberosPreferredDCCache | purgeKerberosPreferredDCCache | string |  |  |
| ReactivateAntiTamperingTime | reactivateAntiTamperingTime | int |  |  |
| SourcePortBasedBypasses | sourcePortBasedBypasses | string |  |  |
| TruncateLargeUDPDNSResponse | truncateLargeUDPDNSResponse | string |  |  |
| UpdateDnsSearchOrder | updateDnsSearchOrder | string |  |  |
| UseDefaultAdapterForDNS | useDefaultAdapterForDNS | string |  |  |
| UseProxyPortForT1 | useProxyPortForT1 | string |  |  |
| UseProxyPortForT2 | useProxyPortForT2 | string |  |  |
| UseV8JsEngine | useV8JsEngine | string |  |  |
| UseWsaPollForZpa | useWsaPollForZpa | string |  |  |
| UseZscalerNotificationFramework | useZscalerNotificationFramework | string |  |  |
| UserAllowedToAddPartner | userAllowedToAddPartner | string |  |  |
| VpnGateways | vpnGateways | string |  |  |
| ZccAppFailOpenPolicy | zccAppFailOpenPolicy | string |  |  |
| ZccFailCloseSettingsAppByPassIds | zccFailCloseSettingsAppByPassIds | []int |  |  |
| ZccFailCloseSettingsAppByPassNames | zccFailCloseSettingsAppByPassNames | []string |  |  |
| ZccFailCloseSettingsExitUninstallPass | zccFailCloseSettingsExitUninstallPassword | string |  |  |
| ZccFailCloseSettingsIpBypasses | zccFailCloseSettingsIpBypasses | string |  |  |
| ZccFailCloseSettingsLockdownOnTunnel | zccFailCloseSettingsLockdownOnTunnelProcessExit | string |  |  |
| ZccFailCloseSettingsThumbPrint | zccFailCloseSettingsThumbPrint | string |  |  |
| ZccRevertPassword | zccRevertPassword | string |  |  |
| ZccTunnelFailPolicy | zccTunnelFailPolicy | string |  |  |
| ZdDisablePassword | zdDisablePassword | string |  |  |
| ZdpDisablePassword | zdpDisablePassword | string |  |  |
| ZdxDisablePassword | zdxDisablePassword | string |  |  |
| ZdxLiteConfigObj | zdxLiteConfigObj | string |  |  |
| ZpaAuthExpOnNetIpChange | zpaAuthExpOnNetIpChange | string |  |  |
| ZpaAuthExpOnSleep | zpaAuthExpOnSleep | string |  |  |
| ZpaAuthExpOnSysRestart | zpaAuthExpOnSysRestart | string |  |  |
| ZpaAuthExpOnWinLogonSession | zpaAuthExpOnWinLogonSession | string |  |  |
| ZpaAuthExpOnWinSessionLock | zpaAuthExpOnWinSessionLock | string |  |  |
| ZpaAuthExpSessionLockStateMinTime | zpaAuthExpSessionLockStateMinTimeInSecond | int |  |  |
| ZpaDisablePassword | zpaDisablePassword | string |  |  |

## WebPolicy

**Service:** `web_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Active | active | string |  |  |
| AllowUnreachablePac | allowUnreachablePac | bool |  |  |
| AndroidPolicy | androidPolicy | AndroidPolicy |  |  |
| AppIdentityNames | appIdentityNames | []string |  |  |
| AppServiceIds | appServiceIds | []int |  |  |
| AppServiceNames | appServiceNames | []string |  |  |
| BypassAppIds | bypassAppIds | []int |  |  |
| BypassCustomAppIds | bypassCustomAppIds | []int |  |  |
| Description | description | string |  |  |
| DeviceGroupIds | deviceGroupIds | []int |  |  |
| DeviceGroupNames | deviceGroupNames | []string |  |  |
| DeviceType | device_type | string |  |  |
| DisasterRecovery | disasterRecovery | DisasterRecovery |  |  |
| EnableDeviceGroups | enableDeviceGroups | string |  |  |
| ForwardingProfileId | forwardingProfileId | int |  |  |
| GroupAll | groupAll | string |  |  |
| GroupIds | groupIds | []int |  |  |
| GroupNames | groupNames | []string |  |  |
| HighlightActiveControl | highlightActiveControl | string |  |  |
| ID | id | string |  |  |
| IosPolicy | iosPolicy | IosPolicy |  |  |
| LinuxPolicy | linuxPolicy | LinuxPolicy |  |  |
| LogFileSize | logFileSize | string |  |  |
| LogLevel | logLevel | string |  |  |
| LogMode | logMode | string |  |  |
| MacPolicy | macPolicy | MacPolicy |  |  |
| Name | name | string |  |  |
| PacURL | pac_url | string |  |  |
| PolicyExtension | policyExtension | PolicyExtension |  |  |
| ReactivateWebSecurityMins | reactivateWebSecurityMinutes | string |  |  |
| ReauthPeriod | reauth_period | string |  |  |
| RuleOrder | ruleOrder | string |  |  |
| SendDisableServiceReason | sendDisableServiceReason | string |  |  |
| TunnelZappTraffic | tunnelZappTraffic | string |  |  |
| UserIds | userIds | []int |  |  |
| UserNames | userNames | []string |  |  |
| WindowsPolicy | windowsPolicy | WindowsPolicy |  |  |
| ZiaPostureConfigId | ziaPostureConfigId | int |  |  |

## WebPolicyActivation

**Service:** `web_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| DeviceType | deviceType | int |  |  |
| PolicyId | policyId | int |  |  |

## WindowsPolicy

**Service:** `web_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| CacheSystemProxy | cacheSystemProxy | int |  |  |
| CaptivePortalConfig | captivePortalConfig | string |  |  |
| DisableLoopBackRestriction | disableLoopBackRestriction | int |  |  |
| DisableParallelIpv4andIpv6 | disableParallelIpv4andIpv6 | string |  |  |
| DisablePassword | disablePassword | string |  |  |
| FlowLoggerConfig | flowLoggerConfig | string |  |  |
| ForceLocationRefreshSccm | forceLocationRefreshSccm | int |  |  |
| InstallWindowsFirewallInbound | installWindowsFirewallInboundRule | int |  |  |
| InstallCerts | installCerts | string |  |  |
| LogoutPassword | logoutPassword | string |  |  |
| OverrideWPAD | overrideWPAD | int |  |  |
| PacDataPath | pacDataPath | string |  |  |
| PacType | pacType | int |  |  |
| PrioritizeIPv4 | prioritizeIPv4 | int |  |  |
| RemoveExemptedContainers | removeExemptedContainers | int |  |  |
| RestartWinHttpSvc | restartWinHttpSvc | int |  |  |
| TriggerDomainProfleDetection | triggerDomainProfleDetection | int |  |  |
| UninstallPassword | uninstallPassword | string |  |  |
| WfpDriver | wfpDriver | int |  |  |

## WebPrivacyInfo

**Service:** `web_privacy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Active | active | string |  |  |
| CollectUserInfo | collectUserInfo | string |  |  |
| CollectMachineHostname | collectMachineHostname | string |  |  |
| CollectZdxLocation | collectZdxLocation | string |  |  |
| EnablePacketCapture | enablePacketCapture | string |  |  |
| DisableCrashlytics | disableCrashlytics | string |  |  |
| OverrideT2ProtocolSetting | overrideT2ProtocolSetting | string |  |  |
| RestrictRemotePacketCapture | restrictRemotePacketCapture | string |  |  |
| GrantAccessToZscalerLogFolder | grantAccessToZscalerLogFolder | string |  |  |
| ExportLogsForNonAdmin | exportLogsForNonAdmin | string |  |  |
| EnableAutoLogSnippet | enableAutoLogSnippet | string |  |  |
| EnforceSecurePacUrls | enforceSecurePacUrls | string |  |  |
| EnableFQDNMatchForVpnBypasses | enableFQDNMatchForVpnBypasses | string |  |  |

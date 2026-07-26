---
product: zcc
topic: "api-schemas"
title: "ZCC API resource schemas"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: f38edc59c5c6d05a13fe2cc88d6782e349276586
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
| ServiceType | serviceType | int |  | numeric service id (1=ZIA, 2=ZPA, 3=ZID, 4=ZDX); the API emits this as a JSON number, so the SDK migrated the field from `string` to `int` to fix a `json: cannot unmarshal number into Go struct field` decode error |
| UserName | userName | string |  |  |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/admin_users/admin_users.go:36` (ServiceType `int`, with the decode-error code comment at lines 30-35).

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

## web_policy structs (v2 MA / Secure-Browsing refactor)

The `web_policy` service was reshaped by two Go SDK commits landed after the
prior snapshot: #434 "New ZCC MA V2 API Endpoints" and #435 "v2 ZCC Secure
Browsing Endpoints". Two structural consequences for the schemas below:

- **Per-platform fields flattened to the WebPolicy root.** The ZCC UI emits many
  knobs both at the WebPolicy top level *and* inside the per-OS block
  (windowsPolicy/macPolicy/etc.), often with different wire types (a top-level
  JSON number vs. a quoted string inside the OS block). The Go struct mirrors
  both: a Go field name suffixed `Top` lives at the WebPolicy level, the
  unsuffixed counterpart lives inside the nested block. **The camelCase wire
  keys are unchanged** — `clearArpCache`, `enableZscalerFirewall`,
  `packetTunnelIncludeList`, etc. now also appear at the WebPolicy root, not only
  under the per-OS block. (Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:84-90`, struct doc comment.)
- **New fields and sub-structs** absent from the prior snapshot:
  `notificationTemplateContract` + `notificationTemplateId` (links a WebPolicy to
  the v2 notification-templates surface), `endToEndDiagnostics`,
  `captivePortalUrlId` (`[]LabelValuePair`), `localMetrics`,
  `deviceGroupsOption`/`usersOption`, `registryPath`/`registryName`,
  `useTunnelSDK4_3`, plus pervasive `LabelValuePair`-typed `*Selected` /
  `*SelectedOption` form-state fields.

The full WebPolicy now carries ~174 top-level JSON fields (verified
`awk '/^type WebPolicy struct/,/^}/' web_policy.go | grep -c json:` = 174). The
WebPolicy table below groups them by purpose, following the source's own section
comments; the helper structs follow.

### Helper structs

#### LabelValuePair

`{label, value}` form-state object the UI generates for every dropdown /
autocomplete and echoes back in the PUT body. `value` is `any` because some
pickers use integer values and others quoted strings.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Label | label | string |  |  |
| Value | value | any |  | int or string depending on the picker |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:32-35`.

#### EndToEndDiagnostics

Per-network-context end-to-end diagnostics toggle the macOS web policy ships at
the top level (also embedded as JSON inside `policyExtension.zdxLiteConfigObj`).

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Trusted | trusted | int |  |  |
| VpnTrusted | vpnTrusted | int |  |  |
| OffTrusted | offTrusted | int |  |  |
| SplitVpnTrusted | splitVpnTrusted | int |  |  |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:40-45`.

#### LocationRulesetEntry / LocationRulesetPolicies

Small `locationRulesetPolicies` block the API expects inside `policyExtension`;
both nested entries are present even when no ruleset is bound (`id` is then 0).

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  | LocationRulesetEntry |
| SplitVpnTrusted | splitVpnTrusted | LocationRulesetEntry |  | LocationRulesetPolicies |
| VpnTrusted | vpnTrusted | LocationRulesetEntry |  | LocationRulesetPolicies |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:51-58`.

#### NotificationTemplateContract

The `notificationTemplateContract` block the iOS web policy carries at the
WebPolicy root (the macOS capture omits it, so the WebPolicy field is pointer +
`omitempty`). The 0/1 flags travel as quoted strings; the four counters are JSON
numbers.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| TemplateName | templateName | string |  |  |
| DefaultTemplate | defaultTemplate | string |  | "0"/"1" |
| EnableClientNotification | enableClientNotification | string |  | "0"/"1" |
| EnableZiaNotification | enableZiaNotification | string |  | "0"/"1" |
| EnableAppUpdatesNotification | enableAppUpdatesNotification | string |  | "0"/"1" |
| EnableServiceStatusNotification | enableServiceStatusNotification | string |  | "0"/"1" |
| EnableNotificationForZPAReauth | enableNotificationForZPAReauth | string |  | "0"/"1" |
| ZpaReauthNotificationTime | zpaReauthNotificationTime | int |  |  |
| CustomTimer | customTimer | int |  |  |
| ZiaNotificationPersistant | ziaNotificationPersistant | string |  | "0"/"1" |
| EnablePersistantNotification | enablePersistantNotification | string |  | "0"/"1" |
| ZiaFirewall | ziaFirewall | string |  | "0"/"1" |
| ZiaFirewallPopup | ziaFirewallPopup | string |  | "0"/"1" |
| ZiaDNS | ziaDNS | string |  | "0"/"1" |
| ZiaDNSPopup | ziaDNSPopup | string |  | "0"/"1" |
| ZiaIPS | ziaIPS | string |  | "0"/"1" |
| ZiaIPSPopup | ziaIPSPopup | string |  | "0"/"1" |
| DoNotDisturb | doNotDisturb | string |  | "0"/"1" |
| ShowDevicePostureFailureNotification | showDevicePostureFailureNotification | string |  | "0"/"1" |
| DelayPostureFailureNotificationSeconds | delayPostureFailureNotificationSeconds | int |  |  |
| CreatedBy | createdBy | string |  |  |
| EditedBy | editedBy | string |  |  |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:430-454`.

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

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:339-354`.

## DisasterRecovery

**Service:** `web_policy`

JSON tags match a real `/listByCompany` response: `ziaDRMethod` (not the prior
`ziaDRRecoveryMethod`), `ziaRSAPubKeyName`/`ziaRSAPubKey`,
`zpaRSAPubKeyName`/`zpaRSAPubKey`, plus the supplemental `ziaCustomDbUrl` field
custom DR setups use. The prior `ziaSecretKeyData`/`ziaSecretKeyName`/
`zpaSecretKeyData`/`zpaSecretKeyName` fields are not present in the current
struct.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AllowZiaTest | allowZiaTest | bool |  |  |
| AllowZpaTest | allowZpaTest | bool |  |  |
| EnableZiaDR | enableZiaDR | bool |  |  |
| EnableZpaDR | enableZpaDR | bool |  |  |
| PolicyId | policyId | string | ✓ |  |
| UseZiaGlobalDb | useZiaGlobalDb | bool |  |  |
| ZiaDRMethod | ziaDRMethod | int |  | renamed from ziaDRRecoveryMethod |
| ZiaCustomDbUrl | ziaCustomDbUrl | string |  | new |
| ZiaDomainName | ziaDomainName | string |  |  |
| ZiaGlobalDbURL | ziaGlobalDbUrl | string | ✓ |  |
| ZiaGlobalDbURLV2 | ziaGlobalDbUrlv2 | string | ✓ |  |
| ZiaPacURL | ziaPacUrl | string | ✓ |  |
| ZiaRSAPubKey | ziaRSAPubKey | string |  | replaces ziaSecretKeyData |
| ZiaRSAPubKeyName | ziaRSAPubKeyName | string |  | replaces ziaSecretKeyName |
| ZpaDomainName | zpaDomainName | string |  |  |
| ZpaRSAPubKey | zpaRSAPubKey | string |  | replaces zpaSecretKeyData |
| ZpaRSAPubKeyName | zpaRSAPubKeyName | string |  | replaces zpaSecretKeyName |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:487-505`.

## GenerateCliPasswordContract

**Service:** `web_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| EnableCli | enableCli | bool |  |  |
| AllowZpaDisableWithoutPassword | allowZpaDisableWithoutPassword | bool |  |  |
| AllowZiaDisableWithoutPassword | allowZiaDisableWithoutPassword | bool |  | new |
| AllowZdxDisableWithoutPassword | allowZdxDisableWithoutPassword | bool |  | new |
| PolicyId | policyId | int | ✓ |  |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:639-645`.

## IosPolicy

**Service:** `web_policy`

`useTunnelSDK4_3` is a quoted string inside this block, while the same key at the
WebPolicy root is a JSON number — the wire shapes diverge intentionally.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| DisablePassword | disablePassword | string |  |  |
| Ipv6Mode | ipv6Mode | int |  | int here; the top-level mirror is also int |
| LogoutPassword | logoutPassword | string |  |  |
| Passcode | passcode | string |  |  |
| ShowVPNTunNotification | showVPNTunNotification | string |  |  |
| UninstallPassword | uninstallPassword | string |  |  |
| UseTunnelSDK43 | useTunnelSDK4_3 | string |  | new; quoted string in this block |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:368-376`.

## LinuxPolicy

**Service:** `web_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| DisablePassword | disablePassword | string |  |  |
| InstallCerts | installCerts | string |  |  |
| LogoutPassword | logoutPassword | string |  |  |
| UninstallPassword | uninstallPassword | string |  |  |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:378-383`.

## MacPolicy

**Service:** `web_policy`

The password / cert fields use snake_case wire keys (`disable_password`,
`install_ssl_certs`, `logout_password`, `uninstall_password`); `install_ssl_certs`
is a JSON number (`IntOrString`). `browserAuthType`, `useDefaultBrowser`, and
`captivePortalConfig` are required by the API for macOS creates.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AddIfscopeRoute | addIfscopeRoute | string |  |  |
| BrowserAuthType | browserAuthType | int |  | new |
| CacheSystemProxy | cacheSystemProxy | string |  |  |
| CaptivePortalConfig | captivePortalConfig | string |  | new |
| ClearArpCache | clearArpCache | string |  |  |
| DisablePassword | disable_password | string |  | snake_case wire key |
| DnsPriorityOrdering | dnsPriorityOrdering | string |  |  |
| DnsPriorityOrderingForTrustedDnsCrit | dnsPriorityOrderingForTrustedDnsCriteria | string |  |  |
| EnableAppBasedBypass | enableApplicationBasedBypass | string |  |  |
| EnableZscalerFirewall | enableZscalerFirewall | string |  |  |
| InstallSslCerts | install_ssl_certs | IntOrString |  | new; JSON number, snake_case key |
| LogoutPassword | logout_password | string |  | snake_case wire key |
| PersistentZscalerFirewall | persistentZscalerFirewall | string |  |  |
| UninstallPassword | uninstall_password | string |  | snake_case wire key |
| UseDefaultBrowser | useDefaultBrowser | int |  | new |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:397-413`.

## PolicyExtension

**Service:** `web_policy`

The nested `policyExtension` block. The API is inconsistent about wire types
(numbers for some flags, quoted strings for others); the struct matches it
field-by-field. `IntOrString`-typed fields marshal as a JSON number but accept a
number, numeric string, null, or empty string on read. The current source adds
several fields absent from the prior snapshot (marked "new"); the old doc's
`AdvanceZpaReauth`/`AdvanceZpaReauthTime` are still present.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| GenerateCliPasswordContract | generateCliPasswordContract | GenerateCliPasswordContract |  |  |
| VpnGateways | vpnGateways | string |  |  |
| PartnerDomains | partnerDomains | string |  |  |
| ZccFailCloseSettingsIpBypasses | zccFailCloseSettingsIpBypasses | string |  |  |
| ZccFailCloseSettingsLockdownOnTunnelProcessExit | zccFailCloseSettingsLockdownOnTunnelProcessExit | string |  |  |
| ZccFailCloseSettingsExitUninstallPassword | zccFailCloseSettingsExitUninstallPassword | string |  |  |
| ZccFailCloseSettingsAppByPassIds | zccFailCloseSettingsAppByPassIds | []int |  |  |
| ZccFailCloseSettingsAppByPassNames | zccFailCloseSettingsAppByPassNames | []string | ✓ |  |
| ZccFailCloseSettingsThumbPrint | zccFailCloseSettingsThumbPrint | string | ✓ |  |
| ZccFailCloseSettingsLockdownOnFirewallError | zccFailCloseSettingsLockdownOnFirewallError | string |  | new |
| ZccFailCloseSettingsLockdownOnDriverError | zccFailCloseSettingsLockdownOnDriverError | string |  | new |
| UserAllowedToAddPartner | userAllowedToAddPartner | string |  |  |
| FollowGlobalForPartnerLogin | followGlobalForPartnerLogin | string |  |  |
| FollowGlobalForZpaReauth | followGlobalForZpaReauth | string |  | new |
| FollowGlobalForPacketCapture | followGlobalForPacketCapture | string |  | new |
| EnableLocalPacketCapture | enableLocalPacketCapture | string |  | new |
| EnableLocalPacketCaptureV2 | enableLocalPacketCaptureV2 | int |  | new |
| EnableFlowBasedTunnel | enableFlowBasedTunnel | string |  | new |
| EnableZaisService | enableZaisService | int | ✓ | new; iOS-only ZAIS toggle |
| ZpaReauthConfig | zpaReauthConfig | any |  | new |
| ZpaAutoReauthTimeout | zpaAutoReauthTimeout | IntOrString |  | new |
| ZpaAuthExpOnSleep | zpaAuthExpOnSleep | IntOrString |  |  |
| ZpaAuthExpOnSysRestart | zpaAuthExpOnSysRestart | IntOrString |  |  |
| ZpaAuthExpOnNetIpChange | zpaAuthExpOnNetIpChange | IntOrString |  |  |
| InstantForceZPAReauthStateUpdate | instantForceZPAReauthStateUpdate | IntOrString |  | new |
| ZpaAuthExpOnWinLogonSession | zpaAuthExpOnWinLogonSession | IntOrString |  |  |
| ZpaAuthExpOnWinSessionLock | zpaAuthExpOnWinSessionLock | IntOrString |  |  |
| ZpaAuthExpSessionLockStateMinTime | zpaAuthExpSessionLockStateMinTimeInSecond | string |  |  |
| AdvanceZpaReauth | advanceZpaReauth | bool |  |  |
| AdvanceZpaReauthTime | advanceZpaReauthTime | int | ✓ |  |
| ExitPassword | exitPassword | string |  |  |
| FollowRoutingTable | followRoutingTable | string |  |  |
| UseDefaultAdapterForDNS | useDefaultAdapterForDNS | string |  |  |
| UpdateDnsSearchOrder | updateDnsSearchOrder | string |  |  |
| UseZscalerNotificationFramework | useZscalerNotificationFramework | string |  |  |
| SwitchFocusToNotification | switchFocusToNotification | string |  | new |
| FallbackToGatewayDomain | fallbackToGatewayDomain | string |  |  |
| UseProxyPortForT1 | useProxyPortForT1 | string |  |  |
| UseProxyPortForT2 | useProxyPortForT2 | string |  |  |
| AllowPacExclusionsOnly | allowPacExclusionsOnly | string |  | new |
| UseWsaPollForZpa | useWsaPollForZpa | string |  |  |
| EnableZCCRevert | enableZCCRevert | string |  |  |
| ZccRevertPassword | zccRevertPassword | string |  |  |
| EnableSetProxyOnVPNAdapters | enableSetProxyOnVPNAdapters | string |  |  |
| DisableDNSRouteExclusion | disableDNSRouteExclusion | IntOrString |  |  |
| PacketTunnelIncludeListForIPv6 | packetTunnelIncludeListForIPv6 | string |  |  |
| InterceptZIATrafficAllAdapters | interceptZIATrafficAllAdapters | IntOrString |  |  |
| EnableAntiTampering | enableAntiTampering | IntOrString |  |  |
| ReactivateAntiTamperingTime | reactivateAntiTamperingTime | int |  |  |
| SourcePortBasedBypasses | sourcePortBasedBypasses | string |  |  |
| EnforceSplitDNS | enforceSplitDNS | IntOrString |  |  |
| DropQuicTraffic | dropQuicTraffic | IntOrString |  |  |
| ZdpDisablePassword | zdpDisablePassword | string |  |  |
| UseV8JsEngine | useV8JsEngine | string |  |  |
| ZdDisablePassword | zdDisablePassword | string |  |  |
| ZdxDisablePassword | zdxDisablePassword | string |  |  |
| ZpaDisablePassword | zpaDisablePassword | string |  |  |
| BypassDNSTrafficUsingUDPProxy | bypassDNSTrafficUsingUDPProxy | string |  | new |
| ReconnectTunOnWakeup | reconnectTunOnWakeup | string |  | new |
| EnableCustomTheme | enableCustomTheme | int |  | new |
| DeleteDHCPOption121Routes | deleteDHCPOption121Routes | string |  |  |
| MachineIdpAuth | machineIdpAuth | bool |  |  |
| Nonce | nonce | string |  |  |
| PacketTunnelDnsExcludeList | packetTunnelDnsExcludeList | string |  |  |
| PacketTunnelDnsIncludeList | packetTunnelDnsIncludeList | string |  |  |
| PacketTunnelExcludeList | packetTunnelExcludeList | string |  |  |
| PacketTunnelExcludeListForIPv6 | packetTunnelExcludeListForIPv6 | string |  |  |
| PacketTunnelIncludeList | packetTunnelIncludeList | string |  |  |
| TruncateLargeUDPDNSResponse | truncateLargeUDPDNSResponse | IntOrString |  |  |
| OverrideATCmdByPolicy | overrideATCmdByPolicy | IntOrString |  |  |
| PurgeKerberosPreferredDCCache | purgeKerberosPreferredDCCache | IntOrString |  |  |
| RscModeOnAllAdapters | rscModeOnAllAdapters | IntOrString |  | new |
| EnableAdapterHardwareOffloading | enableAdapterHardwareOffloading | IntOrString |  | new |
| SupportZPASearchDomainsInTRP | supportZPASearchDomainsInTRP | IntOrString |  | new |
| PrioritizeDnsExclusions | prioritizeDnsExclusions | IntOrString |  |  |
| LocationRulesetPolicies | locationRulesetPolicies | LocationRulesetPolicies |  | new |
| DdilConfig | ddilConfig | string |  |  |
| ZccAppFailOpenPolicy | zccAppFailOpenPolicy | IntOrString |  |  |
| ZccTunnelFailPolicy | zccTunnelFailPolicy | IntOrString |  |  |
| AllowClientCertCachingForWebView2 | allowClientCertCachingForWebView2 | string |  | new |
| ShowConfirmationDialogForCachedCert | showConfirmationDialogForCachedCert | string |  | new |
| OneIdMTDeviceAuthEnabled | oneIdMTDeviceAuthEnabled | string |  | new |
| PreventAutoReauthDuringDeviceLock | preventAutoReauthDuringDeviceLock | string |  | new |
| ClientConnectorUiLanguage | clientConnectorUiLanguage | IntOrString |  | new |
| EnableNetworkTrafficProcessMapping | enableNetworkTrafficProcessMapping | IntOrString |  | new |
| UseEndPointLocationForDCSelection | useEndPointLocationForDCSelection | string |  | new |
| RecacheSystemProxy | recacheSystemProxy | string |  | new |
| EnableLocationPolicyOverride | enableLocationPolicyOverride | IntOrString |  | new |
| BlockPrivateRelay | blockPrivateRelay | string |  | new |
| EnableAutomaticPacketCapture | enableAutomaticPacketCapture | string |  | new |
| EnableAPCforCriticalSections | enableAPCforCriticalSections | string |  | new |
| EnableAPCforOtherSections | enableAPCforOtherSections | string |  | new |
| EnablePCAdditionalSpace | enablePCAdditionalSpace | string |  | new |
| PcAdditionalSpace | pcAdditionalSpace | string |  | new |
| EnableCustomProxyDetection | enableCustomProxyDetection | string |  | new |
| EnableCrashReporting | enableCrashReporting | string |  | new |
| EnableZdpService | enableZdpService | IntOrString |  |  |
| CustomDNS | customDNS | string | ✓ |  |
| ZdxLiteConfigObj | zdxLiteConfigObj | string |  |  |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:512-631`.

## WebPolicy

**Service:** `web_policy`

The full WebPolicy carries ~174 top-level JSON fields (verified
`awk '/^type WebPolicy struct/,/^}/' web_policy.go | grep -c json:` = 174). After
the v2 MA / Secure-Browsing refactor (#434/#435), most per-platform knobs appear
at the WebPolicy root in addition to their per-OS block. Go field names suffixed
`Top` live at this top level; the unsuffixed counterpart lives inside
PolicyExtension or a per-OS block. The wire keys (the JSON tag column) are the
same camelCase names that appear in those nested blocks. `device_type` is a JSON
number (1=iOS, 2=Android, 3=Windows, 4=macOS, 5=Linux). `IntOrString` fields
marshal as a JSON number but read back as number-or-string. The table follows
the source's own grouping.

**Core identity / lifecycle**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string | ✓ |  |
| Name | name | string |  |  |
| Description | description | string |  |  |
| Active | active | string |  |  |
| DeviceType | device_type | int |  | JSON number on the wire |
| RuleOrder | ruleOrder | IntOrString |  |  |
| AllowUnreachablePac | allowUnreachablePac | bool | ✓ |  |

**Targeting (groups / users / device groups / app services)**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Groups | groups | []any |  | new collection |
| Users | users | []any |  | new collection |
| GroupAll | groupAll | IntOrString |  |  |
| GroupIds | groupIds | []int | ✓ |  |
| GroupNames | groupNames | []string | ✓ |  |
| UserIds | userIds | []int | ✓ |  |
| UserNames | userNames | []string | ✓ |  |
| AppIdentityNames | appIdentityNames | []string | ✓ |  |
| AppServiceIds | appServiceIds | []int |  |  |
| AppServiceNames | appServiceNames | []string | ✓ |  |
| AppServiceCustomIdsSelected | appServiceCustomIdsSelected | []any |  | new |
| BypassAppIds | bypassAppIds | []int |  |  |
| BypassCustomAppIds | bypassCustomAppIds | []int |  |  |
| BypassMacAppIds | bypassMacAppIds | []any |  | new |
| DeviceGroupIds | deviceGroupIds | []int | ✓ |  |
| DeviceGroupNames | deviceGroupNames | []string | ✓ |  |
| DeviceGroups | deviceGroups | []any |  | new collection |
| DeviceGroupsOption | deviceGroupsOption | int |  | new |
| DeviceGroupsSelected | deviceGroupsSelected | []any |  | new |
| UsersOption | usersOption | int |  | new |
| UsersSelected | usersSelected | []any |  | new |
| ZccFailCloseSettingsAppByPassIdsTop | zccFailCloseSettingsAppByPassIds | []int |  | new (Top mirror) |
| ZccFailCloseSettingsAppByPassSelected | zccFailCloseSettingsAppByPassSelected | []any |  | new |

**Forwarding / posture profiles**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ForwardingProfileId | forwardingProfileId | int |  |  |
| ZiaPostureProfile | ziaPostureProfile | []any |  | new |
| ZiaPostureConfigId | ziaPostureConfigId | int | ✓ |  |

**Logging / log mode picker**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| LogMode | logMode | IntOrString |  |  |
| LogLevel | logLevel | IntOrString |  |  |
| LogFileSize | logFileSize | IntOrString |  |  |
| LogModeSelected | logModeSelected | *LabelValuePair | ✓ | new |

**Captive portal + diagnostics**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| EnableCaptivePortalDetection | enableCaptivePortalDetection | int |  | new |
| EnableFailOpen | enableFailOpen | int |  | new |
| CaptivePortalWebSecDisableMinutes | captivePortalWebSecDisableMinutes | int |  | new |
| CaptivePortalUrlId | captivePortalUrlId | []LabelValuePair |  | new |
| EndToEndDiagnostics | endToEndDiagnostics | EndToEndDiagnostics |  | new |
| EndToEndDiagnosticsSelected | endToEndDiagnosticsSelected | []any |  | new |
| LocalMetrics | localMetrics | int |  | new |
| FlowLoggingSelected | flowLoggingSelected | []any |  | new |
| BlockDomainSelected | blockDomainSelected | []any |  | new |
| BlockInboundTrafficSelected | blockInboundTrafficSelected | []any |  | new |
| NotificationTemplateSelected | notificationTemplateSelected | []any |  | new |

**PAC config**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| PacURL | pac_url | string |  |  |
| PacType | pacType | int |  | new |
| PacDataPath | pacDataPath | string |  | new |

**MDM / billing / mobile**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Mdm | mdm | int |  | new |
| Passcode | passcode | string |  | new |
| ExitPassword | exit_password | string |  | new |
| Limit | limit | string |  | new |
| BillingDay | billing_day | string |  | new |
| AllowedApps | allowed_apps | string |  | new |
| CustomText | custom_text | string |  | new |
| BypassMmsApps | bypass_mms_apps | int |  | new |
| QuotaInRoaming | quota_in_roaming | int |  | new |
| WifiSSID | wifi_ssid | string |  | new |
| BypassAndroidApps | bypass_android_apps | []int |  | new |
| Enforced | enforced | int |  | new |

**Registry / Windows-ish defaults (echoed even on macOS bodies)**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| RegistryPath | registryPath | string |  | new |
| RegistryName | registryName | string |  | new |
| InstallSslCertsTop | install_ssl_certs | IntOrString |  | new (Top mirror) |
| DisableLoopBackRestriction | disableLoopBackRestriction | int |  | new |
| RemoveExemptedContainers | removeExemptedContainers | int |  | new |
| OverrideWPAD | overrideWPAD | int |  | new |
| RestartWinHttpSvc | restartWinHttpSvc | int |  | new |
| InstallWindowsFirewallInboundRule | installWindowsFirewallInboundRule | string |  | new |
| ForceLocationRefreshSccm | forceLocationRefreshSccm | int |  | new |
| WfpMtr | wfpMtr | int |  | new |
| EnableLocalPacketCaptureTabValue | enableLocalPacketCaptureTabValue | int |  | new |
| RefreshKerberosToken | refreshKerberosToken | int |  | new |

**Nullable nested configs the UI sends (defaults are JSON null)**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| FlowLoggerConfig | flowLoggerConfig | any |  | new |
| DomainProfileDetectionConfig | domainProfileDetectionConfig | any |  | new |
| AllInboundTrafficConfig | allInboundTrafficConfig | any |  | new |

**Cosmetic / runtime knobs at the top level**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| HighlightActiveControl | highlightActiveControl | IntOrString |  |  |
| SendDisableServiceReason | sendDisableServiceReason | IntOrString |  |  |
| TunnelZappTraffic | tunnelZappTraffic | IntOrString |  |  |
| EnableDeviceGroups | enableDeviceGroups | IntOrString |  |  |
| ReactivateWebSecurityMins | reactivateWebSecurityMinutes | IntOrString |  |  |
| ReauthPeriod | reauth_period | IntOrString |  |  |
| ClearArpCacheTop | clearArpCache | int |  | new (Top mirror) |
| EnableZscalerFirewallTop | enableZscalerFirewall | string |  | new (Top mirror) |
| PersistentZscalerFirewallTop | persistentZscalerFirewall | int |  | new (Top mirror) |
| CacheSystemProxyTop | cacheSystemProxy | int |  | new (Top mirror) |
| DnsPriorityOrderingTop | dnsPriorityOrdering | []string |  | new (Top mirror) |
| EnableZdpServiceTop | enableZdpService | int |  | new (Top mirror) |
| DisableParallelIpv4AndIPv6 | disableParallelIpv4AndIPv6 | int |  | new |
| DisableParallelIpv4andIpv6 | disableParallelIpv4andIpv6 | string |  | new |

**Top-level "selected" pickers (UI form-state mirrors)**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| RuleOrderSelectedOption | ruleOrderSelectedOption | *LabelValuePair | ✓ | new |
| BillingDaySelectedOption | billingDaySelectedOption | *LabelValuePair | ✓ | new |
| Ipv6ModeSelected | ipv6ModeSelected | *LabelValuePair | ✓ | new |
| ZpaAutoReauthTimeoutTop | zpaAutoReauthTimeout | []LabelValuePair |  | new |
| PcAdditionalSpaceTop | pcAdditionalSpace | []LabelValuePair |  | new |
| BrowserAuthTypeTop | browserAuthType | *LabelValuePair | ✓ | new |
| ClientConnectorUiLanguageSelected | clientConnectorUiLanguageSelected | []LabelValuePair |  | new |

**Machine token / ZPA reauth scheduling (top-level)**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| MachineTokenOption | machineTokenOption | int |  | new |
| MachineTokenSelectedOption | machineTokenSelectedOption | int |  | new |
| ZpaAuthExpSessionLockStateMinTimeInSecondTop | zpaAuthExpSessionLockStateMinTimeInSecond | string |  | new (Top mirror) |
| ForceZpaAuthenticationToExpire | forceZpaAuthenticationToExpire | []any |  | new |
| ZpaReauthConfigTop | zpaReauthConfig | []any |  | new (Top mirror) |
| ZiaDRMethodTop | ziaDRMethod | *LabelValuePair | ✓ | new (DR form-state mirror) |

**Top-level CLI / disable-without-password trio**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AllowZpaDisableWithoutPasswordTop | allowZpaDisableWithoutPassword | bool |  | new (Top mirror) |
| AllowZiaDisableWithoutPasswordTop | allowZiaDisableWithoutPassword | bool |  | new (Top mirror) |
| AllowZdxDisableWithoutPasswordTop | allowZdxDisableWithoutPassword | bool |  | new (Top mirror) |

**Top-level DNS / split-tunnel flags (duplicate PolicyExtension entries, different types)**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| UseDefaultAdapterForDNSTop | useDefaultAdapterForDNS | string |  | new (Top mirror) |
| UpdateDnsSearchOrderTop | updateDnsSearchOrder | string |  | new (Top mirror) |
| EnforceSplitDNSTop | enforceSplitDNS | string |  | new (Top mirror) |
| DisableDNSRouteExclusionTop | disableDNSRouteExclusion | string |  | new (Top mirror) |
| EnableSetProxyOnVPNAdaptersTop | enableSetProxyOnVPNAdapters | int |  | new (Top mirror) |
| DropQuicTrafficTop | dropQuicTraffic | string |  | new (Top mirror) |
| FollowRoutingTableTop | followRoutingTable | string |  | new (Top mirror) |

**Top-level partner / fail-close / packet capture / packet tunnel mirrors**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| VpnGatewaysTop | vpnGateways | []any |  | new (Top mirror) |
| PartnerDomainsTop | partnerDomains | []any |  | new (Top mirror) |
| ZccFailCloseSettingsIpBypassesTop | zccFailCloseSettingsIpBypasses | []any |  | new (Top mirror) |
| ZccFailCloseSettingsLockdownOnTunnelProcessExitTop | zccFailCloseSettingsLockdownOnTunnelProcessExit | int |  | new (Top mirror) |
| ZccFailCloseSettingsExitUninstallPasswordTop | zccFailCloseSettingsExitUninstallPassword | string |  | new (Top mirror) |
| UserAllowedToAddPartnerTop | userAllowedToAddPartner | int |  | new (Top mirror) |
| FollowGlobalForPartnerLoginTop | followGlobalForPartnerLogin | string |  | new (Top mirror) |
| FollowGlobalForZpaReauthTop | followGlobalForZpaReauth | string |  | new (Top mirror) |
| FollowGlobalForPacketCaptureTop | followGlobalForPacketCapture | string |  | new (Top mirror) |
| EnableLocalPacketCaptureTop | enableLocalPacketCapture | string |  | new (Top mirror) |
| EnableLocalPacketCaptureV2Top | enableLocalPacketCaptureV2 | []any |  | new (Top mirror) |
| PacketTunnelIncludeListTop | packetTunnelIncludeList | []string |  | new (Top mirror) |
| PacketTunnelExcludeListTop | packetTunnelExcludeList | []string |  | new (Top mirror) |
| PacketTunnelIncludeListForIPv6Top | packetTunnelIncludeListForIPv6 | []string |  | new (Top mirror) |
| PacketTunnelExcludeListForIPv6Top | packetTunnelExcludeListForIPv6 | []string |  | new (Top mirror) |
| PacketTunnelDnsIncludeListTop | packetTunnelDnsIncludeList | []string |  | new (Top mirror) |
| PacketTunnelDnsExcludeListTop | packetTunnelDnsExcludeList | []string |  | new (Top mirror) |
| SourcePortBasedBypassesTop | sourcePortBasedBypasses | []string |  | new (Top mirror) |
| UseV8JsEngineTop | useV8JsEngine | string |  | new (Top mirror) |
| PrioritizeDnsExclusionsTop | prioritizeDnsExclusions | string |  | new (Top mirror) |

**Trusted-network buckets the UI mirrors at the top level**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| VpnTrusted | vpnTrusted | []any |  | new |
| SplitVpnTrusted | splitVpnTrusted | []any |  | new |
| Trusted | trusted | []any |  | new |
| OffTrusted | offTrusted | []any |  | new |
| CustomDNSTop | customDNS | []any |  | new (Top mirror) |

**Top-level revert / proxy detection / language / crash reporting**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| EnableZCCRevertTop | enableZCCRevert | bool |  | new (Top mirror) |
| EnableCustomProxyDetectionTop | enableCustomProxyDetection | string |  | new (Top mirror) |
| ClientConnectorUiLanguageTop | clientConnectorUiLanguage | int |  | new (Top mirror) |
| OneIdMTDeviceAuthEnabledTop | oneIdMTDeviceAuthEnabled | string |  | new (Top mirror) |
| PreventAutoReauthDuringDeviceLockTop | preventAutoReauthDuringDeviceLock | string |  | new (Top mirror) |
| InstantForceZPAReauthStateUpdateTop | instantForceZPAReauthStateUpdate | int |  | new (Top mirror) |
| EnableNetworkTrafficProcessMappingTop | enableNetworkTrafficProcessMapping | int |  | new (Top mirror) |
| UseEndPointLocationForDCSelectionTop | useEndPointLocationForDCSelection | string |  | new (Top mirror) |
| RecacheSystemProxyTop | recacheSystemProxy | string |  | new (Top mirror) |
| EnableLocationPolicyOverrideTop | enableLocationPolicyOverride | int |  | new (Top mirror) |
| BlockPrivateRelayTop | blockPrivateRelay | string |  | new (Top mirror) |
| EnableCrashReportingTop | enableCrashReporting | string |  | new (Top mirror) |
| EnableAutomaticPacketCaptureTop | enableAutomaticPacketCapture | string |  | new (Top mirror) |
| EnableAPCforCriticalSectionsTop | enableAPCforCriticalSections | string |  | new (Top mirror) |
| EnableAPCforOtherSectionsTop | enableAPCforOtherSections | string |  | new (Top mirror) |
| EnablePCAdditionalSpaceTop | enablePCAdditionalSpace | string |  | new (Top mirror) |
| ReactivateAntiTamperingTimeTop | reactivateAntiTamperingTime | int |  | new (Top mirror) |
| UseDefaultBrowserTop | useDefaultBrowser | int |  | new (Top mirror) |

**iOS-specific top-level fields (all `omitempty`)**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Ipv6ModeTop | ipv6Mode | int | ✓ | new |
| ShowVPNTunNotificationTop | showVPNTunNotification | string | ✓ | new |
| UseTunnelSDK43Top | useTunnelSDK4_3 | int | ✓ | new; JSON number at root vs. quoted string in iosPolicy |
| NotificationTemplateContract | notificationTemplateContract | *NotificationTemplateContract | ✓ | new |
| NotificationTemplateId | notificationTemplateId | int | ✓ | new; links to v2 notification-templates |
| MachineTokenSelected | machineTokenSelected | string | ✓ | new |
| DeviceTypeAlt | deviceType | int | ✓ | new; int field sharing the `deviceType` JSON key, distinct from `device_type`; not the unmodelled string companion (`"DEVICE_TYPE_MAC"`) the API returns on reads |
| UseZscalerNotificationFrameworkTop | useZscalerNotificationFramework | string | ✓ | new (Top mirror) |
| SwitchFocusToNotificationTop | switchFocusToNotification | string | ✓ | new (Top mirror) |

**Per-OS embedded policy blocks (only one is non-nil at a time) + nested blocks**

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| AndroidPolicy | androidPolicy | *AndroidPolicy | ✓ |  |
| IosPolicy | iosPolicy | *IosPolicy | ✓ |  |
| LinuxPolicy | linuxPolicy | *LinuxPolicy | ✓ |  |
| MacPolicy | macPolicy | *MacPolicy | ✓ |  |
| WindowsPolicy | windowsPolicy | *WindowsPolicy | ✓ |  |
| PolicyExtension | policyExtension | PolicyExtension |  |  |
| DisasterRecovery | disasterRecovery | DisasterRecovery |  |  |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:91-337`.

## WebPolicyActivation

**Service:** `web_policy`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| DeviceType | deviceType | int |  |  |
| PolicyId | policyId | int |  |  |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:646-649`.

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

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:456-476`.

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

## v2 services (offset-paginated)

Three ZCC services were added on the v2 API surface by #434/#435. They differ
from the v1 services above in their pagination model: where v1 list endpoints
return a bare JSON array and page via `page`/`pageSize`, the v2 endpoints wrap
records in a `PaginatedResponseV2` envelope and page via offset
(`skip`/`perPage`). All three are full CRUD (Get / GetByName / Create / Update /
PartialUpdate / Delete / GetAll), with `GetByName` doing a server-side keyword
narrow followed by a client-side exact match.

| Service | Endpoint | Per-endpoint filters |
|---|---|---|
| notification_template | `/zcc/papi/public/v2/notification-templates` | keyword |
| zia_posture | `/zcc/papi/public/v2/zia-posture-profiles` | keyword, platformType |
| trusted_network_v2 | `/zcc/papi/public/v2/trusted-networks` | keyword, type |

Source: endpoint constants in
`vendor/zscaler-sdk-go/zscaler/zcc/services/notification_template/notification_template.go:15`,
`vendor/zscaler-sdk-go/zscaler/zcc/services/zia_posture/zia_posture.go:15`,
`vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network_v2/trusted_network_v2.go:15`.

### QueryParamsV2 (shared v2 list query)

| Field | URL key | Type | Notes |
|---|---|---|---|
| Skip | skip | int | offset; zero-based start of page |
| PerPage | perPage | int | page size; clamped to [50, 5000] |
| Keyword | keyword | string | substring filter (replaces v1 `search`) |
| Type | type | string | `/trusted-networks` only |
| PlatformType | platformType | int | `/zia-posture-profiles` only (0=all; 1=iOS, 2=Android, 3=Windows, 4=macOS, 5=Linux) |

The `PaginatedResponseV2` envelope every v2 list returns: `items` ([]T), `total`
(int), `offset` (int), `limit` (int), `count` (int).

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/common/common.go:167-176` (QueryParamsV2), `:268-274` (PaginatedResponseV2), `:81-92` (DefaultPageSize=50, MaxPageSize=5000, DeviceType* constants).

### NotificationTemplate

**Service:** `notification_template`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| IsDefaultTemplate | isDefaultTemplate | bool |  |  |
| EnableClient | enableClient | bool |  |  |
| EnableZia | enableZia | bool |  |  |
| EnableAppUpdates | enableAppUpdates | bool |  |  |
| EnableServiceStatus | enableServiceStatus | bool |  |  |
| DurationInSeconds | durationInSeconds | int | ✓ |  |
| EnablePersistent | enablePersistent | bool |  |  |
| EnableDoNotDisturb | enableDoNotDisturb | bool |  |  |
| CreatedBy | createdBy | int | ✓ |  |
| EditedBy | editedBy | int | ✓ |  |
| ZIANotificationTemplate | ziaNotificationTemplate | ZIANotificationTemplate |  |  |
| ZPANotificationTemplate | zpaNotificationTemplate | ZPANotificationTemplate |  |  |

This v2 template shape is distinct from the `NotificationTemplateContract` block
embedded inside a WebPolicy (above), which uses quoted-string flags and a
different field set.

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/notification_template/notification_template.go:26-41`.

#### ZIANotificationTemplate

**Service:** `notification_template`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| EnableZiaFirewall | enableZiaFirewall | bool |  |  |
| EnableZiaFirewallPopup | enableZiaFirewallPopup | bool |  |  |
| EnableZiaDNS | enableZiaDNS | bool |  |  |
| EnableZiaDNSPopup | enableZiaDNSPopup | bool |  |  |
| EnableZiaIPS | enableZiaIPS | bool |  |  |
| EnableZiaIPSPopup | enableZiaIPSPopup | bool |  |  |
| EnableZiaPersistent | enableZiaPersistent | bool |  |  |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/notification_template/notification_template.go:43-51`.

#### ZPANotificationTemplate

**Service:** `notification_template`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| EnableDevicePostureFailure | enableDevicePostureFailure | bool |  |  |
| EnableZpaReauth | enableZpaReauth | bool |  |  |
| ZpaReauthIntervalInMinutes | zpaReauthIntervalInMinutes | int | ✓ |  |
| DelayPostureFailureSeconds | delayPostureFailureSeconds | int |  |  |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/notification_template/notification_template.go:53-58`.

### ZIAPosture

**Service:** `zia_posture`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| Name | name | string | ✓ |  |
| Platform | platform | int | ✓ |  |
| HighTrustCriteria | highTrustCriteria | HighTrustCriteria | ✓ |  |
| MediumTrustCriteria | mediumTrustCriteria | MediumTrustCriteria | ✓ |  |
| LowTrustCriteria | lowTrustCriteria | LowTrustCriteria | ✓ |  |

The three trust-level criteria each wrap a `cs` array of `TrustCriteriaSet`, and
each set wraps a `cn` array of `TrustCriterion`:

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Cs | cs | []TrustCriteriaSet | ✓ | HighTrustCriteria / MediumTrustCriteria / LowTrustCriteria |
| Cn | cn | []TrustCriterion | ✓ | TrustCriteriaSet |
| ID | id | string | ✓ | TrustCriterion |
| Name | name | string | ✓ | TrustCriterion |
| UDID | udid | string | ✓ | TrustCriterion |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/zia_posture/zia_posture.go:30-59`.

### TrustedNetworkV2

**Service:** `trusted_network_v2`

Distinct from the v1 `TrustedNetwork` (above): IDs are `int` not `string`,
`conditionType` is a string, and the IP/domain lists are `[]string` rather than
the v1 comma-delimited strings. The `type` filter on the list endpoint accepts
one of: `NAME`, `DNS_SERVERS`, `DNS_SEARCH_DOMAINS`, `HOST_NAME_IP`,
`TRUSTED_SUBNETS`, `TRUSTED_GATEWAYS`, `TRUSTED_DHCP_SERVERS`,
`TRUSTED_EGRESS_IPS`, `SSID`.

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int | ✓ |  |
| CompanyID | companyId | int | ✓ |  |
| ZPAID | zpaId | string | ✓ |  |
| Active | active | bool | ✓ |  |
| ConditionType | conditionType | string | ✓ |  |
| Name | name | string | ✓ |  |
| CreatedBy | createdBy | string | ✓ |  |
| DNSSearchDomains | dnsSearchDomains | []string | ✓ |  |
| DNSServerIPs | dnsServerIps | []string | ✓ |  |
| EditedBy | editedBy | string | ✓ |  |
| Guid | guid | string | ✓ |  |
| Hostname | hostname | string | ✓ |  |
| NetworkName | networkName | string | ✓ |  |
| ResolvedIPsForHostname | resolvedIpsForHostname | []string | ✓ |  |
| SSID | ssid | string | ✓ |  |
| TrustedDhcpServersIPs | trustedDhcpServersIps | []string | ✓ |  |
| TrustedEgressIPs | trustedEgressIps | []string | ✓ |  |
| TrustedGatewayIPs | trustedGatewayIps | []string | ✓ |  |
| TrustedSubnetIPs | trustedSubnetIps | []string | ✓ |  |

Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network_v2/trusted_network_v2.go:20-64`.

## Open questions

- Whether the ZCC API treats a WebPolicy's `*Top` root-level field and its
  nested-block counterpart as authoritative-when-both-present, or whether one
  silently wins on write, is not knowable from the SDK struct alone (the SDK
  faithfully sends both). The DefaultMacosWebPolicy constructor's comment says it
  seeds both from a "known-working UI-generated request body" but does not state
  precedence. See [clarification `zcc-77`](../_meta/clarifications.md#zcc-77-webpolicy-top-vs-nested-block-precedence-on-write).
- `DeviceTypeAlt` (`json:"deviceType"`, **int**) coexists with `DeviceType`
  (`json:"device_type"`, int) on WebPolicy — two distinct modelled int fields. Separately,
  the SDK comment notes the API returns an **unmodelled `deviceType` string** (e.g.
  `"DEVICE_TYPE_MAC"`) on reads; `DeviceTypeAlt` is not that string companion. Which int
  field a write honours when both are set is not documented in source. See [clarification `zcc-78`](../_meta/clarifications.md#zcc-78-webpolicy-devicetype-vs-device_type-write-precedence).
- The full `WebPolicy` field set is modeled from UI request-body captures
  (`payload-ios.json`, etc.) referenced in the SDK comments; whether every
  `*Selected` / `*SelectedOption` form-state field is required on write vs.
  merely echoed on read is not determinable from the struct tags (they carry no
  `omitempty` either way except where noted). See [clarification `zcc-79`](../_meta/clarifications.md#zcc-79-webpolicy-selected-form-state-fields-required-on-write).

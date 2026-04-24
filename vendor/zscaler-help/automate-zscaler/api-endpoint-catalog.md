# API Endpoint Catalog | Zscaler OneAPI (automate.zscaler.com)

**Source:** https://automate.zscaler.com/sitemap.xml
**Captured:** 2026-04-24 via WebFetch.

---

All endpoint pages follow the URL pattern:
`https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/{product}/{category}/{endpoint-slug}`

The REST base URL for all API calls is `https://api.zsapi.net/{product-path}/{endpoint}`

---

## Business Insights (BI) API
Base URL: `https://api.zsapi.net/bi/api/v1`

### Custom Applications
- GET /bi/api/v1/customApps — get-custom-apps
- POST /bi/api/v1/customApps — create-custom-app
- PUT /bi/api/v1/customApps/{id} — update-custom-app
- DELETE /bi/api/v1/customApps/{id} — delete-custom-app

### Report Configurations
- GET /bi/api/v1/reportConfigurations — get-report-configurations-custom-apps
- POST /bi/api/v1/reportConfigurations — create-report-configuration-custom-apps
- PUT /bi/api/v1/reportConfigurations/{id} — update-report-configuration-custom-apps
- DELETE /bi/api/v1/reportConfigurations/{id} — delete-report-configuration-custom-apps

### Reports
- GET /bi/api/v1/report/all — get-all-reports
- GET /bi/api/v1/report/download — download-report

---

## Zscaler Client Connector (ZCC) API
Base URL: `https://api.zsapi.net/zcc/papi/public/v1`

### Credential Controller
- GET /zcc/papi/public/v1/credentials — gets-the-list-of-api-credentials
- POST /zcc/papi/public/v1/credentials — saves-api-credentials-for-the-company
- PUT /zcc/papi/public/v1/credentials — updates-api-credentials-for-the-company
- DELETE /zcc/papi/public/v1/credentials — deletes-api-credentials-for-the-company

### Login Controller
- POST /zcc/papi/public/v1/auth/token — authenticates-and-obtains-a-json-web-token-jwt

### Public API Controller
**Device & Enrollment Management**
- GET /zcc/papi/public/v1/devices — lists-all-enrolled-devices-of-your-organization-and-their-basic-details
- GET /zcc/papi/public/v1/devices/details — lists-device-details-of-enrolled-devices-of-your-organization
- DELETE /zcc/papi/public/v1/devices — force-removes-enrolled-devices
- DELETE /zcc/papi/public/v1/devices/soft — soft-removes-enrolled-devices
- DELETE /zcc/papi/public/v1/devices/machineTunnel — removes-machine-tunnel-devices

**Policy & Profile Management**
- POST/PUT /zcc/papi/public/v1/policy — adds-or-updates-a-policy-or-app-profile-for-the-company-by-platform
- DELETE /zcc/papi/public/v1/policy — deletes-a-policy-or-app-profile-for-the-company-by-platform
- PATCH /zcc/papi/public/v1/policy/toggle — enables-or-disables-a-policy-or-app-profile-for-the-company-by-platform
- GET /zcc/papi/public/v1/policy — gets-the-list-of-policies-by-company
- GET /zcc/papi/public/v1/appProfiles — retrieves-the-list-of-application-profile-policies
- GET /zcc/papi/public/v1/appProfiles/policies — retrieves-the-list-of-policies-for-application-profiles

**Trusted Networks & Forwarding Profiles**
- POST /zcc/papi/public/v1/trustedNetworks — adds-a-new-trusted-network
- DELETE /zcc/papi/public/v1/trustedNetworks — deletes-a-trusted-network
- GET /zcc/papi/public/v1/trustedNetworks — gets-the-list-of-trusted-networks-by-company
- PUT /zcc/papi/public/v1/trustedNetworks — updates-a-trusted-network
- DELETE /zcc/papi/public/v1/forwardingProfiles — deletes-a-forwarding-profile
- GET /zcc/papi/public/v1/forwardingProfiles — gets-the-list-of-forwarding-profiles-by-company
- PUT /zcc/papi/public/v1/forwardingProfiles — updates-a-forwarding-profile

**Device Configuration & Cleanup**
- POST/PUT /zcc/papi/public/v1/deviceCleanup — adds-or-updates-the-configuration-for-device-cleanup
- GET /zcc/papi/public/v1/deviceCleanup — gets-the-configuration-for-device-cleanup
- POST/PUT /zcc/papi/public/v1/piiConfig — adds-or-updates-the-configuration-information-for-end-user-and-device-related-pii
- GET /zcc/papi/public/v1/piiConfig — gets-the-configuration-information-for-end-user-and-device-related-pii

**Admin & User Management**
- GET /zcc/papi/public/v1/admins — gets-the-list-of-admin-users-in-your-organization
- GET /zcc/papi/public/v1/adminRoles — list-of-admin-roles-in-your-organization
- PUT /zcc/papi/public/v1/admins — updates-a-specific-admin-user
- POST /zcc/papi/public/v1/sync/admins — synchronizes-the-local-copy-of-admin-users
- POST /zcc/papi/public/v1/sync/ziaZdxAdmins — synchronizes-the-local-copy-of-all-the-zia-and-zdx-admin-users
- POST /zcc/papi/public/v1/sync/zpaAdmins — synchronizes-the-local-copy-of-the-zpa-admin-users

**Applications & IP-Based Resources**
- GET /zcc/papi/public/v1/bypassApps — gets-the-list-of-applications-to-bypass-zscaler
- GET /zcc/papi/public/v1/ipApps/{id} — retrieves-the-custom-ip-based-application-using-app-id
- GET /zcc/papi/public/v1/ipApps — retrieves-the-list-of-custom-ip-based-applications
- GET /zcc/papi/public/v1/predefinedIpApps — retrieves-the-list-of-predefined-ip-based-applications
- GET /zcc/papi/public/v1/predefinedIpApps/{id} — retrieves-the-predefined-ip-based-application-using-application-id
- GET /zcc/papi/public/v1/processApps — retrieves-the-list-of-process-based-applications
- GET /zcc/papi/public/v1/processApps/{id} — retrieves-the-process-based-application-using-app-id

**Credentials, OTP & Fail-Open Policies**
- GET /zcc/papi/public/v1/getAppProfilePassword — gets-the-app-profile-password-for-a-specific-device
- GET /zcc/papi/public/v1/getOtp — gets-the-one-time-password-otp-for-a-specific-device
- GET /zcc/papi/public/v1/failOpenPolicies — gets-the-list-of-fail-open-policies-for-the-company
- PUT /zcc/papi/public/v1/failOpenPolicies — updates-a-specific-fail-open-policy-for-the-company
- PUT /zcc/papi/public/v1/profilePolicyPasswords — updates-profile-policy-rule-passwords

**Entitlements**
- GET /zcc/papi/public/v1/entitlements/zdx — gets-the-list-of-zdx-entitlements-for-user-groups
- GET /zcc/papi/public/v1/entitlements/zpa — gets-the-list-of-zpa-entitlements-for-user-groups
- PUT /zcc/papi/public/v1/entitlements/zdx — updates-zdx-entitlement-for-user-groups
- PUT /zcc/papi/public/v1/entitlements/zpa — updates-zpa-entitlement-for-user-groups

**Reporting**
- GET /zcc/papi/public/v1/downloadDevices — downloads-or-exports-device-information-as-a-csv-file
- GET /zcc/papi/public/v1/downloadDisableReasons — downloads-or-exports-a-report-as-a-csv-file-showing-the-disable-reasons-of-a-device
- GET /zcc/papi/public/v1/downloadServiceStatus — downloads-service-status-of-all-devices-as-a-csv-file

**Organization**
- GET /zcc/papi/public/v1/orgInfo — gets-information-about-your-organization

---

## Zscaler Digital Experience (ZDX) API
Base URL: `https://api.zsapi.net/zdx/v1`

### Administration
- GET /zdx/v1/administration/departments
- GET /zdx/v1/administration/locations

### Alerts
- GET /zdx/v1/alerts/{alertId}
- GET /zdx/v1/alerts/{alertId}/affectedDevices
- GET /zdx/v1/alerts/historical
- GET /zdx/v1/alerts/ongoing

### API Authentication
- GET /zdx/v1/oauth/jwks
- GET /zdx/v1/oauth/validate
- POST /zdx/v1/oauth/token

### Inventory
- GET /zdx/v1/inventory/software
- GET /zdx/v1/inventory/softwares/{softwareKey}

### Reports
- GET /zdx/v1/activeGeo
- GET /zdx/v1/apps
- GET /zdx/v1/apps/{appId}
- GET /zdx/v1/apps/{appId}/metrics
- GET /zdx/v1/apps/{appId}/score
- GET /zdx/v1/apps/{appId}/users
- GET /zdx/v1/apps/{appId}/users/{userId}
- GET /zdx/v1/devices
- GET /zdx/v1/devices/{deviceId}
- GET /zdx/v1/devices/{deviceId}/apps
- GET /zdx/v1/devices/{deviceId}/apps/{appId}
- GET /zdx/v1/devices/{deviceId}/apps/{appId}/callQualityMetrics
- GET /zdx/v1/devices/{deviceId}/apps/{appId}/cloudpathProbes
- GET /zdx/v1/devices/{deviceId}/apps/{appId}/cloudpathProbes/{probeId}
- GET /zdx/v1/devices/{deviceId}/apps/{appId}/cloudpathProbes/{probeId}/cloudpath
- GET /zdx/v1/devices/{deviceId}/apps/{appId}/webProbes
- GET /zdx/v1/devices/{deviceId}/apps/{appId}/webProbes/{probeId}
- GET /zdx/v1/devices/{deviceId}/events
- GET /zdx/v1/devices/{deviceId}/healthMetrics
- GET /zdx/v1/users
- GET /zdx/v1/users/{userId}

### Troubleshooting
- DELETE /zdx/v1/analysis/{analysisId}
- DELETE /zdx/v1/devices/{deviceId}/deeptraces/{traceId}
- GET /zdx/v1/analysis/{analysisId}
- GET /zdx/v1/devices/{deviceId}/deeptraces
- GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}
- GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}/cloudpath
- GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}/cloudpathMetrics
- GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}/events
- GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}/healthMetrics
- GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}/topProcesses
- GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}/webprobeMetrics
- POST /zdx/v1/analysis
- POST /zdx/v1/devices/{deviceId}/deeptraces

### Snapshots
- POST /zdx/v1/snapshots/alerts

---

## Zscaler Internet Access (ZIA) API
Base URL: `https://api.zsapi.net/zia/api/v1`

### Activation
- POST /zia/api/v1/status/activate
- GET /zia/api/v1/status
- GET /zia/api/v1/eusaStatus
- PUT /zia/api/v1/eusaStatus

### Admin Audit Logs
- POST /zia/api/v1/auditlogEntryReport
- GET /zia/api/v1/auditlogEntryReport
- GET /zia/api/v1/auditlogEntryReport/download
- DELETE /zia/api/v1/auditlogEntryReport

### Admin Role Management
- GET /zia/api/v1/adminUsers
- POST /zia/api/v1/adminUsers
- PUT /zia/api/v1/adminUsers/{userId}
- DELETE /zia/api/v1/adminUsers/{userId}
- POST /zia/api/v1/adminUsers/{userId}/convert
- GET /zia/api/v1/adminUsers/current
- GET /zia/api/v1/adminRoles
- POST /zia/api/v1/adminRoles
- PUT /zia/api/v1/adminRoles/{roleId}
- DELETE /zia/api/v1/adminRoles/{roleId}
- GET /zia/api/v1/adminRoles/{roleId}
- GET /zia/api/v1/adminRoles/summary
- GET /zia/api/v1/passwordExpiry
- PUT /zia/api/v1/passwordExpiry

### Advanced Settings
- GET /zia/api/v1/advancedSettings
- PUT /zia/api/v1/advancedSettings

### Advanced Threat Protection Policy
- GET /zia/api/v1/cyberThreatProtection
- PUT /zia/api/v1/cyberThreatProtection
- GET /zia/api/v1/cyberThreatProtection/maliciousUrls
- PUT /zia/api/v1/cyberThreatProtection/maliciousUrls
- GET /zia/api/v1/cyberThreatProtection/securityExceptions
- PUT /zia/api/v1/cyberThreatProtection/securityExceptions

### Alerts
- GET /zia/api/v1/alertSubscriptions
- POST /zia/api/v1/alertSubscriptions
- GET /zia/api/v1/alertSubscriptions/{subscriptionId}
- PUT /zia/api/v1/alertSubscriptions/{subscriptionId}

### API Authentication
- GET /zia/api/v1/authenticatedSession
- POST /zia/api/v1/authenticatedSession
- DELETE /zia/api/v1/authenticatedSession

### Authentication Settings
- GET /zia/api/v1/authSettings
- PUT /zia/api/v1/authSettings
- GET /zia/api/v1/authSettings/lite

### Bandwidth Control
- GET /zia/api/v1/bandwidthClasses
- POST /zia/api/v1/bandwidthClasses
- GET /zia/api/v1/bandwidthClasses/{id}
- PUT /zia/api/v1/bandwidthClasses/{id}
- DELETE /zia/api/v1/bandwidthClasses/{id}
- GET /zia/api/v1/bandwidthClasses/summary
- GET /zia/api/v1/bandwidthControlRules
- POST /zia/api/v1/bandwidthControlRules
- GET /zia/api/v1/bandwidthControlRules/{id}
- PUT /zia/api/v1/bandwidthControlRules/{id}
- DELETE /zia/api/v1/bandwidthControlRules/{id}
- GET /zia/api/v1/bandwidthControlRules/summary

### Browser Control Policy
- GET /zia/api/v1/browserControl
- PUT /zia/api/v1/browserControl

### Browser Isolation
- GET /zia/api/v1/browserIsolation/cloudBrowserIsolationProfiles

### Cloud App Control Policy
- GET /zia/api/v1/cloudApplicationInstances
- POST /zia/api/v1/cloudApplicationInstances
- GET /zia/api/v1/cloudApplicationInstances/{id}
- PUT /zia/api/v1/cloudApplicationInstances
- DELETE /zia/api/v1/cloudApplicationInstances/{id}
- GET /zia/api/v1/tenancyRestrictionProfiles
- POST /zia/api/v1/tenancyRestrictionProfiles
- GET /zia/api/v1/tenancyRestrictionProfiles/{id}
- PUT /zia/api/v1/tenancyRestrictionProfiles/{id}
- DELETE /zia/api/v1/tenancyRestrictionProfiles/{id}
- GET /zia/api/v1/tenancyRestrictionProfiles/{id}/appItemCount
- GET /zia/api/v1/webApplicationRules
- POST /zia/api/v1/webApplicationRules
- GET /zia/api/v1/webApplicationRules/{id}
- PUT /zia/api/v1/webApplicationRules/{id}
- DELETE /zia/api/v1/webApplicationRules/{id}
- POST /zia/api/v1/webApplicationRules/{id}/duplicate
- GET /zia/api/v1/webApplicationRules/availableActions
- GET /zia/api/v1/webApplicationRules/ruleTypeMapping
- GET /zia/api/v1/webApplicationRules/{ruleType}

### Cloud NSS (Nanolog Streaming Service)
- GET /zia/api/v1/nssFeeds
- POST /zia/api/v1/nssFeeds
- GET /zia/api/v1/nssFeeds/{id}
- PUT /zia/api/v1/nssFeeds/{id}
- DELETE /zia/api/v1/nssFeeds/{id}
- GET /zia/api/v1/nssFeeds/outputFormats
- POST /zia/api/v1/nssFeeds/testConnectivity
- POST /zia/api/v1/nssFeeds/validateFormat
- GET /zia/api/v1/nssServers
- POST /zia/api/v1/nssServers
- GET /zia/api/v1/nssServers/{id}
- PUT /zia/api/v1/nssServers/{id}
- DELETE /zia/api/v1/nssServers/{id}
- GET /zia/api/v1/nssDownload/cert

### Data Loss Prevention
- GET /zia/api/v1/dlpDictionaries
- POST /zia/api/v1/dlpDictionaries
- GET /zia/api/v1/dlpDictionaries/{id}
- PUT /zia/api/v1/dlpDictionaries/{id}
- DELETE /zia/api/v1/dlpDictionaries/{id}
- GET /zia/api/v1/dlpDictionaries/summary
- POST /zia/api/v1/dlpDictionaries/validatePattern
- GET /zia/api/v1/dlpEngines
- POST /zia/api/v1/dlpEngines
- GET /zia/api/v1/dlpEngines/{id}
- PUT /zia/api/v1/dlpEngines/{id}
- DELETE /zia/api/v1/dlpEngines/{id}
- GET /zia/api/v1/dlpEngines/summary
- GET /zia/api/v1/dlpNotificationTemplates
- POST /zia/api/v1/dlpNotificationTemplates
- GET /zia/api/v1/dlpNotificationTemplates/{id}
- PUT /zia/api/v1/dlpNotificationTemplates/{id}
- DELETE /zia/api/v1/dlpNotificationTemplates/{id}
- GET /zia/api/v1/webDlpRules
- POST /zia/api/v1/webDlpRules
- GET /zia/api/v1/webDlpRules/{id}
- PUT /zia/api/v1/webDlpRules/{id}
- DELETE /zia/api/v1/webDlpRules/{id}
- GET /zia/api/v1/webDlpRules/summary
- GET /zia/api/v1/icapServers, /icapServers/{id}, /icapServers/summary
- GET /zia/api/v1/idmProfile, /idmProfile/{id}, /idmProfile/summary
- GET /zia/api/v1/incidentReceivers, /incidentReceivers/{id}, /incidentReceivers/summary
- GET /zia/api/v1/c2cIncidentReceivers, related endpoints

### Device Groups
- GET /zia/api/v1/deviceGroups
- GET /zia/api/v1/deviceGroups/devices
- GET /zia/api/v1/deviceGroups/devices/lite

### DNS Control Policy
- GET /zia/api/v1/firewallDnsRules
- POST /zia/api/v1/firewallDnsRules
- GET /zia/api/v1/firewallDnsRules/{id}
- PUT /zia/api/v1/firewallDnsRules/{id}
- DELETE /zia/api/v1/firewallDnsRules/{id}

(Additional ZIA categories: End User Notifications, Event Logs, File Type Control Policy, Firewall Policies, and many more — see full sitemap at https://automate.zscaler.com/sitemap.xml)

---

## Zscaler Cloud & Branch Connector (ZTW) API
Base URL: `https://api.zsapi.net/ztw/api/v1`

### Activation
- GET /ztw/api/v1/ecAdminActivateStatus
- POST /ztw/api/v1/ecAdminActivateStatus/activate
- POST /ztw/api/v1/ecAdminActivateStatus/forceActivate

### Admin & Role Management
- GET /ztw/api/v1/adminRoles
- POST /ztw/api/v1/adminRoles
- PUT /ztw/api/v1/adminRoles/{id}
- DELETE /ztw/api/v1/adminRoles/{id}
- GET /ztw/api/v1/adminUsers
- POST /ztw/api/v1/adminUsers
- GET /ztw/api/v1/adminUsers/{id}
- PUT /ztw/api/v1/adminUsers/{id}
- DELETE /ztw/api/v1/adminUsers/{id}
- PUT /ztw/api/v1/adminUsers/password

### Authentication
- POST /ztw/api/v1/authenticatedSession
- DELETE /ztw/api/v1/authenticatedSession
- GET /ztw/api/v1/authenticatedSession

### Cloud Branch Connector Groups
- GET /ztw/api/v1/ecgroup
- GET /ztw/api/v1/ecgroup/{id}
- GET /ztw/api/v1/ecgroup/lite
- POST /ztw/api/v1/ecgroup (create EC VM, EC route, interface)
- PUT /ztw/api/v1/ecgroup (update EC route, EC VM interface)
- DELETE /ztw/api/v1/ecgroup (delete EC route, EC VM, interface)

### DNS Control Forwarding
- GET /ztw/api/v1/dnsFwdRule
- POST /ztw/api/v1/dnsFwdRule
- GET /ztw/api/v1/dnsFwdRule/{id}
- PUT /ztw/api/v1/dnsFwdRule/{id}
- DELETE /ztw/api/v1/dnsFwdRule/{id}

### DNS Gateway
- GET /ztw/api/v1/dnsGateway
- POST /ztw/api/v1/dnsGateway
- GET /ztw/api/v1/dnsGateway/{id}
- PUT /ztw/api/v1/dnsGateway/{id}
- DELETE /ztw/api/v1/dnsGateway/{id}
- GET /ztw/api/v1/dnsGateway/lite

### Forwarding Gateways
- GET /ztw/api/v1/ecgateway
- POST /ztw/api/v1/ecgateway
- GET /ztw/api/v1/ecgateway/{id}
- PUT /ztw/api/v1/ecgateway/{id}
- DELETE /ztw/api/v1/ecgateway/{id}
- GET /ztw/api/v1/ecgateway/lite

### Location Management
- GET /ztw/api/v1/location/{id}
- GET /ztw/api/v1/location/lite
- GET /ztw/api/v1/location/top
- GET /ztw/api/v1/locationTemplate
- POST /ztw/api/v1/locationTemplate
- GET /ztw/api/v1/locationTemplate/{id}
- PUT /ztw/api/v1/locationTemplate/{id}
- DELETE /ztw/api/v1/locationTemplate/{id}
- GET /ztw/api/v1/locationTemplate/lite

### Policy Management (RDR Rules)
- GET /ztw/api/v1/fwdRule
- POST /ztw/api/v1/fwdRule
- GET /ztw/api/v1/fwdRule/{id}
- PUT /ztw/api/v1/fwdRule/{id}
- DELETE /ztw/api/v1/fwdRule/{id}
- GET /ztw/api/v1/fwdRule/count

### Partner Integrations (AWS)
- GET/POST/PUT/DELETE /ztw/api/v1/awsAccountGroup
- GET/POST/PUT/DELETE /ztw/api/v1/awsAccount

---

## Zscaler Analytics (GraphQL) API
Endpoint: `https://api.zsapi.net/zins/graphql`

Domains: SaaS Security, Cyber Security, Zero Trust Firewall, IoT, Shadow IT, Web Traffic

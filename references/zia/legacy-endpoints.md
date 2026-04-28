---
product: zia
topic: "legacy-endpoints"
title: "ZIA legacy API endpoint reference"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-go/zscaler/zia/services/**"
author-status: draft
---

# ZIA legacy API endpoint reference

Complete endpoint surface for the ZIA legacy API. Extracted directly from the Go SDK service layer (`vendor/zscaler-sdk-go/zscaler/zia/services/`), which is the most reliable available source — these paths are hardcoded in working production SDK code.

**Base URL:** `https://admin.<cloud>.net/api/v1` (e.g. `admin.zscalerone.net`, `admin.zscalertwo.net`)

**Auth:** JSESSIONID cookie via `POST /zia/api/v1/authenticatedSession`. See [`../shared/legacy-api.md`](../shared/legacy-api.md) for the full auth flow including API key obfuscation.

**Activation:** All write operations require `POST /zia/api/v1/status/activate` to go live.

---

## Activation

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/status` | Returns current activation status (`ACTIVE`, `PENDING`, `INPROGRESS`) |
| `POST /zia/api/v1/status/activate` | Activates pending config changes |
| `GET /zia/api/v1/eusaStatus` | EUSA acceptance status |
| `PUT /zia/api/v1/eusaStatus` | Update EUSA acceptance |

## Admin & Role Management

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/adminRoles` | List admin roles |
| `GET /zia/api/v1/adminUsers` | List admin users |
| `POST /zia/api/v1/adminUsers` | Create admin user |
| `PUT /zia/api/v1/adminUsers/{id}` | Update admin user |
| `DELETE /zia/api/v1/adminUsers/{id}` | Delete admin user |
| `GET /zia/api/v1/passwordExpiry/settings` | Password expiry settings |

## Authentication Settings

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/authSettings` | Full auth settings (see `/authSettings` schema in `legacy-api.md`) |
| `PUT /zia/api/v1/authSettings` | Update auth settings |
| `GET /zia/api/v1/authSettings/lite` | Lightweight auth settings |
| `GET /zia/api/v1/authSettings/exemptedUrls` | URLs exempted from auth |
| `PUT /zia/api/v1/authSettings/exemptedUrls` | Update exempted URLs |
| `POST /zia/api/v1/enroll` | Enroll user for auth |

## Audit Logs

| Endpoint | Notes |
|---|---|
| `POST /zia/api/v1/auditlogEntryReport` | Request audit log report generation |
| `GET /zia/api/v1/auditlogEntryReport` | Check report status |
| `GET /zia/api/v1/auditlogEntryReport/download` | Download generated report |
| `DELETE /zia/api/v1/auditlogEntryReport` | Delete report |
| `POST /zia/api/v1/eventlogEntryReport` | Request event log report |
| `GET /zia/api/v1/eventlogEntryReport` | Check event log report status |

## Bandwidth Control

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/bandwidthClasses` | List bandwidth classes |
| `POST /zia/api/v1/bandwidthClasses` | Create bandwidth class |
| `GET /zia/api/v1/bandwidthClasses/{id}` | Get bandwidth class |
| `PUT /zia/api/v1/bandwidthClasses/{id}` | Update bandwidth class |
| `DELETE /zia/api/v1/bandwidthClasses/{id}` | Delete bandwidth class |
| `GET /zia/api/v1/bandwidthControlRules` | List bandwidth control rules |
| `POST /zia/api/v1/bandwidthControlRules` | Create rule |
| `PUT /zia/api/v1/bandwidthControlRules/{id}` | Update rule |
| `DELETE /zia/api/v1/bandwidthControlRules/{id}` | Delete rule |

## Browser & Isolation

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/browserControlSettings` | Browser control policy |
| `PUT /zia/api/v1/browserControlSettings` | Update browser control policy |
| `GET /zia/api/v1/browserIsolation/profiles` | Cloud Browser Isolation profiles |

## CASB / SaaS Security

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/casbTenant` | CASB tenant configuration |
| `GET /zia/api/v1/casbDlpRules` | CASB DLP rules |
| `POST /zia/api/v1/casbDlpRules` | Create CASB DLP rule |
| `PUT /zia/api/v1/casbDlpRules/{id}` | Update CASB DLP rule |
| `DELETE /zia/api/v1/casbDlpRules/{id}` | Delete CASB DLP rule |
| `GET /zia/api/v1/casbMalwareRules` | CASB malware rules |
| `POST /zia/api/v1/casbMalwareRules` | Create CASB malware rule |
| `PUT /zia/api/v1/casbMalwareRules/{id}` | Update CASB malware rule |
| `DELETE /zia/api/v1/casbMalwareRules/{id}` | Delete CASB malware rule |
| `GET /zia/api/v1/casbEmailLabel/lite` | CASB email labels (lite) |
| `GET /zia/api/v1/domainProfiles` | Domain profiles |
| `GET /zia/api/v1/domainProfiles/lite` | Domain profiles (lite) |
| `GET /zia/api/v1/cloudToCloudIR` | Cloud-to-cloud incident receivers |
| `GET /zia/api/v1/quarantineTombstoneTemplate/lite` | Quarantine tombstone templates |

## Cloud App Control

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/webApplicationRules` | Cloud app control rules |
| `POST /zia/api/v1/webApplicationRules` | Create rule |
| `PUT /zia/api/v1/webApplicationRules/{id}` | Update rule |
| `DELETE /zia/api/v1/webApplicationRules/{id}` | Delete rule |
| `GET /zia/api/v1/cloudApplicationInstances` | Cloud app instances (tenancy restrictions) |
| `POST /zia/api/v1/cloudApplicationInstances` | Create cloud app instance |
| `PUT /zia/api/v1/cloudApplicationInstances/{id}` | Update |
| `DELETE /zia/api/v1/cloudApplicationInstances/{id}` | Delete |
| `GET /zia/api/v1/cloudApplications/lite` | Cloud applications list (lite) |
| `GET /zia/api/v1/cloudApplications/policy` | Cloud app policy |
| `GET /zia/api/v1/cloudApplications/sslPolicy` | Cloud app SSL policy |
| `PUT /zia/api/v1/cloudApplications/bulkUpdate` | Bulk update cloud app settings |
| `GET /zia/api/v1/advancedUrlFilterAndCloudAppSettings` | Advanced URL filter + cloud app settings |
| `PUT /zia/api/v1/advancedUrlFilterAndCloudAppSettings` | Update |
| `GET /zia/api/v1/tenancyRestrictionProfile` | Tenancy restriction profiles |
| `GET /zia/api/v1/app_views` | App views |
| `GET /zia/api/v1/app_views/list` | App views list |
| `GET /zia/api/v1/apps/app` | App lookup |
| `GET /zia/api/v1/apps/search` | App search |
| `GET /zia/api/v1/appServiceGroups/lite` | App service groups (lite) |
| `GET /zia/api/v1/appServices/lite` | App services (lite) |

## Cloud NSS (Nanolog Streaming Service)

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/nssFeeds` | List NSS feeds |
| `POST /zia/api/v1/nssFeeds` | Create NSS feed |
| `GET /zia/api/v1/nssFeeds/{id}` | Get NSS feed |
| `PUT /zia/api/v1/nssFeeds/{id}` | Update NSS feed |
| `DELETE /zia/api/v1/nssFeeds/{id}` | Delete NSS feed |
| `GET /zia/api/v1/nssFeeds/feedOutputDefaults` | Default feed output formats |
| `POST /zia/api/v1/nssFeeds/testConnectivity` | Test NSS feed connectivity |
| `GET /zia/api/v1/nssServers` | List NSS servers |
| `POST /zia/api/v1/nssServers` | Create NSS server |
| `PUT /zia/api/v1/nssServers/{id}` | Update NSS server |
| `DELETE /zia/api/v1/nssServers/{id}` | Delete NSS server |

## Cyber Threat Protection / ATP

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/cyberThreatProtection/advancedThreatSettings` | Advanced threat settings |
| `PUT /zia/api/v1/cyberThreatProtection/advancedThreatSettings` | Update |
| `GET /zia/api/v1/cyberThreatProtection/maliciousUrls` | Malicious URL exceptions |
| `PUT /zia/api/v1/cyberThreatProtection/maliciousUrls` | Update |
| `GET /zia/api/v1/cyberThreatProtection/malwarePolicy` | Malware policy |
| `PUT /zia/api/v1/cyberThreatProtection/malwarePolicy` | Update |
| `GET /zia/api/v1/cyberThreatProtection/malwareSettings` | Malware settings |
| `PUT /zia/api/v1/cyberThreatProtection/malwareSettings` | Update |
| `GET /zia/api/v1/cyberThreatProtection/atpMalwareInspection` | ATP malware inspection settings |
| `PUT /zia/api/v1/cyberThreatProtection/atpMalwareInspection` | Update |
| `GET /zia/api/v1/cyberThreatProtection/atpMalwareProtocols` | ATP malware protocols |
| `PUT /zia/api/v1/cyberThreatProtection/atpMalwareProtocols` | Update |
| `GET /zia/api/v1/cyberThreatProtection/securityExceptions` | Security exceptions |
| `PUT /zia/api/v1/cyberThreatProtection/securityExceptions` | Update |
| `GET /zia/api/v1/mobileAdvanceThreatSettings` | Mobile threat settings |
| `PUT /zia/api/v1/mobileAdvanceThreatSettings` | Update |

## Data Centers / Subclouds

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/datacenters` | List data centers |
| `GET /zia/api/v1/dcExclusions` | Data center exclusions |
| `PUT /zia/api/v1/dcExclusions` | Update exclusions |
| `GET /zia/api/v1/subclouds` | List subclouds |
| `GET /zia/api/v1/vips` | Virtual IP addresses |
| `GET /zia/api/v1/vips/recommendedList` | Recommended VIPs |

## Departments

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/departments` | List departments |
| `POST /zia/api/v1/departments` | Create department |
| `GET /zia/api/v1/departments/{id}` | Get department |
| `PUT /zia/api/v1/departments/{id}` | Update department |
| `DELETE /zia/api/v1/departments/{id}` | Delete department |

## Device Groups

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/deviceGroups` | List device groups |
| `GET /zia/api/v1/deviceGroups/devices` | List devices within groups |

## DLP

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/dlpDictionaries` | List DLP dictionaries |
| `POST /zia/api/v1/dlpDictionaries` | Create dictionary |
| `GET /zia/api/v1/dlpDictionaries/{id}` | Get dictionary |
| `PUT /zia/api/v1/dlpDictionaries/{id}` | Update dictionary |
| `DELETE /zia/api/v1/dlpDictionaries/{id}` | Delete dictionary |
| `GET /zia/api/v1/dlpEngines` | List DLP engines |
| `GET /zia/api/v1/dlpEngines/lite` | DLP engines (lite) |
| `GET /zia/api/v1/dlpExactDataMatchSchemas` | EDM schemas |
| `GET /zia/api/v1/dlpExactDataMatchSchemas/lite` | EDM schemas (lite) |
| `GET /zia/api/v1/dlpNotificationTemplates` | DLP notification templates |
| `POST /zia/api/v1/dlpNotificationTemplates` | Create template |
| `PUT /zia/api/v1/dlpNotificationTemplates/{id}` | Update template |
| `DELETE /zia/api/v1/dlpNotificationTemplates/{id}` | Delete template |
| `GET /zia/api/v1/webDlpRules` | DLP web rules |
| `POST /zia/api/v1/webDlpRules` | Create rule |
| `PUT /zia/api/v1/webDlpRules/{id}` | Update rule |
| `DELETE /zia/api/v1/webDlpRules/{id}` | Delete rule |
| `GET /zia/api/v1/icapServers` | ICAP servers |
| `GET /zia/api/v1/idmprofile` | IDM profiles |
| `GET /zia/api/v1/idmprofile/lite` | IDM profiles (lite) |
| `GET /zia/api/v1/incidentReceiverServers` | Incident receiver servers |

## DNS / Firewall

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/firewallDnsRules` | DNS control rules |
| `POST /zia/api/v1/firewallDnsRules` | Create DNS rule |
| `PUT /zia/api/v1/firewallDnsRules/{id}` | Update |
| `DELETE /zia/api/v1/firewallDnsRules/{id}` | Delete |
| `GET /zia/api/v1/dnsGateways` | DNS gateways |
| `GET /zia/api/v1/firewallFilteringRules` | Firewall filtering rules |
| `POST /zia/api/v1/firewallFilteringRules` | Create rule |
| `PUT /zia/api/v1/firewallFilteringRules/{id}` | Update |
| `DELETE /zia/api/v1/firewallFilteringRules/{id}` | Delete |
| `GET /zia/api/v1/firewallIpsRules` | IPS control rules |
| `POST /zia/api/v1/firewallIpsRules` | Create IPS rule |
| `PUT /zia/api/v1/firewallIpsRules/{id}` | Update |
| `DELETE /zia/api/v1/firewallIpsRules/{id}` | Delete |
| `GET /zia/api/v1/dnatRules` | NAT control rules |
| `POST /zia/api/v1/dnatRules` | Create NAT rule |
| `PUT /zia/api/v1/dnatRules/{id}` | Update |
| `DELETE /zia/api/v1/dnatRules/{id}` | Delete |
| `GET /zia/api/v1/networkServices` | Network services |
| `GET /zia/api/v1/networkServiceGroups` | Network service groups |
| `GET /zia/api/v1/networkApplications` | Network applications |
| `GET /zia/api/v1/networkApplicationGroups` | Network application groups |
| `GET /zia/api/v1/ipDestinationGroups` | IP destination groups |
| `GET /zia/api/v1/ipSourceGroups` | IP source groups |
| `GET /zia/api/v1/timeWindows` | Time windows |
| `GET /zia/api/v1/timeIntervals` | Time intervals |

## Email

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/emailRecipientProfile` | Email recipient profiles |

## End User Notifications

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/eun` | End user notification config |
| `PUT /zia/api/v1/eun` | Update |

## Export / Shadow IT

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/exportPolicies` | Export all policies |
| `GET /zia/api/v1/shadowIT/applications/export` | Shadow IT application export |

## Extranet

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/extranet` | Extranet config |

## File Types

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/customFileTypes` | Custom file types |
| `POST /zia/api/v1/customFileTypes` | Create custom file type |
| `GET /zia/api/v1/customFileTypes/count` | Custom file type count |
| `GET /zia/api/v1/fileTypeCategories` | File type categories |
| `GET /zia/api/v1/fileTypeRules` | File type control rules |
| `POST /zia/api/v1/fileTypeRules` | Create rule |
| `PUT /zia/api/v1/fileTypeRules/{id}` | Update |
| `DELETE /zia/api/v1/fileTypeRules/{id}` | Delete |

## Forwarding Control

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/forwardingRules` | Forwarding rules |
| `POST /zia/api/v1/forwardingRules` | Create rule |
| `PUT /zia/api/v1/forwardingRules/{id}` | Update |
| `DELETE /zia/api/v1/forwardingRules/{id}` | Delete |
| `GET /zia/api/v1/zpaGateways` | ZPA gateways (for ZPA forwarding rules) |
| `POST /zia/api/v1/zpaGateways` | Create ZPA gateway |
| `PUT /zia/api/v1/zpaGateways/{id}` | Update |
| `DELETE /zia/api/v1/zpaGateways/{id}` | Delete |
| `GET /zia/api/v1/proxies` | Proxies |
| `GET /zia/api/v1/proxyGateways` | Proxy gateways |
| `GET /zia/api/v1/proxyGateways/lite` | Proxy gateways (lite) |
| `GET /zia/api/v1/dedicatedIPGateways/lite` | Dedicated IP gateways (lite) |
| `GET /zia/api/v1/ftpSettings` | FTP control settings |
| `PUT /zia/api/v1/ftpSettings` | Update |

## Groups

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/groups` | List user groups |
| `POST /zia/api/v1/groups` | Create group |
| `GET /zia/api/v1/groups/{id}` | Get group |
| `PUT /zia/api/v1/groups/{id}` | Update group |
| `DELETE /zia/api/v1/groups/{id}` | Delete group |

## Intermediate CA Certificates

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/intermediateCaCertificate` | List intermediate CA certs |
| `POST /zia/api/v1/intermediateCaCertificate/generateCsr` | Generate CSR |
| `POST /zia/api/v1/intermediateCaCertificate/uploadCert` | Upload cert |
| `POST /zia/api/v1/intermediateCaCertificate/uploadCertChain` | Upload cert chain |
| `GET /zia/api/v1/intermediateCaCertificate/showCert` | Show cert |
| `GET /zia/api/v1/intermediateCaCertificate/showCsr` | Show CSR |
| `GET /zia/api/v1/intermediateCaCertificate/downloadCsr` | Download CSR |
| `GET /zia/api/v1/intermediateCaCertificate/downloadPublicKey` | Download public key |
| `POST /zia/api/v1/intermediateCaCertificate/downloadAttestation` | Download attestation |
| `POST /zia/api/v1/intermediateCaCertificate/finalizeCert` | Finalize cert |
| `GET /zia/api/v1/intermediateCaCertificate/makeDefault` | Make cert default |
| `GET /zia/api/v1/intermediateCaCertificate/readyToUse` | List certs ready to use |
| `POST /zia/api/v1/intermediateCaCertificate/verifyKeyAttestation` | Verify key attestation |
| `GET /zia/api/v1/intermediateCaCertificate/keyPair` | Key pair info |

## IoT Discovery

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/iotDiscovery/deviceList` | IoT device list |
| `GET /zia/api/v1/iotDiscovery/deviceTypes` | IoT device types |
| `GET /zia/api/v1/iotDiscovery/categories` | IoT categories |
| `GET /zia/api/v1/iotDiscovery/classifications` | IoT classifications |

## IPv6

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/ipv6config` | IPv6 configuration |
| `PUT /zia/api/v1/ipv6config` | Update |

## Locations

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/locations` | List locations |
| `POST /zia/api/v1/locations` | Create location |
| `GET /zia/api/v1/locations/{id}` | Get location |
| `PUT /zia/api/v1/locations/{id}` | Update location |
| `DELETE /zia/api/v1/locations/{id}` | Delete location |
| `GET /zia/api/v1/locations/lite` | Locations (lite) |
| `GET /zia/api/v1/locations/groups` | Location groups |

## Org Information

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/orgInformation` | Full org information |
| `GET /zia/api/v1/orgInformation/lite` | Org information (lite) |
| `GET /zia/api/v1/orgProvisioning/ipGreTunnelInfo` | GRE tunnel provisioning info |
| `GET /zia/api/v1/customTags` | Custom tags |
| `GET /zia/api/v1/subscriptions` | Subscription details |
| `GET /zia/api/v1/remoteAssistance` | Remote assistance settings |

## PAC Files

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/pacFiles` | List PAC files |
| `POST /zia/api/v1/pacFiles` | Create PAC file |
| `GET /zia/api/v1/pacFiles/{id}` | Get PAC file |
| `PUT /zia/api/v1/pacFiles/{id}` | Update |
| `DELETE /zia/api/v1/pacFiles/{id}` | Delete |

## Risk Profiles

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/riskProfiles` | List risk profiles |

## Rule Labels

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/ruleLabels` | List rule labels |
| `POST /zia/api/v1/ruleLabels` | Create rule label |
| `GET /zia/api/v1/ruleLabels/{id}` | Get rule label |
| `PUT /zia/api/v1/ruleLabels/{id}` | Update |
| `DELETE /zia/api/v1/ruleLabels/{id}` | Delete |

## Sandbox

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/sandbox/report/{md5Hash}` | Get sandbox report for file hash |
| `GET /zia/api/v1/sandbox/report/quota` | Sandbox report quota |
| `GET /zia/api/v1/behavioralAnalysisAdvancedSettings` | Behavioral analysis advanced settings |
| `PUT /zia/api/v1/behavioralAnalysisAdvancedSettings` | Update |
| `GET /zia/api/v1/sandboxRules` | Sandbox rules |
| `POST /zia/api/v1/sandboxRules` | Create sandbox rule |
| `PUT /zia/api/v1/sandboxRules/{id}` | Update |
| `DELETE /zia/api/v1/sandboxRules/{id}` | Delete |

## Security Policy

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/security` | Security policy settings |
| `PUT /zia/api/v1/security` | Update |
| `GET /zia/api/v1/security/advanced` | Advanced security settings |
| `PUT /zia/api/v1/security/advanced` | Update |
| `GET /zia/api/v1/advancedSettings` | Advanced settings |
| `PUT /zia/api/v1/advancedSettings` | Update |

## SSL Inspection

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/sslInspectionRules` | SSL inspection rules |
| `POST /zia/api/v1/sslInspectionRules` | Create rule |
| `PUT /zia/api/v1/sslInspectionRules/{id}` | Update |
| `DELETE /zia/api/v1/sslInspectionRules/{id}` | Delete |

## Traffic Capture

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/trafficCaptureRules` | Traffic capture rules |
| `POST /zia/api/v1/trafficCaptureRules` | Create rule |
| `PUT /zia/api/v1/trafficCaptureRules/{id}` | Update |
| `DELETE /zia/api/v1/trafficCaptureRules/{id}` | Delete |

## Traffic Forwarding

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/greTunnels` | GRE tunnels |
| `POST /zia/api/v1/greTunnels` | Create GRE tunnel |
| `GET /zia/api/v1/greTunnels/{id}` | Get GRE tunnel |
| `PUT /zia/api/v1/greTunnels/{id}` | Update |
| `DELETE /zia/api/v1/greTunnels/{id}` | Delete |
| `GET /zia/api/v1/greTunnels/availableInternalIpRanges` | Available GRE internal IP ranges |
| `GET /zia/api/v1/staticIP` | Static IP addresses |
| `POST /zia/api/v1/staticIP` | Create static IP |
| `PUT /zia/api/v1/staticIP/{id}` | Update |
| `DELETE /zia/api/v1/staticIP/{id}` | Delete |
| `GET /zia/api/v1/vpnCredentials` | VPN credentials |
| `POST /zia/api/v1/vpnCredentials` | Create VPN credential |
| `PUT /zia/api/v1/vpnCredentials/{id}` | Update |
| `DELETE /zia/api/v1/vpnCredentials/{id}` | Delete |

## URL Categories

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/urlCategories` | List URL categories (custom + predefined) |
| `POST /zia/api/v1/urlCategories` | Create custom URL category |
| `GET /zia/api/v1/urlCategories/{id}` | Get URL category |
| `PUT /zia/api/v1/urlCategories/{id}` | Update |
| `DELETE /zia/api/v1/urlCategories/{id}` | Delete custom category |
| `POST /zia/api/v1/urlLookup` | Look up URL category for a given URL |

## URL Filtering

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/urlFilteringRules` | URL filtering rules |
| `POST /zia/api/v1/urlFilteringRules` | Create rule |
| `GET /zia/api/v1/urlFilteringRules/{id}` | Get rule |
| `PUT /zia/api/v1/urlFilteringRules/{id}` | Update |
| `DELETE /zia/api/v1/urlFilteringRules/{id}` | Delete |

## User Management

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/users` | List users |
| `POST /zia/api/v1/users` | Create user |
| `GET /zia/api/v1/users/{id}` | Get user |
| `PUT /zia/api/v1/users/{id}` | Update user |
| `DELETE /zia/api/v1/users/{id}` | Delete user |
| `POST /zia/api/v1/users/bulkDelete` | Bulk delete users |

## Virtual ZEN (Private Service Edge)

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/virtualZenClusters` | List virtual ZEN clusters |
| `POST /zia/api/v1/virtualZenClusters` | Create cluster |
| `PUT /zia/api/v1/virtualZenClusters/{id}` | Update |
| `DELETE /zia/api/v1/virtualZenClusters/{id}` | Delete |
| `GET /zia/api/v1/virtualZenNodes` | List virtual ZEN nodes |
| `POST /zia/api/v1/virtualZenNodes` | Create node |
| `PUT /zia/api/v1/virtualZenNodes/{id}` | Update |
| `DELETE /zia/api/v1/virtualZenNodes/{id}` | Delete |

## Workload Groups

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/workloadGroups` | List workload groups |
| `POST /zia/api/v1/workloadGroups` | Create group |
| `PUT /zia/api/v1/workloadGroups/{id}` | Update |
| `DELETE /zia/api/v1/workloadGroups/{id}` | Delete |

## Alerts / Subscriptions

| Endpoint | Notes |
|---|---|
| `GET /zia/api/v1/alertSubscriptions` | Alert subscriptions |
| `POST /zia/api/v1/alertSubscriptions` | Create subscription |
| `PUT /zia/api/v1/alertSubscriptions/{id}` | Update |
| `DELETE /zia/api/v1/alertSubscriptions/{id}` | Delete |

---

## Cross-links

- Auth flow and session management: [`../shared/legacy-api.md`](../shared/legacy-api.md)
- ZIA OneAPI surface: [`./api.md`](./api.md)
- ZPA legacy endpoints: [`../zpa/legacy-endpoints.md`](../zpa/legacy-endpoints.md)

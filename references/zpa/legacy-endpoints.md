---
product: zpa
topic: "legacy-endpoints"
title: "ZPA legacy API endpoint reference"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/**"
author-status: draft
---

# ZPA legacy API endpoint reference

Complete endpoint surface for the ZPA legacy API. Extracted directly from the Go SDK service layer (`vendor/zscaler-sdk-go/zscaler/zpa/services/`).

**Base URLs:**

| API | Base URL |
|---|---|
| Management (v1) | `https://config.private.zscaler.com/mgmtconfig/v1/admin/customers/{customerId}` |
| Management (v2) | `https://config.private.zscaler.com/mgmtconfig/v2/admin/customers/{customerId}` |
| User config (SCIM groups) | `https://config.private.zscaler.com/userconfig/v1/customers/{customerId}` |
| CBI config | `https://config.private.zscaler.com/cbiconfig/cbi/api/customers/{customerId}` |

The `customerId` is the ZPA tenant ID. All management endpoints use v1 except LSS config, which uses v2.

**Auth:** Client ID + Client Secret → session token. See [`../shared/legacy-api.md`](../shared/legacy-api.md) for the auth flow.

---

## Admin

| Endpoint | Notes |
|---|---|
| `GET /administrators` | List admin users |
| `POST /administrators` | Create admin user |
| `GET /administrators/{id}` | Get admin user |
| `PUT /administrators/{id}` | Update admin user |
| `DELETE /administrators/{id}` | Delete admin user |
| `GET /roles` | List admin roles |
| `GET /permissionGroups` | List permission groups |
| `GET /v2/ssoLoginOptions` | SSO login options (v2) |
| `GET /apiKeys` | List API keys |
| `POST /apiKeys` | Create API key |

## App Connectors

| Endpoint | Notes |
|---|---|
| `GET /connector` | List app connectors |
| `GET /connector/{id}` | Get app connector |
| `PUT /connector/{id}` | Update app connector |
| `DELETE /connector/{id}` | Delete app connector |
| `POST /connector/bulkDelete` | Bulk delete connectors |
| `GET /assistantSchedule` | Get connector assistant schedule |
| `PUT /assistantSchedule/{id}` | Update assistant schedule |
| `GET /connectorSchedule` | Get connector schedule |
| `PUT /connectorSchedule` | Update connector schedule |

## App Connector Groups

| Endpoint | Notes |
|---|---|
| `GET /appConnectorGroup` | List app connector groups |
| `POST /appConnectorGroup` | Create group |
| `GET /appConnectorGroup/{id}` | Get group |
| `PUT /appConnectorGroup/{id}` | Update group |
| `DELETE /appConnectorGroup/{id}` | Delete group |

## Application Segments

| Endpoint | Notes |
|---|---|
| `GET /application` | List application segments |
| `POST /application` | Create application segment |
| `GET /application/{id}` | Get application segment |
| `PUT /application/{id}` | Update application segment |
| `DELETE /application/{id}` | Delete application segment |
| `GET /application/getAppsByType` | Get apps by type (Browser Access, Inspection, PRA) |

All segment types (standard, Browser Access, Inspection, PRA) share the `/application` endpoint — type is determined by request payload fields.

## Application Servers

| Endpoint | Notes |
|---|---|
| `GET /server` | List application servers |
| `POST /server` | Create server |
| `GET /server/{id}` | Get server |
| `PUT /server/{id}` | Update server |
| `DELETE /server/{id}` | Delete server |

## Branch Connectors

| Endpoint | Notes |
|---|---|
| `GET /branchConnector` | List branch connectors |
| `GET /branchConnector/{id}` | Get branch connector |
| `GET /branchConnectorGroup` | List branch connector groups |
| `GET /branchConnectorGroup/{id}` | Get group |

## Browser Access Certificates

| Endpoint | Notes |
|---|---|
| `GET /clientlessCertificate/issued` | List issued BA certificates |
| `GET /certificate` | List certificates |
| `POST /certificate` | Upload certificate |
| `DELETE /certificate/{id}` | Delete certificate |

## Cloud Browser Isolation (CBI)

CBI uses a separate base: `https://config.private.zscaler.com/cbiconfig/cbi/api/customers/{customerId}`

| Endpoint | Notes |
|---|---|
| `GET /banner` | Get CBI banner |
| `GET /banners` | List CBI banners |
| `POST /banners` | Create banner |
| `PUT /banners/{id}` | Update banner |
| `DELETE /banners/{id}` | Delete banner |
| `GET /certificate` | Get CBI certificate |
| `GET /certificates` | List CBI certificates |
| `GET /profiles` | List CBI profiles |
| `POST /profiles` | Create profile |
| `PUT /profiles/{id}` | Update profile |
| `DELETE /profiles/{id}` | Delete profile |
| `GET /regions` | List CBI regions |
| `GET /zpaprofiles` | List ZPA CBI profiles |

CBI isolation profiles in the management API:

| Endpoint | Notes |
|---|---|
| `GET /isolation/profiles` | List isolation profiles (mgmtconfig v1 base) |

## Client Types

| Endpoint | Notes |
|---|---|
| `GET /clientTypes` | List client types |
| `GET /clientSetting` | Client settings |
| `PUT /clientSetting` | Update client settings |
| `GET /platform` | List platforms |

## Cloud Connectors

| Endpoint | Notes |
|---|---|
| `GET /cloudConnector` | List cloud connectors |
| `GET /cloudConnector/{id}` | Get cloud connector |
| `GET /cloudConnectorGroup` | List cloud connector groups |
| `GET /cloudConnectorGroup/{id}` | Get group |

## Config

| Endpoint | Notes |
|---|---|
| `GET /configOverrides` | Config overrides |
| `PUT /configOverrides` | Update |
| `GET /authDomains` | Auth domains |
| `GET /ancestorPolicy` | Ancestor policy |
| `GET /customerDRToolVersion` | DR tool version |
| `GET /visible/versionProfiles` | Available version profiles |

## Emergency Access

| Endpoint | Notes |
|---|---|
| `GET /emergencyAccess/user` | List emergency access users |
| `POST /emergencyAccess/user` | Create emergency access user |
| `PUT /emergencyAccess/user/{id}` | Update |
| `DELETE /emergencyAccess/user/{id}` | Delete |

## Enrollment Certificates

| Endpoint | Notes |
|---|---|
| `GET /enrollmentCert` | List enrollment certificates |
| `POST /enrollmentCert` | Create enrollment cert |
| `DELETE /enrollmentCert/{id}` | Delete |

## Extranet

| Endpoint | Notes |
|---|---|
| `GET /extranetResource/partner` | Extranet partner resources |

## Identity Providers

| Endpoint | Notes |
|---|---|
| `GET /idp` | List IdPs |
| `POST /idp` | Create IdP |
| `GET /idp/{id}` | Get IdP |
| `PUT /idp/{id}` | Update IdP |
| `DELETE /idp/{id}` | Delete IdP |

## Inspection

| Endpoint | Notes |
|---|---|
| `GET /inspectionControls/custom` | Custom inspection controls |
| `POST /inspectionControls/custom` | Create custom control |
| `PUT /inspectionControls/custom/{id}` | Update |
| `DELETE /inspectionControls/custom/{id}` | Delete |
| `GET /inspectionControls/predefined` | Predefined inspection controls |
| `GET /inspectionProfile` | List inspection profiles |
| `POST /inspectionProfile` | Create inspection profile |
| `PUT /inspectionProfile/{id}` | Update |
| `DELETE /inspectionProfile/{id}` | Delete |
| `GET /browserProtectionProfile` | Browser protection profiles |

## Locations

| Endpoint | Notes |
|---|---|
| `GET /location` | List locations |
| `GET /locationGroup` | List location groups |

## Log Streaming Service (LSS)

LSS config uses **v2**: `https://config.private.zscaler.com/mgmtconfig/v2/admin/customers/{customerId}`

| Endpoint | Notes |
|---|---|
| `GET /lssConfig` | List LSS configurations |
| `POST /lssConfig` | Create LSS config |
| `GET /lssConfig/{id}` | Get LSS config |
| `PUT /lssConfig/{id}` | Update LSS config |
| `DELETE /lssConfig/{id}` | Delete LSS config |

## Machine Groups

| Endpoint | Notes |
|---|---|
| `GET /machineGroup` | List machine groups |
| `GET /machineGroup/{id}` | Get machine group |

## Microtenants

| Endpoint | Notes |
|---|---|
| `GET /microtenants` | List microtenants |
| `POST /microtenants` | Create microtenant |
| `GET /microtenants/{id}` | Get microtenant |
| `PUT /microtenants/{id}` | Update microtenant |
| `DELETE /microtenants/{id}` | Delete microtenant |

## Policy Sets

All policy operations go through the policy set controller. v1 and v2 share the same resource path structure.

| Endpoint | Notes |
|---|---|
| `GET /policySet/rules/policyType/{policyType}` | List rules for a policy type |
| `POST /policySet/rules/policyType/{policyType}` | Create rule |
| `GET /policySet/rules/policyType/{policyType}/{ruleId}` | Get rule |
| `PUT /policySet/rules/policyType/{policyType}/{ruleId}` | Update rule |
| `DELETE /policySet/rules/policyType/{policyType}/{ruleId}` | Delete rule |
| `PUT /policySet/rules/policyType/{policyType}/{ruleId}/reorder/{order}` | Reorder rule |

Policy types include: `ACCESS_POLICY`, `TIMEOUT_POLICY`, `FORWARDING_POLICY`, `INSPECTION_POLICY`, `ISOLATION_POLICY`, `CREDENTIAL_POLICY`, `CAPABILITIES_POLICY`, `BROWSER_PROTECTION`, `REDIRECTION_POLICY`, `PORTAL_ACCESS_POLICY`.

v2 endpoint base (`/mgmtconfig/v2/...`) supports expanded condition operators.

## Posture Profiles

| Endpoint | Notes |
|---|---|
| `GET /posture` | List posture profiles |
| `GET /posture/{id}` | Get posture profile |

## Privileged Remote Access (PRA)

| Endpoint | Notes |
|---|---|
| `GET /approval` | List PRA approvals |
| `POST /approval` | Create approval |
| `PUT /approval/{id}` | Update approval |
| `DELETE /approval/{id}` | Delete approval |
| `GET /praConsole` | List PRA consoles |
| `POST /praConsole` | Create console |
| `PUT /praConsole/{id}` | Update |
| `DELETE /praConsole/{id}` | Delete |
| `POST /praConsole/bulk` | Bulk console operation |
| `GET /credential` | List PRA credentials |
| `POST /credential` | Create credential |
| `PUT /credential/{id}` | Update |
| `DELETE /credential/{id}` | Delete |
| `GET /praPortal` | List PRA portals |
| `POST /praPortal` | Create portal |
| `PUT /praPortal/{id}` | Update |
| `DELETE /praPortal/{id}` | Delete |

## Private Cloud Controllers / Groups

| Endpoint | Notes |
|---|---|
| `GET /privateCloudController` | List private cloud controllers |
| `GET /privateCloudController/{id}` | Get |
| `GET /privateCloudControllerGroup` | List private cloud controller groups |
| `GET /privateCloudControllerGroup/{id}` | Get |

## Provisioning Keys

| Endpoint | Notes |
|---|---|
| `GET /associationType/{type}/provisioningKey` | List provisioning keys by type |
| `POST /associationType/{type}/provisioningKey` | Create key |
| `GET /associationType/{type}/provisioningKey/{id}` | Get key |
| `PUT /associationType/{type}/provisioningKey/{id}` | Update |
| `DELETE /associationType/{type}/provisioningKey/{id}` | Delete |

Association types: `CONNECTOR_GRP`, `SERVICE_EDGE_GRP`.

## SAML / SCIM

| Endpoint | Notes |
|---|---|
| `GET /samlAttribute` | List SAML attributes |
| `GET /samlAttribute/{id}` | Get SAML attribute |
| `GET /scimattribute/idpId/{idpId}` | List SCIM attribute headers for IdP |
| `GET /scimattribute/idpId/{idpId}/{id}` | Get SCIM attribute header |
| `GET /idp/{idpId}/scimgroup` | List SCIM groups for IdP (userconfig base) |
| `GET /idp/{idpId}/scimgroup/{id}` | Get SCIM group (userconfig base) |

## Segment Groups

| Endpoint | Notes |
|---|---|
| `GET /segmentGroup` | List segment groups |
| `POST /segmentGroup` | Create group |
| `GET /segmentGroup/{id}` | Get group |
| `PUT /segmentGroup/{id}` | Update |
| `DELETE /segmentGroup/{id}` | Delete |

## Server Groups

| Endpoint | Notes |
|---|---|
| `GET /serverGroup` | List server groups |
| `POST /serverGroup` | Create group |
| `GET /serverGroup/{id}` | Get group |
| `PUT /serverGroup/{id}` | Update |
| `DELETE /serverGroup/{id}` | Delete |

## Service Edges (App Connectors — Private Service Edge)

| Endpoint | Notes |
|---|---|
| `GET /serviceEdge` | List service edges |
| `GET /serviceEdge/{id}` | Get service edge |
| `PUT /serviceEdge/{id}` | Update |
| `DELETE /serviceEdge/{id}` | Delete |
| `POST /serviceEdge/bulkDelete` | Bulk delete |
| `GET /serviceEdgeGroup` | List service edge groups |
| `POST /serviceEdgeGroup` | Create group |
| `GET /serviceEdgeGroup/{id}` | Get group |
| `PUT /serviceEdgeGroup/{id}` | Update |
| `DELETE /serviceEdgeGroup/{id}` | Delete |
| `GET /serviceEdgeSchedule` | Get service edge schedule |
| `PUT /serviceEdgeSchedule/{id}` | Update schedule |

## Tags

| Endpoint | Notes |
|---|---|
| `GET /tagGroup` | List tag groups |
| `GET /tagGroup/search` | Search tag groups |
| `GET /tagKey` | List tag keys |
| `GET /tagKey/search` | Search tag keys |
| `PUT /tagKey/bulkUpdateStatus` | Bulk update tag key status |
| `GET /namespace` | List namespaces |
| `GET /namespace/search` | Search namespaces |
| `GET /workloadTagGroup/summary` | Workload tag group summary |

## Trusted Networks

| Endpoint | Notes |
|---|---|
| `GET /network` | List trusted networks |
| `GET /network/{id}` | Get trusted network |

## User Portal

| Endpoint | Notes |
|---|---|
| `GET /userportal/aup` | Acceptable Use Policy config |
| `PUT /userportal/aup` | Update AUP |
| `GET /userPortal` | List user portals |
| `POST /userPortal` | Create user portal |
| `PUT /userPortal/{id}` | Update |
| `DELETE /userPortal/{id}` | Delete |
| `GET /userPortalLink` | User portal links |

## VPN / Network

| Endpoint | Notes |
|---|---|
| `GET /vpnConnectedUsers` | VPN connected users |
| `GET /v2/ipRanges` | IP ranges (v2) |

## Managed Browser

| Endpoint | Notes |
|---|---|
| `GET /managedBrowserProfile/search` | Search managed browser profiles |

---

## Cross-links

- Auth flow and session management: [`../shared/legacy-api.md`](../shared/legacy-api.md)
- ZPA OneAPI surface: [`./api.md`](./api.md)
- ZIA legacy endpoints: [`../zia/legacy-endpoints.md`](../zia/legacy-endpoints.md)

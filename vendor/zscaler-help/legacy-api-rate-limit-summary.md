# API Rate Limit Summary

**Source:** https://help.zscaler.com/legacy-apis/api-rate-limit-summary
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

The following table summarizes the Zscaler Internet Access (ZIA) API resources and their rate limits for each method.

Rate limits are subject to change. To learn more, see Understanding Rate Limiting (`/zia/understanding-rate-limiting`).

| Resource URI | GET (read) | POST (create) | PUT (replace) | DELETE |
|---|---|---|---|---|
| /adminRoles | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /adminRoles/{roleId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /adminRoles/lite | 2/sec and 1000/hr | - | - | - |
| /adminUsers | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /adminUsers/{userId} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /adminUsers/me | 2/sec and 1000/hr | - | - | - |
| /advancedSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /advancedUrlFilterAndCloudAppSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /alertSubscriptions | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /alertSubscriptions/{alertSubscriptionId} | 1/sec and 400/hr | - | 1/sec and 400/hr | - |
| /app_view/{appViewId}/apps | 25/day (Trial) or 1,000/day (License) | - | - | - |
| /app_views/list | 25/day (Trial) or 1,000/day (License) | - | - | - |
| /apps/app | 25/day (Trial) or 5,000/day (License) | 25/day (Trial) or 5,000/day (License) | - | - |
| /apps/search | 25/day (Trial) or 1,000/day (License) | - | - | - |
| /auditlogEntryReport | 2/sec and 1000/hr | 10/min and 40/hr | - | 2/sec and 1000/hr |
| /auditlogEntryReport/download | 2/sec and 1000/hr | - | - | - |
| /authenticatedSession | 2/sec and 1000/hr | 2/sec and 1000/hr | - | 2/sec and 1000/hr |
| /authSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /authSettings/exemptedUrls | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /authSettings/lite | 2/sec and 1000/hr | - | - | - |
| /bandwidthClasses | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /bandwidthClasses/{bandwidthClassId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /bandwidthClasses/lite | 2/sec and 1000/hr | - | - | - |
| /bandwidthControlRules | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /bandwidthControlRules/{ruleId} | 1/sec and 400/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /bandwidthControlRules/lite | 1/sec and 400/hr | - | - | - |
| /behavioralAnalysisAdvancedSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /behavioralAnalysisAdvancedSettings/fileHashCount | 2/sec and 1000/hr | - | - | - |
| /browserControlSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /browserIsolation/profiles | 2/sec and 1000/hr | - | - | - |
| /casbDlpRules | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /casbDlpRules/{ruleId} | 1/sec and 400/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /casbDlpRules/all | 1/sec and 400/hr | - | - | - |
| /casbEmailLabel/lite | 2/sec and up to 1000/hr | - | - | - |
| /casbMalwareRules | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /casbMalwareRules/{ruleId} | 1/sec and 400/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /casbMalwareRules/all | 1/sec and 400/hr | - | - | - |
| /casbTenant/{tenantId}/tags/policy | 2/sec and up to 1000/hr | - | - | - |
| /casbTenant/lite | 2/sec and up to 1000/hr | - | - | - |
| /casbTenant/scanInfo | 2/sec and up to 1000/hr | - | - | - |
| /casbTenant/validate/status/{tenantId} | 2/sec and up to 1000/hr | - | - | - |
| /cloudApplicationInstances | 2/sec and up to 1000/hr | 1/sec and up to 400/hr | - | - |
| /cloudApplicationInstances/{instanceId} | 2/sec and up to 1000/hr | - | 1/sec and up to 400/hr | 1/sec and up to 400/hr |
| /cloudApplications/bulkUpdate | - | - | 1/min and up to 4/hr | - |
| /cloudApplications/lite | 2/sec and up to 1000/hr | - | - | - |
| /cloudApplications/policy | 2/sec and up to 1000/hr | - | - | - |
| /cloudApplications/sslPolicy | 2/sec and up to 1000/hr | - | - | - |
| /cloudToCloudIR | 5/sec | - | - | - |
| /cloudToCloudIR/{id} | 2/sec | - | - | - |
| /cloudToCloudIR/config/{id}/validateDelete | 2/sec | - | - | - |
| /cloudToCloudIR/count | 2/sec | - | - | - |
| /cloudToCloudIR/lite | 2/sec | - | - | - |
| /configAudit | 1/hour and 8/day | - | - | - |
| /configAudit/ipVisibility | 1/hour and 8/day | - | - | - |
| /configAudit/pacFile | 1/hour and 8/day | - | - | - |
| /customFileTypes | 1/sec and up to 400/hr | 1/sec and up to 400/hr | 1/sec and up to 400/hr | - |
| /customFileTypes/{id} | 2/sec and up to 1000/hr | - | - | 1/sec and up to 400/hr |
| /customFileTypes/count | 2/sec and up to 1000/hr | - | - | - |
| /customTags | 2/sec and up to 1000/hr | - | - | - |
| /cyberThreatProtection/advancedThreatSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /cyberThreatProtection/atpMalwareInspection | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /cyberThreatProtection/atpMalwareProtocols | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /cyberThreatProtection/maliciousUrls | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /cyberThreatProtection/malwarePolicy | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /cyberThreatProtection/malwareSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /cyberThreatProtection/securityExceptions | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /datacenters | 2/sec & 1000/hr | - | - | - |
| /dcExclusions | 1/sec & up to 400/hr | 1/sec & 400/hr | 1/sec & 400/hr | 1/sec & 400/hr |
| /dedicatedIPGateways/lite | 2/sec and 1000/hr | - | - | - |
| /departments | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /departments/{departmentId} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /departments/{id} | 2/sec and 1000/hr | - | - | - |
| /departments/lite | 2/sec and 1000/hr | - | - | - |

*Note: The full table continues with many additional ZIA API endpoints. This capture covers the first ~70 rows (A-D). The complete table is available at the source URL. Rate limits follow the standard Heavy/Medium/Light model: DELETE = 1/min and 4/hr (Heavy); POST/PUT = 1/sec and 400/hr (Medium); GET = 2/sec and 1000/hr (Light). Exceptions are noted in the table.*

## Postman Collection

A ZIA Cloud Service Postman collection is available for download at:
`/sites/default/files/zia_cloud_service.postman_collection_06_23_2025.json`

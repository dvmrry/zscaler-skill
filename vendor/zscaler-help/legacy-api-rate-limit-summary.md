# API Rate Limit Summary

**Source:** https://help.zscaler.com/legacy-apis/api-rate-limit-summary
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400476, revision 3224256

---

The following table summarizes the Zscaler Internet Access (ZIA) API resources and their rate limits for each method.
Rate limits are subject to change. To learn more, see Understanding Rate Limiting.
| Resource URI | GET (read) | POST (create) | PUT (replace) | DELETE |
|---|---|---|---|---|
| /adaptiveAccessProfiles | 2/sec and 1000/hr | - | - | - |
| /adaptiveAccessProfiles/profiles/rules | 2/sec and 1000/hr | - | - | - |
| /adminRoles | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /adminRoles/lite | 2/sec and 1000/hr | - | - | - |
| /adminRoles/{roleId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /adminUsers | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /adminUsers/me | 2/sec and 1000/hr | - | - | - |
| /adminUsers/{userId} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /advancedSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /advancedUrlFilterAndCloudAppSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /alertDefinitions | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /alertDefinitions/{alertDefinitionId} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /alertRuleConfiguration/rules | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /alertRuleConfiguration/rules/{ruleId} | 2/sec and 1000/hr | - | - | - |
| /alertRuleConfiguration/uebaRules/{id} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /alertRuleConfiguration/rules/rulestatus | 2/sec and 1000/hr | - | - | - |
| /alertRuleConfiguration/uebaRules | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /alertRuleConfiguration/uebaRules/{ruleId} | 2/sec and 1000/hr | - | - | - |
| /alertRuleConfiguration/uebaRules/{id} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /alertRuleConfiguration/webhooks | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /alertRuleConfiguration/webhooks/{id} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| alertRuleConfiguration/webhooks/test | - | 1/sec and 400/hr | - | - |
| /alertSubscriptions | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /alertSubscriptions/{alertSubscriptionId} | 1/sec and 400/hr | - | 1/sec and 400/hr | - |
| /apps/app | 25/day (Trial) or 5,000/day (License) | 25/day (Trial) or 5,000/day (License) | - | - |
| /apps/search | 25/day (Trial) or 1,000/day (License) | - | - | - |
| /apps-services | 2/sec and up to 1000/hr | 1/min and up to 4/hr | - | - |
| /apps-services/{appServiceId} | 2/sec and up to 1000/hr | - | 1/min and up to 4/hr | 1/sec and up to 400/hr |
| /app_views/list | 25/day (Trial) or 1,000/day (License) | - | - | - |
| /app_view/{appViewId}/apps | 25/day (Trial) or 1,000/day (License) | - | - | - |
| /auditlogEntryReport | 2/sec and 1000/hr | 10/min and 40/hr | - | 2/sec and 1000/hr |
| /auditlogEntryReport/download | 2/sec and 1000/hr | - | - | - |
| /authenticatedSession | 2/sec and 1000/hr | 2/sec and 1000/hr | - | 2/sec and 1000/hr |
| /authSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /authSettings/exemptedUrls | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /authSettings/lite | 2/sec and 1000/hr | - | - | - |
| /azure/refreshConnectionStatus | 2/sec and 1000/hr | 10/min and 40/hr | - | - |
| /azure/tunnelConfiguration | 2/sec and 1000/hr | 10/min and 40/hr | - | - |
| /azure/unConfigureTunnelStatus | 2/sec and 1000/hr | - | - | - |
| /azure/unConfigureTunnel/{hubId} | - | - | - | 10/min and 40/hr |
| /azure/virtualHubs | 2/sec and 1000/hr | - | - | - |
| /azure/virtualHubSync | 2/sec and 1000/hr | - | - | - |
| /azure/virtualHubSync | - | 10/min and 40/hr | - | - |
| /bandwidthClasses | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /bandwidthClasses/lite | 2/sec and 1000/hr | - | - | - |
| /bandwidthClasses/{bandwidthClassId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /bandwidthControlRules | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /bandwidthControlRules/lite | 1/sec and 400/hr | - | - | - |
| /bandwidthControlRules/{ruleId} | 1/sec and 400/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /behavioralAnalysisAdvancedSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /behavioralAnalysisAdvancedSettings/fileHashCount | 2/sec and 1000/hr | - | - | - |
| /browserControlSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /browserControlSettings/smartIsolation | - | - | 1/sec and 400/hr | - |
| /browserControlSettings/supportedBrowserVersions | 2/sec and 1000/hr | - | - | - |
| /browserIsolation/profiles | 2/sec and 1000/hr | - | - | - |
| /casbDlpRules | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /casbDlpRules/all | 1/sec and 400/hr | - | - | - |
| /casbDlpRules/{ruleId} | 1/sec and 400/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /casbEmailLabel/lite | 2/sec and up to 1000/hr | - | - | - |
| /casbMalwareRules | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /casbMalwareRules/all | 1/sec and 400/hr | - | - | - |
| /casbMalwareRules/{ruleId} | 1/sec and 400/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /casbTenant/lite | 2/sec and up to 1000/hr | - | - | - |
| /casbTenant/scanInfo | 2/sec and up to 1000/hr | - | - | - |
| /casbTenant/{tenantId}/tags/policy | 2/sec and up to 1000/hr | - | - | - |
| /casbTenant/validate/status/{tenantId} | 2/sec and up to 1000/hr | - | - | - |
| /cloudApplicationInstances | 2/sec and up to 1000/hr | 1/sec and up to 400/hr | - | - |
| /cloudApplicationInstances/{instanceId} | 2/sec and up to 1000/hr | - | 1/sec and up to 400/hr | 1/sec and up to 400/hr |
| /cloudApplications/bulkUpdate | - | - | 1/min and up to 4/hr | - |
| /cloudApplications/lite | 2/sec and up to 1000/hr | - | - | - |
| /cloudApplications/policy | 2/sec and up to 1000/hr | - | - | - |
| /cloudApplications/sslPolicy | 2/sec and up to 1000/hr | - | - | - |
| /cloudToCloudIR | 5/sec | - | - | - |
| /cloudToCloudIR/config/{id}/validateDelete | 2/sec | - | - | - |
| /cloudToCloudIR/count | 2/sec | - | - | - |
| /cloudToCloudIR/lite | 2/sec | - | - | - |
| /cloudToCloudIR/{id} | 2/sec | - | - | - |
| /configAudit | 1/hour and 8/day | - | - | - |
| /configAudit/ipVisibility | 1/hour and 8/day | - | - | - |
| /configAudit/pacFile | 1/hour and 8/day | - | - | - |
| /customFileTypes | 1/sec and up to 400/hr | 1/sec and up to 400/hr | 1/sec and up to 400/hr | - |
| /customFileTypes/count | 2/sec and up to 1000/hr | - | - | - |
| /customFileTypes/{id} | 2/sec and up to 1000/hr | - | - | 1/sec and up to 400/hr |
| /customTags | 2/sec and up to 1000/hr | - | - | - |
| /cyberThreatProtection/advancedThreatSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /cyberThreatProtection/atpMalwareInspection | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /cyberThreatProtection/atpMalwareProtocols | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /cyberThreatProtection/maliciousUrls | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /cyberThreatProtection/malwareSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /cyberThreatProtection/malwarePolicy | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /cyberThreatProtection/securityExceptions | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /datacenters | 2/sec & 1000/hr | - | - | - |
| /dcExclusions | 1/sec & up to 400/hr | 1/sec & 400/hr | 1/sec & 400/hr | 1/sec & 400/hr |
| /dedicatedIPGateways/lite | 2/sec and 1000/hr | - | - | - |
| /departments | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /departments/{departmentId} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /departments/{id} | 2/sec and 1000/hr | - | - | - |
| /departments/lite | 2/sec and 1000/hr | - | - | - |
| /departments/lite/{id} | 2/sec and 1000/hr | - | - | - |
| /devices | 2/sec and 1000/hr | - | - | - |
| /devices/{id} | 2/sec and 1000/hr | - | - | - |
| /dlpEndpointResource | - | 1/sec and 400/hr | - | - |
| /dlpEndpointResource/{channel} | 2/sec and 1000/hr | - | - | - |
| /dlpEndpointResource/{channel}/{id} | 2/sec and 1000/hr | - | - | - |
| /dlpEndpointResource/{id} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /dlpEndpointResource/{id}/groups | 2/sec and 1000/hr | - | - | - |
| /endPointApplicationGroups | 1/sec and 400/hr | - | - | - |
| /endPointApplicationGroups/policies | 1/sec and 400/hr | - | - | - |
| /endPointApplicationGroups/resources/{groupId} | - | - | N/A | - |
| /endPointApplicationGroups | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /endPointApplicationGroups/{groupId} | - | - | 1/sec and 400/hr | - |
| /endPointApplicationGroups/{id} | 1/sec and 400/hr | - | - | N/A |
| /endPointApplications | 2/sec and 1000/hr | - | - | - |
| /endPointApplications/cloudApps | 1/sec and 400/hr | - | - | - |
| /endPointApplications/cloudApps/count | 1/sec and 400/hr | - | - | - |
| /endPointApplications/count | 1/sec and 400/hr | - | - | - |
| /endPointApplications/customApp | - | 1/sec and 400/hr | - | - |
| /endPointApplications/customApp/{id} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /endPointApplications/customApps | 1/sec and 400/hr | - | - | - |
| /endPointApplications/customApps/{id} | 1/sec and 400/hr | - | - | - |
| /endPointApplications/customApps/lite | 2/sec and 1000/hr | - | - | - |
| /endPointApplications/getCategoriesWithNonEmptyApps | 2/sec and 1000/hr | - | - | - |
| /endPointApplications/lite | 2/sec and 1000/hr | - | - | - |
| /endPointApplications/policies | 1/sec and 400/hr | - | - | - |
| /endPointApplications/{id} | - | - | 1/sec and 400/hr | - |
| /endPointDlpResourceGroups/{channel} | 2/sec and 1000/hr | - | - | - |
| /endPointDlpResourceGroups | - | 1/sec and 400/hr | - | - |
| /endPointDlpResourceGroups/{groupId} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /endPointDlpResourceGroups/{groupId}/resources | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /endPointDlpRules | 2/sec and 1000/hr | 10/min and 40/hr | - | - |
| /endPointDlpRules/{id} | 2/sec and 1000/hr | - | 10/min and 40/hr | 1/sec and 400/hr |
| /endPointDlpRules/fileTypes | 2/sec and 1000/hr | - | - | - |
| /endPointDlpRules/fileTypeCategories | 2/sec and 1000/hr | - | - | - |
| /endPointDlpRules/{id}/subRule | - | 10/min and 40/hr | - | - |
| /endPointDlpRules/{id}/subRule/{subRuleId} | - | - | 10/min and 40/hr | 1/sec and 400/hr |
| /eunTemplate/{templateType}/featureEnablementStatus | 2/sec and 1000/hr | - | - | - |
| /eunTemplate/{templateType}/product/{product} | 2/sec and 1000/hr | - | - | - |
| /userConfirmation/globalDefaultTemplates | 2/sec and 1000/hr | - | - | - |
| /userConfirmation/product/{product} | 2/sec and 1000/hr | - | - | - |
| /userConfirmation/{templateType}/featureEnablementStatus | 2/sec and 1000/hr | - | - | - |
| /dnatRules | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /dnatRules/{ruleId} | 1/sec and 400/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /dnsApplicationGroups | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /dnsApplicationGroups/{groupId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /dnsApplicationGroups/lite | 2/sec and 1000/hr | - | - | - |
| /dnsGateways | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /dnsGateways/lite | 2/sec and 1000/hr | - | - | - |
| /dnsGateways/{id} | 1/sec and 400/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /deviceGroups | 2/sec and 1000/hr | - | - | - |
| /deviceGroups/devices | 2/sec and 1000/hr | - | - | - |
| /deviceGroups/devices/lite | 2/sec and 1000/hr | - | - | - |
| /dlpDictionaries | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /dlpDictionaries/lite | 2/sec and 1000/hr | - | - | - |
| /dlpDictionaries/{dlpDictId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /dlpDictionaries/{dictId}/predefinedIdentifiers | 2/sec and 1000/hr | - | - | - |
| /dlpDictionaries/validateDlpPattern | - | 1/sec and 400/hr | - | - |
| /dlpEngines | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /dlpEngines/{dlpEngineId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /dlpEngines/lite | 2/sec and 1000/hr | - | - | - |
| /dlpEngines/validateDlpExpr | - | 1/sec and 400/hr | - | - |
| /dlpExactDataMatchSchemas | 2/sec and 1000/hr | - | - | - |
| /dlpExactDataMatchSchemas/lite | 2/sec and 1000/hr | - | - | - |
| /dlpNotificationTemplates | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /dlpNotificationTemplates/lite | 2/sec and 1000/hr | - | - | - |
| /dlpNotificationTemplates/{templateId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /domainProfiles | 2/sec and up to 1000/hr | 1/sec and up to 400/hr | - | - |
| /domainProfiles/{id} | 2/sec and up to 1000/hr | - | 1/sec and up to 400/hr | 1/sec and up to 400/hr |
| /domainProfiles/lite | 20/sec and 10000/hr | - | - | - |
| /emailDlpRules | 2/sec and up to 1000/hr | 1/sec and up to 400/hr | - | - |
| /emailDlpRules/{ruleId} | 20/sec and up to 10000/hr | - | 1/sec and up to 400/hr | 1/sec and up to 400/hr |
| /emailDlpRules/actions | 20/sec and up to 10000/hr | - | - | - |
| /emailDlpRules/lite | 2/sec and up to 1000/hr | - | - | - |
| /emailRecipientProfile | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /emailRecipientProfile/{profileId} | 5/sec, 100/min, and up to 6000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /emailRecipientProfile/count | 5/sec and up to 3000/hr | - | - | - |
| /emailRecipientProfile/lite | 5/sec and up to 3000/hr | - | - | - |
| /eun | 2/sec and up to 1000/hr | - | 1/sec and up to 400/hr |  |
| /eusaStatus/latest | 2/sec and 1000/hr | - | - | - |
| /eusaStatus/{eusaStatusId} | - | - | 1/sec and 400/hr | - |
| /eventlogEntryReport | 2/sec and 1000/hr | 2/sec and 1000/hr | - | 2/sec and 1000/hr |
| /eventlogEntryReport/download | 2/sec and 1000/hr | - | - | - |
| /extranet | 1/sec and up to 400/hr | 10/min and up to 40/hr | - | - |
| /extranet/lite | 1/sec and up to 400/hr | - | - | - |
| /extranet/{id} | 1/sec and up to 400/hr | - | 10/min and up to 40/hr | 10/min and up to 40/hr |
| /fileTypeCategories | 1/sec and up to 400/hr | - | - | - |
| /fileTypeRules | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /fileTypeRules/lite | 2/sec and 1000/hr | - | - | - |
| /fileTypeRules/{ruleId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /firewallDnsRules | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /firewallDnsRules/{ruleId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /firewallIpsRules | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /firewallIpsRules/{ruleId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /ftpSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /groups | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /groups/{groupId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /groups/lite | 2/sec and 1000/hr | - | - | - |
| /httpHeaderActionProfile | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /httpHeaderActionProfile/{id} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /httpHeaderProfile | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /httpHeaderProfile/{id} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /icapServers | 2/sec and 1000/hr | - | - | - |
| /icapServers/lite | 2/sec and 1000/hr | - | - | - |
| /icapServers/{icapServerId} | 2/sec and 1000/hr | - | - | - |
| /idmprofile | 2/sec and 1000/hr | - | - | - |
| /idmprofile/lite | 2/sec and 1000/hr | - | - | - |
| /idmprofile/{profileId} | 2/sec and 1000/hr | - | - | - |
| /incidentReceiverServers | 2/sec and 1000/hr | - | - | - |
| /incidentReceiverServers/lite | 2/sec and 1000/hr | - | - | - |
| /incidentReceiverServers/{incidentReceiverServerId} | 2/sec and 1000/hr | - | - | - |
| /integrationPartners | 2/sec and 1000/hr | - | - | - |
| /integrationPartners/crowdStrike/endpoints | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /integrationPartners/crowdStrike/whitelistedBaseUrls | 2/sec and 1000/hr | - | - | - |
| /integrationPartners/microsoftDefender/endpoints | - | 1/sec and 400/hr | - | - |
| /integrationPartners/sandbox/report/{md5} | 2/sec and 1000/hr | - | - | - |
| /intermediateCaCertificate | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /intermediateCaCertificate/{certId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/min and 4/hr |
| /intermediateCaCertificate/downloadAttestation/{certId} | 2/sec and 1000/hr | - | - | - |
| /intermediateCaCertificate/downloadCsr/{certId} | 2/sec and 1000/hr | - | - | - |
| /intermediateCaCertificate/downloadPublicKey/{certId} | 2/sec and 1000/hr | - | - | - |
| /intermediateCaCertificate/finalizeCert/{certId} | - | 1/min and 4/hr | - | - |
| /intermediateCaCertificate/generateCsr/{certId} | - | 1/min and 4/hr | - | - |
| /intermediateCaCertificate/KeyPair/{certId} | - | 1/min and 4/hr | - | - |
| /intermediateCaCertificate/lite | 2/sec and 1000/hr | - | - | - |
| /intermediateCaCertificate/lite/{certId} | 2/sec and 1000/hr | - | - | - |
| /intermediateCaCertificate/makeDefault/{certId} | - | - | 1/sec and 400/hr | - |
| /intermediateCaCertificate/readyToUse | 2/sec and 1000/hr | - | - | - |
| /intermediateCaCertificate/showCert/{certId} | 2/sec and 1000/hr | - | - |  |
| /intermediateCaCertificate/showCsr/{certId} | 2/sec and 1000/hr | - | - | - |
| /intermediateCaCertificate/uploadcert/{certId} | - | 1/min and 4/hr | - | - |
| /intermediateCaCertificate/uploadcertchain/{certId} | - | 1/min and 4/hr | - | - |
| /intermediateCaCertificate/verifyKeyAttestation/{certId} | - | 1/min and 4/hr | - | - |
| /ipsCategories | 2/sec and 1000/hr | - | - | - |
| /ipsSignatureRules | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /ipsSignatureRules/{id} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /ipsSignatureRules/export | 2/sec and 1000/hr | - | - | - |
| /ipsSignatureRules/import | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /ipsSignatureRules/validateRuleText | - | 1/sec and 400/hr | - | - |
| /firewallFilteringRules | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /firewallFilteringRules/{ruleId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /forwardingRules | 2/sec and up to 1000/hr | 1/sec and up to 400/hr | - | - |
| /forwardingRules/{ruleId} | 2/sec and up to 1000/hr | - | 1/sec and up to 400/hr | 1/sec and up to 400/hr |
| /greTunnels | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /greTunnels/{id} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /greTunnels/availableInternalIpRanges | 2/sec and 1000/hr | - | - | - |
| /groups | 2/sec and 1000/hr | - | - | - |
| /groups/{groupId} | 2/sec and 1000/hr | - | - | - |
| /iotDiscovery/deviceTypes | 2/sec and up to 1000/hr | - | - | - |
| /iotDiscovery/categories | 2/sec and up to 1000/hr | - | - | - |
| /iotDiscovery/classifications | 2/sec and up to 1000/hr | - | - | - |
| /iotDiscovery/deviceList | 1/min and up to 4/hr | - | - | - |
| /ipAddresses | 2/sec and 1000/hr | - | - | - |
| /ipDestinationGroups | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /ipDestinationGroups/{ipGroupId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /ipDestinationGroups/ipv6DestinationGroups | 2/sec and 1000/hr | - | - | - |
| /ipDestinationGroups/ipv6DestinationGroups/lite | 2/sec and 1000/hr | - | - | - |
| /ipDestinationGroups/lite | 2/sec and 1000/hr | - | - | - |
| /ipSourceGroups | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /ipSourceGroups/{ipGroupId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /ipSourceGroups/ipv6SourceGroups | 2/sec and 1000/hr | - | - | - |
| /ipSourceGroups/ipv6SourceGroups/lite | 2/sec and 1000/hr | - | - | - |
| /ipSourceGroups/lite | 2/sec and 1000/hr | - | - | - |
| /ipv6config | 2/sec and 1000/hr | - | - | - |
| /ipv6config/dns64prefix | 2/sec and 1000/hr | - | - | - |
| /ipv6config/nat64prefix | 2/sec and 1000/hr | - | - | - |
| /isolationVotiroCdr/policies | 1/sec and 400/hr | - | - | - |
| /isolationVotiroCdr/tokenConfig | 1/sec and 400/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /locations | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /locations/bulkDelete | - | 1/min and 4/hr (100 locations per call) | - | - |
| /locations/lite | 2/sec and 1000/hr | - | - | - |
| /locations/supportedCountries | 5/sec and up to 3000/hour | - | - | - |
| /locations/{locationId} | 2/sec and 1000/hr | 1/sec and 400/hr | - | 1/sec and 400/hr |
| /locations/{locationId}/sublocations | 2/sec and 1000/hr | - | - | - |
| /locations/groups | 2/sec and 1000/hr | - | - | - |
| /locations/groups/{id} | 2/sec and 1000/hr | - | - | - |
| /locations/groups/count | 2/sec and 1000/hr | - | - | - |
| /locations/groups/lite | 2/sec and 1000/hr | - | - | - |
| /locations/groups/lite/{id} | 2/sec and 1000/hr | - | - | - |
| /malwarePolicy | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /mobileAdvanceThreatSettings | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /networkApplications | 2/sec and 1000/hr | - | - | - |
| /networkApplications/{appId} | 2/sec and 1000/hr | - | - | - |
| /networkApplicationGroups | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /networkApplicationGroups/{groupId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /networkApplicationGroups/lite | 2/sec and 1000/hr | - | - | - |
| /networkServices | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /networkServices/lite | 2/sec and 1000/hr | - | - | - |
| /networkServices/{serviceId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /networkServiceGroups | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /networkServiceGroups/lite | 2/sec and 1000/hr | - | - | - |
| /networkServiceGroups/{serviceGroupId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /nssCollectors | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /nssCollectors/{id} | - | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /nssDownload/{nssId} | 2/sec and 1000/hr | - | - | - |
| /nssFeeds | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /nssFeeds/{feedId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /nssFeeds/feedOutputDefaults | 2/sec and 1000/hr | - | - | - |
| /nssFeeds/testConnectivity/{feedId} | 2/sec and 1000/hr | - | - | - |
| /nssFeeds/validateFeedFormat | - | 1/sec and 400/hr | - | - |
| /nssServers | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /nssServers/{nssId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /orgInformation | 2/sec and 1000/hr | - | - | - |
| /orgInformation/lite | 2/sec and 1000/hr | - | - | - |
| /orgProvisioning/ipGreTunnelInfo | 2/sec and 1000/hr | - | - | - |
| /pacFiles | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /pacFiles/validate | - | 1/sec and 400/hr | - | - |
| /pacFiles/{pacId} | - | - | - | 1/min and 4/hr |
| /pacFiles/{pacId}/version | 2/sec and 1000/hr | - | - | - |
| /pacFiles/{pacId}/version/{clonedPacVersion} | - | 1/sec and 400/hr | - | - |
| /pacFiles/{pacId}/version/{pacVersion} | 2/sec and 1000/hr | - | - | - |
| /pacFiles/{pacId}/version/{pacVersion}/action/{pacVersionAction} | - | - | 1/sec and 400/hr | - |
| /passwordExpiry/settings | 1/sec and 400/hr | - | 1/sec and 400/hr | - |
| /posture/assets | 25/day (Trial) or 5,000/day (License) | - | - | - |
| /posture/assets/status | - | - | 25/day (Trial) or 5,000/day (License) | - |
| /posture/controls | - | 25/day (Trial) or 5,000/day (License) | - | - |
| /posture/controls/filters | 25/day (Trial) or 5,000/day (License) | - | - | - |
| /posture/controls/status | - | - | 25/day (Trial) or 5,000/day (License) | - |
| /proxyGateways | 2/sec and up to 1000/hr | - | - | - |
| /proxyGateways/lite | 2/sec and up to 1000/hr | - | - | - |
| /quarantineTombstoneTemplate/lite | 2/sec and up to 1000/hr | - | - | - |
| /region/byGeoCoordinates | 2/sec and up to 1000/hr | - | - | - |
| /region/byIPAddress/{ip} | 2/sec and up to 1000/hr | - | - | - |
| /region/search | 2/sec and up to 1000/hr | - | - | - |
| /remoteAssistance | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /riskProfiles | 2/sec and 1000/hr | 10/min and 40/hr | - | - |
| /riskProfiles/lite | 20/sec and 1000/hr | - | - | - |
| /riskProfiles/{profileId} | 2/sec and 1000/hr | - | 10/min and 40/hr | 1/sec and 400/hr |
| /rootCertificates | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /rootCertificates/{rootCertId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /ruleLabels | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /ruleLabels/ruleType/{ruleType} | 2/sec and 1000/hr | - | - | - |
| /ruleLabels/{ruleLabelId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /sandbox/report/{md5Hash} | 2/sec, 1000/hr, 1000/day | - | - | - |
| /sandbox/report/quota | 2/sec and 1000/hr | - | - | - |
| /sandboxRules | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /sandboxRules/{ruleId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /security | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /security/advanced | 1/sec and 400/hr | - | 1/sec and 400/hr | - |
| /security/advanced/blacklistUrls | - | 1/sec and 400/hr | - | - |
| /shadowIT/applications/export | - | 1/min and up to 4/hr | - | - |
| /shadowIT/applications/{entity}/exportCsv | - | 10/min and up to 40/hr | - | - |
| /smpcInstance | 2/sec and 1000/hr | - | - | - |
| /smpcInstance/dc | - | - | 1/sec and 400/hr | - |
| /sslCertificates | 2/sec and 1000/hr | - | - | - |
| /sslCertificates/certDetail/{certId} | 2/sec and 1000/hr | - | - | - |
| /sslCertificates/{certId} | - | - | - | 1/sec and 400/hr |
| /sslCertificates/download/{certId} | 2/sec and 1000/hr | - | - | - |
| /sslInspectionRules | 2/sec and 1000/hr | 1/sec and 400/hr | - |  |
| /sslInspectionRules/{ruleId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /sslSettings/certchain | - | - | - | 1/sec and 400/hr |
| /sslSettings/downloadcsr | 2/sec and 1000/hr | - | - | - |
| /sslSettings/generatecsr | - | 1/hr (up to 8 calls per day) | - | - |
| /sslSettings/showcert | 2/sec and 1000/hr | - | - | - |
| /sslSettings/uploadcert/text | - | 1/min and 4/hr | - | - |
| /sslSettings/uploadcertchain/text | - | 1/min and 4/hr | - | - |
| /subscriptions | 2/sec and 1000/hr | - | - | - |
| /staticIP | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /staticIP/{id} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /staticIP/validate | - | 1/sec and 400/hr | - | - |
| /status | 2/sec and 1000/hr | - | - | - |
| /status/activate | - | 10/min and 40/hr | - | - |
| /subclouds | 1/sec and 400/hr | - | - | - |
| /subclouds/isLastDcInCountry/{id} | 1/sec and 400/hr | - | - | - |
| /subclouds/{id} | - | - | 1/sec and 400/hr | - |
| /tenancyRestrictionProfile | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /tenancyRestrictionProfile/app-item-count/{appType}/{itemType} | 2/sec and 1000/hr | - | - | - |
| /tenancyRestrictionProfile/{profileId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /timeIntervals | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /timeIntervals/{Id} | 1/sec and 400/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /timeWindows | 2/sec and 1000/hr | - | - | - |
| /timeWindows/lite | 2/sec and 1000/hr | - | - | - |
| /trafficCaptureRules | 2/sec and up to 1000/hr | 1/sec and up to 400/hr | - | - |
| /trafficCaptureRules/count | 2/sec and up to 1000/hr | - | - | - |
| /trafficCaptureRules/order | 2/sec and up to 1000/hr | - | - | - |
| /trafficCaptureRules/ruleLabels | 2/sec and up to 1000/hr | - | - | - |
| /trafficCaptureRules/{ruleId} | 2/sec and up to 1000/hr | - | 1/sec and up to 400/hr | 1/sec and up to 400/hr |
| /urlCategories | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /urlCategories/lite | 2/sec and 1000/hr | - | - | - |
| /urlCategories/{categoryId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /urlCategories/review/domains | - | 10/min and 40/hr | 10/min and 40/hr | - |
| /urlCategories/urlQuota | 2/sec and 1000/hr | - | - | - |
| /urlFilteringRules | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /urlFilteringRules/count | 2/sec and up to 1000/hr | - | - | - |
| /urlFilteringRules/{ruleId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /urlLookup | - | 1/sec and 400/hr (100 URLs per call) | - | - |
| /users | 10/min and up to 40/hr | 2/sec and 1000/hr | - | - |
| /users/{userId} | 2/sec and 1000/hr | - | 2/sec and 1000/hr | 1/sec and 400/hr |
| /users/auditors | 2/sec and 1000/hr | - | - | - |
| /users/bulkDelete | - | 1/min and 4/hr (500 users per call) | - | - |
| /users/references | 2/sec and up to 1000/hr | - | - | - |
| /vips | 2/sec and 1000/hr | - | - | - |
| /vips/groupByDatacenter | 2/sec and 1000/hr | - | - | - |
| /vips/recommendedList | 2/sec and 1000/hr | - | - | - |
| /virtualZenClusters | 1/sec and 400/hr | 1/sec and 400/hr | - | - |
| /virtualZenClusters/{virtualZenClusterId} | 1/sec and 400/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /virtualZenNodes | 1/sec and 400/hr | 1/sec and 400/hr |  |  |
| /virtualZenNodes/{virtualZenNodeId} | 1/sec and 400/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /vpnCredentials | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /vpnCredentials/{vpnId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /vpnCredentials/bulkDelete | - | 1/min and 4/hr (100 VPN credentials per call) | - | - |
| /webApplicationRules/ruleTypeMapping | 1/sec and 400/hr | - | - | - |
| /webApplicationRules/{rule_type} | 1/sec and 400/hr | 10/min and 40/hr | - | - |
| /webApplicationRules/{rule_type}/availableActions | - | 10/min and 40/hr | - | - |
| /webApplicationRules/{rule_type}/duplicate/{ruleId} | - | 10/min and 40/hr | - | - |
| /webApplicationRules/{rule_type}/{ruleId} | 1/sec and 400/hr | - | 10/min and 40/hr | 10/min and 40/hr |
| /webDlpGlobalOptions | 2/sec and 1000/hr | - | 1/sec and 400/hr | - |
| /webDlpRules | 2/sec and 1000/hr | 1/sec and 400/hr | - | - |
| /webDlpRules/{ruleId} | 2/sec and 1000/hr | - | 1/sec and 400/hr | 1/sec and 400/hr |
| /webDlpRules/lite | 2/sec and 1000/hr | - | - | - |
| /workloadGroups | 2/sec and up to 1000/hr | 1/sec and 400/hr | - | 10/min and 40/hr |
| /workloadGroups/{workloadGroupId} | 2/sec and up to 1000/hr | - | 1/sec and 400/hr | 10/min and 40/hr |
| /zpaGateways | 2/sec and up to 1000/hr | 1/sec and up to 400/hr | - | - |
| /zpaGateways/{gatewayId} | 2/sec and up to 1000/hr | - | 1/sec and up to 400/hr | 1/sec and up to 400/hr |
| /zscsb/submit | - | 1/sec and 400/hr | - | - |
